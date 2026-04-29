import { get, post, put, patch, del } from '@/api/http-client';
import { API_ENDPOINTS } from '@/constants/api-endpoints';

export async function getTodos({ categoryId, status } = {}) {
  return get(API_ENDPOINTS.TODOS.BASE, {
    params: {
      categoryId: categoryId || undefined,
      status: status || undefined,
    },
  });
}

export async function getTodoById(id) {
  return get(API_ENDPOINTS.TODOS.DETAIL(id));
}

export async function createTodo(data) {
  return post(API_ENDPOINTS.TODOS.BASE, { body: data });
}

export async function updateTodo(id, data) {
  return put(API_ENDPOINTS.TODOS.DETAIL(id), { body: data });
}

export async function deleteTodo(id) {
  return del(API_ENDPOINTS.TODOS.DETAIL(id));
}

export async function completeTodo(id) {
  return patch(API_ENDPOINTS.TODOS.COMPLETE(id));
}

export async function uncompleteTodo(id) {
  return patch(API_ENDPOINTS.TODOS.UNCOMPLETE(id));
}
