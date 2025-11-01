import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Send to monitoring service
    this.logError(error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });
  }

  logError(error: Error, errorInfo: React.ErrorInfo) {
    // Log to console for development
    console.group('🚨 Application Error');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    console.error('Component Stack:', errorInfo.componentStack);
    console.groupEnd();

    // Send to monitoring service (like Vercel Speed Insights)
    if (window.vsi) {
      window.vsi.track('error', {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        url: window.location.href,
        timestamp: new Date().toISOString(),
      });
    }

    // Send to your error tracking service
    if (window.errorTracking) {
      window.errorTracking.track(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-container">
            <h2>🚨 Something went wrong</h2>
            <details className="error-details">
              <summary>Click for error details</summary>
              <div className="error-info">
                <h3>Error Message:</h3>
                <pre>{this.state.error?.message}</pre>
                <h3>Stack Trace:</h3>
                <pre>{this.state.error?.stack}</pre>
                <h3>Component Stack:</h3>
                <pre>{this.state.errorInfo?.componentStack}</pre>
              </div>
            </details>
            <button
              onClick={() => window.location.reload()}
              className="error-reload-btn"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;