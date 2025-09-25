# Component Analysis: Contact Page Google Maps Location

## Overview

Analysis of the existing Contact Page components to understand architecture and identify optimal integration points for Google Maps functionality.

## Current Contact Page Architecture

### Primary Components

#### 1. Contact.tsx (Main Page Router)

**Location:** `/apps/main/src/pages/Contact.tsx`
**Purpose:** Simple wrapper component that applies PageTransition animation

```typescript
- Imports ContactPage from @reiki-goddess/shared-components
- Wraps with PageTransition for Framer Motion animations
- Uses standard page-level architecture pattern
```

#### 2. ContactPage.tsx (Main Implementation)

**Location:** `/packages/shared-components/src/pages/ContactPage.tsx`
**Purpose:** Core contact page implementation with Figma-accurate design

```typescript
- Fully self-contained page component
- Uses AnimatedSection for scroll-triggered animations
- Implements fixed 1440px max-width container design
- Contains 5 main sections: Hero, Form, Contact Info, Map, CTA
```

**Component Structure:**

```
ContactPage
├── Hero Section (AnimatedSection delay: 0)
├── Form Section (AnimatedSection delay: 0.1)
├── Contact Info Cards (AnimatedSection delay: 0.2)
├── Map Section (AnimatedSection delay: 0.3) ← TARGET INTEGRATION POINT
└── CTA Section (AnimatedSection delay: 0.4)
```

#### 3. Supporting Components

**ContactInfoCard.tsx**

- Reusable card component with blue bevel effect
- Props: icon, title, content, ctaText, ctaLink
- Already includes location card with Google Maps link
- Responsive with hover animations

**FigmaContactForm.tsx**

- Complex form with security validation
- Uses shared-utils for security and rate limiting
- Comprehensive error handling and ARIA compliance
- Fixed styling matching Figma specifications

**AnimatedSection.tsx**

- Scroll-triggered animation wrapper
- Uses Intersection Observer API
- Configurable animation types and delays
- Provides consistent animation patterns across sections

**PageTransition.tsx**

- Framer Motion page-level animations
- Consistent entrance/exit transitions
- Applied at route level in main app

## Current Location Display Implementation

### Location Information

```typescript
// Current location data (line 131)
<ContactInfoCard
  icon="/images/mdi_location.svg"
  title="Our Location"
  content="Roy, Washington"
  ctaText="Get Directions"
  ctaLink="https://maps.google.com/?q=Roy,Washington"
/>
```

### Map Section (Current Implementation)

```typescript
// Static map image (lines 158-167)
<div className="w-full h-[598px] relative">
  <img
    src="/img/d6624918517b685d6082f92a43dde9ebf88b0832.png"
    alt="Location Map"
    className="w-full h-full object-cover"
    loading="lazy"
  />
</div>
```

**Current Characteristics:**

- Fixed height: 598px
- Full-width container
- Static PNG image
- Lazy loading enabled
- Basic alt text for accessibility

## Integration Points Analysis

### Primary Integration Point: Map Section

**Location:** Lines 157-167 in ContactPage.tsx
**Current Container:** `<div className="w-full h-[598px] relative">`

**Advantages:**

- Perfect placement in page flow
- Established animation timing (delay: 0.3)
- Appropriate dimensions and styling
- Already part of user journey expectation

**Integration Requirements:**

1. Replace static image with GoogleMapComponent
2. Maintain exact 598px height
3. Preserve lazy loading behavior
4. Keep AnimatedSection wrapper
5. Ensure full-width responsive behavior

### Secondary Integration: ContactInfoCard Enhancement

**Current Location Card:** Lines 127-134
**Enhancement Opportunity:** Add interactive map preview or enhanced location details

## State Management Approach

### Current State Architecture

```typescript
// ContactPage is stateless - no internal state management
// Form state is encapsulated in FigmaContactForm
// Animation state managed by AnimatedSection components
```

### Map State Requirements

```typescript
// Proposed state additions:
interface MapState {
  isLoaded: boolean;
  mapError?: string;
  userLocation?: google.maps.LatLng;
  directions?: google.maps.DirectionsResult;
}
```

### State Management Recommendations

1. **Keep state local** - No global state management needed
2. **Component-level state** - GoogleMapComponent manages own state
3. **Error boundaries** - Wrap map component for error handling
4. **Loading states** - Integrate with existing lazy loading patterns

## Responsive Design Patterns

### Current Breakpoint Strategy

```css
/* Mobile-first approach with consistent patterns */
- Base: Full mobile layout
- md: 768px+ (tablet and desktop adjustments)
- Container max-width: 1440px
- Padding: 66px on large screens, responsive on smaller
```

### Map Responsive Requirements

1. **Height scaling:** Maintain 598px on desktop, scale down on mobile
2. **Touch interactions:** Ensure mobile map controls work properly
3. **Performance:** Consider reduced features on mobile
4. **Loading:** Progressive enhancement approach

## Accessibility Considerations

### Current ARIA Implementation

```typescript
// Form has comprehensive ARIA labels
aria-invalid={!!errors.field}
aria-describedby="field-error"
```

### Map Accessibility Requirements

1. **Keyboard navigation:** Map must be fully keyboard accessible
2. **Screen readers:** Provide meaningful descriptions and landmarks
3. **Focus management:** Proper tab order and focus indicators
4. **Alternative content:** Text-based location information alongside map
5. **Color contrast:** Ensure map controls meet WCAG standards

### Recommended ARIA Labels

```typescript
// For map container
aria-label="Interactive map showing Reiki Goddess Healing location in Roy, Washington"
role="application"

// For map controls
aria-label="Zoom in"
aria-label="Get directions"
aria-label="View in full screen"
```

## Design System Integration

### Current Styling Approach

```typescript
// TailwindCSS with exact Figma specifications
- Colors: #FFFBF5 (background), #0205B7 (brand blue)
- Typography: Figtree (headings), Neue Montreal (body)
- Shadows: Precise box-shadow values from Figma
- Border radius: Consistent 17px for cards, 12px for inputs
```

### Map Styling Requirements

1. **Brand colors:** Integrate #0205B7 for custom map markers/controls
2. **Typography:** Match existing font stack for map labels
3. **Visual hierarchy:** Map should complement, not compete with other sections
4. **Loading states:** Match existing component loading patterns

## Performance Considerations

### Current Performance Patterns

```typescript
// Lazy loading implemented for images
loading="lazy"

// Animation delays for staggered loading
delay={0.1}, delay={0.2}, delay={0.3}
```

### Map Performance Requirements

1. **Lazy initialization:** Only load Google Maps when section is visible
2. **API key security:** Implement domain restrictions and usage limits
3. **Bundle size:** Consider async loading of maps API
4. **Mobile optimization:** Reduce map features on slower connections

## Component Hierarchy Changes

### Current Hierarchy

```
ContactPage
├── AnimatedSection (Hero)
├── AnimatedSection (Form)
├── AnimatedSection (Contact Cards)
├── AnimatedSection (Static Map) ← TARGET
└── AnimatedSection (CTA)
```

### Proposed Hierarchy

```
ContactPage
├── AnimatedSection (Hero)
├── AnimatedSection (Form)
├── AnimatedSection (Contact Cards)
├── AnimatedSection (Interactive Map)
│   └── GoogleMapComponent
│       ├── MapContainer
│       ├── CustomMarker
│       ├── DirectionsPanel (optional)
│       └── MapControls
└── AnimatedSection (CTA)
```

## Integration Strategy Recommendations

### 1. Map Placement (Recommended: Current Map Section)

**Why:**

- Perfect user flow positioning
- Established visual hierarchy
- Consistent with user expectations
- Preserves existing animation sequence

### 2. Component Structure (Recommended: Standalone GoogleMapComponent)

**Why:**

- Maintains separation of concerns
- Reusable across other pages if needed
- Easier testing and maintenance
- Clean integration with existing AnimatedSection pattern

### 3. State Management (Recommended: Component-level state)

**Why:**

- ContactPage remains stateless
- Map state is encapsulated and manageable
- No global state complexity
- Follows existing patterns

### 4. Responsive Strategy (Recommended: Progressive enhancement)

**Why:**

- Maintains mobile performance
- Preserves accessibility
- Fallback to static map if needed
- Consistent with existing responsive patterns

### 5. Loading Strategy (Recommended: Intersection Observer + lazy loading)

**Why:**

- Consistent with existing lazy loading patterns
- Optimal performance
- Maintains smooth page transitions
- Reduces initial bundle size

## Implementation Considerations

### Required Props Interface

```typescript
interface GoogleMapComponentProps {
  className?: string;
  height?: string; // Default: "598px"
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  onDirectionsClick?: () => void;
  showDirections?: boolean;
  ariaLabel?: string;
}
```

### Error Handling Strategy

```typescript
// Error boundary for map failures
<ErrorBoundary fallback={<StaticMapFallback />}>
  <GoogleMapComponent {...mapProps} />
</ErrorBoundary>
```

### Testing Considerations

1. **Unit tests:** Test component props and state management
2. **Integration tests:** Test map interactions and error states
3. **Accessibility tests:** Verify ARIA implementation
4. **Performance tests:** Monitor loading times and API usage
5. **Visual regression:** Ensure design consistency

## Summary

The Contact Page has a well-structured architecture that can seamlessly accommodate Google Maps integration. The optimal approach is to replace the static map image in the existing Map Section (lines 157-167) with an interactive GoogleMapComponent while preserving all existing patterns:

- **Animation timing and scroll triggers**
- **Responsive design and accessibility**
- **Visual hierarchy and spacing**
- **Performance optimization patterns**

The component-based architecture with AnimatedSection wrappers provides a clean integration path that maintains the existing user experience while adding interactive functionality.
