import Button from '@/components/common/Button';

function EmptyState({ message, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="text-5xl mb-4" aria-hidden="true">📝</span>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{message}</p>
      {actionLabel && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
