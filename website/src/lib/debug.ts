/**
 * Debug and Monitoring Utilities for TestNotifier
 * Helps diagnose white screen issues and performance problems
 */

// Debug configuration - only enabled in development
const DEBUG_ENABLED = process.env.NODE_ENV === 'development';
const PERFORMANCE_MONITORING = process.env.NODE_ENV === 'development';
const ERROR_TRACKING = true; // Always track errors for monitoring

// Debug logger
export const debug = {
  log: (...args: any[]) => {
    if (DEBUG_ENABLED) {
      console.log('[TestNotifier Debug]', ...args);
    }
  },

  error: (...args: any[]) => {
    if (DEBUG_ENABLED) {
      console.error('[TestNotifier Error]', ...args);
    }
  },

  warn: (...args: any[]) => {
    if (DEBUG_ENABLED) {
      console.warn('[TestNotifier Warning]', ...args);
    }
  },

  group: (label: string, fn: () => void) => {
    if (DEBUG_ENABLED) {
      console.group(`[TestNotifier] ${label}`);
      fn();
      console.groupEnd();
    }
  }
};

// Performance monitoring
export const performanceMonitor = {
  start: (name: string) => {
    if (PERFORMANCE_MONITORING) {
      debug.log(`Starting performance measurement: ${name}`);
      return performance.mark(`${name}-start`);
    }
  },

  end: (name: string) => {
    if (PERFORMANCE_MONITORING) {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
      const measure = performance.getEntriesByName(name)[0];
      debug.log(`Performance: ${name} took ${measure.duration.toFixed(2)}ms`);
      return measure.duration;
    }
    return 0;
  },

  measure: (name: string, fn: () => T): T => {
    if (PERFORMANCE_MONITORING) {
      const startMark = this.start(name);
      try {
        const result = fn();
        this.end(name);
        return result;
      } catch (error) {
        this.end(name);
        throw error;
      }
    }
    return fn();
  }
};

// White screen detection
export const whiteScreenDetector = {
  checkDOMContent: () => {
    const hasContent = document.body && document.body.children.length > 0;
    const hasText = document.body ? document.body.innerText.trim().length > 0 : false;
    const hasImages = document.images.length > 0;
    const hasScripts = document.scripts.length > 0;

    debug.group('DOM Content Check', () => {
      debug.log('Has body element:', !!document.body);
      debug.log('Has children:', document.body?.children.length || 0);
      debug.log('Has text content:', hasText);
      debug.log('Has images:', hasImages);
      debug.log('Has scripts:', hasScripts);
    });

    return {
      hasContent,
      hasText,
      hasImages,
      hasScripts,
      isEmpty: !hasContent || !hasText
    };
  },

  monitorDOMChanges: () => {
    const observer = new MutationObserver((mutations) => {
      debug.log('DOM mutation detected:', mutations.length, 'mutations');
      mutations.forEach((mutation) => {
        debug.log('Mutation type:', mutation.type);
        debug.log('Target:', mutation.target);
        debug.log('Added nodes:', mutation.addedNodes.length);
        debug.log('Removed nodes:', mutation.removedNodes.length);
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true
    });

    return observer;
  },

  detectWhiteScreen: () => {
    const check = this.checkDOMContent();

    if (check.isEmpty) {
      debug.error('⚠️ White screen detected!');
      debug.log('Body content:', document.body?.innerHTML || 'No body');
      debug.log('Document readyState:', document.readyState);
      debug.log('Window loaded:', (window as any).loaded || false);

      // Additional diagnostic information
      debug.log('Document HTML:', document.documentElement?.outerHTML?.substring(0, 500) || 'No HTML');
      debug.log('Body innerHTML:', document.body?.innerHTML?.substring(0, 500) || 'No body content');

      return true;
    }

    return false;
  }
};

// Resource loading monitoring
export const resourceMonitor = {
  trackResourceLoading: () => {
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        const resources = performance.getEntriesByType('resource');
        const failedResources = resources.filter(r => !r.responseEnd || r.responseEnd === 0);
        const slowResources = resources.filter(r => r.duration > 1000);

        debug.group('Resource Loading Analysis', () => {
          debug.log('Total resources:', resources.length);
          debug.log('Failed resources:', failedResources.length);
          debug.log('Slow resources (>1s):', slowResources.length);

          if (failedResources.length > 0) {
            debug.error('Failed resources:');
            failedResources.forEach(r => {
              debug.error(`  - ${r.name}: ${r.responseStatus || 'no response'}`);
            });
          }

          if (slowResources.length > 0) {
            debug.warn('Slow resources:');
            slowResources.forEach(r => {
              debug.warn(`  - ${r.name}: ${r.duration.toFixed(2)}ms`);
            });
          }
        });

        return {
          total: resources.length,
          failed: failedResources.length,
          slow: slowResources.length,
          hasIssues: failedResources.length > 0
        };
      });
    }
  },

  checkCriticalResources: () => {
    const criticalResources = [
      { name: 'index.js', type: 'script' },
      { name: 'index.css', type: 'stylesheet' },
      { name: 'main.tsx', type: 'script' }
    ];

    const resources = performance.getEntriesByType('resource');

    return criticalResources.map(critical => {
      const found = resources.find(r => r.name.includes(critical.name));
      return {
        name: critical.name,
        type: critical.type,
        found: !!found,
        status: found ? found.responseStatus : 'not found',
        duration: found ? found.duration : 0
      };
    });
  }
};

// Error tracking and reporting
export const errorTracker = {
  trackError: (error: Error, context?: any) => {
    if (ERROR_TRACKING) {
      debug.error('Tracked error:', error.message);
      debug.error('Error stack:', error.stack);
      if (context) {
        debug.error('Error context:', context);
      }

      // Send to monitoring service
      if (window.vsi) {
        window.vsi.track('error', {
          message: error.message,
          stack: error.stack,
          context: context,
          url: window.location.href,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        });
      }
    }
  },

  setupGlobalErrorHandling: () => {
    window.addEventListener('error', (event) => {
      this.trackError(event.error, {
        type: 'global',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.trackError(new Error(event.reason), {
        type: 'unhandledrejection',
        reason: event.reason
      });
    });
  }
};

// Initialization function
export const initializeMonitoring = () => {
  debug.log('Initializing monitoring and debugging tools');

  // Set up global error handling
  errorTracker.setupGlobalErrorHandling();

  // Set up resource monitoring
  resourceMonitor.trackResourceLoading();

  // Monitor DOM for changes
  const observer = whiteScreenDetector.monitorDOMChanges();

  // Check for white screen after a delay
  setTimeout(() => {
    whiteScreenDetector.detectWhiteScreen();
  }, 3000); // Check after 3 seconds

  debug.log('Monitoring initialized successfully');

  return {
    observer,
    whiteScreenDetector,
    resourceMonitor,
    errorTracker
  };
};

// Export for use in other files
export {
  debug,
  performanceMonitor,
  whiteScreenDetector,
  resourceMonitor,
  errorTracker,
  initializeMonitoring
};