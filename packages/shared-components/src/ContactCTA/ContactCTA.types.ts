export interface ContactCTAProps {
  heading?: string;
  bodyText?: string;
  backgroundImage?: {
    src: string;
    alt: string;
  };
  buttons?: Array<{
    text: string;
    variant: "primary" | "secondary";
    onClick?: () => void;
    href?: string;
  }>;
  className?: string;
}
