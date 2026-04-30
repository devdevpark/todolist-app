import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppRouter from '@/router';
import { useUIStore } from '@/store/ui-store';

function App() {
  const isDarkMode = useUIStore((state) => state.isDarkMode);
  const navigate = useNavigate();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleUnauthorized = () => navigate('/login', { replace: true });
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [navigate]);

  return <AppRouter />;
}

export default App;
