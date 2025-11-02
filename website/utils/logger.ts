/**
 * Production-safe logging utility
 * Only logs in development, silent in production
 */

const isDev = import.meta.env.DEV || import.meta.env.MODE === 'development';

export const logger = {
  log: (...args: any[]) => {
    if (isDev) {
      console.log(...args);
    }
  },
  
  error: (...args: any[]) => {
    if (isDev) {
      console.error(...args);
    }
  },
  
  warn: (...args: any[]) => {
    if (isDev) {
      console.warn(...args);
    }
  },
  
  info: (...args: any[]) => {
    if (isDev) {
      console.info(...args);
    }
  },
  
  debug: (...args: any[]) => {
    if (isDev) {
      console.debug(...args);
    }
  }
};

// For critical errors that should always be logged AND tracked
export const logCritical = (error: any, context?: string) => {
  console.error(`[CRITICAL] ${context || 'Error'}:`, error);
  
  // Track in analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'exception', {
      description: error?.message || String(error),
      fatal: true,
      context: context || 'unknown'
    });
  }
};
