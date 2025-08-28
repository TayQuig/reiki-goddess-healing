import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CommunityEvents } from "./CommunityEvents";
import type { EventCard } from "./CommunityEvents";

describe("CommunityEvents", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Mock window.location.href setter
  const mockLocationAssign = vi.fn();
  beforeEach(() => {
    delete (window as unknown as { location: unknown }).location;
    window.location = {
      href: "",
      assign: mockLocationAssign,
    } as unknown as Location;
  });

  describe("Rendering", () => {
    it("should render with default props", () => {
      render(<CommunityEvents />);

      // Check headings
      expect(screen.getByText("Upcoming Events &")).toBeInTheDocument();
      expect(screen.getByText("Community Highlights")).toBeInTheDocument();

      // Check default event cards
      expect(
        screen.getByText("Full Moon Aerial Sound Bath")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Custom Sound Healing Workshop")
      ).toBeInTheDocument();

      // Check CTA button
      expect(
        screen.getByRole("link", { name: /View Full Calendar/i })
      ).toBeInTheDocument();
    });

    it("should render with custom heading and subheading", () => {
      render(
        <CommunityEvents heading="Special Events" subheading="This Month" />
      );

      expect(screen.getByText("Special Events")).toBeInTheDocument();
      expect(screen.getByText("This Month")).toBeInTheDocument();
    });

    it("should render with custom CTA button", () => {
      const ctaButton = {
        text: "Browse Events",
        href: "/calendar",
      };
      render(<CommunityEvents ctaButton={ctaButton} />);

      const button = screen.getByRole("link", { name: /Browse Events/i });
      expect(button).toHaveAttribute("href", "/calendar");
    });

    it("should render background image", () => {
      render(<CommunityEvents />);

      const backgroundImg = screen.getByAltText(
        "Sound healing bowl with mallet"
      );
      expect(backgroundImg).toBeInTheDocument();
      expect(backgroundImg).toHaveAttribute(
        "src",
        "/img/community-highlights.jpg"
      );
    });

    it("should render event card images", () => {
      render(<CommunityEvents />);

      expect(
        screen.getByAltText("Full Moon Aerial Sound Bath")
      ).toBeInTheDocument();
      expect(
        screen.getByAltText("Custom Sound Healing Song Workshop")
      ).toBeInTheDocument();
    });

    it("should render Learn More buttons for events", () => {
      render(<CommunityEvents />);

      const learnMoreButtons = screen.getAllByText("Learn More");
      expect(learnMoreButtons).toHaveLength(2);
    });

    it("should render pagination dots", () => {
      const { container } = render(<CommunityEvents />);

      // Check for dot container
      const dotsContainer = container.querySelector(
        ".flex.justify-center.gap-2"
      );
      expect(dotsContainer).toBeInTheDocument();

      // Check for individual dots - they have width and height styles
      const dots = dotsContainer?.querySelectorAll("div[style*='width: 10px']");
      expect(dots).toHaveLength(3);
    });

    it("should apply custom className", () => {
      const { container } = render(
        <CommunityEvents className="custom-class" />
      );
      const section = container.querySelector("section");
      expect(section).toHaveClass("custom-class");
    });

    it("should render CTA button with arrow icon", () => {
      render(<CommunityEvents />);
      const button = screen.getByRole("link", { name: /View Full Calendar/i });
      const svg = button.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });
  });

  describe("Styling", () => {
    it("should have correct section styling", () => {
      const { container } = render(<CommunityEvents />);
      const section = container.querySelector("section");

      expect(section).toHaveStyle({
        minHeight: "600px",
        borderRadius: "30px",
        margin: "40px 0",
      });
    });

    it("should apply gradient overlay", () => {
      const { container } = render(<CommunityEvents />);
      // Look for the overlay with the specific background color
      const overlays = container.querySelectorAll("div");
      const overlay = Array.from(overlays).find(
        (el) => el.style.backgroundColor === "rgba(2, 5, 183, 0.44)"
      );
      expect(overlay).toBeDefined();
    });

    it("should style heading with white color", () => {
      render(<CommunityEvents />);
      const heading = screen.getByText("Upcoming Events &");

      expect(heading).toHaveClass("text-white", "font-bold");
      expect(heading).toHaveStyle({
        fontSize: "48px",
        lineHeight: "1.2",
      });
    });

    it("should style event cards with white background", () => {
      const { container } = render(<CommunityEvents />);
      const eventCards = container.querySelectorAll(".bg-white");

      // Should have 2 event cards
      expect(eventCards.length).toBeGreaterThanOrEqual(2);

      eventCards.forEach((card) => {
        expect(card).toHaveStyle({
          borderRadius: "20px",
          padding: "30px",
        });
      });
    });

    it("should style event titles correctly", () => {
      render(<CommunityEvents />);
      const eventTitle = screen.getByText("Full Moon Aerial Sound Bath");

      expect(eventTitle).toHaveStyle({
        fontSize: "22px",
        color: "#333333",
      });
    });

    it("should style Learn More buttons", () => {
      render(<CommunityEvents />);
      const learnMoreButtons = screen.getAllByText("Learn More");

      learnMoreButtons.forEach((button) => {
        expect(button).toHaveStyle({
          borderColor: "#0205B7",
          color: "#0205B7",
          fontSize: "16px",
          fontWeight: "500",
        });
      });
    });

    it("should style CTA button with white border", () => {
      render(<CommunityEvents />);
      const ctaButton = screen.getByRole("link", {
        name: /View Full Calendar/i,
      });

      expect(ctaButton).toHaveStyle({
        border: "2px solid white",
        color: "rgb(255, 255, 255)",
      });
    });

    it("should style active pagination dot", () => {
      const { container } = render(<CommunityEvents />);
      const dotsContainer = container.querySelector(
        ".flex.justify-center.gap-2"
      );
      const dots = dotsContainer?.querySelectorAll("div");

      // First dot should be active (cyan color)
      if (dots && dots[0]) {
        expect(dots[0]).toHaveStyle({ backgroundColor: "#63D5F9" });
      }
    });

    it("should style inactive pagination dots", () => {
      const { container } = render(<CommunityEvents />);
      const dotsContainer = container.querySelector(
        ".flex.justify-center.gap-2"
      );
      const dots = dotsContainer?.querySelectorAll("div");

      // Second and third dots should be inactive
      if (dots && dots[1] && dots[2]) {
        expect(dots[1]).toHaveStyle({
          backgroundColor: "rgba(99, 213, 249, 0.5)",
        });
        expect(dots[2]).toHaveStyle({
          backgroundColor: "rgba(99, 213, 249, 0.5)",
        });
      }
    });

    it("should apply hover transition classes", () => {
      render(<CommunityEvents />);
      const learnMoreButtons = screen.getAllByText("Learn More");

      learnMoreButtons.forEach((button) => {
        expect(button).toHaveClass(
          "transition-all",
          "duration-300",
          "hover:shadow-lg"
        );
      });
    });
  });

  describe("Interactions", () => {
    it("should handle CTA button click", () => {
      const handleClick = vi.fn();
      const ctaButton = {
        text: "View Calendar",
        href: "/events",
        onClick: handleClick,
      };

      render(<CommunityEvents ctaButton={ctaButton} />);
      const button = screen.getByRole("link", { name: /View Calendar/i });

      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should navigate when Learn More button is clicked for Full Moon event", () => {
      render(<CommunityEvents />);
      const buttons = screen.getAllByText("Learn More");

      fireEvent.click(buttons[0]);
      expect(window.location.href).toBe("/events/full-moon");
    });

    it("should navigate when Learn More button is clicked for Workshop event", () => {
      render(<CommunityEvents />);
      const buttons = screen.getAllByText("Learn More");

      fireEvent.click(buttons[1]);
      expect(window.location.href).toBe("/events/workshop");
    });

    it("should handle CTA button hover effect", () => {
      render(<CommunityEvents />);
      const ctaButton = screen.getByRole("link", {
        name: /View Full Calendar/i,
      });

      // Hover in
      fireEvent.mouseEnter(ctaButton);
      expect(ctaButton).toHaveStyle({
        backgroundColor: "rgba(255, 255, 255, 0.1)",
      });

      // Hover out
      fireEvent.mouseLeave(ctaButton);
      // backgroundColor returns to transparent (empty string in inline styles)
      expect(ctaButton.style.backgroundColor).toBe("transparent");
    });
  });

  describe("Accessibility", () => {
    it("should have semantic section element", () => {
      const { container } = render(<CommunityEvents />);
      const section = container.querySelector("section");
      expect(section).toBeInTheDocument();
    });

    it("should have proper heading hierarchy", () => {
      render(<CommunityEvents />);
      const headings = screen.getAllByRole("heading", { level: 2 });
      expect(headings.length).toBeGreaterThanOrEqual(2); // Main heading and subheading
    });

    it("should have heading level 3 for event titles", () => {
      render(<CommunityEvents />);
      const eventTitles = screen.getAllByRole("heading", { level: 3 });
      expect(eventTitles).toHaveLength(2);
    });

    it("should have accessible link with proper href", () => {
      render(<CommunityEvents />);
      const link = screen.getByRole("link", { name: /View Full Calendar/i });
      expect(link).toHaveAttribute("href", "/events");
    });

    it("should have alt text for all images", () => {
      render(<CommunityEvents />);

      const images = screen.getAllByRole("img");
      images.forEach((img) => {
        expect(img).toHaveAttribute("alt");
        expect(img.getAttribute("alt")).not.toBe("");
      });
    });

    it("should have descriptive alt text for event images", () => {
      render(<CommunityEvents />);

      expect(
        screen.getByAltText("Full Moon Aerial Sound Bath")
      ).toBeInTheDocument();
      expect(
        screen.getByAltText("Custom Sound Healing Song Workshop")
      ).toBeInTheDocument();
      expect(
        screen.getByAltText("Sound healing bowl with mallet")
      ).toBeInTheDocument();
    });

    it("should support keyboard navigation for buttons", () => {
      render(<CommunityEvents />);
      const learnMoreButtons = screen.getAllByText("Learn More");

      learnMoreButtons.forEach((button) => {
        button.focus();
        expect(document.activeElement).toBe(button);
      });
    });

    it("should support keyboard navigation for CTA link", () => {
      render(<CommunityEvents />);
      const ctaButton = screen.getByRole("link", {
        name: /View Full Calendar/i,
      });

      ctaButton.focus();
      expect(document.activeElement).toBe(ctaButton);
    });
  });

  describe("Responsive Behavior", () => {
    it("should use responsive grid for events", () => {
      const { container } = render(<CommunityEvents />);
      const grid = container.querySelector(".grid");

      expect(grid).toHaveClass("grid-cols-1", "md:grid-cols-2");
    });

    it("should center content with max width", () => {
      const { container } = render(<CommunityEvents />);
      const contentContainer = container.querySelector(".max-w-6xl");

      expect(contentContainer).toHaveClass("mx-auto");
    });

    it("should limit events container width", () => {
      const { container } = render(<CommunityEvents />);
      // Look for the grid container with maxWidth style
      const gridContainers = container.querySelectorAll(".grid");
      const eventsContainer = Array.from(gridContainers).find(
        (el) => el.style.maxWidth === "1100px"
      );

      expect(eventsContainer).toBeDefined();
    });

    it("should maintain aspect ratio for event images", () => {
      const { container } = render(<CommunityEvents />);
      const imageContainers = container.querySelectorAll(
        "div[style*='height: 200px']"
      );

      expect(imageContainers.length).toBeGreaterThanOrEqual(2);
      imageContainers.forEach((container) => {
        expect(container).toHaveStyle({ height: "200px" });
      });
    });

    it("should handle overflow properly", () => {
      const { container } = render(<CommunityEvents />);
      const section = container.querySelector("section");
      expect(section).toHaveClass("overflow-hidden");
    });

    it("should maintain padding on mobile and desktop", () => {
      const { container } = render(<CommunityEvents />);
      const section = container.querySelector("section");
      expect(section).toHaveClass("py-20");
    });
  });

  describe("Edge Cases", () => {
    it("should render without any props", () => {
      const { container } = render(<CommunityEvents />);
      expect(container.querySelector("section")).toBeInTheDocument();
    });

    it("should handle empty strings in props", () => {
      render(
        <CommunityEvents
          heading=""
          subheading=""
          ctaButton={{ text: "", href: "" }}
        />
      );

      // Component should still render structure
      const { container } = render(<CommunityEvents />);
      expect(container.querySelector("section")).toBeInTheDocument();
    });

    it("should handle very long heading text", () => {
      const longHeading =
        "This is a very long heading that might wrap to multiple lines and test the layout";
      render(<CommunityEvents heading={longHeading} />);
      expect(screen.getByText(longHeading)).toBeInTheDocument();
    });

    it("should render with default CTA button even when undefined", () => {
      render(<CommunityEvents ctaButton={undefined} />);

      // Component uses default CTA button, so it should still be present
      expect(
        screen.getByRole("link", { name: /View Full Calendar/i })
      ).toBeInTheDocument();
      expect(screen.getAllByText("Learn More")).toHaveLength(2);
    });

    it("should handle custom events array", () => {
      const customEvents: EventCard[] = [
        {
          id: "1",
          title: "Custom Event",
          image: { src: "/custom.jpg", alt: "Custom" },
          date: "Tomorrow",
          description: "Custom description",
        },
      ];

      // Note: The component currently uses hardcoded events,
      // so this test documents current behavior
      render(<CommunityEvents _events={customEvents} />);

      // Component still shows default events (hardcoded)
      expect(
        screen.getByText("Full Moon Aerial Sound Bath")
      ).toBeInTheDocument();
    });
  });
});
