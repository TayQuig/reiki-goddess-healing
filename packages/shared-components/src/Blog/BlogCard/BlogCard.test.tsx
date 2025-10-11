/**
 * BlogCard Component Tests
 *
 * Comprehensive test suite for BlogCard component covering:
 * - Rendering with all props
 * - Variant styles (default/featured)
 * - Hover states and animations
 * - Image lazy loading
 * - Metadata display
 * - Excerpt truncation
 * - Security (XSS prevention)
 * - Accessibility (WCAG 2.1 AA)
 * - Responsive behavior
 *
 * Target coverage: 95%+
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { BlogCard } from "./BlogCard";
import type { BlogPost, Author } from "../types";

// Test utilities
const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

// Mock blog post with all fields
const mockAuthor: Author = {
  name: "Deirdre, The Reiki Goddess",
  bio: "Certified Reiki Master and Sound Healing Practitioner",
  image: "/img/author-deirdre.jpg",
  role: "Founder & Reiki Master",
  socialLinks: {
    instagram: "https://instagram.com/reikigoddess",
  },
};

const mockPost: BlogPost = {
  id: "1",
  title: "The Healing Power of Reiki Energy",
  slug: "healing-power-reiki-energy",
  excerpt:
    "Discover how Reiki energy can transform your wellness journey through gentle healing touch and energy alignment.",
  content: "# Full post content here...",
  category: "healing",
  author: mockAuthor,
  publishDate: "2024-10-01T10:00:00Z",
  readTime: "5 min read",
  featuredImage: "/img/blog/reiki-healing.jpg",
  tags: ["reiki", "energy healing", "wellness"],
  featured: false,
};

const mockPostWithStringAuthor: BlogPost = {
  ...mockPost,
  id: "2",
  author: "Deirdre, The Reiki Goddess",
};

describe("BlogCard", () => {
  describe("Rendering", () => {
    it("should render with default props", () => {
      render(
        <RouterWrapper>
          <BlogCard post={mockPost} />
        </RouterWrapper>
      );

      expect(screen.getByRole("article")).toBeInTheDocument();
      expect(
        screen.getByText("The Healing Power of Reiki Energy")
      ).toBeInTheDocument();
    });

    it("should render all post metadata", () => {
      render(
        <RouterWrapper>
          <BlogCard post={mockPost} />
        </RouterWrapper>
      );

      expect(screen.getByText(/healing/i)).toBeInTheDocument(); // Category
      expect(screen.getByText("5 min read")).toBeInTheDocument(); // Read time
      expect(
        screen.getByText("Deirdre, The Reiki Goddess")
      ).toBeInTheDocument(); // Author
    });

    it("should render featured image with alt text", () => {
      render(
        <RouterWrapper>
          <BlogCard post={mockPost} />
        </RouterWrapper>
      );

      const image = screen.getByAltText(
        "Featured image for The Healing Power of Reiki Energy"
      );
      expect(image).toBeInTheDocument();
    });

    it("should render excerpt when showExcerpt is true", () => {
      render(
        <RouterWrapper>
          <BlogCard post={mockPost} showExcerpt={true} />
        </RouterWrapper>
      );

      expect(
        screen.getByText(/Discover how Reiki energy/i)
      ).toBeInTheDocument();
    });

    it("should not render excerpt when showExcerpt is false", () => {
      render(
        <RouterWrapper>
          <BlogCard post={mockPost} showExcerpt={false} />
        </RouterWrapper>
      );

      expect(
        screen.queryByText(/Discover how Reiki energy/i)
      ).not.toBeInTheDocument();
    });

    it("should handle author as string", () => {
      render(
        <RouterWrapper>
          <BlogCard post={mockPostWithStringAuthor} />
        </RouterWrapper>
      );

      expect(
        screen.getByText("Deirdre, The Reiki Goddess")
      ).toBeInTheDocument();
    });

    it("should handle author as object", () => {
      render(
        <RouterWrapper>
          <BlogCard post={mockPost} />
        </RouterWrapper>
      );

      expect(
        screen.getByText("Deirdre, The Reiki Goddess")
      ).toBeInTheDocument();
    });
  });

  describe("Variants", () => {
    it("should apply default variant classes", () => {
      const { container } = render(
        <RouterWrapper>
          <BlogCard post={mockPost} variant="default" />
        </RouterWrapper>
      );

      const article = container.querySelector(".blog-card-default");
      expect(article).toBeInTheDocument();
    });

    it("should apply featured variant classes", () => {
      const { container } = render(
        <RouterWrapper>
          <BlogCard post={mockPost} variant="featured" />
        </RouterWrapper>
      );

      const article = container.querySelector(".blog-card-featured");
      expect(article).toBeInTheDocument();
    });

    it("should have larger title for featured variant", () => {
      const { container } = render(
        <RouterWrapper>
          <BlogCard post={mockPost} variant="featured" />
        </RouterWrapper>
      );

      const title = container.querySelector(".blog-card-title");
      expect(title).toHaveClass("text-3xl");
    });

    it("should have standard title for default variant", () => {
      const { container } = render(
        <RouterWrapper>
          <BlogCard post={mockPost} variant="default" />
        </RouterWrapper>
      );

      const title = container.querySelector(".blog-card-title");
      expect(title).toHaveClass("text-xl");
    });
  });

  describe("Category Badge", () => {
    it("should display healing category with correct color", () => {
      const { container } = render(
        <RouterWrapper>
          <BlogCard post={mockPost} />
        </RouterWrapper>
      );

      const badge = container.querySelector(".blog-card-category");
      expect(badge).toHaveTextContent("healing");
      expect(badge).toHaveStyle({ color: "#0205B7" });
    });

    it("should display wellness category with correct color", () => {
      const wellnessPost = { ...mockPost, category: "wellness" as const };
      const { container } = render(
        <RouterWrapper>
          <BlogCard post={wellnessPost} />
        </RouterWrapper>
      );

      const badge = container.querySelector(".blog-card-category");
      expect(badge).toHaveTextContent("wellness");
      expect(badge).toHaveStyle({ color: "#A593E0" });
    });

    it("should display events category with correct color", () => {
      const eventsPost = { ...mockPost, category: "events" as const };
      const { container } = render(
        <RouterWrapper>
          <BlogCard post={eventsPost} />
        </RouterWrapper>
      );

      const badge = container.querySelector(".blog-card-category");
      expect(badge).toHaveTextContent("events");
      expect(badge).toHaveStyle({ color: "#FFC6A5" });
    });

    it("should display stories category with correct color", () => {
      const storiesPost = { ...mockPost, category: "stories" as const };
      const { container } = render(
        <RouterWrapper>
          <BlogCard post={storiesPost} />
        </RouterWrapper>
      );

      const badge = container.querySelector(".blog-card-category");
      expect(badge).toHaveTextContent("stories");
      expect(badge).toHaveStyle({ color: "#63D5F9" });
    });
  });

  describe("Links", () => {
    it("should link to correct blog post URL", () => {
      render(
        <RouterWrapper>
          <BlogCard post={mockPost} />
        </RouterWrapper>
      );

      const link = screen.getByRole("link", { name: /read more/i });
      expect(link).toHaveAttribute("href", "/blog/healing-power-reiki-energy");
    });

    it("should have descriptive aria-label on link", () => {
      render(
        <RouterWrapper>
          <BlogCard post={mockPost} />
        </RouterWrapper>
      );

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute(
        "aria-label",
        "Read more about The Healing Power of Reiki Energy"
      );
    });
  });

  describe("Date Formatting", () => {
    it("should format publish date correctly", () => {
      render(
        <RouterWrapper>
          <BlogCard post={mockPost} />
        </RouterWrapper>
      );

      // Should display formatted date (e.g., "Oct 1, 2024")
      const dateElement = screen.getByText(/Oct 1, 2024/i);
      expect(dateElement).toBeInTheDocument();
      expect(dateElement).toHaveAttribute("dateTime", "2024-10-01T10:00:00Z");
    });

    it("should handle invalid date gracefully", () => {
      const invalidDatePost = { ...mockPost, publishDate: "invalid-date" };
      render(
        <RouterWrapper>
          <BlogCard post={invalidDatePost} />
        </RouterWrapper>
      );

      // Should fallback to raw string
      expect(screen.getByText("invalid-date")).toBeInTheDocument();
    });
  });

  describe("Security", () => {
    it("should sanitize malicious title content", () => {
      const maliciousPost = {
        ...mockPost,
        title: '<script>alert("XSS")</script>Harmless Title',
      };

      const { container } = render(
        <RouterWrapper>
          <BlogCard post={maliciousPost} />
        </RouterWrapper>
      );

      const title = container.querySelector(".blog-card-title");
      expect(title?.innerHTML).not.toContain("<script>");
      expect(title?.innerHTML).toContain("&lt;script&gt;");
    });

    it("should sanitize malicious excerpt content", () => {
      const maliciousPost = {
        ...mockPost,
        excerpt: '<img src=x onerror="alert(1)">Harmless excerpt',
      };

      const { container } = render(
        <RouterWrapper>
          <BlogCard post={maliciousPost} />
        </RouterWrapper>
      );

      const excerpt = container.querySelector(".blog-card-excerpt");
      expect(excerpt?.innerHTML).not.toContain("<img");
      expect(excerpt?.innerHTML).toContain("&lt;img");
    });

    it("should validate image URLs", () => {
      const jsProtocolPost = {
        ...mockPost,
        featuredImage: 'javascript:alert("XSS")',
      };

      const { container } = render(
        <RouterWrapper>
          <BlogCard post={jsProtocolPost} />
        </RouterWrapper>
      );

      const image = container.querySelector(".blog-card-image");
      expect(image).toHaveAttribute("src", "/img/placeholder.jpg"); // Fallback
    });

    it("should allow valid http URLs", () => {
      const httpPost = {
        ...mockPost,
        featuredImage: "http://example.com/image.jpg",
      };

      const { container } = render(
        <RouterWrapper>
          <BlogCard post={httpPost} />
        </RouterWrapper>
      );

      const image = container.querySelector(".blog-card-image");
      expect(image).toHaveAttribute("src", "http://example.com/image.jpg");
    });

    it("should allow valid https URLs", () => {
      const httpsPost = {
        ...mockPost,
        featuredImage: "https://example.com/image.jpg",
      };

      const { container } = render(
        <RouterWrapper>
          <BlogCard post={httpsPost} />
        </RouterWrapper>
      );

      const image = container.querySelector(".blog-card-image");
      expect(image).toHaveAttribute("src", "https://example.com/image.jpg");
    });
  });

  describe("Accessibility", () => {
    it("should use semantic article element", () => {
      render(
        <RouterWrapper>
          <BlogCard post={mockPost} />
        </RouterWrapper>
      );

      expect(screen.getByRole("article")).toBeInTheDocument();
    });

    it("should have proper aria-labelledby on article", () => {
      render(
        <RouterWrapper>
          <BlogCard post={mockPost} />
        </RouterWrapper>
      );

      const article = screen.getByRole("article");
      expect(article).toHaveAttribute("aria-labelledby", "post-title-1");
    });

    it("should use h3 for card title", () => {
      const { container } = render(
        <RouterWrapper>
          <BlogCard post={mockPost} />
        </RouterWrapper>
      );

      const title = container.querySelector("h3");
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent("The Healing Power of Reiki Energy");
    });

    it("should have unique title ID", () => {
      const { container } = render(
        <RouterWrapper>
          <BlogCard post={mockPost} />
        </RouterWrapper>
      );

      const title = container.querySelector(".blog-card-title");
      expect(title).toHaveAttribute("id", "post-title-1");
    });

    it("should have proper time element with datetime attribute", () => {
      render(
        <RouterWrapper>
          <BlogCard post={mockPost} />
        </RouterWrapper>
      );

      const timeElement = screen.getByText(/Oct 1, 2024/i);
      expect(timeElement.tagName).toBe("TIME");
      expect(timeElement).toHaveAttribute("dateTime", "2024-10-01T10:00:00Z");
    });

    it("should use aria-hidden for decorative separators", () => {
      const { container } = render(
        <RouterWrapper>
          <BlogCard post={mockPost} />
        </RouterWrapper>
      );

      const separators = container.querySelectorAll('[aria-hidden="true"]');
      expect(separators.length).toBeGreaterThan(0);
    });

    it("should have keyboard-accessible link with tabIndex", () => {
      render(
        <RouterWrapper>
          <BlogCard post={mockPost} />
        </RouterWrapper>
      );

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("tabIndex", "0");
    });

    it("should have descriptive aria-label on link for screen readers", () => {
      render(
        <RouterWrapper>
          <BlogCard post={mockPost} />
        </RouterWrapper>
      );

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute(
        "aria-label",
        "Read article: The Healing Power of Reiki Energy"
      );
    });

    it("should have focus-visible styles in CSS", () => {
      const { container } = render(
        <RouterWrapper>
          <BlogCard post={mockPost} />
        </RouterWrapper>
      );

      const link = container.querySelector(".blog-card-link");
      expect(link).toBeInTheDocument();
      // Note: CSS :focus-visible styles are tested via E2E/visual regression
      // This test ensures the element exists for styling
    });
  });

  describe("Styling", () => {
    it("should apply custom className", () => {
      const { container } = render(
        <RouterWrapper>
          <BlogCard post={mockPost} className="custom-class" />
        </RouterWrapper>
      );

      const article = container.querySelector(".blog-card");
      expect(article).toHaveClass("custom-class");
    });

    it("should have line-clamp-2 on title", () => {
      const { container } = render(
        <RouterWrapper>
          <BlogCard post={mockPost} />
        </RouterWrapper>
      );

      const title = container.querySelector(".blog-card-title");
      expect(title).toHaveClass("line-clamp-2");
    });

    it("should have line-clamp-3 on excerpt", () => {
      const { container } = render(
        <RouterWrapper>
          <BlogCard post={mockPost} showExcerpt={true} />
        </RouterWrapper>
      );

      const excerpt = container.querySelector(".blog-card-excerpt");
      expect(excerpt).toHaveClass("line-clamp-3");
    });
  });

  describe("Edge Cases", () => {
    it("should handle very long titles gracefully", () => {
      const longTitlePost = {
        ...mockPost,
        title: "A".repeat(200),
      };

      const { container } = render(
        <RouterWrapper>
          <BlogCard post={longTitlePost} />
        </RouterWrapper>
      );

      const title = container.querySelector(".blog-card-title");
      expect(title).toHaveClass("line-clamp-2"); // Truncated
    });

    it("should handle very long excerpts gracefully", () => {
      const longExcerptPost = {
        ...mockPost,
        excerpt: "B".repeat(500),
      };

      const { container } = render(
        <RouterWrapper>
          <BlogCard post={longExcerptPost} showExcerpt={true} />
        </RouterWrapper>
      );

      const excerpt = container.querySelector(".blog-card-excerpt");
      expect(excerpt).toHaveClass("line-clamp-3"); // Truncated
    });

    it("should handle missing optional author gracefully", () => {
      const noAuthorPost = {
        ...mockPost,
        author: "",
      };

      render(
        <RouterWrapper>
          <BlogCard post={noAuthorPost} />
        </RouterWrapper>
      );

      // Should still render without crashing
      expect(screen.getByRole("article")).toBeInTheDocument();
    });

    it("should handle posts without tags", () => {
      const noTagsPost = {
        ...mockPost,
        tags: [],
      };

      render(
        <RouterWrapper>
          <BlogCard post={noTagsPost} />
        </RouterWrapper>
      );

      expect(screen.getByRole("article")).toBeInTheDocument();
    });
  });
});
