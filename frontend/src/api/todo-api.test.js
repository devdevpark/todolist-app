import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  completeTodo,
  uncompleteTodo,
} from './todo-api';
import * as httpClient from '@/api/http-client';

vi.mock('@/api/http-client', () => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  patch: vi.fn(),
  del: vi.fn(),
}));

describe('todo-api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getTodos() 필터 없이 호출하면 params에 undefined가 전달된다', async () => {
    httpClient.get.mockResolvedValue([]);
    await getTodos();
    expect(httpClient.get).toHaveBeenCalledWith('/api/todos', {
      params: { categoryId: undefined, status: undefined },
    });
  });

  it('getTodos({ categoryId }) 호출 시 categoryId가 params에 포함된다', async () => {
    httpClient.get.mockResolvedValue([]);
    await getTodos({ categoryId: '1' });
    expect(httpClient.get).toHaveBeenCalledWith('/api/todos', {
      params: { categoryId: '1', status: undefined },
    });
  });

  it('getTodos({ status }) 호출 시 status가 params에 포함된다', async () => {
    httpClient.get.mockResolvedValue([]);
    await getTodos({ status: 'PENDING' });
    expect(httpClient.get).toHaveBeenCalledWith('/api/todos', {
      params: { categoryId: undefined, status: 'PENDING' },
    });
  });

  it('deleteTodo는 id로 del을 호출한다', async () => {
    httpClient.del.mockResolvedValue(null);
    await deleteTodo('1');
    expect(httpClient.del).toHaveBeenCalledWith('/api/todos/1');
  });

  it('completeTodo는 id로 complete 경로에 patch를 호출한다', async () => {
    httpClient.patch.mockResolvedValue({});
    await completeTodo('1');
    expect(httpClient.patch).toHaveBeenCalledWith('/api/todos/1/complete');
  });

  it('uncompleteTodo는 id로 uncomplete 경로에 patch를 호출한다', async () => {
    httpClient.patch.mockResolvedValue({});
    await uncompleteTodo('1');
    expect(httpClient.patch).toHaveBeenCalledWith('/api/todos/1/uncomplete');
  });

  it('getTodoById는 id로 get을 호출한다', async () => {
    httpClient.get.mockResolvedValue({ id: '1' });
    await getTodoById('1');
    expect(httpClient.get).toHaveBeenCalledWith('/api/todos/1');
  });

  it('createTodo는 data로 post를 호출한다', async () => {
    const data = { title: 'New Todo' };
    httpClient.post.mockResolvedValue({ id: '1', ...data });
    await createTodo(data);
    expect(httpClient.post).toHaveBeenCalledWith('/api/todos', { body: data });
  });

  it('updateTodo는 id와 data로 put을 호출한다', async () => {
    const data = { title: 'Updated Todo' };
    httpClient.put.mockResolvedValue({ id: '1', ...data });
    await updateTodo('1', data);
    expect(httpClient.put).toHaveBeenCalledWith('/api/todos/1', { body: data });
  });
});
