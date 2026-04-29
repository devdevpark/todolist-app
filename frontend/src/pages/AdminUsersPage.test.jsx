import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('@/hooks/useAdminUsers');

import * as useAdminUsersModule from '@/hooks/useAdminUsers';
import AdminUsersPage from './AdminUsersPage';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return function Wrapper({ children }) {
    return (
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>{children}</BrowserRouter>
      </QueryClientProvider>
    );
  };
}

describe('AdminUsersPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('로딩 중일 때 Spinner를 표시한다', () => {
    useAdminUsersModule.useAdminUsers.mockReturnValue({
      users: [],
      isLoading: true,
      updateUserStatus: vi.fn(),
      isUpdating: false,
    });

    render(<AdminUsersPage />, { wrapper: createWrapper() });

    expect(screen.queryByText('사용자 관리')).not.toBeInTheDocument();
  });

  it('사용자 목록을 렌더링한다', () => {
    const mockUsers = [
      { id: '1', username: 'user1', role: 'USER', isActive: true, createdAt: '2024-01-01' },
    ];
    useAdminUsersModule.useAdminUsers.mockReturnValue({
      users: mockUsers,
      isLoading: false,
      updateUserStatus: vi.fn(),
      isUpdating: false,
    });

    render(<AdminUsersPage />, { wrapper: createWrapper() });

    expect(screen.getByText('user1')).toBeInTheDocument();
  });

  it('사용자가 없을 때 메시지를 표시한다', () => {
    useAdminUsersModule.useAdminUsers.mockReturnValue({
      users: [],
      isLoading: false,
      updateUserStatus: vi.fn(),
      isUpdating: false,
    });

    render(<AdminUsersPage />, { wrapper: createWrapper() });

    expect(screen.getByText('사용자가 없습니다.')).toBeInTheDocument();
  });

  it('제목을 올바르게 표시한다', () => {
    useAdminUsersModule.useAdminUsers.mockReturnValue({
      users: [],
      isLoading: false,
      updateUserStatus: vi.fn(),
      isUpdating: false,
    });

    render(<AdminUsersPage />, { wrapper: createWrapper() });

    expect(screen.getByText('사용자 관리')).toBeInTheDocument();
  });
});