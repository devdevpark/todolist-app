function Badge({ variant = 'pending', color, children, size = 'md' }) {
  const variantStyles = {
    pending: 'bg-gray-100 text-gray-600 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600',
    completed: 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
    overdue: 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  if (variant === 'custom' && color) {
    return (
      <span
        className={`inline-flex items-center rounded-full border ${sizeClasses[size]}`}
        style={{
          backgroundColor: `${color}20`,
          color: color,
          borderColor: `${color}40`,
        }}
      >
        {children}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border ${variantStyles[variant] ?? variantStyles.pending} ${sizeClasses[size]}`}
    >
      {variant === 'pending' && '● '}
      {variant === 'completed' && '✓ '}
      {variant === 'overdue' && '! '}
      {children}
    </span>
  );
}

export default Badge;
