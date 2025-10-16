# About Page Migration Documentation

## Quick Links

- **[Integration Points](./integration-points.md)** - NEW: Figma MCP integration guide and workflows
- **[Current State Analysis](./current-state-analysis.md)** - Comprehensive component analysis and migration plan
- **Legacy About Page**: `/legacy/About/src/screens/About/About.tsx`
- **Current About Stub**: `/apps/main/src/pages/About.tsx`
- **Figma Designs**: `/figma-screenshots/about/`

## Overview

The About Page migration involves transforming a 499-line Figma export into a modern, component-based React implementation using established patterns from the homepage.

## Key Findings

### Reusable Components (5)

✅ Ready for immediate reuse:

1. **MeetTheGoddess** - Homepage component, perfect for About bio section
2. **Testimonials** - Carousel component with navigation
3. **AppLayout** - Page wrapper with Header/Footer
4. **PageTransition** - Framer Motion page transitions
5. **AnimatedSection** - Scroll-triggered animations

### Components to Create (6)

⚠️ Need development:

1. **AboutHero** - Hero section with dual-column text (4 hours)
2. **JourneySection** - Personal journey with credential cards (3 hours)
3. **CertificationCards** - Certification display cards (2 hours)
4. **ImageGallery** - Masonry image gallery (3 hours)
5. **ContactCTA** - Mid-page CTA with background image (2 hours)
6. **BookSessionCTA** - Review existing component (1 hour)

**Total Development Effort**: ~15 hours

## Architecture Decisions

### Design System

- **Colors**: Brand blue (#0205B7), cream background (#FFFBF5)
- **Typography**: Figtree font family, sizes: 63.6px (h1), 48px (h2), 18px (body)
- **Spacing**: 66px horizontal padding, 80px vertical padding
- **Container**: Fixed 1440px max-width

### Patterns

- **Inline styles** (not Tailwind) for Figma accuracy
- **Z-index scale**: Background (2), Content (10), Images (20-40), Header (50)
- **Bevel effect**: Blue background offset by 5px for 3D effect
- **Triple-layer smoke**: Blend modes for atmospheric backgrounds
- **AnimatedSection**: Progressive reveals with IntersectionObserver

## Migration Phases

### Phase 0: Research & Planning ✅

**Status**: Complete

- [x] Analyze existing About Page components
- [x] Research Figma MCP integration capabilities
- [x] Document extraction workflows
- [x] Identify reusable components
- **Documentation**: [integration-points.md](./integration-points.md)

### Phase 1: Layout Foundation ✅

**Status**: Complete

- AppLayout wrapper via router
- PageTransition wrapper in place

### Phase 2: Reuse Components (1h)

**Status**: Planned

- Import and configure MeetTheGoddess
- Import and configure Testimonials
- Verify BookSessionCTA

### Phase 3: Create Components (15h)

**Status**: Planned

1. CertificationCards (2h)
2. AboutHero (4h)
3. JourneySection (3h)
4. ContactCTA (2h)
5. ImageGallery (3h)
6. BookSessionCTA update (1h)

### Phase 4: Integration (4h)

**Status**: Planned

- Assemble all components in About.tsx
- Test against Figma designs
- Accessibility audit
- Performance optimization

**Total Timeline**: ~20 hours

## Component Structure

```
About Page
├── AboutHero (NEW)
│   ├── Hero image (808x808px)
│   ├── Large heading (63.6px)
│   └── Two-column text layout
├── MeetTheGoddess (REUSE)
│   ├── Biographical content
│   ├── Three images with bevel effects
│   └── CTA button
├── JourneySection (NEW)
│   ├── Background image
│   ├── Journey narrative
│   └── Certification cards
├── ContactCTA (NEW)
│   ├── Background image
│   ├── CTA heading
│   └── Dual action buttons
├── ImageGallery (NEW)
│   ├── Masonry layout
│   ├── 5 images
│   └── "See More" CTA
├── Testimonials (REUSE)
│   ├── Carousel with navigation
│   └── Client testimonials
└── BookSessionCTA (REUSE/UPDATE)
    ├── Gradient background
    └── Primary CTA button
```

## File Locations

### Current Implementation

- **Active page**: `/apps/main/src/pages/About.tsx`
- **Shared placeholder**: `/packages/shared-components/src/pages/AboutPage.tsx`
- **Legacy source**: `/legacy/About/src/screens/About/About.tsx`

### New Components (to be created)

```
/packages/shared-components/src/
├── AboutHero/
├── JourneySection/
├── CertificationCards/
├── ImageGallery/
└── ContactCTA/
```

## Design Assets

### Figma Screenshots

- **Location**: `/figma-screenshots/about/`
- **Sections**: components/, images/, overlays/, sections/
- **Reference**: Complete design specifications in legacy About.tsx

### Image Assets

```
/public/img/
├── about-hero.png (808x808px)
├── about-deirdre-*.png (various)
├── smoke.png (overlay effect)
├── gallery-*.png (5 images)
└── contact-cta-bg.png
```

## TypeScript Patterns

### Props Interface Convention

```typescript
export interface ComponentNameProps {
  heading?: string;
  content?: React.ReactNode;
  className?: string;
}

export const ComponentName: React.FC<ComponentNameProps> = ({
  heading = "Default Heading",
  content = <>{/* default */}</>,
  className = "",
}) => {
  // Implementation
};
```

### Nested Objects

```typescript
images?: {
  main?: { src: string; alt: string };
  secondary?: { src: string; alt: string };
}
```

### Array of Objects

```typescript
export interface CardData {
  id: string;
  title: string;
  description: string;
}

cards?: CardData[];
```

## Performance Considerations

### Optimizations

- ✅ **LazyImage** for below-fold images
- ✅ **IntersectionObserver** for animation triggers
- ✅ **Code splitting** via React Router
- ✅ **Responsive images** with srcset (future)

### Image Optimization

- Hero image: Preload (above-fold)
- Gallery images: Lazy load (below-fold)
- Background images: Optimize and compress
- Use WebP format where supported

## Accessibility Checklist

- [ ] All images have descriptive alt text
- [ ] Heading hierarchy (h1 → h2 → h3)
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Interactive elements have focus states
- [ ] Carousel has keyboard navigation
- [ ] ARIA labels on icon buttons
- [ ] Screen reader tested

## Testing Strategy

### Unit Tests

- Each component has `.test.tsx` file
- Props validation
- Render tests
- Interaction tests (carousel navigation)

### Integration Tests

- Full page render test
- Router navigation test
- CTA button click tracking

### Visual Regression

- Compare against Figma screenshots
- Test responsive breakpoints
- Verify animations

## Figma MCP Integration (NEW)

### Quick Start

**Enable MCP Server**:

1. Open Figma Desktop App
2. Open About Page design file
3. Toggle to Dev Mode (Shift + D)
4. Enable "desktop MCP server" in MCP section
5. Verify server at `http://127.0.0.1:3845/mcp`

**Available Tools**:

- `get_code` - Generate React + Tailwind code
- `get_screenshot` - Visual reference capture
- `get_metadata` - Extract XML structure
- `get_variable_defs` - Design token extraction
- `get_code_connect_map` - Component mapping

**Example Workflow**:

```typescript
// Step 1: Understand structure
"Get metadata for About Page in Figma"

// Step 2: Extract tokens
"Get variable definitions for About Page"

// Step 3: Generate component
"Generate React component for About Hero section with
dirForAssetWrites: /absolute/path/.tmp/figma-assets-about"
```

**Full Documentation**: See [integration-points.md](./integration-points.md) for:

- Complete tool reference
- Step-by-step workflows
- Troubleshooting guide
- Best practices

### Benefits

- **70-80% time savings** on design extraction
- **Pixel-perfect** component generation
- **Automatic token extraction** for design system
- **Asset optimization** workflows

## Related Documentation

- **Figma MCP Integration**: [integration-points.md](./integration-points.md) ⭐ NEW
- **Main Documentation**: [ARCHITECTURE.md](/docs/project/ARCHITECTURE.md)
- **Component Patterns**: [shared-components/CLAUDE.md](/packages/shared-components/CLAUDE.md)
- **Design System**: [style-guide.md](/docs/project/style-guide.md)
- **Testing**: [TESTING_SUMMARY.md](/docs/testing/TESTING_SUMMARY.md)

## Questions & Decisions

### Open Questions

- [ ] Final image asset locations?
- [ ] Testimonial data source (API or static)?
- [ ] Gallery image count (5 or expandable)?
- [ ] Animation timing preferences?

### Decisions Made

- ✅ Use inline styles for Figma accuracy
- ✅ Fixed 1440px containers (not responsive)
- ✅ Reuse MeetTheGoddess without modification
- ✅ Create separate CertificationCards component
- ✅ Triple-layer smoke effect pattern

## Next Actions

1. **Review analysis** with team
2. **Approve component creation plan**
3. **Start Phase 3**: Develop CertificationCards
4. **Progressive development**: One component at a time
5. **Continuous testing**: Against Figma designs
6. **Deploy when complete**: ~20 hours total

---

**Last Updated**: 2025-10-06
**Status**: Analysis Complete, Ready for Development
**Effort Estimate**: 20 hours
**Priority**: HIGH
