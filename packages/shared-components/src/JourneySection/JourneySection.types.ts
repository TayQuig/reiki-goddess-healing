import type { CertificationCard } from "../CertificationCards";

export interface JourneySectionProps {
  heading?: string;
  content?: React.ReactNode;
  backgroundImage?: {
    src: string;
    alt: string;
  };
  sideImage?: {
    src: string;
    alt: string;
  };
  certifications?: CertificationCard[];
  className?: string;
}
