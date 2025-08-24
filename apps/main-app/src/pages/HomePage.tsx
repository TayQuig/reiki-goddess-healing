import React from 'react';
import { Link } from 'react-router-dom';
import { HeaderSection, FooterSection, ResponsiveContainer } from '@reiki-goddess/shared-components';
import { businessData } from '@reiki-goddess/shared-utils';
import { createNavigationItems, footerSections, socialLinks, brandConfig, copyrightConfig } from '../utils/navigationData';

const HomePage: React.FC = () => {
  const services = [
    {
      title: "Reiki Healing",
      description: "Experience the gentle power of energy healing to restore balance and promote deep relaxation.",
      icon: "🔮",
      benefits: ["Stress Reduction", "Pain Relief", "Emotional Healing", "Spiritual Growth"]
    },
    {
      title: "Sound Therapy", 
      description: "Therapeutic vibrations using singing bowls and instruments to heal body, mind, and spirit.",
      icon: "🎵",
      benefits: ["Deep Relaxation", "Anxiety Relief", "Improved Sleep", "Mental Clarity"]
    },
    {
      title: "Holistic Wellness",
      description: "Comprehensive approach combining energy healing techniques for complete wellness.",
      icon: "🧘‍♀️",
      benefits: ["Mind-Body Balance", "Inner Peace", "Self-Discovery", "Renewed Energy"]
    }
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      location: "Tacoma, WA", 
      text: "Deirdre's healing presence transformed my relationship with stress and anxiety. I feel more centered than ever.",
      rating: 5
    },
    {
      name: "Michael R.",
      location: "Seattle, WA",
      text: "The sound therapy sessions have been life-changing. I sleep better and feel more balanced every day.",
      rating: 5
    },
    {
      name: "Jessica M.",
      location: "Tacoma, WA",
      text: "I had no idea how deeply I was holding onto emotional pain until my first session with Deirdre. Her presence is calming, intuitive, and safe.",
      rating: 5
    }
  ];

  const stats = [
    { number: "500+", label: "Healing Sessions" },
    { number: "5+", label: "Years Experience" },
    { number: "98%", label: "Client Satisfaction" },
    { number: "100%", label: "Certified Master" }
  ];

  return (
    <div className="min-h-screen bg-[#fefbf5]">
      {/* Header */}
      <HeaderSection 
        navigationItems={createNavigationItems('/')}
        brand={brandConfig}
      />

      {/* Hero Section */}
      <ResponsiveContainer variant="full" className="pt-24 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[600px]">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
              The Reiki
              <span className="block text-blue-700">Goddess</span>
              <span className="block text-2xl md:text-3xl font-medium text-gray-600 mt-2">
                Healing
              </span>
            </h1>
            
            <p className="text-xl text-gray-700 leading-relaxed max-w-xl">
              Transform your life through the ancient art of Reiki energy healing and sound therapy. 
              Discover inner peace, release emotional blockages, and restore harmony to your body, mind, and spirit.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-700 text-white rounded-full font-medium text-lg hover:bg-blue-800 transition-colors shadow-lg hover:shadow-xl"
              >
                Book Your Session
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              
              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-blue-700 text-blue-700 rounded-full font-medium text-lg hover:bg-blue-700 hover:text-white transition-colors"
              >
                Learn More
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10">
              <img
                className="w-full max-w-lg mx-auto rounded-2xl shadow-2xl"
                alt="Reiki healing session with Deirdre"
                src="/img/fb8b1754eb9a50a6cfaec02f5ef0c9bc-2.png"
              />
            </div>
            
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-300 rounded-2xl opacity-20 transform rotate-3 -z-10"></div>
          </div>
        </div>
      </ResponsiveContainer>

      {/* Stats Section */}
      <ResponsiveContainer variant="page" className="py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-blue-700">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </ResponsiveContainer>

      {/* Services Section */}
      <ResponsiveContainer variant="page" className="py-20">
        <div className="text-center space-y-16">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Healing Services
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Experience personalized healing sessions designed to restore balance, reduce stress, 
              and awaken your inner wisdom through ancient energy healing practices.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="space-y-6">
                  <div className="text-5xl mb-4">{service.icon}</div>
                  
                  <h3 className="text-2xl font-bold text-gray-900">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-700 leading-relaxed">
                    {service.description}
                  </p>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">Benefits:</h4>
                    <ul className="space-y-1">
                      {service.benefits.map((benefit, idx) => (
                        <li key={idx} className="text-gray-600 flex items-center gap-2">
                          <span className="text-green-500">✓</span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 text-blue-700 font-medium hover:text-blue-800 transition-colors group-hover:underline"
                  >
                    Learn More
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ResponsiveContainer>

      {/* About Preview Section */}
      <ResponsiveContainer variant="full" className="py-20">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-900">
                Meet Deirdre Quigley
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                As a certified Reiki Master and Sound Healer based in Roy, Washington, 
                I bring years of experience in energy healing and holistic wellness to help 
                you release stress, restore balance, and awaken your inner strength.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                My approach is warm, intuitive, and personalized — ensuring every session 
                supports your unique journey toward healing and self-discovery.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-700 text-white rounded-full font-medium hover:bg-blue-800 transition-colors"
                >
                  My Story
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-blue-700 text-blue-700 rounded-full font-medium hover:bg-blue-700 hover:text-white transition-colors"
                >
                  Book Session
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 110 2h-1v9a2 2 0 01-2 2H7a2 2 0 01-2-2V9H4a1 1 0 110-2h3z" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="relative">
              <img
                className="w-full max-w-md mx-auto rounded-2xl shadow-xl"
                alt="Deirdre Quigley, Reiki Master"
                src="/img/rectangle-5.png"
              />
            </div>
          </div>
        </div>
      </ResponsiveContainer>

      {/* Testimonials Section */}
      <ResponsiveContainer variant="page" className="py-20">
        <div className="text-center space-y-12">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-gray-900">
              What Clients Are Saying
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Discover how Reiki healing has transformed the lives of our clients
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="space-y-4">
                  <div className="flex justify-center gap-1">
                    {Array(testimonial.rating).fill(null).map((_, idx) => (
                      <svg
                        key={idx}
                        className="w-5 h-5 text-yellow-400 fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                  
                  <p className="text-gray-700 italic leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  
                  <div className="border-t pt-4">
                    <p className="font-semibold text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ResponsiveContainer>

      {/* Call to Action Section */}
      <ResponsiveContainer variant="full" className="py-20">
        <div className="bg-gradient-to-br from-blue-700 to-cyan-400 rounded-3xl p-12 text-center text-white shadow-2xl">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to Begin Your Healing Journey?
            </h2>
            
            <p className="text-xl max-w-3xl mx-auto leading-relaxed opacity-90">
              Take the first step toward balance, peace, and wellness. Schedule your personalized 
              Reiki and sound healing session today and discover the transformative power of energy healing.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-700 rounded-full font-medium text-lg hover:bg-gray-100 transition-colors shadow-lg"
              >
                Book Your Session Now
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              
              <a
                href="tel:+13000000000"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white rounded-full font-medium text-lg hover:bg-white hover:text-blue-700 transition-colors"
              >
                📞 Call Now
              </a>
            </div>
            
            <p className="text-sm opacity-80">
              Free consultation • Flexible scheduling • Personalized approach
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
          address: businessData.location
        }}
      />
    </div>
  );
};

export { HomePage };