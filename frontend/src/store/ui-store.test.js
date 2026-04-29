import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore } from './ui-store';

const initialState = {
  confirmDialog: {
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
  },
};

beforeEach(() => {
  useUIStore.setState(initialState);
});

describe('useUIStore', () => {
  describe('초기 상태', () => {
    it('confirmDialog의 초기값이 올바르게 설정된다', () => {
      const { confirmDialog } = useUIStore.getState();
      expect(confirmDialog.isOpen).toBe(false);
      expect(confirmDialog.title).toBe('');
      expect(confirmDialog.message).toBe('');
      expect(confirmDialog.onConfirm).toBeNull();
    });
  });

  describe('openConfirmDialog', () => {
    it('isOpen을 true로 설정하고 title, message, onConfirm을 저장한다', () => {
      const onConfirm = vi.fn();
      useUIStore.getState().openConfirmDialog({
        title: '삭제 확인',
        message: '정말 삭제하시겠습니까?',
        onConfirm,
      });

      const { confirmDialog } = useUIStore.getState();
      expect(confirmDialog.isOpen).toBe(true);
      expect(confirmDialog.title).toBe('삭제 확인');
      expect(confirmDialog.message).toBe('정말 삭제하시겠습니까?');
      expect(confirmDialog.onConfirm).toBe(onConfirm);
    });

    it('onConfirm 없이 호출해도 상태가 설정된다', () => {
      useUIStore.getState().openConfirmDialog({
        title: '확인',
        message: '계속하시겠습니까?',
        onConfirm: null,
      });

      const { confirmDialog } = useUIStore.getState();
      expect(confirmDialog.isOpen).toBe(true);
      expect(confirmDialog.onConfirm).toBeNull();
    });
  });

  describe('closeConfirmDialog', () => {
    it('isOpen을 false로 설정하고 모든 필드를 초기화한다', () => {
      const onConfirm = vi.fn();
      useUIStore.getState().openConfirmDialog({
        title: '삭제 확인',
        message: '정말 삭제하시겠습니까?',
        onConfirm,
      });

      useUIStore.getState().closeConfirmDialog();

      const { confirmDialog } = useUIStore.getState();
      expect(confirmDialog.isOpen).toBe(false);
      expect(confirmDialog.title).toBe('');
      expect(confirmDialog.message).toBe('');
      expect(confirmDialog.onConfirm).toBeNull();
    });

    it('이미 닫힌 상태에서 호출해도 초기 상태를 유지한다', () => {
      useUIStore.getState().closeConfirmDialog();

      const { confirmDialog } = useUIStore.getState();
      expect(confirmDialog.isOpen).toBe(false);
      expect(confirmDialog.title).toBe('');
      expect(confirmDialog.message).toBe('');
      expect(confirmDialog.onConfirm).toBeNull();
    });
  });
});
