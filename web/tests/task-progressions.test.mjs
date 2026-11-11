import test from 'node:test';import assert from 'node:assert/strict';
import {TASK_PROGRESSIONS,TASK_META} from '../src/task-progressions.js';
import {PROBLEMS} from '../src/problems.js';
import {EXPANDED_PROBLEMS} from '../src/expanded-problems.js';
test('all 60 tasks are placed exactly once in practical progressive paths',()=>{
 const all=[...PROBLEMS,...EXPANDED_PROBLEMS],ids=TASK_PROGRESSIONS.flatMap(p=>p.tasks);
 assert.equal(all.length,60);assert.equal(ids.length,60);assert.equal(new Set(ids).size,60);
 assert.deepEqual(new Set(ids),new Set(all.map(p=>p.id)));
 for(const path of TASK_PROGRESSIONS){assert.ok(path.tasks.length>=3,path.id);for(let i=0;i<path.tasks.length;i++){const m=TASK_META[path.tasks[i]];assert.equal(m.stage,i+1);assert.equal(m.stages,path.tasks.length);assert.equal(m.pathTitle,path.title);}}
});
test('progression tasks state an engineering or research application',()=>{
 for(const path of TASK_PROGRESSIONS){assert.ok(path.why.length>20,path.id);assert.ok(path.audience.length>3,path.id);}
});
