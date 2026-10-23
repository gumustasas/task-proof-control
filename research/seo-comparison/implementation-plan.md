# T-010 uygulama adımları

23 Ekim 2026. Kullanıcı sıralı plan, kod, PR kontrolü ve squash merge istedi.

1. Kaynak inceleme: Growth OS main db0c79565acd0f9a350aac387a07b9c6f16708b4 içindeki judge.ts ve tarihli teslim raporu okundu. Görev JSON yeterlilik değerlendirmesi; yeni serbest metin önerisiyle aynı baseline değil. Güncel deploy model/istem ayarı doğrulanmadı.
2. Gerçek rapordan türetilmiş 10 konu hazırlama: reported olarak etiketle; kaynak URL/SHA ve rapor tarihi kaydet. Ham sayfa/GSC gözlemi veya eşleşen baseline diye sunma.
3. Küçük offline aktarım CLI'sı: ortak istemi sabitle; model girdisi ve inceleyen kontrol listesini ayır; Promptfoo test JSON'u, prompt, hash manifesti ve boş A/B kayıt şablonu üret. Sağlayıcı çağırma/kurma yok; Promptfoo yerine yeni değerlendirme motoru yazma.
4. Anlamlı testler: kontrol listesinin sızmaması, sabit hash, gerçek/sentetik ayrımı, kaynaksız reported veri, yinelenen kimlik, dosya boyutu ve var olan çıktı üzerine yazma.
5. Her iki veri kümesiyle offline hazırlığı çalıştır; çıktıların not_run kaldığını doğrula. Görev ve devam belgelerini güncelle.
6. Uzak main üzerinden PR; dosya/CI/log inceleme; başarılı kontrollerden sonra exact-head squash.

Canlı deney engeli: ortamda Gemini anahtarı/hesap kotası bulunmuyor; kullanılabilir browser aracı yok. OpenAI anahtarı bulunması harcama yetkisi değildir; bu görevde kullanılmayacak. Ücretli çağrı veya fallback yok. T-010, yalnız hazırlık kodu bitti diye tamamlanmış sayılmaz.

Devam: ücretsiz Gemini hesabı erişimi/kotası, aynı istemde iki sabit model ve eşleşen çıktılar; sonra kör insan değerlendirmesi. API anahtarları sohbet/repoya yazılmaz. Başlangıçta bir vaka; kota ve sonuç uygunsa kalanlar.
