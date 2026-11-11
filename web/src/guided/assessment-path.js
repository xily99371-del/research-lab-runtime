import {GUIDES} from './catalog.js';

// Every auto-graded task points to the smallest useful course set.
// Readiness is a recommendation, never a hard gate: learners may challenge early.
export const TASK_PATHS={
 two_sum:{courses:['u2'],why:'哈希查找、遍历与边界处理'},
 parentheses:{courses:['u2'],why:'栈、状态维护与非法前缀'},
 bfs:{courses:['u3'],why:'图表示、队列与访问标记'},
 attention:{courses:['u9','u49'],why:'矩阵形状、缩放点积、Softmax与Mask'},
 astar:{courses:['u3','u79'],why:'图搜索、代价函数与启发式可采纳性'},
 binary_search:{courses:['u15'],why:'半开区间、循环不变量与边界'},
 dijkstra:{courses:['u3','u79'],why:'非负边权、松弛与优先队列'},
 knapsack:{courses:['u4'],why:'状态定义、转移与容量倒序'},
 merge_intervals:{courses:['u4'],why:'排序、区间边界与扫描'},
 top_k:{courses:['u2'],why:'哈希计数、堆与复杂度取舍'},
 max_subarray:{courses:['u4'],why:'动态规划状态与Kadane更新'},
 union_find:{courses:['u2'],why:'集合表示、路径压缩与按秩合并'},
 lcs:{courses:['u4'],why:'二维状态、边界与转移'},
 topological_sort:{courses:['u3'],why:'有向图、入度与环检测'},
 coin_change:{courses:['u4'],why:'完全背包与状态更新顺序'},
 lis:{courses:['u4'],why:'子序列状态与tails维护'},
 sliding_window_max:{courses:['u2'],why:'双端队列与单调性'},
 kmp:{courses:['u15'],why:'前缀函数、失配回退与索引边界'},
 matrix_multiply:{courses:['u9'],why:'矩阵形状、点积与循环不变量'},
 interval_scheduling:{courses:['u4'],why:'贪心选择与交换论证'},
 connected_components:{courses:['u3'],why:'图遍历、连通性与访问状态'},
 edit_distance:{courses:['u4'],why:'二维DP、编辑操作与边界'},
 ros_topic:{courses:['u70','u71'],why:'节点生命周期、Topic发布订阅与QoS'},
 ros_service:{courses:['u70','u71'],why:'节点、请求响应、超时与异步调用'},
 ros_tf:{courses:['u72'],why:'坐标系方向、刚体变换与时间戳'},
 ros_action:{courses:['u70','u71'],why:'节点通信、Goal/Result与长任务状态'}
};

export function taskReadiness(taskId,progress={}){
 const path=TASK_PATHS[taskId];
 if(!path)return {known:false,ready:false,total:0,completed:0,items:[],why:'尚未配置课程前置关系；可以先阅读题目说明。'};
 const items=path.courses.map(id=>{
  const p=progress[id]?.learning||{},g=GUIDES[id];
  const theory=!!p.checks?.worked?.passed;
  const practice=!!p.evidence?.guided?.submittedAt;
  return {id,title:g?.goal||id,theory,practice,complete:theory&&practice,
   next:!theory?1:!practice?2:3};
 });
 const completed=items.filter(x=>x.complete).length;
 return {known:true,ready:completed===items.length,total:items.length,completed,
  checksTotal:items.length*2,checksDone:items.reduce((n,x)=>n+Number(x.theory)+Number(x.practice),0),
  items,why:path.why,label:completed===items.length?'建议准备已完成':completed===0?'建议先从关联课程开始':`准备进度 ${completed}/${items.length} 门课程`};
}
export function nextReadinessStep(taskId,progress={}){
 const r=taskReadiness(taskId,progress);
 for(const x of r.items){if(!x.theory)return {courseId:x.id,stage:1,reason:'先核对讲解例题'};if(!x.practice)return {courseId:x.id,stage:2,reason:'再完成带提示练习并提交实际结果'};}
 return null;
}
export function readinessSummary(taskIds,progress={}){
 const ids=[...new Set(taskIds||[])];if(!ids.length)return {total:0,ready:0};
 return {total:ids.length,ready:ids.filter(id=>taskReadiness(id,progress).ready).length};
}
