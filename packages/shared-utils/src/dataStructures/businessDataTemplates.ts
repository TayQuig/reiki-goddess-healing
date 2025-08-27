/**
 * Business Data Templates - Based on Contact page superior data patterns
 *
 * These templates provide structured data interfaces for wellness business
 * content management with TypeScript safety and accessibility compliance.
 */

// Default business data for The Reiki Goddess Healing
export const businessData = {
  name: "The Reiki Goddess Healing",
  tagline: "Transforming lives through energy healing",
  location: "Roy, Washington",
  phone: "0300 0000 0000",
  email: "thereikigoddesshealing@gmail.com",
  website: "https://reikigoddesshealing.com",
  founder: "Deirdre Quigley",
  services: [
    "Reiki Healing",
    "Sound Therapy",
    "Holistic Wellness",
    "Energy Healing",
  ],
  socialMedia: {
    facebook: "https://www.facebook.com/reikigoddesshealing",
    instagram: "https://www.instagram.com/reikigoddesshealing",
  },
};

/**
 * Contact information template with enhanced structure
 */
export interface ContactInfo {
  id: string;
  type: "location" | "phone" | "email" | "hours";
  title: string;
  icon: {
    src: string;
    alt: string;
  };
  content: string;
  action?: {
    text: string;
    url: string;
    type: "link" | "tel" | "mailto" | "external";
    icon?: {
      src: string;
      alt: string;
    };
  };
  metadata?: {
    priority: number;
    category: string;
    businessCritical: boolean;
  };
}

/**
 * Service information template for wellness services
 */
export interface ServiceInfo {
  id: string;
  name: string;
  category: "reiki" | "crystal-healing" | "consultation" | "energy-work";
  description: {
    short: string;
    long: string;
  };
  pricing: {
    amount: number;
    currency: string;
    unit: "session" | "hour" | "package";
    packages?: {
      name: string;
      sessions: number;
      discount: number;
    }[];
  };
  duration: {
    minutes: number;
    flexible: boolean;
  };
  media: {
    image: {
      src: string;
      alt: string;
    };
    gallery?: {
      src: string;
      alt: string;
      caption?: string;
    }[];
  };
  booking: {
    available: boolean;
    onlineBooking: boolean;
    consultationRequired: boolean;
  };
  benefits: string[];
  contraindications?: string[];
  metadata: {
    featured: boolean;
    popularity: number;
    testimonialCount: number;
  };
}

/**
 * Testimonial template with enhanced validation
 */
export interface TestimonialInfo {
  id: string;
  client: {
    name: string;
    initials?: string;
    location: string;
    verified: boolean;
  };
  content: {
    text: string;
    rating: number;
    headline?: string;
  };
  service: {
    id: string;
    name: string;
    category: string;
  };
  media?: {
    image?: {
      src: string;
      alt: string;
    };
    video?: {
      src: string;
      poster: string;
    };
  };
  metadata: {
    dateCreated: string;
    featured: boolean;
    verified: boolean;
    source: "direct" | "google" | "facebook" | "yelp";
  };
}

/**
 * Navigation structure template
 */
export interface NavigationStructure {
  primary: {
    id: string;
    label: string;
    href: string;
    children?: {
      id: string;
      label: string;
      href: string;
      description?: string;
    }[];
    metadata: {
      order: number;
      featured: boolean;
      requiresAuth: boolean;
    };
  }[];
  secondary: {
    id: string;
    label: string;
    href: string;
    external?: boolean;
  }[];
  cta: {
    label: string;
    href: string;
    style: "primary" | "secondary";
    tracking?: string;
  };
}

/**
 * Business profile template for wellness practice
 */
export interface BusinessProfile {
  basic: {
    name: string;
    tagline: string;
    description: {
      elevator: string;
      detailed: string;
    };
    logo: {
      primary: string;
      secondary?: string;
      favicon: string;
    };
  };
  contact: ContactInfo[];
  location: {
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    coordinates?: {
      latitude: number;
      longitude: number;
    };
    serviceArea: string[];
    virtualServices: boolean;
  };
  hours: {
    [key: string]: {
      open: string;
      close: string;
      closed?: boolean;
    };
  };
  social: {
    platform: string;
    url: string;
    handle?: string;
    followers?: number;
  }[];
  certifications: {
    name: string;
    organization: string;
    dateEarned: string;
    expirationDate?: string;
    certificateUrl?: string;
  }[];
  specialties: string[];
  languages: string[];
}

/**
 * Data validation helpers
 */
export const validateContactInfo = (data: ContactInfo): boolean => {
  return !!(
    data.id &&
    data.title &&
    data.content &&
    data.icon.src &&
    data.icon.alt
  );
};

export const validateServiceInfo = (data: ServiceInfo): boolean => {
  return !!(
    data.id &&
    data.name &&
    data.category &&
    data.description.short &&
    data.pricing.amount > 0 &&
    data.duration.minutes > 0
  );
};

export const validateTestimonialInfo = (data: TestimonialInfo): boolean => {
  return !!(
    data.id &&
    data.client.name &&
    data.content.text &&
    data.content.rating >= 1 &&
    data.content.rating <= 5 &&
    data.service.id
  );
};

/**
 * Default data generators for development
 */
export const createDefaultContactInfo = (): ContactInfo[] => [
  {
    id: "location",
    type: "location",
    title: "Our Location",
    icon: { src: "/img/location-icon.svg", alt: "Location icon" },
    content: "Roy, Washington",
    action: {
      text: "Get Directions",
      url: "https://maps.google.com",
      type: "external",
      icon: { src: "/img/external-link.svg", alt: "External link" },
    },
    metadata: {
      priority: 1,
      category: "contact",
      businessCritical: true,
    },
  },
  {
    id: "phone",
    type: "phone",
    title: "Phone",
    icon: { src: "/img/phone-icon.svg", alt: "Phone icon" },
    content: "(555) 123-4567",
    action: {
      text: "Call Now",
      url: "tel:+15551234567",
      type: "tel",
    },
    metadata: {
      priority: 2,
      category: "contact",
      businessCritical: true,
    },
  },
  {
    id: "email",
    type: "email",
    title: "Email",
    icon: { src: "/img/email-icon.svg", alt: "Email icon" },
    content: "hello@reikigoddesshealing.com",
    action: {
      text: "Send Email",
      url: "mailto:hello@reikigoddesshealing.com",
      type: "mailto",
    },
    metadata: {
      priority: 3,
      category: "contact",
      businessCritical: true,
    },
  },
];
