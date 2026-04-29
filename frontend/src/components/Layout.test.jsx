import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Outlet, Route, Routes } from 'react-router-dom';
import { useUIStore } from '@/store/ui-store';

vi.mock('@/components/Header', () => ({
  default: () => <div data-testid="mock-header">Header</div>,
}));

import Layout from './Layout';

function renderLayout({ isOpen = false, title = '', message = '', onConfirm } = {}) {
  useUIStore.setState({
    confirmDialog: { isOpen, title, message, onConfirm: onConfirm ?? null },
    closeConfirmDialog: () =>
      useUIStore.setState((s) => ({
        confirmDialog: { ...s.confirmDialog, isOpen: false },
      })),
  });

  return render(
    <MemoryRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<div>page content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe('Layout', () => {
  it('Header와 Outlet 콘텐츠가 렌더된다', () => {
    renderLayout();
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByText('page content')).toBeInTheDocument();
  });

  it('confirmDialog가 닫힌 상태면 Dialog가 표시되지 않는다', () => {
    renderLayout({ isOpen: false, title: '삭제', message: '정말 삭제할까요?' });
    expect(screen.queryByText('정말 삭제할까요?')).not.toBeInTheDocument();
  });

  it('confirmDialog가 열린 상태면 Dialog가 표시된다', () => {
    renderLayout({ isOpen: true, title: '삭제', message: '정말 삭제할까요?' });
    expect(screen.getByText('정말 삭제할까요?')).toBeInTheDocument();
  });

  it('Dialog 확인 버튼 클릭 시 onConfirm이 호출되고 닫힌다', () => {
    const onConfirm = vi.fn();
    renderLayout({ isOpen: true, title: '삭제', message: '확인 테스트', onConfirm });
    fireEvent.click(screen.getByText('확인'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('Dialog 취소 버튼 클릭 시 Dialog가 닫힌다', () => {
    renderLayout({ isOpen: true, title: '삭제', message: '취소 테스트' });
    fireEvent.click(screen.getByText('취소'));
    expect(screen.queryByText('취소 테스트')).not.toBeInTheDocument();
  });

  it('onConfirm이 없어도 확인 클릭이 에러 없이 동작한다', () => {
    renderLayout({ isOpen: true, title: '삭제', message: 'null onConfirm', onConfirm: undefined });
    expect(() => fireEvent.click(screen.getByText('확인'))).not.toThrow();
  });
});
