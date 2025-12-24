import { cn } from "./utils";
import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  spacing?: 'compact' | 'normal' | 'relaxed' | 'spacious';
  background?: 'white' | 'gray' | 'blue' | 'gradient' | 'dark';
  containerSize?: 'narrow' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  noPadding?: boolean;
  id?: string;
}

/**
 * Section component enforcing Figma vertical rhythm and background variants
 * 
 * Spacing (vertical padding):
 * - compact: 48px (py-12)
 * - normal: 64px (py-16) - default
 * - relaxed: 80px (py-20)
 * - spacious: 96px (py-24)
 * 
 * Background variants:
 * - white: Pure white background
 * - gray: Light gray (#f8f9fa)
 * - blue: Light blue tint (#f0f7ff)
 * - gradient: Gradient from white to gray
 * - dark: Dark gradient (for hero sections)
 */
export function Section({ 
  children, 
  className,
  spacing = 'normal',
  background = 'white',
  containerSize,
  noPadding = false,
  id
}: SectionProps) {
  const spacingClasses = {
    compact: 'py-12 md:py-12',
    normal: 'py-16 md:py-16',
    relaxed: 'py-20 md:py-20',
    spacious: 'py-24 md:py-28',
  };

  const backgroundClasses = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    blue: 'bg-[#f0f7ff]',
    gradient: 'bg-gradient-to-b from-white via-gray-50 to-white',
    dark: 'bg-gradient-to-br from-gray-900 to-gray-800',
  };

  return (
    <section 
      id={id}
      className={cn(
        'relative overflow-hidden',
        !noPadding && spacingClasses[spacing],
        backgroundClasses[background],
        className
      )}
    >
      {/* Container wrapper if size specified */}
      {containerSize ? (
        <div className={cn(
          'mx-auto w-full px-4 sm:px-6 lg:px-8',
          containerSize === 'narrow' && 'max-w-narrow',
          containerSize === 'sm' && 'max-w-sm',
          containerSize === 'md' && 'max-w-md',
          containerSize === 'lg' && 'max-w-lg',
          containerSize === 'xl' && 'max-w-xl',
          containerSize === 'full' && 'max-w-full'
        )}>
          {children}
        </div>
      ) : (
        children
      )}
    </section>
  );
}

/**
 * SectionHeader component for consistent section titles
 */
interface SectionHeaderProps {
  badge?: string;
  badgeIcon?: ReactNode;
  badgeVariant?: 'primary' | 'success' | 'warning' | 'error';
  title: string | ReactNode;
  subtitle?: string;
  description?: string;
  className?: string;
  align?: 'left' | 'center';
}

export function SectionHeader({
  badge,
  badgeIcon,
  badgeVariant = 'primary',
  title,
  subtitle,
  description,
  className,
  align = 'center'
}: SectionHeaderProps) {
  const badgeColors = {
    primary: 'bg-blue-50 border-blue-200 text-blue-700',
    success: 'bg-green-50 border-green-200 text-green-700',
    warning: 'bg-orange-50 border-orange-200 text-orange-700',
    error: 'bg-red-50 border-red-100 text-red-600',
  };

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
  };

  return (
    <div className={cn(
      'mb-12 md:mb-16',
      alignClasses[align],
      align === 'center' && 'mx-auto max-w-3xl',
      className
    )}>
      {/* Badge */}
      {badge && (
        <div className={cn(
          'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm mb-6 border',
          badgeColors[badgeVariant]
        )}>
          {badgeIcon}
          <span>{badge}</span>
        </div>
      )}

      {/* Title */}
      {typeof title === 'string' ? (
        <h2 className="text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-6 tracking-tight leading-tight">
          {title}
        </h2>
      ) : (
        title
      )}

      {/* Subtitle (colored accent) */}
      {subtitle && (
        <div className="text-4xl md:text-5xl lg:text-6xl text-brand-primary mb-6 tracking-tight">
          {subtitle}
        </div>
      )}

      {/* Description */}
      {description && (
        <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
