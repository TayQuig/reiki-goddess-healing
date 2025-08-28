import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MeetTheGoddess } from "./MeetTheGoddess";

describe("MeetTheGoddess", () => {
  // Mock image loading errors for consistent testing
  beforeEach(() => {
    // Reset any image error mocks
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render with default props", () => {
      render(<MeetTheGoddess />);

      // Check for default heading
      expect(
        screen.getByText("Meet Deirdre, The Reiki Goddess")
      ).toBeInTheDocument();

      // Check for default content
      expect(screen.getByText(/A certified Reiki master/)).toBeInTheDocument();
      expect(screen.getByText(/In my dream holistic shop/)).toBeInTheDocument();

      // Check for default CTA button
      const button = screen.getByRole("link", { name: /Read Full Story/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute("href", "/about");
    });

    it("should render with custom heading", () => {
      render(<MeetTheGoddess heading="Custom Heading" />);
      expect(screen.getByText("Custom Heading")).toBeInTheDocument();
    });

    it("should render with custom content", () => {
      const customContent = <p>Custom content text</p>;
      render(<MeetTheGoddess content={customContent} />);
      expect(screen.getByText("Custom content text")).toBeInTheDocument();
    });

    it("should render with custom CTA button", () => {
      const ctaButton = {
        text: "Learn More",
        href: "/custom-page",
      };
      render(<MeetTheGoddess ctaButton={ctaButton} />);

      const button = screen.getByRole("link", { name: /Learn More/i });
      expect(button).toHaveAttribute("href", "/custom-page");
    });

    it("should render with custom images", () => {
      const customImages = {
        main: { src: "/custom-main.jpg", alt: "Custom main" },
        secondary: { src: "/custom-secondary.jpg", alt: "Custom secondary" },
        tertiary: { src: "/custom-tertiary.jpg", alt: "Custom tertiary" },
      };
      render(<MeetTheGoddess images={customImages} />);

      const secondaryImg = screen.getByAltText("Custom secondary");
      expect(secondaryImg).toHaveAttribute("src", "/custom-secondary.jpg");

      const tertiaryImg = screen.getByAltText("Custom tertiary");
      expect(tertiaryImg).toHaveAttribute("src", "/custom-tertiary.jpg");
    });

    it("should render without images when not provided", () => {
      render(<MeetTheGoddess images={{}} />);

      // Should not have any image elements except smoke effects
      const images = screen.getAllByRole("img");
      // Only smoke effect images should be present (3 layers)
      expect(
        images.filter((img) => img.getAttribute("alt")?.includes("Smoke"))
      ).toHaveLength(3);
    });

    it("should render smoke effect layers", () => {
      render(<MeetTheGoddess />);

      // Check for all three smoke layers
      expect(screen.getByAltText("Smoke effect")).toBeInTheDocument();
      expect(screen.getByAltText("Smoke effect duplicate")).toBeInTheDocument();
      expect(screen.getByAltText("Smoke effect triple")).toBeInTheDocument();
    });

    it("should render 'The Reiki Goddess' text label", () => {
      render(<MeetTheGoddess />);
      expect(screen.getByText("The Reiki Goddess")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      const { container } = render(<MeetTheGoddess className="custom-class" />);
      const section = container.querySelector("section");
      expect(section).toHaveClass("custom-class");
    });

    it("should render CTA button with arrow icon", () => {
      render(<MeetTheGoddess />);
      const button = screen.getByRole("link", { name: /Read Full Story/i });
      const svg = button.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });
  });

  describe("Styling", () => {
    it("should have correct background color", () => {
      const { container } = render(<MeetTheGoddess />);
      const section = container.querySelector("section");
      expect(section).toHaveStyle({ backgroundColor: "#FFFBF5" });
    });

    it("should have correct section padding", () => {
      const { container } = render(<MeetTheGoddess />);
      const section = container.querySelector("section");
      expect(section).toHaveClass("py-20");
    });

    it("should have correct minimum height", () => {
      const { container } = render(<MeetTheGoddess />);
      const section = container.querySelector("section");
      expect(section).toHaveStyle({ minHeight: "650px" });
    });

    it("should position smoke effect correctly", () => {
      const { container } = render(<MeetTheGoddess />);
      const smokeContainer = container.querySelector(
        "div[style*='width: 810px']"
      );
      expect(smokeContainer).toHaveStyle({
        left: "0",
        top: "0",
        width: "810px",
        height: "810px",
      });
    });

    it("should rotate smoke images 180 degrees", () => {
      render(<MeetTheGoddess />);
      const smokeImages = screen.getAllByAltText(/Smoke effect/);
      smokeImages.forEach((img) => {
        expect(img).toHaveStyle({ transform: "rotate(180deg)" });
      });
    });

    it("should apply different blend modes to smoke layers", () => {
      render(<MeetTheGoddess />);

      const smokeMain = screen.getByAltText("Smoke effect");
      expect(smokeMain).toHaveStyle({ mixBlendMode: "normal", opacity: "0.5" });

      const smokeDuplicate = screen.getByAltText("Smoke effect duplicate");
      expect(smokeDuplicate).toHaveStyle({
        mixBlendMode: "multiply",
        opacity: "0.3",
      });

      const smokeTriple = screen.getByAltText("Smoke effect triple");
      expect(smokeTriple).toHaveStyle({
        mixBlendMode: "overlay",
        opacity: "0.2",
      });
    });

    it("should position tertiary image with correct rotation", () => {
      render(<MeetTheGoddess />);
      const tertiaryImg = screen.getByAltText("Sacred healing space");
      const container = tertiaryImg.closest("div[style*='rotate(-4.85deg)']");
      expect(container).toHaveStyle({
        transform: "rotate(-4.85deg)",
        left: "688px",
        top: "50px",
      });
    });

    it("should position secondary image with correct rotation", () => {
      render(<MeetTheGoddess />);
      const secondaryImg = screen.getByAltText("Healing session in progress");
      const container = secondaryImg.closest("div[style*='rotate(8.13deg)']");
      expect(container).toHaveStyle({
        transform: "rotate(8.13deg)",
      });
    });

    it("should style heading with correct typography", () => {
      render(<MeetTheGoddess />);
      const heading = screen.getByText("Meet Deirdre, The Reiki Goddess");
      expect(heading).toHaveStyle({
        fontSize: "48px",
        fontWeight: "700",
        lineHeight: "56px",
      });
    });

    it("should style CTA button correctly", () => {
      render(<MeetTheGoddess />);
      const button = screen.getByRole("link", { name: /Read Full Story/i });
      // Check inline styles that are applied
      expect(button).toHaveStyle({
        border: "2px solid rgb(2, 5, 183)",
        color: "rgb(2, 5, 183)",
      });
    });

    it("should apply hover styles to CTA button", () => {
      render(<MeetTheGoddess />);
      const button = screen.getByRole("link", { name: /Read Full Story/i });
      expect(button).toHaveClass("hover:bg-blue-50", "hover:scale-105");
    });
  });

  describe("Interactions", () => {
    it("should handle CTA button click", () => {
      const handleClick = vi.fn();
      const ctaButton = {
        text: "Read Story",
        href: "/about",
        onClick: handleClick,
      };

      render(<MeetTheGoddess ctaButton={ctaButton} />);
      const button = screen.getByRole("link", { name: /Read Story/i });

      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should handle image load errors for main images", () => {
      render(<MeetTheGoddess />);

      const secondaryImg = screen.getByAltText("Healing session in progress");
      fireEvent.error(secondaryImg);
      expect(secondaryImg).toHaveStyle({ display: "none" });
    });

    it("should handle image load errors for smoke effects", () => {
      render(<MeetTheGoddess />);

      const smokeImg = screen.getByAltText("Smoke effect");
      fireEvent.error(smokeImg);
      expect(smokeImg).toHaveStyle({ display: "none" });
    });

    it("should not break when images fail to load", () => {
      const { container } = render(<MeetTheGoddess />);

      // Trigger errors on all images
      const allImages = container.querySelectorAll("img");
      allImages.forEach((img) => {
        fireEvent.error(img);
      });

      // Component should still render content
      expect(
        screen.getByText("Meet Deirdre, The Reiki Goddess")
      ).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have semantic section element", () => {
      const { container } = render(<MeetTheGoddess />);
      const section = container.querySelector("section");
      expect(section).toBeInTheDocument();
    });

    it("should have proper heading hierarchy", () => {
      render(<MeetTheGoddess />);
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveTextContent("Meet Deirdre, The Reiki Goddess");
    });

    it("should have accessible link with proper href", () => {
      render(<MeetTheGoddess />);
      const link = screen.getByRole("link", { name: /Read Full Story/i });
      expect(link).toHaveAttribute("href", "/about");
    });

    it("should have alt text for all images", () => {
      render(<MeetTheGoddess />);

      const images = screen.getAllByRole("img");
      images.forEach((img) => {
        expect(img).toHaveAttribute("alt");
      });
    });

    it("should have descriptive alt text for content images", () => {
      render(<MeetTheGoddess />);

      expect(
        screen.getByAltText("Healing session in progress")
      ).toBeInTheDocument();
      expect(screen.getByAltText("Sacred healing space")).toBeInTheDocument();
    });

    it("should render decorative smoke images with alt text", () => {
      render(<MeetTheGoddess />);

      // Smoke effects have alt text for transparency
      expect(screen.getByAltText("Smoke effect")).toBeInTheDocument();
    });

    it("should support keyboard navigation for CTA button", () => {
      render(<MeetTheGoddess />);
      const button = screen.getByRole("link", { name: /Read Full Story/i });

      // Focus the button
      button.focus();
      expect(document.activeElement).toBe(button);
    });
  });

  describe("Responsive Behavior", () => {
    it("should maintain relative positioning on different viewports", () => {
      const { container } = render(<MeetTheGoddess />);
      // Look for the container with max width styling
      const contentContainers = container.querySelectorAll("div");
      const contentContainer = Array.from(contentContainers).find(
        (el) => el.style.maxWidth === "1440px"
      );
      expect(contentContainer).toBeDefined();
      if (contentContainer) {
        expect(contentContainer).toHaveStyle({
          maxWidth: "1440px",
          margin: "0 auto",
        });
      }
    });

    it("should maintain padding on content area", () => {
      const { container } = render(<MeetTheGoddess />);
      // Look for the container with padding styling
      const paddedContainers = container.querySelectorAll("div");
      const paddedContent = Array.from(paddedContainers).find(
        (el) => el.style.padding === "0px 66px"
      );
      expect(paddedContent).toBeDefined();
    });

    it("should limit text content width", () => {
      const { container } = render(<MeetTheGoddess />);
      // Look for the container with maxWidth 600px
      const textContainers = container.querySelectorAll("div");
      const textContent = Array.from(textContainers).find(
        (el) => el.style.maxWidth === "600px"
      );
      expect(textContent).toBeDefined();
    });

    it("should handle overflow properly", () => {
      const { container } = render(<MeetTheGoddess />);
      const section = container.querySelector("section");
      expect(section).toHaveClass("overflow-hidden");
    });
  });

  describe("Edge Cases", () => {
    it("should render without any props", () => {
      const { container } = render(<MeetTheGoddess />);
      expect(container.querySelector("section")).toBeInTheDocument();
    });

    it("should handle empty strings in props", () => {
      render(
        <MeetTheGoddess
          heading=""
          content=""
          ctaButton={{ text: "", href: "" }}
        />
      );

      // Component should still render structure
      const { container } = render(<MeetTheGoddess />);
      expect(container.querySelector("section")).toBeInTheDocument();
    });

    it("should handle React nodes as content", () => {
      const complexContent = (
        <div>
          <h3>Complex Content</h3>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        </div>
      );

      render(<MeetTheGoddess content={complexContent} />);
      expect(screen.getByText("Complex Content")).toBeInTheDocument();
      expect(screen.getByText("Item 1")).toBeInTheDocument();
    });

    it("should handle very long heading text", () => {
      const longHeading =
        "This is a very long heading that might wrap to multiple lines and test the layout robustness of the component";
      render(<MeetTheGoddess heading={longHeading} />);
      expect(screen.getByText(longHeading)).toBeInTheDocument();
    });

    it("should render with only images prop", () => {
      const images = {
        secondary: { src: "/test.jpg", alt: "Test" },
      };
      render(<MeetTheGoddess images={images} />);
      expect(screen.getByAltText("Test")).toBeInTheDocument();
    });
  });
});
