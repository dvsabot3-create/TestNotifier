import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../App';
import { AuthProvider } from './lib/auth';
import '../globals.css';
import { injectSpeedInsights } from '@vercel/speed-insights';
import ErrorBoundary from './components/ErrorBoundary';

// Add global error handling for debugging
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  console.error('Error message:', event.message);
  console.error('Error stack:', event.error?.stack);
  console.error('Error filename:', event.filename);
  console.error('Error lineno:', event.lineno);
  console.error('Error colno:', event.colno);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

// Add performance monitoring
if (typeof window !== 'undefined') {
  // Monitor performance metrics
  window.addEventListener('load', () => {
    const perfData = performance.getEntriesByType('navigation')[0];
    console.log('Performance metrics:', {
      domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
      loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
      domInteractive: perfData.domInteractive,
      domComplete: perfData.domComplete,
      loadEventEnd: perfData.loadEventEnd,
      loadEventStart: perfData.loadEventStart,
      domContentLoadedEventEnd: perfData.domContentLoadedEventEnd,
      domContentLoadedEventStart: perfData.domContentLoadedEventStart,
    });
  });

  // Monitor resource loading
  window.addEventListener('load', () => {
    const resources = performance.getEntriesByType('resource');
    console.log('Resource loading metrics:', {
      totalResources: resources.length,
      failedResources: resources.filter(r => !r.responseEnd || r.responseEnd === 0).length,
      slowResources: resources.filter(r => r.duration > 1000).length,
      resources: resources.map(r => ({
        name: r.name,
        duration: r.duration,
        size: r.transferSize,
        status: r.responseStatus,
      }))
    });
  });
}

// Initialize Speed Insights
injectSpeedInsights();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
