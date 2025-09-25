/// <reference types="vite/client" />

/**
 * Environment variable type declarations for Vite
 */
interface ImportMetaEnv {
  // Google Maps Configuration
  readonly VITE_GOOGLE_MAPS_EMBED_BASE_URL: string;
  readonly VITE_BUSINESS_ADDRESS: string;
  readonly VITE_BUSINESS_NAME: string;
  readonly VITE_MAP_DEFAULT_ZOOM: string;
  readonly VITE_MAP_CENTER_LAT: string;
  readonly VITE_MAP_CENTER_LNG: string;

  // Phase 2 - Google Maps JavaScript API
  readonly VITE_GOOGLE_MAPS_API_KEY?: string;
  readonly VITE_MAP_TYPE?: string;
  readonly VITE_MAP_ENABLE_ZOOM_CONTROL?: string;
  readonly VITE_MAP_ENABLE_STREET_VIEW?: string;
  readonly VITE_MAP_ENABLE_FULLSCREEN?: string;
  readonly VITE_MAP_CUSTOM_STYLES?: string;

  // Standard Vite environment variables
  readonly VITE_APP_TITLE?: string;
  readonly MODE: string;
  readonly BASE_URL: string;
  readonly PROD: boolean;
  readonly DEV: boolean;
  readonly SSR: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
