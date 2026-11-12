import {createClient} from '@supabase/supabase-js';
import {emptyState,normalize,merge3} from './state.js';
import {PROBLEMS,starter} from './problems.js';
import {EXPANDED_PROBLEMS} from './expanded-problems.js';
import {HOT_PROBLEMS} from './hot100-problems.js';
import {TASK_PROGRESSIONS,TASK_META} from './task-progressions.js';
PROBLEMS.push(...EXPANDED_PROBLEMS,...HOT_PROBLEMS);
import {LESSONS} from './lessons.js';
import {ADVANCED_LESSONS} from './advanced-lessons.js';
import {REMAINING_LESSONS} from './remaining-lessons.js';
import {ROS_MIDDLEWARE_LESSON} from './ros-middleware-lesson.js';
import {LEGACY_LESSON_FORMULAS} from './lesson-formulas.js';
import {enrichCourses,GUIDES,EXACT_LINKS} from './guided/catalog.js';
import {renderJourneyHome,renderLearningCourses,renderLearningPractice,focusCourse,humanizeReport} from './guided/learning-ui.js';
import {richText} from './guided/math.js';
import {taskReadiness,TASK_PATHS} from './guided/assessment-path.js';
import {COMPLEXITY_GUIDES} from './task-complexity.js';
import {stageUnlockReason} from './guided/model.js';
import {diagnoseReport} from './guided/feedback.js';
import 'katex/dist/katex.min.css';
Object.assign(LESSONS,ADVANCED_LESSONS,REMAINING_LESSONS,ROS_MIDDLEWARE_LESSON);
for(const [id,l]of Object.entries(LESSONS))l.formula ||= LEGACY_LESSON_FORMULAS[id];
const $=id=>document.getElementById(id);
const pages={dashboard:'学习驾驶舱',courses:'课程与讲解',code:'任务中心 / 在线评测',research:'研究与实验',papers:'论文笔记',weeks:'周计划',mentors:'导师联系',account:'账户与数据'};
const el=(tag,text='',cls='')=>{const n=document.createElement(tag);if(text!==null)n.textContent=text;if(cls)n.className=cls;return n;};
const box=(cls,...children)=>{const n=el('div',null,cls);n.append(...children.filter(Boolean));return n;};
const btn=(text,fn,cls='')=>{const b=el('button',text,cls);b.type='button';b.onclick=()=>Promise.resolve().then(fn).catch(e=>notify(e.message));return b;};
const field=(label,value='',type='text',id='')=>{const l=el('label',label,'learn-field'),x=el(type==='textarea'?'textarea':'input');if(type!=='textarea')x.type=type;x.id=id;x.value=value;l.append(x);return {l,x};};
const note=(text,kind='')=>el('div',text,'notice '+kind);
const hero=(h,p)=>box('hero',el('small','PERSONAL RESEARCH WORKSPACE'),el('h2',h),el('p',p));
let sb=null,config=null,user=null,session=null,courses=[],data=emptyState(),base=emptyState(),version=0,dirty=false,inFlight=false,pendingConflict=null,jobs=[];
let epoch=0,revision=0,timer=null,toastTimer=null,page='dashboard',selectedTask='attention',taskTrack='全部',taskLevel='全部',taskPath='全部',taskLang='全部',taskQuery='',language='python',taskMode='code',running=false;
const reports=new Map(),sampleReports=new Map(),sampleCache=new Map(),sampleLoading=new Map();
// Keep the old cache namespace so guest drafts and logged-in offline edits survive.
const cacheKey=()=> 'research-lab-v34:'+(user?.id||'guest');
function cache(){try{localStorage.setItem(cacheKey(),JSON.stringify({data,base,version,dirty}));}catch{setBanner('本机保存失败；请导出备份。不要清空浏览器数据。','warn');}}
function loadCache(){data=emptyState();base=emptyState();version=0;dirty=false;try{const c=JSON.parse(localStorage.getItem(cacheKey())||'null');if(c){data=normalize(c.data);base=normalize(c.base);version=Number(c.version)||0;dirty=!!c.dirty;}}catch{setBanner('本机缓存无法解析，未主动清除旧数据。请先保留备份。','warn');}}
function setBanner(text,kind=''){const n=$('banner');n.textContent=text;n.className='notice '+kind;}
function notify(text){$('toast').textContent=text;$('toast').classList.add('on');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('on'),3200);}
function changed(){dirty=true;revision++;cache();clearTimeout(timer);if(user&&!pendingConflict)timer=setTimeout(()=>sync().catch(e=>setBanner('同步失败，改动仍保存在本机：'+e.message,'bad')),900);else if(!user)setBanner('访客模式：记录保存在这台设备；同一邮箱登录后可使用云端同步。','warn');}
async function remote(){const {data:r,error}=await sb.from('user_workspace').select('payload,version').eq('user_id',user.id).maybeSingle();if(error)throw error;return {payload:normalize(r?.payload),version:r?.version||0};}
function conflict(r){pendingConflict=r;cache();setBanner('其他设备修改了相同字段，已暂停覆盖。请到“账户与数据”查看冲突并先导出备份。','warn');}
async function loadCloud(){const e=epoch,r=await remote();if(e!==epoch)return;if(dirty){const m=merge3(base,data,r.payload);if(m.conflicts.length){conflict(r);return;}data=normalize(m.value);base=r.payload;version=r.version;cache();await sync();}else{data=r.payload;base=structuredClone(data);version=r.version;cache();setBanner('已从云端加载学习档案；旧笔记与新阶段记录同时保留。');}}
async function sync(){
 if(!user||!sb){cache();return;}if(inFlight||pendingConflict)return;
 inFlight=true;const e=epoch;let retry=false;
 try{
  if(!dirty){const rev=revision,r=await remote();if(e!==epoch||rev!==revision||dirty)return;if(r.version!==version){data=r.payload;base=structuredClone(data);version=r.version;cache();if(!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))render();}setBanner('云端已同步 · '+new Date().toLocaleTimeString('zh-CN'));return;}
  for(let i=0;i<3;i++){
   const sent=structuredClone(data),rev=revision;
   const {data:r,error}=await sb.rpc('rl_save_workspace',{p_payload:sent,p_expected:version});if(error)throw error;if(e!==epoch)return;
   if(r.ok){base=sent;version=r.version;dirty=revision!==rev;retry=dirty;cache();setBanner(dirty?'正在保存后续改动…':'云端保存成功 · '+new Date().toLocaleTimeString('zh-CN'),'ok');return;}
   const m=merge3(base,data,normalize(r.payload));if(m.conflicts.length){conflict({payload:normalize(r.payload),version:r.version});return;}
   data=normalize(m.value);base=normalize(r.payload);version=r.version;cache();retry=true;
  }
 }finally{if(e===epoch){inFlight=false;if(retry&&dirty&&user&&!pendingConflict)timer=setTimeout(()=>sync().catch(e=>setBanner('同步失败：'+e.message,'bad')),1600);}}
}
async function history(){if(!user)return;const e=epoch;const {data:r,error}=await sb.from('rl_jobs').select('id,task_id,language,status,report,created_at,source_code').order('created_at',{ascending:false}).limit(80);if(error)throw error;if(e===epoch)jobs=r||[];}
async function activate(s,recovery=false){
 const next=s?.user||null;session=s||null;
 if(user&&next&&user.id===next.id&&!recovery)return;
 if(!user&&!next&&courses.length&&document.querySelector('#page .learn-hero'))return;
 epoch++;clearTimeout(timer);inFlight=false;pendingConflict=null;user=next;jobs=[];reports.clear();loadCache();
 $('identity').textContent=user?.email||'访客 · 本机保存';$('auth-open').hidden=!!user;$('logout').hidden=!user;
 if(user){$('auth-dialog').close();try{await loadCloud();await history();}catch(e){setBanner('已登录，但云端档案读取失败：'+e.message,'bad');}}
 else setBanner('访客可学习、核对例题和保存本机草稿；在线评测需要邮箱登录。');
 render();if(recovery)$('recovery-dialog').showModal();
}
async function auth(action){
 const buttons=[...$('auth-form').querySelectorAll('button')];
 try{
  if(!sb)throw Error('认证配置尚未就绪');const email=$('email').value.trim(),password=$('password').value;
  if(!email.includes('@'))throw Error('请填写有效邮箱');if(action!=='reset'&&password.length<8)throw Error('密码至少8位');
  buttons.forEach(b=>b.disabled=true);$('auth-message').textContent='正在连接认证服务…';
  let r;if(action==='login')r=await sb.auth.signInWithPassword({email,password});else if(action==='signup')r=await sb.auth.signUp({email,password,options:{emailRedirectTo:location.origin}});else r=await sb.auth.resetPasswordForEmail(email,{redirectTo:location.origin});
  if(r.error)throw r.error;$('auth-message').textContent=action==='reset'?'已提交重置请求，请检查邮箱。':r.data?.session?'登录成功。':'已提交注册请求，请完成邮箱验证。';
 }catch(e){$('auth-message').textContent=e.message;}finally{buttons.forEach(b=>b.disabled=false);}
}
$('auth-open').onclick=()=>$('auth-dialog').showModal();$('auth-close').onclick=()=>$('auth-dialog').close();$('auth-form').onsubmit=e=>{e.preventDefault();void auth('login');};$('register').onclick=()=>auth('signup');$('reset').onclick=()=>auth('reset');
$('logout').onclick=async()=>{try{if(running)return notify('当前正在评测，待本次结果返回后再退出。');if(dirty){await sync();if(dirty&&!confirm('仍有未同步改动；确定退出？旧记录会保留在本机账户缓存中。'))return;}const {error}=await sb.auth.signOut();if(error)throw error;await activate(null);}catch(e){notify(e.message);}};
$('change-password').onclick=async()=>{try{const p=$('new-password').value;if(p.length<8)throw Error('密码至少8位');const {error}=await sb.auth.updateUser({password:p});if(error)throw error;$('recovery-message').textContent='密码已更新';$('recovery-dialog').close();}catch(e){$('recovery-message').textContent=e.message;}};$('recovery-close').onclick=()=>$('recovery-dialog').close();
window.addEventListener('online',()=>{if(user)sync().catch(e=>setBanner(e.message,'bad'));});window.addEventListener('focus',()=>{if(user&&!running&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))sync().catch(()=>{});});window.addEventListener('pagehide',cache);
function context(){return {courses,lessons:LESSONS,data,jobs,problems:PROBLEMS,changed,refresh:render,notify,navigate,openTask};}
function render(){const root=$('page');root.replaceChildren();$('title').textContent=pages[page]||pages.dashboard;document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('active',b.dataset.page===page));if(page==='dashboard')renderJourneyHome(root,context());else if(page==='courses')renderLearningCourses(root,context());else if(page==='code')renderCode(root);else if(page==='account')renderAccount(root);else renderRecords(root,page);}
function navigate(p){page=pages[p]?p:'dashboard';location.hash=page;render();}
for(const b of document.querySelectorAll('nav button'))b.onclick=()=>navigate(b.dataset.page);
window.addEventListener('hashchange',()=>{const p=location.hash.slice(1);if(pages[p]&&p!==page){page=p;render();}});
function openCourse(id){focusCourse(id);navigate('courses');}
function openCourseStage(id,stage){
 focusCourse(id);
 const reason=stageUnlockReason(data.progress,id,stage);if(reason){notify(reason);stage=stage<=2?1:stage===3?2:3;}
 const old=data.progress[id]||{},learning={...(old.learning||{}),stage,startedAt:(old.learning||{}).startedAt||new Date().toISOString()};
 data.progress[id]={...old,learning};changed();navigate('courses');
}
function openTask(id){selectedTask=id;taskMode='code';taskTrack='全部';taskLevel='全部';taskQuery='';taskLang='全部';navigate('code');}
function rerenderWithFocus(id){const a=$(id),start=a?.selectionStart,end=a?.selectionEnd;render();const b=$(id);if(b){b.focus();if(start!=null)try{b.setSelectionRange(start,end);}catch{}}}
function reportView(report){const human=humanizeReport(report),wrap=box('learn-report');wrap.setAttribute('role','status');wrap.append(el('h3',report.mode==='sample'?'公开样例运行结果':human.title),note(human.message+(report.persisted===false?' 成绩尚未成功入库；请保存本次原始报告。':''),report.pass?'ok':'warn'),el('p',report.mode==='sample'?'本次只运行公开样例，不计入正式提交记录，也不会消耗隐藏测试。':human.help,'muted'));
 if(report.passed!==undefined)wrap.append(el('p','通过 '+report.passed+'/'+report.total+' 个测试；评分 '+report.score+'。','muted'));
 if(report.warning)wrap.append(note(report.warning,'warn'));const diagnosis=diagnoseReport(report);if(diagnosis)wrap.append(box('assessment-path-card',el('strong',diagnosis.title),el('p',diagnosis.detail,'muted'),el('p','建议：先用该输入手算关键中间量，再检查对应循环、维度或边界。','muted')));
 if(report.stderr)wrap.append(el('pre',report.stderr,'code-output'));
 for(const c of report.cases||[]){const d=el('details',null,'learn-details');d.append(el('summary',(c.pass?'✓ ':'× ')+(c.name||c.test||'测试')));if(c.input!==undefined)d.append(el('pre',JSON.stringify({input:c.input,expected:c.expected,actual:c.actual},null,2),'code-output'));else d.append(el('p','隐藏测试只展示结果，不泄露完整输入与答案。','muted'));wrap.append(d);}
 const raw=el('details',null,'learn-details');raw.append(el('summary','查看原始评测报告'),el('pre',JSON.stringify(report,null,2),'code-output'));wrap.append(raw);return wrap;}
function renderSampleList(panel,samples){
 panel.replaceChildren(el('h3','公开样例：输入与预期输出'));
 if(!samples?.length){panel.append(note('该题没有独立函数样例。ROS 2 题目会在完整评测中启动节点并进行真实通信验证。','neutral'));return;}
 for(const [i,s] of samples.entries()){
  const card=box('sample-case',el('strong',s.name||('公开样例 '+(i+1))));
  card.append(box('sample-io',el('small','Sample Input'),el('pre',JSON.stringify(s.input,null,2),'code-output')),
   box('sample-io',el('small','Expected Output'),el('pre',JSON.stringify(s.expected,null,2),'code-output')));
  panel.append(card);
 }
}
function loadPublicSamples(taskId,panel){
 panel.append(el('h3','公开样例：输入与预期输出'),el('p','正在加载样例…','muted'));
 if(sampleCache.has(taskId)){renderSampleList(panel,sampleCache.get(taskId));return;}
 let pending=sampleLoading.get(taskId);
 if(!pending){pending=fetch('/api/samples?task_id='+encodeURIComponent(taskId),{cache:'force-cache'}).then(async r=>{const body=await r.json();if(!r.ok)throw Error(body.error||'样例加载失败');return body.samples||[];}).then(samples=>{sampleCache.set(taskId,samples);return samples;}).finally(()=>sampleLoading.delete(taskId));sampleLoading.set(taskId,pending);}
 pending.then(samples=>{if(panel.isConnected)renderSampleList(panel,samples);}).catch(err=>{if(panel.isConnected)panel.replaceChildren(el('h3','公开样例'),note(err.message,'warn'));});
}
function renderCode(root){
 root.append(hero('任务中心：按知识路径逐级训练。','从高频基础题到真实AI、视觉与机器人模块；每道题都有明确应用背景、分级目标和自动测试。'));
 root.append(note('按递进路径完成自动评测；数学推导、开放实践和面试训练均从对应课程进入，避免重复维护两套课程目录。'));if(taskMode==='project')taskMode='code';
 if(taskMode==='project'){renderLearningPractice(root,context());return;}
 const filter=(values,current,label,callback)=>{const s=el('select');s.setAttribute('aria-label',label);for(const value of values){const o=el('option',value);s.append(o);}s.value=current;s.onchange=()=>{callback(s.value);render();};return s;};
 const search=el('input');search.id='code-search';search.placeholder='搜索题目、输入输出或概念';search.value=taskQuery;const searchUpdate=e=>{if(e.isComposing)return;taskQuery=search.value;rerenderWithFocus('code-search');};search.oninput=searchUpdate;search.oncompositionend=searchUpdate;
 root.append(box('learn-toolbar',filter(['全部',...new Set(PROBLEMS.map(p=>p.track))],taskTrack,'评测方向',v=>taskTrack=v),filter(['全部',...TASK_PROGRESSIONS.map(x=>x.title)],taskPath,'递进训练路径',v=>taskPath=v),filter(['全部','入门','基础','进阶','综合挑战','研究级'],taskLevel,'原始难度标签',v=>taskLevel=v),filter(['全部','Python','C++17','ROS 2 Python'],taskLang,'评测语言',v=>taskLang=v),search));
 const langKey={'Python':'python','C++17':'cpp','ROS 2 Python':'ros2_python'};
 const ps=PROBLEMS.filter(p=>(taskTrack==='全部'||p.track===taskTrack)&&(taskLevel==='全部'||p.level===taskLevel)&&(taskPath==='全部'||TASK_META[p.id]?.pathTitle===taskPath)&&(taskLang==='全部'||p.langs.includes(langKey[taskLang]))&&(p.title+' '+p.desc+' '+p.concept+' '+(TASK_META[p.id]?.application||'')).toLowerCase().includes(taskQuery.toLowerCase())).sort((a,b)=>{if(taskPath==='全部')return 0;return (TASK_META[a.id]?.stage||99)-(TASK_META[b.id]?.stage||99);});
 if(!ps.some(p=>p.id===selectedTask))selectedTask=ps[0]?.id;
 const list=box('card task-list'),detail=box('card task-detail');
 for(const p of ps){const passed=jobs.some(j=>j.task_id===p.id&&j.status==='passed');const b=btn('',()=>{selectedTask=p.id;render();},'task-item '+(p.id===selectedTask?'active':''));b.dataset.task=p.id;const readiness=taskReadiness(p.id,data.progress);const meta=TASK_META[p.id];b.append(el('b',(passed?'✓ ':'')+p.title),el('small',p.track+' · '+p.level+' · '+(meta?'第 '+meta.stage+'/'+meta.stages+' 关':'未编排')+' · '+p.langs.join(' / ')),el('small',readiness.ready?'建议准备已完成':readiness.label+' · '+readiness.checksDone+'/'+readiness.checksTotal+'项'));list.append(b);}
 const p=PROBLEMS.find(p=>p.id===selectedTask);if(!p){detail.append(el('p','没有匹配的评测题。这个方向也可能有课程实践任务。'),btn('转到课程实践',()=>{taskMode='project';render();}));root.append(box('task-grid',list,detail));return;}
 if(!p.langs.includes(language))language=p.langs[0];if(taskLang!=='全部'&&p.langs.includes(langKey[taskLang]))language=langKey[taskLang];
 const meta=TASK_META[p.id],path=meta&&TASK_PROGRESSIONS.find(x=>x.id===meta.pathId),previousId=meta&&meta.stage>1?path.tasks[meta.stage-2]:null,previousPassed=!previousId||jobs.some(j=>j.task_id===previousId&&j.status==='passed'),previousAnalysis=!previousId||!!data.progress.__taskAnalysis__?.[previousId]?.submittedAt,locked=!!(previousId&&(!previousPassed||!previousAnalysis));detail.append(el('span',p.track+' · '+p.level+(meta?' · 第 '+meta.stage+'/'+meta.stages+' 关':''),'pill blue'),el('h2',p.title),richText(p.desc));if(meta&&path){const stage=box('assessment-readiness');stage.append(el('h3','递进路径：'+path.title),el('p','第 '+meta.stage+' 关，共 '+meta.stages+' 关。'+path.audience+'。','muted'),el('p','实际应用：'+meta.application,'muted'));if(locked){const prev=PROBLEMS.find(x=>x.id===previousId);stage.append(note('本关尚未解锁：先通过上一关「'+(prev?.title||previousId)+'」，并提交上一关的复杂度分析。你仍可阅读题目和运行公开样例。','warn'),btn('回到上一关',()=>{selectedTask=previousId;render();}));}const nav=box('actions');if(meta.stage>1){const prev=path.tasks[meta.stage-2],prevTask=PROBLEMS.find(x=>x.id===prev);nav.append(btn('上一关：'+(prevTask?.title||prev),()=>{selectedTask=prev;render();}));}if(meta.stage<meta.stages){const next=path.tasks[meta.stage],nextTask=PROBLEMS.find(x=>x.id===next);nav.append(btn('下一关：'+(nextTask?.title||next),()=>{selectedTask=next;render();},'primary'));}stage.append(nav);detail.append(stage);}detail.append(el('h3','为什么这样做'),richText(p.concept));const samplePanel=box('sample-panel');detail.append(samplePanel);loadPublicSamples(p.id,samplePanel);
 const readiness=taskReadiness(p.id,data.progress),pathPanel=box('assessment-readiness');
 pathPanel.append(el('h3','开始自动评测前：你的课程准备度'));
 pathPanel.append(el('p',readiness.why+'。建议达到：关联课程的例题核对正确，并完成带提示练习、提交实际输出与解释。','muted'));
 pathPanel.append(box('assessment-path-head',el('strong',readiness.ready?'已达到建议准备程度':'建议先完成课程准备'),el('span',readiness.checksDone+'/'+readiness.checksTotal+' 项准备证据','assessment-state '+(readiness.ready?'ready':''))));
 for(const item of readiness.items){
  const course=courses.find(c=>c.id===item.id),row=box('assessment-path-row');
  row.append(el('strong',course?.title||item.id),el('span',(item.theory?'✓ 例题已核对':'○ 例题待核对')+'　'+(item.practice?'✓ 带提示练习已提交':'○ 带提示练习待提交'),'assessment-checks'));
  if(!item.complete)row.append(btn(item.theory?'去完成带提示练习':'去核对课程例题',()=>openCourseStage(item.id,item.next)));
  pathPanel.append(row);
 }
 if(readiness.ready)pathPanel.append(note('建议准备已完成，可以开始自动评测。测试失败时，根据错误类型回到对应课程，不必从头重学。','ok'));
 else pathPanel.append(note('这是一条学习建议，不是强制门槛。你可以提前挑战；若暂时做不出来，先补上方标出的课程步骤。','warn'));
 pathPanel.append(box('actions',btn(readiness.ready?'准备好了，开始评测':'我想提前挑战这道题',()=>{$('code-editor')?.scrollIntoView({block:'center',behavior:'smooth'});$('code-editor')?.focus();},'primary')));
 detail.append(pathPanel);
 const related=(TASK_PATHS[p.id]?.courses||[]).map(id=>courses.find(c=>c.id===id)).filter(Boolean);for(const c of related)detail.append(btn('回到分步课程：'+c.title,()=>openCourse(c.id)));
 const lang=el('select');lang.id='code-language';lang.setAttribute('aria-label','提交代码语言');for(const l of p.langs){const o=el('option',l==='cpp'?'C++17':l==='ros2_python'?'ROS 2 Python':'Python 3');o.value=l;lang.append(o);}lang.value=language;lang.onchange=()=>{language=lang.value;render();};lang.disabled=running;
 const editor=el('textarea');editor.id='code-editor';editor.className='field editor';editor.spellcheck=false;editor.setAttribute('aria-label','代码编辑器');const draft=data.drafts[p.id+'-'+language];editor.value=typeof draft==='string'?draft:starter(language);editor.oninput=()=>{data.drafts[p.id+'-'+language]=editor.value;changed();};editor.onkeydown=e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();runSampleCode();}};
 const runSample=btn(running?'正在运行…':'运行公开样例',runSampleCode,'secondary');runSample.disabled=running||language==='ros2_python';const submit=btn(locked?'等待前置关卡':running?'正在评测…':'提交完整测试集',submitCode,'primary');submit.disabled=running||locked;
 detail.append(el('h3','语言与代码'),lang,editor,box('actions',runSample,submit,btn('保存草稿',()=>{data.drafts[p.id+'-'+language]=editor.value;changed();notify('草稿已保存');}),btn('恢复模板',()=>{if(editor.value.trim()&&!confirm('恢复将替换当前代码草稿，是否继续？'))return;editor.value=starter(language);data.drafts[p.id+'-'+language]=editor.value;changed();})));
 detail.append(note(locked?'当前关卡尚未解锁；可以先运行公开样例熟悉输入输出。':'先运行公开样例，检查输入、预期输出与实际输出；确认后再提交完整测试集。调试信息请输出到stderr。'));
  const cg=COMPLEXITY_GUIDES[p.id],savedAnalysis=data.progress.__taskAnalysis__?.[p.id]?.text||'',analysis=field('我的时间复杂度、空间复杂度与推导',savedAnalysis);analysis.x.rows=3;const analysisBox=el('details',null,'learn-details');analysisBox.append(el('summary','复杂度分析（完成本关后解锁下一关）'),analysis.l,el('p',cg?'参考目标：时间 '+cg.time+'；空间 '+cg.space+'。'+cg.why:'说明主循环/递归次数、核心数据结构，以及输入规模增长时的额外内存。','muted'),btn('保存复杂度分析',()=>{const value=analysis.x.value.trim();if(!value||!value.includes('O(')||!/(时间|time|空间|space)/i.test(value)){notify('请同时写出时间与空间复杂度，并给出 O(...) 表达式。');return;}data.progress.__taskAnalysis__||={};data.progress.__taskAnalysis__[p.id]={text:value,submittedAt:new Date().toISOString()};changed();notify('复杂度分析已保存；通过本题行为测试后可解锁下一关。');render();},'secondary'));
  detail.append(analysisBox);
  const sampleOut=box('learn-code-result');sampleOut.id='sample-result';const sampleReport=sampleReports.get(p.id+'-'+language);if(sampleReport)sampleOut.append(reportView(sampleReport));else sampleOut.append(el('p','尚未运行公开样例。','muted'));detail.append(sampleOut);
  const out=box('learn-code-result');out.id='code-result';const report=reports.get(p.id+'-'+language);if(report)out.append(reportView(report));else out.append(el('p','尚未提交完整测试集。','muted'));detail.append(out);
  const recent=jobs.filter(j=>j.task_id===p.id).slice(0,5);detail.append(el('h3','服务端提交记录'));for(const j of recent)detail.append(box('record',el('strong',j.status+' · '+j.language),el('p',new Date(j.created_at).toLocaleString('zh-CN')+' · '+(j.report?.score??0)+'分'),btn('查看本次报告',()=>{reports.set(p.id+'-'+language,j.report||{});render();})));
 root.append(box('task-grid',list,detail));
}
async function executeCode(mode='submit'){
 if(!user||!session?.access_token){notify('在线代码运行需要邮箱登录；课程讲解和本机练习可以先使用。');$('auth-dialog').showModal();return;}
 if(running)return;const p=PROBLEMS.find(x=>x.id===selectedTask),editor=$('code-editor');if(!p||!editor)return;
 if(mode==='sample'&&language==='ros2_python')return notify('ROS 2 题目请使用完整集成评测。');
 const code=editor.value,lang=language,key=p.id+'-'+lang,e=epoch,target=mode==='sample'?sampleReports:reports;
 if(mode==='submit'&&locked)return notify('本关尚未解锁，请先通过上一关并提交其复杂度分析。');if(!code.trim())return notify('请先填写代码');data.drafts[key]=code;changed();running=true;
 target.set(key,{stage:'running',mode,error:mode==='sample'?'正在运行公开样例…':'正在创建隔离环境并运行完整测试集…'});render();
 try{
  const {data:s,error}=await sb.auth.getSession();if(error||!s.session)throw Error('登录会话已失效，请重新登录。');session=s.session;
  const r=await fetch('/api/evaluate',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+session.access_token},body:JSON.stringify({task_id:p.id,language:lang,code,mode})});
  const text=await r.text();let result;try{result=JSON.parse(text);}catch{throw Error('评测服务没有返回JSON（HTTP '+r.status+'），请保留草稿后重试。');}
  if(e!==epoch)return;target.set(key,{...result,mode});if(!r.ok)notify(result.error||'运行请求失败');
  if(mode==='submit')try{await history();}catch(err){notify('评测已返回，但历史读取失败：'+err.message);}
 }catch(err){if(e===epoch)target.set(key,{status:'error',stage:'infrastructure',mode,error:err.message});}
 finally{running=false;if(e===epoch&&page==='code')render();}
}
async function submitCode(){return executeCode('submit');}
async function runSampleCode(){return executeCode('sample');}
const recordConfigs={
 research:{title:'研究与实验',description:'围绕一条主线记录可证伪问题、基线、实验和失败案例；不会把“写了记录”自动算成研究完成。',fields:[['title','研究任务标题'],['track','方向'],['question','问题与假设','textarea'],['method','基线、对照、数据与配置','textarea'],['result','实际结果、失败案例与下一步','textarea']]},
 papers:{title:'论文笔记',description:'把论文主张对应到公式、实现和证据；记录你理解不了的步骤和下一次验证。',fields:[['title','论文标题'],['venue','会议 / 期刊 / 年份'],['note','问题、方法、证据、局限与疑问','textarea']]},
 weeks:{title:'周计划',description:'每周20—30小时只是预算。优先共同基础加一条科研主线；一次任务先形成一个可检查结果，不要求同时学完六个方向。',fields:[['title','本周任务'],['hours','计划小时数','number']]},
 mentors:{title:'导师联系',description:'围绕研究匹配和可验证成果准备材料，记录邮件版本、回复与后续任务。',fields:[['name','导师 / 联系人'],['lab','学校与实验室'],['status','联系状态'],['note','研究匹配、证据、邮件与跟进','textarea']]}
};
function renderRecords(root,kind){
 const cfg=recordConfigs[kind];root.append(hero(cfg.title,cfg.description));const form=box('card');const fields=cfg.fields.map(([key,label,type])=>{const f=field(label,'',type||'text','record-'+kind+'-'+key);form.append(f.l);return [key,f.x];});form.append(btn('保存记录',()=>{const values=Object.fromEntries(fields.map(([k,x])=>[k,x.value]));if(!(values.title||values.name||'').trim())return notify('请填写标题或名称');if(kind==='weeks'){const h=Number(values.hours);if(!Number.isFinite(h)||h<=0||h>168)return notify('计划时长应为0到168之间的正数');values.hours=h;values.done=false;}data[kind].unshift({id:crypto.randomUUID(),...values,created_at:new Date().toISOString()});changed();render();},'primary'));root.append(form);
 const records=data[kind]||[];root.append(el('h3','已有记录 · '+records.length));const list=box('record-list');
 for(const x of records){const card=box('record');card.append(el('strong',x.title||x.name||'未命名'),el('p',[x.track,x.venue,x.lab,x.status,x.hours?x.hours+'小时':''].filter(Boolean).join(' · ')),el('p',[x.question,x.method,x.result,x.note,x.follow].filter(Boolean).join('\n')));
  if(kind==='weeks'){const l=el('label',null,'checkline'),check=el('input');check.type='checkbox';check.checked=!!x.done;check.onchange=()=>{x.done=check.checked;changed();};l.append(check,el('span','任务已执行（自述进度，不等于课程掌握）'));card.append(l);const h=field('调整计划小时',x.hours||1,'number');h.x.onchange=()=>{const v=Number(h.x.value);if(Number.isFinite(v)&&v>0&&v<=168){x.hours=v;changed();}else notify('请输入有效小时数');};card.append(h.l);if(x.courseId&&GUIDES[x.courseId])card.append(btn('进入对应课程',()=>openCourse(x.courseId)));}
  card.append(btn('编辑记录',()=>editRecord(kind,x),'small'));list.append(card);
 }
 if(!records.length)list.append(el('p','暂无记录，可从课程里把具体任务加入本周。','empty'));root.append(list);
}
function editRecord(kind,record){const cfg=recordConfigs[kind],d=el('dialog'),form=box('dialog-card');form.append(el('h2','编辑记录'));const fields=cfg.fields.map(([key,label,type])=>{const f=field(label,record[key]??'',type||'text');form.append(f.l);return [key,f.x];});const close=()=>{d.close();d.remove();};form.append(box('actions',btn('保存',()=>{for(const [key,x]of fields){if(key==='hours'){const h=Number(x.value);if(!Number.isFinite(h)||h<=0)return notify('小时数必须大于0');record[key]=h;}else record[key]=x.value;}changed();close();render();},'primary'),btn('取消',close)));d.append(form);document.body.append(d);d.addEventListener('cancel',()=>d.remove());d.showModal();}
function exportBackup(){const url=URL.createObjectURL(new Blob([JSON.stringify({version:4,exportedAt:new Date().toISOString(),data},null,2)],{type:'application/json'})),a=el('a');a.href=url;a.download='research-lab-backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
async function importBackup(f){if(!f)return;if(f.size>10*1024*1024)throw Error('备份超过10MB，请先检查文件');const parsed=JSON.parse(await f.text()),candidate=parsed.data||parsed;if(!candidate||typeof candidate!=='object'||!candidate.progress||!Array.isArray(candidate.papers))throw Error('不是有效的Research Lab备份');if(!confirm('导入将替换当前账户工作区；请先导出备份。继续吗？'))return;data=normalize(candidate);changed();await sync();render();notify('备份已导入');}
function renderAccount(root){
 root.append(hero('账户、同步与学习证据','同一邮箱保存同一份工作区。旧版笔记、自评、代码草稿和项目记录保留；新学习阶段与旧记录并存。跨设备同字段冲突不会静默覆盖。'));
 const f=el('input');f.type='file';f.accept='.json';f.hidden=true;f.onchange=()=>importBackup(f.files?.[0]).catch(e=>notify(e.message));
 root.append(box('card',el('h3','云端状态'),el('p',user?'当前账户：'+user.email:'访客记录仅保存在当前设备；登录不会把访客内容偷偷合并到其他账户。','muted'),box('actions',btn('立即同步',()=>sync().then(()=>notify('同步检查完成')),'primary'),btn('导出完整备份',exportBackup),btn('导入备份',()=>f.click())),f));
 if(user){root.append(btn('把本机访客记录合入当前账户',()=>{const guest=JSON.parse(localStorage.getItem('research-lab-v34:guest')||'null');if(!guest)return notify('没有访客缓存');if(!confirm('将访客记录合入此账户；相同字段冲突会暂停处理。继续吗？'))return;const m=merge3(emptyState(),normalize(guest.data),data);if(m.conflicts.length){notify('访客与账户存在相同字段冲突；请分别导出后核对，不会自动覆盖。');return;}data=normalize(m.value);changed();render();}));}
 if(pendingConflict){root.append(note('存在版本冲突，建议先导出本机备份。','warn'),btn('采用云端版本',()=>{if(!confirm('放弃当前未同步改动，采用云端版本？'))return;data=normalize(pendingConflict.payload);base=structuredClone(data);version=pendingConflict.version;dirty=false;pendingConflict=null;cache();render();}),btn('以本机版本再次提交',async()=>{if(!confirm('覆盖冲突字段前，请确认已经保留云端与本机备份。继续？'))return;base=normalize(pendingConflict.payload);version=pendingConflict.version;pendingConflict=null;dirty=true;await sync();render();},'danger'));}
 root.append(el('h3','在线评测历史 · '+jobs.length));for(const j of jobs.slice(0,20)){root.append(box('record',el('strong',j.task_id+' · '+j.status),el('p',j.language+' · '+new Date(j.created_at).toLocaleString('zh-CN')+' · '+(j.report?.score??0)+'分'),btn('打开题目与报告',()=>{reports.set(j.task_id+'-'+j.language,j.report||{});language=j.language;openTask(j.task_id);})))}
 root.append(note('课堂小题属于学习辅助，可查看答案；用户提交的实现与研究说明尚待复核。只有在线运行器返回的成绩被显示为服务端行为测试。'));
}
async function init(){
 try{
  const [a,b]=await Promise.all([fetch('/api/config',{cache:'no-store'}),fetch('/courses.json',{cache:'no-store'})]);if(!a.ok||!b.ok)throw Error('配置或课程数据加载失败');config=await a.json();courses=enrichCourses(await b.json());if(courses.length!==96)throw Error('课程ID完整性检查失败');
  const hash=location.hash.slice(1);if(pages[hash])page=hash;
  loadCache();render();
  if(!config.supabaseUrl||!config.supabaseKey)throw Error('云端认证配置缺失；课程可先浏览');
  sb=createClient(config.supabaseUrl,config.supabaseKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
  // Auth events run under the auth client's lock. Defer awaited DB work.
  sb.auth.onAuthStateChange((event,s)=>{session=s;setTimeout(()=>activate(s,event==='PASSWORD_RECOVERY').catch(e=>setBanner(e.message,'bad')),0);});
  const {data:s,error}=await sb.auth.getSession();if(error)throw error;await activate(s.session);
 }catch(e){setBanner('加载提示：'+e.message,'bad');}
}
init();
