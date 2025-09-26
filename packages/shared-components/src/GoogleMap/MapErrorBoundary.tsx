import React, { Component, ReactNode } from "react";
import type { MapErrorState, RetryConfig } from "./GoogleMapEmbed.types";

interface MapErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  retryConfig?: RetryConfig;
  className?: string;
}

interface MapErrorBoundaryState extends MapErrorState {
  retryKey: number;
  isRetrying: boolean;
}

/**
 * MapErrorBoundary - Specialized error boundary for Google Maps integration
 *
 * Features:
 * - Catches JavaScript errors in map components
 * - Implements exponential backoff retry strategy
 * - Provides user-friendly error messages
 * - Logs errors securely for monitoring
 * - Accessible error states and retry controls
 */
export class MapErrorBoundary extends Component<
  MapErrorBoundaryProps,
  MapErrorBoundaryState
> {
  private retryTimeoutId: NodeJS.Timeout | null = null;
  private readonly defaultRetryConfig: RetryConfig = {
    maxAttempts: 3,
    baseDelay: 1000,
    maxDelay: 8000,
    backoffMultiplier: 2,
    timeout: 10000,
  };

  constructor(props: MapErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      retryCount: 0,
      retryKey: 0,
      isRetrying: false,
    };
  }

  static getDerivedStateFromError(
    error: Error
  ): Partial<MapErrorBoundaryState> {
    // Analyze error to determine type and recoverability
    const errorType = MapErrorBoundary.categorizeError(error);
    const isRecoverable = errorType !== "config";

    return {
      hasError: true,
      errorType,
      message: MapErrorBoundary.getUserFriendlyMessage(errorType),
      details: error.message,
      timestamp: new Date(),
      isRecoverable,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error for monitoring (sanitized for security)
    this.logError(error, errorInfo);

    // Call optional error callback
    this.props.onError?.(error, errorInfo);
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  /**
   * Categorize error based on error message and stack trace
   */
  private static categorizeError(error: Error): MapErrorState["errorType"] {
    const message = error.message.toLowerCase();

    if (message.includes("network") || message.includes("fetch")) {
      return "network";
    }
    if (message.includes("timeout")) {
      return "timeout";
    }
    if (message.includes("invalid") || message.includes("config")) {
      return "config";
    }
    return "unknown";
  }

  /**
   * Get user-friendly error message based on error type
   */
  private static getUserFriendlyMessage(
    errorType: MapErrorState["errorType"]
  ): string {
    switch (errorType) {
      case "network":
        return "Unable to connect to Google Maps. Please check your internet connection.";
      case "timeout":
        return "The map is taking longer than expected to load. Please try again.";
      case "config":
        return "There's a configuration issue with the map. Please refresh the page.";
      default:
        return "Something went wrong while loading the map. Please try again.";
    }
  }

  /**
   * Log error securely for monitoring
   */
  private logError(error: Error, errorInfo: React.ErrorInfo) {
    // In production, this would send to monitoring service
    // For now, console.error with sanitized information
    const sanitizedError = {
      message: error.message,
      name: error.name,
      stack: error.stack?.substring(0, 500), // Limit stack trace length
      componentStack: errorInfo.componentStack?.substring(0, 500),
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    console.error("[MapErrorBoundary] Error caught:", sanitizedError);
  }

  /**
   * Calculate delay for exponential backoff
   */
  private calculateRetryDelay(attempt: number): number {
    const config = this.props.retryConfig || this.defaultRetryConfig;
    const delay = Math.min(
      config.baseDelay * Math.pow(config.backoffMultiplier, attempt),
      config.maxDelay
    );
    return delay;
  }

  /**
   * Handle retry attempt
   */
  private handleRetry = () => {
    const { retryCount } = this.state;
    const config = this.props.retryConfig || this.defaultRetryConfig;

    if (retryCount >= config.maxAttempts) {
      return; // Max attempts reached
    }

    this.setState({ isRetrying: true });

    const delay = this.calculateRetryDelay(retryCount);

    this.retryTimeoutId = setTimeout(() => {
      this.setState((prevState) => ({
        hasError: false,
        isRetrying: false,
        retryCount: prevState.retryCount + 1,
        retryKey: prevState.retryKey + 1, // Force re-render of children
        errorType: undefined,
        message: undefined,
        details: undefined,
        timestamp: undefined,
      }));
    }, delay);
  };

  /**
   * Reset error boundary state
   */
  private handleReset = () => {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }

    this.setState({
      hasError: false,
      isRetrying: false,
      retryCount: 0,
      retryKey: 0,
      errorType: undefined,
      message: undefined,
      details: undefined,
      timestamp: undefined,
    });
  };

  render() {
    const { children, fallback, className = "" } = this.props;
    const { hasError, message, retryCount, isRetrying, isRecoverable } =
      this.state;
    const config = this.props.retryConfig || this.defaultRetryConfig;

    if (hasError) {
      // Use custom fallback if provided
      if (fallback) {
        return <div className={className}>{fallback}</div>;
      }

      // Default error UI
      return (
        <div
          className={`flex items-center justify-center bg-gray-50 rounded-lg p-8 ${className}`}
          role="alert"
          aria-live="assertive"
        >
          <div className="text-center max-w-md">
            {/* Error Icon */}
            <div className="mb-4">
              <svg
                className="w-12 h-12 mx-auto text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>

            {/* Error Message */}
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Map Error
            </h3>
            <p className="text-sm text-gray-600 mb-6">{message}</p>

            {/* Retry Controls */}
            {isRecoverable && retryCount < config.maxAttempts && (
              <div className="space-y-3">
                <button
                  onClick={this.handleRetry}
                  disabled={isRetrying}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-describedby="retry-description"
                >
                  {isRetrying ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          className="opacity-25"
                        ></circle>
                        <path
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          className="opacity-75"
                        ></path>
                      </svg>
                      Retrying...
                    </>
                  ) : (
                    `Try Again ${retryCount > 0 ? `(${retryCount}/${config.maxAttempts})` : ""}`
                  )}
                </button>
                <div id="retry-description" className="sr-only">
                  Retry loading the Google Maps component. Attempt{" "}
                  {retryCount + 1} of {config.maxAttempts}.
                </div>
              </div>
            )}

            {/* Max Attempts Reached */}
            {retryCount >= config.maxAttempts && (
              <div className="space-y-3">
                <p className="text-sm text-gray-500">
                  Unable to load after {config.maxAttempts} attempts.
                </p>
                <button
                  onClick={this.handleReset}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Reset and Try Again
                </button>
              </div>
            )}

            {/* Non-recoverable Error */}
            {!isRecoverable && (
              <button
                onClick={this.handleReset}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Refresh Map
              </button>
            )}
          </div>
        </div>
      );
    }

    return <div key={this.state.retryKey}>{children}</div>;
  }
}
