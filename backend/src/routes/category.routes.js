const router = require('express').Router();
const { body } = require('express-validator');
const { listCategories, createCategory } = require('../controllers/category.controller');
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

router.get('/', listCategories);

router.post('/',
  authenticate, authorize('admin'),
  [body('name').trim().notEmpty()],
  validate,
  createCategory
);

module.exports = router;
