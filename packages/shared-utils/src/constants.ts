// Shared constants for The Reiki Goddess Healing website

export const BUSINESS_INFO = {
  name: "The Reiki Goddess Healing",
  tagline: "Experienced Reiki Master & Sound Healer in Roy",
  location: "Roy, Washington",
  email: "thereikigoddesshealing@gmail.com",
  phone: "0300 0000 0000",
} as const;

export const NAVIGATION_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Events", href: "/events" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;

export const QUICK_LINKS = [
  "Services",
  "Events",
  "Blog",
  "About",
  "Contact",
] as const;

export const LEGAL_LINKS = [
  "Privacy Policy",
  "Terms & Conditions",
  "Disclaimer",
] as const;

export const SOCIAL_MEDIA = {
  facebook: "#",
  instagram: "#",
  twitter: "#",
  linkedin: "#",
} as const;

export const BREAKPOINTS = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;