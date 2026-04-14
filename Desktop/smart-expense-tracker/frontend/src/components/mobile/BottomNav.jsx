import React from 'react';
import { motion } from 'framer-motion';
import { 
  HomeIcon, 
  PlusIcon, 
  ClockIcon, 
  UserIcon 
} from '@heroicons/react/24/outline';
import { useLocation, useNavigate } from 'react-router-dom';

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { id: 'home', label: 'Home', icon: HomeIcon, path: '/dashboard' },
    { id: 'add', label: 'Add', icon: PlusIcon, path: '/add-expense', isCenter: true },
    { id: 'history', label: 'History', icon: ClockIcon, path: '/history' },
    { id: 'profile', label: 'Profile', icon: UserIcon, path: '/settings' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-4 py-2 z-50">
      <div className="max-w-md mx-auto flex items-center justify-around relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 transition-all duration-300 relative ${
                item.isCenter
                  ? 'relative -top-6'
                  : 'py-2'
              }`}
            >
              {active && !item.isCenter && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              {item.isCenter ? (
                <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                  active ? 'bg-indigo-600 scale-110' : 'bg-indigo-500 hover:bg-indigo-600'
                }`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
              ) : (
                <div className={`flex flex-col items-center ${active ? 'text-indigo-600' : 'text-gray-400 dark:text-gray-500'}`}>
                  <Icon className={`w-6 h-6 ${active ? 'scale-110' : ''}`} />
                  <span className="text-xs font-medium mt-1">{item.label}</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
