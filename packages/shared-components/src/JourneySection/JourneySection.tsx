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
      {/* Background Hero Image with blue border effect */}
      <div
        className="absolute"
        style={{
          width: "400px",
          height: "432px",
          top: "0",
          left: "156px",
          zIndex: 1,
        }}
      >
        {/* Blue background rectangle - shifted down and left for border effect */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: "#0205B7",
            borderRadius: "20px",
            transform: "translate(-5px, 5px)",
            zIndex: 0,
          }}
        />
        {/* Image on top */}
        <img
          src={backgroundImage.src}
          alt={backgroundImage.alt}
          className="w-full h-full object-cover rounded-[20px] relative"
          style={{
            zIndex: 1,
            position: "relative",
          }}
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
          style={{
            fontFamily: "Figtree, sans-serif",
            fontSize: "48px",
            fontWeight: 700,
            color: "#000000",
            width: "616px",
            height: "116px",
            lineHeight: "100%",
            letterSpacing: "0%",
            position: "absolute",
            top: "72px",
            left: "115px",
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
            letterSpacing: "0%",
            color: "#1C1B1B",
            width: "608px",
            height: "138px",
            position: "absolute",
            top: "224px",
            left: "115px",
          }}
        >
          {content}
        </div>

        {/* Certification Cards - positioned from page top/left buffer edge */}
        <div
          className="absolute"
          style={{ top: "0", left: "-550px", width: "100%", height: "100%" }}
        >
          {/* Card 1 - Certified Reiki Master (white) - Left */}
          {certifications[0] && (
            <div
              className="absolute"
              style={{
                top: "522px",
                left: "198px",
              }}
            >
              <CertificationCards cards={[certifications[0]]} />
            </div>
          )}

          {/* Card 2 - Sound Healing Specialist (gradient) - Center */}
          {certifications[1] && (
            <div
              className="absolute"
              style={{
                top: "522px",
                left: "556px",
              }}
            >
              <CertificationCards cards={[certifications[1]]} />
            </div>
          )}

          {/* Card 3 - Years of Experience (white) - Right */}
          {certifications[2] && (
            <div
              className="absolute"
              style={{
                top: "522px",
                left: "914px",
              }}
            >
              <CertificationCards cards={[certifications[2]]} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
