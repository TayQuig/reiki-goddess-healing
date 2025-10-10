/**
 * Blog Post Detail Page
 *
 * Individual blog post page with full content, author bio, and related posts.
 * Features breadcrumb navigation, social sharing, and newsletter CTA.
 */

import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { type BlogPost as BlogPostType } from "@reiki-goddess/shared-components";
import { BlogService } from "@reiki-goddess/shared-utils";
import PageTransition from "../components/PageTransition";

function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadPost() {
      if (!slug) {
        navigate("/blog");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch post by slug
        const fetchedPost = await BlogService.getPostBySlug(slug);

        if (!fetchedPost) {
          // Post not found - redirect to blog listing after delay
          setError(new Error("Post not found"));
          setTimeout(() => navigate("/blog"), 3000);
          return;
        }

        setPost(fetchedPost);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load post"));
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [slug, navigate]);

  // Loading state
  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-[#FFFBF5] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-[#0205B7]/20 border-t-[#0205B7] rounded-full animate-spin mb-4" />
            <p className="text-lg text-gray-600">Loading post...</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  // Error state
  if (error || !post) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-[#FFFBF5] flex items-center justify-center">
          <div className="text-center max-w-md px-4">
            <h1 className="text-4xl font-bold text-[#0205B7] mb-4">
              Post Not Found
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              {error?.message ||
                "The blog post you are looking for does not exist."}
            </p>
            <p className="text-sm text-gray-500 mb-8">
              Redirecting you to the blog listing...
            </p>
            <Link
              to="/blog"
              className="inline-block px-6 py-3 bg-[#0205B7] text-white rounded-full font-medium hover:bg-[#0205B7]/90 transition-colors"
            >
              Back to Blog
            </Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  // Extract author name for metadata display
  const authorName =
    typeof post.author === "string" ? post.author : post.author.name;

  return (
    <PageTransition>
      <div className="min-h-screen" style={{ backgroundColor: "#FFFBF5" }}>
        {/* Main Container with shadow effect matching homepage */}
        <article
          className="relative mx-auto overflow-hidden"
          style={{
            maxWidth: "1440px",
            margin: "0 auto",
            backgroundColor: "#FFFBF5",
            boxShadow: "0 0 40px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Breadcrumb Navigation */}
          <nav
            aria-label="Breadcrumb"
            className="bg-white border-b border-gray-200 px-[66px] py-4 md:px-5"
          >
            <ol className="flex gap-2 text-sm text-gray-600">
              <li>
                <Link to="/" className="hover:text-[#0205B7] transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  to="/blog"
                  className="hover:text-[#0205B7] transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-gray-900 font-medium" aria-current="page">
                {post.title}
              </li>
            </ol>
          </nav>

          {/* Hero Section */}
          <header className="relative h-[500px] md:h-[300px] overflow-hidden">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 px-[66px] py-12 md:px-5 md:py-6">
              <div className="max-w-4xl">
                <span className="inline-block px-4 py-1 bg-[#0205B7] text-white text-sm font-medium rounded-full mb-4">
                  {post.category}
                </span>
                <h1 className="text-5xl font-bold text-white mb-4 md:text-3xl">
                  {post.title}
                </h1>
                <div className="flex items-center gap-4 text-white/90 text-sm">
                  <span>{authorName}</span>
                  <span aria-hidden="true">•</span>
                  <time dateTime={post.publishDate}>
                    {new Date(post.publishDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <span aria-hidden="true">•</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto px-[66px] py-12 md:px-5 md:py-8">
            {/* Post Excerpt */}
            <p className="text-xl text-gray-700 mb-8 leading-relaxed italic border-l-4 border-[#0205B7] pl-6">
              {post.excerpt}
            </p>

            {/* Post Content */}
            <div
              className="prose prose-lg max-w-none
              prose-headings:text-[#0205B7] prose-headings:font-bold
              prose-p:text-gray-700 prose-p:leading-relaxed
              prose-a:text-[#0205B7] prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900 prose-strong:font-semibold
              prose-ul:list-disc prose-ol:list-decimal
              prose-li:text-gray-700
              prose-blockquote:border-l-4 prose-blockquote:border-[#A593E0] prose-blockquote:pl-6 prose-blockquote:italic
            "
            >
              {/* Render markdown content - for now showing as plain text */}
              {post.content
                .split("\n\n")
                .map((paragraph: string, index: number) => (
                  <p key={index}>{paragraph}</p>
                ))}
            </div>
          </div>

          {/* Back to Blog CTA */}
          <div className="py-12 px-[66px] md:px-5 text-center">
            <Link
              to="/blog"
              className="inline-block px-8 py-3 bg-[#0205B7] text-white rounded-full font-medium hover:bg-[#0205B7]/90 transition-colors"
            >
              ← Back to All Posts
            </Link>
          </div>
        </article>
      </div>
    </PageTransition>
  );
}

export default BlogPost;
