# Gemini erişim kontrolü planı

23 Ekim 2026. Kullanıcı GEMINI_API_KEY repository secret kaydını eklediğini bildirdi. Değeri okunmaz; normal PR testlerine bağlanmaz.

1. Sabit Gemini model metadata endpoint'ine yalnız bir GET yapan küçük script. Üretim, prompt, retry ve fallback yok. Anahtar yalnız header'da; redirect reddedilir. Timeout ve yanıt boyutu sınırı uygulanır. Hata gövdesi/log/anahtar dışa verilmez.
2. Enjeksiyonla test: eksik secret, güvenli sabit istek, beklenmedik model cevabı, hata gövdesi sızıntısı, timeout ve büyük yanıt. Gerçek testlerde secret/ağ kullanılmaz.
3. Yalnız main dalından workflow_dispatch ile çalışabilen, contents:read izinli workflow. Secret yalnız tek kontrol adımında. Otomatik PR/push/schedule yok.
4. Yerel testler → PR/diff/CI kontrolü → squash. Sonra bir elle başlatılan erişim kontrolü. Araç dispatch sağlayamıyorsa kullanıcıya doğrudan workflow sayfası ve tek Run workflow adımı verilir.

Başarı yalnız metadata erişimidir. Ücretsiz hesap katmanı, kalan kota, üretim izni ve Türkçe kalite bu çağrıdan çıkmaz. Gemini üretim deneyi için AI Studio'daki Free Tier/kota ayrıca doğrulanmalı. Yeni ücretli çağrı yapılmaz. Sonuçlar keyPresent veya metadata_ok gibi sınırlı durumlar; credential/değer/loglanmış yanıt yok.

CI takip düzeltmesi: PR #10 ve önceki kontrol kayıtlarında Ubuntu apt font indirmeleri 10 dakika sınırına takılmıştı; #11'in ilk koşusu da aynı kurulumda bekledi. ubuntu-24.04 runner görüntüsü zaten Chrome/Chromium/Firefox içeriyor (actions/runner-images resmî README kontrol edildi). Mevcut workflow yalnız Chromium indirmeye geçirildi; npm, Docker, canlı GitHub ve yedi tarayıcı kabul testi aynen korunur. Eksik kütüphane varsa gerçek tarayıcı testi başarısız olur ve merge yapılmaz. Bu bir test atlama değildir.
