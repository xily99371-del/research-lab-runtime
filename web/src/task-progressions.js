// LeetCode-inspired progression: each path moves from a reusable primitive
// to a composed, constraint-heavy task grounded in engineering work.
export const TASK_PROGRESSIONS=[
{id:'arrays-hash',title:'数组、哈希与滑动窗口',audience:'算法基础 / 工程高频',tasks:['two_sum','top_k','sliding_window_max','max_subarray'],why:'日志聚合、检索索引、缓存窗口与在线统计'},
{id:'stack-search',title:'栈、二分与字符串',audience:'算法基础 / 工程高频',tasks:['parentheses','binary_search','kmp','merge_intervals'],why:'解析器、边界定位、文本匹配与时间区间合并'},
{id:'graphs',title:'图搜索与路径规划',audience:'算法基础 / 机器人应用',tasks:['bfs','connected_components','topological_sort','dijkstra','astar'],why:'依赖调度、连通性检查、地图搜索与机器人路径规划'},
{id:'dp-greedy',title:'动态规划与贪心',audience:'算法基础 / 优化问题',tasks:['coin_change','knapsack','lis','lcs','edit_distance','interval_scheduling'],why:'资源分配、序列分析、文本纠错与任务调度'},
{id:'ml-core',title:'机器学习计算基础',audience:'AI工程常用模块',tasks:['linear_regression_step','softmax','binary_cross_entropy','confusion_matrix','batch_norm_inference','kmeans_assign','attention'],why:'训练循环、分类评估、特征聚类与神经网络推理'},
{id:'vision-geometry',title:'视觉几何与检测',audience:'计算机视觉 / 机器人感知',tasks:['iou_xyxy','nms','project_point','unproject_point','homography_apply','stereo_depth'],why:'目标检测后处理、相机标定、图像映射与深度估计'},
{id:'point-cloud',title:'点云与三维几何',audience:'三维视觉 / 几何重建',tasks:['point_centroid','knn_points','voxel_downsample','fps','plane_residual','rigid_transform','transform_points','chamfer_distance','bbox3d_iou','depth_to_pointcloud'],why:'点云预处理、邻域构建、采样、配准与重建评价'},
{id:'llm',title:'大模型与多模态基础',audience:'LLM / VLM工程',tasks:['tokenize_greedy','rotary_pair','kv_cache_bytes','contrastive_loss'],why:'Tokenizer、位置编码、推理显存与跨模态对齐'},
{id:'robotics',title:'机器人状态与导航',audience:'ROS 2 / 机器人系统',tasks:['quaternion_rotate','occupancy_grid_index','ekf_scalar_update','path_length','ros_topic','ros_service','ros_tf','ros_action'],why:'坐标变换、地图索引、状态估计、通信与行为接口'},
{id:'research',title:'实验与检索评价',audience:'科研工程 / 结果分析',tasks:['recall_at_k','average_precision','paired_mean_difference'],why:'检索系统评估、排序质量与配对实验比较'}
];
export const TASK_META=Object.fromEntries(TASK_PROGRESSIONS.flatMap(path=>path.tasks.map((task,index)=>[task,{pathId:path.id,pathTitle:path.title,stage:index+1,stages:path.tasks.length,application:path.why}])));
for(const p of TASK_PROGRESSIONS){if(p.tasks.some((id,i)=>!id||p.tasks.indexOf(id)!==i))throw Error('Invalid progression '+p.id);}
