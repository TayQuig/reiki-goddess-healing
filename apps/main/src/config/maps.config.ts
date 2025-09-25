/**
 * Google Maps Configuration Module
 *
 * Provides type-safe access to Google Maps environment variables
 * with proper validation and default values.
 */

/**
 * Interface defining the structure of Maps configuration
 */
export interface MapsConfig {
  /** Google Maps Embed API base URL for place embedding */
  embedUrl: string;
  /** Google Maps JavaScript API key (optional for Phase 2) */
  apiKey?: string;
  /** Business domain for map services */
  domain: string;
  /** Default zoom level for map display */
  defaultZoom: number;
  /** Default map center coordinates */
  defaultCenter: {
    lat: number;
    lng: number;
  };
  /** Business information for map display */
  business: {
    name: string;
    address: string;
  };
}

/**
 * Default configuration values
 */
const DEFAULT_CONFIG: Omit<MapsConfig, "apiKey"> = {
  embedUrl: "https://www.google.com/maps/embed/v1/place",
  domain: "maps.google.com",
  defaultZoom: 15,
  defaultCenter: {
    lat: 46.9899,
    lng: -122.5434,
  },
  business: {
    name: "The Reiki Goddess Healing",
    address: "123 Harmony Lane, Roy, WA 98580",
  },
};

/**
 * Validates and parses a numeric environment variable
 */
function parseNumericEnvVar(
  value: string | undefined,
  defaultValue: number,
  name: string
): number {
  if (!value) return defaultValue;

  const parsed = parseFloat(value);
  if (isNaN(parsed)) {
    console.warn(`Invalid ${name}: "${value}". Using default: ${defaultValue}`);
    return defaultValue;
  }

  return parsed;
}

/**
 * Validates and returns a string environment variable
 */
function validateStringEnvVar(
  value: string | undefined,
  defaultValue: string,
  name: string
): string {
  if (!value || value.trim() === "") {
    console.warn(`Missing ${name}. Using default: "${defaultValue}"`);
    return defaultValue;
  }
  return value.trim();
}

/**
 * Creates and validates the maps configuration from environment variables
 */
function createMapsConfig(): MapsConfig {
  // Basic validation for required environment access
  if (typeof import.meta.env === "undefined") {
    console.error(
      "Environment variables not available. Using default configuration."
    );
    return {
      ...DEFAULT_CONFIG,
      apiKey: undefined,
    };
  }

  // Extract and validate environment variables
  const embedUrl = validateStringEnvVar(
    import.meta.env.VITE_GOOGLE_MAPS_EMBED_BASE_URL,
    DEFAULT_CONFIG.embedUrl,
    "VITE_GOOGLE_MAPS_EMBED_BASE_URL"
  );

  const businessName = validateStringEnvVar(
    import.meta.env.VITE_BUSINESS_NAME,
    DEFAULT_CONFIG.business.name,
    "VITE_BUSINESS_NAME"
  );

  const businessAddress = validateStringEnvVar(
    import.meta.env.VITE_BUSINESS_ADDRESS,
    DEFAULT_CONFIG.business.address,
    "VITE_BUSINESS_ADDRESS"
  );

  const defaultZoom = parseNumericEnvVar(
    import.meta.env.VITE_MAP_DEFAULT_ZOOM,
    DEFAULT_CONFIG.defaultZoom,
    "VITE_MAP_DEFAULT_ZOOM"
  );

  const centerLat = parseNumericEnvVar(
    import.meta.env.VITE_MAP_CENTER_LAT,
    DEFAULT_CONFIG.defaultCenter.lat,
    "VITE_MAP_CENTER_LAT"
  );

  const centerLng = parseNumericEnvVar(
    import.meta.env.VITE_MAP_CENTER_LNG,
    DEFAULT_CONFIG.defaultCenter.lng,
    "VITE_MAP_CENTER_LNG"
  );

  // Optional API key for Phase 2
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Validate zoom level is within reasonable bounds
  const validatedZoom = Math.max(1, Math.min(21, defaultZoom));
  if (validatedZoom !== defaultZoom) {
    console.warn(
      `Zoom level ${defaultZoom} out of bounds. Using ${validatedZoom}`
    );
  }

  // Validate coordinates are within reasonable bounds
  const validatedLat = Math.max(-90, Math.min(90, centerLat));
  const validatedLng = Math.max(-180, Math.min(180, centerLng));

  if (validatedLat !== centerLat || validatedLng !== centerLng) {
    console.warn(
      `Coordinates adjusted: (${centerLat}, ${centerLng}) → (${validatedLat}, ${validatedLng})`
    );
  }

  return {
    embedUrl,
    apiKey: apiKey && apiKey.trim() !== "" ? apiKey.trim() : undefined,
    domain: DEFAULT_CONFIG.domain,
    defaultZoom: validatedZoom,
    defaultCenter: {
      lat: validatedLat,
      lng: validatedLng,
    },
    business: {
      name: businessName,
      address: businessAddress,
    },
  };
}

/**
 * Maps configuration singleton
 */
export const mapsConfig: MapsConfig = createMapsConfig();

/**
 * Utility functions for common map operations
 */
export const mapsUtils = {
  /**
   * Generate Google Maps Embed URL for the configured business location
   */
  getEmbedUrl: (zoom?: number): string => {
    const zoomLevel = zoom || mapsConfig.defaultZoom;
    const encodedAddress = encodeURIComponent(mapsConfig.business.address);
    return `${mapsConfig.embedUrl}?key=${mapsConfig.apiKey || ""}&q=${encodedAddress}&zoom=${zoomLevel}`;
  },

  /**
   * Generate Google Maps link for opening in new tab/app
   */
  getDirectionsUrl: (): string => {
    const encodedAddress = encodeURIComponent(mapsConfig.business.address);
    return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  },

  /**
   * Check if API key is available for Phase 2 features
   */
  hasApiKey: (): boolean => {
    return Boolean(mapsConfig.apiKey);
  },

  /**
   * Get formatted address for display
   */
  getFormattedAddress: (): string => {
    return mapsConfig.business.address;
  },

  /**
   * Get business name for display
   */
  getBusinessName: (): string => {
    return mapsConfig.business.name;
  },
} as const;

/**
 * Development helper to log current configuration
 */
if (import.meta.env.DEV) {
  console.log("Google Maps Configuration loaded:", {
    ...mapsConfig,
    apiKey: mapsConfig.apiKey ? "[REDACTED]" : undefined,
  });
}
