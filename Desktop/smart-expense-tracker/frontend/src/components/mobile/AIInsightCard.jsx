import React from 'react';
import { motion } from 'framer-motion';
import { LightBulbIcon, SparklesIcon } from '@heroicons/react/24/outline';

const AIInsightCard = ({ insight, type = 'suggestion' }) => {
  const typeStyles = {
    suggestion: {
      bg: 'bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30',
      border: 'border-indigo-200 dark:border-indigo-700',
      icon: 'text-indigo-600 dark:text-indigo-400',
      iconBg: 'bg-indigo-100 dark:bg-indigo-800',
    },
    warning: {
      bg: 'bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/30 dark:to-orange-900/30',
      border: 'border-red-200 dark:border-red-700',
      icon: 'text-red-600 dark:text-red-400',
      iconBg: 'bg-red-100 dark:bg-red-800',
    },
    success: {
      bg: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30',
      border: 'border-green-200 dark:border-green-700',
      icon: 'text-green-600 dark:text-green-400',
      iconBg: 'bg-green-100 dark:bg-green-800',
    },
  };

  const style = typeStyles[type] || typeStyles.suggestion;

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`${style.bg} glass-card p-4 border ${style.border} hover:shadow-lg transition-all duration-300`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2.5 rounded-xl ${style.iconBg} flex-shrink-0`}>
          <LightBulbIcon className={`w-5 h-5 ${style.icon}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <SparklesIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h4 className="font-semibold text-gray-900 dark:text-white">AI Insight</h4>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{insight}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default AIInsightCard;
