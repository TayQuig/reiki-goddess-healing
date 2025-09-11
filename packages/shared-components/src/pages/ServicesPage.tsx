import React from "react";
import { ResponsiveContainer } from "../ResponsiveContainer/ResponsiveContainer";
import { ServicesSection } from "../Services/ServicesSection";
import { BookSessionCTA } from "../BookSessionCTA";
import { AnimatedSection } from "../AnimatedSection";

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

      {/* CTA Section */}
      <AnimatedSection delay={0.4}>
        <div className="max-w-[1440px] mx-auto px-[66px] py-[161px]">
          <BookSessionCTA />
        </div>
      </AnimatedSection>
    </div>
  );
};
