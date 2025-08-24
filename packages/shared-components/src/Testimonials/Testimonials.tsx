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
          className="text-center font-bold text-gray-900 mb-16"
          style={{
            fontFamily: 'Figtree, Helvetica, sans-serif',
            fontSize: '48px',
            lineHeight: '1.2'
          }}
        >
          {heading}
        </h2>
        
        {/* Testimonial Container */}
        <div className="relative">
          <div className="bg-white shadow-xl p-8 md:p-12" style={{ borderRadius: '20px' }}>
            {/* Testimonial Content */}
            <div className="text-center max-w-3xl mx-auto">
              {/* Profile Image */}
              {currentTestimonial.image && (
                <div className="mb-6">
                  <img
                    src={currentTestimonial.image.src}
                    alt={currentTestimonial.image.alt}
                    className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-purple-100"
                  />
                </div>
              )}
              
              {/* Name and Location */}
              <div className="mb-6">
                <h3 
                  className="font-semibold text-gray-900"
                  style={{
                    fontFamily: 'Figtree, Helvetica, sans-serif',
                    fontSize: '20px'
                  }}
                >
                  {currentTestimonial.name}, {currentTestimonial.location}
                </h3>
              </div>
              
              {/* Quote */}
              <blockquote className="mb-8">
                <p 
                  className="text-gray-700 italic text-lg leading-relaxed"
                  style={{
                    fontFamily: 'Figtree, Helvetica, sans-serif',
                    fontSize: '18px',
                    lineHeight: '1.8'
                  }}
                >
                  "{currentTestimonial.content}"
                </p>
              </blockquote>
              
              {/* Star Rating */}
              <div className="flex justify-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <svg
                    key={index}
                    className={`w-6 h-6 ${
                      index < currentTestimonial.rating
                        ? 'text-yellow-400 fill-current'
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
            <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between pointer-events-none">
              <button
                onClick={prevTestimonial}
                className="pointer-events-auto -translate-x-1/2 bg-white border-2 border-[#0205B7] text-[#0205B7] rounded-full p-3 hover:bg-[#0205B7] hover:text-white transition-colors shadow-lg"
                aria-label="Previous testimonial"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={nextTestimonial}
                className="pointer-events-auto translate-x-1/2 bg-white border-2 border-[#0205B7] text-[#0205B7] rounded-full p-3 hover:bg-[#0205B7] hover:text-white transition-colors shadow-lg"
                aria-label="Next testimonial"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Dots Indicator */}
        <div className="flex justify-center mt-8 gap-2">
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