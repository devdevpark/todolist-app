import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';

vi.mock('@/api/category-api');

import * as categoryApi from '@/api/category-api';
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from './useCategories';

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

describe('useCategories', () => {
  it('getCategories 결과를 data로 반환한다', async () => {
    const mockData = [{ id: '1', name: '업무', colorCode: '#3B82F6' }];
    categoryApi.getCategories.mockResolvedValue(mockData);

    const { result } = renderHook(() => useCategories(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData);
  });
});

describe('useCreateCategory', () => {
  it('mutate 성공 후 categories 쿼리가 무효화된다', async () => {
    categoryApi.getCategories.mockResolvedValue([]);
    categoryApi.createCategory.mockResolvedValue({ id: '2', name: '개인', colorCode: '#22C55E' });

    const wrapper = createWrapper();
    const { result } = renderHook(() => useCreateCategory(), { wrapper });

    act(() => {
      result.current.mutate({ name: '개인', colorCode: '#22C55E' });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(categoryApi.createCategory).toHaveBeenCalledWith(
      { name: '개인', colorCode: '#22C55E' },
      expect.anything()
    );
  });
});

describe('useUpdateCategory', () => {
  it('mutate 성공 후 categories 쿼리가 무효화된다', async () => {
    categoryApi.getCategories.mockResolvedValue([]);
    categoryApi.updateCategory.mockResolvedValue({ id: '1', name: '수정됨', colorCode: '#EF4444' });

    const wrapper = createWrapper();
    const { result } = renderHook(() => useUpdateCategory(), { wrapper });

    act(() => {
      result.current.mutate({ id: '1', name: '수정됨', colorCode: '#EF4444' });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(categoryApi.updateCategory).toHaveBeenCalledWith('1', {
      name: '수정됨',
      colorCode: '#EF4444',
    });
  });
});

describe('useDeleteCategory', () => {
  it('mutate 성공 후 categories 쿼리가 무효화된다', async () => {
    categoryApi.getCategories.mockResolvedValue([]);
    categoryApi.deleteCategory.mockResolvedValue(null);

    const wrapper = createWrapper();
    const { result } = renderHook(() => useDeleteCategory(), { wrapper });

    act(() => {
      result.current.mutate('1');
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(categoryApi.deleteCategory).toHaveBeenCalledWith('1', expect.anything());
  });
});
