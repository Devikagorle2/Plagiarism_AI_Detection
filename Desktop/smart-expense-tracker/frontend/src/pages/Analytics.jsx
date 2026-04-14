import React, { useState, useEffect } from 'react';
import { aiAPI, expensesAPI } from '../utils/api';
import { CategoryBarChart, WeeklyTrendChart } from '../components/Charts';
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon, 
  LightBulbIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/currency';

const Analytics = () => {
  const { currency } = useAuth();
  const [insights, setInsights] = useState(null);
  const [trends, setTrends] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trendMonths, setTrendMonths] = useState(3);

  useEffect(() => {
    fetchAnalyticsData();
  }, [trendMonths]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      const [insightsRes, trendsRes, dashboardRes] = await Promise.all([
        aiAPI.getInsights(),
        aiAPI.getSpendingTrends(trendMonths),
        expensesAPI.getDashboardData()
      ]);

      setInsights(insightsRes);
      setTrends(trendsRes);
      setDashboardData(dashboardRes);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getTrendIcon = (trend) => {
    if (trend === 'increasing') return <ArrowTrendingUpIcon className="w-5 h-5 text-red-500" />;
    if (trend === 'decreasing') return <ArrowTrendingDownIcon className="w-5 h-5 text-green-500" />;
    return <div className="w-5 h-5 rounded-full bg-gray-300"></div>;
  };

  const getTrendColor = (trend) => {
    if (trend === 'increasing') return 'text-red-600';
    if (trend === 'decreasing') return 'text-green-600';
    return 'text-gray-600';
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600">Deep insights into your spending patterns and trends</p>
      </div>

      {/* AI Insights Section */}
      {insights && (
        <div className="mb-8 bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <LightBulbIcon className="w-6 h-6 text-yellow-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">AI-Powered Insights</h3>
          </div>
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 whitespace-pre-line">
              {insights.insights}
            </p>
          </div>
        </div>
      )}

      {/* Spending Trends */}
      {trends && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Spending Trends</h3>
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Show last:</label>
              <select
                value={trendMonths}
                onChange={(e) => setTrendMonths(parseInt(e.target.value))}
                className="text-sm border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              >
                <option value={3}>3 months</option>
                <option value={6}>6 months</option>
                <option value={12}>12 months</option>
              </select>
            </div>
          </div>

          {/* Trend Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Average Monthly Spending</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {formatCurrency(trends.summary.averageMonthlySpending, currency)}
                  </p>
                </div>
                <div className="p-3 bg-primary-100 rounded-full">
                  <CalendarIcon className="w-6 h-6 text-primary-600" />
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Highest Month</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {formatCurrency(trends.summary.highestSpendingMonth, currency)}
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <ArrowTrendingUpIcon className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Lowest Month</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {formatCurrency(trends.summary.lowestSpendingMonth, currency)}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <ArrowTrendingDownIcon className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Trend Details */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h4 className="text-md font-medium text-gray-900">Monthly Breakdown</h4>
            </div>
            <div className="divide-y divide-gray-200">
              {trends.trends.map((trend, index) => (
                <div key={trend.month} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        {getTrendIcon(trend.trendDirection)}
                        <span className="ml-2 text-sm font-medium text-gray-900">
                          {new Date(trend.month + '-01').toLocaleDateString('en-US', { 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                        </span>
                      </div>
                      <span className={`text-sm ${getTrendColor(trend.trendDirection)}`}>
                        {trend.trendDirection === 'stable' ? 'No change' : 
                         `${trend.trendDirection} by ${trend.trendPercentage}%`}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        {formatCurrency(trend.totalSpent, currency)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {trend.expenseCount} expense{trend.expenseCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  
                  {/* Category breakdown for this month */}
                  <div className="mt-3">
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(trend.categoryBreakdown).map(([category, amount]) => (
                        <span
                          key={category}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {category}: {formatCurrency(amount, currency)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      {dashboardData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CategoryBarChart categoryBreakdown={dashboardData.categoryBreakdown} />
          <WeeklyTrendChart last7Days={dashboardData.last7Days} />
        </div>
      )}

      {/* Category Analysis */}
      {dashboardData && dashboardData.categoryBreakdown && (
        <div className="mt-6 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Category Analysis</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {Object.entries(dashboardData.categoryBreakdown)
                .sort(([,a], [,b]) => b - a)
                .map(([category, amount], index) => {
                  const percentage = ((amount / dashboardData.summary.totalSpent) * 100).toFixed(1);
                  const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500'];
                  const color = colors[index % colors.length];
                  
                  return (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900">{category}</span>
                          <span className="text-sm text-gray-500">{formatCurrency(amount, currency)} ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`${color} h-2 rounded-full`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
