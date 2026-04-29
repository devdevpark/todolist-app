import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Badge from './Badge';

describe('Badge Component', () => {
  describe('Rendering', () => {
    it('renders with children', () => {
      render(<Badge>Label</Badge>);
      expect(document.querySelector('span')).toBeInTheDocument();
    });

    it('renders pending variant', () => {
      render(<Badge variant="pending">대기중</Badge>);
      const badge = document.querySelector('span');
      expect(badge.textContent).toContain('대기중');
    });

    it('renders completed variant', () => {
      render(<Badge variant="completed">완료</Badge>);
      const badge = document.querySelector('span');
      expect(badge.textContent).toContain('완료');
    });

    it('renders overdue variant', () => {
      render(<Badge variant="overdue">기한초과</Badge>);
      const badge = document.querySelector('span');
      expect(badge.textContent).toContain('기한초과');
    });
  });

  describe('Styles', () => {
    it('applies pending styles correctly', () => {
      render(<Badge variant="pending">Test</Badge>);
      const badge = document.querySelector('span');
      expect(badge.className).toContain('bg-gray-100');
      expect(badge.className).toContain('text-gray-600');
    });

    it('applies completed styles correctly', () => {
      render(<Badge variant="completed">Test</Badge>);
      const badge = document.querySelector('span');
      expect(badge.className).toContain('bg-emerald-50');
      expect(badge.className).toContain('text-emerald-600');
    });

    it('applies overdue styles correctly', () => {
      render(<Badge variant="overdue">Test</Badge>);
      const badge = document.querySelector('span');
      expect(badge.className).toContain('bg-red-50');
      expect(badge.className).toContain('text-red-600');
    });

    it('applies custom color correctly', () => {
      render(<Badge variant="custom" color="#3B82F6">Custom</Badge>);
      const badge = document.querySelector('span');
      expect(badge.style.backgroundColor).toContain('59');
    });
  });

  describe('Size', () => {
    it('renders small size', () => {
      render(<Badge size="sm">Test</Badge>);
      const badge = document.querySelector('span');
      expect(badge.className).toContain('px-2');
      expect(badge.className).toContain('text-xs');
    });

    it('renders medium size by default', () => {
      render(<Badge>Test</Badge>);
      const badge = document.querySelector('span');
      expect(badge.className).toContain('px-2.5');
      expect(badge.className).toContain('text-sm');
    });

    it('renders medium size explicitly', () => {
      render(<Badge size="md">Test</Badge>);
      const badge = document.querySelector('span');
      expect(badge.className).toContain('px-2.5');
      expect(badge.className).toContain('text-sm');
    });
  });

  describe('Custom variant with color', () => {
    it('renders with custom color and children', () => {
      render(
        <Badge variant="custom" color="#22C55E">
          업무
        </Badge>
      );
      expect(document.querySelector('span')).toBeInTheDocument();
    });
  });
});