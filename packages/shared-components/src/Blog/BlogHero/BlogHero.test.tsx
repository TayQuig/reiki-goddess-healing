/**
 * BlogHero Component Tests
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BlogHero } from "./BlogHero";

describe("BlogHero", () => {
  describe("Rendering", () => {
    it("renders with default title and description", () => {
      render(<BlogHero />);

      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Healing Insights"
      );
      expect(
        screen.getByText(/Explore articles, insights, and guidance/)
      ).toBeInTheDocument();
    });

    it("renders with custom title and description", () => {
      render(
        <BlogHero title="Custom Title" description="Custom description text" />
      );

      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Custom Title"
      );
      expect(screen.getByText("Custom description text")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      const { container } = render(<BlogHero className="custom-class" />);
      const section = container.querySelector("section");

      expect(section).toHaveClass("custom-class");
    });
  });

  describe("Background", () => {
    it("uses gradient background by default", () => {
      const { container } = render(<BlogHero />);
      const section = container.querySelector("section");

      expect(section).toHaveStyle({
        background: "linear-gradient(135deg, #A593E0 0%, #FFC6A5 100%)",
      });
    });

    it("uses background image when provided", () => {
      const imageUrl = "/test-image.jpg";
      const { container } = render(<BlogHero backgroundImage={imageUrl} />);
      const section = container.querySelector("section");

      expect(section).toHaveStyle({
        backgroundImage: `url(${imageUrl})`,
      });
    });
  });

  describe("Accessibility", () => {
    it("has proper heading hierarchy", () => {
      render(<BlogHero />);

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveAttribute("id", "blog-hero-title");
    });

    it("uses aria-labelledby for section", () => {
      const { container } = render(<BlogHero />);
      const section = container.querySelector("section");

      expect(section).toHaveAttribute("aria-labelledby", "blog-hero-title");
    });
  });

  describe("Responsive Design", () => {
    it("applies responsive classes", () => {
      const { container } = render(<BlogHero />);
      const section = container.querySelector("section");

      expect(section).toHaveClass("h-[500px]");
      expect(section).toHaveClass("md:h-[300px]");
    });
  });
});
