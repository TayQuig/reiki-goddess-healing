# Blog Component Hierarchy

**Created**: 2025-10-06
**Purpose**: Visual guide to blog component structure and relationships

## Overview

This document provides a comprehensive visual representation of the blog component architecture, showing how components nest, depend on each other, and data flows through the system.

---

## Current Implementation Hierarchy

### Full Page Structure (apps/main-app/src/pages/BlogPage.tsx)

```
BlogPage (Root Component)
│
├── HeaderSection (imported from @reiki-goddess/shared-components)
│   │
│   └── ResponsiveHeader
│       │
│       └── Header (Figma-sourced)
│           ├── Logo
│           ├── Navigation Items (mapped)
│           │   └── Link (react-router-dom)
│           └── Mobile Menu Toggle
│
├── Hero Section (inline composition)
│   │
│   └── ResponsiveContainer (variant="page")
│       │
│       └── div.text-center
│           ├── h1 - "Healing Insights & Wisdom"
│           └── p - Page description
│
├── Featured Post Section (conditional: {featuredPost && ...})
│   │
│   └── ResponsiveContainer (variant="page")
│       │
│       └── div.bg-white.rounded-2xl
│           ├── div.grid.lg:grid-cols-2
│           │   ├── Image Container
│           │   │   ├── img (featured image)
│           │   │   └── span.badge - "Featured"
│           │   │
│           │   └── Content Container
│           │       ├── Category Badge
│           │       ├── Date & Read Time
│           │       ├── h2 - Post Title
│           │       ├── p - Post Excerpt
│           │       └── Link - "Read Full Article"
│
├── Category Filter Section (inline composition)
│   │
│   └── ResponsiveContainer (variant="page")
│       │
│       └── div.flex-wrap
│           └── button (mapped over categories[])
│               └── {category} - text content
│
├── Blog Grid Section (inline composition)
│   │
│   └── ResponsiveContainer (variant="page")
│       │
│       └── div.grid.md:grid-cols-2.lg:grid-cols-3
│           │
│           └── article (mapped over filteredPosts[])
│               ├── Image Container
│               │   ├── img (post image)
│               │   └── Category Badge
│               │
│               └── Content Container
│                   ├── Date & Read Time
│                   ├── h3 - Post Title
│                   │   └── Link (react-router-dom)
│                   ├── p - Post Excerpt
│                   └── Link - "Read More"
│
├── Newsletter CTA Section (inline composition)
│   │
│   └── ResponsiveContainer (variant="page")
│       │
│       └── div.bg-gradient-to-br.from-blue-700
│           ├── h2 - "Stay Connected"
│           ├── p - Description
│           └── div.flex
│               ├── input[type="email"]
│               ├── button - "Subscribe"
│               └── p.text-sm - Privacy notice
│
├── Call to Action Section (inline composition)
│   │
│   └── ResponsiveContainer (variant="page")
│       │
│       └── div.bg-amber-50
│           ├── h2 - "Ready to Experience Healing"
│           ├── p - Description
│           └── div.flex
│               ├── Link - "Book Your Session"
│               └── Link - "Learn About Deirdre"
│
└── FooterSection (imported from @reiki-goddess/shared-components)
    │
    └── Footer (Figma-sourced)
        ├── Quick Links
        ├── Legal Links
        ├── Social Links
        └── Contact Info (from businessData)
```

---

## Minimal Implementation Hierarchy (apps/main/src/pages/Blog.tsx)

```
Blog (Root Component)
│
└── PageTransition (from ../components/PageTransition)
    │
    └── motion.div (framer-motion)
        │
        └── div.min-h-screen.bg-[#FFFBF5]
            │
            └── div.max-w-6xl.mx-auto
                ├── h1 - "Blog"
                └── p - "Blog content coming soon..."
```

---

## Placeholder Implementation Hierarchy (packages/shared-components/src/pages/BlogPage.tsx)

```
BlogPage (Root Component)
│
└── ResponsiveContainer (className="py-20")
    │
    └── div.max-w-4xl.mx-auto
        │
        ├── Hero Section (div.text-center)
        │   ├── h1 - "Healing Insights"
        │   └── p - Page description
        │
        └── Blog Posts Grid (div.grid.gap-8)
            │
            ├── article (static post #1)
            │   └── div.p-8
            │       ├── h2 - Post Title
            │       ├── p - Post Excerpt
            │       └── div.flex (meta info)
            │
            ├── article (static post #2)
            │   └── div.p-8
            │       ├── h2 - Post Title
            │       ├── p - Post Excerpt
            │       └── div.flex (meta info)
            │
            └── div.bg-blue-50 (migration notice)
                └── p - "Blog content being migrated"
```

---

## Routing Hierarchy

### Current Route Structure

```
App (BrowserRouter)
│
└── Routes
    │
    └── Route (path="/", element=<AppLayout />)
        │
        └── AppLayout (packages/shared-components)
            ├── Header (absolute positioned)
            ├── main (Outlet for routes)
            │   │
            │   └── Route (path="blog", element=<Blog />)
            │       │
            │       └── Blog Component
            │           └── (renders blog content)
            │
            └── Footer
```

### Recommended Future Route Structure

```
App (BrowserRouter)
│
└── Routes
    │
    └── Route (path="/", element=<AppLayout />)
        │
        └── AppLayout
            ├── Header
            ├── main (Outlet)
            │   │
            │   └── Route (path="blog")
            │       │
            │       ├── Route (index, element=<BlogListing />)
            │       │   └── BlogListing Component
            │       │       ├── Hero
            │       │       ├── Featured Post
            │       │       ├── Category Filter
            │       │       └── Blog Grid
            │       │
            │       ├── Route (path=":slug", element=<BlogPost />)
            │       │   └── BlogPost Component
            │       │       ├── Post Header
            │       │       ├── Post Content
            │       │       ├── Author Bio
            │       │       └── Related Posts
            │       │
            │       └── Route (path="category/:category", element=<BlogListing />)
            │           └── BlogListing Component (filtered by category)
            │
            └── Footer
```

---

## Component Data Flow

### State Flow (Current Implementation)

```
BlogPage (Parent State)
│
├── STATE: blogPosts[] (const, inline data)
├── STATE: categories[] (const, inline data)
├── STATE: selectedCategory (useState)
│   └── Updated by: Category button onClick
│
├── DERIVED: filteredPosts (computed from selectedCategory + blogPosts)
│   └── Used by: Blog Grid mapping
│
└── DERIVED: featuredPost (computed from blogPosts.find)
    └── Used by: Featured Post Section conditional render
```

**Data Flow Diagram**:

```
User Action                State Update              Render Effect
───────────                ────────────              ─────────────

Click Category Button
        │
        ├─> setSelectedCategory("Wellness")
        │
        ├─> filteredPosts recomputes
        │
        └─> Blog Grid re-renders ────────> Shows only "Wellness" posts


Page Load
        │
        ├─> selectedCategory = "All"
        │
        ├─> filteredPosts = blogPosts
        │
        ├─> featuredPost = blogPosts[0]
        │
        └─> All sections render ─────────> Full page display
```

### Props Flow (Current Implementation)

```
BlogPage
    │
    ├─> HeaderSection
    │       Props: {
    │         navigationItems: NavigationItem[]
    │         brand: BrandConfig
    │       }
    │
    ├─> ResponsiveContainer (x6 instances)
    │       Props: {
    │         variant: "page"
    │         className: string
    │         children: ReactNode
    │       }
    │
    └─> FooterSection
            Props: {
              sections: Array<{title, links}>
              copyright: {text, year}
              socialLinks: Array<{platform, href}>
              contact: {phone, email, address}
            }
```

### External Data Dependencies

```
@reiki-goddess/shared-utils
    │
    └── businessData
            ├── phone: string
            ├── email: string
            └── location: string
                    │
                    └── Used in FooterSection contact prop

react-router-dom
    │
    ├── Link (used for navigation)
    │   └── to={`/blog/${post.id}`}
    │
    └── useLocation (in AppLayout)
        └── Determines active navigation item
```

---

## Recommended Component Extraction

### Proposed Refactored Hierarchy

```
BlogPage (Smart Component)
│
├── State Management
│   ├── blogPosts: BlogPost[]
│   ├── selectedCategory: string
│   ├── filteredPosts: BlogPost[] (computed)
│   └── featuredPost: BlogPost | undefined (computed)
│
├── HeaderSection (existing)
│
├── BlogHero (new component)
│   Props: {
│     title: string
│     description: string
│   }
│
├── FeaturedBlogCard (new component)
│   Props: {
│     post: BlogPost
│     onReadMore: (slug: string) => void
│   }
│
├── CategoryFilter (new component)
│   Props: {
│     categories: string[]
│     selectedCategory: string
│     onCategoryChange: (category: string) => void
│   }
│
├── BlogGrid (new component)
│   Props: {
│     posts: BlogPost[]
│     showFeatured?: boolean
│   }
│   │
│   └── BlogCard (new component)
│       Props: {
│         post: BlogPost
│         variant?: "default" | "featured"
│       }
│
├── NewsletterCTA (new component)
│   Props: {
│     title: string
│     description: string
│     onSubscribe: (email: string) => void
│   }
│
├── BookingCTA (new component)
│   Props: {
│     title: string
│     description: string
│     primaryLink: LinkConfig
│     secondaryLink: LinkConfig
│   }
│
└── FooterSection (existing)
```

### Component Responsibility Matrix

| Component            | Data                | Logic              | Presentation         | Testability |
| -------------------- | ------------------- | ------------------ | -------------------- | ----------- |
| **BlogPage**         | Owns state          | Filtering, routing | Layout orchestration | Integration |
| **BlogHero**         | Receives props      | None               | Text display         | Unit        |
| **FeaturedBlogCard** | Receives post       | Navigation         | Card layout          | Unit        |
| **CategoryFilter**   | Receives categories | Selection          | Button group         | Unit        |
| **BlogGrid**         | Receives posts      | Mapping            | Grid layout          | Unit        |
| **BlogCard**         | Receives post       | Navigation         | Card layout          | Unit        |
| **NewsletterCTA**    | Receives config     | Form validation    | CTA section          | Unit        |
| **BookingCTA**       | Receives config     | Navigation         | CTA section          | Unit        |

---

## Import Graph

### Current Dependencies

```
apps/main/src/pages/Blog.tsx
    │
    ├── import PageTransition from "../components/PageTransition"
    │       │
    │       └── import { motion } from "framer-motion"
    │
    └── (no other imports)


apps/main-app/src/pages/BlogPage.tsx
    │
    ├── import React from "react"
    │
    ├── import { Link } from "react-router-dom"
    │
    ├── import {
    │       HeaderSection,
    │       FooterSection,
    │       ResponsiveContainer
    │   } from "@reiki-goddess/shared-components"
    │       │
    │       └── packages/shared-components/src/index.ts
    │           │
    │           ├── export { HeaderSection } from "./HeaderSection"
    │           │       └── ./HeaderSection/HeaderSection.tsx
    │           │           └── import { ResponsiveHeader } from "../Header"
    │           │
    │           ├── export { FooterSection } from "./FooterSection"
    │           │       └── ./FooterSection/FooterSection.tsx
    │           │           └── import Footer from "../Footer"
    │           │
    │           └── export { ResponsiveContainer } from "./ResponsiveContainer"
    │                   └── ./ResponsiveContainer/ResponsiveContainer.tsx
    │
    └── import { businessData } from "@reiki-goddess/shared-utils"
            │
            └── packages/shared-utils/src/index.ts
                └── export const businessData = {...}


packages/shared-components/src/pages/BlogPage.tsx
    │
    ├── import React from "react"
    │
    └── import { ResponsiveContainer } from "../ResponsiveContainer"
```

### Recommended Future Dependencies

```
packages/shared-components/src/pages/BlogPage.tsx
    │
    ├── import React, { useState, useMemo } from "react"
    │
    ├── import { useParams, useSearchParams } from "react-router-dom"
    │
    ├── import {
    │       HeaderSection,
    │       FooterSection,
    │       ResponsiveContainer
    │   } from "@reiki-goddess/shared-components"
    │
    ├── import {
    │       BlogHero,
    │       FeaturedBlogCard,
    │       CategoryFilter,
    │       BlogGrid,
    │       NewsletterCTA,
    │       BookingCTA
    │   } from "../Blog"
    │
    ├── import { BlogPost } from "../Blog/types"
    │
    └── import { useBlogPosts } from "../Blog/hooks"
            │
            └── Fetches data from CMS or API
```

---

## Component Size Analysis

### Current Implementation Metrics

| File                                              | Lines | Components | Inline Sections |
| ------------------------------------------------- | ----- | ---------- | --------------- |
| apps/main/src/pages/Blog.tsx                      | 18    | 1          | 1               |
| packages/shared-components/src/pages/BlogPage.tsx | 67    | 1          | 3               |
| apps/main-app/src/pages/BlogPage.tsx              | 375   | 1          | 7               |

### Recommended Extraction Targets

**Large inline sections to extract**:

1. **Featured Blog Card** (~50 lines)
   - Location: apps/main-app/src/pages/BlogPage.tsx, lines 126-185
   - Complexity: Medium (conditional render, grid layout, links)
   - Reusability: High (could be used on homepage)

2. **Category Filter Bar** (~20 lines)
   - Location: apps/main-app/src/pages/BlogPage.tsx, lines 188-204
   - Complexity: Low (map + button)
   - Reusability: High (could be used elsewhere)

3. **Blog Card** (~40 lines per card)
   - Location: apps/main-app/src/pages/BlogPage.tsx, lines 213-264
   - Complexity: Medium (image, metadata, links)
   - Reusability: Very High (core component)

4. **Newsletter CTA** (~30 lines)
   - Location: apps/main-app/src/pages/BlogPage.tsx, lines 269-298
   - Complexity: Medium (form input, gradient bg)
   - Reusability: High (could be used on other pages)

5. **Booking CTA** (~55 lines)
   - Location: apps/main-app/src/pages/BlogPage.tsx, lines 301-357
   - Complexity: Medium (two CTAs, icons)
   - Reusability: High (could be used on other pages)

---

## Animation Hierarchy

### PageTransition (apps/main only)

```
PageTransition
    │
    └── motion.div (framer-motion)
        │
        ├── Variants:
        │   ├── initial: { opacity: 0, y: 20 }
        │   ├── animate: { opacity: 1, y: 0, duration: 0.6s }
        │   └── exit: { opacity: 0, y: -20, duration: 0.4s }
        │
        └── children (page content)
```

### CSS Transitions (apps/main-app)

```
Hover Effects Applied:
│
├── Blog Cards
│   └── .hover:shadow-xl.hover:-translate-y-1
│       └── Lift effect on hover
│
├── Category Buttons
│   └── .hover:bg-blue-50
│       └── Background color change
│
├── Links
│   └── .hover:text-blue-800
│       └── Text color change
│
└── CTA Buttons
    └── .hover:bg-blue-800
        └── Background darken
```

---

## Accessibility Tree

### Semantic Structure

```
BlogPage
│
├── header (HeaderSection)
│   ├── nav
│   │   └── ul > li > a (navigation items)
│   └── img (logo)
│
├── main (implicit, should be explicit)
│   │
│   ├── section (Hero)
│   │   ├── h1 (page title)
│   │   └── p (description)
│   │
│   ├── section (Featured Post)
│   │   ├── article
│   │   │   ├── img
│   │   │   ├── h2 (post title)
│   │   │   ├── p (excerpt)
│   │   │   └── a (read more link)
│   │   └── span (badges)
│   │
│   ├── nav (Category Filter)
│   │   └── button (x7, should have aria-pressed)
│   │
│   ├── section (Blog Grid)
│   │   └── article (x5+)
│   │       ├── img (should have loading="lazy")
│   │       ├── h3 (post title)
│   │       ├── p (excerpt)
│   │       └── a (read more)
│   │
│   ├── aside (Newsletter CTA)
│   │   ├── h2
│   │   ├── form (should have proper labels)
│   │   └── button
│   │
│   └── aside (Booking CTA)
│       ├── h2
│       └── nav
│           ├── a (primary CTA)
│           └── a (secondary CTA)
│
└── footer (FooterSection)
    ├── nav (quick links)
    ├── nav (legal links)
    └── address (contact info)
```

### Missing Landmarks

**Recommendations**:

```html
<main role="main" aria-label="Blog content">
  <!-- Current content -->
</main>

<nav role="navigation" aria-label="Blog categories">
  <!-- Category filters -->
</nav>

<aside role="complementary" aria-label="Newsletter signup">
  <!-- Newsletter CTA -->
</aside>
```

---

## Summary

### Key Takeaways

1. **Current Structure**: Single-file, inline composition
2. **Recommended Structure**: Extracted, reusable components
3. **Data Flow**: Simple, local state (appropriate for now)
4. **Dependencies**: Well-organized through monorepo packages
5. **Accessibility**: Good foundation, needs ARIA enhancements

### Next Steps

1. Extract inline sections into components
2. Define TypeScript interfaces
3. Add proper accessibility attributes
4. Create comprehensive component tests
5. Implement performance optimizations

---

**Document Version**: 1.0
**Last Updated**: 2025-10-06
**Related Documents**:

- [Component Analysis](./component-analysis.md)
- [Blog Migration Plan](/Users/taylorquigley/Documents/Directories/reiki-goddess-healing/docs/progress/006-blog-page-migration.md)
