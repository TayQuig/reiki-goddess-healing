import React from "react";

export interface ContactInfoCardProps {
  icon: string;
  title: string;
  content: string;
  ctaText: string;
  ctaLink: string;
  className?: string;
}

/**
 * ContactInfoCard - Info card with blue bevel effect matching Figma design
 * Used for displaying location, phone, and email information
 */
export const ContactInfoCard: React.FC<ContactInfoCardProps> = ({
  icon,
  title,
  content,
  ctaText,
  ctaLink,
  className = "",
}) => {
  return (
    <div className={`relative group ${className}`}>
      {/* Blue background rectangle - shifted down 10px */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "#0205B7",
          borderRadius: "17px",
          transform: "translateY(10px)",
          zIndex: 0,
        }}
      />

      {/* Card content */}
      <div
        className="relative bg-white rounded-[17px] h-[156px] transition-transform duration-300 group-hover:-translate-y-1"
        style={{
          boxShadow: "0px 42px 32.5px -13px rgba(0, 0, 0, 0.16)",
          zIndex: 1,
        }}
      >
        {/* Title */}
        <h3
          className="absolute left-[25px] top-[26px] text-[18px] font-bold text-black"
          style={{ fontFamily: "Figtree, sans-serif" }}
        >
          {title}
        </h3>

        {/* Icon and content - centered */}
        <div
          className="absolute flex items-center gap-3 top-[65px]"
          style={{
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <img src={icon} alt="" className="w-6 h-6" />
          <p
            className="text-[16px] text-black whitespace-nowrap"
            style={{ fontFamily: "Neue Montreal, sans-serif" }}
          >
            {content}
          </p>
        </div>

        {/* CTA Link */}
        <a
          href={ctaLink}
          target={ctaLink.startsWith("http") ? "_blank" : undefined}
          rel={ctaLink.startsWith("http") ? "noopener noreferrer" : undefined}
          className="absolute left-[25px] top-[113px] flex items-center gap-2.5 text-blue font-medium hover:gap-3 transition-all duration-300"
        >
          <span
            className="text-[16px]"
            style={{ fontFamily: "Figtree, sans-serif" }}
          >
            {ctaText}
          </span>
          <img
            src="/images/gridicons_arrow-up.svg"
            alt="Arrow"
            className="w-5 h-5 rotate-45"
          />
        </a>
      </div>
    </div>
  );
};
