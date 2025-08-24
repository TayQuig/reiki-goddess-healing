// Shared assets for The Reiki Goddess Healing website
export * from './images';

// Asset types
export interface ImageAsset {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}