# task-proof-control

**Çalışma adı:** TaskProof. **Repo:** https://github.com/gumustasas/task-proof-control

Başlangıç sürümü `main` üzerinde kullanılabilir. Aktif geliştirme Codex ile sürer; başka bir asistan gerekirse `START_HERE.md` üzerinden devam edebilir.

Bir yazılım görevinin kabul şartlarını, aynı commit'e ait kanıtlarla gösteren bağımsız yerel prototip.

## Başlatma

Node.js 22 veya üstü gerekir. Harici npm bağımlılığı ve API anahtarı gerekmez.

```powershell
cd task-proof-control
npm test
npm start
```

Tarayıcıda http://127.0.0.1:4317 adresini açın. PowerShell npm betiğini engellerse `npm.cmd test` ve `npm.cmd start` kullanın. Başlatma komutu açık kaldığı sürece panel çalışır. Durdurmak için Ctrl+C.

## İlk sürüm

GitHub formuna PR bağlantısı girilerek güncel head SHA, check, workflow ve job metadata'sı okunabilir. Public repo için anahtar zorunlu değil; rate limit uygulanır. Özel repo gerekiyorsa yalnız `TASKPROOF_GITHUB_TOKEN` ortam değişkeni üzerinden salt okuma yetkili token yapılandırılır. Anahtar arayüzde girilmez veya loglanmaz. Bu akış kabul şartlarını otomatik doğrulamaz.

- Growth OS #175 için GitHub'dan alınmış, commit'e sabitlenmiş anlık görüntü.
- Gerçek kayıtta beş kabul şartının tümü kanıt yetersiz: genel CI başarısı ve kaynakta test tanımı, davranışın çalıştırıldığını kanıtlamaz.
- Ayrı ve açıkça işaretli sentetik örnekte dört farklı sonuç.
- JSON kayıt içe aktarma; tarayıcı belleğinde değerlendirme; rapor indirme.
- CLI raporu: `npm run report` veya `node src/report.mjs path/to/snapshot.json`.

## Kapsam ve güven
Tarayıcı kabul testleri için (isteğe bağlı geliştirme aracı): `npm install --no-save --package-lock=false --ignore-scripts playwright@1.56.1`, `npx playwright install chromium`, `npm run test:ui`. CI aynı sürümle Chromium'u çalıştırır. Normal panel kullanımı için bu paket gerekmez.

GitHub adapteri yalnız metadata okur. İncelenen senaryo sonuçları CLI ile snapshot'a eklenebilir: [senaryo sözleşmesi](docs/scenario-evidence.md). Kaynak PR kodu panel sunucusunda çalıştırılmaz. Veritabanı veya ücretli model API'si kullanılmaz. İçe aktarılan JSON operatör beyanıdır; sahte bir JSON'u gerçek GitHub attestation gibi doğrulayamaz. Bu sınır panelde ve mimaride açıkça belirtilir.

İsteğe bağlı ayrı [runner CLI](docs/runner.md), geçici Linux Docker host'ta yalnız Node built-in testlerini ağsız ve kaynak limitleriyle çalıştırır. Panel kullanımı için Docker gerekmez. Runner başarısı tek başına kabul şartı doğrulaması değildir.

## Claude veya Codex ile devam

Önce `START_HERE.md`, sonra `AGENTS.md`, `STATE.md`, `TASKS.md` okunmalı. Kopyalanabilir devam mesajı: `CLAUDE_CONTINUE.md`.

Temel belgeler: `ARCHITECTURE.md`, `ROADMAP.md`, `docs/evidence-contract.md`, `DECISIONS.md`, `VALIDATION.md`.

Çevrimiçi repo, barındırma ve canlı bağlantı durumu için `STATE.md` yetkilidir. Bu dosya mevcut olanakları anlatır; gelecekteki özelliklerin tamamlandığı anlamına gelmez.
