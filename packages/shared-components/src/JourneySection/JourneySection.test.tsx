import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { JourneySection } from "./JourneySection";
import type { JourneySectionProps } from "./JourneySection.types";

describe("JourneySection", () => {
  it("renders with default props", () => {
    render(<JourneySection />);

    expect(
      screen.getByText(/My Journey: Inspiring Personal Growth & Renewal/i)
    ).toBeInTheDocument();
  });

  it("renders custom heading", () => {
    render(<JourneySection heading="Custom Journey Heading" />);

    expect(screen.getByText("Custom Journey Heading")).toBeInTheDocument();
  });

  it("renders custom content", () => {
    const customContent = <p>Custom journey content</p>;
    render(<JourneySection content={customContent} />);

    expect(screen.getByText("Custom journey content")).toBeInTheDocument();
  });

  it("renders background image with correct attributes", () => {
    const backgroundImage = {
      src: "/test-bg-image.jpg",
      alt: "Test background",
    };
    render(<JourneySection backgroundImage={backgroundImage} />);

    const img = screen.getByAltText("Test background");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/test-bg-image.jpg");
  });

  it("renders side image with correct attributes", () => {
    const sideImage = {
      src: "/test-side-image.jpg",
      alt: "Test side image",
    };
    render(<JourneySection sideImage={sideImage} />);

    const img = screen.getByAltText("Test side image");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/test-side-image.jpg");
  });

  it("renders certification cards", () => {
    render(<JourneySection />);

    // Check for default certification titles
    expect(screen.getByText("Sound Healing Specialist")).toBeInTheDocument();
    expect(screen.getByText("Years of Experience")).toBeInTheDocument();
    expect(screen.getByText("Certified Reiki Master")).toBeInTheDocument();
  });

  it("renders custom certification cards", () => {
    const customCertifications: JourneySectionProps["certifications"] = [
      {
        title: "Custom Cert 1",
        description: "Custom description 1",
        variant: "gradient",
      },
      {
        title: "Custom Cert 2",
        description: "Custom description 2",
        variant: "white",
      },
    ];

    render(<JourneySection certifications={customCertifications} />);

    expect(screen.getByText("Custom Cert 1")).toBeInTheDocument();
    expect(screen.getByText("Custom Cert 2")).toBeInTheDocument();
    expect(screen.getByText("Custom description 1")).toBeInTheDocument();
    expect(screen.getByText("Custom description 2")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<JourneySection className="custom-class" />);

    const section = container.querySelector("section");
    expect(section).toHaveClass("custom-class");
  });

  it("has correct section height", () => {
    const { container } = render(<JourneySection />);

    const section = container.querySelector("section");
    expect(section).toHaveStyle({ height: "808px" });
  });

  it("has correct background color", () => {
    const { container } = render(<JourneySection />);

    const section = container.querySelector("section");
    expect(section).toHaveStyle({ backgroundColor: "#FFFBF5" });
  });

  it("handles image load errors gracefully", () => {
    render(<JourneySection />);

    const images = screen.getAllByRole("img");
    images.forEach((img) => {
      // Simulate error
      const errorEvent = new Event("error", { bubbles: true });
      img.dispatchEvent(errorEvent);
    });

    // Component should still be in the document
    expect(
      screen.getByText(/My Journey: Inspiring Personal Growth & Renewal/i)
    ).toBeInTheDocument();
  });

  it("renders section with correct overflow handling", () => {
    const { container } = render(<JourneySection />);

    const section = container.querySelector("section");
    expect(section).toHaveClass("overflow-hidden");
  });

  it("positions content container correctly", () => {
    const { container } = render(<JourneySection />);

    const contentContainer = container.querySelector(
      'div[style*="width: 884px"]'
    );
    expect(contentContainer).toBeInTheDocument();
  });
});
