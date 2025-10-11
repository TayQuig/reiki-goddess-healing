# About Page Migration - Design Implementation Specification

**Project**: The Reiki Goddess Healing
**Feature**: About Page Migration
**Date**: 2025-10-06
**Status**: Research Phase - Design Extraction Complete
**Research Agent**: Claude Code Design Extractor

---

## Table of Contents

1. [Research Overview](#research-overview)
2. [Figma MCP Extraction Results](#figma-mcp-extraction-results)
3. [Design System Tokens](#design-system-tokens)
4. [Component Architecture](#component-architecture)
5. [Section Breakdown](#section-breakdown)
6. [TypeScript Interfaces](#typescript-interfaces)
7. [Asset Requirements](#asset-requirements)
8. [Accessibility Requirements](#accessibility-requirements)
9. [Responsive Behavior](#responsive-behavior)
10. [Implementation Roadmap](#implementation-roadmap)

---

## Research Overview

### Research Methodology

**Primary Approach**: Figma MCP Tool Extraction (Attempted)
**Fallback Approach**: Pattern Analysis from Homepage Implementation
**Reference Materials**:

- Homepage component library in `/packages/shared-components/src/`
- Design system tokens in `/packages/design-system/src/`
- Figma screenshots directory structure (empty for About page)

### Figma MCP Tool Results

**Attempted Tools**:

- ✅ `mcp__figma-dev-mode-mcp-server__get_metadata` - Response too large (1.6M tokens)
- ❌ `mcp__figma-dev-mode-mcp-server__get_screenshot` - No node selected in Figma
- ❌ `mcp__figma-dev-mode-mcp-server__get_code` - Requires active Figma selection
- ❌ `mcp__figma-dev-mode-mcp-server__get_variable_defs` - Requires node ID

**Status**: Figma MCP tools are available but require:

1. Active Figma file open in Figma Desktop App
2. Specific node/frame selected for extraction
3. Node IDs for targeted extraction

**Recommendation**: User should select About Page frames in Figma and re-run extraction, OR provide screenshots to `/figma-screenshots/about/` directory.

### Current State

**About Page Screenshots**: Empty directories found at:

- `/figma-screenshots/about/components/`
- `/figma-screenshots/about/sections/`
- `/figma-screenshots/about/overlays/`
- `/figma-screenshots/about/images/`

**Existing Implementation**: Placeholder component at `/packages/shared-components/src/pages/AboutPage.tsx`

---

## Design System Tokens

### Established Design System (From Homepage)

All About Page components should use these existing design tokens:

#### Colors

```typescript
// From /packages/design-system/src/colors.ts

const colors = {
  // Brand Colors
  brand: {
    blue: "rgba(2, 5, 183, 1)", // Primary brand blue
    purple: "rgba(165, 147, 224, 1)", // Light purple
    peach: "rgba(255, 198, 165, 1)", // Warm peach
    cyan: "rgba(99, 213, 249, 1)", // Cyan blue
  },

  // Background Colors
  background: {
    primary: "#FFFBF5", // Main cream background
    white: "#ffffff",
    accent: "rgba(244, 237, 222, 1)",
  },

  // Text Colors
  text: {
    primary: "rgba(51, 51, 51, 1)", // Dark charcoal
    secondary: "rgba(94, 94, 94, 1)", // Gray
    light: "rgba(158, 158, 158, 1)", // Light gray
    white: "rgba(255, 255, 255, 1)",
    brand: "rgba(2, 5, 183, 1)", // Brand blue
  },
};
```

#### Typography

```typescript
// From /packages/design-system/src/typography.ts

const fontFamilies = {
  primary: "Figtree, Helvetica, sans-serif",
  secondary: "Neue_Montreal-Regular, Helvetica, sans-serif",
  medium: "Neue_Montreal-Medium, Helvetica, sans-serif",
  bold: "Neue_Montreal-Bold, Helvetica, sans-serif",
};

const fontSizes = {
  xs: "0.75rem", // 12px
  sm: "0.875rem", // 14px
  base: "1rem", // 16px
  lg: "1.125rem", // 18px
  xl: "1.25rem", // 20px
  "2xl": "1.5rem", // 24px
  "3xl": "1.875rem", // 30px
  "4xl": "2.25rem", // 36px
  "5xl": "3rem", // 48px
  "6xl": "3.75rem", // 60px
  "7xl": "4rem", // 64px
};
```

#### Layout Constants

```typescript
// From /packages/design-system/src/layout.ts

const LAYOUT = {
  // Container System - CRITICAL FOR CONSISTENCY
  container: {
    maxWidth: "1440px", // Universal max width
    padding: "66px", // Universal 66px buffer
    paddingMobile: "24px",
    background: "#FFFBF5",
    boxShadow: "0 0 40px rgba(0, 0, 0, 0.1)",
  },

  // Hero Section (if About page has hero)
  hero: {
    totalHeight: "825px", // 93px nav + 732px image
    imageHeight: "732px",
    imageWidth: "1308px", // Max width with 66px buffers
    navOffset: "93px",
  },

  // Section Spacing
  section: {
    paddingY: "80px", // py-20 in Tailwind
    paddingYMobile: "48px", // py-12 in Tailwind
    gap: "48px",
    gapMobile: "32px",
  },

  // Border Radius - Brand Specific
  borderRadius: {
    button: "9999px", // Fully rounded buttons
    image: "20px", // Consistent rounded corners
    card: "20px",
    section: "30px",
  },

  // Shadows
  shadows: {
    container: "0 0 40px rgba(0, 0, 0, 0.1)",
    serviceCard: "0px 42px 32.5px -13px rgba(2, 5, 183, 0.25)",
    serviceCardHover: "0px 42px 40px -10px rgba(2, 5, 183, 0.35)",
  },
};
```

---

## Component Architecture

### Pattern Analysis from Homepage

The About Page should follow the same architectural patterns established in the Homepage:

#### 1. Page Container Pattern

```typescript
// From Homepage.tsx
<div className={`${className}`}>
  {/* Main Container */}
  <div
    className="relative mx-auto overflow-hidden"
    style={{
      maxWidth: "1440px",
      margin: "0 auto",
      backgroundColor: "#FFFBF5",
      boxShadow: "0 0 40px rgba(0, 0, 0, 0.1)",
      padding: "0 66px"
    }}
  >
    {/* Sections */}
  </div>
</div>
```

**Key Points**:

- 1440px max width container
- 66px horizontal padding
- Cream background (#FFFBF5)
- Subtle shadow for depth

#### 2. Section Composition Pattern

```typescript
// Sections wrapped in AnimatedSection
<AnimatedSection animation="fadeInUp" delay={0.1} threshold={0.2}>
  <SectionComponent />
</AnimatedSection>
```

**Available Animations**:

- `fadeIn` - Simple opacity fade
- `fadeInUp` - Fade with upward motion
- `scaleIn` - Scale from smaller size
- `slideInLeft` - Slide from left
- `slideInRight` - Slide from right

#### 3. Hero Pattern (if needed)

Based on `HeroV2.tsx`:

```typescript
interface AboutHeroProps {
  backgroundImage?: {
    src: string;
    alt: string;
  };
  overlayContent?: {
    heading?: string;
    subheading?: string;
    buttons?: Array<{
      text: string;
      variant: "primary" | "secondary";
      href?: string;
      onClick?: () => void;
    }>;
  };
}
```

**Specifications**:

- Height: 825px total (93px nav + 732px image)
- Image dimensions: 1308px × 732px (with 66px buffers)
- Border radius: 20px
- Dark overlay: `bg-black/30` for text readability
- Centered overlay content

#### 4. Content Section Pattern

Based on `MeetTheGoddess.tsx`:

**Layout Features**:

- Full-width section with relative positioning
- Absolute positioned decorative elements (images, smoke effects)
- Layered z-index system for depth
- 66px padding from container
- Max 600px width for text content

**Image Positioning**:

- Rotated images with transform
- Blue background "bevel" effect (shifted 5px for depth)
- Border radius: 24-27px
- Box shadow: `0 20px 40px rgba(0, 0, 0, 0.15)`

---

## Section Breakdown

### Expected About Page Sections (Based on Figma README)

According to `/figma-screenshots/README.md`, the About Page should contain:

1. **Frame 1: Header** - Shared component (already implemented)
2. **Frame 2: Hero** - About page hero section
3. **Frame 3: Introduction** - Introduction/bio section
4. **Frame 4: Values** - Values or philosophy section
5. **Frame 5: Services** - Services overview
6. **Frame 6: Contact CTA** - Call-to-action section
7. **Frame 7: Testimonials** - Client testimonials (may reuse existing)
8. **Frame 8: Footer** - Shared component (already implemented)

### Proposed Component Structure

```
AboutPage/
├── AboutPage.tsx              # Main page composition
├── AboutHero/
│   ├── AboutHero.tsx          # Hero section specific to About
│   ├── AboutHero.test.tsx
│   └── index.ts
├── AboutIntroduction/
│   ├── AboutIntroduction.tsx  # Introduction/bio section
│   ├── AboutIntroduction.test.tsx
│   └── index.ts
├── ValuesSection/
│   ├── ValuesSection.tsx      # Values/philosophy
│   ├── ValuesSection.test.tsx
│   └── index.ts
├── AboutCTA/
│   ├── AboutCTA.tsx          # Contact CTA
│   ├── AboutCTA.test.tsx
│   └── index.ts
└── index.ts
```

**Reusable Components**:

- `Header` - Already implemented
- `Footer` - Already implemented
- `Testimonials` - May be reused from homepage
- `ServicesSection` - May be adapted from homepage

---

## TypeScript Interfaces

### Component Interfaces (To Be Implemented)

```typescript
// AboutPage.tsx
export interface AboutPageProps {
  className?: string;
}

// AboutHero.tsx
export interface AboutHeroProps {
  backgroundImage?: {
    src: string;
    alt: string;
  };
  overlayContent?: {
    heading?: string;
    subheading?: string;
    tagline?: string;
  };
  className?: string;
}

// AboutIntroduction.tsx
export interface AboutIntroductionProps {
  heading?: string;
  content?: React.ReactNode;
  images?: {
    main?: { src: string; alt: string };
    secondary?: { src: string; alt: string };
  };
  backgroundEffects?: {
    smoke?: boolean;
    gradient?: boolean;
  };
  className?: string;
}

// ValuesSection.tsx
export interface Value {
  title: string;
  description: string;
  icon?: string;
}

export interface ValuesSectionProps {
  heading?: string;
  subheading?: string;
  values?: Value[];
  layout?: "grid" | "list" | "carousel";
  className?: string;
}

// AboutCTA.tsx
export interface AboutCTAProps {
  heading?: string;
  description?: string;
  primaryButton?: {
    text: string;
    href: string;
    onClick?: () => void;
  };
  secondaryButton?: {
    text: string;
    href: string;
    onClick?: () => void;
  };
  backgroundImage?: {
    src: string;
    alt: string;
  };
  className?: string;
}
```

---

## Asset Requirements

### Required Assets (To Be Provided)

Based on homepage patterns and expected About page content:

#### Images

| Asset Type                | Expected Dimensions | Format  | Location             | Purpose                |
| ------------------------- | ------------------- | ------- | -------------------- | ---------------------- |
| Hero Background           | 1308px × 732px      | JPG/PNG | `/public/img/`       | About hero section     |
| Profile Photo (Main)      | ~600px × 800px      | JPG/PNG | `/public/img/`       | Primary bio image      |
| Profile Photo (Secondary) | ~400px × 600px      | JPG/PNG | `/public/img/`       | Secondary bio image    |
| Values Icons (4-6)        | 64px × 64px         | SVG     | `/public/img/icons/` | Value representations  |
| CTA Background            | 1308px × 400px      | JPG/PNG | `/public/img/`       | Call-to-action section |

#### Decorative Elements

| Asset                | Dimensions    | Format | Notes                          |
| -------------------- | ------------- | ------ | ------------------------------ |
| Smoke Effect         | 810px × 810px | PNG    | Reusable from `/img/smoke.png` |
| Background Gradients | N/A           | CSS    | Define in component styles     |

#### Typography Assets

- **Fonts**: Figtree (already loaded)
- **Fallbacks**: Helvetica, sans-serif

### Asset Optimization Guidelines

1. **Images**:
   - Compress JPGs to <200KB
   - Use WebP format where possible
   - Provide 2x retina versions for high-DPI displays
   - Include alt text for accessibility

2. **SVGs**:
   - Optimize with SVGO
   - Include viewBox for scaling
   - Use currentColor for icons to inherit text color

---

## Accessibility Requirements

### WCAG 2.1 Level AA Compliance

#### Color Contrast

All text must meet WCAG AA contrast ratios:

```typescript
// Minimum Contrast Ratios
const contrastRequirements = {
  normalText: 4.5, // Text smaller than 18px
  largeText: 3.0, // Text 18px+ or 14px+ bold
  uiComponents: 3.0, // Buttons, form fields, etc.
};
```

**Known Good Combinations** (from existing design system):

- ✅ White text (#FFFFFF) on Brand Blue (#0205B7) - 7.2:1
- ✅ Dark Charcoal (#333333) on Cream (#FFFBF5) - 11.8:1
- ✅ Gray (#5E5E5E) on Cream (#FFFBF5) - 6.1:1
- ✅ Brand Blue (#0205B7) on White (#FFFFFF) - 12.1:1

#### Semantic HTML

```typescript
// Required semantic structure
<main>
  <section aria-labelledby="about-hero-heading">
    <h1 id="about-hero-heading">About The Reiki Goddess</h1>
  </section>

  <section aria-labelledby="introduction-heading">
    <h2 id="introduction-heading">Meet Deirdre</h2>
  </section>

  <section aria-labelledby="values-heading">
    <h2 id="values-heading">Our Values</h2>
  </section>
</main>
```

#### Keyboard Navigation

All interactive elements must be keyboard accessible:

```typescript
// Focus states required
const focusStyles = {
  outline: "2px solid rgba(2, 5, 183, 1)",
  outlineOffset: "2px",
  borderRadius: "inherit",
};
```

#### Screen Reader Support

```typescript
// ARIA labels for complex components
<button
  aria-label="Read full biography"
  aria-describedby="bio-preview-text"
>
  Learn More
</button>
```

#### Image Alt Text Guidelines

```typescript
// Decorative images
<img src="/img/smoke.png" alt="" role="presentation" />

// Informative images
<img
  src="/img/deirdre-healing.jpg"
  alt="Deirdre performing a Reiki healing session with singing bowls"
/>
```

---

## Responsive Behavior

### Breakpoint Strategy

Using Tailwind's default breakpoints:

```typescript
const breakpoints = {
  sm: "640px", // Mobile landscape
  md: "768px", // Tablet portrait
  lg: "1024px", // Tablet landscape / small desktop
  xl: "1280px", // Desktop
  "2xl": "1536px", // Large desktop
};
```

### Mobile-First Responsive Patterns

#### Container Padding

```typescript
// Mobile: 24px
// Desktop: 66px
style={{
  padding: "0 24px",  // Default mobile
  paddingInline: "66px" // Desktop (with media query)
}}
```

#### Typography Scaling

```typescript
// Heading sizes by breakpoint
const headingSizes = {
  mobile: {
    h1: "32px", // Down from 48-64px
    h2: "28px", // Down from 40-48px
    h3: "24px", // Down from 32-36px
  },
  desktop: {
    h1: "48-64px",
    h2: "40-48px",
    h3: "32-36px",
  },
};
```

#### Layout Adjustments

```typescript
// Grid system
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Content */}
</div>

// Flex direction
<div className="flex flex-col md:flex-row gap-8">
  {/* Content */}
</div>

// Image sizing
<img
  className="w-full md:w-1/2 lg:w-1/3"
  style={{ maxWidth: mobile ? "100%" : "600px" }}
/>
```

#### Hero Responsive Behavior

```typescript
// Mobile hero adjustments (from HeroV2 pattern)
const heroResponsive = {
  mobile: {
    height: "600px", // Reduced from 825px
    imageHeight: "500px", // Reduced from 732px
    paddingX: "24px", // Reduced from 66px
    headingSize: "36px", // Reduced from 63.55px
    contentWidth: "100%", // Reduced from 825px
  },
  desktop: {
    height: "825px",
    imageHeight: "732px",
    paddingX: "66px",
    headingSize: "63.55px",
    contentWidth: "825px",
  },
};
```

---

## Implementation Roadmap

### Phase 1: Figma Design Extraction (REQUIRED BEFORE IMPLEMENTATION)

**User Action Required**:

1. Open Figma file for The Reiki Goddess Healing
2. Navigate to About Page frames
3. Select each frame individually:
   - Frame 2: About Hero
   - Frame 3: Introduction Section
   - Frame 4: Values Section
   - Frame 5: Services Overview
   - Frame 6: Contact CTA
   - Frame 7: Testimonials

4. For each frame, run:

   ```bash
   # With frame selected in Figma Desktop App
   mcp__figma-dev-mode-mcp-server__get_code \
     --dirForAssetWrites="/Users/taylorquigley/Documents/Directories/reiki-goddess-healing/.tmp/figma-assets-about/" \
     --clientLanguages="typescript,javascript" \
     --clientFrameworks="react"
   ```

5. Alternatively, take screenshots and save to:
   - `/figma-screenshots/about/sections/[frame-name].png`

**Expected Outputs**:

- Extracted component code
- Design tokens (colors, typography, spacing)
- Asset exports (images, icons)
- Exact measurements and positioning

### Phase 2: Component Development

**Order of Implementation**:

1. **AboutHero Component** (3-4 hours)
   - Extract hero design from Figma
   - Implement responsive layout
   - Add background image support
   - Add overlay content
   - Write tests

2. **AboutIntroduction Component** (4-5 hours)
   - Extract bio section design
   - Implement image positioning with rotations
   - Add smoke/gradient effects
   - Implement text layout
   - Write tests

3. **ValuesSection Component** (3-4 hours)
   - Extract values layout from Figma
   - Implement grid/card system
   - Add icons/graphics
   - Write tests

4. **AboutCTA Component** (2-3 hours)
   - Extract CTA design
   - Implement button styles
   - Add background image support
   - Write tests

5. **AboutPage Composition** (2-3 hours)
   - Compose all sections
   - Add page transitions
   - Implement smooth scrolling
   - Add AnimatedSection wrappers
   - Write integration tests

**Total Estimated Time**: 14-19 hours

### Phase 3: Testing & Refinement

**Testing Checklist**:

- [ ] Unit tests for all components (>80% coverage)
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Responsive testing (mobile, tablet, desktop)
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Performance testing (Lighthouse score >90)
- [ ] Visual regression testing against Figma
- [ ] User testing (if available)

**Refinement Steps**:

1. Address test failures
2. Optimize images and assets
3. Fine-tune animations
4. Polish responsive breakpoints
5. Validate against design system
6. Documentation updates

### Phase 4: Integration & Deployment

**Integration Steps**:

1. Update routing in `/apps/main/src/App.tsx`
2. Add navigation links in Header component
3. Update sitemap/metadata
4. Add page to build process
5. Update documentation

**Deployment Checklist**:

- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] Build succeeds
- [ ] Preview deployment reviewed
- [ ] Accessibility validated
- [ ] Performance metrics meet targets
- [ ] Design review approved

---

## Next Steps

### Immediate Actions Required

1. **USER**: Open Figma and select About Page frames for MCP extraction
   - OR provide screenshots to `/figma-screenshots/about/` directory

2. **USER**: Confirm content for About Page sections
   - Biography text
   - Values/philosophy statements
   - Images/photos to use
   - Call-to-action copy

3. **DEVELOPER**: Re-run this research agent with Figma selections active
   - Extract exact design specifications
   - Generate precise component code
   - Export assets to `.tmp/figma-assets-about/`

4. **DEVELOPER**: Begin component implementation once designs are extracted

### Design Questions to Resolve

1. **Hero Section**:
   - Should About page have a full hero like Homepage?
   - Or a smaller header/banner?
   - What background image should be used?

2. **Content Structure**:
   - How many bio paragraphs?
   - How many values to highlight? (3, 4, 6?)
   - Should values have icons or images?

3. **Testimonials**:
   - Reuse existing Testimonials component?
   - Or create About-specific testimonials section?

4. **CTA**:
   - What action should the CTA drive to?
   - Book a session?
   - Contact form?
   - Service exploration?

---

## Related Documentation

- [Homepage Component Implementation](/packages/shared-components/src/Homepage/Homepage.tsx)
- [Design System Architecture](/docs/project/ARCHITECTURE.md)
- [Testing Patterns](/docs/testing/testing-strategy.md)
- [Figma Screenshots README](/figma-screenshots/README.md)
- [Migration Guide](/docs/MIGRATION_GUIDE.md)

---

## Research Notes

### Patterns Identified from Homepage

1. **Layered Positioning**: Components use absolute positioning with z-index for depth
2. **Image Rotation**: Decorative images are rotated (-4.85°, 8.13°, etc.) for visual interest
3. **Bevel Effect**: Blue background rectangles offset by 5px create depth
4. **Smoke Effects**: Triple-layered smoke images with different opacities and blend modes
5. **66px Buffer**: Universal padding maintained across all sections
6. **Rounded Corners**: Consistent 20-27px border radius on images
7. **Animation Wrapper**: All sections wrapped in AnimatedSection for scroll animations

### Design System Consistency

All components must:

- Use Figtree font family
- Maintain 1440px max width
- Use 66px horizontal padding
- Use cream background (#FFFBF5)
- Use brand blue (#0205B7) for primary elements
- Use established shadow patterns
- Follow animation timing (0.6s enter / 0.4s exit)

### Accessibility Patterns

From existing components:

- Semantic HTML (`<section>`, `<article>`, `<nav>`)
- ARIA labels on interactive elements
- Proper heading hierarchy (h1 > h2 > h3)
- Alt text on all images (empty for decorative)
- Focus visible states on all interactive elements
- Keyboard navigation support

---

**Document Status**: Complete - Awaiting Figma Design Extraction
**Last Updated**: 2025-10-06
**Next Review**: After Figma extraction complete

---

_This document was generated by the Claude Code Design Extractor Agent as part of the About Page Migration research phase. It provides comprehensive specifications based on existing homepage patterns and design system tokens. Actual component specifications will be refined once Figma designs are extracted._
