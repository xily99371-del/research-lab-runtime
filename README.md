# Research Lab 3.3

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
Thirteen algorithm tasks: two_sum, parentheses, bfs, attention, astar, binary_search, dijkstra, knapsack, merge_intervals, top_k, max_subarray, union_find, lcs. P¶»§q«^