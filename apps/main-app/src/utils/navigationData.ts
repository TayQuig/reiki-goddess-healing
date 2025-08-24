import { businessData } from '@reiki-goddess/shared-utils';

export const createNavigationItems = (currentPath: string) => [
  { 
    id: 'home',
    label: 'Home', 
    href: '/', 
    current: currentPath === '/' 
  },
  { 
    id: 'about',
    label: 'About', 
    href: '/about', 
    current: currentPath === '/about' 
  },
  { 
    id: 'contact',
    label: 'Contact', 
    href: '/contact', 
    current: currentPath === '/contact' 
  },
  { 
    id: 'blog',
    label: 'Blog', 
    href: '/blog', 
    current: currentPath === '/blog' 
  }
];

export const footerSections = [
  {
    id: 'quick-links',
    title: 'Quick Links',
    links: [
      { 
        id: 'about-link',
        label: 'About', 
        href: '/about' 
      },
      { 
        id: 'services-link',
        label: 'Services', 
        href: '/about#services' 
      },
      { 
        id: 'contact-link',
        label: 'Contact', 
        href: '/contact' 
      },
      { 
        id: 'blog-link',
        label: 'Blog', 
        href: '/blog' 
      }
    ]
  }
];

export const socialLinks = [
  { 
    id: 'facebook',
    name: 'Facebook', 
    platform: 'facebook' as const,
    url: businessData.socialMedia.facebook, 
    iconSrc: '/icons/facebook.svg',
    iconAlt: 'Facebook'
  },
  { 
    id: 'instagram',
    name: 'Instagram', 
    platform: 'instagram' as const,
    url: businessData.socialMedia.instagram, 
    iconSrc: '/icons/instagram.svg',
    iconAlt: 'Instagram'
  }
];

export const brandConfig = {
  brandName: businessData.name,
  businessName: businessData.name,
  logoSrc: '/img/the-reiki-goddess-4-25-x-5-5-in-facebook-cover-1.png',
  logoAlt: 'The Reiki Goddess Healing Logo'
};

export const copyrightConfig = {
  year: 2025,
  entity: businessData.name,
  additionalText: 'All Rights Reserved.'
};