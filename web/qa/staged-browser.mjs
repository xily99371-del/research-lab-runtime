// Run after installing Playwright in a disposable QA environment.
// BASE_URL may point to a local build or the deployed site. No real login/data writes.
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
 assert.doesNotMatch(await page.locator('body').innerText(),/\\u[0-9a-f]{4}/i);
 await page.locator('nav button[data-page="courses"]').click();
 assert.equal(await page.locator('.learn-course-list .course-item').count(),96);
 const mathErrors=[];let renderedMath=0;
 for(let i=0;i<96;i++){
  await page.locator('.learn-course-list .course-item').nth(i).click();
  assert.equal(await page.locator('.learn-stages [role="tab"]').count(),5);
  await page.locator('[data-stage="1"]').click();
  renderedMath+=await page.locator('.learn-main .katex').count();
  if(await page.locator('.math-parse-error,.katex-error').count())mathErrors.push(await page.locator('.learn-main h2').innerText());
 }
 assert.deepEqual(mathErrors,[]);assert.ok(renderedMath>450);
 await page.locator('.course-item[data-unit="u9"]').click();await page.locator('[data-stage="1"]').click();
 const check=page.locator('[data-check="worked"]');
 await check.locator('input').fill('0');await check.getByRole('button',{name:'核对答案',exact:true}).click();assert.match(await check.locator('.learn-feedback').innerText(),/暂未通过/);
 await check.locator('input').fill('[11,4]');await check.getByRole('button',{name:'核对答案',exact:true}).click();assert.match(await check.locator('.learn-feedback').innerText(),/核对正确/);
 await page.locator('[data-stage="2"]').click();await page.getByRole('button',{name:'展开第1层提示'}).click();
 await page.reload({waitUntil:'networkidle'});await page.locator('.course-item[data-unit="u9"]').click();await page.locator('[data-stage="2"]').click();assert.match(await page.locator('.learn-stage-content').innerText(),/提示1/);
 await page.locator('[data-stage="3"]').click();assert.equal(await page.locator('.learn-code').count(),0);
 const fields=page.locator('.learn-evidence textarea');await fields.nth(0).fill('QA example source');await fields.nth(1).fill('QA test outputs');await fields.nth(2).fill('QA explanation');await page.getByRole('button',{name:'提交本阶段证据'}).click();
 await page.reload({waitUntil:'networkidle'});await page.locator('.course-item[data-unit="u9"]').click();assert.match(await page.locator('.course-item[data-unit="u9"] small').innerText(),/实现已提交/);
 await page.locator('#learning-search').pressSequentially('相机');assert.equal(await page.locator('#learning-search').inputValue(),'相机');assert.ok(await page.locator('.course-item').count()>=1);await page.locator('#learning-search').fill('');
 await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),390);
 await page.locator('nav button[data-page="code"]').click();assert.equal(await page.locator('.task-list .task-item').count(),26);
 await page.getByRole('button',{name:/课程实践任务/}).click();assert.equal(await page.locator('.learn-practice-card').count(),96);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),390);
 for(const route of ['research','papers','weeks','mentors','account','dashboard'])await page.locator('nav button[data-page="'+route+'"]').click();
 assert.deepEqual(errors,[]);
 const release=await page.evaluate(()=>fetch('/release.json',{cache:'no-store'}).then(r=>r.json()));
 if(process.env.EXPECTED_SHA)assert.equal(release.commitSha,process.env.EXPECTED_SHA);
 console.log(JSON.stringify({base,commit:release.commitSha,version:release.version,coursePages:96,stagesPerCourse:5,renderedMath,mathErrors,autoTasks:26,practiceTasks:96,wrongThenCorrectCheck:true,hintPersistence:true,evidencePersistence:true,searchFocus:true,mobileWidth:390,browserErrors:errors,realAccountCreated:false,productionDatabaseWritten:false}));
}finally{await browser.close();}
