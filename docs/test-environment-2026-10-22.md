# Growth OS test ortamı — 22 Ekim 2026

Durum: altyapı hazır; ilk test admini kullanıcı tarafından oluşturulmalı. T-007 bütünü tamamlanmadı.

## Hedef ve yetki
Kullanıcı “Growth OS test ortamını hazırla” talebiyle önizleme ve ayrı test DB hazırlığını yetkilendirdi. Kaynak kod, kaynak main ve production değiştirilmedi. TaskProof'un önceki salt okuma sınırı yalnız bu test ortamı hazırlığı için genişledi.

- Kaynak: gumustasas/buzsu-growth-os PR #175
- Commit: a6fcd3057b067d40fe19cfbe0a661b09c6ec6e08
- Git dalı: claude/site-icerik-envanteri
- Vercel projesi: prj_emaFPXFg4oAVawljJRLKeq0ByQ23
- Son deployment: dpl_2FmyHTNAkArQ8c2vPLTAPygtUeaj
- Önizleme: https://buzsu-growth-l55txbsbe-bulent-kavals-projects.vercel.app
- Durum: READY; API target=staging (standart preview)
- Bölge: fra1

## Veritabanı
- Neon projesi: mute-hill-19637498
- Test dalı: br-morning-cell-b10q1z3s / taskproof-pr-175-20261022
- Endpoint: ep-delicate-band-b1ynl9n5
- Uygulamanın boş veritabanı: taskproof_preview_175
- Uygulama rolü: taskproof_app_175
- Commit'e bağlı kaynak DDL'den 13 ifade uygulandı: 9 tablo, 4 indeks.
- Test DB'de başlangıç auth kayıtları=0, crawl_runs=0.
- Uygulama rolü 9 tablonun sahibidir; superuser/createdb/createrole/bypassrls kapalı, grup üyeliği=0.
- Normal Neon dalı parent-data kopyasıdır. Uygulama, dalda miras kalan neondb yerine yeni boş DB'ye bağlanır. Uygulama rolünün miras app_snapshots tablosunda SELECT/INSERT yetkisi false olarak doğrulandı.
- API'nin oluşturduğu ilk yönetim rolü geniş Neon yetkisi aldı; bu üyelik SQL ile kaldırılamadı. Bunun yerine SQL ile kısıtlı uygulama rolü oluşturuldu, test DB/tablo sahiplikleri bu role verildi ve Vercel bağlantısı bu role geçirildi. İlk yönetim rolü uygulama bağlantısında kullanılmaz.
- Compute min/max=0.25 CU. Hesap suspend interval değişimini reddetti; hesap varsayılanı korundu. Yeni ücretli plan veya servis satın alınmadı. Hesap kotası/harcaması hakkında ücretsiz garantisi verilmez.
- Connection string ve şifre rapora, repoya veya sohbet çıktısına yazılmadı.

## Vercel ayarları
12 değişkenin tümü yalnız preview + claude/site-icerik-envanteri scope'unda:
- DATABASE_URL: kısıtlı rol ve yeni test DB; sensitive
- ENABLE_SITE_CONTENT_INVENTORY=true
- CONTENT_STORE=neon
- USE_MOCK_DATA=true
- ENABLE_NEON=true
- ENABLE_OPENAI_CONTENT=false
- ENABLE_SERPER=false
- ENABLE_GSC=false
- ENABLE_GA4=false
- ENABLE_MERCHANT=false
- ENABLE_FEED_SYNC_WRITE=false
- ENABLE_GOOGLE_AUTOCOMPLETE=false

Production ve diğer preview dallarının env kayıtları güncellenmedi. Model veya harici entegrasyon çağrısı yapılmadı. Vercel SSO ayarı enabled/all_except_custom_domains olarak korundu; bypass linki oluşturulmadı. Ana production alias buzsu-growth-os.vercel.app hâlâ önceki dpl_5wrQsnkMCb71C4FvkHJLMHGVpLSa deployment'ına bağlıydı.

## Gerçek doğrulama
1. Neon metadata: test DB adı/rol, 9 tablo sahipliği, sıfır auth/crawl ve kısıtlı rol yetkileri okundu.
2. Vercel: 12 env kaydının yalnız doğru preview dalında olduğu ve plain flag değerleri kontrol edildi.
3. Son build READY; deployment metadata SHA'sı hedef commit ile aynı.
4. Tarayıcıda son deployment'ın /site-icerik adresi /giris?next=%2Fsite-icerik adresine yönlendi.
5. İlk admin kurulum formu göründü; veritabanı hata ekranı görünmedi. Bu, yeni bağlantıyla giriş sayfasının okunabildiği kanıtıdır; Site İçeriği davranışının tamamlandığı anlamına gelmez.

## Kullanıcıya kalan erişim adımı
Son önizleme üzerindeki ilk kurulum formunda kullanıcı test admin adını ve şifresini kendisi belirler. Yeni giriş bilgisi oluşturma işlemi browser güvenlik kuralı gereği kullanıcıya devredilir. Production şifresi veya oturum çerezi kopyalanmaz. Admin kurulunca T-007'nin bayrak, manuel başlatma, devam ve kontrollü hata senaryoları yürütülebilir. Henüz tarama başlatılmadı; bu rapor onları passed saymaz.

## Araç sonuçları
İlk salt okuma SQL isteğinin otomatik onay incelemesi zaman aşımına uğradı. Durum yeniden okununca DB hâlâ boştu; tek yeniden deneme başarılı oldu. İlk deploy isteğinde target=preview API tarafından 400 ile reddedildi; API'nin standart preview değeri staging ile düzeltildi. Şema ve son deployment yukarıdaki gerçek sonuçlarla doğrulandı.

## Sonraki düzeltme — preview origin

Kullanıcı ilk admini oluşturdu; auth_records=2 doğrulandı. İlk başlatma hata verdi ve crawl_runs=0 kaldı. Kaynaktaki yalnız production origin'i kabul eden kontrol gerçek Node regresyonunda hata verdi; tam platform preview host'larını kabul eden düzeltme sonrası 5/5 geçti. Source PR #176 CI 39825844316: 762/762 MCP, dashboard derlemesi ve servis kontrolleri geçti. Squash yalnız özellik dalına; source main/production değişmedi.

Güncel head: 1e70f0db8198fff1493e39d197fc1b9981250f33. Yeni deployment dpl_Hy62js3FVuckFjsx9s5jxRoDKqsS READY. Sabit dal adresi: https://buzsu-growth-os-git-claude-site-i-9a5c6f-bulent-kavals-projects.vercel.app/giris?next=%2Fsite-icerik . Kullanıcı aynı test hesabını kullanır; yeni admin oluşturmaz. Immutable eski URL güncellenmez. Yalnız UI login sayfası yeni alias üzerinde görüldü; oturumlu tarama tekrar testi henüz yapılmadı. Bu kayıt T-007'nin tamamlandığı veya taramanın başarılı olduğu iddiası değildir.
