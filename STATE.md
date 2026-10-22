# Çalışma durumu

22 Ekim 2026. Yetkili repo: https://github.com/gumustasas/task-proof-control
Kullanıcı görev sırası, kod kontrolü, PR, CI ve başarılı kontrolden sonra squash merge akışını yetkilendirdi. Codex devam ediyor. Kaynak Growth OS reposu salt okunur.

## Birleşen işler
- T-001/T-002: motor, yerel panel, gerçek snapshot ve ayrı sentetik demo. PR #1.
- T-003: 16/16 test ve altı Chromium senaryosu. PR #2 squash: 1c0602e1f317ce122eb80ce850d514c1c5653eb1. Koşu 39803038748.
- T-004: GitHub salt okuma, PR/head/check/run/job, bounded requests ve aynı-origin endpoint. PR #3 squash: 195686eebb4d6d9d977ecaa418dbe0b41144fa11. Koşu 39803768215: 27/27 test, yedi Chromium ve canlı salt okuma geçti.

## Aktif iş
T-005 PR #4 squash ile tamamlandı: a8c0b5989a18712d79e2797922bc760e1b943ad8. Head caaa8fc87c6f127f9afd1a7df1e32bb0b28a78db, CI 39804912250: 38/38 test, sıfır skip/failure; yedi Chromium senaryosu ve canlı GitHub okuması geçti. Artifact baytları operatör importudur; kaynağı kriptografik olarak doğrulanmaz.
T-006 kod hazır: ayrı Linux Docker runner, exact commit staging, ağsız, anahtar taşımayan kaynak limitli Node built-in test profili. Yerelde 41 geçti, bir HTTP EACCES skip; gerçek Docker CI denemesi henüz bekleniyor. Kod/CI kontrolü tamamlanınca PR squash, sonra T-007.
T-007 kaynak preview/test DB yetkisi gerektirir; henüz yapılandırılmadı. T-008 insan kontrol süresi ölçülmeden zaman kazancı iddia edilmez.

## Çalıştırma
Node.js >=22; `npm.cmd test`, `npm.cmd start`; panel http://127.0.0.1:4317.
Runtime bağımlılıksız. Playwright 1.56.1 yalnız CI/geliştirme test aracı. Vercel, Neon, ücretli model ve internet deployment yok. Opsiyonel GitHub token yalnız ortam değişkeninde; public repo anahtarsız okunabilir.

## Kanıt ve sınırlar
Growth OS #175 referans SHA a6fcd3057b067d40fe19cfbe0a661b09c6ec6e08: beş kriterin tümü kanıt yetersiz. Genel CI ve kaynak test tanımı davranış sonucu değildir. Bu görev kapsamında Growth OS değiştirilmedi.
Yerel ortam HTTP bağlantısını EACCES ile engelliyor; CI gerçek HTTP ve Chromium testlerini skip olmadan çalıştırır. Docker CLI var, daemon yerelde kapalı. `gh` auth geçersiz; uzak yazımlar GitHub connector üzerinden. Kimlik bilgisi çıktılanmaz.

## Git devamlılığı
Yerel geçmiş uzak başlangıçtan bağımsızdır; force push yapma. Uzak main üzerinden görev dalı aç; gerçek PR head SHA için CI sonuçlarını kontrol et. Yerel HEAD yalnız checkpoint'tir. Güncel uzak main/PR durumunu GitHub'dan doğrula; bu dosyadaki CI bekleniyor kaydı sonuç gelince güncellenmelidir.
