import React from "react";
import { ResponsiveHeader, ResponsiveHeaderProps } from "../Header";

export interface HeaderSectionProps extends ResponsiveHeaderProps {}

/**
 * Header section wrapper component
 * Alias for ResponsiveHeader to maintain naming consistency
 */
export const HeaderSection: React.FC<HeaderSectionProps> = (props) => {
  return <ResponsiveHeader {...props} />;
};
