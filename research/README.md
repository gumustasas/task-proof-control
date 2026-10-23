# Araç ve fırsat araştırması

Bu bölümün amacı, zahmetli işleri mevcut araçlarla daha hızlı/ekonomik yapıp yapamayacağımıza karar vermektir. İkinci amaç, mevcut çözümlerin karşılamadığı bir ihtiyacı kanıtlarıyla saptamaktır.

Kullanıcı 23 Ekim 2026'da araştırmanın bu repoda, gerçek SEO denemesinin Growth OS bağlamında yapılmasını istedi. Bu karar TaskProof panelini AI araç kataloğuna dönüştürmez.

## Buradan başla

1. [İlk araştırma ve kısa liste](2026-10-23-free-ai-tools.md)
2. [Karşılaştırma protokolü](seo-comparison/protocol.md)
3. [10 sentetik hazırlık vakası](seo-comparison/cases.json)
4. [Henüz boş sonuç tablosu](seo-comparison/results.csv)
5. [Yeni program fırsatları için hipotezler](opportunities.md)
6. [Çalışan offline aktarım CLI'sı](seo-comparison/runner.md) ve [rapordan türetilmiş 10 vaka](seo-comparison/reported-cases.json)

23 Ekim T-010 hazırlığı: veri kümeleriyle aktarım çalıştırıldı, model deneyi yapılmadı. Gemini erişimi/kota ve aynı istemde baseline açık. [Adım planı](seo-comparison/implementation-plan.md).

## Çalışma döngüsü

Zahmetli işi tanımla → mevcut yöntemi kaydet → en fazla iki alternatif seç → aynı girdilerle dene → doğruluk, süre, maliyet ve insan düzeltmesini ölç → kullan / sınırlı kullan / ele / veri yetersiz kararı ver.

- Keşif: Product Hunt ve araç dizinleri. Listeye girmek ücretsiz kullanım veya kalite kanıtı değildir.
- Model/örnek: Hugging Face; her modelin lisansı ve sağlayıcı kotası ayrıca kontrol edilir.
- Teknik karşılaştırma: Models.dev; sıfır fiyat sınırsız servis garantisi değildir.
- Değerlendirme yöntemi: LMSYS; genel liderlik tablosu Türkçe SEO başarısı sayılmaz.
- Fiyat ve kota için ürünün resmî belgesi esas alınır; tarih kaydedilir.
- Ölçülmemiş değerler boş/null bırakılır. Üreticinin iddiası, kendi denememiz ve hipotez ayrı yazılır.
- Ücretsiz yazılım, ücretsiz web arayüzü, ücretsiz API kotası, deneme kredisi ve kendi donanımında kullanım ayrı sınıflardır.
- Kurulum, API anahtarı veya model çağrısı bu belgelerle kendiliğinden başlamaz. Ücretli çağrı/fallback yok.
- Growth OS'in kodu, ayarları ve canlı verisi bu çalışma tarafından değiştirilmez.
