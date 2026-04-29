import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';

vi.mock('@/hooks/useAuth', () => ({
  useLogin: vi.fn(),
}));

import { useLogin } from '@/hooks/useAuth';

function renderLoginPage(initialEntries = ['/login']) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/todos" element={<div>Todos</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

beforeEach(() => {
  useLogin.mockReturnValue({
    mutate: vi.fn(),
    isPending: false,
    error: null,
  });
});

describe('LoginPage', () => {
  it('폼 요소들이 렌더된다', () => {
    renderLoginPage();

    expect(screen.getByLabelText('아이디')).toBeInTheDocument();
    expect(screen.getByLabelText('비밀번호')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '로그인' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '회원가입' })).toBeInTheDocument();
  });

  it('빈 폼 제출 시 클라이언트 에러 메시지가 표시된다', async () => {
    const user = userEvent.setup();
    renderLoginPage();

    await user.click(screen.getByRole('button', { name: '로그인' }));

    expect(screen.getByText('아이디를 입력해 주세요.')).toBeInTheDocument();
    expect(screen.getByText('비밀번호를 입력해 주세요.')).toBeInTheDocument();
  });

  it('유효한 입력 후 제출 시 mutate가 호출된다', async () => {
    const mutate = vi.fn();
    useLogin.mockReturnValue({ mutate, isPending: false, error: null });

    const user = userEvent.setup();
    renderLoginPage();

    await user.type(screen.getByLabelText('아이디'), 'testuser');
    await user.type(screen.getByLabelText('비밀번호'), 'pass1234');
    await user.click(screen.getByRole('button', { name: '로그인' }));

    expect(mutate).toHaveBeenCalledWith({ username: 'testuser', password: 'pass1234' });
  });

  it('isPending이면 로그인 버튼이 disabled 상태가 된다', () => {
    useLogin.mockReturnValue({ mutate: vi.fn(), isPending: true, error: null });

    renderLoginPage();

    expect(screen.getByRole('button', { name: /로그인/ })).toBeDisabled();
  });
});
