/**
 * Blog Type System
 *
 * Comprehensive type definitions for blog functionality in the Reiki Goddess Healing application.
 * These types support blog posts, filtering, pagination, and newsletter subscriptions.
 *
 * NOTE: These types are re-exported from @reiki-goddess/shared-components for backward compatibility
 * and to avoid circular dependencies.
 */

/**
 * Blog category classification for content organization
 *
 * Categories:
 * - healing: Energy healing, Reiki, and healing modalities
 * - wellness: General wellness, self-care, and holistic health
 * - events: Upcoming events, workshops, and gatherings
 * - stories: Personal stories, testimonials, and experiences
 * - meditation: Meditation practices and guidance
 * - chakras: Chakra balancing and energy centers
 * - testimonials: Client success stories and feedback
 * - news: Updates and announcements
 * - guides: How-to guides and educational content
 */
export type BlogCategory =
  | "healing"
  | "wellness"
  | "events"
  | "stories"
  | "meditation"
  | "chakras"
  | "testimonials"
  | "news"
  | "guides";

/**
 * Author information for blog posts
 *
 * Supports both detailed author profiles and simple name strings.
 * Social links are optional for author engagement.
 */
export interface Author {
  /** Author's full name */
  name: string;

  /** Brief author biography */
  bio?: string;

  /** URL to author's profile image */
  image?: string;

  /** Author's role or title (optional) */
  role?: string;

  /** Social media links (optional) */
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

/**
 * Complete blog post data structure
 *
 * Represents a single blog post with all metadata, content, and SEO information.
 * Supports both full Author objects and simple author name strings for flexibility.
 */
export interface BlogPost {
  /** Unique identifier for the post */
  id: string;

  /** Post title */
  title: string;

  /** URL-friendly slug for routing */
  slug: string;

  /** Brief excerpt or summary (150-200 characters) */
  excerpt: string;

  /** Full post content in markdown format */
  content: string;

  /** Primary category for the post */
  category: BlogCategory;

  /** Post author - can be full Author object or just name string */
  author: Author | string;

  /** Publication date in ISO 8601 format */
  publishDate: string;

  /** Last updated date in ISO 8601 format (optional) */
  updatedDate?: string;

  /** Estimated reading time (e.g., "5 min read") */
  readTime: string;

  /** URL to the featured/hero image */
  featuredImage: string;

  /** Array of tags for additional categorization */
  tags: string[];

  /** Whether this post is featured on the homepage */
  featured?: boolean;

  /** SEO metadata for search optimization */
  seo?: {
    /** SEO title (defaults to post title if not provided) */
    title?: string;

    /** SEO meta description */
    description?: string;

    /** SEO keywords */
    keywords?: string[];
  };
}

/**
 * Blog filtering options
 *
 * Supports multi-dimensional filtering for blog post discovery.
 * All fields are optional for flexible query building.
 */
export interface BlogFilters {
  /** Filter by category ('all' shows all categories) */
  category?: BlogCategory | "all";

  /** Filter by tags (posts matching any tag) */
  tags?: string[];

  /** Search query for title/excerpt/content */
  search?: string;

  /** Filter by author name */
  author?: string;

  /** Filter posts published after this date (ISO 8601) */
  dateFrom?: string;

  /** Filter posts published before this date (ISO 8601) */
  dateTo?: string;
}

/**
 * Pagination configuration
 *
 * Metadata for paginated blog post listings.
 */
export interface PaginationConfig {
  /** Current page number (1-indexed) */
  page: number;

  /** Number of posts per page */
  pageSize: number;

  /** Total number of pages available */
  totalPages: number;

  /** Total number of posts matching filters */
  totalPosts: number;
}

/**
 * Blog listing response
 *
 * Complete response structure for paginated blog post requests.
 * Includes posts, pagination metadata, and applied filters.
 */
export interface BlogListingResponse {
  /** Array of blog posts for the current page */
  posts: BlogPost[];

  /** Pagination metadata */
  pagination: PaginationConfig;

  /** Applied filters for the request */
  filters: BlogFilters;
}

/**
 * Newsletter subscription data
 *
 * Captures user newsletter preferences and subscription timing.
 */
export interface NewsletterSubscription {
  /** Subscriber's email address */
  email: string;

  /** Selected interest categories (optional) */
  interests?: BlogCategory[];

  /** Subscription date in ISO 8601 format */
  subscribeDate: string;
}

/**
 * Link configuration for CTAs and navigation
 *
 * Reusable link structure with visual variant support.
 */
export interface LinkConfig {
  /** Display text for the link */
  label: string;

  /** Target URL or route */
  href: string;

  /** Optional icon identifier */
  icon?: string;

  /** Visual style variant */
  variant?: "primary" | "secondary" | "ghost";
}

/**
 * Blog page configuration
 *
 * UI-level configuration for blog page behavior and display options.
 */
export interface BlogPageConfig {
  /** Whether to show featured post section */
  showFeatured?: boolean;

  /** Number of posts to display per page */
  postsPerPage?: number;

  /** Enable search functionality */
  enableSearch?: boolean;

  /** Enable category/tag filters */
  enableFilters?: boolean;
}
