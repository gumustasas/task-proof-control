# Ücretsiz AI araçları: ilk karar kaydı

Kontrol tarihi: 2026-10-23 (Europe/Istanbul).
Yöntem: resmî ürün belgeleri ve fiyat sayfaları masa başında incelendi. Hesap kotası, kurulum, hız, Türkçe kalitesi veya zaman tasarrufu ölçülmedi.

## İhtiyaçtan başlayan kısa liste

| İhtiyaç | Aday / ücretsiz türü | Güncel sınır ve pratik maliyet | Mevcut yöntemle ilişki | İlk karar |
|---|---|---|---|---|
| SEO bulgusundan Türkçe fırsat önerisi | Google AI Studio / bazı Gemini API modellerinde ücretsiz kota | Her model ücretsiz değil; hesap/model kotası ayrıca görülecek. Ücretsiz katmanda içerik ürün geliştirmede kullanılabilir. | Growth OS'in mevcut OpenAI ayarıyla aynı girdide karşılaştır | İlk model alternatifi; ölçüm bekliyor |
| Güncel API/dokümantasyon bulma | Context7 / ücretsiz servis kotası | Public kaynaklar, ayda 1.000 API çağrısı. Kota sayfası tekrar kontrol edilmeli. | Codex/Claude'un güncel belgelere erişimini tamamlar; model yerine geçmez | İkinci, ayrı deney |
| Model yanıtlarını aynı koşulda karşılaştırma | Promptfoo / açık kaynak CLI | Araç ücretsiz; seçilen sağlayıcının model ücreti ve otomatik değerlendirme çağrıları ayrıca olabilir | Yeni karşılaştırma programı yazma ihtiyacını azaltabilir | Önce basit kayıt; tekrar gerekirse kurulum |
| Küçük repo görevini kodlatma | Antigravity / bireysel ücretsiz plan | 0 USD/ay; temel haftalık sınırlar. Ücretsiz plan sınırsız ajan yürütmesi değildir | Codex/Claude'a alternatif; aynı küçük görevle değerlendirilir | SEO deneyi sonrasına bırak |
| Tanımlı repo görevi devretme | Jules / ücretsiz görev kotası | Resmî tabloda 24 saatte 15 görev, 3 eşzamanlı görev; hesap uygunluğu/kota tekrar doğrulanmalı | Mevcut kodlama akışına alternatif | Kodlama deneyinde en fazla bir alternatif seç |
| Birden fazla açık modeli deneme | OpenRouter / ücretsiz API modelleri | Ücretsiz planda günde 50 istek; model ve kapasite sınırlı. Sağlayıcı veri politikası ayrıca okunur | Tek API ile alternatif model keşfi | Yedek aday; ilk teste ekleme |
| Yerelde model çalıştırma | Ollama / kendi donanımında kullanım | Yerel kullanım sınırsız; RAM/VRAM, kurulum, elektrik ve hız maliyeti var. Bulut kullanımı ayrı | API ücretini azaltma ihtimali; PC donanımı bilinmiyor | Donanım bilinmeden model/hız önerme |
| Model ve demo keşfi | Hugging Face / sınırlı başlangıç kredisi | Ücretsiz hesabın Inference Providers kredisi ayda 0,10 USD, değişebilir. Spaces/demo kotası ayrı | Model deposu/örnek kaynağı; sınırsız ücretsiz API değil | Keşif için kullan; entegrasyon gerekmez |
| Gerçek tarayıcı akışını kontrol etme | Playwright / açık kaynak otomasyon | Araç ücretsiz; ajan/model, CI ve makine maliyeti ayrı | Repoda Playwright UI testleri zaten var; yeni ürün ekleme gerekçesi zayıf | Mevcut araçtan yararlan; yeni kurulum yok |

Bu tablo kazanan sıralaması değildir. Ürün özellikleri resmî kaynaklardan; ilk kararlar kendi iş akışımıza ilişkin çıkarımdır.

## Eski önerinin düzeltmesi

Gemini Code Assist'in tüketici GitHub uygulaması 18 Haziran 2026'da kullanımdan kaldırılmaya başladı, 17 Temmuz 2026'da tüketici kod incelemesi kapandı. Eski ücretsiz GitHub inceleme tavsiyesini uygulamayacağız. Enterprise sürümünün koşulları ayrıdır.

## Mevcut araçlarla ölçülecek fark

- Model testi: Growth OS'teki tam OpenAI model kimliği ve istem, deneme öncesinde okunarak kaydedilir. Önceki PR'daki gpt-4.1-mini beyanı güncel ayar sayılmaz.
- Baseline için yeni ücretli çağrı açılmaz. Aynı girdiye ait mevcut, izlenebilir yanıt varsa kullanılır; yoksa baseline eksik olarak kalır. Farklı istem/çıktı şeması kullanılmış tarihsel yanıt adil hız kıyasına sokulmaz.
- Gemini için yalnız hesapta ücretsiz olduğu doğrulanan sabit bir model kimliği seçilir. Model adı bu masa başı araştırmada dondurulmadı.
- Context7 model rakibi değildir. Ayrı deney: aynı sürüme ait bir API'yi doğru kullanmak için gereken araştırma+düzeltme süresi, Context7 ile/olmadan.
- Promptfoo ölçüm aracıdır; kalite kazananı değildir. LLM-as-judge kullanılırsa ayrı model maliyeti doğurabilir. İlk turda insan puanlaması kullanılır.

## Kaynak kayıtları

Aşağıdaki URL'ler 2026-10-23'te kontrol edildi; içlerindeki limitler sonradan değişebilir.

| ID | Resmî kaynak | Desteklediği konu |
|---|---|---|
| S01 | https://ai.google.dev/gemini-api/docs/pricing | Ücretsiz API modelleri ve veri kullanımı ayrımı |
| S02 | https://context7.com/plans | Context7 ücretsiz plan ve kota |
| S03 | https://github.com/upstash/context7 | Güncel dokümantasyon erişimi |
| S04 | https://www.promptfoo.dev/docs/intro/ | Açık kaynak değerlendirme, sağlayıcı desteği |
| S05 | https://antigravity.google/pricing/ | Bireysel ücretsiz plan ve haftalık sınır |
| S06 | https://jules.google/docs/usage-limits | Ücretsiz görev ve eşzamanlılık sınırları |
| S07 | https://openrouter.ai/pricing/ | Ücretsiz plan / istek sınırı |
| S08 | https://ollama.com/pricing | Yerel kullanım ve bulut ücret ayrımı |
| S09 | https://huggingface.co/docs/inference-providers/pricing | Aylık ücretsiz inference kredisi |
| S10 | https://github.com/microsoft/playwright-mcp | CLI/MCP tarayıcı otomasyonu ve mevcut testlerden farkı |
| S11 | https://developers.google.com/gemini-code-assist/docs/deprecations/consumer-code-review | Tüketici GitHub incelemesinin kapanışı |
| S12 | https://models.dev/ | Model özellik/fiyat keşfi; sağlayıcı kontrolü ayrıca gerekir |
| S13 | https://www.producthunt.com/ | Yeni ürün ve kullanıcı tartışması keşfi |
| S14 | https://www.lmsys.org/projects | RouteLLM ve değerlendirme araştırmaları |

## Şimdiki sonuç

İlk deney: SEO önerisinde mevcut OpenAI baseline ↔ ücretsiz Gemini adayı.
Henüz model çalıştırılmadı, çıktı puanlanmadı ve maliyet/hız kazananı seçilmedi.
Yeni repo, panel, Vercel, Neon, yeni ajan veya otomatik tarayıcı entegrasyonu gerekmiyor.
