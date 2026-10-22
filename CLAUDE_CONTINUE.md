# Claude'a yapıştırılacak devam mesajı

https://github.com/gumustasas/task-proof-control reposundaki TaskProof projesini kaldığı yerden devam ettir. Güncel main üzerinden görev dalı aç. Bu klasör bağımsız projenin tamamıdır. Önce START_HERE.md, AGENTS.md, CLAUDE.md, STATE.md, TASKS.md, ARCHITECTURE.md ve DECISIONS.md dosyalarını oku. Git durumunu ve son commit'leri kontrol et. Ardından npm.cmd test çalıştır. Bu belge yalnız gelecekte gerekebilecek devir içindir; güncel geliştirmeyi Codex sürdürüyor.

Amaç: görev kabul şartlarını aynı commit'e ait gerçek kanıtlarla eşleştiren, doğrulanmış/başarısız/kanıt yetersiz/eski sonuçlarını gösteren bağımsız panel.

İlk çalışan sürüm localhost:4317'de. Gerçek örnek gumustasas/buzsu-growth-os #175; referans SHA a6fcd3057b067d40fe19cfbe0a661b09c6ec6e08. Genel CI başarısı ve kaynak test tanımları var; davranış bazlı sonuçlar toplanmadığı için beş şartın tümünün kanıt yetersiz olması doğru. Sentetik demo ayrı işaretli.

Aktif durum için STATE.md ve TASKS.md yetkilidir. İlk bağımlılıkları tamamlanmış göreve devam et. Yeni mimariyi sıfırdan kurma. Kullanıcı TaskProof reposunda PR, CI kontrolü ve squash merge yetkisi verdi. Kaynak projelere, production’a, secret’lara veya DNS’e yazma. Ücretli model çağırma. GitHub kimlik bilgisini loglama; geçerli CLI oturumunu varsayma.

Her görev sonunda STATE.md, TASKS.md ve ilgili görev dosyasını güncelle. Çalıştırdığın kontrolleri ve başarısız/eksik olanları yaz. Token/bağlam bitmeden son checkpoint'i kaydet. Çevrimiçi repo ve erişim engellerini açık bildir.
