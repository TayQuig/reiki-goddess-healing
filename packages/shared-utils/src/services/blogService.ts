/**
 * Blog Service Layer
 *
 * Provides data fetching and manipulation methods for blog functionality.
 * Currently uses mock data with realistic API delays for development and testing.
 */

import type { BlogPost } from "../types/blog";
import type { BlogFilters } from "../types/blog";
import type { BlogListingResponse } from "../types/blog";
import type { BlogCategory } from "../types/blog";
import type { PaginationConfig } from "../types/blog";
import { mockBlogPosts } from "../data/mockBlogPosts";

/**
 * Mock API delay in milliseconds for realistic testing
 */
const MOCK_DELAY_MS = 100;

/**
 * Simulates async API delay
 */
const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Blog Service
 *
 * Centralized service for all blog-related data operations.
 * Supports filtering, pagination, search, and content discovery.
 */
export class BlogService {
  /**
   * Fetch all blog posts with optional filtering
   *
   * Supports filtering by:
   * - Category
   * - Tags (posts matching any tag)
   * - Search query (searches title, excerpt, and content)
   * - Author name
   * - Date range (publishDate)
   *
   * @param filters - Optional filtering criteria
   * @returns Promise resolving to filtered blog posts
   */
  static async getPosts(filters?: BlogFilters): Promise<BlogPost[]> {
    await delay(MOCK_DELAY_MS);

    let posts = [...mockBlogPosts];

    if (!filters) {
      return posts.sort(
        (a, b) =>
          new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
      );
    }

    // Filter by category
    if (filters.category && filters.category !== "all") {
      posts = posts.filter((post) => post.category === filters.category);
    }

    // Filter by tags (posts matching ANY tag)
    if (filters.tags && filters.tags.length > 0) {
      posts = posts.filter((post) =>
        post.tags.some((tag) =>
          filters.tags!.some(
            (filterTag) => tag.toLowerCase() === filterTag.toLowerCase()
          )
        )
      );
    }

    // Filter by search query (case-insensitive)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      posts = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchLower) ||
          post.excerpt.toLowerCase().includes(searchLower) ||
          post.content.toLowerCase().includes(searchLower)
      );
    }

    // Filter by author
    if (filters.author) {
      const authorLower = filters.author.toLowerCase();
      posts = posts.filter((post) => {
        const authorName =
          typeof post.author === "string" ? post.author : post.author.name;
        return authorName.toLowerCase().includes(authorLower);
      });
    }

    // Filter by date range
    if (filters.dateFrom) {
      const dateFrom = new Date(filters.dateFrom).getTime();
      posts = posts.filter(
        (post) => new Date(post.publishDate).getTime() >= dateFrom
      );
    }

    if (filters.dateTo) {
      const dateTo = new Date(filters.dateTo).getTime();
      posts = posts.filter(
        (post) => new Date(post.publishDate).getTime() <= dateTo
      );
    }

    // Sort by publish date (newest first)
    return posts.sort(
      (a, b) =>
        new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );
  }

  /**
   * Fetch a single blog post by slug
   *
   * @param slug - URL-friendly post identifier
   * @returns Promise resolving to blog post or null if not found
   */
  static async getPostBySlug(slug: string): Promise<BlogPost | null> {
    await delay(MOCK_DELAY_MS);

    const post = mockBlogPosts.find((p) => p.slug === slug);
    return post || null;
  }

  /**
   * Fetch the featured blog post
   *
   * Returns the post marked as featured. If multiple posts are featured,
   * returns the most recently published one.
   *
   * @returns Promise resolving to featured post or null if none exists
   */
  static async getFeaturedPost(): Promise<BlogPost | null> {
    await delay(MOCK_DELAY_MS);

    const featuredPosts = mockBlogPosts.filter((post) => post.featured);

    if (featuredPosts.length === 0) {
      return null;
    }

    // If multiple featured posts, return most recent
    featuredPosts.sort(
      (a, b) =>
        new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );

    return featuredPosts[0];
  }

  /**
   * Fetch blog posts with pagination
   *
   * Applies filters, then returns a paginated subset with metadata.
   *
   * @param page - Page number (1-indexed, defaults to 1)
   * @param pageSize - Number of posts per page (defaults to 12)
   * @param filters - Optional filtering criteria
   * @returns Promise resolving to BlogListingResponse with posts, pagination, and filters
   */
  static async getPostsPaginated(
    page: number = 1,
    pageSize: number = 12,
    filters?: BlogFilters
  ): Promise<BlogListingResponse> {
    await delay(MOCK_DELAY_MS);

    // Get filtered posts
    const allPosts = await this.getPosts(filters);

    // Calculate pagination
    const totalPosts = allPosts.length;
    const totalPages = Math.ceil(totalPosts / pageSize);
    const validPage = Math.max(1, Math.min(page, totalPages || 1));

    // Get posts for current page
    const startIndex = (validPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const posts = allPosts.slice(startIndex, endIndex);

    const pagination: PaginationConfig = {
      page: validPage,
      pageSize,
      totalPages: totalPages || 1,
      totalPosts,
    };

    return {
      posts,
      pagination,
      filters: filters || {},
    };
  }

  /**
   * Get all unique categories from existing posts
   *
   * Extracts and returns unique categories present in the blog post collection.
   *
   * @returns Promise resolving to array of unique BlogCategory values
   */
  static async getCategories(): Promise<BlogCategory[]> {
    await delay(MOCK_DELAY_MS);

    const categories = new Set<BlogCategory>();

    mockBlogPosts.forEach((post) => {
      categories.add(post.category);
    });

    // Sort alphabetically
    return Array.from(categories).sort();
  }

  /**
   * Get related posts based on category and tags
   *
   * Scoring algorithm:
   * - Same category: +3 points
   * - Shared tags: +1 point per tag
   * - Recent posts (published within 6 months): +1 bonus point
   *
   * @param post - The reference post to find related posts for
   * @param limit - Maximum number of related posts to return (defaults to 3)
   * @returns Promise resolving to array of related posts
   */
  static async getRelatedPosts(
    post: BlogPost,
    limit: number = 3
  ): Promise<BlogPost[]> {
    await delay(MOCK_DELAY_MS);

    interface ScoredPost {
      post: BlogPost;
      score: number;
    }

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const scoredPosts: ScoredPost[] = mockBlogPosts
      .filter((p) => p.id !== post.id) // Exclude current post
      .map((p) => {
        let score = 0;

        // Same category: +3 points
        if (p.category === post.category) {
          score += 3;
        }

        // Shared tags: +1 point per tag
        const sharedTags = p.tags.filter((tag) =>
          post.tags.some(
            (postTag) => postTag.toLowerCase() === tag.toLowerCase()
          )
        );
        score += sharedTags.length;

        // Recent posts bonus: +1 point
        const postDate = new Date(p.publishDate);
        if (postDate >= sixMonthsAgo) {
          score += 1;
        }

        return { post: p, score };
      });

    // Sort by score (descending), then by publish date (newest first)
    scoredPosts.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return (
        new Date(b.post.publishDate).getTime() -
        new Date(a.post.publishDate).getTime()
      );
    });

    // Return top N posts
    return scoredPosts.slice(0, limit).map((sp) => sp.post);
  }
}
