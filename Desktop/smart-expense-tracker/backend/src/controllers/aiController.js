const { getSpendingInsights } = require('../config/gemini');
const Expense = require('../models/Expense');
const Budget = require('../models/Budget');
const moment = require('moment');

const getInsights = async (req, res) => {
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

    // Get current month budget
    const budget = await Budget.findOne({
      userId,
      month: currentMonth
    });

    const monthlyBudget = budget ? budget.monthlyBudget : 0;

    if (expenses.length === 0) {
      return res.json({
        insights: "Start tracking your expenses to receive personalized AI insights about your spending patterns!",
        summary: {
          totalSpent: 0,
          budget: monthlyBudget,
          remaining: monthlyBudget,
          categorySpending: {},
          categoryPercentages: {}
        }
      });
    }

    // Get AI insights
    const aiResponse = await getSpendingInsights(expenses, monthlyBudget);

    res.json(aiResponse);
  } catch (error) {
    console.error('Get insights error:', error);
    res.status(500).json({ error: 'Failed to generate AI insights' });
  }
};

const getSpendingTrends = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { months = 3 } = req.query;
    
    // Get expenses for the last N months
    const trends = [];
    
    for (let i = 0; i < parseInt(months); i++) {
      const targetMonth = moment().subtract(i, 'months').format('YYYY-MM');
      const monthStart = moment(targetMonth, 'YYYY-MM').startOf('month').toDate();
      const monthEnd = moment(targetMonth, 'YYYY-MM').endOf('month').toDate();
      
      const expenses = await Expense.find({
        userId,
        date: { $gte: monthStart, $lte: monthEnd }
      });

      const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
      
      // Category breakdown for this month
      const categoryBreakdown = {};
      expenses.forEach(expense => {
        categoryBreakdown[expense.category] = (categoryBreakdown[expense.category] || 0) + expense.amount;
      });

      trends.push({
        month: targetMonth,
        totalSpent,
        categoryBreakdown,
        expenseCount: expenses.length
      });
    }

    // Calculate trends
    const monthlyTrends = trends.reverse().map((trend, index) => {
      let trendDirection = 'stable';
      let trendPercentage = 0;
      
      if (index > 0) {
        const previousMonth = trends[index - 1];
        if (previousMonth.totalSpent > 0) {
          const change = ((trend.totalSpent - previousMonth.totalSpent) / previousMonth.totalSpent) * 100;
          trendPercentage = Math.abs(change);
          trendDirection = change > 5 ? 'increasing' : change < -5 ? 'decreasing' : 'stable';
        }
      }

      return {
        ...trend,
        trendDirection,
        trendPercentage: Math.round(trendPercentage * 10) / 10
      };
    });

    res.json({
      trends: monthlyTrends,
      summary: {
        averageMonthlySpending: trends.reduce((sum, t) => sum + t.totalSpent, 0) / trends.length,
        highestSpendingMonth: Math.max(...trends.map(t => t.totalSpent)),
        lowestSpendingMonth: Math.min(...trends.map(t => t.totalSpent))
      }
    });
  } catch (error) {
    console.error('Get spending trends error:', error);
    res.status(500).json({ error: 'Failed to fetch spending trends' });
  }
};

module.exports = {
  getInsights,
  getSpendingTrends
};
