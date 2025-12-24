import { cn } from "./utils";
import { ReactNode } from "react";
import { Check } from "lucide-react";

interface FeaturePillProps {
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  variant?: 'default' | 'success' | 'primary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * FeaturePill - Small rounded pills used under headings and in feature lists
 * Matches Figma design with checkmarks and colored backgrounds
 */
export function FeaturePill({ 
  children, 
  className,
  icon,
  variant = 'default',
  size = 'md'
}: FeaturePillProps) {
  const variants = {
    default: 'bg-gray-100 text-gray-700 border-gray-200',
    success: 'bg-green-50 text-green-700 border-green-200',
    primary: 'bg-blue-50 text-blue-700 border-blue-200',
    outline: 'bg-transparent text-gray-700 border-gray-300',
  };

  const sizes = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-full border',
      variants[variant],
      sizes[size],
      className
    )}>
      {icon || <Check className="w-3.5 h-3.5" />}
      <span>{children}</span>
    </span>
  );
}

/**
 * FeaturePillList - Container for multiple feature pills
 */
export function FeaturePillList({ 
  children,
  className 
}: { 
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(
      'flex flex-wrap gap-2',
      className
    )}>
      {children}
    </div>
  );
}

/**
 * Gradient Feature Pill - With gradient background
 */
export function GradientFeaturePill({ 
  children, 
  className,
  gradient = 'from-blue-500 to-cyan-500'
}: { 
  children: ReactNode;
  className?: string;
  gradient?: string;
}) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full text-white',
      `bg-gradient-to-r ${gradient}`,
      className
    )}>
      <span className="w-1.5 h-1.5 rounded-full bg-white/80"></span>
      <span>{children}</span>
    </span>
  );
}
