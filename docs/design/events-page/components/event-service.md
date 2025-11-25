# Event service specification

**Service**: EventService
**Purpose**: Centralized data layer for all event-related operations
**Phase**: Phase 1 (MVP with mock data)
**Location**: `/packages/shared-utils/src/services/eventService.ts`

---

## Overview

EventService provides a consistent API for fetching and manipulating event data. Phase 1 uses mock data with realistic delays. Phase 2 integrates with backend API (Payload CMS or custom).

**Design Pattern**: Follows BlogService pattern exactly

---

## Service interface

```typescript
/**
 * Event Service
 *
 * Centralized service for all event-related data operations.
 * Supports filtering, pagination, availability checking, and registration.
 */
export class EventService {
  /**
   * Fetch all events with optional filtering
   *
   * Supports filtering by:
   * - Category
   * - Status (available, filling-fast, sold-out, waitlist-only)
   * - Date range (upcoming, past, specific dates)
   * - Pricing type (free, paid, donation)
   * - Location type (in-person, virtual, hybrid)
   *
   * @param filters - Optional filtering criteria
   * @returns Promise resolving to filtered event array
   */
  static async getEvents(filters?: EventFilters): Promise<Event[]>;

  /**
   * Fetch single event by slug
   *
   * @param slug - URL-friendly event identifier
   * @returns Promise resolving to event or null if not found
   */
  static async getEventBySlug(slug: string): Promise<Event | null>;

  /**
   * Check if event has available capacity
   *
   * Real-time check for registration eligibility
   *
   * @param eventId - Event identifier
   * @returns Promise resolving to true if spots available
   */
  static async checkAvailability(eventId: string): Promise<boolean>;

  /**
   * Submit registration
   *
   * For free events: Creates registration directly
   * For paid events: Returns Stripe checkout session URL
   *
   * @param eventId - Event to register for
   * @param registration - Registration data
   * @returns Promise resolving to registration result
   */
  static async registerForEvent(
    eventId: string,
    registration: RegistrationData
  ): Promise<RegistrationResult>;

  /**
   * Validate registration data (client-side)
   *
   * @param data - Registration form data
   * @returns Validation result with errors
   */
  static validateRegistration(data: RegistrationData): ValidationResult;

  /**
   * Get featured events
   *
   * Returns events marked as featured/pinned, sorted by displayOrder
   *
   * @param limit - Maximum number to return (default: 3)
   * @returns Promise resolving to featured events
   */
  static async getFeaturedEvents(limit?: number): Promise<Event[]>;

  /**
   * Get upcoming events
   *
   * Returns published events with startDateTime > now
   *
   * @param limit - Maximum number to return
   * @returns Promise resolving to upcoming events
   */
  static async getUpcomingEvents(limit?: number): Promise<Event[]>;

  /**
   * Get past events
   *
   * Returns completed events with endDateTime < now
   *
   * @param limit - Maximum number to return
   * @returns Promise resolving to past events
   */
  static async getPastEvents(limit?: number): Promise<Event[]>;

  /**
   * Get events by category
   *
   * @param category - Event category
   * @param limit - Maximum number to return
   * @returns Promise resolving to category events
   */
  static async getEventsByCategory(
    category: string,
    limit?: number
  ): Promise<Event[]>;

  /**
   * Get all event categories
   *
   * @returns Promise resolving to unique category array
   */
  static async getCategories(): Promise<string[]>;

  /**
   * Get related events
   *
   * Finds events similar to given event based on:
   * - Same category: +3 points
   * - Shared tags: +1 point per tag
   * - Similar location type: +2 points
   * - Similar pricing type: +1 point
   *
   * @param event - Reference event
   * @param limit - Maximum number to return (default: 3)
   * @returns Promise resolving to related events
   */
  static async getRelatedEvents(event: Event, limit?: number): Promise<Event[]>;

  /**
   * Search events by query
   *
   * Searches title, subtitle, shortDescription, description
   *
   * @param query - Search string
   * @param filters - Additional filters to apply
   * @returns Promise resolving to matching events
   */
  static async searchEvents(
    query: string,
    filters?: EventFilters
  ): Promise<Event[]>;
}
```

---

## Type definitions

### EventFilters

```typescript
export interface EventFilters {
  /**
   * Filter by category
   */
  category?: string;

  /**
   * Filter by availability status
   */
  status?: "available" | "filling-fast" | "sold-out" | "waitlist-only";

  /**
   * Filter by pricing type
   */
  pricingType?: "free" | "paid" | "donation";

  /**
   * Filter by location type
   */
  locationType?: "in-person" | "virtual" | "hybrid";

  /**
   * Show only featured events
   */
  featured?: boolean;

  /**
   * Date range filtering
   */
  dateFrom?: string; // ISO 8601 date
  dateTo?: string; // ISO 8601 date

  /**
   * Show only upcoming (future) events
   */
  upcomingOnly?: boolean;

  /**
   * Show only past events
   */
  pastOnly?: boolean;

  /**
   * Search query (searches multiple fields)
   */
  search?: string;

  /**
   * Filter by tags (events matching ANY tag)
   */
  tags?: string[];

  /**
   * Sort order
   */
  sortBy?: "date" | "title" | "price" | "availability";
  sortOrder?: "asc" | "desc";
}
```

### RegistrationData

```typescript
export interface RegistrationData {
  /**
   * Customer information
   */
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };

  /**
   * Emergency contact (optional)
   */
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };

  /**
   * Number of seats to reserve
   */
  numberOfSeats: number;

  /**
   * Answers to custom questions (if any)
   */
  customQuestions?: Record<string, string>;

  /**
   * Special requests or notes
   */
  notes?: string;

  /**
   * Terms agreement
   */
  agreeToTerms: boolean;
}
```

### RegistrationResult

```typescript
export interface RegistrationResult {
  /**
   * Success indicator
   */
  success: boolean;

  /**
   * Registration confirmation code (for free events)
   */
  confirmationCode?: string;

  /**
   * Stripe checkout URL (for paid events)
   */
  checkoutUrl?: string;

  /**
   * Checkout session ID (for paid events)
   */
  sessionId?: string;

  /**
   * Error message (if success = false)
   */
  error?: string;

  /**
   * Registration record (for free events)
   */
  registration?: Partial<Registration>;
}
```

### ValidationResult

```typescript
export interface ValidationResult {
  /**
   * Whether data is valid
   */
  isValid: boolean;

  /**
   * Field-specific errors
   */
  errors: {
    [field: string]: string;
  };

  /**
   * General validation messages
   */
  messages: string[];
}
```

---

## Phase 1 implementation (Mock data)

### Mock delay simulation

```typescript
/**
 * Mock API delay in milliseconds for realistic testing
 */
const MOCK_DELAY_MS = 150;

/**
 * Simulates async API delay
 */
const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
```

### getEvents implementation

```typescript
static async getEvents(filters?: EventFilters): Promise<Event[]> {
  await delay(MOCK_DELAY_MS);

  let events = [...mockEvents];

  if (!filters) {
    return events
      .filter(e => e.status === 'published')
      .sort((a, b) =>
        new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime()
      );
  }

  // Filter by category
  if (filters.category) {
    events = events.filter(e => e.category === filters.category);
  }

  // Filter by status
  if (filters.status) {
    events = events.filter(e => e.availabilityStatus === filters.status);
  }

  // Filter by pricing type
  if (filters.pricingType) {
    events = events.filter(e => e.pricing.type === filters.pricingType);
  }

  // Filter by location type
  if (filters.locationType) {
    events = events.filter(e => e.location.type === filters.locationType);
  }

  // Filter by featured
  if (filters.featured) {
    events = events.filter(e => e.isFeatured);
  }

  // Filter by date range
  if (filters.dateFrom) {
    const fromDate = new Date(filters.dateFrom);
    events = events.filter(e =>
      new Date(e.startDateTime) >= fromDate
    );
  }

  if (filters.dateTo) {
    const toDate = new Date(filters.dateTo);
    events = events.filter(e =>
      new Date(e.startDateTime) <= toDate
    );
  }

  // Filter upcoming/past
  const now = new Date();
  if (filters.upcomingOnly) {
    events = events.filter(e => new Date(e.startDateTime) > now);
  }

  if (filters.pastOnly) {
    events = events.filter(e => new Date(e.endDateTime) < now);
  }

  // Search query
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    events = events.filter(e =>
      e.title.toLowerCase().includes(searchLower) ||
      e.shortDescription.toLowerCase().includes(searchLower) ||
      e.description.toLowerCase().includes(searchLower) ||
      (e.subtitle && e.subtitle.toLowerCase().includes(searchLower))
    );
  }

  // Filter by tags
  if (filters.tags && filters.tags.length > 0) {
    events = events.filter(e =>
      e.tags.some(tag =>
        filters.tags!.some(
          filterTag => tag.toLowerCase() === filterTag.toLowerCase()
        )
      )
    );
  }

  // Filter by status (published only by default)
  events = events.filter(e => e.status === 'published');

  // Sort
  const sortBy = filters.sortBy || 'date';
  const sortOrder = filters.sortOrder || 'asc';

  events.sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'date':
        comparison = new Date(a.startDateTime).getTime() -
                    new Date(b.startDateTime).getTime();
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'price':
        const priceA = a.pricing.amount || 0;
        const priceB = b.pricing.amount || 0;
        comparison = priceA - priceB;
        break;
      case 'availability':
        comparison = getSpotsRemaining(a.capacity) -
                    getSpotsRemaining(b.capacity);
        break;
    }

    return sortOrder === 'desc' ? -comparison : comparison;
  });

  return events;
}
```

### getEventBySlug implementation

```typescript
static async getEventBySlug(slug: string): Promise<Event | null> {
  await delay(MOCK_DELAY_MS);

  const event = mockEvents.find(e => e.slug === slug);

  // Only return published events
  if (event && event.status === 'published') {
    return event;
  }

  return null;
}
```

### checkAvailability implementation

```typescript
static async checkAvailability(eventId: string): Promise<boolean> {
  await delay(MOCK_DELAY_MS);

  const event = mockEvents.find(e => e.id === eventId);

  if (!event) {
    return false;
  }

  // Check if event is in the past
  if (new Date(event.endDateTime) < new Date()) {
    return false;
  }

  // Check if sold out
  if (event.availabilityStatus === 'sold-out') {
    return false;
  }

  // Check capacity
  const spotsLeft = getSpotsRemaining(event.capacity);
  return spotsLeft > 0;
}
```

### registerForEvent implementation

```typescript
static async registerForEvent(
  eventId: string,
  registration: RegistrationData
): Promise<RegistrationResult> {
  await delay(MOCK_DELAY_MS);

  // Validate registration data
  const validation = this.validateRegistration(registration);
  if (!validation.isValid) {
    return {
      success: false,
      error: 'Invalid registration data',
    };
  }

  // Find event
  const event = mockEvents.find(e => e.id === eventId);
  if (!event) {
    return {
      success: false,
      error: 'Event not found',
    };
  }

  // Check availability
  const available = await this.checkAvailability(eventId);
  if (!available) {
    return {
      success: false,
      error: 'Event is sold out or no longer available',
    };
  }

  // For free events: Return confirmation
  if (event.pricing.type === 'free') {
    const confirmationCode = `REG-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    return {
      success: true,
      confirmationCode,
      registration: {
        id: `reg_${Date.now()}`,
        confirmationCode,
        customer: registration.customer,
        numberOfSeats: registration.numberOfSeats,
        registrationType: 'standard',
        registeredAt: new Date(),
      },
    };
  }

  // For paid events: Return checkout URL (mock)
  if (event.pricing.type === 'paid') {
    const sessionId = `cs_test_${Date.now()}`;
    const checkoutUrl = `https://checkout.stripe.com/pay/${sessionId}`;

    return {
      success: true,
      checkoutUrl,
      sessionId,
    };
  }

  // For donation events: Similar to free but suggest donation
  return {
    success: true,
    confirmationCode: `REG-${Date.now()}`,
  };
}
```

### validateRegistration implementation

```typescript
static validateRegistration(data: RegistrationData): ValidationResult {
  const errors: { [field: string]: string } = {};
  const messages: string[] = [];

  // Validate customer info
  if (!data.customer.firstName || data.customer.firstName.trim() === '') {
    errors.firstName = 'First name is required';
  }

  if (!data.customer.lastName || data.customer.lastName.trim() === '') {
    errors.lastName = 'Last name is required';
  }

  // Validate email
  const emailResult = SecurityValidator.validateEmail(data.customer.email);
  if (!emailResult.isValid) {
    errors.email = 'Valid email is required';
  }

  // Validate phone (if provided)
  if (data.customer.phone) {
    const phoneResult = SecurityValidator.validatePhone(data.customer.phone);
    if (!phoneResult.isValid) {
      errors.phone = 'Valid phone number is required';
    }
  }

  // Validate number of seats
  if (!data.numberOfSeats || data.numberOfSeats < 1) {
    errors.numberOfSeats = 'At least 1 seat must be selected';
  }

  if (data.numberOfSeats > 10) {
    errors.numberOfSeats = 'Maximum 10 seats per registration';
  }

  // Validate terms agreement
  if (!data.agreeToTerms) {
    errors.agreeToTerms = 'You must agree to the terms and conditions';
  }

  // Validate emergency contact (if provided)
  if (data.emergencyContact) {
    if (!data.emergencyContact.name) {
      errors.emergencyContactName = 'Emergency contact name is required';
    }
    if (!data.emergencyContact.phone) {
      errors.emergencyContactPhone = 'Emergency contact phone is required';
    }
  }

  const isValid = Object.keys(errors).length === 0;

  if (!isValid) {
    messages.push('Please correct the errors in your registration form');
  }

  return {
    isValid,
    errors,
    messages,
  };
}
```

### getRelatedEvents implementation

```typescript
static async getRelatedEvents(
  event: Event,
  limit: number = 3
): Promise<Event[]> {
  await delay(MOCK_DELAY_MS);

  interface ScoredEvent {
    event: Event;
    score: number;
  }

  const scoredEvents: ScoredEvent[] = mockEvents
    .filter(e =>
      e.id !== event.id &&
      e.status === 'published' &&
      new Date(e.startDateTime) > new Date() // Only upcoming events
    )
    .map(e => {
      let score = 0;

      // Same category: +3 points
      if (e.category === event.category) {
        score += 3;
      }

      // Shared tags: +1 point per tag
      const sharedTags = e.tags.filter(tag =>
        event.tags.some(
          eventTag => eventTag.toLowerCase() === tag.toLowerCase()
        )
      );
      score += sharedTags.length;

      // Same location type: +2 points
      if (e.location.type === event.location.type) {
        score += 2;
      }

      // Same pricing type: +1 point
      if (e.pricing.type === event.pricing.type) {
        score += 1;
      }

      // Featured events bonus: +1 point
      if (e.isFeatured) {
        score += 1;
      }

      return { event: e, score };
    });

  // Sort by score (desc), then by date (asc)
  scoredEvents.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return (
      new Date(a.event.startDateTime).getTime() -
      new Date(b.event.startDateTime).getTime()
    );
  });

  // Return top N
  return scoredEvents.slice(0, limit).map(se => se.event);
}
```

---

## Mock data structure

**Location**: `/packages/shared-utils/src/data/mockEvents.ts`

### Requirements

- **Quantity**: 12-15 events for realistic testing
- **Mix of statuses**:
  - 5 available
  - 3 filling-fast
  - 2 sold-out
  - 2 past events
- **Mix of pricing**:
  - 4 free events
  - 7 paid events
  - 1 donation event
- **Mix of locations**:
  - 8 in-person
  - 3 virtual
  - 1 hybrid
- **Categories**: At least 4 different categories
- **Tags**: 15-20 unique tags across all events

### Example mock event

```typescript
{
  id: 'evt_full_moon_sound_bath_nov',
  slug: 'full-moon-aerial-sound-bath',
  title: 'Full Moon Aerial Sound Bath',
  subtitle: 'November Full Moon Ceremony',
  shortDescription: 'Experience deep relaxation with aerial yoga and sound healing under the full moon.',
  description: `Join us for a transformative Full Moon Aerial Sound Bath ceremony...`,

  featuredImage: {
    image: '/img/download 1-full-moon-soundbath.png',
    alt: 'Full Moon Aerial Sound Bath event'
  },

  startDateTime: new Date('2025-11-15T18:00:00-08:00'),
  endDateTime: new Date('2025-11-15T20:00:00-08:00'),
  timezone: 'America/Los_Angeles',
  duration: { hours: 2, minutes: 0 },

  location: {
    type: 'in-person',
    venue: {
      name: 'The Reiki Goddess Healing Studio',
      address: {
        street: '8916 345th Street Ct. S.',
        city: 'Roy',
        state: 'WA',
        zipCode: '98580',
        country: 'USA'
      },
      googleMapsUrl: 'https://maps.google.com/?q=8916+345th+Street+Ct.+S.+Roy,+WA+98580'
    }
  },

  capacity: {
    total: 20,
    reserved: 17,
    waitlist: 5
  },
  availabilityStatus: 'filling-fast',

  pricing: {
    type: 'paid',
    amount: 9900, // $99.00
    currency: 'usd',
    earlyBirdPricing: {
      amount: 7900, // $79.00
      validUntil: new Date('2025-11-01T23:59:59-08:00'),
      stripePriceId: 'price_early_bird_123'
    },
    stripeProductId: 'prod_123',
    stripePriceId: 'price_456'
  },

  category: 'sound-healing',
  tags: ['sound-bath', 'full-moon', 'aerial-yoga', 'meditation'],

  isFeatured: true,
  isPinned: true,
  displayOrder: 1,

  status: 'published',
  publishedAt: new Date('2025-10-01T10:00:00-08:00'),

  prerequisites: [
    'No experience necessary',
    'Comfortable clothing recommended'
  ],
  whatToBring: [
    'Water bottle',
    'Yoga mat (optional)',
    'Blanket or pillow for comfort'
  ],
  includesRefreshments: true,
  certificateProvided: false,

  seo: {
    title: 'Full Moon Aerial Sound Bath - November 2025',
    description: 'Experience deep relaxation with aerial yoga and sound healing under the full moon. Limited spots available.',
    keywords: ['sound bath', 'full moon', 'aerial yoga', 'reiki', 'meditation']
  },

  createdAt: new Date('2025-10-01T10:00:00-08:00'),
  updatedAt: new Date('2025-10-20T14:30:00-08:00'),
}
```

---

## Phase 2 implementation (API integration)

### API configuration

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const API_TIMEOUT_MS = 30000;

// API client with timeout and error handling
const apiClient = {
  async get<T>(endpoint: string): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } finally {
      clearTimeout(timeout);
    }
  },

  async post<T>(endpoint: string, data: any): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } finally {
      clearTimeout(timeout);
    }
  },
};
```

### API integration (Phase 2)

```typescript
static async getEvents(filters?: EventFilters): Promise<Event[]> {
  // Build query string
  const params = new URLSearchParams();

  if (filters?.category) params.append('category', filters.category);
  if (filters?.status) params.append('status', filters.status);
  // ... other filters

  const queryString = params.toString();
  const endpoint = `/api/events${queryString ? `?${queryString}` : ''}`;

  const response = await apiClient.get<{ docs: Event[] }>(endpoint);
  return response.docs;
}

static async registerForEvent(
  eventId: string,
  registration: RegistrationData
): Promise<RegistrationResult> {
  try {
    const response = await apiClient.post<RegistrationResult>(
      `/api/events/${eventId}/register`,
      registration
    );
    return response;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Registration failed',
    };
  }
}
```

---

## Error handling

### Service-level errors

```typescript
class EventServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = "EventServiceError";
  }
}

// Usage
try {
  const events = await EventService.getEvents();
} catch (error) {
  if (error instanceof EventServiceError) {
    // Handle specific service error
    console.error(`Service error [${error.code}]:`, error.message);
  } else {
    // Handle generic error
    console.error("Unexpected error:", error);
  }
}
```

---

## Testing

### Service tests

```typescript
// eventService.test.ts
describe("EventService", () => {
  describe("getEvents", () => {
    it("returns all published events without filters", async () => {
      const events = await EventService.getEvents();
      expect(events.length).toBeGreaterThan(0);
      expect(events.every((e) => e.status === "published")).toBe(true);
    });

    it("filters by category", async () => {
      const events = await EventService.getEvents({
        category: "sound-healing",
      });
      expect(events.every((e) => e.category === "sound-healing")).toBe(true);
    });

    it("filters by status", async () => {
      const events = await EventService.getEvents({
        status: "available",
      });
      expect(events.every((e) => e.availabilityStatus === "available")).toBe(
        true
      );
    });

    it("filters upcoming events only", async () => {
      const now = new Date();
      const events = await EventService.getEvents({
        upcomingOnly: true,
      });
      expect(events.every((e) => new Date(e.startDateTime) > now)).toBe(true);
    });

    it("searches events by title", async () => {
      const events = await EventService.getEvents({
        search: "Sound Bath",
      });
      expect(
        events.every((e) => e.title.toLowerCase().includes("sound bath"))
      ).toBe(true);
    });

    it("sorts events correctly", async () => {
      const events = await EventService.getEvents({
        sortBy: "date",
        sortOrder: "asc",
      });

      for (let i = 1; i < events.length; i++) {
        const prevDate = new Date(events[i - 1].startDateTime);
        const currDate = new Date(events[i].startDateTime);
        expect(prevDate.getTime()).toBeLessThanOrEqual(currDate.getTime());
      }
    });
  });

  describe("getEventBySlug", () => {
    it("returns event for valid slug", async () => {
      const event = await EventService.getEventBySlug(
        "full-moon-aerial-sound-bath"
      );
      expect(event).not.toBeNull();
      expect(event?.slug).toBe("full-moon-aerial-sound-bath");
    });

    it("returns null for invalid slug", async () => {
      const event = await EventService.getEventBySlug("nonexistent-event");
      expect(event).toBeNull();
    });
  });

  describe("checkAvailability", () => {
    it("returns true for available event", async () => {
      const available = await EventService.checkAvailability("evt_available");
      expect(available).toBe(true);
    });

    it("returns false for sold out event", async () => {
      const available = await EventService.checkAvailability("evt_sold_out");
      expect(available).toBe(false);
    });

    it("returns false for past event", async () => {
      const available = await EventService.checkAvailability("evt_past");
      expect(available).toBe(false);
    });
  });

  describe("validateRegistration", () => {
    it("validates correct registration data", () => {
      const result = EventService.validateRegistration({
        customer: {
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
        },
        numberOfSeats: 1,
        agreeToTerms: true,
      });
      expect(result.isValid).toBe(true);
    });

    it("invalidates missing required fields", () => {
      const result = EventService.validateRegistration({
        customer: {
          firstName: "",
          lastName: "Doe",
          email: "john@example.com",
        },
        numberOfSeats: 1,
        agreeToTerms: true,
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.firstName).toBeDefined();
    });

    it("invalidates invalid email", () => {
      const result = EventService.validateRegistration({
        customer: {
          firstName: "John",
          lastName: "Doe",
          email: "invalid-email",
        },
        numberOfSeats: 1,
        agreeToTerms: true,
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBeDefined();
    });

    it("invalidates too many seats", () => {
      const result = EventService.validateRegistration({
        customer: {
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
        },
        numberOfSeats: 20,
        agreeToTerms: true,
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.numberOfSeats).toBeDefined();
    });
  });

  describe("getRelatedEvents", () => {
    it("returns related events", async () => {
      const referenceEvent = mockEvents[0];
      const related = await EventService.getRelatedEvents(referenceEvent, 3);

      expect(related.length).toBeLessThanOrEqual(3);
      expect(related.every((e) => e.id !== referenceEvent.id)).toBe(true);
    });

    it("prioritizes same category events", async () => {
      const referenceEvent = mockEvents.find(
        (e) => e.category === "sound-healing"
      )!;
      const related = await EventService.getRelatedEvents(referenceEvent, 5);

      const sameCategoryCount = related.filter(
        (e) => e.category === referenceEvent.category
      ).length;

      expect(sameCategoryCount).toBeGreaterThan(0);
    });
  });
});
```

---

## Export structure

```typescript
// /packages/shared-utils/src/services/index.ts
export { EventService } from "./eventService";
export type {
  EventFilters,
  RegistrationData,
  RegistrationResult,
  ValidationResult,
} from "./eventService";

// Main index
// /packages/shared-utils/src/index.ts
export { EventService } from "./services";
export type {
  EventFilters,
  RegistrationData,
  RegistrationResult,
} from "./services";
```

---

## Implementation checklist

- [ ] Create eventService.ts file
- [ ] Create mockEvents.ts with 12-15 sample events
- [ ] Implement getEvents method
- [ ] Implement getEventBySlug method
- [ ] Implement checkAvailability method
- [ ] Implement registerForEvent method (mock)
- [ ] Implement validateRegistration method
- [ ] Implement getFeaturedEvents method
- [ ] Implement getUpcomingEvents method
- [ ] Implement getPastEvents method
- [ ] Implement getEventsByCategory method
- [ ] Implement getCategories method
- [ ] Implement getRelatedEvents method
- [ ] Implement searchEvents method
- [ ] Write comprehensive tests (100% coverage)
- [ ] Test all filtering combinations
- [ ] Test edge cases (empty results, invalid IDs)
- [ ] Test error handling
- [ ] Export from index.ts
- [ ] Document API (JSDoc comments)

---

**Status**: ✅ Specification complete
**Ready for**: Phase 1 implementation (mock data)
**Phase 2**: API integration after backend ready
**Estimated effort**: 2-3 days (Phase 1), 1-2 days (Phase 2)
