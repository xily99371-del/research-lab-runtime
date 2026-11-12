import test from 'node:test';
import assert from 'node:assert/strict';
import {PROBLEMS} from '../src/problems.js';
import {EXPANDED_PROBLEMS} from '../src/expanded-problems.js';
import {HOT_PROBLEMS} from '../src/hot100-problems.js';
import {GUIDES,EXACT_LINKS} from '../src/guided/catalog.js';
import {TASK_PATHS,taskReadiness,nextReadinessStep} from '../src/guided/assessment-path.js';

test('every automatic task has an explicit course path',()=>{
 assert.equal(Object.keys(TASK_PATHS).length,PROBLEMS.length+EXPANDED_PROBLEMS.length+HOT_PROBLEMS.length);
 for(const p of [...PROBLEMS,...EXPANDED_PROBLEMS,...HOT_PROBLEMS]){const path=TASK_PATHS[p.id];assert.ok(path,p.id);assert.ok(path.courses.length>0,p.id);assert.ok(path.why.length>5,p.id);}
});
test('every course-linked assessment is visible in that course readiness path',()=>{
 for(const [course,ids] of Object.entries(EXACT_LINKS))for(const id of ids)assert.ok(TASK_PATHS[id]?.courses.includes(course),course+' → '+id);
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
