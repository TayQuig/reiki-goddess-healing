/**
 * BlogGrid Component Types
 */

import type { BlogPost } from "../types";

export interface BlogGridProps {
  /**
   * Array of blog posts to display
   */
  posts: BlogPost[];

  /**
   * Loading state
   */
  loading?: boolean;

  /**
   * Error state
   */
  error?: Error | null;

  /**
   * Empty state message
   */
  emptyMessage?: string;

  /**
   * Additional CSS classes
   */
  className?: string;
}
