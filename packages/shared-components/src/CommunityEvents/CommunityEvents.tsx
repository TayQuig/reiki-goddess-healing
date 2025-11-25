import React from "react";

export interface EventCard {
  id: string;
  title: string;
  image: {
    src: string;
    alt: string;
  };
  date?: string;
  description?: string;
}

export interface CommunityEventsProps {
  heading?: string;
  subheading?: string;
  events?: EventCard[];
  _events?: EventCard[];
  ctaButton?: {
    text: string;
    href: string;
    onClick?: () => void;
  };
  className?: string;
}

/**
 * Community Events section component extracted from Figma Frame 24
 * Displays upcoming events and community highlights in a carousel
 * Mobile Optimized
 */
export const CommunityEvents: React.FC<CommunityEventsProps> = ({
  heading = "Upcoming Events &",
  subheading = "Community Highlights",
  _events = [
    {
      id: "full-moon",
      title: "Full Moon Aerial Sound Bath",
      image: {
        src: "/img/download 1-full-moon-soundbath.png",
        alt: "Full Moon Aerial Sound Bath event",
      },
      date: "Next Full Moon",
      description:
        "Experience deep relaxation with aerial yoga and sound healing",
    },
    {
      id: "custom-workshop",
      title: "Custom Sound Healing Song Workshop",
      image: {
        src: "/img/Rectangle 4-custom-sound-healing-song-workshop.png",
        alt: "Custom Sound Healing Song Workshop",
      },
      date: "Monthly Workshop",
      description: "Learn to create your own healing soundscapes",
    },
    {
      id: "fullmoon-aerial",
      title: "Full Moon Aerial Soundbath",
      image: {
        src: "/img/Rectangle 4-fullmoon-aerial-soundbath.png",
        alt: "Full Moon Aerial Soundbath",
      },
      date: "Every Full Moon",
      description: "Join our community for aerial healing sessions",
    },
  ],
  ctaButton = {
    text: "View Full Calendar",
    href: "/events",
  },
  className = "",
}) => {
  return (
    <section
      className={`relative py-12 md:py-20 overflow-hidden ${className}`}
      style={{
        borderRadius: "30px",
        margin: "20px 0",
      }}
    >
      {/* Background with image and gradient overlay */}
      <div className="absolute inset-0">
        {/* Background image */}
        <img
          src="/img/community-highlights.jpg"
          alt="Sound healing bowl with mallet"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ borderRadius: "30px" }}
        />
        {/* Gradient overlay matching Figma design */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: "rgba(2, 5, 183, 0.44)",
            borderRadius: "30px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8">
        {/* Section Heading */}
        <div className="text-center mb-8 md:mb-12">
          <h2
            className="text-white font-bold text-3xl md:text-5xl leading-tight"
            style={{
              fontFamily: "Figtree, Helvetica, sans-serif",
            }}
          >
            {heading}
          </h2>
          <h2
            className="text-white font-bold text-3xl md:text-5xl leading-tight"
            style={{
              fontFamily: "Figtree, Helvetica, sans-serif",
            }}
          >
            {subheading}
          </h2>
        </div>

        {/* Events Container - Separate White Rectangles per Frame 20 */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mx-auto"
          style={{ maxWidth: "1100px" }}
        >
          {/* Full Moon Aerial Sound Bath Card */}
          <div className="bg-white flex flex-col items-center text-center rounded-[20px] p-6 md:p-[30px]">
            <div className="w-full overflow-hidden mb-4 rounded-[20px] h-[200px]">
              <img
                src="/img/download 1-full-moon-soundbath.png"
                alt="Full Moon Aerial Sound Bath"
                className="w-full h-full object-cover"
              />
            </div>
            <h3
              className="font-semibold mb-4 text-lg md:text-[22px] text-[#333333]"
              style={{
                fontFamily: "Figtree, Helvetica, sans-serif",
              }}
            >
              Full Moon Aerial Sound Bath
            </h3>
            <button
              className="px-6 py-2 bg-transparent border-2 rounded-full transition-all duration-300 hover:shadow-lg text-[#0205B7] border-[#0205B7] font-medium text-base"
              style={{
                fontFamily: "Figtree, Helvetica, sans-serif",
              }}
              onClick={() => (window.location.href = "/events/full-moon")}
            >
              Learn More
            </button>
          </div>

          {/* Custom Sound Healing Song Workshop Card */}
          <div className="bg-white flex flex-col items-center text-center rounded-[20px] p-6 md:p-[30px]">
            <div className="w-full overflow-hidden mb-4 rounded-[20px] h-[200px]">
              <img
                src="/img/Rectangle 4-custom-sound-healing-song-workshop.png"
                alt="Custom Sound Healing Song Workshop"
                className="w-full h-full object-cover"
              />
            </div>
            <h3
              className="font-semibold mb-4 text-lg md:text-[22px] text-[#333333]"
              style={{
                fontFamily: "Figtree, Helvetica, sans-serif",
              }}
            >
              Custom Sound Healing Workshop
            </h3>
            <button
              className="px-6 py-2 bg-transparent border-2 rounded-full transition-all duration-300 hover:shadow-lg text-[#0205B7] border-[#0205B7] font-medium text-base"
              style={{
                fontFamily: "Figtree, Helvetica, sans-serif",
              }}
              onClick={() => (window.location.href = "/events/workshop")}
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Pagination Dots and CTA Button */}
        <div className="mt-8 md:mt-12">
          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mb-6">
            <div className="rounded-full w-[10px] h-[10px] bg-[#63D5F9]" />
            <div className="rounded-full w-[10px] h-[10px] bg-[#63D5F9]/50" />
            <div className="rounded-full w-[10px] h-[10px] bg-[#63D5F9]/50" />
          </div>

          {/* CTA Button */}
          {ctaButton && (
            <div className="text-center">
              <a
                href={ctaButton.href}
                onClick={ctaButton.onClick}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full transition-colors duration-200 border-2 border-white text-white font-medium text-base hover:bg-white/10"
                style={{
                  fontFamily: "Figtree, Helvetica, sans-serif",
                }}
              >
                {ctaButton.text}
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
