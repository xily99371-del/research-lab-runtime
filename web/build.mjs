import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { spawnSync, execFileSync } from 'node:child_process';
import { build } from 'esbuild';

// Fail the deployment before publishing any invalid source or partial API bundle.
const source = await fs.readFile('src/index.html');
const html = new TextDecoder('utf-8', { fatal: true }).decode(source);
assert.match(html, /<meta\s+charset=["']UTF-8["']/i, 'The document must declare UTF-8');
assert.doesNotMatch(html, /\\u[0-9a-fA-F]{4}/, 'Literal JavaScript Unicode escapes must not appear in static HTML');
assert.doesNotMatch(html, /\uFFFD/, 'Replacement characters found in HTML');
for (const label of ['学习驾驶舱', '课程与讲解', '任务中心 / 在线评测', '研究与实验', '论文笔记', '周计划', '导师联系', '账户与数据']) {
  assert.ok(html.includes(label), `Missing readable navigation label: ${label}`);
}
const deploymentConfig = JSON.parse(await fs.readFile('vercel.json', 'utf8'));
for (const name of Object.keys(deploymentConfig.functions || {})) {
  if (!name.includes('*')) await fs.access(name);
}
const tests = (await fs.readdir('tests')).filter(name => name.endsWith('.test.mjs')).sort().map(name => `tests/${name}`);
assert.ok(tests.length > 0, 'A release must include the regression tests');
const checks = spawnSync(process.execPath, ['--test', ...tests], { stdio: 'inherit' });
if (checks.error || checks.status !== 0) throw checks.error || new Error(`Regression tests failed (exit ${checks.status})`);

const pkg = JSON.parse(await fs.readFile('package.json', 'utf8'));
const courses = JSON.parse(await fs.readFile('data/courses.json', 'utf8'));
assert.ok(Array.isArray(courses) && courses.length === 96 && new Set(courses.map(x => x.id)).size === 96, 'Invalid curriculum integrity');
await fs.mkdir('public', { recursive: true });
await fs.writeFile('public/index.html', html.replace(/版本\s+\d+\.\d+(?:\.\d+)?[^<]*/, `版本 ${pkg.version} · 中文显示与自动部署`), 'utf8');
await fs.copyFile('src/style.css', 'public/style.css');
await fs.writeFile('public/courses.json', JSON.stringify(courses), 'utf8');
await build({entryPoints:['src/app.js'],bundle:true,outfile:'public/app.js',format:'esm',minify:true,target:'es2022',loader:{'.woff2':'file','.woff':'file','.ttf':'file'},assetNames:'fonts/[name]-[hash]'});
let commitSha = process.env.VERCEL_GIT_COMMIT_SHA || null;
if (!commitSha) { try { commitSha = execFileSync('git', ['rev-parse', 'HEAD'], { encoding:'utf8' }).trim(); } catch { /* Inline/local builds may not have Git metadata. */ } }
await fs.writeFile('public/release.json', JSON.stringify({ version:pkg.version, commitSha, branch:process.env.VERCEL_GIT_COMMIT_REF || null, buildTime:new Date().toISOString(), checks:{ utf8:true, readableNavigation:true, functionFiles:true, regressionTests:true } }), 'utf8');
console.log(`Built Research Lab ${pkg.version}: UTF-8 navigation and regression checks passed.`);
