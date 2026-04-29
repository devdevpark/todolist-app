import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';

vi.mock('@/api/todo-api');

import * as todoApi from '@/api/todo-api';
import {
  useTodos,
  useTodo,
  useCreateTodo,
  useUpdateTodo,
  useDeleteTodo,
  useCompleteTodo,
  useUncompleteTodo,
} from './useTodos';

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

describe('useTodos', () => {
  it('getTodos를 호출하고 결과를 data로 반환한다', async () => {
    const mockData = [{ id: '1', title: '테스트', status: 'PENDING' }];
    todoApi.getTodos.mockResolvedValue(mockData);

    const { result } = renderHook(() => useTodos(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData);
    expect(todoApi.getTodos).toHaveBeenCalledWith({});
  });

  it('filters를 getTodos에 전달한다', async () => {
    todoApi.getTodos.mockResolvedValue([]);
    const filters = { categoryId: '1', status: 'PENDING' };

    const { result } = renderHook(() => useTodos(filters), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(todoApi.getTodos).toHaveBeenCalledWith(filters);
  });
});

describe('useTodo', () => {
  it('getTodoById를 호출하고 결과를 data로 반환한다', async () => {
    const mockData = { id: '1', title: '테스트' };
    todoApi.getTodoById.mockResolvedValue(mockData);

    const { result } = renderHook(() => useTodo('1'), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData);
    expect(todoApi.getTodoById).toHaveBeenCalledWith('1');
  });

  it('id가 없으면 호출하지 않는다', () => {
    const { result } = renderHook(() => useTodo(null), { wrapper: createWrapper() });
    expect(result.current.isLoading).toBe(false);
    expect(todoApi.getTodoById).not.toHaveBeenCalled();
  });
});

describe('useCreateTodo', () => {
  it('mutate 호출 시 createTodo가 실행된다', async () => {
    const data = { title: 'New Todo' };
    todoApi.createTodo.mockResolvedValue({ id: '1', ...data });

    const wrapper = createWrapper();
    const { result } = renderHook(() => useCreateTodo(), { wrapper });

    act(() => {
      result.current.mutate(data);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(todoApi.createTodo).toHaveBeenCalledWith(data, expect.anything());
  });
});

describe('useUpdateTodo', () => {
  it('mutate 호출 시 updateTodo가 실행된다', async () => {
    const data = { id: '1', title: 'Updated Todo' };
    todoApi.updateTodo.mockResolvedValue(data);

    const wrapper = createWrapper();
    const { result } = renderHook(() => useUpdateTodo(), { wrapper });

    act(() => {
      result.current.mutate(data);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(todoApi.updateTodo).toHaveBeenCalledWith('1', data);
  });
});

describe('useDeleteTodo', () => {
  it('mutate 호출 시 deleteTodo가 실행된다', async () => {
    todoApi.getTodos.mockResolvedValue([]);
    todoApi.deleteTodo.mockResolvedValue(null);

    const wrapper = createWrapper();
    const { result } = renderHook(() => useDeleteTodo(), { wrapper });

    act(() => {
      result.current.mutate('1');
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(todoApi.deleteTodo).toHaveBeenCalledWith('1', expect.anything());
  });
});

describe('useCompleteTodo', () => {
  it('mutate 호출 시 completeTodo가 실행된다', async () => {
    todoApi.getTodos.mockResolvedValue([]);
    todoApi.completeTodo.mockResolvedValue({});

    const wrapper = createWrapper();
    const { result } = renderHook(() => useCompleteTodo(), { wrapper });

    act(() => {
      result.current.mutate('1');
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(todoApi.completeTodo).toHaveBeenCalledWith('1', expect.anything());
  });
});

describe('useUncompleteTodo', () => {
  it('mutate 호출 시 uncompleteTodo가 실행된다', async () => {
    todoApi.getTodos.mockResolvedValue([]);
    todoApi.uncompleteTodo.mockResolvedValue({});

    const wrapper = createWrapper();
    const { result } = renderHook(() => useUncompleteTodo(), { wrapper });

    act(() => {
      result.current.mutate('1');
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(todoApi.uncompleteTodo).toHaveBeenCalledWith('1', expect.anything());
  });
});
