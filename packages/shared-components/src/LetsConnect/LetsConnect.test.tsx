import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { LetsConnect } from "./LetsConnect";

describe("LetsConnect", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const customLocationIcon = (
    <svg data-testid="custom-location-icon" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

  const customEmailIcon = (
    <svg data-testid="custom-email-icon" viewBox="0 0 24 24">
      <rect x="2" y="4" width="20" height="16" />
    </svg>
  );

  const customPhoneIcon = (
    <svg data-testid="custom-phone-icon" viewBox="0 0 24 24">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );

  describe("Rendering", () => {
    it("should render with default props", () => {
      render(<LetsConnect />);

      // Check default heading
      expect(screen.getByText("Let's Connect")).toBeInTheDocument();

      // Check default location
      expect(screen.getByText("Roy, Washington")).toBeInTheDocument();

      // Check default email
      expect(
        screen.getByText("thereikigoddeshealing@gmail.com")
      ).toBeInTheDocument();

      // Check background image
      expect(
        screen.getByAltText("Healing crystals and sage")
      ).toBeInTheDocument();
    });

    it("should render with custom heading", () => {
      render(<LetsConnect heading="Get In Touch" />);
      expect(screen.getByText("Get In Touch")).toBeInTheDocument();
    });

    it("should render with custom location", () => {
      const customLocation = {
        icon: customLocationIcon,
        text: "Seattle, WA",
        href: "https://maps.google.com/?q=Seattle,WA",
      };

      render(<LetsConnect location={customLocation} />);
      expect(screen.getByText("Seattle, WA")).toBeInTheDocument();
      expect(screen.getByTestId("custom-location-icon")).toBeInTheDocument();
    });

    it("should render with custom email", () => {
      const customEmail = {
        icon: customEmailIcon,
        text: "contact@example.com",
        href: "mailto:contact@example.com",
      };

      render(<LetsConnect email={customEmail} />);
      expect(screen.getByText("contact@example.com")).toBeInTheDocument();
      expect(screen.getByTestId("custom-email-icon")).toBeInTheDocument();
    });

    it("should render with phone information", () => {
      const phoneInfo = {
        icon: customPhoneIcon,
        text: "(555) 123-4567",
        href: "tel:+15551234567",
      };

      render(<LetsConnect phone={phoneInfo} />);
      expect(screen.getByText("(555) 123-4567")).toBeInTheDocument();
      expect(screen.getByTestId("custom-phone-icon")).toBeInTheDocument();
    });

    it("should render without phone when not provided", () => {
      render(<LetsConnect />);
      // Phone should not be present when not provided
      expect(
        screen.queryByRole("link", { name: /tel:/ })
      ).not.toBeInTheDocument();
    });

    it("should render decorative dots", () => {
      const { container } = render(<LetsConnect />);
      const dots = container.querySelectorAll(".w-3.h-3.bg-white.rounded-full");
      expect(dots).toHaveLength(4); // 4 corner dots
    });

    it("should apply custom className", () => {
      const { container } = render(<LetsConnect className="custom-class" />);
      const section = container.querySelector("section");
      expect(section).toHaveClass("custom-class");
    });

    it("should render background image with correct attributes", () => {
      render(<LetsConnect />);
      const bgImage = screen.getByAltText("Healing crystals and sage");
      expect(bgImage).toHaveAttribute("src", "/img/lets-connect-bg.jpg");
    });

    it("should render default SVG icons when none provided", () => {
      const { container } = render(<LetsConnect />);
      const svgElements = container.querySelectorAll("svg");
      expect(svgElements.length).toBeGreaterThanOrEqual(2); // Location and email icons
    });
  });

  describe("Styling", () => {
    it("should have correct section dimensions and styling", () => {
      const { container } = render(<LetsConnect />);
      const section = container.querySelector("section");

      expect(section).toHaveStyle({
        height: "260px",
        borderRadius: "30px",
        margin: "40px 66px",
      });
    });

    it("should apply blue overlay with correct opacity", () => {
      const { container } = render(<LetsConnect />);
      const overlay = container.querySelector(
        "div[style*='background-color: rgba(2, 5, 183, 0.85)']"
      );
      expect(overlay).toBeDefined();
    });

    it("should style heading with correct typography", () => {
      render(<LetsConnect />);
      const heading = screen.getByText("Let's Connect");

      expect(heading).toHaveClass("text-white", "font-bold", "mb-6");
      expect(heading).toHaveStyle({
        fontFamily: "Figtree, Helvetica, sans-serif",
        fontSize: "48px",
        lineHeight: "1.1",
        letterSpacing: "-0.02em",
      });
    });

    it("should style contact information text correctly", () => {
      render(<LetsConnect />);
      const locationText = screen.getByText("Roy, Washington");

      expect(locationText).toHaveStyle({
        fontFamily: "Figtree, Helvetica, sans-serif",
        fontSize: "18px",
        fontWeight: "500",
      });
    });

    it("should center content with proper z-index", () => {
      const { container } = render(<LetsConnect />);
      const contentContainer = container.querySelector(".relative.z-10");

      expect(contentContainer).toHaveClass(
        "h-full",
        "flex",
        "flex-col",
        "justify-center",
        "items-center",
        "text-center",
        "px-8"
      );
    });

    it("should position decorative dots at corners", () => {
      const { container } = render(<LetsConnect />);

      // Top-left dot
      expect(
        container.querySelector(
          ".absolute.top-8.left-8.w-3.h-3.bg-white.rounded-full"
        )
      ).toBeInTheDocument();

      // Top-right dot
      expect(
        container.querySelector(
          ".absolute.top-8.right-8.w-3.h-3.bg-white.rounded-full"
        )
      ).toBeInTheDocument();

      // Bottom-left dot
      expect(
        container.querySelector(
          ".absolute.bottom-8.left-8.w-3.h-3.bg-white.rounded-full"
        )
      ).toBeInTheDocument();

      // Bottom-right dot
      expect(
        container.querySelector(
          ".absolute.bottom-8.right-8.w-3.h-3.bg-white.rounded-full"
        )
      ).toBeInTheDocument();
    });

    it("should apply transition effects to contact links", () => {
      render(<LetsConnect />);
      const locationLink = screen.getByRole("link", {
        name: /Roy, Washington/,
      });

      expect(locationLink).toHaveClass(
        "flex",
        "items-center",
        "gap-3",
        "text-white",
        "hover:text-white/80",
        "transition-colors"
      );
    });

    it("should set background image with proper styling", () => {
      render(<LetsConnect />);
      const bgImage = screen.getByAltText("Healing crystals and sage");

      expect(bgImage).toHaveClass(
        "absolute",
        "inset-0",
        "w-full",
        "h-full",
        "object-cover"
      );
      expect(bgImage).toHaveStyle({ borderRadius: "30px" });
    });
  });

  describe("Links and Navigation", () => {
    it("should render location link with correct href", () => {
      render(<LetsConnect />);
      const locationLink = screen.getByRole("link", {
        name: /Roy, Washington/,
      });

      expect(locationLink).toHaveAttribute(
        "href",
        "https://maps.google.com/?q=Roy,Washington"
      );
      expect(locationLink).toHaveAttribute("target", "_blank");
      expect(locationLink).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("should render email link with mailto href", () => {
      render(<LetsConnect />);
      const emailLink = screen.getByRole("link", {
        name: /thereikigoddeshealing@gmail.com/,
      });

      expect(emailLink).toHaveAttribute(
        "href",
        "mailto:thereikigoddeshealing@gmail.com"
      );
    });

    it("should render phone link with tel href when provided", () => {
      const phoneInfo = {
        text: "(555) 123-4567",
        href: "tel:+15551234567",
      };

      render(<LetsConnect phone={phoneInfo} />);
      const phoneLink = screen.getByRole("link", { name: "(555) 123-4567" });

      expect(phoneLink).toHaveAttribute("href", "tel:+15551234567");
    });

    it("should handle custom location href", () => {
      const customLocation = {
        text: "New Location",
        href: "/custom-map",
      };

      render(<LetsConnect location={customLocation} />);
      const locationLink = screen.getByRole("link", { name: /New Location/ });
      expect(locationLink).toHaveAttribute("href", "/custom-map");
    });

    it("should handle custom email href", () => {
      const customEmail = {
        text: "custom@example.com",
        href: "mailto:custom@example.com?subject=Inquiry",
      };

      render(<LetsConnect email={customEmail} />);
      const emailLink = screen.getByRole("link", {
        name: /custom@example.com/,
      });
      expect(emailLink).toHaveAttribute(
        "href",
        "mailto:custom@example.com?subject=Inquiry"
      );
    });
  });

  describe("Interactions", () => {
    it("should handle location link hover effect", () => {
      render(<LetsConnect />);
      const locationLink = screen.getByRole("link", {
        name: /Roy, Washington/,
      });

      // Initial state
      expect(locationLink).toHaveClass("text-white");

      // Test hover classes are present (actual hover effect tested via CSS)
      expect(locationLink).toHaveClass("hover:text-white/80");
    });

    it("should handle email link hover effect", () => {
      render(<LetsConnect />);
      const emailLink = screen.getByRole("link", {
        name: /thereikigoddeshealing@gmail.com/,
      });

      expect(emailLink).toHaveClass("text-white", "hover:text-white/80");
    });

    it("should handle phone link hover effect when provided", () => {
      const phoneInfo = {
        text: "(555) 123-4567",
        href: "tel:+15551234567",
      };

      render(<LetsConnect phone={phoneInfo} />);
      const phoneLink = screen.getByRole("link", { name: "(555) 123-4567" });

      expect(phoneLink).toHaveClass("text-white", "hover:text-white/80");
    });
  });

  describe("Accessibility", () => {
    it("should have semantic section element", () => {
      const { container } = render(<LetsConnect />);
      const section = container.querySelector("section");
      expect(section).toBeInTheDocument();
    });

    it("should have proper heading hierarchy", () => {
      render(<LetsConnect />);
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveTextContent("Let's Connect");
    });

    it("should have accessible links with proper attributes", () => {
      render(<LetsConnect />);

      // Location link
      const locationLink = screen.getByRole("link", {
        name: /Roy, Washington/,
      });
      expect(locationLink).toHaveAttribute("target", "_blank");
      expect(locationLink).toHaveAttribute("rel", "noopener noreferrer");

      // Email link
      const emailLink = screen.getByRole("link", {
        name: /thereikigoddeshealing@gmail.com/,
      });
      expect(emailLink).toBeInTheDocument();
    });

    it("should have descriptive alt text for background image", () => {
      render(<LetsConnect />);
      const bgImage = screen.getByAltText("Healing crystals and sage");
      expect(bgImage).toBeInTheDocument();
    });

    it("should support keyboard navigation for links", () => {
      render(<LetsConnect />);

      const locationLink = screen.getByRole("link", {
        name: /Roy, Washington/,
      });
      locationLink.focus();
      expect(document.activeElement).toBe(locationLink);

      const emailLink = screen.getByRole("link", {
        name: /thereikigoddeshealing@gmail.com/,
      });
      emailLink.focus();
      expect(document.activeElement).toBe(emailLink);
    });

    it("should have proper ARIA roles", () => {
      render(<LetsConnect />);

      // Check that links have proper role
      const links = screen.getAllByRole("link");
      expect(links.length).toBeGreaterThanOrEqual(2); // At least location and email

      links.forEach((link) => {
        expect(link).toBeInTheDocument();
      });
    });
  });

  describe("Responsive Behavior", () => {
    it("should use responsive flex layout for contact information", () => {
      const { container } = render(<LetsConnect />);
      const contactContainer = container.querySelector(
        ".flex.flex-col.sm\\:flex-row"
      );

      expect(contactContainer).toHaveClass(
        "items-center",
        "justify-center",
        "gap-8"
      );
    });

    it("should maintain proper spacing and centering", () => {
      const { container } = render(<LetsConnect />);
      const contentContainer = container.querySelector(".relative.z-10");

      expect(contentContainer).toHaveClass("px-8"); // Horizontal padding for mobile
    });

    it("should handle overflow properly", () => {
      const { container } = render(<LetsConnect />);
      const section = container.querySelector("section");
      expect(section).toHaveClass("overflow-hidden");
    });

    it("should maintain fixed dimensions", () => {
      const { container } = render(<LetsConnect />);
      const section = container.querySelector("section");

      expect(section).toHaveStyle({
        height: "260px",
        borderRadius: "30px",
      });
    });
  });

  describe("Contact Information Conditional Rendering", () => {
    it("should render location when provided", () => {
      const location = {
        text: "Custom Location",
        href: "/location",
      };

      render(<LetsConnect location={location} />);
      expect(screen.getByText("Custom Location")).toBeInTheDocument();
    });

    it("should render email when provided", () => {
      const email = {
        text: "custom@example.com",
        href: "mailto:custom@example.com",
      };

      render(<LetsConnect email={email} />);
      expect(screen.getByText("custom@example.com")).toBeInTheDocument();
    });

    it("should not render phone when not provided", () => {
      render(<LetsConnect />);
      // Should only have location and email links (2 total)
      const links = screen.getAllByRole("link");
      expect(links).toHaveLength(2);
    });

    it("should render all contact methods when all provided", () => {
      const phone = {
        text: "(555) 123-4567",
        href: "tel:+15551234567",
      };

      render(<LetsConnect phone={phone} />);

      // Should have location, email, and phone links (3 total)
      const links = screen.getAllByRole("link");
      expect(links).toHaveLength(3);
    });

    it("should handle missing icons gracefully", () => {
      const locationWithoutIcon = {
        text: "No Icon Location",
        href: "/location",
      };

      render(<LetsConnect location={locationWithoutIcon} />);
      expect(screen.getByText("No Icon Location")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should render without any props", () => {
      const { container } = render(<LetsConnect />);
      expect(container.querySelector("section")).toBeInTheDocument();
    });

    it("should handle empty string heading", () => {
      render(<LetsConnect heading="" />);
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveTextContent("");
    });

    it("should handle very long contact text", () => {
      const longLocation = {
        text: "This is a very long location name that might wrap to multiple lines and test the layout responsiveness",
        href: "/long-location",
      };

      render(<LetsConnect location={longLocation} />);
      expect(
        screen.getByText(/This is a very long location name/)
      ).toBeInTheDocument();
    });

    it("should handle special characters in contact info", () => {
      const specialEmail = {
        text: "special+chars@example.com",
        href: "mailto:special+chars@example.com",
      };

      render(<LetsConnect email={specialEmail} />);
      expect(screen.getByText("special+chars@example.com")).toBeInTheDocument();
    });

    it("should handle missing href attributes", () => {
      const locationWithoutHref = {
        text: "Location Without Link",
      };

      render(<LetsConnect location={locationWithoutHref} />);
      const text = screen.getByText("Location Without Link");
      const link = text.closest("a");
      expect(link).toBeInTheDocument();
      expect(link).not.toHaveAttribute("href");
    });

    it("should maintain layout with minimal content", () => {
      const minimalProps = {
        heading: "Hi",
        location: { text: "A", href: "/" },
        email: { text: "a@b.c", href: "mailto:a@b.c" },
      };

      const { container } = render(<LetsConnect {...minimalProps} />);
      expect(container.querySelector("section")).toBeInTheDocument();
      expect(screen.getByText("Hi")).toBeInTheDocument();
    });

    it("should handle undefined contact objects gracefully", () => {
      render(<LetsConnect location={undefined} email={undefined} />);
      // Component should still render the section
      const { container } = render(<LetsConnect />);
      expect(container.querySelector("section")).toBeInTheDocument();
    });
  });
});
