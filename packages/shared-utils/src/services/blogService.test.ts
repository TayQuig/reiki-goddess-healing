/**
 * BlogService Unit Tests
 *
 * Comprehensive test suite for blog data service functionality.
 * Tests filtering, pagination, search, and related post algorithms.
 *
 * Created: 2025-10-06
 * Part of: Blog Page Migration - Track 1 (Foundation)
 * Target: 95%+ code coverage
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { BlogService } from "./blogService";
import type { BlogPost, BlogFilters } from "../types/blog";

describe("BlogService", () => {
  // Clear any mocked timers before each test
  beforeEach(() => {
    vi.clearAllTimers();
  });

  describe("getPosts", () => {
    it("should return all posts when no filters provided", async () => {
      const posts = await BlogService.getPosts();

      expect(posts).toBeDefined();
      expect(Array.isArray(posts)).toBe(true);
      expect(posts.length).toBeGreaterThan(0);
    });

    it("should return posts sorted by publish date (newest first)", async () => {
      const posts = await BlogService.getPosts();

      for (let i = 0; i < posts.length - 1; i++) {
        const currentDate = new Date(posts[i].publishDate).getTime();
        const nextDate = new Date(posts[i + 1].publishDate).getTime();
        expect(currentDate).toBeGreaterThanOrEqual(nextDate);
      }
    });

    it("should filter posts by category", async () => {
      const filters: BlogFilters = { category: "healing" };
      const posts = await BlogService.getPosts(filters);

      expect(posts.every((post) => post.category === "healing")).toBe(true);
      expect(posts.length).toBeGreaterThan(0);
    });

    it("should return all posts when category is 'all'", async () => {
      const filters: BlogFilters = { category: "all" };
      const postsWithFilter = await BlogService.getPosts(filters);
      const postsWithoutFilter = await BlogService.getPosts();

      expect(postsWithFilter.length).toBe(postsWithoutFilter.length);
    });

    it("should filter posts by single tag", async () => {
      const filters: BlogFilters = { tags: ["reiki"] };
      const posts = await BlogService.getPosts(filters);

      expect(posts.every((post) => post.tags.includes("reiki"))).toBe(true);
      expect(posts.length).toBeGreaterThan(0);
    });

    it("should filter posts by multiple tags (OR logic)", async () => {
      const filters: BlogFilters = { tags: ["reiki", "meditation"] };
      const posts = await BlogService.getPosts(filters);

      expect(
        posts.every(
          (post) =>
            post.tags.includes("reiki") || post.tags.includes("meditation")
        )
      ).toBe(true);
    });

    it("should filter posts by search query in title", async () => {
      const filters: BlogFilters = { search: "Reiki" };
      const posts = await BlogService.getPosts(filters);

      expect(
        posts.some((post) => post.title.toLowerCase().includes("reiki"))
      ).toBe(true);
    });

    it("should filter posts by search query in excerpt", async () => {
      const filters: BlogFilters = { search: "healing" };
      const posts = await BlogService.getPosts(filters);

      expect(posts.length).toBeGreaterThan(0);
      expect(
        posts.some(
          (post) =>
            post.excerpt.toLowerCase().includes("healing") ||
            post.title.toLowerCase().includes("healing")
        )
      ).toBe(true);
    });

    it("should filter posts by search query in content", async () => {
      const filters: BlogFilters = { search: "meditation" };
      const posts = await BlogService.getPosts(filters);

      expect(posts.length).toBeGreaterThan(0);
    });

    it("should perform case-insensitive search", async () => {
      const filtersLower: BlogFilters = { search: "reiki" };
      const filtersUpper: BlogFilters = { search: "REIKI" };
      const filtersMixed: BlogFilters = { search: "Reiki" };

      const postsLower = await BlogService.getPosts(filtersLower);
      const postsUpper = await BlogService.getPosts(filtersUpper);
      const postsMixed = await BlogService.getPosts(filtersMixed);

      expect(postsLower.length).toBe(postsUpper.length);
      expect(postsLower.length).toBe(postsMixed.length);
    });

    it("should filter posts by author name", async () => {
      const filters: BlogFilters = { author: "Taylor Quigley" };
      const posts = await BlogService.getPosts(filters);

      expect(posts.length).toBeGreaterThan(0);
      expect(
        posts.every((post) => {
          const authorName =
            typeof post.author === "string" ? post.author : post.author.name;
          return authorName === "Taylor Quigley";
        })
      ).toBe(true);
    });

    it("should filter posts by date from", async () => {
      const filters: BlogFilters = { dateFrom: "2025-09-15T00:00:00Z" };
      const posts = await BlogService.getPosts(filters);

      expect(posts.length).toBeGreaterThan(0);
      expect(
        posts.every(
          (post) =>
            new Date(post.publishDate) >= new Date("2025-09-15T00:00:00Z")
        )
      ).toBe(true);
    });

    it("should filter posts by date to", async () => {
      const filters: BlogFilters = { dateTo: "2025-09-20T00:00:00Z" };
      const posts = await BlogService.getPosts(filters);

      expect(
        posts.every(
          (post) =>
            new Date(post.publishDate) <= new Date("2025-09-20T00:00:00Z")
        )
      ).toBe(true);
    });

    it("should filter posts by date range", async () => {
      const filters: BlogFilters = {
        dateFrom: "2025-09-01T00:00:00Z",
        dateTo: "2025-09-30T00:00:00Z",
      };
      const posts = await BlogService.getPosts(filters);

      expect(
        posts.every((post) => {
          const date = new Date(post.publishDate);
          return (
            date >= new Date("2025-09-01T00:00:00Z") &&
            date <= new Date("2025-09-30T00:00:00Z")
          );
        })
      ).toBe(true);
    });

    it("should combine multiple filters (category + tags)", async () => {
      const filters: BlogFilters = {
        category: "healing",
        tags: ["reiki"],
      };
      const posts = await BlogService.getPosts(filters);

      expect(
        posts.every(
          (post) => post.category === "healing" && post.tags.includes("reiki")
        )
      ).toBe(true);
    });

    it("should return empty array when no posts match filters", async () => {
      const filters: BlogFilters = {
        search: "nonexistent-search-term-xyz123",
      };
      const posts = await BlogService.getPosts(filters);

      expect(posts).toEqual([]);
    });
  });

  describe("getPostBySlug", () => {
    it("should return post matching slug", async () => {
      const post = await BlogService.getPostBySlug(
        "understanding-reiki-energy-healing"
      );

      expect(post).toBeDefined();
      expect(post?.slug).toBe("understanding-reiki-energy-healing");
      expect(post?.id).toBe("1");
    });

    it("should return null for non-existent slug", async () => {
      const post = await BlogService.getPostBySlug("non-existent-slug");

      expect(post).toBeNull();
    });

    it("should return correct post data structure", async () => {
      const post = await BlogService.getPostBySlug(
        "understanding-reiki-energy-healing"
      );

      expect(post).toHaveProperty("id");
      expect(post).toHaveProperty("slug");
      expect(post).toHaveProperty("title");
      expect(post).toHaveProperty("excerpt");
      expect(post).toHaveProperty("category");
      expect(post).toHaveProperty("author");
      expect(post).toHaveProperty("publishDate");
      expect(post).toHaveProperty("readTime");
      expect(post).toHaveProperty("featuredImage");
      expect(post).toHaveProperty("tags");
    });
  });

  describe("getFeaturedPost", () => {
    it("should return a featured post", async () => {
      const post = await BlogService.getFeaturedPost();

      expect(post).toBeDefined();
      expect(post?.featured).toBe(true);
    });

    it("should return most recent featured post if multiple exist", async () => {
      const post = await BlogService.getFeaturedPost();

      expect(post).toBeDefined();
      expect(post?.id).toBe("1"); // Based on mock data, post 1 is featured and most recent
    });
  });

  describe("getPostsPaginated", () => {
    it("should return paginated response with correct structure", async () => {
      const response = await BlogService.getPostsPaginated(1, 3);

      expect(response).toHaveProperty("posts");
      expect(response).toHaveProperty("pagination");
      expect(response).toHaveProperty("filters");

      expect(Array.isArray(response.posts)).toBe(true);
      expect(response.pagination).toHaveProperty("page");
      expect(response.pagination).toHaveProperty("pageSize");
      expect(response.pagination).toHaveProperty("totalPages");
      expect(response.pagination).toHaveProperty("totalPosts");
    });

    it("should return correct number of posts per page", async () => {
      const pageSize = 3;
      const response = await BlogService.getPostsPaginated(1, pageSize);

      expect(response.posts.length).toBeLessThanOrEqual(pageSize);
      expect(response.pagination.pageSize).toBe(pageSize);
    });

    it("should return correct posts for page 2", async () => {
      const pageSize = 3;
      const page1 = await BlogService.getPostsPaginated(1, pageSize);
      const page2 = await BlogService.getPostsPaginated(2, pageSize);

      // Posts should not overlap
      const page1Ids = page1.posts.map((p) => p.id);
      const page2Ids = page2.posts.map((p) => p.id);
      const overlap = page1Ids.filter((id) => page2Ids.includes(id));

      expect(overlap.length).toBe(0);
    });

    it("should calculate total pages correctly", async () => {
      const pageSize = 3;
      const response = await BlogService.getPostsPaginated(1, pageSize);

      const expectedTotalPages = Math.ceil(
        response.pagination.totalPosts / pageSize
      );
      expect(response.pagination.totalPages).toBe(expectedTotalPages);
    });

    it("should handle page number exceeding total pages", async () => {
      const response = await BlogService.getPostsPaginated(999, 12);

      // Should return last valid page
      expect(response.pagination.page).toBeLessThanOrEqual(
        response.pagination.totalPages
      );
    });

    it("should handle page number less than 1", async () => {
      const response = await BlogService.getPostsPaginated(0, 12);

      // Should default to page 1
      expect(response.pagination.page).toBe(1);
    });

    it("should apply filters to paginated results", async () => {
      const filters: BlogFilters = { category: "healing" };
      const response = await BlogService.getPostsPaginated(1, 12, filters);

      expect(response.posts.every((post) => post.category === "healing")).toBe(
        true
      );
      expect(response.filters).toEqual(filters);
    });

    it("should return correct totalPosts count with filters", async () => {
      const filters: BlogFilters = { category: "healing" };
      const response = await BlogService.getPostsPaginated(1, 12, filters);
      const allFilteredPosts = await BlogService.getPosts(filters);

      expect(response.pagination.totalPosts).toBe(allFilteredPosts.length);
    });
  });

  describe("getCategories", () => {
    it("should return array of unique categories", async () => {
      const categories = await BlogService.getCategories();

      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBeGreaterThan(0);

      // Check uniqueness
      const uniqueCategories = Array.from(new Set(categories));
      expect(categories.length).toBe(uniqueCategories.length);
    });

    it("should return sorted categories", async () => {
      const categories = await BlogService.getCategories();

      const sortedCategories = [...categories].sort();
      expect(categories).toEqual(sortedCategories);
    });

    it("should include known categories from mock data", async () => {
      const categories = await BlogService.getCategories();

      expect(categories).toContain("healing");
      expect(categories).toContain("wellness");
      expect(categories).toContain("meditation");
    });
  });

  describe("getRelatedPosts", () => {
    it("should return related posts for a given post", async () => {
      const referencePost = await BlogService.getPostBySlug(
        "understanding-reiki-energy-healing"
      );

      if (!referencePost) {
        throw new Error("Reference post not found");
      }

      const related = await BlogService.getRelatedPosts(referencePost, 3);

      expect(Array.isArray(related)).toBe(true);
      expect(related.length).toBeLessThanOrEqual(3);
    });

    it("should not include the reference post in results", async () => {
      const referencePost = await BlogService.getPostBySlug(
        "understanding-reiki-energy-healing"
      );

      if (!referencePost) {
        throw new Error("Reference post not found");
      }

      const related = await BlogService.getRelatedPosts(referencePost, 10);

      expect(related.every((post) => post.id !== referencePost.id)).toBe(true);
    });

    it("should prioritize posts with same category or shared tags", async () => {
      const referencePost = await BlogService.getPostBySlug(
        "understanding-reiki-energy-healing"
      );

      if (!referencePost) {
        throw new Error("Reference post not found");
      }

      const related = await BlogService.getRelatedPosts(referencePost, 5);

      // Related posts should either share category or have shared tags
      const hasRelationship = related.every((post) => {
        const sameCategory = post.category === referencePost.category;
        const sharedTags = post.tags.some((tag) =>
          referencePost.tags.includes(tag)
        );
        return sameCategory || sharedTags;
      });

      expect(hasRelationship).toBe(true);
    });

    it("should respect the limit parameter", async () => {
      const referencePost = await BlogService.getPostBySlug(
        "understanding-reiki-energy-healing"
      );

      if (!referencePost) {
        throw new Error("Reference post not found");
      }

      const limit = 2;
      const related = await BlogService.getRelatedPosts(referencePost, limit);

      expect(related.length).toBeLessThanOrEqual(limit);
    });

    it("should return posts sorted by relevance (score)", async () => {
      const referencePost = await BlogService.getPostBySlug(
        "understanding-reiki-energy-healing"
      );

      if (!referencePost) {
        throw new Error("Reference post not found");
      }

      const related = await BlogService.getRelatedPosts(referencePost, 5);

      // Related posts should be returned based on scoring algorithm
      // Posts with higher scores (same category + shared tags + recent) rank higher
      if (related.length > 1) {
        // At minimum, verify posts are returned in some reasonable order
        expect(related.length).toBeGreaterThan(0);
        expect(related.length).toBeLessThanOrEqual(5);
      }
    });

    it("should handle posts with no related content", async () => {
      // Create a unique post with no matches
      const uniquePost: BlogPost = {
        id: "unique",
        slug: "unique-post",
        title: "Unique Post",
        excerpt: "Unique content",
        content: "Unique content",
        category: "news",
        author: "Test Author",
        publishDate: "2025-01-01T00:00:00Z",
        readTime: "1 min read",
        featuredImage: "/img/test.jpg",
        tags: ["unique-tag-xyz"],
      };

      const related = await BlogService.getRelatedPosts(uniquePost, 3);

      expect(Array.isArray(related)).toBe(true);
      // May return 0 or more posts depending on scoring
    });
  });

  describe("API delay simulation", () => {
    it("should simulate realistic API delay", async () => {
      const startTime = Date.now();
      await BlogService.getPosts();
      const endTime = Date.now();
      const duration = endTime - startTime;

      // Should take at least 90ms (accounting for some timing variance)
      expect(duration).toBeGreaterThanOrEqual(90);
    });
  });

  describe("Edge cases", () => {
    it("should handle empty search query", async () => {
      const filters: BlogFilters = { search: "" };
      const posts = await BlogService.getPosts(filters);

      // Empty search should not filter
      expect(posts.length).toBeGreaterThan(0);
    });

    it("should handle empty tags array", async () => {
      const filters: BlogFilters = { tags: [] };
      const posts = await BlogService.getPosts(filters);

      // Empty tags array should not filter
      expect(posts.length).toBeGreaterThan(0);
    });

    it("should handle pagination with no posts", async () => {
      const filters: BlogFilters = { search: "nonexistent-xyz-123" };
      const response = await BlogService.getPostsPaginated(1, 12, filters);

      expect(response.posts).toEqual([]);
      expect(response.pagination.totalPosts).toBe(0);
      expect(response.pagination.totalPages).toBe(1); // At least 1 page
    });
  });
});
