import { evaluateSnapshot, STATUSES } from '/engine.js';
let snapshot;
let report;
const $ = (id) => document.getElementById(id);
const names = { claim: 'PR açıklaması', source: 'Kaynak incelemesi', workflow: 'Genel GitHub kontrolü', 'test-result': 'Senaryo sonucu', 'browser-result': 'Tarayıcı sonucu' };
function element(tag, text, className) {
  const e = document.createElement(tag); if (text !== undefined) e.textContent = text;
  if (className) e.className = className; return e;
}
function render(s) {
  const next = evaluateSnapshot(s); snapshot = s; report = next;
  $('error').hidden = true;
  $('demo-banner').hidden = s.mode !== 'synthetic';
  $('repo').textContent = s.repository + ' / PR #' + s.prNumber;
  $('title').textContent = s.title;
  $('commit').textContent = 'Commit ' + s.headSha.slice(0, 12) + ' · Kayıt: ' + new Date(s.collectedAt).toLocaleString('tr-TR');
  $('verdict').textContent = next.allCriteriaVerified ? 'Tanımlı şartlar doğrulandı' : 'İnceleme tamamlanmadı';
  $('stats').replaceChildren(...Object.entries(STATUSES).map(([key, label]) => {
    const card = element('div', undefined, 'stat ' + key);
    card.append(element('strong', String(next.counts[key])), element('span', label)); return card;
  }));
  $('total').textContent = next.rows.length + ' şart';
  $('rows').replaceChildren(...next.rows.map((row, index) => {
    const box = element('article', undefined, 'row');
    const head = element('div', undefined, 'row-head');
    head.append(element('span', String(index + 1).padStart(2, '0'), 'number'), element('h3', row.title), element('span', row.label, 'badge ' + row.status));
    box.append(head, element('p', row.reason, 'reason'));
    const details = element('details'); details.append(element('summary', row.evidence.length + ' bağlı kanıtı incele'));
    if (!row.evidence.length) details.append(element('p', 'Henüz bağlı kanıt yok.'));
    for (const e of row.evidence) {
      const item = element('div', undefined, 'evidence');
      item.append(element('strong', names[e.kind]), element('p', e.summary));
      item.append(element('small', 'Sonuç: ' + e.outcome + ' · Commit: ' + e.commitSha.slice(0, 12) + ' · Kaynak: ' + e.provenance));
      if (e.caseName) item.append(element('p', 'Senaryo: ' + e.caseName));
      if (e.mappingReviewedBy) item.append(element('small', 'Eşlemeyi inceleyen: ' + e.mappingReviewedBy));
      if (e.url) { const a = element('a', 'Kaynağı aç ↗'); a.href = e.url; a.target = '_blank'; a.rel = 'noopener noreferrer'; item.append(a); }
      details.append(item);
    }
    box.append(details); return box;
  }));
  $('caveats').replaceChildren(...next.caveats.map((c) => element('li', c)));
}
function showError(e) { $('error').textContent = e.message || 'Kayıt yüklenemedi.'; $('error').hidden = false; }
async function load(url) {
  try { const r = await fetch(url); if (!r.ok) throw new Error('Kayıt yüklenemedi.'); render(await r.json()); }
  catch (e) { showError(e); }
}
$('snapshot').addEventListener('change', (e) => load(e.target.value === 'demo' ? '/api/demo' : '/api/snapshot'));
$('import').addEventListener('change', async (e) => {
  const file = e.target.files[0]; if (!file) return;
  try {
    if (file.size > 2_000_000) throw new Error('Kayıt en fazla 2 MB olabilir.');
    const payload = JSON.parse(await file.text());
    render(payload.snapshot ?? payload);
    let custom = $('snapshot').querySelector('[value="imported"]');
    if (!custom) { custom = element('option', 'İçe aktarılan kayıt'); custom.value = 'imported'; $('snapshot').append(custom); }
    $('snapshot').value = 'imported';
  } catch (err) { showError(err); }
  finally { e.target.value = ''; }
});
$('export').addEventListener('click', () => {
  if (!report) return;
  const blob = new Blob([JSON.stringify({ snapshot, report }, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob); const a = element('a'); a.href = url; a.download = 'taskproof-report.json'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
});
load('/api/snapshot');
