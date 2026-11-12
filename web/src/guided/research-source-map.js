export const RESEARCH_SOURCE_MAP={
 u10:{title:'概率统计与贝叶斯推断',papers:[
  {title:'Probabilistic Machine Learning: An Introduction',authors:'Kevin P. Murphy',venue:'MIT Press · 2022',claim:'系统介绍概率建模、贝叶斯推断、后验预测与近似推断。',focus:'优先读概率模型、贝叶斯线性回归与共轭先验相关章节；重点区分似然、后验和预测分布。',paper:'https://probml.github.io/pml-book/book1.html',code:[['本地实验：高斯共轭后验','/experiments/01_bayes_and_optimization.py']] }
 ]},
 u21:{title:'优化方法与训练动力学',papers:[
  {title:'Adam: A Method for Stochastic Optimization',authors:'Diederik P. Kingma, Jimmy Ba',venue:'ICLR · 2015',claim:'通过梯度一阶矩和二阶矩的指数移动平均构造自适应更新。',focus:'对照算法伪代码检查 m、v、bias correction、epsilon 的位置；不要只把 Adam 当作一个 API。',paper:'https://arxiv.org/abs/1412.6980',code:[['PyTorch Adam 实现','https://github.com/pytorch/pytorch/blob/main/torch/optim/adam.py'],['本地实验：贝叶斯与优化','/experiments/01_bayes_and_optimization.py']]}
 ]},
 u33:{title:'多视图几何与 SfM',papers:[
  {title:'Structure-from-Motion Revisited',authors:'Johannes L. Schönberger, Jan-Michael Frahm',venue:'CVPR · 2016',claim:'提出面向无序图像集合的增量式 SfM 流程，系统讨论鲁棒性、准确性、完整性与规模。',focus:'按特征匹配、几何验证、注册/三角化、局部与全局 BA 顺序阅读；重点追踪数据关联如何进入几何优化。',paper:'https://openaccess.thecvf.com/content_cvpr_2016/html/Schonberger_Structure-from-Motion_Revisited_CVPR_2016_paper.html',code:[['COLMAP two-view geometry','https://github.com/colmap/colmap/blob/main/src/colmap/estimators/two_view_geometry.cc'],['COLMAP triangulation','https://github.com/colmap/colmap/blob/main/src/colmap/estimators/triangulation.cc'],['COLMAP bundle adjustment','https://github.com/colmap/colmap/blob/main/src/colmap/estimators/bundle_adjustment.cc'],['COLMAP SfM tutorial','https://github.com/colmap/colmap/blob/main/doc/tutorial.rst'],['本地实验：双目三角化','/experiments/02_multiview_geometry.py']]}
 ]},
 u38:{title:'几何验证与鲁棒估计',papers:[
  {title:'Structure-from-Motion Revisited',authors:'Johannes L. Schönberger, Jan-Michael Frahm',venue:'CVPR · 2016',claim:'将鲁棒几何验证纳入可扩展 SfM 系统，说明内点筛选、模型估计与后续重建的关系。',focus:'追踪两视图几何估计中的采样、残差阈值、模型验证与退化处理；把 RANSAC 理论成功率与实际模型质量分开。',paper:'https://openaccess.thecvf.com/content_cvpr_2016/html/Schonberger_Structure-from-Motion_Revisited_CVPR_2016_paper.html',code:[['COLMAP two-view geometry','https://github.com/colmap/colmap/blob/main/src/colmap/estimators/two_view_geometry.cc'],['本地实验：双目几何残差','/experiments/02_multiview_geometry.py']]}
 ]},
 u39:{title:'点云表示与局部几何学习',papers:[
  {title:'PointNet: Deep Learning on Point Sets for 3D Classification and Segmentation',authors:'Charles R. Qi et al.',venue:'CVPR · 2017',claim:'直接处理无序点集，并通过对称聚合满足输入点排列不变性。',focus:'追踪共享逐点 MLP、对称聚合与 T-Net；思考全局聚合丢失局部结构的原因。',paper:'https://openaccess.thecvf.com/content_cvpr_2017/html/Qi_PointNet_Deep_Learning_CVPR_2017_paper.html',code:[['PointNet 官方实现','https://github.com/charlesq34/pointnet/blob/master/models/pointnet_cls.py']]},
  {title:'PointNet++: Deep Hierarchical Feature Learning on Point Sets in a Metric Space',authors:'Charles R. Qi et al.',venue:'NeurIPS · 2017',claim:'通过采样、邻域分组与层次化 PointNet 捕获局部几何，并处理不同采样密度。',focus:'追踪 Set Abstraction、Farthest Point Sampling、ball query 与 multi-scale grouping。',paper:'https://arxiv.org/abs/1706.02413',code:[['PointNet++ 分类网络','https://github.com/charlesq34/pointnet2/blob/master/models/pointnet2_cls_ssg.py'],['PointNet++ 项目','https://github.com/charlesq34/pointnet2']]}
 ]},
 u40:{title:'三维重建与刚体配准',papers:[
  {title:'KISS-ICP: In Defense of Point-to-Point ICP',authors:'Ignacio Vizzo et al.',venue:'IEEE RA-L · 2023',claim:'通过简单、稳健的点到点 ICP 组件与恰当的阈值/采样策略构建 LiDAR 里程计。',focus:'把论文中的采样、对应搜索、鲁棒阈值与位姿更新分别映射到实现；注意初值质量和运动补偿。',paper:'https://doi.org/10.1109/LRA.2023.3236571',code:[['KISS-ICP 官方实现与运行说明','https://github.com/PRBonn/kiss-icp'],['本地实验：trimmed ICP','/experiments/03_pointcloud_registration.py']]},
  {title:'Generalized-ICP',authors:'Aleksandr V. Segal, Dirk Haehnel, Sebastian Thrun',venue:'RSS · 2009',claim:'将 point-to-point 与 point-to-plane ICP 统一到概率框架，以局部协方差描述两侧扫描的平面结构。',focus:'从局部协方差构造 Mahalanobis 残差，检查错误对应、噪声尺度和局部平面假设如何共同改变优化权重。',paper:'https://www.robots.ox.ac.uk/~avsegal/resources/papers/Generalized_ICP.pdf',code:[['KISS-ICP 相关实现入口','https://github.com/PRBonn/kiss-icp']]}
 ]},
 u41:{title:'三维几何优化与局部残差',papers:[
  {title:'Generalized-ICP',authors:'Aleksandr V. Segal, Dirk Haehnel, Sebastian Thrun',venue:'RSS · 2009',claim:'通过概率局部几何模型统一点到点与点到平面配准。',focus:'从残差定义推导 Jacobian 与近似 Hessian；检查退化场景下可观测方向，而非只看最终 RMSE。',paper:'https://www.robots.ox.ac.uk/~avsegal/resources/papers/Generalized_ICP.pdf',code:[['KISS-ICP 官方实现','https://github.com/PRBonn/kiss-icp'],['本地实验：trimmed ICP','/experiments/03_pointcloud_registration.py']]}
 ]},
 u54:{title:'CLIP 与图文对比学习',papers:[
  {title:'Learning Transferable Visual Models From Natural Language Supervision',authors:'Alec Radford et al.',venue:'ICML · 2021',claim:'通过图文匹配式对比预训练学习可迁移视觉表示。',focus:'追踪图文双编码器、归一化 embedding、温度缩放、双向交叉熵和 zero-shot 分类协议。',paper:'https://arxiv.org/abs/2103.00020',code:[['OpenAI CLIP 模型实现','https://github.com/openai/CLIP/blob/main/clip/model.py'],['OpenAI CLIP 项目','https://github.com/openai/CLIP'],['本地实验：InfoNCE 梯度','/experiments/05_transformer_attention.py']]}
 ]},
 u61:{title:'RoPE 与长上下文',papers:[
  {title:'RoFormer: Enhanced Transformer with Rotary Position Embedding',authors:'Jianlin Su et al.',venue:'arXiv · 2021',claim:'通过旋转位置编码将绝对位置变换融入 Q/K，并在注意力点积中形成相对位置依赖。',focus:'追踪二维通道对旋转、频率构造与 Q/K 变换；区分相对位置代数性质和实际长上下文外推能力。',paper:'https://arxiv.org/abs/2104.09864',code:[['Hugging Face RoFormer 实现','https://github.com/huggingface/transformers/blob/main/src/transformers/models/roformer/modeling_roformer.py']]}
 ]},
 u62:{title:'FlashAttention 与 IO-aware 计算',papers:[
  {title:'FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness',authors:'Tri Dao et al.',venue:'NeurIPS · 2022',claim:'通过 tiling 和在线 Softmax 减少 HBM 与片上 SRAM 之间的数据搬运，保持精确注意力计算。',focus:'追踪分块最大值、归一化分母和加权分子的在线更新；区分算术 FLOPs 与 IO/显存复杂度。',paper:'https://arxiv.org/abs/2205.14135',code:[['FlashAttention 官方接口与实现','https://github.com/Dao-AILab/flash-attention/blob/main/flash_attn/flash_attn_interface.py'],['FlashAttention 官方仓库','https://github.com/Dao-AILab/flash-attention'],['本地实验：在线 Softmax','/experiments/05_transformer_attention.py']]}
 ]},
 u75:{title:'SLAM 因子图与非线性优化',papers:[
  {title:'ORB-SLAM3: An Accurate Open-Source Library for Visual, Visual-Inertial and Multi-Map SLAM',authors:'Carlos Campos et al.',venue:'IEEE T-RO · 2021',claim:'将视觉与视觉惯性估计置于 MAP 框架，并通过多地图机制处理长时间跟踪丢失与地图复用。',focus:'先读系统线程与地图结构，再追踪 Tracking、Local Mapping、Loop Closing 和 Optimizer 之间的变量/因子关系。',paper:'https://arxiv.org/abs/2007.11898',code:[['ORB-SLAM3 优化器','https://github.com/UZ-SLAMLab/ORB_SLAM3/blob/master/src/Optimizer.cc'],['ORB-SLAM3 跟踪','https://github.com/UZ-SLAMLab/ORB_SLAM3/blob/master/src/Tracking.cc'],['本地实验：一维位姿图与回环','/experiments/04_slam_factor_graph.py']]},
  {title:'GTSAM: Smoothing and Mapping using Factor Graphs',authors:'Frank Dellaert and collaborators',venue:'项目与技术文档',claim:'以因子图和 Bayes 网络表达机器人平滑与建图问题。',focus:'追踪变量节点、因子残差和噪声模型，阅读线性化、增量求解与稀疏消元流程，并理解因子图为何保留局部连接结构。',paper:'https://gtsam.org/',code:[['GTSAM 项目源码','https://github.com/borglab/gtsam']]}
 ]},
 u81:{title:'视觉惯性里程计与 IMU 预积分',papers:[
  {title:'On-Manifold Preintegration for Real-Time Visual-Inertial Odometry',authors:'Christian Forster et al.',venue:'IEEE T-RO · 2017',claim:'在旋转流形上建立预积分模型，推导 Jacobian、噪声传播与 bias 一阶修正，并接入因子图优化。',focus:'重点理解 SO(3) 上的积分、bias correction、预积分协方差和视觉/惯性残差的联合 MAP 估计。',paper:'https://doi.org/10.1109/TRO.2016.2597321',code:[['GTSAM TangentPreintegration','https://github.com/borglab/gtsam/blob/develop/gtsam/navigation/TangentPreintegration.cpp'],['GTSAM IMU Factor','https://github.com/borglab/gtsam/blob/develop/gtsam/navigation/ImuFactor.cpp'],['ORB-SLAM3 IMU 数据结构','https://github.com/UZ-SLAMLab/ORB_SLAM3/blob/master/src/ImuTypes.cc'],['本地实验：位姿图基础','/experiments/04_slam_factor_graph.py']]}
 ]}
};
