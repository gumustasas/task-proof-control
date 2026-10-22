# T-007 — Growth OS önizleme planı ve açık ön koşullar

Durum: hazırlık tamam; kaynak preview testleri çalıştırılmadı.
Hedef: gumustasas/buzsu-growth-os #175, a6fcd3057b067d40fe19cfbe0a661b09c6ec6e08.

22 Ekim salt okuma kontrolünde PR head aynıydı ve PR birleşmemişti. Kaynak PR'ın `drafts/reports/site-content/2026-10-21-onizleme-dogrulama-listesi.md` dosyası, Preview bayrağı ve veritabanı kararını açıkça hazırlık ön koşulu olarak tutuyor. Production DB'ye tablo eklenebileceğini belirtiyor. TaskProof CI testlerini bu kaynak önizlemenin doğrulaması saymayız.

## Çalıştırmadan önce gerekenler

1. Test URL'si ve deployment metadata'sında tam hedef SHA. Yalnız URL/PR açıklaması commit kanıtı değildir; deployment SHA eşleşmezse test başlamaz.
2. Production'dan ayrı test veritabanı seçimi; önerilen seçenek ayrı Neon test dalıdır. Connection string rapora veya sohbete alınmaz. Kapsam burada hesap/proje oluşturmaya veya env değiştirmeye genişletilmedi.
3. Yalnız Preview için `ENABLE_SITE_CONTENT_INVENTORY=true` ve bu konfigürasyonun hedef deployment'a uygulanması. Production veya mevcut DB'ye dokunulmaz.
4. Yetkili test oturumu ve ayrı DB üzerinde tarama/oluşturma/yazma senaryolarının kapsamı. SSO/koruma atlatılmaz; production oturumu kopyalanmaz.
5. Browser runner profili: ayrı geçici browser context, allowlist preview origin, aynı commit etiketi, senaryo başına timeout ve ekran görüntüsü/log. T-006'nın ağsız Node profili internet preview tarayıcısı değildir; ağ izni yalnız test profiline açık ve hedefle sınırlı olmalı.

AGENTS.md madde 7, kaynak projelerde env/secrets/deployment değişikliğini bu repo kapsamı dışında tutar. Kullanıcının TaskProof PR/CI/squash yetkisi kaynak Growth OS hazırlığını otomatik tamamlamaz. Bu nedenle mevcut çalışma kaynak projede yalnız okuma yaptı.

## Atomik senaryolar

| Kimlik | Davranış | Yazma ihtiyacı | Beklenen doğrudan kanıt |
|---|---|---|---|
| PV-01 | Oturumsuz istek belirlenen giriş akışına gider | Yok | Son URL/durum, oturum verisi içermeyen ekran |
| PV-02 | Bayrak kapalı ayrı test deployment'ta sayfa 404 döner | Yok | HTTP durum ve sayfa |
| PV-03 | Bayrak kapalıyken menü bağlantısı görünmez | Yok | Menü assertion |
| PV-04 | Bayrak açık sayfa yüklenince tarama kendiliğinden başlamaz | İzole DB gözlemi gerekir | Önce/sonra çalışma sayısı |
| PV-05 | Elle yenileme tek çalışma oluşturur ve hızlı yanıt verir | Ayrı DB | İstek süresi, run ID, UI durumu |
| PV-06 | Keşif kesilip devam edince ilerleme gerilemez | Ayrı DB | Önce/sonra adım sayısı ve run ID |
| PV-07 | Okunamayan kapsam dışı kategori başarısız olur, adı görünür | Kontrollü hata fixture + ayrı DB | Failed run ve görünür kategori |
| PV-08 | Türü bilinmeyen okunamayan URL varken tam gösterilmez | Kontrollü fixture + ayrı DB | Tür durumu ve neden |

Bayrak kapalı test için production yerine ayrı test konfigürasyonu kullanılmalı. Hata senaryoları canlı siteyi bozarak üretilmez; kontrollü fixture gerekir. Temizlik yalnız test run'ının oluşturduğu kayıtlarla sınırlandırılır ve run ID ile kaydedilir.

Her sonuç: repo, PR, tam SHA, deployment ID, caseName, runId/attempt, observedAt, sonuç, kanıt URL'si, incelenen atomik eşleme. Giriş/DB/commit engeli varsa skipped/pending; verified olmaz. T-005 provenance sınırı korunur.

Kaynaklar: [PR #175](https://github.com/gumustasas/buzsu-growth-os/pull/175), [commit'e bağlı kontrol listesi](https://github.com/gumustasas/buzsu-growth-os/blob/a6fcd3057b067d40fe19cfbe0a661b09c6ec6e08/drafts/reports/site-content/2026-10-21-onizleme-dogrulama-listesi.md).
