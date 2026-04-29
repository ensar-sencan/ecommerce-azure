const { query } = require('../config/database');

async function getProductReviews(req, res, next) {
  try {
    const { productId } = req.params;
    const result = await query(
      `SELECT r.id, r.rating, r.comment, r.createdAt, u.name AS authorName
       FROM Reviews r JOIN Users u ON u.id = r.customerId
       WHERE r.productId = @productId ORDER BY r.createdAt DESC`,
      { productId: parseInt(productId) }
    );
    res.json(result.recordset);
  } catch (err) {
    next(err);
  }
}

async function createReview(req, res, next) {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const customerId = req.user.id;

    // Check if customer purchased the product
    const purchased = await query(
      `SELECT 1 FROM Orders o JOIN OrderItems oi ON oi.orderId = o.id
       WHERE o.customerId = @customerId AND oi.productId = @productId AND o.status = 'delivered'`,
      { customerId, productId: parseInt(productId) }
    );
    if (!purchased.recordset.length) {
      return res.status(403).json({ error: 'You must purchase this product before reviewing.' });
    }

    const existing = await query(
      'SELECT id FROM Reviews WHERE customerId = @customerId AND productId = @productId',
      { customerId, productId: parseInt(productId) }
    );
    if (existing.recordset.length) {
      return res.status(409).json({ error: 'You already reviewed this product.' });
    }

    const result = await query(
      `INSERT INTO Reviews (productId, customerId, rating, comment, createdAt)
       OUTPUT INSERTED.*
       VALUES (@productId, @customerId, @rating, @comment, GETUTCDATE())`,
      { productId: parseInt(productId), customerId, rating: parseInt(rating), comment }
    );

    res.status(201).json(result.recordset[0]);
  } catch (err) {
    next(err);
  }
}

module.exports = { getProductReviews, createReview };
