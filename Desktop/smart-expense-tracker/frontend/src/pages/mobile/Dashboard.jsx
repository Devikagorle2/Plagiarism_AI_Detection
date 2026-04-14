import React, { useState, useCallback } from 'react';
import PullToRefresh from 'react-pull-to-refresh';
import { 
  WalletIcon, 
  TrendingDownIcon, 
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import SummaryCard from '../../components/mobile/SummaryCard';
import ChartCard from '../../components/mobile/ChartCard';
import AIInsightCard from '../../components/mobile/AIInsightCard';
import TransactionItem from '../../components/mobile/TransactionItem';
import BottomNav from '../../components/mobile/BottomNav';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [refreshing, setRefreshing] = useState(false);

  const summaryData = {
    totalSpent: '₹45,230',
    remainingBudget: '₹24,770',
    budgetUsage: 64.6,
    monthlyBudget: '₹70,000',
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate data fetch - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  }, []);

  const categoryData = [
    { name: 'Food', value: 15000, color: '#F97316' },
    { name: 'Travel', value: 8000, color: '#3B82F6' },
    { name: 'Shopping', value: 12000, color: '#8B5CF6' },
    { name: 'Bills', value: 7230, color: '#EF4444' },
    { name: 'Others', value: 3000, color: '#6B7280' },
  ];

  const trendData = [
    { date: 'Mon', amount: 5000 },
    { date: 'Tue', amount: 3200 },
    { date: 'Wed', amount: 7800 },
    { date: 'Thu', amount: 4500 },
    { date: 'Fri', amount: 9200 },
    { date: 'Sat', amount: 6100 },
    { date: 'Sun', amount: 9430 },
  ];

  const recentTransactions = [
    { id: 1, category: 'Food', description: 'Lunch at Cafe', amount: 450, date: 'Today' },
    { id: 2, category: 'Shopping', description: 'Amazon Purchase', amount: 2340, date: 'Today' },
    { id: 3, category: 'Travel', description: 'Uber Ride', amount: 280, date: 'Yesterday' },
    { id: 4, category: 'Bills', description: 'Electricity Bill', amount: 1850, date: 'Yesterday' },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <PullToRefresh onRefresh={handleRefresh} resistance={2.5}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
        <div className="max-w-md mx-auto px-4 py-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {getGreeting()}, Devika 👋
            </h1>
            <p className="text-gray-500 dark:text-gray-400">Here's your financial overview</p>
          </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <SummaryCard
            icon={WalletIcon}
            label="Total Spent"
            value={summaryData.totalSpent}
            trend={12}
            color="danger"
          />
          <SummaryCard
            icon={TrendingDownIcon}
            label="Remaining"
            value={summaryData.remainingBudget}
            color="success"
          />
        </div>

        {/* Budget Progress */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ChartBarIcon className="w-5 h-5 text-indigo-600" />
              <span className="font-semibold text-gray-900">Budget Usage</span>
            </div>
            <span className="text-sm font-medium text-indigo-600">{summaryData.budgetUsage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                summaryData.budgetUsage > 80 ? 'bg-red-500' : 
                summaryData.budgetUsage > 60 ? 'bg-yellow-500' : 'bg-indigo-500'
              }`}
              style={{ width: `${summaryData.budgetUsage}%` }}
            />
          </div>
          <p className="text-xs text-gray-500">
            {summaryData.remainingBudget} of {summaryData.monthlyBudget} remaining
          </p>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-4 mb-6">
          <ChartCard title="Category Spending" icon={ChartBarIcon}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Spending Trend" icon={ArrowTrendingUpIcon}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#4F46E5" 
                  strokeWidth={3}
                  dot={{ fill: '#4F46E5', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* AI Insight */}
        <div className="mb-6">
          <AIInsightCard 
            insight="Your spending on food has increased by 15% this week. Consider meal prepping to save money. You could potentially save ₹2,000/month by cooking at home more often."
            type="suggestion"
          />
        </div>

        {/* Recent Transactions */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
            <button className="text-sm text-indigo-600 font-medium hover:text-indigo-800">
              See All
            </button>
          </div>
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <TransactionItem 
                key={transaction.id} 
                transaction={transaction}
                onClick={() => console.log('Transaction clicked', transaction.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
    </PullToRefresh>
  );
};

export default Dashboard;
