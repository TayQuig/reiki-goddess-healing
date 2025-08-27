import React from "react";

export interface HeroV2Props {
  backgroundImage?: {
    src: string;
    alt: string;
  };
  overlayContent?: {
    heading?: string;
    subheading?: string;
    buttons?: Array<{
      text: string;
      variant: "primary" | "secondary";
      href?: string;
      onClick?: () => void;
    }>;
  };
  className?: string;
}

/**
 * Hero V2 component extracted from Figma screenshots
 * Homepage hero with centered overlay content and background image
 */
export const HeroV2: React.FC<HeroV2Props> = ({
  backgroundImage = {
    src: "/img/fb8b1754eb9a50a6cfaec02f5ef0c9bc-1.png",
    alt: "Reiki healing session background",
  },
  overlayContent = {
    heading: "The Reiki Goddess Healing",
    subheading:
      "Energy Healing for Optimal Mental Health & Wellness. Ground your energy, reduce stress, and restore balance.",
    buttons: [
      {
        text: "Book a Session",
        variant: "primary",
        href: "/book",
      },
      {
        text: "Learn More",
        variant: "secondary",
        href: "/about",
      },
    ],
  },
  className = "",
}) => {
  return (
    <section
      className={`relative w-full overflow-hidden ${className}`}
      style={{
        height: "825px", // 93px (nav) + 732px (image) = 825px total
      }}
    >
      {/* Background Image with Fallback - positioned with 66px buffer from edges */}
      <div className="absolute inset-0">
        {backgroundImage ? (
          <>
            <img
              src={backgroundImage.src}
              alt={backgroundImage.alt}
              className="absolute"
              style={{
                top: "93px",
                left: "66px",
                right: "66px",
                width: "calc(100% - 132px)", // Account for 66px buffer on each side
                maxWidth: "1308px",
                height: "732px",
                objectFit: "cover",
                borderRadius: "20px",
              }}
              onError={(e) => {
                // Hide broken image and show gradient fallback
                const target = e.currentTarget;
                target.style.display = "none";
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = "block";
              }}
            />
            {/* Gradient Fallback (hidden by default) */}
            <div
              className="absolute inset-0 w-full h-full"
              style={{
                display: "none",
                background:
                  "linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #3B82F6 100%)",
              }}
            />
          </>
        ) : (
          // Default gradient if no image specified
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              background:
                "linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #3B82F6 100%)",
            }}
          />
        )}
        {/* Dark overlay for text readability - positioned over the hero image with 66px buffer */}
        <div
          className="absolute bg-black/30"
          style={{
            top: "93px",
            left: "66px",
            right: "66px",
            width: "calc(100% - 132px)",
            maxWidth: "1308px",
            height: "732px",
            borderRadius: "20px",
          }}
        />
      </div>

      {/* Overlay Content - positioned relative to hero image */}
      <div
        className="absolute z-10 w-full"
        style={{
          top: "calc(93px + 436px)", // Navbar (93px) + 436px from top of hero image
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <div
          className="text-center"
          style={{ width: "825px", margin: "0 auto" }}
        >
          {/* Main Heading - positioned 436px from top of hero image */}
          {overlayContent.heading && (
            <h1
              className="mb-6"
              style={{
                fontFamily:
                  'Figtree, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                fontSize: "63.55px",
                fontWeight: 700,
                fontStyle: "normal",
                lineHeight: "100%",
                letterSpacing: "0%",
                color: "#FFFFFF",
                width: "825px",
                height: "76px",
              }}
            >
              {overlayContent.heading}
            </h1>
          )}

          {/* Subheading - Frame 9 subtext specs */}
          {overlayContent.subheading && (
            <p
              className="mb-10 mx-auto"
              style={{
                fontFamily:
                  'Figtree, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                fontSize: "16px",
                fontWeight: 500,
                fontStyle: "normal",
                lineHeight: "24px",
                letterSpacing: "0%",
                textAlign: "center",
                color: "#FFFFFF",
                width: "533px",
                height: "48px",
              }}
            >
              {overlayContent.subheading}
            </p>
          )}

          {/* CTA Buttons */}
          {overlayContent.buttons && overlayContent.buttons.length > 0 && (
            <div className="flex gap-4 justify-center">
              {overlayContent.buttons.map((button, index) => (
                <a
                  key={index}
                  href={button.href || "#"}
                  className="inline-flex items-center justify-center rounded-full transition-all duration-200 hover:bg-white/10 hover:scale-105"
                  style={{
                    fontFamily: "Figtree, Helvetica, sans-serif",
                    fontSize: "16px",
                    fontWeight: 500,
                    minWidth: "180px",
                    height: "48px",
                    padding: "0 32px",
                    backgroundColor: "transparent",
                    color: "white",
                    border: "2px solid white",
                    backdropFilter: "blur(10px)",
                  }}
                  onClick={button.onClick}
                >
                  {button.text}
                  <svg
                    className="ml-2 w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
