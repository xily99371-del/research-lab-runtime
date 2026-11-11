import {randomInt} from 'node:crypto';

export const HOT_IDS=[
'three_sum','longest_substring','product_except_self','container_water','move_zeroes','rotate_array',
'valid_anagram','group_anagrams','longest_palindrome','subarray_sum',
'min_stack','daily_temperatures',
'reverse_linked_list','merge_two_lists','linked_list_cycle','remove_nth_from_end','reorder_list',
'max_depth_tree','invert_tree','level_order_tree','validate_bst','kth_smallest_bst','tree_diameter','lowest_common_ancestor',
'number_of_islands','rotting_oranges','course_schedule',
'subsets','permutations','combination_sum','word_search',
'search_rotated','find_min_rotated','kth_largest','merge_sorted_array',
'climbing_stairs','house_robber','unique_paths','decode_ways','longest_increasing_subsequence'
];
const ri=(a,b)=>randomInt(a,b+1);
const clone=x=>JSON.parse(JSON.stringify(x));
function listFrom(a){let head=null;for(let i=a.length-1;i>=0;i--)head={val:a[i],next:head};return head;}
function listToArray(h){const a=[];let n=0;while(h&&n++<1000){a.push(h.val);h=h.next;}return a;}
function treeFrom(a){if(!a.length||a[0]==null)return null;const nodes=a.map(x=>x==null?null:{val:x,left:null,right:null});let q=[nodes[0]],i=1;for(let j=0;j<q.length&&i<nodes.length;j++){const n=q[j];if(!n)continue;if(i<nodes.length){n.left=nodes[i];if(nodes[i])q.push(nodes[i]);i++;}if(i<nodes.length){n.right=nodes[i];if(nodes[i])q.push(nodes[i]);i++;}}return nodes[0];}
function treeToLevel(root){if(!root)return[];const q=[root],a=[];while(q.length){const n=q.shift();if(!n){a.push(null);continue;}a.push(n.val);q.push(n.left,n.right);}while(a.length&&a[a.length-1]===null)a.pop();return a;}
const sortNum=a=>a.sort((x,y)=>x-y);
export function referenceHot(id,d){
 switch(id){
 case 'three_sum':{const a=[...d.nums].sort((x,y)=>x-y),out=[];for(let i=0;i<a.length-2;i++){if(i&&a[i]===a[i-1])continue;let l=i+1,r=a.length-1;while(l<r){const s=a[i]+a[l]+a[r];if(s===0){out.push([a[i],a[l],a[r]]);const x=a[l],y=a[r];while(l<r&&a[l]===x)l++;while(l<r&&a[r]===y)r--;}else if(s<0)l++;else r--;}}return out;}
 case 'longest_substring':{const s=Array.from(d.text),last=new Map();let left=0,best=0;for(let r=0;r<s.length;r++){if(last.has(s[r]))left=Math.max(left,last.get(s[r])+1);last.set(s[r],r);best=Math.max(best,r-left+1);}return best;}
 case 'product_except_self':{const a=d.nums,n=a.length,out=Array(n).fill(1),p=1;for(let i=0;i<n;i++){out[i]=p;p*=a[i];}let q=1;for(let i=n-1;i>=0;i--){out[i]*=q;q*=a[i];}return out;}
 case 'container_water':{const a=d.height;let l=0,r=a.length-1,b=0;while(l<r){b=Math.max(b,Math.min(a[l],a[r])*(r-l));if(a[l]<a[r])l++;else r--;}return b;}
 case 'move_zeroes':{const a=[...d.nums],v=a.filter(x=>x!==0);return [...v,...Array(a.length-v.length).fill(0)];}
 case 'rotate_array':{const a=d.nums,n=a.length;if(!n)return[];const k=((d.k%n)+n)%n;return [...a.slice(n-k),...a.slice(0,n-k)];}
 case 'valid_anagram':{const a=Array.from(d.s),b=Array.from(d.t);if(a.length!==b.length)return false;const m=new Map();for(const x of a)m.set(x,(m.get(x)||0)+1);for(const x of b){const n=m.get(x)||0;if(!n)return false;if(n===1)m.delete(x);else m.set(x,n-1);}return m.size===0;}
 case 'group_anagrams':{const m=new Map();for(const s of d.words){const k=Array.from(s).sort().join('');if(!m.has(k))m.set(k,[]);m.get(k).push(s);}return [...m.values()];}
 case 'longest_palindrome':{const s=Array.from(d.text);let best='';for(let i=0;i<s.length;i++)for(const [l0,r0] of [[i,i],[i,i+1]]){let l=l0,r=r0;while(l>=0&&r<s.length&&s[l]===s[r]){l--;r++;}if(r-l-1>best.length)best=s.slice(l+1,r).join('');}return best;}
 case 'subarray_sum':{const m=new Map([[0,1]]);let sum=0,out=0;for(const x of d.nums){sum+=x;out+=m.get(sum-d.k)||0;m.set(sum,(m.get(sum)||0)+1);}return out;}
 case 'min_stack':{const st=[],mins=[],out=[];for(const op of d.ops){if(op[0]==='push'){st.push(op[1]);mins.push(Math.min(op[1],mins.length?mins[mins.length-1]:Infinity));}else if(op[0]==='pop'){st.pop();mins.pop();}else if(op[0]==='top')out.push(st.length?st[st.length-1]:null);else if(op[0]==='getMin')out.push(mins.length?mins[mins.length-1]:null);}return out;}
 case 'daily_temperatures':{const a=d.temperatures,out=Array(a.length).fill(0),st=[];for(let i=0;i<a.length;i++){while(st.length&&a[i]>a[st[st.length-1]]){const j=st.pop();out[j]=i-j;}st.push(i);}return out;}
 case 'reverse_linked_list':{let h=listFrom(d.values),p=null;while(h){const n=h.next;h.next=p;p=h;h=n;}return listToArray(p);}
 case 'merge_two_lists':{let a=listFrom(d.a),b=listFrom(d.b),dummy={next:null},t=dummy;while(a&&b){if(a.val<=b.val){t.next=a;a=a.next;}else{t.next=b;b=b.next;}t=t.next;}t.next=a||b;return listToArray(dummy.next);}
 case 'linked_list_cycle':{const a=d.values,idx=d.pos;if(idx<0||!a.length)return false;let slow=0,fast=0;const next=i=>i<0?-1:(i+1<a.length?i+1:idx);for(let z=0;z<a.length*3+3;z++){slow=next(slow);fast=next(next(fast));if(slow<0||fast<0)return false;if(slow===fast)return true;}return false;}
 case 'remove_nth_from_end':{const a=[...d.values],i=a.length-d.n;if(i>=0&&i<a.length)a.splice(i,1);return a;}
 case 'reorder_list':{const a=d.values,out=[];let l=0,r=a.length-1;while(l<=r){out.push(a[l++]);if(l<=r)out.push(a[r--]);}return out;}
 case 'max_depth_tree':{const h=a=>!a?0:1+Math.max(h(a.left),h(a.right));return h(treeFrom(d.level));}
 case 'invert_tree':{const f=n=>{if(!n)return null;const l=f(n.left),r=f(n.right);n.left=r;n.right=l;return n;};return treeToLevel(f(treeFrom(d.level)));}
 case 'level_order_tree':{const root=treeFrom(d.level);if(!root)return[];const q=[root],out=[];while(q.length){const n=q.length,row=[];for(let i=0;i<n;i++){const x=q.shift();row.push(x.val);if(x.left)q.push(x.left);if(x.right)q.push(x.right);}out.push(row);}return out;}
 case 'validate_bst':{const f=(n,lo,hi)=>!n||((lo===null||n.val>lo)&&(hi===null||n.val<hi)&&f(n.left,lo,n.val)&&f(n.right,n.val,hi));return f(treeFrom(d.level),null,null);}
 case 'kth_smallest_bst':{const a=[];const f=n=>{if(!n)return;f(n.left);a.push(n.val);f(n.right);};f(treeFrom(d.level));return a[d.k-1]??null;}
 case 'tree_diameter':{let best=0;const h=n=>{if(!n)return 0;const l=h(n.left),r=h(n.right);best=Math.max(best,l+r);return 1+Math.max(l,r);};h(treeFrom(d.level));return best;}
 case 'lowest_common_ancestor':{const root=treeFrom(d.level);let ans=null;const f=n=>{if(!n)return 0;const l=f(n.left),r=f(n.right),m=Number(n.val===d.p)+Number(n.val===d.q);if(l+r+m>=2&&ans===null)ans=n.val;return Number(l+r+m>0);};f(root);return ans;}
 case 'number_of_islands':{const g=d.grid.map(r=>r.split(''));if(!g.length)return 0;let n=0;for(let i=0;i<g.length;i++)for(let j=0;j<g[i].length;j++)if(g[i][j]==='1'){n++;const st=[[i,j]];g[i][j]='0';while(st.length){const [x,y]=st.pop();for(const [a,b]of [[1,0],[-1,0],[0,1],[0,-1]]){const u=x+a,v=y+b;if(g[u]?.[v]==='1'){g[u][v]='0';st.push([u,v]);}}}}return n;}
 case 'rotting_oranges':{const g=d.grid.map(r=>[...r]),q=[],fresh=0;for(let i=0;i<g.length;i++)for(let j=0;j<g[i].length;j++){if(g[i][j]===2)q.push([i,j,0]);if(g[i][j]===1)fresh++;}let t=0;for(let z=0;z<q.length;z++){const [i,j,k]=q[z];t=Math.max(t,k);for(const [a,b]of [[1,0],[-1,0],[0,1],[0,-1]]){const x=i+a,y=j+b;if(g[x]?.[y]===1){g[x][y]=2;fresh--;q.push([x,y,k+1]);}}}return fresh?-1:t;}
 case 'course_schedule':{const n=d.numCourses,adj=Array.from({length:n},()=>[]),deg=Array(n).fill(0);for(const [a,b]of d.prerequisites){adj[b].push(a);deg[a]++;}const q=[];deg.forEach((x,i)=>{if(!x)q.push(i);});let seen=0;for(let i=0;i<q.length;i++){const u=q[i];seen++;for(const v of adj[u])if(--deg[v]===0)q.push(v);}return seen===n;}
 case 'subsets':{const a=d.nums,out=[];const f=(i,p)=>{if(i===a.length){out.push([...p]);return;}f(i+1,p);p.push(a[i]);f(i+1,p);p.pop();};f(0,[]);return out;}
 case 'permutations':{const a=d.nums,out=[],used=Array(a.length).fill(false);const f=p=>{if(p.length===a.length){out.push([...p]);return;}for(let i=0;i<a.length;i++)if(!used[i]){used[i]=true;p.push(a[i]);f(p);p.pop();used[i]=false;}};f([]);return out;}
 case 'combination_sum':{const a=[...new Set(d.candidates)].sort((x,y)=>x-y),out=[];const f=(i,left,p)=>{if(left===0){out.push([...p]);return;}for(let j=i;j<a.length&&a[j]<=left;j++){p.push(a[j]);f(j,left-a[j],p);p.pop();}};f(0,d.target,[]);return out;}
 case 'word_search':{const g=d.board.map(r=>[...r]),w=[...d.word];if(!w.length)return true;const f=(i,j,k)=>{if(k===w.length)return true;if(!g[i]||g[i][j]!==w[k])return false;const c=g[i][j];g[i][j]='#';const ok=f(i+1,j,k+1)||f(i-1,j,k+1)||f(i,j+1,k+1)||f(i,j-1,k+1);g[i][j]=c;return ok;};for(let i=0;i<g.length;i++)for(let j=0;j<g[i].length;j++)if(f(i,j,0))return true;return false;}
 case 'search_rotated':{const a=d.nums;let l=0,r=a.length-1;while(l<=r){const m=(l+r)>>1;if(a[m]===d.target)return m;if(a[l]<=a[m]){if(a[l]<=d.target&&d.target<a[m])r=m-1;else l=m+1;}else{if(a[m]<d.target&&d.target<=a[r])l=m+1;else r=m-1;}}return -1;}
 case 'find_min_rotated':{const a=d.nums;if(!a.length)return null;let l=0,r=a.length-1;while(l<r){const m=(l+r)>>1;if(a[m]>a[r])l=m+1;else r=m;}return a[l];}
 case 'kth_largest':{const a=[...d.nums].sort((x,y)=>y-x);return a[d.k-1]??null;}
 case 'merge_sorted_array':{const a=[...d.a,...d.b];return sortNum(a);}
 case 'climbing_stairs':{let a=1,b=1;for(let i=0;i<d.n;i++){[a,b]=[b,a+b];}return a;}
 case 'house_robber':{let a=0,b=0;for(const x of d.nums){const c=Math.max(b,a+x);a=b;b=c;}return b;}
 case 'unique_paths':{const row=Array(d.n).fill(1);for(let i=1;i<d.m;i++)for(let j=1;j<d.n;j++)row[j]+=row[j-1];return row[d.n-1]??0;}
 case 'decode_ways':{const s=d.s;if(!s.length||s[0]==='0')return 0;let a=1,b=1;for(let i=1;i<s.length;i++){let c=s[i]==='0'?0:b;if(Number(s.slice(i-1,i+1))>=10&&Number(s.slice(i-1,i+1))<=26)c+=a;a=b;b=c;}return b;}
 case 'longest_increasing_subsequence':{const tails=[];for(const x of d.nums){let l=0,r=tails.length;while(l<r){const m=(l+r)>>1;if(tails[m]<x)l=m+1;else r=m;}tails[l]=x;}return tails.length;}
 default:throw new Error('Unknown Hot100 task '+id);
 }
}
function baseCases(id){const b={
three_sum:[{nums:[-1,0,1,2,-1,-4]},{nums:[0,0,0,0]},{nums:[]}],
longest_substring:[{text:'abcabcbb'},{text:'bbbbb'},{text:'pwwkew'}],
product_except_self:[{nums:[1,2,3,4]},{nums:[-1,1,0,-3,3]}],
container_water:[{height:[1,8,6,2,5,4,8,3,7]}],
move_zeroes:[{nums:[0,1,0,3,12]},{nums:[0,0,0]}],
rotate_array:[{nums:[1,2,3,4,5,6,7],k:3},{nums:[-1,-100,3,99],k:2}],
valid_anagram:[{s:'anagram',t:'nagaram'},{s:'rat',t:'car'}],
group_anagrams:[{words:['eat','tea','tan','ate','nat','bat']}],
longest_palindrome:[{text:'babad'},{text:'cbbd'}],
subarray_sum:[{nums:[1,1,1],k:2},{nums:[1,2,3],k:3}],
min_stack:[{ops:[['push',-2],['push',0],['push',-3],['getMin'],['pop'],['top'],['getMin']]}],
daily_temperatures:[{temperatures:[73,74,75,71,69,72,76,73]}],
reverse_linked_list:[{values:[1,2,3,4,5]}],
merge_two_lists:[{a:[1,2,4],b:[1,3,4]}],
linked_list_cycle:[{values:[3,2,0,-4],pos:1},{values:[1,2],pos:-1}],
remove_nth_from_end:[{values:[1,2,3,4,5],n:2}],
reorder_list:[{values:[1,2,3,4]},{values:[1,2,3,4,5]}],
max_depth_tree:[{level:[3,9,20,null,null,15,7]}],
invert_tree:[{level:[4,2,7,1,3,6,9]}],
level_order_tree:[{level:[3,9,20,null,null,15,7]}],
validate_bst:[{level:[2,1,3]},{level:[5,1,4,null,null,3,6]}],
kth_smallest_bst:[{level:[3,1,4,null,2],k:1}],
tree_diameter:[{level:[1,2,3,4,5]}],
lowest_common_ancestor:[{level:[3,5,1,6,2,0,8,null,null,7,4],p:5,q:1}],
number_of_islands:[{grid:['11110','11010','11000','00000']},{grid:['11000','11000','00100','00011']}],
rotting_oranges:[{grid:[[2,1,1],[1,1,0],[0,1,1]]},{grid:[[2,1,1],[0,1,1],[1,0,1]]}],
course_schedule:[{numCourses:2,prerequisites:[[1,0]]},{numCourses:2,prerequisites:[[1,0],[0,1]]}],
subsets:[{nums:[1,2,3]}],
permutations:[{nums:[1,2,3]}],
combination_sum:[{candidates:[2,3,6,7],target:7}],
word_search:[{board:['ABCE','SFCS','ADEE'],word:'ABCCED'},{board:['ABCE','SFCS','ADEE'],word:'ABCB'}],
search_rotated:[{nums:[4,5,6,7,0,1,2],target:0},{nums:[4,5,6,7,0,1,2],target:3}],
find_min_rotated:[{nums:[3,4,5,1,2]}],
kth_largest:[{nums:[3,2,1,5,6,4],k:2}],
merge_sorted_array:[{a:[1,2,4],b:[1,3,4]}],
climbing_stairs:[{n:3},{n:5}],
house_robber:[{nums:[1,2,3,1]},{nums:[2,7,9,3,1]}],
unique_paths:[{m:3,n:7}],
decode_ways:[{s:'226'},{s:'06'}],
longest_increasing_subsequence:[{nums:[10,9,2,5,3,7,101,18]}]
};return b[id]||[];}
export function suiteHot(id){const b=baseCases(id);if(!b.length)throw new Error('Missing Hot100 test cases '+id);return [...b.map((input,i)=>({input,public:i<2,expected:referenceHot(id,input)})),...Array.from({length:16},()=>{const input=randomHot(id);return {input,public:false,expected:referenceHot(id,input)};})];}
function randomHot(id){
 const ints=(n,lo=-5,hi=10)=>Array.from({length:n},()=>ri(lo,hi));
 switch(id){
 case 'three_sum':case 'product_except_self':case 'move_zeroes':case 'kth_largest':case 'longest_increasing_subsequence':return {nums:ints(ri(0,12)) ,...(id==='kth_largest'?{k:ri(1,Math.max(1,12))}:{})};
 case 'longest_substring':case 'longest_palindrome':return {text:Array.from({length:ri(0,15)},()=> 'abcde'[ri(0,4)]).join('')};
 case 'container_water':return {height:ints(ri(0,12),0,12)};
 case 'rotate_array':return {nums:ints(ri(0,12)),k:ri(0,20)};
 case 'valid_anagram':{const s=Array.from({length:ri(0,10)},()=> 'abc'[ri(0,2)]).join('');return {s,t:Math.random()<.5?s:Array.from(s).reverse().join('')};}
 case 'group_anagrams':return {words:Array.from({length:ri(0,10)},()=>Array.from({length:ri(0,5)},()=> 'abc'[ri(0,2)]).join(''))};
 case 'subarray_sum':return {nums:ints(ri(0,12)),k:ri(-5,8)};
 case 'min_stack':return {ops:[['push',ri(-5,5)],['push',ri(-5,5)],['getMin'],['top'],['pop'],['getMin']]};
 case 'daily_temperatures':return {temperatures:ints(ri(0,12),30,100)};
 case 'reverse_linked_list':case 'reorder_list':return {values:ints(ri(0,12))};
 case 'merge_two_lists':return {a:ints(ri(0,8)).sort((a,b)=>a-b),b:ints(ri(0,8)).sort((a,b)=>a-b)};
 case 'linked_list_cycle':{const n=ri(0,10);return {values:ints(n),pos:n?ri(-1,n-1):-1};}
 case 'remove_nth_from_end':{const n=ri(1,10),values=ints(n);return {values,n:ri(1,n)};}
 case 'max_depth_tree':case 'invert_tree':case 'level_order_tree':case 'validate_bst':case 'kth_smallest_bst':case 'tree_diameter':case 'lowest_common_ancestor':{const level=[ri(0,20),ri(0,20),ri(0,20),ri(0,20),ri(0,20)];return {level,...(id==='kth_smallest_bst'?{k:ri(1,5)}:{}),...(id==='lowest_common_ancestor'?{p:level[1],q:level[2]}:{})};}
 case 'number_of_islands':return {grid:Array.from({length:ri(1,5)},()=>Array.from({length:ri(1,5)},()=>ri(0,1)).join(''))};
 case 'rotting_oranges':return {grid:Array.from({length:ri(1,4)},()=>Array.from({length:ri(1,4)},()=>ri(0,2)))};
 case 'course_schedule':{const n=ri(1,7),pairs=[];for(let i=0;i<ri(0,10);i++)pairs.push([ri(0,n-1),ri(0,n-1)]);return {numCourses:n,prerequisites:pairs};}
 case 'subsets':case 'permutations':return {nums:ints(ri(0,6),0,8)};
 case 'combination_sum':{const candidates=[...new Set(ints(ri(1,5),1,8))].sort((a,b)=>a-b);return {candidates,target:ri(1,18)};}
 case 'word_search':{const h=ri(1,4),w=ri(1,4),board=Array.from({length:h},()=>Array.from({length:w},()=> 'ABC'[ri(0,2)]).join(''));return {board,word:Array.from({length:ri(1,5)},()=> 'ABC'[ri(0,2)]).join('')};}
 case 'search_rotated':case 'find_min_rotated':{const a=[...new Set(ints(ri(1,10),0,20))].sort((a,b)=>a-b),k=ri(0,a.length-1),nums=[...a.slice(k),...a.slice(0,k)];return id==='search_rotated'?{nums,target:ri(0,20)}:{nums};}
 case 'merge_sorted_array':return {a:ints(ri(0,8)).sort((a,b)=>a-b),b:ints(ri(0,8)).sort((a,b)=>a-b)};
 case 'climbing_stairs':return {n:ri(0,20)};
 case 'house_robber':return {nums:ints(ri(0,12),0,20)};
 case 'unique_paths':return {m:ri(1,8),n:ri(1,8)};
 case 'decode_ways':return {s:Array.from({length:ri(1,12)},()=>String(ri(0,9))).join('')};
 default:throw new Error('No random Hot100 input '+id);
 }
}
export function matchesHot(id,d,a,e){
 const eq=(x,y)=>{if(typeof x==='number'&&typeof y==='number')return Number.isFinite(x)&&Number.isFinite(y)&&Math.abs(x-y)<=1e-7+1e-7*Math.abs(y);if(Array.isArray(x)||Array.isArray(y)){if(!Array.isArray(x)||!Array.isArray(y)||x.length!==y.length)return false;if(['three_sum','group_anagrams','subsets','permutations','combination_sum'].includes(id)){const key=v=>JSON.stringify(v);return [...x].map(key).sort().join('|')===[...y].map(key).sort().join('|');}return x.every((v,i)=>eq(v,y[i]));}if(x&&y&&typeof x==='object'&&typeof y==='object')return Object.keys(x).length===Object.keys(y).length&&Object.keys(x).every(k=>k in y&&eq(x[k],y[k]));return x===y;};return eq(a,e);
}
