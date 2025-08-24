import React from 'react';
import { HeroV2, HeroV2Props } from './HeroV2';

export interface ResponsiveHeroV2Props extends HeroV2Props {
  maxWidth?: number;
  mobileHeight?: string;
}

/**
 * Responsive wrapper for HeroV2 component
 * Adapts the hero section for different screen sizes
 */
export const ResponsiveHeroV2: React.FC<ResponsiveHeroV2Props> = ({
  maxWidth = 1440,
  mobileHeight = '600px',
  ...heroProps
}) => {
  return (
    <div 
      className="relative w-full"
      style={{ maxWidth: `${maxWidth}px`, margin: '0 auto' }}
    >
      {/* Desktop Version */}
      <div className="hidden lg:block">
        <HeroV2 {...heroProps} />
      </div>
      
      {/* Tablet/Mobile Version */}
      <div className="lg:hidden">
        <section 
          className="relative w-full overflow-hidden"
          style={{ height: mobileHeight }}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={heroProps.backgroundImage?.src || '/img/fb8b1754eb9a50a6cfaec02f5ef0c9bc-1.png'}
              alt={heroProps.backgroundImage?.alt || 'Reiki healing session background'}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          
          {/* Mobile Overlay Content */}
          <div className="relative z-10 h-full flex items-center justify-center px-6">
            <div className="text-center">
              {/* Mobile Heading */}
              {heroProps.overlayContent?.heading && (
                <h1 
                  className="font-bold text-white mb-4 text-3xl md:text-5xl"
                  style={{ fontFamily: 'Figtree, Helvetica, sans-serif' }}
                >
                  {heroProps.overlayContent.heading}
                </h1>
              )}
              
              {/* Mobile Subheading */}
              {heroProps.overlayContent?.subheading && (
                <p 
                  className="text-white mb-8 text-sm md:text-base max-w-md mx-auto"
                  style={{ fontFamily: 'Figtree, Helvetica, sans-serif' }}
                >
                  {heroProps.overlayContent.subheading}
                </p>
              )}
              
              {/* Mobile Buttons */}
              {heroProps.overlayContent?.buttons && (
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {heroProps.overlayContent.buttons.map((button, index) => (
                    <a
                      key={index}
                      href={button.href || '#'}
                      className={`
                        inline-flex items-center justify-center
                        px-5 py-2.5 rounded-full 
                        font-medium text-sm md:text-base
                        transition-all duration-200
                        ${button.variant === 'primary' 
                          ? 'bg-[#0205B7] text-white' 
                          : 'bg-white/10 text-white border border-white'
                        }
                      `}
                      style={{ fontFamily: 'Figtree, Helvetica, sans-serif' }}
                    >
                      {button.text}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};