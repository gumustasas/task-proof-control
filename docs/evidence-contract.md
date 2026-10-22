# Kanıt sözleşmesi v1

Tam örnek: `data/growth-os-pr-175.json`. Sentetik örnek: `data/synthetic-demo.json`.

## Zorunlu alanlar
- snapshot: schemaVersion=1, mode=github-snapshot|synthetic, repository, prNumber, headSha (40 hex), title, collectedAt, criteria[], evidence[].
- criterion: id (benzersiz), title, requiredLevel=behavior|source.
- evidence: id, kind, outcome, commitSha, criterionIds[], summary, provenance; URL varsa HTTPS ve credentials olmadan.
- kind=test-result|browser-result ise ayrıca caseName, runId, observedAt, mappingReviewedBy.
- outcome: passed|failed|pending|skipped. Sadece passed/failed karar tetikler.

## Ne kanıt sayılır?
| Tür | Kaynak düzeyindeki şart | Davranış şartı |
|---|---|---|
| claim | Hayır | Hayır |
| source | İncelenmiş source şartı için evet | Hayır |
| workflow | Hayır | Hayır |
| test-result | Hayır | Aynı SHA ve ilgili senaryo için evet |
| browser-result | Hayır | Aynı SHA ve ilgili senaryo için evet |

Birleştirilmiş bir şart birden fazla davranış içeriyorsa her davranışı ayrı kritere ayır; aksi halde tek dar testin tüm şartı doğrulaması riski vardır. İlk örnekte geniş kriterler özellikle kanıt yetersiz bırakılır; T-005 bunları atomik şartlara böler.

Bir örnek JSON'u elle passed yapmak gerçek test üretmez. v0.1 import operatör kontrollüdür; gerçeklik doğrulaması yoktur. Gelecekte adapter kaynağı, API URL'si ve head_sha kayıtları birlikte alınmalı. Kullanıcı metnini kod/komut olarak yürütme.
