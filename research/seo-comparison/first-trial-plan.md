# İlk tek vakalık Gemini denemesi

23 Ekim 2026. Kullanıcı Free Tier olduğunu açıkça doğruladı ve denemeyi başlatmamızı istedi. Bu, hesap ekranını bizim gördüğümüz anlamına gelmez. Metadata erişimi daha önce HTTP 200 ile geçti: run 39966873913, job 120458917201, commit ed4e394a11038c332e067140c377662e1e280338.

1. reported kümesinden R-atik-su vakası ve ortak SEO_PROMPT kullanılır; reviewer kontrolleri modele gönderilmez. Girdi rapor aktarımıdır, güncel sayfa/GSC gözlemi değildir.
2. Tek sabit Gemini modeline bir generateContent POST: aday=1, çıktı en çok 768 token, 45 saniye, 32 KiB yanıt sınırı, redirect/retry/fallback/grounding/tool yok. Kota veya HTTP hatasında dur. Yanıt, finishReason, model sürümü, token ve duvar saati kaydedilir; maliyet bilinmiyorsa null.
3. Secret yoksa veya Free Tier kullanıcı doğrulaması yoksa ağa çıkma. Hata gövdesini/secret'ı kaydetme; sonuçlarda olası tam key yansımasını redakte et. Testlerde sahte transport kullanılır.
4. PR/CI/diff incelemesi ve squash sonrası, yalnız ilk main push'una bağlı tek seferlik workflow çalışır. event.before tam başlangıç main SHA'sıyla ve run_attempt=1 ile sınırlandırılır; PR, schedule, manuel dispatch ve rerun üzerinden yeni üretim yok. Kaynak kod doğru commit'ten checkout edilir. Sonraki işler aynı dosyaya dokunsa da ikinci çağrı tetiklenmez.
5. Sonuç log ve artifact'ten okunur. Tek çıktı Türkçe/kanıta uygunluk açısından incelenir; aynı istemde OpenAI baseline yokken model kazananı veya zaman tasarrufu ilan edilmez.

Bu deneme kullanıcı tarafından bildirilen ücretsiz katmana dayanır; kalan kota/billing API ile ölçülmedi. Başarısız veya yarım kalan ilk istek otomatik tekrar edilmez. Yeni model çağrısı için yeni, açık görev gerekir. Growth OS, production veya yeni servis ayarı değişmez.
