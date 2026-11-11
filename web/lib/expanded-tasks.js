import {randomInt} from 'node:crypto';

export const EXPANDED_IDS=[
'softmax','linear_regression_step','binary_cross_entropy','confusion_matrix','batch_norm_inference','conv2d_valid','kmeans_assign',
'iou_xyxy','nms','project_point','unproject_point','homography_apply','stereo_depth','chamfer_distance','voxel_downsample','fps','knn_points','rigid_transform','plane_residual','point_centroid','transform_points','bbox3d_iou','depth_to_pointcloud',
'tokenize_greedy','rotary_pair','kv_cache_bytes','contrastive_loss',
'quaternion_rotate','occupancy_grid_index','ekf_scalar_update','path_length',
'recall_at_k','average_precision','paired_mean_difference'
];
const ri=(a,b)=>randomInt(a,b+1);
const round=x=>Math.round(x*1e9)/1e9;
const dist2=(a,b)=>a.reduce((s,x,i)=>s+(x-b[i])**2,0);
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export function referenceAdvanced(id,d){
 switch(id){
 case 'softmax':{const m=Math.max(...d.logits),e=d.logits.map(x=>Math.exp(x-m)),s=e.reduce((a,b)=>a+b,0);return e.map(x=>x/s);}
 case 'linear_regression_step':{const err=d.w*d.x+d.b-d.y,loss=.5*err*err;return [d.w-d.lr*err*d.x,d.b-d.lr*err,loss];}
 case 'binary_cross_entropy':{const e=1e-12;return d.y.reduce((s,y,i)=>s-(y*Math.log(clamp(d.p[i],e,1-e))+(1-y)*Math.log(1-clamp(d.p[i],e,1-e))),0)/d.y.length;}
 case 'confusion_matrix':{const ix=new Map(d.labels.map((x,i)=>[x,i])),m=d.labels.map(()=>d.labels.map(()=>0));for(let i=0;i<d.y_true.length;i++)m[ix.get(d.y_true[i])][ix.get(d.y_pred[i])]++;return m;}
 case 'batch_norm_inference':return d.x.map(row=>row.map((x,j)=>d.gamma[j]*(x-d.mean[j])/Math.sqrt(d.var[j]+d.eps)+d.beta[j]));
 case 'conv2d_valid':{const h=d.image.length,w=d.image[0].length,kh=d.kernel.length,kw=d.kernel[0].length,s=d.stride||1,out=[];for(let i=0;i+kh<=h;i+=s){const row=[];for(let j=0;j+kw<=w;j+=s){let v=0;for(let a=0;a<kh;a++)for(let b=0;b<kw;b++)v+=d.image[i+a][j+b]*d.kernel[a][b];row.push(v);}out.push(row);}return out;}
 case 'kmeans_assign':{const assignments=d.points.map(p=>{let bi=0,bd=Infinity;for(let i=0;i<d.centers.length;i++){const v=dist2(p,d.centers[i]);if(v<bd){bd=v;bi=i;}}return bi;}),inertia=d.points.reduce((s,p,i)=>s+dist2(p,d.centers[assignments[i]]),0);return {assignments,inertia};}
 case 'iou_xyxy':{const [ax,ay,bx,by]=d.a,[cx,cy,dx,dy]=d.b;const iw=Math.max(0,Math.min(bx,dx)-Math.max(ax,cx)),ih=Math.max(0,Math.min(by,dy)-Math.max(ay,cy)),inter=iw*ih,aa=Math.max(0,bx-ax)*Math.max(0,by-ay),bb=Math.max(0,dx-cx)*Math.max(0,dy-cy),u=aa+bb-inter;return u?inter/u:0;}
 case 'nms':{const order=d.boxes.map((_,i)=>i).sort((i,j)=>d.scores[j]-d.scores[i]||i-j),keep=[];while(order.length){const i=order.shift();keep.push(i);for(let j=order.length-1;j>=0;j--)if(referenceAdvanced('iou_xyxy',{a:d.boxes[i],b:d.boxes[order[j]]})>d.threshold)order.splice(j,1);}return keep;}
 case 'project_point':{const [X,Y,Z]=d.point;if(Z<=0)return null;return [d.fx*X/Z+d.cx,d.fy*Y/Z+d.cy];}
 case 'unproject_point':{const [u,v]=d.pixel;if(d.depth<=0)return null;return [(u-d.cx)*d.depth/d.fx,(v-d.cy)*d.depth/d.fy,d.depth];}
 case 'homography_apply':{const [x,y]=d.point,H=d.H,z=H[2][0]*x+H[2][1]*y+H[2][2];if(Math.abs(z)<1e-12)return null;return [(H[0][0]*x+H[0][1]*y+H[0][2])/z,(H[1][0]*x+H[1][1]*y+H[1][2])/z];}
 case 'stereo_depth':return d.disparity>0?d.f*d.baseline/d.disparity:null;
 case 'chamfer_distance':{if(!d.a.length||!d.b.length)return null;const nearest=(p,set)=>Math.min(...set.map(q=>dist2(p,q)));return (d.a.reduce((s,p)=>s+nearest(p,d.b),0)/d.a.length+d.b.reduce((s,p)=>s+nearest(p,d.a),0)/d.b.length)/2;}
 case 'voxel_downsample':{const vox=new Map();for(const p of d.points){const k=p.map(x=>Math.floor(x/d.voxel_size)).join(',');if(!vox.has(k))vox.set(k,{sum:p.map(()=>0),n:0,key:p.map(x=>Math.floor(x/d.voxel_size))});const v=vox.get(k);p.forEach((x,i)=>v.sum[i]+=x);v.n++;}return [...vox.values()].sort((a,b)=>{for(let i=0;i<a.key.length;i++)if(a.key[i]!==b.key[i])return a.key[i]-b.key[i];return 0;}).map(v=>v.sum.map(x=>x/v.n));}
 case 'fps':{const n=d.points.length,k=d.k;if(!n||k<=0)return[];const out=[],mins=Array(n).fill(Infinity);let cur=clamp(d.start||0,0,n-1);for(let t=0;t<Math.min(k,n);t++){out.push(cur);for(let i=0;i<n;i++)mins[i]=Math.min(mins[i],dist2(d.points[i],d.points[cur]));let best=-1,bd=-1;for(let i=0;i<n;i++)if(!out.includes(i)&&(mins[i]>bd)){bd=mins[i];best=i;}if(best<0)break;cur=best;}return out;}
 case 'knn_points':return d.points.map((p,i)=>({i,dist:dist2(p,d.query)})).sort((a,b)=>a.dist-b.dist||a.i-b.i).slice(0,d.k).map(x=>x.i);
 case 'rigid_transform':return d.points.map(p=>d.R.map((row,i)=>row.reduce((s,x,j)=>s+x*p[j],0)+d.t[i]));
 case 'plane_residual':{const [a,b,c,e]=d.plane,n=Math.hypot(a,b,c);if(!n)return null;return d.points.map(p=>Math.abs(a*p[0]+b*p[1]+c*p[2]+e)/n);}
 case 'point_centroid':return d.points.length?[0,1,2].map(j=>d.points.reduce((s,p)=>s+p[j],0)/d.points.length):null;
 case 'transform_points':return d.points.map(p=>{const x=[...p,1],v=d.T.map(r=>r.reduce((s,a,j)=>s+a*x[j],0));return v[3]===0?null:v.slice(0,3).map(z=>z/v[3]);});
 case 'bbox3d_iou':{const a=d.a,b=d.b,lo=[0,1,2].map(i=>Math.max(a[i],b[i])),hi=[0,1,2].map(i=>Math.min(a[i+3],b[i+3])),inter=hi.reduce((s,x,i)=>s*Math.max(0,x-lo[i]),1),vol=x=>[0,1,2].reduce((s,i)=>s*Math.max(0,x[i+3]-x[i]),1),u=vol(a)+vol(b)-inter;return u?inter/u:0;}
 case 'depth_to_pointcloud':{const out=[];for(let v=0;v<d.depth.length;v++)for(let u=0;u<d.depth[v].length;u++){const z=d.depth[v][u];if(z>0)out.push([(u-d.cx)*z/d.fx,(v-d.cy)*z/d.fy,z]);}return out;}
 case 'tokenize_greedy':{const out=[];let i=0;while(i<d.text.length){let best=-1,token='';for(let j=0;j<d.vocab.length;j++){const t=d.vocab[j];if(t.length>token.length&&d.text.startsWith(t,i)){best=j;token=t;}}if(best<0){out.push(-1);i+=String.fromCodePoint(d.text.codePointAt(i)).length;}else{out.push(best);i+=token.length;}}return out;}
 case 'rotary_pair':return [d.x*Math.cos(d.angle)-d.y*Math.sin(d.angle),d.x*Math.sin(d.angle)+d.y*Math.cos(d.angle)];
 case 'kv_cache_bytes':return 2*d.layers*d.batch*d.tokens*d.kv_heads*d.head_dim*d.bytes_per_value;
 case 'contrastive_loss':{const m=Math.max(...d.logits),lse=m+Math.log(d.logits.reduce((s,x)=>s+Math.exp(x-m),0));return lse-d.logits[d.positive_index];}
 case 'quaternion_rotate':{let [x,y,z,w]=d.q,n=Math.hypot(x,y,z,w);if(!n)return null;x/=n;y/=n;z/=n;w/=n;const [vx,vy,vz]=d.v,tx=2*(y*vz-z*vy),ty=2*(z*vx-x*vz),tz=2*(x*vy-y*vx);return [vx+w*tx+(y*tz-z*ty),vy+w*ty+(z*tx-x*tz),vz+w*tz+(x*ty-y*tx)];}
 case 'occupancy_grid_index':{const col=Math.floor((d.x-d.origin[0])/d.resolution),row=Math.floor((d.y-d.origin[1])/d.resolution);return row>=0&&row<d.height&&col>=0&&col<d.width?[row,col]:null;}
 case 'ekf_scalar_update':{const gain=d.variance/(d.variance+d.R),mean=d.mean+gain*(d.z-d.mean),variance=(1-gain)*d.variance;return {mean,variance,gain};}
 case 'path_length':return d.points.slice(1).reduce((s,p,i)=>s+Math.sqrt(dist2(p,d.points[i])),0);
 case 'recall_at_k':{const rel=new Set(d.relevant),hit=d.ranked.slice(0,d.k).filter(x=>rel.has(x)).length;return rel.size?hit/rel.size:0;}
 case 'average_precision':{const rel=new Set(d.relevant);if(!rel.size)return 0;let hit=0,sum=0;d.ranked.forEach((x,i)=>{if(rel.has(x)){hit++;sum+=hit/(i+1);}});return sum/rel.size;}
 case 'paired_mean_difference':if(d.baseline.length!==d.method.length||!d.baseline.length)return null;return d.method.reduce((s,x,i)=>s+x-d.baseline[i],0)/d.method.length;
 default:throw new Error('Unknown expanded task '+id);
 }
}
const baseCases={
 softmax:[{logits:[1,2,3]},{logits:[1000,1001,1002]},{logits:[0]}],
 linear_regression_step:[{x:2,y:4,w:0,b:0,lr:.1},{x:1,y:1,w:1,b:0,lr:.01}],
 binary_cross_entropy:[{y:[1,0],p:[.9,.1]},{y:[1,1,0],p:[.5,.5,.5]}],
 confusion_matrix:[{y_true:[0,1,1,0],y_pred:[0,1,0,0],labels:[0,1]},{y_true:['cat','dog','cat'],y_pred:['dog','dog','cat'],labels:['cat','dog']}],
 batch_norm_inference:[{x:[[1,2],[3,4]],gamma:[1,2],beta:[0,1],mean:[2,3],var:[1,4],eps:1e-5}],
 conv2d_valid:[{image:[[1,2,3],[4,5,6],[7,8,9]],kernel:[[1,0],[0,-1]],stride:1}],
 kmeans_assign:[{points:[[0,0],[1,1],[9,9]],centers:[[0,0],[10,10]]}],
 iou_xyxy:[{a:[0,0,2,2],b:[1,0,3,2]},{a:[0,0,1,1],b:[2,2,3,3]}],
 nms:[{boxes:[[0,0,2,2],[.2,.2,2.2,2.2],[4,4,5,5]],scores:[.9,.8,.7],threshold:.5}],
 project_point:[{point:[2,1,4],fx:100,fy:100,cx:50,cy:40}],
 unproject_point:[{pixel:[100,65],depth:4,fx:100,fy:100,cx:50,cy:40}],
 homography_apply:[{H:[[2,0,1],[0,2,3],[0,0,1]],point:[2,4]}],
 stereo_depth:[{f:100,baseline:.2,disparity:5},{f:200,baseline:.1,disparity:0}],
 chamfer_distance:[{a:[[0,0,0],[1,0,0]],b:[[0,0,0],[2,0,0]]}],
 voxel_downsample:[{points:[[.1,.1,0],[.2,.2,0],[1.1,0,0]],voxel_size:1}],
 fps:[{points:[[0,0],[1,0],[2,0],[3,0]],k:3,start:0}],
 knn_points:[{points:[[0,0],[1,0],[-1,0],[4,0]],query:[0,0],k:2}],
 rigid_transform:[{points:[[1,0,0],[0,1,0]],R:[[0,-1,0],[1,0,0],[0,0,1]],t:[1,2,0]}],
 plane_residual:[{points:[[0,0,1],[1,1,2],[0,0,0]],plane:[0,0,1,-1]}],
 point_centroid:[{points:[[0,0,0],[2,2,2]]}],
 transform_points:[{points:[[1,2,3]],T:[[1,0,0,1],[0,1,0,2],[0,0,1,3],[0,0,0,1]]}],
 bbox3d_iou:[{a:[0,0,0,2,2,2],b:[1,1,1,3,3,3]}],
 depth_to_pointcloud:[{depth:[[1,2],[0,1]],fx:1,fy:1,cx:0,cy:0}],
 tokenize_greedy:[{text:'ababx',vocab:['a','ab','b','x']},{text:'hello',vocab:['he','hell','o']}],
 rotary_pair:[{x:1,y:0,angle:Math.PI/2}],
 kv_cache_bytes:[{layers:1,batch:1,tokens:10,kv_heads:2,head_dim:4,bytes_per_value:2}],
 contrastive_loss:[{logits:[0,0],positive_index:0}],
 quaternion_rotate:[{q:[0,0,Math.SQRT1_2,Math.SQRT1_2],v:[1,0,0]}],
 occupancy_grid_index:[{x:1.2,y:2.4,resolution:1,origin:[0,0],width:4,height:4},{x:-.1,y:0,resolution:1,origin:[0,0],width:4,height:4}],
 ekf_scalar_update:[{mean:0,variance:4,z:2,R:1}],
 path_length:[{points:[[0,0,0],[3,0,0],[3,4,0]]}],
 recall_at_k:[{ranked:['a','b','c'],relevant:['a','c'],k:2}],
 average_precision:[{ranked:['a','x','c'],relevant:['a','c']}],
 paired_mean_difference:[{baseline:[1,0,1,0],method:[1,1,0,1]}]
};
export function randomInputAdvanced(id){
 const vec=(n,lo=-3,hi=3)=>Array.from({length:n},()=>ri(lo,hi));
 const pts=(n,dim=3)=>Array.from({length:n},()=>vec(dim));
 switch(id){
 case 'softmax':return {logits:vec(ri(1,8),-20,20)};
 case 'linear_regression_step':return {x:ri(-5,5),y:ri(-5,5),w:ri(-3,3),b:ri(-3,3),lr:.01};
 case 'binary_cross_entropy':{const n=ri(1,8),y=Array.from({length:n},()=>ri(0,1)),p=Array.from({length:n},()=>ri(1,99)/100);return {y,p};}
 case 'confusion_matrix':{const n=ri(1,15),labels=[0,1,2],y_true=Array.from({length:n},()=>ri(0,2)),y_pred=Array.from({length:n},()=>ri(0,2));return {y_true,y_pred,labels};}
 case 'batch_norm_inference':{const c=ri(1,4),n=ri(1,5);return {x:Array.from({length:n},()=>vec(c)),gamma:vec(c),beta:vec(c),mean:vec(c),var:vec(c,0,4).map(x=>Math.abs(x)),eps:1e-5};}
 case 'conv2d_valid':{const h=ri(3,6),w=ri(3,6),kh=ri(1,Math.min(3,h)),kw=ri(1,Math.min(3,w));return {image:Array.from({length:h},()=>vec(w)),kernel:Array.from({length:kh},()=>vec(kw)),stride:ri(1,2)};}
 case 'kmeans_assign':{const n=ri(2,10),k=ri(1,Math.min(4,n));return {points:pts(n,2),centers:pts(k,2)};}
 case 'iou_xyxy':{const a=vec(4).map((x,i)=>x+(i>=2?4:0)),b=vec(4).map((x,i)=>x+(i>=2?4:0));return {a,b};}
 case 'nms':{const n=ri(1,12),boxes=Array.from({length:n},()=>{const x=ri(0,8),y=ri(0,8),w=ri(1,4),h=ri(1,4);return [x,y,x+w,y+h];});return {boxes,scores:vec(n,0,10),threshold:.5};}
 case 'project_point':return {point:[ri(-3,3),ri(-3,3),ri(1,8)],fx:100,fy:120,cx:50,cy:40};
 case 'unproject_point':return {pixel:[ri(0,100),ri(0,80)],depth:ri(1,10),fx:100,fy:120,cx:50,cy:40};
 case 'homography_apply':return {H:[[1.2,.1,2],[-.1,.9,1],[.001,.002,1]],point:vec(2,0,10)};
 case 'stereo_depth':return {f:ri(50,300),baseline:ri(5,30)/100,disparity:ri(1,30)};
 case 'chamfer_distance':return {a:pts(ri(1,8)),b:pts(ri(1,8))};
 case 'voxel_downsample':return {points:pts(ri(1,15)),voxel_size:ri(1,4)};
 case 'fps':{const n=ri(1,12);return {points:pts(n,2),k:ri(1,n),start:ri(0,n-1)};}
 case 'knn_points':{const n=ri(1,12);return {points:pts(n,2),query:vec(2),k:ri(1,n)};}
 case 'rigid_transform':return {points:pts(ri(1,8)),R:[[0,-1,0],[1,0,0],[0,0,1]],t:vec(3)};
 case 'plane_residual':return {points:pts(ri(1,8)),plane:[0,0,1,-ri(-3,3)]};
 case 'point_centroid':return {points:pts(ri(1,10))};
 case 'transform_points':return {points:pts(ri(1,8)),T:[[1,0,0,1],[0,1,0,2],[0,0,1,-1],[0,0,0,1]]};
 case 'bbox3d_iou':{const a=[0,0,0,ri(1,4),ri(1,4),ri(1,4)],b=[ri(0,3),ri(0,3),ri(0,3),0,0,0];b[3]=b[0]+ri(1,4);b[4]=b[1]+ri(1,4);b[5]=b[2]+ri(1,4);return {a,b};}
 case 'depth_to_pointcloud':{const h=ri(1,4),w=ri(1,4);return {depth:Array.from({length:h},()=>Array.from({length:w},()=>ri(0,5))),fx:100,fy:100,cx:0,cy:0};}
 case 'tokenize_greedy':{const vocab=['a','b','c','ab','bc','abc'],text=Array.from({length:ri(1,15)},()=> 'abcx'[ri(0,3)]).join('');return {text,vocab};}
 case 'rotary_pair':return {x:ri(-5,5),y:ri(-5,5),angle:ri(-6,6)/3};
 case 'kv_cache_bytes':return {layers:ri(1,32),batch:ri(1,4),tokens:ri(1,2048),kv_heads:ri(1,16),head_dim:ri(8,128),bytes_per_value:2};
 case 'contrastive_loss':{const n=ri(2,8);return {logits:vec(n,-10,10),positive_index:ri(0,n-1)};}
 case 'quaternion_rotate':return {q:vec(4),v:vec(3)};
 case 'occupancy_grid_index':return {x:ri(-10,20)/2,y:ri(-10,20)/2,resolution:.5,origin:[0,0],width:20,height:20};
 case 'ekf_scalar_update':return {mean:ri(-5,5),variance:ri(1,10),z:ri(-5,5),R:ri(1,10)};
 case 'path_length':return {points:pts(ri(1,10))};
 case 'recall_at_k':{const n=ri(1,12),ranked=Array.from({length:n},(_,i)=>i),relevant=ranked.filter(()=>ri(0,1));return {ranked,relevant,k:ri(1,n)};}
 case 'average_precision':{const n=ri(1,12),ranked=Array.from({length:n},(_,i)=>i),relevant=ranked.filter(()=>ri(0,1));return {ranked,relevant};}
 case 'paired_mean_difference':{const n=ri(1,12),baseline=vec(n),method=vec(n);return {baseline,method};}
 default:throw new Error('No random generator for '+id);
 }
}
export function expandedSuite(id){
 const base=baseCases[id];if(!base)throw new Error('No expanded test suite '+id);
 return [...base.map((input,i)=>({input,public:i<2,expected:referenceAdvanced(id,input)})),
 ...Array.from({length:16},()=>{const input=randomInputAdvanced(id);return {input,public:false,expected:referenceAdvanced(id,input)};})];
}
export function matchesAdvanced(id,d,a,e){
 const equal=(x,y)=>{if(typeof x==='number'&&typeof y==='number')return Number.isFinite(x)&&Number.isFinite(y)&&Math.abs(x-y)<=1e-6+1e-6*Math.abs(y);if(Array.isArray(x)||Array.isArray(y))return Array.isArray(x)&&Array.isArray(y)&&x.length===y.length&&x.every((v,i)=>equal(v,y[i]));if(x&&y&&typeof x==='object'&&typeof y==='object')return Object.keys(x).length===Object.keys(y).length&&Object.keys(x).every(k=>k in y&&equal(x[k],y[k]));return x===y;};return equal(a,e);
}
