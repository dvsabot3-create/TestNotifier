import { cn } from "../ui/utils";
import { Star, Quote, Play } from "lucide-react";
import { ReactNode } from "react";

interface TestimonialCardProps {
  name: string;
  location?: string;
  role?: string;
  quote: string;
  rating?: number;
  date?: string;
  avatar?: string;
  image?: string;
  video?: boolean;
  className?: string;
}

/**
 * TestimonialCard - Customer testimonial with quote/video layout
 * Matches Figma testimonial design with ratings and locations
 */
export function TestimonialCard({
  name,
  location,
  role,
  quote,
  rating = 5,
  date,
  avatar,
  image,
  video = false,
  className
}: TestimonialCardProps) {
  return (
    <div className={cn(
      'testimonial-card group relative bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all duration-500',
      'hover:border-brand-primary/30 hover:shadow-xl',
      className
    )}>
      {/* Image/Video Section */}
      {(image || video) && (
        <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
          {image && (
            <img 
              src={image} 
              alt={name}
              className="w-full h-full object-cover"
            />
          )}
          
          {video && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 text-brand-primary ml-1" />
              </div>
            </div>
          )}
        </div>
      )}

      <div className="p-6">
        {/* Rating */}
        {rating && (
          <div className="flex items-center gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'w-4 h-4',
                  i < rating 
                    ? 'fill-yellow-400 text-yellow-400' 
                    : 'fill-gray-200 text-gray-200'
                )}
              />
            ))}
            {date && (
              <span className="ml-2 text-xs text-gray-500">{date}</span>
            )}
          </div>
        )}

        {/* Quote */}
        <div className="relative mb-6">
          <Quote className="absolute -top-2 -left-1 w-8 h-8 text-brand-primary/20" />
          <p className="text-gray-700 leading-relaxed pl-6">
            {quote}
          </p>
        </div>

        {/* Author Info */}
        <div className="flex items-center gap-3">
          {/* Avatar */}
          {avatar ? (
            <img 
              src={avatar} 
              alt={name}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
            />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-brand-primary to-brand-primary-dark rounded-full flex items-center justify-center text-white text-lg">
              {name.charAt(0)}
            </div>
          )}

          {/* Name & Location */}
          <div>
            <div className="text-gray-900">{name}</div>
            <div className="text-sm text-gray-600">
              {location && role ? `${location} • ${role}` : location || role}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * SimpleTestimonial - Compact testimonial without image
 */
export function SimpleTestimonial({
  name,
  location,
  quote,
  rating = 5,
  className
}: Omit<TestimonialCardProps, 'image' | 'video' | 'avatar' | 'role' | 'date'>) {
  return (
    <div className={cn(
      'bg-white rounded-xl p-6 border border-gray-200',
      className
    )}>
      {/* Quote */}
      <p className="text-gray-700 mb-4 leading-relaxed italic">
        "{quote}"
      </p>

      {/* Rating */}
      <div className="flex items-center gap-1 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              'w-4 h-4',
              i < rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'fill-gray-200 text-gray-200'
            )}
          />
        ))}
      </div>

      {/* Author */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-900">{name}</span>
        {location && (
          <>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">{location}</span>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * TestimonialCarousel Container
 */
export function TestimonialGrid({ 
  children,
  columns = 3,
  className 
}: { 
  children: ReactNode;
  columns?: 2 | 3;
  className?: string;
}) {
  const columnClasses = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  };

  return (
    <div className={cn(
      'grid gap-6',
      columnClasses[columns],
      className
    )}>
      {children}
    </div>
  );
}

/**
 * Featured Testimonial - Large hero testimonial
 */
export function FeaturedTestimonial({
  name,
  location,
  role,
  quote,
  image,
  className
}: Omit<TestimonialCardProps, 'rating' | 'date' | 'video'>) {
  return (
    <div className={cn(
      'grid lg:grid-cols-2 gap-12 items-center bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl overflow-hidden',
      className
    )}>
      {/* Image Side */}
      {image && (
        <div className="relative h-[400px] lg:h-auto">
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/50 to-transparent"></div>
        </div>
      )}

      {/* Content Side */}
      <div className="p-12 lg:pr-16">
        <Quote className="w-16 h-16 text-white/20 mb-6" />
        
        <p className="text-2xl md:text-3xl text-white mb-8 leading-relaxed">
          {quote}
        </p>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-brand-primary to-brand-primary-dark rounded-full flex items-center justify-center text-white text-2xl">
            {name.charAt(0)}
          </div>
          <div>
            <div className="text-white text-lg">{name}</div>
            <div className="text-gray-400">
              {location && role ? `${location} • ${role}` : location || role}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
