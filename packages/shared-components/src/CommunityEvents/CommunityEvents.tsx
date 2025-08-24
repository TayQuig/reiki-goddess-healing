import React, { useState } from 'react';

export interface EventCard {
  id: string;
  title: string;
  image: {
    src: string;
    alt: string;
  };
  date?: string;
  description?: string;
}

export interface CommunityEventsProps {
  heading?: string;
  subheading?: string;
  events?: EventCard[];
  ctaButton?: {
    text: string;
    href: string;
    onClick?: () => void;
  };
  className?: string;
}

/**
 * Community Events section component extracted from Figma Frame 24
 * Displays upcoming events and community highlights in a carousel
 */
export const CommunityEvents: React.FC<CommunityEventsProps> = ({
  heading = 'Upcoming Events &',
  subheading = 'Community Highlights',
  events = [
    {
      id: 'full-moon',
      title: 'Full Moon Aerial Sound Bath',
      image: {
        src: '/img/download 1-full-moon-soundbath.png',
        alt: 'Full Moon Aerial Sound Bath event'
      },
      date: 'Next Full Moon',
      description: 'Experience deep relaxation with aerial yoga and sound healing'
    },
    {
      id: 'custom-workshop',
      title: 'Custom Sound Healing Song Workshop',
      image: {
        src: '/img/Rectangle 4-custom-sound-healing-song-workshop.png',
        alt: 'Custom Sound Healing Song Workshop'
      },
      date: 'Monthly Workshop',
      description: 'Learn to create your own healing soundscapes'
    },
    {
      id: 'fullmoon-aerial',
      title: 'Full Moon Aerial Soundbath',
      image: {
        src: '/img/Rectangle 4-fullmoon-aerial-soundbath.png',
        alt: 'Full Moon Aerial Soundbath'
      },
      date: 'Every Full Moon',
      description: 'Join our community for aerial healing sessions'
    }
  ],
  ctaButton = {
    text: 'View Full Calendar',
    href: '/events'
  },
  className = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 2; // Show 2 cards at a time on desktop
  
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + itemsPerView >= events.length ? 0 : prevIndex + itemsPerView
    );
  };
  
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex - itemsPerView < 0 ? Math.max(0, events.length - itemsPerView) : prevIndex - itemsPerView
    );
  };

  return (
    <section 
      className={`relative py-20 overflow-hidden ${className}`}
      style={{
        background: 'linear-gradient(180deg, rgba(165, 147, 224, 0.95) 0%, rgba(99, 66, 201, 0.95) 100%)',
        minHeight: '600px',
        borderRadius: '30px',
        margin: '40px 0'
      }}
    >
      {/* Background Image/Pattern Overlay */}
      <div className="absolute inset-0">
        {/* Purple gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/20 to-purple-700/30" />
        {/* Decorative blur elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400/30 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 
            className="text-white font-bold"
            style={{
              fontFamily: 'Figtree, Helvetica, sans-serif',
              fontSize: '48px',
              lineHeight: '1.2'
            }}
          >
            {heading}
          </h2>
          <h2 
            className="text-white font-bold"
            style={{
              fontFamily: 'Figtree, Helvetica, sans-serif',
              fontSize: '48px',
              lineHeight: '1.2'
            }}
          >
            {subheading}
          </h2>
        </div>
        
        {/* Events Carousel */}
        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out gap-6"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`
              }}
            >
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex-shrink-0 w-full md:w-[calc(50%-12px)]"
                >
                  <div className="bg-white overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300" style={{ borderRadius: '20px' }}>
                    {/* Event Image */}
                    <div className="h-48 overflow-hidden">
                      <img
                        src={event.image.src}
                        alt={event.image.alt}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    
                    {/* Event Content */}
                    <div className="p-6">
                      <h3 
                        className="font-semibold text-gray-900 mb-2"
                        style={{
                          fontFamily: 'Figtree, Helvetica, sans-serif',
                          fontSize: '20px'
                        }}
                      >
                        {event.title}
                      </h3>
                      
                      {event.date && (
                        <p className="text-sm text-purple-600 font-medium mb-2">
                          {event.date}
                        </p>
                      )}
                      
                      {event.description && (
                        <p 
                          className="text-gray-600"
                          style={{
                            fontFamily: 'Figtree, Helvetica, sans-serif',
                            fontSize: '14px',
                            lineHeight: '1.5'
                          }}
                        >
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation Arrows - Hidden on mobile */}
          {events.length > itemsPerView && (
            <>
              <button
                onClick={prevSlide}
                className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 bg-white/20 backdrop-blur text-white rounded-full p-3 hover:bg-white/30 transition-colors"
                aria-label="Previous events"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={nextSlide}
                className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 bg-white/20 backdrop-blur text-white rounded-full p-3 hover:bg-white/30 transition-colors"
                aria-label="Next events"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>
        
        {/* Carousel Dots */}
        <div className="flex justify-center mt-8 gap-2">
          {Array.from({ length: Math.ceil(events.length / itemsPerView) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index * itemsPerView)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                Math.floor(currentIndex / itemsPerView) === index
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        
        {/* CTA Button */}
        {ctaButton && (
          <div className="text-center mt-12">
            <a
              href={ctaButton.href}
              onClick={ctaButton.onClick}
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-purple-700 rounded-full font-medium hover:bg-gray-100 transition-colors duration-200"
              style={{
                fontFamily: 'Figtree, Helvetica, sans-serif',
                fontSize: '16px'
              }}
            >
              {ctaButton.text}
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </section>
  );
};