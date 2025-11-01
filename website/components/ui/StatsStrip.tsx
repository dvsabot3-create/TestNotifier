import { cn } from "./utils";
import { ReactNode } from "react";

interface Stat {
  value: string | number;
  label: string;
  icon?: ReactNode;
  suffix?: string;
}

interface StatsStripProps {
  stats: Stat[];
  className?: string;
  variant?: 'default' | 'card' | 'inline';
  columns?: 2 | 3 | 4;
  withDividers?: boolean;
}

/**
 * StatsStrip - Three/four-column stat bar with dividers
 * Displays metrics with large numbers and labels
 */
export function StatsStrip({ 
  stats,
  className,
  variant = 'default',
  columns = 3,
  withDividers = true
}: StatsStripProps) {
  const columnClasses = {
    2: 'grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
  };

  const variantClasses = {
    default: '',
    card: 'bg-white rounded-2xl border border-gray-200 p-6',
    inline: 'bg-transparent',
  };

  return (
    <div className={cn(
      'grid gap-6',
      columnClasses[columns],
      variantClasses[variant],
      className
    )}>
      {stats.map((stat, index) => (
        <div 
          key={index}
          className={cn(
            'relative',
            withDividers && index < stats.length - 1 && 'md:border-r border-gray-200 md:pr-6',
            'text-center'
          )}
        >
          {/* Icon */}
          {stat.icon && (
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center">
                {stat.icon}
              </div>
            </div>
          )}

          {/* Value */}
          <div className="text-4xl md:text-5xl text-brand-primary mb-2">
            {stat.value}{stat.suffix}
          </div>

          {/* Label */}
          <div className="text-sm text-gray-600">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Horizontal Stats Strip - Inline version with smaller size
 */
export function HorizontalStatsStrip({ 
  stats,
  className 
}: { 
  stats: Stat[];
  className?: string;
}) {
  return (
    <div className={cn(
      'flex flex-wrap gap-8',
      className
    )}>
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <div className="text-3xl mb-1">
            {stat.value}{stat.suffix}
          </div>
          <div className="text-sm text-gray-600">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Compact Stat - Single stat component
 */
export function CompactStat({ 
  value,
  label,
  icon,
  className 
}: Stat & { className?: string }) {
  return (
    <div className={cn('text-center', className)}>
      {icon && (
        <div className="flex justify-center mb-2">
          {icon}
        </div>
      )}
      <div className="text-2xl md:text-3xl text-brand-primary mb-1">
        {value}
      </div>
      <div className="text-xs md:text-sm text-gray-600">
        {label}
      </div>
    </div>
  );
}

/**
 * Animated Counter Stat - For use with GSAP counter animations
 */
export function CounterStat({ 
  targetValue,
  label,
  suffix = '',
  className 
}: { 
  targetValue: string | number;
  label: string;
  suffix?: string;
  className?: string;
}) {
  return (
    <div className={cn('text-center p-6 bg-white rounded-2xl border border-gray-200', className)}>
      <div 
        className="counter text-4xl text-brand-primary mb-2"
        data-target={`${targetValue}${suffix}`}
      >
        0{suffix}
      </div>
      <div className="text-sm text-gray-600">
        {label}
      </div>
    </div>
  );
}
