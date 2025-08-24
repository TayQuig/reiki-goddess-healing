import React from 'react';

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterProps {
  logo?: {
    src?: string;
    alt?: string;
  };
  tagline?: string;
  quickLinks?: FooterLink[];
  legalLinks?: FooterLink[];
  socialLinks?: {
    linkedin?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  copyright?: string;
  className?: string;
}

/**
 * Footer component
 * Site-wide footer with links and social media
 */
export const Footer: React.FC<FooterProps> = ({
  logo = {
    src: '/img/reiki-goddess-logo.png',
    alt: 'The Reiki Goddess'
  },
  tagline = 'Energy Healing for Optimal Mental Health & Wellness',
  quickLinks = [
    { label: 'Services', href: '/services' },
    { label: 'Events', href: '/events' },
    { label: 'Blog', href: '/blog' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' }
  ],
  legalLinks = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms & Conditions', href: '/terms' },
    { label: 'Disclaimer', href: '/disclaimer' }
  ],
  socialLinks = {
    linkedin: 'https://linkedin.com',
    facebook: 'https://facebook.com',
    twitter: 'https://twitter.com',
    instagram: 'https://instagram.com'
  },
  copyright = `© 2025 Thereikigoddess | All Rights Reserved.`,
  className = ''
}) => {
  return (
    <footer className={`bg-white ${className}`}>
      <div className="max-w-7xl mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              {/* Eye Logo */}
              <div className="w-12 h-12 relative">
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Outer eye shape */}
                  <ellipse cx="24" cy="24" rx="20" ry="12" stroke="#8B5CF6" strokeWidth="2" fill="none" />
                  {/* Iris */}
                  <circle cx="24" cy="24" r="8" fill="#8B5CF6" />
                  {/* Pupil */}
                  <circle cx="24" cy="24" r="3" fill="#1F2937" />
                  {/* Eye rays */}
                  <path d="M24 8V0M24 48V40M8 24H0M48 24H40" stroke="#F59E0B" strokeWidth="1.5" opacity="0.8" />
                  <path d="M12 12L6 6M42 42L36 36M36 12L42 6M6 42L12 36" stroke="#F59E0B" strokeWidth="1.5" opacity="0.6" />
                </svg>
              </div>
              <span 
                className="text-amber-600 uppercase font-medium"
                style={{
                  fontFamily: 'Figtree, Helvetica, sans-serif',
                  fontSize: '18px',
                  letterSpacing: '0.05em'
                }}
              >
                The Reiki Goddess
              </span>
            </div>
            <p 
              className="text-gray-600 text-sm whitespace-pre-line"
              style={{
                fontFamily: 'Figtree, Helvetica, sans-serif',
                lineHeight: '1.6'
              }}
            >
              {tagline}
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h3 
              className="font-semibold text-gray-900 mb-4"
              style={{
                fontFamily: 'Figtree, Helvetica, sans-serif',
                fontSize: '16px'
              }}
            >
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-gray-600 hover:text-purple-600 transition-colors"
                    style={{
                      fontFamily: 'Figtree, Helvetica, sans-serif',
                      fontSize: '14px'
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="md:col-span-1">
            <h3 
              className="font-semibold text-gray-900 mb-4"
              style={{
                fontFamily: 'Figtree, Helvetica, sans-serif',
                fontSize: '16px'
              }}
            >
              Legal
            </h3>
            <ul className="space-y-3">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-gray-600 hover:text-purple-600 transition-colors"
                    style={{
                      fontFamily: 'Figtree, Helvetica, sans-serif',
                      fontSize: '14px'
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow Us */}
          <div className="md:col-span-1">
            <h3 
              className="font-semibold text-gray-900 mb-4"
              style={{
                fontFamily: 'Figtree, Helvetica, sans-serif',
                fontSize: '16px'
              }}
            >
              Follow us
            </h3>
            <div className="flex gap-4">
              {/* LinkedIn */}
              {socialLinks.linkedin && (
                <a 
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-purple-600 transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              )}
              
              {/* Facebook */}
              {socialLinks.facebook && (
                <a 
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-purple-600 transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              )}
              
              {/* Twitter/X */}
              {socialLinks.twitter && (
                <a 
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-purple-600 transition-colors"
                  aria-label="Twitter"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              )}
              
              {/* Instagram */}
              {socialLinks.instagram && (
                <a 
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-purple-600 transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 pt-8">
          {/* Copyright */}
          <p 
            className="text-center text-gray-500 text-sm"
            style={{
              fontFamily: 'Figtree, Helvetica, sans-serif'
            }}
          >
            {copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};