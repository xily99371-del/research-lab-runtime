import test from 'node:test';
import assert from 'node:assert/strict';
import {HOT_IDS,referenceHot,suiteHot,randomHot,matchesHot} from '../lib/hot100-tasks.js';
import {HOT_PROBLEMS} from '../src/hot100-problems.js';
import {ALGORITHMS,suite,reference,matches,ROS} from '../lib/tasks.js';

test('40 new high-frequency tasks have unique metadata and server registrations',()=>{
 assert.equal(HOT_IDS.length,40);assert.equal(HOT_PROBLEMS.length,40);
 assert.equal(new Set(HOT_IDS).size,40);
 assert.equal(ALGORITHMS.length,96);
 for(const id of HOT_IDS){assert.ok(HOT_PROBLEMS.some(p=>p.id===id),id);assert.ok(suite(id).length>=18,id);}
});
test('representative array, window, stack and string examples',()=>{
 assert.deepEqual(referenceHot('three_sum',{nums:[-1,0,1,2,-1,-4]}),[[-1,-1,2],[-1,0,1]]);
 assert.equal(referenceHot('longest_substring',{text:'abcabcbb'}),3);
 assert.deepEqual(referenceHot('product_except_self',{nums:[1,2,3,4]}),[24,12,8,6]);
 assert.equal(referenceHot('container_water',{height:[1,8,6,2,5,4,8,3,7]}),49);
 assert.deepEqual(referenceHot('daily_temperatures',{temperatures:[73,74,75,71,69,72,76,73]}),[1,1,4,2,1,1,0,0]);
 assert.deepEqual(referenceHot('subarray_sum',{nums:[1,1,1],k:2}),2);
 assert.equal(referenceHot('longest_palindrome',{text:'babad'}),'bab');
});
test('linked-list and binary-tree examples',()=>{
 assert.deepEqual(referenceHot('reverse_linked_list',{values:[1,2,3]}),[3,2,1]);
 assert.deepEqual(referenceHot('merge_two_lists',{a:[1,2,4],b:[1,3,4]}),[1,1,2,3,4,4]);
 assert.equal(referenceHot('linked_list_cycle',{values:[3,2,0,-4],pos:1}),true);
 assert.deepEqual(referenceHot('reorder_list',{values:[1,2,3,4,5]}),[1,5,2,4,3]);
 assert.equal(referenceHot('max_depth_tree',{level:[3,9,20,null,null,15,7]}),3);
 assert.deepEqual(referenceHot('level_order_tree',{level:[3,9,20,null,null,15,7]}),[[3],[9,20],[15,7]]);
 assert.equal(referenceHot('validate_bst',{level:[2,1,3]}),true);
 assert.equal(referenceHot('kth_smallest_bst',{level:[3,1,4,null,2],k:1}),1);
 assert.equal(referenceHot('tree_diameter',{level:[1,2,3,4,5]}),3);
});
test('grid, graph, backtracking and dynamic-programming examples',()=>{
 assert.equal(referenceHot('number_of_islands',{grid:['11110','11010','11000','00000']}),1);
 assert.equal(referenceHot('rotting_oranges',{grid:[[2,1,1],[1,1,0],[0,1,1]]}),4);
 assert.equal(referenceHot('course_schedule',{numCourses:2,prerequisites:[[1,0],[0,1]]}),false);
 assert.equal(referenceHot('subsets',{nums:[1,2,3]}).length,8);
 assert.equal(referenceHot('permutations',{nums:[1,2,3]}).length,6);
 assert.deepEqual(referenceHot('combination_sum',{candidates:[2,3,6,7],target:7}),[[2,2,3],[7]]);
 assert.equal(referenceHot('word_search',{board:['ABCE','SFCS','ADEE'],word:'ABCCED'}),true);
 assert.equal(referenceHot('search_rotated',{nums:[4,5,6,7,0,1,2],target:0}),4);
 assert.equal(referenceHot('find_min_rotated',{nums:[3,4,5,1,2]}),1);
 assert.equal(referenceHot('climbing_stairs',{n:5}),8);
 assert.equal(referenceHot('house_robber',{nums:[2,7,9,3,1]}),12);
 assert.equal(referenceHot('unique_paths',{m:3,n:7}),28);
 assert.equal(referenceHot('decode_ways',{s:'226'}),3);
 assert.equal(referenceHot('longest_increasing_subsequence',{nums:[10,9,2,5,3,7,101,18]}),4);
});
test('all 40 tasks produce deterministic, serializable hidden test suites',()=>{
 for(const id of HOT_IDS){const cases=suiteHot(id);assert.ok(cases.length>=18,id);for(const c of cases){const expected=referenceHot(id,c.input);assert.equal(matchesHot(id,c.input,expected,c.expected),true,id);assert.doesNotThrow(()=>JSON.stringify(expected),id);}}
});
test('randomized cases are valid and never crash the reference implementation',()=>{
 for(const id of HOT_IDS)for(let i=0;i<80;i++){const input=randomHot(id),expected=referenceHot(id,input);assert.doesNotThrow(()=>JSON.stringify(expected),id);}
});
test('new task contracts are available through the shared server registry',()=>{
 for(const id of HOT_IDS){const cases=suite(id);assert.ok(cases.every(x=>'input'in x&&'expected'in x),id);for(const c of cases)assert.equal(matches(id,c.input,reference(id,c.input),c.expected),true,id);}
});
