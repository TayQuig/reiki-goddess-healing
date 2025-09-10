import React from "react";
import { AnimatedSection } from "../AnimatedSection";
import { ContactInfoCard } from "../ContactInfoCard";
import { FigmaContactForm } from "../FigmaContactForm";

/**
 * ContactPage - The Reiki Goddess Healing contact page
 * Implements Figma design with secure contact form, info cards, and map
 */
export const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden relative">
      {/* Main Content - Elevated Container */}
      <div
        className="relative mx-auto overflow-hidden"
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          backgroundColor: "#FFFBF5",
          boxShadow: "0 0 40px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Smoke effect left */}
        <div
          className="absolute opacity-20 pointer-events-none"
          style={{
            width: "808px",
            height: "808px",
            left: "-180px",
            top: "792px",
            backgroundImage: `url('/img/fb8b1754eb9a50a6cfaec02f5ef0c9bc3.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Smoke effect right */}
        <div
          className="absolute opacity-20 pointer-events-none"
          style={{
            width: "808px",
            height: "808px",
            right: "-404px",
            top: "749px",
            transform: "rotate(180deg) scaleY(-1)",
            backgroundImage: `url('/img/fb8b1754eb9a50a6cfaec02f5ef0c9bc3.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* Hero Section */}
        <AnimatedSection>
          <div className="text-center pt-[193px] pb-20">
            <h1
              className="text-[63.55px] font-bold text-black mb-[92px]"
              style={{ fontFamily: "Figtree, sans-serif" }}
            >
              Get in Touch
            </h1>
            <p
              className="text-[16px] font-medium text-[#1C1B1B]"
              style={{ fontFamily: "Figtree, sans-serif" }}
            >
              Have questions or want to book a session? We&apos;re here to help.
            </p>
          </div>
        </AnimatedSection>

        {/* Form Section */}
        <AnimatedSection delay={0.1}>
          <div className="max-w-[1440px] mx-auto px-[66px]">
            <div className="max-w-[1241px] mx-auto">
              <FigmaContactForm
                onSubmit={async (data) => {
                  console.log("Contact form submitted:", data);
                  // TODO: Implement actual form submission
                  await new Promise((resolve) => setTimeout(resolve, 2000));
                }}
                className="contact-page-form"
              />
            </div>
          </div>
        </AnimatedSection>

        {/* Contact Info Cards */}
        <AnimatedSection delay={0.2}>
          <div className="max-w-[1440px] mx-auto px-[66px] mt-[200px] mb-20 relative">
            {/* Left smoke - 10 layers for vibrancy */}
            {[...Array(10)].map((_, index) => (
              <div
                key={`left-smoke-${index}`}
                className="absolute opacity-10 pointer-events-none"
                style={{
                  width: "992px",
                  height: "722px",
                  left: "-246px", // Adjusted to match Figma (-180px - 66px padding)
                  top: "-100px", // Position above cards
                  backgroundImage: `url('/img/smoke.png')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  zIndex: 1,
                }}
              />
            ))}

            {/* Right smoke - 10 layers for vibrancy */}
            {[...Array(10)].map((_, index) => (
              <div
                key={`right-smoke-${index}`}
                className="absolute opacity-10 pointer-events-none"
                style={{
                  width: "808px",
                  height: "808px",
                  right: "-304px", // Adjusted to match Figma (-238px - 66px padding)
                  top: "-100px", // Position above cards
                  backgroundImage: `url('/img/smoke.png')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  transform: "rotate(180deg)",
                  zIndex: 1,
                }}
              />
            ))}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              {/* Location Card */}
              <ContactInfoCard
                icon="/images/mdi_location.svg"
                title="Our Location"
                content="Roy, Washington"
                ctaText="Get Directions"
                ctaLink="https://maps.google.com/?q=Roy,Washington"
              />

              {/* Phone Card */}
              <ContactInfoCard
                icon="/images/ic_baseline-phone.svg"
                title="Our Phone"
                content="0300 0000 0000"
                ctaText="Call Us"
                ctaLink="tel:03000000000"
              />

              {/* Email Card */}
              <ContactInfoCard
                icon="/images/ic_baseline-email.svg"
                title="Our Email"
                content="thereikigoddesshealing@gmail.com"
                ctaText="Email Us"
                ctaLink="mailto:thereikigoddesshealing@gmail.com"
              />
            </div>
          </div>
        </AnimatedSection>

        {/* Map Section */}
        <AnimatedSection delay={0.3}>
          <div className="w-full h-[598px] relative">
            <img
              src="/img/d6624918517b685d6082f92a43dde9ebf88b0832.png"
              alt="Location Map"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </AnimatedSection>

        {/* CTA Section */}
        <AnimatedSection delay={0.4}>
          <div className="max-w-[1440px] mx-auto px-[66px] py-[161px]">
            <div className="bg-blue rounded-[20px] shadow-[9px_10px_0px_0px_#63D5F9] p-[64px] relative overflow-hidden">
              <div className="relative z-10 text-center">
                <h2
                  className="text-[48px] font-bold text-white mb-[107px]"
                  style={{ fontFamily: "Figtree, sans-serif" }}
                >
                  Ready to Begin Your Healing Journey?
                </h2>
                <a
                  href="/book"
                  className="inline-flex items-center gap-2 px-[13px] py-[10px] border-2 border-white rounded-[90px] text-white font-medium hover:bg-white hover:text-blue transition-all duration-300"
                >
                  <span>Book Your Session Today</span>
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10.707 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L15.586 11H3a1 1 0 110-2h12.586l-4.293-4.293a1 1 0 010-1.414z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};
