import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useAuthStore } from '@/store/auth-store';
import { get, post, patch, del } from './http-client';

describe('http-client', () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({ token: null, user: null, isAuthenticated: false });
    vi.stubGlobal('fetch', vi.fn());
    vi.stubGlobal('location', { href: '' });
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  it('성공 응답 시 data.data를 반환한다', async () => {
    const mockData = { id: 1, title: '테스트 할일' };
    fetch.mockResolvedValueOnce({
      status: 200,
      json: async () => ({ success: true, data: mockData }),
    });

    const result = await get('/api/todos');
    expect(result).toEqual(mockData);
  });

  it('실패 응답 시 code와 status가 포함된 Error를 throw한다', async () => {
    fetch.mockResolvedValueOnce({
      status: 404,
      json: async () => ({
        success: false,
        error: { code: 'RESOURCE_NOT_FOUND', message: '리소스를 찾을 수 없습니다.' },
      }),
    });

    await expect(get('/api/todos/999')).rejects.toMatchObject({
      message: '리소스를 찾을 수 없습니다.',
      code: 'RESOURCE_NOT_FOUND',
      status: 404,
    });
  });

  it('401 응답 시 clearAuth를 호출하고 /login으로 리다이렉트한다', async () => {
    useAuthStore.getState().setAuth({ token: 'expired-token', user: { id: 1 } });
    fetch.mockResolvedValueOnce({
      status: 401,
      json: async () => ({
        success: false,
        error: { code: 'UNAUTHORIZED', message: '인증이 필요합니다.' },
      }),
    });

    await get('/api/todos');

    const { isAuthenticated, token } = useAuthStore.getState();
    expect(isAuthenticated).toBe(false);
    expect(token).toBeNull();
    expect(window.location.href).toBe('/login');
  });

  it('토큰이 있을 때 Authorization 헤더가 포함된다', async () => {
    useAuthStore.getState().setAuth({ token: 'valid-token', user: { id: 1 } });
    fetch.mockResolvedValueOnce({
      status: 200,
      json: async () => ({ success: true, data: {} }),
    });

    await get('/api/todos');

    const [, options] = fetch.mock.calls[0];
    expect(options.headers['Authorization']).toBe('Bearer valid-token');
  });

  it('토큰이 없을 때 Authorization 헤더가 포함되지 않는다', async () => {
    fetch.mockResolvedValueOnce({
      status: 200,
      json: async () => ({ success: true, data: [] }),
    });

    await get('/api/todos');

    const [, options] = fetch.mock.calls[0];
    expect(options.headers['Authorization']).toBeUndefined();
  });

  it('GET 요청 시 params가 쿼리스트링으로 변환된다', async () => {
    fetch.mockResolvedValueOnce({
      status: 200,
      json: async () => ({ success: true, data: [] }),
    });

    await get('/api/todos', { params: { status: 'PENDING', categoryId: 2 } });

    const [url] = fetch.mock.calls[0];
    expect(url).toContain('status=PENDING');
    expect(url).toContain('categoryId=2');
  });

  it('params의 undefined와 null 값은 쿼리스트링에서 제외된다', async () => {
    fetch.mockResolvedValueOnce({
      status: 200,
      json: async () => ({ success: true, data: [] }),
    });

    await get('/api/todos', { params: { status: 'PENDING', categoryId: null, page: undefined } });

    const [url] = fetch.mock.calls[0];
    expect(url).toContain('status=PENDING');
    expect(url).not.toContain('categoryId');
    expect(url).not.toContain('page');
  });

  it('post 요청 시 body가 JSON으로 직렬화된다', async () => {
    fetch.mockResolvedValueOnce({
      status: 200,
      json: async () => ({ success: true, data: { id: 1 } }),
    });

    await post('/api/todos', { body: { title: '새 할일' } });

    const [, options] = fetch.mock.calls[0];
    expect(options.method).toBe('POST');
    expect(options.body).toBe(JSON.stringify({ title: '새 할일' }));
  });
});
