# Events page component architecture

**Version**: 2.0
**Last Updated**: 2025-11-03
**Project**: The Reiki Goddess Healing
**Purpose**: Comprehensive component architecture for Events Page V2

## Table of contents

1. [Executive summary](#executive-summary)
2. [Existing component inventory](#existing-component-inventory)
3. [Required new components](#required-new-components)
4. [Component composition](#component-composition)
5. [State management strategy](#state-management-strategy)
6. [Data service architecture](#data-service-architecture)
7. [Integration points](#integration-points)
8. [Testing strategy](#testing-strategy)
9. [Implementation priority](#implementation-priority)
10. [Reusable pattern analysis](#reusable-pattern-analysis)

---

## Executive summary

### Previous attempt lessons learned

**V1 Failure Analysis**:

- Built 60+ field Payload CMS backend
- **Zero frontend components** implemented
- No user-facing functionality delivered
- Backend-heavy approach without UI

### V2 Approach

**Component-First Strategy**:

1. Build complete UI component library first
2. Use mock data for immediate functionality
3. Integrate backend after UI is production-ready
4. Incremental delivery with testable milestones

### Critical success factors

- ✅ All components must have TypeScript interfaces
- ✅ Each component must be independently testable
- ✅ Mock data enables development without backend
- ✅ Security patterns from Contact page reused
- ✅ Visual patterns from Services page adapted
- ✅ Data fetching patterns from Blog page leveraged

---

## Existing component inventory

### 1. CommunityEvents component

**Location**: `/packages/shared-components/src/CommunityEvents/CommunityEvents.tsx`
**Status**: 🚧 Needs enhancement
**Test Coverage**: Not tested

**Current capabilities**:

- Displays 2 hardcoded event cards in a grid
- Has blue gradient background with overlay image
- Includes pagination dots (decorative only)
- "View Full Calendar" CTA button
- Basic responsive layout (1 col mobile, 2 col desktop)

**Current interface**:

```typescript
export interface EventCard {
  id: string;
  title: string;
  image: {
    src: string;
    alt: string;
  };
  date?: string;
  description?: string;
}

export interface CommunityEventsProps {
  heading?: string;
  subheading?: string;
  events?: EventCard[];
  _events?: EventCard[]; // Fallback prop
  ctaButton?: {
    text: string;
    href: string;
    onClick?: () => void;
  };
  className?: string;
}
```

**Limitations**:

- ❌ No capacity/availability display
- ❌ No pricing information
- ❌ No registration functionality
- ❌ No event status badges (sold out, filling fast)
- ❌ Limited event metadata (no time, location, duration)
- ❌ Hardcoded styling (not using design tokens)
- ❌ Cards are not clickable/navigable
- ❌ Image loading not optimized
- ❌ No loading/error states
- ❌ EventCard interface too simple for production use

**Assessment**:
This component is a **homepage teaser** only. It needs to be **completely refactored** or replaced with EventGrid + EventCard components that support full event data structures.

**Migration path**:

1. Extract EventCard pattern
2. Create new EventCard component with full Event interface
3. Create EventGrid wrapper for flexible layouts
4. Update CommunityEvents to use new components
5. Maintain backward compatibility with homepage usage

---

### 2. EventsPage component

**Location**: `/packages/shared-components/src/pages/EventsPage.tsx`
**Status**: ❌ Minimal implementation
**Test Coverage**: Not tested

**Current implementation**:

```typescript
export const EventsPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <ResponsiveContainer className="py-20">
        <div className="text-center mb-16">
          <h1>Events & Workshops</h1>
          <p>Join our healing community...</p>
        </div>
      </ResponsiveContainer>

      {/* Community Events Section */}
      <CommunityEvents />

      {/* Newsletter CTA */}
      <ResponsiveContainer className="py-20">
        <button>Subscribe to Updates</button>
      </ResponsiveContainer>
    </div>
  );
};
```

**Current capabilities**:

- ✅ Basic page structure
- ✅ Uses ResponsiveContainer
- ✅ Simple hero section
- ✅ Integrates CommunityEvents component

**Limitations**:

- ❌ No dynamic event loading
- ❌ No filtering/search
- ❌ No individual event detail routing
- ❌ No pagination
- ❌ No loading/error states
- ❌ Newsletter button non-functional

**Assessment**:
This is a **placeholder page**. Needs complete rebuild with:

- EventsHero component
- EventFilters component (Phase 2)
- EventGrid with dynamic data
- EventSearch component (Phase 2)
- Proper state management

---

### 3. Main app Events page

**Location**: `/apps/main/src/pages/Events.tsx`
**Status**: ❌ Stub only
**Test Coverage**: Not tested

**Current implementation**:

```typescript
function Events() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-[#FFFBF5]">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <h1>Community Events</h1>
          <p>Events page content coming soon...</p>
        </div>
      </div>
    </PageTransition>
  );
}
```

**Assessment**:
This should **import and use** EventsPage from shared-components. Not a separate implementation.

**Migration path**:

```typescript
// Correct implementation
import { EventsPage } from '@reiki-goddess/shared-components';

function Events() {
  return (
    <PageTransition>
      <EventsPage />
    </PageTransition>
  );
}
```

---

### 4. Existing Event types (archived)

**Location**: `/docs/archive/events-salvage/types/events.ts`
**Status**: ✅ Comprehensive, ready to use
**Assessment**: Excellent type system salvaged from V1

**Key interfaces available**:

- `Event` - Complete event structure with 30+ fields
- `EventCapacity` - Capacity tracking
- `EventPricing` - Pricing with early bird support
- `EventLocation` - In-person, virtual, hybrid
- `Registration` - Full registration system
- `RegistrationPayment` - Stripe integration ready
- Helper functions: `formatPrice`, `isSoldOut`, `getActivePrice`

**Action**: Move to `/packages/shared-utils/src/types/events.ts`

---

## Required new components

See detailed specifications in separate files:

- [EventCard.md](./EventCard.md) - Event card for grid/list views
- [EventGrid.md](./EventGrid.md) - Grid layout wrapper
- [EventsHero.md](./EventsHero.md) - Page hero section
- [EventDetail.md](./EventDetail.md) - Individual event detail view
- [EventRegistrationForm.md](./EventRegistrationForm.md) - Registration form
- [EventFilters.md](./EventFilters.md) - Filter controls (Phase 2)
- [EventSearch.md](./EventSearch.md) - Search functionality (Phase 2)

### Quick reference component list

| Component             | Priority | Status   | Dependencies                    |
| --------------------- | -------- | -------- | ------------------------------- |
| EventCard             | Phase 1  | New      | EventStatusBadge, EventDateTime |
| EventGrid             | Phase 1  | New      | EventCard                       |
| EventsHero            | Phase 1  | New      | ResponsiveContainer             |
| EventsPage            | Phase 1  | Refactor | EventGrid, EventsHero           |
| EventDetail           | Phase 2  | New      | Event metadata components       |
| EventRegistrationForm | Phase 2  | New      | SecureContactForm pattern       |
| EventFilters          | Phase 3  | New      | -                               |
| EventSearch           | Phase 3  | New      | -                               |

### Supporting components (micro)

These small components support larger compositions:

**EventStatusBadge**

- Purpose: Display event status (Available, Selling Fast, Sold Out)
- Props: `status`, `variant`, `className`
- Visual: Colored badge with icon

**EventDateTime**

- Purpose: Format and display event date/time
- Props: `startDateTime`, `endDateTime`, `timezone`, `format`
- Output: "Sat, Nov 15, 2025 • 2:00 PM - 4:00 PM PST"

**EventLocation**

- Purpose: Display location info with icon
- Props: `location` (EventLocation interface)
- Variants: In-person, Virtual, Hybrid

**EventCapacity**

- Purpose: Show spots remaining
- Props: `capacity` (EventCapacity interface)
- Visual: Progress bar or text ("12 spots left")

**EventPricing**

- Purpose: Display price with early bird
- Props: `pricing` (EventPricing interface)
- Visual: "$99" or "Free" or "$79 (Early Bird until Nov 1)"

---

## Component composition

### EventsPage assembly

```
EventsPage
├── EventsHero
│   ├── ResponsiveContainer
│   ├── h1 (title)
│   └── p (description)
├── [EventFilters] (Phase 3)
│   ├── CategoryFilter
│   ├── DateRangeFilter
│   └── PriceFilter
├── [EventSearch] (Phase 3)
│   └── SearchInput
└── EventGrid
    └── EventCard[] (mapped)
        ├── EventImage (LazyImage)
        ├── EventStatusBadge
        ├── h3 (title)
        ├── EventDateTime
        ├── EventLocation
        ├── EventCapacity
        ├── EventPricing
        └── Link (to detail page)
```

### EventDetailPage assembly

```
EventDetailPage
├── EventHero
│   ├── FeaturedImage
│   └── EventStatusBadge
├── ResponsiveContainer
│   ├── EventMetadata
│   │   ├── EventDateTime
│   │   ├── EventLocation
│   │   ├── EventCapacity
│   │   └── EventPricing
│   ├── EventDescription
│   │   └── RichText (markdown)
│   ├── [EventGallery] (Phase 3)
│   │   └── GalleryImage[]
│   ├── EventDetails
│   │   ├── Prerequisites list
│   │   ├── What to bring list
│   │   └── Additional info
│   └── EventRegistrationForm
│       ├── CustomerInfo fields
│       ├── EmergencyContact (optional)
│       ├── CustomQuestions
│       └── SubmitButton
└── RelatedEvents (Phase 3)
    └── EventCard[] (3 related)
```

---

## State management strategy

### 1. Data fetching hooks

**Pattern**: Custom hooks following `useBlogPosts` pattern

**useEvents hook**:

```typescript
// Location: /packages/shared-components/src/hooks/useEvents.ts

export interface UseEventsResult {
  events: Event[];
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

export function useEvents(filters?: EventFilters): UseEventsResult {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedEvents = await EventService.getEvents(filters);
      setEvents(fetchedEvents);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch events")
      );
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const refresh = useCallback(async () => {
    await fetchEvents();
  }, [fetchEvents]);

  return { events, loading, error, refresh };
}
```

**useEventDetail hook**:

```typescript
// Location: /packages/shared-components/src/hooks/useEventDetail.ts

export interface UseEventDetailResult {
  event: Event | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

export function useEventDetail(slug: string): UseEventDetailResult {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEvent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedEvent = await EventService.getEventBySlug(slug);
      setEvent(fetchedEvent);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Event not found"));
      setEvent(null);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  const refresh = useCallback(async () => {
    await fetchEvent();
  }, [fetchEvent]);

  return { event, loading, error, refresh };
}
```

### 2. Filter state management

**Pattern**: URL search params (like Blog page)

```typescript
// In EventsPage component
const [searchParams, setSearchParams] = useSearchParams();

// Read filters from URL
const filters: EventFilters = {
  category: searchParams.get("category") || undefined,
  status: searchParams.get("status") as EventFilters["status"],
  dateFrom: searchParams.get("from") || undefined,
  dateTo: searchParams.get("to") || undefined,
};

// Update filters (updates URL)
const updateFilters = (newFilters: Partial<EventFilters>) => {
  const params = new URLSearchParams(searchParams);

  Object.entries(newFilters).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
  });

  setSearchParams(params);
};

// Use in hook
const { events, loading, error } = useEvents(filters);
```

**Benefits**:

- Shareable URLs
- Browser back/forward works
- Bookmarkable filtered views
- No additional state library needed

### 3. Registration form state

**Pattern**: Controlled form with security validation (from FigmaContactForm)

```typescript
// In EventRegistrationForm component
const [formData, setFormData] = useState<RegistrationFormData>({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  emergencyContact: undefined,
  customQuestions: {},
  agreeToTerms: false,
});

const [errors, setErrors] = useState<FormErrors>({});
const [isSubmitting, setIsSubmitting] = useState(false);
const [submitSuccess, setSubmitSuccess] = useState(false);

// Reuse SecurityValidator, FormRateLimit, SecurityMonitor
const rateLimit = useRef(new FormRateLimit());
const monitor = useRef(new SecurityMonitor({ enableConsoleLogging: false }));
```

### 4. Availability checking

**Pattern**: Real-time capacity check before registration

```typescript
const useEventAvailability = (eventId: string) => {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);

  const checkAvailability = useCallback(async () => {
    setChecking(true);
    try {
      const available = await EventService.checkAvailability(eventId);
      setIsAvailable(available);
    } catch (err) {
      setIsAvailable(false);
    } finally {
      setChecking(false);
    }
  }, [eventId]);

  return { isAvailable, checking, checkAvailability };
};
```

---

## Data service architecture

See detailed specification: [event-service.md](./event-service.md)

### Service structure

**Location**: `/packages/shared-utils/src/services/eventService.ts`

```typescript
export class EventService {
  /**
   * Fetch all events with optional filtering
   */
  static async getEvents(filters?: EventFilters): Promise<Event[]> {
    // Mock implementation (Phase 1)
    // API implementation (Phase 2)
  }

  /**
   * Fetch single event by slug
   */
  static async getEventBySlug(slug: string): Promise<Event | null> {
    // Returns event or null if not found
  }

  /**
   * Check if event has available capacity
   */
  static async checkAvailability(eventId: string): Promise<boolean> {
    // Real-time capacity check
  }

  /**
   * Submit registration (creates checkout session for paid events)
   */
  static async registerForEvent(
    eventId: string,
    registration: RegistrationData
  ): Promise<RegistrationResult> {
    // Free events: Direct registration
    // Paid events: Return Stripe checkout URL
  }

  /**
   * Validate registration data
   */
  static validateRegistration(data: RegistrationData): ValidationResult {
    // Client-side validation before submission
  }

  /**
   * Get featured events
   */
  static async getFeaturedEvents(limit?: number): Promise<Event[]> {
    // Returns pinned/featured events
  }

  /**
   * Get upcoming events
   */
  static async getUpcomingEvents(limit?: number): Promise<Event[]> {
    // Returns events with startDateTime > now
  }
}
```

### Mock data strategy

**Location**: `/packages/shared-utils/src/data/mockEvents.ts`

```typescript
export const mockEvents: Event[] = [
  {
    id: "evt_full_moon_sound_bath_nov",
    slug: "full-moon-aerial-sound-bath",
    title: "Full Moon Aerial Sound Bath",
    subtitle: "November Full Moon Ceremony",
    shortDescription:
      "Experience deep relaxation with aerial yoga and sound healing under the full moon.",
    description: `Join us for a transformative Full Moon Aerial Sound Bath...`,

    featuredImage: {
      image: "/img/download 1-full-moon-soundbath.png",
      alt: "Full Moon Aerial Sound Bath event",
    },

    startDateTime: new Date("2025-11-15T18:00:00-08:00"),
    endDateTime: new Date("2025-11-15T20:00:00-08:00"),
    timezone: "America/Los_Angeles",
    duration: { hours: 2, minutes: 0 },

    location: {
      type: "in-person",
      venue: {
        name: "The Reiki Goddess Healing Studio",
        address: {
          street: "8916 345th Street Ct. S.",
          city: "Roy",
          state: "WA",
          zipCode: "98580",
          country: "USA",
        },
      },
    },

    capacity: {
      total: 20,
      reserved: 17,
      waitlist: 5,
    },
    availabilityStatus: "filling-fast",

    pricing: {
      type: "paid",
      amount: 9900, // $99.00
      currency: "usd",
      earlyBirdPricing: {
        amount: 7900, // $79.00
        validUntil: new Date("2025-11-01T23:59:59-08:00"),
        stripePriceId: "price_early_bird_123",
      },
    },

    category: "sound-healing",
    tags: ["sound-bath", "full-moon", "aerial-yoga", "meditation"],
    isFeatured: true,
    isPinned: true,
    displayOrder: 1,
    status: "published",

    createdAt: new Date("2025-10-01T10:00:00-08:00"),
    updatedAt: new Date("2025-10-20T14:30:00-08:00"),
  },
  // ... more mock events
];
```

**Mock data requirements**:

- At least 10-12 events for realistic testing
- Mix of free, paid, and donation events
- Mix of in-person, virtual, hybrid
- Some sold out, some available
- Past events for testing filters
- Different categories and tags

---

## Integration points

### From shared-components

**Existing components to reuse**:

- `ResponsiveContainer` - Page width container
- `AnimatedSection` - Scroll animations
- `PageTransition` - Page enter/exit animations
- `LazyImage` - Optimized image loading (if available, or create)

**Patterns to adapt**:

- `FigmaContactForm` → `EventRegistrationForm`
- `ServicesSection` cards → `EventCard` bevel effect
- `useBlogPosts` → `useEvents` hook pattern

### From shared-utils

**Type exports**:

```typescript
export {
  // Types
  Event,
  EventCapacity,
  EventPricing,
  EventLocation,
  EventDuration,
  Registration,
  RegistrationData,
  EventFilters,

  // Helper functions
  formatPrice,
  isSoldOut,
  getSpotsRemaining,
  getActivePrice,

  // Service
  EventService,
} from "@reiki-goddess/shared-utils";
```

**Security utilities**:

```typescript
export {
  SecurityValidator,
  FormRateLimit,
  SecurityMonitor,
} from "@reiki-goddess/shared-utils";
```

**Date formatting**:

```typescript
export {
  formatDate,
  formatDateTime,
  formatTimeRange,
} from "@reiki-goddess/shared-utils";
```

### From design-system

**Color tokens**:

```typescript
import { colors } from "@reiki-goddess/design-system";

const brandBlue = colors.brand.blue; // #0205B7
const brandPurple = colors.brand.purple; // #A593E0
const accentCyan = colors.accent.cyan; // #63D5F9
```

**Typography**:

```typescript
const fonts = {
  heading: "Figtree, Helvetica, sans-serif",
  body: "Neue Montreal, sans-serif",
};
```

**Spacing**:

- Universal padding: 66px
- Card border radius: 20px
- Max container width: 1440px

### From react-router

**Routing hooks**:

```typescript
import {
  Link,
  useParams,
  useNavigate,
  useSearchParams
} from 'react-router-dom';

// In EventCard
<Link to={`/events/${event.slug}`}>

// In EventDetailPage
const { slug } = useParams<{ slug: string }>();

// In EventsPage
const [searchParams, setSearchParams] = useSearchParams();
```

**Route configuration**:

```typescript
// In apps/main/src/App.tsx
<Route path="/events" element={<EventsPage />} />
<Route path="/events/:slug" element={<EventDetailPage />} />
```

---

## Testing strategy

### Unit tests (per component)

**Test file pattern**: `ComponentName.test.tsx`

**Required tests for each component**:

```typescript
// EventCard.test.tsx
describe("EventCard", () => {
  it("renders event data correctly", () => {
    // Assert title, date, location displayed
  });

  it("displays correct status badge", () => {
    // Test available, filling-fast, sold-out statuses
  });

  it("shows early bird pricing when valid", () => {
    // Test price display logic
  });

  it("navigates to detail page on click", () => {
    // Test Link component
  });

  it("displays sold out overlay", () => {
    // Test sold-out visual state
  });

  it("handles missing optional data gracefully", () => {
    // Test with minimal event data
  });

  it("meets accessibility requirements", () => {
    // Test ARIA labels, semantic HTML
  });
});
```

### Integration tests

**Test file pattern**: `EventsPage.integration.test.tsx`

```typescript
describe("EventsPage Integration", () => {
  it("loads and displays events from service", async () => {
    // Mock EventService.getEvents
    // Render EventsPage
    // Assert events displayed in grid
  });

  it("filters events by category", async () => {
    // Interact with CategoryFilter
    // Assert filtered results
  });

  it("updates URL when filters change", () => {
    // Change filters
    // Assert searchParams updated
  });

  it("navigates to detail page", async () => {
    // Click event card
    // Assert navigation occurred
  });

  it("shows loading state", () => {
    // Delay mock response
    // Assert loading spinner displayed
  });

  it("shows error state", async () => {
    // Mock service error
    // Assert error message displayed
  });
});
```

### Target coverage

| Component Type | Target Coverage |
| -------------- | --------------- |
| UI Components  | 95%+            |
| Hooks          | 100%            |
| Services       | 100%            |
| Types/Helpers  | 100%            |

### Test utilities

**Router wrapper** (reuse from existing tests):

```typescript
// test-utils/RouterWrapper.tsx
export const RouterWrapper: React.FC<RouterWrapperProps> = ({
  children,
  initialEntries = ['/'],
}) => (
  <MemoryRouter initialEntries={initialEntries}>
    {children}
  </MemoryRouter>
);
```

**Mock event factory**:

```typescript
// test-utils/mockEventFactory.ts
export const createMockEvent = (overrides?: Partial<Event>): Event => {
  return {
    id: "evt_test_123",
    slug: "test-event",
    title: "Test Event",
    // ... all required fields
    ...overrides,
  };
};
```

---

## Implementation priority

### Phase 1: MVP (Week 1) - Core listing functionality

**Goal**: Users can view list of upcoming events

**Components to build**:

1. ✅ Move Event types from archive to shared-utils
2. ✅ Create mockEvents.ts with 10-12 sample events
3. ✅ EventService with getEvents, getEventBySlug
4. ✅ EventStatusBadge component
5. ✅ EventDateTime component
6. ✅ EventLocation component
7. ✅ EventCapacity component
8. ✅ EventPricing component
9. ✅ EventCard component (grid variant)
10. ✅ EventGrid component
11. ✅ EventsHero component
12. ✅ useEvents hook
13. ✅ EventsPage assembly
14. ✅ Update apps/main/src/pages/Events.tsx to use EventsPage
15. ✅ Basic routing (/events)

**Tests to write**:

- EventCard unit tests
- EventGrid unit tests
- useEvents hook tests
- EventService tests
- EventsPage integration test

**Deliverable**: Functional events listing page with mock data

---

### Phase 2: Event details & registration (Week 2)

**Goal**: Users can view event details and register

**Components to build**:

1. ✅ EventDetail component
2. ✅ EventMetadata component
3. ✅ EventDescription component (markdown support)
4. ✅ EventRegistrationForm component
5. ✅ useEventDetail hook
6. ✅ useEventAvailability hook
7. ✅ EventDetailPage assembly
8. ✅ Routing for /events/:slug

**Service methods**:

- EventService.checkAvailability()
- EventService.registerForEvent()
- EventService.validateRegistration()

**Tests to write**:

- EventRegistrationForm unit tests
- Security validation tests
- useEventDetail hook tests
- EventDetailPage integration tests

**Deliverable**: Complete event detail pages with registration

---

### Phase 3: Filtering & search (Week 3)

**Goal**: Users can find events via filters and search

**Components to build**:

1. ⏭️ EventFilters component
   - CategoryFilter
   - DateRangeFilter
   - StatusFilter
   - PriceFilter
2. ⏭️ EventSearch component
3. ⏭️ EventCard list variant
4. ⏭️ View toggle (grid/list)
5. ⏭️ EventGallery component

**Service methods**:

- EventService with advanced filtering
- EventService.getCategories()

**Tests to write**:

- Filter component tests
- Search functionality tests
- URL state management tests

**Deliverable**: Advanced event discovery features

---

### Phase 4: Polish & optimization (Week 4)

**Goal**: Production-ready performance and UX

**Features to add**:

1. ⏭️ Loading skeletons for EventCard
2. ⏭️ Error boundary for EventsPage
3. ⏭️ Empty states ("No events found")
4. ⏭️ Past events view (toggle)
5. ⏭️ Related events on detail page
6. ⏭️ Animation polish (framer-motion)
7. ⏭️ Image optimization (WebP, lazy loading)
8. ⏭️ Performance optimization (memoization)
9. ⏭️ Accessibility audit
10. ⏭️ E2E tests

**Optimizations**:

- Virtualization if 50+ events
- Debounced search input
- Memoized event cards
- Prefetch detail pages on hover

**Deliverable**: Production-ready Events page

---

## Reusable pattern analysis

### From Contact page ✅

**What to reuse**:

1. **SecureContactForm pattern** → EventRegistrationForm
   - Multi-field validation
   - SecurityValidator integration
   - FormRateLimit integration
   - SecurityMonitor logging
   - Error state management
   - Success state handling
   - Disabled state during submission

2. **ContactInfoCard pattern** → EventMetadata cards
   - Icon + title + content layout
   - CTA button pattern
   - White card on cream background

3. **Form field styling**:

   ```typescript
   // Reuse these exact styles
   className="w-full px-6 py-6 bg-white border rounded-[12px] text-[24px]"
   style={{ fontFamily: "Neue Montreal, sans-serif" }}
   ```

4. **Validation error display**:

   ```typescript
   {errors.fieldName && (
     <p className="mt-2 text-sm text-red-600">
       {errors.fieldName}
     </p>
   )}
   ```

5. **Security patterns**:

   ```typescript
   // Rate limiting
   const rateLimitCheck = rateLimit.current.checkLimit();

   // High-risk detection
   if (SecurityValidator.isHighRisk(dataToCheck)) {
     // Block submission
   }

   // Sanitization
   const sanitized = SecurityValidator.validateContactFormField(
     field,
     value
   ).sanitizedValue;
   ```

---

### From Services page ✅

**What to reuse**:

1. **Card bevel effect** → EventCard

   ```typescript
   {/* Blue background rectangle - shifted down 5px */}
   <div
     className="absolute inset-0"
     style={{
       backgroundColor: "#0205B7",
       borderRadius: "20px",
       transform: "translateY(5px)",
       zIndex: 0,
     }}
   />

   {/* White card on top */}
   <div
     className="block relative"
     style={{
       borderRadius: "20px",
       boxShadow: "0px 42px 32.5px -13px rgba(2, 5, 183, 0.25)",
       backgroundColor: "#FFFFFF",
       zIndex: 1,
     }}
   />
   ```

2. **Gradient hover overlay**:

   ```typescript
   <div
     className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
     style={{
       background: "linear-gradient(135deg, #0205B7 0%, rgba(99, 213, 249, 1) 100%)",
       borderRadius: "20px",
     }}
   />
   ```

3. **Grid layout**:

   ```typescript
   className =
     "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8";
   ```

4. **Hover transform**:

   ```typescript
   className =
     "group relative transition-all duration-300 transform hover:-translate-y-2";
   ```

5. **Icon color transition**:
   ```typescript
   className =
     "transition-all duration-300 group-hover:brightness-0 group-hover:invert";
   ```

---

### From Blog page ✅

**What to reuse**:

1. **useBlogPosts hook pattern** → useEvents hook
   - Same structure exactly
   - Returns: { items, loading, error, refresh }
   - Accepts filters parameter
   - Auto-refresh on filter change

2. **BlogService pattern** → EventService

   ```typescript
   class EventService {
     static async getEvents(filters?: EventFilters): Promise<Event[]>;
     static async getEventBySlug(slug: string): Promise<Event | null>;
     static async getFeaturedEvents(): Promise<Event[]>;
     static async getRelatedEvents(event: Event): Promise<Event[]>;
   }
   ```

3. **Mock data structure**:
   - mockEvents.ts following mockBlogPosts.ts pattern
   - Realistic sample data
   - Mix of statuses and categories

4. **Filter by category**:

   ```typescript
   const category = searchParams.get("category");
   const { events } = useEvents({ category });
   ```

5. **Slug-based routing**:

   ```typescript
   // List page
   <Link to={`/events/${event.slug}`}>

   // Detail page
   const { slug } = useParams<{ slug: string }>();
   const { event } = useEventDetail(slug);
   ```

---

### From Homepage ✅

**What to reuse**:

1. **Hero section structure**:

   ```typescript
   <div className="text-center pt-[193px] pb-20">
     <h1 className="text-[63.55px] font-bold">
       Events & Workshops
     </h1>
     <p className="text-[16px] font-medium">
       Join our community...
     </p>
   </div>
   ```

2. **Responsive container pattern**:

   ```typescript
   <div className="max-w-[1440px] mx-auto px-[66px]">
   ```

3. **Smoke effect decorations** (optional for EventsPage):
   ```typescript
   <div
     className="absolute opacity-20 pointer-events-none"
     style={{
       width: "808px",
       height: "808px",
       backgroundImage: `url('/img/smoke.png')`,
     }}
   />
   ```

---

### Universal patterns ✅

**Across all pages**:

1. **Typography system**:
   - Headings: `font-family: "Figtree, Helvetica, sans-serif"`
   - Body: `font-family: "Neue Montreal, sans-serif"`
   - Sizes: 16px, 22px, 24px, 48px, 63.55px

2. **Color system**:
   - Brand blue: #0205B7
   - Brand purple: #A593E0
   - Accent cyan: #63D5F9
   - Cream background: #FFFBF5
   - White: #FFFFFF

3. **Border radius**:
   - Cards: 20px
   - Form inputs: 12px
   - Buttons: 90px (pill shape)

4. **Spacing**:
   - Section padding: 66px
   - Card gaps: 38px (2 col), 8px (4 col)
   - Form field gaps: 30px-62px

5. **Animation timing**:
   - Transitions: 300ms
   - Hovers: duration-300
   - Page transitions: 0.6s enter / 0.4s exit

---

## Dependencies summary

### NPM packages required

**Already installed**:

- ✅ react (18.x)
- ✅ react-router-dom (6.x)
- ✅ typescript (5.x)
- ✅ tailwindcss
- ✅ framer-motion (animations)
- ✅ vitest (testing)
- ✅ @testing-library/react

**May need to add**:

- ❓ react-markdown (for EventDescription rich text)
- ❓ date-fns (advanced date formatting)

### Internal package dependencies

**shared-components** depends on:

- @reiki-goddess/shared-utils (types, services, security)
- @reiki-goddess/design-system (tokens, theme)
- @reiki-goddess/shared-assets (images, icons)

**Circular dependency prevention**:

- Types defined in shared-utils
- Components in shared-components
- No imports from shared-components → shared-utils

---

## Next steps

1. **Review this document** with team/stakeholders
2. **Start Phase 1 implementation**:
   - Move types from archive
   - Create mockEvents.ts
   - Build EventService
   - Build micro components (badges, datetime, etc.)
   - Build EventCard
   - Build EventGrid
   - Assemble EventsPage
3. **Test each component** as built
4. **Document any deviations** from this spec
5. **Update this document** as patterns emerge

---

## Related documents

- [EventCard.md](./EventCard.md) - Detailed EventCard specification
- [EventGrid.md](./EventGrid.md) - Grid layout specification
- [EventsHero.md](./EventsHero.md) - Hero section specification
- [EventDetail.md](./EventDetail.md) - Detail page specification
- [EventRegistrationForm.md](./EventRegistrationForm.md) - Registration form spec
- [event-service.md](./event-service.md) - Data service specification
- [/docs/project/ARCHITECTURE.md](/docs/project/ARCHITECTURE.md) - Overall architecture patterns
- [/docs/design/events-page/database-schema.md](/docs/design/events-page/database-schema.md) - Backend schema (V1)

---

**Document Status**: ✅ Complete and ready for implementation
**Last Review**: 2025-11-03
**Next Review**: After Phase 1 completion
