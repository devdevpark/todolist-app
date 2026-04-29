import { describe, it, expect, beforeEach } from 'vitest';
import { getToken, setToken, removeToken } from './token-storage';

describe('token-storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('초기 상태에서 getToken은 null을 반환한다', () => {
    expect(getToken()).toBeNull();
  });

  it('setToken으로 저장한 값을 getToken으로 읽을 수 있다', () => {
    setToken('test-token-123');
    expect(getToken()).toBe('test-token-123');
  });

  it('removeToken 이후 getToken은 null을 반환한다', () => {
    setToken('test-token-123');
    removeToken();
    expect(getToken()).toBeNull();
  });
});
