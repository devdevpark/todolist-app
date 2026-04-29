import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

const COLOR_PALETTE = [
  '#3B82F6',
  '#22C55E',
  '#EAB308',
  '#F97316',
  '#EF4444',
  '#8B5CF6',
  '#EC4899',
  '#06B6D4',
];

function CategoryForm({ initialValues, onSubmit, onCancel, isSubmitting, error }) {
  const { t } = useTranslation();
  const [name, setName] = useState(initialValues?.name ?? '');
  const [colorCode, setColorCode] = useState(initialValues?.colorCode ?? COLOR_PALETTE[0]);

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ name, colorCode });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label={t('category.name')}
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={t('category.namePlaceholder')}
        disabled={isSubmitting}
      />

      <div>
        <label className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">{t('category.color')}</label>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {COLOR_PALETTE.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setColorCode(color)}
              style={{ backgroundColor: color }}
              className={
                colorCode === color
                  ? 'w-7 h-7 rounded-full ring-2 ring-offset-2 ring-gray-500 dark:ring-offset-gray-800'
                  : 'w-7 h-7 rounded-full'
              }
              aria-label={`${t('category.color')} ${t('common.add')}: ${color}`}
              disabled={isSubmitting}
            />
          ))}
        </div>
        <Input
          name="colorCode"
          value={colorCode}
          onChange={(e) => setColorCode(e.target.value)}
          placeholder="#000000"
          disabled={isSubmitting}
        />
      </div>

      <div className="flex items-center gap-2">
        <span
          style={{ backgroundColor: colorCode }}
          className="w-3 h-3 rounded-full inline-block flex-shrink-0"
          aria-hidden="true"
        />
        <span className="text-sm text-gray-700 dark:text-gray-300">{name || t('category.preview')}</span>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          {t('common.cancel')}
        </Button>
        <Button type="submit" variant="primary" isLoading={isSubmitting} disabled={isSubmitting}>
          {t('common.save')}
        </Button>
      </div>
    </form>
  );
}

export default CategoryForm;
