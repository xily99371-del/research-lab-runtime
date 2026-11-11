# Research Lab 4.1

Research Lab is a research-learning workspace combining structured teaching, mathematical derivations, selectable practice tasks, code evaluation, ROS 2 integration checks, and versioned Supabase learning records.

## Curriculum
- 96 course units across six tracks.
- All 96 units now have lesson records: 30 original detailed lessons and 66 newly authored lessons.
- Each lesson includes core explanations, mathematical expressions, understanding checks, references, and implementation/research practice.
- KaTeX renders inline and display mathematics.
- The task center separates 96 open-ended course-practice tasks from 26 automatically graded tasks.
- The new 66 lessons cover operating systems, networking, C++ and compilers; ML, RL and representation learning; segmentation, matching, 3D detection, diffusion, tracking, VO, NeRF and Gaussian Splatting; LLM pretraining, inference, RAG, VLA, world models and efficient attention; ROS 2 middleware, kinematics, EKF, planning, VIO, manipulation and imitation learning; and research design, causal ablation, reproducibility, ethics, review and communication.

## Automatic evaluation
- 22 algorithm tasks in Python/C++ and 4 ROS 2 Python integration tasks.
- Randomized hidden cases for algorithm submissions.
- Python and C++17 run in disposable network-denied sandboxes.
- ROS 2 tasks use a ROS 2 Jazzy microVM and integration probes.
- Supabase stores immutable evaluation reports and versioned learning records.

Behavioral tests do not prove algorithmic complexity, mathematical understanding or research novelty; those require separate written derivations and review.

## Build and verification
Run npm ci, npm test and npm run build from the web directory.
The regression suite verifies all 96 curriculum IDs have lesson content and equations, all algorithm suites, task mappings, and workspace merge behavior.

Vercel project: research-lab-learning; root directory: web; Node 22; build command: npm test && npm run build; output directory: public.


## Course-to-assessment bridge (3.7)
- Every one of the 26 auto-graded tasks maps to one or more specific prerequisite lessons.
- A task shows its readiness checklist: (1) the worked-example check is correct, and (2) a guided-practice result and explanation have been submitted for each mapped course.
- The recommendation is deliberately not a hard gate. Learners may attempt a task early; the page tells them exactly which lesson stage to revisit if they get stuck.
- Course pages link back to all mapped online assessments, and task pages link to the next missing learning step.
- Readiness is a learning recommendation, not a verified mastery claim. Guided evidence is learner-submitted; only the isolated runner supplies an automatic code verdict.


## 自动评测题库 4.1
- Phase one contains 60 unique tasks: 22 original algorithm tasks + 34 new Python/C++ tasks + 4 ROS 2 Python node tasks.
- New topics include ML training primitives, CNN/BatchNorm, detection metrics/NMS, camera projection, homography, stereo, point-cloud FPS/KNN/voxel/Chamfer, rigid transforms, 3D IoU, tokenizer/rotary/KV cache/contrastive loss, quaternion, occupancy-grid indexing, scalar Kalman update, trajectory metrics, retrieval metrics and paired experiment analysis.
- Every task has a server-side reference, public examples, randomized hidden cases, numeric comparison tolerances where appropriate, a course mapping and a readiness checklist.
- The four ROS 2 tasks remain actual ROS 2 Python node contracts. New robotics geometry helpers are Python/C++ algorithm tasks; they are not mislabeled as additional ROS graph/simulator tasks.
- The online runner still uses the isolated per-submission sandbox. Open-ended model training, GPU benchmarks and full Nav2 simulation are not claimed as supported by this phase.


## 递进式题库 4.1
- 自动评测扩展至100道唯一题目：60道高频算法主线、36道AI/机器人专业题、4道ROS 2系统集成题。
- 高频算法主线按L1入门、L2基础、L3进阶、L4综合、L5挑战组织；每题标注算法模式、实际应用场景、关联课程与准备度。
- 新增40道经典算法与数据结构题：哈希、双指针、滑动窗口、单调栈、链表、二叉树、图搜索、回溯、动态规划、贪心和二分等。
- 题目输入输出契约、边界条件和排序规则明确，支持Python与C++17；每题具有公开案例和随机隐藏测试。
- AI/机器人专题继续覆盖视觉几何、点云、模型计算、导航和科研评价；ROS 2题保持真实节点集成评测，不与普通算法题混为一谈。
- 题目列表默认打开核心算法主线，可按学习路线、技术方向、难度和语言筛选；学习者可自由提前挑战，不强制解锁。
- 构建检查确保100题全部出现在课程导航，并拥有难度等级、课程准备路径和服务端评测入口。
