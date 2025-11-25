# Events Page Database Design Specification

> **Version**: 2.0 (MVP-Focused)
> **Date**: 2025-11-03
> **Agent**: Database Analyst Agent
> **Purpose**: Production-ready database schema for Events Page V2

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [V1 Analysis: What Went Wrong](#v1-analysis-what-went-wrong)
3. [MVP Data Model (Phase 1)](#mvp-data-model-phase-1)
4. [V1 Fields Analysis: Keep vs Cut](#v1-fields-analysis-keep-vs-cut)
5. [Mock Data Strategy](#mock-data-strategy)
6. [Registration Data Model](#registration-data-model)
7. [Data Relationships](#data-relationships)
8. [Phase 2+ Enhancements](#phase-2-enhancements)
9. [Data Validation Rules](#data-validation-rules)
10. [Backend Integration Plan](#backend-integration-plan)
11. [Migration from Mock to API](#migration-from-mock-to-api)
12. [Implementation Checklist](#implementation-checklist)

---

## Executive Summary

### The V1 Problem

**What V1 Built**:

- 60+ field Payload CMS backend with comprehensive Event and Registration schemas
- Stripe integration, Google Calendar sync, email tracking, waitlist management
- Full admin UI with auto-generated forms and validation

**What V1 Delivered**:

- **ZERO** frontend components
- **ZERO** user-facing functionality
- **ZERO** events displayed on the website

**V1 Failure Root Cause**: Backend-first approach without UI validation

---

### The V2 Solution

**MVP Philosophy**: Build what users see FIRST, add backend complexity LATER

**Phase 1 Goals**:

1. Display upcoming events in a grid
2. Show essential event information (title, date, location, price, availability)
3. Enable users to click through to event details
4. Use mock data initially (no backend dependency)

**Success Metrics**:

- ✅ User can browse 10-12 events on Events Page
- ✅ User can see event details (date, time, location, price)
- ✅ User knows availability status (available, filling fast, sold out)
- ✅ All data from mockEvents.ts (no API calls)
- ✅ Complete frontend in 1 week

**Non-Goals for MVP**:

- ❌ Event registration/payment processing
- ❌ Waitlist management
- ❌ Email confirmations
- ❌ Calendar integration
- ❌ Admin CMS interface

---

## V1 Analysis: What Went Wrong

### V1 Schema Review

**File**: `/docs/archive/events-salvage/schemas/database-schema.md`
**Total Fields**: 60+ across Events, Registrations, Media, Users collections

### Why V1 Failed

1. **Over-Engineering**: Built for scale before validating user needs
2. **Backend Obsession**: 100% effort on Payload CMS, 0% on UI components
3. **Feature Creep**: Waitlists, early bird pricing, Google Calendar, Stripe integration—all before basic event display
4. **No Incremental Value**: All-or-nothing approach meant nothing shipped

### What V1 Got Right

✅ **Comprehensive Type System**: Excellent TypeScript interfaces (salvaged at `/docs/archive/events-salvage/types/events.ts`)
✅ **Data Relationships**: Smart separation of Events, Registrations, Media
✅ **Validation Logic**: Thorough field-level validation rules
✅ **Integration Planning**: Well-designed Stripe and Google Calendar hooks

**Action**: Reuse V1 types and validation, but simplify data model for MVP

---

## MVP Data Model (Phase 1)

### Design Principles

1. **Minimum Viable**: Only fields needed for Event Card and Event Detail display
2. **Frontend-Driven**: If the UI doesn't show it, we don't need it yet
3. **Easy to Mock**: Simple enough to create 12-15 realistic sample events
4. **Extensible**: Clear path to add Phase 2 fields without breaking changes

### Core Event Interface (MVP)

```typescript
/**
 * Event - Minimum Viable Product Schema
 *
 * Location: /packages/shared-utils/src/types/events.ts
 *
 * This is the ONLY interface needed for Phase 1 (Events listing + detail pages)
 */

export interface Event {
  // ============================================================================
  // IDENTIFICATION (4 fields)
  // ============================================================================

  /** Unique identifier (e.g., 'evt_full_moon_sound_bath_nov') */
  id: string;

  /** URL-friendly slug for routing (e.g., 'full-moon-aerial-sound-bath') */
  slug: string;

  /** Event title displayed on card and detail page */
  title: string;

  /** Optional subtitle for additional context */
  subtitle?: string;

  // ============================================================================
  // CONTENT (2 fields)
  // ============================================================================

  /** Short description for event cards (150 chars max) */
  shortDescription: string;

  /** Full event description in markdown format for detail page */
  description: string;

  // ============================================================================
  // VISUAL (1 field)
  // ============================================================================

  /** Featured image for event card and hero */
  featuredImage: {
    /** Image URL or path (e.g., '/img/download 1-full-moon-soundbath.png') */
    image: string;
    /** Alt text for accessibility */
    alt: string;
  };

  // ============================================================================
  // SCHEDULING (4 fields)
  // ============================================================================

  /** Event start date and time (ISO 8601 or Date object) */
  startDateTime: Date;

  /** Event end date and time (ISO 8601 or Date object) */
  endDateTime: Date;

  /** IANA timezone (e.g., 'America/Los_Angeles') */
  timezone: string;

  /** Duration breakdown for display */
  duration: {
    hours: number;
    minutes: number;
  };

  // ============================================================================
  // LOCATION (1 field)
  // ============================================================================

  /** Event location details */
  location: {
    /** Location type for UI display */
    type: "in-person" | "virtual" | "hybrid";

    /** Physical venue (only if type is 'in-person' or 'hybrid') */
    venue?: {
      name: string;
      address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
      };
      /** Optional Google Maps link */
      googleMapsUrl?: string;
    };

    /** Virtual meeting link (only if type is 'virtual' or 'hybrid') */
    virtualMeetingUrl?: string;
  };

  // ============================================================================
  // CAPACITY (1 field) - Critical for "X spots left" UI
  // ============================================================================

  /** Capacity tracking for availability display */
  capacity: {
    /** Maximum number of attendees */
    total: number;
    /** Current registrations (computed from registrations in Phase 2) */
    reserved: number;
  };

  /** Computed availability status for UI badges */
  availabilityStatus: "available" | "filling-fast" | "sold-out";

  // ============================================================================
  // PRICING (1 field)
  // ============================================================================

  /** Pricing information for display */
  pricing: {
    /** Pricing type */
    type: "free" | "paid" | "donation";
    /** Price in cents (e.g., 9900 = $99.00) - only for paid events */
    amount?: number;
    /** Currency code (e.g., 'usd') */
    currency?: string;
  };

  // ============================================================================
  // ORGANIZATION (3 fields)
  // ============================================================================

  /** Event category for filtering */
  category: string;

  /** Tags for search and related events */
  tags: string[];

  /** Display status */
  status: "published" | "past" | "cancelled";

  // ============================================================================
  // METADATA (2 fields) - Auto-managed
  // ============================================================================

  /** Created timestamp */
  createdAt: Date;

  /** Last updated timestamp */
  updatedAt: Date;
}
```

### Why These Fields?

#### Identification Fields

- **id**: Required for React keys and API lookups
- **slug**: Required for routing (`/events/:slug`)
- **title**: Displayed on EventCard and EventDetail
- **subtitle**: Optional context ("November Full Moon Ceremony")

#### Content Fields

- **shortDescription**: Shows on EventCard (truncated preview)
- **description**: Shows on EventDetail page (full markdown content)

#### Visual Fields

- **featuredImage**: Single image (not gallery) for MVP simplicity

#### Scheduling Fields

- **startDateTime/endDateTime**: Required for "Sat, Nov 15, 2025 • 2:00 PM - 4:00 PM PST" display
- **timezone**: Critical for accurate time display across time zones
- **duration**: Pre-calculated for "2 hours" display (avoids complex date math)

#### Location Fields

- **type**: Determines which icon/badge to show
- **venue**: Address display for in-person events
- **virtualMeetingUrl**: Zoom/Meet link (shown after registration in Phase 2)

#### Capacity Fields

- **total/reserved**: Required for "12 spots left" and "Sold Out" UI
- **availabilityStatus**: Pre-computed to avoid client-side calculations

#### Pricing Fields

- **type**: Determines "Free", "$99", or "Donation-Based" display
- **amount**: Price in cents following Stripe conventions

#### Organization Fields

- **category**: Powers filtering ("Sound Healing", "Reiki", "Workshops")
- **tags**: Powers search and related events
- **status**: Hides cancelled events, shows past events separately

---

## V1 Fields Analysis: Keep vs Cut

### ✅ Keep for MVP (19 core fields)

| V1 Field                     | MVP Field                    | Reason                       |
| ---------------------------- | ---------------------------- | ---------------------------- |
| `id`                         | `id`                         | Required for data operations |
| `slug`                       | `slug`                       | Required for routing         |
| `title`                      | `title`                      | Primary UI display           |
| `subtitle`                   | `subtitle`                   | Additional context           |
| `shortDescription`           | `shortDescription`           | Event card preview           |
| `description`                | `description`                | Event detail page            |
| `featuredImage`              | `featuredImage`              | Visual content               |
| `startDateTime`              | `startDateTime`              | Essential scheduling         |
| `endDateTime`                | `endDateTime`                | Essential scheduling         |
| `timezone`                   | `timezone`                   | Accurate time display        |
| `duration`                   | `duration`                   | Pre-computed for UI          |
| `location.type`              | `location.type`              | Display logic                |
| `location.venue`             | `location.venue`             | In-person event info         |
| `location.virtualMeetingUrl` | `location.virtualMeetingUrl` | Virtual event link           |
| `capacity.total`             | `capacity.total`             | Availability logic           |
| `capacity.reserved`          | `capacity.reserved`          | "X spots left" display       |
| `availabilityStatus`         | `availabilityStatus`         | UI badge                     |
| `pricing.type`               | `pricing.type`               | Free vs paid display         |
| `pricing.amount`             | `pricing.amount`             | Price display                |
| `category`                   | `category`                   | Filtering                    |
| `tags`                       | `tags`                       | Search/related events        |
| `status`                     | `status`                     | Display control              |
| `createdAt`                  | `createdAt`                  | Audit trail                  |
| `updatedAt`                  | `updatedAt`                  | Audit trail                  |

**Total MVP Fields**: 24 fields (down from 60+)

---

### ⏭️ Phase 2 Additions (Deferred)

| V1 Field               | V1 Type              | Why Deferred                          |
| ---------------------- | -------------------- | ------------------------------------- |
| `galleryImages`        | `GalleryImage[]`     | MVP uses single `featuredImage`       |
| `earlyBirdPricing`     | `EarlyBirdPricing`   | Adds complexity; single price for MVP |
| `stripeProductId`      | `string`             | No payment processing in Phase 1      |
| `stripePriceId`        | `string`             | No payment processing in Phase 1      |
| `googleCalendar`       | `GoogleCalendarData` | No calendar sync in Phase 1           |
| `isFeatured`           | `boolean`            | All events shown equally in MVP       |
| `isPinned`             | `boolean`            | No manual ordering in MVP             |
| `displayOrder`         | `number`             | Sort by date only in MVP              |
| `prerequisites`        | `string[]`           | Nice-to-have detail page content      |
| `whatToBring`          | `string[]`           | Nice-to-have detail page content      |
| `includesRefreshments` | `boolean`            | Minor detail                          |
| `certificateProvided`  | `boolean`            | Minor detail                          |
| `publishedAt`          | `Date`               | Status field is sufficient            |
| `cancelledAt`          | `Date`               | Status + updatedAt is sufficient      |
| `cancellationReason`   | `string`             | Not shown to users in MVP             |
| `createdBy`            | `string`             | No multi-user admin in MVP            |
| `updatedBy`            | `string`             | No multi-user admin in MVP            |

**Phase 2 Trigger**: When we add event registration or admin UI

---

### ❌ Over-Engineered (Cut Completely)

| V1 Field                   | V1 Type    | Why Unnecessary                       |
| -------------------------- | ---------- | ------------------------------------- |
| `seo.metaTitle`            | `string`   | Premature SEO optimization; use title |
| `seo.metaDescription`      | `string`   | Premature SEO; use shortDescription   |
| `seo.keywords`             | `string[]` | Tags serve same purpose               |
| `capacity.waitlist`        | `number`   | Waitlist is Phase 3+ feature          |
| `pricing.donation`         | Complex    | Simplify to `type: 'donation'`        |
| `location.meetingId`       | `string`   | Virtual URL is sufficient             |
| `location.meetingPassword` | `string`   | Security concern; send via email      |

---

## Mock Data Strategy

### File Structure

```
/packages/shared-utils/src/
├── types/
│   └── events.ts          # Event interface (MVP version)
├── data/
│   └── mockEvents.ts      # 12-15 sample events
└── services/
    └── eventService.ts    # Service layer (returns mock data)
```

### Mock Events Requirements

**Quantity**: 12-15 events minimum

**Diversity Required**:

- ✅ Mix of free, paid ($25-$299), and donation events
- ✅ Mix of in-person (Roy, WA), virtual (Zoom), and hybrid
- ✅ Mix of statuses: available, filling-fast (80%+ full), sold-out (100% full)
- ✅ Mix of past and upcoming events
- ✅ Different categories: sound-healing, reiki, workshops, retreats
- ✅ Varied capacity: small (8-12 people), medium (15-25), large (30-50)
- ✅ Different durations: 1.5 hours (sound baths), 3 hours (workshops), full day (8 hours)

### Sample Mock Event

```typescript
// /packages/shared-utils/src/data/mockEvents.ts

import type { Event } from "../types/events";

export const mockEvents: Event[] = [
  {
    id: "evt_full_moon_sound_bath_nov_2025",
    slug: "full-moon-aerial-sound-bath-november",
    title: "Full Moon Aerial Sound Bath",
    subtitle: "November Full Moon Ceremony",

    shortDescription:
      "Experience deep relaxation with aerial yoga and sound healing under the full moon. Limited to 20 participants.",

    description: `# Join us for a transformative Full Moon Aerial Sound Bath

Immerse yourself in the healing vibrations of crystal singing bowls while suspended in aerial yoga hammocks. This unique experience combines the benefits of sound healing with the gentle support of aerial yoga.

## What to Expect

- 30 minutes guided meditation and breathwork
- 60 minutes sound bath with crystal bowls, gongs, and chimes
- 30 minutes integration and tea ceremony

## What's Included

- All aerial yoga equipment provided
- Herbal tea and light refreshments
- Take-home moon water blessing

## Who Should Attend

Perfect for beginners and experienced practitioners alike. No aerial yoga experience necessary. Hammocks support up to 350 lbs.

**Please arrive 15 minutes early for hammock setup.**`,

    featuredImage: {
      image: "/img/download 1-full-moon-soundbath.png",
      alt: "Singing bowl with mallet, healing stones, and candles for Full Moon Sound Bath",
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
        googleMapsUrl:
          "https://maps.google.com/?q=8916+345th+Street+Ct+S+Roy+WA+98580",
      },
    },

    capacity: {
      total: 20,
      reserved: 17, // 85% full = "filling-fast"
    },
    availabilityStatus: "filling-fast",

    pricing: {
      type: "paid",
      amount: 9900, // $99.00
      currency: "usd",
    },

    category: "sound-healing",
    tags: [
      "sound-bath",
      "full-moon",
      "aerial-yoga",
      "meditation",
      "crystal-bowls",
    ],
    status: "published",

    createdAt: new Date("2025-10-01T10:00:00-08:00"),
    updatedAt: new Date("2025-11-01T14:30:00-08:00"),
  },

  // Event 2: Free virtual meditation (sold out)
  {
    id: "evt_free_meditation_series_nov",
    slug: "monday-evening-meditation-november",
    title: "Monday Evening Meditation Series",
    subtitle: "Weekly Community Meditation",

    shortDescription:
      "Free weekly meditation for all levels. Join us every Monday evening for guided meditation and community connection.",

    description: `# Free Weekly Meditation Series

Join our loving community every Monday evening for a grounding meditation practice. All levels welcome!

## Format

- 10 minutes arrival and settling
- 5 minutes opening circle
- 30 minutes guided meditation
- 15 minutes sharing (optional)

## This Week's Theme

**Gratitude Practice**: Cultivating appreciation for the present moment.

**No registration fee**, but space is limited to maintain intimate group energy.`,

    featuredImage: {
      image: "/img/meditation-circle.jpg",
      alt: "Community meditation circle with candles",
    },

    startDateTime: new Date("2025-11-18T18:30:00-08:00"),
    endDateTime: new Date("2025-11-18T19:30:00-08:00"),
    timezone: "America/Los_Angeles",
    duration: { hours: 1, minutes: 0 },

    location: {
      type: "virtual",
      virtualMeetingUrl: "https://zoom.us/j/123456789", // Hidden until registration
    },

    capacity: {
      total: 30,
      reserved: 30, // 100% full = "sold-out"
    },
    availabilityStatus: "sold-out",

    pricing: {
      type: "free",
    },

    category: "meditation",
    tags: ["meditation", "free", "weekly", "community", "virtual"],
    status: "published",

    createdAt: new Date("2025-09-15T10:00:00-08:00"),
    updatedAt: new Date("2025-11-10T09:00:00-08:00"),
  },

  // Event 3: Reiki Level 1 Certification (in-person, available)
  {
    id: "evt_reiki_level_1_december",
    slug: "reiki-level-1-certification-december",
    title: "Reiki Level 1 Certification",
    subtitle: "Usui Reiki Beginner Training",

    shortDescription:
      "Two-day intensive Reiki Level 1 certification. Learn hands-on healing techniques and receive your first attunement.",

    description: `# Reiki Level 1 Certification Training

Embark on your Reiki journey with our comprehensive Level 1 certification course. This two-day intensive will introduce you to the fundamentals of Usui Reiki and empower you to begin healing yourself and others.

## Day 1: Foundations (Saturday)

- History and principles of Reiki
- Understanding energy and chakras
- First attunement ceremony
- Self-healing techniques
- Hand positions for others

## Day 2: Practice & Integration (Sunday)

- Second attunement ceremony
- Practicing on partners
- Ethical considerations
- Setting up your practice
- Q&A and certificate ceremony

## What's Included

- Two Reiki attunements
- Comprehensive training manual
- Practice session with classmates
- Level 1 certification
- Ongoing mentor support for 30 days

## Prerequisites

- No prior experience required
- Open heart and willingness to learn
- Comfortable clothing recommended

## Investment

$249 (includes all materials and certification)

**Early registration recommended** - class limited to 12 students for personalized attention.`,

    featuredImage: {
      image: "/img/reiki-training.jpg",
      alt: "Reiki practitioner performing hands-on healing",
    },

    startDateTime: new Date("2025-12-07T09:00:00-08:00"),
    endDateTime: new Date("2025-12-08T17:00:00-08:00"),
    timezone: "America/Los_Angeles",
    duration: { hours: 16, minutes: 0 },

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
        googleMapsUrl:
          "https://maps.google.com/?q=8916+345th+Street+Ct+S+Roy+WA+98580",
      },
    },

    capacity: {
      total: 12,
      reserved: 4, // 33% full = "available"
    },
    availabilityStatus: "available",

    pricing: {
      type: "paid",
      amount: 24900, // $249.00
      currency: "usd",
    },

    category: "certification",
    tags: [
      "reiki",
      "certification",
      "level-1",
      "beginner",
      "two-day",
      "intensive",
    ],
    status: "published",

    createdAt: new Date("2025-10-15T10:00:00-08:00"),
    updatedAt: new Date("2025-10-20T14:00:00-08:00"),
  },

  // Event 4: Past event example
  {
    id: "evt_samhain_ceremony_2024",
    slug: "samhain-celebration-october-2024",
    title: "Samhain Celebration & Ancestor Honoring",
    subtitle: "October 2024 Event (Completed)",

    shortDescription:
      "Sacred ceremony honoring our ancestors and celebrating the thinning of the veil during Samhain season.",

    description: `# Samhain Celebration (Past Event)

This event has concluded. Thank you to all who attended!

We gathered on October 31, 2024 for a powerful Samhain ceremony including sound healing, ancestor altar, and community ritual.`,

    featuredImage: {
      image: "/img/samhain-altar.jpg",
      alt: "Samhain ancestor altar with candles and offerings",
    },

    startDateTime: new Date("2024-10-31T18:00:00-08:00"),
    endDateTime: new Date("2024-10-31T21:00:00-08:00"),
    timezone: "America/Los_Angeles",
    duration: { hours: 3, minutes: 0 },

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
      total: 25,
      reserved: 25, // Past events shown as full
    },
    availabilityStatus: "sold-out",

    pricing: {
      type: "donation",
    },

    category: "ceremony",
    tags: ["samhain", "ceremony", "ancestors", "ritual", "seasonal"],
    status: "past", // Status = 'past' for completed events

    createdAt: new Date("2024-09-15T10:00:00-08:00"),
    updatedAt: new Date("2024-11-01T10:00:00-08:00"),
  },

  // ... 8-11 more diverse events following similar patterns
];

/**
 * Helper to get upcoming events only
 */
export const getUpcomingEvents = (): Event[] => {
  const now = new Date();
  return mockEvents
    .filter(
      (event) =>
        event.status === "published" && new Date(event.startDateTime) > now
    )
    .sort(
      (a, b) =>
        new Date(a.startDateTime).getTime() -
        new Date(b.startDateTime).getTime()
    );
};

/**
 * Helper to get past events
 */
export const getPastEvents = (): Event[] => {
  return mockEvents
    .filter((event) => event.status === "past")
    .sort(
      (a, b) =>
        new Date(b.startDateTime).getTime() -
        new Date(a.startDateTime).getTime()
    );
};
```

### Mock Data Event Titles (To Match Figma)

Use these titles from Figma screenshots where possible:

1. **"Full Moon Aerial Sound Bath"** ✅ (from Figma)
2. **"Custom Sound Healing Song Workshop"** ✅ (from Figma)
3. "Reiki Level 1 Certification"
4. "Monday Evening Meditation Series"
5. "Chakra Balancing Workshop"
6. "Winter Solstice Sound Journey"
7. "New Moon Manifestation Circle"
8. "Crystal Bowl Sound Bath"
9. "Energy Healing for Beginners"
10. "Restorative Yoga & Reiki"
11. "Samhain Ancestor Ceremony" (past event)
12. "Spring Equinox Celebration" (past event)

---

## Registration Data Model

### MVP Approach: No Registration Yet

**Phase 1**: Events are display-only

- Users see events
- Users see "Register Now" button
- Button links to contact form or waitlist signup (reuse existing ContactForm)

**Phase 2**: Add simple registration

- Free events → Direct sign-up form
- Paid events → Link to Stripe Checkout (external)

### Simple Registration (Phase 2)

```typescript
/**
 * Registration - Phase 2 Only
 *
 * Minimal registration data for free events.
 * Paid events use Stripe Checkout (no custom registration form).
 */

export interface EventRegistration {
  // Basic identification
  id: string;
  eventId: string; // References Event.id
  confirmationCode: string; // e.g., 'RGH-2025-ABC123'

  // Customer info
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };

  // Status tracking
  status: "registered" | "attended" | "cancelled";

  // Timestamps
  registeredAt: Date;
  createdAt: Date;
}
```

### Registration Flow Options

#### Option A: Reuse Contact Form (Recommended for MVP)

```typescript
// In EventDetail component
<ContactForm
  formType="event-inquiry"
  defaultMessage={`I'm interested in registering for: ${event.title}`}
  eventId={event.id}
/>
```

**Pros**:

- ✅ No new components needed
- ✅ Existing security validation (rate limiting, XSS protection)
- ✅ Works for all event types
- ✅ Owner manually processes registrations

**Cons**:

- ❌ No automated confirmation emails
- ❌ No real-time capacity updates
- ❌ Manual payment collection

#### Option B: Stripe Checkout Links (Phase 2)

For paid events, link directly to Stripe Checkout:

```typescript
// In pricing section of EventDetail
{event.pricing.type === 'paid' && (
  <a
    href={`https://checkout.stripe.com/c/pay/${event.stripeCheckoutId}`}
    className="register-button"
  >
    Register Now - ${formatPrice(event.pricing.amount)}
  </a>
)}
```

**Pros**:

- ✅ Stripe handles payment UI
- ✅ Automated confirmation emails from Stripe
- ✅ PCI compliance handled by Stripe

**Cons**:

- ❌ Requires Stripe product setup
- ❌ No capacity tracking (need webhook)

#### Option C: Full Registration System (Phase 3+)

Build custom EventRegistrationForm only when:

- Multiple ticket types needed
- Discount codes required
- Complex custom questions
- Immediate capacity updates needed

---

## Data Relationships

### Entity Relationships (MVP)

```
┌────────────────┐
│     Events     │  ← Single collection, no relationships
│                │
│  - id (PK)     │
│  - slug        │
│  - title       │
│  - ...         │
└────────────────┘
```

**MVP is intentionally flat**: No relationships, no joins, no foreign keys

### Phase 2: Add Registrations

```
┌────────────────┐         ┌──────────────────────┐
│     Events     │ 1     * │   Registrations      │
│                │─────────│                      │
│  - id (PK)     │         │  - id (PK)           │
│  - slug        │         │  - eventId (FK)      │
│  - title       │         │  - customer.email    │
│  ...           │         │  - status            │
└────────────────┘         │  - registeredAt      │
                           └──────────────────────┘

// Update event.capacity.reserved count:
capacity.reserved = COUNT(registrations WHERE eventId = event.id AND status != 'cancelled')
```

### Phase 3+: Add Images, Categories, Users

```
┌─────────┐         ┌────────────┐
│  Media  │ *     1 │   Events   │
│         │─────────│            │
│ - id    │         │ - id       │
│ - url   │         │ - ...      │
└─────────┘         └────────────┘
                         │
                         │ 1
                         │
                         │ *
                    ┌──────────────┐
                    │ Registrations│
                    └──────────────┘
```

---

## Phase 2+ Enhancements

### Phase 2: Event Registration & Payment

**Trigger**: When owner wants to collect payments online

**Features to Add**:

1. **Payment Processing**
   - Add `pricing.stripeProductId` and `pricing.stripePriceId`
   - Integrate Stripe Checkout
   - Webhook for payment confirmation

2. **Registration Tracking**
   - Add `EventRegistration` collection
   - Real-time capacity updates
   - Confirmation emails via Resend

3. **Early Bird Pricing**
   ```typescript
   pricing: {
     type: 'paid',
     amount: 9900,
     currency: 'usd',
     earlyBirdPricing: {
       amount: 7900,
       validUntil: new Date('2025-11-01T23:59:59-08:00'),
       stripePriceId: 'price_early_bird_123'
     }
   }
   ```

### Phase 3: Enhanced Event Features

**Features to Add**:

1. **Image Gallery**

   ```typescript
   galleryImages: Array<{
     image: string;
     alt: string;
     caption?: string;
   }>;
   ```

2. **Event Prerequisites & Details**

   ```typescript
   prerequisites: ["No prior experience required", "Comfortable clothing"];
   whatToBring: ["Yoga mat", "Water bottle", "Journal"];
   includesRefreshments: true;
   certificateProvided: true;
   ```

3. **Featured Events**
   ```typescript
   isFeatured: boolean; // Show on homepage
   isPinned: boolean; // Keep at top of list
   displayOrder: number; // Manual sorting
   ```

### Phase 4: Advanced Features

1. **Waitlist Management**

   ```typescript
   capacity: {
     total: 20,
     reserved: 20,
     waitlist: 5  // Number on waitlist
   }
   ```

2. **Recurring Events**

   ```typescript
   recurrence: {
     pattern: 'weekly' | 'monthly' | 'custom';
     frequency: number;
     daysOfWeek: number[];
     endDate: Date;
   }
   ```

3. **Multi-Day Events**

   ```typescript
   sessions: Array<{
     date: Date;
     startTime: string;
     endTime: string;
     title: string;
   }>;
   ```

4. **Google Calendar Integration**
   ```typescript
   googleCalendar: {
     eventId: string;
     calendarId: string;
     htmlLink: string;
   }
   ```

---

## Data Validation Rules

### Client-Side Validation (Phase 1)

```typescript
/**
 * Event validation rules for mock data and API payloads
 *
 * Location: /packages/shared-utils/src/validation/eventValidation.ts
 */

export const eventValidation = {
  // Required fields
  id: {
    required: true,
    pattern: /^evt_[a-z0-9_]+$/, // Must start with 'evt_'
    message:
      'Event ID must start with "evt_" and contain only lowercase letters, numbers, and underscores',
  },

  slug: {
    required: true,
    pattern: /^[a-z0-9-]+$/, // Lowercase letters, numbers, hyphens only
    minLength: 5,
    maxLength: 100,
    message:
      "Slug must be 5-100 characters, lowercase letters/numbers/hyphens only",
  },

  title: {
    required: true,
    minLength: 5,
    maxLength: 100,
    message: "Title must be 5-100 characters",
  },

  shortDescription: {
    required: true,
    minLength: 20,
    maxLength: 200,
    message: "Short description must be 20-200 characters",
  },

  description: {
    required: true,
    minLength: 50,
    message: "Description must be at least 50 characters",
  },

  // Date validation
  startDateTime: {
    required: true,
    validate: (value: Date) => {
      const date = new Date(value);
      return !isNaN(date.getTime());
    },
    message: "Valid start date required",
  },

  endDateTime: {
    required: true,
    validate: (value: Date, data: Event) => {
      const start = new Date(data.startDateTime);
      const end = new Date(value);
      return end > start;
    },
    message: "End date must be after start date",
  },

  // Capacity validation
  capacity: {
    total: {
      required: true,
      min: 1,
      max: 1000,
      message: "Capacity must be between 1 and 1000",
    },
    reserved: {
      required: true,
      min: 0,
      validate: (value: number, data: Event) => {
        return value <= data.capacity.total;
      },
      message: "Reserved count cannot exceed total capacity",
    },
  },

  // Pricing validation
  pricing: {
    type: {
      required: true,
      enum: ["free", "paid", "donation"],
      message: "Pricing type must be free, paid, or donation",
    },
    amount: {
      validate: (value: number | undefined, data: Event) => {
        if (data.pricing.type === "paid") {
          return value !== undefined && value >= 0;
        }
        return true;
      },
      min: 0,
      max: 100000, // $1000 max
      message: "Paid events must have amount in cents (0-100000)",
    },
  },
};

/**
 * Validate event object against rules
 */
export function validateEvent(event: Event): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Run all validation rules
  // (Implementation follows FigmaContactForm security validation pattern)

  return {
    valid: errors.length === 0,
    errors,
  };
}
```

### Computed Field Rules

```typescript
/**
 * Auto-compute availability status based on capacity
 */
export function computeAvailabilityStatus(
  capacity: EventCapacity
): Event["availabilityStatus"] {
  const percentFull = (capacity.reserved / capacity.total) * 100;

  if (percentFull >= 100) {
    return "sold-out";
  } else if (percentFull >= 80) {
    return "filling-fast";
  } else {
    return "available";
  }
}

/**
 * Auto-compute duration from start/end times
 */
export function computeDuration(
  startDateTime: Date,
  endDateTime: Date
): EventDuration {
  const diffMs = endDateTime.getTime() - startDateTime.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));

  return {
    hours: Math.floor(diffMins / 60),
    minutes: diffMins % 60,
  };
}
```

---

## Backend Integration Plan

### Phase 1: Mock Data Only (Current)

**EventService Implementation**:

```typescript
// /packages/shared-utils/src/services/eventService.ts

import { mockEvents } from "../data/mockEvents";
import type { Event, EventFilters } from "../types/events";

/**
 * Mock API delay for realistic testing
 */
const MOCK_DELAY_MS = 100;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class EventService {
  /**
   * Fetch all events with optional filtering
   */
  static async getEvents(filters?: EventFilters): Promise<Event[]> {
    await delay(MOCK_DELAY_MS);

    let events = [...mockEvents];

    // Filter by category
    if (filters?.category && filters.category !== "all") {
      events = events.filter((e) => e.category === filters.category);
    }

    // Filter by status (upcoming vs past)
    if (filters?.status) {
      const now = new Date();
      if (filters.status === "upcoming") {
        events = events.filter((e) => new Date(e.startDateTime) > now);
      } else if (filters.status === "past") {
        events = events.filter((e) => e.status === "past");
      }
    }

    // Sort by start date (upcoming first)
    return events.sort(
      (a, b) =>
        new Date(a.startDateTime).getTime() -
        new Date(b.startDateTime).getTime()
    );
  }

  /**
   * Fetch single event by slug
   */
  static async getEventBySlug(slug: string): Promise<Event | null> {
    await delay(MOCK_DELAY_MS);

    const event = mockEvents.find((e) => e.slug === slug);
    return event || null;
  }

  /**
   * Get upcoming events only
   */
  static async getUpcomingEvents(limit?: number): Promise<Event[]> {
    const events = await this.getEvents({ status: "upcoming" });
    return limit ? events.slice(0, limit) : events;
  }

  /**
   * Get events by category
   */
  static async getEventsByCategory(category: string): Promise<Event[]> {
    return this.getEvents({ category });
  }
}
```

**Usage in Components**:

```typescript
// In EventsPage component
const { events, loading, error } = useEvents({ status: "upcoming" });
```

---

### Phase 2: API Integration Options

#### Option A: Custom Express API (Recommended)

**Pros**:

- ✅ Full control over data structure
- ✅ Simple REST endpoints
- ✅ Easy MongoDB integration
- ✅ No framework learning curve

**Cons**:

- ❌ Manual CRUD implementation
- ❌ No auto-generated admin UI

**Implementation**:

```typescript
// Backend: /api/events
app.get("/api/events", async (req, res) => {
  const { category, status } = req.query;
  const query: any = {};

  if (category && category !== "all") {
    query.category = category;
  }

  if (status === "upcoming") {
    query.startDateTime = { $gt: new Date() };
  }

  const events = await Event.find(query).sort({ startDateTime: 1 });
  res.json(events);
});

// Frontend: EventService (Phase 2)
const API_BASE = process.env.VITE_API_URL || "http://localhost:3000/api";

export class EventService {
  static async getEvents(filters?: EventFilters): Promise<Event[]> {
    const params = new URLSearchParams();
    if (filters?.category) params.set("category", filters.category);
    if (filters?.status) params.set("status", filters.status);

    const response = await fetch(`${API_BASE}/events?${params}`);
    if (!response.ok) throw new Error("Failed to fetch events");

    return response.json();
  }
}
```

---

#### Option B: Payload CMS (V1 Salvage)

**Pros**:

- ✅ Auto-generated admin UI
- ✅ Built-in auth and permissions
- ✅ Rich text editor for descriptions
- ✅ Image upload handling

**Cons**:

- ❌ Complexity overkill for MVP
- ❌ Learning curve
- ❌ V1 trauma

**When to Use**: Only if owner needs self-service event creation

**Migration Path**:

1. Start with Express API in Phase 2
2. Evaluate need for admin UI in Phase 3
3. If needed, migrate to Payload CMS using V1 schema as blueprint

---

#### Option C: Headless CMS (Contentful/Strapi)

**Pros**:

- ✅ Managed service (no hosting)
- ✅ Good UI for content editing
- ✅ Built-in media management

**Cons**:

- ❌ Monthly cost ($29-99/mo)
- ❌ Less flexibility than custom API
- ❌ Data lock-in

**When to Use**: If budget allows and owner prefers managed solution

---

### Recommendation: Start with Express API

**Rationale**:

1. MVP needs data display, not data entry (owner can use JSON files initially)
2. Express API is simplest migration from mock data
3. Can add admin UI later if needed
4. Avoids V1 mistake of building CMS before validating UI

**Migration Checklist** (Phase 1 → Phase 2):

- [ ] Set up Express server with MongoDB
- [ ] Create Event mongoose schema (match TypeScript interface)
- [ ] Implement GET /api/events with filtering
- [ ] Implement GET /api/events/:slug
- [ ] Update EventService to use API_BASE (environment variable)
- [ ] Add error handling and loading states
- [ ] Deploy API to Render/Railway/Fly.io
- [ ] Update frontend env vars

---

## Migration from Mock to API

### Service Layer Pattern (Following BlogService)

The EventService should work identically with mock data or API:

```typescript
// EventService interface (never changes)
export class EventService {
  static async getEvents(filters?: EventFilters): Promise<Event[]>;
  static async getEventBySlug(slug: string): Promise<Event | null>;
  static async getUpcomingEvents(limit?: number): Promise<Event[]>;
}

// Phase 1: Implementation uses mockEvents
// Phase 2: Implementation uses fetch(API_BASE)
// Components never know the difference!
```

### Environment-Based Toggle

```typescript
// /packages/shared-utils/src/services/eventService.ts

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_EVENTS !== "false";

export class EventService {
  static async getEvents(filters?: EventFilters): Promise<Event[]> {
    if (USE_MOCK_DATA) {
      // Phase 1: Mock implementation
      return getMockEvents(filters);
    } else {
      // Phase 2: API implementation
      return getEventsFromAPI(filters);
    }
  }
}
```

### Frontend Code Stays Unchanged

```typescript
// EventsPage component works with both mock and API data
const EventsPage: React.FC = () => {
  const { events, loading, error } = useEvents({ status: 'upcoming' });

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return <EventGrid events={events} />;
};
```

---

## Implementation Checklist

### Phase 1: MVP (Mock Data)

**Types & Validation**:

- [ ] Create `/packages/shared-utils/src/types/events.ts` with MVP Event interface
- [ ] Create `/packages/shared-utils/src/validation/eventValidation.ts`
- [ ] Export types from `/packages/shared-utils/src/index.ts`

**Mock Data**:

- [ ] Create `/packages/shared-utils/src/data/mockEvents.ts`
- [ ] Add 12-15 diverse sample events (free, paid, virtual, in-person, sold-out, available)
- [ ] Include past events for testing filters
- [ ] Use Figma event titles where available

**Service Layer**:

- [ ] Create `/packages/shared-utils/src/services/eventService.ts`
- [ ] Implement `getEvents(filters)` with mock data
- [ ] Implement `getEventBySlug(slug)` with mock data
- [ ] Implement `getUpcomingEvents(limit)` helper
- [ ] Add 100ms delay for realistic async behavior

**Testing**:

- [ ] Write tests for EventService methods
- [ ] Write tests for validation rules
- [ ] Write tests for computed fields (availabilityStatus, duration)

### Phase 2: API Integration

**Backend Setup**:

- [ ] Create Express server with MongoDB
- [ ] Define Mongoose Event schema
- [ ] Implement GET /api/events endpoint
- [ ] Implement GET /api/events/:slug endpoint
- [ ] Add filtering support (category, status, date range)
- [ ] Deploy to hosting (Render/Railway/Fly.io)

**Frontend Migration**:

- [ ] Add environment variable `VITE_API_URL`
- [ ] Update EventService to use API when `USE_MOCK_DATA=false`
- [ ] Add error handling for API failures
- [ ] Add retry logic for failed requests
- [ ] Update loading states to handle longer API delays

**Data Migration**:

- [ ] Seed MongoDB with mockEvents data
- [ ] Verify API returns same data structure as mock
- [ ] Test all filtering scenarios
- [ ] Update documentation

### Phase 3: Registration & Payment

**Data Model**:

- [ ] Add EventRegistration interface
- [ ] Create registrations collection/table
- [ ] Add Stripe product/price IDs to events
- [ ] Add early bird pricing fields

**Backend**:

- [ ] Implement POST /api/registrations endpoint
- [ ] Integrate Stripe Checkout
- [ ] Add webhook for payment confirmation
- [ ] Send confirmation emails via Resend

**Frontend**:

- [ ] Create EventRegistrationForm component
- [ ] Add registration flow to EventDetail page
- [ ] Show real-time capacity updates
- [ ] Handle sold-out states

---

## Success Criteria

### Phase 1 Success Metrics

✅ **Developer can**:

- Import Event types from shared-utils
- Import mockEvents from shared-utils
- Call EventService.getEvents() and receive 12+ events
- Filter events by category and status
- Get single event by slug

✅ **Frontend works**:

- EventCard displays all event data correctly
- EventGrid shows 12+ events in responsive grid
- EventDetail page shows full event information
- All UI components have data they need
- No "undefined" or "null" displayed

✅ **Performance**:

- Page loads in < 2 seconds
- No layout shift
- Smooth transitions

✅ **Timeline**:

- Complete in 1 week or less

### Phase 2 Success Metrics

✅ **API Integration**:

- EventService.getEvents() fetches from API
- Response time < 500ms
- Error handling shows user-friendly messages
- Fallback to cached data on network errors

✅ **Data Consistency**:

- API returns exact same structure as mock data
- No breaking changes to frontend
- All tests still pass

### Phase 3 Success Metrics

✅ **Registration**:

- Users can register for free events
- Users can purchase tickets for paid events
- Capacity updates in real-time
- Sold-out events show correct status

---

## Related Documents

- [V1 Database Schema (Archive)](/docs/archive/events-salvage/schemas/database-schema.md) - Original comprehensive schema
- [V1 Event Types (Archive)](/docs/archive/events-salvage/types/events.ts) - TypeScript interfaces
- [Component Architecture](/docs/design/events-page/components/README.md) - Frontend component specs
- [Design Implementation](/docs/design/events-page/design-implementation.md) - Visual design specs
- [Blog Service (Reference)](/packages/shared-utils/src/services/blogService.ts) - Service layer pattern

---

**Document Status**: ✅ Complete - Ready for Implementation
**Last Updated**: 2025-11-03
**Next Step**: Create `/packages/shared-utils/src/types/events.ts` with MVP interface
