# Research Lab 3.2 — acceptance record (2026-11-11)

## Deployed release

Production: https://research-lab-learning.vercel.app

Verified deployment: dpl_APHRgrRrbdtemakG57RQ7SKrkfUG. The production alias was read back and resolves to this READY deployment. This release includes the complete frontend and API source; partial single-file updates must not be used.

## Tests executed

### Browser and HTTP

Playwright Chromium against the production address: dashboard, courses, code, research, papers, weekly plan, mentor tracking and account pages opened without JavaScript page errors. A 390px-wide mobile viewport had a 390px document width. GET /api/config returned version 3.2.0 with runnerConfigured=true. Unauthenticated POST /api/evaluate returned HTTP 401.

### Supabase identity, synchronization and permissions

A fixed internal acceptance test created two synthetic users, signed in normally with email/password, used a separate client session to read saved progress, rejected a stale workspace version, verified cross-user reads were blocked and anonymous reads revealed no private data, and verified clients could not insert a forged grading row. Both synthetic users were removed. Temporary acceptance functions were replaced with disabled HTTP 410 handlers requiring JWTs.

This verifies backend authentication and separate-session data synchronization. It does not prove delivery of a verification/reset email to the owner's real inbox, nor a completed two-physical-computer UI workflow.

Additional privilege check: zero anonymous grants on private app tables; zero authenticated TRUNCATE/TRIGGER/REFERENCES grants on workspace/verified grades; zero client INSERT/UPDATE/DELETE privileges on rl_jobs; RLS enabled. No test users remain.

### Isolated execution image

A fresh microVM cloned from the configured runtime snapshot with outbound networking denied executed the production supervisor. The following checks passed:

| Check | Result |
|---|---|
| Python reference implementation | Correct output |
| C++17 compilation and reference implementation | Correct output |
| Invalid C++ source | Compilation error reported |
| ROS 2 Topic | 5/5 discovery/message tests |
| ROS 2 Service | 5/5 discovery/request-response tests |
| ROS 2 TF2 | 4/4 transform/quaternion/point tests |
| ROS 2 Action | Goal/result reference passed |
| Incorrect ROS Service arithmetic | Rejected |
| Nonterminating Python reference | Terminated at approximately 12 seconds |

These are real runtime tests, not AI judgments. They test the supervisor directly in the isolated image. A signed-in browser submission through the production API, followed by persisted signed-grade verification, was not completed in this acceptance run; do not label that particular end-to-end path as tested.

## Current product scope

- 96 retained curriculum units; 6 have expanded lessons and derivations, the rest are explicitly marked outlines.
- 5 algorithm tasks available in Python and C++17; 4 ROS 2 Python tasks.
- Behavior grading does not establish asymptotic complexity, independent authorship or research mastery.
- ROS Action tests currently cover goal/result, not feedback/cancellation. No Nav2/Gazebo acceptance suite is shipped.
- Railway provides ROS diagnostics and authenticated source-release delivery. Untrusted submissions run in disposable Vercel microVMs, not the shared Railway service.

## Maintenance

The configured runtime snapshot is snap_loj53Hw2YPGwP3kVFvEPMRAiPtli and its recorded expiration is 2026-12-11. Refresh/replace the base snapshot before expiry, update SANDBOX_SNAPSHOT_ID, then redeploy and rerun acceptance checks. Never snapshot a test controller containing account sessions, browser cookies or secrets.

Git-based Vercel deployment hit a provider rate limit during this release. The working deployment uses authenticated, hash-verified private source transfer from the existing Railway service during both install and build, with required-file checks. Keep this explicit until direct Git deployment is verified. Railway itself remains connected to this private repository.
