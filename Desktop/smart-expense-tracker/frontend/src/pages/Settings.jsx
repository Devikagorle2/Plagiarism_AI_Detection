import React, { useState, useEffect } from 'react';
import { budgetAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { 
  CurrencyDollarIcon, 
  BellIcon,
  UserCircleIcon,
  MoonIcon,
  SunIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { getCurrencySymbol } from '../utils/currency';

const Settings = () => {
  const { user, currency, setCurrency } = useAuth();
  const { darkMode, setDarkMode } = useTheme();
  const currencySymbol = getCurrencySymbol(currency);
  const [budget, setBudget] = useState(null);
  const [newBudget, setNewBudget] = useState({
    monthlyBudget: '',
    month: new Date().toISOString().slice(0, 7) // YYYY-MM format
  });
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [messagingPrefs, setMessagingPrefs] = useState({
    phone: '',
    whatsapp: '',
    reminderChannel: 'email'
  });

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  ];

  useEffect(() => {
    fetchBudget();
    fetchBudgetAlerts();
  }, []);

  const fetchBudget = async () => {
    try {
      const response = await budgetAPI.getBudget();
      if (response.budget) {
        setBudget(response.budget);
        setNewBudget({
          monthlyBudget: response.budget.monthlyBudget.toString(),
          month: response.budget.month
        });
      }
    } catch (error) {
      console.error('Error fetching budget:', error);
    }
  };

  const fetchBudgetAlerts = async () => {
    try {
      const response = await budgetAPI.getBudgetAlerts();
      setAlerts(response.alerts || []);
    } catch (error) {
      console.error('Error fetching budget alerts:', error);
    }
  };

  const handleSetBudget = async (e) => {
    e.preventDefault();
    
    if (!newBudget.monthlyBudget || parseFloat(newBudget.monthlyBudget) <= 0) {
      toast.error('Please enter a valid budget amount');
      return;
    }

    try {
      setLoading(true);
      await budgetAPI.setBudget({
        monthlyBudget: parseFloat(newBudget.monthlyBudget),
        month: newBudget.month
      });
      
      toast.success('Budget updated successfully!');
      fetchBudget();
      fetchBudgetAlerts();
    } catch (error) {
      console.error('Error setting budget:', error);
      toast.error(error.response?.data?.error || 'Failed to set budget');
    } finally {
      setLoading(false);
    }
  };

  const getNextMonths = () => {
    const months = [];
    const currentDate = new Date();
    
    for (let i = 0; i < 3; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
      months.push({
        value: date.toISOString().slice(0, 7),
        label: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      });
    }
    
    return months;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your budget and preferences</p>
      </div>

      <div className="space-y-6">
        {/* User Profile Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <UserCircleIcon className="w-5 h-5 mr-2" />
              Profile Information
            </h3>
          </div>
          <div className="p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                {user?.photoURL ? (
                  <img
                    className="h-16 w-16 rounded-full"
                    src={user.photoURL}
                    alt={user.name}
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center">
                    <UserCircleIcon className="h-10 w-10 text-gray-500" />
                  </div>
                )}
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-900">{user?.name || 'User'}</h4>
                <p className="text-sm text-gray-500">{user?.email}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Account created via {user?.provider || 'email'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Currency Preferences */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <CurrencyDollarIcon className="w-5 h-5 mr-2" />
              Currency Preferences
            </h3>
          </div>
          <div className="p-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Select Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="form-input dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                {currencies.map(curr => (
                  <option key={curr.code} value={curr.code}>
                    {curr.symbol} {curr.code} - {curr.name}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                This will update the currency symbol throughout the application.
              </p>
            </div>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              {darkMode ? <MoonIcon className="w-5 h-5 mr-2" /> : <SunIcon className="w-5 h-5 mr-2" />}
              Appearance
            </h3>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Dark Mode</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Switch between light and dark theme</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setDarkMode(!darkMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  darkMode ? 'bg-primary-600' : 'bg-gray-200'
                }`}
              >
                <motion.span
                  animate={{ x: darkMode ? 20 : 4 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform"
                />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Messaging Preferences */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <BellIcon className="w-5 h-5 mr-2" />
              Messaging Preferences
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone Number (for SMS)
              </label>
              <input
                type="tel"
                placeholder="+1234567890"
                value={messagingPrefs.phone}
                onChange={(e) => setMessagingPrefs({...messagingPrefs, phone: e.target.value})}
                className="form-input dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Include country code (e.g., +1 for US)
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                WhatsApp Number
              </label>
              <input
                type="tel"
                placeholder="+1234567890"
                value={messagingPrefs.whatsapp}
                onChange={(e) => setMessagingPrefs({...messagingPrefs, whatsapp: e.target.value})}
                className="form-input dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Include country code (e.g., +1 for US)
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Preferred Reminder Channel
              </label>
              <select
                value={messagingPrefs.reminderChannel}
                onChange={(e) => setMessagingPrefs({...messagingPrefs, reminderChannel: e.target.value})}
                className="form-input dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="whatsapp">WhatsApp</option>
              </select>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Choose how you want to receive loan and payment reminders
              </p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  toast.success('Messaging preferences saved');
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>

        {/* Budget Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <CurrencyDollarIcon className="w-5 h-5 mr-2" />
              Budget Settings
            </h3>
          </div>
          <div className="p-6">
            <form onSubmit={handleSetBudget} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Monthly Budget *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 dark:text-gray-400 sm:text-sm">{currencySymbol}</span>
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={newBudget.monthlyBudget}
                      onChange={(e) => setNewBudget(prev => ({ ...prev, monthlyBudget: e.target.value }))}
                      className="pl-8 form-input dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Month
                  </label>
                  <select
                    value={newBudget.month}
                    onChange={(e) => setNewBudget(prev => ({ ...prev, month: e.target.value }))}
                    className="form-input dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    {getNextMonths().map(month => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  ) : null}
                  {budget ? 'Update Budget' : 'Set Budget'}
                </button>
              </div>
            </form>

            {/* Current Budget Display */}
            {budget && (
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Current Budget</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {currencySymbol}{budget.monthlyBudget.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(budget.month + '-01').toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Last updated: {new Date(budget.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Budget Alerts */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <BellIcon className="w-5 h-5 mr-2" />
              Budget Alerts
            </h3>
          </div>
          <div className="p-6">
            {alerts.length === 0 ? (
              <div className="text-center py-8">
                <div className="mx-auto h-12 w-12 text-gray-400">
                  <BellIcon className="w-full h-full" />
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No alerts</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  You'll see budget alerts here when you're approaching or have exceeded your budget.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {alerts.map((alert, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-md ${
                      alert.type === 'danger' ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' :
                      alert.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800' :
                      'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                    }`}
                  >
                    <div className="flex">
                      <BellIcon className={`w-5 h-5 ${
                        alert.type === 'danger' ? 'text-red-600' :
                        alert.type === 'warning' ? 'text-yellow-600' :
                        'text-blue-600'
                      }`} />
                      <div className="ml-3">
                        <p className={`text-sm ${
                          alert.type === 'danger' ? 'text-red-800 dark:text-red-300' :
                          alert.type === 'warning' ? 'text-yellow-800 dark:text-yellow-300' :
                          'text-blue-800 dark:text-blue-300'
                        }`}>
                          {alert.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Budget usage: {alert.percentage.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* App Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">About</h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Version</span>
                <span className="text-sm text-gray-900 dark:text-white">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Features</span>
                <span className="text-sm text-gray-900 dark:text-white">AI-Powered Insights</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Data Storage</span>
                <span className="text-sm text-gray-900 dark:text-white">SQLite</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
