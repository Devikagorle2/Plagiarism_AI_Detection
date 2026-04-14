const Budget = require('../models/Budget');
const Expense = require('../models/Expense');
const moment = require('moment');

const setBudget = async (req, res) => {
  try {
    const budgetData = Budget.createFromRequest(req.body, req.user.userId);
    
    // Validate budget data
    const validation = Budget.validate(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validation.errors 
      });
    }

    // Check if budget already exists for this month
    const existingBudget = await Budget.findOne({
      userId: req.user.userId,
      month: budgetData.month
    });

    let budget;
    if (existingBudget) {
      // Update existing budget
      existingBudget.monthlyBudget = budgetData.monthlyBudget;
      budget = await existingBudget.save();
    } else {
      // Create new budget
      budget = await budgetData.save();
    }

    res.json({
      message: 'Budget set successfully',
      budget: {
        id: budget._id,
        userId: budget.userId,
        monthlyBudget: budget.monthlyBudget,
        month: budget.month,
        createdAt: budget.createdAt,
        updatedAt: budget.updatedAt
      }
    });
  } catch (error) {
    console.error('Set budget error:', error);
    res.status(500).json({ error: 'Failed to set budget' });
  }
};

const getBudget = async (req, res) => {
  try {
    const { month } = req.query;
    const targetMonth = month || moment().format('YYYY-MM');
    const userId = req.user.userId;

    const budget = await Budget.findOne({
      userId,
      month: targetMonth
    });

    if (!budget) {
      return res.json({ budget: null });
    }

    res.json({
      budget: {
        id: budget._id,
        userId: budget.userId,
        monthlyBudget: budget.monthlyBudget,
        month: budget.month,
        createdAt: budget.createdAt,
        updatedAt: budget.updatedAt
      }
    });
  } catch (error) {
    console.error('Get budget error:', error);
    res.status(500).json({ error: 'Failed to fetch budget' });
  }
};

const getBudgetAlerts = async (req, res) => {
  try {
    const userId = req.user.userId;
    const currentMonth = moment().format('YYYY-MM');
    
    // Get current month budget
    const budget = await Budget.findOne({
      userId,
      month: currentMonth
    });

    if (!budget) {
      return res.json({ alerts: [] });
    }

    const monthlyBudget = budget.monthlyBudget;

    // Get current month expenses
    const monthStart = moment(currentMonth, 'YYYY-MM').startOf('month').toDate();
    const monthEnd = moment(currentMonth, 'YYYY-MM').endOf('month').toDate();

    const expenses = await Expense.find({
      userId,
      date: { $gte: monthStart, $lte: monthEnd }
    });

    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    const usagePercentage = (totalSpent / monthlyBudget) * 100;
    const remaining = monthlyBudget - totalSpent;

    const alerts = [];

    if (usagePercentage >= 100) {
      alerts.push({
        type: 'danger',
        message: `You've exceeded your monthly budget by $${Math.abs(remaining).toFixed(2)}!`,
        percentage: usagePercentage
      });
    } else if (usagePercentage >= 90) {
      alerts.push({
        type: 'warning',
        message: `You've used ${usagePercentage.toFixed(1)}% of your budget. Only $${remaining.toFixed(2)} remaining!`,
        percentage: usagePercentage
      });
    } else if (usagePercentage >= 75) {
      alerts.push({
        type: 'info',
        message: `You've used ${usagePercentage.toFixed(1)}% of your budget. $${remaining.toFixed(2)} remaining.`,
        percentage: usagePercentage
      });
    }

    // Check if spending is trending high
    const daysInMonth = moment().daysInMonth();
    const daysPassed = moment().date();
    const dailyAverageBudget = monthlyBudget / daysInMonth;
    const dailyAverageSpent = totalSpent / daysPassed;

    if (dailyAverageSpent > dailyAverageBudget * 1.2) {
      alerts.push({
        type: 'warning',
        message: `Your daily spending ($${dailyAverageSpent.toFixed(2)}) is higher than your daily budget ($${dailyAverageBudget.toFixed(2)}).`,
        percentage: usagePercentage
      });
    }

    res.json({ alerts });
  } catch (error) {
    console.error('Get budget alerts error:', error);
    res.status(500).json({ error: 'Failed to fetch budget alerts' });
  }
};

module.exports = {
  setBudget,
  getBudget,
  getBudgetAlerts
};
