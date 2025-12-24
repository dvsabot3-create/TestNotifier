import { cn } from "./utils";
import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: 'narrow' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  noPadding?: boolean;
}

/**
 * Container component enforcing Figma max-widths and consistent padding
 * 
 * Sizes:
 * - narrow: 640px (forms, single column)
 * - sm: 896px (FAQ, narrow content)
 * - md: 1024px (content sections)
 * - lg: 1152px (pricing, testimonials)
 * - xl: 1280px (most sections - default)
 * - full: 100% (no max-width)
 */
export function Container({ 
  children, 
  className,
  size = 'xl',
  noPadding = false 
}: ContainerProps) {
  const maxWidthClasses = {
    narrow: 'max-w-narrow',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full',
  };

  return (
    <div 
      className={cn(
        'mx-auto w-full',
        maxWidthClasses[size],
        !noPadding && 'px-4 sm:px-6 lg:px-8',
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * Grid Container - for consistent grid layouts
 */
interface GridContainerProps {
  children: ReactNode;
  className?: string;
  cols?: 1 | 2 | 3 | 4;
  gap?: 'tight' | 'normal' | 'relaxed' | 'loose';
}

export function GridContainer({ 
  children, 
  className,
  cols = 3,
  gap = 'normal'
}: GridContainerProps) {
  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  const gapClasses = {
    tight: 'gap-4',
    normal: 'gap-6',
    relaxed: 'gap-8',
    loose: 'gap-12',
  };

  return (
    <div 
      className={cn(
        'grid',
        colClasses[cols],
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  );
}
