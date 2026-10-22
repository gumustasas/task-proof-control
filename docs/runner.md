# T-006 — Sınırlı Node test runner

Runner panelden bağımsız CLI'dır. Güvenilir operatör tarafından yönetilen, geçici Linux Docker host gerektirir. Yerel makinede kaynak kod çalıştırma fallback'i yoktur. İlk prototip yalnız Node standart kütüphaneleriyle çalışan açıkça seçilmiş `*.test.mjs/js/cjs` dosyalarını destekler. npm install, lifecycle script, repo Dockerfile, keyfi shell ve online bağımlılık indirme yoktur.

```sh
docker pull node:22-bookworm-slim
node src/runner-cli.mjs /trusted/checkout FULL_40_CHAR_COMMIT_SHA test/engine.test.mjs > execution.json
```

Image operatör/CI tarafından önceden alınır. Runner `--pull=never` kullanır, tag'i image ID'ye çözüp o ID'yi çalıştırır ve rapora yazar. Tag değişebilir; aynı image ID olmadan iki koşu aynı runtime olarak değerlendirilmez. Kaynak image seçemez. Docker daemon API erişimi operatörün güçlü yetkisidir; kaynak container'a taşınmaz.

## Kaynak ve kaynak limitleri

Git çalışma dizini doğrudan mount edilmez. Tam commit'teki blob'lar geçici dizine kopyalanır: en çok 500 dosya ve toplam 5 MB. Symlink, submodule, kaçış yolu ve bilinen secret dosya adları reddedilir. `.git` ve untracked dosyalar taşınmaz; filtre/LFS/smudge çalıştırılmaz. Kaynak repo ortam değişkenleri, GitHub token, host ev dizini ve Docker socket mount edilmez. Takip edilen kodda yanlışlıkla gömülmüş bir secret'ı dosya adı filtresiyle kesin bulma iddiası yoktur; kaynak snapshot önceden incelenmelidir.

Container: UID/GID 1000, capabilities kapalı, no-new-privileges, salt okunur root ve kaynak, ağ none, 256 MiB bellek/swap toplamı, 1 CPU, 64 PID, 128 açık dosya, tek dosya 8 MiB, `/tmp` 16 MiB tmpfs (noexec/nosuid/nodev). Çalıştırma varsayılan 30 saniye, en çok 60 saniye; birleşik stdout/stderr en çok 64 KiB. Docker log driver kapalı. Limitte attach süreci öldürülür; finally container force-remove ve stage temizliği yapar. Temizleme başarısızsa başarı raporu üretilmez. Hazırlık komutları ayrıca 10 saniye/çıktı sınırına sahiptir; bu süre çalışma süresinden ayrıdır.

Docker container host kernelini paylaşır; düşmanca çok kiracılı iş yükleri için mutlak güvenlik sınırı değildir. Böyle bir kullanımda ayrı VM/host ve ek izolasyon gerekir. Prototip geçici CI host'ta doğrulanır; kullanıcının masaüstünde bilinmeyen PR kodu çalıştırılmaz.

## Kanıt sınırı

`taskproof-sandbox-execution` raporu commit, image ID, seçilen yollar, limitler, exit code ve kesilme nedenini kaydeder. Test kodu kendi stdout'unu ve assert'lerini kontrol eder. TAP metni otomatik kabul kanıtına çevrilmez; genel runner success, kriterlerin doğrulandığı anlamına gelmez. T-005'in incelenen eşlemesi ve ayrı doğrudan senaryo raporu gerekir. Runtime image ve kaynak dosyalar kriptografik attestation oluşturmaz.

## Doğrulama

`npm test`: argüman/yol/tree doğrulaması, symlink/secret reddi, gerçek subprocess süre ve çıktı limiti. `node test/runner-live.mjs`: exact commit motor testleri; ardından açıkça sentetik fixture ile UID, ağ yokluğu, secret ortamı yokluğu, read-only filesystem, tmpfs boyutu, bilinen failure, timeout, output ve dosya boyutu limitleri. Bu denemeler kaynak Growth OS davranış testi değildir.

Docker resmi kaynakları: [run seçenekleri](https://docs.docker.com/reference/cli/docker/container/run/), [kaynak limitleri](https://docs.docker.com/engine/containers/resource_constraints/), [engine güven sınırı](https://docs.docker.com/engine/security/).
