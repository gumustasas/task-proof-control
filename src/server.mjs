import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { evaluateSnapshot } from './engine.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const routes = new Map([
  ['/', ['public/index.html', 'text/html; charset=utf-8']],
  ['/app.js', ['public/app.js', 'text/javascript; charset=utf-8']],
  ['/style.css', ['public/style.css', 'text/css; charset=utf-8']],
  ['/engine.js', ['src/engine.mjs', 'text/javascript; charset=utf-8']],
  ['/api/snapshot', ['data/growth-os-pr-175.json', 'application/json; charset=utf-8']],
  ['/api/demo', ['data/synthetic-demo.json', 'application/json; charset=utf-8']],
]);
export function makeServer() {
  return createServer(async (req, res) => {
    const send = (status, type, body) => {
      res.writeHead(status, {
        'Content-Type': type, 'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
        'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'",
        'Referrer-Policy': 'no-referrer',
      });
      res.end(body);
    };
    if (req.method !== 'GET') return send(405, 'text/plain', 'Yalnız GET destekleniyor.');
    if (!/^(127\.0\.0\.1|localhost)(:\d+)?$/.test(req.headers.host ?? '')) return send(403, 'text/plain', 'Yalnız yerel erişim.');
    if (req.url === '/api/report') {
      try {
        const s = JSON.parse(await readFile(resolve(root, 'data/growth-os-pr-175.json'), 'utf8'));
        return send(200, 'application/json; charset=utf-8', JSON.stringify(evaluateSnapshot(s)));
      } catch { return send(500, 'text/plain', 'Kayıt değerlendirilemedi.'); }
    }
    const route = routes.get(req.url);
    if (!route) return send(404, 'text/plain', 'Bulunamadı.');
    try { send(200, route[1], await readFile(resolve(root, route[0]))); }
    catch { send(500, 'text/plain', 'Dosya okunamadı.'); }
  });
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const server = makeServer();
  server.on('error', (e) => { console.error(e.code === 'EADDRINUSE' ? '4317 portu kullanımda.' : 'Yerel sunucu başlatılamadı.'); process.exitCode = 1; });
  server.listen(4317, '127.0.0.1', () => console.log('TaskProof: http://127.0.0.1:4317'));
}
