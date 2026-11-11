import fs from 'node:fs/promises';
import { build } from 'esbuild';
await fs.mkdir('public',{recursive:true});
for(const name of ['index.html','style.css']) await fs.copyFile('src/'+name,'public/'+name);
const courses=JSON.parse(await fs.readFile('data/courses.json','utf8'));
if(!Array.isArray(courses)||courses.length!==96||new Set(courses.map(x=>x.id)).size!==96) throw new Error('Invalid curriculum integrity');
await fs.writeFile('public/courses.json',JSON.stringify(courses));
await build({entryPoints:['src/app.js'],bundle:true,outfile:'public/app.js',format:'esm',minify:true,target:'es2022',loader:{'.woff2':'file','.woff':'file','.ttf':'file'},assetNames:'fonts/[name]-[hash]'});
console.log('Built Research Lab 3.3: 96 curriculum units, KaTeX, lesson content and task bank.');
