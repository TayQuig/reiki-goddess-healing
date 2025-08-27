import React, { useState } from "react";
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
    src: "/img/reiki-goddess-logo.png",
    alt: "The Reiki Goddess Healing",
  },
  navigationItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  className = "",
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      {/* Mobile Header Bar */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 bg-[#FFFBF5] border-b border-gray-100 ${className}`}
      >
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <a href="/" className="block">
            <img
              src={logo.src}
              alt={logo.alt}
              className="h-12 w-auto object-contain"
            />
          </a>

          {/* Hamburger Menu Button */}
          <button
            onClick={toggleMenu}
            className="relative z-50 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <div className="w-6 h-5 relative flex flex-col justify-between">
              <span 
                className={`block h-0.5 w-full bg-[#0205B7] transform transition-all duration-300 origin-left ${
                  isMenuOpen ? 'rotate-45 translate-y-0.5' : ''
                }`}
              />
              <span 
                className={`block h-0.5 w-full bg-[#0205B7] transition-opacity duration-300 ${
                  isMenuOpen ? 'opacity-0' : ''
                }`}
              />
              <span 
                className={`block h-0.5 w-full bg-[#0205B7] transform transition-all duration-300 origin-left ${
                  isMenuOpen ? '-rotate-45 -translate-y-0.5' : ''
                }`}
              />
            </div>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMenu}
      />

      {/* Mobile Menu Panel */}
      <nav
        className={`fixed top-0 right-0 h-full w-72 bg-[#FFFBF5] z-45 transform transition-transform duration-300 shadow-xl ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="pt-20 px-6">
          {/* Navigation Links */}
          <ul className="space-y-4">
            {navigationItems.map((item, index) => (
              <li key={index}>
                <a
                  href={item.href}
                  onClick={closeMenu}
                  className="block py-3 px-4 text-lg font-medium text-[#0205B7] hover:bg-blue-50 rounded-lg transition-colors"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          {/* CTA Button */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <a
              href="/contact"
              onClick={closeMenu}
              className="block w-full py-3 px-4 text-center text-white bg-[#0205B7] rounded-full font-medium hover:bg-blue-700 transition-colors"
            >
              Book a Session
            </a>
          </div>

          {/* Contact Info */}
          <div className="mt-8 text-sm text-gray-600">
            <p className="mb-2">📍 Roy, WA</p>
            <p className="mb-2">📧 hello@reikigoddesshealing.com</p>
            <p>📞 (555) 123-4567</p>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from going under fixed header */}
      <div className="h-[60px]" />
    </>
  );
};