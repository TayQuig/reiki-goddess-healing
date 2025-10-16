import React from "react";

export interface ServiceCard {
  id: string;
  icon: React.ReactNode;
  title: string;
  duration?: string;
  description?: string;
  href?: string;
  benefits?: string[];
}

export interface ServicesSectionProps {
  heading?: string;
  services?: ServiceCard[];
  showDetails?: boolean;
  className?: string;
}

/**
 * Services Section component extracted from Figma Frames 16-19
 * Displays healing services in a grid layout
 */
export const ServicesSection: React.FC<ServicesSectionProps> = ({
  heading = "Explore Healing Services",
  showDetails = false,
  services = [
    {
      id: "reiki",
      icon: (
        <img
          src="/img/jainism_6741541-reiki-healing-sessions.svg"
          alt="Reiki"
        />
      ),
      title: "Reiki Healing Sessions",
      duration: "(60/90 min)",
      href: "/services/reiki",
      benefits: undefined,
    },
    {
      id: "sound",
      icon: (
        <img
          src="/img/Sound_Energy_Immersion_BoltBlue_OthersPurple.svg"
          alt="Sound Energy"
        />
      ),
      title: "Sound + Energy",
      duration: "Immersion Therapy",
      href: "/services/sound-therapy",
      benefits: undefined,
    },
    {
      id: "aura",
      icon: (
        <img
          src="/img/triangle_1377047-aura-chakra-readings.svg"
          alt="Aura Chakra"
        />
      ),
      title: "Aura + Chakra",
      duration: "Readings",
      href: "/services/aura-chakra",
      benefits: undefined,
    },
    {
      id: "distance",
      icon: (
        <img
          src="/img/music-therapy_1330537-distance-healing-sessions.svg"
          alt="Distance Healing"
        />
      ),
      title: "Distance Healing",
      duration: "Sessions",
      href: "/services/distance-healing",
      benefits: undefined,
    },
  ],
  className = "",
}) => {
  return (
    <section
      className={`py-20 ${className}`}
      style={{ backgroundColor: "#FFFBF5" }}
    >
      <div
        className="mx-auto px-4 sm:px-6 lg:px-8"
        style={{ maxWidth: "1200px" }}
      >
        {/* Section Heading */}
        <h2
          className="text-center mb-8 sm:mb-10 lg:mb-12 font-bold text-gray-900 text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
          style={{
            fontFamily: "Figtree, Helvetica, sans-serif",
            lineHeight: "1.2",
          }}
        >
          {heading}
        </h2>

        {/* Services Grid - Responsive: 1 col mobile, 2 col tablet, 4 col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="group relative transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Blue background rectangle - shifted down 5px */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundColor: "#0205B7",
                  borderRadius: "20px",
                  transform: "translateY(5px)",
                  zIndex: 0,
                }}
              />

              {/* White service card on top */}
              <a
                href={service.href || "#"}
                className="block relative"
                style={{
                  borderRadius: "20px",
                  boxShadow: "0px 42px 32.5px -13px rgba(2, 5, 183, 0.25)",
                  backgroundColor: "#FFFFFF",
                  zIndex: 1,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0px 42px 40px -10px rgba(2, 5, 183, 0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0px 42px 32.5px -13px rgba(2, 5, 183, 0.25)";
                }}
              >
                {/* Gradient Background Overlay - appears on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
                  style={{
                    background:
                      "linear-gradient(135deg, #0205B7 0%, rgba(99, 213, 249, 1) 100%)",
                    borderRadius: "20px",
                  }}
                />

                {/* Card Content - Responsive height */}
                <div className="h-[240px] sm:h-[260px] lg:h-[280px] p-4 sm:p-5 lg:p-6 flex flex-col items-center justify-center text-center relative">
                  {/* White background for hover state */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background:
                        "linear-gradient(135deg, #0205B7 0%, rgba(99, 213, 249, 1) 100%)",
                      borderRadius: "20px",
                    }}
                  />

                  {/* Icon - Responsive sizing */}
                  <div className="mb-3 sm:mb-4 relative z-10 transition-all duration-300 group-hover:brightness-0 group-hover:invert">
                    {React.cloneElement(service.icon as React.ReactElement, {
                      className: "w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16",
                      style: {
                        filter: "none",
                        color: "rgba(2, 5, 183, 1)",
                      },
                    })}
                  </div>

                  {/* Title - Responsive text size */}
                  <h3
                    className="font-semibold mb-1 relative z-10 transition-colors duration-300 group-hover:text-white text-base sm:text-lg lg:text-xl"
                    style={{
                      fontFamily: "Figtree, Helvetica, sans-serif",
                      lineHeight: "1.2",
                      color: "rgba(51, 51, 51, 1)",
                    }}
                  >
                    {service.title}
                  </h3>

                  {/* Duration/Description */}
                  {service.duration && (
                    <p
                      className="relative z-10 transition-colors duration-300 group-hover:text-white"
                      style={{
                        fontFamily: "Figtree, Helvetica, sans-serif",
                        fontSize: "16px",
                        fontWeight: 400,
                        color: "rgba(94, 94, 94, 1)",
                      }}
                    >
                      {service.duration}
                    </p>
                  )}

                  {/* Benefits list (shown when showDetails is true) */}
                  {showDetails &&
                    service.benefits &&
                    service.benefits.length > 0 && (
                      <ul className="mt-4 space-y-2 relative z-10">
                        {service.benefits.map(
                          (benefit: string, index: number) => (
                            <li
                              key={index}
                              className="flex items-start gap-2 text-sm transition-colors duration-300 group-hover:text-white"
                              style={{
                                fontFamily: "Figtree, Helvetica, sans-serif",
                                color: "rgba(94, 94, 94, 1)",
                              }}
                            >
                              <svg
                                className="w-4 h-4 flex-shrink-0 mt-0.5 transition-colors duration-300 group-hover:brightness-0 group-hover:invert"
                                fill="none"
                                stroke="#0205B7"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              <span>{benefit}</span>
                            </li>
                          )
                        )}
                      </ul>
                    )}
                </div>
              </a>

              {/* View Details link (shown when showDetails is true and href exists) - outside main link */}
              {showDetails && service.href && (
                <div className="mt-4 relative z-10 p-4">
                  <a
                    href={service.href}
                    className="inline-flex items-center text-sm font-medium transition-colors duration-300 group-hover:text-white hover:underline"
                    style={{
                      fontFamily: "Figtree, Helvetica, sans-serif",
                      color: "rgba(2, 5, 183, 1)",
                    }}
                    aria-label={`View details for ${service.title}`}
                  >
                    View Details
                    <svg
                      className="ml-1 w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
