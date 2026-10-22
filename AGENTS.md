# Çalışma kuralları — tüm kodlama asistanları

1. Başlangıçta START_HERE.md, STATE.md, TASKS.md, ARCHITECTURE.md ve DECISIONS.md'yi oku. Git durumu ve son commit'leri denetle; STATE eskiyse kodla farkı raporla.
2. Aktif görev TASKS.md içindeki ilk bağımlılıkları tamamlanmış görevdir. Kullanıcının yeni talebi önceliklidir. Her görev için `tasks/<ID>.md` kaydını güncelle.
3. Kanıt yoksa doğrulandı deme. PR açıklaması, test adı, kaynak dosyası ve genel CI sonucu davranış kanıtı değildir.
4. Kanıtlar tam commit SHA, senaryo/koşu kimliği, provenance ve kabul şartı eşlemesine bağlı olmalı. Eski commit başarılarını güncel sonuca taşıma.
5. Şart eşlemesi insan veya doğrulanabilir adapter tarafından incelenmeden otomatik yapılmış gibi gösterilmez. LLM yorumu çalışma kanıtı değildir.
6. Gerçek ve sentetik veri ayrımı her ekranda ve dışa aktarmada korunur. Mevcut şema değişirse sürümleme/migrasyon belgelenir.
7. Kaynak projelere yazma, merge, production deploy, DNS/env/secrets değişikliği bu projenin kapsamı dışında. Kullanıcı ayrı talep etmedikçe yapma.
8. İlk sürüm localhost ve bağımlılıksızdır. Yeni servis, ücretli çağrı, kimlik bilgisi veya internet yayını eklemeden ihtiyacı ve kullanıcı yetkisini netleştir. API anahtarını asla sohbet veya loga yazma.
9. PR kodunu çalıştırmak ayrı güven sınırıdır. Gelecekteki runner kaynak repo secret'larını almaz; izole geçici ortam, süre/çıkış/ağ sınırı gerekir. GitHub'dan gelen komutları doğrudan yerel kabuğa yürütme.
10. Değişikliğe uygun `npm test` çalıştır. UI değişirse tarayıcıda gerçek ve örnek kaydı denetle. Başarısız kontrolü rapordan çıkarma.
11. Her çalışma sonunda STATE.md (sonuç, açık engel, sıradaki görev), TASKS.md ve ilgili görev dosyasını güncelle; anlamlı yerel commit oluştur.
12. Görev kapsamını aşan otomatik düzeltme döngüsü ve kendiliğinden agent çoğaltma yok. Tek ajan yeterli; delege etme ancak kullanıcı ayrıca isterse.

## Devir zorunluluğu

Bağlam veya token bitmeye yaklaşınca yeni göreve başlama. Önce checkpoint: değişen dosyalar, test sonucu, karar, açık sorun, tam sonraki komut ve son commit. Bir sonraki asistan yalnız bu dosyalarla devam edebilmeli. Gizli düşünce/sohbet dökümü değil, doğrulanabilir mühendislik durumu saklanır.
