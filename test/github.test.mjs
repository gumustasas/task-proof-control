import test from 'node:test';
import assert from 'node:assert/strict';
import { collectPull,parsePullUrl } from '../src/github.mjs';
import { makeServer } from '../src/server.mjs';
const sha='a'.repeat(40),old='b'.repeat(40);
const pr={head:{sha},title:'Örnek PR',state:'open',merged:false};
const json=(body,headers={})=>new Response(JSON.stringify(body),{status:200,headers});
function fixture({headChanged=false,stale=false,paginate=false}={}){
  const calls=[];let reads=0;
  return {calls,fetcher:async(url,init)=>{
    calls.push({url,init});const u=new URL(url);
    if(u.pathname.endsWith('/pulls/1'))return json(++reads===2&&headChanged?{...pr,head:{sha:old}}:pr);
    if(u.pathname.endsWith('/check-runs'))return json({check_runs:[{id:1,head_sha:stale?old:sha,name:'CI',status:'completed',conclusion:'success'}]},paginate&&u.searchParams.get('page')==='1'?{link:'<https://untrusted.example/next>; rel="next"'}:{});
    if(u.pathname.endsWith('/actions/runs'))return json({workflow_runs:[{id:2,head_sha:sha,name:'checks',status:'completed',conclusion:'success',run_attempt:1}]});
    if(u.pathname.endsWith('/jobs'))return json({jobs:[{id:3,head_sha:sha,name:'test',status:'completed',conclusion:'success',steps:[]}]});
    throw new Error('Unexpected URL '+url);
  }};
}
test('GitHub PR URL doğrulaması SSRF ve credentials reddeder',()=>{
  assert.deepEqual(parsePullUrl('https://github.com/owner/repo/pull/1'),{owner:'owner',repo:'repo',number:1});
  for(const u of ['http://github.com/a/b/pull/1','https://attacker.test/a/b/pull/1','https://user:password@github.com/a/b/pull/1','https://github.com:444/a/b/pull/1','https://github.com/a/b/pull/1?x=1','https://github.com/a/b/pull/0'])assert.throws(()=>parsePullUrl(u));
});
test('PR, kontroller, koşu ve iş aynı SHA ile toplanır; sonuç davranış kanıtı değildir',async()=>{
  const f=fixture();const r=await collectPull('https://github.com/o/r/pull/1',f);
  assert.equal(r.headSha,sha);assert.equal(r.calls,5);assert.equal(r.observations.length,3);assert.equal(r.complete,true);
  assert.match(r.interpretation,/doğrulamaz/);assert.ok(!('criteria' in r));
  assert.ok(f.calls.every(c=>c.init.method==='GET'&&c.init.redirect==='error'&&new URL(c.url).origin==='https://api.github.com'));
});
test('Link hedefi izlenmez; sayfalama api.github.com üzerinde kalır',async()=>{
  const f=fixture({paginate:true});await collectPull('https://github.com/o/r/pull/1',{...f,token:'test-only'});
  assert.ok(f.calls.some(c=>c.url.includes('page=2')));assert.ok(f.calls.every(c=>new URL(c.url).hostname==='api.github.com'));
  assert.ok(f.calls.every(c=>c.init.headers.Authorization==='Bearer test-only'));
});
test('sayfa sınırında eksiksiz veri iddia edilmez',async()=>{
  const r=await collectPull('https://github.com/o/r/pull/1',{...fixture({paginate:true}),maxPages:1});
  assert.equal(r.complete,false);assert.ok(r.warnings.some(x=>x.includes('Sayfalama')));
});
test('başka commit sonucu atlanır',async()=>{
  const r=await collectPull('https://github.com/o/r/pull/1',fixture({stale:true}));assert.equal(r.observations.filter(x=>x.kind==='check').length,0);assert.equal(r.complete,false);
});
test('okuma sırasında head değişirse snapshot reddedilir',async()=>{
  await assert.rejects(collectPull('https://github.com/o/r/pull/1',fixture({headChanged:true})),e=>e.code==='HEAD_CHANGED');
});
test('auth/rate-limit/not-found cevaplarında özel body sızmaz',async()=>{
  for(const [status,code] of [[401,'AUTH'],[404,'NOT_FOUND'],[429,'RATE_LIMIT'],[403,'RATE_LIMIT']]){
    await assert.rejects(collectPull('https://github.com/o/r/pull/1',{fetcher:async()=>new Response('private error secret',{status,headers:{'x-ratelimit-remaining':'0'}})}),e=>e.code===code&&!e.message.includes('private'));
  }
});
test('istek bütçesi aşılmaz',async()=>{
  const f=fixture();await assert.rejects(collectPull('https://github.com/o/r/pull/1',{...f,maxRequests:1}),e=>e.code==='REQUEST_LIMIT');assert.equal(f.calls.length,1);
});
test('timeout hata koduyla sonuçlanır',async()=>{
  const fetcher=(_url,init)=>new Promise((_resolve,reject)=>init.signal.addEventListener('abort',()=>reject(new Error('abort'))));
  await assert.rejects(collectPull('https://github.com/o/r/pull/1',{fetcher,timeoutMs:5}),e=>e.code==='TIMEOUT');
});
test('JSON boyut sınırı uygulanır',async()=>{
  await assert.rejects(collectPull('https://github.com/o/r/pull/1',{fetcher:async()=>json({huge:'x'.repeat(2_000_001)})}),e=>e.code==='BODY_LIMIT');
});
test('GitHub endpoint kaynak ve içerik türü kontrolü olmadan ağ çağrısı yapmaz',async()=>{
  let calls=0;const server=makeServer({collect:async()=>{calls++;return {headSha:sha};}});
  const invoke=(headers,body)=>new Promise(resolve=>{
    const req={url:'/api/github',method:'POST',headers:{host:'127.0.0.1:4317',...headers},async *[Symbol.asyncIterator](){yield Buffer.from(body);}};
    const res={writeHead(status){this.status=status;},end(text){resolve({status:this.status,text:String(text)});}};server.emit('request',req,res);
  });
  assert.equal((await invoke({},'{}')).status,403);assert.equal(calls,0);
  assert.equal((await invoke({origin:'http://127.0.0.1:4317'},'{}')).status,415);assert.equal(calls,0);
  const headers={origin:'http://127.0.0.1:4317','content-type':'application/json'};
  assert.equal((await invoke(headers,'x'.repeat(5000))).status,413);assert.equal(calls,0);
  assert.equal((await invoke(headers,JSON.stringify({url:'https://github.com/o/r/pull/1'}))).status,200);assert.equal(calls,1);
});
