import { useTranslation } from 'react-i18next';
import Button from '@/components/common/Button';

function CategoryCard({ category, onEdit, onDelete }) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between px-4 py-3 border border-gray-200 rounded-lg bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center gap-2">
        <span
          style={{ backgroundColor: category.colorCode }}
          className="w-3 h-3 rounded-full inline-block flex-shrink-0"
          aria-hidden="true"
        />
        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{category.name}</span>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" onClick={() => onEdit(category)}>
          {t('common.edit')}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onDelete(category)}>
          {t('common.delete')}
        </Button>
      </div>
    </div>
  );
}

export default CategoryCard;
