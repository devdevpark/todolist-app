export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
  },
  TODOS: {
    BASE: '/api/todos',
    DETAIL: (id) => `/api/todos/${id}`,
    COMPLETE: (id) => `/api/todos/${id}/complete`,
    UNCOMPLETE: (id) => `/api/todos/${id}/uncomplete`,
  },
  CATEGORIES: {
    BASE: '/api/categories',
    DETAIL: (id) => `/api/categories/${id}`,
  },
  ADMIN: {
    USERS: '/api/admin/users',
    USER_STATUS: (id) => `/api/admin/users/${id}/status`,
  },
};
