export const TIER_INFO={
 1:{label:'入门',summary:'数组、哈希、栈与基本遍历；先建立正确的输入输出和边界意识。'},
 2:{label:'基础',summary:'双指针、滑动窗口、树遍历与常见数据结构；开始优化时间和空间复杂度。'},
 3:{label:'进阶',summary:'图、回溯、链表与动态规划；学会建模状态、证明不变量和处理组合情况。'},
 4:{label:'综合',summary:'多个技巧组合，关注剪枝、复杂边界和算法适用条件。'},
 5:{label:'挑战',summary:'高难度搜索、复杂二分和多约束问题；要求能解释正确性与复杂度。'}
};
const meta={};
function add(path,tier,ids,patterns={},applications={}){ids.forEach((id,i)=>{if(meta[id])throw Error('Duplicate task metadata: '+id);meta[id]={path,tier,tierLabel:TIER_INFO[tier].label,sequence:i+1,pattern:patterns[id]||'综合算法',application:applications[id]||'训练问题建模、边界处理与复杂度分析。'};});}
add('核心算法',1,['two_sum','contains_duplicate','valid_anagram','best_time_stock','move_zeroes','parentheses','reverse_linked_list','binary_search','max_depth_tree'],{
 two_sum:'哈希表',contains_duplicate:'哈希集合',valid_anagram:'哈希计数',best_time_stock:'一次遍历',move_zeroes:'双指针',parentheses:'栈',reverse_linked_list:'链表指针',binary_search:'二分查找',max_depth_tree:'树递归'
});
add('核心算法',2,['group_anagrams','product_except_self','container_water','longest_substring','daily_temperatures','eval_rpn','merge_two_lists','invert_tree','level_order','merge_intervals','top_k','max_subarray','connected_components','house_robber','unique_paths','jump_game','k_closest_points','find_min_rotated'],{
 group_anagrams:'哈希映射',product_except_self:'前后缀积',container_water:'双指针贪心',longest_substring:'滑动窗口',daily_temperatures:'单调栈',eval_rpn:'栈',merge_two_lists:'链表双指针',invert_tree:'树递归',level_order:'树BFS',merge_intervals:'排序扫描',top_k:'哈希与堆',max_subarray:'动态规划',connected_components:'并查集/DFS',house_robber:'动态规划',unique_paths:'网格DP',jump_game:'贪心',k_closest_points:'堆与排序',find_min_rotated:'二分查找'
});
add('核心算法',3,['three_sum','linked_list_cycle','remove_nth_from_end','validate_bst','kth_smallest_bst','num_islands','course_schedule','oranges_rotting','subsets','permutations','min_path_sum','bfs','topological_sort','union_find','coin_change','knapsack','interval_scheduling','gas_station'],{
 three_sum:'排序与双指针',linked_list_cycle:'快慢指针',remove_nth_from_end:'快慢指针',validate_bst:'DFS上下界',kth_smallest_bst:'中序遍历',num_islands:'网格BFS/DFS',course_schedule:'拓扑排序',oranges_rotting:'多源BFS',subsets:'回溯',permutations:'回溯',min_path_sum:'网格DP',bfs:'图BFS',topological_sort:'拓扑排序',union_find:'并查集',coin_change:'完全背包',knapsack:'0/1背包',interval_scheduling:'贪心',gas_station:'贪心'
});
add('核心算法',4,['min_window','largest_rectangle','combination_sum','word_search','search_rotated','word_break','sliding_window_max','lis','lcs','edit_distance','dijkstra','astar'],{
 min_window:'滑动窗口计数',largest_rectangle:'单调栈',combination_sum:'回溯剪枝',word_search:'网格回溯',search_rotated:'旋转数组二分',word_break:'字符串DP',sliding_window_max:'单调队列',lis:'贪心与二分',lcs:'二维DP',edit_distance:'二维DP',dijkstra:'最短路与松弛',astar:'启发式搜索'
});
add('核心算法',5,['word_ladder_length','median_two_sorted_arrays','kmp'],{
 word_ladder_length:'状态图与BFS',median_two_sorted_arrays:'二分分割',kmp:'字符串前缀函数'
});
add('AI/机器人专题',1,['softmax','linear_regression_step','binary_cross_entropy','confusion_matrix','iou_xyxy','project_point','unproject_point','stereo_depth','point_centroid','plane_residual','kv_cache_bytes','rotary_pair','recall_at_k','paired_mean_difference','path_length','occupancy_grid_index','matrix_multiply'],{
 softmax:'数值稳定归一化',linear_regression_step:'梯度下降',binary_cross_entropy:'概率损失',confusion_matrix:'分类评估',iou_xyxy:'检测框几何',project_point:'相机投影',unproject_point:'深度反投影',stereo_depth:'双目几何',point_centroid:'点云统计',plane_residual:'几何残差',kv_cache_bytes:'推理显存估算',rotary_pair:'位置编码',recall_at_k:'检索评价',paired_mean_difference:'配对实验统计',path_length:'轨迹度量',occupancy_grid_index:'栅格地图',matrix_multiply:'线性代数'
});
add('AI/机器人专题',2,['batch_norm_inference','conv2d_valid','homography_apply','voxel_downsample','knn_points','rigid_transform','transform_points','depth_to_pointcloud','tokenize_greedy','quaternion_rotate'],{
 batch_norm_inference:'归一化推理',conv2d_valid:'卷积窗口',homography_apply:'平面几何变换',voxel_downsample:'体素降采样',knn_points:'空间近邻',rigid_transform:'刚体变换',transform_points:'齐次变换',depth_to_pointcloud:'深度点云',tokenize_greedy:'最长词片段匹配',quaternion_rotate:'四元数旋转'
});
add('AI/机器人专题',3,['kmeans_assign','nms','chamfer_distance','fps','contrastive_loss','ekf_scalar_update','average_precision','bbox3d_iou'],{
 kmeans_assign:'聚类分配',nms:'检测后处理',chamfer_distance:'点集几何度量',fps:'最远点采样',contrastive_loss:'对比学习损失',ekf_scalar_update:'状态估计更新',average_precision:'检索/检测评价',bbox3d_iou:'三维框评价'
});
add('AI/机器人专题',4,['attention'],{attention:'缩放点积注意力'});
add('ROS 2系统集成',1,['ros_topic'],{ros_topic:'Topic发布订阅'});
add('ROS 2系统集成',2,['ros_service'],{ros_service:'Service请求响应'});
add('ROS 2系统集成',3,['ros_tf'],{ros_tf:'TF2坐标变换'});
add('ROS 2系统集成',4,['ros_action'],{ros_action:'Action长任务通信'});
export const TASK_META=Object.freeze(meta);
export function applyTaskMeta(problems){
 const ids=new Set(problems.map(p=>p.id));
 for(const p of problems)if(!TASK_META[p.id])throw Error('Missing progressive metadata: '+p.id);
 for(const id of Object.keys(TASK_META))if(!ids.has(id))throw Error('Metadata references missing task: '+id);
 return problems.map(p=>({...p,...TASK_META[p.id]})).sort((a,b)=>a.tier-b.tier||({ '核心算法':0,'AI/机器人专题':1,'ROS 2系统集成':2}[a.path]-{'核心算法':0,'AI/机器人专题':1,'ROS 2系统集成':2}[b.path])||a.sequence-b.sequence);
}
