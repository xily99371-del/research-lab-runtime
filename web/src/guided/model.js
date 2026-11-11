// Learning content is separate from server-verified code verdicts.
export const STAGES = ['入口检查','讲解与例题','带提示练习','独立实现','迁移与复习'];
export function unit(id, prerequisites, goal, question, answer, steps, insight, signature, fixture, hints, variation, transfer, boundary) {
  if (!id || !Array.isArray(steps) || steps.length < 3 || hints.length !== 3) throw Error('Invalid guided unit '+id);
  return {id, prerequisites, goal, worked:{question,answer:String(answer),steps,insight},
    guided:{signature,fixture,hints}, independent:variation, transfer,boundary,
    evidence:['实现代码或仓库链接','实际输入、输出与测试结果','不借助答案写出的解释及一个失败案例']};
}
export function normalizeAnswer(value) {
  return String(value??'').normalize('NFKC').replace(/\s+/g,'').replace(/[，、；]/g,',').replace(/[。]/g,'').toLowerCase();
}
export function checkAnswer(given, expected) {
  const a=normalizeAnswer(given),b=normalizeAnswer(expected);
  if(!a)return false;
  if(a===b)return true;
  const numeric=/^-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/;
  return numeric.test(a)&&numeric.test(b)&&Math.abs(Number(a)-Number(b))<=1e-6*Math.max(1,Math.abs(Number(b)));
}
export function progressFor(progress,id){return progress[id]?.learning||{};}
export function learnerStatus(progress,id,jobs=[],taskIds=[]) {
 const p=progressFor(progress,id),serverPassed=jobs.some(j=>j.status==='passed'&&taskIds.includes(j.task_id));
 return {started:!!(p.stage||p.checks||p.evidence),checked:!!p.checks?.worked?.passed,
  independentSubmitted:!!p.evidence?.independent?.submittedAt,
  transferred:!!p.evidence?.transfer?.submittedAt,serverPassed,
  legacy:!!(progress[id]?.theory||progress[id]?.implementation||progress[id]?.research),
  label:p.evidence?.transfer?.submittedAt?'迁移已记录':p.evidence?.independent?.submittedAt?'实现已提交（待复核）':p.checks?.worked?.passed?'例题已核对':p.stage?'学习中':'未开始'};
}
export const ROUTES=[
 {id:'foundation',name:'共同基础：把已有项目拆开重写',units:['u1','u2','u9','u10','u16','u20','u21','u7','u85','u86'],deliverable:'函数接口、单测、矩阵推导、训练记录与一份可复现实验'},
 {id:'vision',name:'视觉与三维主线',units:['u31','u32','u33','u34','u38','u37','u39','u41','u86','u87'],deliverable:'从特征检索/相机几何到失败样本与几何改进的研究证据'},
 {id:'robotics',name:'ROS 与机器人主线',units:['u70','u71','u72','u73','u74','u3','u76','u75','u79','u81'],deliverable:'消息闭环、坐标变换、估计与导航日志的可复查系统'},
 {id:'multimodal',name:'Transformer 与多模态主线',units:['u49','u36','u50','u54','u55','u53','u58','u57','u59','u69'],deliverable:'可解释的 Attention 实现、视觉语言错误分析和受控微调对照'}
];
export function nextUnit(route,progress){return route.units.find(id=>!progressFor(progress,id).evidence?.independent?.submittedAt)||route.units[route.units.length-1];}
