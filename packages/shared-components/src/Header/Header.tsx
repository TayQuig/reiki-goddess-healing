import React, { useState } from "react";
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
 * Updated for Mobile Responsiveness
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header
      className={`relative w-full ${className} z-50`}
      style={{
        height: "93px",
        backgroundColor: "#FFFBF5",
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="relative h-full max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[66px]">
        <div className="flex items-center justify-between h-full">
          {/* Logo Section */}
          <Link
            to="/"
            className="block relative shrink-0"
            style={{
              width: "180px", // Smaller on mobile
              height: "auto",
            }}
          >
            <img
              src={logo.src}
              alt={logo.alt}
              className="w-full h-auto object-contain md:w-[248px]"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:block">
            <ul className="flex items-center gap-8 xl:gap-[84px]">
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

          {/* Mobile Menu Button */}
          <button
            className="block lg:hidden p-2 text-[#0205B7]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="absolute top-[93px] left-0 w-full bg-[#FFFBF5] border-t border-gray-100 shadow-lg lg:hidden">
          <nav className="flex flex-col p-4">
            {navigationItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className="py-3 px-4 text-lg font-medium text-[#0205B7] hover:bg-blue-50 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
