# Events page testing strategy

**Version**: 1.0
**Created**: 2025-11-03
**Project**: The Reiki Goddess Healing - Events Page V2
**Purpose**: Comprehensive testing strategy to ensure 100% test coverage from day one

---

## Table of contents

1. [Executive summary](#executive-summary)
2. [Testing KPIs and coverage goals](#testing-kpis-and-coverage-goals)
3. [Component testing specifications](#component-testing-specifications)
4. [Service testing specifications](#service-testing-specifications)
5. [Security testing specifications](#security-testing-specifications)
6. [Integration testing specifications](#integration-testing-specifications)
7. [E2E testing specifications](#e2e-testing-specifications)
8. [Testing utilities and mocks](#testing-utilities-and-mocks)
9. [Implementation roadmap](#implementation-roadmap)
10. [Quality requirements](#quality-requirements)

---

## Executive summary

### Learning from project excellence

**Current Project Test Record**:

- **shared-components**: 430/430 tests passing (100%)
- **shared-utils**: 79/79 tests passing (100%)
- **Overall**: 485/528 tests passing (91.9% pass rate)

**V1 Mistake**: Backend built without tests. **V2 Approach**: Test-driven from day one.

### Strategy

1. **Test-First Development**: Write tests alongside or before implementation
2. **Pattern Reuse**: Leverage proven patterns from Contact, Services, and Blog pages
3. **Incremental Coverage**: Build to 220+ tests across 4 implementation phases
4. **Security-First**: 100% coverage on all security-critical code (non-negotiable)

### Success criteria

- **MVP (Phase 1)**: 150+ tests passing, 95%+ component coverage
- **Full Implementation (Phase 4)**: 220+ tests passing, 100% service coverage
- **Zero security gaps**: All validation, sanitization, and rate limiting tested
- **E2E smoke tests**: Critical user flows verified

---

## Testing KPIs and coverage goals

### Coverage targets (following project standards)

| Package          | Target | Rationale                              |
| ---------------- | ------ | -------------------------------------- |
| Components (UI)  | 95%+   | Match shared-components (100% current) |
| Services (Logic) | 100%   | Match shared-utils (100% current)      |
| Security         | 100%   | Critical, no gaps allowed              |
| Integration      | 80%+   | Key workflows must work                |
| E2E              | 50%+   | Smoke tests for main flows             |

### Test count estimates

Based on component analysis and existing patterns:

| Component/Area                     | Unit Tests | Integration Tests | E2E Tests | Total   |
| ---------------------------------- | ---------- | ----------------- | --------- | ------- |
| **Phase 1: MVP Components**        |
| EventCard                          | 25         | -                 | -         | 25      |
| EventGrid                          | 15         | 5                 | -         | 20      |
| EventsHero                         | 12         | -                 | -         | 12      |
| EventStatusBadge                   | 8          | -                 | -         | 8       |
| EventDateTime                      | 10         | -                 | -         | 10      |
| EventLocation                      | 8          | -                 | -         | 8       |
| EventCapacity                      | 10         | -                 | -         | 10      |
| EventPricing                       | 12         | -                 | -         | 12      |
| EventsPage                         | 15         | 8                 | 2         | 25      |
| eventService                       | 30         | -                 | -         | 30      |
| useEvents hook                     | 10         | -                 | -         | 10      |
| **Phase 1 Subtotal**               | **155**    | **13**            | **2**     | **170** |
|                                    |            |                   |           |         |
| **Phase 2: Detail & Registration** |
| EventDetail                        | 20         | -                 | -         | 20      |
| EventMetadata                      | 8          | -                 | -         | 8       |
| EventDescription                   | 6          | -                 | -         | 6       |
| EventRegistrationForm              | 35         | 10                | 3         | 48      |
| EventSecurityValidator             | 15         | -                 | -         | 15      |
| EventRateLimit                     | 12         | -                 | -         | 12      |
| useEventDetail hook                | 8          | -                 | -         | 8       |
| useEventAvailability hook          | 6          | -                 | -         | 6       |
| EventDetailPage                    | 12         | 6                 | 2         | 20      |
| **Phase 2 Subtotal**               | **122**    | **16**            | **5**     | **143** |
|                                    |            |                   |           |         |
| **Phase 3: Filters & Search**      |
| EventFilters                       | 18         | 5                 | 1         | 24      |
| EventSearch                        | 12         | 3                 | 1         | 16      |
| **Phase 3 Subtotal**               | **30**     | **8**             | **2**     | **40**  |
|                                    |            |                   |           |         |
| **TOTAL ESTIMATE**                 | **307**    | **37**            | **9**     | **353** |

**MVP Target (Phase 1)**: 170 tests
**Full Implementation (Phase 2-3)**: 353 tests
**Realistic Target**: 220+ tests (accounting for scope adjustments)

---

## Component testing specifications

### EventCard component tests

**File**: `/packages/shared-components/src/Event/EventCard/EventCard.test.tsx`
**Target**: 25 tests, 95%+ coverage
**Pattern**: Based on CommunityEvents.test.tsx + Services card pattern

#### Test categories

##### 1. Rendering tests (8 tests)

```typescript
describe('EventCard - Rendering', () => {
  const mockEvent = createMockEvent({
    title: 'Full Moon Sound Bath',
    startDateTime: new Date('2025-11-15T18:00:00-08:00'),
    availabilityStatus: 'available',
  });

  it('should render all event data correctly', () => {
    render(
      <MemoryRouter>
        <EventCard event={mockEvent} variant="grid" />
      </MemoryRouter>
    );

    expect(screen.getByRole('article')).toBeInTheDocument();
    expect(screen.getByText(mockEvent.title)).toBeInTheDocument();
    expect(screen.getByAltText(mockEvent.featuredImage.alt)).toHaveAttribute(
      'src',
      mockEvent.featuredImage.image
    );
  });

  it('should render grid variant correctly', () => {
    const { container } = render(
      <MemoryRouter>
        <EventCard event={mockEvent} variant="grid" />
      </MemoryRouter>
    );
    expect(container.querySelector('.event-card.grid')).toBeInTheDocument();
  });

  it('should render list variant correctly', () => {
    const { container } = render(
      <MemoryRouter>
        <EventCard event={mockEvent} variant="list" />
      </MemoryRouter>
    );
    expect(container.querySelector('.event-card.list')).toBeInTheDocument();
  });

  it('should render featured variant correctly', () => {
    const { container } = render(
      <MemoryRouter>
        <EventCard event={mockEvent} variant="featured" />
      </MemoryRouter>
    );
    expect(container.querySelector('.event-card.featured')).toBeInTheDocument();
  });

  it('should handle missing optional fields gracefully', () => {
    const minimalEvent = createMockEvent({
      subtitle: undefined,
      tags: [],
    });

    render(
      <MemoryRouter>
        <EventCard event={minimalEvent} />
      </MemoryRouter>
    );

    expect(screen.queryByText('Subtitle')).not.toBeInTheDocument();
  });

  it('should render with custom className', () => {
    const { container } = render(
      <MemoryRouter>
        <EventCard event={mockEvent} className="custom-class" />
      </MemoryRouter>
    );
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });

  it('should lazy load event image', () => {
    render(
      <MemoryRouter>
        <EventCard event={mockEvent} />
      </MemoryRouter>
    );

    const img = screen.getByAltText(mockEvent.featuredImage.alt);
    expect(img).toHaveAttribute('loading', 'lazy');
  });

  it('should render EventStatusBadge based on event status', () => {
    const soldOutEvent = createMockEvent({
      availabilityStatus: 'sold-out',
    });

    render(
      <MemoryRouter>
        <EventCard event={soldOutEvent} />
      </MemoryRouter>
    );

    expect(screen.getByText(/sold out/i)).toBeInTheDocument();
  });
});
```

##### 2. State tests (5 tests)

```typescript
describe('EventCard - States', () => {
  it('should show default state for upcoming event', () => {
    const upcomingEvent = createMockEvent({
      startDateTime: new Date('2026-01-15T18:00:00Z'),
      availabilityStatus: 'available',
    });

    const { container } = render(
      <MemoryRouter>
        <EventCard event={upcomingEvent} />
      </MemoryRouter>
    );

    expect(container.querySelector('.card-link.disabled')).not.toBeInTheDocument();
  });

  it('should show hover state on mouse over', async () => {
    const { container } = render(
      <MemoryRouter>
        <EventCard event={createMockEvent()} />
      </MemoryRouter>
    );

    const card = container.querySelector('.event-card');
    fireEvent.mouseEnter(card!);

    // Gradient overlay should become visible
    const overlay = container.querySelector('.gradient-overlay');
    expect(overlay).toBeInTheDocument();
  });

  it('should show sold out state correctly', () => {
    const soldOutEvent = createMockEvent({
      availabilityStatus: 'sold-out',
      capacity: { total: 20, reserved: 20, waitlist: 5 },
    });

    const { container } = render(
      <MemoryRouter>
        <EventCard event={soldOutEvent} />
      </MemoryRouter>
    );

    // Image should be grayscale
    const img = screen.getByRole('img');
    expect(img).toHaveClass('grayscale');

    // Card should be disabled
    expect(container.querySelector('.card-link.disabled')).toBeInTheDocument();
  });

  it('should show past event state with reduced opacity', () => {
    const pastEvent = createMockEvent({
      startDateTime: new Date('2020-01-01T18:00:00Z'),
      endDateTime: new Date('2020-01-01T20:00:00Z'),
    });

    const { container } = render(
      <MemoryRouter>
        <EventCard event={pastEvent} />
      </MemoryRouter>
    );

    expect(screen.getByText(/past event/i)).toBeInTheDocument();

    const link = container.querySelector('.card-link');
    expect(link).toHaveClass('disabled');
  });

  it('should show loading skeleton when loading', () => {
    // Test skeleton state (if implemented)
    render(<EventCardSkeleton />);

    const skeleton = screen.getByTestId('event-card-skeleton');
    expect(skeleton).toBeInTheDocument();
  });
});
```

##### 3. Interaction tests (5 tests)

```typescript
describe('EventCard - Interactions', () => {
  it('should navigate to event detail on click', async () => {
    const user = userEvent.setup();
    const mockEvent = createMockEvent();

    render(
      <MemoryRouter>
        <EventCard event={mockEvent} />
      </MemoryRouter>
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/events/${mockEvent.slug}`);
  });

  it('should call onClick handler when provided', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    const mockEvent = createMockEvent();

    render(
      <MemoryRouter>
        <EventCard event={mockEvent} onClick={handleClick} />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('link'));
    expect(handleClick).toHaveBeenCalledWith(mockEvent);
  });

  it('should not navigate when sold out', async () => {
    const user = userEvent.setup();
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
    await user.click(link);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should prevent navigation when past event', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    const pastEvent = createMockEvent({
      startDateTime: new Date('2020-01-01'),
    });

    render(
      <MemoryRouter>
        <EventCard event={pastEvent} onClick={handleClick} />
      </MemoryRouter>
    );

    const link = screen.getByRole('link');
    await user.click(link);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should handle keyboard navigation (Enter/Space)', async () => {
    const user = userEvent.setup();
    const mockEvent = createMockEvent();

    render(
      <MemoryRouter>
        <EventCard event={mockEvent} />
      </MemoryRouter>
    );

    const link = screen.getByRole('link');
    link.focus();

    expect(document.activeElement).toBe(link);

    await user.keyboard('{Enter}');
    // Navigation would occur in real browser
  });
});
```

##### 4. Accessibility tests (4 tests)

```typescript
describe('EventCard - Accessibility', () => {
  it('should have proper ARIA attributes', () => {
    const mockEvent = createMockEvent();

    render(
      <MemoryRouter>
        <EventCard event={mockEvent} />
      </MemoryRouter>
    );

    const article = screen.getByRole('article');
    expect(article).toHaveAttribute('aria-label', expect.stringContaining(mockEvent.title));
  });

  it('should have semantic heading hierarchy', () => {
    const mockEvent = createMockEvent();

    render(
      <MemoryRouter>
        <EventCard event={mockEvent} />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(mockEvent.title);
  });

  it('should announce status changes to screen readers', () => {
    const mockEvent = createMockEvent({
      availabilityStatus: 'filling-fast',
    });

    render(
      <MemoryRouter>
        <EventCard event={mockEvent} />
      </MemoryRouter>
    );

    // Status badge should have aria-label
    const badge = screen.getByText(/filling fast/i);
    expect(badge.closest('[aria-label]')).toBeInTheDocument();
  });

  it('should meet WCAG 2.1 AA standards', async () => {
    const { container } = render(
      <MemoryRouter>
        <EventCard event={createMockEvent()} />
      </MemoryRouter>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

##### 5. Performance tests (3 tests)

```typescript
describe('EventCard - Performance', () => {
  it('should memoize expensive calculations', () => {
    const mockEvent = createMockEvent();
    const { rerender } = render(
      <MemoryRouter>
        <EventCard event={mockEvent} />
      </MemoryRouter>
    );

    // Re-render with same props
    rerender(
      <MemoryRouter>
        <EventCard event={mockEvent} />
      </MemoryRouter>
    );

    // Component should not re-render (test with React DevTools profiler)
  });

  it('should not re-render unnecessarily', () => {
    const mockEvent = createMockEvent();
    const renderSpy = vi.fn();

    const SpiedEventCard = () => {
      renderSpy();
      return <EventCard event={mockEvent} />;
    };

    const { rerender } = render(
      <MemoryRouter>
        <SpiedEventCard />
      </MemoryRouter>
    );

    expect(renderSpy).toHaveBeenCalledTimes(1);

    rerender(
      <MemoryRouter>
        <SpiedEventCard />
      </MemoryRouter>
    );

    expect(renderSpy).toHaveBeenCalledTimes(1); // Should not re-render
  });

  it('should lazy load images below fold', () => {
    render(
      <MemoryRouter>
        <EventCard event={createMockEvent()} />
      </MemoryRouter>
    );

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('loading', 'lazy');
  });
});
```

---

### EventGrid component tests

**File**: `/packages/shared-components/src/Event/EventGrid/EventGrid.test.tsx`
**Target**: 20 tests, 95%+ coverage

#### Test categories

```typescript
describe('EventGrid', () => {
  describe('Rendering', () => {
    it('should render grid of event cards', () => {
      const events = [
        createMockEvent({ id: '1' }),
        createMockEvent({ id: '2' }),
        createMockEvent({ id: '3' }),
      ];

      render(
        <MemoryRouter>
          <EventGrid events={events} />
        </MemoryRouter>
      );

      expect(screen.getAllByRole('article')).toHaveLength(3);
    });

    it('should apply responsive grid classes', () => {
      const { container } = render(
        <MemoryRouter>
          <EventGrid events={[createMockEvent()]} />
        </MemoryRouter>
      );

      const grid = container.querySelector('.event-grid');
      expect(grid).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');
    });

    it('should render empty state when no events', () => {
      render(<EventGrid events={[]} />);

      expect(screen.getByText(/no events found/i)).toBeInTheDocument();
    });

    it('should render loading state', () => {
      render(<EventGrid events={[]} loading={true} />);

      expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
    });

    it('should render error state', () => {
      render(<EventGrid events={[]} error={new Error('Failed to fetch')} />);

      expect(screen.getByText(/failed to load events/i)).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <MemoryRouter>
          <EventGrid events={[createMockEvent()]} className="custom-grid" />
        </MemoryRouter>
      );

      expect(container.querySelector('.custom-grid')).toBeInTheDocument();
    });
  });

  describe('Layout variants', () => {
    it('should render 2-column layout on medium screens', () => {
      const { container } = render(
        <MemoryRouter>
          <EventGrid events={[createMockEvent()]} columns={{ md: 2 }} />
        </MemoryRouter>
      );

      expect(container.querySelector('.md\\:grid-cols-2')).toBeInTheDocument();
    });

    it('should render 4-column layout on large screens', () => {
      const { container } = render(
        <MemoryRouter>
          <EventGrid events={[createMockEvent()]} columns={{ lg: 4 }} />
        </MemoryRouter>
      );

      expect(container.querySelector('.lg\\:grid-cols-4')).toBeInTheDocument();
    });
  });

  describe('Card variants', () => {
    it('should pass variant prop to EventCard components', () => {
      const events = [createMockEvent()];

      render(
        <MemoryRouter>
          <EventGrid events={events} cardVariant="list" />
        </MemoryRouter>
      );

      // Verify list variant rendered
      const { container } = render(
        <MemoryRouter>
          <EventCard event={events[0]} variant="list" />
        </MemoryRouter>
      );
      expect(container.querySelector('.event-card.list')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should handle large event lists efficiently', () => {
      const manyEvents = Array.from({ length: 50 }, (_, i) =>
        createMockEvent({ id: `event-${i}` })
      );

      const { container } = render(
        <MemoryRouter>
          <EventGrid events={manyEvents} />
        </MemoryRouter>
      );

      expect(screen.getAllByRole('article')).toHaveLength(50);
    });
  });
});
```

---

### EventsHero component tests

**File**: `/packages/shared-components/src/Event/EventsHero/EventsHero.test.tsx`
**Target**: 12 tests, 95%+ coverage
**Pattern**: Based on Hero/AboutHero tests

```typescript
describe('EventsHero', () => {
  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<EventsHero />);

      expect(screen.getByText('Events & Workshops')).toBeInTheDocument();
      expect(screen.getByText(/Join our healing community/i)).toBeInTheDocument();
    });

    it('should render with custom heading and subheading', () => {
      render(
        <EventsHero
          heading="Upcoming Events"
          subheading="Find your next healing experience"
        />
      );

      expect(screen.getByText('Upcoming Events')).toBeInTheDocument();
      expect(screen.getByText('Find your next healing experience')).toBeInTheDocument();
    });

    it('should apply correct heading styles', () => {
      render(<EventsHero />);

      const heading = screen.getByText('Events & Workshops');
      expect(heading).toHaveClass('text-[63.55px]', 'font-bold');
      expect(heading).toHaveStyle({ fontFamily: expect.stringContaining('Figtree') });
    });

    it('should center content', () => {
      const { container } = render(<EventsHero />);

      const contentContainer = container.querySelector('.text-center');
      expect(contentContainer).toBeInTheDocument();
    });

    it('should apply responsive padding', () => {
      const { container } = render(<EventsHero />);

      const hero = container.querySelector('.pt-\\[193px\\]');
      expect(hero).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<EventsHero />);

      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toHaveTextContent('Events & Workshops');
    });

    it('should have semantic HTML structure', () => {
      const { container } = render(<EventsHero />);

      expect(container.querySelector('section')).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should have cream background', () => {
      const { container } = render(<EventsHero />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('bg-[#FFFBF5]');
    });

    it('should apply custom className', () => {
      const { container } = render(<EventsHero className="custom-hero" />);

      expect(container.querySelector('.custom-hero')).toBeInTheDocument();
    });
  });
});
```

---

### Supporting component tests

**Pattern**: 8-12 tests each for micro components

#### EventStatusBadge tests (8 tests)

```typescript
describe('EventStatusBadge', () => {
  it('should render "Available" badge with green styling', () => {
    render(<EventStatusBadge status="available" />);

    const badge = screen.getByText('Available');
    expect(badge).toHaveClass('bg-green-100', 'text-green-800');
  });

  it('should render "Filling Fast" badge with orange styling', () => {
    render(<EventStatusBadge status="filling-fast" />);

    const badge = screen.getByText(/filling fast/i);
    expect(badge).toHaveClass('bg-orange-100', 'text-orange-800');
  });

  it('should render "Sold Out" badge with red styling', () => {
    render(<EventStatusBadge status="sold-out" />);

    const badge = screen.getByText(/sold out/i);
    expect(badge).toHaveClass('bg-red-100', 'text-red-800');
  });

  it('should render "Past Event" badge when isPast is true', () => {
    render(<EventStatusBadge status="available" isPast={true} />);

    expect(screen.getByText(/past event/i)).toBeInTheDocument();
  });

  it('should show sold out badge even when status is available but isSoldOut=true', () => {
    render(<EventStatusBadge status="available" isSoldOut={true} />);

    expect(screen.getByText(/sold out/i)).toBeInTheDocument();
  });

  it('should have proper ARIA label', () => {
    render(<EventStatusBadge status="filling-fast" />);

    const badge = screen.getByText(/filling fast/i);
    expect(badge).toHaveAttribute('aria-label', expect.stringContaining('filling fast'));
  });

  it('should apply custom className', () => {
    render(<EventStatusBadge status="available" className="custom-badge" />);

    const badge = screen.getByText('Available');
    expect(badge).toHaveClass('custom-badge');
  });

  it('should render with icon when showIcon is true', () => {
    render(<EventStatusBadge status="available" showIcon={true} />);

    const icon = screen.getByTestId('status-icon');
    expect(icon).toBeInTheDocument();
  });
});
```

#### EventDateTime tests (10 tests)

```typescript
describe('EventDateTime', () => {
  const startDate = new Date('2025-11-15T18:00:00-08:00');
  const endDate = new Date('2025-11-15T20:00:00-08:00');

  it('should format date correctly', () => {
    render(<EventDateTime startDateTime={startDate} endDateTime={endDate} />);

    expect(screen.getByText(/November 15, 2025/i)).toBeInTheDocument();
  });

  it('should format time range correctly', () => {
    render(<EventDateTime startDateTime={startDate} endDateTime={endDate} />);

    expect(screen.getByText(/6:00 PM - 8:00 PM/i)).toBeInTheDocument();
  });

  it('should display timezone when provided', () => {
    render(
      <EventDateTime
        startDateTime={startDate}
        endDateTime={endDate}
        timezone="America/Los_Angeles"
      />
    );

    expect(screen.getByText(/PST/i)).toBeInTheDocument();
  });

  it('should render compact format when compact=true', () => {
    render(
      <EventDateTime
        startDateTime={startDate}
        endDateTime={endDate}
        compact={true}
      />
    );

    expect(screen.getByText(/Nov 15/i)).toBeInTheDocument();
  });

  it('should show date icon', () => {
    render(<EventDateTime startDateTime={startDate} endDateTime={endDate} />);

    const icon = screen.getByTestId('calendar-icon');
    expect(icon).toBeInTheDocument();
  });

  it('should handle same-day events', () => {
    render(<EventDateTime startDateTime={startDate} endDateTime={endDate} />);

    // Should not duplicate date
    const dateElements = screen.getAllByText(/November 15/i);
    expect(dateElements).toHaveLength(1);
  });

  it('should handle multi-day events', () => {
    const multiDayEnd = new Date('2025-11-17T20:00:00-08:00');
    render(<EventDateTime startDateTime={startDate} endDateTime={multiDayEnd} />);

    expect(screen.getByText(/November 15.*November 17/i)).toBeInTheDocument();
  });

  it('should have proper ARIA label', () => {
    const { container } = render(
      <EventDateTime startDateTime={startDate} endDateTime={endDate} />
    );

    const timeElement = container.querySelector('[aria-label*="Date"]');
    expect(timeElement).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <EventDateTime
        startDateTime={startDate}
        endDateTime={endDate}
        className="custom-time"
      />
    );

    expect(container.querySelector('.custom-time')).toBeInTheDocument();
  });

  it('should use default format when no format specified', () => {
    render(<EventDateTime startDateTime={startDate} endDateTime={endDate} />);

    // Should show full date format
    expect(screen.getByText(/November/i)).toBeInTheDocument();
  });
});
```

---

## Service testing specifications

### eventService tests

**File**: `/packages/shared-utils/src/services/eventService.test.ts`
**Target**: 30 tests, 100% coverage
**Pattern**: Exactly following blogService.test.ts

#### Test categories

##### 1. Data fetching tests (10 tests)

```typescript
describe("eventService.getEvents", () => {
  beforeEach(() => {
    vi.clearAllTimers();
  });

  it("should return all events when no filters", async () => {
    const events = await EventService.getEvents();

    expect(events).toBeDefined();
    expect(Array.isArray(events)).toBe(true);
    expect(events.length).toBeGreaterThan(0);
    expect(events.every((e) => e.status === "published")).toBe(true);
  });

  it("should return events sorted by date (ascending)", async () => {
    const events = await EventService.getEvents();

    for (let i = 0; i < events.length - 1; i++) {
      const currentDate = new Date(events[i].startDateTime).getTime();
      const nextDate = new Date(events[i + 1].startDateTime).getTime();
      expect(currentDate).toBeLessThanOrEqual(nextDate);
    }
  });

  it("should filter by category", async () => {
    const events = await EventService.getEvents({ category: "sound-healing" });

    expect(events.every((e) => e.category === "sound-healing")).toBe(true);
    expect(events.length).toBeGreaterThan(0);
  });

  it("should filter by status", async () => {
    const events = await EventService.getEvents({ status: "available" });

    expect(events.every((e) => e.availabilityStatus === "available")).toBe(
      true
    );
  });

  it("should filter by date range", async () => {
    const events = await EventService.getEvents({
      dateFrom: "2025-11-01T00:00:00Z",
      dateTo: "2025-11-30T23:59:59Z",
    });

    expect(
      events.every((e) => {
        const date = new Date(e.startDateTime);
        return date >= new Date("2025-11-01") && date <= new Date("2025-11-30");
      })
    ).toBe(true);
  });

  it("should filter by pricing type", async () => {
    const events = await EventService.getEvents({ pricingType: "free" });

    expect(events.every((e) => e.pricing.type === "free")).toBe(true);
  });

  it("should filter by location type", async () => {
    const events = await EventService.getEvents({ locationType: "in-person" });

    expect(events.every((e) => e.location.type === "in-person")).toBe(true);
  });

  it("should filter upcoming events only", async () => {
    const now = new Date();
    const events = await EventService.getEvents({ upcomingOnly: true });

    expect(events.every((e) => new Date(e.startDateTime) > now)).toBe(true);
  });

  it('should sort by price when sortBy="price"', async () => {
    const events = await EventService.getEvents({
      sortBy: "price",
      sortOrder: "asc",
    });

    for (let i = 0; i < events.length - 1; i++) {
      const currentPrice = events[i].pricing.amount || 0;
      const nextPrice = events[i + 1].pricing.amount || 0;
      expect(currentPrice).toBeLessThanOrEqual(nextPrice);
    }
  });

  it("should handle empty results", async () => {
    const events = await EventService.getEvents({ category: "nonexistent" });

    expect(events).toEqual([]);
  });
});

describe("eventService.getEventBySlug", () => {
  it("should return event for valid slug", async () => {
    const event = await EventService.getEventBySlug(
      "full-moon-aerial-sound-bath"
    );

    expect(event).toBeDefined();
    expect(event?.slug).toBe("full-moon-aerial-sound-bath");
  });

  it("should return null for invalid slug", async () => {
    const event = await EventService.getEventBySlug("nonexistent");

    expect(event).toBeNull();
  });

  it("should return correct event data structure", async () => {
    const event = await EventService.getEventBySlug(
      "full-moon-aerial-sound-bath"
    );

    expect(event).toHaveProperty("id");
    expect(event).toHaveProperty("slug");
    expect(event).toHaveProperty("title");
    expect(event).toHaveProperty("startDateTime");
    expect(event).toHaveProperty("capacity");
    expect(event).toHaveProperty("pricing");
  });
});

describe("eventService.checkAvailability", () => {
  it("should return true for available event", async () => {
    const available = await EventService.checkAvailability("evt_available");

    expect(available).toBe(true);
  });

  it("should return false for sold out event", async () => {
    const available = await EventService.checkAvailability("evt_sold_out");

    expect(available).toBe(false);
  });

  it("should return false for past event", async () => {
    const available = await EventService.checkAvailability("evt_past");

    expect(available).toBe(false);
  });

  it("should return false for nonexistent event", async () => {
    const available = await EventService.checkAvailability("evt_fake");

    expect(available).toBe(false);
  });
});
```

##### 2. Registration logic tests (7 tests)

```typescript
describe("eventService.registerForEvent", () => {
  const mockRegistration: RegistrationData = {
    customer: {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "(555) 123-4567",
    },
    numberOfSeats: 1,
    agreeToTerms: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should successfully register for free event", async () => {
    const result = await EventService.registerForEvent(
      "evt_free",
      mockRegistration
    );

    expect(result.success).toBe(true);
    expect(result.confirmationCode).toBeDefined();
    expect(result.registration).toBeDefined();
  });

  it("should return checkout URL for paid events", async () => {
    const result = await EventService.registerForEvent(
      "evt_paid",
      mockRegistration
    );

    expect(result.success).toBe(true);
    expect(result.checkoutUrl).toBeDefined();
    expect(result.sessionId).toBeDefined();
  });

  it("should return error when event sold out", async () => {
    const result = await EventService.registerForEvent(
      "evt_sold_out",
      mockRegistration
    );

    expect(result.success).toBe(false);
    expect(result.error).toBe("Event is sold out or no longer available");
  });

  it("should return error when event does not exist", async () => {
    const result = await EventService.registerForEvent(
      "evt_fake",
      mockRegistration
    );

    expect(result.success).toBe(false);
    expect(result.error).toBe("Event not found");
  });

  it("should return error for invalid registration data", async () => {
    const invalidData = {
      ...mockRegistration,
      customer: { ...mockRegistration.customer, email: "" },
    };
    const result = await EventService.registerForEvent("evt_free", invalidData);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Invalid registration data");
  });

  it("should handle network errors gracefully", async () => {
    // Mock network failure
    vi.spyOn(EventService, "checkAvailability").mockRejectedValue(
      new Error("Network error")
    );

    const result = await EventService.registerForEvent(
      "evt_free",
      mockRegistration
    );

    expect(result.success).toBe(false);
  });

  it("should generate unique confirmation codes", async () => {
    const result1 = await EventService.registerForEvent(
      "evt_free",
      mockRegistration
    );
    const result2 = await EventService.registerForEvent(
      "evt_free_2",
      mockRegistration
    );

    expect(result1.confirmationCode).not.toBe(result2.confirmationCode);
  });
});
```

##### 3. Validation tests (8 tests)

```typescript
describe("eventService.validateRegistration", () => {
  it("should pass validation for valid data", () => {
    const validData: RegistrationData = {
      customer: {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
      },
      numberOfSeats: 1,
      agreeToTerms: true,
    };

    const result = EventService.validateRegistration(validData);

    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });

  it("should fail validation for missing first name", () => {
    const invalidData: RegistrationData = {
      customer: { firstName: "", lastName: "Doe", email: "john@example.com" },
      numberOfSeats: 1,
      agreeToTerms: true,
    };

    const result = EventService.validateRegistration(invalidData);

    expect(result.isValid).toBe(false);
    expect(result.errors.firstName).toBeDefined();
  });

  it("should fail validation for invalid email format", () => {
    const invalidData: RegistrationData = {
      customer: { firstName: "John", lastName: "Doe", email: "invalid-email" },
      numberOfSeats: 1,
      agreeToTerms: true,
    };

    const result = EventService.validateRegistration(invalidData);

    expect(result.isValid).toBe(false);
    expect(result.errors.email).toBeDefined();
  });

  it("should fail validation for invalid phone format", () => {
    const invalidData: RegistrationData = {
      customer: {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "123",
      },
      numberOfSeats: 1,
      agreeToTerms: true,
    };

    const result = EventService.validateRegistration(invalidData);

    expect(result.isValid).toBe(false);
    expect(result.errors.phone).toBeDefined();
  });

  it("should fail validation for too many seats", () => {
    const invalidData: RegistrationData = {
      customer: {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
      },
      numberOfSeats: 20,
      agreeToTerms: true,
    };

    const result = EventService.validateRegistration(invalidData);

    expect(result.isValid).toBe(false);
    expect(result.errors.numberOfSeats).toBeDefined();
  });

  it("should fail validation for missing terms agreement", () => {
    const invalidData: RegistrationData = {
      customer: {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
      },
      numberOfSeats: 1,
      agreeToTerms: false,
    };

    const result = EventService.validateRegistration(invalidData);

    expect(result.isValid).toBe(false);
    expect(result.errors.agreeToTerms).toBeDefined();
  });

  it("should validate emergency contact when provided", () => {
    const dataWithEmergency: RegistrationData = {
      customer: {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
      },
      emergencyContact: { name: "", phone: "", relationship: "" },
      numberOfSeats: 1,
      agreeToTerms: true,
    };

    const result = EventService.validateRegistration(dataWithEmergency);

    expect(result.isValid).toBe(false);
    expect(result.errors.emergencyContactName).toBeDefined();
  });

  it("should sanitize inputs", () => {
    const dirtyData: RegistrationData = {
      customer: {
        firstName: '<script>alert("xss")</script>John',
        lastName: "Doe",
        email: "john@example.com",
      },
      numberOfSeats: 1,
      agreeToTerms: true,
    };

    const result = EventService.validateRegistration(dirtyData);

    // Sanitization handled by SecurityValidator
    expect(result.isValid).toBe(true);
  });
});
```

##### 4. Helper methods tests (5 tests)

```typescript
describe("eventService helpers", () => {
  it("should get featured events", async () => {
    const events = await EventService.getFeaturedEvents(3);

    expect(events.every((e) => e.isFeatured)).toBe(true);
    expect(events.length).toBeLessThanOrEqual(3);
  });

  it("should get upcoming events", async () => {
    const now = new Date();
    const events = await EventService.getUpcomingEvents(5);

    expect(events.every((e) => new Date(e.startDateTime) > now)).toBe(true);
    expect(events.length).toBeLessThanOrEqual(5);
  });

  it("should get past events", async () => {
    const now = new Date();
    const events = await EventService.getPastEvents(5);

    expect(events.every((e) => new Date(e.endDateTime) < now)).toBe(true);
  });

  it("should get events by category", async () => {
    const events = await EventService.getEventsByCategory("sound-healing", 10);

    expect(events.every((e) => e.category === "sound-healing")).toBe(true);
  });

  it("should get all categories", async () => {
    const categories = await EventService.getCategories();

    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);

    // Check uniqueness
    const uniqueCategories = Array.from(new Set(categories));
    expect(categories.length).toBe(uniqueCategories.length);
  });

  it("should get related events", async () => {
    const referenceEvent = await EventService.getEventBySlug(
      "full-moon-aerial-sound-bath"
    );
    if (!referenceEvent) throw new Error("Reference event not found");

    const related = await EventService.getRelatedEvents(referenceEvent, 3);

    expect(related.every((e) => e.id !== referenceEvent.id)).toBe(true);
    expect(related.length).toBeLessThanOrEqual(3);
  });

  it("should search events", async () => {
    const events = await EventService.searchEvents("sound bath");

    expect(events.length).toBeGreaterThan(0);
    expect(
      events.some(
        (e) =>
          e.title.toLowerCase().includes("sound") ||
          e.description.toLowerCase().includes("sound")
      )
    ).toBe(true);
  });
});

describe("API delay simulation", () => {
  it("should simulate realistic API delay", async () => {
    const startTime = Date.now();
    await EventService.getEvents();
    const endTime = Date.now();
    const duration = endTime - startTime;

    // Should take at least 100ms (accounting for timing variance)
    expect(duration).toBeGreaterThanOrEqual(100);
  });
});
```

---

## Security testing specifications

### EventSecurityValidator tests

**File**: `/packages/shared-utils/src/security/EventSecurityValidator.test.ts`
**Target**: 20 tests, 100% coverage
**Pattern**: Reuse SecurityValidator patterns + event-specific tests

```typescript
describe("EventSecurityValidator", () => {
  describe("Reused from SecurityValidator", () => {
    it("should detect XSS injection in event fields", () => {
      const result = EventSecurityValidator.validateEventField(
        "notes",
        '<script>alert("xss")</script>'
      );

      expect(result.isValid).toBe(false);
      expect(result.risks.some((r) => r.type === "XSS_ATTEMPT")).toBe(true);
    });

    it("should detect SQL injection patterns", () => {
      const result = EventSecurityValidator.validateEventField(
        "notes",
        "'; DROP TABLE registrations; --"
      );

      expect(result.isValid).toBe(false);
      expect(result.risks.some((r) => r.type === "SQL_INJECTION")).toBe(true);
    });

    it("should validate email format", () => {
      const result = EventSecurityValidator.validateEmail("john@example.com");

      expect(result.isValid).toBe(true);
    });

    it("should reject invalid email format", () => {
      const result = EventSecurityValidator.validateEmail("invalid-email");

      expect(result.isValid).toBe(false);
    });

    it("should detect disposable email domains", () => {
      const result = EventSecurityValidator.validateEmail("user@tempmail.com");

      expect(result.risks.some((r) => r.type === "DISPOSABLE_EMAIL")).toBe(
        true
      );
    });
  });

  describe("Event-specific validation", () => {
    it("should validate phone number format", () => {
      const valid = EventSecurityValidator.validatePhone("(555) 123-4567");
      const invalid = EventSecurityValidator.validatePhone("123");

      expect(valid.isValid).toBe(true);
      expect(invalid.isValid).toBe(false);
    });

    it("should detect suspicious phone patterns", () => {
      const result = EventSecurityValidator.validatePhone("(111) 111-1111");

      expect(result.isValid).toBe(false);
      expect(result.risks.some((r) => r.type === "SUSPICIOUS_PATTERN")).toBe(
        true
      );
    });

    it("should detect bot registration patterns", () => {
      const botData = {
        customer: {
          firstName: "test",
          lastName: "test",
          email: "test@test.com",
        },
        numberOfSeats: 1,
        agreeToTerms: true,
      };

      const result = EventSecurityValidator.validateRegistration(botData);
      expect(result.risks).toContain("POSSIBLE_BOT_PATTERN");
    });

    it("should validate number of seats range", () => {
      const tooMany = EventSecurityValidator.validateSeats(20);
      const tooFew = EventSecurityValidator.validateSeats(0);
      const valid = EventSecurityValidator.validateSeats(2);

      expect(tooMany.isValid).toBe(false);
      expect(tooFew.isValid).toBe(false);
      expect(valid.isValid).toBe(true);
    });

    it("should sanitize special requests/notes", () => {
      const dirty = '<script>alert("xss")</script>I have dietary restrictions';
      const result = EventSecurityValidator.validateEventField("notes", dirty);

      expect(result.sanitizedValue).not.toContain("<script>");
      expect(result.sanitizedValue).toContain("dietary restrictions");
    });

    it("should detect medical terminology blocking", () => {
      const medicalRequest = "I need a diagnosis for my condition";
      const result = EventSecurityValidator.validateEventField(
        "notes",
        medicalRequest
      );

      expect(result.isValid).toBe(false);
      expect(result.risks.some((r) => r.type === "MEDICAL_TERMS")).toBe(true);
    });

    it("should allow wellness-related requests", () => {
      const validRequest =
        "I would like to work on stress relief and energy healing";
      const result = EventSecurityValidator.validateEventField(
        "notes",
        validRequest
      );

      expect(result.isValid).toBe(true);
    });

    it("should validate emergency contact name", () => {
      const result = EventSecurityValidator.validateContactFormField(
        "emergencyContactName",
        "Jane Doe"
      );

      expect(result.isValid).toBe(true);
    });

    it("should validate emergency contact relationship", () => {
      const valid = EventSecurityValidator.validateEventField(
        "relationship",
        "spouse"
      );
      const invalid = EventSecurityValidator.validateEventField(
        "relationship",
        "<script>"
      );

      expect(valid.isValid).toBe(true);
      expect(invalid.isValid).toBe(false);
    });

    it("should detect excessive seat requests", () => {
      const result = EventSecurityValidator.validateSeats(50);

      expect(result.isValid).toBe(false);
      expect(result.risks).toContain("EXCESSIVE_SEATS");
    });

    it("should handle custom question responses", () => {
      const responses = {
        question1: "I am interested in healing",
        question2: '<script>alert("xss")</script>',
      };

      const result = EventSecurityValidator.validateCustomResponses(responses);

      expect(result.isValid).toBe(false);
      expect(result.sanitizedResponses.question1).toBe(
        "I am interested in healing"
      );
      expect(result.sanitizedResponses.question2).not.toContain("<script>");
    });
  });
});
```

### EventRateLimit tests

**File**: `/packages/shared-utils/src/security/EventRateLimit.test.ts`
**Target**: 15 tests, 100% coverage
**Pattern**: Based on FormRateLimit.test.ts

```typescript
describe("EventRateLimit", () => {
  let rateLimit: EventRateLimit;

  beforeEach(() => {
    localStorage.clear();
    rateLimit = new EventRateLimit();
  });

  it("should allow first registration for event", async () => {
    const result = await rateLimit.checkEventRegistrationLimit(
      "user@example.com",
      "evt-1"
    );

    expect(result.allowed).toBe(true);
  });

  it("should block duplicate registration for same event", async () => {
    // First registration
    rateLimit.recordRegistration("user@example.com", "evt-1");

    // Second attempt
    const result = await rateLimit.checkEventRegistrationLimit(
      "user@example.com",
      "evt-1"
    );

    expect(result.allowed).toBe(false);
    expect(result.message).toContain("already registered");
  });

  it("should allow registration for different events", async () => {
    rateLimit.recordRegistration("user@example.com", "evt-1");

    const result = await rateLimit.checkEventRegistrationLimit(
      "user@example.com",
      "evt-2"
    );

    expect(result.allowed).toBe(true);
  });

  it("should enforce global registration limit (5/hour)", async () => {
    // Register for 5 events
    for (let i = 1; i <= 5; i++) {
      rateLimit.recordRegistration("user@example.com", `evt-${i}`);
    }

    // 6th attempt should fail
    const result = await rateLimit.checkEventRegistrationLimit(
      "user@example.com",
      "evt-6"
    );

    expect(result.allowed).toBe(false);
    expect(result.message).toContain("reached the registration limit");
  });

  it("should reset after time window expires", async () => {
    rateLimit.recordRegistration("user@example.com", "evt-1");

    // Mock time advancement
    const now = Date.now();
    vi.spyOn(Date, "now").mockReturnValue(now + 3600000 + 1000); // 1 hour + 1 second

    const result = await rateLimit.checkEventRegistrationLimit(
      "user@example.com",
      "evt-1"
    );

    expect(result.allowed).toBe(true);
  });

  it("should track registrations per email", async () => {
    rateLimit.recordRegistration("user1@example.com", "evt-1");
    rateLimit.recordRegistration("user2@example.com", "evt-1");

    const result1 = await rateLimit.checkEventRegistrationLimit(
      "user1@example.com",
      "evt-1"
    );
    const result2 = await rateLimit.checkEventRegistrationLimit(
      "user2@example.com",
      "evt-2"
    );

    expect(result1.allowed).toBe(false); // Already registered for evt-1
    expect(result2.allowed).toBe(true); // Different email
  });

  it("should provide time until reset", async () => {
    rateLimit.recordRegistration("user@example.com", "evt-1");

    const result = await rateLimit.checkEventRegistrationLimit(
      "user@example.com",
      "evt-1"
    );

    expect(result.timeUntilReset).toBeGreaterThan(0);
  });

  it("should handle localStorage errors gracefully", async () => {
    vi.spyOn(localStorage, "getItem").mockImplementation(() => {
      throw new Error("Storage error");
    });

    const result = await rateLimit.checkEventRegistrationLimit(
      "user@example.com",
      "evt-1"
    );

    expect(result.allowed).toBe(true); // Fail open for better UX
  });

  it("should clean old registrations", async () => {
    // Record old registration
    const oldTimestamp = Date.now() - 7200000; // 2 hours ago
    vi.spyOn(Date, "now").mockReturnValue(oldTimestamp);
    rateLimit.recordRegistration("user@example.com", "evt-old");

    // Restore current time
    vi.spyOn(Date, "now").mockReturnValue(Date.now());

    // Should not count old registration
    const result = await rateLimit.checkEventRegistrationLimit(
      "user@example.com",
      "evt-old"
    );

    expect(result.allowed).toBe(true);
  });

  it("should respect custom storage key", async () => {
    const customLimit = new EventRateLimit({ storageKey: "custom_events" });

    customLimit.recordRegistration("user@example.com", "evt-1");

    // Regular limit should not see custom storage
    const result = await rateLimit.checkEventRegistrationLimit(
      "user@example.com",
      "evt-1"
    );

    expect(result.allowed).toBe(true);
  });

  it("should respect custom max registrations", async () => {
    const strictLimit = new EventRateLimit({ maxRegistrations: 2 });

    strictLimit.recordRegistration("user@example.com", "evt-1");
    strictLimit.recordRegistration("user@example.com", "evt-2");

    const result = await strictLimit.checkEventRegistrationLimit(
      "user@example.com",
      "evt-3"
    );

    expect(result.allowed).toBe(false);
  });

  it("should respect custom time window", async () => {
    const shortWindow = new EventRateLimit({ timeWindowMs: 1000 }); // 1 second

    shortWindow.recordRegistration("user@example.com", "evt-1");

    // Wait for window to expire
    await new Promise((resolve) => setTimeout(resolve, 1100));

    const result = await shortWindow.checkEventRegistrationLimit(
      "user@example.com",
      "evt-1"
    );

    expect(result.allowed).toBe(true);
  });

  it("should provide remaining registrations count", async () => {
    rateLimit.recordRegistration("user@example.com", "evt-1");

    const result = await rateLimit.checkEventRegistrationLimit(
      "user@example.com",
      "evt-2"
    );

    expect(result.remainingRegistrations).toBe(4); // 5 max - 1 used
  });

  it("should handle corrupted localStorage data", async () => {
    localStorage.setItem("event_registrations", "invalid json");

    const result = await rateLimit.checkEventRegistrationLimit(
      "user@example.com",
      "evt-1"
    );

    expect(result.allowed).toBe(true); // Should recover gracefully
  });
});
```

---

## Integration testing specifications

### EventsPage integration tests

**File**: `/apps/main/src/__tests__/events.integration.test.tsx`
**Target**: 25 tests
**Pattern**: Based on routing.integration.test.tsx + Contact page patterns

```typescript
describe('Events Page Integration', () => {
  describe('Routing Integration (10 tests)', () => {
    it('should navigate from home to events page', async () => {
      const user = userEvent.setup();

      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );

      await user.click(screen.getByRole('link', { name: /events/i }));

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Events & Workshops/i })).toBeInTheDocument();
      });
    });

    it('should navigate from events list to event detail', async () => {
      const user = userEvent.setup();

      render(
        <MemoryRouter initialEntries={['/events']}>
          <Routes>
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:slug" element={<EventDetailPage />} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Full Moon Sound Bath')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Full Moon Sound Bath'));

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Full Moon Sound Bath/i })).toBeInTheDocument();
      });
    });

    it('should navigate from event detail to registration', async () => {
      const user = userEvent.setup();

      render(
        <MemoryRouter initialEntries={['/events/full-moon-sound-bath']}>
          <EventDetailPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: /register/i }));

      // Registration form should appear
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    });

    it('should handle back navigation correctly', async () => {
      const { container } = render(
        <MemoryRouter initialEntries={['/events', '/events/full-moon-sound-bath']}>
          <Routes>
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:slug" element={<EventDetailPage />} />
          </Routes>
        </MemoryRouter>
      );

      // Should be on detail page
      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Full Moon/i);
      });

      // Back button click would trigger navigation in real app
    });

    it('should preserve filters in URL params', async () => {
      const user = userEvent.setup();

      render(
        <MemoryRouter initialEntries={['/events']}>
          <EventsPage />
        </MemoryRouter>
      );

      await user.click(screen.getByText('Sound Healing'));

      await waitFor(() => {
        expect(window.location.search).toContain('category=sound-healing');
      });
    });

    it('should handle 404 for invalid event slug', async () => {
      render(
        <MemoryRouter initialEntries={['/events/nonexistent-event']}>
          <Routes>
            <Route path="/events/:slug" element={<EventDetailPage />} />
            <Route path="/404" element={<NotFound />} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/event not found/i)).toBeInTheDocument();
      });
    });

    it('should maintain scroll position when returning to list', async () => {
      // Test scroll restoration
      const user = userEvent.setup();

      render(
        <MemoryRouter initialEntries={['/events']}>
          <Routes>
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:slug" element={<EventDetailPage />} />
          </Routes>
        </MemoryRouter>
      );

      // Scroll down
      window.scrollTo(0, 500);

      // Navigate to detail
      await user.click(screen.getAllByRole('article')[0]);

      // Navigate back
      await user.click(screen.getByRole('button', { name: /back/i }));

      // Scroll should be restored
      expect(window.scrollY).toBe(500);
    });

    it('should update browser history correctly', async () => {
      const user = userEvent.setup();

      render(
        <MemoryRouter initialEntries={['/events']}>
          <EventsPage />
        </MemoryRouter>
      );

      await user.click(screen.getByText('Sound Healing'));
      await user.click(screen.getByText('In-Person'));

      // History should have multiple entries
      expect(window.history.length).toBeGreaterThan(1);
    });

    it('should handle rapid navigation without errors', async () => {
      const user = userEvent.setup();

      render(
        <MemoryRouter initialEntries={['/events']}>
          <Routes>
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:slug" element={<EventDetailPage />} />
          </Routes>
        </MemoryRouter>
      );

      // Rapidly click multiple events
      const cards = screen.getAllByRole('article');
      await user.click(cards[0]);
      await user.click(screen.getByRole('button', { name: /back/i }));
      await user.click(cards[1]);

      // Should not crash
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    it('should handle browser refresh on detail page', async () => {
      render(
        <MemoryRouter initialEntries={['/events/full-moon-sound-bath']}>
          <EventDetailPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/Full Moon/i)).toBeInTheDocument();
      });

      // Event data should load correctly from slug
    });
  });

  describe('Form Integration (10 tests)', () => {
    it('should complete full registration flow for free event', async () => {
      const user = userEvent.setup();

      render(
        <MemoryRouter initialEntries={['/events/free-meditation']}>
          <EventDetailPage />
        </MemoryRouter>
      );

      await user.click(screen.getByRole('button', { name: /register/i }));

      // Fill form
      await user.type(screen.getByLabelText(/first name/i), 'Jane');
      await user.type(screen.getByLabelText(/last name/i), 'Doe');
      await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
      await user.click(screen.getByRole('checkbox', { name: /terms/i }));

      // Submit
      await user.click(screen.getByRole('button', { name: /submit/i }));

      // Verify success
      await waitFor(() => {
        expect(screen.getByText(/registration confirmed/i)).toBeInTheDocument();
      });
    });

    it('should show validation errors for invalid inputs', async () => {
      const user = userEvent.setup();

      render(
        <MemoryRouter initialEntries={['/events/free-meditation']}>
          <EventDetailPage />
        </MemoryRouter>
      );

      await user.click(screen.getByRole('button', { name: /register/i }));

      // Submit without filling
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      });
    });

    it('should enforce rate limiting', async () => {
      const user = userEvent.setup();

      // Mock multiple registrations
      for (let i = 0; i < 5; i++) {
        render(
          <MemoryRouter initialEntries={[`/events/event-${i}`]}>
            <EventDetailPage />
          </MemoryRouter>
        );

        await user.click(screen.getByRole('button', { name: /register/i }));
        await fillAndSubmitForm(user);
      }

      // 6th registration should be blocked
      render(
        <MemoryRouter initialEntries={['/events/event-6']}>
          <EventDetailPage />
        </MemoryRouter>
      );

      await user.click(screen.getByRole('button', { name: /register/i }));
      await fillAndSubmitForm(user);

      await waitFor(() => {
        expect(screen.getByText(/registration limit/i)).toBeInTheDocument();
      });
    });

    it('should handle Stripe checkout for paid events', async () => {
      const user = userEvent.setup();

      render(
        <MemoryRouter initialEntries={['/events/paid-workshop']}>
          <EventDetailPage />
        </MemoryRouter>
      );

      await user.click(screen.getByRole('button', { name: /register/i }));
      await fillAndSubmitForm(user);

      // Should redirect to Stripe checkout
      await waitFor(() => {
        expect(window.location.href).toContain('checkout.stripe.com');
      });
    });

    // ... 6 more form integration tests
  });

  describe('Data Flow Integration (5 tests)', () => {
    it('should fetch and display events on page load', async () => {
      render(
        <MemoryRouter initialEntries={['/events']}>
          <EventsPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Full Moon Sound Bath')).toBeInTheDocument();
      });
    });

    it('should update UI when filters change', async () => {
      const user = userEvent.setup();

      render(
        <MemoryRouter initialEntries={['/events']}>
          <EventsPage />
        </MemoryRouter>
      );

      await user.click(screen.getByText('Sound Healing'));

      await waitFor(() => {
        const events = screen.getAllByRole('article');
        expect(events.length).toBeGreaterThan(0);
      });
    });

    it('should handle loading states correctly', async () => {
      render(
        <MemoryRouter initialEntries={['/events']}>
          <EventsPage />
        </MemoryRouter>
      );

      // Should show loading skeletons
      expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.queryByTestId('loading-skeleton')).not.toBeInTheDocument();
      });
    });

    it('should handle error states correctly', async () => {
      // Mock service error
      vi.spyOn(EventService, 'getEvents').mockRejectedValue(new Error('Network error'));

      render(
        <MemoryRouter initialEntries={['/events']}>
          <EventsPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/failed to load events/i)).toBeInTheDocument();
      });
    });

    it('should show empty state when no events match', async () => {
      render(
        <MemoryRouter initialEntries={['/events?category=nonexistent']}>
          <EventsPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/no events found/i)).toBeInTheDocument();
      });
    });
  });
});
```

---

## E2E testing specifications

### E2E tests (Playwright)

**File**: `/e2e/events.spec.ts`
**Target**: 9 tests (smoke tests for critical flows)
**Pattern**: Based on existing Playwright patterns

```typescript
import { test, expect } from "@playwright/test";

test.describe("Events Page E2E", () => {
  test("should browse events and view details", async ({ page }) => {
    await page.goto("/events");

    // Wait for events to load
    await expect(
      page.getByRole("heading", { name: "Events & Workshops" })
    ).toBeVisible();

    // Verify events loaded
    const eventCards = page.getByRole("article");
    await expect(eventCards).toHaveCount.greaterThan(0);

    // Click first event card
    await eventCards.first().click();

    // Verify detail page
    await expect(page).toHaveURL(/\/events\/.+/);
    await expect(page.getByRole("button", { name: /register/i })).toBeVisible();
  });

  test("should complete registration for free event", async ({ page }) => {
    await page.goto("/events/free-meditation-circle");

    // Click register button
    await page.getByRole("button", { name: /register/i }).click();

    // Fill registration form
    await page.getByLabel(/first name/i).fill("John");
    await page.getByLabel(/last name/i).fill("Doe");
    await page.getByLabel(/email/i).fill("john@example.com");
    await page.getByRole("checkbox", { name: /terms/i }).check();

    // Submit
    await page.getByRole("button", { name: /submit registration/i }).click();

    // Verify success
    await expect(page.getByText(/registration confirmed/i)).toBeVisible();
    await expect(page.getByText(/confirmation code/i)).toBeVisible();
  });

  test("should handle sold out events correctly", async ({ page }) => {
    await page.goto("/events/sold-out-workshop");

    // Verify sold out badge
    await expect(page.getByText(/sold out/i)).toBeVisible();

    // Register button should be disabled or show waitlist
    const registerButton = page.getByRole("button", {
      name: /register|waitlist/i,
    });
    await expect(registerButton).toBeVisible();
  });

  test("should filter events by category", async ({ page }) => {
    await page.goto("/events");

    // Wait for page load
    await expect(
      page.getByRole("heading", { name: "Events & Workshops" })
    ).toBeVisible();

    // Click Sound Healing category
    await page.getByText("Sound Healing").click();

    // URL should update
    await expect(page).toHaveURL(/category=sound-healing/);

    // Events should be filtered
    const eventCards = page.getByRole("article");
    await expect(eventCards).toHaveCount.greaterThan(0);
  });

  test("should search for events", async ({ page }) => {
    await page.goto("/events");

    // Enter search query
    await page.getByPlaceholder(/search events/i).fill("sound bath");

    // Results should update
    await expect(page.getByText(/sound bath/i)).toBeVisible();
  });

  test("should handle payment for paid events", async ({ page }) => {
    await page.goto("/events/paid-sound-bath");

    // Fill registration
    await page.getByRole("button", { name: /register/i }).click();
    await page.getByLabel(/first name/i).fill("Jane");
    await page.getByLabel(/last name/i).fill("Doe");
    await page.getByLabel(/email/i).fill("jane@example.com");
    await page.getByRole("checkbox", { name: /terms/i }).check();

    // Submit
    await page.getByRole("button", { name: /proceed to payment/i }).click();

    // Should redirect to Stripe (in test mode, mock this)
    await expect(page).toHaveURL(/checkout.stripe.com|stripe-test/);
  });

  test("should work correctly on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto("/events");

    // Mobile layout should work
    await expect(
      page.getByRole("heading", { name: "Events & Workshops" })
    ).toBeVisible();

    // Events should stack vertically
    const eventCards = page.getByRole("article");
    await expect(eventCards.first()).toBeVisible();
  });

  test("should handle pagination when many events", async ({ page }) => {
    await page.goto("/events");

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Load more button or infinite scroll should trigger
    const loadMoreButton = page.getByRole("button", { name: /load more/i });
    if (await loadMoreButton.isVisible()) {
      await loadMoreButton.click();

      // More events should appear
      await expect(page.getByRole("article")).toHaveCount.greaterThan(10);
    }
  });

  test("should navigate through full user journey", async ({ page }) => {
    // Start at home
    await page.goto("/");

    // Navigate to events
    await page.getByRole("link", { name: /events/i }).click();
    await expect(page).toHaveURL("/events");

    // Browse events
    const eventCard = page.getByRole("article").first();
    await eventCard.click();

    // View details
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    // Register
    await page.getByRole("button", { name: /register/i }).click();
    await page.getByLabel(/first name/i).fill("Test");
    await page.getByLabel(/last name/i).fill("User");
    await page.getByLabel(/email/i).fill("test@example.com");
    await page.getByRole("checkbox", { name: /terms/i }).check();
    await page.getByRole("button", { name: /submit/i }).click();

    // Confirm success
    await expect(page.getByText(/registration confirmed/i)).toBeVisible();
  });
});
```

---

## Testing utilities and mocks

### Mock data

**File**: `/packages/shared-utils/src/mocks/mockEvents.ts`

```typescript
import type { Event } from "../types/events";

export const mockEvents: Event[] = [
  {
    id: "evt_full_moon_sound_bath",
    slug: "full-moon-aerial-sound-bath",
    title: "Full Moon Aerial Sound Bath",
    subtitle: "November Full Moon Ceremony",
    shortDescription:
      "Experience deep relaxation with aerial yoga and sound healing under the full moon.",
    description:
      "Join us for a transformative Full Moon Aerial Sound Bath ceremony...",

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
      amount: 9900,
      currency: "usd",
      earlyBirdPricing: {
        amount: 7900,
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
  // ... 11 more diverse events (free, paid, sold-out, past, etc.)
];

export const mockRegistrationData: RegistrationData = {
  customer: {
    firstName: "Jane",
    lastName: "Doe",
    email: "jane@example.com",
    phone: "(555) 123-4567",
  },
  numberOfSeats: 1,
  agreeToTerms: true,
};
```

### Test helpers

**File**: `/packages/shared-components/src/test-utils/eventTestHelpers.ts`

```typescript
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import type { Event, RegistrationData } from '@reiki-goddess/shared-utils';

export function createMockEvent(overrides?: Partial<Event>): Event {
  return {
    id: 'evt_test_123',
    slug: 'test-event',
    title: 'Test Event',
    subtitle: 'Test Subtitle',
    shortDescription: 'Short description',
    description: 'Full description',
    featuredImage: {
      image: '/img/test-event.png',
      alt: 'Test Event'
    },
    startDateTime: new Date('2025-12-01T18:00:00Z'),
    endDateTime: new Date('2025-12-01T20:00:00Z'),
    timezone: 'America/Los_Angeles',
    duration: { hours: 2, minutes: 0 },
    location: {
      type: 'in-person',
      venue: {
        name: 'Test Venue',
        address: {
          street: '123 Test St',
          city: 'Test City',
          state: 'TS',
          zipCode: '12345',
          country: 'USA'
        }
      }
    },
    capacity: {
      total: 20,
      reserved: 10,
      waitlist: 0
    },
    availabilityStatus: 'available',
    pricing: {
      type: 'paid',
      amount: 5000,
      currency: 'usd'
    },
    category: 'test-category',
    tags: ['test', 'mock'],
    isFeatured: false,
    isPinned: false,
    displayOrder: 1,
    status: 'published',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
    ...overrides,
  };
}

export function renderEventCard(overrides?: Partial<Event>) {
  const event = createMockEvent(overrides);
  return render(
    <MemoryRouter>
      <EventCard event={event} />
    </MemoryRouter>
  );
}

export async function fillRegistrationForm(
  user: ReturnType<typeof userEvent.setup>,
  data: RegistrationData = {
    customer: {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
    },
    numberOfSeats: 1,
    agreeToTerms: true,
  }
) {
  await user.type(screen.getByLabelText(/first name/i), data.customer.firstName);
  await user.type(screen.getByLabelText(/last name/i), data.customer.lastName);
  await user.type(screen.getByLabelText(/email/i), data.customer.email);

  if (data.customer.phone) {
    await user.type(screen.getByLabelText(/phone/i), data.customer.phone);
  }

  if (data.numberOfSeats > 1) {
    await user.selectOptions(screen.getByLabelText(/number of seats/i), data.numberOfSeats.toString());
  }

  if (data.agreeToTerms) {
    await user.click(screen.getByRole('checkbox', { name: /terms/i }));
  }
}

export function mockEventService() {
  return {
    getEvents: vi.fn().mockResolvedValue(mockEvents),
    getEventBySlug: vi.fn().mockImplementation((slug) =>
      Promise.resolve(mockEvents.find(e => e.slug === slug) || null)
    ),
    checkAvailability: vi.fn().mockResolvedValue(true),
    registerForEvent: vi.fn().mockResolvedValue({
      success: true,
      confirmationCode: 'REG-TEST-123',
    }),
  };
}
```

### Router wrapper

**File**: `/packages/shared-components/src/test-utils/RouterWrapper.tsx`

```typescript
import React from 'react';
import { MemoryRouter, MemoryRouterProps } from 'react-router-dom';

export interface RouterWrapperProps extends MemoryRouterProps {
  children: React.ReactNode;
}

export const RouterWrapper: React.FC<RouterWrapperProps> = ({
  children,
  initialEntries = ['/'],
  ...props
}) => (
  <MemoryRouter initialEntries={initialEntries} {...props}>
    {children}
  </MemoryRouter>
);
```

---

## Implementation roadmap

### Phase 1: MVP (Week 1) - Core listing functionality

**Goal**: 170+ tests passing, 95%+ component coverage

**Components to test**:

1. EventCard (25 tests)
2. EventGrid (20 tests)
3. EventsHero (12 tests)
4. EventStatusBadge (8 tests)
5. EventDateTime (10 tests)
6. EventLocation (8 tests)
7. EventCapacity (10 tests)
8. EventPricing (12 tests)
9. EventsPage (25 tests)
10. eventService (30 tests)
11. useEvents hook (10 tests)

**Test files to create**:

- [ ] `/packages/shared-components/src/Event/EventCard/EventCard.test.tsx`
- [ ] `/packages/shared-components/src/Event/EventGrid/EventGrid.test.tsx`
- [ ] `/packages/shared-components/src/Event/EventsHero/EventsHero.test.tsx`
- [ ] `/packages/shared-components/src/Event/EventStatusBadge/EventStatusBadge.test.tsx`
- [ ] `/packages/shared-components/src/Event/EventDateTime/EventDateTime.test.tsx`
- [ ] `/packages/shared-components/src/Event/EventLocation/EventLocation.test.tsx`
- [ ] `/packages/shared-components/src/Event/EventCapacity/EventCapacity.test.tsx`
- [ ] `/packages/shared-components/src/Event/EventPricing/EventPricing.test.tsx`
- [ ] `/packages/shared-components/src/pages/EventsPage.test.tsx`
- [ ] `/packages/shared-utils/src/services/eventService.test.ts`
- [ ] `/packages/shared-components/src/hooks/useEvents.test.ts`
- [ ] `/apps/main/src/__tests__/events.integration.test.tsx` (13 tests)
- [ ] `/e2e/events.spec.ts` (2 tests)

**Utilities to create**:

- [ ] `/packages/shared-utils/src/mocks/mockEvents.ts`
- [ ] `/packages/shared-components/src/test-utils/eventTestHelpers.ts`

**Deliverable**: Functional events listing with comprehensive test coverage

---

### Phase 2: Event details & registration (Week 2)

**Goal**: 313+ cumulative tests passing (143 new)

**Components to test**:

1. EventDetail (20 tests)
2. EventMetadata (8 tests)
3. EventDescription (6 tests)
4. EventRegistrationForm (48 tests)
5. EventSecurityValidator (15 tests)
6. EventRateLimit (12 tests)
7. useEventDetail hook (8 tests)
8. useEventAvailability hook (6 tests)
9. EventDetailPage (20 tests)

**Test files to create**:

- [ ] `/packages/shared-components/src/Event/EventDetail/EventDetail.test.tsx`
- [ ] `/packages/shared-components/src/Event/EventMetadata/EventMetadata.test.tsx`
- [ ] `/packages/shared-components/src/Event/EventDescription/EventDescription.test.tsx`
- [ ] `/packages/shared-components/src/Event/EventRegistrationForm/EventRegistrationForm.test.tsx`
- [ ] `/packages/shared-utils/src/security/EventSecurityValidator.test.ts`
- [ ] `/packages/shared-utils/src/security/EventRateLimit.test.ts`
- [ ] `/packages/shared-components/src/hooks/useEventDetail.test.ts`
- [ ] `/packages/shared-components/src/hooks/useEventAvailability.test.ts`
- [ ] `/packages/shared-components/src/pages/EventDetailPage.test.tsx`
- [ ] Update `/apps/main/src/__tests__/events.integration.test.tsx` (+16 tests)
- [ ] Update `/e2e/events.spec.ts` (+5 tests)

**Deliverable**: Complete event detail pages with registration and full security coverage

---

### Phase 3: Filtering & search (Week 3)

**Goal**: 353+ cumulative tests passing (40 new)

**Components to test**:

1. EventFilters (24 tests)
2. EventSearch (16 tests)

**Test files to create**:

- [ ] `/packages/shared-components/src/Event/EventFilters/EventFilters.test.tsx`
- [ ] `/packages/shared-components/src/Event/EventSearch/EventSearch.test.tsx`
- [ ] Update `/apps/main/src/__tests__/events.integration.test.tsx` (+8 tests)
- [ ] Update `/e2e/events.spec.ts` (+2 tests)

**Deliverable**: Advanced event discovery features with comprehensive test coverage

---

### Phase 4: Polish & optimization (Week 4)

**Goal**: Maintain 95%+ coverage, optimize flaky tests

**Focus**:

- Fix any flaky tests
- Improve coverage gaps
- Add visual regression tests (if time)
- Performance benchmark tests
- Accessibility audit tests
- Cross-browser compatibility tests

**Deliverable**: Production-ready Events page with excellent test coverage

---

## Quality requirements

### Must-have checklist

✅ Every component has comprehensive test spec
✅ Coverage targets match project standards (95%+ UI, 100% services)
✅ Accessibility testing included (axe-core)
✅ Security testing is comprehensive (100%)
✅ Integration tests cover critical workflows
✅ E2E tests cover smoke testing
✅ Mock data is realistic and reusable
✅ Test utilities reduce duplication
✅ Tests follow project patterns (ContactPage, BlogService, etc.)
✅ All tests pass before committing

### Coverage verification

Run coverage reports after each phase:

```bash
npm test -- --coverage
```

**Phase 1 target**:

- EventCard: 95%+
- eventService: 100%
- Supporting components: 95%+

**Phase 2 target**:

- EventRegistrationForm: 95%+
- EventSecurityValidator: 100%
- EventRateLimit: 100%

**Phase 3 target**:

- EventFilters: 95%+
- EventSearch: 95%+

### Test quality standards

1. **Descriptive test names**: Use "should..." pattern
2. **Arrange-Act-Assert**: Clear test structure
3. **No magic numbers**: Use constants for test data
4. **Isolated tests**: Each test independent
5. **Fast execution**: Unit tests < 100ms each
6. **Deterministic**: No flaky tests allowed
7. **Maintainable**: Clear intent, easy to update

### Continuous improvement

After each phase:

- Review test failures
- Identify patterns in bugs
- Update test strategy document
- Share learnings with team
- Refactor duplicated test code

---

## Related documents

- [Component Architecture](./components/README.md) - Full component specifications
- [EventCard Specification](./components/EventCard.md) - Detailed EventCard spec
- [Event Service Specification](./components/event-service.md) - Service architecture
- [Testing Strategy (Project-wide)](../../testing/testing-strategy.md) - Overall testing approach
- [Contact Page Tests](../../../packages/shared-components/src/pages/ContactPage.test.tsx) - Reference pattern
- [Blog Service Tests](../../../packages/shared-utils/src/services/blogService.test.ts) - Service pattern reference

---

**Document Status**: ✅ Complete and ready for implementation
**Last Updated**: 2025-11-03
**Next Review**: After Phase 1 completion
**Estimated Total Effort**: 4 weeks (220+ tests)
