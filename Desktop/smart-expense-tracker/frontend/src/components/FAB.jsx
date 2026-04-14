import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import AddExpenseSheet from './AddExpenseSheet';

const FAB = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 bg-indigo-600 text-white p-4 rounded-full shadow-lg z-40"
        aria-label="Add expense"
      >
        <Plus className="w-6 h-6" />
      </motion.button>
      <AnimatePresence>
        {open && <AddExpenseSheet onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
};

export default FAB;
