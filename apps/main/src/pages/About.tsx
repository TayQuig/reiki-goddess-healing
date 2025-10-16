import PageTransition from "../components/PageTransition";
import {
  AboutHero,
  JourneySection,
  ContactCTA,
  ImageGallery,
  Testimonials,
  BookSessionCTA,
  AnimatedSection,
} from "@reiki-goddess/shared-components";

function About() {
  return (
    <PageTransition>
      <div data-testid="page-about" className="min-h-screen">
        {/* Main Container with drop shadow */}
        <div
          className="relative mx-auto"
          style={{
            maxWidth: "1440px",
            margin: "0 auto",
            backgroundColor: "#FFFBF5",
            boxShadow: "0 0 40px rgba(0, 0, 0, 0.1)",
            overflow: "visible",
          }}
        >
          <AnimatedSection animation="fadeIn" delay={0.1}>
            <AboutHero
              heading="Experienced Reiki Master & Sound Healer in Roy"
              leftColumnText="As an experienced Reiki Master and certified Sound Healer, my mission is to help you reconnect with your inner balance, release emotional blockages, and restore harmony and embrace your natural state of wellness."
              rightColumnText="With years of practice in energy healing and holistic wellness, I combine gentle Reiki techniques with the vibrational power of sound therapy to create a deeply personalized healing experience. Whether you seek emotional release, physical relief, or spiritual growth — I am here to guide you on your journey to self-discovery and inner peace."
              bottomText="Every healing session is tailored to your unique needs, ensuring you feel calm, centered, and revitalized. Whether you're seeking relief from stress, emotional healing, or spiritual growth — I am here to guide you on your journey to self-discovery and inner peace."
              heroImage={{
                src: "/figma-screenshots/about/images/Sound Therapy 1.jpg",
                alt: "Reiki healing session with singing bowls",
              }}
              ctaButton={{
                text: "Learn More",
                onClick: () =>
                  window.scrollTo({ top: 1200, behavior: "smooth" }),
                ariaLabel: "Learn more about Reiki healing",
              }}
            />
          </AnimatedSection>

          {/* Second Section - About Deirdre */}
          <AnimatedSection animation="fadeInUp" delay={0.1} threshold={0.2}>
            <section className="relative bg-[#FEFBF5] py-20">
              <div className="max-w-[1440px] mx-auto px-[66px]">
                {/* Heading */}
                <h2
                  className="text-[48px] font-bold mb-8"
                  style={{ fontFamily: "Figtree, sans-serif" }}
                >
                  Experienced Reiki Master & Sound Healer in Roy
                </h2>

                <div className="flex gap-12 items-start">
                  {/* Left Column - Text */}
                  <div className="flex-1">
                    <p
                      className="text-[16px] font-medium leading-[24px] text-[#1C1B1B]"
                      style={{ fontFamily: "Figtree, sans-serif" }}
                    >
                      Welcome! I&apos;m Deirdre Quigley, the founder of The
                      Reiki Goddess Healing in Roy, Washington. With a deep
                      passion for energy healing and holistic wellness, I blend
                      the gentle art of Reiki with the transformative power of
                      sound therapy to help you release stress, restore balance,
                      and awaken your inner strength.
                    </p>
                  </div>

                  {/* Center - Image */}
                  <div className="flex-shrink-0">
                    <img
                      src="/figma-screenshots/about/images/Rectangle 5.jpg"
                      alt="Deirdre Quigley performing sound healing"
                      className="w-[400px] h-[400px] object-cover rounded-[20px]"
                    />
                  </div>

                  {/* Right Column - Text */}
                  <div className="flex-1">
                    <p
                      className="text-[16px] font-medium leading-[24px] text-[#1C1B1B]"
                      style={{ fontFamily: "Figtree, sans-serif" }}
                    >
                      My approach is warm, intuitive, and personalized —
                      ensuring every session supports your unique journey toward
                      healing and self-discovery.
                    </p>
                    <button
                      className="mt-8 px-6 py-3 rounded-full border border-[#0205B7] bg-transparent text-[#0205B7] hover:bg-[#0205B7] hover:text-white transition-all duration-300 flex items-center gap-2"
                      style={{
                        fontFamily: "Figtree, sans-serif",
                        fontSize: "16px",
                      }}
                      onClick={() =>
                        window.scrollTo({ top: 2000, behavior: "smooth" })
                      }
                    >
                      Learn More
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 9L9 1M9 1H1M9 1V9"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </AnimatedSection>

          {/* Second Smoke Plume - Behind Journey Section */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: "2100px",
              right: "0",
              width: "808px",
              height: "808px",
              zIndex: 1,
            }}
          >
            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                src="/img/smoke.png"
                alt=""
                style={{
                  width: "808px",
                  height: "808px",
                  objectFit: "cover",
                  position: "absolute",
                  left: "0",
                  top: "0",
                  transform: "rotate(-180deg)",
                  opacity: 0.5,
                  mixBlendMode: "normal",
                }}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ))}
          </div>

          {/* Third Section - My Journey */}
          <AnimatedSection animation="fadeInUp" delay={0.1} threshold={0.2}>
            <JourneySection
              heading="My Journey: Inspiring Personal Growth & Renewal"
              backgroundImage={{
                src: "/figma-screenshots/about/images/Rectamgle 6.jpg",
                alt: "Reiki healing journey",
              }}
              content={
                <p className="text-[#1C1B1B]">
                  My journey into the world of Reiki healing began with a
                  personal quest for peace, balance, and deeper self-awareness.
                  Over the years, I have transformed that passion into a mission
                  — helping others release emotional blockages, restore harmony,
                  and embrace their true potential. Through dedication,
                  continuous learning, and heartfelt connection, I&apos;ve
                  guided countless individuals toward healing and renewal,
                  creating a space where transformation feels safe and
                  empowering.
                </p>
              }
              certifications={[
                {
                  title: "Certified Reiki Master",
                  description:
                    "Advanced training in energy healing techniques.",
                  variant: "white",
                },
                {
                  title: "Sound Healing Specialist",
                  description:
                    "Skilled in using vibration and frequency for deep relaxation.",
                  variant: "white",
                },
                {
                  title: "Years of Experience",
                  description:
                    "Supporting clients in emotional, physical, and spiritual growth.",
                  variant: "white",
                },
              ]}
            />
          </AnimatedSection>

          {/* Fourth Section - Contact CTA */}
          <AnimatedSection animation="fadeInUp" delay={0.1} threshold={0.2}>
            <div className="py-20">
              <ContactCTA
                heading="Contact Me for Personalized Assistance"
                bodyText="At The Reiki Goddess Healing, your well-being is my highest priority. I understand how important it is to feel a sense of accomplishment, inner peace, and balance in life. That's why, after understanding your needs and goals, I create a fully customized healing plan just for you — guiding you every step of the way toward transformation."
                buttons={[
                  {
                    text: "Book a Session",
                    variant: "primary",
                    href: "/contact",
                  },
                  {
                    text: "Learn More",
                    variant: "secondary",
                    href: "/services",
                  },
                ]}
              />
            </div>
          </AnimatedSection>

          {/* Fifth Section - Image Gallery */}
          <AnimatedSection animation="fadeInUp" delay={0.1} threshold={0.2}>
            <ImageGallery
              heading="Image Gallery"
              images={[
                {
                  src: "/figma-screenshots/about/images/Rectangle 7.png",
                  alt: "Healing session with singing bowls and incense",
                },
                {
                  src: "/figma-screenshots/about/images/Rectangle 8.png",
                  alt: "Sound therapy session with client",
                },
                {
                  src: "/figma-screenshots/about/images/Rectangle 13.png",
                  alt: "Meditation and energy healing",
                },
                {
                  src: "/figma-screenshots/about/images/Rectangle 10.png",
                  alt: "Tibetan singing bowl sound therapy",
                },
                {
                  src: "/figma-screenshots/about/images/Rectangle 12.png",
                  alt: "Sound healing practitioner with gong",
                },
              ]}
              seeMoreButton={{
                text: "See More",
                onClick: () => console.log("See more clicked"),
                ariaLabel: "See more images from our healing sessions",
              }}
            />
          </AnimatedSection>

          {/* Sixth Section - Testimonials */}
          <AnimatedSection animation="fadeIn" delay={0.1} threshold={0.3}>
            <div className="py-10">
              <Testimonials />
            </div>
          </AnimatedSection>

          {/* Seventh Section - Final CTA */}
          <AnimatedSection animation="fadeInUp" delay={0.1} threshold={0.2}>
            <div className="py-10">
              <BookSessionCTA />
            </div>
          </AnimatedSection>
        </div>
      </div>
    </PageTransition>
  );
}

export default About;
