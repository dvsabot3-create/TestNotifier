import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    
    // Log to error tracking service (Sentry, etc.)
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: error.message,
        fatal: true
      });
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
            {/* Icon */}
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Something went wrong
            </h1>

            {/* Message */}
            <p className="text-gray-600 mb-6 leading-relaxed">
              We're sorry, but something unexpected happened. Our team has been notified and we're working to fix it.
            </p>

            {/* Error Details (only in dev) */}
            {import.meta.env.DEV && this.state.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
                <p className="text-xs font-mono text-red-800 break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="flex items-center justify-center gap-2 bg-[#1d70b8] hover:bg-[#2e8bc0] text-white px-6 py-3 rounded-lg font-semibold transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Return to Home
              </button>
              
              <a
                href="mailto:hello@testnotifier.co.uk?subject=Error%20Report"
                className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-all"
              >
                Contact Support
              </a>
            </div>

            {/* Help Text */}
            <p className="text-xs text-gray-500 mt-6">
              If this problem persists, please contact us at{' '}
              <a href="mailto:hello@testnotifier.co.uk" className="text-[#1d70b8] hover:underline">
                hello@testnotifier.co.uk
              </a>
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

