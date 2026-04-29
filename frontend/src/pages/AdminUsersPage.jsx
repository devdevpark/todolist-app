import { useTranslation } from 'react-i18next';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import UserTable from '@/components/UserTable';
import { Spinner } from '@/components/common';

export default function AdminUsersPage() {
  const { t } = useTranslation();
  const { users, isLoading, updateUserStatus, isUpdating } = useAdminUsers();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('admin.userManage')}</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{t('admin.desc')}</p>
      </div>

      <div className="rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
        {users.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">{t('admin.none')}</div>
        ) : (
          <UserTable
            users={users}
            onToggleStatus={updateUserStatus}
            isUpdating={isUpdating}
          />
        )}
      </div>
    </div>
  );
}
