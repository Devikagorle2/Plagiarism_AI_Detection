export const summaryData = {
  totalSpent: 45230,
  remainingBudget: 24770,
  budgetUsage: 64.6,
  monthlyBudget: 70000,
  dailyAverage: 1507,
  daysRemaining: 16,
};

export const categoryData = [
  { name: 'Food', value: 15000, color: '#F97316' },
  { name: 'Travel', value: 8000, color: '#3B82F6' },
  { name: 'Shopping', value: 12000, color: '#8B5CF6' },
  { name: 'Bills', value: 7230, color: '#EF4444' },
  { name: 'Others', value: 3000, color: '#6B7280' },
];

export const trendData = [
  { date: 'Mon', amount: 5000 },
  { date: 'Tue', amount: 3200 },
  { date: 'Wed', amount: 7800 },
  { date: 'Thu', amount: 4500 },
  { date: 'Fri', amount: 9200 },
  { date: 'Sat', amount: 6100 },
  { date: 'Sun', amount: 9430 },
];

export const recentTransactions = [
  { id: 1, category: 'Food', description: 'Lunch at Cafe', amount: 450, date: 'Today' },
  { id: 2, category: 'Shopping', description: 'Amazon Purchase', amount: 2340, date: 'Today' },
  { id: 3, category: 'Travel', description: 'Uber Ride', amount: 280, date: 'Yesterday' },
  { id: 4, category: 'Bills', description: 'Electricity Bill', amount: 1850, date: 'Yesterday' },
  { id: 5, category: 'Food', description: 'Grocery Store', amount: 1850, date: 'Today' },
];

export const groupedTransactions = {
  'Today': [
    { id: 1, category: 'Food', description: 'Lunch at Cafe', amount: 450, date: 'Today' },
    { id: 2, category: 'Shopping', description: 'Amazon Purchase', amount: 2340, date: 'Today' },
    { id: 3, category: 'Food', description: 'Grocery Store', amount: 1850, date: 'Today' },
  ],
  'Yesterday': [
    { id: 4, category: 'Travel', description: 'Uber Ride', amount: 280, date: 'Yesterday' },
    { id: 5, category: 'Bills', description: 'Electricity Bill', amount: 1850, date: 'Yesterday' },
    { id: 6, category: 'Shopping', description: 'Clothing Store', amount: 3200, date: 'Yesterday' },
  ],
  'This Week': [
    { id: 7, category: 'Food', description: 'Dinner at Restaurant', amount: 1200, date: 'This Week' },
    { id: 8, category: 'Travel', description: 'Gas Station', amount: 2500, date: 'This Week' },
    { id: 9, category: 'Others', description: 'ATM Withdrawal', amount: 5000, date: 'This Week' },
    { id: 10, category: 'Food', description: 'Coffee Shop', amount: 180, date: 'This Week' },
  ],
};

export const aiInsights = [
  {
    type: 'suggestion',
    insight: 'Your spending on food has increased by 15% this week. Consider meal prepping to save money. You could potentially save ₹2,000/month by cooking at home more often.',
  },
  {
    type: 'warning',
    insight: 'You\'ve spent 30% of your budget in just 10 days. At this rate, you\'ll exceed your budget by the 20th. Consider reducing discretionary spending.',
  },
  {
    type: 'success',
    insight: 'Great job! Your shopping expenses have decreased by 20% compared to last month. Keep up the good work!',
  },
];

export const categoryBreakdown = [
  { category: 'Food', spent: 15000, percentage: 33, color: 'bg-orange-500' },
  { category: 'Shopping', spent: 12000, percentage: 27, color: 'bg-purple-500' },
  { category: 'Travel', spent: 8000, percentage: 18, color: 'bg-blue-500' },
  { category: 'Bills', spent: 7230, percentage: 16, color: 'bg-red-500' },
  { category: 'Others', spent: 3000, percentage: 6, color: 'bg-gray-500' },
];

export const budgetData = {
  monthlyBudget: 70000,
  spent: 45230,
  remaining: 24770,
  usagePercentage: 64.6,
  dailyAverage: 1507,
  daysRemaining: 16,
};
