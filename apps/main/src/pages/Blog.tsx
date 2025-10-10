/**
 * Blog Listing Page
 *
 * Main blog page displaying all posts with search functionality.
 * Features hero section, search bar, and responsive post grid.
 */

import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import {
  BlogHero,
  BlogSearch,
  BlogGrid,
  useBlogPosts,
  BookSessionCTA,
} from "@reiki-goddess/shared-components";
import PageTransition from "../components/PageTransition";

function Blog() {
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all posts
  const { posts: allPosts, loading, error } = useBlogPosts();

  // Filter posts based on search query
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) {
      return allPosts;
    }

    const query = searchQuery.toLowerCase();
    return allPosts.filter((post) => {
      const authorName =
        typeof post.author === "string" ? post.author : post.author?.name || "";
      return (
        post.title?.toLowerCase().includes(query) ||
        post.excerpt?.toLowerCase().includes(query) ||
        post.category?.toLowerCase().includes(query) ||
        authorName.toLowerCase().includes(query)
      );
    });
  }, [allPosts, searchQuery]);

  return (
    <PageTransition>
      <Helmet>
        <title>Healing Insights Blog | The Reiki Goddess Healing</title>
        <meta
          name="description"
          content="Explore articles, insights, and guidance on your healing journey. Learn about Reiki, sound healing, wellness practices, and spiritual growth."
        />
        <meta property="og:title" content="Healing Insights Blog" />
        <meta
          property="og:description"
          content="Articles and insights on energy healing, wellness, and spiritual growth"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://thereikigoddesshealing.com/blog"
        />
        <link rel="canonical" href="https://thereikigoddesshealing.com/blog" />
      </Helmet>

      <div className="min-h-screen" style={{ backgroundColor: "#FFFBF5" }}>
        {/* Main Container with shadow effect matching homepage */}
        <div
          className="relative mx-auto overflow-hidden"
          style={{
            maxWidth: "1440px",
            margin: "0 auto",
            backgroundColor: "#FFFBF5",
            boxShadow: "0 0 40px rgba(0, 0, 0, 0.1)",
          }}
        >
          <BlogHero />

          <BlogSearch
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search"
          />

          <div style={{ padding: "0 66px" }}>
            <BlogGrid
              posts={filteredPosts}
              loading={loading}
              error={error}
              emptyMessage={
                searchQuery
                  ? `No posts found matching "${searchQuery}".`
                  : "No blog posts available yet. Check back soon!"
              }
            />
          </div>

          {/* CTA Section */}
          <div className="px-[66px] py-[100px] md:px-5 md:py-12">
            <BookSessionCTA />
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default Blog;
