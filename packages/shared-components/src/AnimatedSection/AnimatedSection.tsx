import React from "react";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";

export interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animation?:
    | "fadeInUp"
    | "fadeIn"
    | "slideInLeft"
    | "slideInRight"
    | "scaleIn";
  delay?: number;
  threshold?: number;
}

/**
 * Wrapper component that adds scroll-triggered animations to sections
 */
export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = "",
  animation = "fadeInUp",
  delay = 0,
  threshold = 0.1,
}) => {
  const { ref, isVisible } = useIntersectionObserver({ threshold });

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`${className} ${isVisible ? `animate-${animation}` : "opacity-0"}`}
      style={{
        animationDelay: `${delay}s`,
        animationFillMode: "both",
      }}
    >
      {children}
    </div>
  );
};
