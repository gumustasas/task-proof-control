# T-008 — Ön ölçüm, insan karşılaştırması bekleniyor

`node src/pilot.mjs` iki gerçek PR'a bağlı kayıtla deterministik kanıt kontrolünü ve motorun yerel işlem süresini ölçer. `data/pilot/` pozitif girdileri; `data/growth-os-pr-175.json` kanıt eksikliği girdisidir. `pilot-results.json` bu makinedeki tek ölçümü saklar; CI kendi ortamında aynı doğruluk beklentilerini yeniden kontrol eder, süre eşiği uygulamaz.

Pozitif örnek TaskProof #5'in 038cf349403bfe898cb3ad28f9c11756db38b304 commit'inde çalışan üç seçilmiş UI davranışıdır. Koşu 39806257000 / job 119920156618 PASS satırları operatörce JSON'a aktarıldı; tam test gövdeleriyle eşleme Codex tarafından incelendi. Bu bir insan kontrol grubu veya doğrulanmış artifact indirmesi değildir. Kaynak, eşleme ve metadata dosyalarında açıkça yazılıdır. Pozitif örnek tüm PR'ın tamamlandığı iddiası değildir.

Beklenen ve gözlenen: pozitif üç kriter verified; Growth OS #175'in beş kriteri insufficient. Sınırlı beklenen etiketlere göre yanlış verified sıfır. Bu iki örnek gerçek dünyadaki yanlış eşleme oranını veya kaçan bug sayısını ölçmez. Growth OS örneği bilinen kod hatası değil, bilinen doğrudan kanıt eksikliğidir.

İşlem süresi 1000 tekrarın medyan/p95 değeridir; yalnız bellek içi import/doğrulama/karar motorunu kapsar. GitHub toplama, Docker, tarayıcı ve inceleme süresi dahil değildir. İnsan inceleme dakikası, kaçan bug ve zaman kazancı alanları null bırakıldı. Hız/kazanç sonucu çıkarmayın.

## Tam deneyin kalan kısmı

T-007'nin erişilebilir ve yetkili preview kanıtı sonrası, aynı kabul şartları üzerinde bir kişi TaskProof olmadan inceleme yapar. Başlama/bitirme zamanı, açılan dosyalar, bulduğu eksikler ve kararlar kaydedilir. Sonra TaskProof ile aynı türde eşdeğer ikinci görev değerlendirilir; sıra etkisi not edilir. En az bir bilinen hata içeren kontrollü örnek gerekir. Etiketler bağımsız incelemeyle doğrulanır; gerçek kullanıcı süresi olmadan kazanç ilan edilmez. Model maliyeti bu sürümde sıfır çağrıdır; GitHub/CI hizmetinin hesap kotası veya ücretsizliği hakkında yeni bir garanti verilmez.
