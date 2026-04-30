import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-gray-950 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-10 text-center">
        <p className="text-7xl font-bold text-primary mb-4">404</p>
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {t('notFound.title')}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          {t('notFound.description')}
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
        >
          {t('notFound.goHome')}
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
