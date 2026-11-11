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
