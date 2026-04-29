import { useTranslation } from 'react-i18next';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';

function TodoCard({ todo, onComplete, onUncomplete, onEdit, onDelete }) {
  const { t } = useTranslation();
  const { title, description, category, status, dueDate } = todo;

  function getStatusBadge() {
    switch (status) {
      case 'COMPLETED':
        return <Badge variant="completed">{t('todo.filter.completed')}</Badge>;
      case 'OVERDUE':
        return <Badge variant="overdue">{t('todo.filter.overdue')}</Badge>;
      default:
        return <Badge variant="pending">{t('todo.filter.pending')}</Badge>;
    }
  }

  const containerClass = () => {
    if (status === 'OVERDUE') return 'border-2 border-red-400 bg-red-50 dark:border-red-700 dark:bg-red-900/20';
    if (status === 'COMPLETED') return 'border border-gray-200 bg-gray-50 opacity-75 dark:border-gray-700 dark:bg-gray-800/60';
    return 'border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800';
  };

  return (
    <div className={`p-4 rounded-xl shadow-sm transition-all ${containerClass()}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            {getStatusBadge()}
            {category && (
              <span 
                className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border"
                style={{ 
                  backgroundColor: `${category.colorCode}10`,
                  color: category.colorCode,
                  borderColor: `${category.colorCode}30`
                }}
              >
                {category.name}
              </span>
            )}
            <span className={`text-sm font-medium text-gray-800 dark:text-gray-200 ${status === 'COMPLETED' ? 'line-through text-gray-500 dark:text-gray-500' : ''}`}>
              {title}
            </span>
          </div>
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{description}</p>
          )}
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 flex-wrap mt-2">
            {dueDate && (
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(dueDate).toLocaleString()}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {status === 'COMPLETED' ? (
            <Button variant="ghost" size="xs" onClick={() => onUncomplete(todo)} title={t('common.uncomplete')}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            </Button>
          ) : (
            <Button variant="ghost" size="xs" onClick={() => onComplete(todo)} title={t('common.complete')}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </Button>
          )}
          <Button variant="ghost" size="xs" onClick={() => onEdit(todo)} title={t('common.edit')}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </Button>
          <Button variant="ghost" size="xs" onClick={() => onDelete(todo)} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" title={t('common.delete')}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TodoCard;
