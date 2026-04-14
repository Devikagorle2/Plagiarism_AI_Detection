import React, { useState } from 'react';
import { ArrowLeftIcon, CalendarIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import CategorySelector from '../../components/mobile/CategorySelector';
import BottomNav from '../../components/mobile/BottomNav';
import { useNavigate } from 'react-router-dom';

const AddExpense = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Expense added:', { amount, category, date, notes });
    // Handle form submission
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <ArrowLeftIcon className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Add Expense</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount Input */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <label className="block text-sm font-medium text-gray-500 mb-3">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-0 top-1/2 -translate-y-1/2 text-3xl font-bold text-gray-900">
                ₹
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-12 pr-4 py-4 text-4xl font-bold text-gray-900 bg-transparent border-0 focus:ring-0 placeholder-gray-300"
                required
                step="0.01"
                min="0"
              />
            </div>
          </div>

          {/* Category Selector */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <label className="block text-sm font-medium text-gray-500 mb-4">
              Category
            </label>
            <CategorySelector 
              selected={category} 
              onSelect={setCategory} 
            />
          </div>

          {/* Date Picker */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <label className="block text-sm font-medium text-gray-500 mb-3">
              Date
            </label>
            <div className="relative">
              <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-12 pr-4 py-3 text-gray-900 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          {/* Notes Input */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <label className="block text-sm font-medium text-gray-500 mb-3">
              Notes (Optional)
            </label>
            <div className="relative">
              <DocumentTextIcon className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add a description..."
                rows={3}
                className="w-full pl-12 pr-4 py-3 text-gray-900 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-50">
            <div className="max-w-md mx-auto">
              <button
                type="submit"
                className="w-full py-4 bg-indigo-600 text-white font-semibold rounded-2xl shadow-lg hover:bg-indigo-700 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                + Add Expense
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default AddExpense;
