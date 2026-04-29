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

    const categoryStats = await query(
      `SELECT
         c.name AS category,
         AVG(p.price) AS avgCategoryPrice,
         MAX(p.price) AS maxPrice,
         MIN(p.price) AS minPrice,
         COUNT(DISTINCT p.sellerId) AS sellerCount
       FROM Products p
       JOIN Categories c ON c.id = p.categoryId
       WHERE p.categoryId IN (
         SELECT DISTINCT categoryId FROM Products WHERE sellerId = @sellerId
       )
       GROUP BY c.id, c.name`,
      { sellerId }
    );

    const myPriceRanking = await query(
      `SELECT
         p.id, p.name, p.price, p.categoryId,
         (SELECT COUNT(*) + 1 FROM Products p2
          WHERE p2.categoryId = p.categoryId AND p2.price < p.price AND p2.sellerId != @sellerId) AS priceRank,
         (SELECT COUNT(*) FROM Products p3 WHERE p3.categoryId = p.categoryId) AS totalInCategory
       FROM Products p WHERE p.sellerId = @sellerId`,
      { sellerId }
    );

    const reviewComparison = await query(
      `SELECT
         p.categoryId,
         AVG(CAST(r.rating AS FLOAT)) AS categoryAvgRating,
         COUNT(r.id) / NULLIF(COUNT(DISTINCT p.id), 0) AS avgReviewsPerProduct
       FROM Products p
       LEFT JOIN Reviews r ON r.productId = p.id
       WHERE p.categoryId IN (SELECT DISTINCT categoryId FROM Products WHERE sellerId = @sellerId)
       GROUP BY p.categoryId`,
      { sellerId }
    );

    const marketShare = await query(
      `SELECT
         c.name AS category,
         SUM(CASE WHEN p.sellerId = @sellerId THEN ss.revenue ELSE 0 END) AS myRevenue,
         SUM(ss.revenue) AS totalRevenue,
         CASE WHEN SUM(ss.revenue) > 0
              THEN CAST(SUM(CASE WHEN p.sellerId = @sellerId THEN ss.revenue ELSE 0 END) AS FLOAT) / SUM(ss.revenue) * 100
              ELSE 0 END AS marketSharePercent
       FROM SellerStats ss
       JOIN Products p ON p.id = ss.productId
       JOIN Categories c ON c.id = p.categoryId
       WHERE p.categoryId IN (SELECT DISTINCT categoryId FROM Products WHERE sellerId = @sellerId)
       GROUP BY c.id, c.name`,
      { sellerId }
    );

    res.json({
      categoryStats: categoryStats.recordset,
      myPriceRanking: myPriceRanking.recordset,
      reviewComparison: reviewComparison.recordset,
      marketShare: marketShare.recordset,
    });
  } catch (err) {
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
