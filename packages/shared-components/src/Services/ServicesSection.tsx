import React from "react";

export interface ServiceCard {
  id: string;
  icon: React.ReactNode;
  title: string;
  duration?: string;
  description?: string;
  href?: string;
}

export interface ServicesSectionProps {
  heading?: string;
  services?: ServiceCard[];
  className?: string;
}

/**
 * Services Section component extracted from Figma Frames 16-19
 * Displays healing services in a grid layout
 */
export const ServicesSection: React.FC<ServicesSectionProps> = ({
  heading = "Explore Healing Services",
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
    },
  ],
  className = "",
}) => {
  return (
    <section
      className={`py-20 ${className}`}
      style={{ backgroundColor: "#FFFBF5" }}
    >
      <div className="mx-auto" style={{ maxWidth: "1200px" }}>
        {/* Section Heading */}
        <h2
          className="text-center mb-12 font-bold text-gray-900"
          style={{
            fontFamily: "Figtree, Helvetica, sans-serif",
            fontSize: "48px",
            lineHeight: "1.2",
          }}
        >
          {heading}
        </h2>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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

                {/* Card Content */}
                <div className="h-[280px] p-6 flex flex-col items-center justify-center text-center relative">
                  {/* White background for hover state */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background:
                        "linear-gradient(135deg, #0205B7 0%, rgba(99, 213, 249, 1) 100%)",
                      borderRadius: "20px",
                    }}
                  />

                  {/* Icon */}
                  <div className="mb-4 relative z-10 transition-all duration-300 group-hover:brightness-0 group-hover:invert">
                    {React.cloneElement(service.icon as React.ReactElement, {
                      className: "w-16 h-16",
                      style: {
                        filter: "none",
                        color: "rgba(2, 5, 183, 1)",
                      },
                    })}
                  </div>

                  {/* Title */}
                  <h3
                    className="font-semibold mb-1 relative z-10 transition-colors duration-300 group-hover:text-white"
                    style={{
                      fontFamily: "Figtree, Helvetica, sans-serif",
                      fontSize: "20px",
                      lineHeight: "24px",
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
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
