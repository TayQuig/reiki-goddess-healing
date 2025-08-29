import React from "react";
import { ResponsiveContainer } from "../ResponsiveContainer/ResponsiveContainer";
import { CommunityEvents } from "../CommunityEvents/CommunityEvents";

/**
 * EventsPage - Events page component
 * Features the community events section with upcoming workshops and events
 */
export const EventsPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <ResponsiveContainer className="py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Events & Workshops
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join our healing community for transformative workshops, sound
            baths, and special events designed to support your wellness journey.
          </p>
        </div>
      </ResponsiveContainer>

      {/* Community Events Section */}
      <CommunityEvents />

      {/* Additional Event Information */}
      <ResponsiveContainer className="py-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Stay Connected
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter to receive updates about upcoming
            events, workshops, and special healing opportunities.
          </p>
          <button className="bg-purple-600 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-purple-700 transition-colors">
            Subscribe to Updates
          </button>
        </div>
      </ResponsiveContainer>
    </div>
  );
};
