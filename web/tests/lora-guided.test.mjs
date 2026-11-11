import {test} from 'node:test';
import assert from 'node:assert/strict';
import katex from 'katex';
import {LORA_GUIDED} from '../src/lora-guided.js';
import {LESSONS} from '../src/lessons.js';

const expressions = value => [...value.matchAll(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g)].map(m => m[1] ?? m[2]);

test('LoRA body math parses in every marked expression, not only the top panel', () => {
  assert.equal(LESSONS.u53, LORA_GUIDED);
  let total = 0, sectionsWithMath = 0;
  for (const [heading, body] of LORA_GUIDED.sections) {
    const math = expressions(body);
    if (math.length) sectionsWithMath++;
    for (const expression of math) {
      assert.ok(expression.trim(), heading);
      assert.doesNotThrow(() => katex.renderToString(expression, {throwOnError: true, strict: 'error'}), heading + ': ' + expression);
      total++;
    }
    assert.doesNotMatch(body, /R\^\(dout|∂L\/∂B|∂L\/∂A/);
  }
  assert.ok(sectionsWithMath >= 10, 'Math must be authored in body sections');
  assert.ok(total >= 35, 'The guided lesson includes intermediate mathematical steps');
});

test('LoRA pilot provides prerequisites, staged tasks, checks and an explicit scope boundary', () => {
  assert.deepEqual(LORA_GUIDED.prerequisites, ['u9','u20','u21']);
  assert.equal(LORA_GUIDED.instructionalStatus, 'guided-pilot');
  assert.ok(LORA_GUIDED.sections.length >= 12);
  const text = LORA_GUIDED.sections.map(x => x[1]).join('\n');
  for (const marker of ['任务A','任务B','任务C','核对','ValueError','目前没有新增 LoRA 在线判题入口']) assert.ok(text.includes(marker), marker);
});

// Independent, small numerical checks for the published worked example.
const W = [[1,0,0],[0,1,0]], A = [[1,0,-1]], B = [[2],[-1]], x = [2,-1,3], target = [1,-2];
const mv = (m,x) => m.map(row => row.reduce((s,v,j)=>s+v*x[j],0));
const add = (a,b) => a.map((v,j)=>v+b[j]);
const forward = (a,b,input=x,s=1) => add(mv(W,input),mv(b,mv(a,input)).map(v=>s*v));
const loss = (a,b) => forward(a,b).reduce((v,y,i)=>v+0.5*(y-target[i])**2,0);
const close = (a,b,tol=1e-7) => assert.ok(Math.abs(a-b)<=tol, `${a} != ${b}`);

test('LoRA forward, parameter counts, scaling and merged matrix match the lesson', () => {
  assert.deepEqual(mv(A,x),[-1]);
  assert.deepEqual(forward(A,B),[0,0]);
  assert.deepEqual(forward(A,B,[2,-1,4]),[-2,1]);
  assert.deepEqual(forward(A,B,x,2),[-2,1]);
  const merged = W.map((row,i)=>row.map((w,j)=>w+B[i][0]*A[0][j]));
  assert.deepEqual(merged,[[3,0,-2],[-1,1,1]]);
  for (const input of [[2,-1,3],[0,0,0],[3,1,-2],[-7,2,9]]) assert.deepEqual(mv(merged,input),forward(A,B,input));
  assert.equal(1024*1024,1048576);
  assert.equal(8*(1024+1024),16384);
  assert.equal(16384/1048576,1/64);
});

test('LoRA analytic example gradients agree with finite differences', () => {
  close(loss(A,B),2.5);
  const eps=1e-6, ga=[[-8,4,-12]],gb=[[1],[-2]];
  for(const [which,expected] of [['a',ga],['b',gb]]) {
    const m=which==='a'?A:B;
    for(let i=0;i<m.length;i++)for(let j=0;j<m[i].length;j++) {
      const lo=structuredClone(m),hi=structuredClone(m);lo[i][j]-=eps;hi[i][j]+=eps;
      const fd=which==='a'?(loss(hi,B)-loss(lo,B))/(2*eps):(loss(A,hi)-loss(A,lo))/(2*eps);
      close(fd,expected[i][j]);
    }
  }
});

test('LoRA zero-B initialization first and second steps match the explanation', () => {
  const b0=[[0],[0]],z=mv(A,x)[0],y0=forward(A,b0),d0=y0.map((v,i)=>v-target[i]);
  const gb0=d0.map(d=>[d*z]);
  assert.deepEqual(gb0,[[-1],[-1]]);
  const b1=gb0.map(([g])=>[-0.1*g]);
  const d1=forward(A,b1).map((v,i)=>v-target[i]);
  const dz=b1.reduce((s,row,i)=>s+row[0]*d1[i],0);
  x.map(v=>dz*v).forEach((g,i)=>close(g,[0.36,-0.18,0.54][i]));
});
