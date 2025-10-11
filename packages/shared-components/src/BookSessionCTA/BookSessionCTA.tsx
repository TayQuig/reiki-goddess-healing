import React from "react";

export interface BookSessionCTAProps {
  className?: string;
}

/**
 * Book Your Session CTA component
 * A blue call-to-action card with shadow effect used across the site
 * Matches Figma design with exact styling and smoke background
 */
export const BookSessionCTA: React.FC<BookSessionCTAProps> = ({
  className = "",
}) => {
  return (
    <div
      className={`bg-[#0205b7] rounded-[20px] shadow-[9px_10px_0px_0px_#0205B7] relative overflow-hidden ${className}`}
      style={{
        width: "1095px",
        height: "265px",
        maxWidth: "100%",
        margin: "0 auto",
      }}
    >
      {/* Background layered image */}
      <img
        src="/img/book-a-session-image.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Blue tint overlay */}
      <div className="absolute inset-0 bg-[#0205B7] opacity-35" />

      {/* Four decorative white circles in corners */}
      <div className="absolute top-[30px] left-[30px] w-[11px] h-[11px] bg-white rounded-full" />
      <div className="absolute top-[30px] right-[30px] w-[11px] h-[11px] bg-white rounded-full" />
      <div className="absolute bottom-[30px] left-[30px] w-[11px] h-[11px] bg-white rounded-full" />
      <div className="absolute bottom-[30px] right-[30px] w-[11px] h-[11px] bg-white rounded-full" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <h2
          className="text-[48px] font-bold text-white mb-[43px] text-center leading-normal"
          style={{ fontFamily: "Figtree, sans-serif" }}
        >
          Ready to Begin Your Healing Journey?
        </h2>
        <a
          href="/book"
          className="inline-flex items-center gap-2.5 px-[13px] pr-2.5 py-2.5 border border-white rounded-[90px] text-white hover:bg-white hover:text-[#0205b7] transition-all duration-300"
          style={{ fontFamily: "Figtree, sans-serif" }}
        >
          <span className="text-[16px] font-medium leading-[24px]">
            Book Your Session Today
          </span>
          <img
            src="/images/gridicons_arrow-up.svg"
            alt=""
            className="w-5 h-5"
            style={{ transform: "rotate(45deg)" }}
          />
        </a>
      </div>
    </div>
  );
};
