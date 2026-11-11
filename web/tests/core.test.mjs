import {test} from 'node:test';import assert from 'node:assert/strict';import {normalize,emptyState,merge3} from '../src/state.js';import {reference,matches,suite,ALGORITHMS} from '../lib/tasks.js';
test('account data normalization',()=>{assert.deepEqual(normalize(null),emptyState());assert.deepEqual(normalize({papers:'bad'}).papers,[]);});
test('disjoint device edits merge',()=>{let b=emptyState(),l=structuredClone(b),r=structuredClone(b);l.progress.u1={note:'A'};r.progress.u2={note:'B'};let x=merge3(b,l,r);assert.equal(x.conflicts.length,0);assert.equal(x.value.progress.u1.note,'A');assert.equal(x.value.progress.u2.note,'B');});
test('same note conflict retained rather than overwritten',()=>{const b={note:'old'},l={note:'mine'},r={note:'other'};assert.equal(merge3(b,l,r).conflicts.length,1);});
test('every algorithm suite validates reference',()=>{for(const id of ALGORITHMS){const s=suite(id);assert.ok(s.length>10);for(const t of s)assert.equal(matches(id,t.input,reference(id,t.input),t.expected),true);}});
test('two-sum reversed valid indices accepted',()=>assert.equal(matches('two_sum',{nums:[2,7],target:9},[1,0],[0,1]),true));
test('masked attention returns zero, no NaN',()=>assert.deepEqual(reference('attention',{q:[[999]],k:[[999]],v:[[4]],mask:[[false]]}),[[0]]));
