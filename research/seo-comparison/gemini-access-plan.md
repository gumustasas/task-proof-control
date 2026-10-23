# Gemini erişim kontrolü planı

23 Ekim 2026. Kullanıcı GEMINI_API_KEY repository secret kaydını eklediğini bildirdi. Değeri okunmaz; normal PR testlerine bağlanmaz.

1. Sabit Gemini model metadata endpoint'ine yalnız bir GET yapan küçük script. Üretim, prompt, retry ve fallback yok. Anahtar yalnız header'da; redirect reddedilir. Timeout ve yanıt boyutu sınırı uygulanır. Hata gövdesi/log/anahtar dışa verilmez.
2. Enjeksiyonla test: eksik secret, güvenli sabit istek, beklenmedik model cevabı, hata gövdesi sızıntısı, timeout ve büyük yanıt. Gerçek testlerde secret/ağ kullanılmaz.
3. Yalnız main dalından workflow_dispatch ile çalışabilen, contents:read izinli workflow. Secret yalnız tek kontrol adımında. Otomatik PR/push/schedule yok.
4. Yerel testler → PR/diff/CI kontrolü → squash. Sonra bir elle başlatılan erişim kontrolü. Araç dispatch sağlayamıyorsa kullanıcıya doğrudan workflow sayfası ve tek Run workflow adımı verilir.

Başarı yalnız metadata erişimidir. Ücretsiz hesap katmanı, kalan kota, üretim izni ve Türkçe kalite bu çağrıdan çıkmaz. Gemini üretim deneyi için AI Studio'daki Free Tier/kota ayrıca doğrulanmalı. Yeni ücretli çağrı yapılmaz. Sonuçlar keyPresent veya metadata_ok gibi sınırlı durumlar; credential/değer/loglanmış yanıt yok.
