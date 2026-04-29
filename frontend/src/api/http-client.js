import { useAuthStore } from '@/store/auth-store';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

async function request(method, path, { body, params } = {}) {
  const token = useAuthStore.getState().token;

  let url = `${BASE_URL}${path}`;

  if (params) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value);
      }
    }
    const queryString = searchParams.toString();
    if (queryString) {
      url = `${url}?${queryString}`;
    }
  }

  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();

  if (!data.success) {
    if (response.status === 401) {
      useAuthStore.getState().clearAuth();
      window.location.href = '/login';
      return;
    }

    const error = new Error(data.error?.message ?? '요청 처리 중 오류가 발생했습니다.');
    error.code = data.error?.code;
    error.status = response.status;
    throw error;
  }

  return data.data;
}

export const get = (path, options) => request('GET', path, options);
export const post = (path, options) => request('POST', path, options);
export const put = (path, options) => request('PUT', path, options);
export const patch = (path, options) => request('PATCH', path, options);
export const del = (path, options) => request('DELETE', path, options);
