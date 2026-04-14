import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../utils/api';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const NetWorth = () => {
  const [assets, setAssets] = useState([]);
  const [liabilities, setLiabilities] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [totalAssets, setTotalAssets] = useState(0);
  const [totalLiabilities, setTotalLiabilities] = useState(0);
  const [netWorth, setNetWorth] = useState(0);
  const [assetForm, setAssetForm] = useState({ name: '', type: 'Cash', value: '', date: new Date().toISOString().slice(0, 10) });
  const [liabilityForm, setLiabilityForm] = useState({ name: '', type: 'Loan', value: '', date: new Date().toISOString().slice(0, 10) });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/api/networth');
      setAssets(res.data.assets);
      setLiabilities(res.data.liabilities);
      setTimeline(res.data.timeline);
      setTotalAssets(res.data.totalAssets);
      setTotalLiabilities(res.data.totalLiabilities);
      setNetWorth(res.data.netWorth);
    } catch (error) {
      console.error('Error fetching net worth data:', error);
      toast.error('Failed to load net worth data');
    }
  };

  const addAsset = async () => {
    try {
      await api.post('/api/networth/asset', assetForm);
      toast.success('Asset added');
      fetchData();
      setAssetForm({ ...assetForm, name: '', value: '' });
    } catch (error) {
      console.error('Error adding asset:', error);
      toast.error('Failed to add asset');
    }
  };

  const addLiability = async () => {
    try {
      await api.post('/api/networth/liability', liabilityForm);
      toast.success('Liability added');
      fetchData();
      setLiabilityForm({ ...liabilityForm, name: '', value: '' });
    } catch (error) {
      console.error('Error adding liability:', error);
      toast.error('Failed to add liability');
    }
  };

  const deleteAsset = async (id) => {
    try {
      await api.delete(`/api/networth/asset/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting asset:', error);
      toast.error('Failed to delete asset');
    }
  };

  const deleteLiability = async (id) => {
    try {
      await api.delete(`/api/networth/liability/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting liability:', error);
      toast.error('Failed to delete liability');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="p-4 max-w-6xl mx-auto dark:bg-gray-900 min-h-screen"
    >
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Net Worth Tracker 💰</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-100 dark:bg-green-900 p-4 rounded-xl shadow">
          <p className="text-sm dark:text-green-200">Total Assets</p>
          <p className="text-2xl font-bold dark:text-white">${totalAssets.toFixed(2)}</p>
        </div>
        <div className="bg-red-100 dark:bg-red-900 p-4 rounded-xl shadow">
          <p className="text-sm dark:text-red-200">Total Liabilities</p>
          <p className="text-2xl font-bold dark:text-white">${totalLiabilities.toFixed(2)}</p>
        </div>
        <div className={`${netWorth >= 0 ? 'bg-blue-100 dark:bg-blue-900' : 'bg-orange-100 dark:bg-orange-900'} p-4 rounded-xl shadow`}>
          <p className="text-sm dark:text-blue-200">Net Worth</p>
          <p className="text-2xl font-bold dark:text-white">${netWorth.toFixed(2)}</p>
        </div>
      </div>

      {/* Net Worth Trend Chart */}
      {timeline.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow mb-6">
          <h2 className="font-bold mb-2 dark:text-white">Net Worth Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeline}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke={document.documentElement.classList.contains('dark') ? '#fff' : '#000'} />
              <YAxis stroke={document.documentElement.classList.contains('dark') ? '#fff' : '#000'} />
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} contentStyle={{ backgroundColor: document.documentElement.classList.contains('dark') ? '#1f2937' : '#fff', color: document.documentElement.classList.contains('dark') ? '#fff' : '#000' }} />
              <Legend />
              <Line type="monotone" dataKey="assets" stroke="#10b981" name="Assets" />
              <Line type="monotone" dataKey="liabilities" stroke="#ef4444" name="Liabilities" />
              <Line type="monotone" dataKey="netWorth" stroke="#3b82f6" name="Net Worth" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Assets Section */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-3 dark:text-white">➕ Add Asset</h2>
          <input 
            type="text" 
            placeholder="Name (e.g., Savings Account)" 
            value={assetForm.name} 
            onChange={e => setAssetForm({...assetForm, name: e.target.value})} 
            className="border p-2 rounded w-full mb-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <select 
            value={assetForm.type} 
            onChange={e => setAssetForm({...assetForm, type: e.target.value})} 
            className="border p-2 rounded w-full mb-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option>Cash</option>
            <option>Bank Account</option>
            <option>Stocks</option>
            <option>Crypto</option>
            <option>Property</option>
            <option>Other</option>
          </select>
          <input 
            type="number" 
            placeholder="Value ($)" 
            value={assetForm.value} 
            onChange={e => setAssetForm({...assetForm, value: e.target.value})} 
            className="border p-2 rounded w-full mb-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <input 
            type="date" 
            value={assetForm.date} 
            onChange={e => setAssetForm({...assetForm, date: e.target.value})} 
            className="border p-2 rounded w-full mb-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <button onClick={addAsset} className="bg-green-600 text-white p-2 rounded w-full hover:bg-green-700">Add Asset</button>
          <div className="mt-4">
            <h3 className="font-bold dark:text-white">Your Assets</h3>
            {assets.map(a => (
              <div key={a.id} className="flex justify-between items-center border-b py-2 dark:border-gray-700">
                <span className="dark:text-white">{a.name} ({a.type})</span>
                <span className="dark:text-white">${a.value}</span>
                <button onClick={() => deleteAsset(a.id)} className="text-red-500 text-sm hover:text-red-700">Delete</button>
              </div>
            ))}
          </div>
        </div>

        {/* Liabilities Section */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-3 dark:text-white">➕ Add Liability</h2>
          <input 
            type="text" 
            placeholder="Name (e.g., Credit Card)" 
            value={liabilityForm.name} 
            onChange={e => setLiabilityForm({...liabilityForm, name: e.target.value})} 
            className="border p-2 rounded w-full mb-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <select 
            value={liabilityForm.type} 
            onChange={e => setLiabilityForm({...liabilityForm, type: e.target.value})} 
            className="border p-2 rounded w-full mb-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option>Loan</option>
            <option>Credit Card</option>
            <option>Mortgage</option>
            <option>Other</option>
          </select>
          <input 
            type="number" 
            placeholder="Value ($)" 
            value={liabilityForm.value} 
            onChange={e => setLiabilityForm({...liabilityForm, value: e.target.value})} 
            className="border p-2 rounded w-full mb-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <input 
            type="date" 
            value={liabilityForm.date} 
            onChange={e => setLiabilityForm({...liabilityForm, date: e.target.value})} 
            className="border p-2 rounded w-full mb-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <button onClick={addLiability} className="bg-red-600 text-white p-2 rounded w-full hover:bg-red-700">Add Liability</button>
          <div className="mt-4">
            <h3 className="font-bold dark:text-white">Your Liabilities</h3>
            {liabilities.map(l => (
              <div key={l.id} className="flex justify-between items-center border-b py-2 dark:border-gray-700">
                <span className="dark:text-white">{l.name} ({l.type})</span>
                <span className="dark:text-white">${l.value}</span>
                <button onClick={() => deleteLiability(l.id)} className="text-red-500 text-sm hover:text-red-700">Delete</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NetWorth;
