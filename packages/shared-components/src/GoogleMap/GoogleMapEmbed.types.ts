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
