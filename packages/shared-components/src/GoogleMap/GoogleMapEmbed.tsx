import React, { useState, useCallback } from "react";
import type {
  GoogleMapEmbedProps,
  MapLoadingState,
} from "./GoogleMapEmbed.types";

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
export const GoogleMapEmbed: React.FC<GoogleMapEmbedProps> = ({
  address,
  width = "100%",
  height = 598,
  className = "",
  loading = "lazy",
  fallbackImageUrl,
  ariaLabel = "Google Maps location",
  title = "Google Maps",
}) => {
  const [loadingState, setLoadingState] = useState<MapLoadingState>({
    isLoading: false,
    hasError: false,
  });

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

  // Generate Google Maps Embed URL (free API, no key required)
  const generateMapUrl = useCallback(
    (addr: string): string => {
      const sanitizedAddress = sanitizeAddress(addr);

      // Use Google Maps embed with simple query parameter format
      const baseUrl = "https://www.google.com/maps/embed";
      const params = new URLSearchParams({
        q: sanitizedAddress,
      });

      return `${baseUrl}?${params.toString()}`;
    },
    [sanitizeAddress]
  );

  // Handle iframe load success
  const handleLoad = useCallback(() => {
    setLoadingState({ isLoading: false, hasError: false });
  }, []);

  // Handle iframe load error
  const handleError = useCallback(() => {
    setLoadingState({
      isLoading: false,
      hasError: true,
      errorMessage:
        "Failed to load Google Maps. Please check your internet connection and try again.",
    });
  }, []);

  // Start loading when component mounts or address changes
  React.useEffect(() => {
    setLoadingState({ isLoading: true, hasError: false });
  }, [address]);

  const mapUrl = generateMapUrl(address);
  const mapWidth = typeof width === "number" ? `${width}px` : width;
  const mapHeight = typeof height === "number" ? `${height}px` : height;

  // Render fallback when error occurs and fallback image is provided
  if (loadingState.hasError && fallbackImageUrl) {
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
        {/* Error overlay with accessibility */}
        <div
          className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center"
          role="alert"
          aria-live="polite"
        >
          <div className="text-white text-center p-4">
            <p className="font-medium mb-2">Map temporarily unavailable</p>
            <p className="text-sm opacity-90">{sanitizeAddress(address)}</p>
          </div>
        </div>
      </div>
    );
  }

  // Render error state without fallback image
  if (loadingState.hasError && !fallbackImageUrl) {
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
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Map unavailable
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Unable to load map for: {sanitizeAddress(address)}
          </p>
          <button
            onClick={() =>
              setLoadingState({ isLoading: true, hasError: false })
            }
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative ${className}`}
      style={{ width: mapWidth, height: mapHeight }}
    >
      {/* Loading skeleton */}
      {loadingState.isLoading && (
        <div className="absolute inset-0 bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4" />
            <p className="text-gray-600 text-sm">Loading map...</p>
          </div>
        </div>
      )}

      {/* Map iframe */}
      <iframe
        src={mapUrl}
        width="100%"
        height="100%"
        style={{ border: 0, borderRadius: "8px" }}
        allowFullScreen
        loading={loading}
        referrerPolicy="no-referrer-when-downgrade"
        title={title}
        aria-label={ariaLabel}
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        onLoad={handleLoad}
        onError={handleError}
        className="rounded-lg"
      />

      {/* Text alternative for screen readers */}
      <div className="sr-only">
        Map showing the location: {sanitizeAddress(address)}. Use the keyboard
        navigation to interact with the map controls. Press Tab to navigate
        through the map interface.
      </div>
    </div>
  );
};
