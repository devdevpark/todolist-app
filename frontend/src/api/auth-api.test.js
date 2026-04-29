import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/api/http-client', () => ({
  post: vi.fn(),
}));

import { post } from '@/api/http-client';
import { register, login } from './auth-api';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('auth-api', () => {
  describe('register', () => {
    it('올바른 엔드포인트와 body로 post를 호출한다', async () => {
      post.mockResolvedValue({ id: '1', username: 'testuser' });

      await register({ username: 'testuser', password: 'pass1234' });

      expect(post).toHaveBeenCalledWith('/api/auth/register', {
        body: { username: 'testuser', password: 'pass1234' },
      });
    });

    it('post가 반환한 값을 그대로 반환한다', async () => {
      const mockResponse = { id: '1', username: 'testuser' };
      post.mockResolvedValue(mockResponse);

      const result = await register({ username: 'testuser', password: 'pass1234' });

      expect(result).toEqual(mockResponse);
    });

    it('post가 에러를 던지면 에러가 전파된다', async () => {
      const error = new Error('이미 사용 중인 사용자 이름입니다.');
      error.code = 'CONFLICT';
      post.mockRejectedValue(error);

      await expect(register({ username: 'testuser', password: 'pass1234' })).rejects.toThrow(
        '이미 사용 중인 사용자 이름입니다.'
      );
    });
  });

  describe('login', () => {
    it('올바른 엔드포인트와 body로 post를 호출한다', async () => {
      post.mockResolvedValue({ token: 'fake-token', user: { id: '1', username: 'testuser' } });

      await login({ username: 'testuser', password: 'pass1234' });

      expect(post).toHaveBeenCalledWith('/api/auth/login', {
        body: { username: 'testuser', password: 'pass1234' },
      });
    });

    it('post가 반환한 값을 그대로 반환한다', async () => {
      const mockResponse = { token: 'fake-token', user: { id: '1', username: 'testuser' } };
      post.mockResolvedValue(mockResponse);

      const result = await login({ username: 'testuser', password: 'pass1234' });

      expect(result).toEqual(mockResponse);
    });

    it('post가 에러를 던지면 에러가 전파된다', async () => {
      const error = new Error('아이디 또는 비밀번호가 올바르지 않습니다.');
      error.code = 'UNAUTHORIZED';
      post.mockRejectedValue(error);

      await expect(login({ username: 'testuser', password: 'wrongpass' })).rejects.toThrow(
        '아이디 또는 비밀번호가 올바르지 않습니다.'
      );
    });
  });
});
