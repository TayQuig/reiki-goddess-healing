import React from 'react';
import { Link } from 'react-router-dom';
import { HeaderSection, FooterSection, ResponsiveContainer } from '@reiki-goddess/shared-components';
import { businessData } from '@reiki-goddess/shared-utils';
import { createNavigationItems, footerSections, socialLinks, brandConfig, copyrightConfig } from '../utils/navigationData';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fefbf5]">
      {/* Header */}
      <HeaderSection 
        navigationItems={createNavigationItems('/privacy')}
        brand={brandConfig}
      />

      {/* Content */}
      <ResponsiveContainer variant="page" className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Privacy Policy
            </h1>
            <p className="text-lg text-gray-600">
              Last updated: January 2025
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
            
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Our Commitment to Privacy</h2>
              <p className="text-gray-700 leading-relaxed">
                At The Reiki Goddess Healing, we are committed to protecting your privacy and personal information. 
                This Privacy Policy explains how we collect, use, protect, and handle your personal data when you 
                visit our website or use our services.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-gray-800">Information You Provide</h3>
              <ul className="space-y-2 ml-6 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-700 mt-1">•</span>
                  <span>Contact information (name, email, phone number) when you fill out our contact form</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-700 mt-1">•</span>
                  <span>Health and wellness information you share during consultations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-700 mt-1">•</span>
                  <span>Payment information for session bookings (processed securely by third-party processors)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-700 mt-1">•</span>
                  <span>Any other information you voluntarily provide</span>
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800">Information Automatically Collected</h3>
              <ul className="space-y-2 ml-6 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-700 mt-1">•</span>
                  <span>Website usage data (pages visited, time spent, browser type)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-700 mt-1">•</span>
                  <span>IP address and device information</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-700 mt-1">•</span>
                  <span>Cookies and similar tracking technologies</span>
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">How We Use Your Information</h2>
              <ul className="space-y-2 ml-6 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-700 mt-1">•</span>
                  <span>To respond to your inquiries and provide customer support</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-700 mt-1">•</span>
                  <span>To schedule and conduct healing sessions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-700 mt-1">•</span>
                  <span>To process payments for our services</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-700 mt-1">•</span>
                  <span>To maintain client records and session history</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-700 mt-1">•</span>
                  <span>To send you newsletters and updates (with your consent)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-700 mt-1">•</span>
                  <span>To improve our website and services</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-700 mt-1">•</span>
                  <span>To comply with legal obligations</span>
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Information Sharing and Disclosure</h2>
              <p className="text-gray-700 leading-relaxed">
                We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:
              </p>
              <ul className="space-y-2 ml-6 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-700 mt-1">•</span>
                  <span>Service providers who assist us in operating our website and conducting business</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-700 mt-1">•</span>
                  <span>When required by law or to protect our rights and safety</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-700 mt-1">•</span>
                  <span>With your explicit consent</span>
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Data Security</h2>
              <p className="text-gray-700 leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Cookies and Tracking</h2>
              <p className="text-gray-700 leading-relaxed">
                Our website uses cookies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie settings through your browser preferences. Some features may not function properly if cookies are disabled.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Your Rights</h2>
              <p className="text-gray-700 leading-relaxed">
                Depending on your location, you may have the following rights regarding your personal information:
              </p>
              <ul className="space-y-2 ml-6 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-700 mt-1">•</span>
                  <span>Access your personal data</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-700 mt-1">•</span>
                  <span>Correct inaccurate data</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-700 mt-1">•</span>
                  <span>Request deletion of your data</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-700 mt-1">•</span>
                  <span>Object to processing of your data</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-700 mt-1">•</span>
                  <span>Request data portability</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-700 mt-1">•</span>
                  <span>Withdraw consent at any time</span>
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                To exercise these rights, please contact us using the information provided below.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Data Retention</h2>
              <p className="text-gray-700 leading-relaxed">
                We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, comply with legal obligations, resolve disputes, and enforce our agreements.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Children's Privacy</h2>
              <p className="text-gray-700 leading-relaxed">
                Our services are not intended for children under 18 years of age. We do not knowingly collect personal information from children under 18. If we become aware that we have collected such information, we will take steps to delete it.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Changes to This Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Contact Us</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-blue-50 rounded-lg p-6 space-y-2">
                <p className="text-gray-700">
                  <strong>The Reiki Goddess Healing</strong>
                </p>
                <p className="text-gray-700">
                  Email: thereikigoddesshealing@gmail.com
                </p>
                <p className="text-gray-700">
                  Phone: 0300 0000 0000
                </p>
                <p className="text-gray-700">
                  Location: Roy, Washington
                </p>
              </div>
            </section>

          </div>

          {/* Navigation */}
          <div className="text-center pt-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-700 text-white rounded-full font-medium hover:bg-blue-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Return to Home
            </Link>
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
          address: businessData.location
        }}
      />
    </div>
  );
};

export { PrivacyPolicyPage };