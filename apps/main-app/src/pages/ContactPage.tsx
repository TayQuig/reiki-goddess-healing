import React from "react";
import {
  HeaderSection,
  FooterSection,
  ResponsiveContainer,
  SecureContactForm,
} from "@reiki-goddess/shared-components";
import { businessData } from "@reiki-goddess/shared-utils";
import {
  createNavigationItems,
  footerSections,
  socialLinks,
  brandConfig,
  copyrightConfig,
} from "../utils/navigationData";

const ContactPage: React.FC = () => {
  const contactInfo = [
    {
      id: "location",
      title: "Our Location",
      icon: "📍",
      content: "Roy, Washington",
      actionText: "Get Directions",
      href: "https://maps.google.com/?q=Roy,Washington",
    },
    {
      id: "phone",
      title: "Our Phone",
      icon: "📞",
      content: "0300 0000 0000",
      actionText: "Call Us",
      href: "tel:+13000000000",
    },
    {
      id: "email",
      title: "Our Email",
      icon: "✉️",
      content: "thereikigoddesshealing@gmail.com",
      actionText: "Email Us",
      href: "mailto:thereikigoddesshealing@gmail.com",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fffcf6]">
      {/* Header */}
      <HeaderSection
        navigationItems={createNavigationItems("/contact")}
        brand={brandConfig}
      />

      {/* Hero Section */}
      <ResponsiveContainer variant="page" className="pt-24 pb-16">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
            Get in Touch
          </h1>

          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Have questions or want to book a session? We&apos;re here to help.
          </p>
        </div>
      </ResponsiveContainer>

      {/* Contact Form & Info Section */}
      <ResponsiveContainer variant="page" className="py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">
                Contact Information
              </h2>

              <p className="text-lg text-gray-700 leading-relaxed">
                Ready to begin your healing journey? Reach out to schedule your
                personalized Reiki and sound healing session. I&apos;m here to
                answer any questions and help you find the path to inner peace
                and wellness.
              </p>
            </div>

            {/* Contact Info Cards */}
            <div className="space-y-6">
              {contactInfo.map((info) => (
                <div
                  key={info.id}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border-b-4 border-blue-700"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{info.icon}</span>
                      <h3 className="text-lg font-bold text-gray-900">
                        {info.title}
                      </h3>
                    </div>

                    <p className="text-gray-700 ml-12">{info.content}</p>

                    <a
                      href={info.href}
                      className="inline-flex items-center gap-2 ml-12 text-blue-700 font-medium hover:text-blue-800 transition-colors"
                    >
                      {info.actionText}
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
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Hours of Operation */}
            <div className="bg-amber-50 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Hours of Operation
              </h3>
              <div className="space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <span>Monday - Friday:</span>
                  <span>9:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday:</span>
                  <span>9:00 AM - 3:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday:</span>
                  <span>Closed</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                * Evening and weekend appointments available by special
                arrangement
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  Send Us a Message
                </h2>
                <p className="text-gray-600">
                  Fill out the form below and we&apos;ll get back to you within
                  24 hours
                </p>
              </div>

              {/* Secure Contact Form Component */}
              <SecureContactForm
                onSubmit={async (data: unknown) => {
                  // TODO: Implement actual form submission
                  console.log("Contact form submitted:", data);
                  await new Promise((resolve) => setTimeout(resolve, 2000));
                }}
              />
            </div>
          </div>
        </div>
      </ResponsiveContainer>

      {/* Additional Services Section */}
      <ResponsiveContainer variant="page" className="py-16">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-12">
          <div className="text-center space-y-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Services We Offer
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="text-4xl mb-4">🔮</div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Reiki Healing
                </h3>
                <p className="text-gray-700">
                  Traditional Japanese energy healing technique for stress
                  reduction and relaxation
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="text-4xl mb-4">🎵</div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Sound Therapy
                </h3>
                <p className="text-gray-700">
                  Healing vibrations using singing bowls, chimes, and other
                  therapeutic instruments
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="text-4xl mb-4">🧘‍♀️</div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Holistic Wellness
                </h3>
                <p className="text-gray-700">
                  Comprehensive approach to mind, body, and spirit wellness and
                  balance
                </p>
              </div>
            </div>

            <p className="text-gray-600 max-w-3xl mx-auto">
              Each session is personalized to your unique needs and healing
              goals. Contact us to discuss which approach might be best for you.
            </p>
          </div>
        </div>
      </ResponsiveContainer>

      {/* Call to Action Section */}
      <ResponsiveContainer variant="full" className="py-20">
        <div className="bg-gradient-to-br from-blue-700 to-cyan-400 rounded-2xl p-12 text-center text-white shadow-2xl">
          <div className="space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Ready to Start Your Healing Journey?
            </h2>

            <p className="text-lg max-w-2xl mx-auto opacity-90">
              Take the first step toward balance and wellness. Book your
              personalized Reiki and sound healing session today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="tel:+13000000000"
                className="inline-flex items-center gap-2 px-8 py-3 bg-white text-blue-700 rounded-full font-medium hover:bg-gray-100 transition-colors"
              >
                📞 Call Now
              </a>

              <a
                href="mailto:thereikigoddesshealing@gmail.com"
                className="inline-flex items-center gap-2 px-8 py-3 border border-white rounded-full text-white font-medium hover:bg-white hover:text-blue-700 transition-colors"
              >
                ✉️ Send Email
              </a>
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

export { ContactPage };
