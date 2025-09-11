import React from "react";

export interface LetsConnectProps {
  heading?: string;
  location?: {
    icon?: React.ReactNode;
    text: string;
    href?: string;
  };
  email?: {
    icon?: React.ReactNode;
    text: string;
    href?: string;
  };
  phone?: {
    icon?: React.ReactNode;
    text: string;
    href?: string;
  };
  ctaButton?: {
    text: string;
    href: string;
    onClick?: () => void;
  };
  _ctaButton?: {
    text: string;
    href: string;
    onClick?: () => void;
  };
  className?: string;
}

/**
 * Let's Connect section component
 * Call-to-action section with contact information
 */
export const LetsConnect: React.FC<LetsConnectProps> = ({
  heading = "Let's Connect",
  location = {
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    text: "Roy, Washington",
    href: "https://maps.google.com/?q=Roy,Washington",
  },
  email = {
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
    text: "thereikigoddeshealing@gmail.com",
    href: "mailto:thereikigoddeshealing@gmail.com",
  },
  phone,
  _ctaButton = {
    text: "Book Your Session",
    href: "/book",
  },
  className = "",
}) => {
  return (
    <section
      className={`relative overflow-hidden shadow-[9px_10px_0px_0px_#0205B7] ${className}`}
      style={{
        height: "260px",
        borderRadius: "30px",
        margin: "40px 66px",
      }}
    >
      {/* Background Image and Overlay */}
      <div className="absolute inset-0">
        {/* Background Image */}
        <img
          src="/img/lets-connect-bg.jpg"
          alt="Healing crystals and sage"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ borderRadius: "30px" }}
        />

        {/* Blue Overlay with brand color */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: "rgba(2, 5, 183, 0.35)", // #0205B7 with 35% opacity
            borderRadius: "30px",
          }}
        />

        {/* Decorative Dots */}
        <div className="absolute top-8 left-8 w-3 h-3 bg-white rounded-full" />
        <div className="absolute top-8 right-8 w-3 h-3 bg-white rounded-full" />
        <div className="absolute bottom-8 left-8 w-3 h-3 bg-white rounded-full" />
        <div className="absolute bottom-8 right-8 w-3 h-3 bg-white rounded-full" />
      </div>

      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-8">
        {/* Heading */}
        <h2
          className="text-white font-bold mb-6"
          style={{
            fontFamily: "Figtree, Helvetica, sans-serif",
            fontSize: "48px",
            lineHeight: "1.1",
            letterSpacing: "-0.02em",
          }}
        >
          {heading}
        </h2>

        {/* Contact Information */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
          {/* Location */}
          {location && (
            <a
              href={location.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-white hover:text-white/80 transition-colors"
            >
              {location.icon}
              <span
                style={{
                  fontFamily: "Figtree, Helvetica, sans-serif",
                  fontSize: "18px",
                  fontWeight: 500,
                }}
              >
                {location.text}
              </span>
            </a>
          )}

          {/* Email */}
          {email && (
            <a
              href={email.href}
              className="flex items-center gap-3 text-white hover:text-white/80 transition-colors"
            >
              {email.icon}
              <span
                style={{
                  fontFamily: "Figtree, Helvetica, sans-serif",
                  fontSize: "18px",
                  fontWeight: 500,
                }}
              >
                {email.text}
              </span>
            </a>
          )}

          {/* Phone */}
          {phone && (
            <a
              href={phone.href}
              className="flex items-center gap-3 text-white hover:text-white/80 transition-colors"
            >
              {phone.icon}
              <span
                style={{
                  fontFamily: "Figtree, Helvetica, sans-serif",
                  fontSize: "18px",
                  fontWeight: 500,
                }}
              >
                {phone.text}
              </span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
};
