import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import PageTransition from '../components/PageTransition';
import CartoonAnim from '../components/CartoonAnim';
import EmptyState from '../components/EmptyState';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { 
  BanknotesIcon, 
  PlusIcon, 
  TrashIcon, 
  CreditCardIcon,
  CalendarIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { formatCurrency } from '../utils/currency';

const Loans = () => {
  const { user, currency } = useAuth();
  const { darkMode } = useTheme();
  const [loans, setLoans] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ 
    name: '', 
    source: 'Bank', 
    purpose: '', 
    totalAmount: '', 
    dueDate: '' 
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => { 
    fetchLoans(); 
  }, []);

  const fetchLoans = async () => {
    try {
      const res = await api.get('/api/loans');
      setLoans(res.data);
    } catch (error) {
      console.error('Error fetching loans:', error);
    }
  };

  const addLoan = async () => {
    if (!form.name || !form.purpose || !form.totalAmount) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      await api.post('/api/loans', form);
      toast.success('Loan added successfully!');
      fetchLoans();
      setForm({ name: '', source: 'Bank', purpose: '', totalAmount: '', dueDate: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Error adding loan:', error);
      toast.error('Failed to add loan');
    } finally {
      setLoading(false);
    }
  };

  const makePayment = async (id, loanName, pendingAmount) => {
    const amount = prompt(`Enter payment amount for "${loanName}" (Pending: ${formatCurrency(pendingAmount, currency)})`);
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid payment amount');
      return;
    }

    try {
      await api.put(`/api/loans/${id}/pay`, { amount: parseFloat(amount) });
      toast.success('Payment recorded successfully!');
      fetchLoans();
    } catch (error) {
      console.error('Error making payment:', error);
      toast.error('Failed to record payment');
    }
  };

  const deleteLoan = async (id) => {
    const shouldDelete = window.confirm('Are you sure you want to delete this loan?');
    if (!shouldDelete) return;

    try {
      await api.delete(`/api/loans/${id}`);
      toast.success('Loan deleted successfully!');
      fetchLoans();
    } catch (error) {
      console.error('Error deleting loan:', error);
      toast.error('Failed to delete loan');
    }
  };

  const getDueStatus = (dueDate) => {
    if (!dueDate) return { status: 'none', color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-700' };
    
    const today = new Date();
    const due = new Date(dueDate);
    const daysUntilDue = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDue < 0) {
      return { status: 'overdue', color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30' };
    } else if (daysUntilDue <= 7) {
      return { status: 'due soon', color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/30' };
    } else {
      return { status: 'on track', color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' };
    }
  };

  return (
    <PageTransition>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <CartoonAnim />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-4 flex items-center">
            <BanknotesIcon className="w-7 h-7 mr-2 text-primary-600" />
            Loan & EMI Tracker
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track your loans and EMIs</p>
        </div>

        {/* Add Loan Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowForm(!showForm)}
          className="mb-6 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-xl shadow-lg transition-colors flex items-center justify-center w-full sm:w-auto"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          {showForm ? 'Cancel' : 'Add New Loan'}
        </motion.button>

        {/* Add Loan Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6 overflow-hidden"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Loan Name *
                  </label>
                  <input
                    placeholder="e.g., Car Loan, Home Loan"
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                    className="form-input dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Source *
                  </label>
                  <select
                    value={form.source}
                    onChange={e => setForm({...form, source: e.target.value})}
                    className="form-input dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="Bank">Bank</option>
                    <option value="Gold">Gold</option>
                    <option value="Friend">Friend/Family</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Purpose *
                  </label>
                  <input
                    placeholder="e.g., College fees, Home purchase"
                    value={form.purpose}
                    onChange={e => setForm({...form, purpose: e.target.value})}
                    className="form-input dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Total Amount *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      {currency}
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={form.totalAmount}
                      onChange={e => setForm({...form, totalAmount: e.target.value})}
                      className="pl-8 form-input dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Due Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={e => setForm({...form, dueDate: e.target.value})}
                    className="form-input dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={addLoan}
                  disabled={loading}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-xl shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : null}
                  {loading ? 'Adding...' : 'Add Loan'}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loan List */}
        {loans.length === 0 ? (
          <EmptyState message="No loans yet. Add your first loan to start tracking!" />
        ) : (
          <div className="space-y-4">
            {loans.map((loan, index) => {
              const pendingAmount = loan.totalAmount - loan.paidAmount;
              const progress = (loan.paidAmount / loan.totalAmount) * 100;
              const dueStatus = getDueStatus(loan.dueDate);
              const isPaidOff = pendingAmount <= 0;

              return (
                <motion.div
                  key={loan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border-l-4 ${
                    isPaidOff ? 'border-green-500' : dueStatus.status === 'overdue' ? 'border-red-500' : 'border-primary-500'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{loan.name}</h3>
                        {isPaidOff && (
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 text-xs font-medium rounded-full flex items-center">
                            <CheckCircleIcon className="w-3 h-3 mr-1" />
                            Paid Off
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center">
                          <CreditCardIcon className="w-4 h-4 mr-1" />
                          {loan.source}
                        </span>
                        <span>•</span>
                        <span>{loan.purpose}</span>
                      </div>
                      {loan.dueDate && (
                        <div className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${dueStatus.bg} ${dueStatus.color}`}>
                          <CalendarIcon className="w-3 h-3 mr-1" />
                          Due: {new Date(loan.dueDate).toLocaleDateString()} • {dueStatus.status}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => deleteLoan(loan.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete loan"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Progress</span>
                      <span className="font-medium text-gray-900 dark:text-white">{progress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full ${isPaidOff ? 'bg-green-500' : 'bg-primary-600'}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(progress, 100)}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                      />
                    </div>
                  </div>

                  {/* Amount Details */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total</p>
                      <p className="font-bold text-gray-900 dark:text-white">{formatCurrency(loan.totalAmount, currency)}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Paid</p>
                      <p className="font-bold text-green-600">{formatCurrency(loan.paidAmount, currency)}</p>
                    </div>
                    <div className={`bg-gray-50 dark:bg-gray-700 rounded-xl p-3 ${pendingAmount > 0 ? 'ring-2 ring-primary-500' : ''}`}>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Pending</p>
                      <p className={`font-bold ${pendingAmount > 0 ? 'text-primary-600' : 'text-green-600'}`}>
                        {formatCurrency(pendingAmount, currency)}
                      </p>
                    </div>
                  </div>

                  {/* Make Payment Button */}
                  {!isPaidOff && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => makePayment(loan.id, loan.name, pendingAmount)}
                      className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-xl transition-colors flex items-center justify-center"
                    >
                      <CheckCircleIcon className="w-5 h-5 mr-2" />
                      Make Payment
                    </motion.button>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default Loans;
