/**
 * Map utilities for The Reiki Goddess Healing project
 *
 * This module provides utilities for:
 * - Address encoding and sanitization
 * - Coordinate validation and calculations
 * - Google Maps URL construction
 * - Map configuration management
 *
 * All functions are pure and side-effect free for easy testing.
 */

// Type exports
export type {
  Coordinates,
  AddressComponents,
  MapBounds,
  EmbedParams,
  MapOptions,
} from "./types";

// Address utilities
export {
  encodeAddress,
  sanitizeAddress,
  parseAddressComponents,
  validateAddress,
  formatAddressComponents,
} from "./addressUtils";

// Coordinate utilities
export {
  validateCoordinates,
  validateCoordinatesObject,
  getDistance,
  getBounds,
  getBoundsCenter,
  isWithinBounds,
  formatCoordinates,
} from "./coordinateUtils";

// Map configuration utilities
export {
  buildEmbedUrl,
  buildDirectionsUrl,
  buildSearchUrl,
  getDefaultMapOptions,
  getMapStyles,
  validateMapConfig,
} from "./mapConfigUtils";
