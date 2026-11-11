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
 ros_action:{courses:['u70','u71'],why:'节点通信、Goal/Result与长任务状态'},
contains_duplicate:{courses:['u2'],why:'哈希集合、重复检测与期望O(n)复杂度'},
 valid_anagram:{courses:['u2'],why:'字符计数、频次映射与字符串遍历'},
 group_anagrams:{courses:['u2'],why:'规范化键、哈希映射与分组'},
 product_except_self:{courses:['u2','u9'],why:'前缀积、后缀积与不使用除法的线性扫描'},
 best_time_stock:{courses:['u4'],why:'状态维护、历史最小值与贪心扫描'},
 move_zeroes:{courses:['u2'],why:'快慢指针、原地压缩与稳定性'},
 three_sum:{courses:['u2'],why:'排序、双指针与重复解去重'},
 container_water:{courses:['u2'],why:'双指针、贪心移动与几何面积'},
 longest_substring:{courses:['u2'],why:'滑动窗口、字符位置映射与不变量'},
 min_window:{courses:['u2','u15'],why:'窗口计数、覆盖约束与最短区间'},
 daily_temperatures:{courses:['u2'],why:'单调栈、索引差与延迟事件'},
 largest_rectangle:{courses:['u4'],why:'单调栈、左右边界与面积最大化'},
 eval_rpn:{courses:['u11'],why:'栈、表达式求值与运算顺序'},
 reverse_linked_list:{courses:['u2','u8'],why:'链表指针、引用关系与迭代不变量'},
 merge_two_lists:{courses:['u2','u8'],why:'有序链表合并与双指针'},
 linked_list_cycle:{courses:['u2'],why:'快慢指针与环检测'},
 remove_nth_from_end:{courses:['u2'],why:'快慢指针、虚拟头节点与边界删除'},
 max_depth_tree:{courses:['u3'],why:'树递归、子问题与深度定义'},
 invert_tree:{courses:['u3'],why:'递归结构、左右子树交换'},
 level_order:{courses:['u3'],why:'队列、BFS与逐层遍历'},
 validate_bst:{courses:['u3'],why:'递归上下界与全局BST约束'},
 kth_smallest_bst:{courses:['u3'],why:'BST中序遍历与有序性质'},
 num_islands:{courses:['u3','u31'],why:'网格图、连通域与DFS/BFS'},
 word_ladder_length:{courses:['u3','u79'],why:'状态空间建图与无权最短路'},
 course_schedule:{courses:['u3'],why:'依赖图、入度与拓扑排序'},
 oranges_rotting:{courses:['u3'],why:'多源BFS、层数与传播时间'},
 subsets:{courses:['u4'],why:'回溯、二叉决策树与状态恢复'},
 combination_sum:{courses:['u4'],why:'回溯、重复选择与剪枝'},
 permutations:{courses:['u4'],why:'回溯、访问标记与排列空间'},
 word_search:{courses:['u4','u31'],why:'网格回溯、访问约束与路径搜索'},
 house_robber:{courses:['u4'],why:'动态规划状态与相邻冲突'},
 unique_paths:{courses:['u4'],why:'网格动态规划与路径计数'},
 min_path_sum:{courses:['u4'],why:'网格DP、局部转移与全局最优'},
 jump_game:{courses:['u4'],why:'贪心可达边界与反例分析'},
 gas_station:{courses:['u4'],why:'前缀余额、贪心起点排除'},
 search_rotated:{courses:['u15'],why:'旋转有序数组、二分区间判定'},
 find_min_rotated:{courses:['u15'],why:'二分查找与旋转断点定位'},
 k_closest_points:{courses:['u2','u39'],why:'堆、距离度量与Top-K检索'},
 word_break:{courses:['u4'],why:'字符串动态规划与可达前缀'},
 median_two_sorted_arrays:{courses:['u9','u15'],why:'二分分割、边界哨兵与中位数定义'},
softmax:{courses:['u20'],why:'指数归一化、数值稳定性与概率和约束'},
 linear_regression_step:{courses:['u16','u20'],why:'线性模型、平方损失与链式求导'},
 binary_cross_entropy:{courses:['u16','u20'],why:'概率输出、交叉熵与数值裁剪'},
 confusion_matrix:{courses:['u23'],why:'分类评估、标签映射与混淆矩阵'},
 batch_norm_inference:{courses:['u22','u23'],why:'张量维度、运行统计量与推理模式'},
 conv2d_valid:{courses:['u22'],why:'卷积窗口、通道维度与输出尺寸'},
 kmeans_assign:{courses:['u19'],why:'聚类分配、距离与簇内误差'},
 iou_xyxy:{courses:['u34'],why:'边界框坐标、交并区域与IoU'},
 nms:{courses:['u34'],why:'IoU、置信度排序与非极大值抑制'},
 project_point:{courses:['u32'],why:'针孔模型、相机内参与坐标投影'},
 unproject_point:{courses:['u32'],why:'像素反投影、深度与相机坐标'},
 homography_apply:{courses:['u33'],why:'齐次坐标、平面单应与归一化'},
 stereo_depth:{courses:['u33'],why:'双目几何、基线、焦距与视差'},
 chamfer_distance:{courses:['u41'],why:'点集最近邻与几何距离度量'},
 voxel_downsample:{courses:['u39'],why:'点云体素索引与局部质心'},
 fps:{courses:['u39'],why:'点云覆盖、最远点采样与增量距离'},
 knn_points:{courses:['u39'],why:'点云邻域、距离排序与索引'},
 rigid_transform:{courses:['u40','u72'],why:'旋转矩阵、平移与坐标变换方向'},
 plane_residual:{courses:['u41'],why:'平面参数化与归一化点面距离'},
 point_centroid:{courses:['u39'],why:'点云统计与几何中心'},
 transform_points:{courses:['u72'],why:'齐次矩阵、坐标系和透视除法'},
 bbox3d_iou:{courses:['u41'],why:'三维框、交体积与并体积'},
 depth_to_pointcloud:{courses:['u32','u39'],why:'深度反投影与点云生成'},
 tokenize_greedy:{courses:['u50','u51'],why:'Token边界、最长匹配与词表映射'},
 rotary_pair:{courses:['u61'],why:'二维旋转、位置编码与相对位置'},
 kv_cache_bytes:{courses:['u52'],why:'KV缓存维度、数据类型与显存估算'},
 contrastive_loss:{courses:['u54','u25'],why:'相似度logits、Softmax与对比损失'},
 quaternion_rotate:{courses:['u72'],why:'四元数顺序、归一化与三维旋转'},
 occupancy_grid_index:{courses:['u76','u72'],why:'地图原点、分辨率与行列索引'},
 ekf_scalar_update:{courses:['u74'],why:'先验协方差、测量噪声与Kalman增益'},
 path_length:{courses:['u80'],why:'轨迹采样、相邻距离与路径长度'},
 recall_at_k:{courses:['u37'],why:'检索排名、正样本集合与Recall@K'},
 average_precision:{courses:['u34','u23'],why:'Precision-Recall排序与AP定义'},
 paired_mean_difference:{courses:['u86'],why:'配对样本、指标差值与实验对照'}
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
