import React from "react";
import type { ImageGalleryProps } from "./ImageGallery.types";

/**
 * ImageGallery - Masonry grid layout for image gallery
 * Based on Figma design specifications from About Page Image Gallery Section
 *
 * Features:
 * - Masonry grid layout with varying image widths
 * - Fixed height rows: All images 343px tall
 * - Two-row layout with specific column patterns
 * - Row 1: Large (898px) + Medium (391px)
 * - Row 2: Small-Medium (487px) + Medium (391px) + Medium (391px)
 * - 20px gap between images
 * - Optional "See More" CTA button
 *
 * @see /docs/design/about-page-migration/figma-extraction-results.md
 */
export const ImageGallery: React.FC<ImageGalleryProps> = ({
  heading,
  images,
  seeMoreButton,
  className = "",
}) => {
  return (
    <section
      className={`w-full max-w-[1440px] mx-auto px-[66px] py-[80px] ${className}`}
      style={{ backgroundColor: "#FEFBF5" }}
    >
      {/* Heading */}
      {heading && (
        <h2
          className="text-[48px] font-bold text-black text-center mb-[119px]"
          style={{ fontFamily: "Figtree, sans-serif" }}
        >
          {heading}
        </h2>
      )}

      {/* Masonry Grid */}
      <div className="flex flex-col gap-[20px]">
        {/* Row 1: Large + Medium */}
        <div className="flex gap-[20px]">
          {images[0] && (
            <div className="w-[898px] h-[343px]">
              <img
                src={images[0].src}
                alt={images[0].alt}
                className="w-full h-full object-cover rounded-[8px]"
                loading="lazy"
              />
            </div>
          )}
          {images[1] && (
            <div className="w-[391px] h-[343px]">
              <img
                src={images[1].src}
                alt={images[1].alt}
                className="w-full h-full object-cover rounded-[8px]"
                loading="lazy"
              />
            </div>
          )}
        </div>

        {/* Row 2: Small-Medium + Medium + Medium */}
        <div className="flex gap-[20px]">
          {images[2] && (
            <div className="w-[487px] h-[343px]">
              <img
                src={images[2].src}
                alt={images[2].alt}
                className="w-full h-full object-cover rounded-[8px]"
                loading="lazy"
              />
            </div>
          )}
          {images[3] && (
            <div className="w-[391px] h-[343px]">
              <img
                src={images[3].src}
                alt={images[3].alt}
                className="w-full h-full object-cover rounded-[8px]"
                loading="lazy"
              />
            </div>
          )}
          {images[4] && (
            <div className="w-[391px] h-[343px]">
              <img
                src={images[4].src}
                alt={images[4].alt}
                className="w-full h-full object-cover rounded-[8px]"
                loading="lazy"
              />
            </div>
          )}
        </div>
      </div>

      {/* See More Button - Centered */}
      {seeMoreButton && (
        <div className="flex justify-center mt-[60px]">
          <button
            onClick={seeMoreButton.onClick}
            aria-label={seeMoreButton.ariaLabel || seeMoreButton.text}
            className="w-[137px] px-[10px] py-[10px] rounded-[90px] border border-[#0205B7] bg-transparent text-[16px] font-medium text-[#0205B7] hover:bg-[#0205B7] hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
            style={{ fontFamily: "Figtree, sans-serif" }}
          >
            <span>{seeMoreButton.text}</span>
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
          </button>
        </div>
      )}
    </section>
  );
};
