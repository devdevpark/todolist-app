import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTodo, useCreateTodo, useUpdateTodo } from '@/hooks/useTodos';
import { useCategories } from '@/hooks/useCategories';
import TodoForm from '@/components/TodoForm';
import { Spinner } from '@/components/common';

export default function TodoFormPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const { data: todo, isLoading: isTodoLoading } = useTodo(id);
  const { data: categories, isLoading: isCategoriesLoading } = useCategories();
  
  const createTodoMutation = useCreateTodo();
  const updateTodoMutation = useUpdateTodo();

  const handleSubmit = (data) => {
    if (isEditMode) {
      updateTodoMutation.mutate(
        { id, ...data },
        {
          onSuccess: () => navigate('/todos'),
        }
      );
    } else {
      createTodoMutation.mutate(data, {
        onSuccess: () => navigate('/todos'),
      });
    }
  };

  const handleCancel = () => {
    navigate('/todos');
  };

  if (isTodoLoading || isCategoriesLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {isEditMode ? t('todo.update') : t('todo.new')}
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {isEditMode ? t('todo.updateDesc') : t('todo.newDesc')}
        </p>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <TodoForm
          initialData={todo}
          categories={categories}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={createTodoMutation.isPending || updateTodoMutation.isPending}
        />
      </div>
    </div>
  );
}
