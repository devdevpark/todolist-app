import { useTranslation } from 'react-i18next';

const selectClass =
  'text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:focus:border-primary';

function TodoFilter({ categories, filters, onFilterChange }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap gap-2">
      <select
        className={selectClass}
        value={filters.categoryId || ''}
        onChange={(e) => onFilterChange({ ...filters, categoryId: e.target.value || undefined })}
        aria-label={t('todo.filter.category')}
      >
        <option value="">{t('todo.filter.allCategories')}</option>
        {categories?.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      <select
        className={selectClass}
        value={filters.status || ''}
        onChange={(e) => onFilterChange({ ...filters, status: e.target.value || undefined })}
        aria-label={t('todo.filter.status')}
      >
        <option value="">{t('todo.filter.all')}</option>
        <option value="PENDING">{t('todo.filter.pending')}</option>
        <option value="COMPLETED">{t('todo.filter.completed')}</option>
        <option value="OVERDUE">{t('todo.filter.overdue')}</option>
      </select>
    </div>
  );
}

export default TodoFilter;
