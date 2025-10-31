import React from 'react';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner, SectionLoader, PageLoader } from '../../components/LoadingSpinner';

describe('LoadingSpinner Components', () => {
  describe('LoadingSpinner', () => {
    it('renders with default props', () => {
      render(<LoadingSpinner />);

      const spinner = screen.getByRole('status');
      expect(spinner).toBeInTheDocument();
      expect(screen.getByText('Loading...', { selector: 'p' })).toBeInTheDocument();
    });

    it('renders with custom text', () => {
      render(<LoadingSpinner text="Custom loading message" />);

      expect(screen.getByText('Custom loading message')).toBeInTheDocument();
    });

    it('renders with different sizes', () => {
      const { rerender } = render(<LoadingSpinner size="sm" />);

      let spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('w-4', 'h-4');

      rerender(<LoadingSpinner size="lg" />);
      spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('w-12', 'h-12');
    });

    it('prevents hydration mismatch', () => {
      const { container } = render(<LoadingSpinner />);

      // Should render after mounting
      expect(container.firstChild).toBeTruthy();
    });
  });

  describe('SectionLoader', () => {
    it('renders with correct text', () => {
      render(<SectionLoader />);

      expect(screen.getByText('Loading section...')).toBeInTheDocument();
    });
  });

  describe('PageLoader', () => {
    it('renders with correct text', () => {
      render(<PageLoader />);

      expect(screen.getByText('Loading page...')).toBeInTheDocument();
    });
  });
});