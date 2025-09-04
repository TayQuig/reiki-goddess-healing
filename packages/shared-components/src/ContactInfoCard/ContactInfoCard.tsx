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
      {/* Blue bevel effect shadow (9px offset) */}
      <div
        className="absolute inset-0 bg-blue rounded-[17px]"
        style={{ transform: "translate(9px, 9px)" }}
      />

      {/* Card content */}
      <div className="relative bg-white rounded-[17px] p-6 h-[156px] shadow-[0px_42px_32.5px_-13px_rgba(0,0,0,0.16)] transition-transform duration-300 group-hover:-translate-y-1">
        <h3
          className="text-[18px] font-bold text-black mb-[37px]"
          style={{ fontFamily: "Figtree, sans-serif" }}
        >
          {title}
        </h3>

        <div className="flex items-center gap-3">
          <img src={icon} alt="" className="w-6 h-6" />
          <p
            className="text-[16px] text-black"
            style={{ fontFamily: "Neue Montreal, sans-serif" }}
          >
            {content}
          </p>
        </div>

        <a
          href={ctaLink}
          target={ctaLink.startsWith("http") ? "_blank" : undefined}
          rel={ctaLink.startsWith("http") ? "noopener noreferrer" : undefined}
          className="absolute bottom-[25px] left-[25px] flex items-center gap-2 text-blue font-medium hover:gap-3 transition-all duration-300"
        >
          <span
            className="text-[16px]"
            style={{ fontFamily: "Figtree, sans-serif" }}
          >
            {ctaText}
          </span>
          <img
            src="/img/8004428ff1a4bbe981b7017e82dadb4c9bba67a6.svg"
            alt="Arrow"
            className="w-5 h-5 rotate-45"
          />
        </a>
      </div>
    </div>
  );
};
