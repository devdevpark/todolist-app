import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { useAuthStore } from '@/store/auth-store';
import ProtectedRoute from './ProtectedRoute';

function renderWithRouter({ initialEntries = ['/protected'], requiredRole } = {}) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route
          path="/protected"
          element={
            <ProtectedRoute requiredRole={requiredRole}>
              <div>Protected Content</div>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<div>Login Page</div>} />
        <Route path="/todos" element={<div>Todos Page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

describe('ProtectedRoute', () => {
  it('비인증 상태이면 /login으로 리다이렉트된다', () => {
    useAuthStore.setState({ token: null, user: null, isAuthenticated: false });

    renderWithRouter();

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('비인증 상태이면 sessionStorage에 redirectUrl이 저장된다', () => {
    useAuthStore.setState({ token: null, user: null, isAuthenticated: false });

    renderWithRouter({ initialEntries: ['/protected?foo=bar'] });

    expect(sessionStorage.getItem('redirectUrl')).toBe('/protected?foo=bar');
  });

  it('인증 상태이면 children을 렌더한다', () => {
    useAuthStore.setState({
      token: 'fake-token',
      user: { id: '1', username: 'user1', role: 'USER' },
      isAuthenticated: true,
    });

    renderWithRouter();

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('인증 상태이고 requiredRole=ADMIN이지만 USER role이면 /todos로 리다이렉트된다', () => {
    useAuthStore.setState({
      token: 'fake-token',
      user: { id: '1', username: 'user1', role: 'USER' },
      isAuthenticated: true,
    });

    renderWithRouter({ requiredRole: 'ADMIN' });

    expect(screen.getByText('Todos Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('인증 상태이고 requiredRole=ADMIN이며 ADMIN role이면 children을 렌더한다', () => {
    useAuthStore.setState({
      token: 'fake-token',
      user: { id: '1', username: 'admin', role: 'ADMIN' },
      isAuthenticated: true,
    });

    renderWithRouter({ requiredRole: 'ADMIN' });

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
