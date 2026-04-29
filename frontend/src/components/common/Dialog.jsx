import { useEffect, useRef } from 'react';
import Button from './Button';

function Dialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  confirmText = '확인',
  cancelText = '취소',
  isDanger = false,
}) {
  const dialogRef = useRef(null);
  const confirmButtonRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      confirmButtonRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        className="relative z-10 w-full max-w-md mx-4 bg-white rounded-xl shadow-lg p-6 dark:bg-gray-800"
      >
        <h2 id="dialog-title" className="text-lg font-semibold text-gray-900 mb-4 dark:text-gray-100">
          {title}
        </h2>
        <div className="text-sm text-gray-600 mb-6 dark:text-gray-300">{children}</div>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            {cancelText}
          </Button>
          <Button
            ref={confirmButtonRef}
            variant={isDanger ? 'danger' : 'primary'}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Dialog;
