const Expense = require('../models/Expense');
const Budget = require('../models/Budget');
const BudgetCategory = require('../models/BudgetCategory');
const moment = require('moment');

const addExpense = async (req, res) => {
  try {
    const expenseData = Expense.createFromRequest(req.body, req.user.userId);
    
    // Validate expense data
    const validation = Expense.validate(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validation.errors 
      });
    }

    // Save to SQLite
    const newExpense = await expenseData.save();

    // Auto-update BudgetCategory spent amount
    const month = newExpense.date.slice(0, 7); // "YYYY-MM"
    try {
      BudgetCategory.updateSpent(newExpense.userId, month, newExpense.category, newExpense.amount);
    } catch (error) {
      console.error('Error updating budget category spent:', error);
      // Don't fail the expense creation if budget update fails
    }

    res.status(201).json({
      message: 'Expense added successfully',
      expense: {
        id: newExpense.id,
        userId: newExpense.userId,
        amount: newExpense.amount,
        category: newExpense.category,
        description: newExpense.description,
        date: newExpense.date,
        createdAt: newExpense.createdAt
      }
    });
  } catch (error) {
    console.error('Add expense error:', error);
    res.status(500).json({ error: 'Failed to add expense' });
  }
};

const getExpenses = async (req, res) => {
  try {
    const { startDate, endDate, category, limit = 50, offset = 0 } = req.query;
    const userId = req.user.userId;

    // Build query
    let query = { userId };
    
    // Apply date filters
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate).toISOString();
      if (endDate) query.date.$lte = new Date(endDate).toISOString();
    }

    // Apply category filter
    if (category) {
      query.category = category;
    }

    // Execute query
    let expenses = await Expense.find(query);

    // Sort by date descending
    expenses.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Get total count before pagination
    const totalCount = expenses.length;

    // Apply pagination
    const offsetNum = parseInt(offset);
    const limitNum = parseInt(limit);
    const paginatedExpenses = expenses.slice(offsetNum, offsetNum + limitNum);

    res.json({
      expenses: paginatedExpenses.map(expense => ({
        id: expense.id,
        userId: expense.userId,
        amount: expense.amount,
        category: expense.category,
        description: expense.description,
        date: expense.date,
        createdAt: expense.createdAt
      })),
      total: totalCount,
      hasMore: (offsetNum + paginatedExpenses.length) < totalCount
    });
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
};

const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.userId;
    const currentMonth = moment().format('YYYY-MM');
    
    // Get current month expenses
    const monthStart = moment(currentMonth, 'YYYY-MM').startOf('month').toDate();
    const monthEnd = moment(currentMonth, 'YYYY-MM').endOf('month').toDate();

    const expenses = await Expense.find({
      userId,
      date: { $gte: monthStart, $lte: monthEnd }
    });
    
    // Sort by date descending
    expenses.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Calculate totals
    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Category breakdown
    const categoryBreakdown = {};
    expenses.forEach(expense => {
      categoryBreakdown[expense.category] = (categoryBreakdown[expense.category] || 0) + expense.amount;
    });

    // Get user's budget for current month
    const budget = await Budget.findOne({
      userId,
      month: currentMonth
    });

    const monthlyBudget = budget ? budget.monthlyBudget : 0;

    // Get category allocations
    const categoryAllocations = BudgetCategory.getByUserAndMonth(userId, currentMonth);
    const categoryBudgetMap = {};
    categoryAllocations.forEach(alloc => {
      categoryBudgetMap[alloc.category] = {
        allocated: alloc.allocated,
        spent: alloc.spent
      };
    });

    // Calculate savings
    const savingsAllocated = categoryBudgetMap['Savings']?.allocated || 0;
    const savingsSpent = categoryBudgetMap['Savings']?.spent || 0;
    const savingsRemaining = savingsAllocated - savingsSpent;

    // Calculate remaining budget
    const remainingBudget = monthlyBudget - totalSpent;
    const budgetUsagePercentage = monthlyBudget > 0 ? (totalSpent / monthlyBudget) * 100 : 0;

    // Get last 7 days for trend data
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = moment().subtract(i, 'days').format('YYYY-MM-DD');
      const dayStart = moment(date).startOf('day').toDate();
      const dayEnd = moment(date).endOf('day').toDate();
      
      const dayExpenses = await Expense.find({
        userId,
        date: { $gte: dayStart, $lte: dayEnd }
      });
      
      const dayTotal = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      
      last7Days.push({
        date,
        amount: dayTotal,
        count: dayExpenses.length
      });
    }

    res.json({
      summary: {
        totalSpent,
        budget: monthlyBudget,
        remainingBudget,
        budgetUsagePercentage: Math.round(budgetUsagePercentage * 10) / 10,
        savings: {
          allocated: savingsAllocated,
          spent: savingsSpent,
          remaining: savingsRemaining
        }
      },
      categoryBreakdown,
      categoryBudgetMap,
      last7Days,
      recentExpenses: expenses.slice(0, 5).map(expense => ({
        id: expense.id,
        userId: expense.userId,
        amount: expense.amount,
        category: expense.category,
        description: expense.description,
        date: expense.date,
        createdAt: expense.createdAt
      })),
      totalExpenses: expenses.length
    });
  } catch (error) {
    console.error('Get dashboard data error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const userId = req.user.userId;

    // Find and verify the expense belongs to the user
    const expense = await Expense.findById(expenseId);
    
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    if (expense.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this expense' });
    }

    await Expense.findByIdAndDelete(expenseId);

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
};

module.exports = {
  addExpense,
  getExpenses,
  getDashboardData,
  deleteExpense
};
