# T-004 — Salt okuma GitHub adapteri

`src/github.mjs` yalnız api.github.com üzerinde GET yapar. PR URL'si github.com HTTPS, credentials/port/query/fragment olmadan owner/repo/pull/numara olmalı. Redirect takip edilmez, Link header URL'sine gidilmez; pagination kendi API yoluyla yürür. 20 sn toplam bütçe, 32 istek, liste başına üç sayfa ve yanıt başına 2 MB sınırı vardır. En fazla beş workflow'un işleri okunur; eksikler warning ve complete=false üretir.

Akış: PR → head SHA → check-runs → head_sha filtreli workflow-runs → jobs → PR yeniden oku. Head değişirse sonuç reddedilir. Commit eşleşmeyen kontroller atlanır ve uyarı eklenir. 401/404/rate-limit/timeout durumları genel, secrets içermeyen hata kodlarıyla döner. GitHub yanıt body'leri hata mesajına eklenmez.

`POST /api/github` yalnız localhost Host, aynı Origin, JSON content-type ve en fazla 4096 byte gövde kabul eder. Uygulama anahtarı yalnız sunucu ortamından okur. Panel metadata'yı kabul şartlarından ayrı bir bölümde gösterir; yeşil CI kriterleri yeşile çevirmez.

Testler: 11 fixture/handler senaryosu; CI'da kendi public PR #1 üzerinde gerçek salt okuma smoke; Chromium form senaryosu fixture ile (canlı API testi ayrı). CI token yalnız contents/actions/pull-requests read yetkilidir ve sadece smoke adımına verilir. Başka repoya yazma veya key provisioning yok.
