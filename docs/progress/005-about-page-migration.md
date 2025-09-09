# Task: About Page Migration

**Status**: 📋 PENDING  
**Priority**: Medium  
**Created**: 2025-09-09  
**Target Start**: After Services page completion  

## Objective
Migrate the About page from legacy Anima-generated code to the monorepo structure, then collaborate with the client to refine visual details to match Figma designs perfectly.

## Context for Fresh Instance

### Project Overview
- **Business**: The Reiki Goddess Healing - Energy healing and wellness services
- **Owner**: Deirdre, The Reiki Goddess (Based in Roy, WA)
- **Design Approach**: Figma-first with screenshots as source of truth

### Current State
- **Legacy About Page**: `/legacy/About/`
- **Figma Designs**: `/figma-screenshots/about/`
- **Established Patterns**: Use patterns from completed pages (Home, Contact)

### Key Design Elements to Migrate
- Hero section with Deirdre's introduction
- Professional bio and healing journey
- Certifications and credentials
- Healing philosophy
- Client testimonials
- Call-to-action for booking

## Phase 1: Initial Extraction

### 1. Analysis
- [ ] Review Figma screenshots at `/figma-screenshots/about/`
- [ ] Examine legacy About page structure
- [ ] Identify reusable components from shared library
- [ ] Document unique components needed

### 2. Component Structure Planning
```
AboutPage/
├── AboutHero/          # Hero with title and intro
├── BiographySection/   # Deirdre's story
├── Certifications/     # Credentials display
├── Philosophy/         # Healing approach
├── AboutTestimonials/  # Client testimonials
└── BookingCTA/         # Call to action
```

### 3. Initial Implementation
1. **Create AboutPage component**
   - Basic page structure
   - Section layout
   - Responsive container

2. **Extract content from legacy**
   - Text content
   - Images (optimize and migrate)
   - Layout structure

3. **Apply existing patterns**
   - Use established hero patterns
   - Apply consistent spacing (66px rule)
   - Use design system colors

4. **Create new components as needed**
   - BiographySection with image positioning
   - Certifications grid
   - Philosophy cards

## Phase 2: Collaborative Refinement

### Setup for Review Session
- [ ] Dev server running: `npm run dev`
- [ ] About page accessible in browser
- [ ] Figma screenshots ready for comparison
- [ ] Browser DevTools open for live adjustments

### Visual Refinement Checklist

#### Hero Section
- [ ] Title size and positioning
- [ ] Subtitle styling
- [ ] Background treatment (image/gradient)
- [ ] Content alignment

#### Biography Section
- [ ] Image placement and size
- [ ] Text wrapping around image
- [ ] Paragraph spacing
- [ ] Font sizes and line heights

#### Certifications
- [ ] Grid layout spacing
- [ ] Certificate card styling
- [ ] Icon/badge placement
- [ ] Typography hierarchy

#### Philosophy Section
- [ ] Section background (cream/gradient)
- [ ] Content blocks arrangement
- [ ] Decorative elements
- [ ] Quote styling if present

#### Testimonials
- [ ] Reuse existing testimonial component
- [ ] Section background color
- [ ] Spacing adjustments

#### Call-to-Action
- [ ] Button styling consistency
- [ ] Section padding
- [ ] Background treatment

### Iteration Process
1. **Client identifies discrepancy** with Figma
2. **Developer locates code**:
   ```
   packages/shared-components/src/pages/AboutPage.tsx
   packages/shared-components/src/About/[Component]/
   ```
3. **Make precise adjustment** using Figma values
4. **Live reload** to verify
5. **Client confirms** or requests refinement

## Technical Implementation

### File Structure
```
packages/shared-components/src/
├── pages/
│   └── AboutPage.tsx
└── About/
    ├── AboutHero/
    ├── BiographySection/
    ├── Certifications/
    ├── Philosophy/
    └── AboutTestimonials/
```

### Reusable Components
- AnimatedSection (scroll animations)
- LazyImage (optimized loading)
- Button (from design system)
- Testimonials (adapt from homepage)

### New Patterns to Document
- Biography layout with floating image
- Certification grid system
- Philosophy card design
- Any unique animations

## Testing Requirements
- [ ] Unit tests for new components
- [ ] Visual regression tests
- [ ] Mobile responsiveness
- [ ] Accessibility compliance
- [ ] Cross-browser compatibility

## Success Criteria
- [ ] All content migrated from legacy
- [ ] Visual match confirmed by client
- [ ] Consistent with design system
- [ ] Fully responsive
- [ ] Accessible (WCAG 2.1 AA)
- [ ] Performance optimized
- [ ] Tests passing

## Notes for Collaboration
- Schedule 1-2 hour review session
- Have both legacy and new versions open
- Be prepared for micro-adjustments
- Document any new design decisions
- Update style guide with new patterns