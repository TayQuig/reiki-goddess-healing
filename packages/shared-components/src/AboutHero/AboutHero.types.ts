export interface AboutHeroProps {
  heading: string;
  leftColumnText: React.ReactNode;
  rightColumnText: React.ReactNode;
  bottomText?: string;
  heroImage: {
    src: string;
    alt: string;
  };
  decorativeImage?: {
    src: string;
    alt: string;
  };
  ctaButton?: {
    text: string;
    onClick: () => void;
    ariaLabel?: string;
  };
  className?: string;
}
