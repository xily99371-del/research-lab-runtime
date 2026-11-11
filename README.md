# Research Lab 3.4

Research Lab is a personal research-learning workspace aimed at preparing for technical work in strong university laboratories. It combines structured teaching, mathematical derivations, selectable practice tasks, code evaluation, ROS 2 integration checks, and a versioned Supabase learning record.

## Learning experience
- 96 preserved course units across six tracks: computer science, machine learning, computer vision/3D, LLM/multimodal, robotics/ROS 2, and research methods.
- 31 detailed lesson units currently include explanations, equations, derivations, implementation tasks, research questions, and primary references. Other units have structured learning guides and explicit deliverables; they are not represented as finished textbooks.
- KaTeX renders inline and display mathematics.
- 96 selectable course-practice tasks are available in the task center. These are open-ended implementation/research deliverables, not automatically graded code submissions.
- 26 selectable automatic-evaluation tasks include 22 Python/C++ algorithms and 4 ROS 2 Python integration tasks.

## Code evaluation
- Python and C++17 use one disposable network-denied Vercel Sandbox per submission.
- The grader uses server-side hidden cases, execution time limits, memory/CPU limits, and signed immutable reports stored in Supabase.
- ROS 2 tasks use an Ubuntu Noble / ROS 2 Jazzy microVM snapshot and trusted DDS integration probes for Topic, Service, TF2 and Action Goal/Result.
- The Railway service exposes health/capability diagnostics and authenticated source-release transport. It does not execute arbitrary learner code in a shared long-lived container.
- Behavioral tests do not prove algorithmic complexity or research-level understanding; those require separate written derivations and review.

## Deployment
Vercel project: research-lab-learning; root directory: web; Node 22; build command: npm test && npm run build; output directory: public.
Server variables: SUPABASE_URL, SUPABASE_ANON_KEY (publishable key), SANDBOX_SNAPSHOT_ID, and GRADER_SIGNING_KEY (server-only).
Supabase stores user workspaces and immutable evaluation reports with row-level security and compare-and-swap versioning.

The base sandbox snapshot currently expires on 2026-12-11 and must be rotated before expiry. Vercel compute and storage are subject to quotas and charges.

## Verification
Run cd web && npm ci && npm test && npm run build.
Browser acceptance checks cover KaTeX rendering, 26 auto-graded tasks, 96 practice tasks, navigation, task persistence in guest mode, and mobile horizontal overflow. Live email delivery and authenticated end-to-end submissions still require real account acceptance testing.
