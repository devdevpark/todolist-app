import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dialog from './Dialog';

describe('Dialog Component', () => {
  describe('Rendering', () => {
    it('does not render when isOpen is false', () => {
      render(<Dialog isOpen={false} title="Test Dialog">Content</Dialog>);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('renders when isOpen is true', () => {
      render(<Dialog isOpen={true} title="Test Dialog">Content</Dialog>);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('renders title correctly', () => {
      render(<Dialog isOpen={true} title="Confirm Delete">Content</Dialog>);
      expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
    });

    it('renders children correctly', () => {
      render(
        <Dialog isOpen={true} title="Test">
          <p>Dialog content here</p>
        </Dialog>
      );
      expect(screen.getByText('Dialog content here')).toBeInTheDocument();
    });

    it('renders confirm button with custom text', () => {
      render(
        <Dialog isOpen={true} title="Test" confirmText="Delete">
          Content
        </Dialog>
      );
      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    });

    it('renders cancel button with custom text', () => {
      render(
        <Dialog isOpen={true} title="Test" cancelText="Go Back">
          Content
        </Dialog>
      );
      expect(screen.getByRole('button', { name: /go back/i })).toBeInTheDocument();
    });

    it('renders default confirm and cancel buttons', () => {
      render(<Dialog isOpen={true} title="Test">Content</Dialog>);
      expect(screen.getByRole('button', { name: /확인/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /취소/i })).toBeInTheDocument();
    });
  });

  describe('Behavior', () => {
    it('calls onConfirm when confirm button is clicked', async () => {
      const handleConfirm = vi.fn();
      const user = userEvent.setup();

      render(
        <Dialog isOpen={true} title="Test" onConfirm={handleConfirm}>
          Content
        </Dialog>
      );

      await user.click(screen.getByRole('button', { name: /확인/i }));
      expect(handleConfirm).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when cancel button is clicked', async () => {
      const handleClose = vi.fn();
      const user = userEvent.setup();

      render(
        <Dialog isOpen={true} title="Test" onClose={handleClose}>
          Content
        </Dialog>
      );

      await user.click(screen.getByRole('button', { name: /취소/i }));
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Styles', () => {
    it('applies danger variant to confirm button', () => {
      render(
        <Dialog isOpen={true} title="Test" isDanger={true} confirmText="Delete">
          Content
        </Dialog>
      );
      const confirmButton = screen.getByRole('button', { name: /delete/i });
      expect(confirmButton.className).toContain('bg-error');
    });
  });
});