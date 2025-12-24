/**
 * Theme Consistency Utility
 * Ensures consistent styling across website and Chrome extension
 * Based on DVSA design system and existing website specifications
 */

// Color palette from website technical specification
export const themeColors = {
  // Primary Colors (DVSA Official)
  primaryBlue: '#1d70b8',
  primaryBlueLight: '#2e8bc0',
  primaryBlueDark: '#155a8c',

  // Semantic Colors
  successGreen: '#28a745',
  successGreenLight: '#d4edda',
  successGreenDark: '#155724',

  warningOrange: '#ffc107',
  warningOrangeLight: '#fff3cd',
  warningOrangeDark: '#856404',

  errorRed: '#dc3545',
  errorRedLight: '#f8d7da',
  errorRedDark: '#721c24',

  // Neutral Colors
  gray50: '#f8f9fa',
  gray100: '#e9ecef',
  gray200: '#dee2e6',
  gray300: '#ced4da',
  gray400: '#adb5bd',
  gray500: '#6c757d',
  gray600: '#495057',
  gray700: '#343a40',
  gray800: '#212529',
  gray900: '#212529',

  // Pure colors
  white: '#ffffff',
  black: '#000000',

  // Gradient colors
  gradientBlue: 'linear-gradient(135deg, #1d70b8, #2e8bc0)',
  gradientSuccess: 'linear-gradient(135deg, #28a745, #20c997)',
  gradientWarning: 'linear-gradient(135deg, #ffc107, #fd7e14)',
  gradientError: 'linear-gradient(135deg, #dc3545, #e74c3c)',

  // Extension specific colors
  extensionBackground: '#f8f9fa',
  extensionCardBackground: '#ffffff',
  extensionBorder: '#dee2e6',
  extensionText: '#333333',
  extensionHeader: 'linear-gradient(135deg, #1d70b8, #2e8bc0)'
};

// Typography scale
export const themeTypography = {
  // Font families
  fontFamily: {
    primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace"
  },

  // Font sizes
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem'   // 60px
  },

  // Font weights
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700'
  },

  // Line heights
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75'
  }
};

// Spacing scale (based on 8px grid)
export const themeSpacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  32: '8rem'      // 128px
};

// Border radius scale
export const themeBorderRadius = {
  none: '0',
  sm: '0.125rem',  // 2px
  default: '0.25rem', // 4px
  md: '0.375rem',  // 6px
  lg: '0.5rem',    // 8px
  xl: '0.75rem',   // 12px
  '2xl': '1rem',   // 16px
  '3xl': '1.5rem', // 24px
  full: '9999px'
};

// Shadow scale
export const themeShadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  default: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  none: 'none'
};

// Animation settings
export const themeAnimations = {
  // Transitions
  transition: {
    fast: '150ms ease-in-out',
    normal: '250ms ease-in-out',
    slow: '350ms ease-in-out'
  },

  // Keyframe animations
  keyframes: {
    fadeIn: {
      '0%': { opacity: '0' },
      '100%': { opacity: '1' }
    },
    slideInUp: {
      '0%': { transform: 'translateY(100%)', opacity: '0' },
      '100%': { transform: 'translateY(0)', opacity: '1' }
    },
    slideInRight: {
      '0%': { transform: 'translateX(100%)', opacity: '0' },
      '100%': { transform: 'translateX(0)', opacity: '1' }
    },
    scaleIn: {
      '0%': { transform: 'scale(0.95)', opacity: '0' },
      '100%': { transform: 'scale(1)', opacity: '1' }
    },
    spin: {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' }
    },
    pulse: {
      '0%, 100%': { opacity: '1' },
      '50%': { opacity: '0.5' }
    }
  }
};

// Component specific styles
export const themeComponents = {
  // Button styles
  button: {
    primary: {
      background: themeColors.gradientBlue,
      color: themeColors.white,
      border: 'none',
      borderRadius: themeBorderRadius.lg,
      fontWeight: themeTypography.fontWeight.semibold,
      fontSize: themeTypography.fontSize.sm,
      padding: `${themeSpacing[2]} ${themeSpacing[4]}`,
      boxShadow: themeShadows.md,
      transition: themeAnimations.transition.normal,
      hover: {
        transform: 'translateY(-1px)',
        boxShadow: themeShadows.lg
      },
      active: {
        transform: 'translateY(0)',
        boxShadow: themeShadows.sm
      }
    },
    secondary: {
      background: themeColors.white,
      color: themeColors.primaryBlue,
      border: `2px solid ${themeColors.primaryBlue}`,
      borderRadius: themeBorderRadius.lg,
      fontWeight: themeTypography.fontWeight.semibold,
      fontSize: themeTypography.fontSize.sm,
      padding: `${themeSpacing[2]} ${themeSpacing[4]}`,
      transition: themeAnimations.transition.normal,
      hover: {
        background: themeColors.primaryBlue,
        color: themeColors.white
      }
    },
    danger: {
      background: themeColors.errorRed,
      color: themeColors.white,
      border: 'none',
      borderRadius: themeBorderRadius.lg,
      fontWeight: themeTypography.fontWeight.semibold,
      fontSize: themeTypography.fontSize.sm,
      padding: `${themeSpacing[2]} ${themeSpacing[4]}`,
      transition: themeAnimations.transition.normal,
      hover: {
        background: themeColors.errorRedDark
      }
    }
  },

  // Card styles
  card: {
    background: themeColors.white,
    border: `1px solid ${themeColors.gray200}`,
    borderRadius: themeBorderRadius.xl,
    boxShadow: themeShadows.lg,
    padding: themeSpacing[6]
  },

  // Input styles
  input: {
    background: themeColors.white,
    border: `1px solid ${themeColors.gray300}`,
    borderRadius: themeBorderRadius.md,
    fontSize: themeTypography.fontSize.sm,
    padding: `${themeSpacing[3]} ${themeSpacing[4]}`,
    transition: themeAnimations.transition.fast,
    focus: {
      borderColor: themeColors.primaryBlue,
      boxShadow: `0 0 0 3px ${themeColors.primaryBlue}20`
    }
  },

  // Extension specific styles
  extension: {
    popup: {
      width: '420px',
      minHeight: '600px',
      background: themeColors.extensionBackground,
      fontSize: themeTypography.fontSize.sm,
      lineHeight: themeTypography.lineHeight.normal
    },
    header: {
      background: themeColors.extensionHeader,
      color: themeColors.white,
      padding: themeSpacing[4]
    },
    section: {
      background: themeColors.extensionCardBackground,
      border: `1px solid ${themeColors.extensionBorder}`,
      borderRadius: themeBorderRadius.lg,
      marginBottom: themeSpacing[4],
      padding: themeSpacing[4]
    },
    button: {
      padding: `${themeSpacing[2]} ${themeSpacing[3]}`,
      fontSize: themeTypography.fontSize.xs,
      borderRadius: themeBorderRadius.md
    }
  }
};

// Utility functions
export const themeUtils = {
  /**
   * Convert hex color to RGB
   */
  hexToRgb: (hex: string): { r: number; g: number; b: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  },

  /**
   * Convert RGB to hex color
   */
  rgbToHex: (r: number, g: number, b: number): string => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  },

  /**
   * Get contrasting text color for background
   */
  getContrastColor: (backgroundColor: string): string => {
    const { r, g, b } = this.hexToRgb(backgroundColor);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? themeColors.black : themeColors.white;
  },

  /**
   * Generate CSS custom properties
   */
  generateCSSVariables: (): string => {
    return `
      /* Colors */
      --color-primary-blue: ${themeColors.primaryBlue};
      --color-primary-blue-light: ${themeColors.primaryBlueLight};
      --color-primary-blue-dark: ${themeColors.primaryBlueDark};
      --color-success-green: ${themeColors.successGreen};
      --color-warning-orange: ${themeColors.warningOrange};
      --color-error-red: ${themeColors.errorRed};
      --color-white: ${themeColors.white};
      --color-black: ${themeColors.black};

      /* Typography */
      --font-family-primary: ${themeTypography.fontFamily.primary};
      --font-size-xs: ${themeTypography.fontSize.xs};
      --font-size-sm: ${themeTypography.fontSize.sm};
      --font-size-base: ${themeTypography.fontSize.base};
      --font-size-lg: ${themeTypography.fontSize.lg};
      --font-size-xl: ${themeTypography.fontSize.xl};

      /* Spacing */
      --spacing-1: ${themeSpacing[1]};
      --spacing-2: ${themeSpacing[2]};
      --spacing-4: ${themeSpacing[4]};
      --spacing-6: ${themeSpacing[6]};
      --spacing-8: ${themeSpacing[8]};

      /* Border Radius */
      --border-radius-sm: ${themeBorderRadius.sm};
      --border-radius-md: ${themeBorderRadius.md};
      --border-radius-lg: ${themeBorderRadius.lg};
      --border-radius-xl: ${themeBorderRadius.xl};

      /* Shadows */
      --shadow-sm: ${themeShadows.sm};
      --shadow-md: ${themeShadows.md};
      --shadow-lg: ${themeShadows.lg};
      --shadow-xl: ${themeShadows.xl};
    `;
  }
};

// Export theme object
export const theme = {
  colors: themeColors,
  typography: themeTypography,
  spacing: themeSpacing,
  borderRadius: themeBorderRadius,
  shadows: themeShadows,
  animations: themeAnimations,
  components: themeComponents,
  utils: themeUtils
};

// Default export
export default theme;