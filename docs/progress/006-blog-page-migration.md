# Task: Blog Page Migration

**Status**: 📋 PENDING  
**Priority**: Medium  
**Created**: 2025-09-09  
**Target Start**: After About page completion  

## Objective
Migrate the Blog page from legacy structure to the monorepo, implementing a modern blog layout with listing, categories, and individual post views, followed by collaborative refinement to match Figma designs.

## Context for Fresh Instance

### Project Overview
- **Business**: The Reiki Goddess Healing - Energy healing and wellness services
- **Blog Purpose**: Share healing insights, wellness tips, and spiritual guidance
- **Design Source**: Figma screenshots at `/figma-screenshots/blog/`

### Current State
- **Legacy Blog**: `/legacy/BLog/` (note the capital L)
- **Existing Patterns**: Follow Home, Contact, About page patterns
- **Content Types**: Articles, healing tips, event announcements, client stories

### Key Features to Implement
- Blog post listing with cards
- Category filtering
- Individual post view
- Related posts
- Newsletter signup
- Search functionality (future)

## Phase 1: Initial Extraction

### 1. Analysis
- [ ] Review Figma blog designs
- [ ] Examine legacy blog structure
- [ ] Plan data structure for posts
- [ ] Identify required components

### 2. Component Architecture
```
BlogPage/
├── BlogHero/           # Page title and intro
├── BlogFilters/        # Category filter buttons
├── BlogListing/        # Grid of blog cards
├── BlogCard/           # Individual post preview
├── BlogPost/           # Full post view
├── RelatedPosts/       # Suggested reading
├── NewsletterCTA/      # Email signup
└── BlogPagination/     # Page navigation
```

### 3. Data Structure
```typescript
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: 'healing' | 'wellness' | 'events' | 'stories';
  author: string;
  publishDate: string;
  readTime: string;
  featuredImage: string;
  tags: string[];
}
```

### 4. Initial Implementation

#### Blog Listing Page
1. **Create BlogPage component**
   - Hero section
   - Filter bar
   - Post grid layout

2. **Implement BlogCard**
   - Image preview
   - Title and excerpt
   - Meta info (date, category)
   - Read more link

3. **Add filtering logic**
   - Category buttons
   - Active state styling
   - URL parameter updates

#### Individual Post View
1. **Create BlogPost component**
   - Full content display
   - Author bio
   - Share buttons
   - Comments (future)

2. **Add navigation**
   - Back to blog listing
   - Previous/Next post
   - Breadcrumbs

## Phase 2: Collaborative Refinement

### Setup for Review Session
- [ ] Both listing and post views ready
- [ ] Sample content loaded
- [ ] Figma screenshots accessible
- [ ] Multiple viewport sizes available

### Visual Refinement Checklist

#### Blog Listing Page

**Hero Section**
- [ ] Title typography and color
- [ ] Subtitle/description placement
- [ ] Background treatment
- [ ] Section height and padding

**Filter Bar**
- [ ] Button styles (active/inactive)
- [ ] Spacing between filters
- [ ] Mobile dropdown behavior
- [ ] Sticky positioning?

**Blog Cards**
- [ ] Card dimensions
- [ ] Image aspect ratio
- [ ] Shadow/border styling
- [ ] Hover effects
- [ ] Typography hierarchy
- [ ] Meta info styling

**Grid Layout**
- [ ] Columns per breakpoint
- [ ] Gap between cards
- [ ] Overall section padding

#### Individual Post Page

**Post Header**
- [ ] Title size and weight
- [ ] Meta information layout
- [ ] Featured image display
- [ ] Author info placement

**Content Area**
- [ ] Typography settings
- [ ] Paragraph spacing
- [ ] Quote styling
- [ ] Image placement
- [ ] List formatting

**Sidebar/Related**
- [ ] Related posts styling
- [ ] Newsletter signup design
- [ ] Social share buttons

### Iteration Process
1. **Side-by-side comparison** with Figma
2. **Identify differences** in spacing, colors, typography
3. **Live adjustments** in browser
4. **Test interactions** (filtering, pagination)
5. **Verify responsive** behavior

## Technical Implementation

### File Structure
```
packages/shared-components/src/
├── pages/
│   ├── BlogPage.tsx
│   └── BlogPostPage.tsx
└── Blog/
    ├── BlogHero/
    ├── BlogFilters/
    ├── BlogListing/
    ├── BlogCard/
    ├── BlogPost/
    ├── RelatedPosts/
    └── NewsletterCTA/
```

### Routing Structure
```
/blog              # Listing page
/blog/category/:cat # Filtered listing
/blog/:slug        # Individual post
```

### State Management
- URL parameters for filters
- Local state for pagination
- Consider future CMS integration

### Performance Considerations
- Lazy load images
- Paginate results (12 per page?)
- Optimize bundle splitting
- Cache post data

## Testing Requirements
- [ ] Component unit tests
- [ ] Filter functionality tests
- [ ] Routing tests
- [ ] SEO meta tags
- [ ] Accessibility testing
- [ ] Performance metrics

## Success Criteria
- [ ] Clean, modern blog design
- [ ] Intuitive navigation
- [ ] Fast page loads
- [ ] Mobile-optimized
- [ ] SEO-friendly URLs
- [ ] Social sharing ready
- [ ] Newsletter integration
- [ ] Visual match to Figma

## Future Enhancements
- Search functionality
- Comments system
- RSS feed
- Admin interface
- CMS integration
- Email notifications

## Notes for Collaboration
- Prepare 3-5 sample posts
- Test different content lengths
- Review both light and image-heavy posts
- Consider future content strategy
- Document content guidelines