import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Input } from '@/components/common';

export default function TodoForm({ initialData, categories, onSubmit, onCancel, isLoading }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    dueDate: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        categoryId: initialData.categoryId || '',
        dueDate: initialData.dueDate ? initialData.dueDate.slice(0, 16) : '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = t('todo.titleRequired') || '제목을 입력해주세요.';
    } else if (formData.title.length > 200) {
      newErrors.title = t('todo.titleTooLong') || '제목은 200자 이내로 입력해주세요.';
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = t('todo.descTooLong') || '설명은 1000자 이내로 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...formData,
        categoryId: formData.categoryId || null,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label={t('common.title')}
        name="title"
        value={formData.title}
        onChange={handleChange}
        error={errors.title}
        placeholder={t('todo.titlePlaceholder')}
        autoFocus
      />

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('common.description')} ({t('common.optional')})
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder={t('todo.descPlaceholder')}
        />
        {errors.description && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('common.category')} ({t('common.optional')})
          </label>
          <select
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
          >
            <option value="">{t('category.noCategory')}</option>
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <Input
          label={`${t('common.dueDate')} (${t('common.optional')})`}
          type="datetime-local"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          {t('common.cancel')}
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {t('common.save')}
        </Button>
      </div>
    </form>
  );
}
