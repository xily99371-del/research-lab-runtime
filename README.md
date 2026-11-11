# Research Lab 3.2

Private source repository for the user's learning website and ROS environment.

## Components
- `web/`: email-authenticated learning site, safe DOM rendering, versioned Supabase workspace sync, immutable submission reports.
- `web/api/evaluate.js`: authenticated judge; one disposable network-denied Vercel Sandbox per submission. No database secrets or application credentials enter learner VMs.
- `app/main.py`: Railway ROS 2 Jazzy health/capabilities service. **Shared-container arbitrary execution is disabled.**

## Deployment
Website Vercel project: research-lab-learning; root directory `web`; build `npm run build`; output `public`. All API files must be deployed together. Never deploy only a changed HTML file.

Server variables: SUPABASE_URL, SUPABASE_ANON_KEY (publishable key), SANDBOX_SNAPSHOT_ID, GRADER_SIGNING_KEY (sensitive server-only).

The runtime base snapshot contains Ubuntu Noble/Jazzy, Python, g++17, nlohmann-json and a trusted supervisor. The initial curriculum is exported from the snapshot by build.mjs to preserve all 96 historical IDs. The snapshot created on 2026-11-11 currently expires 2026-12-11; rotate it before expiration and keep the environment variable current. Compute and storage are subject to Vercel quotas/charges; no unlimited-free claim.

## Tested execution contracts
Five algorithm tasks: two_sum, parentheses, bfs, attention, astar. Python function `solve(data)` and C++ function `json solve(const json& data)`.
Four ROS 2 tasks: Topic uppercase relay, AddTwoInts service, static TF2 geometry, Fibonacci Action goal/result. Entry point `build_node()` returns a Node; the runner owns init/spin/shutdown. Current Action tests do not test cancel/feedback. Nav2/Gazebo simulation is not included.

## Data safety
User data remains in Supabase with RLS. Workspace writes use compare-and-swap versions and three-way merge; same-field conflicts require explicit resolution. Grades come only from signed server reports in rl_jobs; client self-assessment is separate.

## Content status
96 preserved curriculum outlines; six expanded lessons with derivation, implementation, error analysis and primary references. This is not a claim that 96 full textbooks or research projects have been authored.

## Verification
Run `cd web && npm ci && npm test`. CI checks JavaScript and Python syntax and commits the initial pinned dependency lockfile. Release testing must also verify the deployed browser, API authentication, sample correctness/failure, timeouts and real ROS communication. Build success is not functional acceptance.
