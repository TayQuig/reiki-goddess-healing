# Events Page Design Implementation Specification

> **Purpose**: Complete visual design specifications for the Events Page frontend implementation
> **Design Authority**: `/figma-screenshots/homepage/` Community Events section
> **Brand System**: `/docs/design/style-guide.md`
> **Date Created**: 2025-11-03
> **Agent**: Design Extractor Agent

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Page Layout Structure](#page-layout-structure)
3. [Event Card Component Specifications](#event-card-component-specifications)
4. [Color and Typography Map](#color-and-typography-map)
5. [Interactive Elements](#interactive-elements)
6. [Responsive Behavior](#responsive-behavior)
7. [Component Reuse Opportunities](#component-reuse-opportunities)
8. [Missing Design Elements](#missing-design-elements)
9. [Figma Screenshot Inventory](#figma-screenshot-inventory)
10. [Implementation Guidelines](#implementation-guidelines)

---

## Executive Summary

### Design Source

The Events Page design is derived from the **Community Events section** on the homepage (Figma Frame 24). This section exists and is implemented as `/packages/shared-components/src/CommunityEvents/CommunityEvents.tsx`. The Events Page will be an expanded version of this component, displaying a full catalog of events with filtering and detail views.

### Key Design Elements

- **Background**: Blue-tinted section with background image (#0205B7 at 44% opacity)
- **Event Cards**: White cards (20px border radius) on blue overlay background
- **Card Layout**: 2-column grid on desktop, responsive stack on mobile
- **Typography**: Figtree font family throughout
- **Interactive Elements**: Ghost button CTAs, pagination dots, hover states

### Brand Consistency

All specifications align with:

- Brand Blue: `#0205B7`
- Cream Background: `#FFFBF5`
- Cyan Accent: `#63D5F9`
- Typography: Figtree at standardized sizes
- 66px universal padding
- 1440px max container width

---

## Page Layout Structure

### 1. Hero Section

**Dimensions**: Full width container, 400-500px height

**Background**:

- Color: `#FFFBF5` (cream)
- No overlay for hero text section

**Text Positioning**:

```typescript
// Centered text layout
style={{
  paddingTop: "193px",    // From top of page
  paddingBottom: "80px",  // py-20
  textAlign: "center"
}}
```

**Typography**:

- **Page Title**:
  - Font: Figtree, sans-serif
  - Size: `63.55px`
  - Weight: `700` (Bold)
  - Color: `#333333` (dark text)
  - Text: "Events & Workshops"

- **Subheading**:
  - Font: Figtree, sans-serif
  - Size: `18px`
  - Weight: `400` (Regular)
  - Color: `#5E5E5E` (gray text)
  - Max Width: `800px` (centered)
  - Line Height: `1.6`
  - Text: "Join our healing community for transformative workshops, sound baths, and special events designed to support your wellness journey."

**Layout Structure**:

```typescript
<ResponsiveContainer className="py-20">
  <div className="text-center mb-16">
    <h1 style={{
      fontSize: "63.55px",
      fontWeight: 700,
      fontFamily: "Figtree, sans-serif",
      color: "#333333",
      marginBottom: "24px"
    }}>
      Events & Workshops
    </h1>
    <p style={{
      fontSize: "18px",
      fontWeight: 400,
      fontFamily: "Figtree, sans-serif",
      color: "#5E5E5E",
      maxWidth: "800px",
      margin: "0 auto",
      lineHeight: "1.6"
    }}>
      Join our healing community for transformative workshops...
    </p>
  </div>
</ResponsiveContainer>
```

### 2. Events Grid Section

**Section Background**:

- **Type**: Large section with blue overlay
- **Border Radius**: `30px`
- **Min Height**: `600px`
- **Margin**: `40px 0` (vertical spacing)

**Background Composition**:

```typescript
// Layer 1: Background Image
<img
  src="/img/community-highlights.jpg"
  alt="Sound healing bowl with mallet"
  className="absolute inset-0 w-full h-full object-cover"
  style={{ borderRadius: "30px" }}
/>

// Layer 2: Blue Overlay
<div
  className="absolute inset-0"
  style={{
    backgroundColor: "rgba(2, 5, 183, 0.44)",  // 44% opacity
    borderRadius: "30px"
  }}
/>
```

**Section Heading**:

```typescript
<div className="text-center mb-12">
  <h2 style={{
    fontFamily: "Figtree, Helvetica, sans-serif",
    fontSize: "48px",
    fontWeight: 700,
    lineHeight: "1.2",
    color: "#FFFFFF"  // White text on blue background
  }}>
    Upcoming Events &
  </h2>
  <h2 style={{
    fontFamily: "Figtree, Helvetica, sans-serif",
    fontSize: "48px",
    fontWeight: 700,
    lineHeight: "1.2",
    color: "#FFFFFF"
  }}>
    Community Highlights
  </h2>
</div>
```

**Grid Layout**:

```typescript
// Desktop: 2 columns
// Tablet: 2 columns
// Mobile: 1 column

<div
  className="grid grid-cols-1 md:grid-cols-2 gap-8 mx-auto"
  style={{ maxWidth: "1100px" }}
>
  {events.map(event => <EventCard key={event.id} {...event} />)}
</div>
```

**Spacing**:

- Container max width: `1100px` (within 1440px layout)
- Grid gap: `32px` (gap-8)
- Side padding: Maintains 66px buffer from page edges
- Top/bottom padding: `80px` (py-20)

### 3. Pagination Section

**Positioning**: Below event grid, centered

**Pagination Dots**:

```typescript
<div className="flex justify-center gap-2 mb-6">
  {/* Active dot */}
  <div
    className="rounded-full"
    style={{
      width: "10px",
      height: "10px",
      backgroundColor: "#63D5F9"  // Cyan - active state
    }}
  />

  {/* Inactive dots */}
  <div
    className="rounded-full"
    style={{
      width: "10px",
      height: "10px",
      backgroundColor: "rgba(99, 213, 249, 0.5)"  // 50% opacity
    }}
  />

  {/* Repeat for total page count */}
</div>
```

**Specifications**:

- Dot size: `10px × 10px`
- Gap between dots: `8px` (gap-2)
- Active color: `#63D5F9` (cyan)
- Inactive color: `rgba(99, 213, 249, 0.5)` (50% opacity)
- Shape: Perfect circle (`border-radius: 50%`)

### 4. View Full Calendar CTA

**Button Style**: Ghost button (transparent with white border)

```typescript
<a
  href={ctaButton.href}
  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full transition-colors duration-200"
  style={{
    backgroundColor: "transparent",
    border: "2px solid white",
    color: "white",
    fontFamily: "Figtree, Helvetica, sans-serif",
    fontSize: "16px",
    fontWeight: "500"
  }}
>
  {ctaButton.text}
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
</a>
```

**Hover State**:

```typescript
// On hover: Add slight white background
onMouseEnter={(e) => {
  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
}}
onMouseLeave={(e) => {
  e.currentTarget.style.backgroundColor = "transparent";
}}
```

**Specifications**:

- Border: `2px solid white`
- Text color: `#FFFFFF`
- Font size: `16px`
- Font weight: `500` (Medium)
- Padding: `12px 24px` (py-3 px-6)
- Border radius: `100px` (rounded-full)
- Icon: Right-pointing chevron (`w-5 h-5`)
- Transition: `duration-200` for smooth hover

---

## Event Card Component Specifications

### Visual Design

**Card Container**:

```typescript
<div
  className="bg-white flex flex-col items-center text-center"
  style={{
    borderRadius: "20px",
    padding: "30px",
    position: "relative",
    zIndex: 1
  }}
>
```

**Card Dimensions**:

- Width: Flexible (fills grid column)
- Padding: `30px` (all sides)
- Border radius: `20px`
- Background: `#FFFFFF` (white)

**Card Structure**:

```
┌─────────────────────────┐
│                         │
│   [Event Image]         │  ← 200px height, 20px radius
│                         │
├─────────────────────────┤
│                         │
│   Event Title           │  ← 22px Figtree Bold
│   (max 2 lines)         │
│                         │
├─────────────────────────┤
│                         │
│   [Learn More Button]   │  ← Ghost button style
│                         │
└─────────────────────────┘
     30px padding
```

### Event Image

**Specifications**:

```typescript
<div
  className="w-full overflow-hidden mb-4"
  style={{
    borderRadius: "20px",
    height: "200px"
  }}
>
  <img
    src={event.image.src}
    alt={event.image.alt}
    className="w-full h-full object-cover"
  />
</div>
```

- **Dimensions**: Full card width × `200px` height
- **Border radius**: `20px`
- **Object fit**: `cover` (maintains aspect ratio, fills container)
- **Margin bottom**: `16px` (mb-4)

### Event Title

**Specifications**:

```typescript
<h3
  className="font-semibold mb-4"
  style={{
    fontFamily: "Figtree, Helvetica, sans-serif",
    fontSize: "22px",
    fontWeight: 600,
    color: "#333333",
    lineHeight: "1.4"
  }}
>
  {event.title}
</h3>
```

- **Font**: Figtree, Helvetica, sans-serif
- **Size**: `22px`
- **Weight**: `600` (Semi-bold)
- **Color**: `#333333` (dark text)
- **Line height**: `1.4`
- **Margin bottom**: `16px` (mb-4)
- **Max lines**: 2 (truncate with ellipsis if needed)

### Learn More Button

**Specifications**:

```typescript
<button
  className="px-6 py-2 bg-transparent border-2 rounded-full transition-all duration-300 hover:shadow-lg"
  style={{
    borderColor: "#0205B7",
    color: "#0205B7",
    fontFamily: "Figtree, Helvetica, sans-serif",
    fontSize: "16px",
    fontWeight: "500"
  }}
>
  Learn More
</button>
```

- **Border**: `2px solid #0205B7`
- **Text color**: `#0205B7` (brand blue)
- **Background**: `transparent`
- **Font size**: `16px`
- **Font weight**: `500` (Medium)
- **Padding**: `8px 24px` (py-2 px-6)
- **Border radius**: `100px` (rounded-full)
- **Transition**: `duration-300` for smooth hover

### Hover States

**Button Hover**:

```css
/* On hover */
&:hover {
  box-shadow: 0 10px 20px rgba(2, 5, 183, 0.2);
  transform: translateY(-2px);
}
```

**Card Hover** (optional enhancement):

```css
/* Subtle lift on card hover */
&:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(2, 5, 183, 0.15);
}
```

### Animation

**Entry Animation**:

```typescript
// Wrap in AnimatedSection
<AnimatedSection animation="scaleIn" delay={0.1} threshold={0.2}>
  <EventCard {...event} />
</AnimatedSection>
```

- **Animation type**: `scaleIn` (scales from 0.9 to 1.0)
- **Duration**: `0.6s`
- **Easing**: `ease-out`
- **Delay**: Stagger by `0.1s` per card

---

## Color and Typography Map

### Colors Used

#### Section Backgrounds

**Main Page Background**:

- Color: `#FFFBF5` (cream)
- Usage: Overall page background
- Where: `<div className="min-h-screen bg-[#FFFBF5]">`

**Events Section Background**:

- Base Image: `/img/community-highlights.jpg`
- Overlay: `rgba(2, 5, 183, 0.44)` (44% opacity blue)
- Border radius: `30px`
- Usage: Events grid container

#### Card Backgrounds

**Event Cards**:

- Color: `#FFFFFF` (white)
- Border radius: `20px`
- Padding: `30px`

#### Text Colors

**Page Title**:

- Color: `#333333` (dark text)
- Usage: "Events & Workshops" heading

**Page Subheading**:

- Color: `#5E5E5E` (gray text)
- Usage: Descriptive paragraph under title

**Section Heading (on blue background)**:

- Color: `#FFFFFF` (white)
- Usage: "Upcoming Events & Community Highlights"

**Event Card Title**:

- Color: `#333333` (dark text)
- Usage: Event names within white cards

**Button Text**:

- Color: `#0205B7` (brand blue) for card buttons
- Color: `#FFFFFF` (white) for CTA button on blue background

#### Accent Colors

**Pagination Dots Active**:

- Color: `#63D5F9` (cyan)
- Opacity: `100%`

**Pagination Dots Inactive**:

- Color: `rgba(99, 213, 249, 0.5)` (cyan)
- Opacity: `50%`

**Button Borders**:

- Color: `#0205B7` (brand blue) for card buttons
- Color: `#FFFFFF` (white) for CTA button

### Typography Scale

#### Page Title (H1)

```typescript
style={{
  fontFamily: "Figtree, sans-serif",
  fontSize: "63.55px",
  fontWeight: 700,
  lineHeight: "1.2",
  color: "#333333"
}}
```

#### Section Headings (H2)

```typescript
style={{
  fontFamily: "Figtree, Helvetica, sans-serif",
  fontSize: "48px",
  fontWeight: 700,
  lineHeight: "1.2",
  color: "#FFFFFF"  // On blue background
}}
```

#### Event Card Titles (H3)

```typescript
style={{
  fontFamily: "Figtree, Helvetica, sans-serif",
  fontSize: "22px",
  fontWeight: 600,
  lineHeight: "1.4",
  color: "#333333"
}}
```

#### Body Text

```typescript
style={{
  fontFamily: "Figtree, sans-serif",
  fontSize: "18px",
  fontWeight: 400,
  lineHeight: "1.6",
  color: "#5E5E5E"
}}
```

#### Button Text

```typescript
style={{
  fontFamily: "Figtree, Helvetica, sans-serif",
  fontSize: "16px",
  fontWeight: 500,
  lineHeight: "1.5"
}}
```

### Typography Summary Table

| Element         | Font Size | Weight | Line Height | Color              |
| --------------- | --------- | ------ | ----------- | ------------------ |
| Page Title      | 63.55px   | 700    | 1.2         | #333333            |
| Section Heading | 48px      | 700    | 1.2         | #FFFFFF            |
| Event Title     | 22px      | 600    | 1.4         | #333333            |
| Body Text       | 18px      | 400    | 1.6         | #5E5E5E            |
| Button Text     | 16px      | 500    | 1.5         | #0205B7 or #FFFFFF |

---

## Interactive Elements

### Event Card Interactions

**1. Hover State**:

```typescript
// Button hover
<button className="transition-all duration-300 hover:shadow-lg">
  // Shadow increases on hover
  // boxShadow: "0 10px 20px rgba(2, 5, 183, 0.2)"
  // Subtle lift: transform: "translateY(-2px)"
</button>
```

**2. Click/Tap Behavior**:

- **Action**: Navigate to event detail page
- **URL Pattern**: `/events/:slug` or `/events/:id`
- **Example**: Clicking "Full Moon Aerial Sound Bath" → `/events/full-moon-aerial-sound-bath`

**3. Loading State** (for async data):

```typescript
// Skeleton card while loading
<div className="animate-pulse bg-white rounded-[20px] p-[30px]">
  <div className="bg-gray-200 h-[200px] rounded-[20px] mb-4" />
  <div className="bg-gray-200 h-[22px] w-3/4 rounded mb-4" />
  <div className="bg-gray-200 h-[40px] w-1/2 rounded-full" />
</div>
```

### Filter/Search (Future Enhancement)

**Note**: Filtering is **not designed in Figma** but would be a logical addition.

**Recommended Filter Implementation**:

```typescript
// Filter bar above event grid
<div className="mb-8 flex gap-4 justify-center flex-wrap">
  <button className="filter-btn">All Events</button>
  <button className="filter-btn">Sound Baths</button>
  <button className="filter-btn">Workshops</button>
  <button className="filter-btn">Reiki Sessions</button>
</div>

// Filter button style
.filter-btn {
  padding: 8px 20px;
  border-radius: 100px;
  border: 2px solid #0205B7;
  background: transparent;
  color: #0205B7;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
}

.filter-btn.active {
  background: #0205B7;
  color: white;
}
```

**Search Input** (if needed):

```typescript
<input
  type="text"
  placeholder="Search events..."
  className="px-6 py-3 rounded-full border-2 border-gray-300"
  style={{
    fontFamily: "Figtree, sans-serif",
    fontSize: "16px",
    maxWidth: "400px",
    width: "100%"
  }}
/>
```

### Registration CTA

**Current Design**: "Learn More" button on each card

**Future Enhancement**: Add registration state indicators

```typescript
// Event card with registration status
{event.status === 'available' && (
  <button className="ghost-button-blue">
    Register Now
  </button>
)}

{event.status === 'sold-out' && (
  <div className="sold-out-badge">
    Sold Out
  </div>
)}

{event.status === 'waitlist' && (
  <button className="ghost-button-blue">
    Join Waitlist
  </button>
)}
```

**Sold Out Badge Style**:

```typescript
<div style={{
  backgroundColor: "rgba(51, 51, 51, 0.1)",
  color: "#333333",
  padding: "8px 24px",
  borderRadius: "100px",
  fontSize: "16px",
  fontWeight: "500",
  fontFamily: "Figtree, sans-serif"
}}>
  Sold Out
</div>
```

### Pagination Controls

**Current Design**: Dots only (visual indicator)

**Enhanced Navigation** (recommended):

```typescript
<div className="flex items-center justify-center gap-4 mt-6">
  {/* Previous button */}
  <button
    className="w-10 h-10 rounded-full border-2 border-white text-white
               hover:bg-white hover:text-[#0205B7] transition-colors"
    onClick={() => setPage(page - 1)}
    disabled={page === 0}
  >
    ‹
  </button>

  {/* Dots */}
  <div className="flex gap-2">
    {pages.map((_, idx) => (
      <button
        key={idx}
        className="w-3 h-3 rounded-full transition-colors"
        style={{
          backgroundColor: idx === page
            ? "#63D5F9"
            : "rgba(99, 213, 249, 0.5)"
        }}
        onClick={() => setPage(idx)}
      />
    ))}
  </div>

  {/* Next button */}
  <button
    className="w-10 h-10 rounded-full border-2 border-white text-white
               hover:bg-white hover:text-[#0205B7] transition-colors"
    onClick={() => setPage(page + 1)}
    disabled={page === pages.length - 1}
  >
    ›
  </button>
</div>
```

---

## Responsive Behavior

### Breakpoint Specifications

#### Desktop (1440px+)

**Grid Layout**:

```typescript
<div className="grid grid-cols-2 gap-8 mx-auto" style={{ maxWidth: "1100px" }}>
```

- **Columns**: 2
- **Gap**: `32px` (gap-8)
- **Card size**: ~534px width (calculated from grid)
- **Container max width**: `1100px`

**Spacing**:

- Side padding: `66px` (universal buffer)
- Section padding: `80px` vertical (py-20)
- Card padding: `30px` all sides

**Typography**:

- Page title: `63.55px`
- Section heading: `48px`
- Event title: `22px`
- Body text: `18px`

#### Tablet (768px - 1439px)

**Grid Layout**:

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
```

- **Columns**: 2
- **Gap**: `24px` (gap-6)
- **Card size**: Flexible width to fill column

**Adjustments**:

- Side padding: `40px` (reduced from 66px)
- Section padding: `60px` vertical (py-15)
- Card padding: `24px` all sides
- Image height: `180px` (reduced from 200px)

**Typography Scaling**:

- Page title: `48px` (reduced from 63.55px)
- Section heading: `40px` (reduced from 48px)
- Event title: `20px` (reduced from 22px)
- Body text: `16px` (reduced from 18px)

#### Mobile (< 768px)

**Grid Layout**:

```typescript
<div className="grid grid-cols-1 gap-4">
```

- **Columns**: 1 (stack vertically)
- **Gap**: `16px` (gap-4)
- **Card size**: Full width minus padding

**Stack Behavior**:

- All cards stack vertically
- Full-width cards
- Increased touch target sizes

**Adjustments**:

- Side padding: `20px` (reduced from 66px)
- Section padding: `40px` vertical (py-10)
- Card padding: `20px` all sides
- Image height: `160px` (reduced from 200px)
- Border radius: `16px` (slightly reduced from 20px)

**Typography Scaling**:

- Page title: `36px` (reduced from 63.55px)
- Section heading: `32px` (reduced from 48px)
- Event title: `18px` (reduced from 22px)
- Body text: `16px`
- Button text: `14px` (reduced from 16px)

**Touch Target Sizes**:

- Minimum button size: `44px × 44px`
- Increased padding on interactive elements
- Larger touch areas for pagination dots

### Responsive Code Example

```typescript
export const EventsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FFFBF5]">
      {/* Container with responsive padding */}
      <div
        className="relative mx-auto overflow-hidden"
        style={{
          maxWidth: "1440px",
          backgroundColor: "#FFFBF5",
          boxShadow: "0 0 40px rgba(0, 0, 0, 0.1)"
        }}
      >
        {/* Hero - responsive padding */}
        <div className="px-5 sm:px-10 lg:px-[66px] py-10 sm:py-16 lg:py-20">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-[63.55px] font-bold
                           text-[#333333] mb-4 sm:mb-6"
                style={{ fontFamily: "Figtree, sans-serif" }}>
              Events & Workshops
            </h1>
            <p className="text-base sm:text-lg max-w-3xl mx-auto text-[#5E5E5E]"
               style={{ fontFamily: "Figtree, sans-serif", lineHeight: "1.6" }}>
              Join our healing community...
            </p>
          </div>
        </div>

        {/* Events Grid - responsive columns and gap */}
        <section className="relative py-10 sm:py-16 lg:py-20 overflow-hidden"
                 style={{ borderRadius: "20px sm:25px lg:30px" }}>
          {/* Background + Overlay (same on all sizes) */}

          {/* Grid */}
          <div className="relative z-10 px-5 sm:px-10 lg:px-[66px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8
                            mx-auto" style={{ maxWidth: "1100px" }}>
              {events.map(event => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
```

---

## Component Reuse Opportunities

### 1. CommunityEvents Component

**Current Implementation**: `/packages/shared-components/src/CommunityEvents/CommunityEvents.tsx`

**Reusable Parts**:

✅ **Section Container Structure**:

```typescript
// Blue overlay background pattern
<section className="relative py-20 overflow-hidden" style={{
  minHeight: "600px",
  borderRadius: "30px",
  margin: "40px 0"
}}>
  <div className="absolute inset-0">
    <img src={bgImage} className="absolute inset-0 w-full h-full object-cover"
         style={{ borderRadius: "30px" }} />
    <div className="absolute inset-0" style={{
      backgroundColor: "rgba(2, 5, 183, 0.44)",
      borderRadius: "30px"
    }} />
  </div>
  <div className="relative z-10">{/* Content */}</div>
</section>
```

**Use for**: Events page grid section background

✅ **Event Card Structure**:

```typescript
<div className="bg-white flex flex-col items-center text-center" style={{
  borderRadius: "20px",
  padding: "30px"
}}>
  <div className="w-full overflow-hidden mb-4" style={{
    borderRadius: "20px",
    height: "200px"
  }}>
    <img src={event.image} className="w-full h-full object-cover" />
  </div>
  <h3 style={{
    fontFamily: "Figtree, Helvetica, sans-serif",
    fontSize: "22px",
    color: "#333333"
  }}>
    {event.title}
  </h3>
  <button className="ghost-button-blue">Learn More</button>
</div>
```

**Use for**: Individual event cards (exact same design)

✅ **Pagination Dots Pattern**:

```typescript
<div className="flex justify-center gap-2 mb-6">
  <div className="rounded-full" style={{
    width: "10px",
    height: "10px",
    backgroundColor: "#63D5F9"
  }} />
  {/* ... more dots */}
</div>
```

**Use for**: Events page pagination

✅ **Ghost Button (White on Blue)**:

```typescript
<a
  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full"
  style={{
    backgroundColor: "transparent",
    border: "2px solid white",
    color: "white",
    fontSize: "16px",
    fontWeight: "500"
  }}
>
  {text}
  <svg className="w-5 h-5">...</svg>
</a>
```

**Use for**: "View Full Calendar" CTA

**Needed Modifications**:

⚠️ **Make Grid Dynamic**:

```typescript
// Current: Hardcoded 2 cards
// Needed: Dynamic event list from props/API

interface CommunityEventsProps {
  events: EventCard[]; // Accept array of any length
  itemsPerPage?: number;
  enablePagination?: boolean;
}
```

⚠️ **Add Pagination Logic**:

```typescript
// Current: Static dots for visual only
// Needed: Functional pagination

const [currentPage, setCurrentPage] = useState(0);
const startIdx = currentPage * itemsPerPage;
const visibleEvents = events.slice(startIdx, startIdx + itemsPerPage);
```

⚠️ **Responsive Grid**:

```typescript
// Current: Fixed 2-column grid
// Needed: Responsive breakpoints

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
```

### 2. Patterns from Other Pages

#### Hero Pattern from Contact/About

**Source**: `/packages/shared-components/src/pages/ContactPage.tsx` (lines 55-69)

```typescript
<div className="text-center pt-[193px] pb-20">
  <h1 className="text-[63.55px] font-bold text-black mb-[92px]"
      style={{ fontFamily: "Figtree, sans-serif" }}>
    Get in Touch
  </h1>
  <p className="text-[16px] font-medium text-[#1C1B1B]"
     style={{ fontFamily: "Figtree, sans-serif" }}>
    Have questions or want to book a session?
  </p>
</div>
```

**Use for**: Events page hero section (exact same pattern, different text)

#### Card Bevel Pattern from Services

**Source**: `/packages/shared-components/src/Services/ServicesSection.tsx`

```typescript
// Blue bevel background
<div className="absolute inset-0" style={{
  backgroundColor: "#0205B7",
  borderRadius: "20px",
  transform: "translateY(5px)",
  zIndex: 0
}} />

// White card on top
<div className="relative" style={{
  backgroundColor: "#FFFFFF",
  borderRadius: "20px",
  zIndex: 1
}}>
```

**Potential Use**: If you want to add bevel effect to event cards (not in current Figma design, but would match brand)

#### Gradient Effects from Homepage

**Source**: Multiple components use blue-to-cyan gradient on hover

```typescript
<div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
     style={{
       background: "linear-gradient(135deg, #0205B7 0%, rgba(99, 213, 249, 1) 100%)"
     }} />
```

**Potential Use**: Enhanced hover state for event cards

---

## Missing Design Elements

### 1. Event Detail Page Design

**Status**: ❌ **Not found in Figma screenshots**

**What's Missing**:

- Full event detail layout
- Large hero image specifications
- Event metadata display (date, time, location, price)
- Description formatting
- Registration form placement
- "Back to Events" navigation

**Recommendation**: **Extend existing patterns from Services/About pages**

**Suggested Layout**:

```typescript
// Event Detail Page Structure
<div className="min-h-screen bg-[#FFFBF5]">
  {/* Hero with event image + blue overlay */}
  <section className="relative h-[400px] rounded-[30px] overflow-hidden">
    <img src={event.heroImage} className="absolute inset-0" />
    <div className="absolute inset-0 bg-[#0205B7] opacity-35" />
    <div className="relative z-10 flex items-center justify-center h-full">
      <h1 className="text-white text-[63.55px] font-bold">
        {event.title}
      </h1>
    </div>
  </section>

  {/* Event Details */}
  <div className="max-w-[1100px] mx-auto px-[66px] py-20">
    {/* Meta information cards */}
    <div className="grid grid-cols-4 gap-6 mb-12">
      <EventMetaCard icon="calendar" label="Date" value={event.date} />
      <EventMetaCard icon="clock" label="Time" value={event.time} />
      <EventMetaCard icon="location" label="Location" value={event.location} />
      <EventMetaCard icon="ticket" label="Price" value={event.price} />
    </div>

    {/* Description */}
    <div className="prose max-w-none mb-12">
      <h2 className="text-[48px] font-bold text-[#333333]">About This Event</h2>
      <div dangerouslySetInnerHTML={{ __html: event.description }} />
    </div>

    {/* Registration CTA */}
    <div className="text-center">
      <button className="px-12 py-4 bg-[#0205B7] text-white rounded-full text-[18px] font-medium">
        Register Now
      </button>
    </div>
  </div>
</div>
```

### 2. Registration Form Design

**Status**: ❌ **Not found in Figma (no dedicated events registration form)**

**What Exists**: Contact form design at `/figma-screenshots/contact/`

**Recommendation**: **Use existing Contact page form patterns**

**Source**: `/packages/shared-components/src/FigmaContactForm/FigmaContactForm.tsx`

**Adaptation Needed**:

```typescript
// Extend contact form for event registration
<FigmaContactForm
  formType="event-registration"
  eventId={event.id}
  fields={[
    { name: "name", type: "text", required: true },
    { name: "email", type: "email", required: true },
    { name: "phone", type: "tel", required: true },
    { name: "numberOfTickets", type: "number", required: true, min: 1, max: event.spotsRemaining },
    { name: "specialRequirements", type: "textarea", required: false }
  ]}
  onSubmit={handleEventRegistration}
/>
```

**Form Styling**: Use exact same styles as contact form:

- White card background
- Blue labels (#0205B7)
- 8px input border radius
- Submit button: Blue filled button
- Figtree typography throughout

### 3. Calendar/Date Picker Design

**Status**: ❌ **Not found in Figma**

**Current "View Full Calendar" CTA**: Links out, but no integrated calendar view designed

**Options**:

**Option A**: External calendar integration (recommended for MVP)

- Link to Google Calendar
- Link to external booking system
- Simplest implementation

**Option B**: Custom calendar component (future enhancement)

```typescript
// Month view calendar
<Calendar
  events={events}
  onDateClick={(date) => filterEventsByDate(date)}
  highlightDates={events.map(e => e.date)}
  themeColors={{
    primary: "#0205B7",
    accent: "#63D5F9",
    background: "#FFFBF5"
  }}
/>
```

**If building custom calendar, follow brand patterns**:

- Use Figtree font
- Blue (#0205B7) for selected dates
- Cyan (#63D5F9) for hover states
- White cards with 20px border radius
- 66px padding in container

### 4. Past Events Display

**Status**: ❌ **Not designed**

**Question**: Should past events be shown? If yes, how?

**Recommendation**: **Simple archive section below upcoming events**

```typescript
<section className="py-20">
  <h2 className="text-[48px] font-bold text-center mb-12 text-[#333333]">
    Past Events
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {pastEvents.map(event => (
      <PastEventCard key={event.id} {...event} />
    ))}
  </div>
</section>
```

**Past Event Card Modifications**:

- Grayscale image filter
- "Event Completed" badge instead of "Learn More" button
- Link to recap/photos if available

### 5. Loading States

**Status**: ❌ **Not designed**

**Recommendation**: **Use skeleton loading pattern**

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
  {[...Array(4)].map((_, idx) => (
    <div key={idx} className="animate-pulse bg-white rounded-[20px] p-[30px]">
      <div className="bg-gray-200 h-[200px] rounded-[20px] mb-4" />
      <div className="bg-gray-200 h-[22px] w-3/4 rounded mb-4" />
      <div className="bg-gray-200 h-[40px] w-1/2 rounded-full" />
    </div>
  ))}
</div>
```

### 6. Empty State

**Status**: ❌ **Not designed**

**Recommendation**: **Friendly message when no events**

```typescript
<div className="text-center py-20">
  <div className="text-[72px] mb-4">🔮</div>
  <h3 className="text-[32px] font-bold text-[#333333] mb-4">
    No Upcoming Events
  </h3>
  <p className="text-[18px] text-[#5E5E5E] mb-8">
    Check back soon for new healing workshops and sound baths.
  </p>
  <button className="ghost-button-blue">
    Subscribe for Updates
  </button>
</div>
```

---

## Figma Screenshot Inventory

### Images Found

#### Primary Design Source

**Main Community Events Section**:

- Path: `/figma-screenshots/homepage/sections/Frame 24-Community-Events-Section.png`
- Shows: Complete events section with 2 event cards, pagination dots, and CTA button
- Resolution: High-quality screenshot suitable for measurement
- **This is the primary design source**

**Section Heading Overlay**:

- Path: `/figma-screenshots/homepage/overlays/Community Events Overlay/Upcoming Events & Community Highlights.png`
- Shows: Section title text only
- Note: Text appears blank in this isolated overlay (title is visible in main section)

#### Event Images

**Full Moon Sound Bath Event**:

- Path: `/figma-screenshots/homepage/images/download 1-full-moon-soundbath.png`
- Shows: Singing bowl with smoke, healing stones, and candles
- Dimensions: 200px height (as implemented)
- Used in: First event card

**Custom Sound Healing Workshop**:

- Path: `/figma-screenshots/homepage/images/Rectangle 4-custom-sound-healing-song-workshop.png`
- Shows: Practitioner performing sound healing on client
- Dimensions: 200px height (as implemented)
- Used in: Second event card

**Fullmoon Aerial Soundbath** (alternate):

- Path: `/figma-screenshots/homepage/images/Rectangle 4-fullmoon-aerial-soundbath.png`
- Shows: Alternative event image
- Note: Used as carousel variation in current implementation

#### Background Images

**Community Highlights Background**:

- Path: `/figma-screenshots/homepage/images/2148847564-upcoming-events-community-highlights.png`
- Shows: Singing bowl and mallet (used as section background)
- Usage: Background for events section with 44% blue overlay
- Also at: `/figma-screenshots/homepage/images/2148847564 1-Community Highlights Section Image.png`
- Also at: `/figma-screenshots/homepage/images/Community Highlights.jpg`

**Additional Event Images** (referenced but not visible in screenshots):

- Path: `/figma-screenshots/homepage/images/download (1)-sowin.png` (Samhain event)
- Path: `/figma-screenshots/homepage/images/download (2).png` (generic event image)
- Path: `/figma-screenshots/homepage/images/download 1.png` (duplicate?)

#### Component Overlays

**Event Card Components**:

- Path: `/figma-screenshots/homepage/overlays/Community Events Overlay/Group 4.png`
- Shows: Individual card elements (mostly blank in isolation)
- Path: `/figma-screenshots/homepage/overlays/Community Events Overlay/Group 5.png`
- Shows: Additional card elements

**Navigation Elements**:

- Path: `/figma-screenshots/homepage/overlays/Community Events Overlay/Frame 22.png`
- Shows: Single pagination dot (cyan color #63D5F9)
- Confirms: 10px × 10px dot size

- Path: `/figma-screenshots/homepage/overlays/Community Events Overlay/Frame 23.png`
- Shows: White decorative element (not clearly visible)

**Text Overlays**:

- Path: `/figma-screenshots/homepage/overlays/Community Events Overlay/Real Healing. Real People. Real Stories..png`
- Shows: Text content (appears to be for testimonials section, not events)
- Path: `/figma-screenshots/homepage/overlays/Community Events Overlay/What My Clients Are Saying.png`
- Shows: Testimonials heading (not events-related)

- Path: `/figma-screenshots/homepage/overlays/Community Events Overlay/Frame 25.png`
- Path: `/figma-screenshots/homepage/overlays/Community Events Overlay/Frame 26.png`
- Note: Testimonial card frames, not events

#### View Full Calendar Button

- Path: `/figma-screenshots/homepage/images/view-full-calendar-elipses.png`
- Shows: Ellipses/dots decoration (not found in clean screenshot)
- Note: Button design is visible in main section screenshot

### Icons/SVGs

**No dedicated event icons found in screenshots**

**Potential Icon Needs**:

- Calendar icon (for date)
- Clock icon (for time)
- Location pin icon (for venue)
- Ticket icon (for pricing/registration)
- Arrow icon (used in CTA button - implemented with inline SVG)

**Recommendation**: Use inline SVG icons matching existing patterns:

```typescript
// Calendar icon
<svg className="w-6 h-6" fill="none" stroke="currentColor">
  <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
</svg>
```

### Background Images

**Primary Background**:

- `/figma-screenshots/homepage/images/Community Highlights.jpg`
- Used with 44% blue overlay (#0205B7)
- Dimensions: Full section width/height
- Object fit: cover

**Note**: All background images should maintain aspect ratio with `object-fit: cover` and have `border-radius: 30px` applied.

---

## Implementation Guidelines

### Step 1: Create Page Structure

```typescript
// /packages/shared-components/src/pages/EventsPage.tsx

import React, { useState } from "react";
import { AnimatedSection } from "../AnimatedSection";
import { CommunityEvents } from "../CommunityEvents/CommunityEvents";
import { ResponsiveContainer } from "../ResponsiveContainer";
import type { EventCard } from "../CommunityEvents/CommunityEvents";

export const EventsPage: React.FC = () => {
  // TODO: Replace with API call
  const [events, setEvents] = useState<EventCard[]>([]);

  return (
    <div className="min-h-screen bg-[#FFFBF5]">
      <div
        className="relative mx-auto overflow-hidden"
        style={{
          maxWidth: "1440px",
          backgroundColor: "#FFFBF5",
          boxShadow: "0 0 40px rgba(0, 0, 0, 0.1)"
        }}
      >
        {/* Hero Section */}
        <AnimatedSection animation="fadeInUp" delay={0.1}>
          <ResponsiveContainer className="py-20">
            <div className="text-center mb-16">
              <h1
                className="text-4xl sm:text-5xl lg:text-[63.55px] font-bold
                           text-[#333333] mb-6"
                style={{ fontFamily: "Figtree, sans-serif" }}
              >
                Events & Workshops
              </h1>
              <p
                className="text-base sm:text-lg lg:text-xl text-[#5E5E5E]
                           max-w-3xl mx-auto"
                style={{
                  fontFamily: "Figtree, sans-serif",
                  lineHeight: "1.6"
                }}
              >
                Join our healing community for transformative workshops, sound
                baths, and special events designed to support your wellness
                journey.
              </p>
            </div>
          </ResponsiveContainer>
        </AnimatedSection>

        {/* Events Section */}
        <AnimatedSection animation="scaleIn" delay={0.2} threshold={0.2}>
          <CommunityEvents
            heading="Upcoming Events &"
            subheading="Community Highlights"
            events={events}
            ctaButton={{
              text: "View Full Calendar",
              href: "/calendar"
            }}
          />
        </AnimatedSection>
      </div>
    </div>
  );
};
```

### Step 2: Enhance CommunityEvents Component

**Current Location**: `/packages/shared-components/src/CommunityEvents/CommunityEvents.tsx`

**Modifications Needed**:

```typescript
// Add pagination support
export interface CommunityEventsProps {
  heading?: string;
  subheading?: string;
  events: EventCard[];
  itemsPerPage?: number;
  enablePagination?: boolean;
  ctaButton?: {
    text: string;
    href: string;
    onClick?: () => void;
  };
  className?: string;
}

export const CommunityEvents: React.FC<CommunityEventsProps> = ({
  heading = "Upcoming Events &",
  subheading = "Community Highlights",
  events = [],
  itemsPerPage = 2,
  enablePagination = true,
  ctaButton,
  className = ""
}) => {
  const [currentPage, setCurrentPage] = useState(0);

  // Calculate visible events
  const totalPages = Math.ceil(events.length / itemsPerPage);
  const startIdx = currentPage * itemsPerPage;
  const visibleEvents = events.slice(startIdx, startIdx + itemsPerPage);

  return (
    <section className={`relative py-20 overflow-hidden ${className}`} style={{
      minHeight: "600px",
      borderRadius: "30px",
      margin: "40px 0"
    }}>
      {/* Background + Overlay (existing code) */}

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Heading (existing code) */}

        {/* Events Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mx-auto"
          style={{ maxWidth: "1100px" }}
        >
          {visibleEvents.length > 0 ? (
            visibleEvents.map(event => (
              <EventCard key={event.id} {...event} />
            ))
          ) : (
            <EmptyState />
          )}
        </div>

        {/* Pagination */}
        {enablePagination && totalPages > 1 && (
          <div className="mt-12">
            <div className="flex justify-center gap-2 mb-6">
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  className="rounded-full cursor-pointer transition-colors"
                  style={{
                    width: "10px",
                    height: "10px",
                    backgroundColor: idx === currentPage
                      ? "#63D5F9"
                      : "rgba(99, 213, 249, 0.5)"
                  }}
                  onClick={() => setCurrentPage(idx)}
                  aria-label={`Page ${idx + 1}`}
                />
              ))}
            </div>

            {/* CTA Button (existing code) */}
          </div>
        )}
      </div>
    </section>
  );
};
```

### Step 3: Create EventCard Component (if extracting)

```typescript
// /packages/shared-components/src/EventCard/EventCard.tsx

interface EventCardProps {
  id: string;
  title: string;
  image: {
    src: string;
    alt: string;
  };
  date?: string;
  description?: string;
  onClick?: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  title,
  image,
  onClick
}) => {
  return (
    <div
      className="bg-white flex flex-col items-center text-center cursor-pointer
                 transition-transform duration-300 hover:-translate-y-1"
      style={{
        borderRadius: "20px",
        padding: "30px"
      }}
      onClick={onClick}
    >
      {/* Image */}
      <div
        className="w-full overflow-hidden mb-4"
        style={{
          borderRadius: "20px",
          height: "200px"
        }}
      >
        <img
          src={image.src}
          alt={image.alt}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Title */}
      <h3
        className="font-semibold mb-4"
        style={{
          fontFamily: "Figtree, Helvetica, sans-serif",
          fontSize: "22px",
          fontWeight: 600,
          color: "#333333",
          lineHeight: "1.4"
        }}
      >
        {title}
      </h3>

      {/* CTA Button */}
      <button
        className="px-6 py-2 bg-transparent border-2 rounded-full
                   transition-all duration-300 hover:shadow-lg"
        style={{
          borderColor: "#0205B7",
          color: "#0205B7",
          fontFamily: "Figtree, Helvetica, sans-serif",
          fontSize: "16px",
          fontWeight: "500"
        }}
      >
        Learn More
      </button>
    </div>
  );
};
```

### Step 4: Add Loading State

```typescript
const LoadingSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    {[...Array(4)].map((_, idx) => (
      <div
        key={idx}
        className="animate-pulse bg-white rounded-[20px] p-[30px]"
      >
        <div className="bg-gray-200 h-[200px] rounded-[20px] mb-4" />
        <div className="bg-gray-200 h-[22px] w-3/4 rounded mb-4 mx-auto" />
        <div className="bg-gray-200 h-[40px] w-1/2 rounded-full mx-auto" />
      </div>
    ))}
  </div>
);

// In EventsPage
{loading ? <LoadingSkeleton /> : <CommunityEvents events={events} />}
```

### Step 5: Add Empty State

```typescript
const EmptyState: React.FC = () => (
  <div className="col-span-full text-center py-20">
    <div className="text-6xl mb-4">🔮</div>
    <h3
      className="text-3xl font-bold mb-4"
      style={{
        fontFamily: "Figtree, sans-serif",
        color: "#333333"
      }}
    >
      No Upcoming Events
    </h3>
    <p
      className="text-lg mb-8"
      style={{
        fontFamily: "Figtree, sans-serif",
        color: "#5E5E5E"
      }}
    >
      Check back soon for new healing workshops and sound baths.
    </p>
    <button
      className="px-8 py-3 bg-transparent border-2 border-[#0205B7]
                 text-[#0205B7] rounded-full hover:bg-[#0205B7]
                 hover:text-white transition-colors"
      style={{
        fontFamily: "Figtree, sans-serif",
        fontSize: "16px",
        fontWeight: "500"
      }}
    >
      Subscribe for Updates
    </button>
  </div>
);
```

### Step 6: Testing Checklist

Before considering the implementation complete, verify:

- [ ] **Visual Accuracy**: Matches Figma screenshot pixel-perfectly
  - Card dimensions: 20px radius, 30px padding
  - Image height: 200px
  - Typography: Figtree at correct sizes
  - Colors: Exact hex values used

- [ ] **Responsive Behavior**:
  - Mobile (< 768px): Single column, 20px padding
  - Tablet (768-1439px): 2 columns, 40px padding
  - Desktop (1440px+): 2 columns, 66px padding
  - Touch targets minimum 44px

- [ ] **Interactive Elements**:
  - Card hover: Subtle lift
  - Button hover: Shadow increase
  - Pagination: Clickable dots with visual feedback
  - CTA button: Hover state (white background tint)

- [ ] **Animations**:
  - Page loads with fadeInUp/scaleIn
  - Smooth transitions on all interactions
  - No jank or layout shift

- [ ] **Accessibility**:
  - All images have alt text
  - Buttons have aria-labels
  - Keyboard navigation works
  - Color contrast meets WCAG AA (4.5:1)
  - Focus states visible

- [ ] **Performance**:
  - Images lazy-loaded
  - Smooth scrolling
  - No unnecessary re-renders

### Step 7: Future Enhancements

**After MVP is complete, consider**:

1. **Filtering**: Add event type/category filters
2. **Search**: Search events by title/description
3. **Calendar View**: Integrated calendar picker
4. **Event Detail Page**: Full detail view with registration
5. **Sold Out States**: Visual indication of capacity
6. **Past Events Archive**: Historical event section
7. **Favorites**: Save events to user account

---

## Related Documents

- [Style Guide](/docs/design/style-guide.md) - Complete brand specifications
- [CommunityEvents Component](/packages/shared-components/src/CommunityEvents/CommunityEvents.tsx) - Source implementation
- [EventsPage Component](/packages/shared-components/src/pages/EventsPage.tsx) - Current page (to be enhanced)
- [Services Page Style Audit](/docs/design/services-page/style-compliance-audit.md) - Similar component patterns
- [Events Page Postmortem](/docs/archive/events-page-attempt-1-postmortem.md) - Lessons from previous attempt

---

**Document Status**: ✅ Complete
**Last Updated**: 2025-11-03
**Next Steps**: Begin frontend implementation using this specification
