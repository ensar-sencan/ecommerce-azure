const { query, sql } = require('../config/database');

async function createOrder(req, res, next) {
  try {
    const { items } = req.body; // [{ productId, quantity }]
    const customerId = req.user.id;

    // Validate stock and calculate total
    const productIds = items.map(i => i.productId).join(',');
    const products = await query(
      `SELECT id, price, stock, sellerId FROM Products WHERE id IN (${productIds})`
    );

    const productMap = Object.fromEntries(products.recordset.map(p => [p.id, p]));
    let totalPrice = 0;

    for (const item of items) {
      const product = productMap[item.productId];
      if (!product) return res.status(400).json({ error: `Product ${item.productId} not found.` });
      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for product ${item.productId}.` });
      }
      totalPrice += product.price * item.quantity;
    }

    // Create order
    const orderResult = await query(
      `INSERT INTO Orders (customerId, totalPrice, status, createdAt)
       OUTPUT INSERTED.id
       VALUES (@customerId, @totalPrice, 'pending', GETUTCDATE())`,
      { customerId, totalPrice }
    );

    const orderId = orderResult.recordset[0].id;

    // Insert order items and update stock + seller stats
    for (const item of items) {
      const product = productMap[item.productId];
      const lineTotal = product.price * item.quantity;

      await query(
        `INSERT INTO OrderItems (orderId, productId, quantity, unitPrice)
         VALUES (@orderId, @productId, @quantity, @unitPrice)`,
        { orderId, productId: item.productId, quantity: item.quantity, unitPrice: product.price }
      );

      await query(
        'UPDATE Products SET stock = stock - @qty WHERE id = @id',
        { qty: item.quantity, id: item.productId }
      );

      // Update seller stats
      await query(
        `MERGE SellerStats AS target
         USING (SELECT @productId AS productId, @sellerId AS sellerId) AS source
         ON target.productId = source.productId AND target.sellerId = source.sellerId
         WHEN MATCHED THEN UPDATE SET sales = sales + @qty, revenue = revenue + @rev, updatedAt = GETUTCDATE()
         WHEN NOT MATCHED THEN INSERT (sellerId, productId, views, sales, revenue, updatedAt)
                                VALUES (@sellerId, @productId, 0, @qty, @rev, GETUTCDATE());`,
        { productId: item.productId, sellerId: product.sellerId, qty: item.quantity, rev: lineTotal }
      );
    }

    const fullOrder = await query(
      `SELECT o.*, oi.productId, oi.quantity, oi.unitPrice, p.name AS productName
       FROM Orders o
       JOIN OrderItems oi ON oi.orderId = o.id
       JOIN Products p ON p.id = oi.productId
       WHERE o.id = @orderId`,
      { orderId }
    );

    res.status(201).json({ order: fullOrder.recordset });
  } catch (err) {
    next(err);
  }
}

async function getMyOrders(req, res, next) {
  try {
    const result = await query(
      `SELECT o.id, o.totalPrice, o.status, o.createdAt,
              COUNT(oi.id) AS itemCount
       FROM Orders o
       LEFT JOIN OrderItems oi ON oi.orderId = o.id
       WHERE o.customerId = @customerId
       GROUP BY o.id, o.totalPrice, o.status, o.createdAt
       ORDER BY o.createdAt DESC`,
      { customerId: req.user.id }
    );
    res.json(result.recordset);
  } catch (err) {
    next(err);
  }
}

async function getOrderDetail(req, res, next) {
  try {
    const { id } = req.params;
    const result = await query(
      `SELECT o.*, oi.productId, oi.quantity, oi.unitPrice, p.name AS productName, p.imageUrl
       FROM Orders o
       JOIN OrderItems oi ON oi.orderId = o.id
       JOIN Products p ON p.id = oi.productId
       WHERE o.id = @id AND (o.customerId = @userId OR @role = 'admin')`,
      { id: parseInt(id), userId: req.user.id, role: req.user.role }
    );

    if (!result.recordset.length) return res.status(404).json({ error: 'Order not found.' });
    res.json(result.recordset);
  } catch (err) {
    next(err);
  }
}

async function updateOrderStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status.' });

    await query('UPDATE Orders SET status = @status WHERE id = @id', { status, id: parseInt(id) });
    res.json({ message: 'Order status updated.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { createOrder, getMyOrders, getOrderDetail, updateOrderStatus };
