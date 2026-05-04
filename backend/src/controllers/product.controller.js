const { query, sql } = require('../config/database');

async function listProducts(req, res, next) {
  try {
    const { category, search, minPrice, maxPrice, page = 1, limit = 20, sort = 'createdAt' } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE p.stock > 0 AND p.isActive = 1';
    const params = { limit: parseInt(limit), offset: parseInt(offset) };

    if (category) { whereClause += ' AND p.categoryId = @categoryId'; params.categoryId = category; }
    if (search)   { whereClause += ' AND (p.name LIKE @search OR p.description LIKE @search)'; params.search = `%${search}%`; }
    if (minPrice) { whereClause += ' AND p.price >= @minPrice'; params.minPrice = parseFloat(minPrice); }
    if (maxPrice) { whereClause += ' AND p.price <= @maxPrice'; params.maxPrice = parseFloat(maxPrice); }

    const allowedSorts = { price_asc: 'p.price ASC', price_desc: 'p.price DESC', createdAt: 'p.createdAt DESC', rating: 'avgRating DESC' };
    const orderBy = allowedSorts[sort] || 'p.createdAt DESC';

    const result = await query(
      `SELECT p.id, p.name, p.slug, p.price, p.discountedPrice, p.discountRate, 
              p.stock, p.imageUrl, p.isFeatured, p.freeShipping, p.createdAt,
              c.name AS category, u.name AS sellerName,
              ISNULL(AVG(CAST(r.rating AS FLOAT)), 0) AS avgRating,
              COUNT(r.id) AS reviewCount
       FROM Products p
       JOIN Categories c ON p.categoryId = c.id
       JOIN Users u ON p.sellerId = u.id
       LEFT JOIN Reviews r ON r.productId = p.id
       ${whereClause}
       GROUP BY p.id, p.name, p.slug, p.price, p.discountedPrice, p.discountRate,
                p.stock, p.imageUrl, p.isFeatured, p.freeShipping, p.createdAt, 
                c.name, u.name
       ORDER BY ${orderBy}
       OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY`,
      params
    );

    const countResult = await query(
      `SELECT COUNT(DISTINCT p.id) AS total FROM Products p 
       JOIN Categories c ON p.categoryId = c.id
       ${whereClause}`,
      params
    );

    res.json({
      products: result.recordset,
      total: countResult.recordset[0].total,
      page: parseInt(page),
      pages: Math.ceil(countResult.recordset[0].total / limit),
    });
  } catch (err) {
    console.error('List products error:', err);
    next(err);
  }
}

async function getProduct(req, res, next) {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT p.*, c.name AS category, u.name AS sellerName,
              ISNULL(AVG(CAST(r.rating AS FLOAT)), 0) AS avgRating,
              COUNT(r.id) AS reviewCount
       FROM Products p
       JOIN Categories c ON p.categoryId = c.id
       JOIN Users u ON p.sellerId = u.id
       LEFT JOIN Reviews r ON r.productId = p.id
       WHERE p.id = @id
       GROUP BY p.id, p.sellerId, p.categoryId, p.brandId, p.name, p.slug, p.description,
                p.ingredients, p.howToUse, p.skinType, p.volume, p.barcode,
                p.price, p.discountedPrice, p.discountRate, p.stock, p.imageUrl,
                p.isActive, p.isFeatured, p.isFlash, p.freeShipping, p.isOrganic,
                p.createdAt, c.name, u.name`,
      { id: parseInt(id) }
    );

    if (!result.recordset[0]) return res.status(404).json({ error: 'Product not found.' });

    // Track view in SellerStats (fire-and-forget)
    query(
      `MERGE SellerStats AS target
       USING (SELECT @productId AS productId, @sellerId AS sellerId) AS source
       ON target.productId = source.productId AND target.sellerId = source.sellerId
       WHEN MATCHED THEN UPDATE SET views = views + 1, updatedAt = GETUTCDATE()
       WHEN NOT MATCHED THEN INSERT (sellerId, productId, views, sales, revenue, updatedAt)
                              VALUES (@sellerId, @productId, 1, 0, 0, GETUTCDATE());`,
      { productId: parseInt(id), sellerId: result.recordset[0].sellerId }
    ).catch(() => {});

    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Get product error:', err);
    next(err);
  }
}

async function createProduct(req, res, next) {
  try {
    const { name, description, price, stock, categoryId, imageUrl } = req.body;
    const sellerId = req.user.id;

    // Default image if not provided
    const finalImageUrl = imageUrl || 'https://ecommercestore2026.blob.core.windows.net/product-images/default-product.jpg';

    const result = await query(
      `INSERT INTO Products (sellerId, categoryId, name, description, price, stock, imageUrl, createdAt)
       OUTPUT INSERTED.*
       VALUES (@sellerId, @categoryId, @name, @description, @price, @stock, @imageUrl, GETUTCDATE())`,
      { sellerId, categoryId: parseInt(categoryId), name, description, price: parseFloat(price), stock: parseInt(stock), imageUrl: finalImageUrl }
    );

    res.status(201).json(result.recordset[0]);
  } catch (err) {
    console.error('Create product error:', err);
    next(err);
  }
}

async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    const { name, description, price, stock, categoryId, imageUrl } = req.body;

    const existing = await query('SELECT sellerId FROM Products WHERE id = @id', { id: parseInt(id) });
    if (!existing.recordset[0]) return res.status(404).json({ error: 'Product not found.' });
    if (existing.recordset[0].sellerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied.' });
    }

    const result = await query(
      `UPDATE Products SET name = @name, description = @description, price = @price,
              stock = @stock, categoryId = @categoryId, imageUrl = @imageUrl
       OUTPUT INSERTED.*
       WHERE id = @id`,
      { id: parseInt(id), name, description, price: parseFloat(price), stock: parseInt(stock), categoryId: parseInt(categoryId), imageUrl }
    );

    res.json(result.recordset[0]);
  } catch (err) {
    next(err);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;

    const existing = await query('SELECT sellerId FROM Products WHERE id = @id', { id: parseInt(id) });
    if (!existing.recordset[0]) return res.status(404).json({ error: 'Product not found.' });
    if (existing.recordset[0].sellerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied.' });
    }

    await query('DELETE FROM Products WHERE id = @id', { id: parseInt(id) });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { listProducts, getProduct, createProduct, updateProduct, deleteProduct };
