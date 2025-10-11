import React from "react";
import type { AboutHeroProps } from "./AboutHero.types";

/**
 * AboutHero - Hero section for About page with dual-column text layout
 * Based on Figma design specifications from About Page Hero Section
 *
 * Features:
 * - Dual-column text layout: Two 618px columns with 72px gap
 * - Hero image: 808px × 808px positioned top-right
 * - Main heading: 63.6px Figtree Bold
 * - Body text: 16px Figtree Medium with 24px line height
 * - Optional decorative image overlay
 * - Optional "Learn More" CTA button
 *
 * @see /docs/design/about-page-migration/figma-extraction-results.md
 */
export const AboutHero: React.FC<AboutHeroProps> = ({
  heading,
  leftColumnText,
  rightColumnText,
  bottomText,
  heroImage,
  decorativeImage,
  ctaButton,
  className = "",
}) => {
  return (
    <section
      className={`relative w-full max-w-[1374px] mx-auto px-[66px] pt-[112px] pb-[80px] ${className}`}
      style={{ backgroundColor: "#FEFBF5" }}
    >
      {/* Hero Image - Top Right */}
      <div className="absolute top-0 left-[632px] w-[808px] h-[808px]">
        <img
          src={heroImage.src}
          alt={heroImage.alt}
          className="w-full h-full object-cover rounded-[20px]"
          loading="eager"
        />
      </div>

      {/* Decorative Background Image */}
      {decorativeImage && (
        <div className="absolute top-[401px] left-0 w-[1308px] h-[515px] -z-10">
          <img
            src={decorativeImage.src}
            alt={decorativeImage.alt}
            className="w-full h-full object-cover opacity-50"
            loading="lazy"
          />
        </div>
      )}

      {/* Main Heading */}
      <h1
        className="absolute top-[80px] left-0 w-[825px] text-[63.6px] font-bold text-black leading-normal"
        style={{ fontFamily: "Figtree, sans-serif" }}
      >
        {heading}
      </h1>

      {/* Dual-Column Text Layout */}
      <div className="absolute top-[268px] left-0 flex gap-[72px]">
        {/* Left Column */}
        <div
          className="w-[618px] text-[16px] font-medium leading-[24px] text-[#1C1B1B]"
          style={{ fontFamily: "Figtree, sans-serif" }}
        >
          {leftColumnText}
        </div>

        {/* Right Column */}
        <div
          className="w-[618px] text-[16px] font-medium leading-[24px] text-[#1C1B1B]"
          style={{ fontFamily: "Figtree, sans-serif" }}
        >
          {rightColumnText}
        </div>
      </div>

      {/* Bottom Text */}
      {bottomText && (
        <div
          className="absolute top-[1075px] left-[66px] w-[745px] text-[16px] font-medium leading-[24px] text-[#1C1B1B]"
          style={{ fontFamily: "Figtree, sans-serif" }}
        >
          {bottomText}
        </div>
      )}

      {/* CTA Button - Bottom Right */}
      {ctaButton && (
        <button
          onClick={ctaButton.onClick}
          aria-label={ctaButton.ariaLabel || ctaButton.text}
          className="absolute top-[1104px] left-[1237px] w-[137px] px-[13px] py-[10px] rounded-[90px] border border-[#0205B7] bg-transparent text-[16px] font-medium text-[#0205B7] hover:bg-[#0205B7] hover:text-white transition-all duration-300 flex items-center gap-2"
          style={{ fontFamily: "Figtree, sans-serif" }}
        >
          <span>{ctaButton.text}</span>
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="ml-auto"
          >
            <path
              d="M1 9L9 1M9 1H1M9 1V9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </section>
  );
};
