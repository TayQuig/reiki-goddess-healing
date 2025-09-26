/**
 * Coordinate utilities for map operations
 * The Reiki Goddess Healing project
 */

import type { Coordinates, MapBounds } from "./types";

/**
 * Validate latitude and longitude coordinate ranges
 * Ensures coordinates are within valid GPS bounds
 *
 * @param lat - Latitude in decimal degrees
 * @param lng - Longitude in decimal degrees
 * @returns True if coordinates are within valid ranges
 *
 * @example
 * ```typescript
 * validateCoordinates(47.0451, -122.4689) // true (Roy, WA)
 * validateCoordinates(91, 0) // false (latitude out of range)
 * validateCoordinates(0, 181) // false (longitude out of range)
 * ```
 */
export const validateCoordinates = (lat: number, lng: number): boolean => {
  // Check if values are numbers
  if (typeof lat !== "number" || typeof lng !== "number") {
    return false;
  }

  // Check for NaN or infinite values
  if (!isFinite(lat) || !isFinite(lng)) {
    return false;
  }

  // Validate latitude range: -90 to 90 degrees
  if (lat < -90 || lat > 90) {
    return false;
  }

  // Validate longitude range: -180 to 180 degrees
  if (lng < -180 || lng > 180) {
    return false;
  }

  return true;
};

/**
 * Validate coordinates object
 *
 * @param coordinates - Coordinates object to validate
 * @returns True if coordinates object is valid
 *
 * @example
 * ```typescript
 * validateCoordinatesObject({ lat: 47.0451, lng: -122.4689 }) // true
 * validateCoordinatesObject({ lat: 91, lng: 0 }) // false
 * validateCoordinatesObject(null) // false
 * ```
 */
export const validateCoordinatesObject = (
  coordinates: unknown
): coordinates is Coordinates => {
  if (!coordinates || typeof coordinates !== "object") {
    return false;
  }

  const coords = coordinates as Record<string, unknown>;

  return (
    typeof coords.lat === "number" &&
    typeof coords.lng === "number" &&
    validateCoordinates(coords.lat, coords.lng)
  );
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers with high precision
 *
 * @param coord1 - First coordinate point
 * @param coord2 - Second coordinate point
 * @returns Distance in kilometers
 *
 * @example
 * ```typescript
 * const seattle = { lat: 47.6062, lng: -122.3321 };
 * const roy = { lat: 47.0451, lng: -122.4689 };
 * getDistance(seattle, roy) // ~62.8 km
 * ```
 */
export const getDistance = (
  coord1: Coordinates,
  coord2: Coordinates
): number => {
  // Validate input coordinates
  if (
    !validateCoordinatesObject(coord1) ||
    !validateCoordinatesObject(coord2)
  ) {
    throw new Error("Invalid coordinates provided");
  }

  const R = 6371; // Earth's radius in kilometers

  // Convert degrees to radians
  const lat1Rad = (coord1.lat * Math.PI) / 180;
  const lat2Rad = (coord2.lat * Math.PI) / 180;
  const deltaLatRad = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const deltaLngRad = ((coord2.lng - coord1.lng) * Math.PI) / 180;

  // Haversine formula
  const a =
    Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(deltaLngRad / 2) *
      Math.sin(deltaLngRad / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Distance in kilometers
  const distance = R * c;

  // Round to reasonable precision (3 decimal places = ~1 meter accuracy)
  return Math.round(distance * 1000) / 1000;
};

/**
 * Calculate bounding box around a center point with given radius
 * Creates rectangular bounds that encompass a circular area
 *
 * @param center - Center coordinates
 * @param radiusKm - Radius in kilometers
 * @returns Bounding box coordinates
 *
 * @example
 * ```typescript
 * const roy = { lat: 47.0451, lng: -122.4689 };
 * getBounds(roy, 10) // 10km radius around Roy, WA
 * // Returns: {
 * //   northeast: { lat: 47.135, lng: -122.33 },
 * //   southwest: { lat: 46.955, lng: -122.607 }
 * // }
 * ```
 */
export const getBounds = (center: Coordinates, radiusKm: number): MapBounds => {
  // Validate inputs
  if (!validateCoordinatesObject(center)) {
    throw new Error("Invalid center coordinates provided");
  }

  if (typeof radiusKm !== "number" || !isFinite(radiusKm) || radiusKm < 0) {
    throw new Error("Invalid radius provided. Must be a positive number.");
  }

  // Earth's radius in kilometers
  const R = 6371;

  // Convert center to radians
  const latRad = (center.lat * Math.PI) / 180;

  // Calculate angular distance
  const angularDistance = radiusKm / R;

  // Calculate latitude bounds (simpler since latitude lines are parallel)
  const latDelta = (angularDistance * 180) / Math.PI;
  const minLat = center.lat - latDelta;
  const maxLat = center.lat + latDelta;

  // Calculate longitude bounds (accounts for convergence near poles)
  const lngDelta = (angularDistance * 180) / (Math.PI * Math.cos(latRad));
  const minLng = center.lng - lngDelta;
  const maxLng = center.lng + lngDelta;

  // Ensure bounds stay within valid coordinate ranges
  const southwest: Coordinates = {
    lat: Math.max(-90, minLat),
    lng: Math.max(-180, minLng),
  };

  const northeast: Coordinates = {
    lat: Math.min(90, maxLat),
    lng: Math.min(180, maxLng),
  };

  return {
    southwest,
    northeast,
  };
};

/**
 * Calculate the center point of a bounding box
 *
 * @param bounds - Map bounds object
 * @returns Center coordinates of the bounds
 *
 * @example
 * ```typescript
 * const bounds = {
 *   southwest: { lat: 47.0, lng: -123.0 },
 *   northeast: { lat: 47.1, lng: -122.0 }
 * };
 * getBoundsCenter(bounds) // { lat: 47.05, lng: -122.5 }
 * ```
 */
export const getBoundsCenter = (bounds: MapBounds): Coordinates => {
  if (
    !bounds ||
    !validateCoordinatesObject(bounds.southwest) ||
    !validateCoordinatesObject(bounds.northeast)
  ) {
    throw new Error("Invalid bounds provided");
  }

  return {
    lat: (bounds.southwest.lat + bounds.northeast.lat) / 2,
    lng: (bounds.southwest.lng + bounds.northeast.lng) / 2,
  };
};

/**
 * Check if coordinates are within given bounds
 *
 * @param coordinates - Point to check
 * @param bounds - Bounding box
 * @returns True if coordinates are within bounds
 *
 * @example
 * ```typescript
 * const point = { lat: 47.05, lng: -122.5 };
 * const bounds = {
 *   southwest: { lat: 47.0, lng: -123.0 },
 *   northeast: { lat: 47.1, lng: -122.0 }
 * };
 * isWithinBounds(point, bounds) // true
 * ```
 */
export const isWithinBounds = (
  coordinates: Coordinates,
  bounds: MapBounds
): boolean => {
  if (!validateCoordinatesObject(coordinates)) {
    return false;
  }

  if (
    !bounds ||
    !validateCoordinatesObject(bounds.southwest) ||
    !validateCoordinatesObject(bounds.northeast)
  ) {
    return false;
  }

  return (
    coordinates.lat >= bounds.southwest.lat &&
    coordinates.lat <= bounds.northeast.lat &&
    coordinates.lng >= bounds.southwest.lng &&
    coordinates.lng <= bounds.northeast.lng
  );
};

/**
 * Format coordinates as a human-readable string
 *
 * @param coordinates - Coordinates to format
 * @param precision - Number of decimal places (default: 4)
 * @returns Formatted coordinate string
 *
 * @example
 * ```typescript
 * formatCoordinates({ lat: 47.0451, lng: -122.4689 }) // "47.0451, -122.4689"
 * formatCoordinates({ lat: 47.0451, lng: -122.4689 }, 2) // "47.05, -122.47"
 * ```
 */
export const formatCoordinates = (
  coordinates: Coordinates,
  precision: number = 4
): string => {
  if (!validateCoordinatesObject(coordinates)) {
    return "Invalid coordinates";
  }

  if (typeof precision !== "number" || precision < 0 || precision > 10) {
    precision = 4;
  }

  return `${coordinates.lat.toFixed(precision)}, ${coordinates.lng.toFixed(precision)}`;
};
