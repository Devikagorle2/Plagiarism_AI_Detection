import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/currency';

const CategoryBudgetProgress = ({ categoryBudgetMap, categoryBreakdown }) => {
  const { currency } = useAuth();

  if (!categoryBudgetMap || Object.keys(categoryBudgetMap).length === 0) {
    return null;
  }

  const categories = Object.keys(categoryBudgetMap);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Category Budget Progress</h3>
      <div className="space-y-4">
        {categories.map((category, index) => {
          const budget = categoryBudgetMap[category];
          const spent = budget.spent || categoryBreakdown[category] || 0;
          const allocated = budget.allocated;
          const percentage = allocated > 0 ? (spent / allocated) * 100 : 0;
          const remaining = allocated - spent;
          
          let color = 'bg-primary-600';
          if (percentage >= 90) color = 'bg-red-500';
          else if (percentage >= 75) color = 'bg-yellow-500';
          else if (percentage >= 50) color = 'bg-blue-500';
          else color = 'bg-green-500';

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{category}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {formatCurrency(spent, currency)} / {formatCurrency(allocated, currency)}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <motion.div
                  className={`${color} h-2 rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(percentage, 100)}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
              <div className="flex justify-between text-xs">
                <span className={percentage >= 90 ? 'text-red-600 dark:text-red-400 font-medium' : 'text-gray-500 dark:text-gray-400'}>
                  {percentage.toFixed(1)}% used
                </span>
                <span className={remaining < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}>
                  {remaining >= 0 ? `${formatCurrency(remaining, currency)} remaining` : `${formatCurrency(Math.abs(remaining), currency)} over`}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryBudgetProgress;
