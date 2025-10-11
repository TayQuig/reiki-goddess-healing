/**
 * BlogCard Component
 *
 * Displays a horizontal blog post card with image on left and content on right.
 * Features clean white background with blue border, social icons, and "Learn More" link.
 *
 * Uses design tokens from @reiki-goddess/design-system for consistent styling.
 *
 * @component
 */

import React from "react";
import { Link } from "react-router-dom";
import type { BlogPost } from "../types";
import "./BlogCard.css";

/**
 * Props for the BlogCard component
 */
export interface BlogCardProps {
  /** Blog post data to display */
  post: BlogPost;

  /** Whether this is the first/featured card (shows smoke decorations) */
  isFeatured?: boolean;

  /** Additional CSS classes */
  className?: string;
}

/**
 * Sanitizes text content to prevent XSS attacks
 */
const sanitizeText = (text: string): string => {
  return text
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
};

/**
 * Validates image URL to prevent malicious sources
 */
const isValidImageUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url, window.location.origin);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch {
    return false;
  }
};

/**
 * BlogCard Component - Horizontal Layout
 *
 * Renders a blog post card with horizontal layout matching Figma design:
 * - Image on left (40% width)
 * - Content on right with title, date, excerpt, Learn More link, and social icons
 * - Clean white background with blue border
 * - Optional smoke decorations for featured card
 */
export const BlogCard: React.FC<BlogCardProps> = ({
  post,
  isFeatured = false,
  className = "",
}) => {
  // Security: Validate and sanitize data
  const safeTitle = sanitizeText(post.title);
  const safeExcerpt = sanitizeText(post.excerpt);
  const safeImageUrl = isValidImageUrl(post.featuredImage)
    ? post.featuredImage
    : "/img/placeholder.jpg";

  // Format publish date
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <article
      className={`blog-card-horizontal ${className}`.trim()}
      aria-labelledby={`post-title-${post.id}`}
      style={{ position: "relative" }}
    >
      {/* Smoke decorations for featured card */}
      {isFeatured && (
        <>
          <div
            className="smoke-decoration smoke-left"
            style={{
              position: "absolute",
              left: "-150px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "200px",
              height: "200px",
              backgroundImage: "url(/img/smoke-blue.png)",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              opacity: 0.3,
              pointerEvents: "none",
              zIndex: 0,
            }}
            aria-hidden="true"
          />
          <div
            className="smoke-decoration smoke-right"
            style={{
              position: "absolute",
              right: "-150px",
              top: "50%",
              transform: "translateY(-50%) scaleX(-1)",
              width: "200px",
              height: "200px",
              backgroundImage: "url(/img/smoke-blue.png)",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              opacity: 0.3,
              pointerEvents: "none",
              zIndex: 0,
            }}
            aria-hidden="true"
          />
        </>
      )}

      {/* Clickable card wrapper */}
      <Link
        to={`/blog/${post.slug}`}
        className="block no-underline"
        aria-label={`Read article: ${post.title}`}
      >
        {/* Separate containers for image and content to allow independent sizing */}
        <div
          className="flex flex-col md:flex-row gap-0 items-center"
          style={{ position: "relative", zIndex: 1 }}
        >
          {/* Image section - separate container, fixed height to be taller than content */}
          <div className="w-full md:w-[40%] flex-shrink-0">
            <img
              src={safeImageUrl}
              alt={post.title}
              className="w-full object-cover"
              style={{
                borderTopLeftRadius: "8px",
                borderBottomLeftRadius: "8px",
                display: "block",
                height: "350px",
              }}
              loading="lazy"
            />
          </div>

          {/* Content section - separate container, centered on image */}
          <div
            className="flex-1 bg-white p-6 md:p-8 flex flex-col justify-between"
            style={{
              borderTopRightRadius: "8px",
              borderBottomRightRadius: "8px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* Title */}
            <div>
              <h3
                className="text-2xl md:text-3xl font-bold mb-3"
                id={`post-title-${post.id}`}
                style={{
                  fontFamily: "Figtree, sans-serif",
                  color: "#333333",
                  lineHeight: 1.3,
                }}
                dangerouslySetInnerHTML={{ __html: safeTitle }}
              />

              {/* Date */}
              <p
                className="text-sm mb-4"
                style={{ color: "#5E5E5E", fontFamily: "Figtree, sans-serif" }}
              >
                Posted on {formatDate(post.publishDate)}.
              </p>

              {/* Excerpt */}
              <p
                className="text-base leading-relaxed mb-4"
                style={{
                  color: "#333333",
                  fontFamily: "Figtree, sans-serif",
                }}
                dangerouslySetInnerHTML={{ __html: safeExcerpt }}
              />

              {/* Learn More text */}
              <span
                className="inline-flex items-center text-[#0205B7] font-medium"
                style={{ fontFamily: "Figtree, sans-serif" }}
              >
                Learn More
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </div>

            {/* Social icons */}
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Add share functionality here
                }}
                className="text-gray-600 hover:text-[#0205B7] transition-colors"
                aria-label="Share on LinkedIn"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Add share functionality here
                }}
                className="text-gray-600 hover:text-[#0205B7] transition-colors"
                aria-label="Share on Facebook"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Add share functionality here
                }}
                className="text-gray-600 hover:text-[#0205B7] transition-colors"
                aria-label="Share on X"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Add share functionality here
                }}
                className="text-gray-600 hover:text-[#0205B7] transition-colors"
                aria-label="Share on Instagram"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};

BlogCard.displayName = "BlogCard";
