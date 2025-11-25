# EventCard component specification

**Component**: EventCard
**Purpose**: Display individual event information in grid or list views
**Phase**: Phase 1 (MVP)
**Status**: New component

---

## Overview

EventCard is the primary component for displaying event information in the events listing page. It adapts the bevel card effect from ServicesSection and adds event-specific metadata displays.

---

## Props interface

```typescript
export interface EventCardProps {
  /**
   * Complete event data object
   */
  event: Event;

  /**
   * Display variant
   * - grid: Compact card for grid layouts (default)
   * - list: Horizontal layout for list views
   * - featured: Larger card with more details
   */
  variant?: "grid" | "list" | "featured";

  /**
   * Optional click handler (if not using Link)
   */
  onClick?: (event: Event) => void;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Whether to show all metadata or abbreviated version
   */
  showFullDetails?: boolean;
}
```

---

## Visual states

### 1. Default state

```
┌─────────────────────────┐
│  [Featured Image]       │
│                         │
├─────────────────────────┤
│ [Status Badge]          │
│                         │
│ Event Title             │
│                         │
│ 📅 Sat, Nov 15 • 2-4 PM│
│ 📍 In-Person, Roy WA    │
│ 👥 3 spots left         │
│ 💰 $99 (Early: $79)     │
└─────────────────────────┘
```

### 2. Hover state

- Card translates up by 8px
- Blue shadow intensifies
- Gradient overlay fades in over image
- Cursor changes to pointer

### 3. Sold out state

- Grayscale filter on image
- Red "SOLD OUT" badge
- Reduced opacity (0.7)
- No hover effect
- Cursor: not-allowed

### 4. Past event state

- Reduced opacity (0.6)
- "PAST EVENT" badge
- No hover effect
- Optional: Strike-through on price

### 5. Loading skeleton

- Gray rectangles animated with pulse
- Matches card dimensions
- No interactive states

---

## Component structure

```typescript
export const EventCard: React.FC<EventCardProps> = ({
  event,
  variant = 'grid',
  onClick,
  className = '',
  showFullDetails = false,
}) => {
  const isPast = new Date(event.startDateTime) < new Date();
  const isSoldOut = event.availabilityStatus === 'sold-out' ||
                    event.capacity.reserved >= event.capacity.total;
  const isInteractive = !isPast && !isSoldOut;

  const handleClick = (e: React.MouseEvent) => {
    if (!isInteractive) {
      e.preventDefault();
      return;
    }
    onClick?.(event);
  };

  return (
    <div className={`event-card group ${variant} ${className}`}>
      {/* Blue bevel background */}
      <div className="bevel-background" />

      {/* Card content */}
      <Link
        to={`/events/${event.slug}`}
        onClick={handleClick}
        className={`card-link ${!isInteractive ? 'disabled' : ''}`}
      >
        {/* Featured image */}
        <div className="image-container">
          <LazyImage
            src={event.featuredImage.image}
            alt={event.featuredImage.alt}
            className={isSoldOut || isPast ? 'grayscale' : ''}
          />

          {/* Gradient overlay on hover */}
          <div className="gradient-overlay" />
        </div>

        {/* Event metadata */}
        <div className="event-content">
          {/* Status badge */}
          <EventStatusBadge
            status={event.availabilityStatus}
            isSoldOut={isSoldOut}
            isPast={isPast}
          />

          {/* Title */}
          <h3 className="event-title">{event.title}</h3>

          {/* Subtitle (optional) */}
          {event.subtitle && (
            <p className="event-subtitle">{event.subtitle}</p>
          )}

          {/* Metadata grid */}
          <div className="metadata-grid">
            <EventDateTime
              startDateTime={event.startDateTime}
              endDateTime={event.endDateTime}
              timezone={event.timezone}
              compact={!showFullDetails}
            />

            <EventLocation
              location={event.location}
              compact={!showFullDetails}
            />

            <EventCapacity
              capacity={event.capacity}
              showProgress={showFullDetails}
            />

            <EventPricing
              pricing={event.pricing}
              showEarlyBird={true}
            />
          </div>

          {/* Category/Tags (if showFullDetails) */}
          {showFullDetails && (
            <div className="tags-container">
              {event.tags.slice(0, 3).map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};
```

---

## Styling specifications

### Grid variant (default)

```typescript
// Container
.event-card {
  position: relative;
  transition: all 0.3s ease;
}

.event-card:hover {
  transform: translateY(-8px);
}

// Bevel background
.bevel-background {
  position: absolute;
  inset: 0;
  background-color: #0205B7;
  border-radius: 20px;
  transform: translateY(5px);
  z-index: 0;
}

// Card link
.card-link {
  display: block;
  position: relative;
  background-color: #FFFFFF;
  border-radius: 20px;
  box-shadow: 0px 42px 32.5px -13px rgba(2, 5, 183, 0.25);
  overflow: hidden;
  z-index: 1;
}

.card-link:hover {
  box-shadow: 0px 42px 40px -10px rgba(2, 5, 183, 0.35);
}

.card-link.disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

// Image container
.image-container {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: filter 0.3s;
}

.image-container img.grayscale {
  filter: grayscale(100%);
}

// Gradient overlay
.gradient-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #0205B7 0%, rgba(99, 213, 249, 1) 100%);
  opacity: 0;
  transition: opacity 0.3s;
}

.event-card:hover .gradient-overlay {
  opacity: 0.2;
}

// Event content
.event-content {
  padding: 20px;
}

// Title
.event-title {
  font-family: "Figtree, Helvetica, sans-serif";
  font-size: 22px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 8px;
  line-height: 1.3;
}

.event-subtitle {
  font-family: "Neue Montreal, sans-serif";
  font-size: 14px;
  color: #5E5E5E;
  margin-bottom: 12px;
}

// Metadata grid
.metadata-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
}

// Tags
.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.tag {
  font-family: "Neue Montreal, sans-serif";
  font-size: 12px;
  padding: 4px 12px;
  background-color: #F0F0F0;
  border-radius: 12px;
  color: #5E5E5E;
}
```

### List variant

```typescript
// Horizontal layout
.event-card.list {
  // Override grid styles for horizontal layout
}

.event-card.list .card-link {
  display: flex;
  flex-direction: row;
}

.event-card.list .image-container {
  width: 300px;
  height: 200px;
  flex-shrink: 0;
}

.event-card.list .event-content {
  flex: 1;
  padding: 24px;
}

.event-card.list .metadata-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
```

### Featured variant

```typescript
// Larger card with more details
.event-card.featured {
  // Larger dimensions
}

.event-card.featured .image-container {
  height: 300px;
}

.event-card.featured .event-content {
  padding: 32px;
}

.event-card.featured .event-title {
  font-size: 32px;
}
```

---

## Accessibility requirements

### Semantic HTML

```typescript
<article
  className="event-card"
  role="article"
  aria-label={`Event: ${event.title}`}
>
  <Link
    to={`/events/${event.slug}`}
    aria-label={`View details for ${event.title}`}
    aria-disabled={!isInteractive}
  >
    <div className="image-container" role="img" aria-label={event.featuredImage.alt}>
      {/* Image */}
    </div>

    <div className="event-content">
      <h3 id={`event-title-${event.id}`}>
        {event.title}
      </h3>

      <div role="list" aria-label="Event details">
        <div role="listitem" aria-label={`Date: ${formattedDate}`}>
          <EventDateTime />
        </div>
        {/* Other metadata */}
      </div>
    </div>
  </Link>
</article>
```

### ARIA labels

- Card: `aria-label="Event: {title}"`
- Link: `aria-label="View details for {title}"`
- Image: Use `alt` from `featuredImage.alt`
- Status badge: `aria-label="Status: Available"` / "Sold out" / "Past event"
- Capacity: `aria-label="3 spots remaining out of 20"`

### Keyboard navigation

- Card is focusable via Link
- Enter/Space triggers navigation
- Tab order: Card → (next card)
- Disabled cards: `tabindex="-1"`, `aria-disabled="true"`

### Screen reader announcements

```typescript
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {event.title}, {formattedDate}, {location}, {spotsLeft} spots left, {price}
</div>
```

---

## Performance considerations

### Image optimization

```typescript
<LazyImage
  src={event.featuredImage.image}
  alt={event.featuredImage.alt}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  loading="lazy"
  decoding="async"
/>
```

- Use lazy loading for images below fold
- Provide appropriate sizes attribute
- Async decoding to avoid blocking render

### Memoization

```typescript
export const EventCard = React.memo<EventCardProps>(
  ({ event, variant, onClick, className, showFullDetails }) => {
    // Component implementation
  },
  (prevProps, nextProps) => {
    // Custom comparison for expensive re-renders
    return (
      prevProps.event.id === nextProps.event.id &&
      prevProps.event.updatedAt === nextProps.event.updatedAt &&
      prevProps.variant === nextProps.variant
    );
  }
);
```

### Virtualization

If displaying 50+ events, use react-window or react-virtualized:

```typescript
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={800}
  itemCount={events.length}
  itemSize={350}
>
  {({ index, style }) => (
    <div style={style}>
      <EventCard event={events[index]} />
    </div>
  )}
</FixedSizeList>
```

---

## Dependencies

### From shared-utils

```typescript
import {
  Event,
  isSoldOut,
  getSpotsRemaining,
  getActivePrice,
  formatPrice,
} from "@reiki-goddess/shared-utils";
```

### From shared-components

```typescript
import { LazyImage } from "../LazyImage";
import { EventStatusBadge } from "../EventStatusBadge";
import { EventDateTime } from "../EventDateTime";
import { EventLocation } from "../EventLocation";
import { EventCapacity } from "../EventCapacity";
import { EventPricing } from "../EventPricing";
```

### From design-system

```typescript
import { colors } from "@reiki-goddess/design-system";
```

### From react-router

```typescript
import { Link } from "react-router-dom";
```

---

## Test requirements

### Unit tests

```typescript
// EventCard.test.tsx
describe('EventCard', () => {
  const mockEvent = createMockEvent({
    title: 'Test Event',
    startDateTime: new Date('2025-11-15T18:00:00Z'),
    availabilityStatus: 'available',
    capacity: { total: 20, reserved: 17, waitlist: 5 },
    pricing: { type: 'paid', amount: 9900, currency: 'usd' },
  });

  it('renders event title and subtitle', () => {
    render(<EventCard event={mockEvent} />);
    expect(screen.getByText('Test Event')).toBeInTheDocument();
  });

  it('displays status badge correctly', () => {
    render(<EventCard event={mockEvent} />);
    expect(screen.getByText(/filling fast/i)).toBeInTheDocument();
  });

  it('shows early bird pricing when valid', () => {
    const eventWithEarlyBird = createMockEvent({
      pricing: {
        type: 'paid',
        amount: 9900,
        currency: 'usd',
        earlyBirdPricing: {
          amount: 7900,
          validUntil: new Date('2025-12-31'),
          stripePriceId: 'price_123',
        },
      },
    });

    render(<EventCard event={eventWithEarlyBird} />);
    expect(screen.getByText(/\$79/)).toBeInTheDocument();
    expect(screen.getByText(/early/i)).toBeInTheDocument();
  });

  it('navigates to detail page on click', () => {
    render(
      <MemoryRouter>
        <EventCard event={mockEvent} />
      </MemoryRouter>
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/events/${mockEvent.slug}`);
  });

  it('displays sold out state correctly', () => {
    const soldOutEvent = createMockEvent({
      availabilityStatus: 'sold-out',
      capacity: { total: 20, reserved: 20, waitlist: 0 },
    });

    render(<EventCard event={soldOutEvent} />);
    expect(screen.getByText(/sold out/i)).toBeInTheDocument();

    // Image should have grayscale
    const image = screen.getByRole('img');
    expect(image).toHaveClass('grayscale');

    // Card should not be hoverable
    const link = screen.getByRole('link');
    expect(link).toHaveClass('disabled');
  });

  it('displays past event state correctly', () => {
    const pastEvent = createMockEvent({
      startDateTime: new Date('2020-01-01'),
    });

    render(<EventCard event={pastEvent} />);
    expect(screen.getByText(/past event/i)).toBeInTheDocument();
  });

  it('handles missing optional data gracefully', () => {
    const minimalEvent = createMockEvent({
      subtitle: undefined,
      tags: [],
    });

    render(<EventCard event={minimalEvent} />);
    expect(screen.queryByText('Subtitle')).not.toBeInTheDocument();
  });

  it('applies hover effect on interactive cards', () => {
    const { container } = render(<EventCard event={mockEvent} />);
    const card = container.querySelector('.event-card');

    fireEvent.mouseEnter(card);
    expect(card).toHaveClass('group');
  });

  it('meets accessibility requirements', () => {
    const { container } = render(<EventCard event={mockEvent} />);

    // Has semantic article tag
    expect(container.querySelector('article')).toBeInTheDocument();

    // Has aria-label
    const article = screen.getByRole('article');
    expect(article).toHaveAttribute('aria-label');

    // Link has aria-label
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('aria-label');

    // Image has alt text
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('alt');
  });

  it('renders list variant correctly', () => {
    const { container } = render(
      <EventCard event={mockEvent} variant="list" />
    );
    expect(container.querySelector('.list')).toBeInTheDocument();
  });

  it('renders featured variant correctly', () => {
    const { container } = render(
      <EventCard event={mockEvent} variant="featured" />
    );
    expect(container.querySelector('.featured')).toBeInTheDocument();
  });

  it('calls onClick handler when provided', () => {
    const handleClick = vi.fn();
    render(
      <MemoryRouter>
        <EventCard event={mockEvent} onClick={handleClick} />
      </MemoryRouter>
    );

    const link = screen.getByRole('link');
    fireEvent.click(link);

    expect(handleClick).toHaveBeenCalledWith(mockEvent);
  });

  it('prevents click on disabled cards', () => {
    const handleClick = vi.fn();
    const soldOutEvent = createMockEvent({
      availabilityStatus: 'sold-out',
    });

    render(
      <MemoryRouter>
        <EventCard event={soldOutEvent} onClick={handleClick} />
      </MemoryRouter>
    );

    const link = screen.getByRole('link');
    fireEvent.click(link);

    expect(handleClick).not.toHaveBeenCalled();
  });
});
```

### Visual regression tests

```typescript
it('matches snapshot for grid variant', () => {
  const { container } = render(<EventCard event={mockEvent} variant="grid" />);
  expect(container).toMatchSnapshot();
});

it('matches snapshot for sold out state', () => {
  const soldOutEvent = createMockEvent({ availabilityStatus: 'sold-out' });
  const { container } = render(<EventCard event={soldOutEvent} />);
  expect(container).toMatchSnapshot();
});
```

---

## Implementation checklist

- [ ] Create EventCard.tsx component file
- [ ] Create EventCard.types.ts with interfaces
- [ ] Implement grid variant
- [ ] Implement list variant
- [ ] Implement featured variant
- [ ] Add bevel effect styling
- [ ] Add gradient hover overlay
- [ ] Integrate EventStatusBadge
- [ ] Integrate EventDateTime
- [ ] Integrate EventLocation
- [ ] Integrate EventCapacity
- [ ] Integrate EventPricing
- [ ] Add sold out state
- [ ] Add past event state
- [ ] Add loading skeleton
- [ ] Implement accessibility features
- [ ] Add memoization
- [ ] Write unit tests (95%+ coverage)
- [ ] Write visual regression tests
- [ ] Test keyboard navigation
- [ ] Test screen reader compatibility
- [ ] Document in Storybook
- [ ] Export from index.ts

---

## Related components

- [EventGrid.md](./EventGrid.md) - Container for EventCard
- [EventStatusBadge.md](./EventStatusBadge.md) - Status indicator
- [EventDateTime.md](./EventDateTime.md) - Date/time display
- [EventLocation.md](./EventLocation.md) - Location display
- [EventCapacity.md](./EventCapacity.md) - Capacity display
- [EventPricing.md](./EventPricing.md) - Pricing display

---

**Status**: ✅ Specification complete
**Ready for**: Implementation
**Estimated effort**: 2-3 days
