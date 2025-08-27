import React from "react";

export interface HeroProps {
  heading?: {
    line1?: string;
    line2?: string;
    line3?: string;
  };
  description?: {
    left?: React.ReactNode;
    right?: React.ReactNode;
  };
  overlayText?: {
    content?: string;
    position?: {
      top?: string;
      left?: string;
      right?: string;
      bottom?: string;
    };
    style?: React.CSSProperties;
  };
  image?: {
    src: string;
    alt: string;
  };
  backgroundImage?: {
    src: string;
    alt: string;
  };
  className?: string;
}

/**
 * Hero component extracted from Figma design
 * Homepage hero section with heading, description, and imagery
 */
export const Hero: React.FC<HeroProps> = ({
  heading = {
    line1: "Experienced Reiki Master",
    line2: "& Sound Healer",
    line3: "in Roy",
  },
  overlayText,
  description = {
    left: (
      <>
        <span className="font-medium text-[#1c1b1b]">
          Welcome to The Reiki Goddess Healing, where transformation meets
          tranquility. I&apos;m{" "}
        </span>
        <span className="font-bold italic text-[#0205b7]">Lori Olson</span>
        <span className="font-medium text-[#1c1b1b]">, a certified </span>
        <span className="font-bold text-[#1c1b1b]">Reiki Master</span>
        <span className="font-medium text-[#1c1b1b]"> and </span>
        <span className="font-bold text-[#1c1b1b]">Sound Healer</span>
        <span className="font-medium text-[#1c1b1b]">
          {" "}
          dedicated to guiding you on your journey to wellness and inner peace.
        </span>
      </>
    ),
    right: (
      <>
        <span className="font-medium text-[#1c1b1b]">
          With years of experience in{" "}
        </span>
        <span className="font-bold text-[#1c1b1b]">energy healing</span>
        <span className="font-medium text-[#1c1b1b]"> and </span>
        <span className="font-bold text-[#1c1b1b]">holistic wellness</span>
        <span className="font-medium text-[#1c1b1b]">
          , I offer personalized sessions that blend ancient healing techniques
          with modern understanding. Each session is tailored to your unique
          needs, helping you release energy blockages, reduce stress, and
          restore balance to your mind, body, and spirit.
        </span>
      </>
    ),
  },
  image = {
    src: "/img/fb8b1754eb9a50a6cfaec02f5ef0c9bc-2.png",
    alt: "Reiki healing session",
  },
  backgroundImage = {
    src: "/img/powerrangers-6.png",
    alt: "Decorative background",
  },
  className = "",
}) => {
  return (
    <section
      className={`absolute w-[1374px] h-[916px] top-28 left-[66px] ${className}`}
    >
      {/* Hero Image */}
      <img
        className="absolute w-[808px] h-[808px] left-[566px] top-0 aspect-[1] object-cover"
        alt={image.alt}
        src={image.src}
      />

      {/* Overlay Text (Frame 9) */}
      {overlayText && overlayText.content && (
        <div
          className="absolute z-10"
          style={{
            top: overlayText.position?.top || "auto",
            left: overlayText.position?.left || "auto",
            right: overlayText.position?.right || "auto",
            bottom: overlayText.position?.bottom || "auto",
            ...overlayText.style,
          }}
        >
          {overlayText.content}
        </div>
      )}

      {/* Decorative Background Element */}
      <img
        className="absolute w-[1308px] h-[515px] top-[401px] left-0"
        alt={backgroundImage.alt}
        src={backgroundImage.src}
      />

      {/* Main Heading */}
      <div className="absolute w-[825px] top-20 left-0">
        <h1
          className="font-bold text-[63.6px] tracking-[0] leading-[76.3px] text-black"
          style={{
            fontFamily: "Figtree, Helvetica, sans-serif",
          }}
        >
          {heading.line1}
          {heading.line2 && (
            <>
              <br />
              {heading.line2}
            </>
          )}
          {heading.line3 && (
            <>
              <br />
              {heading.line3}
            </>
          )}
        </h1>
      </div>

      {/* Description Text - Left Column */}
      <div className="absolute w-[400px] top-[292px] left-0">
        <p
          className="text-base leading-6"
          style={{
            fontFamily: "Figtree, Helvetica, sans-serif",
          }}
        >
          {description.left}
        </p>
      </div>

      {/* Description Text - Right Column */}
      <div className="absolute w-[400px] top-[292px] left-[430px]">
        <p
          className="text-base leading-6"
          style={{
            fontFamily: "Figtree, Helvetica, sans-serif",
          }}
        >
          {description.right}
        </p>
      </div>
    </section>
  );
};
