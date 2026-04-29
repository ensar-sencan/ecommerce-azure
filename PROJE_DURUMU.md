# AzureShop — Proje Durum Dosyası
> Son güncelleme: 22 Nisan 2026

---

## TAMAMLANAN ADIMLAR ✅

### ADIM 1 — Proje İskeleti
- [x] Klasör yapısı oluşturuldu (`/backend`, `/frontend`, `/database`, `/docker`, `/.github/workflows`)
- [x] Yanlış oluşturulan `bulut_bilisim_projesi` klasörü silindi, tüm dosyalar doğru `bulut_bilişim_projesi` klasörüne taşındı

### ADIM 2 — Backend API (Node.js + Express)
- [x] `package.json` — tüm bağımlılıklar tanımlandı
- [x] `src/server.js` — başlangıç noktası, Azure Application Insights entegrasyonu
- [x] `src/app.js` — Express kurulumu, CORS, rate limiting, helmet, morgan
- [x] `src/config/database.js` — Azure SQL bağlantı havuzu (mssql)
- [x] `src/config/azure.js` — Blob Storage yükleme/silme
- [x] `src/middleware/auth.js` — JWT doğrulama + rol bazlı yetkilendirme (customer / seller / admin)
- [x] `src/middleware/errorHandler.js` — merkezi hata yönetimi
- [x] `src/middleware/validate.js` — express-validator entegrasyonu
- [x] **Controllers:**
  - [x] `auth.controller.js` — register, login, getMe
  - [x] `product.controller.js` — CRUD + sayfalama + arama + view tracking
  - [x] `order.controller.js` — sipariş oluşturma, stok kontrolü, seller stats güncelleme
  - [x] `analytics.controller.js` — freemium rakip analizi (free/standard/premium)
  - [x] `review.controller.js` — yorum ekleme (sadece teslim edilen siparişler)
  - [x] `category.controller.js` — kategori ağacı
- [x] **Routes:** auth, products, orders, categories, reviews, seller, analytics, upload
- [x] `src/services/ai.service.js` — Azure OpenAI entegrasyonu (GPT-4)
- [x] `src/utils/azureFunction.js` — gece istatistik güncelleme (Azure Function trigger)
- [x] `tests/auth.test.js` — 4 unit test (hepsi geçiyor ✅)
- [x] `npm install` tamamlandı
- [x] Tüm dosyalar `node --check` ile syntax doğrulamasından geçti

### ADIM 3 — Veritabanı Migration Dosyaları
- [x] `001_create_tables.sql` — 7 tablo + indexler
  - Users, Categories, Products, Orders, OrderItems, Reviews, SellerStats
- [x] `002_seed_categories.sql` — 19 kategori (Elektronik, Giyim, Ev & Yaşam vb.)
- [x] `003_views_and_procs.sql` — 2 view + `sp_RecalcSellerStats` stored procedure

### ADIM 4 — Frontend (Next.js 14 + Tailwind + TypeScript)
- [x] `package.json`, `tsconfig.json`, `tailwind.config.js`, `postcss.config.js`, `next.config.js`
- [x] `src/app/globals.css` — Tailwind base + özel component class'ları (.btn-primary, .card, .input)
- [x] `src/lib/api.ts` — Axios istemcisi (JWT otomatik header, 401→redirect)
- [x] **State Yönetimi (Zustand):**
  - [x] `src/store/authStore.ts` — kullanıcı oturumu (persist)
  - [x] `src/store/cartStore.ts` — sepet (persist, localStorage)
- [x] **Sayfalar:**
  - [x] `/` — Ana sayfa (hero, özellikler, fiyatlandırma)
  - [x] `/products` — Ürün listesi (arama, lazy load, skeleton)
  - [x] `/products/[id]` — Ürün detay (galeri, miktar seçici, yorumlar, rating)
  - [x] `/cart` — Sepet (miktar güncelle, sil, özet)
  - [x] `/checkout` — Sipariş onay → başarı ekranı
  - [x] `/orders` — Sipariş geçmişi listesi
  - [x] `/orders/[id]` — Sipariş detay + durum takip çubuğu
  - [x] `/auth/login` — Giriş formu
  - [x] `/auth/register` — Kayıt formu (müşteri / satıcı seçimi)
  - [x] `/dashboard` — Satıcı analitik (tab: Performans / Rakip / AI)
  - [x] `/dashboard/products` — Satıcı ürün tablosu (görüntülenme, satış, gelir)
- [x] **Bileşenler:**
  - [x] `Navbar.tsx` — rol bazlı linkler (satıcı: Dashboard + Ürünlerim, müşteri: Siparişlerim)
  - [x] `SellerDashboard.tsx` — BarChart + dönüşüm grafikleri (Recharts)
  - [x] `CompetitorPanel.tsx` — fiyat sıralaması tablosu + pazar payı progress bar
  - [x] `ProductFormModal.tsx` — ürün ekleme/düzenleme modal formu (görsel yükleme dahil)
  - [x] `Toaster.tsx` — bildirim altyapısı (Radix UI)
- [x] `npm install` tamamlandı
- [x] `npx tsc --noEmit` — **sıfır TypeScript hatası** ✅

### ADIM 5 — Docker
- [x] `docker/Dockerfile.backend` — multi-stage build, non-root user, healthcheck
- [x] `docker/Dockerfile.frontend` — multi-stage Next.js standalone build
- [x] `docker/docker-compose.yml` — backend + frontend, health dependency
- [x] `.dockerignore`

### ADIM 6 — CI/CD Pipeline
- [x] `.github/workflows/ci-cd.yml` — 4 aşamalı GitHub Actions:
  1. **Test** — Jest unit testleri
  2. **Build & Push** — Docker image → Azure Container Registry
  3. **Deploy Staging** — `staging` branch → Staging ortamı
  4. **Deploy Production** — `main` branch → Production ortamı

---

## SIRADAKI ADIMLAR 🔜

### ADIM 7 — Azure Altyapısı Kurulumu *(yarın yapılacak)*

> **Ön koşul:** portal.azure.com üzerinden ücretsiz Azure hesabı açılacak ($200 kredi, 30 gün)

Sırasıyla oluşturulacak servisler:

| # | Servis | Komut | Amaç |
|---|--------|-------|------|
| 1 | Resource Group | `az group create` | Tüm servislerin çatısı |
| 2 | Azure SQL Server | `az sql server create` | Veritabanı sunucusu |
| 3 | Azure SQL Database | `az sql db create` | Ana veritabanı (S1 tier) |
| 4 | Storage Account | `az storage account create` | Blob Storage altyapısı |
| 5 | Blob Container | `az storage container create` | Ürün görselleri |
| 6 | Container Registry | `az acr create` | Docker image deposu |
| 7 | App Service Plan | `az appservice plan create` | Backend için sunucu planı |
| 8 | App Service | `az webapp create` | Backend deploy ortamı |
| 9 | Static Web App | `az staticwebapp create` | Frontend deploy ortamı |
| 10 | Application Insights | `az monitor app-insights component create` | Monitoring & logging |
| 11 | Azure OpenAI | Portal'dan başvuru | AI öneri sistemi |

### ADIM 8 — Veritabanı Kurulumu
- [ ] Azure SQL'e bağlan (Azure Data Studio veya SSMS)
- [ ] `001_create_tables.sql` çalıştır
- [ ] `002_seed_categories.sql` çalıştır
- [ ] `003_views_and_procs.sql` çalıştır
- [ ] `.env` dosyasını Azure bağlantı bilgileriyle doldur

### ADIM 9 — GitHub & CI/CD Aktifleştirme
- [ ] GitHub reposu oluştur (`git init` → `git push`)
- [ ] GitHub Actions Secrets ekle:
  - `ACR_REGISTRY`, `ACR_USERNAME`, `ACR_PASSWORD`
  - `AZURE_CREDENTIALS` (Service Principal)
  - `STAGING_BACKEND_APP`, `PROD_BACKEND_APP`
  - `STAGING_SWA_TOKEN`, `PROD_SWA_TOKEN`
  - `API_URL`
- [ ] İlk commit → pipeline otomatik çalışacak

### ADIM 10 — Test & Son Dokunuşlar
- [ ] Staging ortamında uçtan uca test (kayıt → ürün → sepet → sipariş)
- [ ] Satıcı dashboard'u gerçek veriyle test
- [ ] Azure OpenAI AI öneriler testi (premium plan)
- [ ] Production deploy

---

## TEKNİK REFERANS

### Proje Klasör Yapısı
```
bulut_bilişim_projesi/
├── .github/workflows/ci-cd.yml     ← GitHub Actions
├── backend/
│   ├── src/
│   │   ├── app.js                  ← Express ana uygulama
│   │   ├── server.js               ← Başlangıç noktası
│   │   ├── config/                 ← DB + Azure bağlantıları
│   │   ├── controllers/            ← İş mantığı (6 controller)
│   │   ├── middleware/             ← Auth, hata, validasyon
│   │   ├── routes/                 ← API endpoint'leri (8 router)
│   │   ├── services/               ← Azure OpenAI servisi
│   │   └── utils/                  ← Azure Function timer
│   ├── tests/                      ← Jest unit testleri
│   └── package.json
├── frontend/
│   └── src/
│       ├── app/                    ← Next.js sayfaları (11 sayfa)
│       ├── components/             ← UI bileşenleri
│       ├── lib/                    ← Axios API istemcisi
│       └── store/                  ← Zustand (auth + cart)
├── database/migrations/            ← 3 SQL migration dosyası
├── docker/                         ← 2 Dockerfile + compose
└── README.md
```

### API Endpoint Özeti
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

GET    /api/products               ?search= &category= &page= &sort=
GET    /api/products/:id
POST   /api/products               [seller]
PUT    /api/products/:id           [seller]
DELETE /api/products/:id           [seller]

GET    /api/products/:id/reviews
POST   /api/products/:id/reviews   [customer - sadece teslim edilenler]

POST   /api/orders                 [customer]
GET    /api/orders/my              [customer]
GET    /api/orders/:id
PATCH  /api/orders/:id/status      [seller/admin]

GET    /api/seller/products        [seller]
GET    /api/seller/orders          [seller]

GET    /api/analytics/stats        [seller - tüm planlar]
GET    /api/analytics/competitors  [seller - standard+]
GET    /api/analytics/ai-insights  [seller - premium]

GET    /api/categories
POST   /api/categories             [admin]

POST   /api/upload/image           [seller]
```

### Kullanıcı Rolleri
| Rol | Yetki |
|-----|-------|
| `customer` | Ürün listele, sepet, sipariş ver, yorum yaz |
| `seller` | Ürün yönet, siparişleri yönet, dashboard, rakip analizi |
| `admin` | Her şeyi yönetir |

### Freemium Plan Seviyeleri
| Plan | Özellik |
|------|---------|
| `free` | Sadece kendi satış istatistikleri |
| `standard` | + Rakip fiyat ortalaması, kategori sıralaması, pazar payı |
| `premium` | + Azure OpenAI AI önerileri, stok fırsatları, trend analizi |
