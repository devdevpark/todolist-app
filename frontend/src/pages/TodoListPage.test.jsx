import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

vi.mock('@/hooks/useTodos');
vi.mock('@/hooks/useCategories');
vi.mock('@/store/ui-store');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importActual) => ({
  ...(await importActual()),
  useNavigate: () => mockNavigate,
}));

import * as useTodosHook from '@/hooks/useTodos';
import * as useCategoriesHook from '@/hooks/useCategories';
import { useUIStore } from '@/store/ui-store';
import TodoListPage from './TodoListPage';

const mockOpenConfirmDialog = vi.fn();

function renderPage() {
  return render(
    <MemoryRouter>
      <TodoListPage />
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.clearAllMocks();

  useUIStore.mockReturnValue(mockOpenConfirmDialog);

  useCategoriesHook.useCategories.mockReturnValue({ data: [], isPending: false });

  useTodosHook.useDeleteTodo.mockReturnValue({ mutate: vi.fn(), isPending: false });
  useTodosHook.useCompleteTodo.mockReturnValue({ mutate: vi.fn(), isPending: false });
  useTodosHook.useUncompleteTodo.mockReturnValue({ mutate: vi.fn(), isPending: false });
});

describe('TodoListPage', () => {
  it('할일 목록을 렌더링한다', () => {
    useTodosHook.useTodos.mockReturnValue({
      data: [{ id: '1', title: '테스트 할일', status: 'PENDING', category: null }],
      isPending: false,
    });

    renderPage();

    expect(screen.getByText('테스트 할일')).toBeInTheDocument();
  });

  it('등록 버튼 클릭 시 /todos/new로 navigate한다', async () => {
    const user = userEvent.setup();
    useTodosHook.useTodos.mockReturnValue({
      data: [{ id: '1', title: '기존 할일', status: 'PENDING', category: null }],
      isPending: false,
    });

    renderPage();

    await user.click(screen.getByRole('button', { name: '할일 등록' }));

    expect(mockNavigate).toHaveBeenCalledWith('/todos/new');
  });

  it('삭제 버튼 클릭 시 openConfirmDialog가 호출된다', async () => {
    const user = userEvent.setup();
    useTodosHook.useTodos.mockReturnValue({
      data: [{ id: '1', title: '삭제 테스트', status: 'PENDING', category: null }],
      isPending: false,
    });

    renderPage();

    await user.click(screen.getByRole('button', { name: '삭제' }));

    expect(mockOpenConfirmDialog).toHaveBeenCalledWith(
      expect.objectContaining({
        title: '할일 삭제',
        message: expect.stringContaining('되돌릴 수 없습니다'),
      })
    );
  });

  it('isPending이면 Spinner를 렌더링한다', () => {
    useTodosHook.useTodos.mockReturnValue({ data: undefined, isPending: true });

    renderPage();

    expect(document.querySelector('svg.animate-spin')).toBeInTheDocument();
  });

  it('빈 목록이면 EmptyState를 렌더링한다', () => {
    useTodosHook.useTodos.mockReturnValue({ data: [], isPending: false });

    renderPage();

    expect(screen.getByText('할일이 없습니다.')).toBeInTheDocument();
  });
});
