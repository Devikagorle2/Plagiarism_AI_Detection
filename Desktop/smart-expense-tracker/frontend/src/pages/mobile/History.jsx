import React, { useState } from 'react';
import { CalendarIcon, FunnelIcon } from '@heroicons/react/24/outline';
import TransactionItem from '../../components/mobile/TransactionItem';
import BottomNav from '../../components/mobile/BottomNav';

const History = () => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [showDateFilter, setShowDateFilter] = useState(false);

  const filters = ['All', 'Food', 'Travel', 'Shopping', 'Bills', 'Others'];

  const groupedTransactions = {
    'Today': [
      { id: 1, category: 'Food', description: 'Lunch at Cafe', amount: 450, date: 'Today' },
      { id: 2, category: 'Shopping', description: 'Amazon Purchase', amount: 2340, date: 'Today' },
      { id: 3, category: 'Food', description: 'Grocery Store', amount: 1850, date: 'Today' },
    ],
    'Yesterday': [
      { id: 4, category: 'Travel', description: 'Uber Ride', amount: 280, date: 'Yesterday' },
      { id: 5, category: 'Bills', description: 'Electricity Bill', amount: 1850, date: 'Yesterday' },
      { id: 6, category: 'Shopping', description: 'Clothing Store', amount: 3200, date: 'Yesterday' },
    ],
    'This Week': [
      { id: 7, category: 'Food', description: 'Dinner at Restaurant', amount: 1200, date: 'This Week' },
      { id: 8, category: 'Travel', description: 'Gas Station', amount: 2500, date: 'This Week' },
      { id: 9, category: 'Others', description: 'ATM Withdrawal', amount: 5000, date: 'This Week' },
      { id: 10, category: 'Food', description: 'Coffee Shop', amount: 180, date: 'This Week' },
    ],
  };

  const getTotalForDate = (transactions) => {
    return transactions.reduce((sum, t) => sum + t.amount, 0);
  };

  const filterTransactions = (transactions) => {
    if (selectedFilter === 'All') return transactions;
    return transactions.filter(t => t.category === selectedFilter);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">History</h1>
          <p className="text-gray-500">View your past expenses</p>
        </div>

        {/* Filter Chips */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FunnelIcon className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter by category</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  selectedFilter === filter
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Date Filter */}
        <div className="mb-6">
          <button
            onClick={() => setShowDateFilter(!showDateFilter)}
            className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
          >
            <CalendarIcon className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter by date</span>
          </button>
          {showDateFilter && (
            <div className="mt-3 p-4 bg-white rounded-xl shadow-sm">
              <input
                type="date"
                className="w-full px-4 py-2 text-gray-900 bg-gray-50 rounded-lg border-0 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}
        </div>

        {/* Transaction Groups */}
        <div className="space-y-6">
          {Object.entries(groupedTransactions).map(([date, transactions]) => {
            const filteredTransactions = filterTransactions(transactions);
            if (filteredTransactions.length === 0) return null;

            const total = getTotalForDate(filteredTransactions);

            return (
              <div key={date}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">{date}</h3>
                  <span className="text-sm font-bold text-gray-900">₹{total.toLocaleString()}</span>
                </div>
                <div className="space-y-3">
                  {filteredTransactions.map((transaction) => (
                    <TransactionItem 
                      key={transaction.id} 
                      transaction={transaction}
                      onClick={() => console.log('Transaction clicked', transaction.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default History;
