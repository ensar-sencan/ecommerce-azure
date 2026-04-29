const router = require('express').Router({ mergeParams: true });
const { body } = require('express-validator');
const { getProductReviews, createReview } = require('../controllers/review.controller');
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

router.get('/', getProductReviews);

router.post('/',
  authenticate, authorize('customer'),
  [body('rating').isInt({ min: 1, max: 5 }), body('comment').trim().isLength({ min: 5 })],
  validate,
  createReview
);

module.exports = router;
