# Research Lab 4.2

**面向人工智能、计算机视觉、三维感知与机器人方向的科研学习与实习准备平台。**  
**A research-learning and internship preparation platform for AI, computer vision, 3D perception, and robotics.**

<p align="center">
  <a href="#中文说明">中文</a> · <a href="#english">English</a>
</p>

---

## 中文说明

### 项目简介

Research Lab 将系统课程、数学推导、代码练习、自动评测、论文源码阅读和科研面试训练整合到一条循序渐进的学习路径中。平台面向希望进入高水平高校实验室开展科研实习的学生，强调从理解原理到独立实现、实验验证和清晰表达。

**在线体验：** [research-lab-learning.vercel.app](https://research-lab-learning.vercel.app)

### 学习体系

- **96 个课程单元**，覆盖六个方向：数学与计算机基础、机器学习、计算机视觉与三维感知、大模型与多模态、机器人系统、科研方法。
- 每个课程单元配有讲解、数学表达、理解检查、实践任务和研究迁移内容。
- 课程学习与自动评测相互关联：题目会标注所需先修课程和建议准备步骤；学习建议不会阻止用户提前尝试。
- 数学公式使用 KaTeX 渲染，课程内容提供分阶段学习和证据记录。

### 数学深化与科研训练

重点课程进一步提供：

- 数学假设、适用条件和逐步推导；
- 可手算的数值检查；
- 从公式到代码的实现任务；
- 可证伪的实验设计、失败案例和常见误区；
- 面向科研面试的主问题与连续追问。

重点主题包括贝叶斯推断与优化、多视图几何、点云配准、SLAM 因子图、IMU 预积分、CLIP、RoPE 和高效注意力。

### 可运行研究实验

`web/experiments/` 提供五套使用合成数据的最小实验包：

| 实验 | 主要内容 |
| --- | --- |
| 贝叶斯推断与优化 | 高斯后验、MAP、梯度下降 |
| 多视图几何 | 极几何约束、DLT 三角化、重投影误差 |
| 点云配准 | Kabsch、Trimmed ICP、位姿误差 |
| SLAM 因子图 | 里程计漂移、回环约束、Gauge Freedom |
| Transformer 与注意力 | InfoNCE、在线 Softmax、分块 Attention |

运行方式：

```bash
cd web/experiments
python -m pip install -r requirements.txt
python 02_multiview_geometry.py
```

脚本会输出数值检查并生成可视化图片。实验说明明确区分教学用合成实验与真实数据集上的研究结论。

### 论文与源码阅读

核心课程提供论文—源码对照入口，帮助学习者从论文公式追踪到实际实现，例如：

- COLMAP：两视图几何、三角化与 Bundle Adjustment；
- PointNet / PointNet++：点集表示、采样与局部特征；
- KISS-ICP：点云配准与里程计流程；
- ORB-SLAM3 / GTSAM：状态估计、因子图与 IMU 预积分；
- CLIP、RoFormer、FlashAttention：对比学习、旋转位置编码与在线注意力计算。

### 自动评测

- **100 道自动评测题**，支持 Python 与 C++17；另有 4 道 ROS 2 Python 节点集成任务。
- 算法题包含公开样例和随机隐藏测试；适用时提供数值容差。
- 题目组织为 **18 条递进训练路径**，覆盖算法基础、机器学习、视觉几何、三维点云、大模型、机器人和科研评价。
- Python 与 C++17 提交在隔离运行环境中执行；ROS 2 任务使用 ROS 2 Jazzy 环境。
- 评测报告与学习记录可通过 Supabase 保存。

自动测试只能验证实现是否满足测试契约，不能单独证明复杂度、数学理解、科研创新性或真实场景泛化能力；这些能力需要结合推导、实验和人工评估。

### 科研面试训练

课程内提供研究问题与连续追问。学习者可以保存自己的回答和多轮追问记录，并将评估材料或动态追问指令复制到 ChatGPT，进一步检查：

1. 知识准确性；
2. 数学推导深度；
3. 假设与适用边界；
4. 工程和科研联系；
5. 表达清晰度。

当前 ChatGPT 评估通过复制提示词完成，网站尚未内置模型 API。

### 中文解释图

核心课程页面嵌入中文矢量解释图，帮助理解贝叶斯推断、多视图几何、点云配准、SLAM 因子图和 Transformer 注意力。图示位于数学推导与论文源码阅读之间，并支持移动端自适应显示。

### 本地开发与构建

要求：Node.js 22.x。

```bash
cd web
npm ci
npm test
npm run build
```

构建脚本会运行回归测试并生成 `web/public/` 静态站点文件。Vercel 项目使用 `web` 作为 Root Directory，输出目录为 `public`。

### 技术栈

- 前端：原生 JavaScript、HTML、CSS、KaTeX
- 构建：Node.js、esbuild
- 自动评测：隔离运行环境、Python、C++17、ROS 2 Jazzy
- 数据与学习记录：Supabase
- 部署：Vercel
- 版本管理：GitHub

### 项目结构

```text
web/
├── experiments/       # 五套可运行研究实验与说明
├── public/
│   └── illustrations/ # 中文课程解释图（SVG）
├── src/
│   └── guided/        # 课程、数学推导、面试与源码映射
├── tests/             # 自动化回归测试
├── build.mjs          # 构建与静态资源整理
└── package.json
```

---

## English

### Overview

Research Lab is a structured learning and research-internship preparation platform for students interested in artificial intelligence, computer vision, 3D perception, and robotics.

It connects foundational courses, mathematical derivations, implementation exercises, automatic code evaluation, paper-to-source-code reading, and research interview practice into a progressive learning workflow.

**Live website:** [research-lab-learning.vercel.app](https://research-lab-learning.vercel.app)

### Curriculum

- **96 course units** across six tracks: mathematics and computer science foundations, machine learning, computer vision and 3D perception, LLMs and multimodal learning, robotics systems, and research methodology.
- Lessons combine explanations, mathematical expressions, comprehension checks, implementation practice, and research-oriented transfer tasks.
- Courses are connected to automatic assessments through prerequisite mappings and readiness guidance. Learners can still attempt assessments before completing the recommended preparation.
- Mathematical expressions are rendered with KaTeX. Learning stages and learner-submitted evidence are tracked.

### Mathematical Depth and Research Practice

Selected courses provide:

- Explicit assumptions and conditions of validity;
- Step-by-step mathematical derivations;
- Hand-checkable numerical examples;
- Implementation tasks that translate equations into code;
- Falsifiable experiments, failure cases, and common pitfalls;
- Research interview questions with multi-turn follow-ups.

Topics include Bayesian inference and optimization, multi-view geometry, point-cloud registration, SLAM factor graphs, IMU preintegration, CLIP, RoPE, and efficient attention.

### Runnable Research Experiments

Five minimal experiments using synthetic data are available in `web/experiments/`:

| Experiment | Main topics |
| --- | --- |
| Bayesian inference and optimization | Gaussian posterior, MAP, gradient descent |
| Multi-view geometry | Epipolar constraints, DLT triangulation, reprojection error |
| Point-cloud registration | Kabsch, trimmed ICP, pose error |
| SLAM factor graphs | Odometry drift, loop closure, gauge freedom |
| Transformer and attention | InfoNCE, online softmax, blockwise attention |

Run an experiment:

```bash
cd web/experiments
python -m pip install -r requirements.txt
python 02_multiview_geometry.py
```

Each script prints numerical checks and generates a visualization. The documentation distinguishes synthetic teaching experiments from claims about performance on real-world datasets.

### Paper-to-Source-Code Reading

Selected courses link research papers to relevant implementation files, including:

- **COLMAP:** two-view geometry, triangulation, and bundle adjustment;
- **PointNet / PointNet++:** point-set representations, sampling, and local features;
- **KISS-ICP:** point-cloud registration and odometry pipeline;
- **ORB-SLAM3 / GTSAM:** state estimation, factor graphs, and IMU preintegration;
- **CLIP, RoFormer, and FlashAttention:** contrastive learning, rotary position embeddings, and online attention computation.

### Automatic Evaluation

- **100 automatic coding tasks** for Python and C++17, plus 4 ROS 2 Python node integration tasks.
- Algorithm tasks include public examples and randomized hidden tests, with numerical tolerances where appropriate.
- Tasks are organized into **18 progressive learning paths** covering algorithms, machine learning, visual geometry, 3D point clouds, LLMs, robotics, and research evaluation.
- Python and C++17 submissions run in isolated execution environments. ROS 2 tasks use a ROS 2 Jazzy environment.
- Evaluation reports and learning records can be stored through Supabase.

Automated tests verify whether an implementation satisfies its test contract. They do not, by themselves, establish algorithmic complexity, mathematical understanding, research novelty, or generalization to real-world scenarios. Those require derivations, experiments, and human review.

### Research Interview Practice

Courses include research questions and follow-up chains. Learners can save answers and multi-turn interview notes, then copy evaluation materials or adaptive follow-up prompts into ChatGPT to review:

1. Technical accuracy;
2. Depth of mathematical reasoning;
3. Assumptions and limitations;
4. Engineering and research relevance;
5. Clarity of communication.

ChatGPT-based evaluation currently uses a copy-and-paste workflow. A model API is not yet integrated directly into the website.

### Chinese Explanatory Diagrams

Core course pages embed Chinese-language vector diagrams for Bayesian inference, multi-view geometry, point-cloud registration, SLAM factor graphs, and Transformer attention. Diagrams appear alongside the relevant derivations and source-code references, with responsive layouts for mobile screens.

### Local Development and Build

Requirement: Node.js 22.x.

```bash
cd web
npm ci
npm test
npm run build
```

The build script runs regression tests and generates the static site in `web/public/`. The Vercel project uses `web` as its Root Directory and `public` as its output directory.

### Technology Stack

- Front end: vanilla JavaScript, HTML, CSS, KaTeX
- Build: Node.js, esbuild
- Code evaluation: isolated execution, Python, C++17, ROS 2 Jazzy
- Data and learning records: Supabase
- Deployment: Vercel
- Version control: GitHub

### Repository Structure

```text
web/
├── experiments/       # Five runnable research experiments and documentation
├── public/
│   └── illustrations/ # Chinese course diagrams (SVG)
├── src/
│   └── guided/        # Curriculum, derivations, interviews, source maps
├── tests/             # Automated regression tests
├── build.mjs          # Build and static asset pipeline
└── package.json
```

---

## License and Contributions

Please check the repository's license and contribution policy before redistributing or reusing the project. Contributions that improve correctness, reproducibility, accessibility, and learning value are welcome.

## 许可证与贡献

转载或复用项目前，请先确认仓库中的许可证及贡献规范。欢迎围绕正确性、可复现性、无障碍体验和学习价值提交改进。
