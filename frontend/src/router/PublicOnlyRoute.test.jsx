import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { useAuthStore } from '@/store/auth-store';
import PublicOnlyRoute from './PublicOnlyRoute';

function renderPublicRoute(isAuthenticated) {
  useAuthStore.setState({ isAuthenticated, token: isAuthenticated ? 'fake-token' : null });

  return render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<div>Login Page</div>} />
        </Route>
        <Route path="/todos" element={<div>Todos Page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  useAuthStore.setState({ token: null, user: null, isAuthenticated: false });
});

describe('PublicOnlyRoute', () => {
  it('인증 상태이면 /todos로 리다이렉트된다', () => {
    renderPublicRoute(true);

    expect(screen.getByText('Todos Page')).toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });

  it('비인증 상태이면 Outlet 내용(자식 라우트)을 렌더한다', () => {
    renderPublicRoute(false);

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Todos Page')).not.toBeInTheDocument();
  });
});
