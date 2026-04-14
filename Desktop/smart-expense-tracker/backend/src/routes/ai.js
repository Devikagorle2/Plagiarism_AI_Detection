const express = require('express');
const router = express.Router();
const { getInsights, getSpendingTrends } = require('../controllers/aiController');
const { authenticateToken } = require('../middleware/auth');

// All AI routes require authentication
router.use(authenticateToken);

// GET /api/ai/insights - Get AI-powered spending insights
router.get('/insights', getInsights);

// GET /api/ai/trends - Get spending trends analysis
router.get('/trends', getSpendingTrends);

module.exports = router;
