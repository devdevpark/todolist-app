import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '@/components/Header';
import Dialog from '@/components/common/Dialog';
import { useUIStore } from '@/store/ui-store';

function Layout() {
  const { t } = useTranslation();
  const confirmDialog = useUIStore((state) => state.confirmDialog);
  const closeConfirmDialog = useUIStore((state) => state.closeConfirmDialog);

  function handleConfirm() {
    confirmDialog.onConfirm?.();
    closeConfirmDialog();
  }

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-6 sm:px-6 dark:bg-gray-900 min-h-screen">
        <Outlet />
      </main>
      <Dialog
        isOpen={confirmDialog.isOpen}
        onClose={closeConfirmDialog}
        onConfirm={handleConfirm}
        title={confirmDialog.title}
        confirmText={confirmDialog.confirmText || t('common.confirm') || '확인'}
        cancelText={confirmDialog.cancelText || t('common.cancel') || '취소'}
        isDanger
      >
        {confirmDialog.message}
      </Dialog>
    </>
  );
}

export default Layout;
