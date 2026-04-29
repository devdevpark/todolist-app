import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CategoryCard from './CategoryCard';

const mockCategory = { id: '1', name: '업무', colorCode: '#3B82F6' };

describe('CategoryCard', () => {
  it('카테고리 이름을 렌더링한다', () => {
    render(<CategoryCard category={mockCategory} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('업무')).toBeInTheDocument();
  });

  it('색상점에 backgroundColor 스타일이 적용된다', () => {
    const { container } = render(
      <CategoryCard category={mockCategory} onEdit={vi.fn()} onDelete={vi.fn()} />
    );
    const dot = container.querySelector('[style*="background-color"]');
    expect(dot).toBeTruthy();
    expect(dot.style.backgroundColor).toBe('rgb(59, 130, 246)');
  });

  it('수정 버튼 클릭 시 onEdit(category)가 호출된다', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    render(<CategoryCard category={mockCategory} onEdit={onEdit} onDelete={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: '수정' }));

    expect(onEdit).toHaveBeenCalledWith(mockCategory);
  });

  it('삭제 버튼 클릭 시 onDelete(category)가 호출된다', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(<CategoryCard category={mockCategory} onEdit={vi.fn()} onDelete={onDelete} />);

    await user.click(screen.getByRole('button', { name: '삭제' }));

    expect(onDelete).toHaveBeenCalledWith(mockCategory);
  });
});
