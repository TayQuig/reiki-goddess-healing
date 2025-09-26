/**
 * Map configuration utilities for Google Maps integration
 * The Reiki Goddess Healing project
 */

import type { EmbedParams, MapOptions } from "./types";
import { validateCoordinatesObject } from "./coordinateUtils";
import { sanitizeAddress } from "./addressUtils";

/**
 * Build Google Maps Embed URL with proper parameter encoding and validation
 * Constructs URLs for the free Google Maps Embed API
 *
 * @param params - Parameters for the embed URL
 * @returns Complete Google Maps Embed URL
 *
 * @example
 * ```typescript
 * buildEmbedUrl({ query: "Roy, WA" })
 * // "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2965.0824050173574..."
 *
 * buildEmbedUrl({
 *   center: { lat: 47.0451, lng: -122.4689 },
 *   zoom: 15,
 *   maptype: "satellite"
 * })
 * ```
 */
export const buildEmbedUrl = (params: EmbedParams): string => {
  if (!params) {
    throw new Error("Parameters are required for building embed URL");
  }

  const baseUrl = "https://www.google.com/maps/embed/v1/place";
  const urlParams = new URLSearchParams();

  // Add API key if provided
  if (params.key) {
    urlParams.set("key", params.key);
  }

  // Handle query vs coordinates
  if (params.query) {
    const sanitizedQuery = sanitizeAddress(params.query);
    if (!sanitizedQuery || sanitizedQuery.trim().length === 0) {
      throw new Error("Invalid or empty query provided");
    }
    urlParams.set("q", sanitizedQuery);
  } else if (params.center && validateCoordinatesObject(params.center)) {
    urlParams.set("center", `${params.center.lat},${params.center.lng}`);
  } else {
    throw new Error(
      "Either query or valid center coordinates must be provided"
    );
  }

  // Add optional parameters with validation
  if (params.zoom !== undefined) {
    if (
      typeof params.zoom === "number" &&
      params.zoom >= 1 &&
      params.zoom <= 21
    ) {
      urlParams.set("zoom", params.zoom.toString());
    } else {
      console.warn("Invalid zoom level provided. Must be between 1 and 21.");
    }
  }

  if (params.maptype) {
    const validMapTypes = ["roadmap", "satellite", "hybrid", "terrain"];
    if (validMapTypes.includes(params.maptype)) {
      urlParams.set("maptype", params.maptype);
    } else {
      console.warn(`Invalid map type: ${params.maptype}. Using default.`);
    }
  }

  if (params.language) {
    // Basic language code validation (2-5 characters, letters and hyphens)
    if (/^[a-z]{2}(-[a-z]{2,3})?$/i.test(params.language)) {
      urlParams.set("language", params.language.toLowerCase());
    } else {
      console.warn(`Invalid language code: ${params.language}`);
    }
  }

  if (params.region) {
    // Region code validation (2 uppercase letters)
    if (/^[A-Z]{2}$/.test(params.region)) {
      urlParams.set("region", params.region);
    } else {
      console.warn(`Invalid region code: ${params.region}`);
    }
  }

  return `${baseUrl}?${urlParams.toString()}`;
};

/**
 * Build Google Maps directions URL for opening in new tab/window
 * Creates URLs that open Google Maps with turn-by-turn directions
 *
 * @param from - Starting location (address string)
 * @param to - Destination location (address string)
 * @param travelMode - Mode of transportation (default: "driving")
 * @returns Complete Google Maps directions URL
 *
 * @example
 * ```typescript
 * buildDirectionsUrl("Seattle, WA", "Roy, WA")
 * // "https://www.google.com/maps/dir/Seattle%2C%20WA/Roy%2C%20WA"
 *
 * buildDirectionsUrl("Current Location", "123 Main St, Roy, WA", "walking")
 * // "https://www.google.com/maps/dir/Current%20Location/123%20Main%20St%2C%20Roy%2C%20WA/@travelmode=walking"
 * ```
 */
export const buildDirectionsUrl = (
  from: string,
  to: string,
  travelMode: "driving" | "walking" | "bicycling" | "transit" = "driving"
): string => {
  if (!from || !to || typeof from !== "string" || typeof to !== "string") {
    throw new Error("Both from and to addresses are required");
  }

  const sanitizedFrom = sanitizeAddress(from);
  const sanitizedTo = sanitizeAddress(to);

  if (
    !sanitizedFrom ||
    !sanitizedTo ||
    sanitizedFrom.trim().length === 0 ||
    sanitizedTo.trim().length === 0
  ) {
    throw new Error("Invalid addresses provided");
  }

  const baseUrl = "https://www.google.com/maps/dir";
  const encodedFrom = encodeURIComponent(sanitizedFrom);
  const encodedTo = encodeURIComponent(sanitizedTo);

  let url = `${baseUrl}/${encodedFrom}/${encodedTo}`;

  // Add travel mode if not default
  if (travelMode !== "driving") {
    const validModes = ["walking", "bicycling", "transit"];
    if (validModes.includes(travelMode)) {
      url += `/@travelmode=${travelMode}`;
    }
  }

  return url;
};

/**
 * Build a simple Google Maps search URL
 *
 * @param query - Search query
 * @returns Google Maps search URL
 *
 * @example
 * ```typescript
 * buildSearchUrl("coffee shops near Roy, WA")
 * // "https://www.google.com/maps/search/coffee%20shops%20near%20Roy%2C%20WA"
 * ```
 */
export const buildSearchUrl = (query: string): string => {
  if (!query || typeof query !== "string" || query.trim().length === 0) {
    throw new Error("Search query is required");
  }

  const sanitizedQuery = sanitizeAddress(query);
  if (!sanitizedQuery || sanitizedQuery.trim().length === 0) {
    throw new Error("Invalid search query provided");
  }

  const baseUrl = "https://www.google.com/maps/search";
  const encodedQuery = encodeURIComponent(sanitizedQuery);

  return `${baseUrl}/${encodedQuery}`;
};

/**
 * Get default map options for consistent map configuration
 * Provides sensible defaults for Google Maps JavaScript API
 *
 * @param customOptions - Optional overrides for default options
 * @returns Complete map options object
 *
 * @example
 * ```typescript
 * const options = getDefaultMapOptions();
 * // Returns default options for Roy, WA area
 *
 * const customOptions = getDefaultMapOptions({
 *   zoom: 18,
 *   center: { lat: 47.6062, lng: -122.3321 } // Seattle
 * });
 * ```
 */
export const getDefaultMapOptions = (
  customOptions?: Partial<MapOptions>
): MapOptions => {
  const defaults: MapOptions = {
    // Default to Roy, Washington area (Reiki Goddess Healing location)
    center: {
      lat: 47.0451,
      lng: -122.4689,
    },
    zoom: 15, // Good for showing local area with street details
    mapTypeId: "roadmap", // Standard road map view
    disableDefaultUI: false, // Keep standard controls
    zoomControl: true, // Allow zoom in/out
    streetViewControl: true, // Allow street view
    fullscreenControl: true, // Allow fullscreen mode
  };

  // Validate and merge custom options
  if (customOptions) {
    // Validate zoom level
    if (customOptions.zoom !== undefined) {
      if (
        typeof customOptions.zoom === "number" &&
        customOptions.zoom >= 1 &&
        customOptions.zoom <= 21
      ) {
        defaults.zoom = customOptions.zoom;
      } else {
        console.warn("Invalid zoom level in custom options. Using default.");
      }
    }

    // Validate center coordinates
    if (
      customOptions.center &&
      validateCoordinatesObject(customOptions.center)
    ) {
      defaults.center = customOptions.center;
    } else if (customOptions.center) {
      console.warn(
        "Invalid center coordinates in custom options. Using default."
      );
    }

    // Merge other valid options
    const validStringProps = ["mapTypeId"] as const;
    const validBooleanProps = [
      "disableDefaultUI",
      "zoomControl",
      "streetViewControl",
      "fullscreenControl",
    ] as const;

    validStringProps.forEach((prop) => {
      if (customOptions[prop] && typeof customOptions[prop] === "string") {
        defaults[prop] = customOptions[prop] as string;
      }
    });

    validBooleanProps.forEach((prop) => {
      if (
        customOptions[prop] !== undefined &&
        typeof customOptions[prop] === "boolean"
      ) {
        defaults[prop] = customOptions[prop];
      }
    });
  }

  return defaults;
};

/**
 * Generate map style configuration for custom map themes
 * Returns style arrays for Google Maps JavaScript API
 *
 * @param theme - Theme name
 * @returns Map style array or undefined for default styling
 *
 * @example
 * ```typescript
 * const styles = getMapStyles("minimal");
 * const map = new google.maps.Map(element, {
 *   ...options,
 *   styles
 * });
 * ```
 */
export const getMapStyles = (
  theme: "default" | "minimal" | "dark" | "healing"
): any[] | undefined => {
  switch (theme) {
    case "minimal":
      return [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "transit",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ];

    case "dark":
      return [
        {
          elementType: "geometry",
          stylers: [{ color: "#242f3e" }],
        },
        {
          elementType: "labels.text.stroke",
          stylers: [{ color: "#242f3e" }],
        },
        {
          elementType: "labels.text.fill",
          stylers: [{ color: "#746855" }],
        },
      ];

    case "healing":
      // Soft, calming colors for a healing/wellness theme
      return [
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#a8d8d8" }], // Soft teal
        },
        {
          featureType: "landscape.natural",
          elementType: "geometry.fill",
          stylers: [{ color: "#e8f5e8" }], // Light green
        },
        {
          featureType: "poi.park",
          elementType: "geometry.fill",
          stylers: [{ color: "#d4f4d4" }], // Soft green for parks
        },
      ];

    case "default":
    default:
      return undefined; // Use Google's default styling
  }
};

/**
 * Validate map configuration parameters
 *
 * @param config - Map configuration to validate
 * @returns Validation result with errors if any
 *
 * @example
 * ```typescript
 * validateMapConfig({ zoom: 15, center: { lat: 47, lng: -122 } })
 * // { isValid: true, errors: [] }
 *
 * validateMapConfig({ zoom: 25, center: { lat: 91, lng: -122 } })
 * // { isValid: false, errors: ["Invalid zoom level", "Invalid latitude"] }
 * ```
 */
export const validateMapConfig = (
  config: Partial<MapOptions>
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (config.zoom !== undefined) {
    if (
      typeof config.zoom !== "number" ||
      config.zoom < 1 ||
      config.zoom > 21
    ) {
      errors.push("Invalid zoom level. Must be between 1 and 21.");
    }
  }

  if (config.center !== undefined) {
    if (!validateCoordinatesObject(config.center)) {
      errors.push("Invalid center coordinates.");
    }
  }

  if (config.mapTypeId !== undefined) {
    const validTypes = ["roadmap", "satellite", "hybrid", "terrain"];
    if (!validTypes.includes(config.mapTypeId)) {
      errors.push(
        "Invalid map type. Must be one of: roadmap, satellite, hybrid, terrain."
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
