const CACHE="maknazul-gh-v1";
const SHELL=["./","style.css","config.js","a1.js","a2.js","a3.js","a4.js","a5.js","manifest.webmanifest"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
const r=e.request,u=new URL(r.url);
if(r.method!=="GET"||u.origin!==location.origin)return;
e.respondWith(fetch(r).then(res=>{const copy=res.clone();caches.open(CACHE).then(c=>c.put(r,copy));return res;}).catch(()=>caches.match(r).then(m=>m||caches.match("./"))));
});
