FROM ros:jazzy-ros-base
ENV DEBIAN_FRONTEND=noninteractive PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /opt/ros-evaluator
RUN apt-get update && apt-get install -y --no-install-recommends python3-pip python3-colcon-common-extensions ros-jazzy-rclpy ros-jazzy-std-msgs ros-jazzy-launch-testing ros-jazzy-launch-testing-ros ros-jazzy-ament-cmake-pytest && rm -rf /var/lib/apt/lists/*
RUN python3 -m pip install --break-system-packages --no-cache-dir fastapi==0.115.12 'uvicorn[standard]==0.34.0' pydantic==2.11.3
RUN useradd --create-home --uid 10001 evaluator
COPY app /opt/ros-evaluator/app
COPY web /opt/ros-evaluator/web
RUN chown -R evaluator:evaluator /opt/ros-evaluator
USER evaluator
EXPOSE 8080
CMD ["bash","-lc","source /opt/ros/jazzy/setup.bash && exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8080}"]
