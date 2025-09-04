import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ContactInfoCard } from "./ContactInfoCard";

describe("ContactInfoCard", () => {
  const defaultProps = {
    icon: "/test-icon.svg",
    title: "Test Title",
    content: "Test Content",
    ctaText: "Click Me",
    ctaLink: "https://example.com",
  };

  describe("Rendering", () => {
    it("should render with all props", () => {
      render(<ContactInfoCard {...defaultProps} />);

      expect(screen.getByText("Test Title")).toBeInTheDocument();
      expect(screen.getByText("Test Content")).toBeInTheDocument();
      expect(screen.getByText("Click Me")).toBeInTheDocument();

      const icon = screen.getByAltText("");
      expect(icon).toHaveAttribute("src", "/test-icon.svg");
    });

    it("should render with custom className", () => {
      const { container } = render(
        <ContactInfoCard {...defaultProps} className="custom-class" />
      );

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("custom-class");
    });

    it("should apply blue bevel effect styles", () => {
      const { container } = render(<ContactInfoCard {...defaultProps} />);

      // Check for bevel shadow div
      const bevelDiv = container.querySelector(".absolute.inset-0.bg-blue");
      expect(bevelDiv).toBeInTheDocument();
      expect(bevelDiv).toHaveStyle({ transform: "translate(9px, 9px)" });
    });

    it("should render card with correct dimensions", () => {
      const { container } = render(<ContactInfoCard {...defaultProps} />);

      const card = container.querySelector(".relative.bg-white");
      expect(card).toHaveClass("h-[156px]", "rounded-[17px]", "p-6");
    });
  });

  describe("Links", () => {
    it("should render external link with correct attributes", () => {
      render(<ContactInfoCard {...defaultProps} />);

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "https://example.com");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("should render internal link without target blank", () => {
      render(<ContactInfoCard {...defaultProps} ctaLink="/internal-page" />);

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/internal-page");
      expect(link).not.toHaveAttribute("target");
      expect(link).not.toHaveAttribute("rel");
    });

    it("should render tel link correctly", () => {
      render(<ContactInfoCard {...defaultProps} ctaLink="tel:1234567890" />);

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "tel:1234567890");
      expect(link).not.toHaveAttribute("target");
    });

    it("should render mailto link correctly", () => {
      render(
        <ContactInfoCard {...defaultProps} ctaLink="mailto:test@example.com" />
      );

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "mailto:test@example.com");
      expect(link).not.toHaveAttribute("target");
    });
  });

  describe("Styling", () => {
    it("should apply correct typography styles", () => {
      render(<ContactInfoCard {...defaultProps} />);

      const title = screen.getByText("Test Title");
      expect(title).toHaveClass("text-[18px]", "font-bold", "text-black");
      expect(title).toHaveStyle({ fontFamily: "Figtree, sans-serif" });

      const content = screen.getByText("Test Content");
      expect(content).toHaveClass("text-[16px]", "text-black");
      expect(content).toHaveStyle({ fontFamily: "Neue Montreal, sans-serif" });

      const ctaText = screen.getByText("Click Me");
      expect(ctaText).toHaveClass("text-[16px]");
      expect(ctaText).toHaveStyle({ fontFamily: "Figtree, sans-serif" });
    });

    it("should have hover animation class on card", () => {
      const { container } = render(<ContactInfoCard {...defaultProps} />);

      const card = container.querySelector(".relative.bg-white");
      expect(card).toHaveClass(
        "transition-transform",
        "duration-300",
        "group-hover:-translate-y-1"
      );
    });

    it("should have hover animation on link", () => {
      render(<ContactInfoCard {...defaultProps} />);

      const link = screen.getByRole("link");
      expect(link).toHaveClass("hover:gap-3", "transition-all", "duration-300");
    });
  });

  describe("Icons", () => {
    it("should render main icon with correct size", () => {
      render(<ContactInfoCard {...defaultProps} />);

      const icons = screen.getAllByRole("img");
      const mainIcon = icons[0];

      expect(mainIcon).toHaveClass("w-6", "h-6");
      expect(mainIcon).toHaveAttribute("src", "/test-icon.svg");
    });

    it("should render arrow icon with correct attributes", () => {
      render(<ContactInfoCard {...defaultProps} />);

      const icons = screen.getAllByRole("img");
      const arrowIcon = icons[1];

      expect(arrowIcon).toHaveClass("w-5", "h-5", "rotate-45");
      expect(arrowIcon).toHaveAttribute(
        "src",
        "/img/8004428ff1a4bbe981b7017e82dadb4c9bba67a6.svg"
      );
      expect(arrowIcon).toHaveAttribute("alt", "Arrow");
    });
  });

  describe("Accessibility", () => {
    it("should have accessible link text", () => {
      render(<ContactInfoCard {...defaultProps} />);

      const link = screen.getByRole("link", { name: /Click Me/i });
      expect(link).toBeInTheDocument();
    });

    it("should have empty alt text for decorative icons", () => {
      render(<ContactInfoCard {...defaultProps} />);

      const mainIcon = screen.getAllByRole("img")[0];
      expect(mainIcon).toHaveAttribute("alt", "");
    });
  });

  describe("Layout", () => {
    it("should position CTA link at bottom left", () => {
      render(<ContactInfoCard {...defaultProps} />);

      const link = screen.getByRole("link");
      expect(link).toHaveClass("absolute", "bottom-[25px]", "left-[25px]");
    });

    it("should have correct spacing between elements", () => {
      render(<ContactInfoCard {...defaultProps} />);

      const title = screen.getByText("Test Title");
      expect(title).toHaveClass("mb-[37px]");

      const contentWrapper = screen.getByText("Test Content").parentElement;
      expect(contentWrapper).toHaveClass("gap-3");
    });
  });
});
