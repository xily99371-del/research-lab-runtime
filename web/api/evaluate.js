import {Sandbox} from '@vercel/sandbox';
import {createHmac} from 'node:crypto';
import {authenticate,rpc} from '../lib/auth.js';
import {ALGORITHMS,ROS,suite,publicSuite,matches} from '../lib/tasks.js';
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');if(req.method!=='POST')return res.status(405).json({error:'POST only'});
 let vm,job,token;let report,mode='submit';
 try{
  ({token}=await authenticate(req));
  const body=typeof req.body==='string'?JSON.parse(req.body):req.body||{};
  const {task_id,language,code}=body;mode=body.mode||'submit';
  if(!['sample','submit'].includes(mode))return res.status(400).json({error:'未知运行模式'});
  if(typeof code!=='string'||Buffer.byteLength(code)>64000||!code.trim())return res.status(400).json({error:'代码必须为 1—64000 字节'});
  const ros=ROS.includes(task_id);
  if(!(ros?language==='ros2_python':ALGORITHMS.includes(task_id)&&['python','cpp'].includes(language)))return res.status(400).json({error:'题目和语言不匹配'});
  if(mode==='sample'&&ros)return res.status(400).json({error:'ROS 2 题目需要启动完整通信环境，请使用完整评测。'});
  if(!process.env.SANDBOX_SNAPSHOT_ID||(mode==='submit'&&!process.env.GRADER_SIGNING_KEY))return res.status(503).json({error:'运行器配置未完成'});
  const tests=ros?[]:(mode==='sample'?publicSuite(task_id):suite(task_id));
  if(!tests.length)return res.status(400).json({error:'该题暂时没有可运行的公开样例'});
  if(mode==='submit')job=await rpc(token,'rl_claim_job',{p_task:task_id,p_language:language,p_source:code});
  vm=await Sandbox.create({source:{type:'snapshot',snapshotId:process.env.SANDBOX_SNAPSHOT_ID},resources:{vcpus:1},timeout:90000,persistent:false,networkPolicy:'deny-all'});
  await vm.writeFiles([{path:'/vercel/sandbox/request.json',content:Buffer.from(JSON.stringify({language,task_id,code,inputs:tests.map(t=>t.input)}))}]);
  const command=await vm.runCommand({cmd:'python3',args:['/opt/rl-supervisor.py'],sudo:true});
  const stdout=await command.stdout();
  if(command.exitCode!==0)throw new Error('执行环境异常：'+(await command.stderr()).slice(-600));
  const raw=JSON.parse(stdout.trim());
  if(raw.error)throw new Error(raw.error);
  const base={task_id,language,elapsed_ms:raw.elapsed_ms,stderr:String(raw.stderr||'').slice(-6000),stage:raw.stage,grading:'仅自动行为测试；不把耗时等同于复杂度证明'};
  if(raw.timed_out)report={...base,status:'timeout',pass:false,score:0,error:'超过执行时间限制'};
  else if(raw.exit_code!==0)report={...base,status:'failed',pass:false,score:0,exit_code:raw.exit_code,error:raw.stage==='compile'?'编译失败':'运行失败'};
  else if(ros){const v=raw.verified;report={...base,status:v.pass?'passed':'failed',pass:!!v.pass,score:Math.round(100*v.passed/Math.max(1,v.total)),passed:v.passed,total:v.total,cases:v.cases};}
  else{
   const lines=String(raw.stdout||'').trim().split(/\r?\n/);const cases=tests.map((t,i)=>{let answer,ok=false;try{answer=JSON.parse(lines[i]);ok=matches(task_id,t.input,answer,t.expected);}catch{}return {name:t.public?'公开样例 '+(i+1):'隐藏测试 '+(i+1),pass:ok,...(t.public?{input:t.input,expected:t.expected,actual:answer??null}:{})};});
   const passed=cases.filter(c=>c.pass).length;const pass=passed===cases.length&&lines.length===cases.length;
   report={...base,status:pass?'passed':'failed',pass,score:Math.round(passed*100/cases.length),passed,total:cases.length,cases,...(lines.length!==cases.length?{warning:'标准输出行数不匹配：请勿把调试信息打印到 stdout；Python 使用 stderr。'}:{})};
  }
  if(mode==='sample')return res.status(200).json({mode:'sample',...report});
 }catch(e){if(!job)return res.status(e.status||500).json({error:e.message});report={status:'error',pass:false,score:0,stage:'infrastructure',error:String(e.message).slice(0,1000)};}
 finally{if(vm)try{await vm.stop();}catch{}}
 try{
  const payload=JSON.stringify(report);const signature=createHmac('sha256',Buffer.from(process.env.GRADER_SIGNING_KEY,'hex')).update(job+':'+payload).digest('hex');
  const saved=await rpc(token,'rl_finish_job',{p_id:job,p_payload:payload,p_signature:signature});
  return res.status(200).json({id:job,...report,persisted:saved});
 }catch(e){return res.status(502).json({id:job,...report,persisted:false,saveError:e.message});}
}
