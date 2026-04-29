const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

async function register(req, res, next) {
  try {
    const { name, email, password, role = 'customer' } = req.body;

    const existing = await query('SELECT id FROM Users WHERE email = @email', { email });
    if (existing.recordset.length > 0) {
      return res.status(409).json({ error: 'Email already registered.' });
    }

    const hash = await bcrypt.hash(password, 12);
    const result = await query(
      `INSERT INTO Users (name, email, password, role, createdAt)
       OUTPUT INSERTED.id, INSERTED.name, INSERTED.email, INSERTED.role
       VALUES (@name, @email, @hash, @role, GETUTCDATE())`,
      { name, email, hash, role }
    );

    const user = result.recordset[0];
    res.status(201).json({ token: signToken(user), user });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const result = await query(
      'SELECT id, name, email, password, role FROM Users WHERE email = @email',
      { email }
    );

    const user = result.recordset[0];
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const { password: _, ...safeUser } = user;
    res.json({ token: signToken(safeUser), user: safeUser });
  } catch (err) {
    next(err);
  }
}

async function getMe(req, res, next) {
  try {
    const result = await query(
      'SELECT id, name, email, role, createdAt FROM Users WHERE id = @id',
      { id: req.user.id }
    );
    res.json(result.recordset[0]);
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, getMe };
