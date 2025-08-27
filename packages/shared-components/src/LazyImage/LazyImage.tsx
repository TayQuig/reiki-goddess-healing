import React, { useState, useEffect } from "react";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";

export interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  placeholderColor?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Lazy loading image component with loading states
 * Uses intersection observer to only load images when they're about to enter viewport
 */
export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = "",
  style = {},
  placeholderColor = "#E5E5E5",
  onLoad,
  onError,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | undefined>();
  const { ref, isVisible } = useIntersectionObserver({
    threshold: 0.01,
    rootMargin: "100px",
  });

  useEffect(() => {
    if (isVisible && !imageSrc) {
      setImageSrc(src);
    }
  }, [isVisible, src, imageSrc]);

  const handleImageLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  const handleImageError = () => {
    setImageError(true);
    onError?.();
  };

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`relative overflow-hidden ${className}`}
      style={style}
    >
      {/* Placeholder/Loading State */}
      {!imageLoaded && !imageError && (
        <div
          className="absolute inset-0 animate-pulse"
          style={{ backgroundColor: placeholderColor }}
        >
          {/* Optional loading spinner */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        </div>
      )}

      {/* Error State */}
      {imageError && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ backgroundColor: placeholderColor }}
        >
          <div className="text-center text-gray-500">
            <svg
              className="w-12 h-12 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-xs">Failed to load image</p>
          </div>
        </div>
      )}

      {/* Actual Image */}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}
    </div>
  );
};
