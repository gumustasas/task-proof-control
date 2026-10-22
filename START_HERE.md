# Buradan devam et

Repo: https://github.com/gumustasas/task-proof-control
Yetkili başlangıç dalı `main`; ilk PR ve T-003–T-006 birleştirildi. Aktif görev ve açık ön koşullar STATE.md / TASKS.md içindedir. Geliştirmeye Codex ile devam ediliyor; devir belgeleri gelecekteki devamlılık içindir.

## Okuma sırası
1. AGENTS.md — güven, kodlama ve devir kuralları.
2. STATE.md — bu oturumun gerçek son durumu ve engeller.
3. TASKS.md — görevler, bağımlılıklar ve sıradaki hazır iş.
4. ARCHITECTURE.md ve DECISIONS.md — sistem ve seçilen sınırlar.
5. Aktif `tasks/T-xxx.md` — yapılacak işin kabul şartları.

## Hızlı kontrol
```powershell
git status --short
git log -3 --oneline
npm.cmd test
npm.cmd start
```
Panel: http://127.0.0.1:4317

## İlk örneğin gerçeği
Growth OS #175, a6fcd3057b067d40fe19cfbe0a661b09c6ec6e08 commit'i. Genel workflow başarılı, test tanımları görülmüş. Tek tek senaryo sonuçları ve preview davranışları BU PROJE tarafından henüz doğrulanmamış. Panelde beş şartın açık olması beklenir, hata değildir.

## Devam için gereken dosyalar
Bu klasörün tamamı, özellikle Git geçmişi ve görev belgeleri. Sadece sohbeti taşımak yeterli değildir. ZIP yedeği Git geçmişini içermiyorsa kod/belgelerle devam edilebilir, yeni git init gerekir.
