import { cn } from "./utils";
import { ReactNode } from "react";

/**
 * Typography components enforcing Figma type scale, tracking, and weights
 */

// ========== HEADINGS ==========

interface HeadingProps {
  children: ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  gradient?: boolean;
}

/**
 * H1 - Hero headlines
 * Desktop: 60-72px, Mobile: 48px
 * Weight: 800, Line-height: 1.1, Letter-spacing: -0.02em
 */
export function Heading1({ children, className, as = 'h1', gradient = false }: HeadingProps) {
  const Component = as;
  return (
    <Component className={cn(
      'text-5xl md:text-6xl lg:text-7xl leading-tight tracking-tight',
      gradient && 'bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent',
      className
    )}>
      {children}
    </Component>
  );
}

/**
 * H2 - Section titles
 * Desktop: 48px, Tablet: 36px, Mobile: 30px
 * Weight: 700, Line-height: 1.2
 */
export function Heading2({ children, className, as = 'h2' }: HeadingProps) {
  const Component = as;
  return (
    <Component className={cn(
      'text-4xl md:text-5xl lg:text-6xl tracking-tight',
      className
    )}>
      {children}
    </Component>
  );
}

/**
 * H3 - Card/subsection titles
 * Desktop: 30px, Tablet: 24px, Mobile: 20px
 * Weight: 700, Line-height: 1.3
 */
export function Heading3({ children, className, as = 'h3' }: HeadingProps) {
  const Component = as;
  return (
    <Component className={cn(
      'text-2xl md:text-3xl lg:text-4xl',
      className
    )}>
      {children}
    </Component>
  );
}

/**
 * H4 - Small headings
 * Desktop: 20-24px, Tablet: 18px, Mobile: 16px
 * Weight: 600, Line-height: 1.4
 */
export function Heading4({ children, className, as = 'h4' }: HeadingProps) {
  const Component = as;
  return (
    <Component className={cn(
      'text-lg md:text-xl lg:text-2xl',
      className
    )}>
      {children}
    </Component>
  );
}

/**
 * Subheading - Colored accent text under main heading
 */
export function Subheading({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn(
      'block text-brand-primary',
      className
    )}>
      {children}
    </span>
  );
}

// ========== BODY TEXT ==========

interface TextProps {
  children: ReactNode;
  className?: string;
  as?: 'p' | 'span' | 'div';
  muted?: boolean;
}

/**
 * Lead Text - Intro/lead paragraphs
 * Size: 20px, Line-height: 1.7
 */
export function LeadText({ children, className, as = 'p', muted = false }: TextProps) {
  const Component = as;
  return (
    <Component className={cn(
      'text-lg md:text-xl leading-relaxed',
      muted ? 'text-gray-600' : 'text-gray-900',
      className
    )}>
      {children}
    </Component>
  );
}

/**
 * Body Text - Regular body copy
 * Size: 16px, Line-height: 1.6
 */
export function BodyText({ children, className, as = 'p', muted = false }: TextProps) {
  const Component = as;
  return (
    <Component className={cn(
      'text-base leading-normal',
      muted ? 'text-gray-600' : 'text-gray-900',
      className
    )}>
      {children}
    </Component>
  );
}

/**
 * Small Text - Captions, labels
 * Size: 14px, Line-height: 1.5
 */
export function SmallText({ children, className, as = 'p', muted = false }: TextProps) {
  const Component = as;
  return (
    <Component className={cn(
      'text-sm',
      muted ? 'text-gray-500' : 'text-gray-900',
      className
    )}>
      {children}
    </Component>
  );
}

/**
 * Caption Text - Fine print, metadata
 * Size: 12px, Line-height: 1.4
 */
export function CaptionText({ children, className, as = 'span', muted = true }: TextProps) {
  const Component = as;
  return (
    <Component className={cn(
      'text-xs',
      muted ? 'text-gray-500' : 'text-gray-900',
      className
    )}>
      {children}
    </Component>
  );
}

// ========== SPECIAL TEXT ==========

/**
 * Gradient Text - For emphasis
 */
export function GradientText({ 
  children, 
  className,
  gradient = 'from-brand-primary to-brand-primary-dark'
}: { 
  children: ReactNode; 
  className?: string;
  gradient?: string;
}) {
  return (
    <span className={cn(
      'bg-gradient-to-r bg-clip-text text-transparent',
      gradient,
      className
    )}>
      {children}
    </span>
  );
}

/**
 * Highlighted Text - Background highlight
 */
export function HighlightText({ 
  children, 
  className,
  color = 'yellow'
}: { 
  children: ReactNode; 
  className?: string;
  color?: 'yellow' | 'blue' | 'green';
}) {
  const colors = {
    yellow: 'bg-yellow-100 text-yellow-900',
    blue: 'bg-blue-100 text-blue-900',
    green: 'bg-green-100 text-green-900',
  };

  return (
    <span className={cn(
      'px-1 py-0.5 rounded',
      colors[color],
      className
    )}>
      {children}
    </span>
  );
}

/**
 * Link Text - Styled links
 */
export function LinkText({ 
  children, 
  href,
  className,
  external = false
}: { 
  children: ReactNode; 
  href: string;
  className?: string;
  external?: boolean;
}) {
  return (
    <a 
      href={href}
      className={cn(
        'text-brand-primary hover:text-brand-primary-dark underline-offset-2 hover:underline transition-colors',
        className
      )}
      {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
    >
      {children}
    </a>
  );
}

/**
 * Stat Number - Large numbers for statistics
 */
export function StatNumber({ 
  children, 
  className 
}: { 
  children: ReactNode; 
  className?: string;
}) {
  return (
    <div className={cn(
      'text-4xl md:text-5xl lg:text-6xl text-brand-primary mb-2',
      className
    )}>
      {children}
    </div>
  );
}

/**
 * Stat Label - Label under stat numbers
 */
export function StatLabel({ 
  children, 
  className 
}: { 
  children: ReactNode; 
  className?: string;
}) {
  return (
    <div className={cn(
      'text-sm text-gray-600',
      className
    )}>
      {children}
    </div>
  );
}
