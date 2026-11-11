import fs from 'node:fs/promises';
const path='web/src/app.js';let s=await fs.readFile(path,'utf8');
s=s.replace("if(user?.id===next?.id&&!recovery)return;","if(user&&next&&user.id===next.id&&!recovery)return;");
s=s.replace("if(!dirty){const r=await remote();if(generation!==epoch)return;if(r.version!==version)","if(!dirty){const beforeRead=revision;const r=await remote();if(generation!==epoch)return;if(revision!==beforeRead||dirty)return;if(r.version!==version)");
await fs.writeFile(path,s);
const cssPath='web/src/style.css';let css=await fs.readFile(cssPath,'utf8');if(!css.includes('/* verified-mobile-grid */'))css+='\n/* verified-mobile-grid */\naside,nav{min-width:0}nav{max-width:100%}.layout{min-width:0}@media(max-width:800px){.layout{grid-template-columns:minmax(0,1fr)}.account-head{max-width:100%;flex-wrap:wrap}.account-head span{overflow-wrap:anywhere}}\n';await fs.writeFile(cssPath,css);
const pkgPath='web/package.json';const pkg=JSON.parse(await fs.readFile(pkgPath,'utf8'));pkg.engines={node:'22.x'};await fs.writeFile(pkgPath,JSON.stringify(pkg,null,2)+'\n');
