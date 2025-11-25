# Blog page style guide

**Feature**: Blog Page Styling Reference
**Created**: 2025-10-07
**Purpose**: Quick reference guide for styling blog pages and articles to match existing codebase patterns
**Status**: Complete - Ready for Implementation

---

## Table of contents

1. [Quick reference](#quick-reference)
2. [Design tokens](#design-tokens)
3. [Component styling patterns](#component-styling-patterns)
4. [Typography guidelines](#typography-guidelines)
5. [Layout and spacing](#layout-and-spacing)
6. [Interactive states](#interactive-states)
7. [Responsive design](#responsive-design)
8. [Accessibility requirements](#accessibility-requirements)
9. [Implementation checklist](#implementation-checklist)

---

## Quick reference

### Essential design rules

```typescript
// The golden rules for blog page styling
const BLOG_STYLE_RULES = {
  // 1. Universal padding (66px desktop, 20px mobile)
  containerPadding: "px-[66px] md:px-5",

  // 2. Primary brand blue for all interactive elements
  primaryColor: "#0205B7",

  // 3. Cream background for all pages
  pageBackground: "#FFFBF5",

  // 4. Card radius is always 20px
  cardBorderRadius: "rounded-[20px]",

  // 5. Figtree font family throughout
  fontFamily: "font-[Figtree]",

  // 6. Standard card shadow
  cardShadow: "box-shadow: 0px 42px 32.5px -13px rgba(2, 5, 183, 0.25)",
};
```

### Color palette

| Usage           | Color      | Hex/RGBA  | Tailwind Class  |
| --------------- | ---------- | --------- | --------------- |
| Primary CTA     | Brand Blue | `#0205B7` | `bg-[#0205B7]`  |
| Page Background | Cream      | `#FFFBF5` | `bg-[#FFFBF5]`  |
| Card Background | White      | `#FFFFFF` | `bg-white`      |
| Heading Text    | Charcoal   | `#333333` | `text-gray-800` |
| Body Text       | Dark Gray  | `#5E5E5E` | `text-gray-600` |
| Meta Text       | Gray       | `#5E5E5E` | `text-gray-500` |

### Typography scale

| Element             | Desktop          | Mobile          | Weight | Line Height |
| ------------------- | ---------------- | --------------- | ------ | ----------- |
| Page Title          | 48px (text-5xl)  | 30px (text-3xl) | 700    | 1.2         |
| Card Title Featured | 30px (text-3xl)  | 24px (text-2xl) | 600    | 1.375       |
| Card Title Default  | 20px (text-xl)   | 18px (text-lg)  | 600    | 1.375       |
| Body Text           | 16px (text-base) | 16px            | 400    | 1.625       |
| Meta Text           | 14px (text-sm)   | 14px            | 400    | 1.5         |

### Spacing system

| Element              | Desktop      | Mobile       |
| -------------------- | ------------ | ------------ |
| Container Horizontal | 66px         | 20px         |
| Section Vertical     | 48px (py-12) | 40px (py-10) |
| Grid Gap             | 32px (gap-8) | 24px (gap-6) |
| Card Content Padding | 24px (p-6)   | 16px (p-4)   |

---

## Design tokens

### Import from design system

```typescript
// Use existing design tokens
import { colors } from "@reiki-goddess/design-system";
import {
  fontFamilies,
  fontSizes,
  fontWeights,
} from "@reiki-goddess/design-system";
import { LAYOUT } from "@reiki-goddess/design-system";

// Available tokens
const tokens = {
  // Colors
  brandBlue: colors.brand.blue, // rgba(2, 5, 183, 1)
  brandPurple: colors.brand.purple, // rgba(165, 147, 224, 1)
  brandPeach: colors.brand.peach, // rgba(255, 198, 165, 1)
  brandCyan: colors.brand.cyan, // rgba(99, 213, 249, 1)

  // Backgrounds
  pageBackground: colors.background.primary, // #FFFBF5
  cardBackground: colors.background.white, // #ffffff

  // Text
  textPrimary: colors.text.primary, // rgba(51, 51, 51, 1)
  textSecondary: colors.text.secondary, // rgba(94, 94, 94, 1)

  // Typography
  fontFamily: fontFamilies.primary, // Figtree, Helvetica, sans-serif

  // Layout
  containerPadding: LAYOUT.container.padding, // 66px
  borderRadiusCard: LAYOUT.borderRadius.card, // 20px
  cardShadow: LAYOUT.shadows.serviceCard, // Blog card shadow
};
```

### Category color system

```typescript
// Category badge colors (use in BlogCard)
const CATEGORY_COLORS = {
  healing: {
    background: "rgba(2, 5, 183, 0.1)", // Light blue bg
    text: "#0205B7", // Brand blue text
  },
  wellness: {
    background: "rgba(165, 147, 224, 0.1)", // Light purple bg
    text: "#A593E0", // Purple text
  },
  events: {
    background: "rgba(255, 198, 165, 0.1)", // Light peach bg
    text: "#FFC6A5", // Peach text
  },
  stories: {
    background: "rgba(99, 213, 249, 0.1)", // Light cyan bg
    text: "#63D5F9", // Cyan text
  },
  meditation: {
    background: "rgba(165, 147, 224, 0.15)",
    text: "#8B7BC8",
  },
  chakras: {
    background: "rgba(99, 213, 249, 0.15)",
    text: "#4AC4E8",
  },
  testimonials: {
    background: "rgba(196, 169, 98, 0.15)",
    text: "#C4A962",
  },
  news: {
    background: "rgba(2, 5, 183, 0.15)",
    text: "#0205B7",
  },
  guides: {
    background: "rgba(255, 198, 165, 0.15)",
    text: "#FFB088",
  },
};
```

---

## Component styling patterns

### BlogCard component

**File**: `/packages/shared-components/src/Blog/BlogCard/BlogCard.tsx`

#### CSS structure

```css
/* BlogCard.css */
.blog-card {
  /* Base styles */
  @apply bg-white rounded-[20px] overflow-hidden cursor-pointer;
  box-shadow: 0px 42px 32.5px -13px rgba(2, 5, 183, 0.25);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* Hover effect - lift animation */
.blog-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(2, 5, 183, 0.2);
}

/* Image zoom on hover */
.blog-card:hover .blog-card-image {
  transform: scale(1.05);
}

/* Focus state for accessibility */
.blog-card-link:focus {
  @apply outline-none ring-2 ring-[#0205B7] ring-offset-2 rounded-[20px];
}
```

#### Tailwind classes

```tsx
// Card container
className = "blog-card bg-white rounded-[20px] overflow-hidden";

// Image container
className = "h-60 md:h-52 overflow-hidden"; // Default variant
className = "h-96 md:h-64 overflow-hidden"; // Featured variant

// Content area
className = "p-6 md:p-4 flex flex-col gap-3";

// Category badge
className =
  "inline-block px-3 py-1 rounded-xl text-xs font-semibold uppercase tracking-wide";

// Title
className = "text-xl md:text-lg font-semibold text-gray-800 line-clamp-2"; // Default
className = "text-3xl md:text-2xl font-semibold text-gray-800 line-clamp-2"; // Featured

// Excerpt
className = "text-base text-gray-600 leading-relaxed line-clamp-3";

// Metadata
className =
  "mt-4 pt-3 border-t border-gray-200 flex items-center gap-4 text-sm text-gray-500";
```

### BlogHero component

**File**: `/packages/shared-components/src/Blog/BlogHero/BlogHero.tsx`

```tsx
// Container
className="relative h-[500px] md:h-[300px] flex items-center justify-center text-center px-[66px] py-[66px] md:px-5 md:py-5"

// Gradient background (if no image)
style={{ background: 'linear-gradient(135deg, #A593E0 0%, #FFC6A5 100%)' }}

// Content wrapper
className="max-w-[600px] z-10"

// Title
className="text-5xl md:text-3xl font-bold text-white mb-4 leading-tight"

// Description
className="text-lg md:text-base text-white/95 leading-relaxed"
```

### CategoryFilter component

**File**: `/packages/shared-components/src/Blog/CategoryFilter/CategoryFilter.tsx`

```tsx
// Sticky container
className =
  "sticky top-[93px] z-40 bg-[#FFFBF5] border-b border-[#0205B7]/10 py-6 md:py-4 px-[66px] md:px-5";

// Filter pills container
className = "flex gap-3 overflow-x-auto scrollbar-hide";

// Filter pill (inactive)
className =
  "px-6 py-2.5 md:px-4 md:py-2 rounded-full text-base md:text-sm font-medium border-2 border-[#0205B7] text-[#0205B7] bg-transparent hover:bg-[#0205B7]/10 transition-all duration-300 ease-in-out whitespace-nowrap flex-shrink-0";

// Filter pill (active)
className =
  "px-6 py-2.5 md:px-4 md:py-2 rounded-full text-base md:text-sm font-medium border-2 border-[#0205B7] bg-[#0205B7] text-white transition-all duration-300 ease-in-out whitespace-nowrap flex-shrink-0";

// Focus state
className =
  "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0205B7]";
```

### BlogGrid component

**File**: `/packages/shared-components/src/Blog/BlogGrid/BlogGrid.tsx`

```tsx
// Container
className = "px-[66px] py-12 md:px-5 md:py-8 max-w-[1440px] mx-auto";

// Grid layout
className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-6";

// Loading spinner
className =
  "w-12 h-12 border-4 border-[#0205B7]/20 border-t-[#0205B7] rounded-full animate-spin";

// Error message
className = "text-lg text-red-600"; // Error title
className = "text-sm text-gray-600"; // Error description

// Empty state
className = "text-lg text-gray-600"; // Empty message
```

---

## Typography guidelines

### Font family hierarchy

```css
/* Primary font for all text */
font-family:
  "Figtree",
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  "Roboto",
  sans-serif;
```

### Text styles by element

#### Page-level typography

```tsx
// Blog page hero title
<h1 className="text-5xl md:text-3xl font-bold text-white leading-tight">
  Healing Insights
</h1>

// Hero description
<p className="text-lg md:text-base text-white/95 leading-relaxed">
  Explore articles, insights, and guidance...
</p>
```

#### Card-level typography

```tsx
// Card title (default variant)
<h3 className="text-xl md:text-lg font-semibold text-gray-800 line-clamp-2 leading-snug">
  {post.title}
</h3>

// Card title (featured variant)
<h3 className="text-3xl md:text-2xl font-semibold text-gray-800 line-clamp-2 leading-snug">
  {post.title}
</h3>

// Card excerpt
<p className="text-base text-gray-600 leading-relaxed line-clamp-3">
  {post.excerpt}
</p>

// Card metadata
<div className="text-sm text-gray-500">
  <time>{formatDate}</time> • <span>{readTime}</span>
</div>
```

#### Category badges

```tsx
<span className="text-xs font-semibold uppercase tracking-wide">
  {category}
</span>
```

### Text truncation

```css
/* 2-line truncation (titles) */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 3-line truncation (excerpts) */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

---

## Layout and spacing

### Universal padding rule (66px)

**Desktop**: All sections use `px-[66px]` horizontal padding
**Mobile**: All sections use `px-5` (20px) horizontal padding

```tsx
// Standard section container
<section className="px-[66px] md:px-5 py-12 md:py-8">{/* Content */}</section>
```

### Container system

```tsx
// Max-width container with auto centering
<div className="max-w-[1440px] mx-auto px-[66px] md:px-5">{/* Content */}</div>
```

### Grid system

```tsx
// Responsive 3-column grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-6">
  {posts.map((post) => (
    <BlogCard key={post.id} post={post} />
  ))}
</div>
```

**Breakpoints**:

- Mobile: `grid-cols-1` (< 768px)
- Tablet: `md:grid-cols-2` (768px - 1023px)
- Desktop: `lg:grid-cols-3` (≥ 1024px)

### Spacing scale

| Usage            | Desktop | Mobile | Tailwind         |
| ---------------- | ------- | ------ | ---------------- |
| Section vertical | 48px    | 32px   | `py-12 md:py-8`  |
| Grid gap         | 32px    | 24px   | `gap-8 md:gap-6` |
| Card content     | 24px    | 16px   | `p-6 md:p-4`     |
| Title margin     | 12px    | 12px   | `mt-3`           |
| Meta padding top | 12px    | 12px   | `pt-3`           |

---

## Interactive states

### Hover effects

#### Card hover (lift animation)

```css
.blog-card {
  transition: all 0.3s ease;
}

.blog-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(2, 5, 183, 0.2);
}

/* Image scale on card hover */
.blog-card:hover .blog-card-image {
  transform: scale(1.05);
}
```

#### Filter pill hover

```tsx
// Inactive pill hover
className = "hover:bg-[#0205B7]/10 transition-all duration-300 ease-in-out";
```

### Active states

#### Filter pill active state

```tsx
className = "bg-[#0205B7] text-white border-[#0205B7]";
```

### Focus states (accessibility)

```css
/* Card link focus */
.blog-card-link:focus {
  outline: none;
  ring: 2px solid #0205b7;
  ring-offset: 2px;
  border-radius: 20px;
}

/* Button focus */
.filter-pill:focus {
  outline: none;
  ring: 2px solid #0205b7;
  ring-offset: 2px;
}
```

### Loading states

```tsx
// Spinner animation
<div className="w-12 h-12 border-4 border-[#0205B7]/20 border-t-[#0205B7] rounded-full animate-spin" />

// Loading text
<p className="text-lg text-gray-600 mt-4">Loading posts...</p>
```

### Error states

```tsx
// Error message container
<div
  role="alert"
  aria-live="assertive"
  className="text-center max-w-md mx-auto"
>
  <p className="text-lg text-red-600 mb-2">Error loading blog posts</p>
  <p className="text-sm text-gray-600">{error.message}</p>
</div>
```

---

## Responsive design

### Breakpoint system

```typescript
const breakpoints = {
  mobile: "< 768px",
  tablet: "768px - 1023px",
  desktop: "≥ 1024px",
};
```

### Mobile-first approach

Always write mobile styles first, then add `md:` and `lg:` modifiers:

```tsx
// ✅ Correct (mobile-first)
className = "text-3xl md:text-4xl lg:text-5xl";

// ❌ Incorrect (desktop-first)
className = "lg:text-5xl md:text-4xl text-3xl";
```

### Component adaptations

#### BlogHero

```tsx
// Height
className = "h-[300px] md:h-[500px]";

// Padding
className = "px-5 py-5 md:px-[66px] md:py-[66px]";

// Typography
className = "text-3xl md:text-5xl"; // Title
className = "text-base md:text-lg"; // Description
```

#### BlogCard

```tsx
// Image height
className = "h-52 md:h-60"; // Default
className = "h-64 md:h-96"; // Featured

// Content padding
className = "p-4 md:p-6";

// Title size
className = "text-lg md:text-xl"; // Default
className = "text-2xl md:text-3xl"; // Featured
```

#### CategoryFilter

```tsx
// Padding
className = "px-5 py-4 md:px-[66px] md:py-6";

// Pill padding
className = "px-4 py-2 md:px-6 md:py-2.5";

// Font size
className = "text-sm md:text-base";
```

#### BlogGrid

```tsx
// Container padding
className = "px-5 py-8 md:px-[66px] md:py-12";

// Grid columns
className = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

// Gap
className = "gap-6 md:gap-8";
```

### Touch targets (mobile)

Ensure all interactive elements meet **44px × 44px minimum** for WCAG 2.5.5:

```tsx
// Filter pills have adequate touch area
className = "px-4 py-2"; // Results in ~44px height with padding
```

---

## Accessibility requirements

### ARIA attributes

#### BlogHero

```tsx
<section aria-labelledby="blog-hero-title">
  <h1 id="blog-hero-title">Healing Insights</h1>
</section>
```

#### CategoryFilter

```tsx
<nav aria-label="Blog category filters">
  <div role="tablist" aria-controls="blog-posts-grid">
    <button role="tab" aria-selected={isActive} aria-controls="blog-posts-grid">
      {category}
    </button>
  </div>
</nav>
```

#### BlogGrid

```tsx
<div
  id="blog-posts-grid"
  role="region"
  aria-label="Blog posts"
  aria-live="polite"
>
  {/* Posts */}
</div>
```

#### BlogCard

```tsx
<article aria-label={`Blog post: ${post.title}`}>
  <Link to={`/blog/${post.slug}`} aria-label={`Read more about ${post.title}`}>
    <h3 id={`post-title-${post.id}`}>{post.title}</h3>
  </Link>
</article>
```

### Color contrast

All text meets **WCAG 2.1 AA standards** (4.5:1 for normal text):

| Foreground         | Background      | Ratio  | Status |
| ------------------ | --------------- | ------ | ------ |
| Gray 800 (#333)    | Cream (#FFFBF5) | 11.2:1 | ✅ AAA |
| Gray 600 (#5E5E5E) | White           | 7.1:1  | ✅ AAA |
| White              | Blue (#0205B7)  | 8.9:1  | ✅ AAA |

### Keyboard navigation

```tsx
// Focus indicators
<button className="focus:outline-none focus:ring-2 focus:ring-[#0205B7] focus:ring-offset-2">
  Filter
</button>

<Link className="focus:outline-none focus:ring-2 focus:ring-[#0205B7] focus:ring-offset-2 rounded-[20px]">
  Read more
</Link>
```

### Screen reader support

```tsx
// Descriptive alt text
<img alt={`Featured image for ${post.title}`} />

// Hidden decorative elements
<span aria-hidden="true">•</span>

// Loading announcements
<div role="status" aria-live="polite">
  <p>Loading posts...</p>
</div>

// Error announcements
<div role="alert" aria-live="assertive">
  <p>Error loading posts</p>
</div>
```

---

## Implementation checklist

### Before you start

- [ ] Read `/docs/design/blog-page-migration/design-specifications.md` for complete specs
- [ ] Read `/docs/design/blog-page-migration/component-architecture.md` for technical details
- [ ] Review existing BlogCard, BlogHero, CategoryFilter, BlogGrid components
- [ ] Import design tokens from `@reiki-goddess/design-system`

### Component styling

- [ ] Use Figtree font family for all text
- [ ] Apply 66px horizontal padding on desktop, 20px on mobile
- [ ] Use #0205B7 brand blue for all primary interactions
- [ ] Apply 20px border radius to all cards
- [ ] Use standard card shadow: `box-shadow: 0px 42px 32.5px -13px rgba(2, 5, 183, 0.25)`
- [ ] Implement hover lift effect: `translateY(-8px)` with enhanced shadow
- [ ] Apply 0.3s transition timing to all animations

### Typography

- [ ] Page titles: 48px desktop (text-5xl), 30px mobile (text-3xl), weight 700
- [ ] Card titles: 20px desktop (text-xl), 18px mobile (text-lg), weight 600
- [ ] Body text: 16px (text-base), weight 400, line-height 1.625
- [ ] Meta text: 14px (text-sm), weight 400, color gray-500
- [ ] Category badges: 12px (text-xs), weight 600, uppercase

### Layout and spacing

- [ ] Container max-width: 1440px with auto centering
- [ ] Grid: 3 columns desktop, 2 tablet, 1 mobile
- [ ] Grid gap: 32px desktop (gap-8), 24px mobile (gap-6)
- [ ] Card content padding: 24px desktop (p-6), 16px mobile (p-4)
- [ ] Section vertical padding: 48px desktop (py-12), 32px mobile (py-8)

### Interactive states

- [ ] Hover: Card lift animation with shadow enhancement
- [ ] Active: Filter pills use bg-[#0205B7] with white text
- [ ] Focus: 2px ring with 2px offset, color #0205B7
- [ ] Loading: Spinner with brand blue color
- [ ] Error: Red text (text-red-600) with gray description

### Responsive design

- [ ] Mobile-first class order (base → md: → lg:)
- [ ] Hero: 300px mobile, 500px desktop
- [ ] Card images: 208px mobile (h-52), 240px desktop (h-60)
- [ ] Touch targets minimum 44px × 44px on mobile

### Accessibility

- [ ] Semantic HTML (article, nav, section, time)
- [ ] ARIA attributes (role, aria-label, aria-selected, aria-live)
- [ ] Focus indicators visible on all interactive elements
- [ ] Color contrast minimum 4.5:1 (WCAG AA)
- [ ] Keyboard navigation support
- [ ] Screen reader announcements for dynamic content

### Testing

- [ ] Test at 375px (mobile), 768px (tablet), 1440px (desktop)
- [ ] Test keyboard navigation (Tab, Enter, Space)
- [ ] Test screen reader announcements (NVDA/VoiceOver)
- [ ] Test color contrast with automated tools
- [ ] Test hover/focus states on all interactive elements
- [ ] Test loading/error/empty states

---

## Related documentation

- **Complete Design Specifications**: `/docs/design/blog-page-migration/design-specifications.md`
- **Component Architecture**: `/docs/design/blog-page-migration/component-architecture.md`
- **Design Implementation Strategy**: `/docs/design/blog-page-migration/design-implementation.md`
- **Component Specs**: `/docs/design/blog-page-migration/COMPONENT_SPECS.md`
- **Testing Strategy**: `/docs/design/blog-page-migration/testing-strategy.md`
- **Global Style Guide**: `/docs/design/style-guide.md` (if exists)
- **Design System**: `/packages/design-system/`

---

**Document version**: 1.0
**Last updated**: 2025-10-07
**Status**: Complete - Ready for Implementation
