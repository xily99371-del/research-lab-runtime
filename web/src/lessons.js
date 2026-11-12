import { LORA_GUIDED } from './lora-guided.js';

export const LESSONS = {
  u53: LORA_GUIDED,
  u49: {
    title: 'Attention：从矩阵形状到梯度与稳定性',
    sections: [
      ['问题与形状', '设 Q∈R^(Tq×D)，K∈R^(Tk×D)，V∈R^(Tk×Dv)。我们要让每个 query 对所有 key 计算可比较的权重，再聚合 value。QKᵀ 得到 Tq×Tk 的分数，不是 Tq×D；注意力的输出是 Tq×Dv，不能默认 query 长度与 key 长度相同。'],
      ['为何除以 √D', '在各分量近似独立、均值为 0、方差为 1 的假设下，q·k=Σ qᵢkᵢ 的方差为 D。维度增大使 logits 尺度增大，softmax 更容易饱和，Jacobian 中 pᵢ(1−pᵢ) 变小。除以 √D 使方差维持量级 1。这是初始化附近的尺度分析，不是对训练中所有分布的无条件定理。'],
      ['稳定 softmax 与遮罩', 'S=QKᵀ/√D；Aᵢⱼ=exp(Sᵢⱼ−mᵢ)/Σⱼ exp(Sᵢⱼ−mᵢ)，mᵢ=maxⱼ Sᵢⱼ。对 mask=false 的位置先屏蔽，再取有效位置最大值。整行无有效 key 时，−∞−(−∞) 会产生 NaN；本平台明确约定此行输出零向量，代码必须显式处理。'],
      ['反向传播', '令 G=∂L/∂O，O=AV。则 ∂L/∂V=AᵀG，H=∂L/∂A=GVᵀ。对每行 softmax，∂L/∂Sᵢⱼ=Aᵢⱼ(Hᵢⱼ−Σₖ AᵢₖHᵢₖ)。因此 ∂L/∂Q=(∂L/∂S)K/√D，∂L/∂K=(∂L/∂S)ᵀQ/√D。请用 float64 中心差分检查每一项，避免把自动求导成功误当作推导正确。'],
      ['复杂度与 KV cache', '显式分数矩阵占 O(TqTk)，乘法时间约 O(TqTk(D+Dv))。自注意力 Tq=Tk=T 时是序列长度二次增长。自回归缓存 K/V 能避免重复计算历史投影，但每个新 token 仍需关注历史 key；缓存没有把全部注意力计算变成与上下文长度无关。'],
      ['最小实验', '固定 Q/K/V 比较未缩放、√D 缩放和不同温度；画出注意力熵、最大权重、梯度范数随 D 的曲线。区分随机初始化假设与真实模型分布。记录极端 logits、非方阵、全遮挡行和 float16/float32 的差异。不要仅展示一条看起来合理的输出。']
    ],
    questions: ['推导 softmax 的 Jacobian，并说明它为什么每行和为零。', '改变 V 但固定 Q/K 时，注意力权重是否变化？', 'FlashAttention 改善的是数学阶数还是 IO 与中间存储？'],
    links: [['Attention Is All You Need', 'https://arxiv.org/abs/1706.03762'], ['PyTorch scaled_dot_product_attention', 'https://docs.pytorch.org/docs/stable/generated/torch.nn.functional.scaled_dot_product_attention.html']]
  },
  u3: {
    title: 'BFS、Dijkstra 与 A*：证明保证来自哪里',
    sections: [
      ['统一问题', '把状态定义为顶点、合法动作为边、代价定义为边权。BFS 只适用于各边代价相同的最短路；Dijkstra 允许非负不同权重；A* 在累计代价 g(n) 上加入到终点的估计 h(n)。先定义图与代价，再选择算法。'],
      ['BFS 的正确性：按层归纳', '令 δ(s,v) 为从源点 s 到 v 的最少边数。队列按非递减层数弹出节点。初始源点距离为0；假设所有距离为 k 的节点先于距离 k+1 的节点出队，则从距离 k 的节点首次发现的未访问邻居距离恰为 k+1。visited 必须在入队时标记，否则同一节点可能由多条前驱重复入队。只有每条边代价相同时，层数才等于路径代价。'],
      ['Dijkstra 的割性质证明', '所有 tentative distance 都是某条已发现路径的代价，因此 d[v] 始终是 dist(s,v) 的上界。设 S 为已确定节点集合，u 是 S 外 tentative distance 最小的节点。反设 d[u]>dist(s,u)，取一条最短 s→u 路径，并令 y 是该路径上第一个不在 S 中的节点，x 是 y 的前驱。x∈S 已确定，松弛 x→y 后有 d[y]≤dist(s,y)≤dist(s,u)<d[u]，与 u 的最小 tentative distance 矛盾。因此 d[u]=dist(s,u)。非负边权保证路径从 y 到 u 的剩余代价不为负；负权边会破坏这一关键不等式。'],
      ['从证明映射到代码', 'dist 初始化为∞、source 为0，表达“已知路径上界”；relax 的 if alt<dist[v] 表达上界收紧；pop 最小项表达选择割边外最小上界。堆中旧项不会自动消失，所以弹出后若 popped_dist!=dist[u] 必须跳过。证明中的每个假设都应对应输入契约或代码检查。'],
      ['A* 的可采纳性和一致性', '可采纳：h(n)≤h*(n)。一致性：对每条边 n→m，有 h(n)≤c(n,m)+h(m)，且 h(goal)=0。由 g(m)=g(n)+c(n,m)，可得 f(m)=g(m)+h(m)≥g(n)+h(n)=f(n)，即沿路径 f 不下降。若启发函数一致，图搜索中节点以最优 g 出队后可安全关闭；只有可采纳但不一致时，必须允许更优 g 触发 reopen，否则可能失去最优性。'],
      ['四邻域启发式', '在只允许上下左右移动、每步代价 1 的网格中，Manhattan 距离 |r−rg|+|c−cg| 可采纳且一致。允许对角移动后不能直接照搬：对角代价与启发式需匹配。障碍只会增大真实路径代价，因此无障碍距离仍是下界。'],
      ['工程实现', '堆中可能保留同一节点的陈旧项。弹出后若记录 g 大于当前 best_g，应跳过；更新父节点用于回溯。访问检查、代价更新、堆优先级不能混用。测试起终点重合、被占据、不可达、狭长通道和重复入堆。'],
      ['研究实验', '在同一批地图比较 h=0、Manhattan、加权 h；同时报告路径代价、扩展节点数、时间及失败率。加权启发式可能更快但不再满足原最优性保证；不要只报告速度。固定地图集，避免挑选有利样例。']
    ],
    questions: ['为什么把 BFS 队列换成栈会失去逐层最短路保证？', '写一个 h 可采纳但不一致的反例，展示 closed set 不重开时的问题。', '评测最短距离通过，能否证明代码使用了 A*？'],
    links: [['A Formal Basis for the Heuristic Determination of Minimum Cost Paths', 'https://doi.org/10.1109/TSSC.1968.300136'], ['Nav2 planner concepts', 'https://docs.nav2.org/concepts/index.html']]
  },
  u70: {
    title: 'ROS 2 通信：机制、并发和可执行契约',
    sections: [
      ['通信语义', 'Topic 是持续数据流，通常发布者不等待每条消息的业务结果；Service 是短请求—响应；Action 在目标、反馈、结果之外提供取消协议，适合长任务。不要把一次循环调用 service 当作正确的长任务 action 实现。'],
      ['QoS 是端点契约', '通信双方需要兼容。可靠性 RELIABLE/BEST_EFFORT、持久性 VOLATILE/TRANSIENT_LOCAL、历史深度均影响发现后的实际交付。请求 RELIABLE 的订阅者与只提供 BEST_EFFORT 的发布者可能不兼容；改话题名不能修复 QoS。可靠传输也不等于应用回调一定准时。'],
      ['Executor 与死锁', 'Executor 调度回调；CallbackGroup 决定并发互斥关系。在单线程或互斥组的回调中同步等待另一个必须由同一执行器处理的响应，可能死锁。使用异步 future，并让事件循环继续推进；多线程执行器也不能自动消除所有互斥组依赖。'],
      ['生命周期与对象引用', '创建 publisher/subscriber/service 后将对象保存在 Node 上，避免临时对象被释放。显式理解 init、spin、destroy_node、shutdown 的顺序。在本平台 build_node() 只负责构造节点，评测器负责进程和 spin 生命周期，避免重复 init 或自行阻塞。'],
      ['端到端测试', '测试需要独立观察者发送挑战输入并核验输出，不能只 grep 日志。Topic 验证实际 String 内容；Service 检查正负随机输入；Action 检查 accepted、SUCCEEDED 和结果内容。当前在线 Action 题不验证取消和反馈，不能据此宣称已经掌握全部 Action 语义。'],
      ['延迟分析', '记录发送时间、收到时间、回调开始/结束；分别估计传输延迟、排队和执行时间。改变发布频率及耗时回调，观察丢包、队列积压和抖动。测试机器时间需要同一时间基准，否则延迟结论无效。']
    ],
    questions: ['ros2 topic list 看到了话题但收不到消息，应如何依次排查类型、QoS、域和执行器？', '为何回调里 future.result() 可能让服务永远不返回？', '可靠性 QoS 与业务层任务成功的区别是什么？'],
    links: [['ROS 2 Jazzy QoS', 'https://docs.ros.org/en/jazzy/Concepts/Intermediate/About-Quality-of-Service-Settings.html'], ['ROS 2 Executors', 'https://docs.ros.org/en/jazzy/Concepts/Intermediate/About-Executors.html']]
  },
  u72: {
    title: 'TF2：变换方向、时间和误差传播',
    sections: [
      ['定义先于乘法', '写成 p_A=T_A_B p_B，表示把 B 坐标中的点变到 A。齐次矩阵 T=[R,t;0,1]，旋转 R∈SO(3) 满足 RᵀR=I、det(R)=1。两条变换相乘必须中间坐标系匹配：T_A_C=T_A_B T_B_C。'],
      ['逆变换', 'T_B_A=[Rᵀ,−Rᵀt;0,1]，不是简单把 t 取负。点的齐次末分量为 1，而方向向量为 0，所以平移作用于点、不作用于方向。用具体点变换比只检查矩阵形状更容易定位方向错误。'],
      ['四元数', '旋转四元数需要单位范数；q 和 −q 代表同一旋转。绕 z 轴 θ 的四元数按 ROS 字段顺序 (x,y,z,w) 为 (0,0,sin(θ/2),cos(θ/2))。不要把 wxyz 文献顺序直接塞进 xyzw API。'],
      ['时间语义', '动态 TF 存储带时间戳的变换。相机图像时间与 TF 查询时间不一致时，运动机器人会出现系统性几何误差；最新变换不能无条件替代传感器采样时刻。静态外参可使用 StaticTransformBroadcaster，动态 map/odom/base_link 则需理解漂移和全局修正职责。'],
      ['验证案例', '发布 world→sensor：t=(1,2,0)，yaw=π/2。sensor 点(1,0,0) 先旋转到(0,1,0)，再平移到world(1,3,0)。反向变换应恢复原点。平台测试独立 TF listener 查询、四元数范数以及这一几何关系。'],
      ['研究迁移', '传感器外参误差和时间同步误差会耦合：线速度 v、时间偏差 Δt 的一阶位置误差约 vΔt；角速度还会引入与点距离相关的旋转误差。设计静止/运动、近点/远点分组实验区分来源，而非盲目调滤波器噪声。']
    ],
    questions: ['推导 T 的逆矩阵，说明为何平移项需乘 Rᵀ。', '怎样区分 frame 方向错误与时间外推错误？', '静态外参正确能否保证动态点云配准正确？'],
    links: [['tf2 官方概念', 'https://docs.ros.org/en/jazzy/Concepts/Intermediate/About-Tf2.html'], ['REP 105 坐标系约定', 'https://www.ros.org/reps/rep-0105.html']]
  },
  u86: {
    title: '实验设计：从“涨点”到可信证据',
    sections: [
      ['把主张写成可检验比较', '“加入模块更好”过于含糊。先固定任务、数据分布、评价单位与主要指标，再写主张：在相同训练预算下，方法在动态遮挡子集上的配对查询错误率下降，同时端到端延迟增加不超过阈值。主指标应在看测试集之前确定。'],
      ['对照与混杂', '改动网络、训练轮数和数据增强之后，把提升全部归因于新模块并不成立。设置参数量/计算量匹配对照、额外监督对照、随机特征对照和替代损失。消融只去掉模块可能改变优化难度，因此不能单独证明作者提出的机制。'],
      ['统计单位', '图像来自相同场景或视频时，样本往往相关；按单帧 bootstrap 会高估有效样本量。按场景/序列分组重采样，并报告各随机种子结果。训练种子不确定性和测试样本不确定性是不同来源，不应混成一个不解释的标准差。'],
      ['配对差值', '对相同查询记录 baseline 与 method 成败，统计配对差值而非只看两个独立均值。Bootstrap 重采样配对单位，构造差值置信区间；同时给出效应量、算力成本和失败分组。统计显著不等于工程价值。'],
      ['停止标准', '记录哪些实验会推翻核心假设。如果相同参数量的对照达到同样收益，研究主张需要修改。负结果也可能缩小有效条件。把实验日志和配置提交到 Git，保留从现象到结论的证据链。']
    ],
    questions: ['相同平均提升但不同场景方差，如何判断是否值得部署？', '为什么测试集反复用于选模型会使最终评估偏乐观？', '为你的三维几何项目设计“额外监督”与“模块结构”的分离对照。'],
    links: [['NeurIPS Paper Checklist', 'https://neurips.cc/public/guides/PaperChecklist'], ['scikit-learn data leakage', 'https://scikit-learn.org/stable/common_pitfalls.html']]
  }
};
