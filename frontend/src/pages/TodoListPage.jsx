import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTodos, useDeleteTodo, useCompleteTodo, useUncompleteTodo } from '@/hooks/useTodos';
import { useCategories } from '@/hooks/useCategories';
import { useUIStore } from '@/store/ui-store';
import TodoCard from '@/components/TodoCard';
import TodoFilter from '@/components/TodoFilter';
import EmptyState from '@/components/EmptyState';
import Spinner from '@/components/common/Spinner';
import Button from '@/components/common/Button';

function TodoListPage() {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({ categoryId: undefined, status: undefined });
  const navigate = useNavigate();

  const { data: todos, isPending } = useTodos(filters);
  const { data: categories } = useCategories();
  const deleteMutation = useDeleteTodo();
  const completeMutation = useCompleteTodo();
  const uncompleteMutation = useUncompleteTodo();
  const openConfirmDialog = useUIStore((state) => state.openConfirmDialog);

  function handleComplete(todo) {
    completeMutation.mutate(todo.id);
  }

  function handleUncomplete(todo) {
    uncompleteMutation.mutate(todo.id);
  }

  function handleEdit(todo) {
    navigate(`/todos/${todo.id}/edit`);
  }

  function handleDelete(todo) {
    openConfirmDialog({
      title: t('todo.delete'),
      message: t('todo.deleteConfirm'),
      onConfirm: () => deleteMutation.mutate(todo.id),
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t('todo.list')}</h1>
        <Button variant="primary" size="sm" onClick={() => navigate('/todos/new')}>
          {t('todo.new')}
        </Button>
      </div>

      <div className="mb-4">
        <TodoFilter
          categories={categories}
          filters={filters}
          onFilterChange={setFilters}
        />
      </div>

      {isPending ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : !todos || todos.length === 0 ? (
        <EmptyState
          message={t('todo.none')}
          actionLabel={t('todo.new')}
          onAction={() => navigate('/todos/new')}
        />
      ) : (
        <ul className="flex flex-col gap-2">
          {todos.map((todo) => (
            <li key={todo.id}>
              <TodoCard
                todo={todo}
                onComplete={handleComplete}
                onUncomplete={handleUncomplete}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TodoListPage;
