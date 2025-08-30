import React, { useEffect } from "react";
import { HeroV2 } from "../Hero/HeroV2";
import { FeaturesBar } from "../FeaturesBar/FeaturesBar";
import { MeetTheGoddess } from "../MeetTheGoddess/MeetTheGoddess";
import { ServicesSection } from "../Services/ServicesSection";
import { CommunityEvents } from "../CommunityEvents/CommunityEvents";
import { Testimonials } from "../Testimonials/Testimonials";
import { LetsConnect } from "../LetsConnect/LetsConnect";
import { AnimatedSection } from "../AnimatedSection/AnimatedSection";

export interface HomepageProps {
  className?: string;
}

/**
 * Complete Homepage component
 * Composed of all homepage sections in proper order
 */
export const Homepage: React.FC<HomepageProps> = ({ className = "" }) => {
  // Add smooth scroll navigation handler
  useEffect(() => {
    const handleSmoothScroll = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement;
      if (
        target.tagName === "A" &&
        target.getAttribute("href")?.startsWith("#")
      ) {
        e.preventDefault();
        const elementId = target.getAttribute("href")?.slice(1);
        if (elementId) {
          const element = document.getElementById(elementId);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      }
    };

    document.addEventListener("click", handleSmoothScroll);
    return () => document.removeEventListener("click", handleSmoothScroll);
  }, []);

  return (
    <div className={`${className}`}>
      {/* Main Container */}
      <div
        className="relative mx-auto overflow-hidden"
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          backgroundColor: "#FFFBF5",
          boxShadow: "0 0 40px rgba(0, 0, 0, 0.1)",
          padding: "0 66px",
        }}
      >
        {/* Hero Section - no embedded header, AppLayout provides it */}
        <div className="relative">
          <HeroV2
            backgroundImage={{
              src: "/img/powerrangers-6-hero-main.png",
              alt: "Reiki healing session",
            }}
            overlayContent={{
              heading: "The Reiki Goddess Healing",
              subheading:
                "Energy Healing for Optimal Mental Health & Wellness. Ground your energy, reduce stress, and restore balance.",
              buttons: [
                {
                  text: "Book a Session",
                  variant: "primary",
                  href: "/book",
                },
                {
                  text: "Learn More",
                  variant: "secondary",
                  href: "/about",
                },
              ],
            }}
          />
        </div>

        {/* All other sections automatically get the 66px padding from container */}
        {/* Features Bar */}
        <AnimatedSection animation="fadeInUp" delay={0.2}>
          <FeaturesBar />
        </AnimatedSection>

        {/* Meet The Reiki Goddess Section */}
        <AnimatedSection animation="fadeIn" delay={0.1} threshold={0.2}>
          <MeetTheGoddess />
        </AnimatedSection>

        {/* Services Section */}
        <AnimatedSection animation="fadeInUp" delay={0.1} threshold={0.2}>
          <ServicesSection />
        </AnimatedSection>

        {/* Community Events Section */}
        <AnimatedSection animation="scaleIn" delay={0.1} threshold={0.2}>
          <CommunityEvents />
        </AnimatedSection>

        {/* Testimonials Section */}
        <AnimatedSection animation="fadeInUp" delay={0.1} threshold={0.2}>
          <Testimonials />
        </AnimatedSection>

        {/* Let's Connect CTA Section */}
        <AnimatedSection animation="fadeIn" delay={0.1} threshold={0.3}>
          <LetsConnect />
        </AnimatedSection>
      </div>
    </div>
  );
};
