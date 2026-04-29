import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Button Component', () => {
  describe('Rendering', () => {
    it('renders button with children', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    it('renders with correct default variant', () => {
      render(<Button>Test</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('bg-primary');
    });

    it('renders secondary variant correctly', () => {
      render(<Button variant="secondary">Test</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('bg-gray-100');
    });

    it('renders danger variant correctly', () => {
      render(<Button variant="danger">Test</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('bg-error');
    });

    it('renders ghost variant correctly', () => {
      render(<Button variant="ghost">Test</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('bg-transparent');
    });

    it('renders small size correctly', () => {
      render(<Button size="sm">Test</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('h-8');
    });

    it('renders medium size correctly', () => {
      render(<Button size="md">Test</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('h-10');
    });

    it('renders large size correctly', () => {
      render(<Button size="lg">Test</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('h-12');
    });
  });

  describe('Behavior', () => {
    it('calls onClick when clicked', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<Button onClick={handleClick}>Click me</Button>);
      await user.click(screen.getByRole('button'));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<Button disabled onClick={handleClick}>Click me</Button>);
      await user.click(screen.getByRole('button'));

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('does not call onClick when loading', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<Button isLoading onClick={handleClick}>Click me</Button>);
      await user.click(screen.getByRole('button'));

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('States', () => {
    it('applies disabled styles when disabled', () => {
      render(<Button disabled>Test</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('opacity-50');
      expect(button.className).toContain('cursor-not-allowed');
    });

    it('applies loading styles when loading', () => {
      render(<Button isLoading>Test</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('opacity-50');
      expect(button).toBeDisabled();
    });

    it('renders spinner svg when loading', () => {
      render(<Button isLoading>Test</Button>);
      expect(document.querySelector('svg.animate-spin')).toBeInTheDocument();
    });
  });

  describe('Props', () => {
    it('applies custom className', () => {
      render(<Button className="custom-class">Test</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('custom-class');
    });

    it('renders submit type correctly', () => {
      render(<Button type="submit">Test</Button>);
      expect(screen.getByRole('button').getAttribute('type')).toBe('submit');
    });

    it('renders reset type correctly', () => {
      render(<Button type="reset">Test</Button>);
      expect(screen.getByRole('button').getAttribute('type')).toBe('reset');
    });

    it('renders button type by default', () => {
      render(<Button>Test</Button>);
      expect(screen.getByRole('button').getAttribute('type')).toBe('button');
    });
  });
});