import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const base=process.env.BASE_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const errors=[];
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 page.on('pageerror',e=>errors.push(e.message));
 const response=await page.goto(base,{waitUntil:'networkidle'});assert.equal(response.status(),200);
 await page.waitForSelector('.learn-hero');
 await page.locator('nav button[data-page="code"]').click();
 const items=page.locator('.task-list .task-item');
 assert.equal(await items.count(),60,'Default core path should show 60 curated algorithm tasks');
 const tiers=await page.locator('.task-tier-card').count();assert.equal(tiers,5);
 const tierCounts=[];
 for(const level of [1,2,3,4,5]){
  await page.getByLabel('递进难度').selectOption('L'+level+' '+({1:'入门',2:'基础',3:'进阶',4:'综合',5:'挑战'}[level]));
  tierCounts.push(await page.locator('.task-list .task-item').count());
 }
 assert.deepEqual(tierCounts,[9,18,18,12,3]);
 await page.getByLabel('递进难度').selectOption('全部');
 await page.getByLabel('学习路线').selectOption('AI/机器人专题');
 assert.equal(await page.locator('.task-list .task-item').count(),36);
 await page.getByLabel('学习路线').selectOption('ROS 2系统集成');
 assert.equal(await page.locator('.task-list .task-item').count(),4);
 await page.getByLabel('学习路线').selectOption('全部');
 assert.equal(await page.locator('.task-list .task-item').count(),100);
 const ids=await page.locator('.task-list .task-item').evaluateAll(xs=>xs.map(x=>x.dataset.task));
 assert.equal(new Set(ids).size,100);
 const sample=[];
 for(let i=0;i<ids.length;i++){
  const id=ids[i];await page.locator('.task-item[data-task="'+id+'"]').click();
  const detail=page.locator('.task-detail');
  assert.ok(await detail.locator('.assessment-path-row').count()>0,'No course readiness path for '+id);
  assert.ok(await detail.locator('h3').filter({hasText:'实际应用'}).count()===1,'No real application note for '+id);
  const options=await page.locator('#code-language option').count();
  assert.equal(options,id.startsWith('ros_')?1:2,'Language contract mismatch for '+id);
  if(i<8)sample.push({id,tier:await page.locator('.task-item[data-task="'+id+'"]').getAttribute('data-tier')});
 }
 await page.setViewportSize({width:390,height:844});
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth)<=390,'Mobile horizontal overflow');
 await page.locator('nav button[data-page="courses"]').click();
 assert.equal(await page.locator('.learn-course-list .course-item').count(),96);
 assert.deepEqual(errors,[]);
 console.log(JSON.stringify({base,coreTasks:60,tierCounts,specialtyTasks:36,rosTasks:4,totalTasks:100,courseLinks:'100/100',courses:96,mobileWidth:390,browserErrors:errors,sample}));
}finally{await browser.close();}
