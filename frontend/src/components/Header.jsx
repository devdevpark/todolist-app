import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/auth-store';
import { useUIStore } from '@/store/ui-store';
import { USER_ROLE } from '@/constants/user-role';
import Button from '@/components/common/Button';

const navLinkClass = ({ isActive }) =>
  isActive
    ? 'text-primary font-semibold text-sm'
    : 'text-gray-600 hover:text-gray-900 text-sm dark:text-gray-300 dark:hover:text-gray-100';

function SunIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 3v1m0 16v1m8.66-9H21M3 12H2m15.07-6.07l-.7.7M7.63 17.37l-.7.7m11.14 0l-.7-.7M7.63 6.63l-.7-.7M12 7a5 5 0 100 10A5 5 0 0012 7z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
    </svg>
  );
}

function Header() {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const navigate = useNavigate();
  const isDarkMode = useUIStore((state) => state.isDarkMode);
  const toggleDarkMode = useUIStore((state) => state.toggleDarkMode);

  const isAdmin = user?.role === USER_ROLE.ADMIN;

  const NAV_LINKS = [
    { to: '/todos', label: t('common.todoList') },
    { to: '/categories', label: t('common.categoryManage') },
  ];

  function handleLogout() {
    clearAuth();
    navigate('/login', { replace: true });
  }

  function handleMenuToggle() {
    setIsMenuOpen((prev) => !prev);
  }

  function handleMobileNavClick() {
    setIsMenuOpen(false);
  }

  function changeLanguage(e) {
    i18n.changeLanguage(e.target.value);
  }

  return (
    <header className="bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <span className="font-bold text-gray-900 text-base dark:text-gray-100">{t('common.appTitle')}</span>

          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} className={navLinkClass}>
                {link.label}
              </NavLink>
            ))}
            {isAdmin && (
              <NavLink to="/admin/users" className={navLinkClass}>
                {t('common.userManage')}
              </NavLink>
            )}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <select
              value={i18n.language}
              onChange={changeLanguage}
              className="text-xs border border-gray-300 dark:border-gray-600 rounded bg-transparent p-1 dark:text-gray-300"
              aria-label="언어 선택"
            >
              <option value="ko">한국어</option>
              <option value="en">English</option>
              <option value="ja">日本語</option>
            </select>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={toggleDarkMode}
                aria-label={isDarkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
              >
                {isDarkMode ? <SunIcon /> : <MoonIcon />}
              </button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                {t('common.logout')}
              </Button>
            </div>
          </div>

          <div className="md:hidden flex items-center gap-1">
            <select
              value={i18n.language}
              onChange={changeLanguage}
              className="text-xs border border-gray-300 dark:border-gray-600 rounded bg-transparent p-1 dark:text-gray-300 mr-1"
              aria-label="언어 선택"
            >
              <option value="ko">KO</option>
              <option value="en">EN</option>
              <option value="ja">JA</option>
            </select>
            <button
              type="button"
              onClick={toggleDarkMode}
              aria-label={isDarkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
            >
              {isDarkMode ? <SunIcon /> : <MoonIcon />}
            </button>
            <button
              type="button"
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              onClick={handleMenuToggle}
              aria-label="메뉴 열기"
              aria-expanded={isMenuOpen}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden pb-3 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={navLinkClass}
                onClick={handleMobileNavClick}
              >
                <span className="block px-2 py-2">{link.label}</span>
              </NavLink>
            ))}
            {isAdmin && (
              <NavLink
                to="/admin/users"
                className={navLinkClass}
                onClick={handleMobileNavClick}
              >
                <span className="block px-2 py-2">{t('common.userManage')}</span>
              </NavLink>
            )}
            <div className="pt-2 border-t border-gray-100 dark:border-gray-700 mt-1">
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                {t('common.logout')}
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;
