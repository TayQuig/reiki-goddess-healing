/**
 * BlogGrid Component Tests
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { BlogGrid } from "./BlogGrid";
import type { BlogPost } from "../types";

const mockPosts: BlogPost[] = [
  {
    id: "1",
    title: "Test Post 1",
    slug: "test-post-1",
    excerpt: "Excerpt 1",
    content: "Content 1",
    category: "healing",
    author: "Test Author",
    publishDate: "2025-10-01",
    readTime: "5 min read",
    featuredImage: "/test1.jpg",
    tags: ["test"],
  },
  {
    id: "2",
    title: "Test Post 2",
    slug: "test-post-2",
    excerpt: "Excerpt 2",
    content: "Content 2",
    category: "wellness",
    author: "Test Author",
    publishDate: "2025-10-02",
    readTime: "3 min read",
    featuredImage: "/test2.jpg",
    tags: ["test"],
  },
];

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("BlogGrid", () => {
  describe("Loading State", () => {
    it("displays loading spinner when loading", () => {
      renderWithRouter(<BlogGrid posts={[]} loading={true} />);

      expect(screen.getByRole("status")).toBeInTheDocument();
      expect(screen.getByText(/Loading blog posts/)).toBeInTheDocument();
    });

    it("has proper aria-live region for loading", () => {
      renderWithRouter(<BlogGrid posts={[]} loading={true} />);

      const status = screen.getByRole("status");
      expect(status).toHaveAttribute("aria-live", "polite");
    });
  });

  describe("Error State", () => {
    it("displays error message when error exists", () => {
      const error = new Error("Failed to fetch posts");
      renderWithRouter(<BlogGrid posts={[]} error={error} />);

      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByText(/Error loading blog posts/)).toBeInTheDocument();
      expect(screen.getByText(/Failed to fetch posts/)).toBeInTheDocument();
    });

    it("has proper aria-live region for errors", () => {
      const error = new Error("Test error");
      renderWithRouter(<BlogGrid posts={[]} error={error} />);

      const alert = screen.getByRole("alert");
      expect(alert).toHaveAttribute("aria-live", "assertive");
    });
  });

  describe("Empty State", () => {
    it("displays default empty message when no posts", () => {
      renderWithRouter(<BlogGrid posts={[]} />);

      expect(screen.getByText("No blog posts found.")).toBeInTheDocument();
    });

    it("displays custom empty message", () => {
      renderWithRouter(
        <BlogGrid posts={[]} emptyMessage="Custom empty message" />
      );

      expect(screen.getByText("Custom empty message")).toBeInTheDocument();
    });
  });

  describe("Grid Display", () => {
    it("renders blog posts in grid", () => {
      renderWithRouter(<BlogGrid posts={mockPosts} />);

      expect(screen.getByText("Test Post 1")).toBeInTheDocument();
      expect(screen.getByText("Test Post 2")).toBeInTheDocument();
    });

    it("has proper grid id and aria-label", () => {
      const { container } = renderWithRouter(<BlogGrid posts={mockPosts} />);

      const grid = container.querySelector("#blog-posts-grid");
      expect(grid).toBeInTheDocument();
      expect(grid).toHaveAttribute("aria-label", "Blog posts");
    });

    it("applies responsive grid classes", () => {
      const { container } = renderWithRouter(<BlogGrid posts={mockPosts} />);

      const grid = container.querySelector("#blog-posts-grid");
      expect(grid).toHaveClass("grid");
      expect(grid).toHaveClass("grid-cols-1");
      expect(grid).toHaveClass("md:grid-cols-2");
      expect(grid).toHaveClass("lg:grid-cols-3");
    });

    it("applies custom className to container", () => {
      const { container } = renderWithRouter(
        <BlogGrid posts={mockPosts} className="custom-class" />
      );

      // Custom className is applied to the outer container, not the grid
      const outerContainer = container.querySelector(".custom-class");
      expect(outerContainer).toBeInTheDocument();
    });
  });

  describe("State Priority", () => {
    it("shows loading state over error state", () => {
      const error = new Error("Test error");
      renderWithRouter(<BlogGrid posts={[]} loading={true} error={error} />);

      expect(screen.getByText(/Loading blog posts/)).toBeInTheDocument();
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    it("shows error state over empty state", () => {
      const error = new Error("Test error");
      renderWithRouter(<BlogGrid posts={[]} error={error} />);

      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(
        screen.queryByText("No blog posts found.")
      ).not.toBeInTheDocument();
    });
  });
});
