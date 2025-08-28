import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { HeroV2, type HeroV2Props } from "./HeroV2";

describe("HeroV2 Component", () => {
  const defaultProps: HeroV2Props = {
    backgroundImage: {
      src: "/img/test-hero.jpg",
      alt: "Test hero background",
    },
    overlayContent: {
      heading: "Test Heading",
      subheading: "Test subheading text",
      buttons: [
        {
          text: "Primary Button",
          variant: "primary",
          href: "/primary",
        },
        {
          text: "Secondary Button",
          variant: "secondary",
          href: "/secondary",
        },
      ],
    },
  };

  describe("Rendering", () => {
    it("should render the hero section", () => {
      const { container } = render(<HeroV2 />);
      const section = container.querySelector("section");
      expect(section).toBeInTheDocument();
    });

    it("should render with custom className", () => {
      const { container } = render(<HeroV2 className="custom-class" />);
      const section = container.querySelector("section");
      expect(section).toHaveClass("custom-class");
    });

    it("should render with default content when no props provided", () => {
      render(<HeroV2 />);
      expect(screen.getByText("The Reiki Goddess Healing")).toBeInTheDocument();
      expect(
        screen.getByText(/Energy Healing for Optimal Mental Health/)
      ).toBeInTheDocument();
      expect(screen.getByText("Book a Session")).toBeInTheDocument();
      expect(screen.getByText("Learn More")).toBeInTheDocument();
    });
  });

  describe("Background Image", () => {
    it("should render background image when provided", () => {
      render(<HeroV2 {...defaultProps} />);
      const img = screen.getByRole("img", { name: "Test hero background" });
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute("src", "/img/test-hero.jpg");
    });

    it("should apply correct styles to background image", () => {
      render(<HeroV2 {...defaultProps} />);
      const img = screen.getByRole("img", { name: "Test hero background" });
      const styles = window.getComputedStyle(img);
      expect(styles.top).toBe("93px");
      expect(styles.left).toBe("66px");
      expect(styles.right).toBe("66px");
      expect(styles.height).toBe("732px");
      expect(styles.borderRadius).toBe("20px");
    });

    it("should show gradient fallback when no image provided", () => {
      const props = {
        ...defaultProps,
        backgroundImage: undefined,
      };
      const { container } = render(<HeroV2 {...props} />);
      const gradientDiv = container.querySelector('[style*="linear-gradient"]');
      expect(gradientDiv).toBeInTheDocument();
    });

    it("should handle image load error and show fallback", () => {
      render(<HeroV2 {...defaultProps} />);
      const img = screen.getByRole("img", { name: "Test hero background" });

      // Simulate image error
      fireEvent.error(img);

      expect(img).toHaveStyle({ display: "none" });
      const fallback = img.nextElementSibling as HTMLElement;
      expect(fallback).toHaveStyle({ display: "block" });
    });

    it("should render dark overlay for text readability", () => {
      const { container } = render(<HeroV2 {...defaultProps} />);
      const overlay = container.querySelector(".bg-black\\/30");
      expect(overlay).toBeInTheDocument();
      const styles = window.getComputedStyle(overlay as HTMLElement);
      expect(styles.borderRadius).toBe("20px");
    });
  });

  describe("Overlay Content", () => {
    it("should render heading when provided", () => {
      render(<HeroV2 {...defaultProps} />);
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent("Test Heading");
    });

    it("should apply correct heading styles", () => {
      render(<HeroV2 {...defaultProps} />);
      const heading = screen.getByRole("heading", { level: 1 });
      const styles = window.getComputedStyle(heading);
      expect(styles.fontSize).toBe("63.55px");
      expect(styles.fontWeight).toBe("700");
      expect(styles.color).toBe("rgb(255, 255, 255)");
      expect(styles.width).toBe("825px");
    });

    it("should render subheading when provided", () => {
      render(<HeroV2 {...defaultProps} />);
      expect(screen.getByText("Test subheading text")).toBeInTheDocument();
    });

    it("should apply correct subheading styles", () => {
      render(<HeroV2 {...defaultProps} />);
      const subheading = screen.getByText("Test subheading text");
      const styles = window.getComputedStyle(subheading);
      expect(styles.fontSize).toBe("16px");
      expect(styles.fontWeight).toBe("500");
      expect(styles.color).toBe("rgb(255, 255, 255)");
      expect(styles.width).toBe("533px");
      expect(styles.textAlign).toBe("center");
    });

    it("should not render heading when not provided", () => {
      const props = {
        ...defaultProps,
        overlayContent: {
          ...defaultProps.overlayContent,
          heading: undefined,
        },
      };
      render(<HeroV2 {...props} />);
      const heading = screen.queryByRole("heading", { level: 1 });
      expect(heading).not.toBeInTheDocument();
    });

    it("should not render subheading when not provided", () => {
      const props = {
        ...defaultProps,
        overlayContent: {
          ...defaultProps.overlayContent,
          subheading: undefined,
        },
      };
      render(<HeroV2 {...props} />);
      expect(
        screen.queryByText("Test subheading text")
      ).not.toBeInTheDocument();
    });
  });

  describe("CTA Buttons", () => {
    it("should render all buttons", () => {
      render(<HeroV2 {...defaultProps} />);
      expect(screen.getByText("Primary Button")).toBeInTheDocument();
      expect(screen.getByText("Secondary Button")).toBeInTheDocument();
    });

    it("should render buttons as links with correct href", () => {
      render(<HeroV2 {...defaultProps} />);
      const primaryLink = screen.getByText("Primary Button").closest("a");
      const secondaryLink = screen.getByText("Secondary Button").closest("a");

      expect(primaryLink).toHaveAttribute("href", "/primary");
      expect(secondaryLink).toHaveAttribute("href", "/secondary");
    });

    it("should render arrow icons in buttons", () => {
      const { container } = render(<HeroV2 {...defaultProps} />);
      const arrows = container.querySelectorAll("svg");
      expect(arrows).toHaveLength(2);
      arrows.forEach((arrow) => {
        expect(arrow).toHaveAttribute("viewBox", "0 0 24 24");
      });
    });

    it("should apply correct button styles", () => {
      render(<HeroV2 {...defaultProps} />);
      const button = screen.getByText("Primary Button").closest("a");
      const styles = window.getComputedStyle(button as HTMLElement);
      expect(styles.backgroundColor).toBe("rgba(0, 0, 0, 0)");
      expect(styles.color).toBe("rgb(255, 255, 255)");
      expect(styles.border).toBe("2px solid white");
      expect(styles.borderRadius).toBe("");
      expect(styles.minWidth).toBe("180px");
      expect(styles.height).toBe("48px");
    });

    it("should handle button onClick when provided", () => {
      const handleClick = vi.fn();
      const props = {
        ...defaultProps,
        overlayContent: {
          ...defaultProps.overlayContent,
          buttons: [
            {
              text: "Click Me",
              variant: "primary" as const,
              onClick: handleClick,
            },
          ],
        },
      };

      render(<HeroV2 {...props} />);
      const button = screen.getByText("Click Me");
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should use # as default href when not provided", () => {
      const props = {
        ...defaultProps,
        overlayContent: {
          ...defaultProps.overlayContent,
          buttons: [
            {
              text: "No Href Button",
              variant: "primary" as const,
            },
          ],
        },
      };

      render(<HeroV2 {...props} />);
      const link = screen.getByText("No Href Button").closest("a");
      expect(link).toHaveAttribute("href", "#");
    });

    it("should not render button container when no buttons provided", () => {
      const props = {
        ...defaultProps,
        overlayContent: {
          ...defaultProps.overlayContent,
          buttons: [],
        },
      };

      const { container } = render(<HeroV2 {...props} />);
      const buttonContainer = container.querySelector(".flex.gap-4");
      expect(buttonContainer).not.toBeInTheDocument();
    });

    it("should not render button container when buttons is undefined", () => {
      const props = {
        ...defaultProps,
        overlayContent: {
          ...defaultProps.overlayContent,
          buttons: undefined,
        },
      };

      const { container } = render(<HeroV2 {...props} />);
      const buttonContainer = container.querySelector(".flex.gap-4");
      expect(buttonContainer).not.toBeInTheDocument();
    });
  });

  describe("Layout and Positioning", () => {
    it("should set correct section height", () => {
      const { container } = render(<HeroV2 {...defaultProps} />);
      const section = container.querySelector("section");
      const styles = window.getComputedStyle(section as HTMLElement);
      expect(styles.height).toBe("825px");
    });

    it("should position overlay content correctly", () => {
      const { container } = render(<HeroV2 {...defaultProps} />);
      const overlayContent = container.querySelector(".absolute.z-10");
      expect(overlayContent).toBeInTheDocument();
      const styles = window.getComputedStyle(overlayContent as HTMLElement);
      expect(styles.top).toBe("calc(529px)");
      expect(styles.left).toBe("50%");
      expect(styles.transform).toBe("translateX(-50%)");
    });

    it("should center content container", () => {
      const { container } = render(<HeroV2 {...defaultProps} />);
      const contentContainer = container.querySelector(".text-center");
      expect(contentContainer).toBeInTheDocument();
      const styles = window.getComputedStyle(contentContainer as HTMLElement);
      expect(styles.width).toBe("825px");
      expect(styles.margin).toBe("0px auto");
    });
  });

  describe("Hover Effects", () => {
    it("should have hover styles on buttons", () => {
      render(<HeroV2 {...defaultProps} />);
      const button = screen.getByText("Primary Button").closest("a");
      expect(button).toHaveClass("hover:bg-white/10", "hover:scale-105");
    });

    it("should have transition animations", () => {
      render(<HeroV2 {...defaultProps} />);
      const button = screen.getByText("Primary Button").closest("a");
      expect(button).toHaveClass("transition-all", "duration-200");
    });
  });

  describe("Accessibility", () => {
    it("should have semantic section element", () => {
      const { container } = render(<HeroV2 {...defaultProps} />);
      const section = container.querySelector("section");
      expect(section).toBeInTheDocument();
      expect(section?.tagName).toBe("SECTION");
    });

    it("should have alt text for background image", () => {
      render(<HeroV2 {...defaultProps} />);
      const img = screen.getByRole("img", { name: "Test hero background" });
      expect(img).toHaveAttribute("alt", "Test hero background");
    });

    it("should have proper heading hierarchy", () => {
      render(<HeroV2 {...defaultProps} />);
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading.tagName).toBe("H1");
    });

    it("should have accessible button links", () => {
      render(<HeroV2 {...defaultProps} />);
      const links = screen.getAllByRole("link");
      expect(links).toHaveLength(2);
      links.forEach((link) => {
        expect(link.tagName).toBe("A");
      });
    });
  });
});
