# Blog Page Implementation Recommendations

**Created**: 2025-10-06
**Purpose**: Actionable guidance for blog page migration implementation

## Overview

This document provides specific, actionable recommendations for implementing the blog page migration based on the component analysis. Each recommendation includes code examples, file locations, and rationale.

---

## Table of Contents

1. [Priority 1: Core Component Extraction](#priority-1-core-component-extraction)
2. [Priority 2: TypeScript Type Definitions](#priority-2-typescript-type-definitions)
3. [Priority 3: Data Service Layer](#priority-3-data-service-layer)
4. [Priority 4: Accessibility Enhancements](#priority-4-accessibility-enhancements)
5. [Priority 5: Performance Optimizations](#priority-5-performance-optimizations)
6. [Priority 6: Testing Strategy](#priority-6-testing-strategy)
7. [Priority 7: Routing Implementation](#priority-7-routing-implementation)

---

## Priority 1: Core Component Extraction

### Recommendation: Extract BlogCard Component

**Why**: Most reusable, appears in multiple contexts (grid, featured), 40+ lines of inline code

**Location**: Create `/packages/shared-components/src/Blog/BlogCard/BlogCard.tsx`

**Implementation**:

```typescript
import React from "react";
import { Link } from "react-router-dom";
import { BlogPost } from "../types";

export interface BlogCardProps {
  post: BlogPost;
  variant?: "default" | "featured";
  showExcerpt?: boolean;
  className?: string;
}

/**
 * BlogCard - Displays a blog post preview with image, title, excerpt, and metadata
 *
 * Used in:
 * - BlogGrid for regular post listings
 * - FeaturedBlogCard for highlighted posts
 * - Related posts sections (future)
 */
export const BlogCard: React.FC<BlogCardProps> = ({
  post,
  variant = "default",
  showExcerpt = true,
  className = "",
}) => {
  const cardClasses = variant === "featured"
    ? "bg-white rounded-2xl shadow-xl"
    : "bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1";

  return (
    <article className={`${cardClasses} overflow-hidden ${className}`}>
      {/* Image Container */}
      <div className="relative h-48">
        <img
          className="w-full h-full object-cover"
          src={post.featuredImage}
          alt={post.title}
          loading="lazy"
          decoding="async"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-white bg-opacity-90 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
            {post.category}
          </span>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-6 space-y-4">
        {/* Metadata */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <time dateTime={post.publishDate}>{post.publishDate}</time>
          <span>{post.readTime}</span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 leading-tight hover:text-blue-700 transition-colors">
          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>

        {/* Excerpt */}
        {showExcerpt && (
          <p className="text-gray-700 leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>
        )}

        {/* Read More Link */}
        <Link
          to={`/blog/${post.slug}`}
          className="inline-flex items-center gap-2 text-blue-700 font-medium hover:text-blue-800 transition-colors"
          aria-label={`Read more about ${post.title}`}
        >
          Read More
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </article>
  );
};
```

**Test File**: `/packages/shared-components/src/Blog/BlogCard/BlogCard.test.tsx`

```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { BlogCard } from "./BlogCard";
import { BlogPost } from "../types";

const mockPost: BlogPost = {
  id: "1",
  slug: "test-post",
  title: "Test Blog Post",
  excerpt: "This is a test excerpt for the blog post.",
  publishDate: "2024-12-15",
  readTime: "5 min read",
  featuredImage: "/img/test.png",
  category: "healing",
  author: {
    name: "Test Author"
  },
  tags: ["test"]
};

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("BlogCard", () => {
  it("renders post title and excerpt", () => {
    renderWithRouter(<BlogCard post={mockPost} />);

    expect(screen.getByText("Test Blog Post")).toBeInTheDocument();
    expect(screen.getByText(/This is a test excerpt/)).toBeInTheDocument();
  });

  it("displays category badge", () => {
    renderWithRouter(<BlogCard post={mockPost} />);

    expect(screen.getByText("healing")).toBeInTheDocument();
  });

  it("shows read time and date", () => {
    renderWithRouter(<BlogCard post={mockPost} />);

    expect(screen.getByText("2024-12-15")).toBeInTheDocument();
    expect(screen.getByText("5 min read")).toBeInTheDocument();
  });

  it("links to correct post URL using slug", () => {
    renderWithRouter(<BlogCard post={mockPost} />);

    const links = screen.getAllByRole("link");
    expect(links[0]).toHaveAttribute("href", "/blog/test-post");
  });

  it("hides excerpt when showExcerpt is false", () => {
    renderWithRouter(<BlogCard post={mockPost} showExcerpt={false} />);

    expect(screen.queryByText(/This is a test excerpt/)).not.toBeInTheDocument();
  });

  it("applies featured variant styles", () => {
    const { container } = renderWithRouter(
      <BlogCard post={mockPost} variant="featured" />
    );

    const article = container.querySelector("article");
    expect(article).toHaveClass("shadow-xl");
  });

  it("uses lazy loading for images", () => {
    renderWithRouter(<BlogCard post={mockPost} />);

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("loading", "lazy");
    expect(img).toHaveAttribute("decoding", "async");
  });
});
```

**Export**: Add to `/packages/shared-components/src/Blog/index.ts`

```typescript
export { BlogCard } from "./BlogCard/BlogCard";
export type { BlogCardProps } from "./BlogCard/BlogCard";
```

---

### Recommendation: Extract CategoryFilter Component

**Why**: Self-contained, reusable, clear single responsibility

**Location**: Create `/packages/shared-components/src/Blog/CategoryFilter/CategoryFilter.tsx`

**Implementation**:

```typescript
import React from "react";
import { BlogCategory } from "../types";

export interface CategoryFilterProps {
  categories: BlogCategory[];
  selectedCategory: BlogCategory | "all";
  onCategoryChange: (category: BlogCategory | "all") => void;
  className?: string;
}

/**
 * CategoryFilter - Button group for filtering blog posts by category
 *
 * Accessibility:
 * - Uses proper button semantics
 * - Includes aria-pressed for state
 * - Keyboard navigable
 */
export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  className = "",
}) => {
  const allCategories: (BlogCategory | "all")[] = ["all", ...categories];

  return (
    <nav
      role="navigation"
      aria-label="Blog category filters"
      className={className}
    >
      <div className="flex flex-wrap justify-center gap-4">
        {allCategories.map((category) => {
          const isSelected = selectedCategory === category;
          const displayName = category === "all"
            ? "All"
            : category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, " ");

          return (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              aria-pressed={isSelected}
              className={`
                px-6 py-2 rounded-full font-medium transition-colors
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                ${isSelected
                  ? "bg-blue-700 text-white"
                  : "bg-white text-gray-700 hover:bg-blue-50 shadow-sm"
                }
              `}
            >
              {displayName}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
```

**Test File**: `/packages/shared-components/src/Blog/CategoryFilter/CategoryFilter.test.tsx`

```typescript
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CategoryFilter } from "./CategoryFilter";
import { BlogCategory } from "../types";

describe("CategoryFilter", () => {
  const categories: BlogCategory[] = ["healing", "wellness", "events"];
  const mockOnChange = vi.fn();

  it("renders all categories plus 'All' option", () => {
    render(
      <CategoryFilter
        categories={categories}
        selectedCategory="all"
        onCategoryChange={mockOnChange}
      />
    );

    expect(screen.getByText("All")).toBeInTheDocument();
    expect(screen.getByText("Healing")).toBeInTheDocument();
    expect(screen.getByText("Wellness")).toBeInTheDocument();
    expect(screen.getByText("Events")).toBeInTheDocument();
  });

  it("highlights selected category with aria-pressed", () => {
    render(
      <CategoryFilter
        categories={categories}
        selectedCategory="wellness"
        onCategoryChange={mockOnChange}
      />
    );

    const wellnessButton = screen.getByText("Wellness");
    expect(wellnessButton).toHaveAttribute("aria-pressed", "true");
    expect(wellnessButton).toHaveClass("bg-blue-700", "text-white");
  });

  it("calls onChange when category is clicked", () => {
    render(
      <CategoryFilter
        categories={categories}
        selectedCategory="all"
        onCategoryChange={mockOnChange}
      />
    );

    fireEvent.click(screen.getByText("Healing"));
    expect(mockOnChange).toHaveBeenCalledWith("healing");
  });

  it("formats category names correctly", () => {
    const categoriesWithDashes: BlogCategory[] = ["reiki-basics", "sound-therapy"];

    render(
      <CategoryFilter
        categories={categoriesWithDashes}
        selectedCategory="all"
        onCategoryChange={mockOnChange}
      />
    );

    expect(screen.getByText("Reiki basics")).toBeInTheDocument();
    expect(screen.getByText("Sound therapy")).toBeInTheDocument();
  });

  it("has proper accessibility attributes", () => {
    render(
      <CategoryFilter
        categories={categories}
        selectedCategory="all"
        onCategoryChange={mockOnChange}
      />
    );

    const nav = screen.getByRole("navigation");
    expect(nav).toHaveAttribute("aria-label", "Blog category filters");
  });

  it("has focus styles for keyboard navigation", () => {
    render(
      <CategoryFilter
        categories={categories}
        selectedCategory="all"
        onCategoryChange={mockOnChange}
      />
    );

    const button = screen.getByText("Healing");
    expect(button).toHaveClass("focus:ring-2", "focus:ring-blue-500");
  });
});
```

---

### Recommendation: Extract BlogGrid Component

**Why**: Encapsulates grid layout logic, makes pagination easier later

**Location**: Create `/packages/shared-components/src/Blog/BlogGrid/BlogGrid.tsx`

**Implementation**:

```typescript
import React from "react";
import { BlogPost } from "../types";
import { BlogCard } from "../BlogCard/BlogCard";

export interface BlogGridProps {
  posts: BlogPost[];
  excludeFeatured?: boolean;
  emptyMessage?: string;
  className?: string;
}

/**
 * BlogGrid - Responsive grid layout for blog post cards
 *
 * Layout:
 * - Mobile: 1 column
 * - Tablet: 2 columns
 * - Desktop: 3 columns
 */
export const BlogGrid: React.FC<BlogGridProps> = ({
  posts,
  excludeFeatured = false,
  emptyMessage = "No blog posts found.",
  className = "",
}) => {
  const displayPosts = excludeFeatured
    ? posts.filter((post) => !post.featured)
    : posts;

  if (displayPosts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-8 ${className}`}>
      {displayPosts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
};
```

**Test File**: `/packages/shared-components/src/Blog/BlogGrid/BlogGrid.test.tsx`

```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { BlogGrid } from "./BlogGrid";
import { BlogPost } from "../types";

const mockPosts: BlogPost[] = [
  {
    id: "1",
    slug: "post-1",
    title: "Post 1",
    excerpt: "Excerpt 1",
    publishDate: "2024-12-15",
    readTime: "5 min",
    featuredImage: "/img/1.png",
    category: "healing",
    author: { name: "Author" },
    tags: [],
  },
  {
    id: "2",
    slug: "post-2",
    title: "Post 2",
    excerpt: "Excerpt 2",
    publishDate: "2024-12-14",
    readTime: "3 min",
    featuredImage: "/img/2.png",
    category: "wellness",
    author: { name: "Author" },
    tags: [],
    featured: true,
  },
];

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("BlogGrid", () => {
  it("renders all posts in a grid", () => {
    renderWithRouter(<BlogGrid posts={mockPosts} />);

    expect(screen.getByText("Post 1")).toBeInTheDocument();
    expect(screen.getByText("Post 2")).toBeInTheDocument();
  });

  it("excludes featured posts when excludeFeatured is true", () => {
    renderWithRouter(<BlogGrid posts={mockPosts} excludeFeatured />);

    expect(screen.getByText("Post 1")).toBeInTheDocument();
    expect(screen.queryByText("Post 2")).not.toBeInTheDocument();
  });

  it("shows empty message when no posts", () => {
    renderWithRouter(<BlogGrid posts={[]} />);

    expect(screen.getByText("No blog posts found.")).toBeInTheDocument();
  });

  it("shows custom empty message", () => {
    renderWithRouter(
      <BlogGrid posts={[]} emptyMessage="No posts in this category." />
    );

    expect(screen.getByText("No posts in this category.")).toBeInTheDocument();
  });

  it("applies responsive grid classes", () => {
    const { container } = renderWithRouter(<BlogGrid posts={mockPosts} />);

    const grid = container.firstChild;
    expect(grid).toHaveClass("grid", "md:grid-cols-2", "lg:grid-cols-3");
  });
});
```

---

## Priority 2: TypeScript Type Definitions

### Recommendation: Create Comprehensive Type System

**Location**: Create `/packages/shared-components/src/Blog/types.ts`

**Implementation**:

```typescript
/**
 * Blog Type Definitions
 *
 * Comprehensive type system for blog functionality
 */

/**
 * Blog category types
 * Maps to content categories in the CMS
 */
export type BlogCategory =
  | "healing"
  | "wellness"
  | "events"
  | "stories"
  | "reiki-basics"
  | "sound-therapy"
  | "getting-started"
  | "energy-work"
  | "spiritual-growth";

/**
 * Author information
 */
export interface Author {
  id?: string;
  name: string;
  bio?: string;
  avatar?: string;
  email?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    website?: string;
  };
}

/**
 * Blog post entity
 * Core data structure for all blog content
 */
export interface BlogPost {
  /** Unique identifier */
  id: string;

  /** URL-friendly slug (used in routing) */
  slug: string;

  /** Post title */
  title: string;

  /** Short preview text (1-2 sentences) */
  excerpt: string;

  /** Full post content (Markdown or HTML) */
  content?: string;

  /** Primary category */
  category: BlogCategory;

  /** Post author */
  author: Author;

  /** Publication date (ISO 8601 format) */
  publishDate: string;

  /** Estimated read time (e.g., "5 min read") */
  readTime: string;

  /** Featured image URL */
  featuredImage: string;

  /** Whether post should be featured */
  featured?: boolean;

  /** Post tags for filtering/search */
  tags: string[];

  /** SEO metadata (optional) */
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    ogImage?: string;
  };

  /** Publication status */
  status?: "draft" | "published" | "archived";

  /** Related post IDs (for suggestions) */
  relatedPosts?: string[];
}

/**
 * Blog listing filter options
 */
export interface BlogFilters {
  category?: BlogCategory | "all";
  tags?: string[];
  searchQuery?: string;
  author?: string;
  dateFrom?: string;
  dateTo?: string;
}

/**
 * Pagination configuration
 */
export interface PaginationConfig {
  page: number;
  pageSize: number;
  totalPages: number;
  totalPosts: number;
}

/**
 * Blog listing response (for API/CMS integration)
 */
export interface BlogListingResponse {
  posts: BlogPost[];
  pagination: PaginationConfig;
  filters: BlogFilters;
}

/**
 * Newsletter subscription data
 */
export interface NewsletterSubscription {
  email: string;
  name?: string;
  interests?: BlogCategory[];
  subscribeDate: string;
}

/**
 * Link configuration for CTAs
 */
export interface LinkConfig {
  label: string;
  href: string;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
}

/**
 * Blog page layout configuration
 */
export interface BlogPageConfig {
  showFeaturedPost: boolean;
  showCategoryFilter: boolean;
  showNewsletter: boolean;
  showBookingCTA: boolean;
  postsPerPage: number;
}
```

**Export**: Add to `/packages/shared-components/src/Blog/index.ts`

```typescript
export type {
  BlogCategory,
  Author,
  BlogPost,
  BlogFilters,
  PaginationConfig,
  BlogListingResponse,
  NewsletterSubscription,
  LinkConfig,
  BlogPageConfig,
} from "./types";
```

---

## Priority 3: Data Service Layer

### Recommendation: Create Blog Data Service

**Why**: Separation of concerns, easy to swap mock data for CMS later

**Location**: Create `/packages/shared-utils/src/services/blogService.ts`

**Implementation**:

```typescript
import { BlogPost, BlogFilters, BlogListingResponse } from "../types/blog";
import { mockBlogPosts } from "../data/mockBlogPosts";

/**
 * Blog Data Service
 *
 * Abstracts data fetching for blog posts
 * Current: Uses mock data
 * Future: Replace with CMS API calls
 */
export class BlogService {
  /**
   * Fetch all blog posts with optional filtering
   */
  static async getPosts(filters?: BlogFilters): Promise<BlogPost[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    let posts = [...mockBlogPosts];

    // Apply filters
    if (filters) {
      if (filters.category && filters.category !== "all") {
        posts = posts.filter((post) => post.category === filters.category);
      }

      if (filters.tags && filters.tags.length > 0) {
        posts = posts.filter((post) =>
          filters.tags!.some((tag) => post.tags.includes(tag))
        );
      }

      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        posts = posts.filter(
          (post) =>
            post.title.toLowerCase().includes(query) ||
            post.excerpt.toLowerCase().includes(query) ||
            post.content?.toLowerCase().includes(query)
        );
      }

      if (filters.author) {
        posts = posts.filter((post) => post.author.name === filters.author);
      }
    }

    // Sort by publish date (newest first)
    posts.sort(
      (a, b) =>
        new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );

    return posts;
  }

  /**
   * Fetch a single post by slug
   */
  static async getPostBySlug(slug: string): Promise<BlogPost | null> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const post = mockBlogPosts.find((p) => p.slug === slug);
    return post || null;
  }

  /**
   * Fetch featured post
   */
  static async getFeaturedPost(): Promise<BlogPost | null> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const featured = mockBlogPosts.find((post) => post.featured);
    return featured || mockBlogPosts[0] || null;
  }

  /**
   * Fetch posts with pagination
   */
  static async getPostsPaginated(
    page: number = 1,
    pageSize: number = 12,
    filters?: BlogFilters
  ): Promise<BlogListingResponse> {
    const allPosts = await this.getPosts(filters);

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const posts = allPosts.slice(startIndex, endIndex);

    return {
      posts,
      pagination: {
        page,
        pageSize,
        totalPages: Math.ceil(allPosts.length / pageSize),
        totalPosts: allPosts.length,
      },
      filters: filters || {},
    };
  }

  /**
   * Get all unique categories
   */
  static async getCategories(): Promise<string[]> {
    await new Promise((resolve) => setTimeout(resolve, 50));

    const categories = new Set(mockBlogPosts.map((post) => post.category));
    return Array.from(categories).sort();
  }

  /**
   * Get related posts (by category and tags)
   */
  static async getRelatedPosts(
    currentPost: BlogPost,
    limit: number = 3
  ): Promise<BlogPost[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const related = mockBlogPosts
      .filter((post) => post.id !== currentPost.id)
      .map((post) => {
        let score = 0;

        // Same category: +3 points
        if (post.category === currentPost.category) score += 3;

        // Shared tags: +1 point per tag
        const sharedTags = post.tags.filter((tag) =>
          currentPost.tags.includes(tag)
        );
        score += sharedTags.length;

        return { post, score };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ post }) => post);

    return related;
  }
}
```

**Mock Data File**: Create `/packages/shared-utils/src/data/mockBlogPosts.ts`

```typescript
import { BlogPost } from "../types/blog";

export const mockBlogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "understanding-reiki-beginners-guide",
    title: "Understanding Reiki: A Beginner's Guide to Energy Healing",
    excerpt:
      "Discover what Reiki is, how it works, and what to expect during your first session. Learn about the ancient Japanese healing technique that's helping millions find peace and balance.",
    publishDate: "2024-12-15",
    readTime: "5 min read",
    featuredImage: "/img/rectangle-5.png",
    category: "reiki-basics",
    featured: true,
    author: {
      name: "Deirdre, The Reiki Goddess",
      bio: "Certified Reiki Master and Sound Healing Practitioner",
    },
    tags: ["reiki", "energy-healing", "beginners", "holistic-health"],
    status: "published",
  },
  {
    id: "2",
    slug: "science-behind-sound-healing",
    title:
      "The Science Behind Sound Healing: How Vibrations Transform Wellness",
    excerpt:
      "Explore the fascinating research behind sound therapy and how specific frequencies can promote healing, reduce stress, and improve overall well-being.",
    publishDate: "2024-12-10",
    readTime: "7 min read",
    featuredImage: "/img/rectangle-6.png",
    category: "sound-therapy",
    author: {
      name: "Deirdre, The Reiki Goddess",
    },
    tags: ["sound-healing", "vibration-therapy", "science", "wellness"],
    status: "published",
  },
  {
    id: "3",
    slug: "preparing-first-reiki-session",
    title: "Preparing for Your First Reiki Session: What to Expect",
    excerpt:
      "A comprehensive guide to help you prepare for your first Reiki experience, including what happens during a session and how to maximize the benefits.",
    publishDate: "2024-12-05",
    readTime: "4 min read",
    featuredImage: "/img/rectangle-7.png",
    category: "getting-started",
    author: {
      name: "Deirdre, The Reiki Goddess",
    },
    tags: ["reiki", "first-session", "preparation", "what-to-expect"],
    status: "published",
  },
  {
    id: "4",
    slug: "chakra-system-energy-centers",
    title: "The Chakra System: Understanding Your Body's Energy Centers",
    excerpt:
      "Learn about the seven main chakras, their functions, and how Reiki can help balance these vital energy centers for optimal health and vitality.",
    publishDate: "2024-11-28",
    readTime: "6 min read",
    featuredImage: "/img/rectangle-8.png",
    category: "energy-work",
    author: {
      name: "Deirdre, The Reiki Goddess",
    },
    tags: ["chakras", "energy-centers", "balance", "healing"],
    status: "published",
  },
  {
    id: "5",
    slug: "stress-relief-energy-healing",
    title:
      "Stress Relief Through Energy Healing: Natural Solutions for Modern Life",
    excerpt:
      "Discover how Reiki and sound healing can provide natural, effective relief from stress, anxiety, and the pressures of daily life.",
    publishDate: "2024-11-20",
    readTime: "5 min read",
    featuredImage: "/img/rectangle-10.png",
    category: "wellness",
    author: {
      name: "Deirdre, The Reiki Goddess",
    },
    tags: ["stress-relief", "anxiety", "wellness", "modern-life"],
    status: "published",
  },
  {
    id: "6",
    slug: "creating-sacred-space-healing",
    title: "Creating Sacred Space: Setting Intentions for Healing",
    excerpt:
      "Learn how to create a peaceful environment and set clear intentions to enhance your healing journey and spiritual growth.",
    publishDate: "2024-11-15",
    readTime: "4 min read",
    featuredImage: "/img/rectangle-12.png",
    category: "spiritual-growth",
    author: {
      name: "Deirdre, The Reiki Goddess",
    },
    tags: ["sacred-space", "intentions", "spiritual-practice", "healing"],
    status: "published",
  },
];
```

**React Hook**: Create `/packages/shared-components/src/Blog/hooks/useBlogPosts.ts`

```typescript
import { useState, useEffect } from "react";
import { BlogPost, BlogFilters } from "../types";
import { BlogService } from "@reiki-goddess/shared-utils";

export interface UseBlogPostsReturn {
  posts: BlogPost[];
  loading: boolean;
  error: Error | null;
  refresh: () => void;
}

/**
 * Custom hook for fetching blog posts
 * Handles loading, error states, and filtering
 */
export const useBlogPosts = (filters?: BlogFilters): UseBlogPostsReturn => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await BlogService.getPosts(filters);
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch posts"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [JSON.stringify(filters)]); // Re-fetch when filters change

  return {
    posts,
    loading,
    error,
    refresh: fetchPosts,
  };
};
```

---

## Priority 4: Accessibility Enhancements

### Recommendation: Add ARIA Attributes and Semantic HTML

**Implementation Changes**:

#### 1. Add Proper Page Structure

```typescript
// Before
<div className="min-h-screen bg-[#fefbf5]">
  {/* Content */}
</div>

// After
<div className="min-h-screen bg-[#fefbf5]">
  <main role="main" aria-label="Blog content">
    {/* Content */}
  </main>
</div>
```

#### 2. Enhance Category Filter

```typescript
// Already implemented in CategoryFilter component above
<nav role="navigation" aria-label="Blog category filters">
  <button aria-pressed={isSelected}>
    {category}
  </button>
</nav>
```

#### 3. Add Skip Links

```typescript
// Add to BlogPage component
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-700 focus:text-white focus:rounded"
>
  Skip to main content
</a>

<main id="main-content" tabIndex={-1}>
  {/* Blog content */}
</main>
```

#### 4. Improve Form Accessibility

```typescript
// Newsletter form (create NewsletterCTA component)
<form onSubmit={handleSubmit} aria-label="Newsletter subscription">
  <label htmlFor="newsletter-email" className="sr-only">
    Email address
  </label>
  <input
    id="newsletter-email"
    type="email"
    placeholder="Enter your email"
    required
    aria-required="true"
    aria-describedby="newsletter-privacy"
  />
  <button type="submit" aria-label="Subscribe to newsletter">
    Subscribe
  </button>
  <p id="newsletter-privacy" className="text-sm opacity-80 mt-2">
    No spam, unsubscribe anytime. Your privacy is important to us.
  </p>
</form>
```

#### 5. Add Loading and Error States

```typescript
// In BlogPage component
if (loading) {
  return (
    <div role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Loading blog posts...</span>
      <div className="animate-pulse">{/* Skeleton UI */}</div>
    </div>
  );
}

if (error) {
  return (
    <div role="alert" aria-live="assertive">
      <h2>Error Loading Blog Posts</h2>
      <p>{error.message}</p>
      <button onClick={refresh}>Try Again</button>
    </div>
  );
}
```

---

## Priority 5: Performance Optimizations

### Recommendation: Add React Performance Patterns

**Implementation**:

#### 1. Memoize Filtered Posts

```typescript
// In BlogPage component
const filteredPosts = useMemo(() => {
  if (selectedCategory === "all") return posts;
  return posts.filter((post) => post.category === selectedCategory);
}, [selectedCategory, posts]);
```

#### 2. Memoize Component

```typescript
// In BlogCard.tsx
export const BlogCard = React.memo<BlogCardProps>(
  ({ post, variant, showExcerpt, className }) => {
    // Component implementation
  },
  (prevProps, nextProps) => {
    // Custom comparison function
    return (
      prevProps.post.id === nextProps.post.id &&
      prevProps.variant === nextProps.variant &&
      prevProps.showExcerpt === nextProps.showExcerpt
    );
  }
);

BlogCard.displayName = "BlogCard";
```

#### 3. Use Callback for Event Handlers

```typescript
// In BlogPage component
const handleCategoryChange = useCallback((category: BlogCategory | "all") => {
  setSelectedCategory(category);
}, []);
```

#### 4. Lazy Load Blog Route

```typescript
// In App.tsx
import { lazy, Suspense } from "react";

const Blog = lazy(() => import("./pages/Blog"));

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        {/* Other routes */}
        <Route
          path="blog"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <Blog />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}
```

#### 5. Add Image Optimization

```typescript
// Create optimized image component
export const OptimizedImage: React.FC<{
  src: string;
  alt: string;
  width?: number;
  height?: number;
}> = ({ src, alt, width, height }) => {
  return (
    <picture>
      {/* WebP version */}
      <source
        type="image/webp"
        srcSet={src.replace(/\.(jpg|png)$/, ".webp")}
        width={width}
        height={height}
      />

      {/* Original format fallback */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover"
      />
    </picture>
  );
};
```

---

## Priority 6: Testing Strategy

### Recommendation: Comprehensive Test Coverage

**Test Structure**:

```
packages/shared-components/src/Blog/
├── BlogCard/
│   ├── BlogCard.tsx
│   ├── BlogCard.test.tsx ✓ (already shown above)
│   └── BlogCard.stories.tsx
├── CategoryFilter/
│   ├── CategoryFilter.tsx
│   ├── CategoryFilter.test.tsx ✓ (already shown above)
│   └── CategoryFilter.stories.tsx
├── BlogGrid/
│   ├── BlogGrid.tsx
│   ├── BlogGrid.test.tsx ✓ (already shown above)
│   └── BlogGrid.stories.tsx
└── hooks/
    ├── useBlogPosts.ts
    └── useBlogPosts.test.ts
```

**Hook Test Example**: `/packages/shared-components/src/Blog/hooks/useBlogPosts.test.ts`

```typescript
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useBlogPosts } from "./useBlogPosts";
import { BlogService } from "@reiki-goddess/shared-utils";

// Mock the service
vi.mock("@reiki-goddess/shared-utils", () => ({
  BlogService: {
    getPosts: vi.fn(),
  },
}));

describe("useBlogPosts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches posts on mount", async () => {
    const mockPosts = [
      { id: "1", title: "Post 1" },
      { id: "2", title: "Post 2" },
    ];

    vi.mocked(BlogService.getPosts).mockResolvedValue(mockPosts);

    const { result } = renderHook(() => useBlogPosts());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.posts).toEqual(mockPosts);
    expect(result.current.error).toBeNull();
  });

  it("handles errors gracefully", async () => {
    const error = new Error("Failed to fetch");
    vi.mocked(BlogService.getPosts).mockRejectedValue(error);

    const { result } = renderHook(() => useBlogPosts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toEqual(error);
    expect(result.current.posts).toEqual([]);
  });

  it("refetches when filters change", async () => {
    const mockPosts1 = [{ id: "1", title: "Post 1" }];
    const mockPosts2 = [{ id: "2", title: "Post 2" }];

    vi.mocked(BlogService.getPosts)
      .mockResolvedValueOnce(mockPosts1)
      .mockResolvedValueOnce(mockPosts2);

    const { result, rerender } = renderHook(
      ({ filters }) => useBlogPosts(filters),
      { initialProps: { filters: { category: "healing" } } }
    );

    await waitFor(() => {
      expect(result.current.posts).toEqual(mockPosts1);
    });

    rerender({ filters: { category: "wellness" } });

    await waitFor(() => {
      expect(result.current.posts).toEqual(mockPosts2);
    });

    expect(BlogService.getPosts).toHaveBeenCalledTimes(2);
  });

  it("allows manual refresh", async () => {
    const mockPosts = [{ id: "1", title: "Post 1" }];
    vi.mocked(BlogService.getPosts).mockResolvedValue(mockPosts);

    const { result } = renderHook(() => useBlogPosts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    result.current.refresh();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(BlogService.getPosts).toHaveBeenCalledTimes(2);
  });
});
```

---

## Priority 7: Routing Implementation

### Recommendation: SEO-Friendly URL Structure

**Implementation**: Update `apps/main/src/App.tsx`

```typescript
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@reiki-goddess/shared-components";

// Lazy load blog pages
const BlogListing = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));

// Other imports...

function App() {
  return (
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="events" element={<Events />} />
          <Route path="contact" element={<Contact />} />

          {/* Blog routes */}
          <Route path="blog">
            <Route
              index
              element={
                <Suspense fallback={<BlogLoadingSkeleton />}>
                  <BlogListing />
                </Suspense>
              }
            />
            <Route
              path="category/:category"
              element={
                <Suspense fallback={<BlogLoadingSkeleton />}>
                  <BlogListing />
                </Suspense>
              }
            />
            <Route
              path=":slug"
              element={
                <Suspense fallback={<PostLoadingSkeleton />}>
                  <BlogPost />
                </Suspense>
              }
            />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

**BlogPost Component**: Create `apps/main/src/pages/BlogPost.tsx`

```typescript
import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { BlogService } from "@reiki-goddess/shared-utils";
import { BlogCard } from "@reiki-goddess/shared-components";
import PageTransition from "../components/PageTransition";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = React.useState(null);
  const [relatedPosts, setRelatedPosts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchPost() {
      if (!slug) return;

      setLoading(true);
      const data = await BlogService.getPostBySlug(slug);

      if (data) {
        setPost(data);
        const related = await BlogService.getRelatedPosts(data, 3);
        setRelatedPosts(related);
      }

      setLoading(false);
    }

    fetchPost();
  }, [slug]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <PageTransition>
      <article className="min-h-screen bg-[#FFFBF5]">
        {/* Post content */}
        <div className="max-w-4xl mx-auto px-4 py-20">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-sm">
              <li><Link to="/">Home</Link></li>
              <li>/</li>
              <li><Link to="/blog">Blog</Link></li>
              <li>/</li>
              <li aria-current="page">{post.title}</li>
            </ol>
          </nav>

          {/* Post header */}
          <header className="mb-12">
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <div className="flex items-center gap-4 text-gray-600">
              <time dateTime={post.publishDate}>{post.publishDate}</time>
              <span>•</span>
              <span>{post.readTime}</span>
              <span>•</span>
              <span>{post.author.name}</span>
            </div>
          </header>

          {/* Featured image */}
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full rounded-lg mb-12"
          />

          {/* Post content */}
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Related posts */}
          {relatedPosts.length > 0 && (
            <aside className="mt-16">
              <h2 className="text-2xl font-bold mb-8">Related Posts</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <BlogCard key={relatedPost.id} post={relatedPost} />
                ))}
              </div>
            </aside>
          )}
        </div>
      </article>
    </PageTransition>
  );
}
```

---

## Implementation Checklist

### Phase 1: Foundation (Week 1)

- [ ] Create `/packages/shared-components/src/Blog/types.ts`
- [ ] Create `/packages/shared-utils/src/data/mockBlogPosts.ts`
- [ ] Create `/packages/shared-utils/src/services/blogService.ts`
- [ ] Export types from both packages

### Phase 2: Component Extraction (Week 2)

- [ ] Create `BlogCard` component + tests
- [ ] Create `CategoryFilter` component + tests
- [ ] Create `BlogGrid` component + tests
- [ ] Create `useBlogPosts` hook + tests
- [ ] Export all from Blog module

### Phase 3: Page Implementation (Week 3)

- [ ] Update `apps/main/src/pages/Blog.tsx` to use new components
- [ ] Create `apps/main/src/pages/BlogPost.tsx`
- [ ] Update routing in `App.tsx`
- [ ] Add loading skeletons

### Phase 4: Enhancement (Week 4)

- [ ] Add accessibility attributes
- [ ] Implement performance optimizations
- [ ] Add error handling
- [ ] Create Storybook stories

### Phase 5: Polish (Week 5)

- [ ] SEO meta tags
- [ ] OpenGraph tags
- [ ] RSS feed (optional)
- [ ] Analytics events
- [ ] Final testing

---

## Related Documents

- [Component Analysis](./component-analysis.md)
- [Component Hierarchy](./component-hierarchy.md)
- [Blog Migration Plan](/Users/taylorquigley/Documents/Directories/reiki-goddess-healing/docs/progress/006-blog-page-migration.md)

---

**Created**: 2025-10-06
**Status**: Ready for implementation
