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
İçe aktarılan kayıtlar kriptografik olarak doğrulanmış değildir. Eşlemeyi inceleyen adı bir imza değildir. Kullanıcı bu sınıra panelde erişebilmeli.
