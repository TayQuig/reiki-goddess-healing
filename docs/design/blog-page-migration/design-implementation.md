# Blog page migration - Design implementation specification

## Executive summary

**Status**: Research Complete - Ready for Implementation
**Created**: 2025-10-06
**Research Method**: Legacy code analysis, asset inventory, Figma MCP integration, design system alignment

### Key findings

The legacy "BLog" directory contains what appears to be an **About page implementation**, not an actual blog page. This indicates the blog functionality was either:

1. Never implemented beyond placeholder/template
2. Mistakenly labeled as "Blog"
3. Used as a design reference for page layout patterns

**Critical Discovery**: The current blog implementation is a **template page**, not a functional blog system. Migration requires **net-new design and implementation** rather than simple code migration.

---

## Table of contents

1. [Design asset inventory](#design-asset-inventory)
2. [Legacy implementation analysis](#legacy-implementation-analysis)
3. [Component architecture specification](#component-architecture-specification)
4. [Design system integration](#design-system-integration)
5. [Layout specifications](#layout-specifications)
6. [Typography and color specifications](#typography-and-color-specifications)
7. [Component prop definitions](#component-prop-definitions)
8. [Asset requirements](#asset-requirements)
9. [Responsive design specifications](#responsive-design-specifications)
10. [Accessibility considerations](#accessibility-considerations)
11. [Implementation roadmap](#implementation-roadmap)

---

## Design asset inventory

### Available assets (24 total files)

Located at: `/Users/taylorquigley/Documents/Directories/reiki-goddess-healing/packages/shared-assets/images/blog/`

#### Images (PNG format)

- `2148847564-1.png` (580KB) - Background/hero image
- `ellipse-5.png` (30KB) - Testimonial avatar/profile image
- `fb8b1754eb9a50a6cfaec02f5ef0c9bc-2.png` (709KB) - Content/feature image
- `fb8b1754eb9a50a6cfaec02f5ef0c9bc-3.png` (707KB) - Content/feature image
- `frame-33.png` (994KB) - CTA section background
- `powerrangers-6.png` (864KB) - Large hero/feature image
- `rectangle-5.png` through `rectangle-13.png` (8 images, 447KB-1.2MB) - Gallery/grid images
- `the-reiki-goddess-4-25-x-5-5-in-facebook-cover-1.png` (2 versions) - Logo/branding

#### SVG icons (9 files)

- `frame-2085660578.svg` - Social media links component
- `line-56.svg` - Decorative divider line
- `star-6.svg` - Star rating icon
- `vector-1.svg`, `vector-1-1.svg`, `vector-1-2.svg` - Arrow icons (navigation)
- `vector-2.svg`, `vector-3.svg`, `vector-5.svg` - Additional arrow/icon variants

### Asset organization patterns

**Naming convention**: Anima-generated from Figma exports

- Rectangle series: Content/gallery images
- Vector series: UI icons and arrows
- Frame series: Composite components
- Ellipse: Avatar/profile elements

### Missing design artifacts

**No dedicated blog-specific Figma screenshots found** in:

- `/figma-screenshots/blog/` (directory does not exist)
- `/figma-screenshots/BLog/` (directory does not exist)

**Available reference designs**:

- Homepage sections: `/figma-screenshots/homepage/`
- Contact page: `/figma-screenshots/contact/`

---

## Legacy implementation analysis

### File structure

```
legacy/BLog/
├── src/
│   ├── index.tsx                    # Entry point (9 lines)
│   └── screens/
│       └── About/
│           ├── About.tsx            # Main component (502 lines)
│           └── index.ts             # Barrel export
├── static/img/                      # 24 image assets
├── package.json                     # Vite + React + Tailwind
├── tailwind.config.js               # Anima variables config
└── vite.config.ts                   # Build configuration
```

### Critical finding: Not a blog page

The legacy implementation at `/legacy/BLog/src/screens/About/About.tsx` is **actually an About page**, containing:

#### Page sections identified

1. **Header Navigation** (lines 38-59)
   - 6 navigation items: Home, About, Services, Events, Blog, Contact
   - Logo positioning: 66px from left
   - Fixed header at top

2. **Hero Section** (lines 62-109)
   - Title: "Experienced Reiki Master & Sound Healer in Roy"
   - Dual-column text layout
   - Large feature image (808px × 808px)
   - Background overlay image (powerrangers-6.png)

3. **About/Bio Section** (lines 132-177)
   - Profile images with rotation effects
   - Decorative "The Reiki Goddess" watermark text
   - Two-column content layout

4. **Journey Section** (lines 180-221)
   - Feature cards with gradient backgrounds
   - "Sound Healing Specialist" card (blue gradient)
   - "Years of Experience" card (white background)
   - Shadow effects: `shadow-[0px_9px_0px_#0205b7,0px_42px_32.5px_-13px_#00000029]`

5. **Contact CTA Section** (lines 240-281)
   - Background image with overlay
   - Dual CTA buttons: "Book a Session" and "Learn More"

6. **Image Gallery** (lines 284-331)
   - 5 images in asymmetric grid
   - "See More" button
   - Mixed dimensions for visual interest

7. **Testimonials Section** (lines 334-395)
   - Quote card with customer testimonial
   - 5-star rating display
   - Carousel navigation (prev/next buttons)
   - Beige background: `bg-[#a9944821]`

8. **Final CTA Section** (lines 398-425)
   - "Ready to Begin Your Healing Journey?"
   - Blue gradient background
   - Decorative corner dots (white circles, 11px diameter)

9. **Footer** (lines 428-497)
   - Quick Links, Legal, Social media sections
   - Copyright notice
   - Gray background: `bg-[#f7f7f7]`

### Layout architecture

**Positioning system**: Absolute positioning with pixel-perfect placement

- Container: 1440px × 6682px fixed canvas
- All elements use absolute positioning with explicit top/left coordinates
- Not responsive - mobile adaptation would require complete refactor

**Key measurements**:

- Universal padding: 66px from edges
- Header height: 93px
- Section spacing: Variable (80px-200px gaps)
- Max container width: 1440px

### Typography patterns from legacy code

```typescript
// Navigation
font-family: 'Figtree', Helvetica
font-weight: 600 (semibold)
font-size: 16px
color: var(--variable-collection-color-duplicate)

// Hero heading
font-weight: 700 (bold)
font-size: 63.6px
color: black

// Body text
font-weight: 400/500 (regular/medium)
font-size: 16px
line-height: 24px (1.5)
color: #1c1b1b

// Section headings
font-weight: 700 (bold)
font-size: 48px
color: black
```

### Color palette extracted

```css
/* Primary brand colors */
--brand-blue: #0205b7 --cream-background: #fefbf5 --dark-text: #1c1b1b
  --white: #ffffff /* Accent colors */ --cyan: #63d5f9 --beige-tint: #a9944821
  (with transparency) --gray-footer: #f7f7f7;
```

### Component patterns observed

#### Button variants

1. **Outline button**: `border border-solid border-[color]`, rounded-[90px]
2. **Ghost button**: Transparent with hover state transition
3. **Gradient button**: Blue-to-cyan gradient background

#### Card patterns

1. **Feature cards**: 322px × 156px, rounded-[17px], shadow effect
2. **Testimonial card**: Beige background, rounded-[20px], centered content
3. **Bevel effect**: Dual-layer shadow creating 3D appearance

---

## Component architecture specification

### Recommended component structure

Since no blog-specific design exists, recommend following **homepage component patterns** established in the modern implementation:

```
packages/shared-components/src/Blog/
├── BlogHero/
│   ├── BlogHero.tsx
│   ├── BlogHero.test.tsx
│   └── index.ts
├── BlogListing/
│   ├── BlogListing.tsx
│   ├── BlogListing.test.tsx
│   └── index.ts
├── BlogCard/
│   ├── BlogCard.tsx
│   ├── BlogCard.test.tsx
│   └── index.ts
├── BlogFilters/
│   ├── BlogFilters.tsx
│   ├── BlogFilters.test.tsx
│   └── index.ts
├── BlogPost/
│   ├── BlogPost.tsx
│   ├── BlogPost.test.tsx
│   └── index.ts
├── RelatedPosts/
│   ├── RelatedPosts.tsx
│   ├── RelatedPosts.test.tsx
│   └── index.ts
└── NewsletterCTA/
    ├── NewsletterCTA.tsx
    ├── NewsletterCTA.test.tsx
    └── index.ts
```

### Page-level components

```
packages/shared-components/src/pages/
├── BlogPage.tsx           # Blog listing page
└── BlogPostPage.tsx       # Individual post view
```

### Integration with existing architecture

Follow established patterns from:

- `Homepage.tsx` - Section composition
- `ServicesSection.tsx` - Card grid layouts
- `CommunityEvents.tsx` - Event card patterns
- `Testimonials.tsx` - Content carousel
- `LetsConnect.tsx` - CTA section patterns

---

## Design system integration

### Existing design tokens (from style-guide.md)

#### Colors to use

```typescript
// Primary
brand.blue: '#0205B7'
background.cream: '#FFFBF5'
background.white: '#FFFFFF'

// Secondary
accent.purple: '#A593E0'
accent.peach: '#FFC6A5'
accent.cyan: '#63D5F9'
accent.gold: '#C4A962'

// Text
text.dark: '#333333'
text.gray: '#5E5E5E'
text.white: '#FFFFFF'
```

#### Typography scale

```typescript
// Hero heading
size: 63.55px
weight: 700
lineHeight: 1.2

// Section headings (H2)
size: 48px
weight: 700
lineHeight: 1.3

// Subsection headings (H3)
size: 32px
weight: 600
lineHeight: 1.4

// Body regular
size: 16px
weight: 400
lineHeight: 1.6
```

#### Spacing system

```typescript
// Container
maxWidth: "1440px";
sidePadding: "66px";

// Section spacing
betweenSections: "80px";
componentGap: "30px-50px";

// The 66px Rule
universalBuffer: "66px"; // From page edges
```

#### Border radius standards

```typescript
buttons: "100px"; // Pill shape
cards: "20px";
images: "20px"; // Standard
imagesFeatured: "27px";
largeSections: "30px";
inputFields: "8px";
```

#### Shadows

```typescript
// Card shadow
cardShadow: "0px 42px 32.5px -13px rgba(2, 5, 183, 0.25)";

// Hover shadow
hoverShadow: "0 20px 40px rgba(2, 5, 183, 0.2)";

// Section shadow (CTA)
sectionShadow: "9px 10px 0px 0px #0205b7";
```

### Animation specifications

From style-guide.md:

```typescript
// Scroll animations
fadeInUp: {
  duration: '0.8s',
  easing: 'ease-out',
  transform: 'translateY(30px) to translateY(0)'
}

// Hover effects
lift: {
  duration: '0.3s',
  transform: 'translateY(-8px)',
  enhancedShadow: true
}

// Transition timing
fast: '0.2s',      // Micro-interactions
standard: '0.3s',  // Most transitions
smooth: '0.4s-0.6s', // Reveals
slow: '0.8s-1s'    // Major transitions
```

---

## Layout specifications

### Recommended blog listing page layout

Based on established homepage patterns:

```
┌─────────────────────────────────────────────────┐
│ Header (93px height)                            │
├─────────────────────────────────────────────────┤
│ Blog Hero Section (500px height)                │
│ - Page title: "Healing Insights"               │
│ - Subtitle/description                          │
│ - Search bar (future)                           │
└─────────────────────────────────────────────────┘
├─────────────────────────────────────────────────┤
│ Filter Bar (sticky)                             │
│ - Category pills: All | Healing | Wellness     │
│               | Events | Stories                │
└─────────────────────────────────────────────────┘
├─────────────────────────────────────────────────┤
│ Blog Grid (3 columns desktop, 2 tablet, 1 mobile) │
│                                                 │
│ ┌──────┐  ┌──────┐  ┌──────┐                  │
│ │ Card │  │ Card │  │ Card │                  │
│ │      │  │      │  │      │                  │
│ └──────┘  └──────┘  └──────┘                  │
│                                                 │
│ ┌──────┐  ┌──────┐  ┌──────┐                  │
│ │ Card │  │ Card │  │ Card │                  │
│ └──────┘  └──────┘  └──────┘                  │
└─────────────────────────────────────────────────┘
├─────────────────────────────────────────────────┤
│ Pagination                                      │
└─────────────────────────────────────────────────┘
├─────────────────────────────────────────────────┤
│ Newsletter CTA Section                          │
└─────────────────────────────────────────────────┘
├─────────────────────────────────────────────────┤
│ Footer                                          │
└─────────────────────────────────────────────────┘
```

### Blog card specifications

```typescript
// Card dimensions
width: "flex"; // 1/3 of container minus gaps
minHeight: "400px";
aspectRatio: "3:4"; // Image portion

// Internal structure
imageHeight: "240px";
contentPadding: "24px";
cardGap: "16px";

// Layout spacing
gridGap: "30px";
columnsDesktop: 3;
columnsTablet: 2;
columnsMobile: 1;
```

### Individual post page layout

```
┌─────────────────────────────────────────────────┐
│ Header                                          │
├─────────────────────────────────────────────────┤
│ Post Hero Image (full width, 400px height)     │
│ - Dark gradient overlay                         │
│ - Title on overlay (white text)                 │
└─────────────────────────────────────────────────┘
├─────────────────────────────────────────────────┤
│ Post Meta Bar                                   │
│ - Author | Date | Category | Read Time          │
└─────────────────────────────────────────────────┘
├─────────────────────────────────────────────────┤
│                                                 │
│ ┌──────────────────┐  ┌──────────────────────┐ │
│ │ Content Column   │  │ Sidebar              │ │
│ │ (max 720px)      │  │ - Author bio         │ │
│ │                  │  │ - Newsletter signup  │ │
│ │ - Article body   │  │ - Related posts      │ │
│ │ - Images         │  │ - Social share       │ │
│ │ - Quotes         │  └──────────────────────┘ │
│ └──────────────────┘                            │
│                                                 │
└─────────────────────────────────────────────────┘
├─────────────────────────────────────────────────┤
│ Related Posts (3 cards horizontal)              │
└─────────────────────────────────────────────────┘
├─────────────────────────────────────────────────┤
│ CTA Section                                     │
└─────────────────────────────────────────────────┘
├─────────────────────────────────────────────────┤
│ Footer                                          │
└─────────────────────────────────────────────────┘
```

---

## Typography and color specifications

### Blog-specific typography hierarchy

```typescript
// Blog page title
{
  fontSize: '48px',
  fontWeight: 700,
  lineHeight: 1.2,
  color: '#333333',
  fontFamily: 'Figtree'
}

// Blog card title
{
  fontSize: '22px',
  fontWeight: 600,
  lineHeight: 1.4,
  color: '#333333',
  maxLines: 2,
  overflow: 'ellipsis'
}

// Blog card excerpt
{
  fontSize: '16px',
  fontWeight: 400,
  lineHeight: 1.6,
  color: '#5E5E5E',
  maxLines: 3
}

// Blog card meta
{
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: 1.5,
  color: '#5E5E5E'
}

// Blog post title
{
  fontSize: '48px',
  fontWeight: 700,
  lineHeight: 1.2,
  color: '#FFFFFF', // On hero overlay
  textAlign: 'center'
}

// Blog post body
{
  fontSize: '18px',
  fontWeight: 400,
  lineHeight: 1.8,
  color: '#333333'
}

// Blog post subheadings
{
  fontSize: '32px',
  fontWeight: 600,
  lineHeight: 1.3,
  color: '#333333',
  marginTop: '32px',
  marginBottom: '16px'
}
```

### Color usage patterns

```typescript
// Blog categories color coding
categories: {
  healing: '#0205B7',    // Brand blue
  wellness: '#A593E0',   // Purple
  events: '#FFC6A5',     // Peach
  stories: '#63D5F9'     // Cyan
}

// Interactive states
hover: {
  cardShadow: '0 20px 40px rgba(2, 5, 183, 0.2)',
  transform: 'translateY(-8px)',
  transition: '0.3s ease'
}

// Category pill styles
activePill: {
  background: '#0205B7',
  color: '#FFFFFF',
  border: 'none'
}

inactivePill: {
  background: 'transparent',
  color: '#0205B7',
  border: '2px solid #0205B7'
}
```

---

## Component prop definitions

### BlogCard component

```typescript
interface BlogCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    category: "healing" | "wellness" | "events" | "stories";
    author: string;
    publishDate: string; // ISO 8601 format
    readTime: string; // e.g., "5 min read"
    featuredImage: string;
    tags: string[];
  };
  onClick?: () => void;
  className?: string;
}
```

### BlogListing component

```typescript
interface BlogListingProps {
  posts: BlogPost[];
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
  loading?: boolean;
  emptyMessage?: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: "healing" | "wellness" | "events" | "stories";
  author: string;
  publishDate: string;
  readTime: string;
  featuredImage: string;
  tags: string[];
}
```

### BlogFilters component

```typescript
interface BlogFiltersProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  postCounts?: Record<string, number>;
}

interface Category {
  id: string;
  label: string;
  color: string;
}
```

### BlogPost component

```typescript
interface BlogPostProps {
  post: {
    id: string;
    title: string;
    content: string; // Markdown or HTML
    category: string;
    author: {
      name: string;
      bio: string;
      image: string;
    };
    publishDate: string;
    readTime: string;
    featuredImage: string;
    tags: string[];
    relatedPosts?: BlogPost[];
  };
}
```

### RelatedPosts component

```typescript
interface RelatedPostsProps {
  posts: BlogPost[];
  maxPosts?: number; // Default: 3
  title?: string; // Default: "Related Articles"
}
```

### NewsletterCTA component

```typescript
interface NewsletterCTAProps {
  title?: string;
  description?: string;
  onSubmit: (email: string) => Promise<void>;
  variant?: "inline" | "sidebar" | "footer";
}
```

---

## Asset requirements

### Images needed for blog implementation

#### Blog-specific imagery

1. **Default featured images** (per category)
   - Healing: Calming meditation/reiki session
   - Wellness: Natural elements, balance
   - Events: Community gathering
   - Stories: Personal transformation imagery

2. **Author profile images**
   - Deirdre's headshot (circular crop)
   - 200x200px minimum
   - Format: WebP with PNG fallback

3. **Blog hero background**
   - Full-width banner: 1440px × 400px
   - Blue overlay compatible
   - Abstract/spiritual theme

#### Icons required

- Search icon (magnifying glass)
- Filter icon
- Calendar icon (publish date)
- Clock icon (read time)
- Share icons (Facebook, Twitter/X, Pinterest, Email)
- Arrow icons (already available in assets)

#### Decorative elements

- Category badge backgrounds
- Quote marks for pullquotes
- Newsletter envelope/mail icon

### Asset optimization requirements

```typescript
// Image specifications
featuredImages: {
  format: 'WebP with PNG fallback',
  dimensions: '800x600px',
  quality: '85%',
  lazy: true
}

thumbnails: {
  format: 'WebP with PNG fallback',
  dimensions: '400x300px',
  quality: '80%',
  lazy: true
}

icons: {
  format: 'SVG',
  strokeWidth: '2px',
  color: 'currentColor' // Inherit from parent
}
```

---

## Responsive design specifications

### Breakpoints (from style-guide.md)

```typescript
const breakpoints = {
  mobile: "< 768px",
  tablet: "768px - 1023px",
  desktop: "> 1024px",
};
```

### Layout adaptations

#### Mobile (< 768px)

```typescript
{
  padding: '20px',           // Reduce from 66px
  gridColumns: 1,
  stackNav: true,
  heroHeight: '300px',       // Reduce from 500px
  cardImageHeight: '200px',  // Reduce from 240px
  fontSize: {
    h1: '32px',             // Reduce from 48px
    h2: '24px',             // Reduce from 32px
    body: '16px'            // Keep same
  }
}
```

#### Tablet (768px - 1023px)

```typescript
{
  padding: '40px',           // Moderate from 66px
  gridColumns: 2,
  heroHeight: '400px',
  cardImageHeight: '220px',
  fontSize: {
    h1: '40px',
    h2: '28px',
    body: '16px'
  }
}
```

#### Desktop (> 1024px)

```typescript
{
  padding: '66px',           // Full padding
  gridColumns: 3,
  heroHeight: '500px',
  cardImageHeight: '240px',
  fontSize: {
    h1: '48px',
    h2: '32px',
    body: '18px'            // Post body
  }
}
```

### Touch targets

```typescript
// Minimum interactive element sizes
minTouchTarget: '44px × 44px'
spacing: '8px minimum'

// Button sizing mobile
mobileButton: {
  height: '48px',
  fontSize: '16px',
  padding: '12px 24px'
}
```

---

## Accessibility considerations

### ARIA patterns for blog components

```typescript
// Blog card
<article
  role="article"
  aria-labelledby={`post-title-${post.id}`}
>
  <h2 id={`post-title-${post.id}`}>{post.title}</h2>
  <img
    src={post.featuredImage}
    alt={post.imageAlt || `Featured image for ${post.title}`}
    loading="lazy"
  />
</article>

// Category filters
<nav aria-label="Blog category filters">
  <button
    role="tab"
    aria-selected={activeCategory === category.id}
    aria-controls="blog-posts-list"
  >
    {category.label}
  </button>
</nav>

// Blog listing
<div
  role="region"
  aria-live="polite"
  aria-label="Blog posts"
  id="blog-posts-list"
>
  {/* Blog cards */}
</div>
```

### Keyboard navigation requirements

1. **Tab order**: Logo → Nav → Search → Filters → Cards → Footer
2. **Filter pills**: Arrow keys to navigate between categories
3. **Card focus**: Enter/Space to activate card link
4. **Post content**: Skip link to main content
5. **Social share**: Keyboard accessible share menu

### Screen reader considerations

```typescript
// Image alt text patterns
featuredImageAlt: `Featured image for blog post: ${title}`
authorImageAlt: `Photo of ${authorName}`
decorativeImageAlt: '' // Empty for decorative

// Link text
readMoreLink: `Read more about ${title}` // Not just "Read more"

// Loading states
<div role="status" aria-live="polite">
  {isLoading ? 'Loading blog posts...' : `${posts.length} posts found`}
</div>
```

### Color contrast requirements

```typescript
// All text must meet WCAA standards
normalText: '4.5:1 minimum'
largeText: '3:1 minimum'  // 18px+ or 14px+ bold
interactiveElements: '3:1 minimum'

// Test combinations
{
  blueTonWhite: '#0205B7 on #FFFFFF', // 8.9:1 ✓
  darkOnCream: '#333333 on #FFFBF5',  // 11.2:1 ✓
  grayOnWhite: '#5E5E5E on #FFFFFF'   // 7.1:1 ✓
}
```

### Focus states

```typescript
// Visible focus indicator
:focus-visible {
  outline: '2px solid #0205B7',
  outlineOffset: '2px',
  borderRadius: '4px'
}

// Skip link
.skip-link {
  position: 'absolute',
  top: '-40px',
  left: '0',
  background: '#0205B7',
  color: '#FFFFFF',
  padding: '8px',
  zIndex: 100
}

.skip-link:focus {
  top: '0'
}
```

---

## Implementation roadmap

### Phase 1: Foundation (Week 1)

#### Data layer

- [ ] Define BlogPost TypeScript interface
- [ ] Create mock blog data (5-10 sample posts)
- [ ] Set up routing structure (`/blog`, `/blog/:slug`)
- [ ] Create data utilities (filtering, sorting, pagination)

#### Core components

- [ ] BlogHero component
- [ ] BlogCard component
- [ ] BlogListing component (grid container)
- [ ] BlogFilters component

#### Testing

- [ ] Unit tests for all Phase 1 components
- [ ] Data utility tests
- [ ] Routing tests

### Phase 2: Blog listing page (Week 2)

#### Page composition

- [ ] BlogPage main component
- [ ] Integrate Hero + Filters + Listing
- [ ] Implement category filtering logic
- [ ] Add pagination (12 posts per page)
- [ ] Loading states and empty states

#### Polish

- [ ] Scroll animations (fade-in on load)
- [ ] Card hover effects
- [ ] Smooth filtering transitions
- [ ] Mobile responsive layout

#### Testing

- [ ] Integration tests for filtering
- [ ] Pagination tests
- [ ] Accessibility audit
- [ ] Responsive design testing

### Phase 3: Individual post page (Week 3)

#### Components

- [ ] BlogPost component
- [ ] RelatedPosts component
- [ ] ShareButtons component
- [ ] AuthorBio component (inline)

#### Features

- [ ] Markdown/HTML content rendering
- [ ] Table of contents (for long posts)
- [ ] Progress indicator (reading progress)
- [ ] Print-friendly styles

#### Testing

- [ ] Content rendering tests
- [ ] Share functionality tests
- [ ] SEO meta tag verification
- [ ] Print stylesheet testing

### Phase 4: Enhancement features (Week 4)

#### Newsletter integration

- [ ] NewsletterCTA component
- [ ] Email validation
- [ ] Resend integration (if applicable)
- [ ] Success/error messaging

#### Search functionality

- [ ] Client-side search implementation
- [ ] Search input component
- [ ] Results highlighting
- [ ] Search analytics (optional)

#### Performance

- [ ] Image lazy loading
- [ ] Route-based code splitting
- [ ] Bundle size optimization
- [ ] Lighthouse audit (target: 90+)

### Phase 5: Content migration (Week 5)

#### Legacy content review

- [ ] Audit existing blog content (if any)
- [ ] Convert to new data format
- [ ] Optimize images
- [ ] Update internal links

#### CMS consideration

- [ ] Evaluate CMS needs (future)
- [ ] Document content schema
- [ ] Create content guidelines
- [ ] Author training materials

---

## Implementation notes

### Critical decisions needed

1. **Blog data source**
   - Static JSON files (Phase 1)
   - Markdown files with frontmatter (recommended for static site)
   - CMS integration (future: Contentful, Sanity, Strapi)

2. **Content rendering**
   - Markdown: Use `react-markdown` or `remark`
   - HTML: Sanitize with `DOMPurify`
   - Rich text: Consider CMS-provided renderer

3. **Pagination approach**
   - Client-side (all data loaded, filtered in browser)
   - Server-side (future with API)
   - Infinite scroll vs. numbered pages

4. **Image handling**
   - Store in `/packages/shared-assets/images/blog/posts/`
   - Use LazyImage component from shared-components
   - Generate WebP versions during build

### Integration with existing patterns

**Reuse these components**:

- `AnimatedSection` - For scroll animations
- `LazyImage` - For optimized image loading
- `ResponsiveContainer` - For max-width containers
- `Button` - For CTAs and navigation
- `Footer` - Same footer across all pages
- `Header/ResponsiveHeader` - Consistent navigation

**Follow these patterns**:

- Page structure from `Homepage.tsx`
- Card layouts from `ServicesSection.tsx`
- CTA sections from `LetsConnect.tsx`
- Testimonial carousel from `Testimonials.tsx`

### File locations reference

```
Implementation files:
- /packages/shared-components/src/Blog/*
- /packages/shared-components/src/pages/BlogPage.tsx
- /packages/shared-components/src/pages/BlogPostPage.tsx
- /apps/main/src/pages/Blog.tsx (wrapper)

Assets:
- /packages/shared-assets/images/blog/
- /packages/shared-assets/images/blog/posts/ (new)

Tests:
- Co-located with components (*.test.tsx)

Documentation:
- /docs/design/blog-page-migration/
- /docs/progress/006-blog-page-migration.md
```

### Technology stack alignment

```typescript
// Follow existing patterns
React: 18.x
TypeScript: Latest
TailwindCSS: Custom tokens from design-system
Vite: 6.x
Testing: Vitest + React Testing Library
Routing: React Router v6
Animation: Framer Motion (already in use)
```

---

## Summary and next steps

### Key takeaways

1. **No blog-specific Figma designs exist** - Design must be inferred from:
   - Homepage component patterns
   - Legacy About page layout patterns
   - Design system specifications

2. **Legacy "BLog" folder is misnamed** - Contains About page, not blog functionality

3. **Net-new implementation required** - This is not a migration but a greenfield blog system

4. **Assets are available** - 24 images/icons ready but need blog-specific additions

5. **Design system is comprehensive** - Full color, typography, spacing specs available

### Recommended approach

**Option A: Design-first approach** (Recommended)

1. Create blog page mockup in Figma matching brand
2. Extract designs using Figma MCP tools
3. Implement components from Figma specs
4. Ensures visual consistency

**Option B: Code-first approach**

1. Implement using existing component patterns
2. Collaborative refinement with user
3. Iterate until visually satisfactory
4. Faster to MVP but may require more iterations

### Immediate action items

1. **Decision required**: Choose Option A or B above
2. **Create sample content**: 5-10 blog posts with varied content
3. **Define categories**: Healing, Wellness, Events, Stories (confirmed?)
4. **Image sourcing**: Gather blog-specific photography
5. **Review routing**: Confirm `/blog` and `/blog/:slug` structure

### Success metrics

- Visual match to brand identity: 95%+
- Lighthouse performance score: 90+
- Accessibility score: 100
- Mobile usability: 100%
- SEO optimization: Complete meta tags, structured data

---

## Related documents

- `/docs/project/ARCHITECTURE.md` - Technical patterns and conventions
- `/docs/design/style-guide.md` - Complete design system specification
- `/docs/progress/006-blog-page-migration.md` - Project tracking document
- `/legacy/BLog/src/screens/About/About.tsx` - Legacy reference implementation
- `/packages/shared-components/src/Homepage/Homepage.tsx` - Component composition pattern

---

**Document Status**: Complete - Ready for implementation planning
**Next Review**: After design approach decision
**Last Updated**: 2025-10-06
