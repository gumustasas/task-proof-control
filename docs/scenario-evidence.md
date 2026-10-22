# T-005 — İncelenmiş senaryo eşlemesi

```sh
node src/github-cli.mjs https://github.com/owner/repo/pull/1 > observation.json
node src/import-results.mjs snapshot.json observation.json results.json mapping.json > evaluated.json
node src/report.mjs evaluated.json
```

`evaluated.json` panelde içe aktarılabilir bir snapshot'tır. PowerShell 5.1'de dosyaları UTF-8 kaydetmek için yönlendirme yerine `| Out-File -Encoding utf8` kullanın; CLI BOM kabul eder.

Sonuç JSON'u `taskproof-ui-results` veya `taskproof-scenario-results` türündedir; schemaVersion=1, repository, commitSha, sayısal runId, runAttempt, observedAt ve results[{caseName,outcome}] zorunlu. UI workflow'u bu alanları artifact'a kaydeder. GitHub observation T-004'ten gelir. Dosyalar en fazla 2 MB; kod yürütülmez.

Eşleme: schemaVersion=1, repository, prNumber, commitSha, reviewedBy, reviewedAt, entries[{criterionId,caseName}]. Her kriter tek atomik senaryoya bağlanır; bileşik gereksinimler ayrı kriterlere bölünür. İnceleme alanları yetkili kişinin beyanıdır, dijital imza değildir.

Örnek eşleme (yer tutucuları gerçek kayıtla değiştirin):
```json
{
  "schemaVersion": 1,
  "repository": "owner/repo",
  "prNumber": 1,
  "commitSha": "0000000000000000000000000000000000000000",
  "reviewedBy": "İnceleyen kişi",
  "reviewedAt": "2026-10-22T12:00:00Z",
  "entries": [{"criterionId": "AC-01", "caseName": "UI-01"}]
}
```

Repo/PR/SHA, koşu/attempt, koşunun completed olması kontrol edilir. Eski attempt reddedilir. Failed genel koşudan seçilmiş pass'ler doğrulama oluşturamaz. skipped/pending doğrulanmaz; eksik senaryoya eşleme reddedilir. Önceki deneme kanıtları silinmez; yeni pass eski failure'ı gizlemez. Ayrı bir supersession inceleme modeli eklenene kadar bu korumacı davranış sürer.

Güven sınırı: import edilen artifact baytları otomatik olarak GitHub'dan indirilmez ve kriptografik olarak doğrulanmaz. Çıktı bu sınırı açıkça taşır. Gerçeklik iddiası yapmak için dosya yetkili operatörce GitHub koşusundan alınmalı ve kaynak incelenmelidir. Bu sürüm otomatik artifact attestation veya genel JUnit/TAP ayrıştırma desteği iddia etmez.
