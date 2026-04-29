import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/auth-store';

function ProtectedRoute({ children, requiredRole }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (!isAuthenticated) {
    sessionStorage.setItem('redirectUrl', location.pathname + location.search);
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/todos" replace />;
  }

  return children;
}

export default ProtectedRoute;
