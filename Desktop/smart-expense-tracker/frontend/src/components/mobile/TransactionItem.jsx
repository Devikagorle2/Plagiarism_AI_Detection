import React from 'react';
import { motion, useSpring, animated } from '@react-spring/web';
import { useSwipe } from '@use-gesture/react';
import { 
  ShoppingCartIcon, 
  UtensilsIcon, 
  CarIcon, 
  HomeIcon, 
  CreditCardIcon,
  Trash2Icon
} from '@heroicons/react/24/outline';

const categoryIcons = {
  Food: UtensilsIcon,
  Travel: CarIcon,
  Shopping: ShoppingCartIcon,
  Bills: HomeIcon,
  Others: CreditCardIcon,
};

const categoryColors = {
  Food: 'bg-orange-100 text-orange-600',
  Travel: 'bg-blue-100 text-blue-600',
  Shopping: 'bg-purple-100 text-purple-600',
  Bills: 'bg-red-100 text-red-600',
  Others: 'bg-gray-100 text-gray-600',
};

const TransactionItem = ({ transaction, onClick, onDelete }) => {
  const Icon = categoryIcons[transaction.category] || CreditCardIcon;
  const colorClass = categoryColors[transaction.category] || categoryColors.Others;
  
  const [{ x }, api] = useSpring(() => ({ x: 0 }));

  const bind = useSwipe({
    onSwipe: ({ direction, velocity }) => {
      if (direction[0] < 0 && velocity > 0.3) {
        // Swipe left -> delete
        api.start({ x: -200 });
        setTimeout(() => onDelete && onDelete(transaction.id), 200);
      } else if (direction[0] > 0) {
        api.start({ x: 0 });
      }
    },
  });

  return (
    <animated.div
      {...bind()}
      style={{ x, touchAction: 'pan-y' }}
      className="relative mb-2"
    >
      {/* Delete button background */}
      <div className="absolute inset-0 bg-red-500 rounded-2xl flex items-center justify-end pr-4">
        <Trash2Icon className="w-6 h-6 text-white" />
      </div>
      
      {/* Transaction card */}
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer hover:scale-[1.02] relative z-10"
        onClick={onClick}
        whileHover={{ y: -2 }}
      >
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl ${colorClass} flex-shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-semibold text-gray-900 dark:text-white truncate">{transaction.description || transaction.category}</h4>
              <p className="font-bold text-gray-900 dark:text-white">₹{transaction.amount.toFixed(2)}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.category}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{transaction.date}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </animated.div>
  );
};

export default TransactionItem;
