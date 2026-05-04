# Azure E-Commerce Platform - Bulut Bilişim Projesi

Modern, ölçeklenebilir ve güvenli bir e-ticaret platformu. Tamamen Azure ve Render.com bulut servisleri üzerinde çalışmaktadır.

## 🚀 Canlı Demo

- **Frontend**: https://green-ground-037b99003.7.azurestaticapps.net
- **Backend API**: https://ecommerce-azure.onrender.com
- **API Health Check**: https://ecommerce-azure.onrender.com/health

## 🏗️ Mimari

### Frontend
- **Framework**: Next.js 14 (React)
- **Styling**: Tailwind CSS
- **Deployment**: Azure Static Web Apps
- **Features**: 
  - Server-side rendering (SSR)
  - Responsive tasarım
  - Modern UI/UX

### Backend
- **Framework**: Node.js + Express
- **Database**: Azure SQL Database
- **Storage**: Azure Blob Storage (ürün görselleri)
- **Deployment**: Render.com
- **Features**:
  - RESTful API
  - JWT Authentication
  - Role-based access control (Buyer/Seller)
  - Rate limiting
  - CORS yapılandırması

### Database
- **Platform**: Azure SQL Database
- **Features**:
  - İlişkisel veri modeli
  - Stored procedures
  - Views
  - Otomatik yedekleme

## 📦 Özellikler

### Kullanıcı Özellikleri
- ✅ Kullanıcı kaydı ve girişi
- ✅ Ürün arama ve filtreleme
- ✅ Sepet yönetimi
- ✅ Sipariş oluşturma ve takibi
- ✅ Ürün yorumları ve değerlendirmeleri

### Satıcı Özellikleri
- ✅ Ürün ekleme/düzenleme/silme
- ✅ Stok yönetimi
- ✅ Sipariş yönetimi
- ✅ Satış analitiği
- ✅ Rakip fiyat analizi (AI destekli)

### Admin Özellikleri
- ✅ Kategori yönetimi
- ✅ Kullanıcı yönetimi
- ✅ Sistem analitiği

## 🛠️ Teknolojiler

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- mssql (Azure SQL driver)
- JWT (jsonwebtoken)
- bcryptjs
- Azure Blob Storage SDK
- Azure OpenAI (AI özellikler için)

### DevOps & Cloud
- Azure Static Web Apps
- Azure SQL Database
- Azure Blob Storage
- Render.com
- GitHub Actions (CI/CD)

## 📁 Proje Yapısı

```
ecommerce-azure/
├── frontend/                 # Next.js frontend
│   ├── src/
│   │   ├── app/             # Next.js App Router
│   │   ├── components/      # React bileşenleri
│   │   └── lib/             # Utility fonksiyonlar
│   └── public/              # Statik dosyalar
│
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── config/          # Yapılandırma
│   │   └── utils/           # Utility fonksiyonlar
│   └── tests/               # Test dosyaları
│
├── database/                # Database scripts
│   ├── migrations/          # SQL migration scripts
│   └── seeds/               # Seed data
│
└── docker/                  # Docker yapılandırması
    ├── Dockerfile.backend
    └── Dockerfile.frontend
```

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+
- Azure hesabı
- Render.com hesabı

### Backend Kurulumu

```bash
cd backend
npm install
cp .env.example .env
# .env dosyasını düzenleyin
npm start
```

### Frontend Kurulumu

```bash
cd frontend
npm install
cp .env.local.example .env.local
# .env.local dosyasını düzenleyin
npm run dev
```

## 🔐 Environment Variables

### Backend (.env)
```env
NODE_ENV=production
PORT=8080

# Azure SQL Database
DB_SERVER=your-server.database.windows.net
DB_NAME=your-database
DB_USER=your-username
DB_PASSWORD=your-password
DB_PORT=1433

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Azure Blob Storage
AZURE_STORAGE_CONNECTION_STRING=your-connection-string
AZURE_STORAGE_CONTAINER=product-images

# CORS
FRONTEND_URL=https://your-frontend-url.com
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `GET /api/auth/me` - Mevcut kullanıcı bilgisi

### Products
- `GET /api/products` - Tüm ürünleri listele
- `GET /api/products/:id` - Ürün detayı
- `POST /api/products` - Yeni ürün ekle (Seller)
- `PUT /api/products/:id` - Ürün güncelle (Seller)
- `DELETE /api/products/:id` - Ürün sil (Seller)

### Orders
- `GET /api/orders` - Kullanıcının siparişleri
- `GET /api/orders/:id` - Sipariş detayı
- `POST /api/orders` - Yeni sipariş oluştur
- `PUT /api/orders/:id/status` - Sipariş durumu güncelle (Seller)

### Categories
- `GET /api/categories` - Tüm kategoriler
- `POST /api/categories` - Yeni kategori (Admin)

### Reviews
- `GET /api/products/:productId/reviews` - Ürün yorumları
- `POST /api/products/:productId/reviews` - Yorum ekle

## 🧪 Test

```bash
cd backend
npm test
npm run test:coverage
```

## 📈 Performans

- **Backend Response Time**: ~200ms
- **Database Query Time**: ~50ms
- **Frontend Load Time**: ~1.5s
- **Lighthouse Score**: 90+

## 🔒 Güvenlik

- JWT tabanlı authentication
- Bcrypt ile şifre hashleme
- SQL injection koruması (parameterized queries)
- XSS koruması (Helmet.js)
- Rate limiting
- CORS yapılandırması
- HTTPS zorunluluğu

## 👥 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'feat: Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📝 Lisans

Bu proje eğitim amaçlı geliştirilmiştir.

## 📧 İletişim

Proje Sahibi - Bulut Bilişim Projesi

Project Link: https://github.com/ensar-sencan/ecommerce-azure

---

**⭐ Projeyi beğendiyseniz yıldız vermeyi unutmayın!**
