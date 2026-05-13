-- SellerStats tablosuna demo verileri ekleme
-- Seller ID: 3 (seller@demo.com)

-- Önce mevcut verileri temizle
DELETE FROM SellerStats WHERE sellerId = 3;

-- Seller'ın ürünlerini al ve her birine istatistik ekle
INSERT INTO SellerStats (sellerId, productId, sales, revenue, views)
SELECT 
    3 as sellerId,
    p.id as productId,
    CAST(RAND(CHECKSUM(NEWID())) * 200 + 50 AS INT) as sales,
    CAST(RAND(CHECKSUM(NEWID())) * 50000 + 10000 AS DECIMAL(10,2)) as revenue,
    CAST(RAND(CHECKSUM(NEWID())) * 5000 + 1000 AS INT) as views
FROM Products p
WHERE p.sellerId = 3;

-- Kontrol
SELECT 
    ss.sellerId,
    COUNT(*) as productCount,
    SUM(ss.sales) as totalSales,
    SUM(ss.revenue) as totalRevenue,
    SUM(ss.views) as totalViews
FROM SellerStats ss
WHERE ss.sellerId = 3
GROUP BY ss.sellerId;
