from __future__ import annotations
import os, re, secrets, subprocess, tempfile, time
from pathlib import Path
from typing import Literal
from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel, Field
app=FastAPI(title='Research Lab ROS 2 Evaluator',version='0.1.0')
TOKEN=os.getenv('API_BEARER_TOKEN','')
MAX_BYTES=64000
class SourceFile(BaseModel):
 path:str=Field(min_length=1,max_length=180)
 content:str=Field(max_length=MAX_BYTES)
class EvaluateRequest(BaseModel):
 task_id:Literal['ros2_workspace_build']
 files:list[SourceFile]=Field(min_length=1,max_length=12)
def authenticate(header):
 if not TOKEN: raise HTTPException(503,'API_BEARER_TOKEN is not configured')
 if not header or not secrets.compare_digest(header,'Bearer '+TOKEN): raise HTTPException(401,'Unauthorized')
def safe_path(root,rel):
 p=Path(rel)
 if p.is_absolute() or '..' in p.parts or not re.fullmatch(r'[A-Za-z0-9_./-]+',rel): raise HTTPException(400,'Invalid source path')
 dest=(root/p).resolve()
 if root.resolve() not in dest.parents: raise HTTPException(400,'Path traversal rejected')
 return dest
def run(cmd,cwd,timeout):
 start=time.monotonic()
 try:
  p=subprocess.run(cmd,cwd=cwd,text=True,capture_output=True,timeout=timeout,check=False,shell=False,env={**os.environ,'ROS_DOMAIN_ID':'73','RCUTILS_COLORIZED_OUTPUT':'0'})
  return {'exit_code':p.returncode,'stdout':p.stdout[-12000:],'stderr':p.stderr[-12000:],'seconds':round(time.monotonic()-start,3),'timed_out':False}
 except subprocess.TimeoutExpired as e:
  return {'exit_code':None,'stdout':str(e.stdout or '')[-12000:],'stderr':str(e.stderr or '')[-12000:],'seconds':round(time.monotonic()-start,3),'timed_out':True}
@app.get('/health')
def health(): return {'status':'ok','service':'research-lab-ros2','ros_distro':'jazzy'}
@app.post('/v1/ros2/evaluate')
def evaluate(req:EvaluateRequest,authorization:str|None=Header(default=None)):
 authenticate(authorization)
 if sum(len(f.content.encode()) for f in req.files)>MAX_BYTES: raise HTTPException(413,'Total source size exceeds limit')
 with tempfile.TemporaryDirectory(prefix='rl3_ros_') as tmp:
  root=Path(tmp)
  for f in req.files:
   dest=safe_path(root,f.path);dest.parent.mkdir(parents=True,exist_ok=True);dest.write_text(f.content,encoding='utf-8')
  if not (root/'src').is_dir(): raise HTTPException(400,'Upload workspace files under src/<package>')
  build=run(['bash','-lc','source /opt/ros/jazzy/setup.bash && colcon build --event-handlers console_direct+'],root,25)
  passed=build['exit_code']==0 and not build['timed_out']
  return {'pass':passed,'score':60 if passed else 0,'stage':'build','build':build,'note':'Initial build-validation endpoint only. Not a hardened arbitrary-code sandbox; ROS runtime integration fixtures and per-job isolation are still required.'}
