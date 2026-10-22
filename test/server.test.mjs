import test from 'node:test';
import assert from 'node:assert/strict';
import { request } from 'node:http';
import { makeServer } from '../src/server.mjs';
test('loopback üzerinden HTTP kontrolü', async (t) => {
  const server = makeServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const base = 'http://127.0.0.1:' + server.address().port;
  try {
    let home;
    try { home = await fetch(base); }
    catch (e) {
      if (e.cause?.code === 'EACCES' && process.env.TASKPROOF_REQUIRE_HTTP !== '1') { t.skip('Çalışma ortamı loopback bağlantısını EACCES ile engelliyor.'); return; }
      throw e;
    }
    assert.equal(home.status, 200); assert.match(await home.text(), /TaskProof/);
    assert.match(home.headers.get('content-security-policy'), /frame-ancestors 'none'/);
    const result = await fetch(base + '/api/report'); const report = await result.json();
    assert.equal(report.counts.insufficient, 5);
    for (const path of ['/package.json', '/.env', '/data/source-index.json', '/unknown']) {
      assert.equal((await fetch(base + path)).status, 404);
    }
    assert.equal((await fetch(base + '/api/snapshot', {method:'POST'})).status, 405);
    // Node fetch can normalize/ignore Host; raw HTTP must carry the hostile host.
    const hostileHostStatus = await new Promise((resolve, reject) => {
      const req = request(base, {headers:{Host:'attacker.example'}}, (res) => {
        res.resume(); res.on('end', () => resolve(res.statusCode));
      });
      req.on('error', reject); req.end();
    });
    assert.equal(hostileHostStatus, 403);
  } finally { await new Promise((resolve) => server.close(resolve)); }
});

test('HTTP handler dosya, rapor, host ve yöntem kurallarını uygular (ağsız)', async () => {
  const server = makeServer();
  const call = (url, method = 'GET', host = '127.0.0.1:4317') => new Promise((resolve) => {
    const response = {
      writeHead(status, headers) { this.status = status; this.headers = headers; },
      end(body) { resolve({status:this.status, headers:this.headers, body:String(body)}); },
    };
    server.emit('request', {url, method, headers:{host}}, response);
  });
  const home = await call('/'); assert.equal(home.status, 200); assert.match(home.body, /TaskProof/);
  assert.match(home.headers['Content-Security-Policy'], /frame-ancestors 'none'/);
  assert.equal(JSON.parse((await call('/api/report')).body).counts.insufficient, 5);
  assert.equal(JSON.parse((await call('/api/demo')).body).mode, 'synthetic');
  for (const url of ['/package.json','/.env','/../package.json','/unknown']) assert.equal((await call(url)).status,404);
  assert.equal((await call('/api/snapshot','POST')).status,405);
  assert.equal((await call('/','GET','attacker.example')).status,403);
});
