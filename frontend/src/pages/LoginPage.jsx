import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Input } from '@/components/common';
import { useLogin } from '@/hooks/useAuth';
import { validateUsername, validatePassword } from '@/utils/validators';
import { getAuthErrorMessage } from '@/utils/auth-error';

function LoginPage() {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const loginMutation = useLogin();

  function handleSubmit(e) {
    e.preventDefault();

    const usernameError = validateUsername(username);
    const passwordError = validatePassword(password);

    if (usernameError || passwordError) {
      setFieldErrors({ username: usernameError, password: passwordError });
      return;
    }

    setFieldErrors({});
    loginMutation.mutate({ username, password });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-gray-950 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('common.appTitle')}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('auth.welcome')}</p>
        </div>

        {loginMutation.error && (
          <div
            role="alert"
            className="mb-4 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-error dark:text-red-400"
          >
            {getAuthErrorMessage(loginMutation.error)}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            <Input
              id="username"
              name="username"
              label={t('auth.username')}
              placeholder={t('auth.usernamePlaceholder')}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={fieldErrors.username}
              disabled={loginMutation.isPending}
              autoComplete="username"
            />
            <Input
              id="password"
              name="password"
              type="password"
              label={t('auth.password')}
              placeholder={t('auth.passwordPlaceholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={fieldErrors.password}
              disabled={loginMutation.isPending}
              autoComplete="current-password"
            />
          </div>

          <Button
            type="submit"
            className="w-full mt-6"
            isLoading={loginMutation.isPending}
            disabled={loginMutation.isPending}
          >
            {t('common.login')}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          {t('auth.noAccount')}{' '}
          <Link to="/register" className="text-primary font-medium hover:underline">
            {t('common.register')}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
