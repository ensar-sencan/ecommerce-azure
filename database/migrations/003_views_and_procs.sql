-- ============================================================
-- Migration 003: Views & Stored Procedures
-- ============================================================

-- View: Product summary with ratings (used by listing queries)
CREATE OR ALTER VIEW vw_ProductSummary AS
SELECT
    p.id,
    p.sellerId,
    p.categoryId,
    p.name,
    p.price,
    p.stock,
    p.imageUrl,
    p.createdAt,
    c.name                                              AS category,
    u.name                                              AS sellerName,
    ISNULL(AVG(CAST(r.rating AS FLOAT)), 0)             AS avgRating,
    COUNT(r.id)                                         AS reviewCount,
    ISNULL(ss.views, 0)                                 AS views,
    ISNULL(ss.sales, 0)                                 AS sales
FROM Products p
JOIN Categories c  ON c.id = p.categoryId
JOIN Users u       ON u.id = p.sellerId
LEFT JOIN Reviews r ON r.productId = p.id
LEFT JOIN SellerStats ss ON ss.productId = p.id AND ss.sellerId = p.sellerId
GROUP BY p.id, p.sellerId, p.categoryId, p.name, p.price, p.stock,
         p.imageUrl, p.createdAt, c.name, u.name, ss.views, ss.sales;
GO

-- View: Seller daily revenue (for trend charts)
CREATE OR ALTER VIEW vw_SellerDailyRevenue AS
SELECT
    p.sellerId,
    CAST(o.createdAt AS DATE)   AS saleDate,
    SUM(oi.quantity * oi.unitPrice) AS dailyRevenue,
    SUM(oi.quantity)                AS unitsSold
FROM Orders o
JOIN OrderItems oi ON oi.orderId = o.id
JOIN Products p    ON p.id = oi.productId
WHERE o.status != 'cancelled'
GROUP BY p.sellerId, CAST(o.createdAt AS DATE);
GO

-- Stored Procedure: Recalculate all SellerStats from scratch (used by Azure Function)
CREATE OR ALTER PROCEDURE sp_RecalcSellerStats
AS
BEGIN
    SET NOCOUNT ON;

    MERGE SellerStats AS target
    USING (
        SELECT
            p.sellerId,
            oi.productId,
            SUM(oi.quantity)                AS totalSales,
            SUM(oi.quantity * oi.unitPrice) AS totalRevenue
        FROM OrderItems oi
        JOIN Products p ON p.id = oi.productId
        JOIN Orders o   ON o.id = oi.orderId
        WHERE o.status != 'cancelled'
        GROUP BY p.sellerId, oi.productId
    ) AS source
    ON target.sellerId = source.sellerId AND target.productId = source.productId
    WHEN MATCHED THEN
        UPDATE SET sales = source.totalSales, revenue = source.totalRevenue, updatedAt = GETUTCDATE()
    WHEN NOT MATCHED THEN
        INSERT (sellerId, productId, views, sales, revenue, updatedAt)
        VALUES (source.sellerId, source.productId, 0, source.totalSales, source.totalRevenue, GETUTCDATE());
END;
GO
