import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Input } from '@/components/common';
import { useRegister } from '@/hooks/useAuth';
import { validateUsername, validatePassword } from '@/utils/validators';
import { getAuthErrorMessage } from '@/utils/auth-error';

function RegisterPage() {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const registerMutation = useRegister();

  function handleSubmit(e) {
    e.preventDefault();

    const usernameError = validateUsername(username);
    const passwordError = validatePassword(password);

    if (usernameError || passwordError) {
      setFieldErrors({ username: usernameError, password: passwordError });
      return;
    }

    setFieldErrors({});
    registerMutation.mutate({ username, password });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-gray-950 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('common.appTitle')}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('auth.welcome')}</p>
        </div>

        {registerMutation.error && (
          <div
            role="alert"
            className="mb-4 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-error dark:text-red-400"
          >
            {getAuthErrorMessage(registerMutation.error)}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            <div>
              <Input
                id="username"
                name="username"
                label={t('auth.username')}
                placeholder={t('auth.usernamePlaceholder')}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                error={fieldErrors.username}
                disabled={registerMutation.isPending}
                autoComplete="username"
              />
              {!fieldErrors.username && (
                <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{t('auth.usernameHint')}</p>
              )}
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              label={t('auth.password')}
              placeholder={t('auth.passwordPlaceholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={fieldErrors.password}
              disabled={registerMutation.isPending}
              autoComplete="new-password"
            />
          </div>

          <Button
            type="submit"
            className="w-full mt-6"
            isLoading={registerMutation.isPending}
            disabled={registerMutation.isPending}
          >
            {t('common.register')}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          {t('auth.hasAccount')}{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">
            {t('common.login')}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
