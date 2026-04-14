import React from 'react';
import { motion } from 'framer-motion';
import { ChartBarIcon } from '@heroicons/react/24/outline';

const ChartCard = ({ title, children, icon: Icon = ChartBarIcon }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-card p-4 rounded-2xl hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900">
          <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </div>
      </div>
      <div className="h-64">
        {children}
      </div>
    </motion.div>
  );
};

export default ChartCard;
