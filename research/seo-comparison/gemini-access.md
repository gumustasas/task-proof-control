# GitHub üzerinden Gemini erişim kontrolü

Kullanıcı GEMINI_API_KEY kaydını repository Actions Secret olarak eklediğini bildirdi. Bu kayıt yerel bilgisayara aktarılmadı; değeri okunmadı. Mevcut normal PR/push kontrol workflow'u bu secret'ı kullanmaz.

[Gemini metadata access check](https://github.com/gumustasas/task-proof-control/actions/workflows/gemini-access.yml) sayfasında Run workflow → main → Run workflow. Yalnız elle ve main'den çalışır; push/PR/schedule tetikleyicisi yoktur. Secret yalnız metadata adımının env alanına bağlanır. Contents izni salt okumadır, checkout kimlik bilgisi kalıcı saklanmaz. Yeni dependency veya SDK yok.

Komut yalnız sabit gemini-3.1-flash-lite için models.get GET çağrısı yapar. Prompt göndermez, generateContent çağırmaz, yeniden deneme veya fallback yapmaz. Redirect reddedilir; timeout 15 saniye, yanıt sınırı 32 KiB. Hata gövdesi ve credential loglanmaz. Log yalnız status/model/httpStatus/generationRequested/freeTierVerified/remainingQuota ve varsa destek alanını içerir.

- metadata_ok: model metadata'sı beklenen kimlikle okundu. Üretim yetkisi veya ücretsiz kota kanıtı değildir.
- secret_missing: workflow bu isimle anahtar alamadı. Yerel eksiklik GitHub'daki kaydın yokluğunu göstermez.
- http_error: yalnız HTTP durum kodu; hata gövdesi yazılmaz.
- timeout/request_failed/invalid_metadata: kontrol tamamlanamadı; başarılı erişim sayılmaz.

Her sonuçta generationRequested=false, freeTierVerified=false ve remainingQuota=null. Ücretsiz hesap katmanı ve kota, [AI Studio](https://aistudio.google.com/) üzerinde ayrıca doğrulanmalıdır. Model kalitesi, doğruluk ve süre kıyası henüz yapılmadı. Tam A/B için aynı istemde OpenAI baseline da hâlâ gerekir.

Resmî API sözleşmesi: https://ai.google.dev/api/models (23 Ekim 2026'da kontrol edildi). models.get metadata okur; istek gövdesi boştur. Fiyat/kota kaynakları: https://ai.google.dev/gemini-api/docs/pricing ve https://ai.google.dev/gemini-api/docs/rate-limits.

Bu oturumdaki GitHub bağlantısında workflow_dispatch aracı yok ve yerel gh oturumu doğrulanamadı. Bu nedenle workflow kurulunca kullanıcı yukarıdaki tek elle başlatma adımını yapmalı; asistan sonrasında koşuyu/logu okuyabilir. Henüz çalıştırılmamış workflow'a başarılı bağlantı denmez.
