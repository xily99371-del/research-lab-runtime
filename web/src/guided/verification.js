export const VERIFICATION={
u31:[
{label:'常量输入',purpose:'差分核在常量区域应为零，检查符号与边界处理。',code:'assert correlate_valid([3,3,3,3], [1,0,-1]) == [0,0]'},
{label:'线性斜坡',purpose:'斜坡响应应保持符号一致，核翻转后结果反号。',code:'assert correlate_valid([1,2,4], [1,0,-1]) == [-3]\nassert correlate_valid([1,2,4], [-1,0,1]) == [3]'}
],
u32:[
{label:'已知点投影',purpose:'单位外参下验证焦距、深度和主点的组合。',code:'import numpy as np\nK = np.array([[100.,0,50],[0,100,40],[0,0,1]])\nR = np.eye(3)\nt = np.zeros(3)\nassert np.allclose(project_point(K,R,t,[2,0,4]), [100,40])'},
{label:'深度缩放',purpose:'同一射线上的点深度翻倍时，归一化像素位置不变。',code:'p1 = project_point(K,R,t,[2,1,4])\np2 = project_point(K,R,t,[4,2,8])\nassert np.allclose(p1,p2)'},
{label:'无效深度',purpose:'相机后方或零深度点必须明确拒绝，不能输出看似正常的像素。',code:'import pytest\nwith pytest.raises(ValueError):\n    project_point(K,R,t,[1,0,0])'}
],
u33:[
{label:'双目深度基准',purpose:'核对 Z=fb/d 与单位换算。',code:'assert abs(triangulate_rectified(100,0.2,5)-4.0) < 1e-9'},
{label:'视差敏感性',purpose:'视差减半时深度应翻倍。',code:'z1 = triangulate_rectified(100,0.2,5)\nz2 = triangulate_rectified(100,0.2,2.5)\nassert abs(z2-2*z1) < 1e-9'},
{label:'退化输入',purpose:'零视差不能返回有限深度，约定为抛出 ValueError。',code:'import pytest\nwith pytest.raises(ValueError):\n    triangulate_rectified(100,0.2,0)'}
],
u38:[
{label:'成功概率反推',purpose:'检查向上取整与经典 RANSAC 迭代数。',code:'assert ransac_iterations(0.5,2,0.99) == 17'},
{label:'单样本与高内点率',purpose:'样本大小为 1 时，所需迭代数应小于样本大小为 2 的情况。',code:'assert ransac_iterations(0.8,1,0.99) < ransac_iterations(0.8,2,0.99)'},
{label:'非法概率',purpose:'内点率为零或成功概率不在 (0,1) 时必须拒绝。',code:'import pytest\nwith pytest.raises(ValueError):\n    ransac_iterations(0,2,0.99)'}
],
u39:[
{label:'通道最大池化',purpose:'确认沿点维度聚合，而不是沿特征维度聚合。',code:'import numpy as np\nfeatures = np.array([[1,4],[3,2],[2,5]])\nassert np.array_equal(symmetric_pool(features), [3,5])'},
{label:'置换不变性',purpose:'同一组点随机打乱顺序，输出必须一致。',code:'assert np.allclose(symmetric_pool(features), symmetric_pool(features[[2,0,1]]))'},
{label:'空点集',purpose:'空点集没有可定义的 max，应按契约抛出 ValueError。',code:'import pytest\nwith pytest.raises(ValueError):\n    symmetric_pool(np.empty((0,2)))'}
],
u40:[
{label:'加权融合',purpose:'验证加权平均和累计权重。',code:'value, weight = fuse_tsdf(0.2,1,-0.1,2)\nassert abs(value-0.0) < 1e-9 and weight == 3'},
{label:'零权观测',purpose:'无效观测不应改变旧值与累计权重。',code:'assert fuse_tsdf(0.25,4,-0.8,0) == (0.25,4)'},
{label:'交换观测顺序',purpose:'在同一融合规则下，两次观测的顺序不应改变加权结果。',code:'a = fuse_tsdf(*fuse_tsdf(0.2,1,-0.1,2),0.4,1)\nb = fuse_tsdf(*fuse_tsdf(0.4,1,0.2,1),-0.1,2)\nassert abs(a[0]-b[0]) < 1e-9 and a[1] == b[1]'}
],
u49:[
{label:'均匀权重',purpose:'Q、K 全零时，可见位置应均匀分配权重。',code:'import numpy as np\nq = np.zeros((1,2)); k = np.zeros((2,2)); v = np.array([[2.,4.],[6.,8.]])\nassert np.allclose(attention(q,k,v), [[4.,6.]])'},
{label:'非方阵形状',purpose:'query 长度与 key/value 长度不同也应正确计算。',code:'q = np.zeros((2,3)); k = np.zeros((4,3)); v = np.arange(20.).reshape(4,5)\nout = attention(q,k,v)\nassert out.shape == (2,5)'},
{label:'全遮挡行',purpose:'全遮挡行按课程契约返回零向量，不能产生 NaN。',code:'mask = np.zeros((1,2), dtype=bool)\nout = attention(np.zeros((1,2)),np.zeros((2,2)),np.ones((2,3)),mask)\nassert np.all(np.isfinite(out)) and np.allclose(out,0)'}
],
u52:[
{label:'基础缓存量',purpose:'同时计入 K 与 V 两份缓存。',code:'assert kv_bytes(1,1,10,2,4,2) == 320'},
{label:'上下文线性增长',purpose:'层数、batch、token 数或 KV head 数翻倍时，缓存量按比例变化。',code:'base = kv_bytes(1,1,10,2,4,2)\nassert kv_bytes(1,1,20,2,4,2) == 2*base\nassert kv_bytes(2,1,10,2,4,2) == 2*base'},
{label:'GQA 维度',purpose:'估算应使用 KV head 数，而不是 query head 数。',code:'assert kv_bytes(1,1,10,2,4,2) < kv_bytes(1,1,10,8,4,2)'}
],
u53:[
{label:'零初始化等价',purpose:'B 为零时，LoRA 分支不改变基座输出。',code:'import numpy as np\nW0=np.array([[1.,2.],[3.,4.]])\nA=np.ones((1,2)); B=np.zeros((2,1)); x=np.array([2.,1.])\nassert np.allclose(lora_forward(W0,A,B,x,alpha=2), W0@x)'},
{label:'合并等价',purpose:'分支计算与合并后的权重矩阵应在数值容差内一致。',code:'B=np.array([[0.5],[1.0]])\ny1=lora_forward(W0,A,B,x,alpha=2)\ny2=(W0+(2/A.shape[0])*(B@A))@x\nassert np.allclose(y1,y2)'},
{label:'缩放约定',purpose:'改变 alpha 应只改变低秩更新分支，不改变基座权重。',code:'y0=W0@x\ny_small=lora_forward(W0,A,B,x,alpha=1)\ny_large=lora_forward(W0,A,B,x,alpha=2)\nassert np.linalg.norm(y_large-y0) > np.linalg.norm(y_small-y0)'}
],
u71:[
{label:'Topic 端点核查',purpose:'先确认节点、话题、类型与 QoS，再检查实际消息。',language:'bash',code:'ros2 node list\nros2 topic list -t\nros2 topic info /training/input --verbose\nros2 topic echo /training/output'},
{label:'QoS 不兼容复现',purpose:'分别运行 RELIABLE 与 BEST_EFFORT 端点，观察匹配状态；话题可见不代表端点兼容。',language:'bash',code:'ros2 topic info /camera/image --verbose\nros2 doctor --report'},
{label:'独立观察者验收',purpose:'发布端和订阅端分开启动，验证真实输出、消息频率和超时。',language:'bash',code:'# Terminal A: run the course node\nros2 run <your_package> <your_node>\n# Terminal B: inspect its output\nros2 topic info /training/output --verbose\nros2 topic echo /training/output\nros2 topic hz /training/output'}
],
u72:[
{label:'变换与逆变换',purpose:'已知点经旋转和平移后，再做逆变换应恢复原点。',code:'import numpy as np\nR=np.array([[0.,-1,0],[1,0,0],[0,0,1]])\nt=np.array([1.,2.,0]); p=np.array([1.,0,0])\nq=transform_point(R,t,p)\nassert np.allclose(q,[1,3,0])\nassert np.allclose(inverse_transform(R,t,q),p)'},
{label:'单位旋转',purpose:'单位旋转和零平移不应改变点。',code:'assert np.allclose(transform_point(np.eye(3),np.zeros(3),[2,3,4]),[2,3,4])'},
{label:'正交性',purpose:'旋转矩阵应满足 RᵀR=I 且 det(R)=1。',code:'assert np.allclose(R.T@R,np.eye(3))\nassert abs(np.linalg.det(R)-1) < 1e-9'}
],
u74:[
{label:'标量 Kalman 更新',purpose:'核对增益、创新、更新均值和更新方差。',code:'mean,var = scalar_kf_update(0,4,2,1)\nassert abs(mean-1.6) < 1e-9\nassert abs(var-0.8) < 1e-9'},
{label:'高观测噪声',purpose:'观测噪声增大时，更新结果应更接近先验均值。',code:'m1,_=scalar_kf_update(0,4,2,1)\nm2,_=scalar_kf_update(0,4,2,100)\nassert abs(m2) < abs(m1)'},
{label:'零方差边界',purpose:'协方差必须非负；负方差输入应明确拒绝。',code:'import pytest\nwith pytest.raises(ValueError):\n    scalar_kf_update(0,-1,2,1)'}
],
u79:[
{label:'四邻域 Manhattan',purpose:'四邻域单位代价下，启发式应等于曼哈顿距离。',code:'assert heuristic((0,0),(3,4),\"four\") == 7'},
{label:'八邻域 Chebyshev',purpose:'对角代价为 1 时，启发式应采用 Chebyshev 距离。',code:'assert heuristic((0,0),(3,4),\"diagonal_unit\") == 4'},
{label:'启发式下界',purpose:'在小网格上用 Dijkstra 真值检查 h 不高估最短剩余代价。',code:'for start,goal in test_pairs:\n    assert heuristic(start,goal,motion_model) <= dijkstra_cost(start,goal)'}
],
u86:[
{label:'配对差值',purpose:'按同一查询对齐后计算 method−baseline 的平均提升。',code:'baseline=[1,0,1,0]; method=[1,1,0,1]\ngroups=[\"a\",\"a\",\"b\",\"b\"]\nassert abs(paired_gain(baseline,method,groups)-0.25) < 1e-9'},
{label:'交换顺序',purpose:'交换 baseline 与 method，平均差值符号应反转。',code:'forward=paired_gain(baseline,method,groups)\nreverse=paired_gain(method,baseline,groups)\nassert abs(forward+reverse) < 1e-9'},
{label:'配对长度检查',purpose:'未对齐的结果不能静默截断或按位置错配。',code:'import pytest\nwith pytest.raises(ValueError):\n    paired_gain([1,0],[1,1,0],groups)'}
]
};