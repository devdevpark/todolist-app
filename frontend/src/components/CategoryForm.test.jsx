import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CategoryForm from './CategoryForm';

describe('CategoryForm', () => {
  it('이름 입력 필드와 색상 입력 필드를 렌더링한다', () => {
    render(<CategoryForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByLabelText('카테고리 이름')).toBeInTheDocument();
  });

  it('initialValues로 초기값이 설정된다', () => {
    render(
      <CategoryForm
        initialValues={{ name: '초기이름', colorCode: '#22C55E' }}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    expect(screen.getByLabelText('카테고리 이름')).toHaveValue('초기이름');
  });

  it('이름 입력 시 값이 반영된다', async () => {
    const user = userEvent.setup();
    render(<CategoryForm onSubmit={vi.fn()} onCancel={vi.fn()} />);

    const input = screen.getByLabelText('카테고리 이름');
    await user.clear(input);
    await user.type(input, '새 카테고리');

    expect(input).toHaveValue('새 카테고리');
  });

  it('팔레트 버튼 클릭 시 colorCode가 변경된다', async () => {
    const user = userEvent.setup();
    render(<CategoryForm onSubmit={vi.fn()} onCancel={vi.fn()} />);

    const greenButton = screen.getByLabelText('색상 추가: #22C55E');
    await user.click(greenButton);

    const colorInput = screen.getByPlaceholderText('#000000');
    expect(colorInput).toHaveValue('#22C55E');
  });

  it('저장 클릭 시 onSubmit이 { name, colorCode }로 호출된다', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <CategoryForm
        initialValues={{ name: '업무', colorCode: '#3B82F6' }}
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />
    );

    await user.click(screen.getByRole('button', { name: '저장' }));

    expect(onSubmit).toHaveBeenCalledWith({ name: '업무', colorCode: '#3B82F6' });
  });

  it('취소 클릭 시 onCancel이 호출된다', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(<CategoryForm onSubmit={vi.fn()} onCancel={onCancel} />);

    await user.click(screen.getByRole('button', { name: '취소' }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('isSubmitting=true이면 저장 버튼이 disabled된다', () => {
    render(<CategoryForm onSubmit={vi.fn()} onCancel={vi.fn()} isSubmitting={true} />);
    expect(screen.getByRole('button', { name: /저장/ })).toBeDisabled();
  });

  it('error prop이 있으면 role="alert" 메시지가 렌더링된다', () => {
    render(<CategoryForm onSubmit={vi.fn()} onCancel={vi.fn()} error="오류가 발생했습니다." />);
    expect(screen.getByRole('alert')).toHaveTextContent('오류가 발생했습니다.');
  });
});
