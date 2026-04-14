const BudgetCategory = require('../models/BudgetCategory');

const setCategoryAllocation = async (req, res) => {
  try {
    const { userId } = req.user;
    const { month, category, allocated } = req.body;

    if (!month || !category || allocated === undefined) {
      return res.status(400).json({ error: 'Month, category, and allocated amount are required' });
    }

    BudgetCategory.setAllocation(userId, month, category, parseFloat(allocated));
    res.json({ message: 'Category allocation set successfully' });
  } catch (error) {
    console.error('Error setting category allocation:', error);
    res.status(500).json({ error: 'Failed to set category allocation' });
  }
};

const getCategoryAllocations = async (req, res) => {
  try {
    const { userId } = req.user;
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ error: 'Month parameter is required' });
    }

    const allocations = BudgetCategory.getByUserAndMonth(userId, month);
    res.json(allocations);
  } catch (error) {
    console.error('Error getting category allocations:', error);
    res.status(500).json({ error: 'Failed to get category allocations' });
  }
};

const getDashboardBudgetData = async (req, res) => {
  try {
    const userId = req.user.userId;
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
    const categories = BudgetCategory.getByUserAndMonth(userId, month);
    const totalBudget = BudgetCategory.getTotalBudget(userId, month);
    const totalSpent = categories.reduce((sum, c) => sum + c.spent, 0);
    const savingsRemaining = BudgetCategory.getSavingsRemaining(userId, month);
    res.json({ categories, totalBudget, totalSpent, savingsRemaining, month });
  } catch (error) {
    console.error('Error getting dashboard budget data:', error);
    res.status(500).json({ error: 'Failed to get dashboard budget data' });
  }
};

module.exports = {
  setCategoryAllocation,
  getCategoryAllocations,
  getDashboardBudgetData
};
