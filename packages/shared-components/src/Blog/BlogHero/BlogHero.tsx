/**
 * BlogHero Component
 *
 * Hero section for the blog listing page with title and description.
 * Features a gradient background and centered content layout.
 */

import React from "react";
import { colors } from "@reiki-goddess/design-system";
import type { BlogHeroProps } from "./BlogHero.types";

export const BlogHero: React.FC<BlogHeroProps> = ({
  title = "Insights & Inspirations from The Reiki Goddess",
  description = "Discover empowering stories, healing tips, and soulful guidance to help you embrace inner peace and personal growth. Each post is crafted to inspire, educate, and guide you on your journey toward balance and wellbeing.",
  backgroundImage,
  className = "",
}) => {
  const backgroundStyle = backgroundImage
    ? { backgroundImage: `url(${backgroundImage})` }
    : { backgroundColor: colors.background.primary };

  return (
    <section
      className={`
        relative
        flex items-center justify-center text-center
        h-[300px] px-5 py-5
        md:h-[500px] md:px-[66px] md:py-[66px]
        ${className}
      `}
      style={backgroundStyle}
      aria-labelledby="blog-hero-title"
    >
      <div className="max-w-[600px] z-10">
        <h1
          id="blog-hero-title"
          className="
            text-3xl font-bold text-[#333333] mb-4 leading-tight
            md:text-5xl
          "
        >
          {title}
        </h1>
        <p
          className="
            text-base text-[#5E5E5E] leading-relaxed
            md:text-lg
          "
        >
          {description}
        </p>
      </div>
    </section>
  );
};
