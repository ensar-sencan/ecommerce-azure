const { query } = require('../config/database');

async function listCategories(req, res, next) {
  try {
    const result = await query(
      `SELECT id, name, parentId FROM Categories ORDER BY parentId, name`
    );
    // Build tree structure
    const all = result.recordset;
    const roots = all.filter(c => !c.parentId);
    roots.forEach(root => {
      root.children = all.filter(c => c.parentId === root.id);
    });
    res.json(roots);
  } catch (err) {
    next(err);
  }
}

async function createCategory(req, res, next) {
  try {
    const { name, parentId } = req.body;
    const result = await query(
      `INSERT INTO Categories (name, parentId) OUTPUT INSERTED.* VALUES (@name, @parentId)`,
      { name, parentId: parentId || null }
    );
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    next(err);
  }
}

module.exports = { listCategories, createCategory };
