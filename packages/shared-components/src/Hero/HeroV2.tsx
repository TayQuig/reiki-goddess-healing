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
 * Responsive: Mobile optimized, Tablet adapted, Desktop precise
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
      // Height is responsive: auto on mobile, fixed on desktop
    >
      {/* Spacer for Navbar on desktop since it's often absolute */}
      <div className="h-[93px] hidden lg:block" />

      <div className="relative w-full flex flex-col items-center">
        {/* Image Container */}
        <div
          className="relative w-full overflow-hidden rounded-[20px]"
          style={{
            height: "60vh", // Mobile height
            minHeight: "500px",
            maxHeight: "732px", // Desktop limit
          }}
        >
          {/* Main Image */}
          {backgroundImage ? (
            <img
              src={backgroundImage.src}
              alt={backgroundImage.alt}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = "none";
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = "block";
              }}
            />
          ) : null}

          {/* Fallback Gradient */}
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              display: backgroundImage ? "none" : "block",
              background:
                "linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #3B82F6 100%)",
            }}
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Content Overlay - Centered */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-8 pt-10">
            {/* Heading */}
            {overlayContent.heading && (
              <h1
                className="mb-4 sm:mb-6 font-bold text-white"
                style={{
                  fontFamily: "Figtree, sans-serif",
                  // Responsive font size
                }}
              >
                <span className="text-3xl sm:text-5xl lg:text-[63.55px] leading-tight">
                  {overlayContent.heading}
                </span>
              </h1>
            )}

            {/* Subheading */}
            {overlayContent.subheading && (
              <p
                className="mb-8 sm:mb-10 max-w-lg mx-auto font-medium text-white"
                style={{
                  fontFamily: "Figtree, sans-serif",
                }}
              >
                <span className="text-base sm:text-lg leading-relaxed">
                  {overlayContent.subheading}
                </span>
              </p>
            )}

            {/* Buttons */}
            {overlayContent.buttons && overlayContent.buttons.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                {overlayContent.buttons.map((button, index) => (
                  <a
                    key={index}
                    href={button.href || "#"}
                    className="inline-flex items-center justify-center rounded-full transition-all duration-200 hover:bg-white/10 hover:scale-105 border-2 border-white text-white backdrop-blur-md"
                    style={{
                      fontFamily: "Figtree, sans-serif",
                      height: "48px",
                      padding: "0 32px",
                      fontSize: "16px",
                      fontWeight: 500,
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
      </div>
    </section>
  );
};
