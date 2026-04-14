import { useCallback } from 'react';

export const useHaptic = () => {
  const vibrate = useCallback((pattern = 10) => {
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(pattern);
    }
  }, []);

  return { vibrate };
};
