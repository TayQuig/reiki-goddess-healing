/**
 * Responsive breakpoint system for The Reiki Goddess Healing
 * Aligned with TailwindCSS default breakpoints for consistency
 */

export const breakpoints = {
  // Mobile first approach
  xs: 375,    // Small mobile devices
  sm: 640,    // Large mobile devices
  md: 768,    // Tablets
  lg: 1024,   // Small desktops
  xl: 1280,   // Desktop
  '2xl': 1440, // Large desktop (Figma design width)
} as const;

export const mediaQueries = {
  xs: `(min-width: ${breakpoints.xs}px)`,
  sm: `(min-width: ${breakpoints.sm}px)`,
  md: `(min-width: ${breakpoints.md}px)`,
  lg: `(min-width: ${breakpoints.lg}px)`,
  xl: `(min-width: ${breakpoints.xl}px)`,
  '2xl': `(min-width: ${breakpoints['2xl']}px)`,
  
  // Max width queries for targeting specific ranges
  xsMax: `(max-width: ${breakpoints.sm - 1}px)`,
  smMax: `(max-width: ${breakpoints.md - 1}px)`,
  mdMax: `(max-width: ${breakpoints.lg - 1}px)`,
  lgMax: `(max-width: ${breakpoints.xl - 1}px)`,
  xlMax: `(max-width: ${breakpoints['2xl'] - 1}px)`,
} as const;

// Tailwind screen utilities for use in className
export const screens = {
  'xs': `${breakpoints.xs}px`,
  'sm': `${breakpoints.sm}px`,
  'md': `${breakpoints.md}px`,
  'lg': `${breakpoints.lg}px`,
  'xl': `${breakpoints.xl}px`,
  '2xl': `${breakpoints['2xl']}px`,
} as const;

// Device detection utilities
export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < breakpoints.md;
};

export const isTablet = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= breakpoints.md && window.innerWidth < breakpoints.lg;
};

export const isDesktop = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= breakpoints.lg;
};

// React hook for responsive design
export const useBreakpoint = () => {
  if (typeof window === 'undefined') {
    return { isMobile: false, isTablet: false, isDesktop: true };
  }
  
  const [windowSize, setWindowSize] = React.useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  
  React.useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return {
    width: windowSize.width,
    height: windowSize.height,
    isMobile: windowSize.width < breakpoints.md,
    isTablet: windowSize.width >= breakpoints.md && windowSize.width < breakpoints.lg,
    isDesktop: windowSize.width >= breakpoints.lg,
    breakpoint: Object.entries(breakpoints)
      .reverse()
      .find(([_, value]) => windowSize.width >= value)?.[0] || 'xs',
  };
};

// Import React for hook
import * as React from 'react';