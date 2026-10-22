import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { evaluateSnapshot } from '../src/engine.mjs';
const original = JSON.parse(readFileSync(new URL('../data/synthetic-demo.json', import.meta.url)));
const sample = () => structuredClone(original);
test('dört durum birbirinden ayrılır', () => {
  const r = evaluateSnapshot(sample());
  assert.deepEqual(r.counts, { verified: 1, failed: 1, insufficient: 1, stale: 1 });
  assert.equal(r.allCriteriaVerified, false);
});
test('genel CI başarısı davranışı doğrulamaz', () => {
  const s = sample(); s.evidence = s.evidence.filter((e) => e.kind === 'workflow');
  assert.equal(evaluateSnapshot(s).counts.verified, 0);
});
test('test kaynak dosyası başarılı sonuç yerine geçmez', () => {
  const s = sample(); s.evidence = [{ id:'S',kind:'source',outcome:'passed',commitSha:s.headSha,criterionIds:['AC-01'],summary:'Test var',provenance:'source-inspection' }];
  assert.equal(evaluateSnapshot(s).rows[0].status, 'insufficient');
});
test('başarısız kanıt başarılı kanıtla gizlenmez', () => {
  const s = sample(); s.evidence.push({...s.evidence[0], id:'fail-copy',outcome:'failed'});
  assert.equal(evaluateSnapshot(s).rows[0].status, 'failed');
});
test('commit değişirse tüm eski kanıtlar geçersizleşir', () => {
  const s = sample(); s.headSha = 'c'.repeat(40);
  assert.equal(evaluateSnapshot(s).counts.stale, 4);
});
test('eski başarısız sonuç güncel başarıyı geçersiz kılmaz', () => {
  const s = sample(); s.evidence.push({...s.evidence[0], id:'old-failure',outcome:'failed',commitSha:'b'.repeat(40)});
  assert.equal(evaluateSnapshot(s).rows[0].status, 'verified');
});
test('güncel atlanmış test başarı sayılmaz', () => {
  const s = sample(); s.evidence[0].outcome = 'skipped';
  assert.equal(evaluateSnapshot(s).rows[0].status, 'insufficient');
});
test('inceleyen kişi olmadan senaryo sonucu reddedilir', () => {
  const s = sample(); delete s.evidence[0].mappingReviewedBy;
  assert.throws(() => evaluateSnapshot(s), /inceleyen/);
});
test('bilinmeyen kabul şartına eşleme reddedilir', () => {
  const s = sample(); s.evidence[0].criterionIds = ['UNKNOWN'];
  assert.throws(() => evaluateSnapshot(s), /bilinmeyen/);
});
test('tekrarlı kriter veya kanıt kimliği reddedilir', () => {
  const s = sample(); s.criteria.push({...s.criteria[0]});
  assert.throws(() => evaluateSnapshot(s), /tekrarlı/);
  const t = sample(); t.evidence.push({...t.evidence[0]});
  assert.throws(() => evaluateSnapshot(t), /kimliği/);
});
test('script URL ve kullanıcı bilgili URL reddedilir', () => {
  for (const url of ['javascript:alert(1)', 'https://secret@example.org/']) {
    const s = sample(); s.evidence[0].url = url;
    assert.throws(() => evaluateSnapshot(s), /HTTPS/);
  }
});
test('geçersiz commit ve tarih reddedilir', () => {
  const s = sample(); s.headSha = 'main'; assert.throws(() => evaluateSnapshot(s), /commit/);
  const t = sample(); t.collectedAt = 'yesterday'; assert.throws(() => evaluateSnapshot(t), /tarih/);
});
test('motor girdiyi değiştirmez', () => {
  const s = sample(); const before = JSON.stringify(s); evaluateSnapshot(s); assert.equal(JSON.stringify(s), before);
});
test('gerçek örnekte doğrulanmış davranış uydurulmaz', () => {
  const s = JSON.parse(readFileSync(new URL('../data/growth-os-pr-175.json', import.meta.url)));
  const r = evaluateSnapshot(s);
  assert.equal(r.mode, 'github-snapshot'); assert.equal(r.counts.verified, 0); assert.equal(r.counts.insufficient, 5);
});
