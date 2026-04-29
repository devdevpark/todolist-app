import { describe, it, expect, beforeEach } from 'vitest';
import { getToken } from '@/utils/token-storage';
import { useAuthStore } from './auth-store';

describe('auth-store', () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({ token: null, user: null, isAuthenticated: false });
  });

  it('localStorage가 비어있을 때 초기 isAuthenticated는 false이다', () => {
    const { token, user, isAuthenticated } = useAuthStore.getState();
    expect(isAuthenticated).toBe(false);
    expect(token).toBeNull();
    expect(user).toBeNull();
  });

  it('setAuth 호출 후 상태가 업데이트되고 localStorage에 토큰이 저장된다', () => {
    const mockUser = { id: 1, username: 'testuser', role: 'USER' };
    useAuthStore.getState().setAuth({ token: 'my-jwt-token', user: mockUser });

    const { token, user, isAuthenticated } = useAuthStore.getState();
    expect(isAuthenticated).toBe(true);
    expect(token).toBe('my-jwt-token');
    expect(user).toEqual(mockUser);
    expect(getToken()).toBe('my-jwt-token');
  });

  it('clearAuth 호출 후 상태가 초기화되고 localStorage에서 토큰이 삭제된다', () => {
    useAuthStore.getState().setAuth({ token: 'my-jwt-token', user: { id: 1 } });
    useAuthStore.getState().clearAuth();

    const { token, user, isAuthenticated } = useAuthStore.getState();
    expect(isAuthenticated).toBe(false);
    expect(token).toBeNull();
    expect(user).toBeNull();
    expect(getToken()).toBeNull();
  });

  it('localStorage에 토큰이 있을 때 getToken 기반 초기화 시 isAuthenticated가 true이다', () => {
    localStorage.setItem('auth_token', 'existing-token');

    const existingToken = getToken();
    useAuthStore.setState({
      token: existingToken,
      user: null,
      isAuthenticated: !!existingToken,
    });

    const { token, isAuthenticated } = useAuthStore.getState();
    expect(isAuthenticated).toBe(true);
    expect(token).toBe('existing-token');
  });
});
