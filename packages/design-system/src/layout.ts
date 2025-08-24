/**
 * Layout constants extracted from homepage implementation
 * These values ensure consistency across all pages
 */

export const LAYOUT = {
  // Container System
  container: {
    maxWidth: '1440px',
    padding: '66px', // Universal 66px buffer maintained across all sections
    paddingMobile: '24px',
    background: '#FFFBF5',
    boxShadow: '0 0 40px rgba(0, 0, 0, 0.1)',
  },
  
  // Hero Section
  hero: {
    totalHeight: '825px', // 93px nav + 732px image
    imageHeight: '732px',
    imageWidth: '1308px', // Max width with 66px buffers = 1440px - 132px = 1308px
    navOffset: '93px', // Space from top where nav sits
    imageBuffer: '66px', // Buffer between image edges and page edges
    heightMobile: '600px',
    overlayOpacity: 0.3,
  },
  
  // Navigation
  navbar: {
    height: '93px', // Nav bar fits within the 93px buffer at top
    heightMobile: '80px',
    logoHeight: '60px',
    zIndex: 50,
  },
  
  // Section Spacing
  section: {
    paddingY: '80px', // py-20 in Tailwind
    paddingYMobile: '48px', // py-12 in Tailwind
    gap: '48px', // Standard gap between elements
    gapMobile: '32px',
  },
  
  // Grid System
  grid: {
    columns: {
      desktop: 3,
      tablet: 2,
      mobile: 1,
    },
    gap: '32px',
    gapMobile: '24px',
  },
  
  // Content Widths
  content: {
    maxWidthText: '800px',
    maxWidthNarrow: '600px',
    maxWidthWide: '1200px',
  },
  
  // Breakpoints (matching Tailwind defaults)
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  // Z-Index Scale
  zIndex: {
    base: 0,
    dropdown: 10,
    sticky: 20,
    overlay: 30,
    modal: 40,
    navbar: 50,
    tooltip: 60,
  },
  
  // Border Radius - Brand specific rounded corners
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    DEFAULT: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
    // Brand specific
    button: '9999px', // Fully rounded buttons (pill shape)
    image: '20px', // Consistent rounded corners for all images
    card: '20px', // Card components
    section: '30px', // Large section containers
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    container: '0 0 40px rgba(0, 0, 0, 0.1)',
    // Brand specific
    serviceCard: '0px 42px 32.5px -13px rgba(2, 5, 183, 0.25)', // Blue shadow for service cards
    serviceCardHover: '0px 42px 40px -10px rgba(2, 5, 183, 0.35)', // Enhanced on hover
  },
} as const;

export type LayoutTheme = typeof LAYOUT;