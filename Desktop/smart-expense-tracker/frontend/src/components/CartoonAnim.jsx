import React from 'react';

const CartoonAnim = ({ type = 'loan' }) => {
  // Placeholder for Lottie animation
  // Replace with actual Lottie component when you have the JSON file
  return (
    <div className="w-32 h-32 mx-auto flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 rounded-full">
      <div className="text-4xl">
        {type === 'loan' ? '💰' : '🎉'}
      </div>
    </div>
  );
};

export default CartoonAnim;
