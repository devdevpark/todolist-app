import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from './Input';

describe('Input Component', () => {
  describe('Rendering', () => {
    it('renders input element', () => {
      render(<Input />);
      expect(document.querySelector('input')).toBeInTheDocument();
    });

    it('renders with placeholder', () => {
      render(<Input placeholder="Enter text" />);
      expect(document.querySelector('input[placeholder="Enter text"]')).toBeInTheDocument();
    });

    it('renders label when provided', () => {
      render(<Input label="Username" />);
      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    });

    it('renders with correct type', () => {
      render(<Input type="password" />);
      expect(document.querySelector('input[type="password"]')).toBeInTheDocument();
    });

    it('renders email type correctly', () => {
      render(<Input type="email" />);
      expect(document.querySelector('input[type="email"]')).toBeInTheDocument();
    });

    it('renders number type correctly', () => {
      render(<Input type="number" />);
      expect(document.querySelector('input[type="number"]')).toBeInTheDocument();
    });

    it('renders date type correctly', () => {
      render(<Input type="date" />);
      expect(document.querySelector('input[type="date"]')).toBeInTheDocument();
    });
  });

  describe('Value handling', () => {
    it('renders with value', () => {
      render(<Input value="test value" onChange={() => {}} />);
      expect(document.querySelector('input').value).toBe('test value');
    });

    it('calls onChange when value changes', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<Input onChange={handleChange} />);
      await user.type(document.querySelector('input'), 'new value');

      expect(handleChange).toHaveBeenCalled();
    });
  });

  describe('Error states', () => {
    it('renders error message when provided', () => {
      render(<Input error="This field is required" />);
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('applies error styling when error is present', () => {
      render(<Input error="Error message" />);
      const input = document.querySelector('input');
      expect(input.className).toContain('border-error');
    });

    it('sets aria-invalid when error is present', () => {
      render(<Input error="Error message" />);
      expect(document.querySelector('input').getAttribute('aria-invalid')).toBe('true');
    });
  });

  describe('Disabled states', () => {
    it('renders disabled input', () => {
      render(<Input disabled />);
      expect(document.querySelector('input')).toBeDisabled();
    });

    it('applies disabled styling', () => {
      render(<Input disabled />);
      const input = document.querySelector('input');
      expect(input.className).toContain('bg-gray-100');
    });
  });

  describe('Accessibility', () => {
    it('associates label with input', () => {
      render(<Input label="Email Address" />);
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    });

    it('associates error message with input', () => {
      render(<Input label="Username" error="Required" />);
      const input = document.querySelector('input');
      expect(input.getAttribute('aria-describedby')).toBeDefined();
    });
  });

  describe('Props', () => {
    it('accepts custom id', () => {
      render(<Input id="custom-id" label="Test" />);
      expect(document.querySelector('input#custom-id')).toBeInTheDocument();
    });

    it('accepts custom name', () => {
      render(<Input name="custom-name" />);
      expect(document.querySelector('input[name="custom-name"]')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<Input className="custom-class" />);
      expect(document.querySelector('input').className).toContain('custom-class');
    });
  });
});