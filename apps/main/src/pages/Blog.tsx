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

          {/* Wrapper with relative positioning for smoke effects */}
          <div style={{ position: "relative", zIndex: 1 }}>
            {/* Smoke effects behind search bar and first blog post - 7 layer for enhanced visibility */}
            {filteredPosts.length > 0 && (
              <>
                {/* Left smoke puff */}
                <div
                  style={{
                    position: "absolute",
                    left: "-196px",
                    top: "-100px",
                    width: "808px",
                    height: "808px",
                    pointerEvents: "none",
                    zIndex: -1,
                  }}
                  aria-hidden="true"
                >
                  <img
                    src="/img/smoke.png"
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      position: "absolute",
                      opacity: 0.4,
                      transform: "rotate(0deg)",
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <img
                    src="/img/smoke.png"
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      position: "absolute",
                      opacity: 0.35,
                      transform: "rotate(0deg)",
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <img
                    src="/img/smoke.png"
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      position: "absolute",
                      opacity: 0.3,
                      transform: "rotate(0deg)",
                      filter: "saturate(150%)",
                      mixBlendMode: "multiply",
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <img
                    src="/img/smoke.png"
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      position: "absolute",
                      opacity: 0.25,
                      transform: "rotate(0deg)",
                      filter: "saturate(130%)",
                      mixBlendMode: "multiply",
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <img
                    src="/img/smoke.png"
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      position: "absolute",
                      opacity: 0.2,
                      transform: "rotate(0deg)",
                      filter: "saturate(200%) hue-rotate(-10deg)",
                      mixBlendMode: "overlay",
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <img
                    src="/img/smoke.png"
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      position: "absolute",
                      opacity: 0.18,
                      transform: "rotate(0deg)",
                      filter: "saturate(180%) hue-rotate(-5deg)",
                      mixBlendMode: "overlay",
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <img
                    src="/img/smoke.png"
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      position: "absolute",
                      opacity: 0.15,
                      transform: "rotate(0deg)",
                      filter: "saturate(120%)",
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>

                {/* Right smoke puff */}
                <div
                  style={{
                    position: "absolute",
                    right: "-196px",
                    top: "-100px",
                    width: "808px",
                    height: "808px",
                    pointerEvents: "none",
                    zIndex: -1,
                  }}
                  aria-hidden="true"
                >
                  <img
                    src="/img/smoke.png"
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      position: "absolute",
                      opacity: 0.4,
                      transform: "rotate(-180deg)",
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <img
                    src="/img/smoke.png"
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      position: "absolute",
                      opacity: 0.35,
                      transform: "rotate(-180deg)",
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <img
                    src="/img/smoke.png"
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      position: "absolute",
                      opacity: 0.3,
                      transform: "rotate(-180deg)",
                      filter: "saturate(150%)",
                      mixBlendMode: "multiply",
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <img
                    src="/img/smoke.png"
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      position: "absolute",
                      opacity: 0.25,
                      transform: "rotate(-180deg)",
                      filter: "saturate(130%)",
                      mixBlendMode: "multiply",
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <img
                    src="/img/smoke.png"
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      position: "absolute",
                      opacity: 0.2,
                      transform: "rotate(-180deg)",
                      filter: "saturate(200%) hue-rotate(-10deg)",
                      mixBlendMode: "overlay",
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <img
                    src="/img/smoke.png"
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      position: "absolute",
                      opacity: 0.18,
                      transform: "rotate(-180deg)",
                      filter: "saturate(180%) hue-rotate(-5deg)",
                      mixBlendMode: "overlay",
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <img
                    src="/img/smoke.png"
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      position: "absolute",
                      opacity: 0.15,
                      transform: "rotate(-180deg)",
                      filter: "saturate(120%)",
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>

                {/* Center smoke puff */}
                <div
                  style={{
                    position: "absolute",
                    left: "412px",
                    top: "1861px",
                    width: "808px",
                    height: "729px",
                    pointerEvents: "none",
                    zIndex: -1,
                  }}
                  aria-hidden="true"
                >
                  <img
                    src="/img/smoke.png"
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      position: "absolute",
                      opacity: 0.4,
                      transform: "rotate(0deg)",
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <img
                    src="/img/smoke.png"
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      position: "absolute",
                      opacity: 0.35,
                      transform: "rotate(0deg)",
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <img
                    src="/img/smoke.png"
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      position: "absolute",
                      opacity: 0.3,
                      transform: "rotate(0deg)",
                      filter: "saturate(150%)",
                      mixBlendMode: "multiply",
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <img
                    src="/img/smoke.png"
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      position: "absolute",
                      opacity: 0.25,
                      transform: "rotate(0deg)",
                      filter: "saturate(130%)",
                      mixBlendMode: "multiply",
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <img
                    src="/img/smoke.png"
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      position: "absolute",
                      opacity: 0.2,
                      transform: "rotate(0deg)",
                      filter: "saturate(200%) hue-rotate(-10deg)",
                      mixBlendMode: "overlay",
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <img
                    src="/img/smoke.png"
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      position: "absolute",
                      opacity: 0.18,
                      transform: "rotate(0deg)",
                      filter: "saturate(180%) hue-rotate(-5deg)",
                      mixBlendMode: "overlay",
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <img
                    src="/img/smoke.png"
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      position: "absolute",
                      opacity: 0.15,
                      transform: "rotate(0deg)",
                      filter: "saturate(120%)",
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              </>
            )}

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
          </div>

          {/* CTA Section with fourth smoke */}
          <div className="relative">
            {/* Fourth smoke puff - positioned near footer */}
            {filteredPosts.length > 0 && (
              <div
                style={{
                  position: "absolute",
                  left: "658px",
                  top: "-200px",
                  width: "808px",
                  height: "808px",
                  pointerEvents: "none",
                  zIndex: 0,
                }}
                aria-hidden="true"
              >
                <img
                  src="/img/smoke.png"
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    position: "absolute",
                    opacity: 0.4,
                    transform: "rotate(-180deg)",
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <img
                  src="/img/smoke.png"
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    position: "absolute",
                    opacity: 0.35,
                    transform: "rotate(-180deg)",
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <img
                  src="/img/smoke.png"
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    position: "absolute",
                    opacity: 0.3,
                    transform: "rotate(-180deg)",
                    filter: "saturate(150%)",
                    mixBlendMode: "multiply",
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <img
                  src="/img/smoke.png"
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    position: "absolute",
                    opacity: 0.25,
                    transform: "rotate(-180deg)",
                    filter: "saturate(130%)",
                    mixBlendMode: "multiply",
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <img
                  src="/img/smoke.png"
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    position: "absolute",
                    opacity: 0.2,
                    transform: "rotate(-180deg)",
                    filter: "saturate(200%) hue-rotate(-10deg)",
                    mixBlendMode: "overlay",
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <img
                  src="/img/smoke.png"
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    position: "absolute",
                    opacity: 0.18,
                    transform: "rotate(-180deg)",
                    filter: "saturate(180%) hue-rotate(-5deg)",
                    mixBlendMode: "overlay",
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <img
                  src="/img/smoke.png"
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    position: "absolute",
                    opacity: 0.15,
                    transform: "rotate(-180deg)",
                    filter: "saturate(120%)",
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}
            <div className="px-[66px] py-[100px] md:px-5 md:py-12">
              <BookSessionCTA />
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default Blog;
