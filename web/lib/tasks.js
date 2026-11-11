import {randomInt} from 'node:crypto';

export const ALGORITHMS=[
'two_sum','parentheses','bfs','attention','astar','binary_search','dijkstra',
'knapsack','merge_intervals','top_k','max_subarray','union_find','lcs',
'topological_sort','coin_change','lis','sliding_window_max','kmp',
'matrix_multiply','interval_scheduling','connected_components','edit_distance'
];
export const ROS=['ros_topic','ros_service','ros_tf','ros_action'];
const ri=(a,b)=>randomInt(a,b+1);
const sortNum=a=>[...a].sort((x,y)=>x-y);
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);

export function reference(id,d){
 if(id==='two_sum'){const seen=new Map();for(let i=0;i<d.nums.length;i++){const j=seen.get(d.target-d.nums[i]);if(j!==undefined)return[j,i];seen.set(d.nums[i],i);}return[];}
 if(id==='parentheses'){const st=[],m={')':'(',']':'[','}':'{'};for(const c of d.text){if('([{'.includes(c))st.push(c);else if(st.pop()!==m[c])return false;}return st.length===0;}
 if(id==='bfs'){if(!d.n)return[];const g=Array.from({length:d.n},()=>new Set());for(const [a,b]of d.edges){g[a].add(b);g[b].add(a);}const q=[d.start],v=new Set(q);for(let i=0;i<q.length;i++)for(const x of [...g[q[i]]].sort((a,b)=>a-b))if(!v.has(x)){v.add(x);q.push(x);}return q;}
 if(id==='attention')return d.q.map((q,i)=>{const z=d.k.map((k,j)=>d.mask&&!d.mask[i][j]?-Infinity:q.reduce((s,x,a)=>s+x*k[a],0)/Math.sqrt(q.length));const max=Math.max(...z);if(max===-Infinity)return Array(d.v[0].length).fill(0);const ex=z.map(x=>Math.exp(x-max)),sum=ex.reduce((a,b)=>a+b,0);return d.v[0].map((_,c)=>ex.reduce((s,x,j)=>s+x/sum*d.v[j][c],0));});
 if(id==='astar'){const g=d.grid,[sr,sc]=d.start,[er,ec]=d.goal;if(g[sr][sc]||g[er][ec])return-1;const q=[[sr,sc,0]],v=new Set([sr+','+sc]);for(let i=0;i<q.length;i++){const[r,c,n]=q[i];if(r===er&&c===ec)return n;for(const[a,b]of[[r+1,c],[r-1,c],[r,c+1],[r,c-1]]){const k=a+','+b;if(a>=0&&a<g.length&&b>=0&&b<g[0].length&&!g[a][b]&&!v.has(k)){v.add(k);q.push([a,b,n+1]);}}}return-1;}
 if(id==='binary_search'){let l=0,r=d.nums.length;while(l<r){const m=(l+r)>>1;if(d.nums[m]<d.target)l=m+1;else r=m;}return l<d.nums.length&&d.nums[l]===d.target?l:-1;}
 if(id==='dijkstra'){const g=Array.from({length:d.n},()=>[]);for(const[u,v,w]of d.edges)g[u].push([v,w]);const dist=Array(d.n).fill(Infinity),used=Array(d.n).fill(false);dist[d.source]=0;for(let z=0;z<d.n;z++){let u=-1;for(let i=0;i<d.n;i++)if(!used[i]&&(u<0||dist[i]<dist[u]))u=i;if(u<0||!Number.isFinite(dist[u]))break;used[u]=true;for(const[v,w]of g[u])if(dist[v]>dist[u]+w)dist[v]=dist[u]+w;}return dist.map(x=>Number.isFinite(x)?x:null);}
 if(id==='knapsack'){const n=d.weights.length,dp=Array(d.capacity+1).fill(0);for(let i=0;i<n;i++)for(let c=d.capacity;c>=d.weights[i];c--)dp[c]=Math.max(dp[c],dp[c-d.weights[i]]+d.values[i]);return dp[d.capacity];}
 if(id==='merge_intervals'){const a=[...d.intervals].sort((x,y)=>x[0]-y[0]||x[1]-y[1]),out=[];for(const x of a){if(!out.length||x[0]>out[out.length-1][1])out.push([...x]);else out[out.length-1][1]=Math.max(out[out.length-1][1],x[1]);}return out;}
 if(id==='top_k'){const f=new Map();for(const x of d.nums)f.set(x,(f.get(x)||0)+1);return [...f].sort((a,b)=>b[1]-a[1]||a[0]-b[0]).slice(0,d.k).map(x=>x[0]);}
 if(id==='max_subarray'){if(!d.nums.length)return 0;let best=d.nums[0],cur=best;for(const x of d.nums.slice(1)){cur=Math.max(x,cur+x);best=Math.max(best,cur);}return best;}
 if(id==='union_find'){const p=Array.from({length:d.n},(_,i)=>i),find=x=>{while(p[x]!==x){p[x]=p[p[x]];x=p[x];}return x;},out=[];for(const op of d.operations){if(op[0]==='union'){const a=find(op[1]),b=find(op[2]);if(a!==b)p[a]=b;}else out.push(find(op[1])===find(op[2]));}return out;}
 if(id==='lcs'){const a=d.a,b=d.b,dp=Array(b.length+1).fill(0);for(const x of a){let prev=0;for(let j=1;j<=b.length;j++){const old=dp[j];dp[j]=x===b[j-1]?prev+1:Math.max(dp[j],dp[j-1]);prev=old;}}return dp[b.length];}
 if(id==='topological_sort'){const g=Array.from({length:d.n},()=>[]),deg=Array(d.n).fill(0);for(const[a,b]of d.edges){g[a].push(b);deg[b]++;}const q=[];for(let i=0;i<d.n;i++)if(!deg[i])q.push(i);q.sort((a,b)=>a-b);const out=[];while(q.length){const u=q.shift();out.push(u);for(const v of g[u])if(--deg[v]===0){q.push(v);q.sort((a,b)=>a-b);}}return out.length===d.n?out:[];}
 if(id==='coin_change'){const dp=Array(d.amount+1).fill(Infinity);dp[0]=0;for(let x=1;x<=d.amount;x++)for(const c of d.coins)if(c>0&&c<=x)dp[x]=Math.min(dp[x],dp[x-c]+1);return Number.isFinite(dp[d.amount])?dp[d.amount]:-1;}
 if(id==='lis'){const tails=[];for(const x of d.nums){let l=0,r=tails.length;while(l<r){const m=(l+r)>>1;if(tails[m]<x)l=m+1;else r=m;}tails[l]=x;}return tails.length;}
 if(id==='sliding_window_max'){const q=[],out=[];for(let i=0;i<d.nums.length;i++){while(q.length&&q[0]<=i-d.k)q.shift();while(q.length&&d.nums[q[q.length-1]]<=d.nums[i])q.pop();q.push(i);if(i>=d.k-1)out.push(d.nums[q[0]]);}return out;}
 if(id==='kmp'){const s=d.text,p=d.pattern;if(!p.length)return Array.from({length:s.length+1},(_,i)=>i);const lps=Array(p.length).fill(0);for(let i=1,j=0;i<p.length;){if(p[i]===p[j])lps[i++]=++j;else if(j)j=lps[j-1];else lps[i++]=0;}const out=[];for(let i=0,j=0;i<s.length;){if(s[i]===p[j]){i++;j++;if(j===p.length){out.push(i-j);j=lps[j-1];}}else if(j)j=lps[j-1];else i++;}return out;}
 if(id==='matrix_multiply'){const A=d.A,B=d.B,m=A.length,n=B.length,p=B[0].length,out=Array.from({length:m},()=>Array(p).fill(0));for(let i=0;i<m;i++)for(let k=0;k<n;k++)for(let j=0;j<p;j++)out[i][j]+=A[i][k]*B[k][j];return out;}
 if(id==='interval_scheduling'){const a=[...d.intervals].sort((x,y)=>x[1]-y[1]||x[0]-y[0]);let end=-Infinity,count=0;for(const [s,e]of a)if(s>=end){count++;end=e;}return count;}
 if(id==='connected_components'){const p=Array.from({length:d.n},(_,i)=>i),find=x=>p[x]===x?x:(p[x]=find(p[x]));let count=d.n;for(const[a,b]of d.edges){const x=find(a),y=find(b);if(x!==y){p[x]=y;count--;}}return count;}
 if(id==='edit_distance'){const a=d.a,b=d.b,dp=Array.from({length:a.length+1},(_,i)=>i);for(let j=1;j<=b.length;j++){let prev=dp[0];dp[0]=j;for(let i=1;i<=a.length;i++){const old=dp[i];dp[i]=Math.min(dp[i]+1,dp[i-1]+1,prev+(a[i-1]===b[j-1]?0:1));prev=old;}}return dp[a.length];}
 throw new Error('Unknown task');
}
const cases={
two_sum:[{nums:[2,7,11,15],target:9},{nums:[3,3],target:6},{nums:[],target:0},{nums:[1],target:2},{nums:[-5,0,8,5],target:0}],
parentheses:[{text:'()[]{}'},{text:'([)]'},{text:''},{text:'((()))'},{text:'('},{text:'}{'}],
bfs:[{n:5,edges:[[0,1],[0,2],[1,3],[2,4]],start:0},{n:4,edges:[[0,1],[2,3]],start:0},{n:0,edges:[],start:0}],
attention:[{q:[[1,0]],k:[[1,0],[0,1]],v:[[2],[4]]},{q:[[1]],k:[[1000],[1001]],v:[[2],[4]],mask:[[false,false]]}],
astar:[{grid:[[0,0,0],[1,1,0],[0,0,0]],start:[0,0],goal:[2,2]},{grid:[[0]],start:[0,0],goal:[0,0]},{grid:[[1]],start:[0,0],goal:[0,0]}],
binary_search:[{nums:[1,2,4,7,9],target:7},{nums:[1,2,4,7,9],target:3},{nums:[],target:0}],
dijkstra:[{n:5,edges:[[0,1,2],[0,2,5],[1,2,1],[1,3,3],[2,4,2]],source:0},{n:3,edges:[[0,1,4]],source:0}],
knapsack:[{weights:[2,3,4],values:[4,5,7],capacity:5},{weights:[1,2],values:[2,3],capacity:0}],
merge_intervals:[{intervals:[[1,3],[2,6],[8,10],[15,18]]},{intervals:[]},{intervals:[[1,4],[4,5]]}],
top_k:[{nums:[1,1,1,2,2,3],k:2},{nums:[4,4,2,2,1],k:2}],
max_subarray:[{nums:[-2,1,-3,4,-1,2,1,-5,4]},{nums:[-5,-2,-8]},{nums:[]}],
union_find:[{n:5,operations:[['union',0,1],['union',1,2],['connected',0,2],['connected',0,4]]}],
lcs:[{a:'abcde',b:'ace'},{a:'abc',b:'abc'},{a:'abc',b:'def'}],
topological_sort:[{n:4,edges:[[0,1],[0,2],[1,3],[2,3]]},{n:3,edges:[[0,1],[1,2],[2,0]]}],
coin_change:[{coins:[1,2,5],amount:11},{coins:[2],amount:3},{coins:[1],amount:0}],
lis:[{nums:[10,9,2,5,3,7,101,18]},{nums:[0,1,0,3,2,3]},{nums:[]}],
sliding_window_max:[{nums:[1,3,-1,-3,5,3,6,7],k:3},{nums:[4,2,12,3],k:1}],
kmp:[{text:'ababcabcabababd',pattern:'ababd'},{text:'aaaaa',pattern:'aa'},{text:'abc',pattern:'z'}],
matrix_multiply:[{A:[[1,2],[3,4]],B:[[5,6],[7,8]]},{A:[[2,0,1]],B:[[1],[2],[3]]}],
interval_scheduling:[{intervals:[[1,3],[2,4],[3,5],[6,7]]},{intervals:[]}],
connected_components:[{n:5,edges:[[0,1],[1,2],[3,4]]},{n:4,edges:[]}],
edit_distance:[{a:'kitten',b:'sitting'},{a:'',b:'abc'},{a:'abc',b:'abc'}]
};
export function suite(id){const base=cases[id];if(!base)throw new Error('No test suite');const out=base.map((input,i)=>({input,public:i<2,expected:reference(id,input)}));for(let i=0;i<10;i++){const input=base[i%base.length];out.push({input:structuredClone(input),public:false,expected:reference(id,input)});}return out;}
export function matches(id,d,a,e){
 if(id==='two_sum')return Array.isArray(a)&&((e.length===0&&a.length===0)||(a.length===2&&a.every(x=>Number.isInteger(x)&&x>=0&&x<d.nums.length)&&a[0]!==a[1]&&d.nums[a[0]]+d.nums[a[1]]===d.target));
 if(id==='attention')return Array.isArray(a)&&a.length===e.length&&a.every((r,i)=>Array.isArray(r)&&r.length===e[i].length&&r.every((x,j)=>typeof x==='number'&&Number.isFinite(x)&&Math.abs(x-e[i][j])<=1e-5+Math.abs(e[i][j])*1e-5));
 return eq(a,e);
}
