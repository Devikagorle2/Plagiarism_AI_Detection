import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { useAuth } from '../context/AuthContext';
import { getCurrencySymbol } from '../utils/currency';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

const CategoryPieChart = ({ categoryBreakdown }) => {
  const { currency } = useAuth();
  const currencySymbol = getCurrencySymbol(currency);
  
  const data = {
    labels: Object.keys(categoryBreakdown),
    datasets: [
      {
        data: Object.values(categoryBreakdown),
        backgroundColor: [
          '#3B82F6', // primary-500
          '#10B981', // success-500
          '#F59E0B', // warning-500
          '#EF4444', // danger-500
          '#8B5CF6', // purple-500
        ],
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 800,
      easing: 'easeOutQuart',
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = `${currencySymbol}${context.parsed.toFixed(2)}`;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Breakdown</h3>
      <div className="h-64">
        {Object.keys(categoryBreakdown).length > 0 ? (
          <Pie data={data} options={options} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No expense data available
          </div>
        )}
      </div>
    </div>
  );
};

const WeeklyTrendChart = ({ last7Days }) => {
  const { currency } = useAuth();
  const currencySymbol = getCurrencySymbol(currency);
  
  const data = {
    labels: last7Days.map(day => {
      const date = new Date(day.date);
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: 'Daily Spending',
        data: last7Days.map(day => day.amount),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => `${currencySymbol}${context.parsed.y.toFixed(2)}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `${currencySymbol}${value}`
        }
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">7-Day Spending Trend</h3>
      <div className="h-64">
        {last7Days.length > 0 ? (
          <Line data={data} options={options} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No expense data available
          </div>
        )}
      </div>
    </div>
  );
};

const CategoryBarChart = ({ categoryBreakdown }) => {
  const { currency } = useAuth();
  const currencySymbol = getCurrencySymbol(currency);
  
  const data = {
    labels: Object.keys(categoryBreakdown),
    datasets: [
      {
        label: 'Spending by Category',
        data: Object.values(categoryBreakdown),
        backgroundColor: [
          '#3B82F6', // primary-500
          '#10B981', // success-500
          '#F59E0B', // warning-500
          '#EF4444', // danger-500
          '#8B5CF6', // purple-500
        ],
        borderColor: [
          '#2563EB', // primary-600
          '#059669', // success-600
          '#D97706', // warning-600
          '#DC2626', // danger-600
          '#7C3AED', // purple-600
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => `${currencySymbol}${context.parsed.y.toFixed(2)}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `${currencySymbol}${value}`
        }
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Comparison</h3>
      <div className="h-64">
        {Object.keys(categoryBreakdown).length > 0 ? (
          <Bar data={data} options={options} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No expense data available
          </div>
        )}
      </div>
    </div>
  );
};

export { CategoryPieChart, WeeklyTrendChart, CategoryBarChart };
