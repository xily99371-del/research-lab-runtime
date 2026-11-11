import {FOUNDATIONS} from './foundations.js';
import {MACHINE_LEARNING} from './machine-learning.js';
import {VISION} from './vision.js';
import {MULTIMODAL} from './multimodal.js';
import {ROBOTICS} from './robotics.js';
import {RESEARCH} from './research.js';
export const GUIDE_LIST=[...FOUNDATIONS,...MACHINE_LEARNING,...VISION,...MULTIMODAL,...ROBOTICS,...RESEARCH];
export const GUIDES=Object.fromEntries(GUIDE_LIST.map(g=>[g.id,g]));
if(GUIDE_LIST.length!==96||Object.keys(GUIDES).length!==96)throw Error('The guided curriculum must cover the 96 existing IDs exactly.');
export const EXACT_LINKS={
 u2:['two_sum','contains_duplicate','valid_anagram','group_anagrams','product_except_self','move_zeroes','three_sum','container_water','longest_substring','daily_temperatures','top_k','union_find','sliding_window_max','linked_list_cycle','remove_nth_from_end','merge_two_lists','reverse_linked_list','k_closest_points'],
 u3:['bfs','dijkstra','astar','topological_sort','connected_components','max_depth_tree','invert_tree','level_order','validate_bst','kth_smallest_bst','num_islands','word_ladder_length','course_schedule','oranges_rotting'],
 u4:['knapsack','lcs','coin_change','lis','max_subarray','merge_intervals','interval_scheduling','edit_distance','best_time_stock','largest_rectangle','subsets','combination_sum','permutations','word_search','house_robber','unique_paths','min_path_sum','jump_game','gas_station','word_break'],
 u9:['matrix_multiply','product_except_self','median_two_sorted_arrays'],u11:['eval_rpn'],u8:['reverse_linked_list','merge_two_lists'],u31:['num_islands','word_search'],
 u15:['binary_search','kmp','min_window','search_rotated','find_min_rotated','median_two_sorted_arrays'],
 u16:['linear_regression_step','binary_cross_entropy'],
 u19:['kmeans_assign'],
 u20:['softmax'],
 u22:['batch_norm_inference','conv2d_valid'],
 u23:['confusion_matrix','batch_norm_inference'],
 u32:['project_point','unproject_point','depth_to_pointcloud'],
 u33:['homography_apply','stereo_depth'],
 u34:['iou_xyxy','nms','average_precision'],
 u37:['recall_at_k'],
 u39:['voxel_downsample','fps','knn_points','point_centroid'],
 u40:['rigid_transform'],
 u41:['chamfer_distance','plane_residual','bbox3d_iou'],
 u49:['attention'],
 u50:['tokenize_greedy'],
 u52:['kv_cache_bytes'],
 u54:['contrastive_loss'],
 u61:['rotary_pair'],
 u70:['ros_topic'],
 u71:['ros_topic','ros_service','ros_action'],
 u72:['ros_tf','rigid_transform','transform_points','quaternion_rotate'],
 u74:['ekf_scalar_update'],
 u76:['occupancy_grid_index'],
 u79:['astar','dijkstra'],
 u80:['path_length'],
 u86:['paired_mean_difference']
};
export function enrichCourses(courses){return courses.map(c=>{const g=GUIDES[c.id];if(!g)throw Error('Missing guide '+c.id);return {...c,prerequisites:g.prerequisites,learningGoal:g.goal,practice:g.guided.signature+'\n'+g.guided.fixture+'\n独立实现：'+g.independent,mastery:'课堂核对、带提示练习、独立实现证据与迁移证据分别记录；不以勾选代替验收。',deliverable:g.evidence.join('；'),taskIds:EXACT_LINKS[c.id]||[],instructionalStatus:'staged-learning-v1'};});}
