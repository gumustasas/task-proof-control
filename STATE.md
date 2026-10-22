# Çalışma durumu — tek devir kaynağı

Tarih: 22 Ekim 2026, Europe/Istanbul.
Proje: TaskProof (çalışma adı), v0.1.0.
Dal seçimi: PR #1 açıkken feat/bootstrap; birleştirme sonrasında main.
Kullanıcının güncel talebi: görevleri sırayla Codex sürdürecek; her grupta kod incelemesi, PR, CI kontrolü ve başarılı sonuç sonrası squash merge açıkça yetkilendirildi. Başka asistana devir şu anda istenmiyor.
Yetkili uzak repo: https://github.com/gumustasas/task-proof-control (kullanıcı tarafından açıldı; public).

## Hazır olan
- Bağımsız Node.js projesi, harici paket veya ücretli API yok.
- Kanıt sözleşmesi ve deterministik karar motoru.
- Yerel panel kodu; JSON import/export; kaynak kanıt bağlantıları.
- Growth OS #175 için gerçek GitHub anlık görüntüsü; ayrı işaretli sentetik demo.
- Mimari, roadmap, karar günlüğü, görev bağımlılıkları ve Claude devir girişi.

## Kontrol durumu
Yerelde 15 test geçti, 1 gerçek ağ testi ortam nedeniyle atlandı. GitHub Actions'ta 3706257b2692dc6953a69a1465f97e250979a80e commit'inin PR kontrolü 16/16 başarı, 0 başarısız ve 0 atlandı ile tamamlandı; gerçek HTTP kontrolü de geçti. Koşu: https://github.com/gumustasas/task-proof-control/actions/runs/39801102088 . Tarayıcı erişimi zaman aşımına uğradığı için UI etkileşimi henüz doğrulanmadı. Ayrıntılar VALIDATION.md.
Gerçek örnek: 0 doğrulandı, 0 başarısız, 5 kanıt yetersiz, 0 eski. Bu sonuç dış PR'ın bozuk olduğunu göstermez; doğrudan davranış kanıtı toplanmadığını gösterir.

## Çevrimiçi durum
Kullanıcının açtığı gumustasas/task-proof-control reposu GitHub bağlantısıyla doğrulandı. Başlangıçta main yalnız README içeriyordu; başlangıç commit'i cc543c5f75d0b59726953cf932750db3a47072a7. Kod ve belgeler feat/bootstrap dalına yüklendi; PR #1 açıldı: https://github.com/gumustasas/task-proof-control/pull/1 . İlk yükleme commit'i 29b15abb8fd2f7657513d5f7b435b4b758366872. Birleştirme durumu ve güncel head SHA için GitHub'ı kontrol et. CLI auth geçersiz; aktarım GitHub bağlantısı üzerinden yapıldı.
İnternet paneli/deployment ve çalışma zamanında canlı GitHub adapteri yok. Kaynak PR'ları sınayan otomatik runner yok. Bu projenin kendi motor/HTTP testleri için GitHub Actions workflow'u eklendi; PR kontrol sonucu GitHub'dan doğrulanmalı. CI'da loopback testinin atlanmasına izin verilmez. Ücretli model yok. Repo görünürlüğü veya uygulama erişim ayarları değiştirilmedi.

## Sıradaki iş
T-003, PR #2 squash ile tamamlandı (1c0602e1f317ce122eb80ce850d514c1c5653eb1). Altı Chromium senaryosu ve 16 test geçti. Güncel aktif görev T-004: PR URL formu, güvenli GitHub API adapteri, metadata/kanıt ayrımı ve 11 ek test hazır. Yerelde 26 başarı, 1 loopback skip; hosted ve canlı API kontrolü yeni PR'da bekleniyor. Aşağıdaki önceki T-003 notları tarihsel kayıttır.
Aktif çalışma: T-003 için altı Chromium kabul senaryosu eklendi. CI test aracı Playwright 1.56.1 olarak sabitlendi; uygulama çalışma zamanına bağımlılık eklenmedi. UI sonuçları ve ekran görüntüleri GitHub artifact olarak yedi gün tutulacak. İçe aktarılan kaydı tekrar seçme ve geç gelen ağ yanıtının yeni seçimi ezmesi düzeltildi. Bu senaryolar henüz başarılı sayılmıyor; yeni PR'ın CI sonucu okunmalı.
T-003: HTTP kontrolü GitHub'da tamamlandı; tarayıcıda gerçek/sentetik kayıt ve import/export etkileşimini doğrula. Sonra T-004 salt okuma GitHub adapteri.

Başlangıç komutları:
```powershell
git status --short
git log -3 --oneline
npm.cmd test
npm.cmd start
```

Beklenen panel: http://127.0.0.1:4317
Tüm klasör taşınmalı. Git bundle yedeği varsa geçmişi ondan geri alabilirsin. ZIP içindeki kod ve belgeler bağımsız olarak yeterlidir.

## Karar verilmemiş konular
- Yeni uzak repo artık task-proof-control; mevcut görünürlüğü public. Uygulama internete dağıtılmadı.
- Canlı GitHub kimlik doğrulama yöntemi T-004'te seçilecek.
- Test artifact formatı, runner ortamı, preview test DB ve uygulama barındırması sonraki görevlerdir.
- Ücretli model, kalıcı DB ve otomatik merge mevcut kapsamda yok.

## Son checkpoint
Bu dosyaları içeren ilk yerel commit için `git log -1` çalıştır. Commit hash'i bu dosyaya kendisiyle döngü oluşturmamak için gömülmez. Kaynak dış repo commit'i: a6fcd3057b067d40fe19cfbe0a661b09c6ec6e08.

Yerel başlangıç Git geçmişi, GitHub'da kullanıcının oluşturduğu başlangıç commit'inden bağımsızdır. Uzak repo ile çalışacak sonraki asistan temiz clone yapıp feat/bootstrap dalını seçmeli; bağımsız yerel geçmişi force-push etmemeli.
