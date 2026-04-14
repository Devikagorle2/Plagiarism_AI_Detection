import React from 'react';
import { 
  BanknotesIcon, 
  CurrencyDollarIcon, 
  ChartBarIcon,
  ExclamationTriangleIcon,
  GiftIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/currency';

const DashboardCards = ({ summary, alerts }) => {
  const { currency } = useAuth();
  
  const cards = [
    {
      name: 'Total Spent',
      value: formatCurrency(summary.totalSpent, currency),
      icon: CurrencyDollarIcon,
      color: 'danger',
      trend: null
    },
    {
      name: 'Monthly Budget',
      value: formatCurrency(summary.budget, currency),
      icon: BanknotesIcon,
      color: 'primary',
      trend: null
    },
    {
      name: 'Remaining',
      value: formatCurrency(summary.remainingBudget, currency),
      icon: ChartBarIcon,
      color: summary.remainingBudget >= 0 ? 'success' : 'danger',
      trend: null
    },
    ...(summary.savings && summary.savings.allocated > 0 ? [{
      name: 'Savings',
      value: formatCurrency(summary.savings.remaining, currency),
      icon: GiftIcon,
      color: summary.savings.remaining >= 0 ? 'success' : 'warning',
      trend: null
    }] : [])
  ];

  const getColorClasses = (color) => {
    const colors = {
      primary: {
        bg: 'bg-primary-50 dark:bg-primary-900/20',
        text: 'text-primary-600 dark:text-primary-400',
        iconBg: 'bg-primary-100 dark:bg-primary-900/30'
      },
      success: {
        bg: 'bg-success-50 dark:bg-success-900/20',
        text: 'text-success-600 dark:text-success-400',
        iconBg: 'bg-success-100 dark:bg-success-900/30'
      },
      warning: {
        bg: 'bg-warning-50 dark:bg-warning-900/20',
        text: 'text-warning-600 dark:text-warning-400',
        iconBg: 'bg-warning-100 dark:bg-warning-900/30'
      },
      danger: {
        bg: 'bg-danger-50 dark:bg-danger-900/20',
        text: 'text-danger-600 dark:text-danger-400',
        iconBg: 'bg-danger-100 dark:bg-danger-900/30'
      }
    };
    return colors[color] || colors.primary;
  };

  return (
    <div className="space-y-4">
      {/* Alerts */}
      {alerts && alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className={`p-4 rounded-md ${
                alert.type === 'danger' ? 'bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800' :
                alert.type === 'warning' ? 'bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800' :
                'bg-info-50 dark:bg-info-900/20 border border-info-200 dark:border-info-800'
              }`}
            >
              <div className="flex">
                <ExclamationTriangleIcon className={`w-5 h-5 ${
                  alert.type === 'danger' ? 'text-danger-600' :
                  alert.type === 'warning' ? 'text-warning-600' :
                  'text-info-600'
                }`} />
                <div className="ml-3">
                  <p className={`text-sm ${
                    alert.type === 'danger' ? 'text-danger-800 dark:text-danger-300' :
                    alert.type === 'warning' ? 'text-warning-800 dark:text-warning-300' :
                    'text-info-800 dark:text-info-300'
                  }`}>
                    {alert.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          const colors = getColorClasses(card.color);
          
          return (
            <div key={card.name} className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 ${colors.iconBg} rounded-md p-3`}>
                    <Icon className={`w-6 h-6 ${colors.text}`} />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        {card.name}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                          {card.value}
                        </div>
                        {card.trend && (
                          <span className={`ml-2 text-sm font-medium ${
                            card.trend > 0 ? 'text-success-600' : 'text-danger-600'
                          }`}>
                            {card.trend > 0 ? '+' : ''}{card.trend}%
                          </span>
                        )}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardCards;
