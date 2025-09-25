import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ContactPage } from "./ContactPage";

// Mock components
vi.mock("../AnimatedSection", () => ({
  AnimatedSection: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock("../ContactInfoCard", () => ({
  ContactInfoCard: ({ title, content }: { title: string; content: string }) => (
    <div data-testid="contact-info-card">
      <h3>{title}</h3>
      <p>{content}</p>
    </div>
  ),
}));

vi.mock("../FigmaContactForm", () => ({
  FigmaContactForm: () => (
    <form data-testid="figma-contact-form">Contact Form</form>
  ),
}));

vi.mock("../GoogleMap", () => ({
  GoogleMapEmbed: ({
    ariaLabel,
    address,
  }: {
    ariaLabel: string;
    address: string;
  }) => (
    <div data-testid="google-map-embed" aria-label={ariaLabel}>
      Map for {address}
    </div>
  ),
}));

vi.mock("../BookSessionCTA", () => ({
  BookSessionCTA: () => (
    <div
      data-testid="book-session-cta"
      className="bg-blue rounded-[20px] shadow-[9px_10px_0px_0px_#63D5F9]"
    >
      <h2 className="text-[48px] font-bold text-white">
        Ready to Begin Your Healing Journey?
      </h2>
      <a href="/book">Book Your Session Today</a>
    </div>
  ),
}));

describe("ContactPage", () => {
  describe("Rendering", () => {
    it("should render main heading and subtitle", () => {
      render(<ContactPage />);

      expect(screen.getByText("Get in Touch")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Have questions or want to book a session? We're here to help."
        )
      ).toBeInTheDocument();
    });

    it("should render contact form", () => {
      render(<ContactPage />);

      expect(screen.getByTestId("figma-contact-form")).toBeInTheDocument();
    });

    it("should render all three contact info cards", () => {
      render(<ContactPage />);

      const cards = screen.getAllByTestId("contact-info-card");
      expect(cards).toHaveLength(3);

      expect(screen.getByText("Our Location")).toBeInTheDocument();
      expect(screen.getByText("Roy, Washington")).toBeInTheDocument();

      expect(screen.getByText("Our Phone")).toBeInTheDocument();
      expect(screen.getByText("0300 0000 0000")).toBeInTheDocument();

      expect(screen.getByText("Our Email")).toBeInTheDocument();
      expect(
        screen.getByText("thereikigoddesshealing@gmail.com")
      ).toBeInTheDocument();
    });

    it("should render map section", () => {
      render(<ContactPage />);

      const mapEmbed = screen.getByTestId("google-map-embed");
      expect(mapEmbed).toBeInTheDocument();
      expect(mapEmbed).toHaveTextContent("Map for Roy, Washington");
      expect(mapEmbed).toHaveAttribute(
        "aria-label",
        "Map showing The Reiki Goddess Healing location in Roy, Washington"
      );
    });

    it("should render CTA section", () => {
      render(<ContactPage />);

      expect(
        screen.getByText("Ready to Begin Your Healing Journey?")
      ).toBeInTheDocument();
      const ctaLink = screen.getByRole("link", {
        name: /Book Your Session Today/i,
      });
      expect(ctaLink).toBeInTheDocument();
      expect(ctaLink).toHaveAttribute("href", "/book");
    });
  });

  describe("Styling", () => {
    it("should have cream background", () => {
      const { container } = render(<ContactPage />);

      const pageWrapper = container.firstChild;
      expect(pageWrapper).toHaveClass("min-h-screen", "bg-[#FFFBF5]");
    });

    it("should apply correct typography to heading", () => {
      render(<ContactPage />);

      const heading = screen.getByText("Get in Touch");
      expect(heading).toHaveClass("text-[63.55px]", "font-bold", "text-black");
      expect(heading).toHaveStyle({ fontFamily: "Figtree, sans-serif" });
    });

    it("should have smoke effect divs", () => {
      const { container } = render(<ContactPage />);

      const smokeEffects = container.querySelectorAll(
        ".absolute.opacity-20.pointer-events-none"
      );
      expect(smokeEffects).toHaveLength(2);
    });

    it("should style CTA section correctly", () => {
      render(<ContactPage />);

      const ctaHeading = screen.getByText(
        "Ready to Begin Your Healing Journey?"
      );
      expect(ctaHeading).toHaveClass("text-[48px]", "font-bold", "text-white");

      const ctaContainer = ctaHeading.closest(".bg-blue");
      expect(ctaContainer).toHaveClass(
        "rounded-[20px]",
        "shadow-[9px_10px_0px_0px_#63D5F9]"
      );
    });
  });

  describe("Layout", () => {
    it("should apply correct spacing", () => {
      const { container } = render(<ContactPage />);

      // Check for 66px padding on containers
      const containers = container.querySelectorAll(".px-\\[66px\\]");
      expect(containers.length).toBeGreaterThan(0);

      // Check for proper section spacing
      const ctaSection = container.querySelector(".py-\\[161px\\]");
      expect(ctaSection).toBeInTheDocument();
    });

    it("should have responsive grid for contact cards", () => {
      render(<ContactPage />);

      const cardsContainer =
        screen.getAllByTestId("contact-info-card")[0].parentElement;
      expect(cardsContainer).toHaveClass(
        "grid",
        "grid-cols-1",
        "md:grid-cols-3",
        "gap-8"
      );
    });
  });

  describe("Accessibility", () => {
    it("should have proper heading hierarchy", () => {
      render(<ContactPage />);

      const h1 = screen.getByRole("heading", { level: 1 });
      expect(h1).toHaveTextContent("Get in Touch");

      const h2 = screen.getByRole("heading", { level: 2 });
      expect(h2).toHaveTextContent("Ready to Begin Your Healing Journey?");
    });

    it("should have accessible map with proper aria-label", () => {
      render(<ContactPage />);

      const mapEmbed = screen.getByTestId("google-map-embed");
      expect(mapEmbed).toHaveAttribute(
        "aria-label",
        "Map showing The Reiki Goddess Healing location in Roy, Washington"
      );
    });

    it("should have accessible links", () => {
      render(<ContactPage />);

      const ctaLink = screen.getByRole("link", {
        name: /Book Your Session Today/i,
      });
      expect(ctaLink).toBeInTheDocument();
    });
  });
});
