/** Local static preview: node server.mjs */
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2'};
http.createServer(async(request,response)=>{
  try{
    const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname);
    const filename=path.resolve(root,'.'+pathname+(pathname.endsWith('/')?'index.html':''));
    if(!filename.startsWith(root+path.sep)||pathname.split('/').some(p=>p.startsWith('.'))){response.writeHead(403);response.end('Forbidden');return;}
    const content=await fs.readFile(filename);
    response.writeHead(200,{'Content-Type':types[path.extname(filename)]||'application/octet-stream','Cache-Control':'no-store'});response.end(content);
  }catch{response.writeHead(404);response.end('Not found');}
}).listen(8080,'127.0.0.1',()=>console.log('KACM: http://127.0.0.1:8080\nAdmin: http://127.0.0.1:8080/admin/'));
