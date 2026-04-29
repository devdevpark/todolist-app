import { post } from '@/api/http-client';
import { API_ENDPOINTS } from '@/constants/api-endpoints';

export async function register({ username, password }) {
  return post(API_ENDPOINTS.AUTH.REGISTER, { body: { username, password } });
}

export async function login({ username, password }) {
  return post(API_ENDPOINTS.AUTH.LOGIN, { body: { username, password } });
}
