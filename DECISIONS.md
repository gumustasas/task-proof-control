# Mimari karar günlüğü

## ADR-001 — Bağımsız proje
Kullanıcı ayrı repo/panel fikrini kabul etti. TaskProof çalışma adı; Growth OS'in içine kod eklenmez. İlk kaynak proje Growth OS #175.

22 Ekim güncellemesi: Kullanıcı gumustasas/task-proof-control reposunu açtı. Bu repo yetkili hedeftir; mevcut public görünürlüğü korunur. İlk aktarım feat/bootstrap dalına, kullanıcının başlangıç commit'i üzerine yapılır; main'e merge ayrı işlemdir.

## ADR-002 — Önce kanıt, sonra yorum
İlk sürüm ücretli AI ve model anahtarı kullanmaz. Deterministik kurallar olmadan LLM'in 'tamamlandı' demesi güvenilir bir ürün temeli değildir.

## ADR-003 — Snapshot önce
Mevcut GitHub okuma bağlantısı kaynak toplamak için kullanıldı. Yerel CLI auth geçersiz ve runtime adapter henüz yok. Bu nedenle ilk veri dosyası açıkça tarihli anlık görüntüdür; canlı bağlantı gibi gösterilmez.

## ADR-004 — Prototipte veritabanı ve bağımlılık yok
Node.js standart kütüphaneleri, JSON, tarayıcı JS. Bir PR üzerinde yaklaşımı denemek için yeterli. Çok kullanıcı ve kalıcı depolama ayrı karar gerektirir.

## ADR-005 — Başarısız sonuç öncelikli
Aynı commit/kriter için passed ve failed birlikteyse failed. Otomatik olarak son başarılı koşuyu seçip önceki hatayı gizleme yok. Flaky/yeniden koşu supersession modeli T-005'te açık biçimde tasarlanmalı.

## ADR-006 — Güven beyanı görünür
22 Ekim T-003: Playwright 1.56.1 yalnız sabitlenmiş CI/geliştirme test aracı olarak kullanılır. Uygulama hâlâ Node standart kütüphaneleriyle çalışır. Runtime bağımlılıksızlık şartı korunur; test araçları ayrı değerlendirilir.
İçe aktarılan kayıtlar kriptografik olarak doğrulanmış değildir. Eşlemeyi inceleyen adı bir imza değildir. Kullanıcı bu sınıra panelde erişebilmeli.

## ADR-007 — Dar ve bağımsız runner
T-006 ayrı CLI ve geçici Linux Docker host kullanır. Kaynak kod panel sunucusunda çalışmaz. İlk profil yalnız offline Node built-in testleridir; repo shell/npm hook/Dockerfile veya online dependency install kabul edilmez. Image ID, exact source commit ve limitler raporlanır. Container shared-kernel sınırı belgelenir. Kaynak stdout'u otomatik davranış kanıtına çevrilmez.

## ADR-008 — Ön ölçüm ve gerçek faydayı ayır
T-008'in iki gerçek PR'a bağlı ön kontrolü, seçilmiş UI kanıtı ile doğrudan kanıt eksikliğini ayırır. İnsan baseline, bilinen kod hatası ve kaynak preview doğrulaması eksikken tam fayda deneyi tamamlandı sayılmaz. Motorun yerel milisaniyesi insan zaman tasarrufu değildir. Ölçülmeyen değerler null kalır.

## ADR-009 — Araştırma bu repoda, uygulama denemesi Growth OS bağlamında

2026-10-23: Kullanıcı araç araştırması ve karşılaştırmanın Task reposunda yapılmasını kabul edip başlatılmasını istedi. research/ dosyaları mevcut TaskProof runtime'ından bağımsızdır. Growth OS'e entegrasyon, yeni panel veya yeni repo gerektirmez. Araçların ücretsiz koşulları resmî kaynak ve tarihle yazılır. Sentetik hazırlık, gerçek kullanıcı deneyi ve üretici iddiası karıştırılmaz. İlk sınırlandırılmış deney SEO bulgusundan Türkçe uygulanabilir öneridir; model/insan zamanı ve maliyet ölçülmeden kazanan seçilmez. Promptfoo aday ölçüm aracıdır; kurulu veya çalışır diye gösterilmez.
