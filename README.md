# Research Lab 4.2

Research Lab is a research-learning workspace combining structured teaching, mathematical derivations, selectable practice tasks, code evaluation, ROS 2 integration checks, and versioned Supabase learning records.

## Curriculum
- 96 course units across six tracks.
- All 96 units now have lesson records: 30 original detailed lessons and 66 newly authored lessons.
- Each lesson includes core explanations, mathematical expressions, understanding checks, references, and implementation/research practice.
- KaTeX renders inline and display mathematics.
- The task center separates 96 staged course-practice units from 100 automatically graded tasks; every online task maps to prerequisite lessons.
- The new 66 lessons cover operating systems, networking, C++ and compilers; ML, RL and representation learning; segmentation, matching, 3D detection, diffusion, tracking, VO, NeRF and Gaussian Splatting; LLM pretraining, inference, RAG, VLA, world models and efficient attention; ROS 2 middleware, kinematics, EKF, planning, VIO, manipulation and imitation learning; and research design, causal ablation, reproducibility, ethics, review and communication.

## Automatic evaluation
- 96 algorithm tasks in Python/C++17 and 4 ROS 2 Python integration tasks.
- Randomized hidden cases for algorithm submissions.
- Python and C++17 run in disposable network-denied sandboxes.
- ROS 2 tasks use a ROS 2 Jazzy microVM and integration probes.
- Supabase stores immutable evaluation reports and versioned learning records.

Behavioral tests do not prove algorithmic complexity, mathematical understanding or research novelty; those require separate written derivations and review.

## Build and verification
Run npm ci, npm test and npm run build from the web directory.
The regression suite verifies all 96 curriculum IDs have lesson content and equations, all algorithm suites, task mappings, and workspace merge behavior.

Vercel project: research-lab-learning; root directory: web; Node 22; build command: npm run build (the build script runs the regression suite); output directory: public.


## Course-to-assessment bridge (3.7)
- Every one of the 26 auto-graded tasks maps to one or more specific prerequisite lessons.
- A task shows its readiness checklist: (1) the worked-example check is correct, and (2) a guided-practice result and explanation have been submitted for each mapped course.
- The recommendation is deliberately not a hard gate. Learners may attempt a task early; the page tells them exactly which lesson stage to revisit if they get stuck.
- Course pages link back to all mapped online assessments, and task pages link to the next missing learning step.
- Readiness is a learning recommendation, not a verified mastery claim. Guided evidence is learner-submitted; only the isolated runner supplies an automatic code verdict.


## 自动评测题库 4.0
- Phase one contains 60 unique tasks: 22 original algorithm tasks + 34 new Python/C++ tasks + 4 ROS 2 Python node tasks.
- New topics include ML training primitives, CNN/BatchNorm, detection metrics/NMS, camera projection, homography, stereo, point-cloud FPS/KNN/voxel/Chamfer, rigid transforms, 3D IoU, tokenizer/rotary/KV cache/contrastive loss, quaternion, occupancy-grid indexing, scalar Kalman update, trajectory metrics, retrieval metrics and paired experiment analysis.
- Every task has a server-side reference, public examples, randomized hidden cases, numeric comparison tolerances where appropriate, a course mapping and a readiness checklist.
- The four ROS 2 tasks remain actual ROS 2 Python node contracts. New robotics geometry helpers are Python/C++ algorithm tasks; they are not mislabeled as additional ROS graph/simulator tasks.
- The online runner still uses the isolated per-submission sandbox. Open-ended model training, GPU benchmarks and full Nav2 simulation are not claimed as supported by this phase.


## 递进式题库 4.1
- 60道自动评测任务组织为10条训练路径，每条路径按先修关系与实际应用场景递进。
- 训练路径覆盖数组/哈希/滑动窗口、栈/二分/字符串、图搜索、动态规划/贪心、机器学习计算、视觉几何、点云三维、大模型基础、机器人状态与导航、科研评价。
- 题目页显示路径关卡、总关数、应用场景，并可直接跳转上一关/下一关；可以按路径筛选，仍支持方向、难度、语言与关键词过滤。
- 难度不以题面长度衡量：从单一原语、边界处理，递进到多个算法组合和工程约束。研究级题目保留，但不强行混入面试基础路径。


## Research Lab 4.2 — 100题递进题库
- 自动评测由60道扩充至100道，原60道AI/CV/3D/机器人/科研题全部保留，新增40道高频算法与数据结构题。
- 新增覆盖数组哈希、双指针、滑动窗口、字符串、单调栈、链表、二叉树、网格图、回溯、二分查找和动态规划。
- 题库不是对LeetCode官方Hot 100的逐题复制，而是参考其高频模式组织，并结合真实工程场景编写独立题目与测试契约。
- 100道题按18条训练路径组织；每条路径内部按难度非递减排序，并在构建时自动校验。每题有路径关卡、课程准备映射、实际应用说明、公开样例和随机隐藏测试。
- 用 Jump Game 替换与既有 LIS 重复的题目，补充贪心可达性判断这一高频模式。
- 新增题目支持Python与C++17，使用原有隔离运行器。ROS 2的4道真实节点集成任务保持不变。
