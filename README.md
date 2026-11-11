# Research Lab 3.5

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
