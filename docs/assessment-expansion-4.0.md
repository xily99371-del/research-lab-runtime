# Research Lab 4.0 — 自动评测题库第一轮扩容

## 交付范围
- 自动评测由26道增加至60道。
- 原有22道Python/C++算法题与4道ROS 2 Python节点集成题保留。
- 新增34道Python/C++ JSON输入输出任务，所有题目都有独立ID、课程映射、公开样例、参考实现、随机隐藏测试和对应课程准备度。
- 服务端ALGORITHMS现为56项，ROS白名单仍为4项；每次评测仍在原有独立、禁网、资源受限的Vercel microVM执行。
- 原Supabase用户、历史提交、课程进度和域名均不变。

## 新增任务分布
| 方向 | 数量 | 任务举例 |
|---|---:|---|
| 机器学习与深度学习 | 7 | Softmax、线性回归一步更新、交叉熵、混淆矩阵、BatchNorm推理、Conv2D、K-means分配 |
| 计算机视觉与三维视觉 | 16 | IoU、NMS、相机投影/反投影、Homography、双目深度、Chamfer、Voxel、FPS、KNN、刚体变换、点面距离、质心、齐次变换、3D IoU、深度图转点云 |
| 大模型与多模态 | 4 | 贪心Tokenizer切分、RoPE旋转对、KV Cache估算、对比损失 |
| 机器人几何与导航 | 4 | 四元数旋转、Occupancy Grid索引、一维Kalman更新、轨迹长度 |
| 科研方法与系统能力 | 3 | Recall@K、Average Precision、配对均值差 |

新增34题均支持Python和C++17；ROS 2 Python保留原来的四个真实节点任务。

## 自动测试契约
- 每题有公开样例与16组随机隐藏输入（少量固定用例题按其定义生成对应数量）。
- 参考实现和输出比较采用有限浮点容差；数组维度、索引顺序和null语义明确。
- 测试覆盖稳定Softmax、相机投影/反投影往返、点云采样、刚体变换、四元数、空集合、边界索引、检索去重与配对指标。
- 60道题全部映射到96节课程之一或多个；题目页显示建议准备度，允许提前挑战。
- 课程与题目仍双向链接，学习者提交的准备证据不替代服务端判题。

## 沙箱验证
使用生产配置的隔离运行器快照，在网络禁用的microVM中直接运行新task_id的示例：
- Python Softmax通过通用solve(data)协议输出正确JSON。
- C++17 Softmax通过同一协议成功编译并输出正确JSON。
- 该监督程序对算法题是通用solve(data)入口；ROS节点仍受ros_topic/ros_service/ros_tf/ros_action四个集成探针白名单限制。

## 不在本轮宣称支持
这34道新增题主要是可独立判定的数值、几何和模块级函数。它们不等于完整模型训练或GPU性能评测；也不把四道ROS节点任务说成Nav2仿真、真实机器人控制或完整ROS图评测。下一轮再增加更重的图像/点云数据集任务和ROS运行时场景任务，并按资源与测试可靠性验收。

## 运行
- 单元/参考实现回归：`cd web && npm test`
- 生产构建（会阻止不完整题库发布）：`cd web && npm run build`
- 浏览器题库检查：安装Playwright后执行`BASE_URL=... node web/qa/assessment-bank-60.mjs`
