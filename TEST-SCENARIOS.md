# E-Commerce Platform Test Senaryoları

## 🌐 URL'ler
- **Frontend**: https://green-ground-037b99003.7.azurestaticapps.net
- **Backend API**: https://ecommerce-azure.onrender.com
- **API Health**: https://ecommerce-azure.onrender.com/health

## 👤 Test Hesapları
- **Seller**: seller@demo.com / Demo1234
- **Yeni Müşteri**: Kayıt yaparak oluşturun

---

## ✅ TEST 1: Backend API Testleri

### 1.1 Health Check
```bash
curl https://ecommerce-azure.onrender.com/health
```
**Beklenen**: `{"status":"ok","timestamp":"..."}`

### 1.2 Kategorileri Listele
```bash
curl https://ecommerce-azure.onrender.com/api/categories
```
**Beklenen**: 14 kategori listesi

### 1.3 Ürünleri Listele
```bash
curl https://ecommerce-azure.onrender.com/api/products
```
**Beklenen**: 19 ürün, pagination bilgisi

### 1.4 Tek Ürün Detayı
```bash
curl https://ecommerce-azure.onrender.com/api/products/1
```
**Beklenen**: Ürün detayları, kategori, seller bilgisi

---

## ✅ TEST 2: Kullanıcı Kayıt ve Giriş

### 2.1 Yeni Müşteri Kaydı
**Adımlar**:
1. Frontend'e gidin
2. "Kayıt Ol" butonuna tıklayın
3. Bilgileri doldurun:
   - Ad Soyad: Test Kullanıcı
   - Email: test@example.com
   - Şifre: Test1234
   - Rol: Müşteri
4. "Kayıt Ol" butonuna tıklayın

**Beklenen**: 
- ✅ Başarılı kayıt mesajı
- ✅ Otomatik giriş yapılması
- ✅ Token localStorage'a kaydedilmesi

### 2.2 Seller ile Giriş
**Adımlar**:
1. "Giriş Yap" butonuna tıklayın
2. Email: seller@demo.com
3. Şifre: Demo1234
4. "Giriş Yap" butonuna tıklayın

**Beklenen**:
- ✅ Başarılı giriş
- ✅ Dashboard'a yönlendirme
- ✅ Seller menüsü görünmeli

---

## ✅ TEST 3: Ürün Listeleme ve Filtreleme

### 3.1 Ana Sayfa Ürünleri
**Adımlar**:
1. Ana sayfaya gidin
2. Ürün kartlarını kontrol edin

**Beklenen**:
- ✅ 19 ürün görünmeli
- ✅ Ürün resimleri yüklenmeli
- ✅ Fiyatlar doğru gösterilmeli
- ✅ İndirimli fiyatlar görünmeli (%10 indirim)

### 3.2 Kategoriye Göre Filtreleme
**Adımlar**:
1. "Cilt Bakımı" kategorisine tıklayın

**Beklenen**:
- ✅ Sadece cilt bakımı ürünleri görünmeli
- ✅ URL değişmeli (?category=1)

### 3.3 Ürün Arama
**Adımlar**:
1. Arama kutusuna "La Roche" yazın
2. Enter'a basın

**Beklenen**:
- ✅ La Roche-Posay ürünleri görünmeli
- ✅ Diğer ürünler filtrelenmeli

### 3.4 Fiyat Filtreleme
**Adımlar**:
1. Min: 100, Max: 200 girin
2. Filtrele butonuna tıklayın

**Beklenen**:
- ✅ 100-200 TL arası ürünler görünmeli

---

## ✅ TEST 4: Ürün Detay Sayfası

### 4.1 Ürün Detayına Git
**Adımlar**:
1. Herhangi bir ürüne tıklayın

**Beklenen**:
- ✅ Ürün adı, açıklama, fiyat görünmeli
- ✅ Stok bilgisi görünmeli
- ✅ "Sepete Ekle" butonu aktif olmalı
- ✅ Kategori ve seller bilgisi görünmeli

### 4.2 Sepete Ekleme
**Adımlar**:
1. Miktar seçin (örn: 2)
2. "Sepete Ekle" butonuna tıklayın

**Beklenen**:
- ✅ Başarı mesajı
- ✅ Sepet ikonu güncellenme li (2 ürün)

---

## ✅ TEST 5: Sepet İşlemleri

### 5.1 Sepeti Görüntüleme
**Adımlar**:
1. Sepet ikonuna tıklayın

**Beklenen**:
- ✅ Eklenen ürünler görünmeli
- ✅ Toplam fiyat doğru hesaplanmalı
- ✅ Miktar artırma/azaltma çalışmalı

### 5.2 Sepetten Ürün Çıkarma
**Adımlar**:
1. Bir ürünün "Sil" butonuna tıklayın

**Beklenen**:
- ✅ Ürün sepetten kaldırılmalı
- ✅ Toplam fiyat güncellenme li

### 5.3 Sipariş Verme
**Adımlar**:
1. "Siparişi Tamamla" butonuna tıklayın
2. Teslimat bilgilerini doldurun
3. "Sipariş Ver" butonuna tıklayın

**Beklenen**:
- ✅ Sipariş oluşturulmalı
- ✅ Sipariş numarası verilmeli
- ✅ Sepet temizlenmeli

---

## ✅ TEST 6: Seller Dashboard

### 6.1 Seller Girişi
**Adımlar**:
1. seller@demo.com ile giriş yapın
2. Dashboard'a gidin

**Beklenen**:
- ✅ Ürün listesi görünmeli (19 ürün)
- ✅ "Yeni Ürün Ekle" butonu görünmeli
- ✅ İstatistikler görünmeli

### 6.2 Yeni Ürün Ekleme
**Adımlar**:
1. "Yeni Ürün Ekle" butonuna tıklayın
2. Formu doldurun:
   - Ad: Test Ürünü
   - Açıklama: Test açıklaması
   - Fiyat: 99.90
   - Stok: 10
   - Kategori: Cilt Bakımı
3. "Kaydet" butonuna tıklayın

**Beklenen**:
- ✅ Ürün oluşturulmalı
- ✅ Ürün listesinde görünmeli

### 6.3 Ürün Düzenleme
**Adımlar**:
1. Bir ürünün "Düzenle" butonuna tıklayın
2. Fiyatı değiştirin
3. "Kaydet" butonuna tıklayın

**Beklenen**:
- ✅ Ürün güncellenme li
- ✅ Yeni fiyat görünmeli

### 6.4 Ürün Silme
**Adımlar**:
1. Test ürününün "Sil" butonuna tıklayın
2. Onaylayın

**Beklenen**:
- ✅ Ürün silinmeli
- ✅ Listeden kalkmalı

---

## ✅ TEST 7: Sipariş Yönetimi

### 7.1 Müşteri Siparişleri
**Adımlar**:
1. Müşteri hesabıyla giriş yapın
2. "Siparişlerim" sayfasına gidin

**Beklenen**:
- ✅ Verilen siparişler listelenmeli
- ✅ Sipariş durumu görünmeli
- ✅ Sipariş detayına gidilebilmeli

### 7.2 Seller Sipariş Yönetimi
**Adımlar**:
1. Seller hesabıyla giriş yapın
2. "Siparişler" sayfasına gidin

**Beklenen**:
- ✅ Gelen siparişler görünmeli
- ✅ Durum değiştirilebilmeli (Onaylandı, Kargoda, Teslim Edildi)

---

## ✅ TEST 8: Yorum ve Değerlendirme

### 8.1 Ürüne Yorum Yapma
**Adımlar**:
1. Bir ürün detay sayfasına gidin
2. Yorum formunu doldurun:
   - Puan: 5 yıldız
   - Yorum: "Harika ürün!"
3. "Gönder" butonuna tıklayın

**Beklenen**:
- ✅ Yorum eklenmeli
- ✅ Ortalama puan güncellenme li

---

## ✅ TEST 9: Performans ve Güvenlik

### 9.1 Sayfa Yükleme Hızı
**Beklenen**:
- ✅ Ana sayfa < 3 saniye
- ✅ Ürün listesi < 2 saniye
- ✅ API yanıt süresi < 500ms

### 9.2 CORS Kontrolü
**Beklenen**:
- ✅ Frontend'den backend'e istek atılabilmeli
- ✅ CORS hatası olmamalı

### 9.3 Authentication
**Beklenen**:
- ✅ Token olmadan korumalı endpoint'lere erişilememeli
- ✅ Yanlış token ile 401 hatası alınmalı

---

## ✅ TEST 10: Mobil Uyumluluk

### 10.1 Responsive Tasarım
**Adımlar**:
1. Tarayıcıyı mobil boyuta küçültün (375px)

**Beklenen**:
- ✅ Menü hamburger menüye dönüşmeli
- ✅ Ürün kartları tek sütun olmalı
- ✅ Tüm butonlar tıklanabilir olmalı

---

## 📊 TEST SONUÇLARI TABLOSU

| Test No | Test Adı | Durum | Notlar |
|---------|----------|-------|--------|
| 1.1 | Health Check | ⬜ | |
| 1.2 | Kategoriler | ⬜ | |
| 1.3 | Ürünler | ⬜ | |
| 2.1 | Kayıt | ⬜ | |
| 2.2 | Giriş | ⬜ | |
| 3.1 | Ürün Listesi | ⬜ | |
| 3.2 | Filtreleme | ⬜ | |
| 4.1 | Ürün Detay | ⬜ | |
| 4.2 | Sepete Ekle | ⬜ | |
| 5.1 | Sepet | ⬜ | |
| 5.3 | Sipariş | ⬜ | |
| 6.1 | Seller Dashboard | ⬜ | |
| 6.2 | Ürün Ekle | ⬜ | |

**Durum**: ✅ Başarılı | ❌ Başarısız | ⬜ Test Edilmedi

---

## 🐛 BULUNAN HATALAR

1. 
2. 
3. 

---

## 💡 İYİLEŞTİRME ÖNERİLERİ

1. 
2. 
3. 
