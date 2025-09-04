import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../App";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

describe("App Component", () => {
  it("should render without crashing", () => {
    render(<App />);
    // Just check if it renders at all
    expect(screen.getByRole("banner")).toBeInTheDocument(); // Header should have banner role
  });

  it("should render home page content", () => {
    render(<App />);
    // Look for the hero heading
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
  });
});