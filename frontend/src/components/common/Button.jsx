import { forwardRef } from 'react';
import Spinner from './Spinner';

const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    disabled = false,
    isLoading = false,
    type = 'button',
    onClick,
    children,
    className = '',
    ...props
  },
  ref
) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-dark focus-visible:ring-primary',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus-visible:ring-gray-500 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600',
    danger: 'bg-error text-white hover:bg-red-600 focus-visible:ring-error',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 focus-visible:ring-gray-500 dark:text-gray-300 dark:hover:bg-gray-700',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm h-8',
    md: 'px-4 py-2 text-sm h-10',
    lg: 'px-6 py-3 text-base h-12',
  };

  const disabledClasses = disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    disabledClasses,
    className,
  ].join(' ');

  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading && <Spinner size="sm" className="mr-2" />}
      {children}
    </button>
  );
});

export default Button;
