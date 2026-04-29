const router = require('express').Router();
const { body } = require('express-validator');
const { listProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/product.controller');
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const productValidation = [
  body('name').trim().notEmpty(),
  body('price').isFloat({ min: 0 }),
  body('stock').isInt({ min: 0 }),
  body('categoryId').isInt(),
];

router.get('/', listProducts);
router.get('/:id', getProduct);

router.post('/',
  authenticate, authorize('seller', 'admin'),
  productValidation, validate,
  createProduct
);

router.put('/:id',
  authenticate, authorize('seller', 'admin'),
  productValidation, validate,
  updateProduct
);

router.delete('/:id',
  authenticate, authorize('seller', 'admin'),
  deleteProduct
);

module.exports = router;
