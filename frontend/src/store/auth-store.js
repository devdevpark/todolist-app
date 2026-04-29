import { create } from 'zustand';
import { getToken, setToken, removeToken } from '@/utils/token-storage';

export const useAuthStore = create((set) => ({
  token: getToken(),
  user: null,
  isAuthenticated: !!getToken(),

  setAuth: ({ token, user }) => {
    setToken(token);
    set({ token, user, isAuthenticated: true });
  },

  clearAuth: () => {
    removeToken();
    set({ token: null, user: null, isAuthenticated: false });
  },
}));
