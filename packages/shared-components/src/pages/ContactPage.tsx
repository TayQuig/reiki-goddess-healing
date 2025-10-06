import React from "react";
import { AnimatedSection } from "../AnimatedSection";
import { ContactInfoCard } from "../ContactInfoCard";
import { FigmaContactForm } from "../FigmaContactForm";
import { BookSessionCTA } from "../BookSessionCTA";
import { GoogleMapEmbed } from "../GoogleMap";
import { submitContactForm } from "@reiki-goddess/shared-utils";

/**
 * ContactPage - The Reiki Goddess Healing contact page
 * Implements Figma design with secure contact form, info cards, and map
 */
export const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FFFBF5] overflow-hidden relative">
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
                  await submitContactForm(data);
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
                content="8916 345th Street Ct. S. Roy, WA 98580"
                ctaText="Get Directions"
                ctaLink="https://maps.google.com/?q=8916+345th+Street+Ct.+S.+Roy,+WA+98580"
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
          <div className="w-full h-[598px] relative overflow-hidden">
            {/* Left smoke layers behind map */}
            {[...Array(5)].map((_, index) => (
              <div
                key={`map-left-smoke-${index}`}
                className="absolute opacity-10 pointer-events-none"
                style={{
                  width: "600px",
                  height: "600px",
                  left: "-200px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  backgroundImage: `url('/img/smoke.png')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  zIndex: 0,
                }}
              />
            ))}

            {/* Right smoke layers behind map */}
            {[...Array(5)].map((_, index) => (
              <div
                key={`map-right-smoke-${index}`}
                className="absolute opacity-10 pointer-events-none"
                style={{
                  width: "600px",
                  height: "600px",
                  right: "-200px",
                  top: "50%",
                  transform: "translateY(-50%) rotate(180deg)",
                  backgroundImage: `url('/img/smoke.png')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  zIndex: 0,
                }}
              />
            ))}

            {/* Map with higher z-index */}
            <div className="relative z-10 w-full h-full">
              <GoogleMapEmbed
                address="8916 345th Street Ct. S. Roy, WA 98580"
                width="100%"
                height={598}
                className="w-full"
                loading="lazy"
                fallbackImageUrl="/img/d6624918517b685d6082f92a43dde9ebf88b0832.png"
                ariaLabel="Map showing The Reiki Goddess Healing location in Roy, Washington"
                title="The Reiki Goddess Healing Location Map"
              />
            </div>
          </div>
        </AnimatedSection>

        {/* CTA Section */}
        <AnimatedSection delay={0.4}>
          <div className="max-w-[1440px] mx-auto px-[66px] py-[161px]">
            <BookSessionCTA />
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};
