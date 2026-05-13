const { query } = require('../config/database');
const { getAIRecommendations } = require('../services/ai.service');

async function getSellerStats(req, res, next) {
  try {
    const sellerId = req.user.id;

    const [overview, topProducts, conversionRates] = await Promise.all([
      query(
        `SELECT SUM(ss.sales) AS totalSales, SUM(ss.revenue) AS totalRevenue,
                SUM(ss.views) AS totalViews
         FROM SellerStats ss WHERE ss.sellerId = @sellerId`,
        { sellerId }
      ),
      query(
        `SELECT p.id, p.name, ss.sales, ss.revenue, ss.views
         FROM SellerStats ss JOIN Products p ON p.id = ss.productId
         WHERE ss.sellerId = @sellerId
         ORDER BY ss.revenue DESC OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY`,
        { sellerId }
      ),
      query(
        `SELECT p.id, p.name,
                ss.views,
                ss.sales,
                CASE WHEN ss.views > 0 THEN CAST(ss.sales AS FLOAT) / ss.views * 100 ELSE 0 END AS conversionRate
         FROM SellerStats ss JOIN Products p ON p.id = ss.productId
         WHERE ss.sellerId = @sellerId`,
        { sellerId }
      ),
    ]);

    res.json({
      overview: overview.recordset[0],
      topProducts: topProducts.recordset,
      conversionRates: conversionRates.recordset,
    });
  } catch (err) {
    next(err);
  }
}

async function getCompetitorAnalysis(req, res, next) {
  try {
    const sellerId = req.user.id;
    const { plan } = req.query; // free | standard | premium

    // Available on standard+ plans
    if (plan === 'free') {
      return res.status(403).json({ error: 'Upgrade to Standard plan to access competitor analysis.' });
    }

    // Category statistics with min/max prices
    const categoryStats = await query(
      `SELECT
         c.name AS category,
         AVG(p.price) AS avgCategoryPrice,
         MAX(p.price) AS maxPrice,
         MIN(p.price) AS minPrice,
         COUNT(DISTINCT p.sellerId) AS sellerCount,
         COUNT(p.id) AS totalProducts
       FROM Products p
       JOIN Categories c ON c.id = p.categoryId
       WHERE p.categoryId IN (
         SELECT DISTINCT categoryId FROM Products WHERE sellerId = @sellerId
       )
       GROUP BY c.id, c.name
       ORDER BY sellerCount DESC`,
      { sellerId }
    );

    // My price ranking with more details
    const myPriceRanking = await query(
      `SELECT
         p.id, p.name, p.price, p.categoryId, p.stock,
         (SELECT COUNT(*) + 1 FROM Products p2
          WHERE p2.categoryId = p.categoryId AND p2.price < p.price AND p2.sellerId != @sellerId) AS priceRank,
         (SELECT COUNT(*) FROM Products p3 WHERE p3.categoryId = p.categoryId) AS totalInCategory,
         (SELECT AVG(price) FROM Products p4 WHERE p4.categoryId = p.categoryId) AS categoryAvgPrice
       FROM Products p 
       WHERE p.sellerId = @sellerId
       ORDER BY p.price DESC`,
      { sellerId }
    );

    // Review comparison
    const reviewComparison = await query(
      `SELECT
         c.name AS category,
         AVG(CASE WHEN p.sellerId = @sellerId THEN CAST(r.rating AS FLOAT) ELSE NULL END) AS myAvgRating,
         AVG(CASE WHEN p.sellerId != @sellerId THEN CAST(r.rating AS FLOAT) ELSE NULL END) AS competitorAvgRating,
         COUNT(CASE WHEN p.sellerId = @sellerId THEN r.id ELSE NULL END) AS myReviewCount,
         COUNT(CASE WHEN p.sellerId != @sellerId THEN r.id ELSE NULL END) AS competitorReviewCount
       FROM Products p
       LEFT JOIN Reviews r ON r.productId = p.id
       JOIN Categories c ON c.id = p.categoryId
       WHERE p.categoryId IN (SELECT DISTINCT categoryId FROM Products WHERE sellerId = @sellerId)
       GROUP BY c.id, c.name`,
      { sellerId }
    );

    // Market share with revenue details
    const marketShare = await query(
      `SELECT
         c.name AS category,
         SUM(CASE WHEN p.sellerId = @sellerId THEN ISNULL(ss.revenue, 0) ELSE 0 END) AS myRevenue,
         SUM(ISNULL(ss.revenue, 0)) AS totalRevenue,
         CASE WHEN SUM(ISNULL(ss.revenue, 0)) > 0
              THEN CAST(SUM(CASE WHEN p.sellerId = @sellerId THEN ISNULL(ss.revenue, 0) ELSE 0 END) AS FLOAT) / SUM(ISNULL(ss.revenue, 0)) * 100
              ELSE 0 END AS marketSharePercent,
         COUNT(DISTINCT CASE WHEN p.sellerId = @sellerId THEN p.id ELSE NULL END) AS myProductCount,
         COUNT(DISTINCT p.id) AS totalProductCount
       FROM Products p
       JOIN Categories c ON c.id = p.categoryId
       LEFT JOIN SellerStats ss ON ss.productId = p.id
       WHERE p.categoryId IN (SELECT DISTINCT categoryId FROM Products WHERE sellerId = @sellerId)
       GROUP BY c.id, c.name
       ORDER BY marketSharePercent DESC`,
      { sellerId }
    );

    res.json({
      categoryStats: categoryStats.recordset,
      myPriceRanking: myPriceRanking.recordset,
      reviewComparison: reviewComparison.recordset,
      marketShare: marketShare.recordset,
    });
  } catch (err) {
    console.error('Competitor analysis error:', err);
    next(err);
  }
}

async function getAIInsights(req, res, next) {
  try {
    const sellerId = req.user.id;
    const { plan } = req.query;

    if (plan !== 'premium') {
      return res.status(403).json({ error: 'Upgrade to Premium plan to access AI insights.' });
    }

    const [stats, lowStock] = await Promise.all([
      query(
        `SELECT p.name, ss.sales, ss.revenue, ss.views, p.price, p.stock, c.name AS category
         FROM SellerStats ss
         JOIN Products p ON p.id = ss.productId
         JOIN Categories c ON c.id = p.categoryId
         WHERE ss.sellerId = @sellerId`,
        { sellerId }
      ),
      query(
        `SELECT id, name, stock FROM Products
         WHERE sellerId = @sellerId AND stock < 10 AND stock > 0`,
        { sellerId }
      ),
    ]);

    const recommendations = await getAIRecommendations(stats.recordset, lowStock.recordset);

    res.json({ recommendations, lowStockAlerts: lowStock.recordset });
  } catch (err) {
    next(err);
  }
}

module.exports = { getSellerStats, getCompetitorAnalysis, getAIInsights };
