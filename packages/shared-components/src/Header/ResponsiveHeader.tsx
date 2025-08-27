import React, { useEffect, useState } from "react";
import { Header, HeaderProps } from "./Header";
import { MobileHeader } from "./MobileHeader";

export interface ResponsiveHeaderProps extends HeaderProps {
  maxWidth?: number;
  mobileBreakpoint?: number;
  _mobileBreakpoint?: number;
}

/**
 * Responsive wrapper for the Header component
 * Automatically switches between desktop and mobile headers
 */
export const ResponsiveHeader: React.FC<ResponsiveHeaderProps> = ({
  maxWidth = 1440,
  mobileBreakpoint = 768,
  _mobileBreakpoint = 768,
  ...headerProps
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < mobileBreakpoint);
    };

    // Check on mount
    checkMobile();

    // Listen for resize events
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [mobileBreakpoint]);

  // Server-side rendering fallback
  if (typeof window === "undefined") {
    return (
      <div className="relative w-full">
        <Header {...headerProps} />
      </div>
    );
  }

  return (
    <>
      {/* Desktop Header */}
      <div className="hidden md:block">
        <div
          className="relative w-full"
          style={{
            maxWidth: `${maxWidth}px`,
            margin: "0 auto",
          }}
        >
          <div className="relative h-[93px]">
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
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden">
        <MobileHeader {...headerProps} />
      </div>
    </>
  );
};
