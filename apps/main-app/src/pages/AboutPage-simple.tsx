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

const SimpleAboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <HeaderSection
        navigationItems={createNavigationItems("/about")}
        brand={brandConfig}
      />

      {/* Main Content */}
      <ResponsiveContainer variant="page" className="pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
              About Deirdre Quigley
            </h1>

            <p className="text-lg text-gray-700 leading-relaxed">
              Welcome! I&apos;m Deirdre Quigley, the founder of The Reiki
              Goddess Healing in Roy, Washington. With years of experience in
              energy healing and holistic wellness, I blend the gentle art of
              Reiki with transformative sound therapy.
            </p>

            <p className="text-lg text-gray-700 leading-relaxed">
              My approach is warm, intuitive, and personalized — ensuring every
              session supports your unique journey toward healing and
              self-discovery.
            </p>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-700 text-white rounded-full font-medium hover:bg-blue-800 transition-colors"
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
          </div>

          <div className="relative">
            <img
              className="w-full max-w-md mx-auto rounded-lg shadow-lg"
              alt="Deirdre Quigley, Reiki Master"
              src="/img/rectangle-5.png"
            />
          </div>
        </div>

        {/* Credentials */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-blue-700 to-cyan-400 text-white p-6 rounded-2xl">
            <h3 className="text-lg font-bold mb-2">Sound Healing Specialist</h3>
            <p>Skilled in using vibration and frequency for deep relaxation.</p>
          </div>

          <div className="bg-white border p-6 rounded-2xl shadow-lg">
            <h3 className="text-lg font-bold mb-2">Years of Experience</h3>
            <p className="text-gray-600">
              Supporting clients in emotional, physical, and spiritual growth.
            </p>
          </div>

          <div className="bg-white border p-6 rounded-2xl shadow-lg">
            <h3 className="text-lg font-bold mb-2">Certified Reiki Master</h3>
            <p className="text-gray-600">
              Advanced training in energy healing techniques.
            </p>
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

export { SimpleAboutPage };
