import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {GUIDE_LIST,GUIDES,EXACT_LINKS,enrichCourses} from '../src/guided/catalog.js';
import {ROUTES,checkAnswer,learnerStatus} from '../src/guided/model.js';
import {mathSegments,validateMath,asciiToTex} from '../src/guided/math.js';
import {emptyState,normalize,merge3} from '../src/state.js';
import {LESSONS} from '../src/lessons.js';
import {ADVANCED_LESSONS} from '../src/advanced-lessons.js';
import {REMAINING_LESSONS} from '../src/remaining-lessons.js';
import {ROS_MIDDLEWARE_LESSON} from '../src/ros-middleware-lesson.js';
import {LEGACY_LESSON_FORMULAS} from '../src/lesson-formulas.js';
import {PROBLEMS} from '../src/problems.js';
import {EXPANDED_PROBLEMS} from '../src/expanded-problems.js';
import {HOT_PROBLEMS} from '../src/hot100-problems.js';
import {PRACTICE_LADDERS} from '../src/guided/practice-ladders.js';
import {INTERVIEW_BANK} from '../src/guided/interview-bank.js';
import {DERIVATION_LABS} from '../src/guided/derivation-labs.js';
import {TASK_PATHS} from '../src/guided/assessment-path.js';
const courses=JSON.parse(fs.readFileSync(new URL('../data/courses.json',import.meta.url),'utf8'));
const lessons={...LESSONS,...ADVANCED_LESSONS,...REMAINING_LESSONS,...ROS_MIDDLEWARE_LESSON};

test('all 96 existing IDs have unique worked examples, fixtures, independent and transfer tasks',()=>{
 assert.equal(GUIDE_LIST.length,96);assert.equal(Object.keys(GUIDES).length,96);
 for(const c of courses){const g=GUIDES[c.id];assert.ok(g,c.id);assert.ok(g.worked.steps.length>=3);assert.equal(g.guided.hints.length,3);for(const x of [g.goal,g.worked.question,g.guided.signature,g.guided.fixture,g.independent,g.transfer,g.boundary])assert.ok(x.length>=10,c.id);assert.ok(checkAnswer(g.worked.answer,g.worked.answer));assert.equal(checkAnswer('',g.worked.answer),false);}
 for(const getter of [g=>g.worked.question,g=>g.guided.fixture,g=>g.independent,g=>g.transfer])assert.equal(new Set(GUIDE_LIST.map(getter)).size,96);
 const enriched=enrichCourses(courses);assert.deepEqual(enriched.map(x=>x.id),courses.map(x=>x.id));assert.equal(new Set(enriched.map(x=>x.practice)).size,96);
});
test('prerequisite graph is acyclic and routes only reference valid course IDs',()=>{
 const done=new Set(),active=new Set();function dfs(id){if(done.has(id))return;assert.ok(GUIDES[id],'invalid prerequisite '+id);assert.ok(!active.has(id),'cycle '+id);active.add(id);for(const p of GUIDES[id].prerequisites)dfs(p);active.delete(id);done.add(id);}for(const c of courses)dfs(c.id);
 for(const r of ROUTES)for(const id of r.units)assert.ok(GUIDES[id]);
});
test('linked online tasks exist; open-ended units are not silently assigned unrelated graders',()=>{
 for(const [id,ids]of Object.entries(EXACT_LINKS)){assert.ok(GUIDES[id]);for(const task of ids)assert.ok([...PROBLEMS,...EXPANDED_PROBLEMS,...HOT_PROBLEMS].some(p=>p.id===task));}
 assert.equal(EXACT_LINKS.u53,undefined);assert.deepEqual(EXACT_LINKS.u74,['ekf_scalar_update']);
 assert.equal(EXACT_LINKS.u49[0],'attention');assert.equal(EXACT_LINKS.u72[0],'ros_tf');
});
test('classroom checks reject empty/wrong answers and accept numerical tolerances',()=>{
 assert.ok(checkAnswer(' [1, 9] ','[1,9]'));assert.ok(checkAnswer('0.3333333',1/3));assert.ok(checkAnswer('0.666667',2/3));assert.equal(checkAnswer('1',2),false);assert.equal(checkAnswer('Infinity',1),false);assert.equal(checkAnswer('',0),false);assert.ok(checkAnswer('不能。','不能'));assert.ok(checkAnswer('b','B'));
});
test('worked numerical answers agree with independently written calculations',()=>{
 const computed={u2:3,u3:1+1+1,u4:Math.max(4,5,7,4+5),u5:1,u6:6-2,u9:'[11,4]',u10:(1+2+3)/3,u11:2+3*4,u12:100-10-20,u13:Math.floor(5/2)+1,u14:2*3*4,u15:3-2,u16:0-0.1*((0*2-4)*2),u17:1-(3/4)**2-(1/4)**2,u18:Math.sqrt(3**2+4**2),u19:'[1.5,9]',u20:(2*3-1)*3,u21:(0.1)/(1-0.9),u22:Math.floor((7+2-3)/2)+1,u23:0/5,u24:1+.9*2,u25:1/(1+1),u26:(0+2)/2,u27:(2+4+6)/3,u28:.5*(4+1-1-Math.log(1)),u29:Math.round(1.26/.1)*.1,u30:(90*.9+10*.5)/100,u31:1*1+2*0+4*-1,u32:100*2/4+50,u33:100*.2/5,u34:2/(4+4-2),u35:2*3/(6+4),u36:(224/16)**2,u37:2/4,u38:.5**2,u39:'[3,5]',u40:(.2*1-.1*2)/3,u41:Math.min(1+2,4+3),u42:Math.sqrt(.25)*2,u43:30/5,u44:5+2*.5,u45:4/2,u46:.5*1+.5*.5*0,u47:.25*1+.75*0,u48:1,u49:.25*2+.75*6,u50:'[20,30,40]',u51:new Set(['a','b','a','c','b']).size,u52:2*10*2*4*2,u53:8*(1024+1024),u54:1/2,u55:196,u56:1.2+.1,u57:1,u58:2/3,u59:(8-1)/10,u60:1+.1,u61:'[0,1]',u62:2/8,u63:15/20,u64:1-(1-.5)**2,u67:.1*10,u68:1/4,u69:2,u70:1/.2,u72:'[1,3,0]',u73:1+1,u74:4/(4+1)*2,u75:Math.sqrt((1+9)/2),u77:.05/.01,u78:.07-.05,u79:3+4,u80:2*2,u81:.1*2,u82:'[1,2,0]',u83:.9**2,u86:3/4-2/4,u88:84-80,u89:40/2+60};
 for(const [id,v]of Object.entries(computed))assert.ok(checkAnswer(v,GUIDES[id].worked.answer),id+': '+v);
});
test('body math across all lessons and all new learning stages parses, not just header panels',()=>{
 let count=0;const errors=[];
 for(const [id,l]of Object.entries(lessons)){
 const strings=[l.formula||LEGACY_LESSON_FORMULAS[id],...l.sections.map(s=>s[1]),...l.questions,...(l.tasks||[]).flat().map(String)];
 for(const s of strings){const r=validateMath(s);count+=r.count;errors.push(...r.errors.map(e=>({id,...e})));}
 }
 for(const g of GUIDE_LIST)for(const s of [g.goal,g.worked.question,...g.worked.steps,g.worked.insight,g.guided.fixture,...g.guided.hints,g.independent,g.transfer,g.boundary]){const r=validateMath(s);count+=r.count;errors.push(...r.errors.map(e=>({id:g.id,...e})));}
 assert.deepEqual(errors,[]);assert.ok(count>450,'expected body math, not 96 header formula tokens');
});
test('legacy body expressions are typeset while code remains unexecuted and unparsed',()=>{
 const parts=mathSegments('对 W∈R^(dout×din)，有 y=W x+(α/r)B(Ax)。');assert.ok(parts.filter(p=>p.type==='math').length>=2);
 assert.ok(asciiToTex('W∈R^(dout×din)').includes('\\mathbb{R}'));
 const code=mathSegments('`x = y + 1`');assert.equal(code.length,1);assert.equal(code[0].type,'code');
 const explicit=mathSegments(String.raw`\[a_{ij}=b_i c_j\]`);assert.equal(explicit.filter(p=>p.type==='math').length,1);
});
test('old self-assessment is retained but never grants new independent mastery',()=>{
 const old=emptyState();old.progress.u1={theory:true,implementation:true,research:true,note:'old note'};old.drafts.two_sum='my source';
 const x=normalize(old);assert.equal(x.progress.u1.note,'old note');assert.equal(learnerStatus(x.progress,'u1').independentSubmitted,false);assert.equal(learnerStatus(x.progress,'u1').serverPassed,false);
 x.progress.u1.learning={stage:3,evidence:{independent:{source:'repo',tests:'results',reasoning:'why',submittedAt:'date'}}};const y=normalize(x);assert.equal(y.progress.u1.learning.evidence.independent.source,'repo');assert.equal(y.progress.u1.note,'old note');
});
test('independent/transfer evidence and server verdicts remain distinct',()=>{
 const progress={u1:{learning:{evidence:{independent:{submittedAt:'date'}}}}};assert.equal(learnerStatus(progress,'u1',[],['two_sum']).serverPassed,false);
 const status=learnerStatus(progress,'u1',[{status:'passed',task_id:'two_sum'}],['two_sum']);assert.equal(status.serverPassed,true);assert.equal(status.transferred,false);
});
test('nested stage edits survive three-way merge and conflicts are not overwritten',()=>{
 const b=emptyState();b.progress.u1={note:'old',learning:{stage:1,hintsRevealed:0}};const l=structuredClone(b),r=structuredClone(b);l.progress.u1.learning.hintsRevealed=1;r.progress.u1.note='remote';const m=merge3(b,l,r);assert.equal(m.conflicts.length,0);assert.equal(m.value.progress.u1.note,'remote');assert.equal(m.value.progress.u1.learning.hintsRevealed,1);
 r.progress.u1.learning.hintsRevealed=2;assert.ok(merge3(b,l,r).conflicts.length>0);
});

test('advanced practice ladders contain staged implementation contracts',()=>{
 for(const id of ['u3','u16','u32','u39']){
  const ladder=PRACTICE_LADDERS[id];assert.ok(ladder,id);assert.ok(ladder.steps.length>=4,id);
  for(const step of ladder.steps){assert.ok(step.title.length>5);assert.ok(step.objective.length>20);assert.ok(step.method.length>10);assert.ok(step.input!==undefined);assert.ok(step.expected!==undefined);for(const taskId of step.tasks||[])assert.ok(TASK_PATHS[taskId]?.courses.includes(id),id+' ladder task '+taskId+' must map back to this course');}
 }
});

test('oral defense bank covers core research internship topics with follow-up chains',()=>{
 const expected=["u16","u32","u33","u37","u39","u41","u49","u54","u55","u72","u74","u75","u76","u85","u86","u87"];
 for(const id of expected){const bank=INTERVIEW_BANK[id];assert.ok(bank,id+' interview bank missing');assert.ok(GUIDES[id]);assert.ok(bank.questions.length>=2);for(const q of bank.questions){assert.ok(q.prompt.length>12);assert.ok(q.followups.length>=3);assert.ok(q.points.length>=3);assert.ok(q.pitfalls.length>=1);}}
});

test('all four research routes include a scoped capstone and measurable acceptance criteria',()=>{for(const route of ROUTES){assert.ok(route.capstone,route.id);assert.ok(route.capstone.brief.length>30);assert.ok(route.capstone.evidence.length>20);assert.ok(route.capstone.acceptance.length>20);}});
test('every course has a research oral-examination entry or a tailored fallback',()=>{
 for(const g of GUIDE_LIST){const bank=INTERVIEW_BANK[g.id];if(bank){assert.ok(bank.questions.length>=1);for(const q of bank.questions)assert.ok(q.followups.length>=3);}else{assert.ok(g.worked.question.length>10);assert.ok(g.boundary.length>10);assert.ok(g.transfer.length>10);}}
});

test('derivation lab equations parse and include substantive mathematical notation',()=>{
 for(const [id,d] of Object.entries(DERIVATION_LABS)){
  for(const step of d.steps){const result=validateMath(step[1]);assert.deepEqual(result.errors,[],id+' '+step[0]);assert.ok(result.count>=1,id+' '+step[0]+' should render equations');}
 }
});
test('five high-value courses include full mathematical derivations, assumptions, numerical checks and experiments',()=>{
 for(const id of ['u9','u16','u32','u39','u74']){const d=DERIVATION_LABS[id];assert.ok(d,id);assert.ok(d.assumptions.length>40);assert.ok(d.steps.length>=3);for(const step of d.steps){assert.ok(step[0].length>5);assert.ok(step[1].length>100);}assert.ok(d.checkpoint.question.length>20);assert.ok(d.checkpoint.answer.length>0);assert.ok(d.experiment.length>80);assert.ok(d.code.length>50);assert.ok(d.pitfalls.length>20);}
});
test('numerical derivation checkpoints are independently reproducible',()=>{
 const expected={u9:10000,u16:-5,u32:0.5,u39:2,u74:0.8};
 for(const [id,value] of Object.entries(expected))assert.equal(Number(DERIVATION_LABS[id].checkpoint.answer),value,id);
});
