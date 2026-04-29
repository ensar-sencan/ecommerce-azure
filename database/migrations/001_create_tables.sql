-- ============================================================
-- Migration 001: Initial Schema
-- ============================================================

-- Users
CREATE TABLE Users (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    name        NVARCHAR(100)  NOT NULL,
    email       NVARCHAR(255)  NOT NULL UNIQUE,
    password    NVARCHAR(255)  NOT NULL,
    role        NVARCHAR(20)   NOT NULL DEFAULT 'customer'
                               CHECK (role IN ('customer', 'seller', 'admin')),
    plan        NVARCHAR(20)   NOT NULL DEFAULT 'free'
                               CHECK (plan IN ('free', 'standard', 'premium')),
    createdAt   DATETIME2      NOT NULL DEFAULT GETUTCDATE()
);

CREATE INDEX IX_Users_email ON Users(email);
CREATE INDEX IX_Users_role  ON Users(role);

-- Categories (self-referencing for sub-categories)
CREATE TABLE Categories (
    id        INT IDENTITY(1,1) PRIMARY KEY,
    name      NVARCHAR(100) NOT NULL,
    parentId  INT NULL REFERENCES Categories(id)
);

-- Products
CREATE TABLE Products (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    sellerId    INT            NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    categoryId  INT            NOT NULL REFERENCES Categories(id),
    name        NVARCHAR(200)  NOT NULL,
    description NVARCHAR(MAX)  NULL,
    price       DECIMAL(18,2)  NOT NULL CHECK (price >= 0),
    stock       INT            NOT NULL DEFAULT 0 CHECK (stock >= 0),
    imageUrl    NVARCHAR(500)  NULL,
    createdAt   DATETIME2      NOT NULL DEFAULT GETUTCDATE()
);

CREATE INDEX IX_Products_sellerId   ON Products(sellerId);
CREATE INDEX IX_Products_categoryId ON Products(categoryId);
CREATE INDEX IX_Products_price      ON Products(price);

-- Orders
CREATE TABLE Orders (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    customerId  INT            NOT NULL REFERENCES Users(id),
    totalPrice  DECIMAL(18,2)  NOT NULL,
    status      NVARCHAR(20)   NOT NULL DEFAULT 'pending'
                               CHECK (status IN ('pending','confirmed','shipped','delivered','cancelled')),
    createdAt   DATETIME2      NOT NULL DEFAULT GETUTCDATE()
);

CREATE INDEX IX_Orders_customerId ON Orders(customerId);
CREATE INDEX IX_Orders_status     ON Orders(status);
CREATE INDEX IX_Orders_createdAt  ON Orders(createdAt);

-- OrderItems
CREATE TABLE OrderItems (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    orderId     INT            NOT NULL REFERENCES Orders(id) ON DELETE CASCADE,
    productId   INT            NOT NULL REFERENCES Products(id),
    quantity    INT            NOT NULL CHECK (quantity > 0),
    unitPrice   DECIMAL(18,2)  NOT NULL
);

CREATE INDEX IX_OrderItems_orderId   ON OrderItems(orderId);
CREATE INDEX IX_OrderItems_productId ON OrderItems(productId);

-- Reviews
CREATE TABLE Reviews (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    productId   INT            NOT NULL REFERENCES Products(id) ON DELETE CASCADE,
    customerId  INT            NOT NULL REFERENCES Users(id),
    rating      TINYINT        NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment     NVARCHAR(1000) NULL,
    createdAt   DATETIME2      NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT UQ_Reviews_product_customer UNIQUE (productId, customerId)
);

CREATE INDEX IX_Reviews_productId ON Reviews(productId);

-- SellerStats (updated by Azure Function nightly + real-time increments)
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
