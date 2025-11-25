import React from "react";

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
    src: "/img/the reiki goddess (4.25 x 5.5 in) (Facebook Cover) Logo.png",
    alt: "The Reiki Goddess Healing",
  },
  tagline = "Creating beautiful, functional websites\nfor small businesses.",
  quickLinks = [
    { label: "Services", href: "/services" },
    { label: "Events", href: "/events" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  legalLinks = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Disclaimer", href: "/disclaimer" },
  ],
  socialLinks = {
    linkedin: "https://linkedin.com",
    facebook: "https://facebook.com",
    twitter: "https://twitter.com",
    instagram: "https://instagram.com",
  },
  copyright = `© 2025 Thereikigoddess | All Rights Reserved.`,
  className = "",
}) => {
  return (
    <footer
      className={`${className} w-full`}
      style={{
        backgroundColor: "white",
        minHeight: "400px",
        boxShadow: "0 0 40px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="h-full flex flex-col px-6 py-12 lg:p-[66px]">
        {/* Main Footer Content */}
        <div className="grid gap-12 lg:gap-12 grid-cols-1 lg:grid-cols-4 mb-16">
          {/* Brand Column */}
          <div>
            <div className="mb-4">
              {/* Logo with eye icon style similar to design */}
              {logo.src && (
                <div className="flex items-center gap-3">
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "contain",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "Figtree, Helvetica, sans-serif",
                      fontSize: "18px",
                      fontWeight: 500,
                      color: "rgba(196, 169, 98, 1)",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    The Reiki Goddess
                  </span>
                </div>
              )}
            </div>
            <p
              className="whitespace-pre-line"
              style={{
                fontFamily: "Figtree, Helvetica, sans-serif",
                fontSize: "14px",
                lineHeight: "1.8",
                color: "rgba(94, 94, 94, 1)",
                marginTop: "16px",
              }}
            >
              {tagline}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3
              style={{
                fontFamily: "Figtree, Helvetica, sans-serif",
                fontSize: "18px",
                fontWeight: 600,
                color: "rgba(51, 51, 51, 1)",
                marginBottom: "20px",
              }}
            >
              Quick Links
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {quickLinks.map((link, index) => (
                <li key={index} style={{ marginBottom: "12px" }}>
                  <a
                    href={link.href}
                    className="hover:text-purple-600 transition-colors"
                    style={{
                      fontFamily: "Figtree, Helvetica, sans-serif",
                      fontSize: "14px",
                      color: "rgba(94, 94, 94, 1)",
                      textDecoration: "none",
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3
              style={{
                fontFamily: "Figtree, Helvetica, sans-serif",
                fontSize: "18px",
                fontWeight: 600,
                color: "rgba(51, 51, 51, 1)",
                marginBottom: "20px",
              }}
            >
              Legal
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {legalLinks.map((link, index) => (
                <li key={index} style={{ marginBottom: "12px" }}>
                  <a
                    href={link.href}
                    className="hover:text-purple-600 transition-colors"
                    style={{
                      fontFamily: "Figtree, Helvetica, sans-serif",
                      fontSize: "14px",
                      color: "rgba(94, 94, 94, 1)",
                      textDecoration: "none",
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h3
              style={{
                fontFamily: "Figtree, Helvetica, sans-serif",
                fontSize: "18px",
                fontWeight: 600,
                color: "rgba(51, 51, 51, 1)",
                marginBottom: "20px",
              }}
            >
              Follow us
            </h3>
            <div className="flex gap-3">
              {/* LinkedIn */}
              {socialLinks.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-70 transition-opacity"
                  aria-label="LinkedIn"
                  style={{
                    width: "32px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(51, 51, 51, 1)",
                    borderRadius: "4px",
                  }}
                >
                  <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              )}

              {/* Facebook */}
              {socialLinks.facebook && (
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-70 transition-opacity"
                  aria-label="Facebook"
                  style={{
                    width: "32px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(51, 51, 51, 1)",
                    borderRadius: "4px",
                  }}
                >
                  <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              )}

              {/* Twitter/X */}
              {socialLinks.twitter && (
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-70 transition-opacity"
                  aria-label="X (Twitter)"
                  style={{
                    width: "32px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(51, 51, 51, 1)",
                    borderRadius: "4px",
                  }}
                >
                  <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              )}

              {/* Instagram */}
              {socialLinks.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-70 transition-opacity"
                  aria-label="Instagram"
                  style={{
                    width: "32px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(51, 51, 51, 1)",
                    borderRadius: "4px",
                  }}
                >
                  <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Divider and Copyright */}
        <div
          style={{
            borderTop: "1px solid rgba(229, 229, 229, 1)",
            paddingTop: "30px",
          }}
        >
          <p
            className="text-center"
            style={{
              fontFamily: "Figtree, Helvetica, sans-serif",
              fontSize: "14px",
              color: "rgba(94, 94, 94, 1)",
            }}
          >
            {copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};
