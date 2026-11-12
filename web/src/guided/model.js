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
export function stageUnlockReason(progress,id,target){const p=progressFor(progress,id);if(target<=1)return null;if(!p.checks?.worked?.passed)return '先在讲解阶段独立核对正确例题，才能进入带提示练习。';if(target>=3&&!p.evidence?.guided?.submittedAt)return '先提交带提示练习的实际输出与解释，才能进入独立实现。';if(target>=4&&!p.evidence?.independent?.submittedAt)return '先提交独立实现代码、测试结果和原理说明，才能进入科研迁移与面试训练。';return null;}
export function learnerStatus(progress,id,jobs=[],taskIds=[]) {
 const p=progressFor(progress,id),serverPassed=jobs.some(j=>j.status==='passed'&&taskIds.includes(j.task_id));
 return {started:!!(p.stage||p.checks||p.evidence),checked:!!p.checks?.worked?.passed,
  independentSubmitted:!!p.evidence?.independent?.submittedAt,
  transferred:!!p.evidence?.transfer?.submittedAt,serverPassed,
  legacy:!!(progress[id]?.theory||progress[id]?.implementation||progress[id]?.research),
  label:p.evidence?.transfer?.submittedAt?'迁移已记录':p.evidence?.independent?.submittedAt?'实现已提交（待复核）':p.checks?.worked?.passed?'例题已核对':p.stage?'学习中':'未开始'};
}
export const ROUTES=[
 {id:'foundation',name:'共同基础：把已有项目拆开重写',units:['u1','u2','u9','u10','u16','u20','u21','u7','u85','u86'],deliverable:'函数接口、单测、矩阵推导、训练记录与一份可复现实验',capstone:{title:'复现一个核心算法并形成可复查实验包',brief:'选择一篇与你方向相关的论文或一个核心模块，独立实现最小基线，固定数据划分与随机种子，完成一次受控消融。',evidence:'代码与环境配置、数学推导、基线结果、至少一组消融、失败样例和复现说明。',acceptance:'他人能按说明运行；指标可复现；结论不超出实验支持范围。'}},
 {id:'vision',name:'视觉与三维主线',units:['u31','u32','u33','u34','u38','u37','u39','u41','u86','u87'],deliverable:'从特征检索/相机几何到失败样本与几何改进的研究证据',capstone:{title:'构建一个可诊断的视觉定位或三维几何系统',brief:'选择VPR检索重排或点云几何重建任务，建立基线，分析动态遮挡、视角变化或点云密度对结果的影响。',evidence:'数据协议、模型/几何实现、Recall@K或几何误差、分层失败分析、消融和运行成本。',acceptance:'报告总体指标并解释至少两类失败模式，用对照实验验证改进原因。'}},
 {id:'robotics',name:'ROS 与机器人主线',units:['u70','u71','u72','u73','u74','u3','u76','u75','u79','u81'],deliverable:'消息闭环、坐标变换、估计与导航日志的可复查系统',capstone:{title:'完成一个闭环机器人感知—定位—规划任务',brief:'在仿真或实体平台中打通传感器输入、坐标变换、状态估计、代价地图、路径规划与控制执行。',evidence:'ROS图与TF树、地图/代价地图、规划轨迹、运行日志、成功率/碰撞率/路径长度和异常案例。',acceptance:'能解释模块数据流与坐标约定；动态障碍或定位扰动下有可量化的恢复策略。'}},
 {id:'multimodal',name:'Transformer 与多模态主线',units:['u49','u36','u50','u54','u55','u53','u58','u57','u59','u69'],deliverable:'可解释的 Attention 实现、视觉语言错误分析和受控微调对照',capstone:{title:'完成一个可评估的视觉语言小研究',brief:'基于预训练视觉语言模型完成图文检索或视觉问答任务，分析提示词、区域证据和视觉幻觉对输出的影响。',evidence:'模型接口、Attention/对比学习原理、固定测试集、提示词对照、错误分类和稳健性实验。',acceptance:'区分语义匹配与真实定位；能举出失败案例，并用反事实测试验证判断。'}}
];
export function nextUnit(route,progress){return route.units.find(id=>!progressFor(progress,id).evidence?.independent?.submittedAt)||route.units[route.units.length-1];}
