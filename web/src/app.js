import {createClient} from '@supabase/supabase-js';
import {emptyState,normalize,merge3} from './state.js';
import {PROBLEMS,starter} from './problems.js';
import {LESSONS} from './lessons.js';
const $=id=>document.getElementById(id);
function el(tag,text='',cls=''){const n=document.createElement(tag);if(text!==null)n.textContent=text;if(cls)n.className=cls;return n;}
function box(cls,...children){const n=el('div',null,cls);n.append(...children.filter(Boolean));return n;}
function button(text,fn,cls=''){const b=el('button',text,cls);b.type='button';b.addEventListener('click',()=>Promise.resolve().then(fn).catch(e=>notify(e.message)));return b;}
function input(label,value='',type='text'){const l=el('label',label),x=el(type==='textarea'?'textarea':'input');if(type!=='textarea')x.type=type;x.value=value;l.append(x);return {l,x};}
function notice(text,kind=''){const n=el('div',text,'notice '+kind);return n;}
function setBanner(text,kind=''){const b=$('banner');b.textContent=text;b.className='notice '+kind;}
let toastTimer;function notify(text){$('toast').textContent=text;$('toast').classList.add('on');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('on'),3500);}
const pages={dashboard:'学习驾驶舱',courses:'课程与推导',code:'在线代码评测',research:'研究与实验',papers:'论文笔记',weeks:'周计划',mentors:'导师联系',account:'账户与数据'};
let sb,config,courses=[],user=null,data=emptyState(),base=emptyState(),version=0,dirty=false,inFlight=false,pendingConflict=null;
let timer,epoch=0,revision=0,page='dashboard',selected='u32',track='全部',query='',problem='attention',language='python',running=false,lastReport=null,jobs=[];
const cacheKey=()=>`research-lab-v32:${user?.id||'guest'}`;
function cache(){try{localStorage.setItem(cacheKey(),JSON.stringify({data,base,version,dirty}));}catch{setBanner('浏览器存储空间不足，请在账户页导出备份。','warn');}}
function loadCache(){data=emptyState();base=emptyState();version=0;dirty=false;try{const c=JSON.parse(localStorage.getItem(cacheKey())||'null');if(c){data=normalize(c.data);base=normalize(c.base);version=Number(c.version)||0;dirty=!!c.dirty;}}catch{}}
function changed(){dirty=true;revision++;cache();clearTimeout(timer);if(user&&!pendingConflict)timer=setTimeout(()=>sync().catch(e=>setBanner('同步失败，改动仍在本机：'+e.message,'bad')),800);else if(!user)setBanner('访客模式：仅保存在当前浏览器；登录后可导入备份到云端。');}
async function remote(){const {data:r,error}=await sb.from('user_workspace').select('payload,version').eq('user_id',user.id).maybeSingle();if(error)throw error;return {payload:normalize(r?.payload),version:r?.version||0};}
function applyConflict(r){pendingConflict=r;cache();setBanner('检测到其他设备修改了相同内容，已暂停上传，未覆盖任何一方。请到“账户与数据”处理冲突。','warn');}
async function loadCloud(){const generation=epoch;const r=await remote();if(generation!==epoch)return;if(dirty){const m=merge3(base,data,r.payload);if(m.conflicts.length){applyConflict(r);return;}data=normalize(m.value);base=r.payload;version=r.version;cache();await sync();}else{data=r.payload;base=structuredClone(data);version=r.version;cache();setBanner('已从云端加载学习档案。');}}
async function sync(){
 if(!user||!sb){cache();return;}if(inFlight||pendingConflict)return;
 inFlight=true;const generation=epoch;
 try{
  if(!dirty){const r=await remote();if(generation!==epoch)return;if(r.version!==version){data=r.payload;base=structuredClone(data);version=r.version;cache();if(!['INPUT','TEXTAREA'].includes(document.activeElement?.tagName))render();}setBanner('云端已同步 · '+new Date().toLocaleTimeString('zh-CN'));return;}
  for(let i=0;i<3;i++){
   const sent=structuredClone(data),editRevision=revision;
   const {data:r,error}=await sb.rpc('rl_save_workspace',{p_payload:sent,p_expected:version});if(error)throw error;if(generation!==epoch)return;
   if(r.ok){base=sent;version=r.version;dirty=revision!==editRevision;cache();setBanner(dirty?'正在同步后续改动…':'云端保存成功 · '+new Date().toLocaleTimeString('zh-CN'));break;}
   const m=merge3(base,data,normalize(r.payload));if(m.conflicts.length){applyConflict({payload:normalize(r.payload),version:r.version});return;}data=normalize(m.value);base=normalize(r.payload);version=r.version;cache();
  }
 }finally{inFlight=false;if(user&&dirty&&!pendingConflict)timer=setTimeout(()=>sync().catch(e=>setBanner('同步失败：'+e.message,'bad')),1800);}
}
async function activate(session,recovery=false){
 const next=session?.user||null;if(user?.id===next?.id&&!recovery)return;
 epoch++;clearTimeout(timer);inFlight=false;pendingConflict=null;user=next;jobs=[];loadCache();
 $('identity').textContent=user?.email||'访客 · 仅本机保存';$('auth-open').hidden=!!user;$('logout').hidden=!user;
 if(user){$('auth-dialog').close();try{await loadCloud();await history();}catch(e){setBanner('登录成功，但档案加载失败：'+e.message,'bad');}}
 else setBanner('访客模式：仅保存在当前浏览器。课程可以浏览，在线评测需要邮箱登录。');
 render();if(recovery)$('recovery-dialog').showModal();
}
async function history(){if(!user)return;const {data:r,error}=await sb.from('rl_jobs').select('id,task_id,language,status,report,created_at,source_code').order('created_at',{ascending:false}).limit(60);if(!error)jobs=r||[];}
function navigate(name){page=pages[name]?name:'dashboard';location.hash=page;render();}
for(const b of document.querySelectorAll('nav button'))b.addEventListener('click',()=>navigate(b.dataset.page));
window.addEventListener('hashchange',()=>{const p=location.hash.slice(1);if(pages[p]&&p!==page){page=p;render();}});
$('auth-open').onclick=()=>$('auth-dialog').showModal();$('auth-close').onclick=()=>$('auth-dialog').close();
async function auth(action){
 if(!sb)throw Error('认证配置未就绪');const email=$('email').value.trim(),password=$('password').value;
 if(!email.includes('@'))throw Error('请填写有效邮箱');if(action!=='reset'&&password.length<8)throw Error('密码至少 8 位');
 const buttons=[...$('auth-form').querySelectorAll('button')];buttons.forEach(b=>b.disabled=true);$('auth-message').textContent='正在连接认证服务…';
 try{let result;if(action==='login')result=await sb.auth.signInWithPassword({email,password});
 else if(action==='signup')result=await sb.auth.signUp({email,password,options:{emailRedirectTo:location.origin}});
 else result=await sb.auth.resetPasswordForEmail(email,{redirectTo:location.origin});
 if(result.error)throw result.error;
 $('auth-message').textContent=action==='reset'?'已提交密码重置请求，请查看邮箱。':result.data?.session?'登录成功。':'注册请求已提交，请打开验证邮件后登录。邮件投递还受项目 SMTP 配置和速率限制影响。';
 }catch(e){$('auth-message').textContent=e.message;}finally{buttons.forEach(b=>b.disabled=false);}
}
$('auth-form').onsubmit=e=>{e.preventDefault();auth('login').catch(e=>$('auth-message').textContent=e.message);};
$('register').onclick=()=>auth('signup').catch(e=>$('auth-message').textContent=e.message);
$('reset').onclick=()=>auth('reset').catch(e=>$('auth-message').textContent=e.message);
$('logout').onclick=async()=>{if(dirty){await sync();if(dirty&&!confirm('尚有未同步的本机改动。仍要退出？'))return;}const {error}=await sb.auth.signOut();if(error)notify(error.message);else activate(null);};
$('change-password').onclick=async()=>{const password=$('new-password').value;if(password.length<8){$('recovery-message').textContent='密码至少 8 位';return;}const {error}=await sb.auth.updateUser({password});$('recovery-message').textContent=error?error.message:'密码已更新';if(!error)$('recovery-dialog').close();};
window.addEventListener('online',()=>{if(user)sync().catch(e=>setBanner(e.message,'bad'));});
window.addEventListener('focus',()=>{if(user&&!running&&!['INPUT','TEXTAREA'].includes(document.activeElement?.tagName))sync().catch(()=>{});});
window.addEventListener('pagehide',cache);
function hero(title,body){return box('hero',el('small','RESEARCH LAB / LEARNING & VERIFICATION'),el('h2',title),el('p',body));}
function render(){
 $('title').textContent=pages[page];document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('active',b.dataset.page===page));const root=$('page');root.replaceChildren();
 if(page==='dashboard')renderDashboard(root);else if(page==='courses')renderCourses(root);else if(page==='code')renderCode(root);else if(page==='account')renderAccount(root);else renderRecords(root,page);
}
function renderDashboard(root){
 root.append(hero('把学习变成可以检查的能力。','计算机基础、视觉与三维、多模态和 ROS 2 并行推进。理论自评、真实代码评测和研究证据分开记录，避免用勾选代替掌握。'));
 const self=Object.values(data.progress).filter(x=>x?.theory||x?.theory_passed).length;const verified=new Set(jobs.filter(x=>x.status==='passed').map(x=>x.task_id)).size;
 root.append(box('grid stats',...[[courses.length,'保留的课程单元'],[Object.keys(LESSONS).length,'已补写详细推导'],[verified,'已通过评测题'],[self,'理论自评记录']].map(([n,t])=>box('card stat',el('small',t),el('b',String(n))))));
 root.append(notice('96 个单元中，目前 6 个含本版补写的推导与专题训练；其余保留为明确标注的课程大纲。自动行为测试不等于完成科研能力认证。'));
 const tracks=[...new Set(courses.map(c=>c.track))];root.append(box('grid two',...tracks.map(t=>{const cs=courses.filter(c=>c.track===t);return box('card',el('h3',t),el('p',cs.slice(0,4).map(c=>c.title).join(' · '),'muted'),el('small',`${cs.length} 个单元`),button('进入方向',()=>{track=t;navigate('courses');}));})));
 root.append(el('h3','接下来应留下什么证据'),box('card',el('p','本周优先：手写 Attention 并通过矩阵形状与遮罩测试；完成一个 ROS Topic/Service 节点；用已有 VPR 或几何工作设计一项可证伪实验。'),button('开始 Attention 实现',()=>{problem='attention';language='python';navigate('code');},'primary')));
}
function renderCourses(root){
 const filter=el('select');for(const t of ['全部',...new Set(courses.map(c=>c.track))]){const o=el('option',t);o.value=t;filter.append(o);}filter.value=track;filter.onchange=()=>{track=filter.value;render();};
 const search=el('input');search.placeholder='检索知识点、方法或方向';search.value=query;search.onchange=()=>{query=search.value;render();};root.append(box('actions',filter,search));
 const items=courses.filter(c=>(track==='全部'||c.track===track)&&(`${c.title} ${c.summary}`.toLowerCase().includes(query.toLowerCase())));
 if(!items.some(c=>c.id===selected))selected=items[0]?.id;
 const list=box('course-list');for(const c of items){const b=button(c.title,()=>{selected=c.id;render();},c.id===selected?'active':'');b.append(el('small',LESSONS[c.id]?'详细推导与实践':'课程大纲'));list.append(b);}
 const detail=box('card lesson');const c=courses.find(c=>c.id===selected);
 if(c){detail.append(el('span',c.track,'pill'));const lesson=LESSONS[c.id];detail.append(el('h2',lesson?.title||c.title));
  if(lesson){for(const [h,p]of lesson.sections)detail.append(el('h3',h),el('p',p));detail.append(el('h3','答辩式自测'));for(const q of lesson.questions)detail.append(el('p',q));detail.append(el('h3','原始资料'));for(const [name,url]of lesson.links){const a=el('a',name);a.href=url;a.target='_blank';a.rel='noopener noreferrer';detail.append(el('p',null));detail.lastChild.append(a);}}
  else detail.append(notice('这是课程大纲，尚未扩写为完整教材。不要仅凭阅读这一页就标记为研究级掌握。','warn'),el('h3','知识范围'),el('p',c.summary),el('h3','实现任务'),el('p',c.practice),el('h3','进一步研究标准'),el('p',c.mastery));
  const old=data.progress[c.id]||{};const note=input('我的推导、实验结果与疑问',old.note||old.notes||'','textarea');let saveTimer;note.x.oninput=()=>{clearTimeout(saveTimer);saveTimer=setTimeout(()=>{data.progress[c.id]={...data.progress[c.id],note:note.x.value};changed();},350);};note.x.onblur=()=>{clearTimeout(saveTimer);data.progress[c.id]={...data.progress[c.id],note:note.x.value};changed();};detail.append(note.l);
  for(const [key,label]of [['theory','理论自评：能解释/推导'],['research','研究自评：有实验或论文联系']]){const l=el('label',null,'inline-check'),x=el('input');x.type='checkbox';x.checked=!!old[key];x.onchange=()=>{data.progress[c.id]={...data.progress[c.id],[key]:x.checked,note:note.x.value};changed();};l.append(x,el('span',label));detail.append(l);}
  const tasks=PROBLEMS.filter(p=>p.unit===c.id);for(const p of tasks)detail.append(button('代码验收：'+p.title,()=>{problem=p.id;language=p.langs[0];navigate('code');}));
 }
 else detail.append(el('p','没有匹配的知识点。'));root.append(box('course-grid',list,detail));
}
function draftKey(){return problem+'-'+language;}
function renderCode(root){
 root.append(hero('代码要实际运行，结果要可以追溯。','Python、C++17 和 ROS 2 Jazzy 使用每次提交独立的执行环境。程序不能访问外网或网站凭据；算法的隐藏测试期望值保留在评测服务端。'));
 const task=PROBLEMS.find(p=>p.id===problem)||PROBLEMS[0];problem=task.id;if(!task.langs.includes(language))language=task.langs[0];
 const select=el('select');select.setAttribute('aria-label','题目');for(const p of PROBLEMS){const o=el('option',p.title);o.value=p.id;select.append(o);}select.value=problem;select.onchange=()=>{problem=select.value;lastReport=null;render();};
 const langs=el('select');langs.setAttribute('aria-label','语言');for(const l of task.langs){const o=el('option',l==='cpp'?'C++17':l==='python'?'Python 3':'ROS 2 Python / Jazzy');o.value=l;langs.append(o);}langs.value=language;langs.onchange=()=>{language=langs.value;render();};root.append(box('actions',select,langs),box('card',el('h3',task.title),el('p',task.desc),el('pre',task.example)));
 root.append(notice('评分仅反映测试用例行为通过率；不自动证明使用了指定算法、时间复杂度或科研创新。每人最多 30 次/小时；每次运行受 CPU、内存、进程数、输出和总时长限制。'));
 const editor=el('textarea',null,'editor');editor.spellcheck=false;editor.setAttribute('aria-label','代码编辑器');editor.value=data.drafts[draftKey()]??starter(language);let editorTimer;
 const key=draftKey();const saveDraft=()=>{data.drafts[key]=editor.value;changed();};editor.oninput=()=>{clearTimeout(editorTimer);editorTimer=setTimeout(saveDraft,350);};editor.onblur=()=>{clearTimeout(editorTimer);saveDraft();};
 editor.addEventListener('keydown',e=>{if(e.key==='Tab'){e.preventDefault();const a=editor.selectionStart,b=editor.selectionEnd;editor.setRangeText('    ',a,b,'end');saveDraft();}if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();submit();}});
 const run=button(running?'评测中…':'提交并评测',submit,'primary');run.disabled=running;select.disabled=running;langs.disabled=running;
 const result=box('card');if(lastReport)showReport(result,lastReport);else result.append(el('p','尚未提交；先根据上面的接口契约实现代码。','muted'));
 async function submit(){if(running)return;if(!user){$('auth-dialog').showModal();return;}saveDraft();running=true;run.disabled=true;run.textContent='评测中…';select.disabled=true;langs.disabled=true;result.replaceChildren(notice('已提交，正在建立独立运行环境并执行测试…'));
  try{const {data:s,error}=await sb.auth.getSession();if(error||!s.session)throw Error('登录已过期');const r=await fetch('/api/evaluate',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+s.session.access_token},body:JSON.stringify({task_id:task.id,language,code:editor.value}),signal:AbortSignal.timeout(125000)});const j=await r.json();if(!r.ok&&!j.id)throw Error(j.error||'评测接口错误');lastReport=j;showReport(result,j);await history();}
  catch(e){lastReport={status:'error',error:e.message,score:0};showReport(result,lastReport);}finally{running=false;run.disabled=false;run.textContent='提交并评测';select.disabled=false;langs.disabled=false;}}
 root.append(box('card',editor,box('actions',run,button('保存草稿',()=>{saveDraft();notify('草稿已保存');}),button('恢复空模板',()=>{if(confirm('替换当前代码为未实现模板？')){editor.value=starter(language);saveDraft();}}))),el('h3','测试报告'),result,el('h3','最近提交'));
 const recent=jobs.filter(j=>j.task_id===task.id);const historyBox=box('list');if(!recent.length)historyBox.append(el('p',user?'暂无历史提交。':'登录后显示云端提交历史。','muted'));
 for(const j of recent.slice(0,10)){historyBox.append(box('row',box('',el('b',`${j.status} · ${j.report?.score??0} 分`),el('p',`${j.language} · ${new Date(j.created_at).toLocaleString()}`,'muted')),button('查看报告',()=>showReport(result,j.report)),button('载入代码',()=>{if(confirm('用该次提交代码替换编辑器？')){language=j.language;data.drafts[task.id+'-'+language]=j.source_code;changed();render();}})));}root.append(historyBox);
}
function showReport(root,r){root.replaceChildren();root.append(el('h3',r.status==='passed'?'测试通过':r.status==='timeout'?'运行超时':r.status==='error'?'运行服务异常':'未通过全部测试',r.status==='passed'?'passed':'failed'),el('p',`行为测试分数：${r.score??0} / 100${r.total?` · ${r.passed}/${r.total} 项`:''}${r.elapsed_ms?` · ${r.elapsed_ms} ms`:''}`));if(r.error)root.append(notice(r.error,'bad'));if(r.warning)root.append(notice(r.warning,'warn'));if(r.persisted===false)root.append(notice('本次报告未成功保存云端：'+(r.saveError||''),'warn'));
 for(const c of r.cases||[]){const row=box('row',el('span',c.pass?'✓':'×',c.pass?'passed':'failed'),box('',el('b',c.name),c.detail?el('p',c.detail,'muted'):null));if(c.input!==undefined)row.lastChild.append(el('pre',JSON.stringify({input:c.input,expected:c.expected,actual:c.actual},null,2)));root.append(row);}if(r.stderr)root.append(el('h4','编译 / 运行日志'),el('pre',r.stderr));}
const recordFields={research:[['title','研究任务标题'],['track','方向'],['question','问题与可证伪假设'],['method','基线、控制变量、指标'],['result','结果、失败与下一步']],papers:[['title','论文标题'],['venue','会议 / 期刊 / 年份'],['note','方法、推导、局限与个人判断']],weeks:[['title','本周任务'],['hours','预计小时数']],mentors:[['title','导师姓名 / 实验室'],['school','学校'],['topic','匹配研究方向'],['status','联系状态'],['note','论文依据、邮件记录、下次跟进']]};
function renderRecords(root,kind){const fields=recordFields[kind];const controls={};const form=box('card');form.append(el('h3','添加记录'));for(const [key,label]of fields){const {l,x}=input(label,'',['question','method','result','note'].includes(key)?'textarea':key==='hours'?'number':'text');controls[key]=x;form.append(l);}form.append(button('保存记录',()=>{if(!controls.title.value.trim())throw Error('请填写标题');const x={id:crypto.randomUUID(),date:new Date().toISOString()};for(const[k]of fields)x[k]=controls[k].value.trim();if(kind==='weeks'){x.hours=Number(x.hours);if(!Number.isFinite(x.hours)||x.hours<=0||x.hours>100)throw Error('请输入合理小时数');x.done=false;}data[kind].unshift(x);changed();render();},'primary'));root.append(form);
 for(const x of data[kind]){const card=box('card record',el('h3',x.title||x.name||'未命名'),el('small',x.date?new Date(x.date).toLocaleDateString():'历史记录'));for(const [key,label]of fields.slice(1))card.append(el('p',label+'：'+(x[key]??'')));if(kind==='weeks'){const check=el('input');check.type='checkbox';check.checked=!!x.done;check.onchange=()=>{x.done=check.checked;changed();};const l=el('label',null,'inline-check');l.append(check,el('span','已完成'));card.append(l);}card.append(button('编辑',()=>{for(const[k,label]of fields){const val=prompt(label,String(x[k]??''));if(val===null)return;x[k]=val;}changed();render();}),button('删除',()=>{if(confirm('删除这条记录？')){data[kind]=data[kind].filter(v=>v!==x);changed();render();}},'danger'));root.append(card);}
}
function backup(value=data){const a=el('a');const url=URL.createObjectURL(new Blob([JSON.stringify({app:'Research Lab',version:3.2,exportedAt:new Date().toISOString(),data:value},null,2)],{type:'application/json'}));a.href=url;a.download='research-lab-backup-'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function renderAccount(root){root.append(hero('账户、同步与备份','个人数据按账户隔离；同时编辑时检测版本冲突，不默默覆盖另一台设备。退出后不会展示刚才账户的数据。'),box('card',el('h3',user?.email||'访客模式'),el('p',`云端版本 ${version} · ${dirty?'存在未同步改动':'无未同步改动'}`),box('actions',button('立即同步 / 拉取更新',()=>sync()),button('导出备份',()=>backup()))));
 if(pendingConflict){const r=pendingConflict;root.append(box('card',notice('同一内容出现冲突。建议先导出本机和云端两份备份，再选择保留版本。','warn'),button('导出云端冲突副本',()=>backup(r.payload)),button('采用云端版本',()=>{if(confirm('保留备份后，确定以云端版本替换当前页面？')){data=r.payload;base=structuredClone(data);version=r.version;dirty=false;pendingConflict=null;cache();render();}}),button('用本机版本覆盖冲突',()=>{if(confirm('确定以本机版本替换刚检测到的云端版本？')){base=r.payload;version=r.version;pendingConflict=null;dirty=true;sync().then(render);}})));}
 const file=el('input');file.type='file';file.accept='.json,application/json';file.setAttribute('aria-label','导入备份');file.onchange=async()=>{const f=file.files[0];if(!f)return;if(f.size>2000000){notify('备份超过 2MB');return;}try{const obj=JSON.parse(await f.text()),raw=obj.data||obj;if(!raw||typeof raw!=='object'||(!raw.progress&&!raw.lessonNotes))throw Error('不是支持的学习备份');const next=normalize(raw);if(raw.lessonNotes)next.legacy=raw;if(confirm('导入将替换当前账户工作区。请先导出备份。继续？')){data=next;changed();render();}}catch(e){notify(e.message);}finally{file.value='';}};
 root.append(box('card',el('h3','导入 JSON 备份'),el('p','支持 3.x 工作区。旧版未映射字段不会被判定为已通过代码评测。'),file),box('card',el('h3','功能边界'),el('p','9 道已接通评测题，算法 5 道支持 Python/C++，ROS 2 4 道支持 Topic、Service、TF2、Action Goal/Result。暂未包含 Nav2/Gazebo 仿真、Action 取消测试、自动复杂度证明或 AI 主观打分。'),el('p','课程目录保留 96 单元，当前 6 个专题补写了详细推导。运行器快照需要在 2026-12-11 前刷新；计算和存储费用取决于云平台额度。','muted')));
}
async function init(){
 loadCache();page=pages[location.hash.slice(1)]?location.hash.slice(1):'dashboard';
 try{
  const [cr,rr]=await Promise.all([fetch('/api/config',{cache:'no-store'}),fetch('/courses.json')]);if(!cr.ok||!rr.ok)throw Error('配置或课程文件缺失，请联系维护者');config=await cr.json();courses=await rr.json();
  if(config.supabaseUrl&&config.supabaseKey){sb=createClient(config.supabaseUrl,config.supabaseKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
   sb.auth.onAuthStateChange((event,session)=>{if(event==='TOKEN_REFRESHED')return;setTimeout(()=>activate(session,event==='PASSWORD_RECOVERY').catch(e=>setBanner(e.message,'bad')),0);});
   const {data:s,error}=await sb.auth.getSession();if(error)throw error;await activate(s.session);
  }else{setBanner('邮箱认证配置未完成，目前为访客模式。','warn');render();}
 }catch(e){setBanner('加载失败：'+e.message,'bad');render();}
}
init();
