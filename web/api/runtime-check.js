import {Sandbox} from '@vercel/sandbox';
import {createHmac} from 'node:crypto';
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');if(req.method!=='POST')return res.status(405).json({error:'POST only'});
 const key=process.env.GRADER_SIGNING_KEY;
 if(!key||String(req.headers['x-release-proof']||'')!==createHmac('sha256',Buffer.from(key,'hex')).update('research-lab-fixed-smoke-v1').digest('hex'))return res.status(401).json({error:'Unauthorized'});
 let vm;
 try{
  vm=await Sandbox.create({source:{type:'snapshot',snapshotId:process.env.SANDBOX_SNAPSHOT_ID},timeout:60000,persistent:false,resources:{vcpus:1},networkPolicy:'deny-all'});
  const code='def solve(d): return sum(d["values"])';
  await vm.writeFiles([{path:'/vercel/sandbox/request.json',content:Buffer.from(JSON.stringify({language:'python',task_id:'bfs',code,inputs:[{values:[2,3]},{values:[-4,9]}]}))}]);
  const r=await vm.runCommand({cmd:'python3',args:['/opt/rl-supervisor.py'],sudo:true});const raw=JSON.parse((await r.stdout()).trim());
  const ok=raw.exit_code===0&&raw.stdout.trim()==='5\n5';
  return res.status(ok?200:500).json({pass:ok,runner:'ephemeral-network-denied-microVM',result:raw});
 }catch(e){return res.status(503).json({error:e.message});}finally{if(vm)try{await vm.stop();}catch{}}
}
