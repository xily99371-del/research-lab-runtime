# Research Lab Runtime

Private execution service for Research Lab 3.

## Components
- FastAPI runtime API
- ROS 2 Jazzy worker image
- Task-specific ROS 2 integration tests using pytest/launch_testing

## Security status
This is an initial task runner, NOT a hardened hostile-code multi-tenant sandbox. Do not expose arbitrary user source execution publicly until per-job container isolation, network isolation, seccomp/AppArmor, CPU/memory/PID limits, and cleanup are implemented and verified.

## Deploy
Railway builds from Dockerfile. Set API_BEARER_TOKEN to a long random secret. PORT is supplied by Railway. Configure the Research Lab backend to call /health and /v1/ros2/evaluate.

Never store Supabase service-role credentials in this runtime.
