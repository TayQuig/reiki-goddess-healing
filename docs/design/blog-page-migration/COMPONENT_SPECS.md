# Blog page components - Technical specifications

## Component hierarchy

```
BlogPage (Listing)
├── Header (existing)
├── BlogHero
├── BlogFilters
├── BlogListing
│   └── BlogCard (× N)
├── BlogPagination
├── NewsletterCTA
└── Footer (existing)

BlogPostPage (Individual)
├── Header (existing)
├── PostHero
├── PostMeta
├── PostLayout
│   ├── PostContent
│   └── PostSidebar
│       ├── AuthorBio
│       ├── NewsletterCTA
│       └── ShareButtons
├── RelatedPosts
│   └── BlogCard (× 3)
├── BookSessionCTA (existing)
└── Footer (existing)
```

## Component specifications

### BlogHero

**Purpose**: Page header with title and description

**Props**:

```typescript
interface BlogHeroProps {
  title?: string;
  description?: string;
  backgroundImage?: string;
  className?: string;
}
```

**Default content**:

```typescript
{
  title: "Healing Insights",
  description: "Explore articles, insights, and guidance on your healing journey from The Reiki Goddess community."
}
```

**Layout**:

```css
.blog-hero {
  height: 500px; /* Desktop */
  padding: 66px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: linear-gradient(135deg, #a593e0 0%, #ffc6a5 100%);
}

.blog-hero h1 {
  font-size: 48px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 16px;
}

.blog-hero p {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.95);
  max-width: 600px;
}

@media (max-width: 768px) {
  .blog-hero {
    height: 300px;
    padding: 20px;
  }

  .blog-hero h1 {
    font-size: 32px;
  }
}
```

**File location**: `/packages/shared-components/src/Blog/BlogHero/BlogHero.tsx`

---

### BlogFilters

**Purpose**: Category filter pills with active state

**Props**:

```typescript
interface BlogFiltersProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
  postCounts?: Record<string, number>;
  className?: string;
}

interface Category {
  id: string;
  label: string;
  color: string;
}
```

**Default categories**:

```typescript
const defaultCategories: Category[] = [
  { id: "all", label: "All Posts", color: "#0205B7" },
  { id: "healing", label: "Healing", color: "#0205B7" },
  { id: "wellness", label: "Wellness", color: "#A593E0" },
  { id: "events", label: "Events", color: "#FFC6A5" },
  { id: "stories", label: "Stories", color: "#63D5F9" },
];
```

**Layout**:

```css
.blog-filters {
  display: flex;
  gap: 12px;
  padding: 24px 66px;
  background: #fffbf5;
  border-bottom: 1px solid rgba(2, 5, 183, 0.1);
  position: sticky;
  top: 93px; /* Below header */
  z-index: 40;
}

.filter-pill {
  padding: 10px 24px;
  border-radius: 100px;
  font-size: 16px;
  font-weight: 500;
  border: 2px solid #0205b7;
  background: transparent;
  color: #0205b7;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-pill.active {
  background: #0205b7;
  color: #ffffff;
  border-color: #0205b7;
}

.filter-pill:hover:not(.active) {
  background: rgba(2, 5, 183, 0.1);
}

@media (max-width: 768px) {
  .blog-filters {
    padding: 16px 20px;
    overflow-x: auto;
    flex-wrap: nowrap;
  }

  .filter-pill {
    white-space: nowrap;
    flex-shrink: 0;
  }
}
```

**Accessibility**:

```tsx
<nav aria-label="Blog category filters">
  <div role="tablist">
    {categories.map((category) => (
      <button
        key={category.id}
        role="tab"
        aria-selected={activeCategory === category.id}
        aria-controls="blog-posts-list"
        onClick={() => onCategoryChange(category.id)}
      >
        {category.label}
        {postCounts && ` (${postCounts[category.id] || 0})`}
      </button>
    ))}
  </div>
</nav>
```

**File location**: `/packages/shared-components/src/Blog/BlogFilters/BlogFilters.tsx`

---

### BlogCard

**Purpose**: Preview card for blog post in grid

**Props**:

```typescript
interface BlogCardProps {
  post: BlogPost;
  onClick?: () => void;
  className?: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: "healing" | "wellness" | "events" | "stories";
  author: string;
  publishDate: string;
  readTime: string;
  featuredImage: string;
  tags: string[];
}
```

**Layout**:

```css
.blog-card {
  background: #ffffff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0px 42px 32.5px -13px rgba(2, 5, 183, 0.25);
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.blog-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(2, 5, 183, 0.2);
}

.blog-card-image {
  width: 100%;
  height: 240px;
  object-fit: cover;
}

.blog-card-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.blog-card-category {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  width: fit-content;
}

.blog-card-category.healing {
  background: rgba(2, 5, 183, 0.1);
  color: #0205b7;
}

.blog-card-category.wellness {
  background: rgba(165, 147, 224, 0.1);
  color: #a593e0;
}

.blog-card-category.events {
  background: rgba(255, 198, 165, 0.1);
  color: #ffc6a5;
}

.blog-card-category.stories {
  background: rgba(99, 213, 249, 0.1);
  color: #63d5f9;
}

.blog-card-title {
  font-size: 22px;
  font-weight: 600;
  line-height: 1.4;
  color: #333333;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.blog-card-excerpt {
  font-size: 16px;
  line-height: 1.6;
  color: #5e5e5e;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.blog-card-meta {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #5e5e5e;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .blog-card-image {
    height: 200px;
  }

  .blog-card-content {
    padding: 16px;
  }
}
```

**Component structure**:

```tsx
<article
  className="blog-card"
  onClick={onClick}
  role="article"
  aria-labelledby={`post-title-${post.id}`}
>
  <LazyImage
    src={post.featuredImage}
    alt={`Featured image for ${post.title}`}
    className="blog-card-image"
  />

  <div className="blog-card-content">
    <span className={`blog-card-category ${post.category}`}>
      {post.category}
    </span>

    <h2 id={`post-title-${post.id}`} className="blog-card-title">
      {post.title}
    </h2>

    <p className="blog-card-excerpt">{post.excerpt}</p>

    <div className="blog-card-meta">
      <span>{formatDate(post.publishDate)}</span>
      <span>•</span>
      <span>{post.readTime}</span>
    </div>
  </div>
</article>
```

**File location**: `/packages/shared-components/src/Blog/BlogCard/BlogCard.tsx`

---

### BlogListing

**Purpose**: Grid container for blog cards

**Props**:

```typescript
interface BlogListingProps {
  posts: BlogPost[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}
```

**Layout**:

```css
.blog-listing {
  padding: 80px 66px;
  max-width: 1440px;
  margin: 0 auto;
}

.blog-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

@media (max-width: 1023px) {
  .blog-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 767px) {
  .blog-listing {
    padding: 40px 20px;
  }

  .blog-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}
```

**States**:

```tsx
// Loading state
<div className="blog-listing-loading" role="status" aria-live="polite">
  <div className="skeleton-grid">
    {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
  </div>
  <span className="sr-only">Loading blog posts...</span>
</div>

// Empty state
<div className="blog-listing-empty">
  <p>{emptyMessage || 'No posts found in this category.'}</p>
</div>

// With posts
<div
  role="region"
  aria-live="polite"
  aria-label="Blog posts"
  id="blog-posts-list"
>
  <div className="blog-grid">
    {posts.map(post => (
      <BlogCard key={post.id} post={post} onClick={() => navigate(`/blog/${post.slug}`)} />
    ))}
  </div>
</div>
```

**File location**: `/packages/shared-components/src/Blog/BlogListing/BlogListing.tsx`

---

### BlogPost

**Purpose**: Full blog post with content rendering

**Props**:

```typescript
interface BlogPostProps {
  post: {
    id: string;
    title: string;
    content: string;
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

**Layout**:

```css
.blog-post-hero {
  position: relative;
  width: 100%;
  height: 400px;
  background-size: cover;
  background-position: center;
}

.blog-post-hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.7) 100%);
  display: flex;
  align-items: flex-end;
  padding: 66px;
}

.blog-post-title {
  font-size: 48px;
  font-weight: 700;
  color: #ffffff;
  max-width: 800px;
}

.blog-post-meta {
  display: flex;
  gap: 24px;
  padding: 24px 66px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  font-size: 16px;
  color: #5e5e5e;
}

.blog-post-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 60px;
  padding: 60px 66px;
  max-width: 1440px;
  margin: 0 auto;
}

.blog-post-content {
  max-width: 720px;
}

.blog-post-content h2 {
  font-size: 32px;
  font-weight: 600;
  margin-top: 48px;
  margin-bottom: 16px;
}

.blog-post-content h3 {
  font-size: 24px;
  font-weight: 600;
  margin-top: 32px;
  margin-bottom: 12px;
}

.blog-post-content p {
  font-size: 18px;
  line-height: 1.8;
  color: #333333;
  margin-bottom: 24px;
}

.blog-post-content blockquote {
  border-left: 4px solid #0205b7;
  padding-left: 24px;
  margin: 32px 0;
  font-style: italic;
  color: #5e5e5e;
}

.blog-post-content img {
  width: 100%;
  border-radius: 20px;
  margin: 32px 0;
}

.blog-post-sidebar {
  position: sticky;
  top: 117px; /* Header + some space */
  height: fit-content;
}

@media (max-width: 1023px) {
  .blog-post-layout {
    grid-template-columns: 1fr;
    padding: 40px 20px;
  }

  .blog-post-sidebar {
    position: static;
  }
}
```

**File location**: `/packages/shared-components/src/Blog/BlogPost/BlogPost.tsx`

---

### RelatedPosts

**Purpose**: Show 3 related blog posts

**Props**:

```typescript
interface RelatedPostsProps {
  posts: BlogPost[];
  maxPosts?: number;
  title?: string;
  className?: string;
}
```

**Layout**:

```css
.related-posts {
  padding: 80px 66px;
  background: #f7f7f7;
}

.related-posts-header {
  font-size: 32px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 48px;
}

.related-posts-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  max-width: 1440px;
  margin: 0 auto;
}

@media (max-width: 1023px) {
  .related-posts-grid {
    grid-template-columns: 1fr;
  }
}
```

**File location**: `/packages/shared-components/src/Blog/RelatedPosts/RelatedPosts.tsx`

---

### NewsletterCTA

**Purpose**: Email signup form

**Props**:

```typescript
interface NewsletterCTAProps {
  title?: string;
  description?: string;
  onSubmit: (email: string) => Promise<void>;
  variant?: "inline" | "sidebar" | "footer";
  className?: string;
}
```

**Variants**:

**Inline** (full-width section):

```css
.newsletter-cta.inline {
  padding: 60px;
  background: linear-gradient(90deg, #0205b7 0%, #63d5f9 100%);
  border-radius: 30px;
  text-align: center;
  color: #ffffff;
}

.newsletter-cta.inline h3 {
  font-size: 32px;
  margin-bottom: 16px;
}

.newsletter-form {
  display: flex;
  gap: 12px;
  max-width: 500px;
  margin: 24px auto 0;
}

.newsletter-input {
  flex: 1;
  padding: 12px 20px;
  border-radius: 100px;
  border: none;
  font-size: 16px;
}

.newsletter-button {
  padding: 12px 32px;
  background: #ffffff;
  color: #0205b7;
  border-radius: 100px;
  border: none;
  font-weight: 600;
  cursor: pointer;
}
```

**Sidebar** (compact):

```css
.newsletter-cta.sidebar {
  padding: 24px;
  background: #f7f7f7;
  border-radius: 20px;
}

.newsletter-cta.sidebar h4 {
  font-size: 18px;
  margin-bottom: 12px;
}

.newsletter-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
```

**File location**: `/packages/shared-components/src/Blog/NewsletterCTA/NewsletterCTA.tsx`

---

## Data utilities

### Filtering

```typescript
// /packages/shared-utils/src/blogUtils.ts

export function filterPostsByCategory(
  posts: BlogPost[],
  category: string
): BlogPost[] {
  if (category === "all") return posts;
  return posts.filter((post) => post.category === category);
}

export function sortPostsByDate(
  posts: BlogPost[],
  order: "asc" | "desc" = "desc"
): BlogPost[] {
  return [...posts].sort((a, b) => {
    const dateA = new Date(a.publishDate).getTime();
    const dateB = new Date(b.publishDate).getTime();
    return order === "desc" ? dateB - dateA : dateA - dateB;
  });
}

export function paginatePosts(
  posts: BlogPost[],
  page: number,
  perPage: number = 12
): BlogPost[] {
  const start = (page - 1) * perPage;
  const end = start + perPage;
  return posts.slice(start, end);
}

export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}
```

---

## Mock data

```typescript
// /packages/shared-components/src/Blog/mockBlogData.ts

export const mockBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Understanding Energy Healing: A Beginner's Guide",
    slug: "understanding-energy-healing",
    excerpt:
      "Discover the fundamentals of energy healing and how it can support your physical, emotional, and spiritual well-being. Learn about the different modalities and what to expect from your first session.",
    content: "# Understanding Energy Healing\n\nEnergy healing is...",
    category: "healing",
    author: "Deirdre Quigley",
    publishDate: "2025-09-15T10:00:00Z",
    readTime: "5 min read",
    featuredImage: "/assets/blog/energy-healing-guide.jpg",
    tags: ["reiki", "beginners", "energy-work"],
  },
  {
    id: "2",
    title: "The Power of Sound Healing in Modern Wellness",
    slug: "power-of-sound-healing",
    excerpt:
      "Explore how sound therapy and vibrational healing can create profound shifts in your energy and consciousness. Learn about different instruments and techniques used in sound healing.",
    content: "# The Power of Sound Healing\n\nSound healing uses...",
    category: "wellness",
    author: "Deirdre Quigley",
    publishDate: "2025-09-10T14:00:00Z",
    readTime: "7 min read",
    featuredImage: "/assets/blog/sound-healing.jpg",
    tags: ["sound-therapy", "wellness", "vibration"],
  },
  // Add 8-10 more sample posts
];
```

---

## Testing specifications

### BlogCard tests

```typescript
// BlogCard.test.tsx

describe('BlogCard', () => {
  it('renders post title and excerpt', () => {
    render(<BlogCard post={mockPost} />);
    expect(screen.getByText(mockPost.title)).toBeInTheDocument();
    expect(screen.getByText(mockPost.excerpt)).toBeInTheDocument();
  });

  it('displays correct category badge', () => {
    render(<BlogCard post={mockPost} />);
    const badge = screen.getByText(mockPost.category);
    expect(badge).toHaveClass(`blog-card-category ${mockPost.category}`);
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<BlogCard post={mockPost} onClick={handleClick} />);
    fireEvent.click(screen.getByRole('article'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies hover animation', () => {
    render(<BlogCard post={mockPost} />);
    const card = screen.getByRole('article');
    expect(card).toHaveClass('blog-card');
    // Test hover class or animation
  });
});
```

### BlogFilters tests

```typescript
// BlogFilters.test.tsx

describe('BlogFilters', () => {
  it('renders all categories', () => {
    render(<BlogFilters categories={mockCategories} activeCategory="all" onCategoryChange={vi.fn()} />);
    mockCategories.forEach(cat => {
      expect(screen.getByText(cat.label)).toBeInTheDocument();
    });
  });

  it('highlights active category', () => {
    render(<BlogFilters categories={mockCategories} activeCategory="healing" onCategoryChange={vi.fn()} />);
    const healingButton = screen.getByText('Healing');
    expect(healingButton).toHaveAttribute('aria-selected', 'true');
  });

  it('calls onCategoryChange when filter clicked', () => {
    const handleChange = vi.fn();
    render(<BlogFilters categories={mockCategories} activeCategory="all" onCategoryChange={handleChange} />);
    fireEvent.click(screen.getByText('Wellness'));
    expect(handleChange).toHaveBeenCalledWith('wellness');
  });

  it('displays post counts when provided', () => {
    const counts = { all: 10, healing: 5, wellness: 3 };
    render(<BlogFilters categories={mockCategories} activeCategory="all" onCategoryChange={vi.fn()} postCounts={counts} />);
    expect(screen.getByText(/All Posts \(10\)/)).toBeInTheDocument();
  });
});
```

---

## Animation specifications

### Scroll animations

```typescript
// Use existing AnimatedSection component

<AnimatedSection animation="fade-up" delay={0.2}>
  <BlogCard post={post} />
</AnimatedSection>
```

### Card hover animation

```css
@keyframes lift {
  from {
    transform: translateY(0);
    box-shadow: 0px 42px 32.5px -13px rgba(2, 5, 183, 0.25);
  }
  to {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(2, 5, 183, 0.2);
  }
}

.blog-card {
  animation-duration: 0.3s;
  animation-timing-function: ease-out;
}

.blog-card:hover {
  animation-name: lift;
  animation-fill-mode: forwards;
}
```

### Filter transition

```css
.blog-grid {
  transition: opacity 0.3s ease;
}

.blog-grid.filtering {
  opacity: 0.5;
}
```

---

## SEO specifications

### Meta tags for blog listing

```tsx
<Helmet>
  <title>Healing Insights Blog | The Reiki Goddess Healing</title>
  <meta
    name="description"
    content="Explore articles, insights, and guidance on your healing journey. Learn about Reiki, sound healing, wellness practices, and spiritual growth."
  />
  <meta property="og:title" content="Healing Insights Blog" />
  <meta
    property="og:description"
    content="Articles and insights on energy healing, wellness, and spiritual growth"
  />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://thereikigoddesshealing.com/blog" />
  <link rel="canonical" href="https://thereikigoddesshealing.com/blog" />
</Helmet>
```

### Meta tags for individual post

```tsx
<Helmet>
  <title>{post.title} | The Reiki Goddess Healing</title>
  <meta name="description" content={post.excerpt} />
  <meta name="author" content={post.author} />
  <meta property="og:title" content={post.title} />
  <meta property="og:description" content={post.excerpt} />
  <meta property="og:type" content="article" />
  <meta
    property="og:url"
    content={`https://thereikigoddesshealing.com/blog/${post.slug}`}
  />
  <meta property="og:image" content={post.featuredImage} />
  <meta property="article:published_time" content={post.publishDate} />
  <meta property="article:author" content={post.author} />
  <meta name="twitter:card" content="summary_large_image" />
  <link
    rel="canonical"
    content={`https://thereikigoddesshealing.com/blog/${post.slug}`}
  />
</Helmet>
```

### Structured data

```tsx
<script type="application/ld+json">
  {JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    image: post.featuredImage,
    datePublished: post.publishDate,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "The Reiki Goddess Healing",
      logo: {
        "@type": "ImageObject",
        url: "https://thereikigoddesshealing.com/logo.png",
      },
    },
    description: post.excerpt,
  })}
</script>
```

---

**Document complete**: All component specifications defined
**Ready for**: Implementation Phase 1
**Next step**: Create component files and begin building
