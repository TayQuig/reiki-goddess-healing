# Task: Begin Services Page Migration

**Status**: 📋 PENDING  
**Priority**: Medium  
**Created**: 2025-09-09  
**Target Start**: After Contact page completion  

## Objective
Create a new Services page following the established design patterns from completed pages (Home, About, Blog, Contact), extending the existing ServicesSection component into a full page experience.

## Context for Fresh Instance

### Design Foundation
- **No Figma design exists** - Page will be created using established patterns
- **Style Guide**: `/docs/design/style-guide.md` 
- **Reference Pages**: Home, About, Blog, Contact (for consistent patterns)
- **Existing Component**: ServicesSection with 4 service cards already styled

### Established Design Patterns to Follow

#### From Homepage
- Hero section with overlay text
- Section spacing (80px vertical padding)
- Card layouts with bevel effects
- Purple gradient sections for special content
- Testimonials integration

#### From About Page
- Content layout patterns
- Image positioning and effects
- Team/practitioner presentation style

#### From Contact Page
- Form styling and validation
- Info card layouts with blue bevel
- CTA button styles
- Security implementation

#### From Blog Page
- Content organization
- Category filtering patterns
- Card-based layouts

### Current ServicesSection
```javascript
// Existing services
1. Reiki Healing Sessions (60-90 min)
2. Distance Healing Sessions  
3. Aura & Chakra Readings
4. Sound & Energy Immersion
```

## Design Direction

### 1. Page Structure
```
ServicesPage
├── Hero Section (similar to other pages)
│   ├── Background image or gradient
│   ├── "Our Services" title
│   └── Subtitle about healing offerings
├── Service Categories (optional filter bar)
├── Extended ServicesSection
│   ├── Existing 4 service cards
│   └── Expanded details on click/hover
├── Pricing Section (new)
│   ├── Package options
│   └── Individual session pricing
├── Booking CTA Section (purple gradient like Events)
└── Service-specific Testimonials
```

### 2. New Components Needed

#### ServiceHero
- Follow hero pattern from other pages
- Possible purple/blue gradient background
- Large title: "Healing Services"
- Subtitle explaining approach

#### PricingCards
- Follow card design from ServicesSection
- White background with blue bevel effect
- Clear pricing display
- Package vs individual options

#### BookingSection
- Purple gradient background (like CommunityEvents)
- Strong CTA: "Book Your Healing Session"
- Security validation from Contact page
- Calendar preview or availability

#### ServiceTestimonials
- Filtered testimonials by service type
- Same styling as homepage testimonials
- Optional: service-specific ratings

### 3. Design Decisions to Make

#### Color Scheme
- [ ] Primary sections: Cream background (#FFFBF5)
- [ ] Accent sections: Purple gradient or blue?
- [ ] CTA buttons: Primary blue (#0205B7)

#### Layout Approach
- [ ] Single column with full-width sections?
- [ ] Two-column for service details?
- [ ] Expandable cards vs separate detail pages?

#### Content Hierarchy
1. Overview of all services
2. Individual service details
3. Pricing transparency
4. Booking/Contact flow
5. Social proof (testimonials)

### 4. Implementation Plan

#### Phase 1: Basic Structure
- [ ] Create ServicesPage component
- [ ] Add ServiceHero section
- [ ] Integrate existing ServicesSection
- [ ] Add Footer

#### Phase 2: Service Details
- [ ] Enhance service cards with more info
- [ ] Add expandable details or modals
- [ ] Include process/benefits for each

#### Phase 3: Pricing & Booking
- [ ] Create PricingSection component
- [ ] Design pricing cards
- [ ] Add BookingCTA with form/redirect
- [ ] Implement security from Contact

#### Phase 4: Polish
- [ ] Add testimonials section
- [ ] Implement smooth scrolling
- [ ] Add loading states
- [ ] Mobile optimization

## Technical Implementation

### Component Structure
```
packages/shared-components/src/pages/
├── ServicesPage.tsx
├── ServicesPage.test.tsx
└── Services/
    ├── ServiceHero/
    ├── PricingSection/
    ├── BookingCTA/
    └── ServiceTestimonials/
```

### Reusable Patterns
- AnimatedSection from homepage
- Button styles from design system
- Card layouts with bevel effects
- Form validation from Contact
- Responsive grid systems
- Section padding/margins

## Success Criteria
- [ ] Consistent with established design language
- [ ] Clear service presentation
- [ ] Transparent pricing
- [ ] Easy booking flow
- [ ] Mobile responsive
- [ ] Accessible
- [ ] Security validated forms
- [ ] Fast loading

## Notes for Designer/Developer Collaboration
- Since no Figma exists, iterate on design during development
- Use established patterns as constraints
- Client feedback will guide design decisions
- Document new patterns created
- Consider future scalability for adding services