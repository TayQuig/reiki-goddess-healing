import React from "react";
import { Link } from "react-router-dom";
import {
  HeaderSection,
  FooterSection,
  ResponsiveContainer,
} from "@reiki-goddess/shared-components";
import { businessData } from "@reiki-goddess/shared-utils";
import {
  createNavigationItems,
  footerSections,
  socialLinks,
  brandConfig,
  copyrightConfig,
} from "../utils/navigationData";

const BlogPage: React.FC = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Understanding Reiki: A Beginner's Guide to Energy Healing",
      excerpt:
        "Discover what Reiki is, how it works, and what to expect during your first session. Learn about the ancient Japanese healing technique that's helping millions find peace and balance.",
      date: "2024-12-15",
      readTime: "5 min read",
      image: "/img/rectangle-5.png",
      category: "Reiki Basics",
      featured: true,
    },
    {
      id: 2,
      title:
        "The Science Behind Sound Healing: How Vibrations Transform Wellness",
      excerpt:
        "Explore the fascinating research behind sound therapy and how specific frequencies can promote healing, reduce stress, and improve overall well-being.",
      date: "2024-12-10",
      readTime: "7 min read",
      image: "/img/rectangle-6.png",
      category: "Sound Therapy",
    },
    {
      id: 3,
      title: "Preparing for Your First Reiki Session: What to Expect",
      excerpt:
        "A comprehensive guide to help you prepare for your first Reiki experience, including what happens during a session and how to maximize the benefits.",
      date: "2024-12-05",
      readTime: "4 min read",
      image: "/img/rectangle-7.png",
      category: "Getting Started",
    },
    {
      id: 4,
      title: "The Chakra System: Understanding Your Body's Energy Centers",
      excerpt:
        "Learn about the seven main chakras, their functions, and how Reiki can help balance these vital energy centers for optimal health and vitality.",
      date: "2024-11-28",
      readTime: "6 min read",
      image: "/img/rectangle-8.png",
      category: "Energy Work",
    },
    {
      id: 5,
      title:
        "Stress Relief Through Energy Healing: Natural Solutions for Modern Life",
      excerpt:
        "Discover how Reiki and sound healing can provide natural, effective relief from stress, anxiety, and the pressures of daily life.",
      date: "2024-11-20",
      readTime: "5 min read",
      image: "/img/rectangle-10.png",
      category: "Wellness",
    },
    {
      id: 6,
      title: "Creating Sacred Space: Setting Intentions for Healing",
      excerpt:
        "Learn how to create a peaceful environment and set clear intentions to enhance your healing journey and spiritual growth.",
      date: "2024-11-15",
      readTime: "4 min read",
      image: "/img/rectangle-12.png",
      category: "Spiritual Growth",
    },
  ];

  const categories = [
    "All",
    "Reiki Basics",
    "Sound Therapy",
    "Getting Started",
    "Energy Work",
    "Wellness",
    "Spiritual Growth",
  ];
  const [selectedCategory, setSelectedCategory] = React.useState("All");

  const filteredPosts =
    selectedCategory === "All"
      ? blogPosts
      : blogPosts.filter((post) => post.category === selectedCategory);

  const featuredPost = blogPosts.find((post) => post.featured);

  return (
    <div className="min-h-screen bg-[#fefbf5]">
      {/* Header */}
      <HeaderSection
        navigationItems={createNavigationItems("/blog")}
        brand={brandConfig}
      />

      {/* Hero Section */}
      <ResponsiveContainer variant="page" className="pt-24 pb-16">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
            Healing Insights &amp; Wisdom
          </h1>

          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Discover the transformative power of energy healing through articles
            about Reiki, sound therapy, holistic wellness, and spiritual growth.
            Your journey to inner peace starts here.
          </p>
        </div>
      </ResponsiveContainer>

      {/* Featured Post */}
      {featuredPost && (
        <ResponsiveContainer variant="page" className="pb-16">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="relative h-64 lg:h-full">
                <img
                  className="w-full h-full object-cover"
                  src={featuredPost.image}
                  alt={featuredPost.title}
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-700 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Featured
                  </span>
                </div>
              </div>

              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                      {featuredPost.category}
                    </span>
                    <span>{featuredPost.date}</span>
                    <span>{featuredPost.readTime}</span>
                  </div>

                  <h2 className="text-3xl font-bold text-gray-900 leading-tight">
                    {featuredPost.title}
                  </h2>

                  <p className="text-gray-700 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>

                  <Link
                    to={`/blog/${featuredPost.id}`}
                    className="inline-flex items-center gap-2 text-blue-700 font-medium hover:text-blue-800 transition-colors"
                  >
                    Read Full Article
                    <svg
                      className="w-4 h-4"
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
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </ResponsiveContainer>
      )}

      {/* Category Filter */}
      <ResponsiveContainer variant="page" className="pb-8">
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-blue-700 text-white"
                  : "bg-white text-gray-700 hover:bg-blue-50 shadow-sm"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </ResponsiveContainer>

      {/* Blog Posts Grid */}
      <ResponsiveContainer variant="page" className="pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts
            .filter((post) => !post.featured)
            .map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div className="relative h-48">
                  <img
                    className="w-full h-full object-cover"
                    src={post.image}
                    alt={post.title}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white bg-opacity-90 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 leading-tight hover:text-blue-700 transition-colors">
                    <Link to={`/blog/${post.id}`}>{post.title}</Link>
                  </h3>

                  <p className="text-gray-700 leading-relaxed">
                    {post.excerpt}
                  </p>

                  <Link
                    to={`/blog/${post.id}`}
                    className="inline-flex items-center gap-2 text-blue-700 font-medium hover:text-blue-800 transition-colors"
                  >
                    Read More
                    <svg
                      className="w-4 h-4"
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
                  </Link>
                </div>
              </article>
            ))}
        </div>
      </ResponsiveContainer>

      {/* Newsletter Signup */}
      <ResponsiveContainer variant="page" className="pb-20">
        <div className="bg-gradient-to-br from-blue-700 to-cyan-400 rounded-2xl p-12 text-center text-white">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">
              Stay Connected to Your Healing Journey
            </h2>

            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Subscribe to receive weekly insights, healing tips, and updates
              about new blog posts and special offers on Reiki sessions.
            </p>

            <div className="max-w-md mx-auto">
              <div className="flex gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button className="px-6 py-3 bg-white text-blue-700 rounded-full font-medium hover:bg-gray-100 transition-colors">
                  Subscribe
                </button>
              </div>
              <p className="text-sm opacity-80 mt-2">
                No spam, unsubscribe anytime. Your privacy is important to us.
              </p>
            </div>
          </div>
        </div>
      </ResponsiveContainer>

      {/* Call to Action */}
      <ResponsiveContainer variant="page" className="pb-20">
        <div className="bg-amber-50 rounded-2xl p-12 text-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">
              Ready to Experience Healing for Yourself?
            </h2>

            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Reading about healing is just the beginning. Take the next step
              and experience the transformative power of Reiki and sound therapy
              in person.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-700 text-white rounded-full font-medium hover:bg-blue-800 transition-colors"
              >
                Book Your Session
                <svg
                  className="w-4 h-4"
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
              </Link>

              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-8 py-4 border border-blue-700 text-blue-700 rounded-full font-medium hover:bg-blue-700 hover:text-white transition-colors"
              >
                Learn About Deirdre
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </ResponsiveContainer>

      {/* Footer */}
      <FooterSection
        sections={footerSections}
        copyright={copyrightConfig}
        socialLinks={socialLinks}
        contact={{
          phone: businessData.phone,
          email: businessData.email,
          address: businessData.location,
        }}
      />
    </div>
  );
};

export { BlogPage };
