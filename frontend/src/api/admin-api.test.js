import { describe, it, expect, vi, beforeEach } from 'vitest';
import { adminApi } from './admin-api';

vi.mock('@/api/http-client', () => ({
  get: vi.fn(),
  patch: vi.fn(),
}));

import * as httpClient from '@/api/http-client';

describe('admin-api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getUsers는 /api/admin/users에서 데이터를 가져온다', async () => {
    const mockUsers = [{ id: '1', username: 'user1', role: 'USER', isActive: true }];
    httpClient.get.mockResolvedValue(mockUsers);

    const result = await adminApi.getUsers();

    expect(httpClient.get).toHaveBeenCalledWith('/api/admin/users');
    expect(result).toEqual(mockUsers);
  });

  it('updateUserStatus는 userId와 isActive로 patch를 호출한다', async () => {
    httpClient.patch.mockResolvedValue({});

    await adminApi.updateUserStatus('1', false);

    expect(httpClient.patch).toHaveBeenCalledWith('/api/admin/users/1/status', {
      isActive: false,
    });
  });
});