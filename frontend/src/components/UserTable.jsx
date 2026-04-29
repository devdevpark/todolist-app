import { useTranslation } from 'react-i18next';
import { Button } from '@/components/common';
import { USER_ROLE } from '@/constants/user-role';

export default function UserTable({ users, onToggleStatus, isUpdating }) {
  const { t } = useTranslation();

  const getRoleBadgeClass = (role) => {
    return role === USER_ROLE.ADMIN
      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
  };

  const getStatusBadgeClass = (isActive) => {
    return isActive
      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
        <thead className="bg-gray-50 dark:bg-gray-800/50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t('admin.username')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t('admin.role')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t('admin.status')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t('admin.createdAt')}
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t('admin.actions')}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-800">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.username}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeClass(
                    user.role
                  )}`}
                >
                  {user.role === USER_ROLE.ADMIN ? t('admin.admin') : t('admin.user')}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                    user.isActive
                  )}`}
                >
                  {user.isActive ? t('admin.active') : t('admin.inactive')}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString('ko-KR') : '-'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {user.role !== USER_ROLE.ADMIN && (
                  <Button
                    variant={user.isActive ? 'danger' : 'primary'}
                    size="sm"
                    onClick={() => onToggleStatus(user.id, !user.isActive)}
                    disabled={isUpdating}
                  >
                    {user.isActive ? t('admin.deactivate') : t('admin.activate')}
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
