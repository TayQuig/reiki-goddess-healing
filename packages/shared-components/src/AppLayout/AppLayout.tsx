import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header, NavigationItem } from "../Header/Header";
import { Footer } from "../Footer/Footer";

export interface AppLayoutProps {
  className?: string;
}

/**
 * AppLayout component - Main layout wrapper for all pages
 * Provides consistent header and footer across the application
 * Uses React Router's Outlet for page content
 */
export const AppLayout: React.FC<AppLayoutProps> = ({ className = "" }) => {
  const location = useLocation();

  // Define navigation items with active state based on current route
  const navigationItems: NavigationItem[] = [
    { label: "Home", href: "/", isActive: location.pathname === "/" },
    {
      label: "About",
      href: "/about",
      isActive: location.pathname === "/about",
    },
    {
      label: "Services",
      href: "/services",
      isActive: location.pathname === "/services",
    },
    {
      label: "Events",
      href: "/events",
      isActive: location.pathname === "/events",
    },
    {
      label: "Blog",
      href: "/blog",
      isActive: location.pathname.startsWith("/blog"),
    },
    {
      label: "Contact",
      href: "/contact",
      isActive: location.pathname === "/contact",
    },
  ];

  return (
    <div
      className={`min-h-screen flex flex-col ${className}`}
      style={{ backgroundColor: "#FFFBF5" }}
    >
      {/* Header with active navigation states - positioned absolutely to overlay content */}
      <div className="relative z-50 w-full flex justify-center">
        <Header
          logo={{
            src: "/img/Nav Bar Clickable Logo.png",
            alt: "The Reiki Goddess Healing",
          }}
          navigationItems={navigationItems}
        />
      </div>

      {/* Main content area - uses React Router's Outlet */}
      <main className="flex-1" style={{ marginTop: "-93px" }}>
        <Outlet />
      </main>

      {/* Footer - Inside the main container layout */}
      <div
        className="relative mx-auto"
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          backgroundColor: "#FFFBF5",
        }}
      >
        <Footer />
      </div>
    </div>
  );
};
