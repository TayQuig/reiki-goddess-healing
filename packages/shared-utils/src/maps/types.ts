/**
 * TypeScript interfaces for map utilities
 * The Reiki Goddess Healing project
 */

/** Coordinates interface for latitude/longitude pairs */
export interface Coordinates {
  /** Latitude in decimal degrees (-90 to 90) */
  lat: number;
  /** Longitude in decimal degrees (-180 to 180) */
  lng: number;
}

/** Structured address data components */
export interface AddressComponents {
  /** Street number */
  streetNumber?: string;
  /** Street name */
  streetName?: string;
  /** City name */
  city?: string;
  /** State/province */
  state?: string;
  /** Postal/zip code */
  postalCode?: string;
  /** Country name */
  country?: string;
  /** Full formatted address */
  formattedAddress: string;
}

/** Map bounds interface for defining rectangular boundaries */
export interface MapBounds {
  /** Northeast corner coordinates */
  northeast: Coordinates;
  /** Southwest corner coordinates */
  southwest: Coordinates;
}

/** Parameters for building Google Maps Embed URLs */
export interface EmbedParams {
  /** Address or location query */
  query?: string;
  /** Center coordinates */
  center?: Coordinates;
  /** Zoom level (1-21) */
  zoom?: number;
  /** Map type */
  maptype?: "roadmap" | "satellite" | "hybrid" | "terrain";
  /** Language code */
  language?: string;
  /** Region code */
  region?: string;
  /** Google Maps API key */
  key?: string;
}

/** General map options configuration */
export interface MapOptions {
  /** Default zoom level */
  zoom: number;
  /** Default center coordinates */
  center: Coordinates;
  /** Map type */
  mapTypeId: string;
  /** Whether to disable default UI */
  disableDefaultUI?: boolean;
  /** Whether zoom control is enabled */
  zoomControl?: boolean;
  /** Whether street view control is enabled */
  streetViewControl?: boolean;
  /** Whether fullscreen control is enabled */
  fullscreenControl?: boolean;
}
