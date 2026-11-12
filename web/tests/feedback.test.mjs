import test from 'node:test';import assert from 'node:assert/strict';import{humanizeReport,diagnoseReport}from'../src/guided/feedback.js';
test('runtime and learner errors are not all mislabeled as service failures',()=>{assert.match(humanizeReport({stage:'compile',error:'compile failed'}).title,/编译/);assert.match(humanizeReport({status:'timeout',error:'timeout'}).title,/时间/);assert.match(humanizeReport({status:'error',stage:'infrastructure',error:'offline'}).title,/服务/);assert.match(humanizeReport({stage:'run',exit_code:1,error:'exception'}).title,/运行/);assert.match(humanizeReport({pass:true}).title,/行为/);assert.match(humanizeReport({stage:'running',error:'pending'}).title,/正在/);});

test('public-case diagnostics locate the first structural or numeric mismatch',()=>{
 const d=diagnoseReport({cases:[{pass:false,input:{x:1},expected:[1,2],actual:[1,3]}]});assert.ok(d);assert.equal(d.title,'第一处可定位差异：$[1]');assert.match(d.detail,/数值不一致/);
 const length=diagnoseReport({cases:[{pass:false,input:{x:1},expected:[1,2],actual:[1]}]});assert.match(length.title,/length/);
 assert.equal(diagnoseReport({cases:[{pass:false,name:'隐藏测试'}]}),null);
});
