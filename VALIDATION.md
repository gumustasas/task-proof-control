# Doğrulama — 22 Ekim 2026

## Gerçekleştirilen kontroller
- Node.js v22.18.0 üzerinde `npm.cmd test`: toplam 16 test; 15 geçti, 0 başarısız, 1 atlandı.
- Motor: commit tazeliği, failure önceliği, workflow/source kanıt ayrımı, eksik/skipped sonuçlar, doğrulama alanları, tekrarlı kimlikler, unsafe URL, gerçek/sentetik fixture ayrımı.
- HTTP handler ağ kullanılmadan sınandı: root, JSON raporu, örnek kayıt, 404 izin listesi, POST reddi, Host kontrolü ve CSP.
- `node --check public/app.js` ve `node --check src/server.mjs`: başarılı.
- Yerel sunucu `127.0.0.1:4317` üzerinde listen callback'ine ulaştı. Bu tek başına tarayıcı erişimi kanıtı değildir.

## Engeller ve ilk başarısız deneme
- İlk test koşusunda 14 test geçti, gerçek HTTP testi `connect EACCES 127.0.0.1` nedeniyle başarısız oldu.
- Test yalnız bu ortam hatasında açıkça skip edecek biçimde düzenlendi; uygulama hataları hâlâ failure üretir. Ek olarak ağsız gerçek request handler testi eklendi. HTTP'nin çalıştığını iddia etmek için bu handler testi yeterli değildir.
- Chrome ile http://127.0.0.1:4317 açma denemesi `ERR_CONNECTION_TIMED_OUT` döndürdü. Görsel düzen, mobil görünüm ve import/export etkileşimi tarayıcıda doğrulanamadı.
- GitHub CLI oturumu gumustasas hesabı için geçersiz. Connector salt okuma çağrıları çalışıyor.
- Chrome'da yeni özel `taskproof` repo formu açıldı; isim uygun bulundu. Create denemesi sonrası sayfa yeni repo formunda kaldı; başarı kanıtı yok. Çevrimiçi repo oluşturuldu denemez.

## Repo aktarım güncellemesi
Kullanıcı daha sonra `gumustasas/task-proof-control` reposunu açtı. Repo ve main'deki tek başlangıç README'si bağlantıyla doğrulandı. İlk kod aktarımı için feat/bootstrap dalı seçildi. Önceki repo oluşturma engeli yeni hedefin varlığını etkilemez. Bu aktarım bir deployment veya uygulama UI doğrulaması değildir.

## GitHub düzeltme sonucu
3706257b2692dc6953a69a1465f97e250979a80e commit'i için ikinci koşu başarılı: 16 test, 16 başarı, 0 başarısız, 0 atlandı. Gerçek loopback HTTP testi de çalışıp geçti. Koşu: https://github.com/gumustasas/task-proof-control/actions/runs/39801102088 ; job: 119901683580. Node 22 üzerinde log özeti ayrı okunarak doğrulandı.

## İlk PR kontrolünde bulunan sorun
GitHub ilk PR kontrolü (39800726767) atlamasız çalıştı: 15 başarı, 1 hata. Gerçek HTTP Host testi, Node fetch ile Host başlığının beklenen biçimde gönderilmemesi nedeniyle 200/403 uyuşmazlığı verdi. Test raw node:http isteğiyle başlığı gerçekten gönderecek biçimde düzeltildi; ikinci koşu 16/16 geçti. Bu kayıt ilk başarısız sonucu saklar.

## Açık tarayıcı kontrolü

1. `npm.cmd test`: skip olmadan 16/16 beklenir.
2. `npm.cmd start`, tarayıcıda http://127.0.0.1:4317.
3. Gerçek kayıtta beş kanıt yetersiz; sentetik kayıtta dört durumdan birer tane; banner görünür.
4. Bir kanıtı aç, raporu indir, indirilen JSON'u yeniden içe aktar; sonuç aynı olmalı.
5. Bozuk JSON içe aktarmada hata gösterilmeli, önceki geçerli kayıt korunmalı.
6. Telefon genişliğinde okunabilirlik ve konsol hatalarını kontrol et.

Growth OS #175 için bu oturumda davranış testleri veya production/preview üzerinde işlemler çalıştırılmadı.

## T-003, T-004 ve T-005 hosted sonuçları

Önceki yerel tarayıcı engeli hosted CI'da çözüldü; yukarıdaki ilk deneme notları tarihsel kayıttır.
- T-003, PR #2, head 9adccbc94597315e59a028c5196bb35dba44c613: run 39803038748, 16/16 ve altı Chromium.
- T-004, PR #3, head 3f3f0090985865389d038f6fa7a6b538da00faf6: run 39803768215, 27/27, yedi Chromium ve canlı GitHub.
- T-005, PR #4, head caaa8fc87c6f127f9afd1a7df1e32bb0b28a78db: run 39804912250, 38/38, yedi Chromium ve canlı GitHub. Job 119915418060 log özeti okundu; sıfır skip/failure. Squash a8c0b5989a18712d79e2797922bc760e1b943ad8.

T-006 yerel: 41 başarı, bir loopback EACCES skip. Docker CLI var, daemon kapalı; canlı Docker testleri henüz bekleniyor.

## T-006 hosted sonucu

Run 39806257000 / job 119920156618, head 038cf349403bfe898cb3ad28f9c11756db38b304: 42/42 test, sıfır skip/failure; yedi Chromium ve canlı salt okuma geçti. Docker exact-commit 14 motor testi ve beş izolasyon/limit probu geçti. Özellikle intentional failure failed, hang timeout, loud output-limit, file-limit failed olarak gözlendi; bu negatif sonuçlar testin beklenen davranışıdır, gizlenmedi. PR #5 squash f19be0b39d39ebfb995bd44d9fe31bd651a8b571.

T-008 ön ölçüm yerelde çalıştırıldı: 3 verified, 5 insufficient; insan baseline ve zaman kazancı ölçülmedi. Kaynak preview T-007 çalıştırılmadı.

## Ön ölçüm ve hazırlık PR #6

Head 5f60626fa4a5d32a2811aae57d347da2d372c238, run 39807275638 / job 119923737530: 42/42, sıfır skip/failure; yedi Chromium, Docker, canlı salt okuma ve pilot beklenti kontrolü geçti. Loglar ayrıca okundu. Yerel tüm 11 JS/MJS kaynak syntax kontrolü ve CLI ile üç linked scenario snapshot sonucu da geçti. Kaynak Growth OS preview davranışları ve insan karşılaştırması açık kalır.
