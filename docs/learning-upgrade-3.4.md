# Research Lab 3.4 learning and task upgrade

## What changed
- Math: KaTeX auto-render is bundled into the application. Inline \( ... \) and display \[ ... \] delimiters render after each route render.
- Course structure: all 96 original course IDs are retained. Course-to-lesson IDs were audited and realigned after the course catalogue was restored.
- Teaching: 31 units have detailed lessons with sections, equations, questions, implementation assignments, and primary references. The other 65 units show structured learning objectives, methods, practice deliverables, and research-level acceptance criteria; they remain explicitly labelled as guided outlines.
- Task center: separate tabs for automatic code evaluation and open-ended course practice.
- Automatic code tasks: 22 algorithm tasks in Python/C++ and 4 ROS 2 Python tasks.
- Course practice: all 96 units appear as selectable implementation/research tasks. Learners can record progress and add a task to the weekly plan.
- Responsive UI: fixed intrinsic-width overflow in mobile navigation and added document-level horizontal overflow containment.

## Automatic task catalogue
Two Sum, parentheses, BFS, Attention, A*, binary search, Dijkstra, 0/1 knapsack, merge intervals, Top-K, maximum subarray, union-find, LCS, topological sort, coin change, LIS, sliding-window maximum, KMP, matrix multiplication, interval scheduling, connected components, edit distance, ROS Topic, ROS Service, ROS TF2, ROS Action.

## Acceptance
- Run: npm ci && npm test && npm run build
- Browser test verifies KaTeX output, 26 automatic tasks, 96 practice tasks, lesson navigation, practice progress saving, and mobile document width.
- Course ID regression tests verify lesson mapping for Attention, camera geometry, VPR, LoRA, ROS 2, TF2, SLAM, Nav2 and research methods.

## Important distinction
The automatic grader verifies program behaviour on server-side test cases. It does not claim to prove time complexity, algorithmic correctness in all possible inputs, mathematical understanding, or research novelty. Those are separate lesson and research-review requirements.
