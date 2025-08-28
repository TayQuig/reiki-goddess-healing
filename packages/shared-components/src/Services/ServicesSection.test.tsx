import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  ServicesSection,
  type ServicesSectionProps,
  type ServiceCard,
} from "./ServicesSection";

describe("ServicesSection Component", () => {
  const mockServices: ServiceCard[] = [
    {
      id: "test1",
      icon: <svg data-testid="icon1">Icon 1</svg>,
      title: "Test Service 1",
      duration: "60 min",
      href: "/services/test1",
    },
    {
      id: "test2",
      icon: <svg data-testid="icon2">Icon 2</svg>,
      title: "Test Service 2",
      duration: "90 min",
      description: "Description for test service 2",
      href: "/services/test2",
    },
    {
      id: "test3",
      icon: <svg data-testid="icon3">Icon 3</svg>,
      title: "Test Service 3",
      href: "/services/test3",
    },
    {
      id: "test4",
      icon: <svg data-testid="icon4">Icon 4</svg>,
      title: "Test Service 4",
      duration: "45 min",
    },
  ];

  const defaultProps: ServicesSectionProps = {
    heading: "Test Heading",
    services: mockServices,
  };

  describe("Rendering", () => {
    it("should render the services section", () => {
      const { container } = render(<ServicesSection {...defaultProps} />);
      const section = container.querySelector("section");
      expect(section).toBeInTheDocument();
    });

    it("should render with custom className", () => {
      const { container } = render(
        <ServicesSection {...defaultProps} className="custom-class" />
      );
      const section = container.querySelector("section");
      expect(section).toHaveClass("custom-class");
    });

    it("should render with default props when none provided", () => {
      render(<ServicesSection />);
      expect(screen.getByText("Explore Healing Services")).toBeInTheDocument();
      expect(screen.getByText("Reiki Healing Sessions")).toBeInTheDocument();
      expect(screen.getByText("Sound + Energy")).toBeInTheDocument();
      expect(screen.getByText("Aura + Chakra")).toBeInTheDocument();
      expect(screen.getByText("Distance Healing")).toBeInTheDocument();
    });

    it("should apply correct background color", () => {
      const { container } = render(<ServicesSection {...defaultProps} />);
      const section = container.querySelector("section");
      const styles = window.getComputedStyle(section as HTMLElement);
      expect(styles.backgroundColor).toBe("rgb(255, 251, 245)");
    });
  });

  describe("Heading", () => {
    it("should render the heading", () => {
      render(<ServicesSection {...defaultProps} />);
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent("Test Heading");
    });

    it("should render default heading when not provided", () => {
      render(<ServicesSection services={mockServices} />);
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveTextContent("Explore Healing Services");
    });

    it("should apply correct heading styles", () => {
      render(<ServicesSection {...defaultProps} />);
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveClass(
        "text-center",
        "mb-8",
        "sm:mb-10",
        "lg:mb-12",
        "font-bold"
      );
      const styles = window.getComputedStyle(heading);
      expect(styles.fontFamily).toContain("Figtree");
      expect(styles.lineHeight).toBe("1.2");
    });
  });

  describe("Services Grid", () => {
    it("should render all service cards", () => {
      render(<ServicesSection {...defaultProps} />);
      mockServices.forEach((service) => {
        expect(screen.getByText(service.title)).toBeInTheDocument();
      });
    });

    it("should render correct number of service cards", () => {
      const { container } = render(<ServicesSection {...defaultProps} />);
      const cards = container.querySelectorAll(".group.relative");
      expect(cards).toHaveLength(4);
    });

    it("should apply responsive grid classes", () => {
      const { container } = render(<ServicesSection {...defaultProps} />);
      const grid = container.querySelector(".grid");
      expect(grid).toHaveClass(
        "grid-cols-1",
        "sm:grid-cols-2",
        "lg:grid-cols-4",
        "gap-4",
        "sm:gap-6",
        "lg:gap-8"
      );
    });

    it("should handle empty services array", () => {
      render(<ServicesSection heading="Test" services={[]} />);
      expect(screen.getByText("Test")).toBeInTheDocument();
      const { container } = render(<ServicesSection services={[]} />);
      const cards = container.querySelectorAll(".group.relative");
      expect(cards).toHaveLength(0);
    });
  });

  describe("Service Card", () => {
    it("should render service icon", () => {
      render(<ServicesSection {...defaultProps} />);
      expect(screen.getByTestId("icon1")).toBeInTheDocument();
      expect(screen.getByTestId("icon2")).toBeInTheDocument();
    });

    it("should render service title", () => {
      render(<ServicesSection {...defaultProps} />);
      expect(screen.getByText("Test Service 1")).toBeInTheDocument();
      expect(screen.getByText("Test Service 2")).toBeInTheDocument();
    });

    it("should render service duration when provided", () => {
      render(<ServicesSection {...defaultProps} />);
      expect(screen.getByText("60 min")).toBeInTheDocument();
      expect(screen.getByText("90 min")).toBeInTheDocument();
    });

    it("should not render duration when not provided", () => {
      render(<ServicesSection {...defaultProps} />);
      // Service 3 has no duration
      const service3Container = screen.getByText("Test Service 3").closest("a");
      const duration = service3Container?.querySelector("p");
      expect(duration).not.toBeInTheDocument();
    });

    it("should render service cards as links", () => {
      render(<ServicesSection {...defaultProps} />);
      const link1 = screen.getByText("Test Service 1").closest("a");
      const link2 = screen.getByText("Test Service 2").closest("a");
      expect(link1).toHaveAttribute("href", "/services/test1");
      expect(link2).toHaveAttribute("href", "/services/test2");
    });

    it("should use # as default href when not provided", () => {
      render(<ServicesSection {...defaultProps} />);
      const link4 = screen.getByText("Test Service 4").closest("a");
      expect(link4).toHaveAttribute("href", "#");
    });
  });

  describe("Card Styling", () => {
    it("should render blue background rectangle", () => {
      const { container } = render(<ServicesSection {...defaultProps} />);
      const cards = container.querySelectorAll(".group.relative");
      cards.forEach((card) => {
        const blueRect = card.querySelector(".absolute.inset-0");
        const styles = window.getComputedStyle(blueRect as HTMLElement);
        expect(styles.backgroundColor).toBe("rgb(2, 5, 183)");
        expect(styles.borderRadius).toBe("20px");
        expect(styles.transform).toBe("translateY(5px)");
      });
    });

    it("should apply white background to card", () => {
      render(<ServicesSection {...defaultProps} />);
      const card = screen.getByText("Test Service 1").closest("a");
      const styles = window.getComputedStyle(card as HTMLElement);
      expect(styles.backgroundColor).toBe("rgb(255, 255, 255)");
      expect(styles.borderRadius).toBe("20px");
    });

    it("should have box shadow on cards", () => {
      render(<ServicesSection {...defaultProps} />);
      const card = screen.getByText("Test Service 1").closest("a");
      const styles = window.getComputedStyle(card as HTMLElement);
      expect(styles.boxShadow).toBe(
        "0px 42px 32.5px -13px rgba(2, 5, 183, 0.25)"
      );
    });

    it("should have gradient overlay for hover state", () => {
      const { container } = render(<ServicesSection {...defaultProps} />);
      const gradientOverlays = container.querySelectorAll(
        ".absolute.inset-0.opacity-0.group-hover\\:opacity-100"
      );
      expect(gradientOverlays.length).toBeGreaterThan(0);
      gradientOverlays.forEach((overlay) => {
        const styles = window.getComputedStyle(overlay as HTMLElement);
        expect(styles.background).toContain("linear-gradient");
      });
    });
  });

  describe("Hover Effects", () => {
    it("should change box shadow on hover", () => {
      render(<ServicesSection {...defaultProps} />);
      const card = screen
        .getByText("Test Service 1")
        .closest("a") as HTMLElement;

      // Initial shadow
      expect(card.style.boxShadow).toBe(
        "0px 42px 32.5px -13px rgba(2, 5, 183, 0.25)"
      );

      // Hover
      fireEvent.mouseEnter(card);
      expect(card.style.boxShadow).toBe(
        "0px 42px 40px -10px rgba(2, 5, 183, 0.35)"
      );

      // Leave
      fireEvent.mouseLeave(card);
      expect(card.style.boxShadow).toBe(
        "0px 42px 32.5px -13px rgba(2, 5, 183, 0.25)"
      );
    });

    it("should have hover transform effect", () => {
      const { container } = render(<ServicesSection {...defaultProps} />);
      const cards = container.querySelectorAll(".group");
      cards.forEach((card) => {
        expect(card).toHaveClass(
          "transition-all",
          "duration-300",
          "transform",
          "hover:-translate-y-2"
        );
      });
    });

    it("should have icon hover effects", () => {
      const { container } = render(<ServicesSection {...defaultProps} />);
      const iconContainers = container.querySelectorAll(
        ".mb-3.sm\\:mb-4.relative.z-10"
      );
      iconContainers.forEach((icon) => {
        expect(icon).toHaveClass(
          "transition-all",
          "duration-300",
          "group-hover:brightness-0",
          "group-hover:invert"
        );
      });
    });

    it("should have text color hover effects", () => {
      render(<ServicesSection {...defaultProps} />);
      const title = screen.getByText("Test Service 1");
      expect(title).toHaveClass(
        "transition-colors",
        "duration-300",
        "group-hover:text-white"
      );
    });
  });

  describe("Responsive Design", () => {
    it("should apply responsive padding to container", () => {
      const { container } = render(<ServicesSection {...defaultProps} />);
      const wrapper = container.querySelector(".mx-auto");
      expect(wrapper).toHaveClass("px-4", "sm:px-6", "lg:px-8");
    });

    it("should apply responsive height to cards", () => {
      const { container } = render(<ServicesSection {...defaultProps} />);
      const cardContents = container.querySelectorAll(".h-\\[240px\\]");
      expect(cardContents).toHaveLength(4);
      cardContents.forEach((content) => {
        expect(content).toHaveClass(
          "h-[240px]",
          "sm:h-[260px]",
          "lg:h-[280px]"
        );
      });
    });

    it("should apply responsive text sizes", () => {
      render(<ServicesSection {...defaultProps} />);
      const title = screen.getByText("Test Service 1");
      expect(title).toHaveClass("text-base", "sm:text-lg", "lg:text-xl");
    });

    it("should apply responsive icon sizes", () => {
      const { container } = render(<ServicesSection {...defaultProps} />);
      const icons = container.querySelectorAll('[data-testid^="icon"]');
      icons.forEach((icon) => {
        expect(icon).toHaveClass(
          "w-12",
          "h-12",
          "sm:w-14",
          "sm:h-14",
          "lg:w-16",
          "lg:h-16"
        );
      });
    });
  });

  describe("Accessibility", () => {
    it("should have semantic section element", () => {
      const { container } = render(<ServicesSection {...defaultProps} />);
      const section = container.querySelector("section");
      expect(section).toBeInTheDocument();
      expect(section?.tagName).toBe("SECTION");
    });

    it("should have proper heading hierarchy", () => {
      render(<ServicesSection {...defaultProps} />);
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading.tagName).toBe("H2");
    });

    it("should have accessible links", () => {
      render(<ServicesSection {...defaultProps} />);
      const links = screen.getAllByRole("link");
      expect(links).toHaveLength(4);
      links.forEach((link) => {
        expect(link.tagName).toBe("A");
      });
    });

    it("should have proper title hierarchy in cards", () => {
      render(<ServicesSection {...defaultProps} />);
      const titles = screen.getAllByRole("heading", { level: 3 });
      expect(titles).toHaveLength(4);
      titles.forEach((title) => {
        expect(title.tagName).toBe("H3");
      });
    });
  });
});
