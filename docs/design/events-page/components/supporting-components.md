# Supporting components specifications

**Purpose**: Micro-components that support EventCard and EventDetailPage
**Phase**: Phase 1 (MVP)
**Status**: New components

---

## Overview

These small, focused components handle specific pieces of event metadata display. They are composable building blocks used throughout the events feature.

---

## 1. EventStatusBadge

### Purpose

Display event availability status with appropriate visual styling.

### Props interface

```typescript
export interface EventStatusBadgeProps {
  /**
   * Current availability status
   */
  status: "available" | "filling-fast" | "sold-out" | "waitlist-only";

  /**
   * Whether event is sold out (computed)
   */
  isSoldOut?: boolean;

  /**
   * Whether event is in the past
   */
  isPast?: boolean;

  /**
   * Visual variant
   */
  variant?: "default" | "compact";

  /**
   * Additional CSS classes
   */
  className?: string;
}
```

### Visual specifications

```typescript
// Status colors
const statusStyles = {
  available: {
    background: "#E8F5E9",
    text: "#2E7D32",
    icon: "✓",
  },
  "filling-fast": {
    background: "#FFF3E0",
    text: "#E65100",
    icon: "🔥",
  },
  "sold-out": {
    background: "#FFEBEE",
    text: "#C62828",
    icon: "✕",
  },
  "waitlist-only": {
    background: "#E3F2FD",
    text: "#1565C0",
    icon: "⏰",
  },
  past: {
    background: "#F5F5F5",
    text: "#757575",
    icon: "📅",
  },
};
```

### Implementation

```typescript
export const EventStatusBadge: React.FC<EventStatusBadgeProps> = ({
  status,
  isSoldOut = false,
  isPast = false,
  variant = 'default',
  className = '',
}) => {
  let displayStatus = status;
  if (isPast) displayStatus = 'past';
  if (isSoldOut) displayStatus = 'sold-out';

  const styles = statusStyles[displayStatus];
  const labels = {
    available: 'Available',
    'filling-fast': 'Filling Fast',
    'sold-out': 'Sold Out',
    'waitlist-only': 'Waitlist Only',
    past: 'Past Event',
  };

  return (
    <span
      className={`event-status-badge ${variant} ${className}`}
      style={{
        backgroundColor: styles.background,
        color: styles.text,
        padding: variant === 'compact' ? '4px 8px' : '6px 12px',
        borderRadius: '12px',
        fontSize: variant === 'compact' ? '12px' : '14px',
        fontWeight: 600,
        fontFamily: 'Figtree, sans-serif',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
      }}
      role="status"
      aria-label={`Event status: ${labels[displayStatus]}`}
    >
      <span aria-hidden="true">{styles.icon}</span>
      {labels[displayStatus]}
    </span>
  );
};
```

---

## 2. EventDateTime

### Purpose

Format and display event date, time, and duration information.

### Props interface

```typescript
export interface EventDateTimeProps {
  /**
   * Event start date/time
   */
  startDateTime: Date;

  /**
   * Event end date/time
   */
  endDateTime: Date;

  /**
   * Timezone identifier
   */
  timezone: string;

  /**
   * Display format
   * - full: "Saturday, November 15, 2025 • 2:00 PM - 4:00 PM PST"
   * - short: "Nov 15 • 2-4 PM"
   * - date-only: "Saturday, November 15, 2025"
   * - time-only: "2:00 PM - 4:00 PM PST"
   */
  format?: "full" | "short" | "date-only" | "time-only";

  /**
   * Whether to show icon
   */
  showIcon?: boolean;

  /**
   * Compact display (no line breaks)
   */
  compact?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;
}
```

### Implementation

```typescript
export const EventDateTime: React.FC<EventDateTimeProps> = ({
  startDateTime,
  endDateTime,
  timezone,
  format = 'full',
  showIcon = true,
  compact = false,
  className = '',
}) => {
  const formatDate = (date: Date, formatType: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: timezone,
    };

    switch (formatType) {
      case 'full':
        return date.toLocaleString('en-US', {
          ...options,
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });

      case 'short':
        return date.toLocaleString('en-US', {
          ...options,
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });

      case 'date-only':
        return date.toLocaleString('en-US', {
          ...options,
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

      case 'time-only':
        return date.toLocaleString('en-US', {
          ...options,
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });

      default:
        return date.toLocaleString('en-US', options);
    }
  };

  const startStr = formatDate(startDateTime, format);
  const endStr = formatDate(endDateTime, 'time-only');

  // Extract timezone abbreviation
  const tzAbbr = timezone.split('/').pop()?.replace(/_/g, ' ') || '';

  let displayText = '';
  if (format === 'full') {
    displayText = `${startStr} - ${endStr} ${tzAbbr}`;
  } else if (format === 'short') {
    displayText = `${startStr} - ${endStr}`;
  } else {
    displayText = startStr;
  }

  return (
    <div
      className={`event-datetime ${compact ? 'compact' : ''} ${className}`}
      style={{
        display: 'flex',
        alignItems: compact ? 'center' : 'flex-start',
        gap: '8px',
        fontFamily: 'Neue Montreal, sans-serif',
        fontSize: '14px',
        color: '#5E5E5E',
      }}
    >
      {showIcon && (
        <span
          aria-hidden="true"
          style={{ fontSize: '16px', flexShrink: 0 }}
        >
          📅
        </span>
      )}
      <span>{displayText}</span>
    </div>
  );
};
```

---

## 3. EventLocation

### Purpose

Display event location information with appropriate icon and formatting.

### Props interface

```typescript
export interface EventLocationProps {
  /**
   * Location data
   */
  location: EventLocation;

  /**
   * Whether to show full address or city/state only
   */
  showFullAddress?: boolean;

  /**
   * Whether to show icon
   */
  showIcon?: boolean;

  /**
   * Compact display
   */
  compact?: boolean;

  /**
   * Whether to make address a link (Google Maps)
   */
  linkable?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;
}
```

### Implementation

```typescript
export const EventLocation: React.FC<EventLocationProps> = ({
  location,
  showFullAddress = false,
  showIcon = true,
  compact = true,
  linkable = false,
  className = '',
}) => {
  const getLocationIcon = () => {
    switch (location.type) {
      case 'virtual':
        return '💻';
      case 'hybrid':
        return '🔀';
      case 'in-person':
      default:
        return '📍';
    }
  };

  const getLocationText = () => {
    if (location.type === 'virtual') {
      return 'Virtual Event';
    }

    if (location.type === 'hybrid') {
      return 'Hybrid (In-Person + Virtual)';
    }

    // In-person
    if (!location.venue) {
      return 'Location TBD';
    }

    if (showFullAddress) {
      const addr = location.venue.address;
      return `${addr.street}, ${addr.city}, ${addr.state} ${addr.zipCode}`;
    }

    return `${location.venue.address.city}, ${location.venue.address.state}`;
  };

  const locationText = getLocationText();
  const icon = getLocationIcon();

  const content = (
    <div
      className={`event-location ${compact ? 'compact' : ''} ${className}`}
      style={{
        display: 'flex',
        alignItems: compact ? 'center' : 'flex-start',
        gap: '8px',
        fontFamily: 'Neue Montreal, sans-serif',
        fontSize: '14px',
        color: '#5E5E5E',
      }}
    >
      {showIcon && (
        <span
          aria-hidden="true"
          style={{ fontSize: '16px', flexShrink: 0 }}
        >
          {icon}
        </span>
      )}
      <span>{locationText}</span>
    </div>
  );

  if (linkable && location.venue?.googleMapsUrl) {
    return (
      <a
        href={location.venue.googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="event-location-link"
        style={{
          textDecoration: 'none',
          color: 'inherit',
        }}
        aria-label={`View location: ${locationText} on Google Maps`}
      >
        {content}
      </a>
    );
  }

  return content;
};
```

---

## 4. EventCapacity

### Purpose

Display remaining capacity or waitlist status.

### Props interface

```typescript
export interface EventCapacityProps {
  /**
   * Capacity data
   */
  capacity: EventCapacity;

  /**
   * Whether to show as progress bar
   */
  showProgress?: boolean;

  /**
   * Whether to show icon
   */
  showIcon?: boolean;

  /**
   * Compact display
   */
  compact?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;
}
```

### Implementation

```typescript
export const EventCapacity: React.FC<EventCapacityProps> = ({
  capacity,
  showProgress = false,
  showIcon = true,
  compact = true,
  className = '',
}) => {
  const spotsLeft = getSpotsRemaining(capacity);
  const percentFull = (capacity.reserved / capacity.total) * 100;

  const getCapacityText = () => {
    if (spotsLeft === 0) {
      if (capacity.waitlist > 0) {
        return `Sold out • ${capacity.waitlist} on waitlist`;
      }
      return 'Sold out';
    }

    if (spotsLeft === 1) {
      return '1 spot left';
    }

    return `${spotsLeft} spots left`;
  };

  const getCapacityColor = () => {
    if (spotsLeft === 0) return '#C62828'; // Red
    if (percentFull >= 80) return '#E65100'; // Orange
    return '#2E7D32'; // Green
  };

  return (
    <div
      className={`event-capacity ${compact ? 'compact' : ''} ${className}`}
      style={{
        fontFamily: 'Neue Montreal, sans-serif',
        fontSize: '14px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#5E5E5E',
        }}
      >
        {showIcon && (
          <span
            aria-hidden="true"
            style={{ fontSize: '16px', flexShrink: 0 }}
          >
            👥
          </span>
        )}
        <span style={{ color: getCapacityColor(), fontWeight: 500 }}>
          {getCapacityText()}
        </span>
      </div>

      {showProgress && (
        <div
          className="capacity-progress"
          style={{
            width: '100%',
            height: '6px',
            backgroundColor: '#E0E0E0',
            borderRadius: '3px',
            marginTop: '8px',
            overflow: 'hidden',
          }}
          role="progressbar"
          aria-valuenow={capacity.reserved}
          aria-valuemin={0}
          aria-valuemax={capacity.total}
          aria-label={`${capacity.reserved} of ${capacity.total} spots filled`}
        >
          <div
            style={{
              width: `${percentFull}%`,
              height: '100%',
              backgroundColor: getCapacityColor(),
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      )}
    </div>
  );
};
```

---

## 5. EventPricing

### Purpose

Display event pricing with early bird discount if applicable.

### Props interface

```typescript
export interface EventPricingProps {
  /**
   * Pricing data
   */
  pricing: EventPricing;

  /**
   * Whether to show early bird pricing
   */
  showEarlyBird?: boolean;

  /**
   * Whether to show icon
   */
  showIcon?: boolean;

  /**
   * Compact display
   */
  compact?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;
}
```

### Implementation

```typescript
export const EventPricing: React.FC<EventPricingProps> = ({
  pricing,
  showEarlyBird = true,
  showIcon = true,
  compact = true,
  className = '',
}) => {
  const getPriceDisplay = () => {
    if (pricing.type === 'free') {
      return {
        primary: 'Free',
        secondary: null,
        color: '#2E7D32',
      };
    }

    if (pricing.type === 'donation') {
      return {
        primary: 'Donation',
        secondary: '(Suggested donation)',
        color: '#1565C0',
      };
    }

    // Paid event
    const regularPrice = formatPrice(pricing.amount || 0, pricing.currency);

    // Check early bird pricing
    if (
      showEarlyBird &&
      pricing.earlyBirdPricing &&
      new Date(pricing.earlyBirdPricing.validUntil) > new Date()
    ) {
      const earlyPrice = formatPrice(
        pricing.earlyBirdPricing.amount,
        pricing.currency
      );
      const deadline = new Date(pricing.earlyBirdPricing.validUntil);
      const deadlineStr = deadline.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });

      return {
        primary: earlyPrice,
        secondary: `Early bird until ${deadlineStr}`,
        strikethrough: regularPrice,
        color: '#E65100',
      };
    }

    return {
      primary: regularPrice,
      secondary: null,
      color: '#0205B7',
    };
  };

  const display = getPriceDisplay();

  return (
    <div
      className={`event-pricing ${compact ? 'compact' : ''} ${className}`}
      style={{
        display: 'flex',
        alignItems: compact ? 'center' : 'flex-start',
        gap: '8px',
        fontFamily: 'Neue Montreal, sans-serif',
        fontSize: '14px',
      }}
    >
      {showIcon && (
        <span
          aria-hidden="true"
          style={{ fontSize: '16px', flexShrink: 0 }}
        >
          💰
        </span>
      )}
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span
            style={{
              fontWeight: 600,
              fontSize: '16px',
              color: display.color,
            }}
          >
            {display.primary}
          </span>
          {display.strikethrough && (
            <span
              style={{
                textDecoration: 'line-through',
                color: '#9E9E9E',
                fontSize: '14px',
              }}
            >
              {display.strikethrough}
            </span>
          )}
        </div>
        {display.secondary && (
          <div
            style={{
              fontSize: '12px',
              color: '#757575',
              marginTop: '2px',
            }}
          >
            {display.secondary}
          </div>
        )}
      </div>
    </div>
  );
};
```

---

## 6. EventGrid

### Purpose

Grid layout wrapper for EventCard components with responsive columns.

### Props interface

```typescript
export interface EventGridProps {
  /**
   * Array of events to display
   */
  events: Event[];

  /**
   * EventCard variant to use
   */
  cardVariant?: "grid" | "list" | "featured";

  /**
   * Number of columns (responsive)
   * - default: { sm: 1, md: 2, lg: 3, xl: 4 }
   */
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };

  /**
   * Gap between cards (in pixels)
   */
  gap?: number;

  /**
   * Whether to show loading skeletons
   */
  loading?: boolean;

  /**
   * Number of skeleton cards to show
   */
  skeletonCount?: number;

  /**
   * Empty state message
   */
  emptyMessage?: string;

  /**
   * Additional CSS classes
   */
  className?: string;
}
```

### Implementation

```typescript
export const EventGrid: React.FC<EventGridProps> = ({
  events,
  cardVariant = 'grid',
  columns = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = 32,
  loading = false,
  skeletonCount = 6,
  emptyMessage = 'No events found',
  className = '',
}) => {
  const getGridColumns = () => {
    return {
      gridTemplateColumns: {
        base: `repeat(${columns.sm || 1}, 1fr)`,
        sm: `repeat(${columns.sm || 1}, 1fr)`,
        md: `repeat(${columns.md || 2}, 1fr)`,
        lg: `repeat(${columns.lg || 3}, 1fr)`,
        xl: `repeat(${columns.xl || 4}, 1fr)`,
      },
    };
  };

  if (loading) {
    return (
      <div
        className={`event-grid loading ${className}`}
        style={{
          display: 'grid',
          gap: `${gap}px`,
          ...getGridColumns(),
        }}
      >
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <EventCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div
        className="event-grid-empty"
        style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#757575',
          fontFamily: 'Neue Montreal, sans-serif',
        }}
      >
        <p style={{ fontSize: '18px', marginBottom: '12px' }}>
          {emptyMessage}
        </p>
        <p style={{ fontSize: '14px' }}>
          Try adjusting your filters or check back later for new events.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`event-grid ${className}`}
      style={{
        display: 'grid',
        gap: `${gap}px`,
        ...getGridColumns(),
      }}
      role="list"
      aria-label="Events list"
    >
      {events.map((event) => (
        <div key={event.id} role="listitem">
          <EventCard event={event} variant={cardVariant} />
        </div>
      ))}
    </div>
  );
};
```

---

## 7. EventCardSkeleton

### Purpose

Loading placeholder for EventCard.

### Implementation

```typescript
export const EventCardSkeleton: React.FC = () => {
  return (
    <div
      className="event-card-skeleton"
      style={{
        position: 'relative',
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }}
    >
      {/* Blue bevel background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#0205B7',
          borderRadius: '20px',
          transform: 'translateY(5px)',
          opacity: 0.1,
        }}
      />

      {/* Card content */}
      <div
        style={{
          position: 'relative',
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          overflow: 'hidden',
        }}
      >
        {/* Image skeleton */}
        <div
          style={{
            width: '100%',
            height: '200px',
            backgroundColor: '#E0E0E0',
          }}
        />

        {/* Content skeleton */}
        <div style={{ padding: '20px' }}>
          {/* Badge */}
          <div
            style={{
              width: '80px',
              height: '24px',
              backgroundColor: '#E0E0E0',
              borderRadius: '12px',
              marginBottom: '12px',
            }}
          />

          {/* Title */}
          <div
            style={{
              width: '100%',
              height: '22px',
              backgroundColor: '#E0E0E0',
              borderRadius: '4px',
              marginBottom: '8px',
            }}
          />

          {/* Metadata items */}
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                width: `${60 + Math.random() * 40}%`,
                height: '16px',
                backgroundColor: '#F5F5F5',
                borderRadius: '4px',
                marginBottom: '8px',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
```

---

## 8. EventsHero

### Purpose

Hero section for the events listing page.

### Props interface

```typescript
export interface EventsHeroProps {
  /**
   * Page title
   */
  title?: string;

  /**
   * Page description
   */
  description?: string;

  /**
   * Background image URL (optional)
   */
  backgroundImage?: string;

  /**
   * Additional CSS classes
   */
  className?: string;
}
```

### Implementation

```typescript
export const EventsHero: React.FC<EventsHeroProps> = ({
  title = 'Events & Workshops',
  description = 'Join our healing community for transformative workshops, sound baths, and special events designed to support your wellness journey.',
  backgroundImage,
  className = '',
}) => {
  return (
    <div
      className={`events-hero ${className}`}
      style={{
        position: 'relative',
        textAlign: 'center',
        paddingTop: '193px',
        paddingBottom: '80px',
        overflow: 'hidden',
      }}
    >
      {/* Background image (optional) */}
      {backgroundImage && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.1,
            zIndex: 0,
          }}
        />
      )}

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '900px',
          margin: '0 auto',
          padding: '0 66px',
        }}
      >
        <h1
          style={{
            fontFamily: 'Figtree, sans-serif',
            fontSize: '63.55px',
            fontWeight: 700,
            color: '#000000',
            marginBottom: '32px',
            lineHeight: 1.2,
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontFamily: 'Neue Montreal, sans-serif',
            fontSize: '20px',
            fontWeight: 400,
            color: '#5E5E5E',
            lineHeight: 1.6,
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
};
```

---

## Testing requirements

### Unit tests for each component

```typescript
describe('EventStatusBadge', () => {
  it('renders available status correctly', () => {
    render(<EventStatusBadge status="available" />);
    expect(screen.getByText('Available')).toBeInTheDocument();
  });

  it('overrides status when isSoldOut is true', () => {
    render(<EventStatusBadge status="available" isSoldOut={true} />);
    expect(screen.getByText('Sold Out')).toBeInTheDocument();
  });

  it('overrides status when isPast is true', () => {
    render(<EventStatusBadge status="available" isPast={true} />);
    expect(screen.getByText('Past Event')).toBeInTheDocument();
  });

  it('has correct ARIA label', () => {
    const { container } = render(<EventStatusBadge status="filling-fast" />);
    const badge = container.querySelector('[role="status"]');
    expect(badge).toHaveAttribute('aria-label', 'Event status: Filling Fast');
  });
});

describe('EventDateTime', () => {
  const startDate = new Date('2025-11-15T18:00:00-08:00');
  const endDate = new Date('2025-11-15T20:00:00-08:00');

  it('formats full date/time correctly', () => {
    render(
      <EventDateTime
        startDateTime={startDate}
        endDateTime={endDate}
        timezone="America/Los_Angeles"
        format="full"
      />
    );
    expect(screen.getByText(/November 15, 2025/)).toBeInTheDocument();
  });

  it('formats short date correctly', () => {
    render(
      <EventDateTime
        startDateTime={startDate}
        endDateTime={endDate}
        timezone="America/Los_Angeles"
        format="short"
      />
    );
    expect(screen.getByText(/Nov 15/)).toBeInTheDocument();
  });

  it('shows icon when showIcon is true', () => {
    const { container } = render(
      <EventDateTime
        startDateTime={startDate}
        endDateTime={endDate}
        timezone="America/Los_Angeles"
        showIcon={true}
      />
    );
    expect(container.textContent).toContain('📅');
  });
});

describe('EventLocation', () => {
  const inPersonLocation: EventLocation = {
    type: 'in-person',
    venue: {
      name: 'Test Venue',
      address: {
        street: '123 Main St',
        city: 'Roy',
        state: 'WA',
        zipCode: '98580',
        country: 'USA',
      },
    },
  };

  it('displays city and state by default', () => {
    render(<EventLocation location={inPersonLocation} />);
    expect(screen.getByText('Roy, WA')).toBeInTheDocument();
  });

  it('displays full address when showFullAddress is true', () => {
    render(
      <EventLocation location={inPersonLocation} showFullAddress={true} />
    );
    expect(screen.getByText(/123 Main St/)).toBeInTheDocument();
  });

  it('displays "Virtual Event" for virtual location', () => {
    render(<EventLocation location={{ type: 'virtual' }} />);
    expect(screen.getByText('Virtual Event')).toBeInTheDocument();
  });

  it('creates link when linkable is true', () => {
    const locationWithMaps = {
      ...inPersonLocation,
      venue: {
        ...inPersonLocation.venue!,
        googleMapsUrl: 'https://maps.google.com/?q=123+Main+St',
      },
    };

    render(<EventLocation location={locationWithMaps} linkable={true} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://maps.google.com/?q=123+Main+St');
  });
});

describe('EventCapacity', () => {
  it('displays spots remaining', () => {
    const capacity: EventCapacity = {
      total: 20,
      reserved: 17,
      waitlist: 0,
    };
    render(<EventCapacity capacity={capacity} />);
    expect(screen.getByText('3 spots left')).toBeInTheDocument();
  });

  it('displays "Sold out" when no spots left', () => {
    const capacity: EventCapacity = {
      total: 20,
      reserved: 20,
      waitlist: 0,
    };
    render(<EventCapacity capacity={capacity} />);
    expect(screen.getByText(/Sold out/)).toBeInTheDocument();
  });

  it('shows progress bar when showProgress is true', () => {
    const capacity: EventCapacity = {
      total: 20,
      reserved: 10,
      waitlist: 0,
    };
    const { container } = render(
      <EventCapacity capacity={capacity} showProgress={true} />
    );
    expect(container.querySelector('[role="progressbar"]')).toBeInTheDocument();
  });
});

describe('EventPricing', () => {
  it('displays "Free" for free events', () => {
    const pricing: EventPricing = {
      type: 'free',
    };
    render(<EventPricing pricing={pricing} />);
    expect(screen.getByText('Free')).toBeInTheDocument();
  });

  it('displays formatted price for paid events', () => {
    const pricing: EventPricing = {
      type: 'paid',
      amount: 9900,
      currency: 'usd',
    };
    render(<EventPricing pricing={pricing} />);
    expect(screen.getByText('$99.00')).toBeInTheDocument();
  });

  it('displays early bird pricing when valid', () => {
    const pricing: EventPricing = {
      type: 'paid',
      amount: 9900,
      currency: 'usd',
      earlyBirdPricing: {
        amount: 7900,
        validUntil: new Date('2099-12-31'),
        stripePriceId: 'price_123',
      },
    };
    render(<EventPricing pricing={pricing} showEarlyBird={true} />);
    expect(screen.getByText('$79.00')).toBeInTheDocument();
    expect(screen.getByText(/Early bird/)).toBeInTheDocument();
  });
});

describe('EventGrid', () => {
  const mockEvents = [
    createMockEvent({ id: '1', title: 'Event 1' }),
    createMockEvent({ id: '2', title: 'Event 2' }),
  ];

  it('renders event cards', () => {
    render(<EventGrid events={mockEvents} />);
    expect(screen.getByText('Event 1')).toBeInTheDocument();
    expect(screen.getByText('Event 2')).toBeInTheDocument();
  });

  it('shows loading skeletons when loading', () => {
    const { container } = render(
      <EventGrid events={[]} loading={true} skeletonCount={3} />
    );
    expect(container.querySelectorAll('.event-card-skeleton')).toHaveLength(3);
  });

  it('shows empty state when no events', () => {
    render(<EventGrid events={[]} emptyMessage="Custom empty message" />);
    expect(screen.getByText('Custom empty message')).toBeInTheDocument();
  });
});
```

---

## Export structure

```typescript
// /packages/shared-components/src/Event/index.ts
export { EventStatusBadge } from "./EventStatusBadge";
export type { EventStatusBadgeProps } from "./EventStatusBadge";

export { EventDateTime } from "./EventDateTime";
export type { EventDateTimeProps } from "./EventDateTime";

export { EventLocation } from "./EventLocation";
export type { EventLocationProps } from "./EventLocation";

export { EventCapacity } from "./EventCapacity";
export type { EventCapacityProps } from "./EventCapacity";

export { EventPricing } from "./EventPricing";
export type { EventPricingProps } from "./EventPricing";

export { EventGrid } from "./EventGrid";
export type { EventGridProps } from "./EventGrid";

export { EventCardSkeleton } from "./EventCardSkeleton";

export { EventsHero } from "./EventsHero";
export type { EventsHeroProps } from "./EventsHero";
```

---

## Implementation checklist

- [ ] Create EventStatusBadge component
- [ ] Create EventDateTime component
- [ ] Create EventLocation component
- [ ] Create EventCapacity component
- [ ] Create EventPricing component
- [ ] Create EventGrid component
- [ ] Create EventCardSkeleton component
- [ ] Create EventsHero component
- [ ] Write unit tests for each (95%+ coverage)
- [ ] Test accessibility compliance
- [ ] Document in Storybook
- [ ] Export all from index.ts

---

**Status**: ✅ Specification complete
**Ready for**: Implementation
**Estimated effort**: 3-4 days for all supporting components
