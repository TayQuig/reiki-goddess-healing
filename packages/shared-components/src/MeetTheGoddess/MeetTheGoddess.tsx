import React from "react";

export interface MeetTheGoddessProps {
  heading?: string;
  content?: React.ReactNode;
  images?: {
    main?: { src: string; alt: string };
    secondary?: { src: string; alt: string };
    tertiary?: { src: string; alt: string };
  };
  ctaButton?: {
    text: string;
    href: string;
    onClick?: () => void;
  };
  className?: string;
}

/**
 * Meet The Reiki Goddess section component
 * About preview section with bio and images
 */
export const MeetTheGoddess: React.FC<MeetTheGoddessProps> = ({
  heading = "Meet Deirdre, The Reiki Goddess",
  content = (
    <>
      <p className="mb-4">
        A certified Reiki master, trauma-informed healer, and sound therapist
        based in Roy, WA. Her compassion, grace, and authentic presence help
        clients transform from stressed, anxious, and disconnected to feeling
        grounded, balanced, and at peace.
      </p>
      <p className="mb-4">
        In my dream holistic shop alongside skilled, ethical, and joyful healers
        who operate in integrity, a space for connection, transformation, and
        healing unfolds. Together, we create a sanctuary where individuals
        journey towards wellness, find inner peace, and reconnect with their
        authentic selves in a supportive and nurturing environment.
      </p>
    </>
  ),
  images = {
    main: {
      src: "/img/fb8b1754eb9a50a6cfaec02f5ef0c9bc-meet-the-reiki-goddess-background.png",
      alt: "Deirdre, The Reiki Goddess",
    },
    secondary: {
      src: "/img/img-3859.png",
      alt: "Healing session in progress",
    },
    tertiary: {
      src: "/img/IMG_4891-meet-the-reiki-goddess.png",
      alt: "Sacred healing space",
    },
  },
  ctaButton = {
    text: "Read Full Story",
    href: "/about",
  },
  className = "",
}) => {
  return (
    <section
      className={`relative py-20 overflow-hidden ${className}`}
      style={{
        minHeight: "650px",
        backgroundColor: "#FFFBF5",
      }}
    >
      {/* Smoke layer - positioned in background behind text */}
      <div
        className="absolute"
        style={{
          left: "0", // Aligned with page edge
          top: "0",
          width: "810px",
          height: "810px",
          zIndex: 2, // Behind text and images
        }}
      >
        <img
          src="/img/smoke.png"
          alt="Smoke effect"
          style={{
            width: "810px",
            height: "810px",
            objectFit: "cover",
            position: "absolute",
            left: "0",
            top: "0",
            transform: "rotate(180deg)", // Rotate to position top-right in bottom-left
            opacity: 0.5,
            filter: "saturate(100%)",
            mixBlendMode: "normal",
          }}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        {/* Duplicate smoke layer for enhanced color */}
        <img
          src="/img/smoke.png"
          alt="Smoke effect duplicate"
          style={{
            width: "810px",
            height: "810px",
            objectFit: "cover",
            position: "absolute",
            left: "0",
            top: "0",
            transform: "rotate(180deg)", // Same rotation as original
            opacity: 0.3,
            filter: "saturate(150%)",
            mixBlendMode: "multiply",
          }}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        {/* Third smoke layer for maximum enhancement */}
        <img
          src="/img/smoke.png"
          alt="Smoke effect triple"
          style={{
            width: "810px",
            height: "810px",
            objectFit: "cover",
            position: "absolute",
            left: "0",
            top: "0",
            transform: "rotate(180deg)", // Same rotation as original
            opacity: 0.2,
            filter: "saturate(200%) hue-rotate(-10deg)",
            mixBlendMode: "overlay",
          }}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>

      <div
        className="relative z-10"
        style={{ maxWidth: "1440px", margin: "0 auto" }}
      >
        {/* IMG_4891 with blue background bevel */}
        {images.tertiary && (
          <div
            className="absolute z-20"
            style={{
              left: "688px",
              top: "50px",
              width: "455.9px",
              height: "310.61566px",
              transform: "rotate(-4.85deg)",
              transformOrigin: "center",
            }}
          >
            {/* Blue background rectangle - shifted down 5px and left 5px */}
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: "#0205B7",
                borderRadius: "27px",
                transform: "translate(-5px, 5px)",
                zIndex: 0,
              }}
            />
            {/* Image on top */}
            <img
              src={images.tertiary.src}
              alt={images.tertiary.alt}
              className="w-full h-full object-cover relative"
              style={{
                borderRadius: "27px",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
                zIndex: 1,
                position: "relative",
              }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        )}

        {/* "The Reiki Goddess" text underneath IMG_4891 */}
        <div
          className="absolute z-20"
          style={{
            left: "752px",
            top: "370px", // Positioned relative to section top (1418px from page top)
            width: "221px",
            height: "26px",
            transform: "rotate(-5.24deg)",
            transformOrigin: "center",
          }}
        >
          <span
            style={{
              fontFamily:
                'Figtree, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              fontSize: "22px",
              fontWeight: 500,
              fontStyle: "normal",
              lineHeight: "100%",
              letterSpacing: "10%",
              color: "#0205B7", // Brand blue color
              whiteSpace: "nowrap",
            }}
          >
            The Reiki Goddess
          </span>
        </div>

        {/* IMG_3859 with blue background bevel */}
        {images.secondary && (
          <div
            className="absolute z-30"
            style={{
              left: "1010.153px",
              top: "calc(50px + 310.61566px - 100px)",
              width: "283.49694050307664px",
              height: "207.90078167808508px",
              transform: "rotate(8.13deg)",
              transformOrigin: "center",
            }}
          >
            {/* Blue background rectangle - shifted down 5px and right 5px */}
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: "#0205B7",
                borderRadius: "24px",
                transform: "translate(5px, 5px)",
                zIndex: 0,
              }}
            />
            {/* Image on top */}
            <img
              src={images.secondary.src}
              alt={images.secondary.alt}
              className="w-full h-full object-cover relative"
              style={{
                borderRadius: "24px",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
                zIndex: 1,
                position: "relative",
              }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        )}

        <div className="relative" style={{ padding: "0 66px" }}>
          {/* Text Content */}
          <div style={{ maxWidth: "600px" }}>
            <h2
              className="mb-8"
              style={{
                fontFamily: "Figtree, Helvetica, sans-serif",
                fontSize: "48px",
                fontWeight: 700,
                lineHeight: "56px",
                color: "rgba(51, 51, 51, 1)",
              }}
            >
              {heading}
            </h2>

            <div
              className="mb-8"
              style={{
                fontFamily: "Figtree, Helvetica, sans-serif",
                fontSize: "18px",
                fontWeight: 400,
                lineHeight: "28px",
                color: "rgba(94, 94, 94, 1)",
              }}
            >
              {content}
            </div>

            {ctaButton && (
              <a
                href={ctaButton.href}
                onClick={ctaButton.onClick}
                className="inline-flex items-center justify-center rounded-full transition-all duration-200 hover:bg-blue-50 hover:scale-105"
                style={{
                  fontFamily: "Figtree, Helvetica, sans-serif",
                  fontSize: "16px",
                  fontWeight: 500,
                  minWidth: "180px",
                  height: "48px",
                  padding: "0 32px",
                  backgroundColor: "transparent",
                  color: "rgba(2, 5, 183, 1)",
                  border: "2px solid rgba(2, 5, 183, 1)",
                }}
              >
                {ctaButton.text}
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
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
