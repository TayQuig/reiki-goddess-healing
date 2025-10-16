# Component Analysis: About Page Migration

**Date**: 2025-10-06
**Status**: Analysis Complete
**Purpose**: Comprehensive analysis of existing components and patterns for About Page migration

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Existing About Page Implementations](#existing-about-page-implementations)
3. [Reusable Component Analysis](#reusable-component-analysis)
4. [Component Architecture Patterns](#component-architecture-patterns)
5. [Design System Integration](#design-system-integration)
6. [Migration Recommendations](#migration-recommendations)
7. [Component Creation Plan](#component-creation-plan)
8. [TypeScript Interface Patterns](#typescript-interface-patterns)

---

## Executive Summary

### Key Findings

- **3 About Page implementations** exist across the codebase (legacy, shared-components, apps/main)
- **25+ reusable components** identified in shared-components package
- **Strong patterns** for layout, animation, and responsive design established
- **MeetTheGoddess component** is highly reusable for About Page
- **Figma design assets** available at `/figma-screenshots/about/`
- **Modern TypeScript patterns** well-established throughout codebase

### Component Maturity

| Component Category                 | Maturity       | Reusability |
| ---------------------------------- | -------------- | ----------- |
| Layout (AppLayout, PageTransition) | ✅ Production  | High        |
| Header/Footer                      | ✅ Production  | High        |
| MeetTheGoddess                     | ✅ Production  | High        |
| Testimonials                       | ✅ Production  | High        |
| Animations (AnimatedSection)       | ✅ Production  | High        |
| Image Components (LazyImage)       | ✅ Production  | High        |
| About-specific components          | ⚠️ Placeholder | Low         |

---

## Existing About Page Implementations

### 1. Current Production Stub (apps/main)

**Location**: `/apps/main/src/pages/About.tsx`

```typescript
// Lines 1-18
function About() {
  return (
    <PageTransition>
      <div data-testid="page-about" className="min-h-screen bg-[#FFFBF5]">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <h1 className="text-4xl font-bold text-[#0205B7] mb-4">
            About The Reiki Goddess
          </h1>
          <p className="text-gray-700">About page</p>
        </div>
      </div>
    </PageTransition>
  );
}
```

**Analysis**:

- ✅ Uses PageTransition wrapper (correct pattern)
- ✅ Correct background color (#FFFBF5)
- ✅ Correct brand color (#0205B7)
- ⚠️ Minimal placeholder content
- ⚠️ Uses Tailwind classes instead of inline styles (inconsistent with Figma components)

**Reusability**: LOW - Placeholder only

---

### 2. Shared Components Placeholder

**Location**: `/packages/shared-components/src/pages/AboutPage.tsx`

```typescript
// Lines 8-36
export const AboutPage: React.FC = () => {
  return (
    <ResponsiveContainer className="py-20">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          About The Reiki Goddess
        </h1>
        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-gray-600 mb-6">
            Welcome to The Reiki Goddess Healing. Our founder, Deirdre, brings
            years of experience...
          </p>
          {/* Migration notice */}
        </div>
      </div>
    </ResponsiveContainer>
  );
};
```

**Analysis**:

- ✅ Uses ResponsiveContainer component
- ✅ Has actual content structure
- ⚠️ Uses ResponsiveContainer instead of fixed 1440px width (inconsistent with homepage)
- ⚠️ Placeholder notice present
- ⚠️ No integration with existing design patterns

**Reusability**: MEDIUM - Has structure but needs refactoring

---

### 3. Legacy Anima Export

**Location**: `/legacy/About/src/screens/About/About.tsx`

```typescript
// Lines 3-502 (499 lines)
export const About = (): JSX.Element => {
  // Complete Figma export with inline styles
  // 6682px tall page with multiple sections

  return (
    <div className="bg-[#fefbf5]" style={{ width: "1440px", height: "6682px" }}>
      {/* Hero Section - Lines 61-109 */}
      {/* About Section - Lines 131-177 */}
      {/* Journey Section - Lines 179-221 */}
      {/* Contact CTA Section - Lines 239-281 */}
      {/* Image Gallery - Lines 283-331 */}
      {/* Testimonials - Lines 333-395 */}
      {/* Final CTA - Lines 397-425 */}
      {/* Footer - Lines 427-497 */}
    </div>
  );
};
```

**Analysis**:

- ✅ Complete Figma design implementation
- ✅ Comprehensive section breakdown
- ✅ All visual specifications preserved
- ⚠️ Fixed height (6682px) - not responsive
- ⚠️ Absolute positioning throughout
- ⚠️ Includes header/footer (should use AppLayout)
- ⚠️ No component decomposition

**Key Sections Identified**:

1. **Hero Section** (lines 61-109): Experienced Reiki Master heading with dual-column text
2. **About Section** (lines 131-177): Deirdre introduction with portrait image
3. **Journey Section** (lines 179-221): Personal journey with credential cards
4. **Contact CTA** (lines 239-281): Background image CTA section
5. **Image Gallery** (lines 283-331): 5-image masonry layout
6. **Testimonials** (lines 333-395): Carousel with navigation
7. **Final CTA** (lines 397-425): Blue gradient booking CTA

**Reusability**: HIGH - Source of truth for design specifications

---

## Reusable Component Analysis

### Core Layout Components

#### 1. AppLayout

**Location**: `/packages/shared-components/src/AppLayout/AppLayout.tsx`

```typescript
export interface AppLayoutProps {
  className?: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ className = "" }) => {
  const location = useLocation();

  const navigationItems: NavigationItem[] = [
    { label: "Home", href: "/", isActive: location.pathname === "/" },
    { label: "About", href: "/about", isActive: location.pathname === "/about" },
    // ... other nav items
  ];

  return (
    <div className={`min-h-screen flex flex-col ${className}`}
         style={{ backgroundColor: "#FFFBF5" }}>
      {/* Header - z-50, absolute positioning */}
      <div className="relative z-50" style={{ maxWidth: "1440px", margin: "0 auto" }}>
        <Header logo={{...}} navigationItems={navigationItems} />
      </div>

      {/* Main content - negative margin for header overlay */}
      <main className="flex-1" style={{ marginTop: "-93px" }}>
        <Outlet />
      </main>

      {/* Footer */}
      <div className="relative mx-auto"
           style={{ maxWidth: "1440px", backgroundColor: "#FFFBF5" }}>
        <Footer />
      </div>
    </div>
  );
};
```

**Pattern Analysis**:

- ✅ Header overlay pattern with negative margin compensation
- ✅ React Router integration (useLocation, Outlet)
- ✅ Active navigation state management
- ✅ Fixed 1440px max-width containers
- ✅ Consistent background color (#FFFBF5)

**Reusability for About Page**: **ESSENTIAL** - Must use this layout wrapper

---

#### 2. PageTransition

**Location**: `/apps/main/src/components/PageTransition.tsx`

```typescript
interface PageTransitionProps {
  children: ReactNode;
}

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

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  return (
    <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants}>
      {children}
    </motion.div>
  );
};
```

**Pattern Analysis**:

- ✅ Framer Motion integration
- ✅ Consistent animation timing (600ms in, 400ms out)
- ✅ Vertical motion (y: 20px / -20px)
- ✅ Simple, reusable API

**Reusability for About Page**: **ESSENTIAL** - Wrap page content

---

#### 3. ResponsiveContainer

**Location**: `/packages/shared-components/src/ResponsiveContainer/ResponsiveContainer.tsx`

```typescript
export interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  variant?: "full" | "page" | "content";
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className = "",
  variant = "page",
}) => {
  const variants = {
    full: "w-full px-4 md:px-8 lg:px-16",
    page: "max-w-7xl mx-auto px-4 md:px-8 lg:px-16",  // ~1280px
    content: "max-w-4xl mx-auto px-4 md:px-8",        // ~896px
  };

  return <div className={`${variants[variant]} ${className}`}>{children}</div>;
};
```

**Pattern Analysis**:

- ✅ Three responsive variants
- ✅ Tailwind-based responsive padding
- ⚠️ "page" variant uses max-w-7xl (1280px), not 1440px
- ⚠️ Inconsistent with homepage's fixed 1440px approach

**Reusability for About Page**: **CONDITIONAL** - Use for text-heavy sections, NOT for sections matching homepage

---

### Content Components

#### 4. MeetTheGoddess (PRIMARY REUSE TARGET)

**Location**: `/packages/shared-components/src/MeetTheGoddess/MeetTheGoddess.tsx`

```typescript
export interface MeetTheGoddessProps {
  heading?: string;
  content?: React.ReactNode;
  images?: {
    main?: { src: string; alt: string };
    secondary?: { src: string; alt: string };
    tertiary?: { src: string; alt: string };
  };
  ctaButton?: {
    text: string;
    href: string;
    onClick?: () => void;
  };
  className?: string;
}

export const MeetTheGoddess: React.FC<MeetTheGoddessProps> = ({
  heading = "Meet Deirdre, The Reiki Goddess",
  content = <>{/* Default bio text */}</>,
  images = { /* 3 default images */ },
  ctaButton = { text: "Read Full Story", href: "/about" },
  className = "",
}) => {
  return (
    <section className={`relative py-20 overflow-hidden ${className}`}
             style={{ minHeight: "650px", backgroundColor: "#FFFBF5" }}>

      {/* Smoke layer effect - Lines 71-140 */}
      <div className="absolute" style={{ /* 810x810px smoke effect */ }}>
        {/* Triple-layered smoke with blend modes */}
      </div>

      {/* Content wrapper - 1440px max-width */}
      <div className="relative z-10" style={{ maxWidth: "1440px", margin: "0 auto" }}>

        {/* IMG_4891 with blue bevel - Lines 147-184 */}
        <div className="absolute z-20"
             style={{ left: "688px", top: "50px", width: "455.9px", height: "310.61566px",
                      transform: "rotate(-4.85deg)" }}>
          <div className="absolute inset-0"
               style={{ backgroundColor: "#0205B7", borderRadius: "27px",
                       transform: "translate(-5px, 5px)" }} />
          <img src={images.tertiary.src} alt={images.tertiary.alt}
               style={{ borderRadius: "27px", boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }} />
        </div>

        {/* "The Reiki Goddess" rotated text - Lines 188-214 */}
        <div className="absolute z-20"
             style={{ left: "752px", top: "370px", transform: "rotate(-5.24deg)" }}>
          <span style={{ fontFamily: "Figtree", fontSize: "22px", fontWeight: 500,
                        color: "#0205B7", letterSpacing: "10%" }}>
            The Reiki Goddess
          </span>
        </div>

        {/* IMG_3859 with blue bevel - Lines 216-254 */}
        <div className="absolute z-30"
             style={{ left: "1010.153px", top: "calc(50px + 310.61566px - 100px)",
                      width: "283.49694050307664px", height: "207.90078167808508px",
                      transform: "rotate(8.13deg)" }}>
          <div className="absolute inset-0"
               style={{ backgroundColor: "#0205B7", borderRadius: "24px",
                       transform: "translate(5px, 5px)" }} />
          <img src={images.secondary.src} alt={images.secondary.alt}
               style={{ borderRadius: "24px", boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }} />
        </div>

        {/* Text content - Lines 257-319 */}
        <div className="relative" style={{ padding: "0 66px" }}>
          <div style={{ maxWidth: "600px" }}>
            <h2 style={{ fontFamily: "Figtree", fontSize: "48px", fontWeight: 700,
                        lineHeight: "56px", color: "rgba(51, 51, 51, 1)" }}>
              {heading}
            </h2>

            <div style={{ fontFamily: "Figtree", fontSize: "18px", fontWeight: 400,
                         lineHeight: "28px", color: "rgba(94, 94, 94, 1)" }}>
              {content}
            </div>

            {ctaButton && (
              <a href={ctaButton.href} onClick={ctaButton.onClick}
                 style={{ /* Outlined button styles */ }}>
                {ctaButton.text}
                <svg>{/* Arrow icon */}</svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
```

**Pattern Analysis**:

- ✅ Highly configurable through props
- ✅ Complex layering: smoke effect (z-2), images (z-20, z-30), text (z-10)
- ✅ Precise positioning from Figma specifications
- ✅ Blue bevel effect pattern (translates div behind image)
- ✅ Rotated elements with transform
- ✅ Triple-layered smoke effect with blend modes
- ✅ Fixed 1440px container width
- ✅ Inline styles matching Figma exactly

**Image Positioning Pattern**:

```typescript
// Bevel effect pattern
<div style={{ position: "absolute", /* positioning */ }}>
  {/* Background bevel - offset by 5px */}
  <div style={{
    backgroundColor: "#0205B7",
    transform: "translate(-5px, 5px)" // or "translate(5px, 5px)"
  }} />

  {/* Foreground image */}
  <img src={...} style={{ position: "relative", zIndex: 1 }} />
</div>
```

**Reusability for About Page**: **CRITICAL** - Already implements "Meet The Goddess" section

---

#### 5. Testimonials

**Location**: `/packages/shared-components/src/Testimonials/Testimonials.tsx`

```typescript
export interface Testimonial {
  id: string;
  name: string;
  location: string;
  content: string;
  rating: number;
  image?: { src: string; alt: string };
}

export interface TestimonialsProps {
  heading?: string;
  testimonials?: Testimonial[];
  className?: string;
}

export const Testimonials: React.FC<TestimonialsProps> = ({
  heading = "Real Healing. Real People. Real Stories.",
  testimonials = [
    /* 4 default testimonials */
  ],
  className = "",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + 1 >= testimonials.length ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - 1 < 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  // Render carousel with navigation
};
```

**Pattern Analysis**:

- ✅ State management for carousel (useState)
- ✅ Circular navigation (wraps around)
- ✅ Default testimonials included
- ✅ 5-star rating system
- ✅ Image support for testimonial author

**Reusability for About Page**: **HIGH** - Direct reuse for testimonials section

---

### Animation & Performance Components

#### 6. AnimatedSection

**Location**: `/packages/shared-components/src/AnimatedSection/AnimatedSection.tsx`

```typescript
export interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animation?: "fadeInUp" | "fadeIn" | "slideInLeft" | "slideInRight" | "scaleIn";
  delay?: number;
  threshold?: number;
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = "",
  animation = "fadeInUp",
  delay = 0,
  threshold = 0.1,
}) => {
  const { ref, isVisible } = useIntersectionObserver({ threshold });

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`${className} ${isVisible ? `animate-${animation}` : "opacity-0"}`}
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

**Pattern Analysis**:

- ✅ Intersection Observer for performance
- ✅ 5 animation presets available
- ✅ Configurable delay and threshold
- ✅ Uses Tailwind animations (defined in tailwind.config.js)
- ✅ Opacity-0 initial state for smooth reveal

**Tailwind Animation Definitions** (`/apps/main/tailwind.config.js`):

```javascript
keyframes: {
  fadeInUp: {
    "0%": { opacity: "0", transform: "translateY(20px)" },
    "100%": { opacity: "1", transform: "translateY(0)" },
  },
  // ... 4 other animations
},
animation: {
  fadeInUp: "fadeInUp 0.6s ease-out",
  // ... others
}
```

**Reusability for About Page**: **HIGH** - Use for section reveals

---

#### 7. LazyImage

**Location**: `/packages/shared-components/src/LazyImage/LazyImage.tsx`

```typescript
export interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  placeholderColor?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = "",
  style = {},
  placeholderColor = "#E5E5E5",
  onLoad,
  onError,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | undefined>();
  const { ref, isVisible } = useIntersectionObserver({
    threshold: 0.01,
    rootMargin: "100px", // Start loading 100px before viewport
  });

  useEffect(() => {
    if (isVisible && !imageSrc) {
      setImageSrc(src);
    }
  }, [isVisible, src, imageSrc]);

  // Render with loading/error states
};
```

**Pattern Analysis**:

- ✅ Intersection Observer for lazy loading
- ✅ 100px rootMargin for preloading
- ✅ Loading spinner during load
- ✅ Error state with icon
- ✅ Smooth opacity transition (500ms)
- ✅ Callbacks for load/error events

**Reusability for About Page**: **HIGH** - Use for image gallery

---

#### 8. useIntersectionObserver Hook

**Location**: `/packages/shared-components/src/hooks/useIntersectionObserver.tsx`

```typescript
interface UseIntersectionObserverProps {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export const useIntersectionObserver = ({
  threshold = 0.1,
  rootMargin = "0px",
  triggerOnce = true,
}: UseIntersectionObserverProps = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (triggerOnce && element) {
              observer.unobserve(element);
            }
          } else if (!triggerOnce) {
            setIsVisible(false);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isVisible };
};
```

**Pattern Analysis**:

- ✅ Generic intersection observer hook
- ✅ Configurable threshold and rootMargin
- ✅ Optional triggerOnce mode (default: true)
- ✅ Cleanup on unmount
- ✅ Used by AnimatedSection and LazyImage

**Reusability for About Page**: **FOUNDATIONAL** - Use for custom animations

---

### Header & Footer Components

#### 9. Header

**Location**: `/packages/shared-components/src/Header/Header.tsx`

```typescript
export interface NavigationItem {
  label: string;
  href: string;
  isActive?: boolean;
}

export interface HeaderProps {
  logo?: { src: string; alt: string };
  navigationItems?: NavigationItem[];
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  logo = { src: "/img/reiki-goddess-logo.png", alt: "The Reiki Goddess Healing" },
  navigationItems = [ /* 6 default items */ ],
  className = "",
}) => {
  return (
    <header className={`relative ${className}`}
            style={{ width: "1440px", height: "93px", backgroundColor: "#FFFBF5",
                     backdropFilter: "blur(10px)" }}>
      {/* Logo - positioned at left: 66px */}
      <Link to="/" style={{ left: "66px", top: "1px", width: "248px", height: "92px" }}>
        <img src={logo.src} alt={logo.alt} />
      </Link>

      {/* Navigation - calculated positioning */}
      <nav style={{ left: "calc(66px + 248px + 191px)", gap: "84px" }}>
        {navigationItems.map((item, index) => (
          <Link to={item.href}
                style={{
                  fontFamily: "Figtree", fontSize: "16px",
                  fontWeight: item.isActive ? 600 : 500,
                  color: "rgba(2, 5, 183, 1)",
                  textDecoration: item.isActive ? "underline" : "none"
                }}>
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
};
```

**Pattern Analysis**:

- ✅ Fixed 1440px width, 93px height
- ✅ Backdrop blur effect
- ✅ Logo aligned to 66px (matches hero image edge)
- ✅ Active state with underline
- ✅ Brand blue color (#0205B7 = rgba(2, 5, 183, 1))
- ✅ 84px gap between nav items

**Reusability for About Page**: **AUTOMATIC** - Provided by AppLayout

---

#### 10. Footer

**Location**: `/packages/shared-components/src/Footer/Footer.tsx`

```typescript
export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterProps {
  logo?: { src?: string; alt?: string };
  tagline?: string;
  quickLinks?: FooterLink[];
  legalLinks?: FooterLink[];
  socialLinks?: {
    linkedin?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  copyright?: string;
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({
  logo = { /* default logo */ },
  tagline = "Creating beautiful, functional websites\nfor small businesses.",
  quickLinks = [ /* 5 default links */ ],
  legalLinks = [ /* 3 default links */ ],
  socialLinks = { /* 4 social platforms */ },
  copyright = `© 2025 Thereikigoddess | All Rights Reserved.`,
  className = "",
}) => {
  return (
    <footer style={{ width: "1440px", backgroundColor: "white", minHeight: "400px",
                    boxShadow: "0 0 40px rgba(0, 0, 0, 0.1)" }}>
      <div style={{ padding: "60px 66px" }}>
        {/* 4-column grid layout */}
        <div style={{ gridTemplateColumns: "1.5fr 1fr 1fr 1fr", marginBottom: "60px" }}>
          {/* Brand Column */}
          {/* Quick Links Column */}
          {/* Legal Column */}
          {/* Follow Us Column with social icons */}
        </div>

        {/* Copyright */}
        <div style={{ borderTop: "1px solid rgba(229, 229, 229, 1)", paddingTop: "30px" }}>
          <p>{copyright}</p>
        </div>
      </div>
    </footer>
  );
};
```

**Pattern Analysis**:

- ✅ Fixed 1440px width
- ✅ White background (contrast with page cream)
- ✅ 4-column grid with brand emphasis (1.5fr)
- ✅ Social icons with hover states
- ✅ Consistent padding (60px vertical, 66px horizontal)
- ✅ Box shadow for depth

**Reusability for About Page**: **AUTOMATIC** - Provided by AppLayout

---

### Button Components

#### 11. Button

**Location**: `/packages/shared-components/src/Button.tsx`

```typescript
export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  className = "",
}) => {
  const baseClasses =
    "flex items-center justify-center gap-2.5 pl-[13px] pr-2.5 py-2.5 rounded-[90px] font-medium text-base tracking-[0] leading-6 transition-colors";

  const variantClasses = {
    primary: "bg-variable-collection-color-duplicate text-white hover:opacity-80",
    secondary: "bg-white text-variable-collection-color-duplicate",
    outline: "border border-solid border-variable-collection-color-duplicate text-variable-collection-color-duplicate hover:bg-variable-collection-color-duplicate hover:text-white",
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            onClick={onClick}>
      {children}
    </button>
  );
};
```

**Pattern Analysis**:

- ✅ Three variants (primary, secondary, outline)
- ✅ Rounded pill shape (90px border-radius)
- ✅ Consistent padding (13px left, 10px right, 10px vertical)
- ✅ Transition effects
- ⚠️ Uses legacy CSS variables (not inline styles)

**Reusability for About Page**: **MEDIUM** - Consider inline styles for consistency

---

## Component Architecture Patterns

### 1. Inline Styles vs Tailwind Classes

**Homepage/MeetTheGoddess Pattern** (Figma-accurate):

```typescript
<section style={{
  minHeight: "650px",
  backgroundColor: "#FFFBF5"
}}>
  <div style={{
    maxWidth: "1440px",
    margin: "0 auto"
  }}>
    <h2 style={{
      fontFamily: "Figtree, Helvetica, sans-serif",
      fontSize: "48px",
      fontWeight: 700,
      lineHeight: "56px",
      color: "rgba(51, 51, 51, 1)"
    }}>
      {heading}
    </h2>
  </div>
</section>
```

**Rationale**:

- ✅ Exact Figma specifications
- ✅ No Tailwind class interpretation
- ✅ Predictable rendering
- ✅ Easy to verify against design

**About Page Recommendation**: **USE INLINE STYLES** for Figma-sourced sections

---

### 2. Fixed Width Container Pattern

**Standard Homepage Pattern**:

```typescript
<section>
  <div style={{ maxWidth: "1440px", margin: "0 auto" }}>
    {/* Content with 66px horizontal padding */}
    <div style={{ padding: "0 66px" }}>
      {/* Inner content */}
    </div>
  </div>
</section>
```

**Breakdown**:

- Outer div: 1440px max-width, centered
- Inner div: 66px horizontal padding
- Effective content width: 1308px (1440 - 132)

**About Page Recommendation**: **USE 1440px CONTAINERS** consistently

---

### 3. Z-Index Layering Strategy

**MeetTheGoddess Layering**:

```typescript
// Layer 1 (Background): z-2
<div className="absolute z-2">  {/* Smoke effect */}</div>

// Layer 2 (Content): z-10
<div className="relative z-10">  {/* Text content */}</div>

// Layer 3 (Primary Image): z-20
<div className="absolute z-20">  {/* IMG_4891 */}</div>

// Layer 4 (Secondary Image): z-30
<div className="absolute z-30">  {/* IMG_3859 */}</div>
```

**Layering Scale**:

- Background effects: z-2 to z-9
- Content: z-10
- Images: z-20, z-30, z-40
- Header: z-50 (AppLayout)

**About Page Recommendation**: **FOLLOW Z-INDEX SCALE** for consistent stacking

---

### 4. Image Positioning with Bevel Effect

**Bevel Pattern** (used throughout MeetTheGoddess):

```typescript
<div style={{
  position: "absolute",
  left: "688px",
  top: "50px",
  width: "455.9px",
  height: "310.61566px",
  transform: "rotate(-4.85deg)",
  transformOrigin: "center"
}}>
  {/* Blue background bevel - shifted down-left OR down-right */}
  <div style={{
    position: "absolute",
    inset: 0,
    backgroundColor: "#0205B7",
    borderRadius: "27px",
    transform: "translate(-5px, 5px)", // OR "translate(5px, 5px)"
    zIndex: 0
  }} />

  {/* Foreground image */}
  <img
    src={image.src}
    alt={image.alt}
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
      position: "relative",
      borderRadius: "27px",
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
      zIndex: 1
    }}
  />
</div>
```

**Bevel Variations**:

- **Top-left image**: Bevel translates `(-5px, 5px)` - creates shadow bottom-right
- **Top-right image**: Bevel translates `(5px, 5px)` - creates shadow bottom-left

**About Page Recommendation**: **REUSE BEVEL PATTERN** for decorated images

---

### 5. Smoke/Overlay Effect Pattern

**MeetTheGoddess Smoke Effect**:

```typescript
<div className="absolute" style={{ left: "0", top: "0", width: "810px", height: "810px", zIndex: 2 }}>
  {/* Layer 1: Base smoke */}
  <img src="/img/smoke.png" alt="Smoke effect"
       style={{
         transform: "rotate(180deg)",
         opacity: 0.5,
         filter: "saturate(100%)",
         mixBlendMode: "normal"
       }} />

  {/* Layer 2: Enhanced color */}
  <img src="/img/smoke.png" alt="Smoke effect duplicate"
       style={{
         transform: "rotate(180deg)",
         opacity: 0.3,
         filter: "saturate(150%)",
         mixBlendMode: "multiply"
       }} />

  {/* Layer 3: Maximum enhancement */}
  <img src="/img/smoke.png" alt="Smoke effect triple"
       style={{
         transform: "rotate(180deg)",
         opacity: 0.2,
         filter: "saturate(200%) hue-rotate(-10deg)",
         mixBlendMode: "overlay"
       }} />
</div>
```

**Triple-Layer Technique**:

1. **Base layer**: Normal blend, 50% opacity
2. **Multiply layer**: Darkens colors, 30% opacity, 150% saturation
3. **Overlay layer**: Adds contrast, 20% opacity, 200% saturation + hue shift

**About Page Recommendation**: **REUSE FOR DECORATIVE BACKGROUNDS**

---

### 6. Rotated Text Elements

**"The Reiki Goddess" Text Pattern**:

```typescript
<div style={{
  position: "absolute",
  left: "752px",
  top: "370px",
  width: "221px",
  height: "26px",
  transform: "rotate(-5.24deg)",
  transformOrigin: "center"
}}>
  <span style={{
    fontFamily: 'Figtree, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: "22px",
    fontWeight: 500,
    fontStyle: "normal",
    lineHeight: "100%",
    letterSpacing: "10%",
    color: "#0205B7",
    whiteSpace: "nowrap"
  }}>
    The Reiki Goddess
  </span>
</div>
```

**Rotation Best Practices**:

- ✅ Use `transformOrigin: "center"` for predictable rotation
- ✅ Set explicit width/height for positioning
- ✅ Use `whiteSpace: "nowrap"` to prevent wrapping
- ✅ Apply rotation to container, not text element

**About Page Recommendation**: **USE FOR DECORATIVE TEXT** accents

---

## Design System Integration

### Color Palette

**Primary Colors** (from homepage):

```typescript
const colors = {
  brand: {
    blue: "#0205B7", // rgba(2, 5, 183, 1) - Primary brand color
    blueLowOpacity: "#0205B71A", // 10% opacity for backgrounds
  },
  text: {
    heading: "rgba(51, 51, 51, 1)", // #333333 - Dark gray
    body: "rgba(94, 94, 94, 1)", // #5E5E5E - Medium gray
    light: "rgba(28, 27, 27, 1)", // #1C1B1B - Near black
  },
  background: {
    cream: "#FFFBF5", // Primary page background
    white: "#FFFFFF", // Cards, footer
  },
  accent: {
    cyan: "rgba(99, 213, 249, 1)", // #63D5F9 - Gradient accent
    purple: "rgba(165, 147, 224, 1)", // #A593E0 - Alternative accent
  },
};
```

**Usage in About Page**:

- **Sections**: `backgroundColor: "#FFFBF5"`
- **Headings**: `color: "rgba(51, 51, 51, 1)"`
- **Body text**: `color: "rgba(94, 94, 94, 1)"`
- **Accents/CTA**: `color: "#0205B7"`
- **Bevel effects**: `backgroundColor: "#0205B7"`

---

### Typography System

**Font Stack**:

```typescript
const fontFamily =
  'Figtree, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
```

**Typography Scale** (from homepage):

```typescript
const typography = {
  h1: {
    fontFamily,
    fontSize: "63.6px",
    fontWeight: 700,
    lineHeight: "normal",
    letterSpacing: "0",
  },
  h2: {
    fontFamily,
    fontSize: "48px",
    fontWeight: 700,
    lineHeight: "56px",
    letterSpacing: "0",
  },
  h3: {
    fontFamily,
    fontSize: "22px",
    fontWeight: 500,
    lineHeight: "100%",
    letterSpacing: "10%", // Note: Should be "0.22px" or "10%" in CSS
  },
  body: {
    fontFamily,
    fontSize: "18px",
    fontWeight: 400,
    lineHeight: "28px",
    letterSpacing: "0",
  },
  bodyMedium: {
    fontFamily,
    fontSize: "16px",
    fontWeight: 500,
    lineHeight: "23px",
    letterSpacing: "0",
  },
  small: {
    fontFamily,
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: "22px",
    letterSpacing: "0",
  },
};
```

**About Page Recommendation**: **MATCH HOMEPAGE TYPOGRAPHY** exactly

---

### Spacing System

**Container Padding**:

```typescript
const spacing = {
  containerHorizontal: "66px", // Standard horizontal padding
  sectionVertical: "20px", // py-20 = 80px (5rem)
  sectionMinHeight: "650px", // Minimum section height
  maxWidth: "1440px", // Container max-width
};
```

**Vertical Rhythm**:

- Hero sections: 80-100px vertical padding
- Content sections: 80px vertical padding (py-20)
- Internal spacing: 16px, 24px, 32px, 48px increments

**About Page Recommendation**: **USE 66px HORIZONTAL, 80px VERTICAL** padding

---

### Animation System

**Available Animations** (from `tailwind.config.js`):

```typescript
const animations = {
  fadeInUp: {
    duration: "0.6s",
    easing: "ease-out",
    effect: "opacity 0→1, translateY 20px→0",
  },
  fadeIn: {
    duration: "0.6s",
    easing: "ease-out",
    effect: "opacity 0→1",
  },
  slideInLeft: {
    duration: "0.6s",
    easing: "ease-out",
    effect: "opacity 0→1, translateX -50px→0",
  },
  slideInRight: {
    duration: "0.6s",
    easing: "ease-out",
    effect: "opacity 0→1, translateX 50px→0",
  },
  scaleIn: {
    duration: "0.6s",
    easing: "ease-out",
    effect: "opacity 0→1, scale 0.9→1",
  },
};
```

**Usage with AnimatedSection**:

```typescript
<AnimatedSection animation="fadeInUp" delay={0.2} threshold={0.1}>
  {/* Content */}
</AnimatedSection>
```

**About Page Recommendation**: **USE AnimatedSection** for progressive reveals

---

## Migration Recommendations

### Phase 1: Layout Foundation

**Priority**: CRITICAL
**Effort**: LOW
**Components**: AppLayout, PageTransition

```typescript
// apps/main/src/pages/About.tsx - Updated structure
import { useEffect } from 'react';
import PageTransition from "../components/PageTransition";

function About() {
  useEffect(() => {
    // Set page title
    document.title = "About | The Reiki Goddess Healing";
  }, []);

  return (
    <PageTransition>
      <div data-testid="page-about">
        {/* About page sections will go here */}
      </div>
    </PageTransition>
  );
}

export default About;
```

**Actions**:

1. ✅ Already using PageTransition - KEEP
2. ✅ Already using AppLayout (via router) - KEEP
3. ⚠️ Remove outer container padding - AppLayout handles it
4. ⚠️ Remove background color - AppLayout handles it

---

### Phase 2: Reuse Existing Components

**Priority**: HIGH
**Effort**: LOW
**Components**: MeetTheGoddess, Testimonials, Footer

#### A. MeetTheGoddess Component

**Reuse Location**: Top of About page (after hero)

```typescript
import { MeetTheGoddess } from "@reiki-goddess/shared-components";

// In About.tsx
<MeetTheGoddess
  heading="About Deirdre, The Reiki Goddess"
  content={
    <>
      <p className="mb-4">
        With over [X] years of experience as a certified Reiki Master and Sound Healer,
        I've dedicated my life to helping others find balance, release trauma, and
        reconnect with their authentic selves.
      </p>
      <p className="mb-4">
        My journey into energy healing began with my own quest for inner peace...
        [Full bio text]
      </p>
    </>
  }
  images={{
    main: { src: "/img/about-deirdre-main.png", alt: "Deirdre in healing space" },
    secondary: { src: "/img/about-deirdre-2.png", alt: "Healing session" },
    tertiary: { src: "/img/about-deirdre-3.png", alt: "Sound healing" }
  }}
  ctaButton={{
    text: "Book a Session",
    href: "/contact"
  }}
/>
```

**Customization Needed**: Update content prop with full About bio

---

#### B. Testimonials Component

**Reuse Location**: Near bottom of About page

```typescript
import { Testimonials } from "@reiki-goddess/shared-components";

// In About.tsx
<Testimonials
  heading="What My Clients Are Saying"
  testimonials={[
    {
      id: "1",
      name: "Jessica M.",
      location: "Tacoma, WA",
      content: "I had no idea how deeply I was holding onto emotional pain...",
      rating: 5,
      image: { src: "/img/testimonial-jessica.jpg", alt: "Jessica M." }
    },
    // ... more testimonials
  ]}
/>
```

**Customization Needed**: Update testimonials array with About-specific testimonials

---

### Phase 3: Create About-Specific Components

**Priority**: HIGH
**Effort**: MEDIUM

#### Components to Create

1. **AboutHero** - Hero section with large heading
2. **JourneySection** - Personal journey with credential cards
3. **CertificationCards** - Display certifications/credentials
4. **ImageGallery** - Masonry image gallery
5. **ContactCTA** - Background image CTA section
6. **BookingCTA** - Final blue gradient CTA

---

#### 1. AboutHero Component

**Location**: Create at `/packages/shared-components/src/AboutHero/AboutHero.tsx`

**Design Specs** (from legacy About.tsx lines 61-109):

- Hero image: 808x808px, positioned right
- Heading: 63.6px font size, bold, left-aligned
- Two-column text layout (618px each)
- Smoke/overlay graphic

**Interface**:

```typescript
export interface AboutHeroProps {
  heading?: string;
  leftColumn?: React.ReactNode;
  rightColumn?: React.ReactNode;
  heroImage?: {
    src: string;
    alt: string;
  };
  overlayGraphic?: {
    src: string;
    alt: string;
  };
  className?: string;
}
```

**Implementation Notes**:

- Fixed height: 916px (from legacy)
- Hero image: 808x808px, right-aligned
- Two-column text: 618px each
- Smoke/overlay: Similar to MeetTheGoddess pattern
- CTA button: Outlined style, positioned bottom-right

---

#### 2. JourneySection Component

**Location**: Create at `/packages/shared-components/src/JourneySection/JourneySection.tsx`

**Design Specs** (from legacy About.tsx lines 179-221):

- Background image: 806x808px (from Figma)
- Heading and body text: Left-aligned
- Credential cards: 322x156px each

**Interface**:

```typescript
export interface CredentialCard {
  id: string;
  title: string;
  description: string;
  variant?: "blue" | "white";
}

export interface JourneySectionProps {
  heading?: string;
  content?: React.ReactNode;
  backgroundImage?: {
    src: string;
    alt: string;
  };
  credentialCards?: CredentialCard[];
  className?: string;
}
```

**Implementation Notes**:

- Credential cards: Gradient (blue) or solid (white) background
- Card styling: Rounded corners (17px), shadow effect
- Cards positioned: Staggered layout

---

#### 3. CertificationCards Component

**Location**: Create at `/packages/shared-components/src/CertificationCards/CertificationCards.tsx`

**Design Specs**:

- Card size: 322x156px
- Two variants: Gradient (blue-cyan) and solid white
- Shadow: `0px 9px 0px #0205B7, 0px 42px 32.5px -13px #00000029`

**Interface**:

```typescript
export interface CertificationCardProps {
  title: string;
  description: string;
  variant?: "gradient" | "white";
  className?: string;
}

export interface CertificationCardsProps {
  cards: CertificationCardProps[];
  className?: string;
}
```

**Implementation Notes**:

- Gradient variant: `linear-gradient(122deg, rgba(2,5,183,1) 0%, rgba(99,213,249,1) 100%)`
- White text for gradient, black text for white variant
- Shadow effect with blue offset

---

#### 4. ImageGallery Component

**Location**: Create at `/packages/shared-components/src/ImageGallery/ImageGallery.tsx`

**Design Specs** (from legacy About.tsx lines 283-331):

- Masonry layout: 5 images
- Various sizes: 898x343, 391x343, 487x343
- Heading: "Image Gallery"
- CTA: "See More" button

**Interface**:

```typescript
export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  width: string;
  height: string;
}

export interface ImageGalleryProps {
  heading?: string;
  images?: GalleryImage[];
  ctaButton?: {
    text: string;
    onClick?: () => void;
  };
  className?: string;
}
```

**Implementation Notes**:

- Use LazyImage for performance
- Masonry CSS Grid layout
- Responsive: Adjust layout for mobile
- CTA button: Outlined style

---

#### 5. ContactCTA Component

**Location**: Create at `/packages/shared-components/src/ContactCTA/ContactCTA.tsx`

**Design Specs** (from legacy About.tsx lines 239-281):

- Background image: Full-width section
- Heading: White, centered, 48px
- Body text: White, centered
- Two CTA buttons: "Book a Session", "Learn More"

**Interface**:

```typescript
export interface ContactCTAProps {
  heading?: string;
  content?: React.ReactNode;
  backgroundImage?: string;
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
  className?: string;
}
```

**Implementation Notes**:

- Background: `background: url(...) center / cover`
- Min height: 432px
- Button styling: Outlined white buttons
- Hover: Fill white, text becomes blue

---

#### 6. BookingCTA Component

**Location**: Create at `/packages/shared-components/src/BookSessionCTA/BookSessionCTA.tsx`
**Note**: Component already exists! (Line 100 of shared-components/src/index.ts)

**Existing Implementation**: Check current implementation

```bash
# Check if BookSessionCTA needs updates
cat /packages/shared-components/src/BookSessionCTA/BookSessionCTA.tsx
```

**Design Specs** (from legacy About.tsx lines 397-425):

- Gradient background: Blue to cyan
- Shadow: `9px 10px 0px #63D5F9`
- Rounded corners: 20px
- Decorative corner squares: 16x16px white squares
- Heading: White, centered
- CTA button: Outlined white

**If needs updating**:

```typescript
export interface BookSessionCTAProps {
  heading?: string;
  buttonText?: string;
  buttonHref?: string;
  onButtonClick?: () => void;
  className?: string;
}
```

---

### Phase 4: Component Integration

**Priority**: HIGH
**Effort**: LOW

**About Page Structure**:

```typescript
// apps/main/src/pages/About.tsx

import PageTransition from "../components/PageTransition";
import {
  AboutHero,
  MeetTheGoddess,
  JourneySection,
  ContactCTA,
  ImageGallery,
  Testimonials,
  BookSessionCTA,
} from "@reiki-goddess/shared-components";

function About() {
  return (
    <PageTransition>
      <div data-testid="page-about">
        {/* Hero Section */}
        <AboutHero
          heading="Experienced Reiki Master & Sound Healer in Roy"
          leftColumn={<>{/* Text */}</>}
          rightColumn={<>{/* Text */}</>}
          heroImage={{ src: "/img/about-hero.png", alt: "Deirdre" }}
        />

        {/* Meet The Goddess - REUSED */}
        <MeetTheGoddess
          heading="About Deirdre, The Reiki Goddess"
          content={<>{/* Full bio */}</>}
        />

        {/* Journey Section */}
        <JourneySection
          heading="My Journey: Inspiring Personal Growth & Renewal"
          content={<>{/* Journey text */}</>}
          credentialCards={[
            {
              id: "1",
              title: "Certified Reiki Master",
              description: "Advanced training in energy healing techniques.",
              variant: "white"
            },
            // ... more cards
          ]}
        />

        {/* Contact CTA */}
        <ContactCTA
          heading="Contact Me for Personalized Assistance"
          content={<>{/* CTA text */}</>}
          backgroundImage="/img/contact-cta-bg.png"
          primaryButton={{ text: "Book a Session", href: "/contact" }}
          secondaryButton={{ text: "Learn More", href: "/services" }}
        />

        {/* Image Gallery */}
        <ImageGallery
          heading="Image Gallery"
          images={[
            { id: "1", src: "/img/gallery-1.png", alt: "Gallery 1", width: "898px", height: "343px" },
            // ... more images
          ]}
          ctaButton={{ text: "See More", onClick: () => console.log("Gallery") }}
        />

        {/* Testimonials - REUSED */}
        <Testimonials
          heading="What My Clients Are Saying"
          testimonials={[/* testimonial data */]}
        />

        {/* Final CTA - REUSED */}
        <BookSessionCTA
          heading="Ready to Begin Your Healing Journey?"
          buttonText="Book Your Session Today"
          buttonHref="/contact"
        />
      </div>
    </PageTransition>
  );
}

export default About;
```

---

## Component Creation Plan

### Timeline & Effort Estimates

| Component          | Priority | Effort  | Dependencies                  | Estimated Lines |
| ------------------ | -------- | ------- | ----------------------------- | --------------- |
| AboutHero          | HIGH     | 4 hours | LazyImage, AnimatedSection    | 200-250         |
| JourneySection     | HIGH     | 3 hours | CertificationCards, LazyImage | 180-220         |
| CertificationCards | HIGH     | 2 hours | None                          | 120-150         |
| ImageGallery       | MEDIUM   | 3 hours | LazyImage, CSS Grid           | 180-220         |
| ContactCTA         | MEDIUM   | 2 hours | Button                        | 120-150         |
| BookSessionCTA     | LOW      | 1 hour  | Review existing               | 0-50 (update)   |

**Total Effort**: ~15 hours of development

---

### Development Order

1. **CertificationCards** (2h) - No dependencies, used by JourneySection
2. **AboutHero** (4h) - Page opening, sets tone
3. **JourneySection** (3h) - Uses CertificationCards
4. **ContactCTA** (2h) - Mid-page CTA
5. **ImageGallery** (3h) - Visual content
6. **BookSessionCTA** (1h) - Review/update existing

---

### Component File Structure

```
packages/shared-components/src/
├── AboutHero/
│   ├── AboutHero.tsx
│   ├── AboutHero.test.tsx
│   └── index.ts
├── JourneySection/
│   ├── JourneySection.tsx
│   ├── JourneySection.test.tsx
│   └── index.ts
├── CertificationCards/
│   ├── CertificationCards.tsx
│   ├── CertificationCard.tsx (singular)
│   ├── CertificationCards.test.tsx
│   └── index.ts
├── ImageGallery/
│   ├── ImageGallery.tsx
│   ├── ImageGallery.test.tsx
│   └── index.ts
├── ContactCTA/
│   ├── ContactCTA.tsx
│   ├── ContactCTA.test.tsx
│   └── index.ts
└── BookSessionCTA/ (existing)
    └── BookSessionCTA.tsx (review/update)
```

---

## TypeScript Interface Patterns

### Established Patterns (from existing components)

#### 1. Props Interface Naming

```typescript
// Component: ComponentName
// Props: ComponentNameProps
export interface MeetTheGoddessProps {
  heading?: string;
  content?: React.ReactNode;
  // ...
}
```

**Convention**: `{ComponentName}Props`

---

#### 2. Optional Props with Defaults

```typescript
export const MeetTheGoddess: React.FC<MeetTheGoddessProps> = ({
  heading = "Meet Deirdre, The Reiki Goddess",  // Default value
  content = <>{/* Default JSX */}</>,           // Default React node
  images = { /* Default object */ },           // Default structured data
  ctaButton = { text: "Read Full Story", href: "/about" },
  className = "",
}) => {
  // Component implementation
};
```

**Pattern**: All props optional, sensible defaults provided

---

#### 3. Nested Object Interfaces

```typescript
export interface MeetTheGoddessProps {
  images?: {
    main?: { src: string; alt: string };
    secondary?: { src: string; alt: string };
    tertiary?: { src: string; alt: string };
  };
  ctaButton?: {
    text: string;
    href: string;
    onClick?: () => void;
  };
}
```

**Pattern**: Inline object types for simple structures, separate interfaces for complex ones

---

#### 4. Array of Objects with Interface

```typescript
export interface Testimonial {
  id: string;
  name: string;
  location: string;
  content: string;
  rating: number;
  image?: { src: string; alt: string };
}

export interface TestimonialsProps {
  heading?: string;
  testimonials?: Testimonial[];
  className?: string;
}
```

**Pattern**: Separate interface for array items, array in props interface

---

#### 5. Variant/Enum Types

```typescript
export interface ResponsiveContainerProps {
  variant?: "full" | "page" | "content";
}

export interface ButtonProps {
  variant?: "primary" | "secondary" | "outline";
}
```

**Pattern**: String literal union types for variants

---

### New Component Interface Examples

#### AboutHero

```typescript
export interface AboutHeroProps {
  heading?: string;
  leftColumn?: React.ReactNode;
  rightColumn?: React.ReactNode;
  heroImage?: {
    src: string;
    alt: string;
  };
  overlayGraphic?: {
    src: string;
    alt: string;
  };
  ctaButton?: {
    text: string;
    href: string;
    onClick?: () => void;
  };
  className?: string;
}

export const AboutHero: React.FC<AboutHeroProps> = ({
  heading = "Experienced Reiki Master & Sound Healer in Roy",
  leftColumn = <>{/* Default text */}</>,
  rightColumn = <>{/* Default text */}</>,
  heroImage = { src: "/img/about-hero.png", alt: "Deirdre" },
  overlayGraphic = { src: "/img/smoke.png", alt: "Decorative overlay" },
  ctaButton = { text: "Learn More", href: "#about" },
  className = "",
}) => {
  // Implementation
};
```

---

#### CertificationCards

```typescript
export interface CertificationCardData {
  id: string;
  title: string;
  description: string;
  variant?: "gradient" | "white";
}

export interface CertificationCardsProps {
  cards?: CertificationCardData[];
  layout?: "stacked" | "grid";
  className?: string;
}

export const CertificationCards: React.FC<CertificationCardsProps> = ({
  cards = [
    {
      id: "1",
      title: "Certified Reiki Master",
      description: "Advanced training in energy healing techniques.",
      variant: "white",
    },
    // ... default cards
  ],
  layout = "stacked",
  className = "",
}) => {
  // Implementation
};
```

---

#### ImageGallery

```typescript
export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  width?: string;
  height?: string;
}

export interface ImageGalleryProps {
  heading?: string;
  images?: GalleryImage[];
  layout?: "masonry" | "grid";
  ctaButton?: {
    text: string;
    onClick?: () => void;
  };
  className?: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  heading = "Image Gallery",
  images = [
    /* default gallery images */
  ],
  layout = "masonry",
  ctaButton = { text: "See More", onClick: () => {} },
  className = "",
}) => {
  // Implementation
};
```

---

## Related Documentation

- **Architecture Patterns**: `/docs/project/ARCHITECTURE.md` (lines 1-200)
- **Design Specifications**: `/docs/project/style-guide.md`
- **Legacy About Page**: `/legacy/About/src/screens/About/About.tsx` (lines 1-502)
- **Homepage Patterns**: `/packages/shared-components/src/Homepage/Homepage.tsx`
- **Component Package**: `/packages/shared-components/CLAUDE.md`

---

## Accessibility & Performance Notes

### Accessibility

**Existing Patterns**:

- ✅ Semantic HTML (header, nav, section, footer)
- ✅ Alt text on all images
- ✅ ARIA labels on icon buttons
- ✅ Focus states on interactive elements
- ✅ Color contrast ratios (blue #0205B7 on cream #FFFBF5 passes AA)

**About Page Considerations**:

- Image gallery: Add keyboard navigation
- Testimonials carousel: Add aria-live region for screen readers
- CTA buttons: Ensure focus indicators
- Headings: Proper hierarchy (h1 → h2 → h3)

---

### Performance

**Existing Optimizations**:

- ✅ Lazy loading (LazyImage with IntersectionObserver)
- ✅ Animation throttling (IntersectionObserver triggers)
- ✅ Image optimization (responsive images)
- ✅ Code splitting (React Router lazy loading)

**About Page Considerations**:

- Lazy load below-fold images (gallery)
- Defer non-critical animations
- Optimize large background images
- Preload hero image

---

## Summary of Findings

### Components Ready for Reuse (5)

1. ✅ **MeetTheGoddess** - Critical, direct reuse
2. ✅ **Testimonials** - High value, direct reuse
3. ✅ **AppLayout** - Essential, automatic via router
4. ✅ **PageTransition** - Essential, already in use
5. ✅ **AnimatedSection** - High value for progressive reveals

### Components Needing Creation (6)

1. ⚠️ **AboutHero** - High priority, 200-250 lines
2. ⚠️ **JourneySection** - High priority, 180-220 lines
3. ⚠️ **CertificationCards** - High priority, 120-150 lines
4. ⚠️ **ImageGallery** - Medium priority, 180-220 lines
5. ⚠️ **ContactCTA** - Medium priority, 120-150 lines
6. ⚠️ **BookSessionCTA** - Low priority, review existing

### Architectural Decisions

1. ✅ **Use inline styles** (not Tailwind classes) for Figma accuracy
2. ✅ **Fixed 1440px containers** (not responsive max-w-7xl)
3. ✅ **66px horizontal padding** on content
4. ✅ **Z-index scale**: Background (2), Content (10), Images (20-40), Header (50)
5. ✅ **Bevel pattern** for image decoration
6. ✅ **Triple-layer smoke effects** for backgrounds
7. ✅ **Animation system** via AnimatedSection + Tailwind keyframes

### Development Roadmap

**Phase 1**: Layout foundation (0 hours - already done)
**Phase 2**: Reuse existing components (1 hour - integration)
**Phase 3**: Create new components (15 hours - development)
**Phase 4**: Integration & testing (4 hours)

**Total**: ~20 hours for complete About Page migration

---

## Next Steps

1. **Review this analysis** with development team
2. **Approve component creation plan**
3. **Begin Phase 3**: Create AboutHero component
4. **Iteratively build** remaining components
5. **Integrate all components** into About.tsx
6. **Test against Figma designs**
7. **Accessibility audit**
8. **Performance optimization**
9. **Deploy to production**

---

**Analysis Complete**: 2025-10-06
**Analyst**: Claude (Component Analyzer Agent)
**Files Analyzed**: 25+
**Components Identified**: 30+
**Reusable Patterns**: 10+
**Migration Effort**: ~20 hours
