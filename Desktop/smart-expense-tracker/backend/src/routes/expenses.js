const express = require('express');
const router = express.Router();
const { addExpense, getExpenses, getDashboardData, deleteExpense } = require('../controllers/expenseController');
const { authenticateToken } = require('../middleware/auth');
const { validateExpense } = require('../middleware/validation');

// All expense routes require authentication
router.use(authenticateToken);

// POST /api/expenses - Add new expense
router.post('/', validateExpense, addExpense);

// GET /api/expenses - Get user's expenses with filters
router.get('/', getExpenses);

// GET /api/expenses/dashboard - Get dashboard data
router.get('/dashboard', getDashboardData);

// DELETE /api/expenses/:expenseId - Delete expense
router.delete('/:expenseId', deleteExpense);

module.exports = router;
