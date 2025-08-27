import React from "react";

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  current: boolean;
}

export interface BrandConfig {
  brandName: string;
  businessName: string;
  logoSrc: string;
  logoAlt: string;
}

export interface HeaderSectionProps {
  navigationItems: NavigationItem[];
  brand: BrandConfig;
}

export const HeaderSection: React.FC<HeaderSectionProps> = ({
  navigationItems,
  brand,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img
              className="h-10 w-auto"
              src={brand.logoSrc}
              alt={brand.logoAlt}
            />
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigationItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  item.current
                    ? "text-blue-700 bg-blue-50"
                    : "text-gray-700 hover:text-blue-700 hover:bg-blue-50"
                }`}
                aria-current={item.current ? "page" : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-700 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-2"
              aria-expanded="false"
              aria-label="Open menu"
            >
              <svg
                className="h-6 w-6"
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
    </header>
  );
};
