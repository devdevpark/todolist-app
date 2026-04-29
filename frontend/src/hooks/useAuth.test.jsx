import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { useAuthStore } from '@/store/auth-store';

const mockNavigate = vi.fn();

vi.mock('@/api/auth-api');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

import * as authApi from '@/api/auth-api';
import { useLogin, useRegister } from './useAuth';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return function Wrapper({ children }) {
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>{children}</MemoryRouter>
      </QueryClientProvider>
    );
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  sessionStorage.clear();
  useAuthStore.setState({ token: null, user: null, isAuthenticated: false });
});

describe('useLogin', () => {
  it('성공 시 setAuth를 올바른 토큰과 user로 호출한다', async () => {
    const mockData = { token: 'fake-token', user: { id: '1', username: 'testuser' } };
    authApi.login.mockResolvedValue(mockData);

    const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() });

    act(() => {
      result.current.mutate({ username: 'testuser', password: 'pass1234' });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const { token, user, isAuthenticated } = useAuthStore.getState();
    expect(token).toBe('fake-token');
    expect(user).toEqual({ id: '1', username: 'testuser' });
    expect(isAuthenticated).toBe(true);
  });

  it('성공 시 /todos로 navigate한다', async () => {
    const mockData = { token: 'fake-token', user: { id: '1', username: 'testuser' } };
    authApi.login.mockResolvedValue(mockData);

    const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() });

    act(() => {
      result.current.mutate({ username: 'testuser', password: 'pass1234' });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockNavigate).toHaveBeenCalledWith('/todos', { replace: true });
  });

  it('sessionStorage에 redirectUrl이 있으면 해당 경로로 navigate한 후 삭제한다', async () => {
    const mockData = { token: 'fake-token', user: { id: '1', username: 'testuser' } };
    authApi.login.mockResolvedValue(mockData);
    sessionStorage.setItem('redirectUrl', '/todos/123');

    const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() });

    act(() => {
      result.current.mutate({ username: 'testuser', password: 'pass1234' });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockNavigate).toHaveBeenCalledWith('/todos/123', { replace: true });
    expect(sessionStorage.getItem('redirectUrl')).toBeNull();
  });

  it('실패 시 error 상태가 설정된다', async () => {
    const error = new Error('아이디 또는 비밀번호가 올바르지 않습니다.');
    error.code = 'UNAUTHORIZED';
    authApi.login.mockRejectedValue(error);

    const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() });

    act(() => {
      result.current.mutate({ username: 'testuser', password: 'wrongpass' });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error.code).toBe('UNAUTHORIZED');
  });
});

describe('useRegister', () => {
  it('성공 시 /login으로 navigate한다', async () => {
    authApi.register.mockResolvedValue({ id: '1', username: 'newuser' });

    const { result } = renderHook(() => useRegister(), { wrapper: createWrapper() });

    act(() => {
      result.current.mutate({ username: 'newuser', password: 'pass1234' });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
  });

  it('실패 시 error 상태가 설정된다', async () => {
    const error = new Error('이미 사용 중인 사용자 이름입니다.');
    error.code = 'CONFLICT';
    authApi.register.mockRejectedValue(error);

    const { result } = renderHook(() => useRegister(), { wrapper: createWrapper() });

    act(() => {
      result.current.mutate({ username: 'existinguser', password: 'pass1234' });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error.code).toBe('CONFLICT');
  });
});
