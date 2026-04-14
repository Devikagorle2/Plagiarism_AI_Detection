import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { expensesAPI, budgetAPI, aiAPI } from '../utils/api';
import DashboardCards from '../components/DashboardCards';
import { CategoryPieChart, WeeklyTrendChart, CategoryBarChart } from '../components/Charts';
import CategoryBudgetProgress from '../components/CategoryBudgetProgress';
import Mascot from '../components/Mascot';
import PageTransition from '../components/PageTransition';
import EmptyState from '../components/EmptyState';
import PullToRefresh from 'react-pull-to-refresh';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { 
  PlusCircleIcon, 
  LightBulbIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { formatCurrency } from '../utils/currency';

const Dashboard = () => {
  const { user, currency } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [budgetAlerts, setBudgetAlerts] = useState([]);
  const [aiInsights, setAiInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [dashboardRes, alertsRes, insightsRes] = await Promise.all([
        expensesAPI.getDashboardData(),
        budgetAPI.getBudgetAlerts(),
        aiAPI.getInsights()
      ]);

      setDashboardData(dashboardRes);
      setBudgetAlerts(alertsRes.alerts || []);
      setAiInsights(insightsRes);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="p-6 space-y-4">
          <Skeleton height={40} className="rounded-xl" />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} height={100} className="rounded-xl" />
            ))}
          </div>
          <Skeleton height={300} className="rounded-xl" />
          <Skeleton height={200} className="rounded-xl" />
        </div>
      </PageTransition>
    );
  }

  if (!dashboardData) {
    return (
      <PageTransition>
        <div className="p-6">
          <EmptyState message="Get started by adding your first expense." />
          <div className="mt-6 text-center">
            <button
              onClick={() => window.location.href = '/expenses'}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              <PlusCircleIcon className="w-5 h-5 mr-2" />
              Add Expense
            </button>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <PullToRefresh onRefresh={fetchDashboardData} resistance={2.5}>
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user?.name || 'User'}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Here's your financial overview for this month.</p>
          </div>

          {/* Dashboard Cards */}
          <div className="dashboard-summary">
            <DashboardCards
              summary={dashboardData.summary}
              alerts={budgetAlerts}
            />
          </div>

          {/* Category Budget Progress */}
          <div className="mt-6">
            <CategoryBudgetProgress
              categoryBudgetMap={dashboardData.categoryBudgetMap}
              categoryBreakdown={dashboardData.categoryBreakdown}
            />
          </div>

        {/* Charts Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 chart-card">
          <CategoryPieChart categoryBreakdown={dashboardData.categoryBreakdown} />
          <WeeklyTrendChart last7Days={dashboardData.last7Days} />
        </div>

        {/* Category Bar Chart */}
        <div className="mt-6">
          <CategoryBarChart categoryBreakdown={dashboardData.categoryBreakdown} />
        </div>

        {/* AI Insights Section */}
        {aiInsights && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <LightBulbIcon className="w-6 h-6 text-yellow-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
            </div>
            <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 whitespace-pre-line">
              {aiInsights.insights}
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(aiInsights.summary.totalSpent, currency)}
              </p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-500">Budget</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(aiInsights.summary.budget, currency)}
              </p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-500">Remaining</p>
              <p className={`text-lg font-semibold ${
                aiInsights.summary.remaining >= 0 ? 'text-success-600' : 'text-danger-600'
              }`}>
                {formatCurrency(aiInsights.summary.remaining, currency)}
              </p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-500">Categories</p>
              <p className="text-lg font-semibold text-gray-900">
                {Object.keys(aiInsights.summary.categorySpending).length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Expenses */}
      {dashboardData.recentExpenses && dashboardData.recentExpenses.length > 0 && (
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow transaction-list">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Expenses</h3>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {dashboardData.recentExpenses.map((expense) => (
              <div key={expense.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{expense.description || expense.category}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{expense.category} - {expense.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(expense.amount, currency)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => window.location.href = '/expenses'}
              className="text-sm text-primary-600 hover:text-primary-800 font-medium"
            >
              View all expenses
            </button>
          </div>
        </div>
      )}

      {/* Mascot */}
      {dashboardData.summary && (
        <Mascot spentPercentage={dashboardData.summary.budgetUsagePercentage || 0} />
      )}
    </div>
      </PullToRefresh>
    </PageTransition>
  );
};

export default Dashboard;
