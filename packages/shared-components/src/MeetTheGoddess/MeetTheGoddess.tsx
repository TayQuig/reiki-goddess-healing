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
 * Responsive: Stacked on Mobile, Grid on Desktop
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
      className={`relative py-12 md:py-20 overflow-hidden ${className}`}
      style={{ backgroundColor: "#FFFBF5" }}
    >
      {/* Background Smoke - Hidden on small mobile to prevent clutter */}
      <div className="hidden md:block absolute top-0 left-0 w-[810px] h-[810px] z-0 opacity-50 pointer-events-none">
        <img
          src="/img/smoke.png"
          alt=""
          className="w-full h-full object-cover mix-blend-overlay"
        />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[66px]">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Text Content - Order 1 on mobile */}
          <div className="w-full lg:w-1/2 order-1 lg:order-1">
            <h2
              className="mb-6 text-3xl md:text-5xl font-bold text-[#333333]"
              style={{ fontFamily: "Figtree, sans-serif" }}
            >
              {heading}
            </h2>
            <div
              className="mb-8 text-base md:text-lg text-[#5E5E5E] leading-relaxed"
              style={{ fontFamily: "Figtree, sans-serif" }}
            >
              {content}
            </div>
            {ctaButton && (
              <a
                href={ctaButton.href}
                className="inline-flex items-center justify-center px-8 py-3 rounded-full border-2 border-[#0205B7] text-[#0205B7] font-medium hover:bg-blue-50 transition-colors"
              >
                {ctaButton.text}
              </a>
            )}
          </div>

          {/* Images - Order 2 on mobile */}
          <div className="w-full lg:w-1/2 order-2 lg:order-2 relative h-[300px] md:h-[500px]">
            {/* Desktop Layout: Absolute positioning preserved for larger screens */}
            {/* Mobile Layout: Stacked or simplified grid */}

            {/* Main Image (Tertiary) */}
            {images.tertiary && (
              <div className="absolute left-0 top-0 md:top-10 w-[70%] h-[70%] md:h-[60%] z-10 transform -rotate-3 shadow-xl rounded-3xl overflow-hidden border-4 border-white">
                <img
                  src={images.tertiary.src}
                  alt={images.tertiary.alt}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Secondary Image */}
            {images.secondary && (
              <div className="absolute right-0 bottom-0 md:bottom-10 w-[50%] h-[60%] md:h-[50%] z-20 transform rotate-6 shadow-xl rounded-3xl overflow-hidden border-4 border-white">
                <img
                  src={images.secondary.src}
                  alt={images.secondary.alt}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Badge */}
            <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 z-30 w-full text-center">
              <span className="text-[#0205B7] font-medium text-lg md:text-xl tracking-widest bg-white/80 px-4 py-1 rounded-full backdrop-blur-sm whitespace-nowrap">
                The Reiki Goddess
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
