import { get, post, put, del } from '@/api/http-client';
import { API_ENDPOINTS } from '@/constants/api-endpoints';

export async function getCategories() {
  return get(API_ENDPOINTS.CATEGORIES.BASE);
}

export async function createCategory({ name, colorCode }) {
  return post(API_ENDPOINTS.CATEGORIES.BASE, { body: { name, colorCode } });
}

export async function updateCategory(id, { name, colorCode }) {
  return put(API_ENDPOINTS.CATEGORIES.DETAIL(id), { body: { name, colorCode } });
}

export async function deleteCategory(id) {
  return del(API_ENDPOINTS.CATEGORIES.DETAIL(id));
}
