import { create } from 'zustand';

const DARK_MODE_KEY = 'dark-mode';

function getInitialDarkMode() {
  const stored = localStorage.getItem(DARK_MODE_KEY);
  if (stored !== null) return stored === 'true';
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export const useUIStore = create((set) => ({
  confirmDialog: {
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    confirmText: '',
    cancelText: '',
  },

  isDarkMode: getInitialDarkMode(),

  openConfirmDialog: ({ title, message, onConfirm, confirmText, cancelText }) => {
    set({
      confirmDialog: {
        isOpen: true,
        title,
        message,
        onConfirm,
        confirmText,
        cancelText,
      },
    });
  },

  closeConfirmDialog: () => {
    set({
      confirmDialog: {
        isOpen: false,
        title: '',
        message: '',
        onConfirm: null,
        confirmText: '',
        cancelText: '',
      },
    });
  },

  toggleDarkMode: () => {
    set((state) => {
      const next = !state.isDarkMode;
      localStorage.setItem(DARK_MODE_KEY, String(next));
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return { isDarkMode: next };
    });
  },
}));
