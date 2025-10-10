/**
 * BlogGrid Component
 *
 * Responsive grid layout for displaying blog post cards.
 * Handles loading, error, and empty states.
 */

import React from "react";
import { BlogCard } from "../BlogCard";
import type { BlogGridProps } from "./BlogGrid.types";

export const BlogGrid: React.FC<BlogGridProps> = ({
  posts,
  loading = false,
  error = null,
  emptyMessage = "No blog posts found.",
  className = "",
}) => {
  // Loading state
  if (loading) {
    return (
      <div
        className={`px-5 py-8 md:px-[66px] md:py-12 max-w-[1440px] mx-auto ${className}`}
      >
        <div
          role="status"
          aria-live="polite"
          className="flex justify-center items-center min-h-[400px]"
        >
          <div className="w-12 h-12 border-4 border-[#0205B7]/20 border-t-[#0205B7] rounded-full animate-spin" />
          <span className="sr-only">Loading blog posts...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className={`px-5 py-8 md:px-[66px] md:py-12 max-w-[1440px] mx-auto ${className}`}
      >
        <div
          role="alert"
          aria-live="assertive"
          className="text-center max-w-md mx-auto min-h-[400px] flex flex-col items-center justify-center"
        >
          <p className="text-lg text-red-600 mb-2">Error loading blog posts</p>
          <p className="text-sm text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (posts.length === 0) {
    return (
      <div
        className={`px-5 py-8 md:px-[66px] md:py-12 max-w-[1440px] mx-auto ${className}`}
      >
        <div className="text-center min-h-[400px] flex items-center justify-center">
          <p className="text-lg text-gray-600">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  // Single column layout for horizontal cards
  return (
    <div className={`py-8 md:py-12 max-w-[1440px] mx-auto ${className}`}>
      <div
        id="blog-posts-grid"
        role="region"
        aria-live="polite"
        aria-label="Blog posts"
        className="flex flex-col gap-8"
      >
        {posts.map((post, index) => (
          <BlogCard key={post.id} post={post} isFeatured={index === 0} />
        ))}
      </div>
    </div>
  );
};
