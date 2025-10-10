import React from "react";
import { AnimatedSection } from "../AnimatedSection";
import { AboutHero } from "../AboutHero";
import { FeaturesBar } from "../FeaturesBar";
import { MeetTheGoddess } from "../MeetTheGoddess";
import { JourneySection } from "../JourneySection";
import { LetsConnect } from "../LetsConnect";
import { ImageGallery } from "../ImageGallery";
import { Testimonials } from "../Testimonials";
import { BookSessionCTA } from "../BookSessionCTA/BookSessionCTA";

/**
 * AboutPage - Complete About page composition
 * Implements all sections from Figma design specifications
 *
 * @see /docs/design/about-page-migration/figma-extraction-results.md
 */
export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FFFBF5] overflow-hidden relative">
      <div
        className="relative mx-auto overflow-hidden"
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          backgroundColor: "#FFFBF5",
          boxShadow: "0 0 40px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Hero Section */}
        <AnimatedSection>
          <AboutHero
            heading="Experienced Reiki Master & Sound Healer in Roy"
            leftColumnText={
              <>
                As an{" "}
                <span className="font-bold italic text-[#0205B7]">
                  experienced Reiki Master and certified Sound Healer,
                </span>{" "}
                my mission is to help you reconnect with your inner balance and
                discover the profound healing that comes from within. Every
                session is a sacred space where you can release stress, restore
                harmony, and embrace your natural state of wellness.
              </>
            }
            rightColumnText={
              <>
                With years of practice in{" "}
                <span className="font-bold italic text-[#0205B7]">
                  energy healing
                </span>{" "}
                and{" "}
                <span className="font-bold italic text-[#0205B7]">
                  holistic wellness,
                </span>{" "}
                I combine gentle Reiki techniques with the transformative power
                of sound therapy to create a deeply personalized healing
                experience. Whether you seek emotional release, physical relief,
                or spiritual growth, you&apos;ll find a compassionate guide on
                your journey.
              </>
            }
            bottomText="Every healing session is tailored to your unique needs, creating a safe and nurturing environment where transformation can naturally unfold."
            heroImage={{
              src: "/img/fb8b1754eb9a50a6cfaec02f5ef0c9bc-2.png",
              alt: "Reiki healing session in progress",
            }}
            decorativeImage={{
              src: "/img/powerrangers-6.png",
              alt: "Decorative background",
            }}
            ctaButton={{
              text: "Learn More",
              onClick: () => {
                const meetSection = document.querySelector(
                  '[data-section="meet-the-goddess"]'
                );
                meetSection?.scrollIntoView({ behavior: "smooth" });
              },
            }}
          />
        </AnimatedSection>

        {/* Features Bar */}
        <AnimatedSection delay={0.1}>
          <FeaturesBar
            features={[
              {
                icon: "⚡",
                title: "Energy Healing",
                description: "Restore balance and vitality",
              },
              {
                icon: "🎵",
                title: "Sound Therapy",
                description: "Transformative healing frequencies",
              },
              {
                icon: "🧘",
                title: "Holistic Wellness",
                description: "Mind, body, and spirit harmony",
              },
            ]}
          />
        </AnimatedSection>

        {/* Meet The Goddess Section */}
        <AnimatedSection delay={0.2}>
          <div data-section="meet-the-goddess">
            <MeetTheGoddess />
          </div>
        </AnimatedSection>

        {/* Journey Section */}
        <AnimatedSection delay={0.3}>
          <JourneySection />
        </AnimatedSection>

        {/* Let's Connect Section */}
        <AnimatedSection delay={0.4}>
          <LetsConnect />
        </AnimatedSection>

        {/* Image Gallery */}
        <AnimatedSection delay={0.5}>
          <ImageGallery
            heading="Image Gallery"
            images={[
              {
                src: "/img/rectangle-7.png",
                alt: "Healing space 1",
                width: 898,
                height: 343,
              },
              {
                src: "/img/rectangle-8.png",
                alt: "Healing space 2",
                width: 391,
                height: 343,
              },
              {
                src: "/img/rectangle-10.png",
                alt: "Healing space 3",
                width: 391,
                height: 343,
              },
              {
                src: "/img/rectangle-13.png",
                alt: "Healing space 4",
                width: 487,
                height: 343,
              },
              {
                src: "/img/rectangle-12.png",
                alt: "Healing space 5",
                width: 391,
                height: 343,
              },
            ]}
            seeMoreButton={{
              text: "See More",
              onClick: () => console.log("See more clicked"),
            }}
          />
        </AnimatedSection>

        {/* Testimonials Section */}
        <AnimatedSection delay={0.6}>
          <Testimonials
            heading="What My Clients Are Saying"
            testimonials={[
              {
                id: "1",
                name: "Jessica M.",
                location: "Tacoma, WA",
                content:
                  "Deirdre's healing sessions have transformed my life. Her gentle approach and deep understanding of energy work helped me release years of stored tension. I feel more balanced and at peace than ever before.",
                rating: 5,
                image: {
                  src: "/img/ellipse-5.png",
                  alt: "Jessica M.",
                },
              },
            ]}
          />
        </AnimatedSection>

        {/* Book Session CTA */}
        <AnimatedSection delay={0.7}>
          <div className="max-w-[1440px] mx-auto px-[66px] py-[100px]">
            <BookSessionCTA />
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};
