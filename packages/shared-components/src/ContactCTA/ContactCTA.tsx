import React from "react";
import type { ContactCTAProps } from "./ContactCTA.types";

/**
 * ContactCTA - Call-to-action section with background image overlay
 * Based on Figma design specifications from About Page Section 4
 *
 * Features:
 * - Full-width card with rounded corners (33px radius)
 * - Background image with blue overlay (#0205B7 at 44% opacity)
 * - Centered heading and body text
 * - Two CTA buttons (Book a Session + Learn More)
 *
 * @see /docs/design/about-page-migration/figma-extraction-results.md - Section 4
 */
export const ContactCTA: React.FC<ContactCTAProps> = ({
  heading = "Contact Me for Personalized Assistance",
  bodyText = "At The Reiki Goddess Healing, your well-being is my highest priority. I understand how important it is to feel a sense of accomplishment, inner peace, and balance in life. That's why, after understanding your needs and goals, I create a fully customized healing plan just for you — guiding you every step of the way toward transformation.",
  backgroundImage = {
    src: "/figma-screenshots/about/images/e52a7ca86eedd8aaa5adedc655e814574dcd329c.jpg",
    alt: "Sound healing with gong bath",
  },
  buttons = [
    {
      text: "Book a Session",
      variant: "primary" as const,
      href: "/contact",
    },
    {
      text: "Learn More",
      variant: "secondary" as const,
      href: "/services",
    },
  ],
  className = "",
}) => {
  return (
    <section
      className={`relative ${className}`}
      style={{
        width: "1309px",
        height: "432px",
        margin: "0 auto",
      }}
    >
      {/* Card Container */}
      <div
        className="relative w-full h-full overflow-hidden"
        style={{
          borderRadius: "33px",
        }}
      >
        {/* Background Image */}
        <img
          src={backgroundImage.src}
          alt={backgroundImage.alt}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            zIndex: 0,
            objectPosition: "center 80%",
          }}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />

        {/* Blue Overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: "#0205B7",
            opacity: 0.44,
            zIndex: 1,
          }}
        />

        {/* Content Container */}
        <div className="absolute inset-0" style={{ zIndex: 2 }}>
          {/* Heading */}
          <h2
            className="text-white text-center"
            style={{
              fontFamily: "Figtree, sans-serif",
              fontSize: "48px",
              fontWeight: 700,
              lineHeight: "100%",
              position: "absolute",
              top: "70px",
              left: "344px",
              width: "620px",
              height: "116px",
            }}
          >
            {heading}
          </h2>

          {/* Body Text */}
          <p
            className="text-white text-center"
            style={{
              fontFamily: "Figtree, sans-serif",
              fontSize: "16px",
              fontWeight: 500,
              lineHeight: "24px",
              position: "absolute",
              top: "210px",
              left: "209px",
              width: "890px",
              height: "72px",
            }}
          >
            {bodyText}
          </p>

          {/* Buttons Container */}
          <div
            className="absolute flex items-center justify-center gap-4"
            style={{
              top: "320px",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            {buttons.map((button, index) => {
              const isPrimary = button.variant === "primary";
              const ButtonTag = button.href ? "a" : "button";

              return (
                <ButtonTag
                  key={index}
                  href={button.href}
                  onClick={button.onClick}
                  className="inline-flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105"
                  style={{
                    fontFamily: "Figtree, sans-serif",
                    fontSize: "16px",
                    fontWeight: 500,
                    padding: "12px 24px",
                    borderRadius: "90px",
                    backgroundColor: isPrimary ? "#FFFFFF" : "transparent",
                    color: isPrimary ? "#0205B7" : "#FFFFFF",
                    border: isPrimary ? "none" : "2px solid #FFFFFF",
                    cursor: "pointer",
                    textDecoration: "none",
                  }}
                >
                  {button.text}
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 9L9 1M9 1H1M9 1V9"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </ButtonTag>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
