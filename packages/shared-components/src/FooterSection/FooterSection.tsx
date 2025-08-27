import React from "react";
import Footer, { FooterProps } from "../Footer";

export interface FooterSectionProps extends FooterProps {
  sections?: Array<{
    title: string;
    links: Array<{
      label: string;
      href: string;
    }>;
  }>;
  copyright?: {
    text: string;
    year?: number;
  };
  socialLinks?: Array<{
    platform: string;
    href: string;
    icon?: string;
  }>;
  contact?: {
    phone?: string;
    email?: string;
    address?: string;
  };
}

/**
 * Footer section component with enhanced props
 */
export const FooterSection: React.FC<FooterSectionProps> = ({
  sections = [],
  copyright: _copyright,
  socialLinks: _socialLinks = [],
  contact: _contact,
  ...footerProps
}) => {
  // Transform sections into Footer props format
  const quickLinks =
    sections
      .find((s) => s.title.toLowerCase().includes("quick"))
      ?.links.map((l) => l.label) || [];

  const legalLinks =
    sections
      .find((s) => s.title.toLowerCase().includes("legal"))
      ?.links.map((l) => l.label) || [];

  return (
    <Footer {...footerProps} quickLinks={quickLinks} legalLinks={legalLinks} />
  );
};
