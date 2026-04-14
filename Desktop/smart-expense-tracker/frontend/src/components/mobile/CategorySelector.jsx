import React from 'react';
import { 
  UtensilsIcon, 
  CarIcon, 
  ShoppingCartIcon, 
  HomeIcon, 
  CreditCardIcon 
} from '@heroicons/react/24/outline';

const CategorySelector = ({ selected, onSelect }) => {
  const categories = [
    { id: 'Food', name: 'Food', icon: UtensilsIcon, color: 'bg-orange-100 text-orange-600', border: 'border-orange-200' },
    { id: 'Travel', name: 'Travel', icon: CarIcon, color: 'bg-blue-100 text-blue-600', border: 'border-blue-200' },
    { id: 'Shopping', name: 'Shopping', icon: ShoppingCartIcon, color: 'bg-purple-100 text-purple-600', border: 'border-purple-200' },
    { id: 'Bills', name: 'Bills', icon: HomeIcon, color: 'bg-red-100 text-red-600', border: 'border-red-200' },
    { id: 'Others', name: 'Others', icon: CreditCardIcon, color: 'bg-gray-100 text-gray-600', border: 'border-gray-200' },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {categories.map((category) => {
        const Icon = category.icon;
        const isSelected = selected === category.id;

        return (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all duration-300 ${
              isSelected
                ? `${category.color} ${category.border} border-current scale-105 shadow-md`
                : 'bg-white border-gray-200 hover:border-indigo-300 hover:shadow-sm'
            }`}
          >
            <div className={`p-3 rounded-xl ${isSelected ? category.color : 'bg-gray-50'} mb-2 transition-all duration-300`}>
              <Icon className={`w-6 h-6 ${isSelected ? '' : 'text-gray-500'}`} />
            </div>
            <span className={`text-sm font-medium ${isSelected ? 'text-gray-900' : 'text-gray-600'}`}>
              {category.name}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default CategorySelector;
