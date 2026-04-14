const express = require('express');
const router = express.Router();
const { setBudget, getBudget, getBudgetAlerts } = require('../controllers/budgetController');
const { setCategoryAllocation, getCategoryAllocations, getDashboardBudgetData } = require('../controllers/budgetCategoryController');
const { authenticateToken } = require('../middleware/auth');
const { validateBudget } = require('../middleware/validation');

// All budget routes require authentication
router.use(authenticateToken);

// POST /api/budget - Set or update budget
router.post('/', validateBudget, setBudget);

// GET /api/budget - Get budget for specific month
router.get('/', getBudget);

// GET /api/budget/alerts - Get budget alerts
router.get('/alerts', getBudgetAlerts);

// PUT /api/budget/category - Set category allocation
router.put('/category', setCategoryAllocation);

// GET /api/budget/category - Get category allocations for a month
router.get('/category', getCategoryAllocations);

// GET /api/budget/dashboard-budget - Get dashboard budget data
router.get('/dashboard-budget', getDashboardBudgetData);

module.exports = router;
