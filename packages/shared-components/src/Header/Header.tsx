import React from "react";
import { Link } from "react-router-dom";

export interface NavigationItem {
  label: string;
  href: string;
  isActive?: boolean;
}

export interface HeaderProps {
  logo?: {
    src: string;
    alt: string;
  };
  navigationItems?: NavigationItem[];
  className?: string;
}

/**
 * Header component extracted from Figma design
 * Frame #1 - Homepage header/navigation bar
 */
export const Header: React.FC<HeaderProps> = ({
  logo = {
    src: "/img/reiki-goddess-logo.png",
    alt: "The Reiki Goddess Healing",
  },
  navigationItems = [
    { label: "Home", href: "/", isActive: true },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Events", href: "/events" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  className = "",
}) => {
  return (
    <header
      className={`relative w-full ${className}`}
      style={{
        height: "93px",
        backgroundColor: "#FFFBF5",
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="relative h-full mx-auto" style={{ maxWidth: "1440px" }}>
        <div className="relative flex items-center h-full">
          {/* Logo Section - Aligned with hero image edge (66px) */}
          <Link
            to="/"
            className="absolute"
            style={{
              left: "66px", // Align with hero image edge
              top: "1px",
              width: "248px",
              height: "92px",
            }}
          >
            <img
              src={logo.src}
              alt={logo.alt}
              className="w-full h-full object-contain"
            />
          </Link>

          {/* Navigation Links - adjusted for new logo position */}
          <nav
            className="absolute flex items-center"
            style={{
              left: "calc(66px + 248px + 191px)", // Logo left + logo width + spacing (reduced by 35px)
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <ul className="flex items-center" style={{ gap: "84px" }}>
              {navigationItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.href}
                    className="transition-all duration-200 hover:opacity-80"
                    style={{
                      fontFamily: "Figtree, Helvetica, sans-serif",
                      fontSize: "16px",
                      fontWeight: item.isActive ? 600 : 500,
                      letterSpacing: "0px",
                      color: "rgba(2, 5, 183, 1)",
                      textDecoration: item.isActive ? "underline" : "none",
                      textUnderlineOffset: "4px",
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};
