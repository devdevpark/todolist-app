import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import UserTable from './UserTable';
import { USER_ROLE } from '@/constants/user-role';

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('UserTable', () => {
  const mockUsers = [
    {
      id: '1',
      username: 'admin',
      role: USER_ROLE.ADMIN,
      isActive: true,
      createdAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: '2',
      username: 'user1',
      role: USER_ROLE.USER,
      isActive: true,
      createdAt: '2024-01-02T00:00:00.000Z',
    },
    {
      id: '3',
      username: 'user2',
      role: USER_ROLE.USER,
      isActive: false,
      createdAt: '2024-01-03T00:00:00.000Z',
    },
  ];

  it('사용자 목록을 테이블로 렌더링한다', () => {
    const mockToggleStatus = vi.fn();
    renderWithRouter(
      <UserTable users={mockUsers} onToggleStatus={mockToggleStatus} isUpdating={false} />
    );

    expect(screen.getByText('admin')).toBeInTheDocument();
    expect(screen.getByText('user1')).toBeInTheDocument();
    expect(screen.getByText('user2')).toBeInTheDocument();
  });

  it('역할을 올바르게 표시한다', () => {
    const mockToggleStatus = vi.fn();
    renderWithRouter(
      <UserTable users={mockUsers} onToggleStatus={mockToggleStatus} isUpdating={false} />
    );

    expect(screen.getByText('관리자')).toBeInTheDocument();
    expect(screen.getAllByText('사용자').length).toBe(2);
  });

  it('상태를 올바르게 표시한다', () => {
    const mockToggleStatus = vi.fn();
    renderWithRouter(
      <UserTable users={mockUsers} onToggleStatus={mockToggleStatus} isUpdating={false} />
    );

    expect(screen.getAllByText('활성').length).toBeGreaterThan(0);
    expect(screen.getByText('비활성')).toBeInTheDocument();
  });

  it('관리자 사용자는 작업 버튼이 표시되지 않는다', () => {
    const mockToggleStatus = vi.fn();
    renderWithRouter(
      <UserTable users={mockUsers} onToggleStatus={mockToggleStatus} isUpdating={false} />
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(2);
  });

  it('일반 사용자는 활성화/비활성화 버튼이 표시된다', () => {
    const mockToggleStatus = vi.fn();
    renderWithRouter(
      <UserTable users={mockUsers} onToggleStatus={mockToggleStatus} isUpdating={false} />
    );

    expect(screen.getByText('비활성화')).toBeInTheDocument();
  });

  it('isUpdating이 true이면 버튼이 비활성화된다', () => {
    const mockToggleStatus = vi.fn();
    renderWithRouter(
      <UserTable users={mockUsers} onToggleStatus={mockToggleStatus} isUpdating={true} />
    );

    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => {
      expect(btn).toBeDisabled();
    });
  });

  it('버튼 클릭 시 onToggleStatus를 호출한다', () => {
    const mockToggleStatus = vi.fn();
    renderWithRouter(
      <UserTable users={mockUsers} onToggleStatus={mockToggleStatus} isUpdating={false} />
    );

    const button = screen.getByText('비활성화');
    button.click();

    expect(mockToggleStatus).toHaveBeenCalledWith('2', false);
  });

  it('사용자가 없을 때 내용을 렌더링하지 않는다', () => {
    const mockToggleStatus = vi.fn();
    const { container } = renderWithRouter(
      <UserTable users={[]} onToggleStatus={mockToggleStatus} isUpdating={false} />
    );

    expect(container.querySelector('tbody')).toBeEmpty();
  });
});