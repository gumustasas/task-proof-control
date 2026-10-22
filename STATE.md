# Çalışma durumu

22 Ekim 2026. Yetkili repo: https://github.com/gumustasas/task-proof-control
Kullanıcı görev sırası, kod kontrolü, PR, CI ve başarılı kontrolden sonra squash merge akışını yetkilendirdi. Codex devam ediyor. Kaynak Growth OS reposu salt okunur.

## Birleşen işler
- T-001/T-002: motor, yerel panel, gerçek snapshot ve ayrı sentetik demo. PR #1.
- T-003: 16/16 test ve altı Chromium senaryosu. PR #2 squash: 1c0602e1f317ce122eb80ce850d514c1c5653eb1. Koşu 39803038748.
- T-004: GitHub salt okuma, PR/head/check/run/job, bounded requests ve aynı-origin endpoint. PR #3 squash: 195686eebb4d6d9d977ecaa418dbe0b41144fa11. Koşu 39803768215: 27/27 test, yedi Chromium ve canlı salt okuma geçti.

## Aktif iş
T-005: incelenen senaryo JSON importu. Atomik kriter eşleme, repo/PR/SHA/run/attempt kontrolü, eski denemeyi reddetme, skipped/pending ve failure koruması hazır. CLI çıktısı panelde import edilebilir snapshot. Yerel sonuç: 37 geçti, 1 loopback EACCES nedeniyle atlandı; hosted CI henüz bekleniyor. Dosya baytlarının kaynağı otomatik doğrulanmaz; operatör importu açıkça etiketlenir.
Sonraki: T-005 PR/CI/squash, sonra T-006 izole runner. T-007 kaynak preview/test DB yetkisi gerektirir; henüz yapılandırılmadı. T-008 gerçek insan kontrol süresi ölçülmeden kazanç iddia edilmez.

## Çalıştırma
Node.js >=22; `npm.cmd test`, `npm.cmd start`; panel http://127.0.0.1:4317.
Runtime bağımlılıksız. Playwright 1.56.1 yalnız CI/geliştirme test aracı. Vercel, Neon, ücretli model ve internet deployment yok. Opsiyonel GitHub token yalnız ortam değişkeninde; public repo anahtarsız okunabilir.

## Kanıt ve sınırlar
Growth OS #175 referans SHA a6fcd3057b067d40fe19cfbe0a661b09c6ec6e08: beş kriterin tümü kanıt yetersiz. Genel CI ve kaynak test tanımı davranış sonucu değildir. Bu görev kapsamında Growth OS değiştirilmedi.
Yerel ortam HTTP bağlantısını EACCES ile engelliyor; CI gerçek HTTP ve Chromium testlerini skip olmadan çalıştırır. Docker CLI var, daemon yerelde kapalı. `gh` auth geçersiz; uzak yazımlar GitHub connector üzerinden. Kimlik bilgisi çıktılanmaz.

## Git devamlılığı
Yerel geçmiş uzak başlangıçtan bağımsızdır; force push yapma. Uzak main üzerinden görev dalı aç; gerçek PR head SHA için CI sonuçlarını kontrol et. Yerel HEAD yalnız checkpoint'tir. Güncel uzak main/PR durumunu GitHub'dan doğrula; bu dosyadaki CI bekleniyor kaydı sonuç gelince güncellenmelidir.
