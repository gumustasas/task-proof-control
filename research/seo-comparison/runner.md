# SEO deneyini hazırlama

Bu CLI yalnız yerel dosya üretir. API/anahtar okumaz, internet isteği yapmaz, Promptfoo veya başka paket kurmaz. Ortamda bir OpenAI anahtarı olması kullanıldığı anlamına gelmez.

## Veri kümeleri

- cases.json: 10 sentetik hazırlık vakası.
- reported-cases.json: Growth OS'in gerçek teslim raporundan türetilmiş 10 vaka. Etiket reported'dır; ham sayfa/GSC verisi veya güncel yeniden gözlem değildir. Rapordaki geçmiş model kararları yeni ortak istemin baseline'ı değildir.

Kaynak inceleme SHA: db0c79565acd0f9a350aac387a07b9c6f16708b4. [Teslim raporu](https://github.com/gumustasas/buzsu-growth-os/blob/db0c79565acd0f9a350aac387a07b9c6f16708b4/drafts/reports/content-match/2026-10-23-teslimat-3-oneriler.md), [mevcut model görevi](https://github.com/gumustasas/buzsu-growth-os/blob/db0c79565acd0f9a350aac387a07b9c6f16708b4/lib/content-match/judge.ts).

Kodda model kimliği OPENAI_CONTENT_MODEL ayarından gelir; güncel deployment değeri bu çalışmada okunmadı. Rapordaki gpt-4.1-mini tarihsel bilgidir. Mevcut judge JSON yeterlilik sınıflandırır; yeni ortak istem 120 kelimelik öneri ister. Eski yanıtla hız/kalite kıyası yapılmaz.

## Kullanım

Repo kökünde, henüz var olmayan bir çıktı dizini seç:

```powershell
New-Item -ItemType Directory -Force runtime | Out-Null
npm.cmd run seo:prepare -- research/seo-comparison/reported-cases.json runtime/seo-reported-01
```

runtime/ gitignore'dadır. Yeni bir çıktı dizini ver; çıktıların paylaşılabilirliği incelenmeden git add yapma. Mevcut dizin reddedilir, eski ölçüm üzerine yazılmaz.

Üretilenler:

| Dosya | İçerik |
|---|---|
| prompt.txt | Protokoldeki ortak istem; reviewer kontrolleri yok |
| promptfoo-tests.json | Promptfoo tests alanına aktarılabilecek değişkenler; yalnız input |
| manifest.json | İstem, input ve render edilmiş istem hash'leri; kaynak/provenance |
| reviewer-only.json | Yalnız inceleyenin göreceği kontrol listesi |
| observations.template.json | A/B modeli, çıktı, süre, maliyet ve puan için boş alanlar |

datasetSha256, JSON.parse sonrası JSON.stringify(data) UTF-8 baytlarının hash'idir; dosyanın boşluk/BOM düzenini kapsamaz. inputSha256 ve renderedPromptSha256 tam metin baytlarını kapsar. Hash, operatör beyanını gerçek sağlayıcı cevabı veya kaynak imzası olarak doğrulamaz.

Her kayıt not_run başlar. Null süre/maliyet/puan sıfır veya başarı sayılmaz. CLI bu sonuçları puanlayıp kazanan seçmez. observations.template.json, önceki results.csv'nin yerine geçen otomatik importer değildir; elle ölçüm için tamamlayıcı kayıt formatıdır.

## Promptfoo'ya geçiş

Bu teslim yalnız test verisini dışa aktarır, tam çalıştırılabilir provider config üretmez. Sağlayıcı kimlikleri, ücretsiz hesap kotası ve sabit araç sürümü doğrulanmadan eval çalıştırma. Promptfoo test biçimi için [resmî test belgesi](https://www.promptfoo.dev/docs/configuration/test-cases/), Google bağlantısı için [resmî sağlayıcı belgesi](https://www.promptfoo.dev/docs/providers/google/) 23 Ekim 2026'da incelendi. Bu belgelerden bir sağlayıcı kurulmuş/çalışmış sonucu çıkarılmaz.

Canlı pilotta iki model de aynı prompt.txt ve girdiyle yeni, temiz oturumlarda çalışmalı. Gemini ücretsiz kotası ve erişimi şu anda hazır değil. Ücretli OpenAI baseline için yeni harcama yetkisi verilmedi; var olan eşleşen çıktı da bulunmadı. Bu nedenle gerçek A/B denemesi açık kalır. Sağlık/teknik iddiaları kaynaktan doğrulama ve kör insan değerlendirmesi gerekir.
