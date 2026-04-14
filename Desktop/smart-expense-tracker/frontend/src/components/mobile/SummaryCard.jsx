import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/outline';

const SummaryCard = ({ 
  icon: Icon, 
  label, 
  value, 
  trend, 
  color = 'primary',
  onClick 
}) => {
  const colorClasses = {
    primary: {
      bg: 'bg-indigo-100',
      iconBg: 'bg-indigo-500',
      text: 'text-indigo-600',
    },
    success: {
      bg: 'bg-green-100',
      iconBg: 'bg-green-500',
      text: 'text-green-600',
    },
    danger: {
      bg: 'bg-red-100',
      iconBg: 'bg-red-500',
      text: 'text-red-600',
    },
  };

  const colors = colorClasses[color] || colorClasses.primary;

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`glass-card p-4 rounded-2xl cursor-pointer ${onClick ? 'hover:shadow-lg' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`p-3 rounded-xl ${colors.iconBg}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div className={`flex items-center text-sm ${trend > 0 ? 'text-red-500' : 'text-green-500'}`}>
            {trend > 0 ? <ArrowUpIcon className="w-4 h-4 mr-1" /> : <ArrowDownIcon className="w-4 h-4 mr-1" />}
            <span className="font-medium">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    </motion.div>
  );
};

export default SummaryCard;
