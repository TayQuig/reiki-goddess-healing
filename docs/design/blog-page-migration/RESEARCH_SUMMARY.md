# Blog page migration - Research summary

**Research Date**: 2025-10-06
**Researcher**: Claude Code (Design Extraction Agent)
**Status**: Complete

## Executive findings

### Critical discovery

**The legacy "BLog" folder does NOT contain blog functionality.**

It contains an About page implementation mistakenly placed in a folder called "BLog" (capital L). This means the blog page migration is actually a **greenfield implementation**, not a code migration.

### Evidence

1. **File content**: `/legacy/BLog/src/screens/About/About.tsx` contains:
   - "Experienced Reiki Master & Sound Healer in Roy" heading
   - About/bio sections
   - Journey section
   - Image gallery
   - Testimonials
   - NO blog listing, posts, or blog-specific functionality

2. **No Figma designs**: No blog-specific screenshots exist in `/figma-screenshots/`

3. **Placeholder implementations**: Both current blog implementations are placeholders:
   - `/apps/main/src/pages/Blog.tsx`: "Blog content coming soon..."
   - `/packages/shared-components/src/pages/BlogPage.tsx`: Migration notice

## Design asset inventory

### Available (24 files)

Located: `/packages/shared-assets/images/blog/`

**Images (15 PNG files)**:

- Background images: `2148847564-1.png`, `frame-33.png`, `powerrangers-6.png`
- Content images: `fb8b1754...2.png`, `fb8b1754...3.png`
- Gallery images: `rectangle-5.png` through `rectangle-13.png` (8 images)
- Profile: `ellipse-5.png`
- Branding: `the-reiki-goddess-4-25...png` (2 versions)

**Icons (9 SVG files)**:

- Arrows: `vector-1.svg`, `vector-1-1.svg`, `vector-1-2.svg`, `vector-2.svg`, `vector-3.svg`, `vector-5.svg`
- Decorative: `star-6.svg`, `line-56.svg`
- Social: `frame-2085660578.svg`

### Missing

- Blog-specific hero images
- Category badges/icons
- Search icon
- Share icons (social media)
- Default featured images per category
- Author profile images

## Design system specifications

### Confirmed patterns from existing codebase

**Layout**:

- Max width: 1440px
- Universal padding: 66px
- Section spacing: 80px
- Background: #FFFBF5 (cream)

**Typography** (Figtree font):

- H1: 48px, bold (700)
- H2: 32px, semibold (600)
- Body: 16px, regular (400)
- Line height: 1.6

**Colors**:

- Brand blue: #0205B7
- Accent purple: #A593E0
- Accent cyan: #63D5F9
- Accent peach: #FFC6A5
- Text dark: #333333
- Text gray: #5E5E5E

**Components**:

- Border radius: 20px (cards), 100px (buttons)
- Card shadows: `0px 42px 32.5px -13px rgba(2, 5, 183, 0.25)`
- Hover effects: translateY(-8px), enhanced shadow
- Transitions: 0.3s standard

## Recommended component architecture

```
Blog/
├── BlogHero/              # Page header with title
├── BlogFilters/           # Category filter pills
├── BlogListing/           # Card grid container
├── BlogCard/              # Individual post preview
├── BlogPost/              # Full post view
├── RelatedPosts/          # Suggested reading
└── NewsletterCTA/         # Email signup
```

### Page structure

**Blog Listing Page** (`/blog`):

1. Header (existing component)
2. Blog Hero (title: "Healing Insights")
3. Filter Bar (sticky, categories: All, Healing, Wellness, Events, Stories)
4. Blog Grid (3 columns desktop, 2 tablet, 1 mobile)
5. Pagination
6. Newsletter CTA
7. Footer (existing component)

**Individual Post Page** (`/blog/:slug`):

1. Header
2. Post Hero Image (full-width, 400px, with title overlay)
3. Post Meta (author, date, category, read time)
4. Content + Sidebar layout
5. Related Posts (3 cards)
6. CTA Section
7. Footer

## TypeScript interfaces

```typescript
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: "healing" | "wellness" | "events" | "stories";
  author: string;
  publishDate: string; // ISO 8601
  readTime: string; // "5 min read"
  featuredImage: string;
  tags: string[];
}

interface BlogCardProps {
  post: BlogPost;
  onClick?: () => void;
  className?: string;
}

interface BlogListingProps {
  posts: BlogPost[];
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
  loading?: boolean;
}
```

## Responsive specifications

**Mobile (< 768px)**:

- Padding: 20px
- Grid: 1 column
- Hero height: 300px
- H1 size: 32px

**Tablet (768-1023px)**:

- Padding: 40px
- Grid: 2 columns
- Hero height: 400px
- H1 size: 40px

**Desktop (> 1024px)**:

- Padding: 66px
- Grid: 3 columns
- Hero height: 500px
- H1 size: 48px

## Integration points

### Reuse existing components

- `AnimatedSection` - Scroll animations
- `LazyImage` - Optimized image loading
- `ResponsiveContainer` - Max-width wrapper
- `Button` - CTAs
- `Header/Footer` - Site chrome

### Follow existing patterns

- `Homepage.tsx` - Section composition
- `ServicesSection.tsx` - Card grid layouts
- `CommunityEvents.tsx` - Event card styling
- `Testimonials.tsx` - Carousel patterns
- `LetsConnect.tsx` - CTA section design

## Implementation phases

### Phase 1: Foundation (Week 1)

- Define data structures
- Create mock blog data (5-10 posts)
- Build core components: BlogHero, BlogCard, BlogListing, BlogFilters
- Set up routing

### Phase 2: Listing page (Week 2)

- Compose BlogPage
- Implement filtering logic
- Add pagination
- Polish animations and interactions

### Phase 3: Post page (Week 3)

- Build BlogPost component
- Content rendering (Markdown/HTML)
- Related posts
- Social sharing

### Phase 4: Enhancements (Week 4)

- Newsletter integration
- Search functionality
- Performance optimization
- Accessibility audit

### Phase 5: Content (Week 5)

- Content migration (if any exists)
- CMS evaluation
- Content guidelines
- Launch preparation

## Critical decisions required

1. **Design approach**:
   - Option A: Create Figma mockups first, then implement
   - Option B: Code-first with iterative refinement

2. **Content source**:
   - Static JSON files (quick start)
   - Markdown files (recommended for static blog)
   - CMS integration (future scalability)

3. **Content rendering**:
   - Markdown with `react-markdown`
   - HTML with `DOMPurify` sanitization
   - Rich text from CMS

4. **Blog categories** (confirm):
   - Healing
   - Wellness
   - Events
   - Stories

## Assets needed

### High priority

1. Default featured images (4 category-specific)
2. Blog hero background image
3. Search icon SVG
4. Share button icons (Facebook, Twitter/X, Pinterest, Email)
5. Deirdre's author headshot (200x200px)

### Medium priority

6. Category badge icons
7. Newsletter envelope icon
8. Quote marks for pullquotes
9. Sample blog post images (5-10)

### Low priority

10. Print stylesheet decorative elements
11. 404/empty state illustrations

## Accessibility requirements

- ARIA labels for filters, cards, regions
- Keyboard navigation (Tab order, arrow keys)
- Screen reader announcements (loading, counts)
- Focus indicators (2px solid #0205B7)
- Color contrast: 4.5:1 minimum
- Skip links to main content
- Alt text for all images

## Performance targets

- Lighthouse Performance: 90+
- Accessibility: 100
- Best Practices: 95+
- SEO: 95+
- Bundle size: < 200KB (initial load)
- Image lazy loading: All below-fold images
- Code splitting: By route

## Testing strategy

**Unit tests**:

- All components (BlogCard, BlogFilters, etc.)
- Data utilities (filtering, sorting, pagination)
- Mock data generation

**Integration tests**:

- Filtering workflow
- Pagination navigation
- Routing between pages

**E2E tests**:

- Full user journey (listing → post → back)
- Mobile responsive behavior
- Search functionality

**Accessibility tests**:

- Keyboard navigation
- Screen reader compatibility
- Color contrast validation

## Documentation deliverables

Created:

1. ✅ `/docs/design/blog-page-migration/design-implementation.md` - Complete design specification
2. ✅ `/docs/design/blog-page-migration/RESEARCH_SUMMARY.md` - This document

Existing: 3. `/docs/progress/006-blog-page-migration.md` - Project tracking (to be updated)

To create during implementation: 4. Component documentation (Storybook stories) 5. Content creation guidelines 6. Blog post schema documentation

## Files and locations

### Source files

- **Legacy reference**: `/legacy/BLog/src/screens/About/About.tsx` (502 lines)
- **Current placeholder**: `/apps/main/src/pages/Blog.tsx` (18 lines)
- **Shared placeholder**: `/packages/shared-components/src/pages/BlogPage.tsx` (67 lines)

### Asset directories

- **Existing assets**: `/packages/shared-assets/images/blog/` (24 files)
- **New assets** (recommended): `/packages/shared-assets/images/blog/posts/`

### Implementation locations

- **Components**: `/packages/shared-components/src/Blog/*`
- **Pages**: `/packages/shared-components/src/pages/Blog*.tsx`
- **Types**: `/packages/shared-utils/src/types/blog.ts` (recommended)

### Documentation

- **Design specs**: `/docs/design/blog-page-migration/`
- **Progress tracking**: `/docs/progress/006-blog-page-migration.md`
- **Architecture**: `/docs/project/ARCHITECTURE.md`
- **Style guide**: `/docs/design/style-guide.md`

## Figma MCP integration findings

**Status**: Figma MCP tools are available but no blog-specific designs exist in current file.

**Tested tools**:

- ✅ `get_metadata` - Successfully returned node metadata
- ✅ `get_code` - Successfully generated React component code
- ✅ `get_screenshot` - Successfully captured visual

**Current Figma file contains**: About page content (text node extracted)

**Recommendation**: If blog designs are created in Figma, use MCP tools to:

1. Extract component structure with `get_metadata`
2. Generate initial React code with `get_code`
3. Capture visual reference with `get_screenshot`
4. Extract design tokens with `get_variable_defs`

## Risk assessment

### Low risk

- ✅ Design system is well-documented
- ✅ Component patterns are established
- ✅ Assets are partially available
- ✅ Tech stack is stable

### Medium risk

- ⚠️ No blog-specific designs (requires design work)
- ⚠️ Content strategy undefined
- ⚠️ CMS decision deferred

### High risk

- ❌ None identified

## Success criteria

- [ ] Blog listing page visually matches brand
- [ ] Individual post pages render correctly
- [ ] Filtering works smoothly
- [ ] Mobile experience is excellent
- [ ] Accessibility score: 100
- [ ] Performance score: 90+
- [ ] SEO optimized (meta tags, structured data)
- [ ] Content migration complete (if applicable)

## Next steps

1. **Immediate** (this week):
   - [ ] Review this research with team
   - [ ] Decide: Design-first vs. Code-first approach
   - [ ] Define blog categories (confirm: Healing, Wellness, Events, Stories)
   - [ ] Create 5-10 sample blog posts (content)

2. **Short-term** (next week):
   - [ ] Source/create blog-specific imagery
   - [ ] Begin Phase 1 implementation (foundation)
   - [ ] Set up routing structure
   - [ ] Create data models and mock data

3. **Medium-term** (2-3 weeks):
   - [ ] Complete blog listing page
   - [ ] Build individual post page
   - [ ] Implement filtering and pagination
   - [ ] Add animations and polish

4. **Long-term** (1 month+):
   - [ ] Newsletter integration
   - [ ] Search functionality
   - [ ] Content migration
   - [ ] CMS evaluation and integration

## Questions for stakeholder

1. **Design preference**: Should we create Figma mockups first, or iterate in code?
2. **Blog categories**: Confirm categories (Healing, Wellness, Events, Stories)?
3. **Existing content**: Is there blog content to migrate from elsewhere?
4. **Newsletter**: Integrate with Resend, or different service?
5. **Search**: Client-side search sufficient, or need backend?
6. **Comments**: Include comments system in initial launch?
7. **Content frequency**: How often will new posts be published?
8. **CMS needs**: Static files OK initially, or need CMS now?

## Research methodology

**Tools used**:

1. File system exploration (Glob, Read, Bash)
2. Figma MCP tools (get_metadata, get_code, get_screenshot)
3. Legacy code analysis
4. Design system documentation review
5. Asset inventory and analysis

**Sources examined**:

- `/legacy/BLog/` directory (complete)
- `/packages/shared-assets/images/blog/` (24 files)
- `/docs/design/style-guide.md` (complete design system)
- `/docs/project/ARCHITECTURE.md` (technical patterns)
- `/packages/shared-components/src/` (component patterns)
- Figma file (via MCP, limited blog content)

**Analysis approach**:

- Systematic file-by-file review
- Pattern extraction from existing pages
- Design token documentation
- Component architecture recommendations
- Risk and feasibility assessment

---

**Research complete**: 2025-10-06
**Confidence level**: High (comprehensive analysis with clear findings)
**Recommendation**: Proceed with implementation using established component patterns
