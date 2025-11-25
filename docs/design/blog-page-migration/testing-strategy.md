# Blog page migration - Testing strategy

**Generated**: 2025-10-06
**Feature**: Blog Page Migration
**Research Scope**: apps/main, packages/shared-components
**Agent**: test-coverage-analyst

## Table of contents

1. [Executive summary](#executive-summary)
2. [Current test coverage analysis](#current-test-coverage-analysis)
3. [Testing patterns identified](#testing-patterns-identified)
4. [Testing requirements for blog page](#testing-requirements-for-blog-page)
5. [Unit test requirements](#unit-test-requirements)
6. [Integration test scenarios](#integration-test-scenarios)
7. [E2E test cases](#e2e-test-cases)
8. [Test utilities needed](#test-utilities-needed)
9. [Quality recommendations](#quality-recommendations)
10. [Performance considerations](#performance-considerations)

---

## Executive summary

### Current state

- **Blog page**: Placeholder implementation (8 lines of code)
- **Legacy reference**: Available in `/legacy/BLog/src/screens/About/About.tsx` (~500 lines)
- **Test coverage**: 0% - no tests exist for blog page
- **Total project tests**: 528 tests across 3 packages (91.9% success rate)

### Key findings

1. **Strong testing foundation**: Comprehensive test patterns established in similar pages
2. **Reusable test utilities**: RouterWrapper, test-setup configurations
3. **Security testing maturity**: Multi-layered validation patterns proven in contact form
4. **E2E coverage**: Accessibility, performance, and user journey patterns established

### Testing strategy

- Follow established patterns from About, Services, Contact pages
- Leverage existing test utilities (RouterWrapper, security validators)
- Implement "Test-as-You-Migrate" approach (Phase 4B)
- Achieve 90%+ coverage before deployment

---

## Current test coverage analysis

### Package test breakdown

| Package           | Total Tests | Passing | Failing | Coverage |
| ----------------- | ----------- | ------- | ------- | -------- |
| apps/main         | 43          | 19      | 24      | Partial  |
| shared-components | 430         | 430     | 0       | ✅ 100%  |
| shared-utils      | 79          | 79      | 0       | ✅ 100%  |

### Blog-related test coverage

**Current coverage**: 0%

- No blog components exist in shared-components
- No blog page tests in apps/main
- Legacy blog (About page duplicate) has no tests

### Similar page test coverage (reference)

| Page     | Component Tests | Integration Tests | E2E Tests        | Total Coverage |
| -------- | --------------- | ----------------- | ---------------- | -------------- |
| About    | ✅ Placeholder  | ✅ Routing        | ❌ None          | ~40%           |
| Services | ✅ Placeholder  | ✅ Routing        | ❌ None          | ~40%           |
| Contact  | ✅ Full Suite   | ✅ Full Suite     | ✅ Complete      | ~95%           |
| Home     | ✅ Components   | ✅ Routing        | ✅ Accessibility | ~85%           |

**Insight**: Blog page should follow Contact/Home patterns for comprehensive coverage.

### Test file organization

```
Project Test Structure:
├── apps/main/src/
│   ├── __tests__/
│   │   ├── App.test.tsx                    (2 tests ✅)
│   │   ├── App.integration.test.tsx        (24 tests ❌)
│   │   └── routing.integration.test.tsx    (all passing ✅)
│   └── ContactEmailTemplate.test.tsx       (19 tests ✅)
│
├── packages/shared-components/src/
│   ├── Header/Header.test.tsx              (177 lines, comprehensive)
│   ├── Footer/Footer.test.tsx              (similar patterns)
│   ├── Hero/HeroV2.test.tsx                (344 lines, detailed)
│   ├── Services/ServicesSection.test.tsx   (367 lines, thorough)
│   └── pages/ContactPage.test.tsx          (integration patterns)
│
└── e2e/
    ├── accessibility.spec.ts               (comprehensive a11y tests)
    ├── contact-form.spec.ts                (security, validation)
    ├── contact-form-submission.spec.ts     (user journeys)
    └── performance.spec.ts                 (loading, metrics)
```

**Pattern identified**: Tests co-located with components, separate integration tests in apps/main.

---

## Testing patterns identified

### 1. Component test pattern (from HeroV2.test.tsx)

**Structure**:

```typescript
describe("ComponentName", () => {
  const defaultProps = {
    /* ... */
  };

  describe("Rendering", () => {
    it("should render with default props", () => {});
    it("should render with custom props", () => {});
    it("should apply custom className", () => {});
  });

  describe("Specific Feature", () => {
    it("should handle feature behavior", () => {});
  });

  describe("Accessibility", () => {
    it("should have proper ARIA attributes", () => {});
    it("should support keyboard navigation", () => {});
  });

  describe("Edge Cases", () => {
    it("should handle missing props gracefully", () => {});
  });
});
```

**Key characteristics**:

- Nested describe blocks for organization
- Comprehensive props testing
- Accessibility as first-class concern
- Edge case coverage
- Average 300-350 lines per component test

### 2. Router wrapper pattern

**Usage**: All navigation-dependent components use RouterWrapper

```typescript
// From Header.test.tsx
import { RouterWrapper } from "../test-utils";

const renderWithRouter = (component: React.ReactElement) => {
  return render(<RouterWrapper>{component}</RouterWrapper>);
};

describe("Header Component", () => {
  it("should render navigation items as links", () => {
    renderWithRouter(<Header {...defaultProps} />);

    const homeLink = screen.getByRole("link", { name: /home/i });
    expect(homeLink).toHaveAttribute("href", "/");
  });
});
```

**Implementation**: `/packages/shared-components/src/test-utils/RouterWrapper.tsx`

### 3. Security validation pattern (from contact form tests)

**Multi-layered validation**:

```typescript
// Unit tests for validators
describe("SecurityValidator", () => {
  it("should detect SQL injection patterns", () => {});
  it("should detect XSS attempts", () => {});
  it("should flag medical terms", () => {});
  it("should sanitize input", () => {});
});

// Integration tests
describe("FormComponent", () => {
  it("should block malicious input", async () => {
    await userEvent.type(input, '<script>alert("xss")</script>');
    await userEvent.click(submitButton);

    expect(screen.getByText(/invalid characters/i)).toBeInTheDocument();
  });
});

// E2E tests
test("should prevent XSS attacks", async ({ page }) => {
  await page.fill('input[name="message"]', '<script>alert("xss")</script>');
  await page.click('button[type="submit"]');

  await expect(page.locator("text=potentially malicious")).toBeVisible();
  await expect(page.locator("text=xss")).not.toBeVisible();
});
```

### 4. Responsive testing pattern

**From ServicesSection.test.tsx**:

```typescript
describe("Responsive Design", () => {
  it("should apply responsive padding to container", () => {
    const wrapper = container.querySelector(".mx-auto");
    expect(wrapper).toHaveClass("px-4", "sm:px-6", "lg:px-8");
  });

  it("should apply responsive grid classes", () => {
    const grid = container.querySelector(".grid");
    expect(grid).toHaveClass("grid-cols-1", "sm:grid-cols-2", "lg:grid-cols-4");
  });
});
```

### 5. Vitest configuration pattern

**Shared configuration factory**:

```typescript
// vitest.config.shared.ts
export const createVitestConfig = (packagePath: string) => {
  return defineConfig({
    plugins: [react()],
    test: {
      environment: "jsdom",
      setupFiles: [resolve(__dirname, "test-setup.ts")],
      globals: true,
      css: true,
      coverage: {
        provider: "v8",
        reporter: ["text", "json", "html"],
        exclude: ["node_modules/", "dist/", "**/*.d.ts", "**/*.config.*"],
      },
    },
    resolve: {
      alias: {
        "@reiki-goddess/shared-components": resolve(
          __dirname,
          "packages/shared-components/src"
        ),
        // ... other aliases
      },
    },
  });
};
```

**Usage**: Each package imports and customizes

```typescript
// packages/shared-components/vitest.config.ts
import { createVitestConfig } from "../../vitest.config.shared";
export default createVitestConfig(__dirname);
```

### 6. Test setup mocks

**Global test setup** (`test-setup.ts`):

```typescript
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => cleanup());

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })),
});

// Mock IntersectionObserver (for scroll animations)
global.IntersectionObserver = class IntersectionObserver {
  observe() {
    return null;
  }
  unobserve() {
    return null;
  }
  disconnect() {
    return null;
  }
};

// Mock scrollTo
window.scrollTo = vi.fn(() => {}) as any;
```

### 7. E2E accessibility pattern

**From accessibility.spec.ts**:

```typescript
test("should not have accessibility violations", async ({ page }) => {
  await page.goto("/blog");
  await page.waitForLoadState("networkidle");

  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});

test("should have proper heading hierarchy", async ({ page }) => {
  const h1Elements = await page.locator("h1").count();
  expect(h1Elements).toBe(1); // Exactly one h1

  const headingLevels = await page.locator("h1, h2, h3, h4, h5, h6").all();
  // Verify no level is skipped
});
```

### 8. Animation testing pattern

**Mock framer-motion for predictable tests**:

```typescript
// From App.test.tsx
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>
  },
  AnimatePresence: ({ children }: any) => children
}));
```

---

## Testing requirements for blog page

### Coverage targets

| Test Category     | Target          | Priority |
| ----------------- | --------------- | -------- |
| Unit Tests        | 90%+            | High     |
| Integration Tests | 85%+            | High     |
| E2E Tests         | Key paths       | Medium   |
| Accessibility     | 100% compliance | Critical |

### Required test coverage

#### 1. Blog page component

- ✅ Renders with placeholder content
- ❌ Renders with blog posts data
- ❌ Handles empty state (no posts)
- ❌ Handles loading state
- ❌ Handles error state
- ❌ Pagination functionality
- ❌ Filter/search functionality

#### 2. Blog post card component

- ❌ Displays post metadata (title, date, author)
- ❌ Displays excerpt/preview
- ❌ Renders featured image
- ❌ Handles missing image gracefully
- ❌ Links to full post
- ❌ Responsive design
- ❌ Accessibility (ARIA labels)

#### 3. Blog post detail page

- ❌ Renders full post content
- ❌ Displays author information
- ❌ Shows related posts
- ❌ Handles 404 for missing posts
- ❌ Metadata (SEO tags)

#### 4. Navigation integration

- ✅ Blog link in header (existing routing test)
- ❌ Active state for blog routes
- ❌ Sub-route handling (/blog/:slug)

#### 5. Legacy migration validation

- ❌ Design parity with legacy blog
- ❌ Content structure migration
- ❌ Asset migration verification

---

## Unit test requirements

### Blog page component tests

**File**: `/apps/main/src/pages/Blog.test.tsx`

```typescript
import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { RouterWrapper } from "@reiki-goddess/shared-components/test-utils";
import Blog from "./Blog";

// Mock blog data
const mockBlogPosts = [
  {
    id: "1",
    title: "Understanding Reiki Energy Healing",
    excerpt: "Discover the fundamentals of Reiki...",
    author: "Deirdre Quigley",
    date: "2025-10-01",
    image: "/img/blog-reiki-basics.jpg",
    slug: "understanding-reiki-energy-healing"
  },
  // ... more posts
];

describe("Blog Page", () => {
  describe("Rendering", () => {
    it("should render the blog page", () => {
      render(
        <RouterWrapper>
          <Blog />
        </RouterWrapper>
      );

      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/blog/i);
    });

    it("should apply correct background color", () => {
      const { container } = render(
        <RouterWrapper>
          <Blog />
        </RouterWrapper>
      );

      const page = container.querySelector('[data-testid="page-blog"]');
      expect(page).toHaveClass("bg-[#FFFBF5]");
    });
  });

  describe("Blog Post Grid", () => {
    it("should render blog posts in grid layout", async () => {
      // Mock API call
      vi.mock("./api/blog", () => ({
        fetchBlogPosts: vi.fn().mockResolvedValue(mockBlogPosts)
      }));

      render(
        <RouterWrapper>
          <Blog />
        </RouterWrapper>
      );

      await waitFor(() => {
        expect(screen.getAllByRole("article")).toHaveLength(mockBlogPosts.length);
      });
    });

    it("should apply responsive grid classes", () => {
      const { container } = render(
        <RouterWrapper>
          <Blog />
        </RouterWrapper>
      );

      const grid = container.querySelector(".grid");
      expect(grid).toHaveClass(
        "grid-cols-1",
        "md:grid-cols-2",
        "lg:grid-cols-3"
      );
    });
  });

  describe("Loading State", () => {
    it("should display loading skeleton while fetching posts", () => {
      render(
        <RouterWrapper>
          <Blog />
        </RouterWrapper>
      );

      expect(screen.getByTestId("loading-skeleton")).toBeInTheDocument();
    });
  });

  describe("Empty State", () => {
    it("should display message when no posts available", async () => {
      vi.mock("./api/blog", () => ({
        fetchBlogPosts: vi.fn().mockResolvedValue([])
      }));

      render(
        <RouterWrapper>
          <Blog />
        </RouterWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/no blog posts available/i)).toBeInTheDocument();
      });
    });
  });

  describe("Error Handling", () => {
    it("should display error message on fetch failure", async () => {
      vi.mock("./api/blog", () => ({
        fetchBlogPosts: vi.fn().mockRejectedValue(new Error("Network error"))
      }));

      render(
        <RouterWrapper>
          <Blog />
        </RouterWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/error loading blog posts/i)).toBeInTheDocument();
      });
    });
  });

  describe("Accessibility", () => {
    it("should have proper semantic structure", () => {
      render(
        <RouterWrapper>
          <Blog />
        </RouterWrapper>
      );

      expect(screen.getByRole("main")).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    });

    it("should have accessible blog post cards", async () => {
      render(
        <RouterWrapper>
          <Blog />
        </RouterWrapper>
      );

      await waitFor(() => {
        const articles = screen.getAllByRole("article");
        articles.forEach(article => {
          expect(article).toHaveAttribute("aria-label");
        });
      });
    });
  });
});
```

**Estimated tests**: ~30-40 tests

### Blog post card component tests

**File**: `/packages/shared-components/src/BlogPostCard/BlogPostCard.test.tsx`

```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RouterWrapper } from "../test-utils";
import { BlogPostCard } from "./BlogPostCard";

describe("BlogPostCard", () => {
  const defaultProps = {
    id: "1",
    title: "Understanding Reiki Energy Healing",
    excerpt: "Discover the fundamentals of Reiki and how it can transform your life...",
    author: "Deirdre Quigley",
    date: "2025-10-01",
    image: "/img/blog-reiki-basics.jpg",
    slug: "understanding-reiki-energy-healing"
  };

  describe("Rendering", () => {
    it("should render blog post card", () => {
      render(
        <RouterWrapper>
          <BlogPostCard {...defaultProps} />
        </RouterWrapper>
      );

      expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
      expect(screen.getByText(defaultProps.excerpt)).toBeInTheDocument();
    });

    it("should render featured image with alt text", () => {
      render(
        <RouterWrapper>
          <BlogPostCard {...defaultProps} />
        </RouterWrapper>
      );

      const image = screen.getByRole("img");
      expect(image).toHaveAttribute("src", defaultProps.image);
      expect(image).toHaveAttribute("alt", expect.stringContaining(defaultProps.title));
    });

    it("should display formatted date", () => {
      render(
        <RouterWrapper>
          <BlogPostCard {...defaultProps} />
        </RouterWrapper>
      );

      expect(screen.getByText("October 1, 2025")).toBeInTheDocument();
    });

    it("should display author name", () => {
      render(
        <RouterWrapper>
          <BlogPostCard {...defaultProps} />
        </RouterWrapper>
      );

      expect(screen.getByText(/by Deirdre Quigley/i)).toBeInTheDocument();
    });
  });

  describe("Image Handling", () => {
    it("should render placeholder when image is missing", () => {
      const propsWithoutImage = { ...defaultProps, image: undefined };

      render(
        <RouterWrapper>
          <BlogPostCard {...propsWithoutImage} />
        </RouterWrapper>
      );

      const placeholder = screen.getByTestId("image-placeholder");
      expect(placeholder).toBeInTheDocument();
    });

    it("should handle image load error gracefully", () => {
      render(
        <RouterWrapper>
          <BlogPostCard {...defaultProps} />
        </RouterWrapper>
      );

      const image = screen.getByRole("img");
      fireEvent.error(image);

      // Should show fallback
      expect(screen.getByTestId("image-fallback")).toBeInTheDocument();
    });
  });

  describe("Navigation", () => {
    it("should link to blog post detail page", () => {
      render(
        <RouterWrapper>
          <BlogPostCard {...defaultProps} />
        </RouterWrapper>
      );

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", `/blog/${defaultProps.slug}`);
    });

    it("should navigate on card click", async () => {
      const user = userEvent.setup();

      render(
        <RouterWrapper initialEntries={["/blog"]}>
          <BlogPostCard {...defaultProps} />
        </RouterWrapper>
      );

      const card = screen.getByRole("article");
      await user.click(card);

      // Verify navigation occurred (implementation-dependent)
    });
  });

  describe("Hover Effects", () => {
    it("should apply hover styles on mouse enter", async () => {
      const user = userEvent.setup();

      render(
        <RouterWrapper>
          <BlogPostCard {...defaultProps} />
        </RouterWrapper>
      );

      const card = screen.getByRole("article");
      await user.hover(card);

      expect(card).toHaveClass("hover:-translate-y-2");
    });
  });

  describe("Responsive Design", () => {
    it("should apply responsive text sizes", () => {
      render(
        <RouterWrapper>
          <BlogPostCard {...defaultProps} />
        </RouterWrapper>
      );

      const title = screen.getByRole("heading", { level: 3 });
      expect(title).toHaveClass("text-xl", "md:text-2xl", "lg:text-3xl");
    });

    it("should apply responsive image aspect ratio", () => {
      const { container } = render(
        <RouterWrapper>
          <BlogPostCard {...defaultProps} />
        </RouterWrapper>
      );

      const imageContainer = container.querySelector(".aspect-video");
      expect(imageContainer).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labels", () => {
      render(
        <RouterWrapper>
          <BlogPostCard {...defaultProps} />
        </RouterWrapper>
      );

      const article = screen.getByRole("article");
      expect(article).toHaveAttribute("aria-label", expect.stringContaining(defaultProps.title));
    });

    it("should have semantic HTML structure", () => {
      render(
        <RouterWrapper>
          <BlogPostCard {...defaultProps} />
        </RouterWrapper>
      );

      expect(screen.getByRole("article")).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument();
      expect(screen.getByRole("img")).toBeInTheDocument();
      expect(screen.getByRole("link")).toBeInTheDocument();
    });
  });
});
```

**Estimated tests**: ~25-35 tests

---

## Integration test scenarios

### Routing integration tests

**File**: `/apps/main/src/__tests__/blog-routing.integration.test.tsx`

```typescript
import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

describe("Blog Routing Integration", () => {
  describe("Blog List Navigation", () => {
    it("should navigate to blog page from header", async () => {
      const user = userEvent.setup();
      render(<App />);

      const blogLink = screen.getByRole("link", { name: /blog/i });
      await user.click(blogLink);

      await waitFor(() => {
        expect(screen.getByRole("heading", { name: /blog/i })).toBeInTheDocument();
      });
    });

    it("should show active state for blog link", async () => {
      const user = userEvent.setup();
      render(<App />);

      const blogLink = screen.getByRole("link", { name: /blog/i });
      await user.click(blogLink);

      await waitFor(() => {
        expect(blogLink).toHaveStyle({ textDecoration: "underline" });
      });
    });
  });

  describe("Blog Post Detail Navigation", () => {
    it("should navigate to blog post detail from card", async () => {
      const user = userEvent.setup();
      render(<App />);

      // Navigate to blog
      await user.click(screen.getByRole("link", { name: /blog/i }));

      // Click first blog post
      await waitFor(() => {
        const firstPost = screen.getAllByRole("article")[0];
        return user.click(firstPost);
      });

      await waitFor(() => {
        expect(screen.getByTestId("blog-post-detail")).toBeInTheDocument();
      });
    });

    it("should handle direct URL navigation to blog post", () => {
      window.history.pushState({}, "", "/blog/understanding-reiki-energy-healing");
      render(<App />);

      expect(screen.getByRole("heading", { name: /Understanding Reiki/i })).toBeInTheDocument();
    });

    it("should show 404 for non-existent blog post", () => {
      window.history.pushState({}, "", "/blog/non-existent-post");
      render(<App />);

      expect(screen.getByText(/post not found/i)).toBeInTheDocument();
    });
  });

  describe("Browser Navigation", () => {
    it("should handle back button from blog post to list", async () => {
      const user = userEvent.setup();
      render(<App />);

      // Navigate to blog
      await user.click(screen.getByRole("link", { name: /blog/i }));

      // Navigate to post
      await waitFor(async () => {
        const firstPost = screen.getAllByRole("article")[0];
        await user.click(firstPost);
      });

      // Go back
      window.history.back();

      await waitFor(() => {
        expect(screen.getAllByRole("article").length).toBeGreaterThan(0);
      });
    });
  });

  describe("Page Transitions", () => {
    it("should apply smooth transition when navigating to blog", async () => {
      const user = userEvent.setup();
      render(<App />);

      const blogLink = screen.getByRole("link", { name: /blog/i });
      await user.click(blogLink);

      // PageTransition wrapper should be present (mocked in tests)
      await waitFor(() => {
        expect(screen.getByTestId("page-blog")).toBeInTheDocument();
      });
    });
  });
});
```

**Estimated tests**: ~15-20 tests

### Data fetching integration tests

**File**: `/apps/main/src/__tests__/blog-data.integration.test.tsx`

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { RouterWrapper } from "@reiki-goddess/shared-components/test-utils";
import Blog from "../pages/Blog";
import * as blogApi from "../api/blog";

vi.mock("../api/blog");

describe("Blog Data Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Data Fetching", () => {
    it("should fetch blog posts on mount", async () => {
      const mockPosts = [
        { id: "1", title: "Post 1", /* ... */ },
        { id: "2", title: "Post 2", /* ... */ }
      ];

      vi.mocked(blogApi.fetchBlogPosts).mockResolvedValue(mockPosts);

      render(
        <RouterWrapper>
          <Blog />
        </RouterWrapper>
      );

      expect(blogApi.fetchBlogPosts).toHaveBeenCalledTimes(1);

      await waitFor(() => {
        expect(screen.getByText("Post 1")).toBeInTheDocument();
        expect(screen.getByText("Post 2")).toBeInTheDocument();
      });
    });

    it("should handle pagination", async () => {
      const page1 = [{ id: "1", title: "Post 1" }];
      const page2 = [{ id: "2", title: "Post 2" }];

      vi.mocked(blogApi.fetchBlogPosts)
        .mockResolvedValueOnce(page1)
        .mockResolvedValueOnce(page2);

      render(
        <RouterWrapper>
          <Blog />
        </RouterWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText("Post 1")).toBeInTheDocument();
      });

      const nextButton = screen.getByRole("button", { name: /next/i });
      await userEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText("Post 2")).toBeInTheDocument();
      });
    });
  });

  describe("Error Recovery", () => {
    it("should retry failed requests", async () => {
      vi.mocked(blogApi.fetchBlogPosts)
        .mockRejectedValueOnce(new Error("Network error"))
        .mockResolvedValueOnce([{ id: "1", title: "Post 1" }]);

      render(
        <RouterWrapper>
          <Blog />
        </RouterWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/error loading/i)).toBeInTheDocument();
      });

      const retryButton = screen.getByRole("button", { name: /retry/i });
      await userEvent.click(retryButton);

      await waitFor(() => {
        expect(screen.getByText("Post 1")).toBeInTheDocument();
      });
    });
  });
});
```

**Estimated tests**: ~10-15 tests

---

## E2E test cases

### E2E test suite

**File**: `/e2e/blog-page.spec.ts`

```typescript
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Blog Page E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/blog");
  });

  test.describe("Page Load & Performance", () => {
    test("should load blog page within acceptable time", async ({ page }) => {
      const startTime = Date.now();
      await page.waitForLoadState("networkidle");
      const loadTime = Date.now() - startTime;

      expect(loadTime).toBeLessThan(3000); // 3 seconds
    });

    test("should display blog posts grid", async ({ page }) => {
      await page.waitForSelector('[role="article"]');

      const posts = await page.locator('[role="article"]').count();
      expect(posts).toBeGreaterThan(0);
    });
  });

  test.describe("Accessibility", () => {
    test("should have no accessibility violations", async ({ page }) => {
      await page.waitForLoadState("networkidle");

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test("should have proper heading hierarchy", async ({ page }) => {
      const h1Count = await page.locator("h1").count();
      expect(h1Count).toBe(1);

      const h1Text = await page.locator("h1").textContent();
      expect(h1Text).toMatch(/blog/i);
    });

    test("should have alt text for all images", async ({ page }) => {
      const images = await page.locator("img").all();

      for (const img of images) {
        const alt = await img.getAttribute("alt");
        expect(alt).toBeTruthy();
        expect(alt!.trim().length).toBeGreaterThan(0);
      }
    });
  });

  test.describe("Navigation", () => {
    test("should navigate to blog post detail on card click", async ({
      page,
    }) => {
      const firstPost = page.locator('[role="article"]').first();
      const postTitle = await firstPost.locator("h3").textContent();

      await firstPost.click();

      await expect(page).toHaveURL(/\/blog\/.+/);
      await expect(page.locator("h1")).toContainText(postTitle!);
    });

    test("should navigate back to blog list", async ({ page }) => {
      await page.locator('[role="article"]').first().click();
      await page.waitForURL(/\/blog\/.+/);

      await page.goBack();
      await expect(page).toHaveURL("/blog");
      await expect(page.locator('[role="article"]')).toBeVisible();
    });
  });

  test.describe("Responsive Design", () => {
    test("should display single column on mobile", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      const grid = page.locator(".grid");
      await expect(grid).toHaveClass(/grid-cols-1/);
    });

    test("should display two columns on tablet", async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });

      const grid = page.locator(".grid");
      await expect(grid).toHaveClass(/md:grid-cols-2/);
    });

    test("should display three columns on desktop", async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });

      const grid = page.locator(".grid");
      await expect(grid).toHaveClass(/lg:grid-cols-3/);
    });
  });

  test.describe("Keyboard Navigation", () => {
    test("should navigate blog posts with keyboard", async ({ page }) => {
      await page.keyboard.press("Tab"); // Focus first post
      await page.keyboard.press("Enter"); // Open post

      await expect(page).toHaveURL(/\/blog\/.+/);
    });
  });

  test.describe("Search & Filter (if implemented)", () => {
    test("should filter posts by search query", async ({ page }) => {
      await page.fill('[data-testid="search-input"]', "reiki");

      const posts = await page.locator('[role="article"]').all();
      for (const post of posts) {
        const text = await post.textContent();
        expect(text?.toLowerCase()).toContain("reiki");
      }
    });
  });
});
```

**Estimated tests**: ~20-25 E2E tests

### Blog post detail E2E tests

**File**: `/e2e/blog-post-detail.spec.ts`

```typescript
import { test, expect } from "@playwright/test";

test.describe("Blog Post Detail E2E", () => {
  test("should display full blog post content", async ({ page }) => {
    await page.goto("/blog/understanding-reiki-energy-healing");

    await expect(page.locator("h1")).toContainText("Understanding Reiki");
    await expect(page.locator('[data-testid="post-content"]')).toBeVisible();
    await expect(page.locator('[data-testid="author-info"]')).toContainText(
      "Deirdre Quigley"
    );
  });

  test("should show related posts", async ({ page }) => {
    await page.goto("/blog/understanding-reiki-energy-healing");

    const relatedPosts = page.locator(
      '[data-testid="related-posts"] [role="article"]'
    );
    expect(await relatedPosts.count()).toBeGreaterThan(0);
  });

  test("should handle 404 for non-existent post", async ({ page }) => {
    await page.goto("/blog/non-existent-post-slug");

    await expect(page.locator("text=/post not found/i")).toBeVisible();
    await expect(page.locator('a[href="/blog"]')).toBeVisible(); // Back to blog link
  });
});
```

**Estimated tests**: ~8-10 E2E tests

---

## Test utilities needed

### 1. Blog data mocks

**File**: `/apps/main/src/__tests__/mocks/blogData.ts`

```typescript
export const mockBlogPost = {
  id: "1",
  title: "Understanding Reiki Energy Healing",
  slug: "understanding-reiki-energy-healing",
  excerpt:
    "Discover the fundamentals of Reiki and how energy healing can transform your life through balanced chakras and restored harmony.",
  content: "Full blog post content here...",
  author: "Deirdre Quigley",
  date: "2025-10-01",
  image: "/img/blog-reiki-basics.jpg",
  tags: ["reiki", "energy-healing", "wellness"],
  readTime: "5 min read",
};

export const mockBlogPosts = [
  mockBlogPost,
  {
    id: "2",
    title: "Sound Healing: Vibrational Medicine",
    slug: "sound-healing-vibrational-medicine",
    // ...
  },
  {
    id: "3",
    title: "Chakra Balancing Techniques",
    slug: "chakra-balancing-techniques",
    // ...
  },
];

export const mockEmptyBlogResponse = [];

export const mockBlogError = new Error("Failed to fetch blog posts");
```

### 2. API mock utilities

**File**: `/apps/main/src/__tests__/mocks/blogApi.ts`

```typescript
import { vi } from "vitest";
import { mockBlogPosts, mockBlogPost } from "./blogData";

export const mockFetchBlogPosts = vi.fn().mockResolvedValue(mockBlogPosts);

export const mockFetchBlogPost = vi.fn((slug: string) => {
  const post = mockBlogPosts.find((p) => p.slug === slug);
  return Promise.resolve(post || null);
});

export const setupBlogApiMocks = () => {
  vi.mock("@/api/blog", () => ({
    fetchBlogPosts: mockFetchBlogPosts,
    fetchBlogPost: mockFetchBlogPost,
  }));
};
```

### 3. Test helpers

**File**: `/apps/main/src/__tests__/helpers/blogHelpers.ts`

```typescript
import { render, screen, waitFor } from "@testing-library/react";
import { RouterWrapper } from "@reiki-goddess/shared-components/test-utils";
import userEvent from "@testing-library/user-event";

export const renderBlogPage = (ui: React.ReactElement) => {
  return render(
    <RouterWrapper initialEntries={["/blog"]}>
      {ui}
    </RouterWrapper>
  );
};

export const renderBlogPost = (slug: string, ui: React.ReactElement) => {
  return render(
    <RouterWrapper initialEntries={[`/blog/${slug}`]}>
      {ui}
    </RouterWrapper>
  );
};

export const navigateToBlogPost = async (postTitle: string) => {
  const user = userEvent.setup();
  const post = screen.getByRole("heading", { name: new RegExp(postTitle, "i") });
  const card = post.closest('[role="article"]');
  await user.click(card!);

  await waitFor(() => {
    expect(window.location.pathname).toMatch(/\/blog\/.+/);
  });
};
```

### 4. Custom matchers

**File**: `/apps/main/src/__tests__/matchers/blogMatchers.ts`

```typescript
import { expect } from "vitest";

expect.extend({
  toHaveBlogPostStructure(received) {
    const requiredProps = ["id", "title", "slug", "excerpt", "author", "date"];
    const missingProps = requiredProps.filter((prop) => !(prop in received));

    if (missingProps.length > 0) {
      return {
        pass: false,
        message: () =>
          `Expected blog post to have properties: ${missingProps.join(", ")}`,
      };
    }

    return {
      pass: true,
      message: () => "Blog post has all required properties",
    };
  },
});
```

---

## Quality recommendations

### 1. Test organization

**Follow established patterns**:

- Co-locate component tests with components
- Keep integration tests in `/apps/main/src/__tests__/`
- Maintain E2E tests in `/e2e/`
- Use descriptive test file naming: `BlogPostCard.test.tsx`

**Test suite structure**:

```
Blog Test Organization:
├── packages/shared-components/src/
│   ├── BlogPostCard/
│   │   ├── BlogPostCard.tsx
│   │   ├── BlogPostCard.test.tsx         (~30 tests)
│   │   └── index.ts
│   ├── BlogPostDetail/
│   │   ├── BlogPostDetail.tsx
│   │   ├── BlogPostDetail.test.tsx       (~25 tests)
│   │   └── index.ts
│   └── BlogPostGrid/
│       ├── BlogPostGrid.tsx
│       ├── BlogPostGrid.test.tsx         (~20 tests)
│       └── index.ts
│
├── apps/main/src/
│   ├── pages/
│   │   ├── Blog.tsx
│   │   └── Blog.test.tsx                 (~35 tests)
│   └── __tests__/
│       ├── blog-routing.integration.test.tsx  (~18 tests)
│       └── blog-data.integration.test.tsx     (~12 tests)
│
└── e2e/
    ├── blog-page.spec.ts                 (~22 tests)
    └── blog-post-detail.spec.ts          (~10 tests)

Total Estimated: ~172 tests
```

### 2. Coverage metrics

**Minimum thresholds**:

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      lines: 90,
      functions: 90,
      branches: 85,
      statements: 90,
      // Blog-specific overrides
      thresholds: {
        "src/pages/Blog.tsx": {
          lines: 95,
          functions: 95,
          branches: 90,
        },
        "src/components/BlogPostCard.tsx": {
          lines: 95,
          functions: 95,
        },
      },
    },
  },
});
```

**Coverage goals**:

- Blog page component: 95%+ coverage
- Blog post card: 95%+ coverage
- Blog routing: 90%+ coverage
- Blog API integration: 90%+ coverage

### 3. Test quality checklist

Before marking tests complete, verify:

- [ ] All happy paths tested
- [ ] Error handling scenarios covered
- [ ] Loading states validated
- [ ] Empty states verified
- [ ] Accessibility tests passing (axe-core)
- [ ] Responsive design tested (mobile, tablet, desktop)
- [ ] Keyboard navigation working
- [ ] ARIA labels present and correct
- [ ] Image fallbacks tested
- [ ] Browser back/forward tested
- [ ] Direct URL navigation tested
- [ ] 404 handling verified

### 4. Continuous testing

**Test execution strategy**:

```bash
# During development
npm test -- --watch                    # Unit tests in watch mode

# Pre-commit
npm test -- --run                      # All unit tests
npm run type-check                     # TypeScript validation

# Pre-push
npm test -- --run --coverage           # Full coverage report
npm run test:e2e -- --project=chromium # E2E smoke tests

# CI/CD pipeline
npm test -- --run --coverage --reporter=json
npm run test:e2e                       # Full E2E suite
npm run test:a11y                      # Accessibility audit
```

### 5. Test maintenance

**Documentation requirements**:

- Document test failures in `/docs/testing/components/` (follow existing pattern)
- Never modify tests to make them pass - fix the code
- Update test snapshots only when design changes are intentional
- Keep test data mocks synchronized with API contracts

**Review checklist**:

- Tests are deterministic (no flaky tests)
- Tests are isolated (no shared state)
- Tests are fast (<1s per unit test, <5s per E2E)
- Tests have clear assertions
- Test names describe behavior, not implementation

---

## Performance considerations

### 1. Test execution performance

**Current performance baseline**:

- Shared-components: 430 tests in ~12 seconds
- Shared-utils: 79 tests in ~2 seconds
- Apps/main: 43 tests in ~8 seconds
- E2E suite: ~5 minutes total

**Blog test targets**:

- Unit tests: <3 seconds for ~100 tests
- Integration tests: <5 seconds for ~30 tests
- E2E tests: <2 minutes for ~30 tests

**Optimization strategies**:

1. **Mock heavy dependencies**:

   ```typescript
   // Mock framer-motion animations
   vi.mock("framer-motion", () => ({
     motion: { div: "div" },
     AnimatePresence: ({ children }) => children
   }));

   // Mock image loading
   vi.mock("next/image", () => ({
     default: ({ src, alt }) => <img src={src} alt={alt} />
   }));
   ```

2. **Parallelize test execution**:

   ```typescript
   // vitest.config.ts
   export default defineConfig({
     test: {
       pool: "forks",
       poolOptions: {
         forks: {
           singleFork: false,
           maxForks: 4,
         },
       },
     },
   });
   ```

3. **Lazy load test data**:

   ```typescript
   // Only load large mock data when needed
   const loadBlogFixtures = () => import("./fixtures/blogPosts.json");

   test("should render many posts", async () => {
     const posts = await loadBlogFixtures();
     // ... test
   });
   ```

### 2. E2E performance optimization

**Playwright configuration**:

```typescript
// playwright.config.ts
export default defineConfig({
  workers: process.env.CI ? 1 : 4,
  retries: process.env.CI ? 2 : 0,
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  use: {
    actionTimeout: 10000,
    navigationTimeout: 10000,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
});
```

**Test isolation**:

- Use test fixtures for common setup
- Implement parallel execution for independent tests
- Group dependent tests in same file
- Use beforeEach for test data reset

### 3. Mock API performance

**Efficient mocking**:

```typescript
// Fast in-memory cache for repeated tests
const mockCache = new Map();

export const mockFetchBlogPosts = vi.fn(async (page = 1) => {
  const cacheKey = `posts-${page}`;

  if (mockCache.has(cacheKey)) {
    return mockCache.get(cacheKey);
  }

  const posts = generateMockPosts(page);
  mockCache.set(cacheKey, posts);
  return posts;
});

// Clear cache between test files
afterAll(() => {
  mockCache.clear();
});
```

### 4. Test data generation

**Efficient test data creation**:

```typescript
// Use factory pattern for test data
export const createMockBlogPost = (overrides = {}) => ({
  id: faker.string.uuid(),
  title: faker.lorem.sentence(),
  slug: faker.helpers.slugify(faker.lorem.sentence()),
  excerpt: faker.lorem.paragraph(),
  author: "Deirdre Quigley",
  date: faker.date.recent().toISOString(),
  image: faker.image.url(),
  ...overrides,
});

// Batch creation for grid tests
export const createMockBlogPosts = (count = 10) => {
  return Array.from({ length: count }, (_, i) =>
    createMockBlogPost({ id: `${i + 1}` })
  );
};
```

---

## Summary

### Test coverage roadmap

**Phase 1: Foundation (Week 1)**

- [ ] Create Blog page component tests (35 tests)
- [ ] Implement RouterWrapper integration
- [ ] Set up test data mocks
- [ ] Establish CI/CD pipeline for blog tests

**Phase 2: Components (Week 2)**

- [ ] BlogPostCard component tests (30 tests)
- [ ] BlogPostGrid component tests (20 tests)
- [ ] BlogPostDetail component tests (25 tests)
- [ ] Accessibility validation

**Phase 3: Integration (Week 3)**

- [ ] Routing integration tests (18 tests)
- [ ] Data fetching integration tests (12 tests)
- [ ] Legacy migration validation
- [ ] Cross-browser testing

**Phase 4: E2E & Polish (Week 4)**

- [ ] Blog page E2E tests (22 tests)
- [ ] Blog post detail E2E tests (10 tests)
- [ ] Performance testing
- [ ] Documentation updates

### Success metrics

**Quantitative**:

- Unit test coverage: 90%+ ✅
- Integration test coverage: 85%+ ✅
- E2E critical paths: 100% ✅
- Accessibility compliance: WCAG 2.1 AA ✅
- Test execution time: <10 minutes total ✅

**Qualitative**:

- Tests follow established patterns ✅
- Clear, descriptive test names ✅
- Comprehensive error handling ✅
- Maintainable test structure ✅
- Documentation-first approach ✅

### Key takeaways

1. **Leverage existing patterns**: The project has excellent testing infrastructure - reuse RouterWrapper, test-setup mocks, and accessibility patterns

2. **Security is critical**: Apply contact form security testing patterns to blog input fields (search, comments if added)

3. **Accessibility first**: Blog content must be fully accessible - follow existing a11y test patterns

4. **Test-as-you-migrate**: Don't wait until the end - write tests alongside component development

5. **Documentation over modification**: If tests fail, document the failure and fix the code, never change the test to pass

---

**Related documents**:

- [Testing Documentation System](/docs/testing/README.md)
- [Testing Summary](/docs/testing/TESTING_SUMMARY.md)
- [Architecture Patterns](/docs/project/ARCHITECTURE.md)
- [Blog Page Migration Progress](/docs/progress/006-blog-page-migration.md)

**Last updated**: 2025-10-06
