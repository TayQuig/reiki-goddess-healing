import React from 'react';

export interface LetsConnectProps {
  heading?: string;
  location?: {
    icon?: React.ReactNode;
    text: string;
    href?: string;
  };
  email?: {
    icon?: React.ReactNode;
    text: string;
    href?: string;
  };
  phone?: {
    icon?: React.ReactNode;
    text: string;
    href?: string;
  };
  ctaButton?: {
    text: string;
    href: string;
    onClick?: () => void;
  };
  className?: string;
}

/**
 * Let's Connect section component
 * Call-to-action section with contact information
 */
export const LetsConnect: React.FC<LetsConnectProps> = ({
  heading = "Let's Connect",
  location = {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    text: 'Roy, Washington',
    href: 'https://maps.google.com/?q=Roy,Washington'
  },
  email = {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    text: 'thereikigoddeshealing@gmail.com',
    href: 'mailto:thereikigoddeshealing@gmail.com'
  },
  phone,
  ctaButton = {
    text: 'Book Your Session',
    href: '/book'
  },
  className = ''
}) => {
  return (
    <section 
      className={`relative py-20 overflow-hidden ${className}`}
      style={{
        background: 'linear-gradient(135deg, #4C1D95 0%, #2563EB 100%)',
        minHeight: '400px',
        borderRadius: '30px',
        margin: '40px 0'
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0">
        {/* Top Left Circle */}
        <div className="absolute top-8 left-8 w-8 h-8 bg-white/10 rounded-full" />
        {/* Top Right Circle */}
        <div className="absolute top-8 right-8 w-8 h-8 bg-white/10 rounded-full" />
        {/* Bottom Left Circle */}
        <div className="absolute bottom-8 left-8 w-8 h-8 bg-white/10 rounded-full" />
        {/* Bottom Right Circle */}
        <div className="absolute bottom-8 right-8 w-8 h-8 bg-white/10 rounded-full" />
        
        {/* Background Wave Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 400">
            <path 
              fill="white" 
              d="M0,192L48,197.3C96,203,192,213,288,192C384,171,480,117,576,112C672,107,768,149,864,165.3C960,181,1056,171,1152,165.3C1248,160,1344,160,1392,160L1440,160L1440,400L1392,400C1344,400,1248,400,1152,400C1056,400,960,400,864,400C768,400,672,400,576,400C480,400,384,400,288,400C192,400,96,400,48,400L0,400Z"
            />
          </svg>
        </div>
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Heading */}
        <h2 
          className="text-white font-bold mb-12"
          style={{
            fontFamily: 'Figtree, Helvetica, sans-serif',
            fontSize: '64px',
            lineHeight: '1.1',
            letterSpacing: '-0.02em'
          }}
        >
          {heading}
        </h2>
        
        {/* Contact Information */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-12">
          {/* Location */}
          {location && (
            <a 
              href={location.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-white hover:text-white/80 transition-colors"
            >
              {location.icon}
              <span 
                style={{
                  fontFamily: 'Figtree, Helvetica, sans-serif',
                  fontSize: '18px',
                  fontWeight: 500
                }}
              >
                {location.text}
              </span>
            </a>
          )}
          
          {/* Email */}
          {email && (
            <a 
              href={email.href}
              className="flex items-center gap-3 text-white hover:text-white/80 transition-colors"
            >
              {email.icon}
              <span 
                style={{
                  fontFamily: 'Figtree, Helvetica, sans-serif',
                  fontSize: '18px',
                  fontWeight: 500
                }}
              >
                {email.text}
              </span>
            </a>
          )}
          
          {/* Phone */}
          {phone && (
            <a 
              href={phone.href}
              className="flex items-center gap-3 text-white hover:text-white/80 transition-colors"
            >
              {phone.icon}
              <span 
                style={{
                  fontFamily: 'Figtree, Helvetica, sans-serif',
                  fontSize: '18px',
                  fontWeight: 500
                }}
              >
                {phone.text}
              </span>
            </a>
          )}
        </div>
        
        {/* CTA Button */}
        {ctaButton && (
          <div className="mt-12">
            <a
              href={ctaButton.href}
              onClick={ctaButton.onClick}
              className="inline-flex items-center justify-center px-10 py-4 bg-white text-purple-700 rounded-full font-semibold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-xl"
              style={{
                fontFamily: 'Figtree, Helvetica, sans-serif',
                fontSize: '18px',
                minWidth: '200px'
              }}
            >
              {ctaButton.text}
              <svg className="ml-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        )}
        
        {/* Optional Social Links */}
        <div className="mt-8 flex justify-center gap-4">
          <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};