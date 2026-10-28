/** Deployment smoke tests: static root, routing configs, and source fidelity. */
import { readFile,stat,readdir } from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { once } from 'node:events';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const pub=resolve(root,'dist');
const required=['index.html','404.html','perro.html','perro-deepdive.html','mercore.html','admin.html'];
for(const name of required){
  const [source,compiled]=await Promise.all([readFile(resolve(root,name)),readFile(resolve(pub,name))]);
  if(!compiled.equals(source)) throw new Error(`${name} is missing/altered in dist`);
}
const redirectFile=await readFile(resolve(pub,'_redirects'),'utf8');
if (!redirectFile.includes('/perro /perro.html 200')) throw new Error('Static path aliases are missing');
const vercel=JSON.parse(await readFile(resolve(root,'vercel.json'),'utf8'));
const firebase=JSON.parse(await readFile(resolve(root,'firebase.json'),'utf8'));
if(vercel.outputDirectory!=='dist'||firebase.hosting.public!=='dist') throw new Error('Hosting output directories must point to dist');
const files=await readdir(resolve(pub,'framerusercontent.com/images'));
if(files.length<50) throw new Error('Published assets are missing');
const server=createServer(async(req,res)=>{
 let route;
 try{route=decodeURIComponent((req.url||'/').split('?')[0])}catch{res.writeHead(400).end();return;}
 const name=route==='/'?'index.html':route.slice(1);
 if(!name||name.includes('..')||name.includes('\\')){res.writeHead(400).end();return;}
 const path=resolve(pub,name);
 if(!path.startsWith(pub+'/')){res.writeHead(403).end();return;}
 try{let info=await stat(path);if(!info.isFile()) throw new Error('not file');
 res.writeHead(200,{'Content-Type':name.endsWith('.html')?'text/html':'application/octet-stream'});
 createReadStream(path).pipe(res);
 }catch{res.writeHead(404).end('Not Found')}
});
server.listen(0,'127.0.0.1'); await once(server,'listening');
try{
 const base=`http://127.0.0.1:${server.address().port}`;
 for(const [route,name] of [['/','index.html'],['/index.html','index.html'],['/perro.html','perro.html'],['/404.html','404.html']]){
  const res=await fetch(base+route);
  if(res.status!==200) throw new Error(`${route} returned ${res.status}`);
  if(!Buffer.from(await res.arrayBuffer()).equals(await readFile(resolve(pub,name)))) throw new Error(`${route} content mismatch`);
 }
 if((await fetch(base+'/')).status!==200) throw new Error('Homepage is not HTTP 200');
 console.log('PASS: static hosting returns the original index at /; all key pages and assets present; configs route to dist.');
}finally{server.close();}
