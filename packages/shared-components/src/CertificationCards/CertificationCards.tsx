import React from "react";
import type {
  CertificationCardsProps,
  CertificationCard,
} from "./CertificationCards.types";

/**
 * CertificationCards - Displays certification cards with blue bevel shadow effect
 * Based on Figma design specifications from About Page Journey Section
 *
 * Features:
 * - Blue bevel shadow: 0px 9px 0px #0205B7 (solid) + soft shadow
 * - Gradient variant: Blue to cyan gradient background
 * - White variant: White background with dark text
 * - Card dimensions: 322px × 156px with 17px border radius
 *
 * @see /docs/design/about-page-migration/figma-extraction-results.md
 */
export const CertificationCards: React.FC<CertificationCardsProps> = ({
  cards,
  className = "",
}) => {
  const renderCard = (card: CertificationCard, index: number) => {
    const isGradient = card.variant === "gradient";

    return (
      <div
        key={index}
        className={`group relative rounded-[17px] h-[156px] w-[322px] transition-all duration-300 transform hover:-translate-y-2 ${className}`}
        style={{
          background: isGradient
            ? "linear-gradient(122deg, #0205B7 0%, #63D5F9 100%)"
            : "#FFFFFF",
          boxShadow:
            "0px 9px 0px #0205B7, 0px 42px 32.5px -13px rgba(0,0,0,0.16)",
        }}
      >
        {/* Gradient Background Overlay - appears on hover for white cards */}
        {!isGradient && (
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[17px]"
            style={{
              background: "linear-gradient(122deg, #0205B7 0%, #63D5F9 100%)",
              zIndex: 0,
            }}
          />
        )}

        {/* Title */}
        <h3
          className={`absolute left-[25px] top-[35px] text-[18px] font-bold z-10 ${
            isGradient ? "text-white" : "text-black group-hover:text-white"
          } transition-colors duration-300`}
          style={{ fontFamily: "Figtree, sans-serif" }}
        >
          {card.title}
        </h3>

        {/* Description */}
        <p
          className={`absolute left-[25px] top-[70px] w-[247px] text-[18px] font-medium leading-[23px] z-10 ${
            isGradient ? "text-white" : "text-[#1C1B1B] group-hover:text-white"
          } transition-colors duration-300`}
          style={{ fontFamily: "Figtree, sans-serif" }}
        >
          {card.description}
        </p>
      </div>
    );
  };

  return (
    <div className="flex flex-wrap gap-[20px]">
      {cards.map((card, index) => renderCard(card, index))}
    </div>
  );
};
