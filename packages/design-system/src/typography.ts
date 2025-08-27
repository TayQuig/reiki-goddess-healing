// Typography configuration for The Reiki Goddess Healing design system

export const fontFamilies = {
  primary: "Figtree, Helvetica, sans-serif",
  secondary: "Neue_Montreal-Regular, Helvetica, sans-serif",
  medium: "Neue_Montreal-Medium, Helvetica, sans-serif",
  bold: "Neue_Montreal-Bold, Helvetica, sans-serif",
};

export const fontSizes = {
  xs: "0.75rem", // 12px
  sm: "0.875rem", // 14px
  base: "1rem", // 16px
  lg: "1.125rem", // 18px
  xl: "1.25rem", // 20px
  "2xl": "1.5rem", // 24px
  "3xl": "1.875rem", // 30px
  "4xl": "2.25rem", // 36px
  "5xl": "3rem", // 48px
  "6xl": "3.75rem", // 60px
  "7xl": "4rem", // 64px
};

export const fontWeights = {
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  extrabold: "800",
};

export const lineHeights = {
  none: "1",
  tight: "1.25",
  snug: "1.375",
  normal: "1.5",
  relaxed: "1.625",
  loose: "2",
};

export const letterSpacing = {
  tighter: "-0.05em",
  tight: "-0.025em",
  normal: "0",
  wide: "0.025em",
  wider: "0.05em",
  widest: "0.1em",
};

export type TypographyTheme = {
  fontFamilies: typeof fontFamilies;
  fontSizes: typeof fontSizes;
  fontWeights: typeof fontWeights;
  lineHeights: typeof lineHeights;
  letterSpacing: typeof letterSpacing;
};
