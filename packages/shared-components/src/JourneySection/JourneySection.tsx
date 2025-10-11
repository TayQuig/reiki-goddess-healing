import React from "react";
import { CertificationCards } from "../CertificationCards";
import type { JourneySectionProps } from "./JourneySection.types";

/**
 * JourneySection - Displays the personal journey story with certification cards
 * Based on Figma design specifications from About Page Section 3
 *
 * Features:
 * - Large background hero image (806px × 808px)
 * - Side image (400px × 432px)
 * - Section heading and body text
 * - Integration with CertificationCards component
 * - Responsive layout with absolute positioning
 *
 * @see /docs/design/about-page-migration/figma-extraction-results.md - Section 3
 */
export const JourneySection: React.FC<JourneySectionProps> = ({
  heading = "My Journey: Inspiring Personal Growth & Renewal",
  content = (
    <p className="text-[#1C1B1B]">
      My journey into energy healing began with a personal quest for balance and
      wellness. Through years of dedicated practice and study, I&apos;ve had the
      privilege of helping countless individuals reconnect with their inner
      peace and vitality. Each session is a sacred space where transformation
      unfolds naturally, guided by ancient wisdom and modern healing techniques.
    </p>
  ),
  backgroundImage = {
    src: "/img/fb8b1754eb9a50a6cfaec02f5ef0c9bc-3.png",
    alt: "Healing journey background",
  },
  sideImage = {
    src: "/img/rectangle-6.png",
    alt: "Healing space",
  },
  certifications = [
    {
      title: "Sound Healing Specialist",
      description:
        "Skilled in using vibration and frequency for deep relaxation.",
      variant: "gradient",
    },
    {
      title: "Years of Experience",
      description:
        "Supporting clients in emotional, physical, and spiritual growth.",
      variant: "white",
    },
    {
      title: "Certified Reiki Master",
      description: "Advanced training in energy healing techniques.",
      variant: "white",
    },
  ],
  className = "",
}) => {
  return (
    <section
      className={`relative overflow-hidden ${className}`}
      style={{
        height: "808px",
        backgroundColor: "#FFFBF5",
      }}
    >
      {/* Background Hero Image */}
      <div
        className="absolute"
        style={{
          width: "806px",
          height: "808px",
          top: "0",
          left: "78px",
          zIndex: 1,
        }}
      >
        <img
          src={backgroundImage.src}
          alt={backgroundImage.alt}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>

      {/* Side Image */}
      <div
        className="absolute"
        style={{
          width: "400px",
          height: "432px",
          top: "-28px", // Calculated from Figma: 2078px (section top) - 2106px (image top)
          left: "156px",
          zIndex: 2,
        }}
      >
        <img
          src={sideImage.src}
          alt={sideImage.alt}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>

      {/* Content Container */}
      <div
        className="absolute"
        style={{
          width: "884px",
          top: "0",
          left: "556px",
          zIndex: 3,
        }}
      >
        {/* Heading */}
        <h2
          className="mb-8"
          style={{
            fontFamily: "Figtree, sans-serif",
            fontSize: "48px",
            fontWeight: 700,
            color: "#000000",
            width: "616px",
            marginTop: "43px",
            marginLeft: "115px",
          }}
        >
          {heading}
        </h2>

        {/* Body Text */}
        <div
          style={{
            fontFamily: "Figtree, sans-serif",
            fontSize: "16px",
            fontWeight: 500,
            lineHeight: "23px",
            width: "608px",
            marginTop: "152px", // 195px from top - 43px heading offset
            marginLeft: "115px",
          }}
        >
          {content}
        </div>

        {/* Certification Cards */}
        <div
          className="absolute"
          style={{
            top: "474px",
            left: "0",
            width: "884px",
          }}
        >
          {/* Cards Container with Custom Positioning */}
          <div className="relative">
            {/* Card 1 */}
            {certifications[0] && (
              <div
                className="absolute"
                style={{
                  top: "0",
                  left: "0",
                }}
              >
                <CertificationCards cards={[certifications[0]]} />
              </div>
            )}

            {/* Card 2 */}
            {certifications[1] && (
              <div
                className="absolute"
                style={{
                  top: "48px", // Staggered positioning
                  left: "358px",
                }}
              >
                <CertificationCards cards={[certifications[1]]} />
              </div>
            )}

            {/* Card 3 */}
            {certifications[2] && (
              <div
                className="absolute"
                style={{
                  top: "154px", // From Figma: 2628px - 2106px (section top) - 474px (cards top) = 48px
                  left: "198px",
                }}
              >
                <CertificationCards cards={[certifications[2]]} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
