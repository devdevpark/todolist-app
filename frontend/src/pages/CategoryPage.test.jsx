import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

vi.mock('@/hooks/useCategories');
vi.mock('@/store/ui-store');

import * as useCategorieshook from '@/hooks/useCategories';
import { useUIStore } from '@/store/ui-store';
import CategoryPage from './CategoryPage';

const mockOpenConfirmDialog = vi.fn();

function renderPage() {
  return render(
    <MemoryRouter>
      <CategoryPage />
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.clearAllMocks();

  useUIStore.mockReturnValue(mockOpenConfirmDialog);

  useCategorieshook.useCreateCategory.mockReturnValue({ mutate: vi.fn(), isPending: false });
  useCategorieshook.useUpdateCategory.mockReturnValue({ mutate: vi.fn(), isPending: false });
  useCategorieshook.useDeleteCategory.mockReturnValue({ mutate: vi.fn(), isPending: false });
});

describe('CategoryPage', () => {
  it('카테고리 목록을 렌더링한다', () => {
    useCategorieshook.useCategories.mockReturnValue({
      data: [{ id: '1', name: '업무', colorCode: '#3B82F6' }],
      isPending: false,
    });

    renderPage();

    expect(screen.getByText('업무')).toBeInTheDocument();
  });

  it('추가 버튼 클릭 시 CategoryForm이 표시된다', async () => {
    const user = userEvent.setup();
    useCategorieshook.useCategories.mockReturnValue({
      data: [{ id: '1', name: '기존카테고리', colorCode: '#3B82F6' }],
      isPending: false,
    });

    renderPage();

    await user.click(screen.getByRole('button', { name: '추가' }));

    expect(screen.getByLabelText('카테고리 이름')).toBeInTheDocument();
  });

  it('삭제 버튼 클릭 시 openConfirmDialog가 올바른 메시지와 함께 호출된다', async () => {
    const user = userEvent.setup();
    useCategorieshook.useCategories.mockReturnValue({
      data: [{ id: '1', name: '업무', colorCode: '#3B82F6' }],
      isPending: false,
    });

    renderPage();

    await user.click(screen.getByRole('button', { name: '삭제' }));

    expect(mockOpenConfirmDialog).toHaveBeenCalledWith(
      expect.objectContaining({
        title: '삭제',
        message: expect.stringContaining('연결된 할일의 카테고리가 해제됩니다'),
      })
    );
  });

  it('isPending이면 Spinner를 렌더링한다', () => {
    useCategorieshook.useCategories.mockReturnValue({ data: undefined, isPending: true });

    renderPage();

    expect(document.querySelector('svg.animate-spin')).toBeInTheDocument();
  });

  it('빈 목록이면 EmptyState를 렌더링한다', () => {
    useCategorieshook.useCategories.mockReturnValue({ data: [], isPending: false });

    renderPage();

    expect(screen.getByText('카테고리가 없습니다.')).toBeInTheDocument();
  });
});
