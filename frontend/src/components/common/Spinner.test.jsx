import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Spinner from './Spinner';

describe('Spinner Component', () => {
  describe('Rendering', () => {
    it('renders spinner element', () => {
      const { container } = render(<Spinner />);
      expect(container.querySelector('svg.animate-spin')).toBeInTheDocument();
    });

    it('renders with default size classes', () => {
      const { container } = render(<Spinner />);
      const svg = container.querySelector('svg');
      expect(svg.classList.contains('w-6')).toBe(true);
    });

    it('renders small size explicitly', () => {
      const { container } = render(<Spinner size="sm" />);
      const svg = container.querySelector('svg');
      expect(svg.classList.contains('w-4')).toBe(true);
      expect(svg.classList.contains('h-4')).toBe(true);
    });

    it('renders medium size', () => {
      const { container } = render(<Spinner size="md" />);
      const svg = container.querySelector('svg');
      expect(svg.classList.contains('w-6')).toBe(true);
      expect(svg.classList.contains('h-6')).toBe(true);
    });

    it('renders large size', () => {
      const { container } = render(<Spinner size="lg" />);
      const svg = container.querySelector('svg');
      expect(svg.classList.contains('w-8')).toBe(true);
      expect(svg.classList.contains('h-8')).toBe(true);
    });

    it('has animate-spin class', () => {
      const { container } = render(<Spinner />);
      const svg = container.querySelector('svg');
      expect(svg.classList.contains('animate-spin')).toBe(true);
    });

    it('is hidden from accessibility', () => {
      const { container } = render(<Spinner />);
      const svg = container.querySelector('svg');
      expect(svg.getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('Props', () => {
    it('applies custom className', () => {
      const { container } = render(<Spinner className="custom-class" />);
      const svg = container.querySelector('svg');
      expect(svg.classList.contains('custom-class')).toBe(true);
    });
  });
});