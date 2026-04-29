import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { login as loginApi, register as registerApi } from '@/api/auth-api';
import { useAuthStore } from '@/store/auth-store';

export function useLogin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      setAuth({ token: data.token, user: data.user });
      const redirectUrl = sessionStorage.getItem('redirectUrl');
      sessionStorage.removeItem('redirectUrl');
      navigate(redirectUrl || '/todos', { replace: true });
    },
  });
}

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: registerApi,
    onSuccess: () => {
      navigate('/login', { replace: true });
    },
  });
}
