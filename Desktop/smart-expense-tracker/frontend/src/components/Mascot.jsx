import { useEffect, useState } from 'react';

const Mascot = ({ spentPercentage }) => {
  const [mood, setMood] = useState('happy');

  useEffect(() => {
    if (spentPercentage > 80) {
      setMood('sad');
    } else if (spentPercentage > 60) {
      setMood('concerned');
    } else {
      setMood('happy');
    }
  }, [spentPercentage]);

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg ${
        mood === 'happy' ? 'bg-green-100 dark:bg-green-900/30' :
        mood === 'sad' ? 'bg-red-100 dark:bg-red-900/30' :
        'bg-yellow-100 dark:bg-yellow-900/30'
      }`}>
        {mood === 'happy' ? '🐷' : mood === 'sad' ? '😢' : '😐'}
      </div>
    </div>
  );
};

export default Mascot;
