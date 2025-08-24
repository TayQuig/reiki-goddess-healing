import React from 'react';
import { Link } from 'react-router-dom';
import { HeaderSection, FooterSection, ResponsiveContainer } from '@reiki-goddess/shared-components';
import { businessData } from '@reiki-goddess/shared-utils';
import { createNavigationItems, footerSections, socialLinks, brandConfig, copyrightConfig } from '../utils/navigationData';

const AboutPage: React.FC = () => {
  const testimonial = {
    name: "Jessica M., Tacoma, WA",
    image: "/img/ellipse-5.png",
    text: "❝I had no idea how deeply I was holding onto emotional pain until my first session with Deirdre. Her presence is calming, intuitive, and safe. I'm beyond grateful to have found her.❞",
  };

  const galleryImages = [
    { src: "/img/rectangle-7.png", alt: "Healing session 1" },
    { src: "/img/rectangle-8.png", alt: "Healing session 2" },
    { src: "/img/rectangle-10.png", alt: "Healing session 3" },
    { src: "/img/rectangle-13.png", alt: "Healing session 4" },
    { src: "/img/rectangle-12.png", alt: "Healing session 5" },
  ];

  const stars = Array(5).fill(null);

  const credentials = [
    {
      title: "Sound Healing Specialist",
      description: "Skilled in using vibration and frequency for deep relaxation.",
      type: "gradient"
    },
    {
      title: "Years of Experience",
      description: "Supporting clients in emotional, physical, and spiritual growth.",
      type: "white"
    },
    {
      title: "Certified Reiki Master",
      description: "Advanced training in energy healing techniques.",
      type: "white"
    }
  ];

  return (
    <div className="min-h-screen bg-[#fefbf5]">
      {/* Header */}
      <HeaderSection 
        navigationItems={createNavigationItems('/about')}
        brand={brandConfig}
      />

      {/* Hero Section */}
      <ResponsiveContainer variant="page" className="pt-24">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[600px]">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Experienced Reiki Master &amp; Sound Healer in Roy
            </h1>
            
            <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
              <p>
                <span className="font-medium">As an </span>
                <span className="font-bold italic text-blue-700">
                  experienced Reiki Master and certified Sound Healer,
                </span>
                <span className="font-medium">
                  {" "}my mission is to help you reconnect with your inner balance, release emotional blockages, and restore harmony in your body, mind, and spirit.
                </span>
              </p>
              
              <p>
                <span className="font-medium">With years of practice in </span>
                <span className="font-bold italic text-blue-700">energy healing</span>
                <span className="font-medium"> and </span>
                <span className="font-bold italic text-blue-700">holistic wellness, </span>
                <span className="font-medium">
                  I combine gentle Reiki techniques with the vibrational power of sound therapy to create a deeply relaxing and transformative experience.
                </span>
              </p>
            </div>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 border border-blue-700 rounded-full text-blue-700 font-medium hover:bg-blue-700 hover:text-white transition-colors"
            >
              Learn More
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="relative">
            <img
              className="w-full max-w-md mx-auto rounded-lg shadow-xl"
              alt="Reiki healing session"
              src="/img/fb8b1754eb9a50a6cfaec02f5ef0c9bc-2.png"
            />
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Every healing session is tailored to your unique needs, ensuring you feel calm, centered, and revitalized. 
            Whether you're seeking relief from stress, emotional healing, or spiritual growth — I am here to guide you 
            on your journey to self-discovery and inner peace.
          </p>
        </div>
      </ResponsiveContainer>

      {/* About Section */}
      <ResponsiveContainer variant="page" className="py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
              Welcome to The Reiki Goddess
            </h2>
            
            <p className="text-lg text-gray-700 leading-relaxed">
              Welcome! I'm Deirdre Quigley, the founder of The Reiki Goddess Healing in Roy, Washington. 
              With a deep passion for energy healing and holistic wellness, I blend the gentle art of Reiki 
              with the transformative power of sound therapy to help you release stress, restore balance, 
              and awaken your inner strength.
            </p>
            
            <p className="text-lg text-gray-700 leading-relaxed">
              My approach is warm, intuitive, and personalized — ensuring every session supports your 
              unique journey toward healing and self-discovery.
            </p>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 border border-blue-700 rounded-full text-blue-700 font-medium hover:bg-blue-700 hover:text-white transition-colors"
            >
              Learn More
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="relative">
            <img
              className="w-full max-w-md mx-auto rounded-lg shadow-lg"
              alt="Deirdre Quigley portrait"
              src="/img/rectangle-5.png"
            />
            
            <div className="absolute -bottom-4 -right-4 transform rotate-[-5deg] opacity-10">
              <span className="text-6xl font-extrabold text-blue-700 tracking-wider">
                The Reiki Goddess
              </span>
            </div>
          </div>
        </div>
      </ResponsiveContainer>

      {/* Journey Section */}
      <ResponsiveContainer variant="page" className="py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <img
              className="w-full max-w-md mx-auto lg:mx-0 rounded-lg shadow-lg"
              alt="Healing space"
              src="/img/rectangle-6.png"
            />
            
            {/* Credentials Cards */}
            <div className="space-y-4">
              {credentials.map((credential, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-2xl shadow-lg ${
                    credential.type === 'gradient' 
                      ? 'bg-gradient-to-br from-blue-700 to-cyan-400 text-white' 
                      : 'bg-white text-gray-900'
                  }`}
                >
                  <h3 className="text-lg font-bold mb-2">
                    {credential.title}
                  </h3>
                  <p className={`${credential.type === 'gradient' ? 'text-white' : 'text-gray-600'}`}>
                    {credential.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
              My Journey: Inspiring Personal Growth &amp; Renewal
            </h2>
            
            <p className="text-lg text-gray-700 leading-relaxed">
              My journey into the world of Reiki healing began with a personal quest for peace, balance, and 
              deeper self-awareness. Over the years, I have transformed that passion into a mission — helping 
              others release emotional blockages, restore harmony, and embrace their true potential.
            </p>
            
            <p className="text-lg text-gray-700 leading-relaxed">
              Through dedication, continuous learning, and heartfelt connection, I've guided countless individuals 
              toward healing and renewal, creating a space where transformation feels safe and empowering.
            </p>
          </div>
        </div>
      </ResponsiveContainer>

      {/* Contact CTA Section */}
      <ResponsiveContainer variant="full" className="py-20">
        <div 
          className="relative rounded-2xl overflow-hidden shadow-xl bg-cover bg-center bg-blue-700 text-white"
          style={{ backgroundImage: 'url(/img/2148847564-1.png)' }}
        >
          <div className="relative z-10 p-12 text-center space-y-8">
            <h2 className="text-4xl lg:text-5xl font-bold">
              Contact Me for Personalized Assistance
            </h2>
            
            <p className="text-lg max-w-4xl mx-auto leading-relaxed opacity-90">
              At The Reiki Goddess Healing, your well-being is my highest priority. I understand how 
              important it is to feel a sense of accomplishment, inner peace, and balance in life. 
              That's why, after understanding your needs and goals, I create a fully customized healing 
              plan just for you — guiding you every step of the way toward transformation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-3 border border-white rounded-full text-white font-medium hover:bg-white hover:text-blue-700 transition-colors"
              >
                Book a Session
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 text-white font-medium hover:bg-white hover:text-blue-700 hover:bg-opacity-20 rounded-full transition-colors"
              >
                Learn More
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </ResponsiveContainer>

      {/* Image Gallery Section */}
      <ResponsiveContainer variant="page" className="py-16">
        <div className="text-center space-y-8">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
            Image Gallery
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <img
                key={index}
                className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow"
                alt={image.alt}
                src={image.src}
              />
            ))}
          </div>
          
          <button className="inline-flex items-center gap-2 px-6 py-3 border border-blue-700 rounded-full text-blue-700 font-medium hover:bg-blue-700 hover:text-white transition-colors">
            See More
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </ResponsiveContainer>

      {/* Testimonials Section */}
      <ResponsiveContainer variant="page" className="py-16">
        <div className="text-center space-y-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
            What My Clients Are Saying
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-amber-50 rounded-2xl p-8 shadow-md">
              <div className="space-y-6">
                <img
                  className="w-16 h-16 rounded-full mx-auto"
                  alt={testimonial.name}
                  src={testimonial.image}
                />
                
                <div className="space-y-4">
                  <p className="text-xl text-gray-800 leading-relaxed italic">
                    {testimonial.text}
                  </p>
                  
                  <p className="font-bold text-lg text-gray-900">
                    {testimonial.name}
                  </p>
                </div>
                
                <div className="flex justify-center gap-1">
                  {stars.map((_, index) => (
                    <svg
                      key={index}
                      className="w-6 h-6 text-yellow-400 fill-current"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Testimonial Navigation */}
            <div className="flex justify-center items-center gap-8 mt-8">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-blue-700 rounded-full" />
                <div className="w-3 h-3 bg-gray-300 rounded-full" />
                <div className="w-3 h-3 bg-gray-300 rounded-full" />
              </div>
              
              <div className="flex gap-4">
                <button className="w-12 h-12 border-2 border-blue-700 rounded-full flex items-center justify-center hover:bg-blue-700 hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button className="w-12 h-12 border-2 border-blue-700 rounded-full flex items-center justify-center hover:bg-blue-700 hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </ResponsiveContainer>

      {/* Final CTA Section */}
      <ResponsiveContainer variant="page" className="py-20">
        <div className="relative bg-gradient-to-br from-blue-700 to-cyan-400 rounded-2xl p-12 text-center text-white shadow-2xl">
          {/* Decorative corners */}
          <div className="absolute top-4 left-4 w-4 h-4 bg-white rounded-lg opacity-20" />
          <div className="absolute top-4 right-4 w-4 h-4 bg-white rounded-lg opacity-20" />
          <div className="absolute bottom-4 left-4 w-4 h-4 bg-white rounded-lg opacity-20" />
          <div className="absolute bottom-4 right-4 w-4 h-4 bg-white rounded-lg opacity-20" />
          
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl lg:text-5xl font-bold">
              Ready to Begin Your Healing Journey?
            </h2>
            
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-3 border border-white rounded-full text-white font-medium hover:bg-white hover:text-blue-700 transition-colors"
            >
              Book Your Session Today
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
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

export { AboutPage };