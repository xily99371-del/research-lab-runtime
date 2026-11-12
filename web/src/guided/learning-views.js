import {GUIDES,EXACT_LINKS,enrichCourses} from './catalog.js';
import {STAGES,ROUTES,checkAnswer,progressFor,learnerStatus,nextUnit,stageUnlockReason} from './model.js';
import {richText} from './math.js';
import {taskReadiness,TASK_PATHS} from './assessment-path.js';
import './learning.css';
import {PRACTICE_LADDERS} from './practice-ladders.js';
import {INTERVIEW_BANK} from './interview-bank.js';
import {DERIVATION_LABS} from './derivation-labs.js';
import {EXPERIMENT_PACKS} from './experiment-packs.js';
import {RESEARCH_SOURCE_MAP} from './research-source-map.js';

const ui={course:'u1',track:'全部',query:'',practiceQuery:'',practiceTrack:'全部'};
const e=(tag,text='',cls='')=>{const n=document.createElement(tag);if(text!==null)n.textContent=text;if(cls)n.className=cls;return n;};
const group=(cls,...children)=>{const n=e('div',null,cls);n.append(...children.filter(Boolean));return n;};
const button=(text,action,cls='')=>{const b=e('button',text,cls);b.type='button';b.onclick=()=>Promise.resolve().then(action).catch(err=>alert(err.message));return b;};
const callout=(text,cls='')=>richText(text,'div','learn-callout '+cls);
const title=(text)=>e('h3',text);
function safeLink(text,url){const a=e('a',text);try{const u=new URL(url);if(!['https:','http:'].includes(u.protocol))return e('span',text);a.href=u.href;}catch{return e('span',text);}a.target='_blank';a.rel='noopener noreferrer';return a;}
function field(label,value='',kind='textarea',id=''){const l=e('label',label,'learn-field'),input=e(kind);input.value=value;input.id=id;if(kind==='input')input.type='text';input.autocomplete='off';l.append(input);return {label:l,input};}
function details(summary,children,open=false,onOpen){const d=e('details',null,'learn-details');d.open=open;d.append(e('summary',summary),...children);if(onOpen)d.addEventListener('toggle',()=>{if(d.open)onOpen();});return d;}
function state(ctx,id){return progressFor(ctx.data.progress,id);}
function edit(ctx,id,fn){const old=ctx.data.progress[id]||{},p=structuredClone(old.learning||{});fn(p);p.updatedAt=new Date().toISOString();ctx.data.progress[id]={...old,learning:p};ctx.changed();}
function preserveFocus(ctx){const a=document.activeElement,id=a?.id,start=a?.selectionStart,end=a?.selectionEnd;ctx.refresh();if(id){const b=document.getElementById(id);if(b){b.focus();if(typeof b.setSelectionRange==='function'&&start!==null)try{b.setSelectionRange(start,end);}catch{}}}}
export function focusCourse(id,reset=true){ui.course=id;if(reset){ui.query='';ui.track='全部';}}
function open(ctx,id,stage){focusCourse(id);if(stage!==undefined){const reason=stageUnlockReason(ctx.data.progress,id,stage);if(reason){ctx.notify(reason);stage=stage<=2?1:stage===3?2:3;}edit(ctx,id,p=>{p.stage=stage;p.startedAt||=new Date().toISOString();});}ctx.navigate('courses');}
function getCourse(ctx,id){return ctx.courses.find(c=>c.id===id);}
function setStage(ctx,id,n){const reason=stageUnlockReason(ctx.data.progress,id,n);if(reason){ctx.notify(reason);return;}edit(ctx,id,p=>{p.stage=n;p.startedAt||=new Date().toISOString();});ctx.refresh();document.querySelector('.learn-main')?.scrollIntoView({block:'start',behavior:'smooth'});}
function plan(ctx,id,stage=2){const c=getCourse(ctx,id),key=id+':'+stage;const exists=ctx.data.weeks.find(w=>w.learningKey===key&&!w.done);if(exists){ctx.notify('本周已有这项任务');return;}ctx.data.weeks.unshift({id:crypto.randomUUID(),title:c.title+'｜'+STAGES[stage],hours:1,done:false,learningKey:key,courseId:id,stage,created_at:new Date().toISOString()});ctx.changed();ctx.notify('已加入周计划；计划时长可在周计划中调整');}
function checkWidget(ctx,courseId,key,question,answer,explanation,remedialId){
 const p=state(ctx,courseId),old=p.checks?.[key]||{},wrap=group('learn-check');wrap.dataset.check=key;
 wrap.append(richText(question,'p'));
 const f=field('先写你的答案',old.lastAnswer||'','input','check-'+courseId+'-'+key);f.input.setAttribute('aria-label','课堂核对答案');
 const feedback=e('div',old.lastCorrect===true?'已核对正确；这只验证本小题，不等于独立实现通过。':old.attempts?'上次尚未核对正确，可修改答案或打开提示。':'','learn-feedback');feedback.setAttribute('role','status');
 const run=()=>{const value=f.input.value;if(!value.trim()){feedback.textContent='先尝试一个答案；暂时不会也可以查看分步思路。';return;}const ok=checkAnswer(value,answer);edit(ctx,courseId,x=>{x.checks||={};const prev=x.checks[key]||{};x.checks[key]={...prev,lastAnswer:value,lastCorrect:ok,passed:!!prev.passed||ok,attempts:(prev.attempts||0)+1,assisted:!!x.solutionViewed,at:new Date().toISOString()};});feedback.replaceChildren(callout(ok?'核对正确。'+explanation:'暂未通过。先核对单位、维度、分母或符号，再按例题步骤检查；不会时可以返回前置知识。',ok?'ok':'warn'));};
 f.input.onkeydown=ev=>{if(ev.key==='Enter'){ev.preventDefault();run();}};
 wrap.append(f.label,group('actions',button('核对答案',run,'primary'),remedialId?button('回到前置知识',()=>open(ctx,remedialId,1)):null),feedback);
 return wrap;
}
function evidenceForm(ctx,id,key,labels){
 const old=state(ctx,id).evidence?.[key]||{},wrap=group('learn-evidence');
 const fields=labels.map(([name,label])=>{const f=field(label,old[name]||'');f.input.oninput=()=>edit(ctx,id,p=>{p.evidence||={};p.evidence[key]={...(p.evidence[key]||{}),[name]:f.input.value,submittedAt:null};});wrap.append(f.label);return [name,f.input];});
 const status=e('p',old.submittedAt?'已有证据记录：这是学习者提交，尚不代表专家或自动判题认可。':'草稿自动保存。提交后会记录为“证据已提交”，不会冒充“已掌握”。','muted');
 const submit=()=>{if(fields.some(([,x])=>!x.value.trim())){status.textContent='请把实现、实际结果和解释分别填写；不能仅凭勾选标记完成。';return;}edit(ctx,id,p=>{p.evidence||={};p.evidence[key]={...Object.fromEntries(fields.map(([k,x])=>[k,x.value])),submittedAt:new Date().toISOString(),verification:'self-submitted',assisted:key==='independent'&&!!p.independentHelpUsed};if(key==='transfer'){p.review={dueAt:new Date(Date.now()+86400000).toISOString(),completed:0};}});status.textContent='证据已提交。代码行为测试和人工复核仍独立记录。';ctx.notify('已保存学习证据');};
 wrap.append(group('actions',button('提交本阶段证据',submit,'primary')),status);return wrap;
}
function linkedTasks(ctx,id){return ctx.problems.filter(p=>(TASK_PATHS[p.id]?.courses||[]).includes(id));}
function readinessCard(ctx,task){
 const r=taskReadiness(task.id,ctx.data.progress),wrap=group('assessment-path-card');
 const passed=ctx.jobs.some(j=>j.task_id===task.id&&j.status==='passed');
 wrap.append(group('assessment-path-head',e('b',task.title),e('span',r.ready?'建议准备已完成':r.label,'assessment-state '+(r.ready?'ready':''))));
 wrap.append(e('p','建议先具备：'+r.why+'。准备标准：每门关联课程的例题核对正确，并提交一份带提示练习的实际输出与解释。','muted'));
 for(const item of r.items){
  const row=group('assessment-path-row');
  row.append(e('strong',GUIDES[item.id] ? (ctx.courses.find(c=>c.id===item.id)?.title||item.id):item.id));
  row.append(e('span',(item.theory?'✓ 例题已核对':'○ 例题待核对')+'　'+(item.practice?'✓ 实践已提交':'○ 实践待提交'),'assessment-checks'));
  if(!item.complete)row.append(button(item.theory?'去提交带提示练习':'去核对例题',()=>open(ctx,item.id,item.next)));
  wrap.append(row);
 }
 wrap.append(group('actions',
  button(passed?'再次运行自动评测':'开始自动评测',()=>ctx.openTask(task.id),r.ready?'primary':''),
  !r.ready?button('我想提前挑战',()=>ctx.openTask(task.id),'secondary'):null
 ));
 if(!r.ready)wrap.append(callout('准备建议不是考试门槛。你可以提前提交；如果连续卡住，先补上面标出的那一步。','neutral'));
 else wrap.append(callout('已达到建议起点。开始评测后，测试失败也可以回到对应课程补习，不需要从头重学。','ok'));
 return wrap;
}
function taskLinks(ctx,id){const ps=linkedTasks(ctx,id),wrap=group('learn-links');
 if(ps.length){wrap.append(title('这节课对应的自动评测'));for(const p of ps)wrap.append(readinessCard(ctx,p));wrap.append(e('p','自动评测验证程序行为；课程实践还会检查独立实现与研究迁移，两类证据不会互相替代。','muted'));}
 else wrap.append(callout('本节目前没有独立在线判题。请按课程接口、样例和交付要求完成开放实践；不要把自评记录当作自动评分。','neutral'));
 return wrap;
}
function lessonIntro(ctx,c,g,p){
 const out=group('learn-stage-content');out.append(title('这一节先解决什么'),richText(g.goal),callout('可以先浏览全部阶段；“下一步”只作为建议。已有基础可跳过讲解，但跳过不会自动获得掌握标记。'));
 const req=group('learn-prerequisites');
 if(!g.prerequisites.length)req.append(e('p','没有强制前置课程。从下面的小题开始，不需要先把整个目录学完。'));
 for(const id of g.prerequisites){const pc=getCourse(ctx,id),st=learnerStatus(ctx.data.progress,id,ctx.jobs,EXACT_LINKS[id]||[]);req.append(button((pc?.title||id)+' · '+st.label,()=>open(ctx,id)));}out.append(title('前置知识与补学入口'),req);
 out.append(title('入口抽查：答不出时知道回哪里'));
 const checks=g.prerequisites.length?g.prerequisites.slice(0,2):[c.id];
 for(const id of checks){const x=GUIDES[id];out.append(checkWidget(ctx,c.id,'prereq-'+id,x.worked.question,x.worked.answer,x.worked.insight,id!==c.id?id:null));}
 out.append(callout('先过小例子，再做实现：本节不要求第一次就完成论文级实验。研究延伸留在第五阶段。','ok'));
 out.append(group('actions',button('进入讲解与例题',()=>setStage(ctx,c.id,1),'primary'),button('先浏览独立实现要求',()=>setStage(ctx,c.id,3)),button('加入周计划',()=>plan(ctx,c.id,0))));return out;
}
function renderSourceMap(out,id){const map=RESEARCH_SOURCE_MAP[id];if(!map)return;out.append(title('论文—源码对照 · '+map.title));for(const paper of map.papers){const card=group('learn-reference-card');card.append(e('h4',paper.title),e('p',paper.authors+' · '+paper.venue,'muted'),richText('核心主张：'+paper.claim),richText('建议追踪：'+paper.focus),safeLink('阅读论文 / 官方文档',paper.paper));if(paper.code?.length){const links=group('learn-source-links');for(const [label,url] of paper.code)links.append(safeLink(label,url));card.append(links);}out.append(card);}}
function renderExperimentPacks(out,id){const packs=EXPERIMENT_PACKS.filter(x=>x.courses.includes(id));if(!packs.length)return;out.append(title('可运行研究实验包'));for(const pack of packs){const card=group('learn-reference-card');card.append(e('h4',pack.title),richText(pack.summary),richText('预期检查：'+pack.expected),callout('实验边界：'+pack.scope,'neutral'));const a=e('a','下载 Python 实验脚本');a.href='/experiments/'+pack.script;a.download=pack.script;card.append(a,safeLink('查看实验包说明与环境配置','/experiments/README.md'));out.append(card);}}
function lessonExplain(ctx,c,g,p){
 const out=group('learn-stage-content'),lesson=ctx.lessons[c.id];
 out.append(title('先用一个能核对的小例子理解'),richText(g.worked.question));
 out.append(checkWidget(ctx,c.id,'worked',g.worked.question,g.worked.answer,g.worked.insight,g.prerequisites[0]));
 out.append(details('查看分步答案（会记录已使用参考）',[
 ...g.worked.steps.map((s,i)=>group('learn-worked-step',e('span',String(i+1),'learn-step-number'),richText(s))),
 callout('核对答案：'+g.worked.answer+'。'+g.worked.insight,'ok')
 ],false,()=>edit(ctx,c.id,x=>{x.solutionViewed=true;})));
 out.append(title('原理、数学推导与源码视角'),e('p','先读与你当前问题有关的段落，再展开推导；正文中的数学表达与公式区都参与渲染。','muted'));
 if(lesson?.formula)out.append(richText(lesson.formula,'div','learn-equation'));
 if(lesson){for(const [i,s]of lesson.sections.entries()){out.append(details(s[0],[richText(s[1])],i===0));}}
 const derivation=DERIVATION_LABS[c.id];if(derivation){out.append(title('数学推导实验室'),callout(derivation.purpose,'neutral'),callout('适用假设：'+derivation.assumptions,'neutral'));for(const [i,step]of derivation.steps.entries())out.append(details(step[0],[richText(step[1],'div','learn-prose')],i===0));out.append(checkWidget(ctx,c.id,'derivation-check',derivation.checkpoint.question,derivation.checkpoint.answer,derivation.checkpoint.insight));out.append(details('把推导变成可验证实验',[richText(derivation.experiment),richText('代码任务：'+derivation.code),callout('常见误区：'+derivation.pitfalls,'warn')],false));}
 renderSourceMap(out,c.id);
 out.append(title('理解检查：先口头解释，再写下依据'));
 const qs=lesson?.questions||[];qs.forEach((q,i)=>out.append(richText((i+1)+'. '+q,'p')));
 out.append(title('原始资料'),...(lesson?.links||[]).map(([name,url])=>group('learn-reference',safeLink(name,url))));
 const f=field('我的推导、疑问与说明',ctx.data.progress[c.id]?.note||'');f.input.oninput=()=>{ctx.data.progress[c.id]={...ctx.data.progress[c.id],note:f.input.value};ctx.changed();};out.append(f.label);
 out.append(group('actions',button('进入带提示练习',()=>setStage(ctx,c.id,2),'primary'),button('返回入口',()=>setStage(ctx,c.id,0))));return out;
}
function lessonPractice(ctx,c,g,p){
 const out=group('learn-stage-content');out.append(title('这一小步具体做什么'),richText(g.guided.fixture),title('接口或交付骨架'));const derivation=DERIVATION_LABS[c.id];if(derivation)out.append(details('研究级实现任务：把推导写成代码',[richText('实现要求：'+derivation.code),richText('验证实验：'+derivation.experiment),callout('重点检查：'+derivation.pitfalls,'warn')],true));renderExperimentPacks(out,c.id);
 const pre=e('pre',null,'learn-code');pre.append(e('code',g.guided.signature));out.append(pre);
 const ladder=PRACTICE_LADDERS[c.id];if(ladder){out.append(title(ladder.title),richText(ladder.intro));for(const [i,step]of ladder.steps.entries()){const content=[richText(step.objective),richText('实现要求：'+step.method)];if(step.input!==undefined){content.push(e('p','示例输入','muted'),e('pre',JSON.stringify(step.input,null,2),'code-output'),e('p','预期结果','muted'),e('pre',JSON.stringify(step.expected,null,2),'code-output'));}for(const id of step.tasks||[]){const task=ctx.problems.find(x=>x.id===id);if(task)content.push(button('打开对应自动评测：'+task.title,()=>ctx.openTask(id)));}out.append(details(step.title,content,i===0));}}else{out.append(title('本节的三步实现训练'),details('第 1 步｜读懂输入输出契约',[richText(g.guided.fixture),richText('先写清每个输入字段的含义、维度/单位、返回值结构，以及至少一个边界输入。')],true),details('第 2 步｜实现核心机制',[richText(g.guided.signature),richText(g.guided.hints[0]),richText(g.guided.hints[1])]),details('第 3 步｜反例与独立变式',[richText(g.independent),richText('再使用第三层提示检查边界：'+g.guided.hints[2]),richText('提交时记录实际输入、输出、复杂度和一个失败样例。')]));}
 out.append(group('actions',button('复制骨架',async()=>{try{await navigator.clipboard.writeText(g.guided.signature);ctx.notify('已复制');}catch{ctx.notify('浏览器未允许复制，请手动选择代码');}}),button('导出本节任务说明',()=>downloadTask(c,g)),button('加入周计划',()=>plan(ctx,c.id,2))));
 out.append(title('卡住时逐层展开提示'));
 const revealed=Math.min(3,Number(p.hintsRevealed)||0);for(let i=0;i<revealed;i++)out.append(callout('提示'+(i+1)+'：'+g.guided.hints[i],''));
 out.append(button(revealed>=3?'三层提示均已展开':'展开第'+(revealed+1)+'层提示',()=>{if(revealed>=3)return;edit(ctx,c.id,x=>{x.hintsRevealed=revealed+1;});ctx.refresh();}));
 out.append(taskLinks(ctx,c.id),title('保存这次练习的实际结果'));
 out.append(evidenceForm(ctx,c.id,'guided',[['output','实际输出 / 运行结果（不要只写“成功”）'],['explanation','怎样核对；卡在哪里；用了哪层提示']]));
 out.append(group('actions',button('撤掉提示，进入独立实现',()=>setStage(ctx,c.id,3),'primary'),button('回看讲解',()=>setStage(ctx,c.id,1))));return out;
}
function lessonIndependent(ctx,c,g,p){
 const out=group('learn-stage-content');out.append(callout('本阶段默认不展示示范答案和代码骨架。可以回看帮助，但会如实记录“使用过帮助”，不把复制结果算成独立完成。','neutral'));
 out.append(title('换一组条件，从空白开始'),richText(g.independent));
 if(!p.checks?.worked?.passed)out.append(callout('小例子尚未核对正确。可以继续挑战，也可先回到讲解检查单位、形状和关键假设。','warn'));
 out.append(button('需要帮助：查看定位问题提示',()=>{edit(ctx,c.id,x=>{x.independentHelpUsed=true;});ctx.refresh();}));
 if(p.independentHelpUsed)out.append(details('已使用帮助：排查顺序',[richText(g.guided.hints.join('\n')),richText('先用最小输入定位问题，先检查接口/维度，再检查核心更新，最后检查边界与数值稳定性。')],true));
 out.append(taskLinks(ctx,c.id),title('提交独立实现证据'),evidenceForm(ctx,c.id,'independent',[
 ['source','实现代码或可访问的仓库链接'],['tests','实际测试输入、输出、失败样例与修复记录'],['reasoning','不用看答案说明核心逻辑、复杂度或模型假设']
 ]));
 out.append(group('actions',button('进入迁移与复习',()=>setStage(ctx,c.id,4),'primary'),button('回到带提示练习',()=>setStage(ctx,c.id,2))));return out;
}
function interviewPractice(ctx,c,p){
 const g=GUIDES[c.id],bank=INTERVIEW_BANK[c.id]||{title:c.title,questions:[{id:'core',prompt:g.worked.question,followups:['这个结论依赖哪些前提？如果其中一个前提不成立，会发生什么？','请把核心关系从公式、伪代码或最小数值例子推导出来。','构造一个边界情况或反例，并说明你会怎样验证。','如果用于科研项目，最可能遇到什么失效场景？'],points:[g.worked.insight,g.guided.fixture,g.boundary,g.transfer],pitfalls:['只复述定义，不能给出推导、反例或验证方案','没有说明适用条件和失败边界']}]};
 const wrap=group('interview-practice');
 wrap.append(title('科研面试拷问 · '+bank.title),callout('建议先离开屏幕，用 1–2 分钟口头回答主问题，再展开追问。回答应落到公式、代码、实验或反例；参考要点用于复盘，不是背诵稿。','neutral'));
 for(const q of bank.questions){
  const old=p.interviewAnswers?.[q.id]||{},card=group('interview-question');
  card.append(e('span','ORAL DEFENSE · '+q.id,'interview-kicker'),e('h4',q.prompt),title('连续追问'));
  const follow=group('interview-followups');q.followups.forEach((x,i)=>follow.append(e('p',(i+1)+'. '+x)));card.append(follow);
  const answer=field('我的口头回答 / 推导 / 例子',old.answer||'');answer.input.rows=5;answer.input.placeholder='先给结论，再给推导依据、适用条件和验证方式。';card.append(answer.label);
  const transcript=field('AI 追问记录与下一轮回答',old.transcript||'');transcript.input.rows=4;transcript.input.placeholder='把 ChatGPT 上一轮追问和你的回答按轮次粘贴在这里；下一轮会基于整段记录继续追问。';card.append(transcript.label);
  const pressure=e('p','尚未抽取追问。先完整回答主问题，再开始模拟追问。','muted');card.append(group('actions',button('模拟老师追问',()=>{pressure.textContent='老师追问：'+q.followups[Math.floor(Math.random()*q.followups.length)];},'secondary')),pressure);
  const status=e('p',old.practicedAt?'上次练习：'+new Date(old.practicedAt).toLocaleString('zh-CN')+' · 自述记录，尚未经过人工评分':'尚未记录口头练习','muted');
  const reviewPrompt=()=>['你是顶级高校AI/机器人实验室的科研面试老师。请严格评估以下回答，不要因为术语多就给高分。','【课程】'+c.title,'【主问题】'+q.prompt,'【连续追问】'+q.followups.join('；'),'【我的回答】'+answer.input.value,'【此前追问记录】'+transcript.input.value,'【参考考察点】'+q.points.join('；'),'【常见失分点】'+q.pitfalls.join('；'),'请按准确性、推导深度、假设与边界、工程/科研联系、表达清晰度分别按0-5分评分；指出具体错误或缺失；给出更好的回答结构；最后提出一个最值得继续追问的问题。证据不足时请明确说明，不要臆测。'].join('\\n\\n');
  const dynamicPrompt=()=>['你正在模拟顶级高校 AI/机器人实验室的真实科研面试。不要给用户完整答案，也不要一次抛出多个问题。','【课程】'+c.title,'【主问题】'+q.prompt,'【本轮回答】'+answer.input.value,'【已有追问与回答记录】'+transcript.input.value,'【考察重点】'+q.points.join('；'),'【常见失分点】'+q.pitfalls.join('；'),'请先在内部判断用户最新回答中最薄弱、最值得验证的一处：可能是数学推导跳步、概念混淆、隐含假设、边界遗漏、实验设计漏洞或源码理解不准确。然后只提出一个具体、可回答、能区分真实理解与背诵的追问。追问必须紧扣用户刚才的回答，不要重复题库原问题，不要提前给提示或标准答案。若回答已扎实，则提高难度，要求构造反例、推导 Jacobian/复杂度、解释源码数据流或设计可证伪实验。输出格式：一句简短面试官反馈 + 一个追问。'].join('\\n\\n');
  card.append(group('actions',button('保存我的回答',()=>{if(!answer.input.value.trim()){ctx.notify('先写下回答或口头表达提纲');return;}edit(ctx,c.id,x=>{x.interviewAnswers||={};x.interviewAnswers[q.id]={answer:answer.input.value,transcript:transcript.input.value,practicedAt:new Date().toISOString()};});status.textContent='已保存练习记录；系统不会把自述回答自动判定为掌握。';ctx.notify('面试回答已保存')},'primary'),button('复制给 ChatGPT 评估',async()=>{if(!answer.input.value.trim()){ctx.notify('先写下你的回答');return;}try{await navigator.clipboard.writeText(reviewPrompt());ctx.notify('评估材料已复制，粘贴到 ChatGPT 对话即可由我逐项评估。');}catch{ctx.notify('浏览器未允许复制，请手动复制回答后发给 ChatGPT。');}},'secondary'),button('复制 AI 动态追问',async()=>{if(!answer.input.value.trim()){ctx.notify('先回答主问题，再生成动态追问');return;}try{await navigator.clipboard.writeText(dynamicPrompt());ctx.notify('动态追问指令已复制。将其粘贴到 ChatGPT，得到一个针对当前回答的追问；再把追问和你的下一轮回答记入上方记录。');}catch{ctx.notify('浏览器未允许复制，请手动复制回答和追问记录。');}},'secondary')));card.append(status);
  card.append(details('展开参考回答要点（答完再看）',[title('回答应覆盖'),...q.points.map(x=>e('p','• '+x)),title('常见失分点'),...q.pitfalls.map(x=>callout(x,'warn'))],false));
  wrap.append(card);
 }
 return wrap;
}
function lessonTransfer(ctx,c,g,p){
 const out=group('learn-stage-content');out.append(title('把知识带回你的项目'),richText(g.transfer),title('这一结论的适用边界'),callout(g.boundary,'warn'));
 const interview=interviewPractice(ctx,c,p);if(interview)out.append(interview);
 out.append(title('让实验有可能推翻你的解释'),evidenceForm(ctx,c.id,'transfer',[
 ['hypothesis','具体研究问题 / 假设；什么结果会推翻它'],['comparison','基线、对照、数据划分与实际结果'],['limits','失败案例、成本、局限与下一步']
 ]));
 out.append(title('隔天再做一次：不是重复点“完成”'),richText('关闭讲解，用不同输入重算例子；从空文件重写核心函数；向同学解释为什么成立与何时失败。复习记录与首次练习分开。'));
 if(p.review?.dueAt)out.append(e('p','建议复习日期：'+new Date(p.review.dueAt).toLocaleDateString('zh-CN'),'muted'));
 out.append(button('记录一次无提示复习',()=>{edit(ctx,c.id,x=>{x.review={completed:(x.review?.completed||0)+1,lastAt:new Date().toISOString(),dueAt:new Date(Date.now()+7*86400000).toISOString()};});ctx.notify('复习记录已保存；这是自述，不是自动能力认证');ctx.refresh();}));
 const related=ROUTES.find(r=>r.units.includes(c.id)),i=related?.units.indexOf(c.id),next=related&&related.units[i+1];
 if(next)out.append(button('继续路线：'+getCourse(ctx,next)?.title,()=>open(ctx,next,0),'primary'));
 return out;
}
export function renderLearningCourses(root,ctx){
 const cs=enrichCourses(ctx.courses);root.append(group('learn-hero',e('small','UNDERSTAND → IMPLEMENT → TRANSFER'),e('h2','每一步，都知道做什么、如何核对、卡住后回哪里。'),e('p','先用共同基础补齐薄弱处，再围绕视觉、机器人或多模态主线推进。研究级问题留在最后，不要求第一次阅读就完成全部实验。')));
 const select=e('select');select.setAttribute('aria-label','课程方向');for(const t of ['全部',...new Set(cs.map(c=>c.track))]){const o=e('option',t);o.value=t;select.append(o);}select.value=ui.track;select.onchange=()=>{ui.track=select.value;ctx.refresh();};
 const search=e('input');search.id='learning-search';search.placeholder='搜索课程、原理、具体练习';search.value=ui.query;const searchChange=ev=>{if(ev?.isComposing)return;ui.query=search.value;preserveFocus(ctx);};search.oninput=searchChange;search.oncompositionend=searchChange;
 root.append(group('learn-toolbar',select,search,e('span','96节分阶段学习 · 旧记录保留','muted')));
 let matches=cs.filter(c=>(ui.track==='全部'||c.track===ui.track)&&(c.title+' '+GUIDES[c.id].goal+' '+GUIDES[c.id].guided.fixture).toLowerCase().includes(ui.query.toLowerCase()));
 if(!matches.some(c=>c.id===ui.course))ui.course=matches[0]?.id;
 const list=group('card course-list learn-course-list');
 for(const c of matches){const st=learnerStatus(ctx.data.progress,c.id,ctx.jobs,EXACT_LINKS[c.id]||[]),b=button('',()=>{ui.course=c.id;edit(ctx,c.id,p=>{p.startedAt||=new Date().toISOString();});ctx.refresh();},'course-item '+(c.id===ui.course?'active':''));b.dataset.unit=c.id;b.append(e('b',c.title),e('small',st.label+' · '+c.level));list.append(b);}
 const main=group('card lesson learn-main');main.dataset.unit=ui.course||'';
 const c=cs.find(c=>c.id===ui.course);
 if(!c){main.append(e('p','没有匹配课程，请修改关键词。'));root.append(group('course-grid',list,main));return;}
 const g=GUIDES[c.id],p=state(ctx,c.id),stage=Math.min(4,Math.max(0,Number(p.stage)||0));
 main.append(e('span',c.track,'pill blue'),e('h2',c.title),richText(g.goal,'p','learn-goal'));
 const tabs=group('learn-stages');tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label','学习阶段');
 STAGES.forEach((label,i)=>{const reason=stageUnlockReason(ctx.data.progress,c.id,i),b=button((reason?'🔒 ':'')+(i+1)+'. '+label,()=>setStage(ctx,c.id,i),i===stage?'active':'');b.setAttribute('role','tab');b.setAttribute('aria-selected',String(i===stage));b.dataset.stage=String(i);if(reason)b.title=reason;tabs.append(b);});main.append(tabs);
 const legacy=ctx.data.progress[c.id]||{};if(legacy.theory||legacy.implementation||legacy.research)main.append(details('查看旧版自评（不自动折算为新阶段通过）',[e('p','原理论/实现/研究勾选与旧笔记仍保留；新的课堂核对和证据记录从这里单独积累。')]));
 main.append([lessonIntro,lessonExplain,lessonPractice,lessonIndependent,lessonTransfer][stage](ctx,c,g,p));
 root.append(group('course-grid learn-layout',list,main));
}
function downloadTask(c,g){
 const text=['# '+c.title,'学习目标：'+g.goal,'前置：'+g.prerequisites.join(', '),'## 手算例题',g.worked.question,'## 接口',g.guided.signature,'## 验收样例',g.guided.fixture,'## 独立实现',g.independent,'## 迁移',g.transfer,'## 边界',g.boundary,'## 交付证据',...g.evidence].join('\n\n');
 const url=URL.createObjectURL(new Blob([text],{type:'text/markdown;charset=utf-8'})),a=e('a');a.href=url;a.download='research-lab-'+c.id+'-practice.md';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export function renderLearningPractice(root,ctx){
 root.append(callout('实践任务现在与课程使用同一份阶段记录。先做具体小输入，再做独立变式；开放实验与在线题目的评分范围明确区分。'));
 const sel=e('select');sel.setAttribute('aria-label','实践方向');for(const t of ['全部',...new Set(ctx.courses.map(c=>c.track))]){const o=e('option',t);sel.append(o);}sel.value=ui.practiceTrack;sel.onchange=()=>{ui.practiceTrack=sel.value;ctx.refresh();};
 const q=e('input');q.id='practice-search';q.placeholder='搜索实践内容、输入输出或主题';q.value=ui.practiceQuery;q.oninput=ev=>{if(ev.isComposing)return;ui.practiceQuery=q.value;preserveFocus(ctx);};q.oncompositionend=()=>{ui.practiceQuery=q.value;preserveFocus(ctx);};root.append(group('learn-toolbar',sel,q));
 const list=group('learn-practice-grid');for(const c of ctx.courses){const g=GUIDES[c.id];if(ui.practiceTrack!=='全部'&&ui.practiceTrack!==c.track)continue;if(!(c.title+' '+g.guided.fixture+' '+g.independent).toLowerCase().includes(ui.practiceQuery.toLowerCase()))continue;
 const card=group('record task-item learn-practice-card');card.dataset.unit=c.id;card.append(e('span',c.track,'pill'),e('h3',c.title),richText(g.guided.fixture),e('p',learnerStatus(ctx.data.progress,c.id,ctx.jobs,EXACT_LINKS[c.id]||[]).label,'muted'),e('p',linkedTasks(ctx,c.id).length?'有关联自动评测；完成本节例题核对和带提示练习后，系统会提示可以开始。':'本地/开放实验：有接口、样例、分层提示与证据记录。','muted'),...linkedTasks(ctx,c.id).map(task=>readinessCard(ctx,task)),group('actions',button('开始分步任务',()=>open(ctx,c.id,2),'primary'),button('先看例子',()=>open(ctx,c.id,1)),button('加入本周',()=>plan(ctx,c.id,2))));list.append(card);
 }root.append(list);
}
export function renderJourneyHome(root,ctx){
 const pref=ctx.data.progress.__journey__||{},route=ROUTES.find(r=>r.id===pref.route)||ROUTES[0];
 root.append(group('learn-hero',e('small','RESEARCH LAB / LEARNING PATHS'),e('h2','今天先完成一小步，再把它接回真实项目。'),e('p','适合能修改调试项目、需要练习独立实现的起点。默认每周20—30小时，不把96个专题同时铺开，也不要求学完全部基础再做科研。')));
 const selector=group('learn-route-grid');for(const r of ROUTES){const b=button('',()=>{ctx.data.progress.__journey__={...pref,route:r.id};ctx.changed();ctx.refresh();},'learn-route '+(r.id===route.id?'selected':''));b.append(e('b',r.name),e('span',r.deliverable));selector.append(b);}root.append(selector);
 const next=nextUnit(route,ctx.data.progress),c=getCourse(ctx,next),p=state(ctx,next);root.append(group('card learn-next',e('small','建议下一步 · 可跳过已熟悉内容'),e('h3',c?.title||next),richText(GUIDES[next].goal),e('p','当前阶段：'+STAGES[Math.min(4,Number(p.stage)||0)],'muted'),group('actions',button('继续学习',()=>open(ctx,next),'primary'),button('看看96节知识地图',()=>ctx.navigate('courses')),button('加入周计划',()=>plan(ctx,next,Number(p.stage)||0)))));
 if(route.capstone){const cap=group('card learn-capstone');cap.append(e('span','ROUTE CAPSTONE · 综合实践','interview-kicker'),title(route.capstone.title),richText(route.capstone.brief),title('需要提交的证据'),richText(route.capstone.evidence),title('验收标准'),richText(route.capstone.acceptance));root.append(cap);}
 const rows=group('learn-route-steps');for(const [i,id]of route.units.entries()){const course=getCourse(ctx,id),st=learnerStatus(ctx.data.progress,id,ctx.jobs,EXACT_LINKS[id]||[]);rows.append(button((i+1)+'. '+course.title+' — '+st.label,()=>open(ctx,id),'learn-route-step'));}root.append(rows);
 const all=ctx.courses.map(x=>state(ctx,x.id)),checked=all.filter(p=>p.checks?.worked?.passed).length,independent=all.filter(p=>p.evidence?.independent?.submittedAt).length,transfer=all.filter(p=>p.evidence?.transfer?.submittedAt).length,passed=new Set(ctx.jobs.filter(j=>j.status==='passed').map(j=>j.task_id)).size;
 root.append(group('grid stats',...[[checked,'例题核对'],[independent,'独立实现证据（待复核）'],[transfer,'迁移证据（待复核）'],[passed,'服务端行为测试通过题目']].map(([n,l])=>group('card stat',e('small',l),e('b',String(n))))));
 root.append(callout('读过、例题答对、自己提交代码、服务端测试通过、研究迁移是不同证据。这里不再用三个勾选或目录完成率替代能力判断。','neutral'));
 const due=ctx.courses.filter(c=>{const x=state(ctx,c.id).review;return x?.dueAt&&new Date(x.dueAt)<=new Date();});if(due.length){root.append(title('今天可复习'));for(const c of due)root.append(button(c.title,()=>open(ctx,c.id,4)));}
}
export function humanizeReport(report){
 if(report?.error)return {title:'评测未完成',message:String(report.error),help:'先检查登录状态、任务接口或运行服务状态。服务异常不记为知识掌握失败。'};
 const s=report?.stage||report?.status||'';
 if(/compile/i.test(s))return {title:'编译阶段未通过',message:'代码尚未运行到题目测试。',help:'先读第一条编译错误，检查函数签名、括号、类型和依赖；不要先改算法。'};
 if(/timeout/i.test(s)||report?.timed_out)return {title:'达到运行时间限制',message:'程序未在时限内返回。',help:'先检查无限循环、阻塞等待和退出条件，再分析复杂度；ROS还需检查spin与future等待关系。'};
 if(/runtime|error/i.test(s))return {title:'运行阶段出错',message:'程序启动后异常退出。',help:'从堆栈第一处用户代码检查输入结构、索引、shape和数值；用最小公开样例复现。'};
 const passed=report?.pass===true||report?.status==='passed';return {title:passed?'题目行为测试通过':'已有测试未通过',message:passed?'只确认本题当前用例，不自动证明复杂度、独立性或研究能力。':'先核对公开样例，再检查边界和数值稳定性。',help:'保留本次输入/输出和修复解释，在课程的独立实现阶段提交证据。隐藏用例不会直接展示完整答案。'};
}
