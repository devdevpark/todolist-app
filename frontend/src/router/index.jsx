import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import PublicOnlyRoute from './PublicOnlyRoute';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import Layout from '@/components/Layout';
import TodoListPage from '@/pages/TodoListPage';
import TodoFormPage from '@/pages/TodoFormPage';
import CategoryPage from '@/pages/CategoryPage';
import AdminUsersPage from '@/pages/AdminUsersPage';
import { USER_ROLE } from '@/constants/user-role';

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/todos" replace />} />

      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/todos" element={<TodoListPage />} />
        <Route path="/todos/new" element={<TodoFormPage />} />
        <Route path="/todos/:id/edit" element={<TodoFormPage />} />
        <Route path="/categories" element={<CategoryPage />} />
      </Route>

<Route
        path="/admin/users"
        element={<ProtectedRoute requiredRole={USER_ROLE.ADMIN}><Layout /></ProtectedRoute>}
      >
        <Route index element={<AdminUsersPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/todos" replace />} />
    </Routes>
  );
}

export default AppRouter;
