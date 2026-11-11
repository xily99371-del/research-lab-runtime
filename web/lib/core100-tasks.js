import {randomInt} from 'node:crypto';

export const CORE100_IDS=[
'contains_duplicate','valid_anagram','group_anagrams','product_except_self','best_time_stock','move_zeroes',
'three_sum','container_water','longest_substring','min_window','daily_temperatures','largest_rectangle','eval_rpn',
'reverse_linked_list','merge_two_lists','linked_list_cycle','remove_nth_from_end',
'max_depth_tree','invert_tree','level_order','validate_bst','kth_smallest_bst',
'num_islands','word_ladder_length','course_schedule','oranges_rotting',
'subsets','combination_sum','permutations','word_search',
'house_robber','unique_paths','min_path_sum','jump_game','gas_station',
'search_rotated','find_min_rotated','k_closest_points','word_break','median_two_sorted_arrays'
];
const ri=(a,b)=>randomInt(a,b+1);
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const chars=s=>Array.from(s);
const keySort=a=>[...a].sort((x,y)=>x-y);
function listValues(nodes,head){const out=[],seen=new Set();let p=head;while(p!==null&&p!==undefined&&!seen.has(p)){seen.add(p);out.push(nodes[p].val);p=nodes[p].next;}return out;}
function reverseList(d){const next=d.nodes.map(x=>x.next??null);let prev=null,cur=d.head??null;while(cur!==null){const n=next[cur];next[cur]=prev;prev=cur;cur=n;}return {head:prev,next};}
function mergeLists(d){const next=d.nodes.map(x=>x.next??null);let a=d.headA??null,b=d.headB??null,head=null,tail=null;while(a!==null||b!==null){let pick;if(b===null||(a!==null&&d.nodes[a].val<=d.nodes[b].val)){pick=a;a=next[a];}else{pick=b;b=next[b];}next[pick]=null;if(head===null)head=pick;else next[tail]=pick;tail=pick;}return {head,next};}
function removeNth(d){const next=d.nodes.map(x=>x.next??null);const dummy={next:d.head??null};let fast=dummy,slow=dummy;for(let i=0;i<d.n;i++){fast=fast.next===null?null:{next:next[fast.next]};}if(!fast)return {head:d.head??null,next};while(fast.next!==null){fast={next:next[fast.next]};slow={next:next[slow.next]};}const victim=slow.next;if(victim!==null)slow.next=next[victim];return {head:dummy.next,next:next.map((x,i)=>i===-1?x:x)};}
function treeDepth(t){return t===null?0:1+Math.max(treeDepth(t.left),treeDepth(t.right));}
function invertTree(t){return t===null?null:{val:t.val,left:invertTree(t.right),right:invertTree(t.left)};}
function levelOrder(t){if(!t)return[];const q=[t],out=[];for(let i=0;i<q.length;i++){const n=q[i];if(!n){continue;}let row=out[out.length-1];if(!row||row.length===0){};if(i===0||q[i-1]===null||q[i-1]?._level!==n._level){};out.push(n.val);if(n.left)q.push(n.left);if(n.right)q.push(n.right);}const rows=[];const walk=[{n:t,depth:0}];for(let i=0;i<walk.length;i++){const {n,depth}=walk[i];if(!rows[depth])rows[depth]=[];rows[depth].push(n.val);if(n.left)walk.push({n:n.left,depth:depth+1});if(n.right)walk.push({n:n.right,depth:depth+1});}return rows;}
function isBST(t,lo=-Infinity,hi=Infinity){if(!t)return true;if(!(t.val>lo&&t.val<hi))return false;return isBST(t.left,lo,t.val)&&isBST(t.right,t.val,hi);}
function kthSmallest(t,k){const st=[];let p=t;while(p||st.length){while(p){st.push(p);p=p.left;}p=st.pop();if(--k===0)return p.val;p=p.right;}return null;}
function islandCount(grid){const a=grid.map(row=>row.split(''));let n=0;for(let r=0;r<a.length;r++)for(let c=0;c<(a[0]?.length||0);c++)if(a[r][c]==='1'){n++;const q=[[r,c]];a[r][c]='0';for(let i=0;i<q.length;i++){const[x,y]=q[i];for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx>=0&&nx<a.length&&ny>=0&&ny<a[0].length&&a[nx][ny]==='1'){a[nx][ny]='0';q.push([nx,ny]);}}}}return n;}
function wordLadder(d){if(d.beginWord===d.endWord)return 1;const dict=new Set(d.wordList);if(!dict.has(d.endWord))return 0;const q=[[d.beginWord,1]],seen=new Set([d.beginWord]);for(let i=0;i<q.length;i++){const[w,dist]=q[i],a=chars(w);for(let p=0;p<a.length;p++){const old=a[p];for(let c=97;c<=122;c++){const ch=String.fromCharCode(c);if(ch===old)continue;a[p]=ch;const z=a.join('');if(z===d.endWord)return dist+1;if(dict.has(z)&&!seen.has(z)){seen.add(z);q.push([z,dist+1]);}}a[p]=old;}}return 0;}
function coursePossible(d){const g=Array.from({length:d.numCourses},()=>[]),deg=Array(d.numCourses).fill(0);for(const[c,p]of d.prerequisites){g[p].push(c);deg[c]++;}const q=[];for(let i=0;i<deg.length;i++)if(!deg[i])q.push(i);let n=0;for(let i=0;i<q.length;i++){const u=q[i];n++;for(const v of g[u])if(--deg[v]===0)q.push(v);}return n===d.numCourses;}
function rotOranges(grid){const a=grid.map(r=>[...r]),q=[];let fresh=0;for(let i=0;i<a.length;i++)for(let j=0;j<a[0].length;j++){if(a[i][j]===2)q.push([i,j,0]);else if(a[i][j]===1)fresh++;}let minutes=0;for(let k=0;k<q.length;k++){const[x,y,t]=q[k];minutes=Math.max(minutes,t);for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const i=x+dx,j=y+dy;if(i>=0&&i<a.length&&j>=0&&j<a[0].length&&a[i][j]===1){a[i][j]=2;fresh--;q.push([i,j,t+1]);}}}return fresh? -1:minutes;}
function subsets(d){const out=[];const a=[...d.nums].sort((x,y)=>x-y);function dfs(i,path){if(i===a.length){out.push([...path]);return;}dfs(i+1,path);path.push(a[i]);dfs(i+1,path);path.pop();}dfs(0,[]);return out.sort((x,y)=>{for(let i=0;i<Math.min(x.length,y.length);i++)if(x[i]!==y[i])return x[i]-y[i];return x.length-y.length;});}
function combinationSum(d){const a=[...d.candidates].sort((x,y)=>x-y),out=[];function dfs(i,left,path){if(left===0){out.push([...path]);return;}for(let j=i;j<a.length&&a[j]<=left;j++){path.push(a[j]);dfs(j,left-a[j],path);path.pop();}}dfs(0,d.target,[]);return out;}
function permutations(d){const a=[...d.nums].sort((x,y)=>x-y),out=[],used=Array(a.length).fill(false);function dfs(path){if(path.length===a.length){out.push([...path]);return;}for(let i=0;i<a.length;i++)if(!used[i]){used[i]=true;path.push(a[i]);dfs(path);path.pop();used[i]=false;}}dfs([]);return out;}
function wordSearch(d){const b=d.board.map(chars),w=chars(d.word);if(!w.length)return true;function dfs(r,c,k){if(k===w.length)return true;if(r<0||r>=b.length||c<0||c>=b[0].length||b[r][c]!==w[k])return false;const x=b[r][c];b[r][c]='\\0';const ok=dfs(r+1,c,k+1)||dfs(r-1,c,k+1)||dfs(r,c+1,k+1)||dfs(r,c-1,k+1);b[r][c]=x;return ok;}for(let r=0;r<b.length;r++)for(let c=0;c<b[0].length;c++)if(dfs(r,c,0))return true;return false;}
function medianTwo(d){let a=d.nums1,b=d.nums2;if(a.length>b.length)[a,b]=[b,a];let l=0,r=a.length;while(l<=r){const i=(l+r)>>1,j=((a.length+b.length+1)>>1)-i,al=i===0?-Infinity:a[i-1],ar=i===a.length?Infinity:a[i],bl=j===0?-Infinity:b[j-1],br=j===b.length?Infinity:b[j];if(al<=br&&bl<=ar){const left=Math.max(al,bl);return (a.length+b.length)%2?left:(left+Math.min(ar,br))/2;}if(al>br)r=i-1;else l=i+1;}return null;}
export function referenceCore(id,d){
 switch(id){
 case 'contains_duplicate':return new Set(d.nums).size!==d.nums.length;
 case 'valid_anagram':{const a=chars(d.s),b=chars(d.t);if(a.length!==b.length)return false;const m=new Map();for(const c of a)m.set(c,(m.get(c)||0)+1);for(const c of b){const n=m.get(c)||0;if(!n)return false;if(n===1)m.delete(c);else m.set(c,n-1);}return m.size===0;}
 case 'group_anagrams':{const m=new Map();for(const s of d.strs){const k=chars(s).sort().join('');if(!m.has(k))m.set(k,[]);m.get(k).push(s);}return [...m.entries()].sort((a,b)=>a[0].localeCompare(b[0])).map(x=>x[1].sort((a,b)=>a.localeCompare(b)));}
 case 'product_except_self':{const n=d.nums.length,out=Array(n).fill(1);let p=1;for(let i=0;i<n;i++){out[i]=p;p*=d.nums[i];}p=1;for(let i=n-1;i>=0;i--){out[i]*=p;p*=d.nums[i];}return out;}
 case 'best_time_stock':{let min=Infinity,best=0;for(const x of d.prices){min=Math.min(min,x);best=Math.max(best,x-min);}return best;}
 case 'move_zeroes':{const a=d.nums.filter(x=>x!==0);return [...a,...Array(d.nums.length-a.length).fill(0)];}
 case 'three_sum':{const a=[...d.nums].sort((x,y)=>x-y),out=[];for(let i=0;i<a.length-2;i++){if(i&&a[i]===a[i-1])continue;let l=i+1,r=a.length-1;while(l<r){const s=a[i]+a[l]+a[r];if(s===0){out.push([a[i],a[l],a[r]]);l++;r--;while(l<r&&a[l]===a[l-1])l++;while(l<r&&a[r]===a[r+1])r--;}else if(s<0)l++;else r--;}}return out;}
 case 'container_water':{let l=0,r=d.height.length-1,best=0;while(l<r){best=Math.max(best,Math.min(d.height[l],d.height[r])*(r-l));if(d.height[l]<d.height[r])l++;else r--;}return best;}
 case 'longest_substring':{const a=chars(d.text),m=new Map();let left=0,best=0;for(let i=0;i<a.length;i++){if(m.has(a[i]))left=Math.max(left,m.get(a[i])+1);m.set(a[i],i);best=Math.max(best,i-left+1);}return best;}
 case 'min_window':{const s=chars(d.s),t=chars(d.t);if(!t.length||s.length<t.length)return '';const need=new Map();for(const c of t)need.set(c,(need.get(c)||0)+1);let missing=t.length,l=0,bestL=0,best=Infinity;for(let r=0;r<s.length;r++){if(need.has(s[r])){if(need.get(s[r])>0)missing--;need.set(s[r],need.get(s[r])-1);}while(missing===0){if(r-l+1<best){best=r-l+1;bestL=l;}if(need.has(s[l]))need.set(s[l],need.get(s[l])+1);if(need.has(s[l])&&need.get(s[l])>0)missing++;l++;}}return best===Infinity?'':s.slice(bestL,bestL+best).join('');}
 case 'daily_temperatures':{const a=d.temperatures,out=Array(a.length).fill(0),st=[];for(let i=0;i<a.length;i++){while(st.length&&a[i]>a[st[st.length-1]]){const j=st.pop();out[j]=i-j;}st.push(i);}return out;}
 case 'largest_rectangle':{const a=[...d.heights,0],st=[];let best=0;for(let i=0;i<a.length;i++){while(st.length&&a[i]<a[st[st.length-1]]){const h=a[st.pop()],left=st.length?st[st.length-1]:-1;best=Math.max(best,h*(i-left-1));}st.push(i);}return best;}
 case 'eval_rpn':{const st=[];for(const t of d.tokens){if(['+','-','*','/'].includes(t)){const b=st.pop(),a=st.pop();st.push(t==='+'?a+b:t==='-'?a-b:t==='*'?a*b:Math.trunc(a/b));}else st.push(Number(t));}return st[0]??0;}
 case 'reverse_linked_list':return reverseList(d);
 case 'merge_two_lists':return mergeLists(d);
 case 'linked_list_cycle':{const next=d.next;let slow=d.head??null,fast=d.head??null;while(fast!==null&&next[fast]!==null){slow=next[slow];fast=next[next[fast]];if(slow===fast)return true;}return false;}
 case 'remove_nth_from_end':{const next=d.nodes.map(x=>x.next??null);let head=d.head??null,fast=head;for(let i=0;i<d.n;i++){if(fast===null)return {head,next};fast=next[fast];}let slow=null,prev=null;while(fast!==null){fast=next[fast];prev=slow;slow=slow===null?head:next[slow];}if(slow===head)head=next[head];else if(prev!==null)next[prev]=next[slow];return {head,next};}
 case 'max_depth_tree':return treeDepth(d.root);
 case 'invert_tree':return invertTree(d.root);
 case 'level_order':return levelOrder(d.root);
 case 'validate_bst':return isBST(d.root);
 case 'kth_smallest_bst':return kthSmallest(d.root,d.k);
 case 'num_islands':return islandCount(d.grid);
 case 'word_ladder_length':return wordLadder(d);
 case 'course_schedule':return coursePossible(d);
 case 'oranges_rotting':return rotOranges(d.grid);
 case 'subsets':return subsets(d);
 case 'combination_sum':return combinationSum(d);
 case 'permutations':return permutations(d);
 case 'word_search':return wordSearch(d);
 case 'house_robber':{let a=0,b=0;for(const x of d.nums){const n=Math.max(b,a+x);a=b;b=n;}return b;}
 case 'unique_paths':{const dp=Array(d.n).fill(1);for(let r=1;r<d.m;r++)for(let c=1;c<d.n;c++)dp[c]+=dp[c-1];return dp[d.n-1];}
 case 'min_path_sum':{const a=d.grid.map(r=>[...r]);for(let i=0;i<a.length;i++)for(let j=0;j<a[0].length;j++)if(i||j)a[i][j]+=(i? a[i-1][j]:Infinity)<(j?a[i][j-1]:Infinity)?a[i-1][j]:a[i][j-1];return a[a.length-1][a[0].length-1];}
 case 'jump_game':{let far=0;for(let i=0;i<d.nums.length;i++){if(i>far)return false;far=Math.max(far,i+d.nums[i]);}return true;}
 case 'gas_station':{let total=0,cur=0,start=0;for(let i=0;i<d.gas.length;i++){const diff=d.gas[i]-d.cost[i];total+=diff;cur+=diff;if(cur<0){start=i+1;cur=0;}}return total<0?-1:start%d.gas.length;}
 case 'search_rotated':{let l=0,r=d.nums.length-1;while(l<=r){const m=(l+r)>>1;if(d.nums[m]===d.target)return m;if(d.nums[l]<=d.nums[m]){if(d.nums[l]<=d.target&&d.target<d.nums[m])r=m-1;else l=m+1;}else{if(d.nums[m]<d.target&&d.target<=d.nums[r])l=m+1;else r=m-1;}}return -1;}
 case 'find_min_rotated':{let l=0,r=d.nums.length-1;while(l<r){const m=(l+r)>>1;if(d.nums[m]>d.nums[r])l=m+1;else r=m;}return d.nums[l];}
 case 'k_closest_points':return [...d.points].sort((a,b)=>(a[0]**2+a[1]**2)-(b[0]**2+b[1]**2)||a[0]-b[0]||a[1]-b[1]).slice(0,d.k);
 case 'word_break':{const words=new Set(d.wordDict),dp=Array(d.s.length+1).fill(false);dp[0]=true;for(let i=1;i<=d.s.length;i++)for(let j=0;j<i;j++)if(dp[j]&&words.has(d.s.slice(j,i))){dp[i]=true;break;}return dp[d.s.length];}
 case 'median_two_sorted_arrays':return medianTwo(d);
 default:throw new Error('Unknown core task '+id);
 }
}
const baseCases={
 contains_duplicate:[{nums:[1,2,3,1]},{nums:[1,2,3,4]},{nums:[]},{nums:[-1,-1]}],
 valid_anagram:[{s:'anagram',t:'nagaram'},{s:'rat',t:'car'},{s:'',t:''}],
 group_anagrams:[{strs:['eat','tea','tan','ate','nat','bat']},{strs:['']},{strs:[]}],
 product_except_self:[{nums:[1,2,3,4]},{nums:[-1,1,0,-3,3]},{nums:[5]}],
 best_time_stock:[{prices:[7,1,5,3,6,4]},{prices:[7,6,4,3,1]},{prices:[2]}],
 move_zeroes:[{nums:[0,1,0,3,12]},{nums:[0,0,1]},{nums:[1,2,3]}],
 three_sum:[{nums:[-1,0,1,2,-1,-4]},{nums:[0,1,1]},{nums:[0,0,0]}],
 container_water:[{height:[1,8,6,2,5,4,8,3,7]},{height:[1,1]},{height:[4]}],
 longest_substring:[{text:'abcabcbb'},{text:'bbbbb'},{text:''}],
 min_window:[{s:'ADOBECODEBANC',t:'ABC'},{s:'a',t:'a'},{s:'a',t:'aa'}],
 daily_temperatures:[{temperatures:[73,74,75,71,69,72,76,73]},{temperatures:[30,40,50,60]},{temperatures:[30,30]}],
 largest_rectangle:[{heights:[2,1,5,6,2,3]},{heights:[2,4]},{heights:[]}],
 eval_rpn:[{tokens:['2','1','+','3','*']},{tokens:['4','13','5','/','+']},{tokens:['-7','3','/']}],
 reverse_linked_list:[{nodes:[{val:1,next:1},{val:2,next:2},{val:3,next:null}],head:0},{nodes:[],head:null}],
 merge_two_lists:[{nodes:[{val:1,next:1},{val:3,next:null},{val:1,next:3},{val:2,next:null}],headA:0,headB:2},{nodes:[],headA:null,headB:null}],
 linked_list_cycle:[{next:[1,2,3,null],head:0},{next:[1,2,3,1],head:0},{next:[],head:null}],
 remove_nth_from_end:[{nodes:[{val:1,next:1},{val:2,next:2},{val:3,next:3},{val:4,next:4},{val:5,next:null}],head:0,n:2},{nodes:[{val:1,next:null}],head:0,n:1}],
 max_depth_tree:[{root:{val:3,left:{val:9,left:null,right:null},right:{val:20,left:{val:15,left:null,right:null},right:{val:7,left:null,right:null}}}},{root:null}],
 invert_tree:[{root:{val:4,left:{val:2,left:{val:1,left:null,right:null},right:{val:3,left:null,right:null}},right:{val:7,left:{val:6,left:null,right:null},right:{val:9,left:null,right:null}}}},{root:null}],
 level_order:[{root:{val:3,left:{val:9,left:null,right:null},right:{val:20,left:{val:15,left:null,right:null},right:{val:7,left:null,right:null}}}},{root:null}],
 validate_bst:[{root:{val:2,left:{val:1,left:null,right:null},right:{val:3,left:null,right:null}}},{root:{val:5,left:{val:1,left:null,right:null},right:{val:4,left:{val:3,left:null,right:null},right:{val:6,left:null,right:null}}}}],
 kth_smallest_bst:[{root:{val:3,left:{val:1,left:null,right:{val:2,left:null,right:null}},right:{val:4,left:null,right:null}},k:1},{root:{val:5,left:{val:3,left:{val:2,left:null,right:null},right:{val:4,left:null,right:null}},right:{val:6,left:null,right:null}},k:3}],
 num_islands:[{grid:['11110','11010','11000','00000']},{grid:['11000','11000','00100','00011']},{grid:['0']}],
 word_ladder_length:[{beginWord:'hit',endWord:'cog',wordList:['hot','dot','dog','lot','log','cog']},{beginWord:'hit',endWord:'cog',wordList:['hot','dot','dog','lot','log']},{beginWord:'same',endWord:'same',wordList:[]}],
 course_schedule:[{numCourses:2,prerequisites:[[1,0]]},{numCourses:2,prerequisites:[[1,0],[0,1]]},{numCourses:3,prerequisites:[]}],
 oranges_rotting:[{grid:[[2,1,1],[1,1,0],[0,1,1]]},{grid:[[2,1,1],[0,1,1],[1,0,1]]},{grid:[[0,2]]}],
 subsets:[{nums:[1,2,3]},{nums:[0]},{nums:[]}],
 combination_sum:[{candidates:[2,3,6,7],target:7},{candidates:[2,3,5],target:8},{candidates:[2],target:1}],
 permutations:[{nums:[1,2,3]},{nums:[0,1]},{nums:[]}],
 word_search:[{board:['ABCE','SFCS','ADEE'],word:'ABCCED'},{board:['ABCE','SFCS','ADEE'],word:'SEE'},{board:['ABCE','SFCS','ADEE'],word:'ABCB'}],
 house_robber:[{nums:[1,2,3,1]},{nums:[2,7,9,3,1]},{nums:[]}],
 unique_paths:[{m:3,n:7},{m:3,n:2},{m:1,n:1}],
 min_path_sum:[{grid:[[1,3,1],[1,5,1],[4,2,1]]},{grid:[[1,2,3],[4,5,6]]}],
 jump_game:[{nums:[2,3,1,1,4]},{nums:[3,2,1,0,4]},{nums:[0]}],
 gas_station:[{gas:[1,2,3,4,5],cost:[3,4,5,1,2]},{gas:[2,3,4],cost:[3,4,3]}],
 search_rotated:[{nums:[4,5,6,7,0,1,2],target:0},{nums:[4,5,6,7,0,1,2],target:3},{nums:[1],target:0}],
 find_min_rotated:[{nums:[3,4,5,1,2]},{nums:[4,5,6,7,0,1,2]},{nums:[1]}],
 k_closest_points:[{points:[[1,3],[-2,2]],k:1},{points:[[3,3],[5,-1],[-2,4]],k:2}],
 word_break:[{s:'leetcode',wordDict:['leet','code']},{s:'applepenapple',wordDict:['apple','pen']},{s:'catsandog',wordDict:['cats','dog','sand','and','cat']}],
 median_two_sorted_arrays:[{nums1:[1,3],nums2:[2]},{nums1:[1,2],nums2:[3,4]},{nums1:[],nums2:[1]}]
};
function randomString(n,alphabet='abcd'){return Array.from({length:n},()=>alphabet[ri(0,alphabet.length-1)]).join('');}
function randomTree(depth=0,max=4){if(depth>=max||ri(0,4)===0)return null;return {val:ri(-20,20),left:randomTree(depth+1,max),right:randomTree(depth+1,max)};}
function randomBst(){const vals=[...new Set(Array.from({length:ri(1,10)},()=>ri(-30,30)))].sort((a,b)=>a-b);let root=null;for(const val of vals){if(!root){root={val,left:null,right:null};continue;}let p=root;while(true){const side=val<p.val?'left':'right';if(!p[side]){p[side]={val,left:null,right:null};break;}p=p[side];}}return root;}
function linked(nodes){return {nodes:nodes.map((val,i)=>({val,next:i+1<nodes.length?i+1:null})),head:nodes.length?0:null};}
function randomInputCore(id){
 const nums=(n,lo=-10,hi=10)=>Array.from({length:n},()=>ri(lo,hi));
 switch(id){
 case 'contains_duplicate':return {nums:nums(ri(0,25))};
 case 'valid_anagram':{const s=randomString(ri(0,16));return {s,t:ri(0,1)?chars(s).sort(()=>ri(0,1)?1:-1).join(''):randomString(ri(0,16))};}
 case 'group_anagrams':return {strs:Array.from({length:ri(0,14)},()=>randomString(ri(0,7)))};
 case 'product_except_self':return {nums:nums(ri(1,10),-4,4)};
 case 'best_time_stock':return {prices:nums(ri(1,20),0,50)};
 case 'move_zeroes':return {nums:nums(ri(0,25),0,6)};
 case 'three_sum':return {nums:nums(ri(0,16),-10,10)};
 case 'container_water':return {height:nums(ri(0,20),0,30)};
 case 'longest_substring':return {text:randomString(ri(0,30),'abcde')};
 case 'min_window':{const s=randomString(ri(0,25),'abc');const t=randomString(ri(0,5),'abc');return {s,t};}
 case 'daily_temperatures':return {temperatures:nums(ri(0,30),20,40)};
 case 'largest_rectangle':return {heights:nums(ri(0,20),0,12)};
 case 'eval_rpn':{const n=ri(2,6),tokens=[],stack=[];for(let i=0;i<n;i++){const v=ri(1,9);tokens.push(String(v));stack.push(v);if(i>0&&ri(0,1)){const b=stack.pop(),a=stack.pop(),op=['+','-','*'][ri(0,2)],v2=op==='+'?a+b:op==='-'?a-b:a*b;tokens.push(op);stack.push(v2);}}while(stack.length>1){const b=stack.pop(),a=stack.pop();tokens.push('+');stack.push(a+b);}return {tokens};}
 case 'reverse_linked_list':return linked(nums(ri(0,10)));
 case 'merge_two_lists':{const a=nums(ri(0,7)).sort((x,y)=>x-y),b=nums(ri(0,7)).sort((x,y)=>x-y),nodes=[...a,...b].map((val,i,all)=>({val,next:i+1<all.length?i+1:null}));if(a.length)nodes[a.length-1].next=null;if(b.length)nodes[a.length+b.length-1].next=null;return {nodes,headA:a.length?0:null,headB:b.length?a.length:null};}
 case 'linked_list_cycle':{const n=ri(0,12),next=Array.from({length:n},(_,i)=>i+1<n?i+1:null);if(n>1&&ri(0,1))next[n-1]=ri(0,n-2);return {next,head:n?0:null};}
 case 'remove_nth_from_end':{const n=ri(1,10),x=linked(nums(n));return {...x,n:ri(1,n)};}
 case 'max_depth_tree':case 'invert_tree':case 'level_order':return {root:randomTree()};
 case 'validate_bst':return {root:randomTree()};
 case 'kth_smallest_bst':{const root=randomBst();return {root,k:ri(1,10)};}
 case 'num_islands':{const m=ri(1,8),n=ri(1,8);return {grid:Array.from({length:m},()=>randomString(n,'01'))};}
 case 'word_ladder_length':{const words=['hot','dot','dog','lot','log','cog','hit','hat','cat','cot'];return {beginWord:'hit',endWord:'cog',wordList:words.filter(()=>ri(0,1))};}
 case 'course_schedule':{const n=ri(0,12),prerequisites=[];for(let i=0;i<ri(0,20);i++)if(n)prerequisites.push([ri(0,n-1),ri(0,n-1)]);return {numCourses:n,prerequisites};}
 case 'oranges_rotting':{const m=ri(1,6),n=ri(1,6);return {grid:Array.from({length:m},()=>Array.from({length:n},()=>ri(0,2)))};}
 case 'subsets':return {nums:[...new Set(nums(ri(0,9)))]};
 case 'combination_sum':{const candidates=[...new Set(nums(ri(1,7),1,9))].sort((a,b)=>a-b);return {candidates,target:ri(1,25)};}
 case 'permutations':return {nums:[...new Set(nums(ri(0,7),-5,8))]};
 case 'word_search':{const m=ri(1,4),n=ri(1,4),board=Array.from({length:m},()=>randomString(n,'abc'));return {board,word:randomString(ri(1,7),'abc')};}
 case 'house_robber':return {nums:nums(ri(0,25),0,30)};
 case 'unique_paths':return {m:ri(1,10),n:ri(1,10)};
 case 'min_path_sum':{const m=ri(1,6),n=ri(1,6);return {grid:Array.from({length:m},()=>nums(n,0,9))};}
 case 'jump_game':return {nums:nums(ri(1,20),0,6)};
 case 'gas_station':{const n=ri(1,12);return {gas:nums(n,0,10),cost:nums(n,0,10)};}
 case 'search_rotated':case 'find_min_rotated':{const a=[...new Set(nums(ri(1,20),-20,20))].sort((x,y)=>x-y),k=ri(0,a.length-1),rot=[...a.slice(k),...a.slice(0,k)];return id==='search_rotated'?{nums:rot,target:ri(0,1)?a[ri(0,a.length-1)]:100}:{nums:rot};}
 case 'k_closest_points':{const n=ri(1,15),points=Array.from({length:n},()=>nums(2,-10,10));return {points,k:ri(1,n)};}
 case 'word_break':{const s=randomString(ri(0,20),'abc'),wordDict=[...new Set(Array.from({length:ri(1,8)},()=>randomString(ri(1,4),'abc')))];return {s,wordDict};}
 case 'median_two_sorted_arrays':{let a=nums(ri(0,12)).sort((x,y)=>x-y),b=nums(ri(0,12)).sort((x,y)=>x-y);if(!a.length&&!b.length)b=[0];return {nums1:a,nums2:b};}
 default:throw new Error('No core generator for '+id);
 }
}
export function coreSuite(id){const base=baseCases[id];if(!base)throw new Error('No core suite '+id);return [...base.map((input,i)=>({input,public:i<2,expected:referenceCore(id,input)})),...Array.from({length:16},()=>{const input=randomInputCore(id);return {input,public:false,expected:referenceCore(id,input)};})];}
export function matchesCore(id,d,a,e){return eq(a,e);}
