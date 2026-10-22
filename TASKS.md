# Görev bağlantıları

| Görev | Durum | Bağımlılık | Somut çıktı |
|---|---|---|---|
| T-001 Kanıt sözleşmesi ve karar motoru | Tamamlandı | Yok | engine + testler + evidence-contract |
| T-002 Yerel panel ve örnek kayıt | Tamamlandı | T-001 | gerçek snapshot + sentetik demo + import/export |
| T-003 Doğrulama ve taşınabilir devir | Kısmi; gerçek tarayıcı kontrolü bekliyor | T-001, T-002 | motor/handler testleri geçti; loopback ve UI engelli; belgeler hazır |
| T-004 GitHub salt okuma adapteri | Planlandı, başlanmadı | T-003 | PR/head/run metadata; SHA ve sayfalama testleri |
| T-005 Senaryo kanıtı alma ve eşleme | Bekliyor | T-004 | test sonuçları + incelenen kriter eşlemeleri |
| T-006 İzole runner tasarımı ve uygulaması | Bekliyor | T-005 | secret taşımayan sınırlı test ortamı |
| T-007 Preview davranış kontrolü | Bekliyor | T-005, T-006 | uygun önizleme üzerinde tarayıcı senaryoları |
| T-008 Gerçek fayda deneyi | Bekliyor | T-005; UI şartları için T-007 | olumlu/eksik PR karşılaştırması ve süre ölçümü |

```mermaid
flowchart TD
  A["T-001 Kanıt motoru"] --> B["T-002 Panel"]
  B --> C["T-003 Devir"]
  C --> D["T-004 GitHub adapteri"]
  D --> E["T-005 Senaryo kanıtı"]
  E --> F["T-006 İzole runner"]
  F --> G["T-007 Preview kontrolü"]
  E --> H["T-008 Fayda ölçümü"]
  G --> H
```

Bir görevde çalışma bitince durum, test ve açık madde ilgili görev dosyası ile STATE.md'de birlikte güncellenir.
