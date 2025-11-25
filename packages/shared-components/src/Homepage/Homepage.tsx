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
    <div className={`${className} w-full`}>
      {/* Main Container */}
      <div
        className="relative mx-auto overflow-hidden bg-[#FFFBF5] shadow-2xl"
        style={{
          maxWidth: "1440px",
          // Padding is handled via classes for responsiveness:
          // Mobile: px-4 (16px)
          // Tablet: px-8 (32px)
          // Desktop: px-[66px] (66px)
        }}
      >
        <div className="px-4 md:px-8 lg:px-[66px]">
          {/* Hero Section - no embedded header, AppLayout provides it */}
          <div className="relative w-full">
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
    </div>
  );
};
