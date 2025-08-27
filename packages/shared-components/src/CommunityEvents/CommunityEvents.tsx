import React from 'react';

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
  return (
    <section 
      className={`relative py-20 overflow-hidden ${className}`}
      style={{
        minHeight: '600px',
        borderRadius: '30px',
        margin: '40px 0'
      }}
    >
      {/* Background with image and gradient overlay */}
      <div className="absolute inset-0">
        {/* Background image */}
        <img 
          src="/img/community-highlights.jpg" 
          alt="Sound healing bowl with mallet"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ borderRadius: '30px' }}
        />
        {/* Gradient overlay matching Figma design */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundColor: 'rgba(2, 5, 183, 0.44)',
            borderRadius: '30px'
          }}
        />
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
        
        {/* Events Container - Separate White Rectangles per Frame 20 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mx-auto" style={{ maxWidth: '1100px' }}>
          {/* Full Moon Aerial Sound Bath Card */}
          <div 
            className="bg-white flex flex-col items-center text-center"
            style={{
              borderRadius: '20px',
              padding: '30px'
            }}
          >
            <div 
              className="w-full overflow-hidden mb-4"
              style={{ 
                borderRadius: '20px',
                height: '200px'
              }}
            >
              <img
                src="/img/download 1-full-moon-soundbath.png"
                alt="Full Moon Aerial Sound Bath"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 
              className="font-semibold mb-4"
              style={{
                fontFamily: 'Figtree, Helvetica, sans-serif',
                fontSize: '22px',
                color: '#333333'
              }}
            >
              Full Moon Aerial Sound Bath
            </h3>
            <button
              className="px-6 py-2 bg-transparent border-2 rounded-full transition-all duration-300 hover:shadow-lg"
              style={{
                borderColor: '#0205B7',
                color: '#0205B7',
                fontFamily: 'Figtree, Helvetica, sans-serif',
                fontSize: '16px',
                fontWeight: '500'
              }}
              onClick={() => window.location.href = '/events/full-moon'}
            >
              Learn More
            </button>
          </div>

          {/* Custom Sound Healing Song Workshop Card */}
          <div 
            className="bg-white flex flex-col items-center text-center"
            style={{
              borderRadius: '20px',
              padding: '30px'
            }}
          >
            <div 
              className="w-full overflow-hidden mb-4"
              style={{ 
                borderRadius: '20px',
                height: '200px'
              }}
            >
              <img
                src="/img/Rectangle 4-custom-sound-healing-song-workshop.png"
                alt="Custom Sound Healing Song Workshop"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 
              className="font-semibold mb-4"
              style={{
                fontFamily: 'Figtree, Helvetica, sans-serif',
                fontSize: '22px',
                color: '#333333'
              }}
            >
              Custom Sound Healing Workshop
            </h3>
            <button
              className="px-6 py-2 bg-transparent border-2 rounded-full transition-all duration-300 hover:shadow-lg"
              style={{
                borderColor: '#0205B7',
                color: '#0205B7',
                fontFamily: 'Figtree, Helvetica, sans-serif',
                fontSize: '16px',
                fontWeight: '500'
              }}
              onClick={() => window.location.href = '/events/workshop'}
            >
              Learn More
            </button>
          </div>
        </div>
        
        {/* Pagination Dots and CTA Button */}
        <div className="mt-12">
          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mb-6">
            <div 
              className="rounded-full"
              style={{
                width: '10px',
                height: '10px',
                backgroundColor: '#63D5F9'
              }}
            />
            <div 
              className="rounded-full"
              style={{
                width: '10px',
                height: '10px',
                backgroundColor: 'rgba(99, 213, 249, 0.5)'
              }}
            />
            <div 
              className="rounded-full"
              style={{
                width: '10px',
                height: '10px',
                backgroundColor: 'rgba(99, 213, 249, 0.5)'
              }}
            />
          </div>
          
          {/* CTA Button */}
          {ctaButton && (
            <div className="text-center">
              <a
                href={ctaButton.href}
                onClick={ctaButton.onClick}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full transition-colors duration-200"
                style={{
                  backgroundColor: 'transparent',
                  border: '2px solid white',
                  color: 'white',
                  fontFamily: 'Figtree, Helvetica, sans-serif',
                  fontSize: '16px',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {ctaButton.text}
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 5l7 7-7 7" 
                  />
                </svg>
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};