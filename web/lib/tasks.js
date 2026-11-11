import {randomInt} from 'node:crypto';
export const ALGORITHMS=['two_sum','parentheses','bfs','attention','astar'];
export const ROS=['ros_topic','ros_service','ros_tf','ros_action'];
const integer=(a,b)=>randomInt(a,b+1);
export function reference(id,d){
 if(id==='two_sum'){const seen=new Map();for(let i=0;i<d.nums.length;i++){if(seen.has(d.target-d.nums[i]))return[seen.get(d.target-d.nums[i]),i];seen.set(d.nums[i],i);}return[];}
 if(id==='parentheses'){const st=[],m={')':'(',']':'[','}':'{'};for(const c of d.text){if('([{'.includes(c))st.push(c);else if(st.pop()!==m[c])return false;}return st.length===0;}
 if(id==='bfs'){if(!d.n)return[];const g=Array.from({length:d.n},()=>new Set());for(const [a,b]of d.edges){g[a].add(b);g[b].add(a);}const q=[d.start],v=new Set(q);for(let i=0;i<q.length;i++)for(const x of [...g[q[i]]].sort((a,b)=>a-b))if(!v.has(x)){v.add(x);q.push(x);}return q;}
 if(id==='astar'){const g=d.grid,[sr,sc]=d.start,[er,ec]=d.goal;if(g[sr][sc]||g[er][ec])return-1;const q=[[sr,sc,0]],v=new Set([sr+','+sc]);for(let i=0;i<q.length;i++){const[r,c,n]=q[i];if(r===er&&c===ec)return n;for(const[a,b]of[[r+1,c],[r-1,c],[r,c+1],[r,c-1]]){const k=a+','+b;if(a>=0&&a<g.length&&b>=0&&b<g[0].length&&!g[a][b]&&!v.has(k)){v.add(k);q.push([a,b,n+1]);}}}return-1;}
 if(id==='attention')return d.q.map((q,i)=>{const z=d.k.map((k,j)=>d.mask&&!d.mask[i][j]?-Infinity:q.reduce((s,x,a)=>s+x*k[a],0)/Math.sqrt(q.length));const max=Math.max(...z);if(max===-Infinity)return Array(d.v[0].length).fill(0);const ex=z.map(x=>Math.exp(x-max)),sum=ex.reduce((a,b)=>a+b,0);return d.v[0].map((_,c)=>ex.reduce((s,x,j)=>s+x/sum*d.v[j][c],0));});
 throw new Error('Unknown task');
}
export function suite(id){
 const data=[];const add=(x,publicCase=false)=>data.push({input:x,public:publicCase,expected:reference(id,x)});
 if(id==='two_sum'){
  add({nums:[2,7,11,15],target:9},true);add({nums:[3,3],target:6},true);for(const x of [{nums:[],target:0},{nums:[3],target:6},{nums:[-5,0,8,5],target:0},{nums:[1,2,3],target:99}])add(x);
  for(let j=0;j<15;j++){const nums=Array.from({length:integer(8,80)},()=>integer(-1000,1000));add({nums,target:nums[0]+nums.at(-1)});}
 }
 if(id==='parentheses'){for(const [i,text] of ['()[]{}','([)]','','((()))','{[()]}','(','}',')(','[[]][]','(([]){})'].entries())add({text},i<2);for(let j=0;j<15;j++){const n=integer(4,70);add({text:'('.repeat(n)+')'.repeat(n)+(j%2?'[':'')});}}
 if(id==='bfs'){
  add({n:5,edges:[[0,1],[0,2],[1,3],[2,4]],start:0},true);add({n:4,edges:[[0,1],[2,3]],start:0},true);add({n:0,edges:[],start:0});
  for(let j=0;j<15;j++){const n=integer(5,40),edges=Array.from({length:integer(0,n*3)},()=>[integer(0,n-1),integer(0,n-1)]);add({n,edges,start:integer(0,n-1)});}
 }
 if(id==='astar'){
  add({grid:[[0,0,0],[1,1,0],[0,0,0]],start:[0,0],goal:[2,2]},true);add({grid:[[0]],start:[0,0],goal:[0,0]},true);add({grid:[[1]],start:[0,0],goal:[0,0]});
  for(let j=0;j<15;j++){const n=integer(5,16);add({grid:Array.from({length:n},()=>Array.from({length:n},()=>integer(0,9)<3?1:0)),start:[0,0],goal:[n-1,n-1]});}
 }
 if(id==='attention'){
  add({q:[[1,0]],k:[[1,0],[0,1]],v:[[2],[4]]},true);add({q:[[1]],k:[[1000],[1001]],v:[[2],[4]],mask:[[false,false]]},true);
  for(let t=0;t<12;t++){const a=integer(1,7),b=integer(1,7),dim=integer(1,8),vd=integer(1,5),mat=(r,c)=>Array.from({length:r},()=>Array.from({length:c},()=>integer(-100,100)/10));add({q:mat(a,dim),k:mat(b,dim),v:mat(b,vd),...(t%2?{mask:Array.from({length:a},()=>Array.from({length:b},()=>integer(0,1)===1))}:{})});}
 }
 if(!data.length)throw new Error('No tests');return data;
}
export function matches(id,d,a,e){
 if(id==='two_sum')return Array.isArray(a)&&((e.length===0&&a.length===0)||(a.length===2&&a.every(x=>Number.isInteger(x)&&x>=0&&x<d.nums.length)&&a[0]!==a[1]&&d.nums[a[0]]+d.nums[a[1]]===d.target));
 if(id==='attention')return Array.isArray(a)&&a.length===e.length&&a.every((r,i)=>Array.isArray(r)&&r.length===e[i].length&&r.every((x,j)=>typeof x==='number'&&Number.isFinite(x)&&Math.abs(x-e[i][j])<=1e-5+Math.abs(e[i][j])*1e-5));
 return JSON.stringify(a)===JSON.stringify(e);
}
