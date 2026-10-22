import { validateSnapshot, evaluateSnapshot } from './engine.mjs';

export function attachScenarios(snapshot, observation, artifact, mapping) {
  validateSnapshot(snapshot);
  const fail=message=>{throw new Error(message);};
  if(observation?.kind!=='github-observation'||observation.repository!==snapshot.repository||observation.prNumber!==snapshot.prNumber||observation.headSha!==snapshot.headSha)fail('GitHub gözlemi görev/PR/commit ile eşleşmiyor.');
  if(artifact?.schemaVersion!==1||!['taskproof-ui-results','taskproof-scenario-results'].includes(artifact.kind)||artifact.repository!==snapshot.repository||artifact.commitSha!==snapshot.headSha)fail('Sonuç dosyası repo/commit ile eşleşmiyor.');
  if(!Array.isArray(artifact.results)||!artifact.results.length||artifact.results.length>1000||!Number.isFinite(Date.parse(artifact.observedAt)))fail('Sonuç listesi veya gözlem tarihi geçersiz.');
  const runId=String(artifact.runId??'');const attempt=artifact.runAttempt;
  if(!/^\d+$/.test(runId)||!Number.isInteger(attempt)||attempt<1)fail('Koşu kimliği ve deneme sayısı gerekli.');
  if(!Array.isArray(observation.observations))fail('GitHub koşu listesi geçersiz.');
  const matchingRuns=observation.observations.filter(x=>x.kind==='workflow'&&String(x.id)===runId&&x.commitSha===snapshot.headSha);
  if(matchingRuns.length!==1||matchingRuns[0].status!=='completed'||matchingRuns[0].attempt!==attempt)fail('GitHub koşusu tamamlanmamış veya denemesi güncel değil.');
  const run=matchingRuns[0];
  if(mapping?.schemaVersion!==1||mapping.repository!==snapshot.repository||mapping.prNumber!==snapshot.prNumber||mapping.commitSha!==snapshot.headSha||typeof mapping.reviewedBy!=='string'||!mapping.reviewedBy.trim()||!Number.isFinite(Date.parse(mapping.reviewedAt))||!Array.isArray(mapping.entries)||!mapping.entries.length)fail('İncelenmiş ve commit’e bağlı eşleme gerekli.');
  const safeUrl='https://github.com/'+snapshot.repository+'/actions/runs/'+runId;
  const results=new Map();
  for(const result of artifact.results){
    if(typeof result.caseName!=='string'||!result.caseName.trim()||results.has(result.caseName)||!['passed','failed','skipped','pending'].includes(result.outcome))fail('Senaryo adı/sonucu eksik veya tekrarlı.');
    results.set(result.caseName,result);
  }
  // A failed overall run cannot produce newly verified criteria from a selected
  // subset of passes. Failures remain attachable for diagnosis.
  if(run.conclusion!=='success'&&[...results.values()].some(x=>x.outcome==='passed'))fail('Başarısız koşudan seçilmiş başarılarla doğrulama yapılamaz.');
  const criterionIds=new Set(snapshot.criteria.map(x=>x.id));const seen=new Set();const evidence=[];
  for(const entry of mapping.entries){
    if(!criterionIds.has(entry.criterionId)||typeof entry.caseName!=='string'||!results.has(entry.caseName))fail('Eşleme bilinmeyen şart veya senaryo içeriyor.');
    if(seen.has(entry.criterionId))fail('Bir kriter birden fazla senaryoya bağlanamaz; atomik şartlara bölün.');
    seen.add(entry.criterionId);const result=results.get(entry.caseName);
    evidence.push({id:'scenario:'+runId+':'+attempt+':'+entry.criterionId,kind:artifact.kind==='taskproof-ui-results'?'browser-result':'test-result',outcome:result.outcome,commitSha:snapshot.headSha,criterionIds:[entry.criterionId],summary:'İncelenmiş senaryo eşlemesi: '+entry.caseName,provenance:'operator-import; GitHub run/attempt metadata matched; bytes not cryptographically verified',url:safeUrl,caseName:entry.caseName,runId,runAttempt:attempt,mappingReviewedBy:mapping.reviewedBy,observedAt:artifact.observedAt});
  }
  const newIds=new Set(evidence.map(e=>e.id));
  if(snapshot.evidence.some(e=>newIds.has(e.id)))fail('Bu koşu ve eşleme zaten eklenmiş.');
  // Previous attempts are deliberately retained: a later pass cannot erase a
  // failure. Supersession requires a separate explicit review model.
  const updated={...snapshot,evidence:[...snapshot.evidence,...evidence]};
  return {snapshot:updated,report:evaluateSnapshot(updated),trust:'operator-reviewed; GitHub metadata matched; imported bytes not authenticated'};
}
