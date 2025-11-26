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

// Mock the components used in About.tsx
vi.mock("@reiki-goddess/shared-components", () => ({
  AboutHero: () => <div data-testid="about-hero">AboutHero</div>,
  JourneySection: () => <div data-testid="journey-section">JourneySection</div>,
  ContactCTA: () => <div data-testid="contact-cta">ContactCTA</div>,
  ImageGallery: () => <div data-testid="image-gallery">ImageGallery</div>,
  Testimonials: () => <div data-testid="testimonials">Testimonials</div>,
  BookSessionCTA: () => (
    <div data-testid="book-session-cta">BookSessionCTA</div>
  ),
  AnimatedSection: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe("About Page Route Component", () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  describe("Component Integration", () => {
    it("should render About page container", () => {
      renderWithRouter(<About />);
      // Check for the main container test ID defined in About.tsx
      expect(screen.getByTestId("page-about")).toBeInTheDocument();
    });

    it("should render child sections", () => {
      renderWithRouter(<About />);
      // Verify key sections are rendered
      expect(screen.getByTestId("about-hero")).toBeInTheDocument();
      expect(screen.getByTestId("journey-section")).toBeInTheDocument();
    });
  });

  describe("Route Integration", () => {
    it("should render without errors", () => {
      expect(() => renderWithRouter(<About />)).not.toThrow();
    });

    it("should be accessible", () => {
      const { container } = renderWithRouter(<About />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
