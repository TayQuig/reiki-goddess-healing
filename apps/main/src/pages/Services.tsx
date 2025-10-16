import { useEffect } from "react";
import PageTransition from "../components/PageTransition";
import {
  FeaturesBar,
  ServicesSection,
  Testimonials,
  BookSessionCTA,
  AnimatedSection,
} from "@reiki-goddess/shared-components";

// Service data for Services page (expanded from homepage)
const services = [
  {
    id: "reiki-healing",
    title: "Reiki Energy Healing",
    duration: "60-90 minutes",
    price: "$120",
    icon: (
      <img
        src="/img/jainism_6741541-reiki-healing-sessions.svg"
        alt="Reiki Energy Healing"
        className="w-16 h-16"
      />
    ),
    description:
      "Traditional Japanese energy healing technique to promote relaxation, reduce stress, and support natural healing processes.",
    href: "/contact",
  },
  {
    id: "sound-therapy",
    title: "Sound Therapy & Crystal Bowls",
    duration: "75 minutes",
    price: "$135",
    icon: (
      <img
        src="/img/bowl_6741666-sound-therapy-crystal-bowls.svg"
        alt="Sound Therapy & Crystal Bowls"
        className="w-16 h-16"
      />
    ),
    description:
      "Vibrational healing using crystal singing bowls, gongs, and tuning forks to restore harmony and balance.",
    href: "/contact",
  },
  {
    id: "chakra-aura",
    title: "Chakra Balancing & Aura Cleansing",
    duration: "60 minutes",
    price: "$110",
    icon: (
      <img
        src="/img/body_6741617-chakra-balancing-aura-cleansing.svg"
        alt="Chakra Balancing & Aura Cleansing"
        className="w-16 h-16"
      />
    ),
    description:
      "Clear energetic blockages and restore balance to your chakra system and aura field.",
    href: "/contact",
  },
  {
    id: "distance-healing",
    title: "Distance/Remote Healing",
    duration: "45 minutes",
    price: "$90",
    icon: (
      <img
        src="/img/hands_6741649-distance-remote-healing.svg"
        alt="Distance/Remote Healing"
        className="w-16 h-16"
      />
    ),
    description:
      "Receive powerful energy healing from the comfort of your own home through remote Reiki sessions.",
    href: "/contact",
  },
];

// Pricing tiers for Services page
const pricingTiers = [
  {
    id: "single-session",
    name: "Single Session",
    price: "$120",
    duration: "60-90 minutes",
    features: [
      "One healing session of your choice",
      "Personalized treatment plan",
      "Post-session integration guidance",
      "Email support for 48 hours",
    ],
    ctaText: "Book Session",
    ctaHref: "/contact",
  },
  {
    id: "journey-package",
    name: "Healing Journey Package",
    price: "$420",
    duration: "4 sessions over 4-6 weeks",
    featured: true,
    features: [
      "Four 60-90 minute sessions",
      "Progressive healing protocol",
      "Ongoing email support",
      "Recorded meditation and integration practices",
      "10% discount ($480 value)",
    ],
    ctaText: "Start Your Journey",
    ctaHref: "/contact",
  },
  {
    id: "transformational",
    name: "Transformational Program",
    price: "$950",
    duration: "8 sessions over 2-3 months",
    features: [
      "Eight 60-90 minute sessions",
      "Comprehensive healing assessment",
      "Customized healing plan",
      "Unlimited email support",
      "Home practice toolkit",
      "Progress tracking and adjustments",
      "20% discount ($1200 value)",
    ],
    ctaText: "Transform Your Life",
    ctaHref: "/contact",
  },
];

function Services() {
  // Set page metadata
  useEffect(() => {
    document.title = "Healing Services | The Reiki Goddess";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Discover transformative energy healing services including Reiki, sound therapy, chakra balancing, and distance healing at The Reiki Goddess in Roy, WA."
      );
    }
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen" data-testid="page-services">
        {/* Main Container - matches Homepage.tsx pattern */}
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
          {/* Hero Section */}
          <AnimatedSection animation="fadeIn">
            <div
              className="text-center"
              style={{
                paddingTop: "193px",
                paddingBottom: "80px",
              }}
            >
              <h1
                className="font-bold mb-8"
                style={{
                  fontFamily: "Figtree, Helvetica, sans-serif",
                  fontSize: "63.55px",
                  lineHeight: "100%",
                  color: "#0205B7",
                }}
              >
                Healing Services
              </h1>
              <p
                className="mx-auto"
                style={{
                  fontFamily: "Figtree, Helvetica, sans-serif",
                  fontSize: "18px",
                  lineHeight: "28px",
                  color: "#5E5E5E",
                  maxWidth: "800px",
                }}
              >
                Discover transformative energy healing services designed to
                restore balance, promote wellness, and support your spiritual
                journey.
              </p>
            </div>
          </AnimatedSection>

          {/* Features Bar */}
          <AnimatedSection animation="fadeInUp" delay={0.2}>
            <FeaturesBar />
          </AnimatedSection>

          {/* Services Section */}
          <AnimatedSection animation="fadeInUp" delay={0.1} threshold={0.2}>
            <ServicesSection
              heading="Our Healing Modalities"
              services={services}
            />
          </AnimatedSection>

          {/* Pricing Section */}
          <AnimatedSection animation="fadeInUp" delay={0.1} threshold={0.2}>
            <section className="py-20">
              <h2
                className="text-center font-bold mb-12"
                style={{
                  fontFamily: "Figtree, Helvetica, sans-serif",
                  fontSize: "48px",
                  lineHeight: "1.2",
                  color: "#333333",
                }}
              >
                Investment in Your Healing
              </h2>
              <p
                className="text-center mb-12 mx-auto"
                style={{
                  fontFamily: "Figtree, Helvetica, sans-serif",
                  fontSize: "18px",
                  lineHeight: "28px",
                  color: "#5E5E5E",
                  maxWidth: "600px",
                }}
              >
                Choose the path that resonates with your journey
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {pricingTiers.map((tier) => (
                  <div
                    key={tier.id}
                    className="group relative transition-all duration-300 transform hover:-translate-y-2"
                  >
                    {/* Blue bevel background */}
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundColor: "#0205B7",
                        borderRadius: "20px",
                        transform: "translateY(5px)",
                        zIndex: 0,
                      }}
                    />

                    {/* White card */}
                    <div
                      className="relative bg-white rounded-[20px] p-8 z-10"
                      style={{
                        boxShadow:
                          "0px 42px 32.5px -13px rgba(2, 5, 183, 0.25)",
                        border: tier.featured
                          ? "3px solid #0205B7"
                          : "1px solid #E0E0E0",
                      }}
                    >
                      {tier.featured && (
                        <div
                          className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4 py-1 rounded-full text-white text-sm font-semibold"
                          style={{
                            backgroundColor: "#0205B7",
                            fontFamily: "Figtree, Helvetica, sans-serif",
                          }}
                        >
                          Most Popular
                        </div>
                      )}

                      <h3
                        className="font-bold mb-2"
                        style={{
                          fontFamily: "Figtree, Helvetica, sans-serif",
                          fontSize: "32px",
                          lineHeight: "1.2",
                          color: "#333333",
                        }}
                      >
                        {tier.name}
                      </h3>

                      <div
                        className="font-bold mb-2"
                        style={{
                          fontFamily: "Figtree, Helvetica, sans-serif",
                          fontSize: "48px",
                          lineHeight: "1.2",
                          color: "#0205B7",
                        }}
                      >
                        {tier.price}
                      </div>

                      <p
                        className="mb-6"
                        style={{
                          fontFamily: "Figtree, Helvetica, sans-serif",
                          fontSize: "16px",
                          lineHeight: "24px",
                          color: "#5E5E5E",
                        }}
                      >
                        {tier.duration}
                      </p>

                      <ul className="mb-6 space-y-3">
                        {tier.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <svg
                              className="w-5 h-5 flex-shrink-0"
                              style={{ color: "#63D5F9" }}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span
                              style={{
                                fontFamily: "Figtree, Helvetica, sans-serif",
                                fontSize: "14px",
                                lineHeight: "20px",
                                color: "#333333",
                              }}
                            >
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <a
                        href={tier.ctaHref}
                        className="w-full inline-flex items-center justify-center rounded-full transition-all duration-200 hover:scale-105"
                        style={{
                          fontFamily: "Figtree, Helvetica, sans-serif",
                          fontSize: "16px",
                          fontWeight: 500,
                          height: "48px",
                          padding: "0 32px",
                          backgroundColor: tier.featured
                            ? "#0205B7"
                            : "transparent",
                          color: tier.featured ? "white" : "#0205B7",
                          border: tier.featured
                            ? "2px solid #0205B7"
                            : "2px solid #0205B7",
                        }}
                        aria-label={`${tier.ctaText} for ${tier.name}`}
                      >
                        {tier.ctaText}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </AnimatedSection>

          {/* Testimonials */}
          <AnimatedSection animation="fadeInUp" delay={0.1} threshold={0.2}>
            <Testimonials />
          </AnimatedSection>

          {/* Book Session CTA */}
          <AnimatedSection animation="fadeIn" delay={0.1} threshold={0.3}>
            <div style={{ padding: "161px 0" }}>
              <BookSessionCTA />
            </div>
          </AnimatedSection>
        </div>
      </div>
    </PageTransition>
  );
}

export default Services;
