import {test} from 'node:test';
import assert from 'node:assert/strict';
import {normalize,emptyState,merge3} from '../src/state.js';
import {reference,matches,suite,ALGORITHMS,ROS} from '../lib/tasks.js';
import {PROBLEMS} from '../src/problems.js';
import {enrichCourses} from '../src/guided/catalog.js';
import {EXPANDED_PROBLEMS} from '../src/expanded-problems.js';
import {HOT_PROBLEMS} from '../src/hot100-problems.js';
import {LESSONS} from '../src/lessons.js';
import {ADVANCED_LESSONS} from '../src/advanced-lessons.js';
import {REMAINING_LESSONS} from '../src/remaining-lessons.js';
import {ROS_MIDDLEWARE_LESSON} from '../src/ros-middleware-lesson.js';
import {LEGACY_LESSON_FORMULAS} from '../src/lesson-formulas.js';
import fs from 'node:fs';
const courses=JSON.parse(fs.readFileSync(new URL('../data/courses.json',import.meta.url),'utf8'));
test('workspace normalization and safe keys',()=>{assert.deepEqual(normalize(null),emptyState());assert.deepEqual(normalize({papers:'bad'}).papers,[]);assert.equal(normalize({progress:{'__proto__':{x:1}}}).progress.x,undefined);});
test('disjoint device edits merge',()=>{const b=emptyState(),l=structuredClone(b),r=structuredClone(b);l.progress.u1={note:'A'};r.progress.u2={note:'B'};const x=merge3(b,l,r);assert.equal(x.conflicts.length,0);assert.equal(x.value.progress.u1.note,'A');assert.equal(x.value.progress.u2.note,'B');});
test('same field conflict is surfaced',()=>{const b={note:'old'},l={note:'mine'},r={note:'other'};assert.equal(merge3(b,l,r).conflicts.length,1);});
test('all 96 course IDs are unique and stable',()=>{assert.equal(courses.length,96);assert.equal(new Set(courses.map(x=>x.id)).size,96);assert.equal(courses[0].id,'u1');assert.equal(courses[95].id,'u96');});
test('task bank covers all algorithm IDs',()=>{const all=[...PROBLEMS,...EXPANDED_PROBLEMS,...HOT_PROBLEMS];assert.equal(all.length,100);assert.equal(new Set(all.map(p=>p.id)).size,100);assert.equal(all.filter(x=>x.langs.includes('ros2_python')).length,4);assert.deepEqual(new Set(all.filter(x=>x.langs.includes('ros2_python')).map(x=>x.id)),new Set(ROS));for(const id of ALGORITHMS){assert.ok(all.some(p=>p.id===id),id);}});
test('all 100 tasks appear in their course catalogue metadata',()=>{const all=[...PROBLEMS,...EXPANDED_PROBLEMS,...HOT_PROBLEMS];const catalog=enrichCourses(courses);const ids=new Set(catalog.flatMap(c=>c.taskIds));for(const p of all)assert.ok(ids.has(p.id),'course metadata missing '+p.id);});
test('every algorithm suite validates its reference',()=>{for(const id of ALGORITHMS){const s=suite(id);assert.ok(s.length>=10,id);for(const t of s)assert.equal(matches(id,t.input,reference(id,t.input),t.expected),true,id);}});
test('two-sum accepts reversed valid indices',()=>assert.equal(matches('two_sum',{nums:[2,7],target:9},[1,0],[0,1]),true));
test('attention mask produces finite zero row',()=>assert.deepEqual(reference('attention',{q:[[999]],k:[[999]],v:[[4]],mask:[[false]]}),[[0]]));
test('math lessons exist and expose sections',()=>{const all={...LESSONS,...ADVANCED_LESSONS};assert.ok(Object.keys(all).length>=20);for(const [id,l] of Object.entries(all)){assert.ok(l.sections.length>=3,id);assert.ok(l.questions.length>=2,id);}});
test('lesson IDs match course titles after curriculum repair',()=>{const all={...LESSONS,...ADVANCED_LESSONS};assert.match(all.u49.title,/Attention/);assert.match(all.u53.title,/LoRA/);assert.match(all.u70.title,/ROS/);assert.match(all.u72.title,/TF2/);assert.match(all.u86.title,/实验/);assert.match(all.u17.title,/决策树/);assert.match(all.u20.title,/反向传播/);assert.match(all.u31.title,/传统视觉/);assert.match(all.u32.title,/相机模型/);assert.match(all.u36.title,/Vision Transformer/);assert.match(all.u37.title,/VPR/);assert.match(all.u39.title,/点云/);assert.match(all.u40.title,/三维重建/);assert.match(all.u50.title,/LLM/);assert.match(all.u54.title,/CLIP/);assert.match(all.u55.title,/VLM/);assert.match(all.u57.title,/Agent/);assert.match(all.u75.title,/SLAM/);assert.match(all.u76.title,/Nav2/);});

// This validates the content schema only. It does not establish teaching depth,
// prerequisite mastery, learner progress, or full coverage of every formula.
test('96 curriculum records satisfy the content schema, not a pedagogical mastery claim',()=>{
 const all={...LESSONS,...ADVANCED_LESSONS,...REMAINING_LESSONS,...ROS_MIDDLEWARE_LESSON};
 assert.equal(Object.keys(all).length,96);
 for(const c of courses){
  const l=all[c.id];assert.ok(l,'missing lesson '+c.id);assert.ok(l.title&&l.title.length>2,c.id);
  const formula=l.formula||LEGACY_LESSON_FORMULAS[c.id];
  assert.ok(typeof formula==='string' && (formula.includes('\\(')||formula.includes('\\[')),c.id);
  assert.ok(l.sections.length>=3,c.id);assert.ok(l.questions.length>=3,c.id);assert.ok(l.links.length>=1,c.id);
  assert.ok((l.tasks?.length||c.practice?.length)>0,c.id);
  for(const section of l.sections){assert.ok(section[0].length>=2,c.id);assert.ok(section[1].length>20,c.id);}
 }
});
