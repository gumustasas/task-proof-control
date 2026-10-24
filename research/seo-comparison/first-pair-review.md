# İlk aynı girdili SEO karşılaştırması — 24 Ekim 2026

İlk başarılı çift tamamlandı. Girdi R-atik-su, provenance reported: tarihli Growth OS raporundan aktarım; güncel sayfa/GSC ölçümü değil. Aynı istem, girdi ve render edilmiş istem SHA-256 değerleri eşleşiyor: true. İki sağlayıcıya da reviewer listesi veya diğer modelin yanıtı gönderilmedi. Sıcaklık 0.2, çıktı tavanı768, kelime sınırı120; her model için bir başarılı gözlem var. Önceki OpenAI hataları rapordan silinmedi.

| Ölçüt | Gemini 3.1 Flash Lite | GPT-4o mini |
|---|---|---|
| Tam yanıt süresi | 1257 ms | 3593 ms |
| Giriş / çıkış token | 262 / 234 | 266 / 208 |
| Toplam token | 496 | 474 |
| Uzunluk | 93 kelime | 95 kelime |
| Gerçekleşen fatura maliyeti | Bilinmiyor; kullanıcı Free Tier bildirdi | Bilinmiyor |
| Liste fiyatıyla tahmin | Hesaplanmadı | 0.0001647 USD |
| Türkçe | Açık, anlaşılır; istenen beş başlık var | Açık, anlaşılır; istenen beş başlık var |
| Kanıta bağlılık | Rapordaki durumu güncel sayfa bulgusu gibi sunuyor | Bulgunun 23 Ekim raporundan geldiğini açıkça belirtiyor |
| Uygulanabilirlik | Hedef sayfa ve tablo önerisi daha somut | Veri toplama ve karşılaştırma önerisi daha genel; mevcut sayfada güncelleme mi yeni içerik mi net değil |

## Editoryal değerlendirme

Bu değerlendirme kör olmayan asistan incelemesidir; bağımsız insan puanı değildir. İki yanıtta da uydurulmuş sayısal oran yok, eksik GSC/GA4 bilgisi belirtilmiş. İkisi de her model için teknik oranların üretici/kılavuz kaynaklarından ve güncel sayfadan doğrulanmasını açık bir ön koşul haline getirmiyor. Bu nedenle doğrudan yayımlanacak nihai öneri olarak kabul edilmediler. Gemini'nin tablo hedefi daha somut; OpenAI'nin rapor atfı daha temkinli.

Bu örnekte Gemini yanıtı daha kısa sürede geldi. Tek tekrar, farklı günler ve farklı sağlayıcılar nedeniyle genel hız üstünlüğü/istatistiksel sonuç çıkarılamaz. Token sayıları sağlayıcılar arası doğrudan kalite veya maliyet göstergesi değildir. OpenAI tahmini, 266 giriş ×0.15/1M +208 çıkış ×0.60/1M; kontrol edilen standart fiyatlar 23 Ekim kaydındadır. Gerçek fatura gözlenmedi. Gemini Free Tier beyanı, doğrulanmış sıfır toplam maliyet anlamına gelmez. Kurulum, insan düzeltme süresi ve abonelik maliyeti ölçülmedi.

## Karar

Bu ilk örnek mevcut Growth OS modelini değiştirmek için yeterli değil. Gemini insan kontrollü taslak için aday kalıyor; üretime entegrasyon yapılmadı. On vakalık pilot, bağımsız/kör inceleme ve insan düzeltme süresi ölçümü açık. Bu rapor ilk başarılı çiftin kaydıdır; zaman kazancı veya genel model kazananı ilanı değildir. Yeni model çağrısı planlanmadı.

## Kaynak ve çalışma kanıtı

- Gemini: 23 Ekim, squash115b68df57c24f2a038661e83dd5eccd889ab983, [run39969638630](https://github.com/gumustasas/task-proof-control/actions/runs/39969638630), job120468579502. Tam gözlem özgün logdan alındı.
- OpenAI: 24 Ekim, squash74c11014d161e8b48633832113a46a0e9dc827a9, [run40095538718](https://github.com/gumustasas/task-proof-control/actions/runs/40095538718), job120876892741. HTTP200,completed; dönen tam model gpt-4o-mini-2024-07-18.
- Önceki yerel OpenAI girişimi: HTTP yanıtı yok, sağlayıcı sonucu bilinmiyor. İlk hosted girişim40091399254: HTTP429,neden kaydedilmedi. Sonraki40094645100: HTTP429,credit_balance_exhausted. Son başarılı istek kullanıcı açıkça kredi eklediğini bildirdikten sonra bir kez çalıştı; otomatik tekrar yok.
- PR#17 exact head4b41973d6e4189865ead4b7ce946820e75cce1eb, CI40095463530/job120876661116: 69 test,sıfır atlama/hata,7 gerçek tarayıcı ve Docker kontrolleri başarılı; loglar incelendi.
- Tam değiştirilmemiş sağlayıcı gözlemleri: first-successful-pair.json. Eski first-trial-observed.json içindeki karakter aktarım sorunu nedeniyle Gemini metni bu yeni kayıtta özgün logdan korunur; asıl sağlayıcı içeriği düzeltilerek yeniden yazılmadı.
