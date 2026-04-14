import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import PageTransition from '../components/PageTransition';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { WalletIcon, ArrowTrendingUpIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { formatCurrency } from '../utils/currency';

const categories = ['Food', 'Travel', 'Shopping', 'Bills', 'Savings', 'Entertainment', 'Health', 'Others'];

const BudgetSetup = () => {
  const { currency } = useAuth();
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [month, setMonth] = useState(currentMonth);
  const [allocations, setAllocations] = useState({});
  const [totalBudget, setTotalBudget] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchBudget = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/budget/category?month=${month}`);
      const data = res.data;
      const alloc = {};
      data.forEach(item => { alloc[item.category] = item.allocated; });
      setAllocations(alloc);
      setTotalBudget(Object.values(alloc).reduce((a,b) => a+b, 0));
      setSaved(false);
    } catch (error) {
      console.error('Error fetching budget:', error);
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => {
    fetchBudget();
  }, [fetchBudget]);

  const handleAllocationChange = (cat, value) => {
    const newAlloc = { ...allocations, [cat]: parseFloat(value) || 0 };
    setAllocations(newAlloc);
    setTotalBudget(Object.values(newAlloc).reduce((a,b) => a+b, 0));
    setSaved(false);
  };

  const saveBudget = async () => {
    try {
      setLoading(true);
      for (const [category, allocated] of Object.entries(allocations)) {
        if (allocated > 0) {
          await api.put('/api/budget/category', { month, category, allocated });
        }
      }
      toast.success('Budget saved successfully!');
      setSaved(true);
    } catch (error) {
      console.error('Error saving budget:', error);
      toast.error('Failed to save budget');
    } finally {
      setLoading(false);
    }
  };

  const getNextMonths = () => {
    const months = [];
    const currentDate = new Date();
    
    for (let i = 0; i < 6; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
      months.push({
        value: date.toISOString().slice(0, 7),
        label: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      });
    }
    
    return months;
  };

  return (
    <PageTransition>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <WalletIcon className="w-7 h-7 mr-2 text-primary-600" />
            Set Monthly Budget
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Allocate your budget by category</p>
        </div>

        {/* Month Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Month
          </label>
          <select
            value={month}
            onChange={e => setMonth(e.target.value)}
            className="form-input dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {getNextMonths().map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>

        {/* Budget Allocation Cards */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
          <div className="space-y-4">
            {categories.map(cat => (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: categories.indexOf(cat) * 0.05 }}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <span className="font-medium text-gray-900 dark:text-white w-32">{cat}</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 dark:text-gray-400">{currency}</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={allocations[cat] || ''}
                    onChange={e => handleAllocationChange(cat, e.target.value)}
                    className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Total Budget Summary */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl shadow-lg p-6 mb-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm font-medium">Total Monthly Budget</p>
              <p className="text-3xl font-bold mt-1">{formatCurrency(totalBudget, currency)}</p>
            </div>
            <ArrowTrendingUpIcon className="w-12 h-12 text-primary-200" />
          </div>
          {saved && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 flex items-center text-primary-100 text-sm"
            >
              <CheckCircleIcon className="w-4 h-4 mr-2" />
              Budget saved successfully
            </motion.div>
          )}
        </motion.div>

        {/* Save Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={saveBudget}
          disabled={loading || totalBudget === 0}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-xl shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          ) : null}
          {loading ? 'Saving...' : 'Save Budget'}
        </motion.button>
      </div>
    </PageTransition>
  );
};

export default BudgetSetup;
