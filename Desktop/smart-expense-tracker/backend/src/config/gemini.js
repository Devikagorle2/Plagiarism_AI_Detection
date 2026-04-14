const { GoogleGenerativeAI } = require('@google/generative-ai');

// Check if Gemini API key is available
let genAI;
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
} else {
  console.warn('Gemini API key not found. AI insights will be disabled.');
}

const getSpendingInsights = async (expenses, budget) => {
  try {
    if (!genAI) {
      // Return mock insights when Gemini is not available
      return {
        insights: "AI insights are currently unavailable. Please set up your Gemini API key to get personalized spending recommendations.",
        summary: {
          totalSpent: expenses.reduce((sum, expense) => sum + expense.amount, 0),
          budget,
          remaining: budget - expenses.reduce((sum, expense) => sum + expense.amount, 0),
          categorySpending: {},
          categoryPercentages: {}
        }
      };
    }
    
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    // Calculate spending patterns
    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const categorySpending = {};
    expenses.forEach(expense => {
      categorySpending[expense.category] = (categorySpending[expense.category] || 0) + expense.amount;
    });
    
    const categoryPercentages = {};
    Object.keys(categorySpending).forEach(category => {
      categoryPercentages[category] = ((categorySpending[category] / totalSpent) * 100).toFixed(1);
    });
    
    const prompt = `Analyze this spending data and provide personalized insights:
    
    Total Spent: $${totalSpent.toFixed(2)}
    Budget: $${budget.toFixed(2)}
    Remaining: $${(budget - totalSpent).toFixed(2)}
    
    Category Breakdown:
    ${Object.entries(categoryPercentages).map(([cat, pct]) => `${cat}: ${pct}%`).join('\n')}
    
    Recent Expenses:
    ${expenses.slice(-5).map(e => `${e.category}: $${e.amount.toFixed(2)} on ${e.date}`).join('\n')}
    
    Provide 3-4 specific, actionable insights about spending patterns and suggestions for saving money. Be encouraging and practical.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const insights = response.text();
    
    return {
      insights,
      summary: {
        totalSpent,
        budget,
        remaining: budget - totalSpent,
        categorySpending,
        categoryPercentages
      }
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to generate AI insights');
  }
};

module.exports = { getSpendingInsights };
