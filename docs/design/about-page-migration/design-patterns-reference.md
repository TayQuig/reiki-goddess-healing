# About Page Design Patterns Reference

**Quick Reference**: Design patterns from Homepage to apply to About Page
**Source**: Analyzed from `/packages/shared-components/src/` components
**Purpose**: Ensure consistency between Homepage and About Page

---

## Visual Design Patterns

### 1. Layered Image Positioning

**Pattern**: Images with blue background "bevel" for depth

```typescript
// Image container with rotation
<div
  style={{
    position: "absolute",
    width: "455.9px",
    height: "310.61px",
    transform: "rotate(-4.85deg)",
    transformOrigin: "center"
  }}
>
  {/* Blue background - offset for bevel effect */}
  <div
    style={{
      position: "absolute",
      inset: 0,
      backgroundColor: "#0205B7",
      borderRadius: "27px",
      transform: "translate(-5px, 5px)",  // Offset creates depth
      zIndex: 0
    }}
  />

  {/* Image on top */}
  <img
    src={imageSrc}
    alt={alt}
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
      borderRadius: "27px",
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
      position: "relative",
      zIndex: 1
    }}
  />
</div>
```

**Where to use**:

- Bio/introduction section images
- Feature highlights
- Any decorative photography

**Key values**:

- Background color: `#0205B7` (brand blue)
- Offset: 5px (any direction)
- Border radius: 24-27px
- Shadow: `0 20px 40px rgba(0, 0, 0, 0.15)`

---

### 2. Smoke/Gradient Overlays

**Pattern**: Triple-layered smoke effect for depth and color

```typescript
// Base smoke layer
<img
  src="/img/smoke.png"
  alt=""
  role="presentation"
  style={{
    width: "810px",
    height: "810px",
    position: "absolute",
    left: "0",
    top: "0",
    transform: "rotate(180deg)",
    opacity: 0.5,
    filter: "saturate(100%)",
    mixBlendMode: "normal"
  }}
/>

// Enhanced color layer
<img
  src="/img/smoke.png"
  alt=""
  role="presentation"
  style={{
    width: "810px",
    height: "810px",
    position: "absolute",
    left: "0",
    top: "0",
    transform: "rotate(180deg)",
    opacity: 0.3,
    filter: "saturate(150%)",
    mixBlendMode: "multiply"
  }}
/>

// Maximum enhancement layer
<img
  src="/img/smoke.png"
  alt=""
  role="presentation"
  style={{
    width: "810px",
    height: "810px",
    position: "absolute",
    left: "0",
    top: "0",
    transform: "rotate(180deg)",
    opacity: 0.2,
    filter: "saturate(200%) hue-rotate(-10deg)",
    mixBlendMode: "overlay"
  }}
/>
```

**Where to use**:

- Background decorative elements
- Section transitions
- Behind text content for visual interest

**Key values**:

- Size: 810px × 810px
- Opacities: 0.5, 0.3, 0.2 (descending)
- Blend modes: normal, multiply, overlay
- Position: Behind content (z-index: 2)

---

### 3. Rotated Text Labels

**Pattern**: Slightly rotated text for playful, organic feel

```typescript
<div
  style={{
    position: "absolute",
    left: "752px",
    top: "370px",
    width: "221px",
    height: "26px",
    transform: "rotate(-5.24deg)",
    transformOrigin: "center"
  }}
>
  <span
    style={{
      fontFamily: "Figtree, sans-serif",
      fontSize: "22px",
      fontWeight: 500,
      lineHeight: "100%",
      letterSpacing: "10%",
      color: "#0205B7",
      whiteSpace: "nowrap"
    }}
  >
    The Reiki Goddess
  </span>
</div>
```

**Where to use**:

- Decorative labels near images
- Section markers
- Playful captions

**Key values**:

- Rotation: -5° to +8° (small angles)
- Font: Figtree, 22px, weight 500
- Color: Brand blue (#0205B7)
- Letter spacing: 10%

---

### 4. Hero Section Pattern

**Pattern**: Full-width hero with centered overlay content

```typescript
<section
  style={{
    position: "relative",
    width: "100%",
    height: "825px",  // 93px nav + 732px image
    overflow: "hidden"
  }}
>
  {/* Background image with 66px buffer */}
  <img
    src={backgroundImage}
    alt={alt}
    style={{
      position: "absolute",
      top: "93px",
      left: "66px",
      right: "66px",
      width: "calc(100% - 132px)",
      maxWidth: "1308px",
      height: "732px",
      objectFit: "cover",
      borderRadius: "20px"
    }}
  />

  {/* Dark overlay for readability */}
  <div
    style={{
      position: "absolute",
      top: "93px",
      left: "66px",
      right: "66px",
      width: "calc(100% - 132px)",
      maxWidth: "1308px",
      height: "732px",
      backgroundColor: "rgba(0, 0, 0, 0.3)",
      borderRadius: "20px"
    }}
  />

  {/* Centered overlay content */}
  <div
    style={{
      position: "absolute",
      top: "calc(93px + 436px)",
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 10,
      textAlign: "center"
    }}
  >
    <h1 style={{
      fontFamily: "Figtree, sans-serif",
      fontSize: "63.55px",
      fontWeight: 700,
      lineHeight: "100%",
      color: "#FFFFFF"
    }}>
      {heading}
    </h1>
    {/* Buttons, subheading, etc. */}
  </div>
</section>
```

**Key values**:

- Total height: 825px
- Image height: 732px
- Nav offset: 93px
- Horizontal buffer: 66px
- Border radius: 20px
- Overlay: `rgba(0, 0, 0, 0.3)`
- Content positioning: 436px from top of image

---

### 5. Button Styles

**Pattern**: Outlined transparent buttons with hover effects

```typescript
// Primary button (transparent with border)
<a
  href={href}
  style={{
    fontFamily: "Figtree, Helvetica, sans-serif",
    fontSize: "16px",
    fontWeight: 500,
    minWidth: "180px",
    height: "48px",
    padding: "0 32px",
    backgroundColor: "transparent",
    color: "white",                    // or #0205B7 for blue
    border: "2px solid white",         // or #0205B7
    borderRadius: "9999px",            // Full pill shape
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s",
    backdropFilter: "blur(10px)"
  }}
  // Hover effect (add with CSS or state)
  onMouseEnter={(e) => {
    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
    e.currentTarget.style.transform = "scale(1.05)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.backgroundColor = "transparent";
    e.currentTarget.style.transform = "scale(1)";
  }}
>
  {text}
  <svg className="ml-2 w-5 h-5" /* arrow icon */>
    {/* Arrow path */}
  </svg>
</a>
```

**Variants**:

- White on dark backgrounds
- Blue (#0205B7) on light backgrounds

**Key values**:

- Height: 48px
- Min width: 180px
- Padding: 0 32px
- Border: 2px
- Border radius: 9999px (full pill)
- Transition: 0.2s
- Hover scale: 1.05
- Backdrop blur: 10px (on transparent)

---

### 6. Section Container Pattern

**Pattern**: Consistent container with 66px padding

```typescript
<section
  style={{
    position: "relative",
    paddingTop: "80px",
    paddingBottom: "80px",
    minHeight: "650px",
    backgroundColor: "#FFFBF5"
  }}
>
  <div
    style={{
      position: "relative",
      maxWidth: "1440px",
      margin: "0 auto",
      padding: "0 66px",
      zIndex: 10
    }}
  >
    {/* Content */}
  </div>
</section>
```

**Key values**:

- Max width: 1440px
- Horizontal padding: 66px
- Vertical padding: 80px (desktop), 48px (mobile)
- Background: #FFFBF5 (cream)
- Centered with `margin: 0 auto`

---

### 7. Text Content Layout

**Pattern**: Constrained text width for readability

```typescript
<div style={{ maxWidth: "600px" }}>
  <h2
    style={{
      fontFamily: "Figtree, Helvetica, sans-serif",
      fontSize: "48px",
      fontWeight: 700,
      lineHeight: "56px",
      color: "rgba(51, 51, 51, 1)",
      marginBottom: "32px"
    }}
  >
    {heading}
  </h2>

  <div
    style={{
      fontFamily: "Figtree, Helvetica, sans-serif",
      fontSize: "18px",
      fontWeight: 400,
      lineHeight: "28px",
      color: "rgba(94, 94, 94, 1)",
      marginBottom: "32px"
    }}
  >
    {content}
  </div>
</div>
```

**Key values**:

- Max content width: 600px
- Heading: 48px, weight 700, line-height 56px
- Body: 18px, weight 400, line-height 28px
- Heading color: #333333
- Body color: #5E5E5E
- Spacing: 32px between elements

---

## Layout Patterns

### 8. Z-Index System

**Pattern**: Layered z-index for proper stacking

```typescript
const zIndexLayers = {
  background: 0, // Background images
  decorative: 2, // Smoke effects, gradients
  content: 10, // Main content
  images: 20, // Foreground images
  overlappingImages: 30, // Images that overlap others
  header: 50, // Navigation (from AppLayout)
  modal: 100, // Modals, tooltips
};
```

**Usage**:

```typescript
<div style={{ zIndex: 2 }}>  {/* Smoke effect */}</div>
<div style={{ zIndex: 10 }}> {/* Text content */}</div>
<div style={{ zIndex: 20 }}> {/* Primary image */}</div>
<div style={{ zIndex: 30 }}> {/* Overlapping image */}</div>
```

---

### 9. Animation Wrapper Pattern

**Pattern**: Scroll-triggered animations with framer-motion

```typescript
import { AnimatedSection } from "@reiki-goddess/shared-components";

// Wrap sections for scroll animations
<AnimatedSection
  animation="fadeInUp"   // or fadeIn, scaleIn, slideInLeft, etc.
  delay={0.1}            // Delay in seconds
  threshold={0.2}        // Intersection threshold (0-1)
>
  <YourComponent />
</AnimatedSection>
```

**Animation types**:

- `fadeIn` - Simple opacity fade
- `fadeInUp` - Fade + upward motion (best for content sections)
- `scaleIn` - Scale from 95% to 100% (best for cards/images)
- `slideInLeft` - Slide from left
- `slideInRight` - Slide from right

**Timing**:

- Delay: 0.1s between sequential sections
- Threshold: 0.2 (trigger when 20% visible)

---

### 10. Responsive Grid Pattern

**Pattern**: Responsive grid with Tailwind classes

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {items.map(item => (
    <div key={item.id}>
      {/* Grid item */}
    </div>
  ))}
</div>
```

**Breakpoints**:

- Mobile (default): 1 column
- Tablet (md, 768px+): 2 columns
- Desktop (lg, 1024px+): 3 columns
- Gap: 32px (gap-8)

---

## Typography Patterns

### 11. Heading Hierarchy

```typescript
// Page heading (H1)
style={{
  fontFamily: "Figtree, sans-serif",
  fontSize: "63.55px",    // or 48-64px
  fontWeight: 700,
  lineHeight: "100%",
  color: "#FFFFFF",       // or #333333 on light bg
  marginBottom: "24px"
}}

// Section heading (H2)
style={{
  fontFamily: "Figtree, sans-serif",
  fontSize: "48px",
  fontWeight: 700,
  lineHeight: "56px",
  color: "rgba(51, 51, 51, 1)",
  marginBottom: "32px"
}}

// Subsection heading (H3)
style={{
  fontFamily: "Figtree, sans-serif",
  fontSize: "32px",
  fontWeight: 600,
  lineHeight: "40px",
  color: "rgba(51, 51, 51, 1)",
  marginBottom: "16px"
}}

// Body text
style={{
  fontFamily: "Figtree, sans-serif",
  fontSize: "18px",
  fontWeight: 400,
  lineHeight: "28px",
  color: "rgba(94, 94, 94, 1)"
}}
```

---

## Spacing Patterns

### 12. Consistent Spacing Scale

```typescript
const spacing = {
  xs: "8px", // Tight spacing within components
  sm: "16px", // Between related elements
  md: "24px", // Between sections elements
  lg: "32px", // Between major elements
  xl: "48px", // Between subsections
  xxl: "80px", // Between major sections

  // Special values
  buffer: "66px", // Universal page buffer
  sectionY: "80px", // Vertical section padding
  gap: "48px", // Standard gap between elements
};
```

**Usage**:

```typescript
// Between paragraphs
marginBottom: "16px";

// Between heading and content
marginBottom: "32px";

// Between sections
paddingTop: "80px";
paddingBottom: "80px";

// Page horizontal buffer
padding: "0 66px";
```

---

## Color Application Patterns

### 13. Color Usage Guidelines

```typescript
// Backgrounds
backgroundColor: "#FFFBF5"; // Main page background (cream)
backgroundColor: "#FFFFFF"; // Card/component backgrounds

// Text
color: "rgba(51, 51, 51, 1)"; // Primary text (dark charcoal)
color: "rgba(94, 94, 94, 1)"; // Secondary text (gray)
color: "rgba(158, 158, 158, 1)"; // Tertiary text (light gray)
color: "#FFFFFF"; // Text on dark backgrounds

// Brand accents
color: "#0205B7"; // Links, highlights, CTAs
backgroundColor: "#0205B7"; // Button backgrounds, accents

// Shadows
boxShadow: "0 0 40px rgba(0, 0, 0, 0.1)"; // Container shadow
boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)"; // Image shadow
boxShadow: "0px 42px 32.5px -13px rgba(2, 5, 183, 0.25)"; // Service card
```

---

## Accessibility Patterns

### 14. Focus States

```typescript
// Focus outline for interactive elements
style={{
  outline: "2px solid rgba(2, 5, 183, 1)",
  outlineOffset: "2px",
  borderRadius: "inherit"
}}
```

**Apply to**:

- Links
- Buttons
- Form inputs
- Interactive cards

---

### 15. Semantic HTML

```typescript
<main>
  <section aria-labelledby="hero-heading">
    <h1 id="hero-heading">Page Title</h1>
  </section>

  <section aria-labelledby="about-heading">
    <h2 id="about-heading">Section Title</h2>
    <article>
      {/* Content */}
    </article>
  </section>
</main>
```

**Key points**:

- Use semantic tags (`<section>`, `<article>`, `<nav>`)
- Connect headings with sections using `aria-labelledby`
- Maintain heading hierarchy (h1 → h2 → h3)
- Add `alt` text to all images
- Use `role="presentation"` for decorative images

---

## Implementation Checklist

When implementing About Page components, ensure:

### Visual

- [ ] Images have blue bevel background
- [ ] Images are rotated slightly for interest
- [ ] Smoke effects use triple-layer pattern
- [ ] 20px border radius on images
- [ ] Consistent shadows applied

### Layout

- [ ] 1440px max container width
- [ ] 66px horizontal padding
- [ ] 80px vertical section padding
- [ ] Proper z-index layering
- [ ] AnimatedSection wrappers

### Typography

- [ ] Figtree font family
- [ ] Correct heading hierarchy
- [ ] 600px max width for text
- [ ] Proper line heights
- [ ] Correct color values

### Spacing

- [ ] 32px between major elements
- [ ] 80px between sections
- [ ] 66px buffer maintained
- [ ] Consistent gaps in grids

### Accessibility

- [ ] Focus states on interactive elements
- [ ] Semantic HTML tags
- [ ] Proper heading hierarchy
- [ ] Alt text on images
- [ ] ARIA labels where needed

### Responsiveness

- [ ] Mobile padding (24px)
- [ ] Responsive grids
- [ ] Scaled typography
- [ ] Touch-friendly targets (min 44×44px)

---

## Quick Copy-Paste Templates

### Section Template

```typescript
<section
  style={{
    position: "relative",
    paddingTop: "80px",
    paddingBottom: "80px",
    backgroundColor: "#FFFBF5"
  }}
>
  <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "0 66px" }}>
    {/* Content */}
  </div>
</section>
```

### Image with Bevel Template

```typescript
<div
  style={{
    position: "absolute",
    width: "400px",
    height: "300px",
    transform: "rotate(-5deg)"
  }}
>
  <div
    style={{
      position: "absolute",
      inset: 0,
      backgroundColor: "#0205B7",
      borderRadius: "24px",
      transform: "translate(-5px, 5px)"
    }}
  />
  <img
    src="/img/image.jpg"
    alt="Description"
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
      borderRadius: "24px",
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
      position: "relative",
      zIndex: 1
    }}
  />
</div>
```

### Button Template

```typescript
<a
  href="/link"
  style={{
    fontFamily: "Figtree, Helvetica, sans-serif",
    fontSize: "16px",
    fontWeight: 500,
    minWidth: "180px",
    height: "48px",
    padding: "0 32px",
    backgroundColor: "transparent",
    color: "#0205B7",
    border: "2px solid #0205B7",
    borderRadius: "9999px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s"
  }}
>
  Button Text
  <svg className="ml-2 w-5 h-5">{/* Arrow */}</svg>
</a>
```

---

## Reference Files

**Homepage Components** (for pattern examples):

- `/packages/shared-components/src/Homepage/Homepage.tsx`
- `/packages/shared-components/src/Hero/HeroV2.tsx`
- `/packages/shared-components/src/MeetTheGoddess/MeetTheGoddess.tsx`

**Design System**:

- `/packages/design-system/src/colors.ts`
- `/packages/design-system/src/typography.ts`
- `/packages/design-system/src/layout.ts`

**Architecture**:

- `/docs/project/ARCHITECTURE.md`

---

**Quick Reference Version**: 1.0
**Last Updated**: 2025-10-06
**Related**: [Design Implementation](./design-implementation.md) | [Extraction Guide](./figma-extraction-guide.md)
