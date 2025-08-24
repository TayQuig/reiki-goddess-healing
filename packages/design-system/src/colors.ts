/**
 * Color definitions for The Reiki Goddess Healing design system
 * Extracted from Anima design CSS variables
 */

export const colors = {
  // Brand Colors
  brand: {
    blue: 'rgba(2, 5, 183, 1)',        // Primary brand blue
    purple: 'rgba(165, 147, 224, 1)',  // Light purple
    peach: 'rgba(255, 198, 165, 1)',   // Warm peach
    cyan: 'rgba(99, 213, 249, 1)',     // Cyan blue
  },
  
  // Primary Palette
  primary: {
    DEFAULT: 'rgba(2, 5, 183, 1)',     // Brand blue
    light: 'rgba(99, 213, 249, 1)',    // Cyan blue
    dark: 'rgba(0, 0, 0, 1)',          // Black
  },
  
  // Secondary Palette
  secondary: {
    DEFAULT: 'rgba(165, 147, 224, 1)', // Light purple
    light: 'rgba(255, 198, 165, 1)',   // Warm peach
    dark: 'rgba(94, 94, 94, 1)',       // Dark gray
  },
  
  // Neutral Colors
  neutral: {
    white: 'rgba(255, 255, 255, 1)',
    offWhite: 'rgba(248, 251, 251, 1)',
    lightGray: 'rgba(237, 237, 237, 1)',
    gray: 'rgba(158, 158, 158, 1)',
    darkGray: 'rgba(94, 94, 94, 1)',
    charcoal: 'rgba(51, 51, 51, 1)',
    black: 'rgba(0, 0, 0, 1)',
    blackAlpha50: 'rgba(0, 0, 0, 0.5)',
  },
  
  // Accent Colors
  accent: {
    cream: 'rgba(244, 237, 222, 1)',
    beige: 'rgba(226, 217, 198, 1)',
    tan: 'rgba(173, 163, 133, 1)',
    slate: 'rgba(119, 127, 138, 1)',
  },
  
  // Background Colors
  background: {
    primary: '#FFFBF5',  // Main cream background for entire site
    secondary: 'rgba(248, 251, 251, 1)',
    accent: 'rgba(244, 237, 222, 1)',
    overlay: 'rgba(0, 0, 0, 0.5)',
    white: '#ffffff',
  },
  
  // Text Colors
  text: {
    primary: 'rgba(51, 51, 51, 1)',
    secondary: 'rgba(94, 94, 94, 1)',
    light: 'rgba(158, 158, 158, 1)',
    white: 'rgba(255, 255, 255, 1)',
    brand: 'rgba(2, 5, 183, 1)',
  },
  
  // Gradient Definitions (for use in CSS)
  gradients: {
    purple: 'linear-gradient(180deg, rgba(165, 147, 224, 0.8) 0%, rgba(165, 147, 224, 0.4) 100%)',
    hero: 'linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.6) 100%)',
    card: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
  },
} as const;

export type ColorTheme = typeof colors;