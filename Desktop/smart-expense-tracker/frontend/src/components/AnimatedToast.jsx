import { motion } from 'framer-motion';

const AnimatedToast = ({ message, type = 'success' }) => {
  const bgColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`px-4 py-3 rounded-lg shadow-lg ${bgColors[type] || bgColors.info} text-white`}
    >
      {message}
    </motion.div>
  );
};

export default AnimatedToast;
