export function emptyState(){return {progress:{},drafts:{},research:[],papers:[],weeks:[],attempts:[],mentors:[],projects:[]};}
const maps=['progress','drafts'],lists=['research','papers','weeks','attempts','mentors','projects'];
export function normalize(x){const out=emptyState();if(!x||typeof x!=='object'||Array.isArray(x))return out;for(const k of maps)if(x[k]&&typeof x[k]==='object'&&!Array.isArray(x[k]))out[k]=Object.fromEntries(Object.entries(x[k]).filter(([key])=>!['__proto__','constructor','prototype'].includes(key)));for(const k of lists)if(Array.isArray(x[k]))out[k]=x[k].filter(v=>v&&typeof v==='object').slice(0,2000);return out;}
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function merge3(base,local,remote){
 const conflicts=[];
 function merge(b,l,r,path){
  if(same(l,b))return structuredClone(r);if(same(r,b)||same(l,r))return structuredClone(l);
  if([b,l,r].every(x=>x&&typeof x==='object'&&!Array.isArray(x))){const out={};for(const key of new Set([...Object.keys(b),...Object.keys(l),...Object.keys(r)])){if(['__proto__','constructor','prototype'].includes(key))continue;const v=merge(b[key],l[key],r[key],path+'.'+key);if(v!==undefined)out[key]=v;}return out;}
  if([b,l,r].every(Array.isArray)&&[...b,...l,...r].every(x=>x&&typeof x.id==='string')){const toMap=a=>Object.fromEntries(a.map(x=>[x.id,x]));return Object.values(merge(toMap(b),toMap(l),toMap(r),path));}
  conflicts.push(path);return structuredClone(l);
 }
 return {value:merge(base,local,remote,'workspace'),conflicts};
}
