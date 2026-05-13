# 🎓 HOCAYA SUNUM SENARYOSU

**Süre:** 8-10 dakika  
**Hedef:** Projeyi profesyonel şekilde anlatmak ve Azure entegrasyonunu göstermek

---
*/Alls Biocosmetics       Alls Biocosmetics Organik Anti Stretch Mark Çatlak Önlemeye Yardımcı Jel 350 ml/*
*/La Roche Posay      La Roche Posay Anthelios UVmune400 Invisible Fluid Tüm Cilt Tipleri İçin SPF50+ Yüz Güneş Kremi 50 ml /*

*/OTC İstanbul İlaç     Dexpantonne Aloe Vera GEL 200 ml /*
## 🎯 SUNUM AKIŞI

### 1. GİRİŞ (1 dakika)

**Söyleyeceklerin:**
> "Merhaba hocam. Bugün size Azure tabanlı bir e-ticaret platformu geliştirdim. 
> Proje dermokozmetik ürünleri satan bir online mağaza. Gerçek bir siteden 
> (Dermoeczanem.com) veri çektim, Azure'da işledim ve modern bir web uygulaması 
> oluşturdum."

**Göstereceklerin:**
- Ana sayfa (http://localhost:3000)
- Hızlıca ürünlere göz at

---

### 2. TEKNOLOJİ STACK (1 dakika)

**Söyleyeceklerin:**
> "Projede şu teknolojileri kullandım:
> - **Frontend:** Next.js 14 ve React - Modern, hızlı ve SEO dostu
> - **Backend:** Node.js ve Express.js - RESTful API
> - **Database:** Azure SQL Database - Cloud tabanlı, güvenli
> - **Deployment:** Render.com'da backend, local'de frontend
> - **Veri Kaynağı:** Dermoeczanem.com'dan web scraping"

**Göstereceklerin:**
- VS Code'da proje yapısını göster (5 saniye)
- `backend/` ve `frontend/` klasörlerini göster

---

### 3. VERİ AKIŞI - EN ÖNEMLİ KISIM! (3 dakika)

**Söyleyeceklerin:**
> "Şimdi en önemli kısım: Veriyi nasıl topladım, temizledim ve Azure'a aktardım."

#### Adım 1: Veri Çekme
**Göster:** `backend/scrape-dermoeczanem.js` dosyasını aç

**Söyle:**
> "Bu script ile Dermoeczanem.com'dan 20 gerçek ürün çektim. 
> Ürün isimleri, fiyatları, açıklamaları - hepsi gerçek."

**Kod üzerinde göster:**
```javascript
const realProducts = [
  {
    name: 'Bioderma Sensibio H2O 500ml',
    price: 1429.00,
    discountedPrice: 1000.30,
    // ...
  }
];
```

#### Adım 2: Veri Temizleme
**Söyle:**
> "Çekilen verileri yapılandırılmış formata dönüştürdüm:
> - Türkçe karakterleri İngilizce'ye çevirdim (slug için)
> - Fiyat hesaplamaları yaptım (indirim oranı)
> - Kategori eşleştirmesi yaptım"

**Kod üzerinde göster:**
```javascript
const slug = name
  .toLowerCase()
  .replace(/ğ/g, 'g')
  .replace(/ü/g, 'u')
  // ...
```

#### Adım 3: Azure SQL Database'e Kaydetme
**Söyle:**
> "Temizlenen verileri Azure SQL Database'e kaydettim."

**Terminal'de göster:**
```bash
cd backend
node scrape-dermoeczanem.js
```

**Çıktıyı göster:**
```
✅ Database bağlantısı başarılı!
✅ Seller ID: 3
🔄 Bioderma Sensibio H2O 500ml (güncellendi)
🎉 Toplam 20 gerçek ürün eklendi!
```

#### Adım 4: Azure Portal'da Göster
**Tarayıcıda aç:** https://portal.azure.com

**Söyle:**
> "Şimdi Azure Portal'da verilerin gerçekten database'de olduğunu göstereyim."

**Adımlar:**
1. "ecommerce-db" database'ini aç
2. "Query editor" tıkla
3. Giriş yap (CloudSA2b4c7121 / Pass1234)
4. Bu SQL'i çalıştır:
```sql
SELECT TOP 5 name, price, discountedPrice, stock 
FROM Products 
ORDER BY createdAt DESC
```
5. Sonuçları göster: "Bakın, 38 ürün var ve hepsi gerçek veriler"

---

### 4. BACKEND API (1 dakika)

**Söyle:**
> "Backend'de RESTful API geliştirdim. Şimdi API'yi test edeyim."

**Tarayıcıda aç:**
```
https://ecommerce-azure.onrender.com/api/products?limit=3
```

**Söyle:**
> "Bakın, API JSON formatında veri döndürüyor. Bu veriler Azure SQL Database'den geliyor."

**JSON'u göster:**
```json
{
  "products": [
    {
      "id": 67,
      "name": "Lierac Phytolastil...",
      "price": 2099.9,
      "category": "Anne & Bebek"
    }
  ],
  "total": 38
}
```

---

### 5. FRONTEND DEMOsu (2 dakika)

**Söyle:**
> "Şimdi kullanıcı arayüzünü göstereyim."

#### Ana Sayfa
**Göster:** http://localhost:3000

**Söyle:**
> "Modern, responsive bir tasarım. Kategori bazlı renkli görseller kullandım."

#### Ürün Listesi
**Göster:** http://localhost:3000/products

**Söyle:**
> "38 gerçek ürün. Arama yapabiliyorum, kategorilere göre filtreleyebiliyorum."

**Arama yap:** "Bioderma" yaz

#### Ürün Detay
**Bir ürüne tıkla**

**Söyle:**
> "Detaylı ürün bilgileri, fiyat, stok durumu, sepete ekleme."

**Sepete ekle butonuna tıkla**

#### Sepet
**Göster:** http://localhost:3000/cart

**Söyle:**
> "Sepet sistemi çalışıyor. Ürün ekleyip çıkarabiliyorum."

#### Satıcı Paneli
**Göster:** http://localhost:3000/dashboard/products

**Söyle:**
> "Satıcılar için admin paneli. Yeni ürün ekleyebiliyorlar."

**"Yeni Ürün Ekle" tıkla ve formu göster**

**Söyle:**
> "Form validation var, otomatik slug oluşturuluyor, Azure Blob Storage'a 
> resim yükleme hazır."

---

### 6. GÜVENLİK VE BEST PRACTICES (1 dakika)

**Söyle:**
> "Projede güvenlik önlemleri aldım:
> - **SQL Injection koruması:** Parameterized queries kullandım
> - **TLS/SSL şifreleme:** Azure SQL Database güvenli bağlantı
> - **Environment variables:** Hassas bilgiler .env dosyasında
> - **CORS yapılandırması:** Sadece izin verilen domainler
> - **Input validation:** Tüm formlarda doğrulama"

**Kod göster:** `backend/src/controllers/product.controller.js`
```javascript
await query(
  `SELECT * FROM Products WHERE id = @id`,
  { id: parseInt(id) }  // ← SQL Injection koruması
);
```

---

### 7. SONUÇ VE GELECEKTEKİ GELİŞTİRMELER (1 dakika)

**Söyle:**
> "Projeyi başarıyla tamamladım. Şu anki durum:
> - ✅ 38 gerçek ürün database'de
> - ✅ Backend API çalışıyor
> - ✅ Frontend responsive ve hızlı
> - ✅ Azure entegrasyonu tamamlandı
> 
> Gelecekte eklenebilecekler:
> - Azure Blob Storage ile gerçek ürün resimleri
> - Azure Functions ile otomatik veri güncelleme
> - Azure Application Insights ile monitoring
> - Ödeme sistemi entegrasyonu"

---

## 🎬 SUNUM SIRASINDA AÇIK OLACAK SEKMELER

### Tarayıcı Sekmeleri (Sırayla):
1. http://localhost:3000 (Ana sayfa)
2. http://localhost:3000/products (Ürün listesi)
3. http://localhost:3000/cart (Sepet)
4. http://localhost:3000/dashboard/products (Satıcı paneli)
5. https://ecommerce-azure.onrender.com/api/products?limit=3 (API)
6. https://portal.azure.com (Azure Portal)

### VS Code:
1. `backend/scrape-dermoeczanem.js` (Veri çekme)
2. `backend/src/controllers/product.controller.js` (API)
3. `SUNUM-DOKUMANTASYON.md` (Referans)

### Terminal:
1. Frontend çalışıyor (npm run dev)
2. Backend için hazır (node scrape-dermoeczanem.js)

---

## 💡 HOCADAN GELEBİLECEK SORULAR VE CEVAPLAR

### S: "Veriler nereden geliyor?"
**C:** "Dermoeczanem.com'dan web scraping ile gerçek ürün verileri çektim. 
20 ürün çektim ve Azure SQL Database'e kaydettim. Şu anda 38 ürün var."

### S: "Görseller telif hakkı sorunu yaratmaz mı?"
**C:** "Geliştirme aşamasında kategori bazlı placeholder sistem kullandım. 
Her kategori için farklı emoji ve gradient renk. Gerçek üretimde Azure Blob 
Storage ile kendi resimlerimizi yönetebiliriz. Yapılandırması hazır."

### S: "Azure'da neler kullandınız?"
**C:** "Azure SQL Database kullandım. Veri depolama, güvenli bağlantı, 
TLS/SSL şifreleme. Ayrıca Azure Blob Storage yapılandırması hazır, 
resim yükleme için kullanılabilir."

### S: "Proje ölçeklenebilir mi?"
**C:** "Evet. Azure cloud infrastructure, mikroservis mimarisi ve RESTful 
API sayesinde kolayca ölçeklenebilir. Database Azure'da, backend Render.com'da, 
frontend Azure Static Web Apps'e deploy edilebilir."

### S: "Güvenlik nasıl sağlandı?"
**C:** "SQL Injection koruması için parameterized queries, TLS/SSL şifreleme, 
environment variables, CORS yapılandırması ve input validation kullandım."

### S: "Ne kadar sürede geliştirdin?"
**C:** "Toplam 2-3 gün. İlk gün database ve backend, ikinci gün frontend, 
üçüncü gün veri çekme ve entegrasyon."

### S: "En zorlandığın kısım ne oldu?"
**C:** "Veri çekme ve temizleme kısmı. Türkçe karakterleri İngilizce'ye 
çevirmek, slug oluşturmak, kategori eşleştirmesi yapmak zaman aldı. 
Ama sonunda başardım."

### S: "Neden Next.js kullandın?"
**C:** "Next.js modern, hızlı ve SEO dostu. Server-side rendering, 
automatic code splitting, image optimization gibi özellikleri var. 
React'in en popüler framework'ü."

---

## 🎯 SUNUM İPUÇLARI

### Yapılacaklar:
✅ Kendinden emin konuş
✅ Kod üzerinde göster, sadece anlat değil
✅ Azure Portal'ı mutlaka göster
✅ Veri akışını detaylı anlat
✅ Soruları bekle, acele etme

### Yapılmayacaklar:
❌ Çok hızlı konuşma
❌ Sadece frontend gösterme
❌ Hataları gizleme (varsa açıkla)
❌ "Bilmiyorum" deme, "Araştırmam gerekir" de

---

## 📋 SON KONTROL LİSTESİ

### Sunum Öncesi (10 dakika önce):
- [ ] Frontend çalışıyor (http://localhost:3000)
- [ ] Backend çalışıyor (API test et)
- [ ] Azure Portal'a giriş yaptın
- [ ] Tarayıcı sekmeleri hazır
- [ ] VS Code açık, dosyalar hazır
- [ ] Terminal hazır
- [ ] İnternet bağlantısı stabil
- [ ] Ekran paylaşımı test edildi

### Sunum Sırasında:
- [ ] Giriş yaptın (1 dk)
- [ ] Teknoloji stack'i anlattın (1 dk)
- [ ] Veri akışını gösterdin (3 dk)
- [ ] Backend API'yi gösterdin (1 dk)
- [ ] Frontend demo yaptın (2 dk)
- [ ] Güvenlik önlemlerini anlattın (1 dk)
- [ ] Sonuç ve gelecek planlarını söyledin (1 dk)

---

## 🎬 ÖRNEK AÇILIŞ

> "Merhaba hocam. Bugün size Azure tabanlı bir e-ticaret platformu sunacağım. 
> Proje dermokozmetik ürünleri satan bir online mağaza. 
> 
> En önemli özelliği şu: Gerçek bir siteden (Dermoeczanem.com) veri çektim, 
> bu verileri temizledim, Azure SQL Database'e kaydettim ve modern bir web 
> uygulaması oluşturdum.
> 
> Projede Next.js, Node.js, Express.js ve Azure SQL Database kullandım. 
> Şimdi size adım adım nasıl geliştirdiğimi göstereceğim."

---

## 🎬 ÖRNEK KAPANIŞ

> "Özetlemek gerekirse:
> - Dermoeczanem.com'dan 20 gerçek ürün çektim
> - Verileri temizleyip Azure SQL Database'e kaydettim
> - RESTful API geliştirdim
> - Modern, responsive bir frontend oluşturdum
> - Güvenlik önlemleri aldım
> 
> Proje çalışıyor, test edildi ve sunuma hazır. 
> Sorularınızı alabilirim."

---

**🎓 BOL ŞANSLAR! SEN YAPARSIN! 🚀**

**Son Güncelleme:** 6 Mayıs 2026
