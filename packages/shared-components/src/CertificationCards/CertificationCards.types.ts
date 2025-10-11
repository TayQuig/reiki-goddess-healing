export interface CertificationCard {
  title: string;
  description: string;
  variant: "gradient" | "white";
}

export interface CertificationCardsProps {
  cards: CertificationCard[];
  className?: string;
}
