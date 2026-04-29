import { useEffect } from 'react';
import AppRouter from '@/router';
import { useUIStore } from '@/store/ui-store';

function App() {
  const isDarkMode = useUIStore((state) => state.isDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return <AppRouter />;
}

export default App;
