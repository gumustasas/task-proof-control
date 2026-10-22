# task-proof-control

**Çalışma adı:** TaskProof. **Repo:** https://github.com/gumustasas/task-proof-control

İlk geliştirme dalı `feat/bootstrap`; PR birleştirildiğinde başlangıç sürümü `main` üzerinden kullanılabilir. Aktif geliştirme Codex ile sürer; başka bir asistan gerekirse `START_HERE.md` üzerinden devam edebilir.

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

- Growth OS #175 için GitHub'dan alınmış, commit'e sabitlenmiş anlık görüntü.
- Gerçek kayıtta beş kabul şartının tümü kanıt yetersiz: genel CI başarısı ve kaynakta test tanımı, davranışın çalıştırıldığını kanıtlamaz.
- Ayrı ve açıkça işaretli sentetik örnekte dört farklı sonuç.
- JSON kayıt içe aktarma; tarayıcı belleğinde değerlendirme; rapor indirme.
- CLI raporu: `npm run report` veya `node src/report.mjs path/to/snapshot.json`.

## Kapsam ve güven

Bu sürüm GitHub'a canlı bağlanmaz, test çalıştırmaz, veri tabanına yazmaz, paid API çağırmaz. Kaynak kayıtlar bu oturumda GitHub bağlantısından okunarak hazırlanmıştır. İçe aktarılan JSON operatör beyanıdır; sahte bir JSON'u gerçek GitHub attestation gibi doğrulayamaz. Bu sınır panelde ve mimaride açıkça belirtilir.

## Claude veya Codex ile devam

Önce `START_HERE.md`, sonra `AGENTS.md`, `STATE.md`, `TASKS.md` okunmalı. Kopyalanabilir devam mesajı: `CLAUDE_CONTINUE.md`.

Temel belgeler: `ARCHITECTURE.md`, `ROADMAP.md`, `docs/evidence-contract.md`, `DECISIONS.md`, `VALIDATION.md`.

Çevrimiçi repo, barındırma ve canlı bağlantı durumu için `STATE.md` yetkilidir. Bu dosya mevcut olanakları anlatır; gelecekteki özelliklerin tamamlandığı anlamına gelmez.
