/**
 * TypeScript interfaces for GoogleMapEmbed component
 * The Reiki Goddess Healing project
 */

/** Component properties for GoogleMapEmbed */
export interface GoogleMapEmbedProps {
  /** The address or location to display on the map */
  address: string;
  /** Map width (CSS value or number for pixels) */
  width?: string | number;
  /** Map height (CSS value or number for pixels) */
  height?: string | number;
  /** Map zoom level (1-21, where 21 is most zoomed in) */
  zoom?: number;
  /** Map type for display */
  mapType?: "roadmap" | "satellite";
  /** Additional CSS classes */
  className?: string;
  /** Fallback image URL when map fails to load */
  fallbackImageUrl?: string;
  /** Loading behavior for the iframe */
  loading?: "lazy" | "eager";
  /** ARIA label for accessibility */
  ariaLabel?: string;
  /** Title attribute for iframe */
  title?: string;
}

/** Loading state management for the map component */
export interface MapLoadingState {
  /** Whether the map is currently loading */
  isLoading: boolean;
  /** Whether an error occurred during loading */
  hasError: boolean;
  /** Error message if hasError is true */
  errorMessage?: string;
}

/** Error state management interface for comprehensive error handling */
export interface MapErrorState {
  /** Whether an error occurred */
  hasError: boolean;
  /** The type of error that occurred */
  errorType?: "network" | "timeout" | "config" | "unknown";
  /** User-friendly error message */
  message?: string;
  /** Technical error details for logging (not shown to user) */
  details?: string;
  /** Number of retry attempts made */
  retryCount: number;
  /** Timestamp of when error occurred */
  timestamp?: Date;
  /** Whether the error is recoverable */
  isRecoverable?: boolean;
}

/** Retry strategy configuration interface */
export interface RetryConfig {
  /** Maximum number of retry attempts */
  maxAttempts: number;
  /** Base delay in milliseconds for exponential backoff */
  baseDelay: number;
  /** Maximum delay in milliseconds */
  maxDelay: number;
  /** Multiplier for exponential backoff */
  backoffMultiplier: number;
  /** Timeout in milliseconds for each attempt */
  timeout: number;
}

/** Network state interface for connection awareness */
export interface NetworkState {
  /** Whether the browser is online */
  isOnline: boolean;
  /** Connection type if available */
  connectionType?: string;
  /** Whether connection was recently restored */
  wasOffline?: boolean;
}
