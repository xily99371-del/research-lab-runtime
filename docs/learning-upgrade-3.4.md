# Research Lab 3.5 \u2014 complete curriculum expansion

## Result
All 96 curriculum units now have complete lesson records. The original 30 detailed lessons were retained; 66 additional lessons were added in remaining-lessons.js and ros-middleware-lesson.js. Every lesson has a topic-specific equation, at least three conceptual sections/questions, references and practice tasks. Where an original lesson has no custom task list, the course's own implementation deliverable is displayed.

## New lesson coverage
- Computer science: operating systems/concurrency, networks, Linux engineering, modern C++, compiler design, databases, distributed consistency, GPU computing, proof techniques.
- Machine learning: supervised learning, kernels/metric learning, unsupervised representations, training systems, RL, self-supervision, GNNs, probabilistic ML, compression and OOD robustness.
- Vision/3D: segmentation, local matching, 3D detection, diffusion, video, tracking, optical flow/VO, NeRF, Gaussian Splatting and open-vocabulary detection.
- LLM/multimodal: pretraining/data, serving, multimodal fusion, RAG, Agent reliability, VLA, positional encoding, efficient attention, evaluation, test-time search, safety, world models and multimodal retrieval/fine-tuning.
- Robotics: ROS 2 middleware/DDS, kinematics, KF/EKF, simulation, real-time execution, path planning, trajectory optimization, VIO, manipulation, imitation and robot RL.
- Research: paper reproduction, problem formulation, writing, deployment, causal ablation, reproducibility, ethics, review and research communication.

## Rendering and task experience
KaTeX is used for lesson-specific equations. Course lessons show topic-specific explanations and practice tasks; the task center retains 96 open-ended practice tasks and 26 separately auto-graded tasks.

## Verification
npm ci && npm test && npm run build
The test suite includes a strict check that all 96 course IDs resolve to a lesson with an equation, sections, questions, references and a practice deliverable.
