# Güncel çalışma durumu — 23 Ekim 2026

## Son checkpoint — Gemini metadata erişimi
Kullanıcı GEMINI_API_KEY repository secret eklediğini bildirdi. Değeri okunmadı. T-011: yalnız main workflow_dispatch içinde tek metadata GET yapacak script/workflow hazırlandı. Üretim çağrısı, prompt, retry ve fallback yok. Free Tier/kota doğrulanmadı; T-010 A/B açık. Yerelde 55/55 test, sıfır skip/failure; node --check ve git diff --check başarılı. Kullanım research/seo-comparison/gemini-access.md.
GitHub connector workflow dispatch sunmuyor ve yerel gh auth doğrulanmadı; canlı kontrolü kullanıcı workflow sayfasından bir kez başlatmalı. Çalıştırılmamış kontrol başarılı sayılmaz. PR/CI/merge sonucu GitHub'da yetkilidir. Uzak başlangıç main a64be9e11440b722b5fe20b4b2dbd108e0ce0cb7; yerel geçmiş bağımsız, force push yok.

## Son checkpoint — T-010 offline aktarım
Plan research/seo-comparison/implementation-plan.md içinde koddan önce kaydedildi. src/seo-prepare.mjs ve npm seo:prepare, sentetik/reported veri için Promptfoo test JSON'u, ortak istem, hash manifesti, reviewer-only ve boş A/B şablonu üretir. Yeni değerlendirme/model yürütme motoru değildir. Yeni bağımlılık veya ağ isteği yok.
Growth OS main db0c79565acd0f9a350aac387a07b9c6f16708b4 içindeki tarihli rapordan 10 reported vaka türetildi. Güncel sayfa/GSC doğrulaması veya eski model çıktısıyla eşleşen baseline değildir. Mevcut judge görevi JSON yeterlilik değerlendirmesidir; yeni öneri istemi farklıdır.
Yerelde 49/49 test, sıfır skip/failure; sentetik ve reported CLI hazırlıkları 10'ar vaka ile not_run döndü. runtime/ çıktıları gitignore'da. Sonraki adım Gemini ücretsiz erişimi/kotası ve aynı istemde iki sabit model çıktısı; sonra kör insan değerlendirmesi. Ortamda Gemini erişimi yok; kullanılabilir browser aracı bulunmadı. Hiçbir model çağrısı/ücretli işlem yapılmadı. T-010 canlı A/B tamamlanmadı.
PR/CI/squash sonucu GitHub üzerinde kontrol edilir. Önceki PR #9 squash 272ea021f4e1dc125d1ee053b86026ff1ac1e480; yeni uzak dal bunun üzerinden kurulacak. Yerel geçmiş bağımsız; force push yok.

## Önceki araştırma hazırlığı

Kullanıcı araştırmanın task-proof-control reposunda tutulmasını, Growth OS'in gerçek SEO denemesi bağlamı olmasını seçti. Yeni öncelik T-009/T-010'dur; TaskProof panelini büyütme görevi değildir.

## Bu teslim
- Resmî kaynaklarla ücretsiz AI araçları kısa listesi: research/2026-10-23-free-ai-tools.md.
- SEO önerisi için ortak istem, kör puanlama, süre/maliyet ve insan düzeltme ölçümü: research/seo-comparison/protocol.md.
- Açıkça sentetik 10 hazırlık vakası; sonuç CSV'si boş. Model çalıştırılmadı.
- Kullanılacak araç ile yeni ürün hipotezi ayrı kaydedildi: research/opportunities.md.
- Yeni servis, dependency, credential, model çağrısı, panel veya Growth OS değişikliği yok.
- Yerel checkout uzak main'den eski checkpoint geçmişine sahipti. Güncel uzak main 3b60513c2eb4c3feaffddecae6456606a43b9ef8 üzerinden yeni dal açılacak; eski yerel geçmiş force-push edilmeyecek.

## Açık madde ve sıradaki iş
T-010: paylaşılması uygun gerçek SEO girdileri, eşleşen baseline, güncel OpenAI model/istem kaydı ve ücretsiz adayın hesap kotası gerekir. Bunlar hazırlanmadan gerçek model kıyası veya zaman kazancı iddiası yok.
T-007/T-008 açık kalır; bu araştırma onları kapatmaz.
Bu oturumun GitHub okumasında Growth OS #175 ve #177–180 artık main'e birleştirilmişti; aşağıdaki "#175 açık/source main değişmedi" dönem notları bu nedenle güncel repo durumu değildir. Kullanıcının diğer çalışmalarını bu araştırmaya mal etme.
Yerelde npm.cmd test: 43/43 başarılı, sıfır skip/failure. JSON: 10 benzersiz sentetik vaka; CSV: yalnız başlık. git diff --check temiz. Runtime/UI değişmedi. Uzak PR/CI/merge sonucu GitHub'dan doğrulanır.

---

# Önceki TaskProof kayıtları — tarihsel

# Çalışma durumu

22 Ekim 2026. Yetkili repo: https://github.com/gumustasas/task-proof-control
Kullanıcı görev sırası, kod kontrolü, PR, CI ve başarılı kontrolden sonra squash merge akışını yetkilendirdi. Codex devam ediyor. Growth OS kodu/main/production değişmez; kullanıcının sonraki test ortamı hazırlığı talebi önizleme/ayrı test DB değişikliklerini ayrıca yetkilendirdi.

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

## 22 Ekim — Growth OS test ortamı hazırlandı

Önceki T-007 altyapı engeli bu kayıtla güncellendi. Ayrı Neon dalında boş taskproof_preview_175 DB ve kısıtlı taskproof_app_175 rolü hazır; 9 tablo, sıfır auth/crawl. Dal özel 12 Vercel preview ayarı uygulandı. Son deployment dpl_2FmyHTNAkArQ8c2vPLTAPygtUeaj READY, kaynak SHA a6fcd3057b067d40fe19cfbe0a661b09c6ec6e08. /site-icerik oturumsuz erişimi ilk admin kurulumuna yönlendi. Yeni admin kimlik bilgilerini kullanıcı belirlemeli; browser handoff gerekir. Sonraki iş: admin oturumu sonrası T-007 davranış senaryoları. Tam T-007 ve T-008 hâlâ açık. Ayrıntı: docs/test-environment-2026-10-22.md. Kaynak kod/main/production değiştirilmedi. Secret kaydı yok.

## Preview tarama başlatma düzeltmesi — güncel

Kullanıcı test adminini oluşturup giriş yaptığını bildirdi; test DB'de auth_records=2 ve crawl_runs=0 okundu. Kullanıcının görselindeki başlatma hatası origin allowlist kaynaklı olarak yeniden üretildi. Growth OS PR #176 yalnız claude/site-icerik-envanteri dalına squash edildi; source main/production değişmedi. Yeni head 1e70f0db8198fff1493e39d197fc1b9981250f33; deployment dpl_Hy62js3FVuckFjsx9s5jxRoDKqsS READY. CI 39825844316: 762/762 MCP, dashboard ve servis kontrolleri geçti. Platformun tam preview deployment/dal host'ları yalnız preview'da kabul edilir; wildcard veya request Host güveni yok. İlk admin bekleniyor notları tarihsel kaldı: admin mevcut. Yeni sabit dal adresinde oturumlu tarama başlatma yeniden doğrulaması açık; kullanıcı cihazındaki oturum bu tarayıcıyla paylaşılmaz. Güvenli giriş tamamlanmadı; test sonucu uydurulmadı. Eski immutable preview adresi eski kodu tutar. Ayrıntı docs/test-environment-2026-10-22.md son bölümü.
