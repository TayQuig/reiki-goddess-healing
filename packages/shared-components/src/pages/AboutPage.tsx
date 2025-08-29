import React from "react";
import { ResponsiveContainer } from "../ResponsiveContainer/ResponsiveContainer";

/**
 * AboutPage - About page component (placeholder)
 * Will be migrated from legacy About/ directory
 */
export const AboutPage: React.FC = () => {
  return (
    <ResponsiveContainer className="py-20">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          About The Reiki Goddess
        </h1>
        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-gray-600 mb-6">
            Welcome to The Reiki Goddess Healing. Our founder, Deirdre, brings
            years of experience in energy healing, Reiki therapy, and holistic
            wellness practices.
          </p>
          <p className="text-lg text-gray-600 mb-6">
            Based in Roy, Washington, we offer a sanctuary for healing,
            transformation, and spiritual growth through various energy healing
            modalities.
          </p>
          <div className="bg-blue-50 p-6 rounded-lg">
            <p className="text-blue-700 font-medium">
              🚧 This page is being migrated from the legacy About section. Full
              content and design coming soon!
            </p>
          </div>
        </div>
      </div>
    </ResponsiveContainer>
  );
};
