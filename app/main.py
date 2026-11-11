"""ROS diagnostics and authenticated source release transport.
No untrusted learner code is executed in this long-lived service.
"""
import hashlib, os, secrets
from pathlib import Path
from fastapi import FastAPI, Header, HTTPException, Response
app=FastAPI(title='Research Lab runtime diagnostics',version='3.2.0')
@app.get('/health')
def health():
 import rclpy
 from std_msgs.msg import String
 return {'status':'ok','ros_distro':'jazzy','rclpy_import':True,'shared_code_execution':False}
@app.get('/capabilities')
def capabilities():
 return {'execution':'per-submission Vercel microVM via authenticated website API','contracts':['ros_topic','ros_service','ros_tf','ros_action'],'nav2_simulation':False}
@app.post('/v1/ros2/evaluate')
def old_endpoint():
 raise HTTPException(410,'Shared-container execution disabled. Use Research Lab authenticated /api/evaluate.')
@app.get('/internal/release')
def release(response:Response,authorization:str|None=Header(default=None)):
 key=os.getenv('RL_RELEASE_KEY','')
 if not key or not authorization or not secrets.compare_digest(authorization,'Bearer '+key):raise HTTPException(401,'Unauthorized')
 root=Path('/opt/ros-evaluator/web');files=[]
 for p in sorted(root.rglob('*')):
  if not p.is_file() or p.is_symlink():continue
  rel=p.relative_to(root).as_posix()
  if any(part in {'.git','node_modules','.env','public'} for part in p.relative_to(root).parts):continue
  if p.suffix not in {'.js','.mjs','.json','.html','.css'}:continue
  raw=p.read_bytes()
  if len(raw)>400000:raise HTTPException(500,'Unexpected release size')
  files.append({'path':rel,'content':raw.decode('utf-8'),'sha256':hashlib.sha256(raw).hexdigest()})
 if not any(f['path']=='package-lock.json' for f in files):raise HTTPException(503,'Dependency lock missing')
 response.headers['Cache-Control']='no-store'
 return {'version':'3.2.0','files':files}
