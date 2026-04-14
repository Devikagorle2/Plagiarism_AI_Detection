import { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const RecurringExpenses = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ amount: '', category: 'Food', description: '', frequency: 'monthly', nextDue: new Date().toISOString().slice(0, 10) });

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      const res = await api.get('/api/recurring');
      setItems(res.data);
    } catch (error) {
      console.error('Error fetching recurring expenses:', error);
      toast.error('Failed to load recurring expenses');
    }
  };

  const addItem = async () => {
    try {
      await api.post('/api/recurring', form);
      toast.success('Recurring expense added');
      fetchItems();
      setForm({ ...form, amount: '', description: '' });
    } catch (error) {
      console.error('Error adding recurring expense:', error);
      toast.error('Failed to add recurring expense');
    }
  };

  const deleteItem = async (id) => {
    try {
      await api.delete(`/api/recurring/${id}`);
      toast.success('Recurring expense deleted');
      fetchItems();
    } catch (error) {
      console.error('Error deleting recurring expense:', error);
      toast.error('Failed to delete recurring expense');
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Recurring Expenses 🔁</h1>
      
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl my-4 shadow">
        <input 
          type="number" 
          placeholder="Amount" 
          value={form.amount} 
          onChange={e => setForm({...form, amount: e.target.value})} 
          className="border p-2 rounded w-full mb-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <select 
          value={form.category} 
          onChange={e => setForm({...form, category: e.target.value})} 
          className="border p-2 rounded w-full mb-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option>Food</option>
          <option>Bills</option>
          <option>Shopping</option>
          <option>Entertainment</option>
          <option>Travel</option>
          <option>Health</option>
          <option>Others</option>
        </select>
        <input 
          placeholder="Description" 
          value={form.description} 
          onChange={e => setForm({...form, description: e.target.value})} 
          className="border p-2 rounded w-full mb-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <select 
          value={form.frequency} 
          onChange={e => setForm({...form, frequency: e.target.value})} 
          className="border p-2 rounded w-full mb-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
        <input 
          type="date" 
          value={form.nextDue} 
          onChange={e => setForm({...form, nextDue: e.target.value})} 
          className="border p-2 rounded w-full mb-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <button onClick={addItem} className="bg-indigo-600 text-white p-2 rounded w-full hover:bg-indigo-700">Add Recurring</button>
      </div>
      
      {items.map(item => (
        <div key={item.id} className="bg-white dark:bg-gray-800 p-3 rounded-lg mb-2 flex justify-between shadow">
          <div>
            <span className="font-bold dark:text-white">${item.amount}</span> - {item.description} ({item.frequency})
            <br /><span className="text-xs text-gray-500 dark:text-gray-400">Next: {item.nextDue}</span>
          </div>
          <button onClick={() => deleteItem(item.id)} className="text-red-500 hover:text-red-700">Delete</button>
        </div>
      ))}
    </div>
  );
};

export default RecurringExpenses;
