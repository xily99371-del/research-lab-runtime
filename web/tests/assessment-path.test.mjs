import test from 'node:test';
import assert from 'node:assert/strict';
import {PROBLEMS} from '../src/problems.js';
import {EXPANDED_PROBLEMS} from '../src/expanded-problems.js';
import {HOT_PROBLEMS} from '../src/hot100-problems.js';
import {GUIDES} from '../src/guided/catalog.js';
import {TASK_PATHS,taskReadiness,nextReadinessStep} from '../src/guided/assessment-path.js';
import {ALGORITHMS,ROS,publicSuite} from '../lib/tasks.js';
import {COMPLEXITY_GUIDES} from '../src/task-complexity.js';
import {stageUnlockReason} from '../src/guided/model.js';

test('every automatic task has an explicit course path',()=>{
 assert.equal(Object.keys(TASK_PATHS).length,PROBLEMS.length+EXPANDED_PROBLEMS.length+HOT_PROBLEMS.length);
 for(const p of [...PROBLEMS,...EXPANDED_PROBLEMS,...HOT_PROBLEMS]){const path=TASK_PATHS[p.id];assert.ok(path,p.id);assert.ok(path.courses.length>0,p.id);assert.ok(path.why.length>5,p.id);}
});
test('readiness requires both worked-example check and guided practice evidence',()=>{
 const progress={u9:{learning:{checks:{worked:{passed:true}}}}};
 let r=taskReadiness('matrix_multiply',progress);
 assert.equal(r.ready,false);assert.equal(r.checksDone,1);assert.equal(r.checksTotal,2);
 assert.deepEqual(nextReadinessStep('matrix_multiply',progress),{courseId:'u9',stage:2,reason:'再完成带提示练习并提交实际结果'});
 progress.u9.learning.evidence={guided:{output:'[11,4]',explanation:'checked',submittedAt:'2026-11-11T00:00:00Z'}};
 r=taskReadiness('matrix_multiply',progress);assert.equal(r.ready,true);assert.equal(r.checksDone,2);assert.equal(nextReadinessStep('matrix_multiply',progress),null);
});
test('multi-course tasks require each mapped course and identify the next missing step',()=>{
 const progress={u9:{learning:{checks:{worked:{passed:true}},evidence:{guided:{submittedAt:'x'}}}},u49:{learning:{checks:{worked:{passed:true}}}}};
 let r=taskReadiness('attention',progress);assert.equal(r.ready,false);assert.equal(r.completed,1);assert.equal(r.total,2);
 assert.deepEqual(nextReadinessStep('attention',progress),{courseId:'u49',stage:2,reason:'再完成带提示练习并提交实际结果'});
 progress.u49.learning.evidence={guided:{submittedAt:'y'}};
 assert.equal(taskReadiness('attention',progress).ready,true);
});
test('no old self-check, viewed stage, or unrelated online pass grants readiness',()=>{
 const progress={u9:{theory:true,implementation:true,research:true,learning:{stage:4}},u49:{learning:{stage:4}}};
 assert.equal(taskReadiness('attention',progress).ready,false);
 assert.equal(taskReadiness('attention',progress).checksDone,0);
});
test('all mapped task routes point to actual existing course IDs',()=>{
 const valid=new Set(Object.keys(GUIDES));
 for(const [task,path]of Object.entries(TASK_PATHS))for(const id of path.courses)assert.ok(valid.has(id),task+':'+id);
});

test('public sample API source contains only explicit public cases',()=>{
 for(const id of ALGORITHMS){const samples=publicSuite(id);assert.ok(samples.length>=1,id+' has no public sample');assert.ok(samples.every(x=>x.public===true&&x.name.startsWith('公开样例')&&x.input!==undefined&&Object.hasOwn(x,'expected')),id);}
 for(const id of ROS)assert.deepEqual(publicSuite(id),[]);
});
test('graph search readiness includes the required data-structure and graph units',()=>{
 for(const id of ['bfs','dijkstra','astar','topological_sort','connected_components']){
  assert.ok(TASK_PATHS[id].courses.includes('u2'),id+' should include data structures');
  assert.ok(TASK_PATHS[id].courses.includes('u3'),id+' should include graph theory');
 }
});

test('sample endpoint serves only structured public examples and rejects unsupported tasks',async()=>{
 const {default:handler}=await import('../api/samples.js');
 const makeRes=()=>({statusCode:200,headers:{},body:null,setHeader(k,v){this.headers[k]=v;},status(n){this.statusCode=n;return this;},json(v){this.body=v;return this;}});
 const ok=makeRes();await handler({method:'GET',query:{task_id:'two_sum'}},ok);
 assert.equal(ok.statusCode,200);assert.equal(ok.body.task_id,'two_sum');assert.ok(ok.body.samples.length>=1);
 for(const sample of ok.body.samples)assert.deepEqual(Object.keys(sample).sort(),['expected','input','name']);
 const ros=makeRes();await handler({method:'GET',query:{task_id:'ros_topic'}},ros);assert.equal(ros.statusCode,404);
 const method=makeRes();await handler({method:'POST',query:{task_id:'two_sum'}},method);assert.equal(method.statusCode,405);
});

test('course stages unlock only after required learning evidence',()=>{
 const p={};assert.ok(stageUnlockReason(p,'u16',2));p.u16={learning:{checks:{worked:{passed:true}}}};assert.equal(stageUnlockReason(p,'u16',2),null);assert.ok(stageUnlockReason(p,'u16',3));p.u16.learning.evidence={guided:{submittedAt:'x'}};assert.equal(stageUnlockReason(p,'u16',3),null);assert.ok(stageUnlockReason(p,'u16',4));p.u16.learning.evidence.independent={submittedAt:'y'};assert.equal(stageUnlockReason(p,'u16',4),null);
});

test('representative complexity guides have explicit time, space and rationale',()=>{
 for(const id of ['two_sum','bfs','dijkstra','attention','linear_regression_step','project_point','fps','chamfer_distance','contrastive_loss']){const g=COMPLEXITY_GUIDES[id];assert.ok(g,id);assert.ok(g.time.includes('O('));assert.ok(g.space.includes('O('));assert.ok(g.why.length>15);}
});

test('task center implements a distraction-free full-screen coding workspace',async()=>{
 const fs=await import('node:fs');
 const app=fs.readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
 const css=fs.readFileSync(new URL('../src/style.css',import.meta.url),'utf8');
 assert.match(app,/进入沉浸式做题窗口/);
 assert.match(app,/退出/);
 assert.match(app,/上一题/);assert.match(app,/下一题/);
 assert.match(css,/\.task-focus-mode \.task-list\{display:none/);
 assert.match(css,/\.task-focus-mode \.task-run-actions\{position:sticky/);
 assert.match(css,/@media\(max-width:700px\)/);
});

test('immersive focus header keeps exit and navigation controls as visible siblings',async()=>{
 const fs=await import('node:fs');const app=fs.readFileSync(new URL('../src/app.js',import.meta.url),'utf8');const css=fs.readFileSync(new URL('../src/style.css',import.meta.url),'utf8');
 assert.match(app,/box\('task-focus-bar',[\s\S]*?box\('task-focus-heading'[\s\S]*?box\('actions'/);
 assert.match(app,/window\.scrollTo\(0,0\);render\(\);window\.scrollTo\(0,0\)/);
 assert.match(css,/\.task-focus-mode \.layout\{position:fixed;inset:0/);
 assert.match(css,/\.task-focus-mode \.task-focus-bar\{z-index:100;top:0/);
});
