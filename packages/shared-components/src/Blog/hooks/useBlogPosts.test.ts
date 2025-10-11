/**
 * useBlogPosts Hook Tests
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useBlogPosts } from "./useBlogPosts";
import { BlogService } from "@reiki-goddess/shared-utils";
import type { BlogPost } from "../types";

vi.mock("@reiki-goddess/shared-utils", () => ({
  BlogService: {
    getPosts: vi.fn(),
  },
}));

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
];

describe("useBlogPosts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Initial Load", () => {
    it("starts with loading state", () => {
      vi.mocked(BlogService.getPosts).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      const { result } = renderHook(() => useBlogPosts());

      expect(result.current.loading).toBe(true);
      expect(result.current.posts).toEqual([]);
      expect(result.current.error).toBeNull();
    });

    it("fetches posts successfully", async () => {
      vi.mocked(BlogService.getPosts).mockResolvedValue(mockPosts);

      const { result } = renderHook(() => useBlogPosts());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.posts).toEqual(mockPosts);
      expect(result.current.error).toBeNull();
    });

    it("handles fetch errors", async () => {
      const error = new Error("Failed to fetch");
      vi.mocked(BlogService.getPosts).mockRejectedValue(error);

      const { result } = renderHook(() => useBlogPosts());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toEqual(error);
      expect(result.current.posts).toEqual([]);
    });
  });

  describe("Filtering", () => {
    it("passes filters to BlogService", async () => {
      vi.mocked(BlogService.getPosts).mockResolvedValue(mockPosts);

      const filters = { category: "healing" as const };
      renderHook(() => useBlogPosts(filters));

      await waitFor(() => {
        expect(BlogService.getPosts).toHaveBeenCalledWith(filters);
      });
    });

    it("refetches when filters change", async () => {
      vi.mocked(BlogService.getPosts).mockResolvedValue(mockPosts);

      const { rerender } = renderHook(({ filters }) => useBlogPosts(filters), {
        initialProps: { filters: { category: "healing" as const } },
      });

      await waitFor(() => {
        expect(BlogService.getPosts).toHaveBeenCalledTimes(1);
      });

      rerender({ filters: { category: "wellness" as const } });

      await waitFor(() => {
        expect(BlogService.getPosts).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe("Refresh Function", () => {
    it("provides refresh function", async () => {
      vi.mocked(BlogService.getPosts).mockResolvedValue(mockPosts);

      const { result } = renderHook(() => useBlogPosts());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(typeof result.current.refresh).toBe("function");
    });

    it("refetches posts when refresh is called", async () => {
      vi.mocked(BlogService.getPosts).mockResolvedValue(mockPosts);

      const { result } = renderHook(() => useBlogPosts());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(BlogService.getPosts).toHaveBeenCalledTimes(1);

      await result.current.refresh();

      expect(BlogService.getPosts).toHaveBeenCalledTimes(2);
    });
  });

  describe("Error Handling", () => {
    it("handles non-Error objects", async () => {
      vi.mocked(BlogService.getPosts).mockRejectedValue("String error");

      const { result } = renderHook(() => useBlogPosts());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe("Failed to fetch blog posts");
    });
  });
});
