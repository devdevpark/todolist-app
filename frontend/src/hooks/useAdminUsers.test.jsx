import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';

vi.mock('@/api/admin-api');

import * as adminApi from '@/api/admin-api';
import { useAdminUsers } from './useAdminUsers';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
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
});

describe('useAdminUsers', () => {
  it('getUsers를 호출하고 결과를 users로 반환한다', async () => {
    const mockUsers = [
      { id: '1', username: 'user1', role: 'USER', isActive: true },
      { id: '2', username: 'user2', role: 'ADMIN', isActive: true },
    ];
    adminApi.adminApi.getUsers.mockResolvedValue(mockUsers);

    const { result } = renderHook(() => useAdminUsers(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.users).toEqual(mockUsers);
    expect(adminApi.adminApi.getUsers).toHaveBeenCalled();
  });

  it('데이터가 없을 때 빈 배열을 반환한다', async () => {
    adminApi.adminApi.getUsers.mockResolvedValue(null);

    const { result } = renderHook(() => useAdminUsers(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.users).toEqual([]);
  });
});

describe('updateUserStatus', () => {
  it('updateUserStatus를 호출하고 성공 시 데이터를 다시 가져온다', async () => {
    const mockUsers = [{ id: '1', username: 'user1', isActive: true }];
    adminApi.adminApi.getUsers.mockResolvedValue(mockUsers);
    adminApi.adminApi.updateUserStatus.mockResolvedValue({});

    const { result } = renderHook(() => useAdminUsers(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await waitFor(() => {
      result.current.updateUserStatus({ userId: '1', isActive: false });
    });

    await waitFor(() => expect(result.current.isUpdating).toBe(false));

    expect(adminApi.adminApi.updateUserStatus).toHaveBeenCalledWith('1', false);
  });
});