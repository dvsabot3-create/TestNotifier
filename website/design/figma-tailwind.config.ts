import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './index.html',
    './App.tsx',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
        xl: '2rem',
        '2xl': '2rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
    extend: {
      colors: {
        // Brand Colors
        brand: {
          primary: '#1d70b8',
          'primary-dark': '#2e8bc0',
          success: '#28a745',
          'success-light': '#20c997',
          warning: '#ffc107',
          'warning-dark': '#ff9800',
        },
        
        // Neutral Grays
        gray: {
          50: '#f8f9fa',
          100: '#f1f3f5',
          200: '#e9ecef',
          300: '#dee2e6',
          400: '#ced4da',
          500: '#adb5bd',
          600: '#6c757d',
          700: '#4a4a4a',
          800: '#2c2c2c',
          900: '#1a1a1a',
        },
        
        // Status Colors
        error: {
          DEFAULT: '#dc3545',
          light: '#f8d7da',
        },
        info: {
          DEFAULT: '#17a2b8',
          light: '#d1ecf1',
        },
        
        // Background Colors
        background: {
          DEFAULT: '#ffffff',
          gray: '#f8f9fa',
          blue: '#f0f7ff',
        },
        
        // Shadcn defaults
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      
      fontSize: {
        // Figma Typography Scale
        'xs': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0' }],      // 12px
        'sm': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0' }],     // 14px
        'base': ['1rem', { lineHeight: '1.6', letterSpacing: '0' }],       // 16px
        'lg': ['1.125rem', { lineHeight: '1.6', letterSpacing: '0' }],     // 18px
        'xl': ['1.25rem', { lineHeight: '1.7', letterSpacing: '0' }],      // 20px
        '2xl': ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],   // 24px
        '3xl': ['1.875rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }], // 30px
        '4xl': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],  // 36px
        '5xl': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],     // 48px
        '6xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],  // 60px
        '7xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],   // 72px
      },
      
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
      },
      
      spacing: {
        // Figma Spacing Scale (4px base)
        '0': '0',
        '0.5': '0.125rem',  // 2px
        '1': '0.25rem',     // 4px
        '1.5': '0.375rem',  // 6px
        '2': '0.5rem',      // 8px
        '3': '0.75rem',     // 12px
        '4': '1rem',        // 16px
        '5': '1.25rem',     // 20px
        '6': '1.5rem',      // 24px
        '8': '2rem',        // 32px
        '10': '2.5rem',     // 40px
        '12': '3rem',       // 48px
        '14': '3.5rem',     // 56px
        '16': '4rem',       // 64px
        '20': '5rem',       // 80px
        '24': '6rem',       // 96px
        '28': '7rem',       // 112px
        '32': '8rem',       // 128px
      },
      
      maxWidth: {
        // Figma Container Widths
        'narrow': '640px',     // Forms, single column
        'xs': '768px',         // Extra narrow
        'sm': '896px',         // FAQ, narrow content
        'md': '1024px',        // Content sections
        'lg': '1152px',        // Pricing, testimonials
        'xl': '1280px',        // Most sections
        '2xl': '1536px',       // Full width
        
        // Semantic containers
        'container-sm': '896px',
        'container-md': '1024px',
        'container-lg': '1152px',
        'container-xl': '1280px',
      },
      
      borderRadius: {
        // Figma Border Radius Scale
        'none': '0',
        'sm': '0.5rem',      // 8px
        'DEFAULT': '0.75rem', // 12px
        'md': '0.75rem',     // 12px
        'lg': '1rem',        // 16px
        'xl': '1.5rem',      // 24px
        '2xl': '2rem',       // 32px
        '3xl': '2.5rem',     // 40px
        'full': '9999px',
      },
      
      boxShadow: {
        // Figma Shadow System
        'sm': '0 2px 4px rgba(0, 0, 0, 0.04)',
        'DEFAULT': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'md': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'lg': '0 8px 24px rgba(0, 0, 0, 0.12)',
        'xl': '0 12px 32px rgba(0, 0, 0, 0.15)',
        '2xl': '0 24px 48px rgba(0, 0, 0, 0.18)',
        
        // Colored Shadows
        'primary': '0 4px 12px rgba(29, 112, 184, 0.3)',
        'primary-lg': '0 8px 24px rgba(29, 112, 184, 0.4)',
        'success': '0 4px 12px rgba(40, 167, 69, 0.3)',
        'warning': '0 4px 12px rgba(255, 193, 7, 0.3)',
        
        'inner': 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
        'none': 'none',
      },
      
      zIndex: {
        // Figma Z-Index System
        '0': '0',
        '10': '10',    // Dropdowns
        '20': '20',    // Sticky headers
        '30': '30',    // Fixed elements
        '40': '40',    // Modal backdrop
        '50': '50',    // Modal content
        '60': '60',    // Popovers
        '70': '70',    // Toasts
        '100': '100',  // Top layer
      },
      
      opacity: {
        '0': '0',
        '5': '0.05',
        '10': '0.1',
        '20': '0.2',
        '30': '0.3',
        '40': '0.4',
        '50': '0.5',
        '60': '0.6',
        '70': '0.7',
        '80': '0.8',
        '90': '0.9',
        '100': '1',
      },
      
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '40px',
      },
      
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-out': {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        'slide-in-from-bottom': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        'slide-in-from-top': {
          from: { transform: 'translateY(-100%)' },
          to: { transform: 'translateY(0)' },
        },
        'slide-in-from-left': {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' },
        },
        'slide-in-from-right': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
      },
      
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'fade-out': 'fade-out 0.3s ease-out',
        'slide-in-bottom': 'slide-in-from-bottom 0.3s ease-out',
        'slide-in-top': 'slide-in-from-top 0.3s ease-out',
        'slide-in-left': 'slide-in-from-left 0.3s ease-out',
        'slide-in-right': 'slide-in-from-right 0.3s ease-out',
      },
      
      transitionDuration: {
        '0': '0ms',
        '75': '75ms',
        '100': '100ms',
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
        '500': '500ms',
        '700': '700ms',
        '1000': '1000ms',
      },
      
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
