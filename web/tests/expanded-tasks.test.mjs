import test from 'node:test';import assert from 'node:assert/strict';
import {EXPANDED_IDS,referenceAdvanced,expandedSuite,randomInputAdvanced,matchesAdvanced} from '../lib/expanded-tasks.js';
import {ALGORITHMS,suite,reference,matches,ROS} from '../lib/tasks.js';
import {EXPANDED_PROBLEMS} from '../src/expanded-problems.js';
import {PROBLEMS} from '../src/problems.js';
import {TASK_PATHS} from '../src/guided/assessment-path.js';
test('phase-one bank has exactly 60 unique tasks and covers 34 new IDs',()=>{
 assert.equal(EXPANDED_IDS.length,34);assert.equal(EXPANDED_PROBLEMS.length,34);
 const all=[...PROBLEMS,...EXPANDED_PROBLEMS];assert.equal(all.length,60);assert.equal(new Set(all.map(x=>x.id)).size,60);
 assert.equal(ALGORITHMS.length,96);assert.equal(ROS.length,4);
});
test('every expanded task has course mapping, Python/C++ contract and non-empty test suite',()=>{
 for(const id of EXPANDED_IDS){const p=EXPANDED_PROBLEMS.find(x=>x.id===id);assert.ok(p,id);assert.deepEqual(p.langs,['python','cpp'],id);assert.ok(TASK_PATHS[id]?.courses.length,id);assert.ok(suite(id).length>=17,id);}
});
test('all expanded reference functions are deterministic and JSON serializable',()=>{
 for(const id of EXPANDED_IDS){const cases=suite(id);for(const c of cases){const expected=reference(id,c.input);assert.equal(matches(id,c.input,expected,c.expected),true,id);assert.doesNotThrow(()=>JSON.stringify(expected),id);}}
});
test('vision geometry invariants: project/unproject roundtrip, rigid transforms and normalized plane distances',()=>{
 const p=[.4,-.2,3],uv=referenceAdvanced('project_point',{point:p,fx:400,fy:300,cx:320,cy:240});
 const back=referenceAdvanced('unproject_point',{pixel:uv,depth:p[2],fx:400,fy:300,cx:320,cy:240});
 assert.ok(back.every((x,i)=>Math.abs(x-p[i])<1e-9));
 const d1=referenceAdvanced('plane_residual',{points:[[1,2,4]],plane:[0,0,1,-1]})[0];
 const d2=referenceAdvanced('plane_residual',{points:[[1,2,4]],plane:[0,0,5,-5]})[0];assert.equal(d1,3);assert.equal(d2,3);
});
test('point cloud operations have stable tie, voxel and empty-set contracts',()=>{
 assert.deepEqual(referenceAdvanced('fps',{points:[[0,0],[1,0],[2,0],[3,0]],k:3,start:0}),[0,3,1]);
 assert.deepEqual(referenceAdvanced('knn_points',{points:[[0,0],[1,0],[-1,0]],query:[0,0],k:2}),[0,1]);
 assert.deepEqual(referenceAdvanced('voxel_downsample',{points:[[-.1,0,0],[.1,0,0]],voxel_size:1}),[[-.1,0,0],[.1,0,0]]);
 assert.equal(referenceAdvanced('chamfer_distance',{a:[],b:[[0,0,0]]}),null);
});
test('ML and multimodal functions satisfy basic numerical invariants',()=>{
 const p=referenceAdvanced('softmax',{logits:[10000,10001,10002]});assert.ok(p.every(Number.isFinite));assert.ok(Math.abs(p.reduce((a,b)=>a+b,0)-1)<1e-12);
 assert.equal(referenceAdvanced('kv_cache_bytes',{layers:1,batch:1,tokens:10,kv_heads:2,head_dim:4,bytes_per_value:2}),320);
 assert.ok(Math.abs(referenceAdvanced('contrastive_loss',{logits:[0,0],positive_index:0})-Math.log(2))<1e-12);
 assert.deepEqual(referenceAdvanced('rotary_pair',{x:1,y:0,angle:Math.PI/2}).map(x=>Math.round(x)),[0,1]);
});
test('robotics and research metrics have explicit edge cases',()=>{
 assert.deepEqual(referenceAdvanced('occupancy_grid_index',{x:-.1,y:0,resolution:1,origin:[0,0],width:4,height:4}),null);
 assert.equal(referenceAdvanced('path_length',{points:[[0,0,0]]}),0);
 assert.equal(referenceAdvanced('recall_at_k',{ranked:['a','a','b'],relevant:['a','b'],k:2}),.5);
 assert.ok(Math.abs(referenceAdvanced('average_precision',{ranked:['a','a','b'],relevant:['a','b']})-5/6)<1e-12);
 assert.equal(referenceAdvanced('paired_mean_difference',{baseline:[1,2],method:[2,4]}),1.5);
});
test('expanded random generators remain valid over repeated randomized suites',()=>{for(const id of EXPANDED_IDS){for(let i=0;i<30;i++){const input=randomInputAdvanced(id),expected=referenceAdvanced(id,input);assert.equal(matchesAdvanced(id,input,expected,expected),true,id);assert.doesNotThrow(()=>JSON.stringify(expected),id);}}});
