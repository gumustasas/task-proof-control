# Çalışma durumu

22 Ekim 2026. Yetkili repo: https://github.com/gumustasas/task-proof-control
Kullanıcı görev sırası, kod kontrolü, PR, CI ve başarılı kontrolden sonra squash merge akışını yetkilendirdi. Codex devam ediyor. Kaynak Growth OS reposu salt okunur.

## Birleşen işler
- T-001/T-002: motor, yerel panel, gerçek snapshot ve ayrı sentetik demo. PR #1.
- T-003: 16/16 test ve altı Chromium senaryosu. PR #2 squash: 1c0602e1f317ce122eb80ce850d514c1c5653eb1. Koşu 39803038748.
- T-004: GitHub salt okuma, PR/head/check/run/job, bounded requests ve aynı-origin endpoint. PR #3 squash: 195686eebb4d6d9d977ecaa418dbe0b41144fa11. Koşu 39803768215: 27/27 test, yedi Chromium ve canlı salt okuma geçti.

## Güncel sonuç ve açık işler
T-005 PR #4 squash: a8c0b5989a18712d79e2797922bc760e1b943ad8. CI 39804912250: 38/38, yedi Chromium ve canlı GitHub geçti. Artifact baytları operatör importudur; kaynağı kriptografik olarak doğrulanmaz.
T-006 PR #5 squash: f19be0b39d39ebfb995bd44d9fe31bd651a8b571. Head 038cf349403bfe898cb3ad28f9c11756db38b304, run 39806257000 / job 119920156618: 42/42, sıfır skip/failure; yedi Chromium, canlı GitHub ve altı gerçek Docker denemesi geçti. Docker denemeleri exact-commit motor testleri, izolasyon/cgroup, bilinen failure, timeout, çıktı ve dosya limitini kapsar. Loglar okundu. Runner yalnız dar offline Node profilidir; genel çok kiracılı sandbox iddiası yok.
T-007 ön koşul engeli: Growth OS #175 preview URL/deployment SHA, ayrı test DB kararı, yalnız Preview bayrağı ve test oturumu hazırlanmalı. Kaynak PR kontrol listesi okundu; Growth OS env/DB/deployment değiştirilmedi. docs/preview-plan.md somut hazırlık ve sekiz atomik senaryoyu içerir. Browser runner henüz kaynak preview üzerinde uygulanmadı.
T-008 ön ölçüm hazır: üç seçilmiş TaskProof UI davranışı verified, beş Growth OS kriteri insufficient. CI loglarından operatör aktarımı, kimlik/byte attestation yok. İnsan inceleme süresi ve zaman kazancı ölçülmedi; tam fayda deneyi açık. docs/pilot.md ve pilot-results.json sınırları içerir.
Hazırlık/ön ölçüm PR #6 kapsamında kaydedildi. Head 5f60626fa4a5d32a2811aae57d347da2d372c238 için run 39807275638 / job 119923737530: 42/42, yedi Chromium, Docker, canlı GitHub ve pilot beklentileri geçti; loglar okundu. Bu belge kontrol sonucunu kaydeder; daha sonraki head ve squash SHA için GitHub yetkilidir. PR #6 sonrasında bağımlılığı hazır yeni kod görevi yok: T-007 dış ön koşulları çözülünce bu plandan devam et. Kaynak projeye yazmadan önce kapsam ve test ortamı belirlenmeli.

PR #6 son kod incelemesi: runner, hiç başlatılmayan created container varsayılan exitCode=0 değerini başarı kabul etmeyecek şekilde düzeltildi. Gerçek exited state ve başarılı attach gerekir; regresyon testi eklendi. Yerelde 42 başarı ve bir EACCES skip; son hosted head için 43 test beklenir. Sonuç ve squash SHA GitHub üzerinde kontrol edilir.

## Çalıştırma
Node.js >=22; `npm.cmd test`, `npm.cmd start`; panel http://127.0.0.1:4317.
Runtime bağımlılıksız. Playwright 1.56.1 yalnız CI/geliştirme test aracı. Vercel, Neon, ücretli model ve internet deployment yok. Opsiyonel GitHub token yalnız ortam değişkeninde; public repo anahtarsız okunabilir.

## Kanıt ve sınırlar
Growth OS #175 referans SHA a6fcd3057b067d40fe19cfbe0a661b09c6ec6e08: beş kriterin tümü kanıt yetersiz. Genel CI ve kaynak test tanımı davranış sonucu değildir. Bu görev kapsamında Growth OS değiştirilmedi.
Yerel ortam HTTP bağlantısını EACCES ile engelliyor; CI gerçek HTTP ve Chromium testlerini skip olmadan çalıştırır. Docker CLI var, daemon yerelde kapalı. `gh` auth geçersiz; uzak yazımlar GitHub connector üzerinden. Kimlik bilgisi çıktılanmaz.

## Git devamlılığı
Yerel geçmiş uzak başlangıçtan bağımsızdır; force push yapma. Uzak main üzerinden görev dalı aç; gerçek PR head SHA için CI sonuçlarını kontrol et. Yerel HEAD yalnız checkpoint'tir. Güncel uzak main/PR durumunu GitHub'dan doğrula; bu dosyadaki CI bekleniyor kaydı sonuç gelince güncellenmelidir.
