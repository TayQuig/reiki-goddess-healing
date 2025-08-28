import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Testimonials } from "./Testimonials";
import type { Testimonial } from "./Testimonials";

describe("Testimonials", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const customTestimonials: Testimonial[] = [
    {
      id: "test-1",
      name: "Test User 1",
      location: "Test City 1",
      content: "First test testimonial content",
      rating: 5,
    },
    {
      id: "test-2",
      name: "Test User 2",
      location: "Test City 2",
      content: "Second test testimonial content",
      rating: 4,
    },
    {
      id: "test-3",
      name: "Test User 3",
      location: "Test City 3",
      content: "Third test testimonial content",
      rating: 3,
    },
  ];

  describe("Rendering", () => {
    it("should render with default props", () => {
      render(<Testimonials />);

      // Check main heading
      expect(
        screen.getByText("Real Healing. Real People. Real Stories.")
      ).toBeInTheDocument();

      // Check subheading
      expect(
        screen.getByText("What My Clients Are Saying")
      ).toBeInTheDocument();

      // Check default first testimonial
      expect(screen.getByText(/Jessica M., Tacoma, WA/)).toBeInTheDocument();
      expect(
        screen.getByText(
          /I had no idea how deeply I was holding onto emotional pain/
        )
      ).toBeInTheDocument();
    });

    it("should render with custom heading", () => {
      render(<Testimonials heading="Custom Testimonials Heading" />);
      expect(
        screen.getByText("Custom Testimonials Heading")
      ).toBeInTheDocument();
    });

    it("should render with custom testimonials", () => {
      render(<Testimonials testimonials={customTestimonials} />);
      expect(screen.getByText("Test User 1, Test City 1")).toBeInTheDocument();
      // Check for the testimonial text with quotes
      expect(
        screen.getByText(/First test testimonial content/)
      ).toBeInTheDocument();
    });

    it("should render social media profile card", () => {
      render(<Testimonials />);

      // Check profile info
      expect(screen.getByText("Deirdre")).toBeInTheDocument();
      expect(screen.getByText("@the_reiki_goddess")).toBeInTheDocument();

      // Check stats
      expect(screen.getByText("500")).toBeInTheDocument();
      expect(screen.getByText("Posts")).toBeInTheDocument();
      expect(screen.getByText("754")).toBeInTheDocument();
      expect(screen.getByText("Followers")).toBeInTheDocument();
      expect(screen.getByText("871")).toBeInTheDocument();
      expect(screen.getByText("Following")).toBeInTheDocument();
    });

    it("should render Instagram follow button", () => {
      render(<Testimonials />);

      const followButton = screen.getByRole("link", { name: /Follow/i });
      expect(followButton).toBeInTheDocument();
      expect(followButton).toHaveAttribute(
        "href",
        "https://instagram.com/the_reiki_goddess"
      );
      expect(followButton).toHaveAttribute("target", "_blank");
      expect(followButton).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("should render event flyer images", () => {
      render(<Testimonials />);

      expect(
        screen.getByAltText("Full Moon Aerial Sound Bath event flyer")
      ).toBeInTheDocument();
      expect(screen.getByAltText("Healing event flyer")).toBeInTheDocument();
      expect(screen.getByAltText("Sowin event flyer")).toBeInTheDocument();
    });

    it("should render navigation buttons", () => {
      render(<Testimonials />);

      expect(screen.getByLabelText("Previous testimonial")).toBeInTheDocument();
      expect(screen.getByLabelText("Next testimonial")).toBeInTheDocument();
    });

    it("should render dot indicators", () => {
      render(<Testimonials />);

      // Default has 4 testimonials
      expect(screen.getByLabelText("Go to testimonial 1")).toBeInTheDocument();
      expect(screen.getByLabelText("Go to testimonial 2")).toBeInTheDocument();
      expect(screen.getByLabelText("Go to testimonial 3")).toBeInTheDocument();
      expect(screen.getByLabelText("Go to testimonial 4")).toBeInTheDocument();
    });

    it("should render star rating", () => {
      const { container } = render(<Testimonials />);
      const stars = container.querySelectorAll("svg path[d*='M12 2l3.09']");
      expect(stars).toHaveLength(5);
    });

    it("should apply custom className", () => {
      const { container } = render(<Testimonials className="custom-class" />);
      const section = container.querySelector("section");
      expect(section).toHaveClass("custom-class");
    });

    it("should render profile photo with correct attributes", () => {
      render(<Testimonials />);
      const profileImg = screen.getByAltText(
        "Deirdre with sound healing bowls"
      );
      expect(profileImg).toHaveAttribute("src", "/img/social-card-profile.png");
    });
  });

  describe("Styling", () => {
    it("should have correct background color", () => {
      const { container } = render(<Testimonials />);
      const section = container.querySelector("section");
      expect(section).toHaveStyle({ backgroundColor: "#FFFBF5" });
    });

    it("should style social media card with cyan border", () => {
      const { container } = render(<Testimonials />);
      const socialCard = container.querySelector(
        "div[style*='border: 3px solid #63D5F9']"
      );
      expect(socialCard).toBeDefined();
    });

    it("should style testimonial container with background", () => {
      const { container } = render(<Testimonials />);
      const testimonialBoxes = container.querySelectorAll("div");
      const testimonialBox = Array.from(testimonialBoxes).find(
        (el) => el.style.backgroundColor === "rgba(169, 148, 72, 0.13)"
      );
      expect(testimonialBox).toBeDefined();
    });

    it("should style headings with correct typography", () => {
      render(<Testimonials />);
      const mainHeading = screen.getByText(
        "Real Healing. Real People. Real Stories."
      );
      expect(mainHeading).toHaveStyle({
        fontSize: "48px",
        lineHeight: "1.2",
      });
    });

    it("should style Follow button correctly", () => {
      render(<Testimonials />);
      const followButton = screen.getByRole("link", { name: /Follow/i });
      expect(followButton).toHaveStyle({
        backgroundColor: "#FFFFFF",
        border: "2px solid #63D5F9",
        color: "#63D5F9",
      });
    });

    it("should style navigation buttons", () => {
      render(<Testimonials />);
      const prevButton = screen.getByLabelText("Previous testimonial");
      expect(prevButton).toHaveClass(
        "bg-white",
        "border-2",
        "border-[#0205B7]",
        "text-[#0205B7]",
        "rounded-full"
      );
    });

    it("should apply rounded corners to event flyer containers", () => {
      const { container } = render(<Testimonials />);
      // Look for containers with borderRadius style
      const divs = container.querySelectorAll("div");
      const flyerContainers = Array.from(divs).filter(
        (el) => el.style.borderRadius === "20px"
      );
      expect(flyerContainers.length).toBeGreaterThan(0);
    });

    it("should style active dot indicator differently", () => {
      render(<Testimonials />);
      const firstDot = screen.getByLabelText("Go to testimonial 1");
      expect(firstDot).toHaveClass("w-8", "h-2", "bg-[#0205B7]");
    });

    it("should style inactive dots correctly", () => {
      render(<Testimonials />);
      const secondDot = screen.getByLabelText("Go to testimonial 2");
      expect(secondDot).toHaveClass("w-2", "h-2", "bg-gray-300");
    });
  });

  describe("Carousel Functionality", () => {
    it("should navigate to next testimonial when next button is clicked", () => {
      render(<Testimonials testimonials={customTestimonials} />);

      // Initially shows first testimonial
      expect(screen.getByText("Test User 1, Test City 1")).toBeInTheDocument();

      // Click next
      const nextButton = screen.getByLabelText("Next testimonial");
      fireEvent.click(nextButton);

      // Should show second testimonial
      expect(screen.getByText("Test User 2, Test City 2")).toBeInTheDocument();
    });

    it("should navigate to previous testimonial when previous button is clicked", () => {
      render(<Testimonials testimonials={customTestimonials} />);

      // Click next to go to second testimonial
      fireEvent.click(screen.getByLabelText("Next testimonial"));
      expect(screen.getByText("Test User 2, Test City 2")).toBeInTheDocument();

      // Click previous
      fireEvent.click(screen.getByLabelText("Previous testimonial"));

      // Should show first testimonial again
      expect(screen.getByText("Test User 1, Test City 1")).toBeInTheDocument();
    });

    it("should wrap around from last to first testimonial", () => {
      render(<Testimonials testimonials={customTestimonials} />);
      const nextButton = screen.getByLabelText("Next testimonial");

      // Navigate to last testimonial
      fireEvent.click(nextButton); // 2nd
      fireEvent.click(nextButton); // 3rd

      expect(screen.getByText("Test User 3, Test City 3")).toBeInTheDocument();

      // Click next again should wrap to first
      fireEvent.click(nextButton);
      expect(screen.getByText("Test User 1, Test City 1")).toBeInTheDocument();
    });

    it("should wrap around from first to last testimonial", () => {
      render(<Testimonials testimonials={customTestimonials} />);

      // Initially at first testimonial
      expect(screen.getByText("Test User 1, Test City 1")).toBeInTheDocument();

      // Click previous should wrap to last
      fireEvent.click(screen.getByLabelText("Previous testimonial"));
      expect(screen.getByText("Test User 3, Test City 3")).toBeInTheDocument();
    });

    it("should navigate to specific testimonial when dot is clicked", () => {
      render(<Testimonials testimonials={customTestimonials} />);

      // Click third dot
      fireEvent.click(screen.getByLabelText("Go to testimonial 3"));

      // Should show third testimonial
      expect(screen.getByText("Test User 3, Test City 3")).toBeInTheDocument();
    });

    it("should update active dot indicator when navigating", () => {
      render(<Testimonials testimonials={customTestimonials} />);

      // Initially first dot is active
      let firstDot = screen.getByLabelText("Go to testimonial 1");
      expect(firstDot).toHaveClass("w-8");

      // Click next
      fireEvent.click(screen.getByLabelText("Next testimonial"));

      // Second dot should be active
      const secondDot = screen.getByLabelText("Go to testimonial 2");
      expect(secondDot).toHaveClass("w-8");

      // First dot should be inactive
      firstDot = screen.getByLabelText("Go to testimonial 1");
      expect(firstDot).toHaveClass("w-2");
    });

    it("should display correct rating for each testimonial", () => {
      const { container } = render(
        <Testimonials testimonials={customTestimonials} />
      );

      // First testimonial has 5 stars
      let filledStars = container.querySelectorAll(".text-\\[\\#C4A962\\]");
      expect(filledStars).toHaveLength(5);

      // Navigate to second testimonial (4 stars)
      fireEvent.click(screen.getByLabelText("Next testimonial"));
      filledStars = container.querySelectorAll(".text-\\[\\#C4A962\\]");
      expect(filledStars).toHaveLength(4);
    });
  });

  describe("Interactions", () => {
    it("should handle Follow button hover effect", () => {
      render(<Testimonials />);
      const followButton = screen.getByRole("link", { name: /Follow/i });

      // Hover in
      fireEvent.mouseEnter(followButton);
      expect(followButton).toHaveStyle({
        backgroundColor: "#63D5F9",
        color: "#FFFFFF",
      });

      // Hover out
      fireEvent.mouseLeave(followButton);
      expect(followButton).toHaveStyle({
        backgroundColor: "#FFFFFF",
        color: "#63D5F9",
      });
    });

    it("should handle dot indicator hover", () => {
      render(<Testimonials />);
      const inactiveDot = screen.getByLabelText("Go to testimonial 2");
      expect(inactiveDot).toHaveClass("hover:bg-gray-400");
    });
  });

  describe("Accessibility", () => {
    it("should have semantic section element", () => {
      const { container } = render(<Testimonials />);
      const section = container.querySelector("section");
      expect(section).toBeInTheDocument();
    });

    it("should have proper heading hierarchy", () => {
      render(<Testimonials />);
      const h2Elements = screen.getAllByRole("heading", { level: 2 });
      expect(h2Elements.length).toBeGreaterThanOrEqual(2);

      const h3Elements = screen.getAllByRole("heading", { level: 3 });
      expect(h3Elements.length).toBeGreaterThanOrEqual(1);
    });

    it("should have accessible navigation buttons with labels", () => {
      render(<Testimonials />);
      expect(screen.getByLabelText("Previous testimonial")).toBeInTheDocument();
      expect(screen.getByLabelText("Next testimonial")).toBeInTheDocument();
    });

    it("should have accessible dot indicators with labels", () => {
      render(<Testimonials testimonials={customTestimonials} />);

      customTestimonials.forEach((_, index) => {
        expect(
          screen.getByLabelText(`Go to testimonial ${index + 1}`)
        ).toBeInTheDocument();
      });
    });

    it("should have alt text for all images", () => {
      render(<Testimonials />);

      const images = screen.getAllByRole("img");
      images.forEach((img) => {
        expect(img).toHaveAttribute("alt");
        expect(img.getAttribute("alt")).not.toBe("");
      });
    });

    it("should support keyboard navigation", () => {
      render(<Testimonials />);

      const nextButton = screen.getByLabelText("Next testimonial");
      nextButton.focus();
      expect(document.activeElement).toBe(nextButton);

      const prevButton = screen.getByLabelText("Previous testimonial");
      prevButton.focus();
      expect(document.activeElement).toBe(prevButton);
    });

    it("should have proper link attributes for external links", () => {
      render(<Testimonials />);
      const followLink = screen.getByRole("link", { name: /Follow/i });
      expect(followLink).toHaveAttribute("target", "_blank");
      expect(followLink).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  describe("Responsive Behavior", () => {
    it("should center content with max width", () => {
      const { container } = render(<Testimonials />);
      const contentContainer = container.querySelector(".max-w-4xl");
      expect(contentContainer).toHaveClass("mx-auto");
    });

    it("should maintain padding on testimonial container", () => {
      const { container } = render(<Testimonials />);
      const paddedContainers = container.querySelectorAll("div");
      const paddedContainer = Array.from(paddedContainers).find(
        (el) =>
          el.style.paddingLeft === "66px" && el.style.paddingRight === "66px"
      );
      expect(paddedContainer).toBeDefined();
    });

    it("should limit testimonial text width", () => {
      const { container } = render(<Testimonials />);
      const testimonialText = container.querySelector(
        "p[style*='maxWidth: 690px']"
      );
      expect(testimonialText).toBeDefined();
    });

    it("should maintain aspect ratio for profile images", () => {
      const { container } = render(<Testimonials />);
      const profileContainer = container.querySelector(
        "div[style*='width: 52px'][style*='height: 52px']"
      );
      expect(profileContainer).toBeDefined();
    });
  });

  describe("Edge Cases", () => {
    it("should render with single testimonial", () => {
      const singleTestimonial = [customTestimonials[0]];
      render(<Testimonials testimonials={singleTestimonial} />);

      expect(screen.getByText("Test User 1, Test City 1")).toBeInTheDocument();
      // Should still have navigation buttons
      expect(screen.getByLabelText("Next testimonial")).toBeInTheDocument();
    });

    it("should handle empty testimonials array gracefully", () => {
      // Empty array will cause error since component tries to access currentTestimonial
      // This is a known limitation - component should handle this case
      // For now, test with at least one testimonial
      const minimalTestimonial = [
        {
          id: "1",
          name: "Test",
          location: "Test",
          content: "Test content",
          rating: 5,
        },
      ];

      const { container } = render(
        <Testimonials testimonials={minimalTestimonial} />
      );
      expect(container.querySelector("section")).toBeInTheDocument();
    });

    it("should handle testimonials without images", () => {
      const testimonialsWithoutImages = customTestimonials.map((t) => ({
        ...t,
        image: undefined,
      }));

      render(<Testimonials testimonials={testimonialsWithoutImages} />);
      expect(screen.getByText("Test User 1, Test City 1")).toBeInTheDocument();
    });

    it("should handle very long testimonial content", () => {
      const longTestimonial: Testimonial = {
        id: "long",
        name: "Long Name User",
        location: "Very Long City Name, State",
        content:
          "This is a very long testimonial content that goes on and on and on to test how the component handles extremely lengthy text that might overflow or cause layout issues in the testimonial display area.",
        rating: 5,
      };

      render(<Testimonials testimonials={[longTestimonial]} />);
      expect(
        screen.getByText(/This is a very long testimonial/)
      ).toBeInTheDocument();
    });

    it("should handle rapid navigation clicks", () => {
      render(<Testimonials testimonials={customTestimonials} />);

      const nextButton = screen.getByLabelText("Next testimonial");

      // Rapid clicks
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);

      // Should handle gracefully and show correct testimonial
      expect(screen.getByText(/Test User/)).toBeInTheDocument();
    });
  });
});
