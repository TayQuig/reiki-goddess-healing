import React from "react";
import { ResponsiveContainer } from "../ResponsiveContainer/ResponsiveContainer";

/**
 * BlogPage - Blog page component (placeholder)
 * Will be migrated from legacy BLog/ directory
 */
export const BlogPage: React.FC = () => {
  return (
    <ResponsiveContainer className="py-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            Healing Insights
          </h1>
          <p className="text-lg text-gray-600">
            Explore articles, insights, and guidance on your healing journey
            from The Reiki Goddess community.
          </p>
        </div>

        {/* Placeholder Blog Posts */}
        <div className="grid gap-8">
          <article className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Understanding Energy Healing: A Beginner&apos;s Guide
              </h2>
              <p className="text-gray-600 mb-4">
                Discover the fundamentals of energy healing and how it can
                support your physical, emotional, and spiritual well-being...
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>By Deirdre, The Reiki Goddess</span>
                <span>Coming Soon</span>
              </div>
            </div>
          </article>

          <article className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                The Power of Sound Healing in Modern Wellness
              </h2>
              <p className="text-gray-600 mb-4">
                Explore how sound therapy and vibrational healing can create
                profound shifts in your energy and consciousness...
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>By Deirdre, The Reiki Goddess</span>
                <span>Coming Soon</span>
              </div>
            </div>
          </article>

          <div className="bg-blue-50 p-8 rounded-lg text-center">
            <p className="text-blue-700 font-medium">
              🚧 Blog content is being migrated from the legacy BLog section.
              Articles and insights coming soon!
            </p>
          </div>
        </div>
      </div>
    </ResponsiveContainer>
  );
};
