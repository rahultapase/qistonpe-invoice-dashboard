import { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * ErrorBoundary Component
 * 
 * A class-based component that catches JavaScript errors anywhere in the
 * child component tree and displays a fallback UI instead of crashing.
 * 
 * This is a React best practice for production applications.
 * Note: Error boundaries must be class components (hooks not supported).
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  /**
   * Static method called when an error is thrown
   * Updates state to trigger fallback UI render
   */
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  /**
   * Lifecycle method called after an error has been thrown
   * Used for logging error details
   */
  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    
    // Log error to console in development
    // In production, you would send this to an error tracking service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  /**
   * Reset error state to allow retry
   */
  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI when error occurs
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            {/* Error Icon */}
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg 
                className="w-8 h-8 text-red-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                />
              </svg>
            </div>
            
            {/* Error Message */}
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-6">
              An unexpected error occurred. Please refresh the page or try again.
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="btn-primary"
                aria-label="Refresh the page"
              >
                Refresh Page
              </button>
              <button
                onClick={this.handleRetry}
                className="btn-secondary"
                aria-label="Try again without refreshing"
              >
                Try Again
              </button>
            </div>
            
            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Error Details (Development Only)
                </summary>
                <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto max-h-40">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    // Render children normally when no error
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  /** Child components to render */
  children: PropTypes.node.isRequired
};

export default ErrorBoundary;
