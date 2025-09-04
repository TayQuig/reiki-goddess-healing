import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { NavigationItem } from "./Header";

export interface MobileHeaderProps {
  logo?: {
    src: string;
    alt: string;
  };
  navigationItems?: NavigationItem[];
  className?: string;
}

/**
 * Mobile header component with hamburger menu
 * Optimized for touch devices and small screens
 */
export const MobileHeader: React.FC<MobileHeaderProps> = ({
  logo = {
    src: "/img/logo.png",
    alt: "The Reiki Goddess Healing",
  },
  navigationItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Events", href: "/events" },
    { label: "Contact", href: "/contact" },
    { label: "Blog", href: "/blog" },
  ],
  className = "",
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => {
    setIsMenuOpen(false);
    // Restore focus to the menu button when closing
    if (previousFocusRef.current) {
      previousFocusRef.current.focus();
    }
  };

  // Focus management for menu
  useEffect(() => {
    if (isMenuOpen) {
      // Store the currently focused element
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      // Focus the first link immediately using requestAnimationFrame for proper timing
      requestAnimationFrame(() => {
        const firstLink = menuRef.current?.querySelector('a[href]');
        if (firstLink) {
          (firstLink as HTMLElement).focus();
        }
      });
    }
  }, [isMenuOpen]);

  // Handle escape key to close menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        closeMenu();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMenuOpen]);

  // Focus trap for menu
  useEffect(() => {
    if (!isMenuOpen || !menuRef.current) return;

    const focusableElements = menuRef.current.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable?.focus();
        }
      }
    };

    const menu = menuRef.current;
    menu.addEventListener('keydown', handleTabKey);
    
    return () => {
      menu.removeEventListener('keydown', handleTabKey);
    };
  }, [isMenuOpen]);

  return (
    <div className="lg:hidden">
      {/* Mobile Header Bar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-[#FFFBF5] border-b border-gray-100 ${className}`}
      >
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link to="/" className="block">
            <img
              src={logo.src}
              alt={logo.alt}
              className="h-12 w-auto object-contain"
            />
          </Link>

          {/* Hamburger Menu Button */}
          <button
            ref={menuButtonRef}
            onClick={toggleMenu}
            className="relative z-50 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <div className="w-6 h-5 relative flex flex-col justify-between">
              <span
                className={`block h-0.5 w-full bg-[#0205B7] transform transition-all duration-300 origin-left ${
                  isMenuOpen ? "rotate-45 translate-y-0.5" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-full bg-[#0205B7] transition-opacity duration-300 ${
                  isMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-full bg-[#0205B7] transform transition-all duration-300 origin-left ${
                  isMenuOpen ? "-rotate-45 -translate-y-0.5" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        role="button"
        tabIndex={isMenuOpen ? 0 : -1}
        className={`fixed inset-0 z-40 bg-black transition-opacity duration-300 ${
          isMenuOpen ? "opacity-50" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMenu}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            closeMenu();
          }
        }}
      />

      {/* Mobile Menu Panel */}
      <nav
        ref={menuRef}
        id="mobile-menu"
        aria-label="Mobile navigation"
        className={`fixed top-0 right-0 h-full w-72 bg-[#FFFBF5] z-45 transform transition-transform duration-300 shadow-xl ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="pt-20 px-6">
          {/* Logo in menu */}
          <div className="mb-8 text-center">
            <img
              src={logo.src}
              alt={logo.alt}
              className="h-16 w-auto mx-auto"
            />
          </div>

          {/* Navigation Links */}
          <ul className="space-y-4">
            {navigationItems.map((item, index) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={index} className="relative">
                  <Link
                    to={item.href}
                    onClick={closeMenu}
                    className={`block py-3 px-4 text-lg font-medium rounded-lg transition-colors ${
                      isActive
                        ? "text-brand-blue"
                        : "text-[#0205B7] hover:bg-blue-50"
                    }`}
                  >
                    {item.label}
                  </Link>
                  {isActive && (
                    <div className="absolute inset-0 before:content-[''] before:absolute before:bottom-0 before:left-4 before:right-4 before:h-0.5 before:bg-brand-blue before:scale-x-100" />
                  )}
                </li>
              );
            })}
          </ul>

          {/* CTA Button */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <Link
              to="/contact"
              onClick={closeMenu}
              className="block w-full py-3 px-4 text-center text-white bg-brand-blue rounded-full font-medium hover:bg-blue-700 transition-colors"
            >
              Book a Session
            </Link>
          </div>

          {/* Contact Info */}
          <div className="mt-8 text-sm text-gray-600">
            <p className="font-semibold mb-2">Get in Touch</p>
            <p className="mb-2">(555) 123-4567</p>
            <p>contact@reikigoddesshealing.com</p>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from going under fixed header */}
      <div className="h-[60px]" />
    </div>
  );
};
