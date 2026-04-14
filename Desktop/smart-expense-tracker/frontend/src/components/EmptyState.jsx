import { motion } from 'framer-motion';
import { Inbox } from 'lucide-react';

const EmptyState = ({ message }) => (
  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
    <Inbox className="w-16 h-16 mx-auto text-gray-400" />
    <p className="mt-4 text-gray-500">{message}</p>
  </motion.div>
);

export default EmptyState;
