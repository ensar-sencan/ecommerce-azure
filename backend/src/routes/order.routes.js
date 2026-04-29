const router = require('express').Router();
const { body } = require('express-validator');
const { createOrder, getMyOrders, getOrderDetail, updateOrderStatus } = require('../controllers/order.controller');
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

router.use(authenticate);

router.post('/',
  [body('items').isArray({ min: 1 }), body('items.*.productId').isInt(), body('items.*.quantity').isInt({ min: 1 })],
  validate,
  createOrder
);

router.get('/my', getMyOrders);
router.get('/:id', getOrderDetail);

router.patch('/:id/status',
  authorize('seller', 'admin'),
  [body('status').isIn(['confirmed', 'shipped', 'delivered', 'cancelled'])],
  validate,
  updateOrderStatus
);

module.exports = router;
