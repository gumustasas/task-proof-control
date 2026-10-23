# Mimari karar g�nl���

## ADR-001 - Ba��ms�z proje
Kullan�c� ayr� repo/panel fikrini kabul etti. TaskProof �al��ma ad�; Growth OS'in i�ine kod eklenmez. �lk kaynak proje Growth OS #175.

22 Ekim g�ncellemesi: Kullan�c� gumustasas/task-proof-control reposunu a�t�. Bu repo yetkili hedeftir; mevcut public g�r�n�rl��� korunur. �lk aktar�m feat/bootstrap dal�na, kullan�c�n�n ba�lang�� commit'i �zerine yap�l�r; main'e merge ayr� i�lemdir.

## ADR-002 - �nce kan�t, sonra yorum
�lk s�r�m �cretli AI ve model anahtar� kullanmaz. Deterministik kurallar olmadan LLM'in 'tamamland�' demesi g�venilir bir �r�n temeli de�ildir.

## ADR-003 - Snapshot �nce
Mevcut GitHub okuma ba�lant�s� kaynak toplamak i�in kullan�ld�. Yerel CLI auth ge�ersiz ve runtime adapter hen�z yok. Bu nedenle ilk veri dosyas� a��k�a tarihli anl�k g�r�nt�d�r; canl� ba�lant� gibi g�sterilmez.

## ADR-004 - Prototipte veritaban� ve ba��ml�l�k yok
Node.js standart k�t�phaneleri, JSON, taray�c� JS. Bir PR �zerinde yakla��m� denemek i�in yeterli. �ok kullan�c� ve kal�c� depolama ayr� karar gerektirir.

## ADR-005 - Ba�ar�s�z sonu� �ncelikli
Ayn� commit/kriter i�in passed ve failed birlikteyse failed. Otomatik olarak son ba�ar�l� ko�uyu se�ip �nceki hatay� gizleme yok. Flaky/yeniden ko�u supersession modeli T-005'te a��k bi�imde tasarlanmal�.

## ADR-006 - G�ven beyan� g�r�n�r
22 Ekim T-003: Playwright 1.56.1 yaln�z sabitlenmi� CI/geli�tirme test arac� olarak kullan�l�r. Uygulama h�l� Node standart k�t�phaneleriyle �al���r. Runtime ba��ml�l�ks�zl�k �art� korunur; test ara�lar� ayr� de�erlendirilir.
��e aktar�lan kay�tlar kriptografik olarak do�rulanm�� de�ildir. E�lemeyi inceleyen ad� bir imza de�ildir. Kullan�c� bu s�n�ra panelde eri�ebilmeli.

## ADR-007 - Dar ve ba��ms�z runner
T-006 ayr� CLI ve ge�ici Linux Docker host kullan�r. Kaynak kod panel sunucusunda �al��maz. �lk profil yaln�z offline Node built-in testleridir; repo shell/npm hook/Dockerfile veya online dependency install kabul edilmez. Image ID, exact source commit ve limitler raporlan�r. Container shared-kernel s�n�r� belgelenir. Kaynak stdout'u otomatik davran�� kan�t�na �evrilmez.

## ADR-008 - �n �l��m ve ger�ek fayday� ay�r
T-008'in iki ger�ek PR'a ba�l� �n kontrol�, se�ilmi� UI kan�t� ile do�rudan kan�t eksikli�ini ay�r�r. �nsan baseline, bilinen kod hatas� ve kaynak preview do�rulamas� eksikken tam fayda deneyi tamamland� say�lmaz. Motorun yerel milisaniyesi insan zaman tasarrufu de�ildir. �l��lmeyen de�erler null kal�r.

## ADR-009 - Ara�t�rma bu repoda, uygulama denemesi Growth OS ba�lam�nda

2026-10-23: Kullan�c� ara� ara�t�rmas� ve kar��la�t�rman�n Task reposunda yap�lmas�n� kabul edip ba�lat�lmas�n� istedi. research/ dosyalar� mevcut TaskProof runtime'�ndan ba��ms�zd�r. Growth OS'e entegrasyon, yeni panel veya yeni repo gerektirmez. Ara�lar�n �cretsiz ko�ullar� resm� kaynak ve tarihle yaz�l�r. Sentetik haz�rl�k, ger�ek kullan�c� deneyi ve �retici iddias� kar��t�r�lmaz. �lk s�n�rland�r�lm�� deney SEO bulgusundan T�rk�e uygulanabilir �neridir; model/insan zaman� ve maliyet �l��lmeden kazanan se�ilmez. Promptfoo aday �l��m arac�d�r; kurulu veya �al���r diye g�sterilmez.

## ADR-010 - Yeni model motoru yerine offline test aktar�m�

2026-10-23: Promptfoo'nun test bi�imine dar bir offline exporter eklendi. Sa�lay�c� SDK's�, model �a�r�s�, de�erlendirme motoru veya panel eklenmez. reported veri rapor kayna��na ba�l�d�r; fresh/live diye etiketlenmez. Ayn� istemde baseline olmadan eski farkl� g�rev ��kt�s� A/B sonucu say�lmaz. Mevcut dizine yazma reddedilir, �l��lmeyenler null/not_run kal�r. Hash'ler kimlik do�rulama de�il bayt ba��d�r. Ger�ek sa�lay�c� eri�imi olmad���ndan T-010 canl� deney a��k kal�r.

## ADR-011 - Metadata eri�imini �retim/kotadan ay�r

2026-10-23: Kullan�c� GitHub Actions secret yolunu se�ti ve ekledi�ini bildirdi. Anahtar yaln�z main'den elle ba�lat�lan ayr� workflow'un tek metadata ad�m�nda kullan�l�r; normal PR/push testlerine verilmez. Sabit Google URL'ye tek GET yap�l�r; �retim, prompt veya �cretli fallback yoktur. Metadata ba�ar�s� �cretsiz katman/kalan kota/�retim yetkisi de�ildir. Workflow dispatch arac� yoksa eri�im haz�rland� diye canl� test yap�ld��� s�ylenmez; kullan�c�ya tek ba�latma ad�m� verilir.

## ADR-012 - A��k kullan�c� iste�iyle yaln�z bir Free Tier �retim denemesi

2026-10-23: Kullan�c� Free Tier oldu�unu do�rulay�p denemeyi istedi. GitHub connector dispatch sa�lamad���ndan bir request dosyas�n�n ilk main ge�i�ine ba�l� tek seferlik push workflow'u se�ildi. Tam event.before ve run_attempt=1 ko�ullar�, PR ve gelecekteki push/rerun �retimini engeller. Yaln�z R-atik-su, sabit model, bir POST/aday, output/time/body limitleri; retry/fallback yok. Ba�ar� kalite veya tam A/B sonucu de�ildir. Billing/kota �l��lmedi�i i�in maliyet bilinmiyorsa null. Yeni model iste�i i�in yeni kullan�c� g�revi gerekir.


ADR-013: Metadata accepted the credential, but first trial failed before networking (run 39969104255, requestsAttempted=0). Remove provider-format assumptions, retain header safety and robust JSON redaction; re-arm a single new main transition because no authorized generation has been attempted. Do not retry if requestsAttempted becomes 1.
