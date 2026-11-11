// Optional browser QA; install Playwright in a disposable environment first.
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
 const pathFilter=page.locator('select[aria-label="递进训练路径"]');assert.ok(await pathFilter.count()===1);await pathFilter.selectOption({label:'图搜索与路径规划'});assert.ok(await page.locator('.task-list .task-item').count()===6);await page.locator('.task-item[data-task="bfs"]').click();assert.ok(await page.getByText(/第 1\/6 关/).count()>0);assert.ok(await page.getByText(/实际应用：/).count()>0);await page.getByRole('button',{name:/下一关：/}).click();assert.ok(await page.locator('.task-item.active[data-task="connected_components"]').count()===1);await pathFilter.selectOption({label:'全部'});
 const items=page.locator('.task-list .task-item');
 assert.equal(await items.count(),60);
 const categories=new Set();
 const taskSamples=[];
 for(let i=0;i<60;i++){
  const item=items.nth(i),id=await item.getAttribute('data-task');
  categories.add((await item.locator('small').first().innerText()).split(' · ')[0]);
  await item.click();
  const panel=page.locator('.assessment-readiness');
  assert.ok(await panel.locator('.assessment-path-row').count()>0,'missing course mapping: '+id);
  assert.ok(await panel.getByRole('button',{name:/提前挑战|开始自动评测/}).count()===1,'missing challenge action: '+id);
  const languages=await page.locator('#code-language option').allTextContents();
  if(!id.startsWith('ros_'))assert.ok(languages.some(x=>x.includes('Python'))&&languages.some(x=>x.includes('C++')),'missing language support: '+id);
  if(i<10)taskSamples.push({id,courses:await panel.locator('.assessment-path-row').count()});
 }
 assert.ok(categories.size>=6);
 await page.setViewportSize({width:390,height:844});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),390);
 await page.locator('nav button[data-page="courses"]').click();
 assert.equal(await page.locator('.learn-course-list .course-item').count(),96);
 assert.deepEqual(errors,[]);
 console.log(JSON.stringify({base,totalTasks:60,categoryCount:categories.size,courseMappings:'60/60',sample:taskSamples,mobileWidth:390,courses:96,browserErrors:errors}));
}finally{await browser.close();}
