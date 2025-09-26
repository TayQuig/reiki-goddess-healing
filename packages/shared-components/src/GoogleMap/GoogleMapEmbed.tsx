import React, { useState, useCallback, useEffect, useRef } from "react";
import type {
  GoogleMapEmbedProps,
  MapLoadingState,
  MapErrorState,
  RetryConfig,
} from "./GoogleMapEmbed.types";
import { MapLoadingSkeleton } from "./MapLoadingSkeleton";
import { useNetworkState } from "./useNetworkState";
import { buildEmbedUrl } from "@reiki-goddess/shared-utils";

/**
 * GoogleMapEmbed - Embeds Google Maps using iframe with fallback support
 *
 * Features:
 * - No API key required (uses Embed API)
 * - Responsive design with loading states
 * - Graceful fallback to static image on error
 * - Full accessibility support
 * - Sanitized input to prevent injection attacks
 */
// Extended props interface for enhanced error handling
interface EnhancedGoogleMapEmbedProps extends GoogleMapEmbedProps {
  /** Retry configuration for error recovery */
  retryConfig?: RetryConfig;
  /** Timeout in milliseconds for map loading */
  timeout?: number;
  /** Callback when errors occur */
  onError?: (error: MapErrorState) => void;
  /** Callback when map loads successfully */
  onLoad?: () => void;
}

export const GoogleMapEmbed: React.FC<EnhancedGoogleMapEmbedProps> = ({
  address,
  width = "100%",
  height = 598,
  zoom = 15,
  mapType = "roadmap",
  className = "",
  loading = "lazy",
  fallbackImageUrl,
  ariaLabel = "Google Maps location",
  title = "Google Maps",
  retryConfig,
  timeout = 10000,
  onError,
  onLoad,
}) => {
  const [loadingState, setLoadingState] = useState<MapLoadingState>({
    isLoading: false,
    hasError: false,
  });

  const [errorState, setErrorState] = useState<MapErrorState>({
    hasError: false,
    retryCount: 0,
  });

  // Network state monitoring
  const networkState = useNetworkState();

  // Refs for cleanup
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Default retry configuration
  const defaultRetryConfig: RetryConfig = {
    maxAttempts: 3,
    baseDelay: 1000,
    maxDelay: 8000,
    backoffMultiplier: 2,
    timeout: timeout,
  };

  const activeRetryConfig = retryConfig || defaultRetryConfig;

  // Get user-friendly error message based on error type and network state
  const getErrorMessage = useCallback(
    (errorType: MapErrorState["errorType"], isOnline: boolean): string => {
      if (!isOnline) {
        return "You appear to be offline. Please check your internet connection and try again.";
      }

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
    },
    []
  );

  // Calculate retry delay with exponential backoff
  const calculateRetryDelay = useCallback(
    (attempt: number): number => {
      const delay = Math.min(
        activeRetryConfig.baseDelay *
          Math.pow(activeRetryConfig.backoffMultiplier, attempt),
        activeRetryConfig.maxDelay
      );
      return delay;
    },
    [activeRetryConfig]
  );

  // Sanitize address input to prevent injection attacks
  const sanitizeAddress = useCallback((addr: string): string => {
    return addr
      .replace(/[<>]/g, "") // Remove potential HTML tags
      .replace(/javascript:/gi, "") // Remove javascript: protocol
      .replace(/data:/gi, "") // Remove data: protocol
      .replace(/alert/gi, "") // Remove alert calls
      .replace(/script/gi, "") // Remove script references
      .trim();
  }, []);

  // Generate Google Maps Embed URL using proper API format
  const generateMapUrl = useCallback(
    (addr: string): string => {
      const sanitizedAddress = sanitizeAddress(addr);

      // Get API key from environment variable if available
      const apiKey =
        typeof window !== "undefined"
          ? (window as any).import?.meta?.env?.VITE_GOOGLE_MAPS_API_KEY ||
            import.meta.env?.VITE_GOOGLE_MAPS_API_KEY
          : undefined;

      // Use the proper Google Maps Embed API v1/place endpoint
      // This format ensures the map displays with a pin at the location
      try {
        return buildEmbedUrl({
          query: sanitizedAddress,
          zoom: zoom,
          maptype: mapType,
          key: apiKey,
        });
      } catch (error) {
        // Fallback to basic format if buildEmbedUrl fails
        console.warn(
          "Failed to build embed URL, using fallback format:",
          error
        );
        const baseUrl = "https://www.google.com/maps/embed/v1/place";
        const params = new URLSearchParams({
          q: sanitizedAddress,
          zoom: zoom.toString(),
        });
        if (apiKey) {
          params.set("key", apiKey);
        }
        return `${baseUrl}?${params.toString()}`;
      }
    },
    [sanitizeAddress, zoom, mapType]
  );

  // Enhanced error handling with categorization
  const handleError = useCallback(
    (errorType: MapErrorState["errorType"] = "unknown", details?: string) => {
      const now = new Date();
      const newErrorState: MapErrorState = {
        hasError: true,
        errorType,
        message: getErrorMessage(errorType, networkState.isOnline),
        details: details || `Map load failed at ${now.toISOString()}`,
        retryCount: errorState.retryCount,
        timestamp: now,
        isRecoverable:
          errorType !== "config" &&
          errorState.retryCount < activeRetryConfig.maxAttempts,
      };

      setErrorState(newErrorState);
      setLoadingState({
        isLoading: false,
        hasError: true,
        errorMessage: newErrorState.message,
      });
      onError?.(newErrorState);

      // Log error for monitoring
      console.error("[GoogleMapEmbed] Error:", {
        type: errorType,
        message: newErrorState.message,
        retryCount: errorState.retryCount,
        address: sanitizeAddress(address),
      });
    },
    [
      errorState.retryCount,
      activeRetryConfig.maxAttempts,
      networkState.isOnline,
      address,
      onError,
    ]
  );

  // Handle iframe load success
  const handleLoad = useCallback(() => {
    // Clear any existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setLoadingState({ isLoading: false, hasError: false });
    setErrorState({ hasError: false, retryCount: errorState.retryCount });
    onLoad?.();
  }, [errorState.retryCount, onLoad]);

  // Handle iframe load failure
  const handleIframeError = useCallback(() => {
    const errorType = networkState.isOnline ? "timeout" : "network";
    handleError(errorType, "Iframe failed to load");
  }, [networkState.isOnline, handleError]);

  // Retry functionality with exponential backoff
  const handleRetry = useCallback(() => {
    if (errorState.retryCount >= activeRetryConfig.maxAttempts) {
      return;
    }

    const delay = calculateRetryDelay(errorState.retryCount);

    setLoadingState({ isLoading: true, hasError: false });
    setErrorState((prev) => ({ ...prev, hasError: false }));

    retryTimeoutRef.current = setTimeout(() => {
      setErrorState((prev) => ({ ...prev, retryCount: prev.retryCount + 1 }));
    }, delay);
  }, [
    errorState.retryCount,
    activeRetryConfig.maxAttempts,
    calculateRetryDelay,
  ]);

  // Reset error state
  const resetErrorState = useCallback(() => {
    setErrorState({ hasError: false, retryCount: 0 });
    setLoadingState({ isLoading: false, hasError: false });
  }, []);

  // Start loading when component mounts or address changes
  useEffect(() => {
    setLoadingState({ isLoading: true, hasError: false });
    setErrorState({ hasError: false, retryCount: 0 });

    // Set up timeout for loading
    timeoutRef.current = setTimeout(() => {
      if (loadingState.isLoading) {
        handleError("timeout", "Map loading timed out");
      }
    }, activeRetryConfig.timeout);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [address, activeRetryConfig.timeout]);

  // Auto-retry when network connection is restored
  useEffect(() => {
    if (
      networkState.wasOffline &&
      networkState.isOnline &&
      errorState.hasError
    ) {
      console.log("[GoogleMapEmbed] Network restored, auto-retrying...");
      handleRetry();
    }
  }, [
    networkState.wasOffline,
    networkState.isOnline,
    errorState.hasError,
    handleRetry,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  const mapUrl = generateMapUrl(address);
  const mapWidth = typeof width === "number" ? `${width}px` : width;
  const mapHeight = typeof height === "number" ? `${height}px` : height;

  // Show offline state with specific messaging
  if (!networkState.isOnline) {
    return (
      <div
        className={`relative bg-gray-100 rounded-lg flex items-center justify-center ${className}`}
        style={{ width: mapWidth, height: mapHeight }}
        role="alert"
        aria-live="polite"
      >
        <div className="text-center p-8">
          <div className="mb-4">
            <svg
              className="w-16 h-16 mx-auto text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.18l.09.83a7.96 7.96 0 00.908 4.046l.708 1.133a3.016 3.016 0 002.61 1.511h1.2c.71 0 1.386.298 1.858.817l.818.9a3.016 3.016 0 003.097.81l1.124-.35a7.96 7.96 0 004.046.908l.83.09V12l-.83.09a7.96 7.96 0 00-4.046.908l-1.124.35a3.016 3.016 0 01-3.097-.81l-.818-.9A3.016 3.016 0 0010.828 11H9.627c-.71 0-1.386-.298-1.858-.817l-.818-.9A3.016 3.016 0 004.354 8.473l-1.124.35A7.96 7.96 0 00.322 11.91L2.18 12l.83-.09a7.96 7.96 0 00.908-4.046l.35-1.124a3.016 3.016 0 01.81-3.097l.9-.818c.52-.472.817-1.148.817-1.858V.827c0-.71.298-1.386.817-1.858l.9-.818A3.016 3.016 0 019.273-.946l1.124-.35a7.96 7.96 0 014.046-.908L12 2.18z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            You&apos;re offline
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Google Maps needs an internet connection to load. Please check your
            connection and try again.
          </p>
          <p className="text-xs text-gray-500">
            Location: {sanitizeAddress(address)}
          </p>
        </div>
      </div>
    );
  }

  // Render fallback when error occurs and fallback image is provided
  if (errorState.hasError && fallbackImageUrl) {
    return (
      <div
        className={`relative ${className}`}
        style={{ width: mapWidth, height: mapHeight }}
      >
        <img
          src={fallbackImageUrl}
          alt={ariaLabel}
          className="w-full h-full object-cover rounded-lg"
          onError={() => console.warn("Fallback image also failed to load")}
        />
        {/* Error overlay with accessibility and retry */}
        <div
          className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center"
          role="alert"
          aria-live="polite"
        >
          <div className="text-white text-center p-4">
            <p className="font-medium mb-2">Map temporarily unavailable</p>
            <p className="text-sm opacity-90 mb-4">
              {sanitizeAddress(address)}
            </p>

            {/* Retry button if recoverable */}
            {errorState.isRecoverable &&
              errorState.retryCount < activeRetryConfig.maxAttempts && (
                <button
                  onClick={handleRetry}
                  className="inline-flex items-center px-3 py-1 border border-white border-opacity-50 text-sm font-medium rounded text-white hover:bg-white hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                  aria-describedby="fallback-retry-description"
                >
                  Try Again ({errorState.retryCount + 1}/
                  {activeRetryConfig.maxAttempts})
                </button>
              )}

            <div id="fallback-retry-description" className="sr-only">
              Retry loading the Google Maps component. Current attempt{" "}
              {errorState.retryCount + 1} of {activeRetryConfig.maxAttempts}.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render error state without fallback image
  if (errorState.hasError && !fallbackImageUrl) {
    return (
      <div
        className={`relative bg-gray-100 rounded-lg flex items-center justify-center ${className}`}
        style={{ width: mapWidth, height: mapHeight }}
        role="alert"
        aria-live="polite"
      >
        <div className="text-center p-8">
          <div className="mb-4">
            <svg
              className="w-16 h-16 mx-auto text-red-400"
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Map unavailable
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {errorState.message || "Unable to load map for:"}{" "}
            {sanitizeAddress(address)}
          </p>

          {/* Retry controls based on error state */}
          {errorState.isRecoverable &&
            errorState.retryCount < activeRetryConfig.maxAttempts && (
              <div className="space-y-3">
                <button
                  onClick={handleRetry}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  aria-describedby="error-retry-description"
                >
                  Try Again ({errorState.retryCount + 1}/
                  {activeRetryConfig.maxAttempts})
                </button>
                <div id="error-retry-description" className="sr-only">
                  Retry loading the Google Maps component. Current attempt{" "}
                  {errorState.retryCount + 1} of {activeRetryConfig.maxAttempts}
                  .
                </div>
              </div>
            )}

          {/* Max attempts reached */}
          {errorState.retryCount >= activeRetryConfig.maxAttempts && (
            <div className="space-y-3">
              <p className="text-sm text-gray-500">
                Unable to load after {activeRetryConfig.maxAttempts} attempts.
              </p>
              <button
                onClick={resetErrorState}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Reset and Try Again
              </button>
            </div>
          )}

          {/* Non-recoverable error */}
          {!errorState.isRecoverable && (
            <button
              onClick={resetErrorState}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Refresh Map
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative ${className}`}
      style={{ width: mapWidth, height: mapHeight }}
    >
      {/* Enhanced Loading skeleton */}
      {loadingState.isLoading && (
        <MapLoadingSkeleton
          width={width}
          height={height}
          loadingMessage="Loading Google Maps..."
          animated={true}
          className="absolute inset-0 z-10"
        />
      )}

      {/* Map iframe */}
      <iframe
        ref={iframeRef}
        src={mapUrl}
        width="100%"
        height="100%"
        style={{
          border: 0,
          borderRadius: "8px",
          opacity: loadingState.isLoading ? 0 : 1,
          transition: "opacity 0.3s ease-in-out",
        }}
        allowFullScreen
        loading={loading}
        referrerPolicy="no-referrer-when-downgrade"
        title={title}
        aria-label={ariaLabel}
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        onLoad={handleLoad}
        onError={handleIframeError}
        className="rounded-lg"
      />

      {/* Enhanced text alternative for screen readers */}
      <div className="sr-only">
        {loadingState.isLoading
          ? `Loading interactive map for ${sanitizeAddress(address)}. Please wait...`
          : `Interactive map showing the location: ${sanitizeAddress(address)}. Use the keyboard navigation to interact with the map controls. Press Tab to navigate through the map interface. ${errorState.hasError ? `Map failed to load: ${errorState.message}` : ""}`}
      </div>

      {/* Network status indicator for development/debugging */}
      {process.env.NODE_ENV === "development" && (
        <div className="absolute top-2 left-2 text-xs bg-black bg-opacity-50 text-white px-2 py-1 rounded">
          {networkState.isOnline ? "🟢 Online" : "🔴 Offline"}
          {networkState.wasOffline && " (Recovered)"}
          {errorState.retryCount > 0 && ` | Retries: ${errorState.retryCount}`}
        </div>
      )}
    </div>
  );
};
