/**
 * useBlogPosts Hook
 *
 * Custom React hook for fetching and managing blog post data.
 * Provides loading states, error handling, and automatic refresh capability.
 */

import { useState, useEffect, useCallback } from "react";
import { BlogService } from "@reiki-goddess/shared-utils";
import type { BlogPost, BlogFilters } from "../types";

export interface UseBlogPostsResult {
  /**
   * Array of blog posts
   */
  posts: BlogPost[];

  /**
   * Loading state indicator
   */
  loading: boolean;

  /**
   * Error object if fetch failed
   */
  error: Error | null;

  /**
   * Function to manually refresh blog posts
   */
  refresh: () => Promise<void>;
}

/**
 * Hook for fetching blog posts with optional filtering
 *
 * @param filters - Optional filters to apply to blog posts
 * @returns Object containing posts, loading state, error, and refresh function
 *
 * @example
 * ```tsx
 * const { posts, loading, error, refresh } = useBlogPosts({ category: 'healing' });
 *
 * if (loading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error.message}</div>;
 *
 * return (
 *   <div>
 *     {posts.map(post => <BlogCard key={post.id} post={post} />)}
 *     <button onClick={refresh}>Refresh</button>
 *   </div>
 * );
 * ```
 */
export function useBlogPosts(filters?: BlogFilters): UseBlogPostsResult {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const fetchedPosts = await BlogService.getPosts(filters);
      setPosts(fetchedPosts);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch blog posts")
      );
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const refresh = useCallback(async () => {
    await fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    loading,
    error,
    refresh,
  };
}
