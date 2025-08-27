import React, { useState } from 'react';

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  content: string;
  rating: number;
  image?: {
    src: string;
    alt: string;
  };
}

export interface TestimonialsProps {
  heading?: string;
  testimonials?: Testimonial[];
  className?: string;
}

/**
 * Testimonials section component
 * Displays client testimonials with carousel navigation
 */
export const Testimonials: React.FC<TestimonialsProps> = ({
  heading = 'Real Healing. Real People. Real Stories.',
  testimonials = [
    {
      id: '1',
      name: 'Jessica M.',
      location: 'Tacoma, WA',
      content: 'I had no idea how deeply I was holding onto emotional pain until my first session with Deirdre. Her presence is calming, intuitive, and safe. I\'m beyond grateful to have found her.',
      rating: 5,
      image: {
        src: '/img/testimonial-jessica.jpg',
        alt: 'Jessica M.'
      }
    },
    {
      id: '2',
      name: 'Michael R.',
      location: 'Seattle, WA',
      content: 'The sound healing sessions have been transformative. I\'ve never experienced such deep relaxation and clarity. Deirdre creates a sacred space where healing naturally unfolds.',
      rating: 5,
      image: {
        src: '/img/testimonial-michael.jpg',
        alt: 'Michael R.'
      }
    },
    {
      id: '3',
      name: 'Sarah K.',
      location: 'Olympia, WA',
      content: 'After struggling with anxiety for years, I finally feel like myself again. Deirdre\'s combination of Reiki and breathwork has given me tools I use every day.',
      rating: 5,
      image: {
        src: '/img/testimonial-sarah.jpg',
        alt: 'Sarah K.'
      }
    },
    {
      id: '4',
      name: 'David L.',
      location: 'Roy, WA',
      content: 'I was skeptical at first, but the results speak for themselves. My chronic pain has significantly decreased, and I feel more balanced than I have in years.',
      rating: 5,
      image: {
        src: '/img/testimonial-david.jpg',
        alt: 'David L.'
      }
    }
  ],
  className = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + 1 >= testimonials.length ? 0 : prevIndex + 1
    );
  };
  
  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex - 1 < 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section 
      className={`py-20 ${className}`}
      style={{ 
        minHeight: '600px',
        backgroundColor: '#FFFBF5'
      }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Heading */}
        <h2 
          className="text-center font-bold text-gray-900 mb-8"
          style={{
            fontFamily: 'Figtree, Helvetica, sans-serif',
            fontSize: '48px',
            lineHeight: '1.2'
          }}
        >
          {heading}
        </h2>
        
        {/* Social Media Profile Card - Frame 26 */}
        <div className="flex justify-center mb-16">
          <div 
            className="bg-white flex items-center gap-6 px-8 py-3"
            style={{
              border: '3px solid #63D5F9',
              borderRadius: '100px',
              width: '754px',
              height: '96px'
            }}
          >
            {/* Profile Photo */}
            <div 
              className="rounded-full overflow-hidden flex-shrink-0"
              style={{
                width: '52px',
                height: '52px'
              }}
            >
              <img
                src="/img/social-card-profile.png"
                alt="Deirdre with sound healing bowls"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Profile Info */}
            <div className="flex-shrink-0">
              <h3 
                className="font-semibold"
                style={{
                  fontFamily: 'Figtree, Helvetica, sans-serif',
                  fontSize: '18px',
                  color: '#000000',
                  lineHeight: '1.2'
                }}
              >
                Deirdre
              </h3>
              <p 
                style={{
                  fontFamily: 'Figtree, Helvetica, sans-serif',
                  fontSize: '14px',
                  color: '#666666',
                  lineHeight: '1.2'
                }}
              >
                @the_reiki_goddess
              </p>
            </div>
            
            {/* Spacer */}
            <div className="flex-grow"></div>
            
            {/* Stats */}
            <div className="flex gap-8">
              <div className="text-center">
                <div 
                  className="font-bold"
                  style={{
                    fontFamily: 'Figtree, Helvetica, sans-serif',
                    fontSize: '18px',
                    color: '#000000',
                    lineHeight: '1.2'
                  }}
                >
                  500
                </div>
                <div 
                  style={{
                    fontFamily: 'Figtree, Helvetica, sans-serif',
                    fontSize: '14px',
                    color: '#666666',
                    lineHeight: '1.2'
                  }}
                >
                  Posts
                </div>
              </div>
              <div className="text-center">
                <div 
                  className="font-bold"
                  style={{
                    fontFamily: 'Figtree, Helvetica, sans-serif',
                    fontSize: '18px',
                    color: '#000000',
                    lineHeight: '1.2'
                  }}
                >
                  754
                </div>
                <div 
                  style={{
                    fontFamily: 'Figtree, Helvetica, sans-serif',
                    fontSize: '14px',
                    color: '#666666',
                    lineHeight: '1.2'
                  }}
                >
                  Followers
                </div>
              </div>
              <div className="text-center">
                <div 
                  className="font-bold"
                  style={{
                    fontFamily: 'Figtree, Helvetica, sans-serif',
                    fontSize: '18px',
                    color: '#000000',
                    lineHeight: '1.2'
                  }}
                >
                  871
                </div>
                <div 
                  style={{
                    fontFamily: 'Figtree, Helvetica, sans-serif',
                    fontSize: '14px',
                    color: '#666666',
                    lineHeight: '1.2'
                  }}
                >
                  Following
                </div>
              </div>
            </div>
            
            {/* Spacer */}
            <div className="w-8"></div>
            
            {/* Follow Button */}
            <a
              href="https://instagram.com/the_reiki_goddess"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2 transition-colors flex-shrink-0"
              style={{
                backgroundColor: '#FFFFFF',
                border: '2px solid #63D5F9',
                borderRadius: '8px',
                color: '#63D5F9',
                fontFamily: 'Figtree, Helvetica, sans-serif',
                fontSize: '16px',
                fontWeight: '600'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#63D5F9';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.color = '#63D5F9';
              }}
            >
              {/* Instagram Icon */}
              <svg 
                className="w-5 h-5" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
              </svg>
              Follow
            </a>
          </div>
        </div>
        
        {/* Event Flyers Section */}
        <div className="flex justify-center gap-8 mb-12">
          {/* Full Moon Soundbath Flyer */}
          <div className="overflow-hidden" style={{ borderRadius: '20px', width: '395px' }}>
            <img
              src="/img/download-1-full-moon-soundbath.png"
              alt="Full Moon Aerial Sound Bath event flyer"
              className="w-full h-auto object-cover"
              style={{ display: 'block' }}
            />
          </div>
          
          {/* Second Event Flyer */}
          <div className="overflow-hidden" style={{ borderRadius: '20px', width: '395px' }}>
            <img
              src="/img/download-2.png"
              alt="Healing event flyer"
              className="w-full h-auto object-cover"
              style={{ display: 'block' }}
            />
          </div>
          
          {/* Sowin Event Flyer */}
          <div className="overflow-hidden" style={{ borderRadius: '20px', width: '395px' }}>
            <img
              src="/img/download-1-sowin.png"
              alt="Sowin event flyer"
              className="w-full h-auto object-cover"
              style={{ display: 'block' }}
            />
          </div>
        </div>
        
        {/* What My Clients Are Saying Header */}
        <h2 
          className="text-center font-bold text-gray-900 mb-12"
          style={{
            fontFamily: 'Figtree, Helvetica, sans-serif',
            fontSize: '48px',
            lineHeight: '1.2'
          }}
        >
          What My Clients Are Saying
        </h2>
        
        {/* Testimonial Container */}
        <div className="relative" style={{ paddingLeft: '66px', paddingRight: '66px' }}>
          <div 
            style={{ 
              backgroundColor: 'rgba(169, 148, 72, 0.13)',
              width: '100%',
              maxWidth: '1308px', // 1440px - (66px * 2)
              height: '351px',
              borderRadius: '20px',
              paddingTop: '47px',
              paddingRight: '225px',
              paddingBottom: '47px',
              paddingLeft: '224px',
              margin: '0 auto'
            }}>
            {/* Testimonial Content */}
            <div className="text-center h-full flex flex-col justify-center">
              {/* Profile Image */}
              <div className="mb-4 relative">
                <div 
                  className="mx-auto rounded-full overflow-hidden"
                  style={{
                    width: '80px',
                    height: '80px',
                    border: '3px solid white'
                  }}
                >
                  <img
                    src="/img/testimonial-jessica.jpg"
                    alt="Jessica M."
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Name and Location */}
              <h3 
                className="font-semibold mb-4"
                style={{
                  fontFamily: 'Figtree, Helvetica, sans-serif',
                  fontSize: '18px',
                  color: '#000000'
                }}
              >
                {currentTestimonial.name}, {currentTestimonial.location}
              </h3>
              
              {/* Quote */}
              <p 
                className="mb-4"
                style={{
                  fontFamily: 'Figtree, Helvetica, sans-serif',
                  fontSize: '16px',
                  lineHeight: '1.6',
                  color: '#000000',
                  maxWidth: '690px',
                  margin: '0 auto 20px'
                }}
              >
                "{currentTestimonial.content}"
              </p>
              
              {/* Star Rating */}
              <div className="flex justify-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <svg
                    key={index}
                    className={`w-5 h-5 ${
                      index < currentTestimonial.rating
                        ? 'text-[#C4A962] fill-current'
                        : 'text-gray-300 fill-current'
                    }`}
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
            </div>
            
            {/* Navigation Buttons */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex items-center justify-between pointer-events-none">
              <button
                onClick={prevTestimonial}
                className="pointer-events-auto ml-8 bg-white border-2 border-[#0205B7] text-[#0205B7] rounded-full p-3 hover:bg-[#0205B7] hover:text-white transition-colors shadow-lg"
                aria-label="Previous testimonial"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={nextTestimonial}
                className="pointer-events-auto mr-8 bg-white border-2 border-[#0205B7] text-[#0205B7] rounded-full p-3 hover:bg-[#0205B7] hover:text-white transition-colors shadow-lg"
                aria-label="Next testimonial"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Dots Indicator - positioned between testimonials and Let's Connect */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`transition-all duration-300 ${
                currentIndex === index
                  ? 'w-8 h-2 bg-[#0205B7] rounded-full'
                  : 'w-2 h-2 bg-gray-300 rounded-full hover:bg-gray-400'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};