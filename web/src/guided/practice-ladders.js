export const PRACTICE_LADDERS={
u3:{title:'图搜索：从图表示到可验证的最短路',intro:'先保证状态和边的语义，再逐步优化数据结构；不要一开始就把 BFS、Dijkstra 与 A* 写进同一个函数。',steps:[
{title:'第 1 步｜建立图表示',objective:'将边列表转换为邻接表，明确有向/无向、节点编号范围与重复边策略。',input:{n:4,edges:[[0,1],[0,2],[1,3]]},expected:[[1,2],[0,3],[0],[1]],method:'无向图每条边写入两个端点；构建后逐个检查邻居集合。',tasks:[]},
{title:'第 2 步｜BFS：层次与访问状态',objective:'使用队列维护待扩展节点；节点在入队时标记 visited，避免同一节点重复入队。',input:{n:4,edges:[[0,1],[0,2],[1,3]],start:0},expected:[0,1,2,3],method:'用队列头指针避免反复 pop(0)。记录 parent 和 distance，可同时恢复路径与最少边数。',tasks:['bfs']},
{title:'第 3 步｜Dijkstra：先写 O(V²) 基线',objective:'维护 tentative distance。每轮选择未确定节点中距离最小者，再对出边做 relaxation。正确性依赖所有边权非负。',input:{n:4,edges:[[0,1,1],[0,2,4],[1,2,1],[2,3,1]],source:0},expected:[0,1,2,3],method:'候选值 alt=d[u]+w(u,v)，仅当 alt<d[v] 时更新。不可达节点输出 null。',tasks:['dijkstra']},
{title:'第 4 步｜堆优化与陈旧条目',objective:'将选最小 tentative distance 从线性扫描改为最小堆。允许重复入堆，弹出时若 key>dist[u] 就跳过。',input:{n:5,edges:[[0,1,10],[0,2,1],[2,1,1],[1,3,1],[2,4,8]],source:0},expected:[0,2,1,3,9],method:'邻接表加二叉堆的典型复杂度为 O((V+E)log V)。记录堆操作次数，不用单个小图的时间推断复杂度。',tasks:['dijkstra']},
{title:'第 5 步｜A*：启发函数与最优性边界',objective:'优先级 f(n)=g(n)+h(n)。先用 h=0 复现 Dijkstra，再使用可采纳且一致的启发函数；若允许不一致启发，需实现更优 g 触发 reopen。',input:{grid:[[0,0,0],[1,1,0],[0,0,0]],start:[0,0],goal:[2,2]},expected:4,method:'固定同一批地图，对比路径代价、扩展节点数、运行时间和失败率；加权启发式不能默认保留最优性保证。',tasks:['astar']}
]},
u16:{title:'梯度下降：从损失函数到数值验证',intro:'把一次更新拆成前向、损失、解析梯度、参数更新四个可观测量。先做单样本手算，再扩展 batch；每一步都用独立计算核对。',steps:[
{title:'第 1 步｜前向与损失',objective:'模型 y_hat=wx+b，单样本平方损失 L=0.5(y_hat-y)^2。先写出预测和损失，不调用优化器。',input:{x:2,y:4,w:0,b:0},expected:{y_hat:0,loss:8},method:'保留中间量，检查 residual=y_hat-y 的符号。',tasks:[]},
{title:'第 2 步｜链式法则求梯度',objective:'由 dL/dy_hat=y_hat-y、dy_hat/dw=x、dy_hat/db=1，得到 dL/dw=(y_hat-y)x、dL/db=y_hat-y。',input:{x:2,y:4,w:0,b:0},expected:{dw:-8,db:-4},method:'分别对 w、b 求导；不要把 loss 当 gradient。',tasks:['linear_regression_step']},
{title:'第 3 步｜执行一次更新',objective:'w_new=w-lr*dw，b_new=b-lr*db。注意学习率作用于梯度，不作用于预测值。',input:{x:2,y:4,w:0,b:0,lr:0.1},expected:{w:0.8,b:0.4},method:'更新后重新前向计算，确认损失从 8 降至 2.88。',tasks:['linear_regression_step']},
{title:'第 4 步｜有限差分梯度检查',objective:'用中心差分 [L(θ+ε)-L(θ-ε)]/(2ε) 近似导数，与解析梯度比较。改变 ε，观察截断误差和浮点误差的折中。',input:{x:2,y:4,w:0.3,b:-0.2,epsilon:0.0001},expected:'finite-difference gradient ≈ analytic gradient',method:'分别检查 dw、db；报告相对误差，不只看一次训练 loss 是否下降。',tasks:['linear_regression_step']},
{title:'第 5 步｜扩展到 batch 与正则项',objective:'明确 loss 使用 sum 还是 mean。加入 L2 正则时，说明是 λ/2||w||² 还是 λ||w||²，梯度系数随定义改变。',input:{batch:3,reduction:'mean',regularization:'lambda/2 * ||w||^2'},expected:'batch gradient equals mean of per-sample gradients plus lambda*w',method:'用小 batch 手算对拍；固定验证集和随机种子，再比较学习率与正则强度。',tasks:['linear_regression_step','binary_cross_entropy']}
]},
u32:{title:'相机几何：投影、反投影与误差传播',intro:'每一步都标明坐标系、单位和张量形状。投影和反投影应组成可测量的往返关系，而不只是各自输出一个看似合理的数组。',steps:[
{title:'第 1 步｜归一化相机坐标',objective:'由针孔模型 x=X/Z、y=Y/Z，将三维点转到归一化像平面。先检查 Z>0。',input:{point:[2,1,4]},expected:[0.5,0.25],method:'Z 是相机坐标系深度；不能把世界坐标 Z 直接代入。',tasks:[]},
{title:'第 2 步｜应用内参投影',objective:'u=fx*X/Z+cx，v=fy*Y/Z+cy。区分焦距像素单位与物理焦距。',input:{point:[2,1,4],fx:100,fy:100,cx:50,cy:40},expected:[100,65],method:'用主光轴点、深度翻倍点和负深度点验证符号与尺度。',tasks:['project_point']},
{title:'第 3 步｜已知深度反投影',objective:'X=(u-cx)Z/fx，Y=(v-cy)Z/fy。反投影需要深度，单独的像素坐标不能唯一恢复三维点。',input:{pixel:[100,65],depth:4,fx:100,fy:100,cx:50,cy:40},expected:[2,1,4],method:'把同一组内参与深度传入，做 project→unproject 往返误差检查。',tasks:['unproject_point']},
{title:'第 4 步｜从深度图生成点云',objective:'逐像素读取深度，应用反投影；过滤无效深度并保持像素索引顺序。',input:{depth:[[1,2],[0,1]],fx:1,fy:1,cx:0,cy:0},expected:[[0,0,1],[2,0,2],[1,1,1]],method:'明确深度单位、无效值约定和相机坐标系方向。',tasks:['depth_to_pointcloud']},
{title:'第 5 步｜误差传播',objective:'Z=fb/d 对视差 d 的导数为 -fb/d²。相同像素级视差误差在远距离会引起更大的深度误差。',input:{f:100,baseline:0.2,disparity:5,deltaDisparity:0.5},expected:'Z=4m; first-order |delta Z|≈0.4m',method:'改变距离和视差噪声，画深度误差曲线；区分标定误差与匹配误差。',tasks:['stereo_depth']}
]},
u39:{title:'点云几何：邻域、采样与距离度量',intro:'把点云当作无序点集。每次操作都检查点顺序、重复点、密度变化和坐标尺度，不用单一可视化代替几何指标。',steps:[
{title:'第 1 步｜质心与平移性质',objective:'质心 μ=(1/N)Σp_i。所有点平移 t 后，质心也应平移 t；点顺序不应影响结果。',input:{points:[[0,0,0],[2,0,0],[0,2,0]]},expected:[0.6666666667,0.6666666667,0],method:'增加随机置换和整体平移测试。',tasks:['point_centroid']},
{title:'第 2 步｜KNN 邻域',objective:'按平方欧氏距离排序，返回最近 k 个点的索引；同距离时用原始索引稳定打破平局。',input:{points:[[0,0,0],[1,0,0],[-1,0,0],[3,0,0]],query:[0,0,0],k:2},expected:[0,1],method:'先检查距离数组，再检查排序索引；注意平方距离不改变近邻次序。',tasks:['knn_points']},
{title:'第 3 步｜体素量化与局部质心',objective:'体素索引 v=floor(p/s)。负坐标必须使用 floor 而非向零截断。',input:{points:[[-0.1,0,0],[0.1,0,0],[1.1,0,0]],voxel_size:1},expected:[[-0.1,0,0],[0.1,0,0],[1.1,0,0]],method:'比较不同 voxel_size；输出顺序按体素坐标固定，质心保留原坐标。',tasks:['voxel_downsample']},
{title:'第 4 步｜Farthest Point Sampling',objective:'每轮选择到已选集合最小距离最大的点，近似最大化采样覆盖半径。',input:{points:[[0,0,0],[1,0,0],[3,0,0],[6,0,0]],k:2,start:0},expected:[0,3],method:'维护每个点到已选集合的最小平方距离，避免每轮重算全部两两距离。',tasks:['fps']},
{title:'第 5 步｜密度与度量边界',objective:'Chamfer distance 对两个方向的最近邻距离取平均；密度不一致时，点多的一侧对求和版本贡献更大。',input:{source:[[0,0,0]],target:[[0,0,0],[1,0,0]]},expected:'symmetric Chamfer depends on the chosen reduction convention',method:'写清 mean/sum、单向/双向、平方/非平方约定，再对密度变化做消融。',tasks:['chamfer_distance']}
]}
};
