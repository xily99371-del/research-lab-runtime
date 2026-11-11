import fs from 'node:fs/promises';
import { build } from 'esbuild';
import { Sandbox } from '@vercel/sandbox';
await fs.mkdir('public',{recursive:true});
for(const name of ['index.html','style.css'])await fs.copyFile('src/'+name,'public/'+name);
let courses;
try{courses=JSON.parse(await fs.readFile('data/courses.json','utf8'));}
catch{
 if(!process.env.SANDBOX_SNAPSHOT_ID)throw new Error('Missing SANDBOX_SNAPSHOT_ID and local curriculum. Build stopped instead of publishing an empty site.');
 const s=await Sandbox.create({source:{type:'snapshot',snapshotId:process.env.SANDBOX_SNAPSHOT_ID},resources:{vcpus:1},timeout:45000,persistent:false,networkPolicy:'deny-all'});
 try{const b=await s.readFileToBuffer({path:'/opt/rl-curriculum.json'});if(!b)throw new Error('Curriculum missing from base image');courses=JSON.parse(b.toString('utf8'));}finally{await s.stop();}
}
if(!Array.isArray(courses)||courses.length!==96||new Set(courses.map(x=>x.id)).size!==96)throw new Error('Invalid curriculum integrity');
await fs.writeFile('public/courses.json',JSON.stringify(courses));
await build({entryPoints:['src/app.js'],bundle:true,outfile:'public/app.js',format:'esm',minify:true,target:'es2022'});
console.log('Built Research Lab 3.2 with 96 preserved units and all API source files.');
