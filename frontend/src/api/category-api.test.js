import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCategories, createCategory, updateCategory, deleteCategory } from './category-api';
import * as httpClient from '@/api/http-client';

vi.mock('@/api/http-client', () => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  del: vi.fn(),
}));

describe('category-api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getCategories는 올바른 경로로 get을 호출한다', async () => {
    httpClient.get.mockResolvedValue([]);
    await getCategories();
    expect(httpClient.get).toHaveBeenCalledWith('/api/categories');
  });

  it('createCategory는 name과 colorCode를 body로 post한다', async () => {
    httpClient.post.mockResolvedValue({ id: '1', name: '업무', colorCode: '#3B82F6' });
    await createCategory({ name: '업무', colorCode: '#3B82F6' });
    expect(httpClient.post).toHaveBeenCalledWith('/api/categories', {
      body: { name: '업무', colorCode: '#3B82F6' },
    });
  });

  it('updateCategory는 id와 body로 put을 호출한다', async () => {
    httpClient.put.mockResolvedValue({ id: '1', name: '수정됨', colorCode: '#22C55E' });
    await updateCategory('1', { name: '수정됨', colorCode: '#22C55E' });
    expect(httpClient.put).toHaveBeenCalledWith('/api/categories/1', {
      body: { name: '수정됨', colorCode: '#22C55E' },
    });
  });

  it('deleteCategory는 id로 del을 호출한다', async () => {
    httpClient.del.mockResolvedValue(null);
    await deleteCategory('1');
    expect(httpClient.del).toHaveBeenCalledWith('/api/categories/1');
  });
});
