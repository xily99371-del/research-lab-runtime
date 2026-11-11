import test from 'node:test';
import assert from 'node:assert/strict';
import {CORE100_IDS,referenceCore,coreSuite,randomInputCore,matchesCore} from '../lib/core100-tasks.js';
import {ALGORITHMS,reference,suite,matches,ROS} from '../lib/tasks.js';
import {PROBLEMS} from '../src/problems.js';
import {EXPANDED_PROBLEMS} from '../src/expanded-problems.js';
import {CORE100_PROBLEMS} from '../src/core100-problems.js';
import {TASK_META,applyTaskMeta,TIER_INFO} from '../src/task-meta.js';
import {TASK_PATHS} from '../src/guided/assessment-path.js';
import {GUIDE_LIST,enrichCourses} from '../src/guided/catalog.js';
import fs from 'node:fs';
const courses=JSON.parse(fs.readFileSync(new URL('../data/courses.json',import.meta.url),'utf8'));

test('the full assessment catalogue contains 100 unique tasks in three practical tracks',()=>{
 const all=[...PROBLEMS,...EXPANDED_PROBLEMS,...CORE100_PROBLEMS];
 const enriched=applyTaskMeta(all);
 assert.equal(CORE100_IDS.length,40);assert.equal(CORE100_PROBLEMS.length,40);
 assert.equal(all.length,100);assert.equal(new Set(all.map(p=>p.id)).size,100);
 assert.equal(ALGORITHMS.length,96);assert.equal(ROS.length,4);
 assert.equal(all.filter(p=>p.langs.includes('ros2_python')).length,4);
 assert.equal(enriched.filter(p=>p.path==='核心算法').length,60);
 assert.equal(enriched.filter(p=>p.path==='AI/机器人专题').length,36);
 assert.equal(enriched.filter(p=>p.path==='ROS 2系统集成').length,4);
});

test('every core task has a five-tier path, practical application and prerequisite course link',()=>{
 const all=[...PROBLEMS,...EXPANDED_PROBLEMS,...CORE100_PROBLEMS];
 const linked=new Set(enrichCourses(courses).flatMap(c=>c.taskIds||[]));
 const ranked=applyTaskMeta(all);
 for(const p of ranked){assert.ok(TASK_META[p.id],p.id);assert.ok(TASK_PATHS[p.id]?.courses.length,p.id);assert.ok(linked.has(p.id),p.id);assert.ok(TIER_INFO[TASK_META[p.id].tier],p.id);assert.ok(p.application.length>12,p.id);assert.notEqual(p.application,'训练问题建模、边界处理与复杂度分析。',p.id);}
 for(const p of CORE100_PROBLEMS){assert.deepEqual(p.langs,['python','cpp'],p.id);assert.ok(p.application.length>8,p.id);assert.ok(p.pattern.length>1,p.id);}
 assert.equal(ranked.length,100);assert.deepEqual(new Set(ranked.map(p=>p.id)),new Set(all.map(p=>p.id)));assert.deepEqual([1,2,3,4,5].map(t=>ranked.filter(p=>p.path==='核心算法'&&p.tier===t).length),[9,18,18,12,3]);
});

test('all 40 new high-frequency algorithm tasks have working randomized test suites',()=>{
 for(const id of CORE100_IDS){const cases=coreSuite(id);assert.ok(cases.length>=18,id);for(const c of cases){const expected=referenceCore(id,c.input);assert.equal(matchesCore(id,c.input,expected,c.expected),true,id);assert.doesNotThrow(()=>JSON.stringify(expected),id);}}
});

test('linked-list pointer tasks preserve node-index semantics and edge cases',()=>{
 assert.deepEqual(referenceCore('reverse_linked_list',{nodes:[{val:1,next:1},{val:2,next:2},{val:3,next:null}],head:0}),{head:2,next:[null,0,1]});
 assert.deepEqual(referenceCore('remove_nth_from_end',{nodes:[{val:1,next:1},{val:2,next:2},{val:3,next:3},{val:4,next:4},{val:5,next:null}],head:0,n:2}),{head:0,next:[1,2,4,null,null]});
 assert.deepEqual(referenceCore('remove_nth_from_end',{nodes:[{val:7,next:null}],head:0,n:1}),{head:null,next:[null]});
 assert.deepEqual(referenceCore('merge_two_lists',{nodes:[{val:1,next:1},{val:3,next:null},{val:1,next:3},{val:2,next:null}],headA:0,headB:2}),{head:0,next:[2,null,3,1]});
 assert.equal(referenceCore('linked_list_cycle',{next:[1,2,3,1],head:0}),true);
 assert.equal(referenceCore('linked_list_cycle',{next:[1,2,null],head:0}),false);
});

test('sliding windows, monotonic stacks and two-pointer classics match known examples',()=>{
 assert.equal(referenceCore('min_window',{s:'ADOBECODEBANC',t:'ABC'}),'BANC');
 assert.deepEqual(referenceCore('daily_temperatures',{temperatures:[73,74,75,71,69,72,76,73]}),[1,1,4,2,1,1,0,0]);
 assert.equal(referenceCore('largest_rectangle',{heights:[2,1,5,6,2,3]}),10);
 assert.deepEqual(referenceCore('three_sum',{nums:[-1,0,1,2,-1,-4]}),[[-1,-1,2],[-1,0,1]]);
 assert.equal(referenceCore('container_water',{height:[1,8,6,2,5,4,8,3,7]}),49);
 assert.equal(referenceCore('longest_substring',{text:'abcabcbb'}),3);
});

test('tree, graph and grid tasks use explicit structural contracts',()=>{
 const root={val:3,left:{val:9,left:null,right:null},right:{val:20,left:{val:15,left:null,right:null},right:{val:7,left:null,right:null}}};
 assert.equal(referenceCore('max_depth_tree',{root}),3);
 assert.deepEqual(referenceCore('level_order',{root}),[[3],[9,20],[15,7]]);
 assert.equal(referenceCore('num_islands',{grid:['11110','11010','11000','00000']}),1);
 assert.equal(referenceCore('word_ladder_length',{beginWord:'hit',endWord:'cog',wordList:['hot','dot','dog','lot','log','cog']}),5);
 assert.equal(referenceCore('course_schedule',{numCourses:2,prerequisites:[[1,0],[0,1]]}),false);
 assert.equal(referenceCore('oranges_rotting',{grid:[[2,1,1],[1,1,0],[0,1,1]]}),4);
});

test('dynamic programming and binary-search challenge examples are correct',()=>{
 assert.equal(referenceCore('house_robber',{nums:[2,7,9,3,1]}),12);
 assert.equal(referenceCore('unique_paths',{m:3,n:7}),28);
 assert.equal(referenceCore('min_path_sum',{grid:[[1,3,1],[1,5,1],[4,2,1]]}),7);
 assert.equal(referenceCore('jump_game',{nums:[3,2,1,0,4]}),false);
 assert.equal(referenceCore('gas_station',{gas:[1,2,3,4,5],cost:[3,4,5,1,2]}),3);
 assert.equal(referenceCore('search_rotated',{nums:[4,5,6,7,0,1,2],target:0}),4);
 assert.equal(referenceCore('find_min_rotated',{nums:[3,4,5,1,2]}),1);
 assert.equal(referenceCore('median_two_sorted_arrays',{nums1:[1,2],nums2:[3,4]}),2.5);
});

test('the server exposes every new task through the same Python/C++ evaluation contract',()=>{
 for(const id of CORE100_IDS){assert.ok(ALGORITHMS.includes(id),id);assert.ok(suite(id).length>=18,id);for(const c of suite(id).slice(0,3))assert.equal(matches(id,c.input,reference(id,c.input),c.expected),true,id);}
});
