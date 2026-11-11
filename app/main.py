"""Read-only ROS 2 environment diagnostics.
Learner submissions are never executed in this persistent shared container.
The website evaluates each submission in a fresh, egress-denied microVM.
"""
from fastapi import FastAPI, HTTPException
app=FastAPI(title='Research Lab ROS 2 environment',version='3.2.0')
@app.get('/health')
def health():
 import rclpy
 from std_msgs.msg import String
 return {'status':'ok','ros_distro':'jazzy','rclpy_import':True,'shared_code_execution':False}
@app.get('/capabilities')
def capabilities():
 return {'service':'ROS 2 environment diagnostics','execution':'per-submission Vercel microVM via Research Lab authenticated API','supported_contracts':['ros_topic','ros_service','ros_tf','ros_action'],'nav2_simulation':False}
@app.post('/v1/ros2/evaluate')
def old_endpoint():
 raise HTTPException(410,'Shared-container execution disabled. Use the authenticated Research Lab /api/evaluate endpoint.')
