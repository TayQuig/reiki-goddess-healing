# Blog Page Migration - Current State Analysis

**Generated**: 2025-10-06
**Research Scope**: Complete monorepo (apps/main, packages/\*)
**Purpose**: Document patterns and architecture for blog implementation

## Table of contents

1. [Executive summary](#executive-summary)
2. [Current blog implementation](#current-blog-implementation)
3. [Component patterns](#component-patterns)
4. [Architecture patterns](#architecture-patterns)
5. [Design system usage](#design-system-usage)
6. [Routing patterns](#routing-patterns)
7. [Data flow patterns](#data-flow-patterns)
8. [Performance patterns](#performance-patterns)
9. [Testing patterns](#testing-patterns)
10. [Recommendations](#recommendations)

---

## Executive summary

### Key findings

1. **No actual blog exists** - Legacy `/legacy/BLog/` is a duplicate of About page (confirmed in `/apps/main/BLOG_ANALYSIS.md:1-34`)
2. **Placeholder implementations** exist in both apps/main and packages/shared-components
3. **Robust component patterns** available from Services, Events, and Contact pages
4. **Strong foundation** exists for card-based layouts, animations, and responsive design
5. **No Figma designs** - Blog screenshots directory exists but is empty

### Current blog status

- **apps/main/src/pages/Blog.tsx** (lines 1-19): Minimal placeholder with PageTransition wrapper
- **packages/shared-components/src/pages/BlogPage.tsx** (lines 1-67): Basic placeholder with 2 sample articles
- **Legacy BLog**: Confirmed duplicate of About page, no blog functionality
- **Figma screenshots**: Directory exists but contains no design files

---

## Current blog implementation

### 1. Apps/main placeholder

**File**: `/apps/main/src/pages/Blog.tsx`

```typescript
import PageTransition from "../components/PageTransition";

function Blog() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-[#FFFBF5]">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <h1 className="text-4xl font-bold text-[#0205B7] mb-4">Blog</h1>
          <p className="text-gray-700">Blog content coming soon...</p>
        </div>
      </div>
    </PageTransition>
  );
}
```

**Pattern observations**:

- Uses PageTransition wrapper (framer-motion based)
- Applies brand background color (#FFFBF5)
- Uses brand blue for heading (#0205B7)
- Simple content container pattern

### 2. Shared-components placeholder

**File**: `/packages/shared-components/src/pages/BlogPage.tsx`

```typescript
export const BlogPage: React.FC = () => {
  return (
    <ResponsiveContainer className="py-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            Healing Insights
          </h1>
          <p className="text-lg text-gray-600">
            Explore articles, insights, and guidance...
          </p>
        </div>

        {/* Placeholder Blog Posts */}
        <div className="grid gap-8">
          <article className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-8">
              <h2>Understanding Energy Healing: A Beginner's Guide</h2>
              <p>Discover the fundamentals of energy healing...</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>By Deirdre, The Reiki Goddess</span>
                <span>Coming Soon</span>
              </div>
            </div>
          </article>
          {/* More placeholder articles... */}
        </div>
      </div>
    </ResponsiveContainer>
  );
};
```

**Pattern observations**:

- Uses ResponsiveContainer instead of PageTransition
- Has basic article card structure
- Implements meta information pattern (author, date)
- Uses white cards on cream background

### 3. Routing setup

**File**: `/apps/main/src/App.tsx` (lines 1-31)

```typescript
<Routes>
  <Route path="/" element={<AppLayout />}>
    <Route index element={<Home />} />
    <Route path="about" element={<About />} />
    <Route path="services" element={<Services />} />
    <Route path="events" element={<Events />} />
    <Route path="contact" element={<Contact />} />
    <Route path="blog" element={<Blog />} />
    <Route path="*" element={<NotFound />} />
  </Route>
</Routes>
```

**Pattern observations**:

- Blog route exists at `/blog`
- No nested routes for individual posts (would need `/blog/:slug`)
- Uses React Router v6 patterns
- AppLayout wrapper provides header/footer

---

## Component patterns

### 1. Card-based layouts

#### Service cards pattern

**File**: `/packages/shared-components/src/Services/ServicesSection.tsx` (lines 3-196)

**Interface**:

```typescript
export interface ServiceCard {
  id: string;
  icon: React.ReactNode;
  title: string;
  duration?: string;
  description?: string;
  href?: string;
}
```

**Key features**:

- Responsive grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
- Card layering effect (blue background + white card)
- Hover effects with gradient overlay
- Icon, title, duration/description pattern
- Links to detail pages

**Applicable to blog**:

- Can adapt for blog post cards
- Grid layout pattern reusable
- Hover effects enhance UX
- Link pattern for post detail navigation

#### Event cards pattern

**File**: `/packages/shared-components/src/CommunityEvents/CommunityEvents.tsx` (lines 3-298)

**Interface**:

```typescript
export interface EventCard {
  id: string;
  title: string;
  image: {
    src: string;
    alt: string;
  };
  date?: string;
  description?: string;
}
```

**Key features**:

- Image-focused cards
- White cards on gradient background
- Grid layout: `grid-cols-1 md:grid-cols-2`
- Featured image with aspect ratio control
- Date and description metadata
- CTA button per card

**Applicable to blog**:

- Perfect for blog post previews
- Image handling pattern
- Featured image + excerpt layout
- Publication date display

### 2. Page composition pattern

**File**: `/packages/shared-components/src/Homepage/Homepage.tsx` (lines 1-117)

**Pattern structure**:

```typescript
export const Homepage: React.FC<HomepageProps> = ({ className = "" }) => {
  return (
    <div className={`${className}`}>
      <div className="relative mx-auto overflow-hidden"
           style={{ maxWidth: "1440px", backgroundColor: "#FFFBF5", padding: "0 66px" }}>

        <AnimatedSection animation="fadeInUp" delay={0.2}>
          <FeaturesBar />
        </AnimatedSection>

        <AnimatedSection animation="fadeIn" delay={0.1} threshold={0.2}>
          <MeetTheGoddess />
        </AnimatedSection>

        {/* More sections... */}
      </div>
    </div>
  );
};
```

**Key patterns**:

- Sections composed with AnimatedSection wrapper
- Staggered animation delays
- Centralized container (1440px max-width)
- Consistent padding (66px)
- Cream background (#FFFBF5)

**Applicable to blog**:

- BlogPage can follow same composition pattern
- AnimatedSection for hero, filters, post grid
- Individual BlogPost page can use similar structure

### 3. Contact info card pattern

**File**: `/packages/shared-components/src/ContactInfoCard/ContactInfoCard.tsx` (lines 3-91)

**Interface**:

```typescript
export interface ContactInfoCardProps {
  icon: string; // Image path
  title: string; // "Our Location"
  content: string; // Address/phone/email
  ctaText: string; // "Get Directions"
  ctaLink: string; // URL
  className?: string;
}
```

**Rendering pattern**:

```typescript
<div className="bg-white rounded-[20px] shadow-lg p-8">
  <div className="flex flex-col items-center text-center">
    <img src={icon} alt="" className="w-16 h-16 mb-4" />
    <h3 className="text-xl font-bold mb-4">{title}</h3>
    <p className="text-gray-600 mb-6">{content}</p>
    <a href={ctaLink} className="inline-flex items-center gap-2 px-6 py-3
       bg-[#0205B7] text-white rounded-full hover:bg-opacity-90">
      {ctaText}
    </a>
  </div>
</div>
```

**Applicable to blog**:

- Similar card structure for blog categories
- Author bio cards
- Related posts cards

---

## Architecture patterns

### 1. Component organization

**Shared components structure**:

```
packages/shared-components/src/
├── pages/              # Route-level page components
│   ├── HomePage.tsx
│   ├── ContactPage.tsx
│   ├── BlogPage.tsx
│   └── index.ts
├── ComponentName/      # Feature components
│   ├── ComponentName.tsx
│   ├── ComponentName.test.tsx
│   └── index.ts
└── index.ts           # Barrel exports
```

**Pattern**: Each component in its own directory with co-located tests

**Recommendation for blog**:

```
packages/shared-components/src/
├── Blog/
│   ├── BlogHero/
│   │   ├── BlogHero.tsx
│   │   ├── BlogHero.test.tsx
│   │   └── index.ts
│   ├── BlogCard/
│   │   ├── BlogCard.tsx
│   │   ├── BlogCard.test.tsx
│   │   └── index.ts
│   ├── BlogFilters/
│   │   ├── BlogFilters.tsx
│   │   ├── BlogFilters.test.tsx
│   │   └── index.ts
│   ├── BlogPost/
│   │   ├── BlogPost.tsx
│   │   ├── BlogPost.test.tsx
│   │   └── index.ts
│   └── index.ts
└── pages/
    ├── BlogListingPage.tsx
    ├── BlogPostPage.tsx
    └── index.ts
```

### 2. TypeScript patterns

**Props interface pattern** (from ServicesSection.tsx:3-16):

```typescript
export interface ServiceCard {
  id: string;
  icon: React.ReactNode;
  title: string;
  duration?: string; // Optional fields with ?
  description?: string;
  href?: string;
}

export interface ServicesSectionProps {
  heading?: string; // Optional with default value
  services?: ServiceCard[];
  className?: string;
}
```

**Default props pattern**:

```typescript
export const ServicesSection: React.FC<ServicesSectionProps> = ({
  heading = "Explore Healing Services",
  services = [...defaultServices],
  className = "",
}) => {
  /* ... */
};
```

**Recommendation for blog**:

```typescript
export interface BlogPost {
  id: string;
  slug: string; // For URL: /blog/understanding-reiki
  title: string;
  excerpt: string; // Short preview
  content: string; // Full markdown/HTML
  category: BlogCategory; // Enum: 'healing' | 'wellness' | 'events'
  author: {
    name: string;
    image?: string;
    bio?: string;
  };
  publishedAt: string; // ISO date string
  updatedAt?: string;
  readingTime: number; // Minutes
  featuredImage: {
    src: string;
    alt: string;
  };
  tags: string[];
  seo?: {
    metaDescription: string;
    keywords: string[];
  };
}

export interface BlogListingPageProps {
  heading?: string;
  subheading?: string;
  posts?: BlogPost[];
  categories?: BlogCategory[];
  className?: string;
}
```

### 3. State management patterns

**File**: `/packages/shared-components/src/Homepage/Homepage.tsx` (lines 20-41)

**Smooth scroll handler**:

```typescript
useEffect(() => {
  const handleSmoothScroll = (e: MouseEvent) => {
    const target = e.target as HTMLAnchorElement;
    if (
      target.tagName === "A" &&
      target.getAttribute("href")?.startsWith("#")
    ) {
      e.preventDefault();
      const elementId = target.getAttribute("href")?.slice(1);
      if (elementId) {
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }
  };

  document.addEventListener("click", handleSmoothScroll);
  return () => document.removeEventListener("click", handleSmoothScroll);
}, []);
```

**Pattern**: Local state preferred over global state

**Recommendation for blog**:

- Filter state: Local useState for category filtering
- Search state: Local useState (future enhancement)
- Pagination state: URL parameters via useSearchParams
- Individual post: Fetch based on useParams slug

---

## Design system usage

### 1. Color system

**File**: `/packages/design-system/src/colors.ts` (lines 6-76)

**Brand colors**:

```typescript
export const colors = {
  brand: {
    blue: "rgba(2, 5, 183, 1)", // #0205B7 - Primary brand
    purple: "rgba(165, 147, 224, 1)",
    peach: "rgba(255, 198, 165, 1)",
    cyan: "rgba(99, 213, 249, 1)",
  },
  background: {
    primary: "#FFFBF5", // Cream - Main site background
    white: "#ffffff",
  },
  text: {
    primary: "rgba(51, 51, 51, 1)", // #333333
    secondary: "rgba(94, 94, 94, 1)", // #5E5E5E
    light: "rgba(158, 158, 158, 1)", // #9E9E9E
    brand: "rgba(2, 5, 183, 1)", // Brand blue
  },
};
```

**Application in blog**:

- Background: `#FFFBF5` for main page
- Cards: `#FFFFFF` with shadows
- Headings: Brand blue `#0205B7`
- Body text: `#333333`
- Meta info: `#9E9E9E`

### 2. Typography system

**File**: `/packages/design-system/src/typography.ts` (lines 3-56)

```typescript
export const fontFamilies = {
  primary: "Figtree, Helvetica, sans-serif", // Headings
  secondary: "Neue_Montreal-Regular, Helvetica, sans-serif",
  medium: "Neue_Montreal-Medium, Helvetica, sans-serif",
  bold: "Neue_Montreal-Bold, Helvetica, sans-serif",
};

export const fontSizes = {
  xs: "0.75rem", // 12px - Meta info
  sm: "0.875rem", // 14px - Secondary text
  base: "1rem", // 16px - Body text
  lg: "1.125rem", // 18px - Large body
  xl: "1.25rem", // 20px - Small headings
  "2xl": "1.5rem", // 24px - Section headings
  "3xl": "1.875rem", // 30px - Page subheadings
  "4xl": "2.25rem", // 36px - Page headings
  "5xl": "3rem", // 48px - Hero headings
};
```

**Application in blog**:

```css
.blog-hero-title {
  font-family: Figtree;
  font-size: 48px;
  font-weight: bold;
  color: #0205b7;
}

.blog-post-title {
  font-family: Figtree;
  font-size: 36px;
  font-weight: bold;
  color: #333333;
}

.blog-post-excerpt {
  font-family: Neue_Montreal-Regular;
  font-size: 16px;
  color: #5e5e5e;
  line-height: 1.5;
}

.blog-meta {
  font-family: Neue_Montreal-Regular;
  font-size: 14px;
  color: #9e9e9e;
}
```

### 3. Spacing and layout

**File**: `/packages/shared-components/src/Homepage/Homepage.tsx` (lines 46-54)

**Container pattern**:

```typescript
<div className="relative mx-auto overflow-hidden"
     style={{
       maxWidth: "1440px",          // Site max width
       margin: "0 auto",            // Center
       backgroundColor: "#FFFBF5",  // Cream background
       boxShadow: "0 0 40px rgba(0, 0, 0, 0.1)",
       padding: "0 66px",           // Horizontal padding
     }}>
```

**Section spacing**:

- Vertical spacing: `py-20` (80px top/bottom)
- Component margins: `mb-12` (48px)
- Card gaps: `gap-8` (32px)

---

## Routing patterns

### 1. Current routing setup

**File**: `/apps/main/src/App.tsx` (lines 11-29)

```typescript
<BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
  <Routes>
    <Route path="/" element={<AppLayout />}>
      <Route index element={<Home />} />
      <Route path="blog" element={<Blog />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
</BrowserRouter>
```

### 2. AppLayout integration

**File**: `/packages/shared-components/src/AppLayout/AppLayout.tsx` (lines 15-85)

**Navigation items** (lines 19-46):

```typescript
const navigationItems: NavigationItem[] = [
  { label: "Home", href: "/", isActive: location.pathname === "/" },
  {
    label: "Blog",
    href: "/blog",
    isActive: location.pathname.startsWith("/blog"),
  }, // Catches /blog and /blog/*
  // ...other items
];
```

**Pattern**: Uses `startsWith` to activate Blog nav on both listing and detail pages

### 3. Recommended blog routing

**Enhanced routing structure**:

```typescript
<Routes>
  <Route path="/" element={<AppLayout />}>
    {/* Blog Routes */}
    <Route path="blog">
      <Route index element={<BlogListingPage />} />
      <Route path="category/:category" element={<BlogListingPage />} />
      <Route path=":slug" element={<BlogPostPage />} />
    </Route>
    <Route path="*" element={<NotFound />} />
  </Route>
</Routes>
```

**URL structure**:

- `/blog` - All posts
- `/blog/category/healing` - Filtered by category
- `/blog/understanding-reiki-healing` - Individual post

**Implementation in BlogPostPage**:

```typescript
import { useParams } from 'react-router-dom';

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  // Fetch post by slug
  const post = useBlogPost(slug);

  if (!post) return <NotFound />;

  return <BlogPost post={post} />;
};
```

---

## Data flow patterns

### 1. Component data patterns

**Services section pattern** (ServicesSection.tsx:23-75):

```typescript
export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services = [
    { id: "reiki", title: "Reiki Healing", href: "/services/reiki" },
    { id: "sound", title: "Sound Therapy", href: "/services/sound" },
    // Static default data inline
  ],
}) => {
  return (
    <section>
      <div className="grid">
        {services.map((service) => (
          <ServiceCard key={service.id} {...service} />
        ))}
      </div>
    </section>
  );
};
```

**Pattern**: Static default data, prop override capability

### 2. Recommended blog data patterns

#### Static data approach (MVP)

**File**: `packages/shared-utils/src/data/blogPosts.ts`

```typescript
import { BlogPost } from "../types/blog";

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "understanding-reiki-healing",
    title: "Understanding Reiki Healing: A Beginner's Guide",
    excerpt:
      "Discover the fundamentals of energy healing and how it can support your well-being...",
    content: `
      # Understanding Reiki Healing

      Reiki is a Japanese energy healing technique...

      ## What is Reiki?
      ...
    `,
    category: "healing",
    author: {
      name: "Deirdre, The Reiki Goddess",
      image: "/images/authors/deirdre.jpg",
    },
    publishedAt: "2024-01-15",
    readingTime: 5,
    featuredImage: {
      src: "/images/blog/reiki-healing.jpg",
      alt: "Person receiving Reiki healing session",
    },
    tags: ["reiki", "energy-healing", "beginners"],
  },
  // More posts...
];

// Helper functions
export const getAllPosts = () => blogPosts;
export const getPostBySlug = (slug: string) =>
  blogPosts.find((post) => post.slug === slug);
export const getPostsByCategory = (category: string) =>
  blogPosts.filter((post) => post.category === category);
```

#### Future: CMS integration

**Headless CMS options**:

1. **Contentful** - Structured content, rich APIs
2. **Strapi** - Self-hosted, full control
3. **Sanity** - Real-time editing, excellent DX
4. **Ghost** - Blog-specific, SEO optimized

**Future implementation**:

```typescript
// packages/shared-utils/src/api/blog.ts
export async function fetchBlogPosts(category?: string): Promise<BlogPost[]> {
  const params = category ? `?category=${category}` : "";
  const response = await fetch(`/api/blog/posts${params}`);
  return response.json();
}

export async function fetchBlogPost(slug: string): Promise<BlogPost> {
  const response = await fetch(`/api/blog/posts/${slug}`);
  return response.json();
}

// In component
const { slug } = useParams();
const [post, setPost] = useState<BlogPost | null>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchBlogPost(slug!)
    .then(setPost)
    .finally(() => setLoading(false));
}, [slug]);
```

### 3. Form submission pattern

**File**: `/packages/shared-utils/src/api/contact.ts` (referenced in ContactPage.tsx:77-79)

**Pattern**:

```typescript
export async function submitContactForm(data: ContactFormData) {
  // Validation
  // API call
  // Error handling
  return response;
}
```

**Could be extended for blog**:

```typescript
export async function submitBlogComment(postId: string, comment: CommentData) {
  // Similar pattern
}

export async function subscribeToNewsletter(email: string) {
  // Newsletter subscription
}
```

---

## Performance patterns

### 1. Lazy loading images

**File**: `/packages/shared-components/src/LazyImage/LazyImage.tsx` (lines 1-110)

**Pattern**:

```typescript
export const LazyImage: React.FC<LazyImageProps> = ({
  src, alt, className, style, placeholderColor = "#E5E5E5"
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | undefined>();
  const { ref, isVisible } = useIntersectionObserver({
    threshold: 0.01,
    rootMargin: "100px",  // Start loading 100px before visible
  });

  useEffect(() => {
    if (isVisible && !imageSrc) {
      setImageSrc(src);  // Only load when near viewport
    }
  }, [isVisible, src, imageSrc]);

  return (
    <div ref={ref}>
      {!imageLoaded && <Placeholder />}
      {imageSrc && <img src={imageSrc} onLoad={() => setImageLoaded(true)} />}
    </div>
  );
};
```

**Application for blog**:

- Featured images in blog cards
- Images within blog post content
- Author avatars

### 2. Animation patterns

**File**: `/packages/shared-components/src/AnimatedSection/AnimatedSection.tsx` (lines 1-42)

**Intersection observer pattern**:

```typescript
export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  animation = "fadeInUp",
  delay = 0,
  threshold = 0.1,
}) => {
  const { ref, isVisible } = useIntersectionObserver({ threshold });

  return (
    <div
      ref={ref}
      className={`${isVisible ? `animate-${animation}` : "opacity-0"}`}
      style={{
        animationDelay: `${delay}s`,
        animationFillMode: "both",
      }}
    >
      {children}
    </div>
  );
};
```

**Application for blog**:

```typescript
<AnimatedSection animation="fadeInUp" delay={0.1}>
  <BlogHero />
</AnimatedSection>

<AnimatedSection animation="fadeIn" delay={0.2}>
  <BlogFilters />
</AnimatedSection>

<AnimatedSection animation="fadeInUp" delay={0.3}>
  <BlogPostGrid posts={posts} />
</AnimatedSection>
```

### 3. Page transitions

**File**: `/apps/main/src/components/PageTransition.tsx` (lines 1-46)

**Framer Motion pattern**:

```typescript
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.4, ease: "easeIn" }
  },
};

export const PageTransition: React.FC = ({ children }) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      {children}
    </motion.div>
  );
};
```

**Application**: Wrap both BlogListingPage and BlogPostPage

---

## Testing patterns

### 1. Component testing pattern

**File**: `/packages/shared-components/src/Services/ServicesSection.test.tsx` (lines 1-368)

**Comprehensive test structure**:

```typescript
describe("ServicesSection Component", () => {
  describe("Rendering", () => {
    it("should render the services section", () => {
      /* ... */
    });
    it("should render with custom className", () => {
      /* ... */
    });
    it("should apply correct background color", () => {
      /* ... */
    });
  });

  describe("Heading", () => {
    it("should render the heading", () => {
      /* ... */
    });
    it("should render default heading when not provided", () => {
      /* ... */
    });
  });

  describe("Services Grid", () => {
    it("should render all service cards", () => {
      /* ... */
    });
    it("should apply responsive grid classes", () => {
      /* ... */
    });
  });

  describe("Hover Effects", () => {
    it("should change box shadow on hover", () => {
      /* ... */
    });
  });

  describe("Accessibility", () => {
    it("should have semantic section element", () => {
      /* ... */
    });
    it("should have proper heading hierarchy", () => {
      /* ... */
    });
  });
});
```

**Testing checklist**:

- ✅ Rendering with props
- ✅ Default values
- ✅ Styling and classes
- ✅ Responsive behavior
- ✅ Hover/interaction states
- ✅ Accessibility (semantic HTML, ARIA)

### 2. Page testing pattern

**File**: `/packages/shared-components/src/pages/ContactPage.test.tsx` (lines 1-256)

**Page-level testing**:

```typescript
describe("ContactPage", () => {
  describe("Rendering", () => {
    it("should render main heading and subtitle", () => {
      /* ... */
    });
    it("should render all sections", () => {
      /* ... */
    });
  });

  describe("Styling", () => {
    it("should have cream background", () => {
      /* ... */
    });
    it("should apply correct typography", () => {
      /* ... */
    });
  });

  describe("Layout", () => {
    it("should apply correct spacing", () => {
      /* ... */
    });
    it("should have responsive grid", () => {
      /* ... */
    });
  });

  describe("Accessibility", () => {
    it("should have proper heading hierarchy", () => {
      /* ... */
    });
    it("should have accessible links", () => {
      /* ... */
    });
  });
});
```

### 3. Mock patterns

**Component mocking**:

```typescript
vi.mock("../AnimatedSection", () => ({
  AnimatedSection: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock("../BlogCard", () => ({
  BlogCard: ({ post }: { post: BlogPost }) => (
    <article data-testid="blog-card">
      <h3>{post.title}</h3>
    </article>
  ),
}));
```

**Recommended blog tests**:

```typescript
// BlogCard.test.tsx
describe("BlogCard", () => {
  it("should render featured image with LazyImage", () => {});
  it("should render title, excerpt, and meta info", () => {});
  it("should link to post detail page", () => {});
  it("should format date correctly", () => {});
  it("should display reading time", () => {});
  it("should show category badge", () => {});
});

// BlogListingPage.test.tsx
describe("BlogListingPage", () => {
  it("should render all blog posts", () => {});
  it("should filter posts by category", () => {});
  it("should handle empty state", () => {});
  it("should have proper SEO meta tags", () => {});
});

// BlogPostPage.test.tsx
describe("BlogPostPage", () => {
  it("should fetch and render post by slug", () => {});
  it("should render post content as HTML/markdown", () => {});
  it("should show author info", () => {});
  it("should display related posts", () => {});
  it("should handle 404 for invalid slug", () => {});
});
```

---

## Recommendations

### Phase 1: Foundation (MVP)

#### 1.1 Data structure setup

**Priority**: High
**Effort**: Low

Create blog data types and static content:

```typescript
// packages/shared-utils/src/types/blog.ts
export type BlogCategory = "healing" | "wellness" | "events" | "stories";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Markdown or HTML
  category: BlogCategory;
  author: {
    name: string;
    image?: string;
    bio?: string;
  };
  publishedAt: string;
  updatedAt?: string;
  readingTime: number;
  featuredImage: {
    src: string;
    alt: string;
  };
  tags: string[];
  seo?: {
    metaDescription: string;
    keywords: string[];
  };
}

// packages/shared-utils/src/data/blogPosts.ts
export const blogPosts: BlogPost[] = [
  // 5-10 starter posts
];
```

#### 1.2 Core components

**Priority**: High
**Effort**: Medium

Build reusable blog components following established patterns:

1. **BlogCard** - Based on EventCard pattern

   ```typescript
   // Reuse: Event card image handling, white card on cream, hover effects
   // Add: Category badge, reading time, excerpt truncation
   ```

2. **BlogHero** - Based on section header patterns

   ```typescript
   // Reuse: Figtree typography, brand blue color, center alignment
   // Add: Intro text, search bar (future)
   ```

3. **BlogFilters** - New component

   ```typescript
   // Create: Category filter buttons
   // Pattern: Similar to navigation pills
   // State: Active category highlighting
   ```

4. **BlogPost** - Content display
   ```typescript
   // Create: Article layout with typography hierarchy
   // Reuse: AnimatedSection, LazyImage for embedded images
   // Add: Markdown/HTML rendering, syntax highlighting for code
   ```

#### 1.3 Page implementations

**Priority**: High
**Effort**: Medium

1. **BlogListingPage**

   ```typescript
   export const BlogListingPage: React.FC = () => {
     const [category, setCategory] = useState<BlogCategory | null>(null);
     const filteredPosts = category
       ? getPostsByCategory(category)
       : getAllPosts();

     return (
       <div className="min-h-screen bg-[#FFFBF5]">
         <div className="relative mx-auto" style={{ maxWidth: "1440px", padding: "0 66px" }}>
           <AnimatedSection animation="fadeInUp" delay={0.1}>
             <BlogHero />
           </AnimatedSection>

           <AnimatedSection animation="fadeIn" delay={0.2}>
             <BlogFilters
               activeCategory={category}
               onCategoryChange={setCategory}
             />
           </AnimatedSection>

           <AnimatedSection animation="fadeInUp" delay={0.3}>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {filteredPosts.map(post => (
                 <BlogCard key={post.id} post={post} />
               ))}
             </div>
           </AnimatedSection>
         </div>
       </div>
     );
   };
   ```

2. **BlogPostPage**

   ```typescript
   export const BlogPostPage: React.FC = () => {
     const { slug } = useParams();
     const post = getPostBySlug(slug!);

     if (!post) return <NotFound />;

     return (
       <div className="min-h-screen bg-[#FFFBF5]">
         <div className="relative mx-auto" style={{ maxWidth: "900px", padding: "0 66px" }}>
           <AnimatedSection animation="fadeInUp">
             <BlogPost post={post} />
           </AnimatedSection>
         </div>
       </div>
     );
   };
   ```

#### 1.4 Routing enhancement

**Priority**: High
**Effort**: Low

Update routing to support nested blog routes:

```typescript
// apps/main/src/App.tsx
<Route path="blog">
  <Route index element={<BlogListingPage />} />
  <Route path="category/:category" element={<BlogListingPage />} />
  <Route path=":slug" element={<BlogPostPage />} />
</Route>
```

### Phase 2: Enhancement

#### 2.1 Content rendering

**Priority**: Medium
**Effort**: Medium

**Markdown support**:

```bash
npm install react-markdown remark-gfm rehype-raw
```

```typescript
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

<ReactMarkdown
  remarkPlugins={[remarkGfm]}
  className="prose prose-lg max-w-none"
>
  {post.content}
</ReactMarkdown>
```

**Syntax highlighting** (for code blocks):

```bash
npm install react-syntax-highlighter @types/react-syntax-highlighter
```

#### 2.2 SEO optimization

**Priority**: High
**Effort**: Low

```bash
npm install react-helmet-async
```

```typescript
import { Helmet } from 'react-helmet-async';

export const BlogPostPage = ({ post }) => (
  <>
    <Helmet>
      <title>{post.title} | The Reiki Goddess Healing</title>
      <meta name="description" content={post.seo?.metaDescription || post.excerpt} />
      <meta property="og:title" content={post.title} />
      <meta property="og:description" content={post.excerpt} />
      <meta property="og:image" content={post.featuredImage.src} />
      <meta property="og:type" content="article" />
      <meta name="keywords" content={post.tags.join(", ")} />
    </Helmet>
    {/* Page content */}
  </>
);
```

#### 2.3 Related posts

**Priority**: Medium
**Effort**: Low

```typescript
export function getRelatedPosts(currentPost: BlogPost, limit = 3): BlogPost[] {
  return blogPosts
    .filter(post =>
      post.id !== currentPost.id &&
      (post.category === currentPost.category ||
       post.tags.some(tag => currentPost.tags.includes(tag)))
    )
    .slice(0, limit);
}

// In BlogPostPage
<AnimatedSection delay={0.4}>
  <div className="mt-20">
    <h2 className="text-3xl font-bold mb-8">Related Articles</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {getRelatedPosts(post).map(relatedPost => (
        <BlogCard key={relatedPost.id} post={relatedPost} />
      ))}
    </div>
  </div>
</AnimatedSection>
```

#### 2.4 Pagination

**Priority**: Medium
**Effort**: Medium

```typescript
const POSTS_PER_PAGE = 12;

export const BlogListingPage = () => {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<BlogCategory | null>(null);

  const filteredPosts = category ? getPostsByCategory(category) : getAllPosts();
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const displayedPosts = filteredPosts.slice(
    (page - 1) * POSTS_PER_PAGE,
    page * POSTS_PER_PAGE
  );

  return (
    <>
      {/* Blog cards */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </>
  );
};
```

### Phase 3: Future enhancements

#### 3.1 CMS integration

**Priority**: Low
**Effort**: High

Options:

1. **Headless CMS** (Contentful, Sanity, Strapi)
2. **Git-based CMS** (Netlify CMS, Forestry)
3. **Custom admin** (React Admin + API)

#### 3.2 Search functionality

**Priority**: Low
**Effort**: Medium

```typescript
const [searchQuery, setSearchQuery] = useState("");

const searchPosts = (query: string) => {
  return blogPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
  );
};
```

#### 3.3 Comments system

**Priority**: Low
**Effort**: High

Options:

1. **Disqus** - Easy integration, third-party
2. **Commento** - Self-hosted, privacy-focused
3. **Custom** - Full control, more work

#### 3.4 Newsletter integration

**Priority**: Medium
**Effort**: Medium

```typescript
export const NewsletterCTA: React.FC = () => (
  <div className="bg-[#0205B7] rounded-[20px] p-12 text-center">
    <h3 className="text-3xl font-bold text-white mb-4">
      Subscribe for Healing Insights
    </h3>
    <p className="text-white mb-6">
      Get the latest articles and wellness tips delivered to your inbox
    </p>
    <form className="flex gap-4 max-w-md mx-auto">
      <input
        type="email"
        placeholder="Your email"
        className="flex-1 px-4 py-3 rounded-full"
      />
      <button className="px-8 py-3 bg-white text-[#0205B7] rounded-full font-semibold">
        Subscribe
      </button>
    </form>
  </div>
);
```

### Implementation checklist

**Phase 1 - Foundation (1-2 weeks)**:

- [ ] Create blog type definitions
- [ ] Create 5-10 sample blog posts (static data)
- [ ] Build BlogCard component
- [ ] Build BlogHero component
- [ ] Build BlogFilters component
- [ ] Build BlogPost component (basic content rendering)
- [ ] Implement BlogListingPage
- [ ] Implement BlogPostPage
- [ ] Update routing for nested blog routes
- [ ] Write component tests (80%+ coverage)
- [ ] Update navigation active states

**Phase 2 - Enhancement (1 week)**:

- [ ] Add markdown rendering support
- [ ] Implement SEO meta tags
- [ ] Add related posts section
- [ ] Implement pagination
- [ ] Add reading progress indicator
- [ ] Add social share buttons
- [ ] Add print styles

**Phase 3 - Polish (ongoing)**:

- [ ] Get Figma designs from designer
- [ ] Refine visual styling to match designs
- [ ] Add micro-interactions
- [ ] Optimize images and performance
- [ ] Add analytics tracking
- [ ] Accessibility audit and fixes

---

## File references

### Component patterns discovered

1. `/apps/main/src/pages/Blog.tsx` - Current placeholder
2. `/packages/shared-components/src/pages/BlogPage.tsx` - Placeholder with sample content
3. `/packages/shared-components/src/Services/ServicesSection.tsx` - Card grid pattern
4. `/packages/shared-components/src/CommunityEvents/CommunityEvents.tsx` - Image card pattern
5. `/packages/shared-components/src/ContactInfoCard/ContactInfoCard.tsx` - Info card pattern
6. `/packages/shared-components/src/Homepage/Homepage.tsx` - Page composition pattern
7. `/packages/shared-components/src/pages/ContactPage.tsx` - Full page implementation

### Architecture references

1. `/apps/main/src/App.tsx` - Routing setup
2. `/packages/shared-components/src/AppLayout/AppLayout.tsx` - Layout wrapper
3. `/packages/design-system/src/colors.ts` - Color tokens
4. `/packages/design-system/src/typography.ts` - Typography tokens
5. `/packages/shared-utils/src/formatting.ts` - Utility functions (slugify, formatDate, truncateText)
6. `/packages/shared-utils/src/validation.ts` - Validation utilities

### Animation and performance

1. `/packages/shared-components/src/AnimatedSection/AnimatedSection.tsx` - Scroll animations
2. `/packages/shared-components/src/LazyImage/LazyImage.tsx` - Lazy loading images
3. `/apps/main/src/components/PageTransition.tsx` - Page transitions

### Testing references

1. `/packages/shared-components/src/Services/ServicesSection.test.tsx` - Component test pattern
2. `/packages/shared-components/src/pages/ContactPage.test.tsx` - Page test pattern

### Documentation

1. `/apps/main/BLOG_ANALYSIS.md` - Original blog investigation
2. `/docs/progress/006-blog-page-migration.md` - Migration planning
3. `/docs/project/ARCHITECTURE.md` - Architecture patterns

---

## Conclusion

The codebase provides a **strong foundation** for implementing a blog page migration with:

1. ✅ **Established component patterns** - Card-based layouts from Services and Events
2. ✅ **Consistent design system** - Colors, typography, spacing all documented
3. ✅ **Robust architecture** - TypeScript patterns, testing conventions, performance optimizations
4. ✅ **Reusable utilities** - Date formatting, slugification, validation
5. ✅ **Animation patterns** - Intersection observer, framer-motion transitions

**Next steps**:

1. Get Figma blog designs from designer
2. Implement Phase 1 foundation components
3. Create 5-10 sample blog posts
4. Build and test BlogListingPage and BlogPostPage
5. Iterate on visual design to match Figma
6. Plan Phase 2 enhancements

**Estimated effort**: 2-3 weeks for MVP (Phase 1 + 2)

---

_Generated by Pattern Finder Agent - 2025-10-06_
