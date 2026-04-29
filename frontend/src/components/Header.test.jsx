import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useAuthStore } from '@/store/auth-store';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importActual) => ({
  ...(await importActual()),
  useNavigate: () => mockNavigate,
}));

import Header from './Header';

function renderHeader(user = { role: 'USER', username: 'testuser' }) {
  useAuthStore.setState({ user, isAuthenticated: !!user, token: user ? 'token' : null });
  return render(
    <MemoryRouter initialEntries={['/todos']}>
      <Header />
    </MemoryRouter>
  );
}

describe('Header', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    localStorage.clear();
  });

  it('로고 텍스트가 렌더된다', () => {
    renderHeader();
    expect(screen.getByText('TodoList')).toBeInTheDocument();
  });

  it('할일 목록, 카테고리 관리 링크가 렌더된다', () => {
    renderHeader();
    expect(screen.getAllByText('할일 목록').length).toBeGreaterThan(0);
    expect(screen.getAllByText('카테고리 관리').length).toBeGreaterThan(0);
  });

  it('USER 역할이면 사용자 관리 링크가 없다', () => {
    renderHeader({ role: 'USER', username: 'user1' });
    expect(screen.queryByText('사용자 관리')).not.toBeInTheDocument();
  });

  it('ADMIN 역할이면 사용자 관리 링크가 렌더된다', () => {
    renderHeader({ role: 'ADMIN', username: 'admin' });
    expect(screen.getAllByText('사용자 관리').length).toBeGreaterThan(0);
  });

  it('로그아웃 버튼 클릭 시 clearAuth 후 /login으로 이동한다', () => {
    const clearAuth = vi.fn();
    useAuthStore.setState({ user: { role: 'USER' }, clearAuth });
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    const logoutButtons = screen.getAllByText('로그아웃');
    fireEvent.click(logoutButtons[0]);
    expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
  });

  it('모바일 햄버거 버튼 클릭 시 메뉴가 열린다', () => {
    renderHeader();
    const menuButton = screen.getByLabelText('메뉴 열기');
    expect(screen.queryByText('로그아웃')).toBeInTheDocument();
    fireEvent.click(menuButton);
    const allLogout = screen.getAllByText('로그아웃');
    expect(allLogout.length).toBeGreaterThanOrEqual(1);
  });

  it('모바일 메뉴에서 링크 클릭 시 메뉴가 닫힌다', () => {
    renderHeader();
    const menuButton = screen.getByLabelText('메뉴 열기');
    fireEvent.click(menuButton);
    const mobileLinks = screen.getAllByText('할일 목록');
    fireEvent.click(mobileLinks[mobileLinks.length - 1]);
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  });
});
