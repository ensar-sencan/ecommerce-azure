-- ============================================================
-- Migration 001: Dermokozmetik Eczane - Ana Şema
-- ============================================================

-- Kullanıcılar
CREATE TABLE Users (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    name        NVARCHAR(100)  NOT NULL,
    email       NVARCHAR(255)  NOT NULL UNIQUE,
    password    NVARCHAR(255)  NOT NULL,
    role        NVARCHAR(20)   NOT NULL DEFAULT 'customer'
                               CHECK (role IN ('customer', 'seller', 'admin')),
    memberPlan  NVARCHAR(20)   NOT NULL DEFAULT 'free'
                               CHECK (memberPlan IN ('free', 'standard', 'premium')),
    phone       NVARCHAR(20)   NULL,
    createdAt   DATETIME2      NOT NULL DEFAULT GETUTCDATE()
);

CREATE INDEX IX_Users_email ON Users(email);
CREATE INDEX IX_Users_role  ON Users(role);

-- Markalar (La Roche-Posay, Vichy, Bioderma vb.)
CREATE TABLE Brands (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    name        NVARCHAR(100)  NOT NULL UNIQUE,
    slug        NVARCHAR(100)  NOT NULL UNIQUE,
    logoUrl     NVARCHAR(500)  NULL,
    description NVARCHAR(1000) NULL,
    isActive    BIT            NOT NULL DEFAULT 1,
    createdAt   DATETIME2      NOT NULL DEFAULT GETUTCDATE()
);

CREATE INDEX IX_Brands_slug ON Brands(slug);

-- Kategoriler (Cilt Bakımı, Saç Bakımı, Güneş Bakımı vb.)
CREATE TABLE Categories (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    name        NVARCHAR(100)  NOT NULL,
    slug        NVARCHAR(100)  NOT NULL UNIQUE,
    parentId    INT            NULL REFERENCES Categories(id),
    imageUrl    NVARCHAR(500)  NULL,
    isActive    BIT            NOT NULL DEFAULT 1,
    sortOrder   INT            NOT NULL DEFAULT 0
);

CREATE INDEX IX_Categories_slug     ON Categories(slug);
CREATE INDEX IX_Categories_parentId ON Categories(parentId);

-- Ürünler
CREATE TABLE Products (
    id              INT IDENTITY(1,1) PRIMARY KEY,
    sellerId        INT            NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    categoryId      INT            NOT NULL REFERENCES Categories(id),
    brandId         INT            NULL REFERENCES Brands(id),
    name            NVARCHAR(300)  NOT NULL,
    slug            NVARCHAR(300)  NOT NULL UNIQUE,
    description     NVARCHAR(MAX)  NULL,
    ingredients     NVARCHAR(MAX)  NULL,  -- İçindekiler
    howToUse        NVARCHAR(MAX)  NULL,  -- Kullanım talimatı
    skinType        NVARCHAR(200)  NULL,  -- Cilt tipi (Yağlı, Kuru, Karma vb.)
    volume          NVARCHAR(50)   NULL,  -- Hacim/Miktar (50ml, 100gr vb.)
    barcode         NVARCHAR(50)   NULL,  -- Barkod
    price           DECIMAL(18,2)  NOT NULL CHECK (price >= 0),
    discountedPrice DECIMAL(18,2)  NULL,  -- İndirimli fiyat (sepette indirim)
    discountRate    INT            NULL,  -- İndirim oranı (%)
    stock           INT            NOT NULL DEFAULT 0 CHECK (stock >= 0),
    imageUrl        NVARCHAR(500)  NULL,
    isActive        BIT            NOT NULL DEFAULT 1,
    isFeatured      BIT            NOT NULL DEFAULT 0,  -- Öne çıkan ürün
    isFlash         BIT            NOT NULL DEFAULT 0,  -- Flaş ürün
    freeShipping    BIT            NOT NULL DEFAULT 0,  -- Kargo bedava
    isOrganic       BIT            NOT NULL DEFAULT 0,  -- Doğal/Organik
    createdAt       DATETIME2      NOT NULL DEFAULT GETUTCDATE()
);

CREATE INDEX IX_Products_sellerId   ON Products(sellerId);
CREATE INDEX IX_Products_categoryId ON Products(categoryId);
CREATE INDEX IX_Products_brandId    ON Products(brandId);
CREATE INDEX IX_Products_slug       ON Products(slug);
CREATE INDEX IX_Products_price      ON Products(price);
CREATE INDEX IX_Products_isActive   ON Products(isActive);

-- Ürün Görselleri (birden fazla görsel)
CREATE TABLE ProductImages (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    productId   INT            NOT NULL REFERENCES Products(id) ON DELETE CASCADE,
    imageUrl    NVARCHAR(500)  NOT NULL,
    sortOrder   INT            NOT NULL DEFAULT 0,
    isMain      BIT            NOT NULL DEFAULT 0
);

CREATE INDEX IX_ProductImages_productId ON ProductImages(productId);

-- Siparişler
CREATE TABLE Orders (
    id              INT IDENTITY(1,1) PRIMARY KEY,
    customerId      INT            NOT NULL REFERENCES Users(id),
    totalPrice      DECIMAL(18,2)  NOT NULL,
    discountAmount  DECIMAL(18,2)  NOT NULL DEFAULT 0,
    shippingCost    DECIMAL(18,2)  NOT NULL DEFAULT 0,
    status          NVARCHAR(20)   NOT NULL DEFAULT 'pending'
                                   CHECK (status IN ('pending','confirmed','shipped','delivered','cancelled')),
    -- Teslimat adresi
    addressLine     NVARCHAR(500)  NULL,
    city            NVARCHAR(100)  NULL,
    district        NVARCHAR(100)  NULL,
    zipCode         NVARCHAR(10)   NULL,
    phone           NVARCHAR(20)   NULL,
    createdAt       DATETIME2      NOT NULL DEFAULT GETUTCDATE()
);

CREATE INDEX IX_Orders_customerId ON Orders(customerId);
CREATE INDEX IX_Orders_status     ON Orders(status);
CREATE INDEX IX_Orders_createdAt  ON Orders(createdAt);

-- Sipariş Kalemleri
CREATE TABLE OrderItems (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    orderId     INT            NOT NULL REFERENCES Orders(id) ON DELETE CASCADE,
    productId   INT            NOT NULL REFERENCES Products(id),
    quantity    INT            NOT NULL CHECK (quantity > 0),
    unitPrice   DECIMAL(18,2)  NOT NULL
);

CREATE INDEX IX_OrderItems_orderId   ON OrderItems(orderId);
CREATE INDEX IX_OrderItems_productId ON OrderItems(productId);

-- Yorumlar
CREATE TABLE Reviews (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    productId   INT            NOT NULL REFERENCES Products(id) ON DELETE CASCADE,
    customerId  INT            NOT NULL REFERENCES Users(id),
    rating      TINYINT        NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment     NVARCHAR(1000) NULL,
    isApproved  BIT            NOT NULL DEFAULT 1,
    createdAt   DATETIME2      NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT UQ_Reviews_product_customer UNIQUE (productId, customerId)
);

CREATE INDEX IX_Reviews_productId ON Reviews(productId);

-- Satıcı İstatistikleri
CREATE TABLE SellerStats (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    sellerId    INT            NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    productId   INT            NOT NULL REFERENCES Products(id),
    views       BIGINT         NOT NULL DEFAULT 0,
    sales       BIGINT         NOT NULL DEFAULT 0,
    revenue     DECIMAL(18,2)  NOT NULL DEFAULT 0,
    updatedAt   DATETIME2      NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT UQ_SellerStats_seller_product UNIQUE (sellerId, productId)
);

CREATE INDEX IX_SellerStats_sellerId  ON SellerStats(sellerId);
CREATE INDEX IX_SellerStats_productId ON SellerStats(productId);

-- Favoriler
CREATE TABLE Favorites (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    userId      INT            NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    productId   INT            NOT NULL REFERENCES Products(id),
    createdAt   DATETIME2      NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT UQ_Favorites_user_product UNIQUE (userId, productId)
);

CREATE INDEX IX_Favorites_userId ON Favorites(userId);

-- Blog Yazıları
CREATE TABLE BlogPosts (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    title       NVARCHAR(300)  NOT NULL,
    slug        NVARCHAR(300)  NOT NULL UNIQUE,
    content     NVARCHAR(MAX)  NOT NULL,
    summary     NVARCHAR(500)  NULL,
    imageUrl    NVARCHAR(500)  NULL,
    category    NVARCHAR(100)  NULL,  -- 'Cilt Bakımı', 'Saç Bakımı' vb.
    authorId    INT            NOT NULL REFERENCES Users(id),
    isPublished BIT            NOT NULL DEFAULT 1,
    createdAt   DATETIME2      NOT NULL DEFAULT GETUTCDATE()
);

CREATE INDEX IX_BlogPosts_slug ON BlogPosts(slug);

-- Kampanyalar / Banner
CREATE TABLE Campaigns (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    title       NVARCHAR(200)  NOT NULL,
    slug        NVARCHAR(200)  NOT NULL UNIQUE,
    imageUrl    NVARCHAR(500)  NULL,
    linkUrl     NVARCHAR(500)  NULL,
    isActive    BIT            NOT NULL DEFAULT 1,
    sortOrder   INT            NOT NULL DEFAULT 0,
    startDate   DATETIME2      NULL,
    endDate     DATETIME2      NULL,
    createdAt   DATETIME2      NOT NULL DEFAULT GETUTCDATE()
);
