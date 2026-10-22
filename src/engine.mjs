export const STATUSES = Object.freeze({
  verified: 'Doğrulandı', failed: 'Başarısız', insufficient: 'Kanıt yetersiz', stale: 'Kanıt eski',
});
const SHA = /^[a-f0-9]{40}$/;
const kinds = new Set(['claim', 'source', 'workflow', 'test-result', 'browser-result']);
const outcomes = new Set(['passed', 'failed', 'pending', 'skipped']);
const levels = new Set(['behavior', 'source']);
const isText = (v) => typeof v === 'string' && v.trim().length > 0;
const fail = (message) => { throw new Error(message); };

export function validateSnapshot(s) {
  if (!s || typeof s !== 'object' || s.schemaVersion !== 1) fail('Desteklenmeyen kayıt sürümü.');
  if (!isText(s.repository) || !/^[\w.-]+\/[\w.-]+$/.test(s.repository)) fail('Geçersiz repo.');
  if (!Number.isInteger(s.prNumber) || s.prNumber < 1 || !SHA.test(s.headSha)) fail('PR veya commit geçersiz.');
  if (!isText(s.title) || !['github-snapshot', 'synthetic'].includes(s.mode)) fail('Başlık veya veri türü eksik.');
  if (!isText(s.collectedAt) || !Number.isFinite(Date.parse(s.collectedAt))) fail('Geçersiz toplama tarihi.');
  if (!Array.isArray(s.criteria) || !s.criteria.length || s.criteria.length > 100) fail('1–100 kabul şartı gerekli.');
  if (!Array.isArray(s.evidence) || s.evidence.length > 1000) fail('En fazla 1000 kanıt kullanılabilir.');
  const ids = new Set();
  for (const c of s.criteria) {
    if (!isText(c.id) || ids.has(c.id) || !isText(c.title) || !levels.has(c.requiredLevel)) fail('Kabul şartı eksik veya tekrarlı.');
    ids.add(c.id);
  }
  const evidenceIds = new Set();
  for (const e of s.evidence) {
    if (!isText(e.id) || evidenceIds.has(e.id) || !kinds.has(e.kind) || !outcomes.has(e.outcome)) fail('Kanıt türü, kimliği veya sonucu geçersiz.');
    evidenceIds.add(e.id);
    if (!SHA.test(e.commitSha) || !isText(e.summary)) fail('Kanıt commit’i veya özeti eksik.');
    if (!Array.isArray(e.criterionIds) || e.criterionIds.some((id) => !ids.has(id))) fail('Kanıt bilinmeyen kabul şartına bağlı.');
    if (new Set(e.criterionIds).size !== e.criterionIds.length) fail('Tekrarlı kanıt bağlantısı.');
    if (!isText(e.provenance)) fail('Kanıt kaynağı belirtilmeli.');
    if (e.url !== undefined) {
      let u; try { u = new URL(e.url); } catch { fail('Geçersiz kanıt adresi.'); }
      if (u.protocol !== 'https:' || u.username || u.password) fail('Kanıt bağlantısı kimlik bilgisi içermeyen HTTPS olmalı.');
    }
    if (['test-result', 'browser-result'].includes(e.kind)) {
      if (!isText(e.caseName) || !isText(e.runId) || !isText(e.mappingReviewedBy) || !isText(e.observedAt) || !Number.isFinite(Date.parse(e.observedAt))) {
        fail('Davranış kanıtında senaryo, koşu, gözlem tarihi ve eşlemeyi inceleyen kişi gerekli.');
      }
    }
  }
  return s;
}

export function evaluateSnapshot(snapshot) {
  const s = validateSnapshot(snapshot);
  const rows = s.criteria.map((c) => {
    const evidence = s.evidence.filter((e) => e.criterionIds.includes(c.id));
    const current = evidence.filter((e) => e.commitSha === s.headSha);
    const acceptable = current.filter((e) => c.requiredLevel === 'source'
      ? e.kind === 'source'
      : ['test-result', 'browser-result'].includes(e.kind));
    let status = 'insufficient';
    let reason = 'Bu şart için güncel ve doğrudan sonuç kanıtı yok.';
    if (acceptable.some((e) => e.outcome === 'failed')) {
      status = 'failed'; reason = 'Aynı commit’te doğrudan başarısız sonuç var; başarılı sonuç bunu gizlemez.';
    } else if (acceptable.some((e) => e.outcome === 'passed')) {
      status = 'verified'; reason = c.requiredLevel === 'source'
        ? 'Yalnız kaynak düzeyindeki şart karşılandı; davranış testi anlamına gelmez.'
        : 'İncelenmiş eşlemeye sahip doğrudan senaryo sonucu bu commit için başarılı.';
    } else if (!current.length && evidence.length) {
      status = 'stale'; reason = 'Bağlı kanıtların tümü başka commit’e ait.';
    }
    return { ...c, status, label: STATUSES[status], reason, evidence, currentEvidenceCount: current.length };
  });
  const counts = Object.fromEntries(Object.keys(STATUSES).map((k) => [k, rows.filter((r) => r.status === k).length]));
  return {
    repository: s.repository, prNumber: s.prNumber, headSha: s.headSha, title: s.title,
    mode: s.mode, collectedAt: s.collectedAt, rows, counts,
    allCriteriaVerified: counts.verified === rows.length,
    caveats: [
      'Bu kayıt anlık görüntüdür; GitHub’ın güncel durumunu otomatik izlemez.',
      'İçe aktarılan kanıtların gerçekliği kriptografik olarak doğrulanmaz; kaynak ve eşleme operatöre aittir.',
      'Genel workflow başarısı veya test dosyasının varlığı davranış doğrulaması sayılmaz.',
      'Tüm şartların doğrulanması hatasız yazılım veya birleştirme onayı anlamına gelmez.',
    ],
  };
}
