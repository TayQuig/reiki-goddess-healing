import React from "react";
import { MemoryRouter } from "react-router-dom";

interface RouterWrapperProps {
  children: React.ReactNode;
  initialEntries?: string[];
}

/**
 * Test wrapper component that provides Router context for testing components that use React Router
 */
export const RouterWrapper: React.FC<RouterWrapperProps> = ({
  children,
  initialEntries = ["/"],
}) => {
  return (
    <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
  );
};
