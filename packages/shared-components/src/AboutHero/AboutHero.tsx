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
      className={`relative w-full ${className}`}
      style={{
        backgroundColor: "#FEFBF5",
        minHeight: "1200px",
        paddingBottom: "80px",
        maxWidth: "1440px",
        margin: "0 auto",
        overflow: "visible",
      }}
    >
      {/* Smoke Plume - Behind AboutHero */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "361px",
          right: "0",
          width: "808px",
          height: "808px",
          zIndex: 0,
        }}
      >
        {[...Array(5)].map((_, i) => (
          <img
            key={i}
            src="/img/smoke.png"
            alt=""
            style={{
              width: "808px",
              height: "808px",
              objectFit: "cover",
              position: "absolute",
              left: "0",
              top: "0",
              transform: "rotate(-180deg)",
              opacity: 0.5,
              mixBlendMode: "normal",
            }}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ))}
      </div>

      {/* Hero Image - Below Header with blue border effect */}
      <div className="absolute top-[513px] left-[66px] w-[1308px] h-[503px]">
        {/* Blue background rectangle - shifted down and left for border effect */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: "#0205B7",
            borderRadius: "32px",
            transform: "translate(-5px, 5px)",
            zIndex: 0,
          }}
        />
        {/* Image on top */}
        <img
          src={heroImage.src}
          alt={heroImage.alt}
          className="w-full h-full object-cover rounded-[32px] relative"
          style={{
            zIndex: 1,
            position: "relative",
          }}
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
        className="absolute top-[193px] left-[66px] w-[825px] h-[152px] text-[63.55px] font-bold text-black"
        style={{
          fontFamily: "Figtree, sans-serif",
          lineHeight: "100%",
          letterSpacing: "0%",
        }}
      >
        {heading}
      </h1>

      {/* Dual-Column Text Layout */}
      <div className="absolute top-[381px] left-[66px] flex gap-[72px]">
        {/* Left Column */}
        <div
          className="w-[618px] h-[72px] text-[16px] font-medium leading-[24px] text-[#1C1B1B]"
          style={{ fontFamily: "Figtree, sans-serif", letterSpacing: "0%" }}
        >
          {leftColumnText}
        </div>

        {/* Right Column */}
        <div
          className="w-[618px] h-[72px] text-[16px] font-medium leading-[24px] text-[#1C1B1B]"
          style={{ fontFamily: "Figtree, sans-serif", letterSpacing: "0%" }}
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
