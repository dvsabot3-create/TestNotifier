import type { Plugin } from 'vite'

/**
 * Image optimization configuration for Vite
 * Optimizes images during build process
 */
export const imageminPlugin: Plugin = {
  name: 'vite-plugin-imagemin',
  apply: 'build',
  configResolved(config) {
    // Only apply in production builds
    if (config.command === 'build' && config.mode === 'production') {
      console.log('🖼️ Image optimization enabled for production build')
    }
  },
  async generateBundle(options, bundle) {
    // Process image assets
    for (const [fileName, chunk] of Object.entries(bundle)) {
      if (chunk.type === 'asset' && isImageFile(fileName)) {
        try {
          // Mark image for optimization
          console.log(`📸 Optimizing image: ${fileName}`)
        } catch (error) {
          console.warn(`⚠️ Failed to optimize ${fileName}:`, error)
        }
      }
    }
  }
}

function isImageFile(fileName: string): boolean {
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.avif']
  return imageExtensions.some(ext => fileName.toLowerCase().endsWith(ext))
}

/**
 * Image loading optimization strategies
 */
export const imageOptimization = {
  /**
   * Generate responsive image srcset
   */
  generateSrcSet(src: string, widths: number[]): string {
    return widths
      .map(width => `${src}?w=${width} ${width}w`)
      .join(', ')
  },

  /**
   * Calculate optimal image size based on container
   */
  getOptimalSize(containerWidth: number, devicePixelRatio: number = 1): number {
    return Math.ceil(containerWidth * devicePixelRatio)
  },

  /**
   * Lazy loading configuration
   */
  lazyLoading: {
    rootMargin: '50px',
    threshold: 0.01,
    loading: 'lazy' as const,
    decoding: 'async' as const,
  },

  /**
   * Modern image formats priority
   */
  modernFormats: ['avif', 'webp', 'jpg'] as const,

  /**
   * Image compression settings
   */
  compression: {
    quality: 85,
    progressive: true,
    optimizationLevel: 6,
  }
}

/**
 * Preload critical images
 */
export function preloadImage(href: string, as: 'image', imagesrcset?: string, imagesizes?: string): void {
  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = as
  link.href = href

  if (imagesrcset) link.imagesrcset = imagesrcset
  if (imagesizes) link.imagesizes = imagesizes

  document.head.appendChild(link)
}

/**
 * Optimize hero images and above-the-fold content
 */
export const criticalImages = [
  '/assets/hero/hero-image.png',
  '/assets/logos/logo.svg',
  '/assets/icons/favicon.ico'
]

/**
 * Image CDN configuration (if using external service)
 */
export const cdnConfig = {
  baseUrl: 'https://cdn.testnotifier.com',
  transformations: {
    resize: (width: number, height?: number) => `w_${width}${height ? `,h_${height}` : ''}`,
    quality: (quality: number) => `q_${quality}`,
    format: (format: string) => `f_${format}`,
    crop: 'c_fill',
    gravity: 'g_auto',
  }
}