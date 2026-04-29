import { forwardRef } from 'react';

const Input = forwardRef(function Input(
  {
    type = 'text',
    placeholder = '',
    value,
    onChange,
    label,
    error,
    disabled = false,
    name,
    id,
    className = '',
    ...props
  },
  ref
) {
  const inputId = id || name || `input-${Math.random().toString(36).substr(2, 9)}`;

  const baseClasses = 'w-full px-3 py-2 text-sm border rounded-lg transition-colors duration-150 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500';
  const stateClasses = error
    ? 'border-error focus:border-error focus:ring-1 focus:ring-error'
    : 'border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600 dark:focus:border-primary';
  const disabledClasses = disabled ? 'bg-gray-100 cursor-not-allowed dark:bg-gray-700' : 'bg-white dark:bg-gray-800';

  const classes = [baseClasses, stateClasses, disabledClasses, className].join(' ');

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={classes}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-sm text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;
