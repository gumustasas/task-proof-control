import test from 'node:test';
import assert from 'node:assert/strict';
import { attachScenarios } from '../src/scenarios.mjs';
const sha='a'.repeat(40),date='2026-10-22T12:00:00Z';
function fixture(){return [
  {schemaVersion:1,mode:'synthetic',repository:'example/demo',prNumber:1,headSha:sha,title:'Fixture',collectedAt:date,criteria:[{id:'A',title:'Filtre korunur',requiredLevel:'behavior'},{id:'B',title:'Temizleme çalışır',requiredLevel:'behavior'}],evidence:[]},
  {kind:'github-observation',repository:'example/demo',prNumber:1,headSha:sha,observations:[{kind:'workflow',id:10,commitSha:sha,status:'completed',conclusion:'success',attempt:1}]},
  {schemaVersion:1,kind:'taskproof-ui-results',repository:'example/demo',commitSha:sha,runId:'10',runAttempt:1,observedAt:date,results:[{caseName:'filter',outcome:'passed'},{caseName:'clear',outcome:'failed'}]},
  {schemaVersion:1,repository:'example/demo',prNumber:1,commitSha:sha,reviewedBy:'fixture reviewer',reviewedAt:date,entries:[{criterionId:'A',caseName:'filter'},{criterionId:'B',caseName:'clear'}]}
];}
test('incelenmiş senaryolar kriterleri tek tek doğrular; failure korunur',()=>{const r=attachScenarios(...fixture());assert.equal(r.report.counts.verified,1);assert.equal(r.report.counts.failed,1);assert.match(r.trust,/not authenticated/);});
test('yanlış repo veya commit reddedilir',()=>{for(const [index,key]of [[1,'headSha'],[2,'commitSha'],[3,'commitSha']]){const f=fixture();f[index][key]='b'.repeat(40);assert.throws(()=>attachScenarios(...f));}});
test('yanlış PR ve başka koşu reddedilir',()=>{let f=fixture();f[1].prNumber=2;assert.throws(()=>attachScenarios(...f));f=fixture();f[2].runId='11';assert.throws(()=>attachScenarios(...f));});
test('eşleme incelemesi ve tarih olmadan sonuç eklenmez',()=>{for(const key of ['reviewedBy','reviewedAt']){const f=fixture();delete f[3][key];assert.throws(()=>attachScenarios(...f));}});
test('skipped/pending sonuçlar kriteri doğrulamaz',()=>{for(const outcome of ['skipped','pending']){const f=fixture();f[2].results[0].outcome=outcome;assert.equal(attachScenarios(...f).report.rows[0].status,'insufficient');}});
test('tekrarlı case ve bilinmeyen eşleme reddedilir',()=>{let f=fixture();f[2].results.push({...f[2].results[0]});assert.throws(()=>attachScenarios(...f));f=fixture();f[3].entries[0].caseName='missing';assert.throws(()=>attachScenarios(...f));});
test('bileşik kriter yerine atomik eşleme gerekir',()=>{const f=fixture();f[3].entries.push({criterionId:'A',caseName:'clear'});assert.throws(()=>attachScenarios(...f));});
test('başarısız genel koşudan seçilmiş başarı kabul edilmez',()=>{const f=fixture();f[1].observations[0].conclusion='failure';assert.throws(()=>attachScenarios(...f));});
test('yeniden koşu eski deneme artifactını güncel saymaz',()=>{const f=fixture();f[1].observations[0].attempt=2;assert.throws(()=>attachScenarios(...f));});
test('aynı sonuç iki kez eklenmez ve girdi mutasyona uğramaz',()=>{const f=fixture();const old=JSON.stringify(f);const r=attachScenarios(...f);assert.equal(JSON.stringify(f),old);assert.throws(()=>attachScenarios(r.snapshot,...f.slice(1)));});

test('yeni deneme eski failure sonucunu gizleyemez',()=>{
  const f=fixture();
  const first=attachScenarios(...f);
  f[1].observations[0].attempt=2;
  f[2].runAttempt=2;
  f[2].results[1].outcome='passed';
  const second=attachScenarios(first.snapshot,...f.slice(1));
  assert.equal(second.report.counts.failed,1);
  assert.equal(second.snapshot.evidence.length,4);
});
