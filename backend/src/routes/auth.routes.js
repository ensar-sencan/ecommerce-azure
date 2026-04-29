const router = require('express').Router();
const { body } = require('express-validator');
const { register, login, getMe } = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

router.post('/register',
  [
    body('name').trim().notEmpty(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
    body('role').optional().isIn(['customer', 'seller']),
  ],
  validate,
  register
);

router.post('/login',
  [body('email').isEmail(), body('password').notEmpty()],
  validate,
  login
);

router.get('/me', authenticate, getMe);

module.exports = router;
