// Shared components for The Reiki Goddess Healing website

// Foundation utility components (keeping these)
export { default as Button } from "./Button";
export { SecureContactForm } from "./SecureContactForm";
export {
  PrivacyCompliance,
  CookieConsentBanner,
  PrivacyManager,
  DataDeletionRequest,
} from "./PrivacyCompliance";

// Figma-sourced components
export { Header, ResponsiveHeader } from "./Header";
export type {
  HeaderProps,
  NavigationItem,
  ResponsiveHeaderProps,
} from "./Header";

export { Hero, ResponsiveHero, HeroV2, ResponsiveHeroV2 } from "./Hero";
export type {
  HeroProps,
  ResponsiveHeroProps,
  HeroV2Props,
  ResponsiveHeroV2Props,
} from "./Hero";

export { FeaturesBar } from "./FeaturesBar";
export type { FeaturesBarProps, Feature } from "./FeaturesBar";

export { MeetTheGoddess } from "./MeetTheGoddess";
export type { MeetTheGoddessProps } from "./MeetTheGoddess";

export { ServicesSection } from "./Services";
export type { ServicesSectionProps, ServiceCard } from "./Services";

export { CommunityEvents } from "./CommunityEvents";
export type { CommunityEventsProps, EventCard } from "./CommunityEvents";

export { Testimonials } from "./Testimonials";
export type { TestimonialsProps, Testimonial } from "./Testimonials";

export { LetsConnect } from "./LetsConnect";
export type { LetsConnectProps } from "./LetsConnect";

export { default as Footer } from "./Footer";
export type { FooterProps } from "./Footer";

// Animation utilities
export { AnimatedSection } from "./AnimatedSection";
export type { AnimatedSectionProps } from "./AnimatedSection";

export { LazyImage } from "./LazyImage";
export type { LazyImageProps } from "./LazyImage";

// Complete page compositions
export { Homepage } from "./Homepage";
export type { HomepageProps } from "./Homepage";
