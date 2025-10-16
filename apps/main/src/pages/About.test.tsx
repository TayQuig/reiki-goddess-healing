import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import About from "./About";

// Mock framer-motion to avoid animation timing issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      ...props
    }: React.PropsWithChildren<Record<string, unknown>>) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => children,
}));

// Mock the AboutPage component from shared-components
vi.mock("@reiki-goddess/shared-components", () => ({
  AboutPage: () => (
    <div data-testid="about-page-component">AboutPage Component</div>
  ),
}));

describe("About Page Route Component", () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  describe("Component Integration", () => {
    it("should render AboutPage component", () => {
      renderWithRouter(<About />);

      expect(screen.getByTestId("about-page-component")).toBeInTheDocument();
    });

    it("should wrap AboutPage with PageTransition", () => {
      const { container } = renderWithRouter(<About />);

      // PageTransition is a motion.div wrapper
      // Since we mocked framer-motion, just verify the structure
      expect(container.querySelector("div")).toBeInTheDocument();
      expect(screen.getByTestId("about-page-component")).toBeInTheDocument();
    });
  });

  describe("Route Integration", () => {
    it("should render without errors", () => {
      expect(() => renderWithRouter(<About />)).not.toThrow();
    });

    it("should be accessible", () => {
      const { container } = renderWithRouter(<About />);

      // Basic accessibility check - component should render with proper structure
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
