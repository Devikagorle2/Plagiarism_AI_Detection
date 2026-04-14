import { useState, useEffect } from 'react';
import api from '../utils/api';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const SavingsGoals = () => {
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState({ name: '', target: '', deadline: '' });

  useEffect(() => { fetchGoals(); }, []);

  const fetchGoals = async () => {
    try {
      const res = await api.get('/api/savings');
      setGoals(res.data);
    } catch (error) {
      console.error('Error fetching goals:', error);
      toast.error('Failed to load savings goals');
    }
  };

  const addGoal = async () => {
    try {
      await api.post('/api/savings', form);
      toast.success('Goal created');
      fetchGoals();
      setForm({ name: '', target: '', deadline: '' });
    } catch (error) {
      console.error('Error creating goal:', error);
      toast.error('Failed to create goal');
    }
  };

  const addToGoal = async (id, amount) => {
    try {
      await api.put(`/api/savings/${id}/add`, { amount: parseFloat(amount) });
      toast.success('Added to goal');
      fetchGoals();
    } catch (error) {
      console.error('Error adding to goal:', error);
      toast.error('Failed to add to goal');
    }
  };

  const deleteGoal = async (id) => {
    try {
      await api.delete(`/api/savings/${id}`);
      toast.success('Goal deleted');
      fetchGoals();
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast.error('Failed to delete goal');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="p-4 max-w-2xl mx-auto dark:bg-gray-900 min-h-screen"
    >
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Savings Goals 🐷</h1>
      
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl my-4 shadow">
        <input 
          placeholder="Goal name" 
          value={form.name} 
          onChange={e => setForm({...form, name: e.target.value})} 
          className="border p-2 rounded w-full mb-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <input 
          type="number" 
          placeholder="Target amount" 
          value={form.target} 
          onChange={e => setForm({...form, target: e.target.value})} 
          className="border p-2 rounded w-full mb-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <input 
          type="date" 
          value={form.deadline} 
          onChange={e => setForm({...form, deadline: e.target.value})} 
          className="border p-2 rounded w-full mb-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <button onClick={addGoal} className="bg-indigo-600 text-white p-2 rounded w-full hover:bg-indigo-700">Create Goal</button>
      </div>
      
      {goals.map(goal => {
        const percent = (goal.current / goal.target) * 100;
        return (
          <motion.div 
            key={goal.id} 
            className="bg-white dark:bg-gray-800 p-4 rounded-xl mb-3 shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex justify-between">
              <h3 className="font-bold dark:text-white">{goal.name}</h3>
              <span className="dark:text-white">${goal.current} / ${goal.target}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 my-2">
              <div 
                className="bg-green-500 h-4 rounded-full" 
                style={{ width: `${Math.min(percent, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="dark:text-gray-400">Deadline: {goal.deadline || 'No deadline'}</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => { const amt = prompt('Add amount:'); if(amt) addToGoal(goal.id, amt); }} 
                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800"
                >
                  + Add Money
                </button>
                <button 
                  onClick={() => deleteGoal(goal.id)} 
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        );
      })}
      
      <div className="text-center mt-8 text-6xl">
        🐷
      </div>
    </motion.div>
  );
};

export default SavingsGoals;
