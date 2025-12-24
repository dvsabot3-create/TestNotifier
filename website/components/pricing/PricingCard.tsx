import { cn } from "../ui/utils";
import { Button } from "../ui/button";
import { Check, X, Sparkles } from "lucide-react";
import { ReactNode } from "react";

interface PricingFeature {
  text: string;
  included: boolean;
  tooltip?: string;
}

interface PricingCardProps {
  name: string;
  subtitle?: string;
  price: string | number;
  period?: string;
  features: PricingFeature[];
  ctaText: string;
  ctaAction?: () => void;
  highlighted?: boolean;
  badge?: string;
  footer?: string;
  className?: string;
}

/**
 * PricingCard - Pricing tier card with Pro highlight, feature list
 * Matches Figma pricing section design
 */
export function PricingCard({
  name,
  subtitle,
  price,
  period = '/month',
  features,
  ctaText,
  ctaAction,
  highlighted = false,
  badge,
  footer,
  className
}: PricingCardProps) {
  return (
    <div className={cn(
      'pricing-card relative bg-white rounded-3xl border transition-all duration-500',
      highlighted 
        ? 'border-4 border-brand-primary shadow-primary-lg scale-105 md:scale-110' 
        : 'border-gray-200 hover:border-brand-primary/30 hover:shadow-xl',
      className
    )}>
      {/* Popular Badge */}
      {badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-brand-primary to-brand-primary-dark text-white px-4 py-1.5 rounded-full text-sm shadow-lg">
            <Sparkles className="w-4 h-4" />
            <span>{badge}</span>
          </div>
        </div>
      )}

      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          {/* Plan Name */}
          <h3 className="text-2xl md:text-3xl text-gray-900 mb-2">
            {name}
          </h3>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-sm text-gray-600 mb-6">
              {subtitle}
            </p>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-5xl md:text-6xl text-gray-900">
              {typeof price === 'number' ? `£${price}` : price}
            </span>
            {period && (
              <span className="text-lg text-gray-600">{period}</span>
            )}
          </div>

          {/* Highlight Text */}
          {highlighted && (
            <div className="mt-4 text-sm text-brand-primary">
              ⭐ Save 8 weeks on average!
            </div>
          )}
        </div>

        {/* CTA Button */}
        <Button 
          size="lg"
          className={cn(
            'w-full mb-8',
            highlighted 
              ? 'bg-gradient-to-r from-brand-primary to-brand-primary-dark hover:shadow-xl' 
              : 'bg-white text-brand-primary border-2 border-brand-primary hover:bg-brand-primary/5'
          )}
          onClick={ctaAction}
        >
          {ctaText}
        </Button>

        {/* Features List */}
        <ul className="space-y-4">
          {features.map((feature, index) => (
            <li 
              key={index}
              className={cn(
                'flex items-start gap-3',
                !feature.included && 'opacity-50'
              )}
            >
              {/* Icon */}
              <div className={cn(
                'flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5',
                feature.included 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-gray-100 text-gray-400'
              )}>
                {feature.included ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <X className="w-3.5 h-3.5" />
                )}
              </div>

              {/* Text */}
              <span className={cn(
                'text-sm leading-relaxed',
                feature.included ? 'text-gray-700' : 'text-gray-500'
              )}>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>

        {/* Footer Note */}
        {footer && (
          <div className="mt-6 pt-6 border-t border-gray-200 text-xs text-gray-500 text-center">
            {footer}
          </div>
        )}
      </div>

      {/* Gradient Border Effect on Hover (for non-highlighted cards) */}
      {!highlighted && (
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-primary to-brand-primary-dark opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none -z-10 blur-xl"></div>
      )}
    </div>
  );
}

/**
 * PricingToggle - Monthly/Annual toggle switch
 */
interface PricingToggleProps {
  value: 'monthly' | 'annual';
  onChange: (value: 'monthly' | 'annual') => void;
  className?: string;
  annualDiscount?: string;
}

export function PricingToggle({ 
  value, 
  onChange,
  className,
  annualDiscount = '20% off'
}: PricingToggleProps) {
  return (
    <div className={cn('inline-flex items-center gap-4', className)}>
      <button
        onClick={() => onChange('monthly')}
        className={cn(
          'px-4 py-2 rounded-lg transition-all',
          value === 'monthly' 
            ? 'bg-brand-primary text-white shadow-md' 
            : 'text-gray-600 hover:text-gray-900'
        )}
      >
        Monthly
      </button>

      <button
        onClick={() => onChange('annual')}
        className={cn(
          'px-4 py-2 rounded-lg transition-all relative',
          value === 'annual' 
            ? 'bg-brand-primary text-white shadow-md' 
            : 'text-gray-600 hover:text-gray-900'
        )}
      >
        Annual
        {annualDiscount && (
          <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
            {annualDiscount}
          </span>
        )}
      </button>
    </div>
  );
}

/**
 * PricingComparisonTable - Full feature comparison table
 */
interface ComparisonFeature {
  name: string;
  free: boolean | string;
  pro: boolean | string;
  instructor: boolean | string;
}

export function PricingComparisonTable({ 
  features 
}: { 
  features: ComparisonFeature[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-4 px-6 text-gray-900">Feature</th>
            <th className="text-center py-4 px-6 text-gray-900">Free</th>
            <th className="text-center py-4 px-6 text-brand-primary">Pro</th>
            <th className="text-center py-4 px-6 text-gray-900">Instructor</th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature, index) => (
            <tr 
              key={index}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td className="py-4 px-6 text-gray-700">{feature.name}</td>
              <td className="py-4 px-6 text-center">
                {renderCell(feature.free)}
              </td>
              <td className="py-4 px-6 text-center bg-blue-50/50">
                {renderCell(feature.pro)}
              </td>
              <td className="py-4 px-6 text-center">
                {renderCell(feature.instructor)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderCell(value: boolean | string) {
  if (typeof value === 'boolean') {
    return value ? (
      <Check className="w-5 h-5 text-green-600 mx-auto" />
    ) : (
      <X className="w-5 h-5 text-gray-300 mx-auto" />
    );
  }
  return <span className="text-sm text-gray-700">{value}</span>;
}
