function firstDifference(expected,actual,path='
 const stage=String(report.stage||''),status=String(report.status||'');
 if(stage==='running')return {title:'正在评测',message:'正在创建隔离环境并执行测试。',help:'结果返回前可以浏览其他课程；代码草稿已经保存。'};
 if(status==='timeout'||report.timed_out)return {title:'达到运行时间限制',message:report.error||'程序未在时限内返回。',help:'先检查无限循环、阻塞等待和退出条件，再分析复杂度；ROS还应检查spin与future等待。'};
 if(stage==='compile')return {title:'编译阶段未通过',message:report.error||'代码尚未运行到题目测试。',help:'先看第一条编译错误，核对函数签名、括号、类型和依赖；暂时不要先改算法。'};
 if(stage==='infrastructure'||status==='error')return {title:'评测服务未完成',message:report.error||'执行或结果保存服务异常。',help:'这类故障不代表算法错误。保留草稿和报告，检查服务状态后再提交。'};
 if(report.exit_code!==undefined&&report.exit_code!==0)return {title:'程序运行异常',message:report.error||'程序启动后异常退出。',help:'从堆栈中第一处用户代码检查输入结构、索引、shape或数值；用最小公开样例复现。'};
 if(report.error)return {title:'请求未完成',message:String(report.error),help:'检查登录、任务与语言匹配以及提交频率；请求失败不计为能力验收失败。'};
 if(report.pass===true||status==='passed')return {title:'本题行为测试通过',message:'仅确认当前用例中的程序行为，不自动证明复杂度、独立性或研究迁移。',help:'在课程独立实现阶段记录代码、实际结果和解释，再做改变条件后的任务。'};
 return {title:'部分测试未通过',message:'先用公开输入核对，再检查边界与数值稳定性。',help:'比较期望/实际输出，定位第一处差异；隐藏测试不会直接泄露答案。必要时回到对应课程逐层展开提示。'};
}
){if(typeof expected!==typeof actual)return {path,expected,actual,kind:'type'};if(Array.isArray(expected)){if(!Array.isArray(actual))return {path,expected,actual,kind:'type'};if(expected.length!==actual.length)return {path:path+'.length',expected:expected.length,actual:actual.length,kind:'length'};for(let i=0;i<expected.length;i++){const d=firstDifference(expected[i],actual[i],path+'['+i+']');if(d)return d;}return null;}if(expected&&typeof expected==='object'){if(!actual||typeof actual!=='object')return {path,expected,actual,kind:'type'};for(const k of Object.keys(expected)){if(!(k in actual))return {path:path+'.'+k,expected:expected[k],actual:undefined,kind:'missing'};const d=firstDifference(expected[k],actual[k],path+'.'+k);if(d)return d;}return null;}if(typeof expected==='number'&&typeof actual==='number'&&Math.abs(expected-actual)<=1e-6*Math.max(1,Math.abs(expected)))return null;return Object.is(expected,actual)?null:{path,expected,actual,kind:typeof expected==='number'?'numeric':'value'};}
export function diagnoseReport(report={}){const failed=(report.cases||[]).find(c=>!c.pass&&c.input!==undefined&&Object.hasOwn(c,'expected'));if(!failed)return null;let d;try{d=firstDifference(failed.expected,failed.actual);}catch{return null;}if(!d)return {title:'公开样例未通过',detail:'输出整体不匹配。请检查返回结构、额外输出和序列化格式。'};const hint=d.kind==='type'?'该位置的数据类型不一致，检查整数/浮点数、数组/标量及null约定。':d.kind==='length'?'数组长度不一致，检查循环边界、过滤条件和是否漏掉/重复处理元素。':d.kind==='missing'?'结果缺少字段，检查输出结构和条件分支。':d.kind==='numeric'?'数值不一致，检查公式、单位、索引、更新顺序和浮点稳定性。':'值不一致，先用最小输入手算中间状态，再逐步对照代码。';return {title:'第一处可定位差异：'+d.path,detail:hint+' 期望：'+JSON.stringify(d.expected)+'；实际：'+JSON.stringify(d.actual)};}
export function humanizeReport(report={}) {
 const stage=String(report.stage||''),status=String(report.status||'');
 if(stage==='running')return {title:'正在评测',message:'正在创建隔离环境并执行测试。',help:'结果返回前可以浏览其他课程；代码草稿已经保存。'};
 if(status==='timeout'||report.timed_out)return {title:'达到运行时间限制',message:report.error||'程序未在时限内返回。',help:'先检查无限循环、阻塞等待和退出条件，再分析复杂度；ROS还应检查spin与future等待。'};
 if(stage==='compile')return {title:'编译阶段未通过',message:report.error||'代码尚未运行到题目测试。',help:'先看第一条编译错误，核对函数签名、括号、类型和依赖；暂时不要先改算法。'};
 if(stage==='infrastructure'||status==='error')return {title:'评测服务未完成',message:report.error||'执行或结果保存服务异常。',help:'这类故障不代表算法错误。保留草稿和报告，检查服务状态后再提交。'};
 if(report.exit_code!==undefined&&report.exit_code!==0)return {title:'程序运行异常',message:report.error||'程序启动后异常退出。',help:'从堆栈中第一处用户代码检查输入结构、索引、shape或数值；用最小公开样例复现。'};
 if(report.error)return {title:'请求未完成',message:String(report.error),help:'检查登录、任务与语言匹配以及提交频率；请求失败不计为能力验收失败。'};
 if(report.pass===true||status==='passed')return {title:'本题行为测试通过',message:'仅确认当前用例中的程序行为，不自动证明复杂度、独立性或研究迁移。',help:'在课程独立实现阶段记录代码、实际结果和解释，再做改变条件后的任务。'};
 return {title:'部分测试未通过',message:'先用公开输入核对，再检查边界与数值稳定性。',help:'比较期望/实际输出，定位第一处差异；隐藏测试不会直接泄露答案。必要时回到对应课程逐层展开提示。'};
}
