// One-time source/lockfile normalization, run by the repository CI.
import fs from 'node:fs/promises';
const path='web/src/app.js';let s=await fs.readFile(path,'utf8');
s=s.replace("if(user?.id===next?.id&&!recovery)return;","if(user&&next&&user.id===next.id&&!recovery)return;");
s=s.replace("if(!dirty){const r=await remote();if(generation!==epoch)return;if(r.version!==version)","if(!dirty){const beforeRead=revision;const r=await remote();if(generation!==epoch)return;if(revision!==beforeRead||dirty)return;if(r.version!==version)");
s=s.replace("let file=", "let file=");
await fs.writeFile(path,s);
