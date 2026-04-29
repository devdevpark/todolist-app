import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmptyState from './EmptyState';

describe('EmptyState', () => {
  it('message를 렌더링한다', () => {
    render(<EmptyState message="데이터가 없습니다." />);
    expect(screen.getByText('데이터가 없습니다.')).toBeInTheDocument();
  });

  it('actionLabel이 있으면 버튼을 렌더링한다', () => {
    render(<EmptyState message="없음" actionLabel="추가하기" onAction={vi.fn()} />);
    expect(screen.getByRole('button', { name: '추가하기' })).toBeInTheDocument();
  });

  it('actionLabel이 있는 버튼 클릭 시 onAction이 호출된다', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(<EmptyState message="없음" actionLabel="추가하기" onAction={onAction} />);

    await user.click(screen.getByRole('button', { name: '추가하기' }));

    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('actionLabel이 없으면 버튼을 렌더링하지 않는다', () => {
    render(<EmptyState message="없음" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
