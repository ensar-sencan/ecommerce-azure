# AzureShop — E-Ticaret + Satıcı Rakip Analizi Platformu

Microsoft Azure üzerinde çalışan tam işlevsel e-ticaret uygulaması ve satıcılara özel AI destekli rakip analizi dashboard'u.

---

## Mimari

```
┌─────────────────────────────────────────────────────────────┐
│                        KULLANICI                            │
│                    (Browser / Mobile)                       │
└──────────────────────────┬──────────────────────────────────┘
                           │
            ┌──────────────▼──────────────┐
            │   Azure Static Web Apps     │
            │   (Next.js Frontend)        │
            └──────────────┬──────────────┘
                           │ REST API
            ┌──────────────▼──────────────┐
            │   Azure App Service         │
            │   (Node.js + Express API)   │
            │   Docker Container          │
            └──────┬───────────┬──────────┘
                   │           │
        ┌──────────▼──┐  ┌─────▼──────────┐
        │  Azure SQL  │  │  Azure Blob    │
        │  Database   │  │  Storage       │
        │  (Ana DB)   │  │  (Görseller)   │
        └─────────────┘  └────────────────┘
                   │
        ┌──────────▼──────────┐
        │  Azure Functions    │
        │  (Gece istatistik   │
        │   güncelleme)       │
        └──────────┬──────────┘
                   │
        ┌──────────▼──────────┐
        │  Azure OpenAI       │
        │  (AI Öneriler)      │
        └─────────────────────┘
```

## Kullanıcı Rolleri

| Rol | Yetkiler |
|-----|----------|
| **Müşteri** | Ürün listele, sepet, sipariş ver |
| **Satıcı** | Ürün yönet + Rakip Analizi Dashboard |
| **Admin** | Tüm sistemi yönet |

## Satıcı Plan Seviyeleri

| Plan | Özellikler |
|------|-----------|
| **Ücretsiz** | Kendi satış istatistikleri |
| **Standart** | + Rakip fiyat ortalaması, kategori sıralaması, pazar payı |
| **Premium** | + Azure OpenAI AI önerileri, trend analizi |

---

## Kurulum

### 1. Gereksinimler
- Node.js 20+
- Docker & Docker Compose
- Azure hesabı (SQL, Blob, OpenAI servisleri)

### 2. Yerel Geliştirme

```bash
# Backend
cd backend
cp .env.example .env   # Azure bağlantı bilgilerini doldurun
npm install
npm run dev

# Frontend (ayrı terminal)
cd frontend
npm install
npm run dev
```

### 3. Docker ile Çalıştırma

```bash
cd docker
cp ../.env.example .env
docker compose up --build
```

### 4. Veritabanı Migration

Azure SQL üzerinde sırasıyla çalıştırın:
```
database/migrations/001_create_tables.sql
database/migrations/002_seed_categories.sql
database/migrations/003_views_and_procs.sql
```

---

## API Endpoint'leri

### Auth
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| POST | `/api/auth/register` | Kayıt ol |
| POST | `/api/auth/login` | Giriş yap |
| GET  | `/api/auth/me` | Profil bilgisi |

### Ürünler
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET  | `/api/products` | Listele (filtre, arama, sayfalama) |
| GET  | `/api/products/:id` | Ürün detayı |
| POST | `/api/products` | Ürün ekle (Satıcı) |
| PUT  | `/api/products/:id` | Güncelle (Satıcı) |
| DELETE | `/api/products/:id` | Sil (Satıcı) |

### Siparişler
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| POST | `/api/orders` | Sipariş oluştur |
| GET  | `/api/orders/my` | Siparişlerim |
| GET  | `/api/orders/:id` | Sipariş detayı |
| PATCH | `/api/orders/:id/status` | Durum güncelle (Satıcı) |

### Satıcı Analitik
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/analytics/stats` | Performans istatistikleri |
| GET | `/api/analytics/competitors?plan=standard` | Rakip analizi |
| GET | `/api/analytics/ai-insights?plan=premium` | AI önerileri |

---

## CI/CD Pipeline

```
Push to staging → Test → Build Docker → ACR → Deploy Staging
Push to main    → Test → Build Docker → ACR → Deploy Production
```

### GitHub Secrets Gereksinimleri
- `ACR_REGISTRY` — Azure Container Registry URL
- `ACR_USERNAME` / `ACR_PASSWORD`
- `AZURE_CREDENTIALS` — Service Principal JSON
- `STAGING_BACKEND_APP` / `PROD_BACKEND_APP` — App Service isimleri
- `STAGING_SWA_TOKEN` / `PROD_SWA_TOKEN` — Static Web Apps token'ları
- `API_URL` — Backend public URL

---

## Proje Klasör Yapısı

```
/
├── backend/
│   └── src/
│       ├── app.js              # Express uygulama
│       ├── server.js           # Başlangıç noktası
│       ├── config/             # DB ve Azure bağlantıları
│       ├── controllers/        # İş mantığı
│       ├── middleware/         # Auth, hata yönetimi
│       ├── routes/             # API endpoint tanımları
│       ├── services/           # AI servisi
│       └── utils/              # Azure Function
├── frontend/
│   └── src/
│       ├── app/                # Next.js App Router sayfaları
│       ├── components/         # UI bileşenleri
│       ├── lib/                # API istemcisi
│       └── store/              # Zustand state yönetimi
├── database/
│   └── migrations/             # SQL migration dosyaları
├── docker/                     # Dockerfile ve compose
└── .github/workflows/          # CI/CD pipeline
```
