import React from "react";

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  className = "",
}) => {
  const baseClasses =
    "flex items-center justify-center gap-2.5 pl-[13px] pr-2.5 py-2.5 rounded-[90px] font-medium text-base tracking-[0] leading-6 transition-colors";

  const variantClasses = {
    primary:
      "bg-variable-collection-color-duplicate text-white hover:opacity-80",
    secondary: "bg-white text-variable-collection-color-duplicate",
    outline:
      "border border-solid border-variable-collection-color-duplicate text-variable-collection-color-duplicate hover:bg-variable-collection-color-duplicate hover:text-white",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
