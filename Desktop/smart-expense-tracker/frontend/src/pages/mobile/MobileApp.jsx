import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import AddExpense from './AddExpense';
import History from './History';
import Budget from './Budget';

const MobileApp = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-expense" element={<AddExpense />} />
        <Route path="/history" element={<History />} />
        <Route path="/budget" element={<Budget />} />
      </Routes>
    </Router>
  );
};

export default MobileApp;
