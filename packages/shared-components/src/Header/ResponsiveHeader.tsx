import React from "react";
import { Header, HeaderProps } from "./Header";

export interface ResponsiveHeaderProps extends HeaderProps {
  maxWidth?: number;
  mobileBreakpoint?: number;
  _mobileBreakpoint?: number;
}

/**
 * Responsive wrapper for the Header component
 * Maintains Figma design proportions while scaling for different viewports
 */
export const ResponsiveHeader: React.FC<ResponsiveHeaderProps> = ({
  maxWidth = 1440,
  _mobileBreakpoint = 768,
  ...headerProps
}) => {
  return (
    <div
      className="relative w-full"
      style={{
        maxWidth: `${maxWidth}px`,
        margin: "0 auto",
      }}
    >
      {/* Desktop Header */}
      <div className="hidden md:block relative h-[93px]">
        <div
          className="absolute left-1/2 transform -translate-x-1/2"
          style={{
            width: "100%",
            maxWidth: "1440px",
          }}
        >
          <Header {...headerProps} />
        </div>
      </div>

      {/* Mobile Header - Simplified for smaller screens */}
      <div className="md:hidden">
        <div className="flex items-center justify-between p-4 bg-white">
          {headerProps.logo && (
            <img
              src={headerProps.logo.src}
              alt={headerProps.logo.alt}
              className="h-12 object-contain"
            />
          )}

          {/* Mobile menu button (hamburger) */}
          <button className="p-2" aria-label="Open menu">
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
          </button>
        </div>
      </div>
    </div>
  );
};
