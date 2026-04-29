import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoFilter from './TodoFilter';

const categories = [{ id: '1', name: '업무', colorCode: '#3B82F6' }];
const filters = { categoryId: undefined, status: undefined };

describe('TodoFilter', () => {
  it('카테고리 옵션을 렌더링한다 (전체+1개)', () => {
    render(<TodoFilter categories={categories} filters={filters} onFilterChange={vi.fn()} />);
    const options = screen.getAllByRole('option', { name: /전체 카테고리|업무/ });
    expect(options).toHaveLength(2);
  });

  it('상태 옵션 4개를 렌더링한다', () => {
    render(<TodoFilter categories={categories} filters={filters} onFilterChange={vi.fn()} />);
    const statusSelect = screen.getByLabelText('상태 필터');
    expect(statusSelect.querySelectorAll('option')).toHaveLength(4);
  });

  it('카테고리 변경 시 onFilterChange가 호출된다', async () => {
    const user = userEvent.setup();
    const onFilterChange = vi.fn();
    render(
      <TodoFilter categories={categories} filters={filters} onFilterChange={onFilterChange} />
    );

    await user.selectOptions(screen.getByLabelText('카테고리 필터'), '1');

    expect(onFilterChange).toHaveBeenCalledWith({ categoryId: '1', status: undefined });
  });
});
