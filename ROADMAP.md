# Yol haritası

| Faz | Teslim | Çıkış şartı |
|---|---|---|
| 0 — Çalışan çekirdek | T-001, T-002, T-003 | Commit kuralları testli; gerçek/sentetik ayrımı görünür; devir belgeleri güncel |
| 1 — Gerçek GitHub kanıtı | T-004, T-005 | PR head değişimi algılanır; test bazlı kaynağı olmayan şart doğrulanmaz |
| 2 — Davranış kontrolü | T-006, T-007 | İzole runner; preview/DB sınırları açık; senaryo bazlı sonuçlar alınır |
| 3 — Fayda denemesi | T-008 | Bir olumlu ve bir bilinen eksik PR; manuel süre/yanlış pozitif/eksik kanıt karşılaştırması |
| 4 — Kullanıma açma kararı | Kullanıcı kararı | Kimlik doğrulama, deployment, maliyet ve bakım ihtiyacı kanıtlanırsa planlanır |

Ücretli AI sonradan yalnız öneri/yorum katmanı olabilir. Doğrulandı kararını LLM vermez. Başarı ölçümü için ilk denemede süre ve sonuçlar kaydedilir; gerçekleşmemiş tasarruf yüzdesi yazılmaz.
