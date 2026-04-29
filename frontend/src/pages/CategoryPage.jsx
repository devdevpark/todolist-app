import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '@/hooks/useCategories';
import { useUIStore } from '@/store/ui-store';
import CategoryCard from '@/components/CategoryCard';
import CategoryForm from '@/components/CategoryForm';
import EmptyState from '@/components/EmptyState';
import Spinner from '@/components/common/Spinner';
import Button from '@/components/common/Button';

function CategoryPage() {
  const { t } = useTranslation();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formError, setFormError] = useState(null);

  const { data: categories, isPending } = useCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();
  const openConfirmDialog = useUIStore((state) => state.openConfirmDialog);

  function resetForm() {
    setShowAddForm(false);
    setEditingCategory(null);
    setFormError(null);
  }

  function handleAddClick() {
    setEditingCategory(null);
    setFormError(null);
    setShowAddForm((prev) => !prev);
  }

  function handleEditClick(category) {
    setShowAddForm(false);
    setFormError(null);
    setEditingCategory(category);
  }

  function handleDeleteClick(category) {
    openConfirmDialog({
      title: t('common.delete'),
      message: t('category.deleteConfirm'),
      onConfirm: () => deleteMutation.mutate(category.id),
    });
  }

  function handleCreateSubmit({ name, colorCode }) {
    createMutation.mutate(
      { name, colorCode },
      {
        onSuccess: resetForm,
        onError: (err) => setFormError(err.message),
      }
    );
  }

  function handleUpdateSubmit({ name, colorCode }) {
    updateMutation.mutate(
      { id: editingCategory.id, name, colorCode },
      {
        onSuccess: resetForm,
        onError: (err) => setFormError(err.message),
      }
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t('category.list')}</h1>
        <Button variant="primary" size="sm" onClick={handleAddClick}>
          {t('common.add')}
        </Button>
      </div>

      {showAddForm && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">{t('category.new')}</h2>
          <CategoryForm
            onSubmit={handleCreateSubmit}
            onCancel={resetForm}
            isSubmitting={createMutation.isPending}
            error={formError}
          />
        </div>
      )}

      {isPending ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : !categories || categories.length === 0 ? (
        <EmptyState
          message={t('category.none')}
          actionLabel={t('common.add')}
          onAction={handleAddClick}
        />
      ) : (
        <ul className="flex flex-col gap-2">
          {categories.map((category) => (
            <li key={category.id}>
              {editingCategory?.id === category.id ? (
                <div className="p-4 border border-primary rounded-lg bg-blue-50 dark:bg-blue-900/20 dark:border-primary">
                  <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">{t('category.update')}</h2>
                  <CategoryForm
                    initialValues={editingCategory}
                    onSubmit={handleUpdateSubmit}
                    onCancel={resetForm}
                    isSubmitting={updateMutation.isPending}
                    error={formError}
                  />
                </div>
              ) : (
                <CategoryCard
                  category={category}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CategoryPage;
