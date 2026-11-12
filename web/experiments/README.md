# Research Lab · 可运行研究实验包

这五个脚本是课程推导的**最小可复现实验**，使用固定随机种子生成合成数据，不需要下载大型数据集或预训练权重。

## 环境

建议 Python 3.10–3.12。

    python -m venv .venv
    # Windows: .venv\Scripts\activate
    # macOS / Linux: source .venv/bin/activate
    python -m pip install -r requirements.txt

每个脚本会在当前目录生成 PNG 图和控制台指标。

## 五个实验

| 文件 | 对应课程 | 主要验证 |
|---|---|---|
| 01_bayes_and_optimization.py | u10、u21 | 高斯共轭后验、MAP 与梯度下降 |
| 02_multiview_geometry.py | u32、u33、u38 | 极几何约束、DLT 三角化、深度误差 |
| 03_pointcloud_registration.py | u39、u40、u41 | Kabsch、鲁棒截断 ICP、位姿误差 |
| 04_slam_factor_graph.py | u74、u75、u81 | 里程计漂移、回环因子、Gauge Freedom |
| 05_transformer_attention.py | u54、u61、u62 | CLIP logit 梯度、在线 Softmax、精确分块 Attention |

运行示例：

    python 02_multiview_geometry.py

## 实验纪律

1. 先运行原始脚本，保存终端输出与 PNG。
2. 每次只改变一个变量，并记录改动。
3. 对比预期与实际结果；若不一致，先检查坐标系、归一化、随机种子和数值精度。
4. 不要把合成数据上的成功写成真实数据集上的性能结论。
5. 报告中区分理论复杂度、实测时间、峰值内存和数值误差。

## 各实验的边界

- 多视图实验使用已知内参、已知相对位姿和正确匹配，不等于完整 SfM。
- 点云实验是带离群点的合成 ICP 教学基线，不等于 KISS-ICP 或完整 SLAM。
- SLAM 实验是一维位姿图，用来展示漂移和 gauge，不是 SE(3) 因子图实现。
- Transformer 实验验证数值等价和 logit 梯度，不包含 GPU kernel 性能结论。
