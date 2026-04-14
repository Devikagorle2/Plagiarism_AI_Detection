import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, logout user
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (email, password, name) => {
    const response = await api.post('/api/auth/register', { email, password, name });
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/api/auth/profile');
    return response.data;
  },
};

// Expenses API
export const expensesAPI = {
  addExpense: async (expenseData) => {
    const response = await api.post('/api/expenses', expenseData);
    return response.data;
  },
  
  getExpenses: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/api/expenses?${params}`);
    return response.data;
  },
  
  getDashboardData: async () => {
    const response = await api.get('/api/expenses/dashboard');
    return response.data;
  },
  
  deleteExpense: async (expenseId) => {
    const response = await api.delete(`/api/expenses/${expenseId}`);
    return response.data;
  },
};

// Budget API
export const budgetAPI = {
  setBudget: async (budgetData) => {
    const response = await api.post('/api/budget', budgetData);
    return response.data;
  },
  
  getBudget: async (month) => {
    const params = month ? `?month=${month}` : '';
    const response = await api.get(`/api/budget${params}`);
    return response.data;
  },
  
  getBudgetAlerts: async () => {
    const response = await api.get('/api/budget/alerts');
    return response.data;
  },
};

// AI API
export const aiAPI = {
  getInsights: async () => {
    const response = await api.get('/api/ai/insights');
    return response.data;
  },
  
  getSpendingTrends: async (months = 3) => {
    const response = await api.get(`/api/ai/trends?months=${months}`);
    return response.data;
  },
};

export default api;
