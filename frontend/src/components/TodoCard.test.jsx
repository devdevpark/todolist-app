import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoCard from './TodoCard';

const pendingTodo = {
  id: '1',
  title: '테스트',
  status: 'PENDING',
  category: { name: '업무', colorCode: '#3B82F6' },
  dueDate: '2026-04-30T00:00:00Z',
};

const completedTodo = {
  id: '2',
  title: '완료',
  status: 'COMPLETED',
  completedAt: '2026-04-28T09:00:00Z',
};

const overdueTodo = {
  id: '3',
  title: '기한초과',
  status: 'OVERDUE',
};

function defaultProps(todo) {
  return {
    todo,
    onComplete: vi.fn(),
    onUncomplete: vi.fn(),
    onEdit: vi.fn(),
    onDelete: vi.fn(),
  };
}

describe('TodoCard', () => {
  it('PENDING 상태에서 "완료 처리" 버튼이 있고 "완료 취소" 버튼은 없다', () => {
    render(<TodoCard {...defaultProps(pendingTodo)} />);
    expect(screen.getByRole('button', { name: '완료 처리' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '완료 취소' })).not.toBeInTheDocument();
  });

  it('COMPLETED 상태에서 "완료 취소" 버튼이 있고 제목에 line-through 클래스가 있다', () => {
    render(<TodoCard {...defaultProps(completedTodo)} />);
    expect(screen.getByRole('button', { name: '완료 취소' })).toBeInTheDocument();
    const title = screen.getByText('완료');
    expect(title.className).toContain('line-through');
  });

  it('OVERDUE 상태에서 "완료 처리" 버튼이 있고 빨간 border 클래스가 적용된다', () => {
    const { container } = render(<TodoCard {...defaultProps(overdueTodo)} />);
    expect(screen.getByRole('button', { name: '완료 처리' })).toBeInTheDocument();
    const card = container.firstChild;
    expect(card.className).toContain('border-red-400');
  });

  it('삭제 버튼 클릭 시 onDelete가 호출된다', async () => {
    const user = userEvent.setup();
    const props = defaultProps(pendingTodo);
    render(<TodoCard {...props} />);

    await user.click(screen.getByRole('button', { name: '삭제' }));

    expect(props.onDelete).toHaveBeenCalledWith(pendingTodo);
  });

  it('수정 버튼 클릭 시 onEdit이 호출된다', async () => {
    const user = userEvent.setup();
    const props = defaultProps(pendingTodo);
    render(<TodoCard {...props} />);

    await user.click(screen.getByRole('button', { name: '수정' }));

    expect(props.onEdit).toHaveBeenCalledWith(pendingTodo);
  });
});
