import React from "react";

interface MapLoadingSkeletonProps {
  /** Width of the skeleton (CSS value or number for pixels) */
  width?: string | number;
  /** Height of the skeleton (CSS value or number for pixels) */
  height?: string | number;
  /** Additional CSS classes */
  className?: string;
  /** Loading message for screen readers */
  loadingMessage?: string;
  /** Whether to show pulse animation */
  animated?: boolean;
}

/**
 * MapLoadingSkeleton - Loading state component for Google Maps
 *
 * Features:
 * - Matches the exact 598px height requirement
 * - Smooth animations and transitions
 * - Fully accessible with screen reader support
 * - Responsive design with fallback dimensions
 * - Customizable appearance and messaging
 */
export const MapLoadingSkeleton: React.FC<MapLoadingSkeletonProps> = ({
  width = "100%",
  height = 598,
  className = "",
  loadingMessage = "Loading Google Maps...",
  animated = true,
}) => {
  const skeletonWidth = typeof width === "number" ? `${width}px` : width;
  const skeletonHeight = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      className={`relative bg-gray-200 rounded-lg overflow-hidden ${className}`}
      style={{ width: skeletonWidth, height: skeletonHeight }}
      role="status"
      aria-label={loadingMessage}
      aria-live="polite"
    >
      {/* Animated pulse overlay */}
      {animated && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse" />
      )}

      {/* Shimmer effect */}
      {animated && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-50 shimmer-animation" />
      )}

      {/* Map placeholder structure */}
      <div className="absolute inset-0 p-6">
        {/* Mock map controls (top-right) */}
        <div className="absolute top-4 right-4 space-y-2">
          <div className="w-10 h-10 bg-gray-300 rounded shadow-sm" />
          <div className="w-10 h-10 bg-gray-300 rounded shadow-sm" />
        </div>

        {/* Mock zoom controls (bottom-right) */}
        <div className="absolute bottom-16 right-4 space-y-1">
          <div className="w-10 h-10 bg-gray-300 rounded shadow-sm" />
          <div className="w-10 h-10 bg-gray-300 rounded shadow-sm" />
        </div>

        {/* Mock street view control (bottom-right corner) */}
        <div className="absolute bottom-4 right-4">
          <div className="w-12 h-8 bg-gray-300 rounded shadow-sm" />
        </div>

        {/* Mock Google logo (bottom-left) */}
        <div className="absolute bottom-4 left-4">
          <div className="w-16 h-6 bg-gray-300 rounded" />
        </div>

        {/* Central loading indicator */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            {/* Spinning loader */}
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-400 border-t-blue-600 mb-4" />

            {/* Loading text */}
            <p className="text-gray-600 text-sm font-medium">
              {loadingMessage}
            </p>

            {/* Progress dots */}
            <div className="flex justify-center mt-3 space-x-1">
              <div
                className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"
                style={{ animationDelay: "0ms" }}
              />
              <div
                className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"
                style={{ animationDelay: "200ms" }}
              />
              <div
                className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"
                style={{ animationDelay: "400ms" }}
              />
            </div>
          </div>
        </div>

        {/* Mock location marker in center-left area */}
        <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-6 h-6 bg-red-400 rounded-full shadow-lg animate-pulse" />
        </div>

        {/* Mock roads/paths */}
        <div className="absolute inset-0">
          {/* Horizontal road */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-350 transform -translate-y-1/2" />
          {/* Vertical road */}
          <div className="absolute left-1/3 top-0 bottom-0 w-1 bg-gray-350 transform -translate-x-1/2" />
        </div>
      </div>

      {/* Screen reader only text */}
      <div className="sr-only">
        {loadingMessage} Please wait while the interactive map loads. The map
        will show the location in Roy, Washington when ready.
      </div>

      {/* Custom styles for shimmer animation - using CSS-in-JS */}
      <style>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .shimmer-animation {
          animation: shimmer 2s infinite;
          background-size: 200% 100%;
        }
      `}</style>
    </div>
  );
};
