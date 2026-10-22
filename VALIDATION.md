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
