import React, { useState } from 'react';
import { 
  WalletIcon, 
  ArrowTrendingUpIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  PencilIcon 
} from '@heroicons/react/24/outline';
import BottomNav from '../../components/mobile/BottomNav';

const Budget = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [budget, setBudget] = useState(70000);
  const [tempBudget, setTempBudget] = useState(70000);

  const budgetData = {
    monthlyBudget: 70000,
    spent: 45230,
    remaining: 24770,
    usagePercentage: 64.6,
    dailyAverage: 1507,
    daysRemaining: 16,
  };

  const handleSave = () => {
    setBudget(tempBudget);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempBudget(budget);
    setIsEditing(false);
  };

  const getBudgetStatus = () => {
    if (budgetData.usagePercentage >= 90) return { status: 'critical', color: 'red', icon: ExclamationTriangleIcon };
    if (budgetData.usagePercentage >= 75) return { status: 'warning', color: 'yellow', icon: ExclamationTriangleIcon };
    return { status: 'healthy', color: 'green', icon: CheckCircleIcon };
  };

  const budgetStatus = getBudgetStatus();

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Budget</h1>
          <p className="text-gray-500">Manage your monthly budget</p>
        </div>

        {/* Main Budget Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <WalletIcon className="w-6 h-6 text-indigo-600" />
              <span className="font-semibold text-gray-900">Monthly Budget</span>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <PencilIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div className="relative">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-900">
                  ₹
                </span>
                <input
                  type="number"
                  value={tempBudget}
                  onChange={(e) => setTempBudget(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 text-3xl font-bold text-gray-900 bg-gray-50 rounded-xl border-2 border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                  min="0"
                  step="1000"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-4xl font-bold text-gray-900 mb-2">₹{budget.toLocaleString()}</p>
              <p className="text-sm text-gray-500">April 2026</p>
            </div>
          )}
        </div>

        {/* Budget Status */}
        <div className={`bg-gradient-to-r ${
          budgetStatus.color === 'red' ? 'from-red-50 to-orange-50 border-red-200' :
          budgetStatus.color === 'yellow' ? 'from-yellow-50 to-amber-50 border-yellow-200' :
          'from-green-50 to-emerald-50 border-green-200'
        } rounded-2xl p-4 border mb-6`}>
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${
              budgetStatus.color === 'red' ? 'bg-red-100' :
              budgetStatus.color === 'yellow' ? 'bg-yellow-100' :
              'bg-green-100'
            }`}>
              <budgetStatus.icon className={`w-5 h-5 ${
                budgetStatus.color === 'red' ? 'text-red-600' :
                budgetStatus.color === 'yellow' ? 'text-yellow-600' :
                'text-green-600'
              }`} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                {budgetStatus.status === 'critical' ? 'Budget Critical' :
                 budgetStatus.status === 'warning' ? 'Budget Warning' :
                 'Budget On Track'}
              </h3>
              <p className="text-sm text-gray-600">
                {budgetStatus.status === 'critical' 
                  ? 'You\'ve used 90% of your budget. Consider reducing expenses.'
                  : budgetStatus.status === 'warning'
                  ? 'You\'ve used 75% of your budget. Monitor your spending.'
                  : 'Your spending is within healthy limits. Keep it up!'}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold text-gray-900">Budget Usage</span>
            <span className={`text-sm font-bold ${
              budgetStatus.color === 'red' ? 'text-red-600' :
              budgetStatus.color === 'yellow' ? 'text-yellow-600' :
              'text-green-600'
            }`}>
              {budgetData.usagePercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
            <div
              className={`h-4 rounded-full transition-all duration-500 ${
                budgetStatus.color === 'red' ? 'bg-red-500' :
                budgetStatus.color === 'yellow' ? 'bg-yellow-500' :
                'bg-green-500'
              }`}
              style={{ width: `${budgetData.usagePercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">₹{budgetData.spent.toLocaleString()} spent</span>
            <span className="text-gray-500">₹{budgetData.remaining.toLocaleString()} remaining</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <ArrowTrendingUpIcon className="w-5 h-5 text-indigo-600" />
              <span className="text-sm font-medium text-gray-500">Daily Average</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">₹{budgetData.dailyAverage.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <WalletIcon className="w-5 h-5 text-indigo-600" />
              <span className="text-sm font-medium text-gray-500">Days Remaining</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{budgetData.daysRemaining}</p>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Category Breakdown</h3>
          <div className="space-y-4">
            {[
              { category: 'Food', spent: 15000, percentage: 33, color: 'bg-orange-500' },
              { category: 'Shopping', spent: 12000, percentage: 27, color: 'bg-purple-500' },
              { category: 'Travel', spent: 8000, percentage: 18, color: 'bg-blue-500' },
              { category: 'Bills', spent: 7230, percentage: 16, color: 'bg-red-500' },
              { category: 'Others', spent: 3000, percentage: 6, color: 'bg-gray-500' },
            ].map((item) => (
              <div key={item.category}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{item.category}</span>
                  <span className="text-sm font-bold text-gray-900">₹{item.spent.toLocaleString()} ({item.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${item.color} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Budget;
