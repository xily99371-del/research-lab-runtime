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
 u2:['two_sum','parentheses','top_k','union_find','sliding_window_max'],
 u3:['bfs','dijkstra','astar','topological_sort','connected_components'],
 u4:['knapsack','lcs','coin_change','lis','max_subarray','merge_intervals','interval_scheduling','edit_distance'],
 u9:['matrix_multiply'],u15:['binary_search','kmp'],u36:['attention'],u49:['attention'],
 u70:['ros_topic'],u71:['ros_topic','ros_service','ros_action'],u72:['ros_tf'],u79:['astar','dijkstra']
};
export function enrichCourses(courses){return courses.map(c=>{const g=GUIDES[c.id];if(!g)throw Error('Missing guide '+c.id);return {...c,prerequisites:g.prerequisites,learningGoal:g.goal,practice:g.guided.signature+'\n'+g.guided.fixture+'\n独立实现：'+g.independent,mastery:'课堂核对、带提示练习、独立实现证据与迁移证据分别记录；不以勾选代替验收。',deliverable:g.evidence.join('；'),taskIds:EXACT_LINKS[c.id]||[],instructionalStatus:'staged-learning-v1'};});}
