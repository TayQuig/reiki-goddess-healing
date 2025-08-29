import React from "react";
import { ResponsiveContainer } from "../ResponsiveContainer/ResponsiveContainer";
import { ServicesSection } from "../Services/ServicesSection";

/**
 * ServicesPage - Services page component
 * Enhanced version of the homepage services section with additional details
 */
export const ServicesPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <ResponsiveContainer className="py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Healing Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover transformative energy healing services designed to restore
            balance, promote wellness, and support your spiritual journey.
          </p>
        </div>
      </ResponsiveContainer>

      {/* Services Section */}
      <ServicesSection />

      {/* Additional Information */}
      <ResponsiveContainer className="py-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Ready to Begin Your Healing Journey?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Book your session today and experience the transformative power of
            energy healing in a safe, nurturing environment.
          </p>
          <button className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-blue-700 transition-colors">
            Schedule Your Session
          </button>
        </div>
      </ResponsiveContainer>
    </div>
  );
};
