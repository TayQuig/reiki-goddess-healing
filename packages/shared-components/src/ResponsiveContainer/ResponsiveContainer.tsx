import React from "react";

export interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  variant?: "full" | "page" | "content";
}

/**
 * Responsive container component for consistent layout across pages
 */
export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className = "",
  variant = "page",
}) => {
  const variants = {
    full: "w-full px-4 md:px-8 lg:px-16",
    page: "max-w-7xl mx-auto px-4 md:px-8 lg:px-16",
    content: "max-w-4xl mx-auto px-4 md:px-8",
  };

  return <div className={`${variants[variant]} ${className}`}>{children}</div>;
};
