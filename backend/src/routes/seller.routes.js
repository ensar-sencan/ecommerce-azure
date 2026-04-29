const router = require('express').Router();
const { query } = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate, authorize('seller', 'admin'));

// Seller's own products with stock info
router.get('/products', async (req, res, next) => {
  try {
    const result = await query(
      `SELECT p.*, c.name AS category, ss.views, ss.sales, ss.revenue
       FROM Products p
       JOIN Categories c ON c.id = p.categoryId
       LEFT JOIN SellerStats ss ON ss.productId = p.id AND ss.sellerId = p.sellerId
       WHERE p.sellerId = @sellerId
       ORDER BY p.createdAt DESC`,
      { sellerId: req.user.id }
    );
    res.json(result.recordset);
  } catch (err) {
    next(err);
  }
});

// Seller's incoming orders
router.get('/orders', async (req, res, next) => {
  try {
    const result = await query(
      `SELECT DISTINCT o.id, o.totalPrice, o.status, o.createdAt, u.name AS customerName
       FROM Orders o
       JOIN OrderItems oi ON oi.orderId = o.id
       JOIN Products p ON p.id = oi.productId
       JOIN Users u ON u.id = o.customerId
       WHERE p.sellerId = @sellerId
       ORDER BY o.createdAt DESC`,
      { sellerId: req.user.id }
    );
    res.json(result.recordset);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
