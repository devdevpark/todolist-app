import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import RegisterPage from './RegisterPage';

vi.mock('@/hooks/useAuth', () => ({
  useRegister: vi.fn(),
}));

import { useRegister } from '@/hooks/useAuth';

function renderRegisterPage(initialEntries = ['/register']) {
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
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

beforeEach(() => {
  useRegister.mockReturnValue({
    mutate: vi.fn(),
    isPending: false,
    error: null,
  });
});

describe('RegisterPage', () => {
  it('폼 요소들이 렌더된다', () => {
    renderRegisterPage();

    expect(screen.getByLabelText('아이디')).toBeInTheDocument();
    expect(screen.getByLabelText('비밀번호')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '회원가입' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '로그인' })).toBeInTheDocument();
  });

  it('빈 폼 제출 시 클라이언트 에러 메시지가 표시된다', async () => {
    const user = userEvent.setup();
    renderRegisterPage();

    await user.click(screen.getByRole('button', { name: '회원가입' }));

    expect(screen.getByText('아이디를 입력해 주세요.')).toBeInTheDocument();
    expect(screen.getByText('비밀번호를 입력해 주세요.')).toBeInTheDocument();
  });

  it('유효한 입력 후 제출 시 mutate가 호출된다', async () => {
    const mutate = vi.fn();
    useRegister.mockReturnValue({ mutate, isPending: false, error: null });

    const user = userEvent.setup();
    renderRegisterPage();

    await user.type(screen.getByLabelText('아이디'), 'newuser');
    await user.type(screen.getByLabelText('비밀번호'), 'pass1234');
    await user.click(screen.getByRole('button', { name: '회원가입' }));

    expect(mutate).toHaveBeenCalledWith({ username: 'newuser', password: 'pass1234' });
  });

  it('isPending이면 회원가입 버튼이 disabled 상태가 된다', () => {
    useRegister.mockReturnValue({ mutate: vi.fn(), isPending: true, error: null });

    renderRegisterPage();

    expect(screen.getByRole('button', { name: /회원가입/ })).toBeDisabled();
  });

  it('API 에러가 있으면 에러 메시지가 표시된다', () => {
    const error = new Error('이미 사용 중인 사용자 이름입니다.');
    error.code = 'CONFLICT';
    useRegister.mockReturnValue({ mutate: vi.fn(), isPending: false, error });

    renderRegisterPage();

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('이미 사용 중인 사용자 이름입니다.')).toBeInTheDocument();
  });
});
