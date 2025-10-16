// Shared components for The Reiki Goddess Healing website

// Layout components
export { AppLayout } from "./AppLayout";
export type { AppLayoutProps } from "./AppLayout";

export { ResponsiveContainer } from "./ResponsiveContainer";
export type { ResponsiveContainerProps } from "./ResponsiveContainer";

export { HeaderSection } from "./HeaderSection";
export type { HeaderSectionProps } from "./HeaderSection";

export { FooterSection } from "./FooterSection";
export type { FooterSectionProps } from "./FooterSection";

// Foundation utility components (keeping these)
export { default as Button } from "./Button";
export { SecureContactForm } from "./SecureContactForm/index";
export type {
  SecureContactFormProps,
  ContactFormData,
} from "./SecureContactForm/index";
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

export { ServiceHero } from "./ServiceHero";
export type { ServiceHeroProps } from "./ServiceHero";

export { ServiceCard as ServiceCardComponent } from "./ServiceCard";
export type { ServiceCardProps } from "./ServiceCard";

export { PricingSection } from "./PricingSection";
export type { PricingSectionProps, PricingTier } from "./PricingSection";

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

// Contact page components
export { ContactInfoCard } from "./ContactInfoCard";
export type { ContactInfoCardProps } from "./ContactInfoCard";

export { FigmaContactForm } from "./FigmaContactForm";
export type {
  FigmaContactFormProps,
  FigmaContactFormData,
} from "./FigmaContactForm";

// About page components
export { CertificationCards } from "./CertificationCards";
export type {
  CertificationCardsProps,
  CertificationCard,
} from "./CertificationCards/CertificationCards.types";

export { AboutHero } from "./AboutHero";
export type { AboutHeroProps } from "./AboutHero/AboutHero.types";

export { ImageGallery } from "./ImageGallery";
export type {
  ImageGalleryProps,
  GalleryImage,
} from "./ImageGallery/ImageGallery.types";

export { JourneySection } from "./JourneySection";
export type { JourneySectionProps } from "./JourneySection/JourneySection.types";

// Google Maps components with enhanced error handling
export {
  GoogleMapEmbed,
  MapErrorBoundary,
  MapLoadingSkeleton,
  useNetworkState,
} from "./GoogleMap";
export type {
  GoogleMapEmbedProps,
  MapLoadingState,
  MapErrorState,
  RetryConfig,
  NetworkState,
} from "./GoogleMap";

// CTA components
export { BookSessionCTA } from "./BookSessionCTA/BookSessionCTA";
export type { BookSessionCTAProps } from "./BookSessionCTA/BookSessionCTA";

export { ContactCTA } from "./ContactCTA";
export type { ContactCTAProps } from "./ContactCTA";

// Blog types and components
export * from "./Blog";

// Complete page compositions
export { Homepage } from "./Homepage";
export type { HomepageProps } from "./Homepage";

// Route page components
export {
  HomePage,
  AboutPage,
  ServicesPage,
  ContactPage,
  EventsPage,
  BlogPage,
} from "./pages";
