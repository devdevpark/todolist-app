import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TodoFormPage from './TodoFormPage';
import * as useTodos from '@/hooks/useTodos';
import * as useCategories from '@/hooks/useCategories';

vi.mock('@/hooks/useTodos');
vi.mock('@/hooks/useCategories');

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
        <MemoryRouter initialEntries={['/todos/new']}>
          <Routes>
            <Route path="/todos/new" element={children} />
            <Route path="/todos/:id/edit" element={children} />
            <Route path="/todos" element={<div>Todo List Page</div>} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );
  };
}

describe('TodoFormPage', () => {
  const mockCategories = [
    { id: 'cat1', name: 'Work', colorCode: '#ff0000' },
    { id: 'cat2', name: 'Personal', colorCode: '#00ff00' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    useCategories.useCategories.mockReturnValue({
      categories: mockCategories,
      isLoading: false,
    });
    useTodos.useTodo.mockReturnValue({ data: null, isLoading: false });
    useTodos.useCreateTodo.mockReturnValue({ mutate: vi.fn(), isPending: false });
    useTodos.useUpdateTodo.mockReturnValue({ mutate: vi.fn(), isPending: false });
  });

  it('등록 모드에서 빈 폼을 렌더링한다', () => {
    useTodos.useCreateTodo.mockReturnValue({ mutate: vi.fn(), isPending: false });

    render(<TodoFormPage />, { wrapper: createWrapper() });

    expect(screen.getByText('할일 등록')).toBeInTheDocument();
    expect(screen.getByLabelText(/제목/i)).toHaveValue('');
  });

  it('수정 모드에서 기존 데이터를 불러와 폼을 채운다', async () => {
    const mockTodo = {
      id: '1',
      title: 'Existing Todo',
      description: 'Existing Description',
      categoryId: 'cat1',
      dueDate: '2026-12-31T23:59:59.000Z',
    };

    useTodos.useTodo.mockReturnValue({ data: mockTodo, isLoading: false });
    useTodos.useUpdateTodo.mockReturnValue({ mutate: vi.fn(), isPending: false });

    render(
      <MemoryRouter initialEntries={['/todos/1/edit']}>
        <QueryClientProvider client={new QueryClient()}>
          <Routes>
            <Route path="/todos/:id/edit" element={<TodoFormPage />} />
          </Routes>
        </QueryClientProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('할일 수정')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Existing Todo')).toBeInTheDocument();
    });
  });

  it('제목 미입력 시 에러 메시지를 표시한다', async () => {
    useTodos.useCreateTodo.mockReturnValue({ mutate: vi.fn(), isPending: false });

    render(<TodoFormPage />, { wrapper: createWrapper() });

    fireEvent.click(screen.getByRole('button', { name: /저장/i }));

    expect(await screen.findByText('제목을 입력해주세요.')).toBeInTheDocument();
  });

  it('폼 제출 시 등록 API를 호출한다', async () => {
    const mutate = vi.fn();
    useTodos.useCreateTodo.mockReturnValue({ mutate, isPending: false });

    render(<TodoFormPage />, { wrapper: createWrapper() });

    fireEvent.change(screen.getByLabelText(/제목/i), { target: { value: 'New Todo' } });
    fireEvent.click(screen.getByRole('button', { name: /저장/i }));

    await waitFor(() => {
      expect(mutate).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'New Todo' }),
        expect.anything()
      );
    });
  });
});
