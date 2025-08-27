import React from "react";

export interface Feature {
  icon: React.ReactNode;
  title: string;
  description?: string;
}

export interface FeaturesBarProps {
  features?: Feature[];
  className?: string;
}

/**
 * Features Bar component extracted from Figma Frame 15
 * Displays key business attributes/features in a horizontal bar
 */
export const FeaturesBar: React.FC<FeaturesBarProps> = ({
  features = [
    {
      icon: (
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
      title: "Female-Owned",
      description: "Practice",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      title: "By Appointment",
      description: "Only",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      title: "Healing for All",
      description: "Ages",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      ),
      title: "Trauma-",
      description: "Informed Care",
    },
  ],
  className = "",
}) => {
  return (
    <div
      className={`py-12 ${className}`}
      style={{ backgroundColor: "#FFFBF5" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center justify-center gap-3 px-4 py-3"
            >
              {/* Icon */}
              <div className="text-[#0205B7] flex-shrink-0">{feature.icon}</div>

              {/* Divider (except for first item) */}
              {index > 0 && (
                <div className="hidden md:block absolute left-0 h-12 w-px bg-[#63D5F9] -ml-4" />
              )}

              {/* Text */}
              <div className="text-left">
                <p
                  className="font-medium text-gray-900 leading-tight"
                  style={{
                    fontFamily: "Figtree, Helvetica, sans-serif",
                    fontSize: "16px",
                  }}
                >
                  {feature.title}
                </p>
                {feature.description && (
                  <p
                    className="font-medium text-gray-900 leading-tight"
                    style={{
                      fontFamily: "Figtree, Helvetica, sans-serif",
                      fontSize: "16px",
                    }}
                  >
                    {feature.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
