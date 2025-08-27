import React from "react";
import { Hero, HeroProps } from "./Hero";

export interface ResponsiveHeroProps extends HeroProps {
  maxWidth?: number;
  enableResponsive?: boolean;
}

/**
 * Responsive wrapper for the Hero component
 * Maintains Figma design proportions while scaling for different viewports
 */
export const ResponsiveHero: React.FC<ResponsiveHeroProps> = ({
  maxWidth = 1440,
  enableResponsive = true,
  ...heroProps
}) => {
  if (!enableResponsive) {
    return <Hero {...heroProps} />;
  }

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        maxWidth: `${maxWidth}px`,
        margin: "0 auto",
        minHeight: "916px",
      }}
    >
      {/* Desktop Hero - Original Figma Design */}
      <div className="hidden lg:block relative h-[916px]">
        <Hero {...heroProps} />
      </div>

      {/* Tablet/Mobile Hero - Responsive Layout */}
      <div className="lg:hidden px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Mobile Heading */}
          <h1
            className="text-3xl md:text-5xl font-bold text-black mb-8"
            style={{ fontFamily: "Figtree, Helvetica, sans-serif" }}
          >
            {heroProps.heading?.line1}
            {heroProps.heading?.line2 && (
              <>
                <br />
                {heroProps.heading.line2}
              </>
            )}
            {heroProps.heading?.line3 && (
              <>
                <br />
                {heroProps.heading.line3}
              </>
            )}
          </h1>

          {/* Mobile Image */}
          {heroProps.image && (
            <div className="mb-8">
              <img
                className="w-full max-w-md mx-auto rounded-lg shadow-lg object-cover"
                alt={heroProps.image.alt}
                src={heroProps.image.src}
              />
            </div>
          )}

          {/* Mobile Description */}
          <div className="space-y-6">
            <div
              className="text-base leading-relaxed"
              style={{ fontFamily: "Figtree, Helvetica, sans-serif" }}
            >
              {heroProps.description?.left}
            </div>
            <div
              className="text-base leading-relaxed"
              style={{ fontFamily: "Figtree, Helvetica, sans-serif" }}
            >
              {heroProps.description?.right}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
