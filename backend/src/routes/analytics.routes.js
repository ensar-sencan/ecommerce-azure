const router = require('express').Router();
const { getSellerStats, getCompetitorAnalysis, getAIInsights } = require('../controllers/analytics.controller');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate, authorize('seller', 'admin'));

router.get('/stats', getSellerStats);
router.get('/competitors', getCompetitorAnalysis);
router.get('/ai-insights', getAIInsights);

module.exports = router;
