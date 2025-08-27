import React from "react";

export interface FooterLink {
  id: string;
  label: string;
  href: string;
}

export interface FooterSectionData {
  id: string;
  title: string;
  links: FooterLink[];
}

export interface SocialLink {
  id: string;
  name: string;
  platform: string;
  url: string;
  iconSrc: string;
  iconAlt: string;
}

export interface FooterContact {
  phone: string;
  email: string;
  address: string;
}

export interface FooterSectionProps {
  sections: FooterSectionData[];
  copyright: {
    year: number;
    entity: string;
    additionalText?: string;
  };
  socialLinks: SocialLink[];
  contact: FooterContact;
}

export const FooterSection: React.FC<FooterSectionProps> = ({
  sections,
  copyright,
  socialLinks,
  contact,
}) => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Business Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Contact Info
            </h3>
            <div className="space-y-2 text-gray-600">
              <p>📍 {contact.address}</p>
              <p>📞 {contact.phone}</p>
              <p>✉️ {contact.email}</p>
            </div>
          </div>

          {/* Footer Sections */}
          {sections.map((section) => (
            <div key={section.id} className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.href}
                      className="text-gray-600 hover:text-blue-700 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Follow Us</h3>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-700 transition-colors"
                  aria-label={`Follow us on ${social.platform}`}
                >
                  <span className="text-2xl">
                    {social.name === "Facebook" ? "📘" : "📸"}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-600">
            © {copyright.year} {copyright.entity}
            {copyright.additionalText && ` ${copyright.additionalText}`}
          </p>
        </div>
      </div>
    </footer>
  );
};
