# Services Page Pattern Analysis

> **Document Type**: Pattern Extraction Report
> **Agent**: Internal Pattern Extractor
> **Source**: Completed Pages (Home, About, Contact, Blog)
> **Target**: Services Page Implementation
> **Date**: 2025-10-15

## Table of contents

1. [Executive Summary](#executive-summary)
2. [Page Structure Patterns](#page-structure-patterns)
3. [Component Composition Patterns](#component-composition-patterns)
4. [Container and Layout Patterns](#container-and-layout-patterns)
5. [Animation Patterns](#animation-patterns)
6. [Styling Patterns](#styling-patterns)
7. [Button and CTA Patterns](#button-and-cta-patterns)
8. [Special Effects Patterns](#special-effects-patterns)
9. [Component Integration Patterns](#component-integration-patterns)
10. [Recommendations for Services Page](#recommendations-for-services-page)

---

## Executive summary

This document extracts proven, reusable patterns from The Reiki Goddess Healing's completed pages (Home, About, Contact, Blog) to ensure brand consistency and design system compliance in the Services page implementation.

**Key Findings**:

- All pages use identical container pattern (1440px max-width, 66px padding, #FFFBF5 background)
- PageTransition wrapper is mandatory for all page routes
- AnimatedSection wrapper is the standard for all major sections
- Consistent use of Figtree font family across all text
- Blue (#0205B7) is the primary brand color for CTAs, headings, and accents
- Smoke effect pattern is used extensively for visual interest
- Service cards follow a blue bevel pattern with hover effects

**Pattern Quality**: All patterns extracted are production-ready and currently deployed.

---

## Page structure patterns

### Pattern 1: Page wrapper pattern

**Source**: `apps/main/src/pages/Home.tsx:5-10`

```tsx
function Home() {
  return (
    <PageTransition>
      <div data-testid="page-home">
        <Homepage />
      </div>
    </PageTransition>
  );
}
```

**Usage**:

- Every page MUST be wrapped in `<PageTransition>` component
- Add data-testid for testing purposes
- Import from `../components/PageTransition`

**Pattern Location**: `apps/main/src/pages/Contact.tsx:4-10`

```tsx
function Contact() {
  return (
    <PageTransition>
      <ContactPage />
    </PageTransition>
  );
}
```

### Pattern 2: Main container pattern

**Source**: `packages/shared-components/src/Homepage/Homepage.tsx:46-55`

```tsx
<div
  className="relative mx-auto overflow-hidden"
  style={{
    maxWidth: "1440px",
    margin: "0 auto",
    backgroundColor: "#FFFBF5",
    boxShadow: "0 0 40px rgba(0, 0, 0, 0.1)",
    padding: "0 66px",
  }}
>
```

**Key Measurements**:

- Max Width: `1440px`
- Background: `#FFFBF5` (Cream)
- Padding: `0 66px` (universal side padding)
- Box Shadow: `0 0 40px rgba(0, 0, 0, 0.1)`

**Design Principle**: The 66px rule - all content must respect 66px side padding from page edges.

**Also Found In**:

- `packages/shared-components/src/pages/ContactPage.tsx:18-24`
- `packages/shared-components/src/AppLayout/AppLayout.tsx:55-57`

---

## Component composition patterns

### Pattern 3: Section wrapper with AnimatedSection

**Source**: `packages/shared-components/src/Homepage/Homepage.tsx:85-87`

```tsx
<AnimatedSection animation="fadeInUp" delay={0.2}>
  <FeaturesBar />
</AnimatedSection>
```

**Animation Options**:

- `fadeInUp` - Standard for content sections
- `fadeIn` - For large hero or CTA sections
- `slideInLeft` - Left-side content
- `slideInRight` - Right-side content
- `scaleIn` - For cards and events

**Delay Pattern**:

- First section: `0.1s` or `0.2s`
- Subsequent sections: increment by `0.1s`
- Max recommended: `0.4s`

**Threshold Options**:

- Default: `0.1` (triggers when 10% visible)
- Content-heavy: `0.2` (20% visible)
- CTA sections: `0.3` (30% visible)

**All Animation Usage in Homepage**:

```tsx
// Line 85-87
<AnimatedSection animation="fadeInUp" delay={0.2}>
  <FeaturesBar />
</AnimatedSection>

// Line 90-92
<AnimatedSection animation="fadeIn" delay={0.1} threshold={0.2}>
  <MeetTheGoddess />
</AnimatedSection>

// Line 95-97
<AnimatedSection animation="fadeInUp" delay={0.1} threshold={0.2}>
  <ServicesSection />
</AnimatedSection>

// Line 100-102
<AnimatedSection animation="scaleIn" delay={0.1} threshold={0.2}>
  <CommunityEvents />
</AnimatedSection>

// Line 105-107
<AnimatedSection animation="fadeInUp" delay={0.1} threshold={0.2}>
  <Testimonials />
</AnimatedSection>

// Line 110-112
<AnimatedSection animation="fadeIn" delay={0.1} threshold={0.3}>
  <LetsConnect />
</AnimatedSection>
```

### Pattern 4: AnimatedSection implementation

**Source**: `packages/shared-components/src/AnimatedSection/AnimatedSection.tsx:20-41`

```tsx
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

**Key Features**:

- Uses Intersection Observer for performance
- Initially hidden with `opacity-0`
- Triggers animation when in viewport
- Animation delay for staggered reveals

### Pattern 5: Intersection Observer hook

**Source**: `packages/shared-components/src/hooks/useIntersectionObserver.tsx:13-54`

```tsx
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
      if (element) observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isVisible };
};
```

**Pattern**: Reusable hook for scroll-triggered animations, triggers once by default.

---

## Container and layout patterns

### Pattern 6: Hero section pattern

**Source**: `packages/shared-components/src/Hero/HeroV2.tsx:50-80`

```tsx
<section
  className={`relative w-full overflow-hidden ${className}`}
  style={{
    height: "825px", // 93px (nav) + 732px (image) = 825px total
  }}
>
  {/* Background Image - positioned with 66px buffer from edges */}
  <div className="absolute inset-0">
    <img
      src={backgroundImage.src}
      alt={backgroundImage.alt}
      className="absolute"
      style={{
        top: "93px",
        left: "66px",
        right: "66px",
        width: "calc(100% - 132px)", // Account for 66px buffer on each side
        maxWidth: "1308px",
        height: "732px",
        objectFit: "cover",
        borderRadius: "20px",
      }}
    />
  </div>

  {/* Dark overlay for text readability */}
  <div
    className="absolute bg-black/30"
    style={{
      top: "93px",
      left: "66px",
      right: "66px",
      width: "calc(100% - 132px)",
      maxWidth: "1308px",
      height: "732px",
      borderRadius: "20px",
    }}
  />
</section>
```

**Key Measurements**:

- Total Height: `825px` (93px nav + 732px image)
- Image Height: `732px`
- Image Width: `calc(100% - 132px)` (1308px max)
- Border Radius: `20px`
- Overlay: `bg-black/30` for text readability

**Overlay Content Positioning**:

**Source**: `packages/shared-components/src/Hero/HeroV2.tsx:118-125`

```tsx
<div
  className="absolute z-10 w-full"
  style={{
    top: "calc(93px + 436px)", // Navbar + 436px from top of hero image
    left: "50%",
    transform: "translateX(-50%)",
  }}
>
```

**Positioning**: Content starts 436px from top of hero image, centered horizontally.

### Pattern 7: Content section pattern

**Source**: `packages/shared-components/src/Services/ServicesSection.tsx:76-81`

```tsx
<section
  className={`py-20 ${className}`}
  style={{ backgroundColor: "#FFFBF5" }}
>
  <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: "1200px" }}>
```

**Standard Pattern**:

- Vertical Padding: `py-20` (80px top/bottom)
- Background: `#FFFBF5` (Cream)
- Inner Container: `maxWidth: 1200px`
- Responsive Padding: `px-4` mobile, `px-6` tablet, `px-8` desktop

### Pattern 8: Grid layout pattern

**Source**: `packages/shared-components/src/Services/ServicesSection.tsx:94`

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
```

**Responsive Grid**:

- Mobile: 1 column
- Tablet (sm): 2 columns
- Desktop (lg): 4 columns
- Gap scaling: 4px → 6px → 8px

**Also Used In**:

- Contact Page: `grid-cols-1 md:grid-cols-3` (`packages/shared-components/src/pages/ContactPage.tsx:126`)
- Community Events: `grid-cols-1 md:grid-cols-2` (`packages/shared-components/src/CommunityEvents/CommunityEvents.tsx:128`)

---

## Animation patterns

### Pattern 9: Tailwind animation configuration

**Source**: `apps/main/tailwind.config.js:31-59`

```javascript
keyframes: {
  fadeInUp: {
    "0%": { opacity: "0", transform: "translateY(20px)" },
    "100%": { opacity: "1", transform: "translateY(0)" },
  },
  fadeIn: {
    "0%": { opacity: "0" },
    "100%": { opacity: "1" },
  },
  slideInLeft: {
    "0%": { opacity: "0", transform: "translateX(-50px)" },
    "100%": { opacity: "1", transform: "translateX(0)" },
  },
  slideInRight: {
    "0%": { opacity: "0", transform: "translateX(50px)" },
    "100%": { opacity: "1", transform: "translateX(0)" },
  },
  scaleIn: {
    "0%": { opacity: "0", transform: "scale(0.9)" },
    "100%": { opacity: "1", transform: "scale(1)" },
  },
},
animation: {
  fadeInUp: "fadeInUp 0.6s ease-out",
  fadeIn: "fadeIn 0.6s ease-out",
  slideInLeft: "slideInLeft 0.6s ease-out",
  slideInRight: "slideInRight 0.6s ease-out",
  scaleIn: "scaleIn 0.6s ease-out",
},
```

**Animation Timing**:

- Duration: `0.6s` for all animations
- Easing: `ease-out` for smooth deceleration
- Initial State: `opacity: 0` + transform

### Pattern 10: Page transition pattern

**Source**: `apps/main/src/components/PageTransition.tsx:8-29`

```tsx
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.4,
      ease: "easeIn" as const,
    },
  },
};
```

**Usage**: Framer Motion variants for page-level transitions.

**Timing**:

- Enter: `0.6s ease-out`
- Exit: `0.4s ease-in`
- Transform: `20px` vertical movement

### Pattern 11: Hover animations

**Source**: `packages/shared-components/src/Services/ServicesSection.tsx:98`

```tsx
<div
  className="group relative transition-all duration-300 transform hover:-translate-y-2"
>
```

**Card Hover Pattern**:

- Duration: `300ms`
- Transform: `translateY(-2px)` (8px lift)
- Uses `group` for child element coordination

**Shadow Enhancement on Hover**:

**Source**: `packages/shared-components/src/Services/ServicesSection.tsx:121-128`

```tsx
onMouseEnter={(e) => {
  e.currentTarget.style.boxShadow =
    "0px 42px 40px -10px rgba(2, 5, 183, 0.35)";
}}
onMouseLeave={(e) => {
  e.currentTarget.style.boxShadow =
    "0px 42px 32.5px -13px rgba(2, 5, 183, 0.25)";
}}
```

**Pattern**: Enhance shadow blur and opacity on hover for depth effect.

---

## Styling patterns

### Pattern 12: Color palette usage

**Primary Colors** (from `docs/design/style-guide.md`):

```css
/* Brand Blue - Primary CTAs, headers, links */
#0205B7

/* Cream Background - Site background */
#FFFBF5

/* Purple - Spiritual elements, gradients */
#A593E0

/* Peach - Accent elements */
#FFC6A5

/* Cyan - Hover states, fresh accents */
#63D5F9

/* Gold/Tan - Logo text, premium elements */
#C4A962
```

**Text Colors**:

```css
/* Dark Text - Primary body text */
#333333

/* Gray Text - Secondary text */
#5E5E5E

/* White - Text on dark backgrounds */
#FFFFFF
```

**Actual Usage Examples**:

**Source**: `packages/shared-components/src/Services/ServicesSection.tsx:169`

```tsx
color: "rgba(51, 51, 51, 1)", // #333333 for headings
```

**Source**: `packages/shared-components/src/Services/ServicesSection.tsx:183`

```tsx
color: "rgba(94, 94, 94, 1)", // #5E5E5E for descriptions
```

**Source**: `packages/shared-components/src/Header/Header.tsx:88`

```tsx
color: "rgba(2, 5, 183, 1)", // #0205B7 for navigation links
```

### Pattern 13: Typography patterns

**Font Family** (Universal):

**Source**: `packages/shared-components/src/Hero/HeroV2.tsx:136-137`

```tsx
fontFamily: 'Figtree, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
```

**Simplified Version**:

```tsx
fontFamily: "Figtree, Helvetica, sans-serif",
```

**Typography Scale in Use**:

**Hero Heading** (`packages/shared-components/src/Hero/HeroV2.tsx:138-142`):

```tsx
fontSize: "63.55px",
fontWeight: 700,
lineHeight: "100%",
color: "#FFFFFF",
```

**Section Headings** (`packages/shared-components/src/Services/ServicesSection.tsx:84-88`):

```tsx
className="text-center mb-8 sm:mb-10 lg:mb-12 font-bold text-gray-900 text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
style={{
  fontFamily: "Figtree, Helvetica, sans-serif",
  lineHeight: "1.2",
}}
```

**Body Text** (`packages/shared-components/src/MeetTheGoddess/MeetTheGoddess.tsx:276-280`):

```tsx
fontFamily: "Figtree, Helvetica, sans-serif",
fontSize: "18px",
fontWeight: 400,
lineHeight: "28px",
color: "rgba(94, 94, 94, 1)",
```

**Card Titles** (`packages/shared-components/src/Services/ServicesSection.tsx:165-170`):

```tsx
className="font-semibold mb-1 relative z-10 transition-colors duration-300 group-hover:text-white text-base sm:text-lg lg:text-xl"
style={{
  fontFamily: "Figtree, Helvetica, sans-serif",
  lineHeight: "1.2",
  color: "rgba(51, 51, 51, 1)",
}
```

### Pattern 14: Border radius standards

**From Style Guide** (`docs/design/style-guide.md:336-344`):

```
- Buttons: 100px (pill shape)
- Cards: 20px
- Images: 20px (standard), 27px (featured)
- Large Sections: 30px
- Input Fields: 8px
```

**Actual Usage**:

**Service Cards** (`packages/shared-components/src/Services/ServicesSection.tsx:116`):

```tsx
borderRadius: "20px",
```

**CTA Sections** (`packages/shared-components/src/LetsConnect/LetsConnect.tsx:95`):

```tsx
borderRadius: "30px",
```

**Buttons** (`packages/shared-components/src/Hero/HeroV2.tsx:180`):

```tsx
className = "inline-flex items-center justify-center rounded-full";
```

**Images** (`packages/shared-components/src/MeetTheGoddess/MeetTheGoddess.tsx:174`):

```tsx
borderRadius: "27px", // Featured images
```

### Pattern 15: Shadow patterns

**Card Shadow** (`packages/shared-components/src/Services/ServicesSection.tsx:117`):

```tsx
boxShadow: "0px 42px 32.5px -13px rgba(2, 5, 183, 0.25)",
```

**Section Shadow (Blue Bevel)** (`packages/shared-components/src/LetsConnect/LetsConnect.tsx:92`):

```tsx
className = "shadow-[9px_10px_0px_0px_#0205B7]";
```

**Container Shadow** (`packages/shared-components/src/Homepage/Homepage.tsx:52`):

```tsx
boxShadow: "0 0 40px rgba(0, 0, 0, 0.1)",
```

**From Style Guide** (`docs/design/style-guide.md:346-375`):

```css
/* Card Shadow */
box-shadow: 0px 42px 32.5px -13px rgba(2, 5, 183, 0.25);

/* Container Shadow */
box-shadow: 0 0 40px rgba(0, 0, 0, 0.1);

/* Hover Shadow */
box-shadow: 0 20px 40px rgba(2, 5, 183, 0.2);

/* Section Shadow (CTA/Feature) */
box-shadow: 9px 10px 0px 0px #0205b7;
```

---

## Button and CTA patterns

### Pattern 16: Primary button (filled)

**Source**: `packages/shared-components/src/Hero/HeroV2.tsx:176-195`

```tsx
<a
  href={button.href || "#"}
  className="inline-flex items-center justify-center rounded-full transition-all duration-200 hover:bg-white/10 hover:scale-105"
  style={{
    fontFamily: "Figtree, Helvetica, sans-serif",
    fontSize: "16px",
    fontWeight: 500,
    minWidth: "180px",
    height: "48px",
    padding: "0 32px",
    backgroundColor: "transparent",
    color: "white",
    border: "2px solid white",
    backdropFilter: "blur(10px)",
  }}
>
  {button.text}
  <svg
    className="ml-2 w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 7l5 5m0 0l-5 5m5-5H6"
    />
  </svg>
</a>
```

**Key Features**:

- Min Width: `180px`
- Height: `48px`
- Padding: `0 32px`
- Font Size: `16px`
- Font Weight: `500`
- Border: `2px solid`
- Border Radius: `rounded-full` (100px)
- Icon: Arrow with 20px size
- Transition: `200ms`
- Hover: Background tint + scale

### Pattern 17: Secondary button (outline)

**Source**: `packages/shared-components/src/MeetTheGoddess/MeetTheGoddess.tsx:287-302`

```tsx
<a
  href={ctaButton.href}
  className="inline-flex items-center justify-center rounded-full transition-all duration-200 hover:bg-blue-50 hover:scale-105"
  style={{
    fontFamily: "Figtree, Helvetica, sans-serif",
    fontSize: "16px",
    fontWeight: 500,
    minWidth: "180px",
    height: "48px",
    padding: "0 32px",
    backgroundColor: "transparent",
    color: "rgba(2, 5, 183, 1)",
    border: "2px solid rgba(2, 5, 183, 1)",
  }}
>
  {ctaButton.text}
  <svg
    className="ml-2 w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 7l5 5m0 0l-5 5m5-5H6"
    />
  </svg>
</a>
```

**Differences from Primary**:

- Color: Blue (`#0205B7`)
- Border: Blue
- Background: Transparent
- Hover: Light blue background (`bg-blue-50`)

### Pattern 18: Full-width CTA section

**Source**: `packages/shared-components/src/LetsConnect/LetsConnect.tsx:90-123`

```tsx
<section
  className={`relative overflow-hidden shadow-[9px_10px_0px_0px_#0205B7] ${className}`}
  style={{
    height: "260px",
    borderRadius: "30px",
    margin: "40px 66px",
  }}
>
  {/* Background Image */}
  <img
    src="/img/lets-connect-bg.jpg"
    alt="Healing crystals and sage"
    className="absolute inset-0 w-full h-full object-cover"
    style={{ borderRadius: "30px" }}
  />

  {/* Blue Overlay with brand color */}
  <div
    className="absolute inset-0"
    style={{
      backgroundColor: "rgba(2, 5, 183, 0.35)", // #0205B7 with 35% opacity
      borderRadius: "30px",
    }}
  />

  {/* Decorative Dots */}
  <div className="absolute top-8 left-8 w-3 h-3 bg-white rounded-full" />
  <div className="absolute top-8 right-8 w-3 h-3 bg-white rounded-full" />
  <div className="absolute bottom-8 left-8 w-3 h-3 bg-white rounded-full" />
  <div className="absolute bottom-8 right-8 w-3 h-3 bg-white rounded-full" />
</section>
```

**Pattern Components**:

1. Background image layer
2. Blue tint overlay (35% opacity)
3. White decorative corner dots (11px diameter)
4. Blue bevel shadow (`9px 10px 0px 0px #0205B7`)
5. Border radius: `30px`
6. Height: `260px`

**Also Used In**: `packages/shared-components/src/BookSessionCTA/BookSessionCTA.tsx:16-34`

### Pattern 19: Book Session CTA

**Source**: `packages/shared-components/src/BookSessionCTA/BookSessionCTA.tsx:15-60`

```tsx
<div
  className={`bg-[#0205b7] rounded-[20px] shadow-[9px_10px_0px_0px_#0205B7] h-[265px] relative overflow-hidden ${className}`}
>
  {/* Background layered image */}
  <img
    src="/img/book-a-session-image.jpg"
    alt=""
    className="absolute inset-0 w-full h-full object-cover"
  />

  {/* Blue tint overlay */}
  <div className="absolute inset-0 bg-[#0205B7] opacity-35" />

  {/* Four decorative white circles in corners */}
  <div className="absolute top-[30px] left-[30px] w-[11px] h-[11px] bg-white rounded-full" />
  <div className="absolute top-[30px] right-[30px] w-[11px] h-[11px] bg-white rounded-full" />
  <div className="absolute bottom-[30px] left-[30px] w-[11px] h-[11px] bg-white rounded-full" />
  <div className="absolute bottom-[30px] right-[30px] w-[11px] h-[11px] bg-white rounded-full" />

  {/* Content */}
  <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
    <h2
      className="text-[48px] font-bold text-white mb-[43px] text-center leading-normal"
      style={{ fontFamily: "Figtree, sans-serif" }}
    >
      Ready to Begin Your Healing Journey?
    </h2>
    <a
      href="/book"
      className="inline-flex items-center gap-2.5 px-[13px] pr-2.5 py-2.5 border border-white rounded-[90px] text-white hover:bg-white hover:text-[#0205b7] transition-all duration-300"
    >
      <span className="text-[16px] font-medium leading-[24px]">
        Book Your Session Today
      </span>
      <img
        src="/images/gridicons_arrow-up.svg"
        alt=""
        className="w-5 h-5"
        style={{ transform: "rotate(45deg)" }}
      />
    </a>
  </div>
</div>
```

**Measurements**:

- Height: `265px`
- Border Radius: `20px`
- Heading: `48px` bold
- Button Border Radius: `90px` (pill)
- Corner Dots: `11px` diameter, `30px` from edges
- Blue Overlay: `35%` opacity

---

## Special effects patterns

### Pattern 20: Blue bevel effect (3D card lift)

**Source**: `packages/shared-components/src/Services/ServicesSection.tsx:100-109`

```tsx
{/* Blue background rectangle - shifted down 5px */}
<div
  className="absolute inset-0"
  style={{
    backgroundColor: "#0205B7",
    borderRadius: "20px",
    transform: "translateY(5px)",
    zIndex: 0,
  }}
/>

{/* White service card on top */}
<a
  href={service.href || "#"}
  className="block relative"
  style={{
    borderRadius: "20px",
    boxShadow: "0px 42px 32.5px -13px rgba(2, 5, 183, 0.25)",
    backgroundColor: "#FFFFFF",
    zIndex: 1,
  }}
>
```

**Pattern Steps**:

1. Create blue rectangle as background
2. Position 5px down with `translateY(5px)`
3. Set `zIndex: 0`
4. Place white card on top with `zIndex: 1`
5. Match border radius on both layers

**Also Used In**:

- `packages/shared-components/src/MeetTheGoddess/MeetTheGoddess.tsx:159-168` (left tilt)
- `packages/shared-components/src/MeetTheGoddess/MeetTheGoddess.tsx:229-237` (right tilt)

**Directional Bevel Pattern**:

**Left-tilted image** (`packages/shared-components/src/MeetTheGoddess/MeetTheGoddess.tsx:159-168`):

```tsx
{
  /* Blue background rectangle - shifted down 5px and left 5px */
}
<div
  className="absolute inset-0"
  style={{
    backgroundColor: "#0205B7",
    borderRadius: "27px",
    transform: "translate(-5px, 5px)",
    zIndex: 0,
  }}
/>;
```

**Right-tilted image** (`packages/shared-components/src/MeetTheGoddess/MeetTheGoddess.tsx:229-237`):

```tsx
{
  /* Blue background rectangle - shifted down 5px and right 5px */
}
<div
  className="absolute inset-0"
  style={{
    backgroundColor: "#0205B7",
    borderRadius: "24px",
    transform: "translate(5px, 5px)",
    zIndex: 0,
  }}
/>;
```

**Rule**: Bevel shifts in the direction of the image tilt.

### Pattern 21: Smoke effect (layered transparency)

**Source**: `packages/shared-components/src/MeetTheGoddess/MeetTheGoddess.tsx:70-139`

```tsx
<div
  className="absolute"
  style={{
    left: "0",
    top: "0",
    width: "810px",
    height: "810px",
    zIndex: 2,
  }}
>
  {/* Base layer - normal blend */}
  <img
    src="/img/smoke.png"
    alt="Smoke effect"
    style={{
      width: "810px",
      height: "810px",
      objectFit: "cover",
      position: "absolute",
      left: "0",
      top: "0",
      transform: "rotate(180deg)",
      opacity: 0.5,
      filter: "saturate(100%)",
      mixBlendMode: "normal",
    }}
  />

  {/* Duplicate layer - multiply blend */}
  <img
    src="/img/smoke.png"
    alt="Smoke effect duplicate"
    style={{
      width: "810px",
      height: "810px",
      objectFit: "cover",
      position: "absolute",
      left: "0",
      top: "0",
      transform: "rotate(180deg)",
      opacity: 0.3,
      filter: "saturate(150%)",
      mixBlendMode: "multiply",
    }}
  />

  {/* Triple layer - overlay blend */}
  <img
    src="/img/smoke.png"
    alt="Smoke effect triple"
    style={{
      width: "810px",
      height: "810px",
      objectFit: "cover",
      position: "absolute",
      left: "0",
      top: "0",
      transform: "rotate(180deg)",
      opacity: 0.2,
      filter: "saturate(200%) hue-rotate(-10deg)",
      mixBlendMode: "overlay",
    }}
  />
</div>
```

**Triple Layer Pattern**:

1. **Base Layer**: `opacity: 0.5`, `saturate(100%)`, `mixBlendMode: normal`
2. **Multiply Layer**: `opacity: 0.3`, `saturate(150%)`, `mixBlendMode: multiply`
3. **Overlay Layer**: `opacity: 0.2`, `saturate(200%) hue-rotate(-10deg)`, `mixBlendMode: overlay`

**Positioning**: Aligned to page edge (0px left), rotated 180° to position wisps

**Also Used In**: Contact Page with 10 layers for enhanced vibrancy
(`packages/shared-components/src/pages/ContactPage.tsx:89-123`)

### Pattern 22: Gradient overlay on background images

**Source**: `packages/shared-components/src/LetsConnect/LetsConnect.tsx:110-116`

```tsx
{
  /* Blue Overlay with brand color */
}
<div
  className="absolute inset-0"
  style={{
    backgroundColor: "rgba(2, 5, 183, 0.35)", // #0205B7 with 35% opacity
    borderRadius: "30px",
  }}
/>;
```

**Standard Opacity**: `35%` for brand blue overlay on images

**From Style Guide** (`docs/design/style-guide.md:383-409`):

```css
/* Blue Tint Overlay */
background-color: rgba(2, 5, 183, 0.35); /* #0205B7 with 35% opacity */
position: absolute;
inset: 0;
```

**Also Used In**:

- Community Events: `rgba(2, 5, 183, 0.44)` (`packages/shared-components/src/CommunityEvents/CommunityEvents.tsx:95`)
- Book Session CTA: `opacity-35` (`packages/shared-components/src/BookSessionCTA/BookSessionCTA.tsx:27`)

### Pattern 23: Decorative corner dots

**Source**: `packages/shared-components/src/LetsConnect/LetsConnect.tsx:119-122`

```tsx
{/* Decorative Dots */}
<div className="absolute top-8 left-8 w-3 h-3 bg-white rounded-full" />
<div className="absolute top-8 right-8 w-3 h-3 bg-white rounded-full" />
<div className="absolute bottom-8 left-8 w-3 h-3 bg-white rounded-full" />
<div className="absolute bottom-8 right-8 w-3 h-3 bg-white rounded-full" />
```

**Specifications**:

- Size: `w-3 h-3` (12px / 11px in design)
- Color: White
- Shape: `rounded-full`
- Position: `30-32px` from edges (8 in Tailwind = 32px)

**From Style Guide** (`docs/design/style-guide.md:420-436`):

```css
/* Small decorative circles */
width: 11px;
height: 11px;
background: white;
border-radius: 50%;
position: absolute;

/* Positioning from edges */
top: 30px;
left: 30px;
```

**Used On**: Blue-overlaid CTA sections for visual interest

### Pattern 24: Hover gradient overlay

**Source**: `packages/shared-components/src/Services/ServicesSection.tsx:131-150`

```tsx
{
  /* Gradient Background Overlay - appears on hover */
}
<div
  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
  style={{
    background:
      "linear-gradient(135deg, #0205B7 0%, rgba(99, 213, 249, 1) 100%)",
    borderRadius: "20px",
  }}
/>;

{
  /* White background for hover state */
}
<div
  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
  style={{
    background:
      "linear-gradient(135deg, #0205B7 0%, rgba(99, 213, 249, 1) 100%)",
    borderRadius: "20px",
  }}
/>;
```

**Gradient**: `linear-gradient(135deg, #0205B7 0%, rgba(99, 213, 249, 1) 100%)`

- Direction: `135deg` (diagonal)
- Start: Blue `#0205B7`
- End: Cyan `#63D5F9`

**Transition**: `300ms` opacity fade

**Text Color Change on Hover**:

**Source**: `packages/shared-components/src/Services/ServicesSection.tsx:165`

```tsx
className = "transition-colors duration-300 group-hover:text-white";
```

**Pattern**: Text transitions to white when gradient appears

---

## Component integration patterns

### Pattern 25: Importing shared components

**Source**: `packages/shared-components/src/Homepage/Homepage.tsx:1-9`

```tsx
import React, { useEffect } from "react";
import { HeroV2 } from "../Hero/HeroV2";
import { FeaturesBar } from "../FeaturesBar/FeaturesBar";
import { MeetTheGoddess } from "../MeetTheGoddess/MeetTheGoddess";
import { ServicesSection } from "../Services/ServicesSection";
import { CommunityEvents } from "../CommunityEvents/CommunityEvents";
import { Testimonials } from "../Testimonials/Testimonials";
import { LetsConnect } from "../LetsConnect/LetsConnect";
import { AnimatedSection } from "../AnimatedSection/AnimatedSection";
```

**Pattern**: Import from package-local relative paths (`../ComponentName/ComponentName`)

**For Page-Level Usage** (`apps/main/src/pages/Home.tsx:1`):

```tsx
import { Homepage } from "@reiki-goddess/shared-components";
import PageTransition from "../components/PageTransition";
```

**Pattern**: Import from package alias for cross-package usage

### Pattern 26: Component export pattern

**Source**: `packages/shared-components/src/index.ts:46-63`

```tsx
export { FeaturesBar } from "./FeaturesBar";
export type { FeaturesBarProps, Feature } from "./FeaturesBar";

export { MeetTheGoddess } from "./MeetTheGoddess";
export type { MeetTheGoddessProps } from "./MeetTheGoddess";

export { ServicesSection } from "./Services";
export type { ServicesSectionProps, ServiceCard } from "./Services";

export { CommunityEvents } from "./CommunityEvents";
export type { CommunityEventsProps, EventCard } from "./CommunityEvents";

export { Testimonials } from "./Testimonials";
export type { TestimonialsProps, Testimonial } from "./Testimonials";

export { LetsConnect } from "./LetsConnect";
export type { LetsConnectProps } from "./LetsConnect";
```

**Pattern**: Export both component and TypeScript types from package index

### Pattern 27: Smooth scroll navigation

**Source**: `packages/shared-components/src/Homepage/Homepage.tsx:21-41`

```tsx
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

**Pattern**: Intercept anchor clicks for smooth scrolling to section IDs

**Usage**: Apply to pages with internal section navigation

### Pattern 28: Service card component pattern

**Source**: `packages/shared-components/src/Services/ServicesSection.tsx:3-16`

```tsx
export interface ServiceCard {
  id: string;
  icon: React.ReactNode;
  title: string;
  duration?: string;
  description?: string;
  href?: string;
}

export interface ServicesSectionProps {
  heading?: string;
  services?: ServiceCard[];
  className?: string;
}
```

**Data Structure**:

- `id`: Unique identifier
- `icon`: SVG or image component
- `title`: Service name
- `duration`: Optional duration/subtitle
- `description`: Optional description
- `href`: Link destination

**Default Data** (`packages/shared-components/src/Services/ServicesSection.tsx:24-73`):

```tsx
services = [
  {
    id: "reiki",
    icon: (
      <img src="/img/jainism_6741541-reiki-healing-sessions.svg" alt="Reiki" />
    ),
    title: "Reiki Healing Sessions",
    duration: "(60/90 min)",
    href: "/services/reiki",
  },
  // ... more services
];
```

**Pattern**: Services array with icon components and metadata

### Pattern 29: Responsive typography pattern

**Source**: `packages/shared-components/src/Services/ServicesSection.tsx:84`

```tsx
className =
  "text-center mb-8 sm:mb-10 lg:mb-12 font-bold text-gray-900 text-2xl sm:text-3xl md:text-4xl lg:text-5xl";
```

**Scaling**:

- Mobile: `text-2xl` (24px)
- Small: `text-3xl` (30px)
- Medium: `text-4xl` (36px)
- Large: `text-5xl` (48px)

**Margin Bottom Scaling**:

- Mobile: `mb-8` (32px)
- Small: `mb-10` (40px)
- Large: `mb-12` (48px)

### Pattern 30: Icon with color inversion on hover

**Source**: `packages/shared-components/src/Services/ServicesSection.tsx:153-160`

```tsx
<div className="mb-3 sm:mb-4 relative z-10 transition-all duration-300 group-hover:brightness-0 group-hover:invert">
  {React.cloneElement(service.icon as React.ReactElement, {
    className: "w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16",
    style: {
      filter: "none",
      color: "rgba(2, 5, 183, 1)",
    },
  })}
</div>
```

**Pattern**:

- Default: Blue icon (`#0205B7`)
- Hover: White icon (`brightness-0 invert`)
- Transition: `300ms`

**Icon Size Scaling**:

- Mobile: `w-12 h-12` (48px)
- Small: `w-14 h-14` (56px)
- Large: `w-16 h-16` (64px)

---

## Recommendations for Services Page

### 1. Page structure

**Mandatory Pattern**:

```tsx
// apps/main/src/pages/Services.tsx
import PageTransition from "../components/PageTransition";
import { ServicesPage } from "@reiki-goddess/shared-components";

function Services() {
  return (
    <PageTransition>
      <div data-testid="page-services">
        <ServicesPage />
      </div>
    </PageTransition>
  );
}

export default Services;
```

### 2. Main container pattern

**Use Homepage container pattern**:

```tsx
// packages/shared-components/src/pages/ServicesPage.tsx
export const ServicesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FFFBF5]">
      <div
        className="relative mx-auto overflow-hidden"
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          backgroundColor: "#FFFBF5",
          boxShadow: "0 0 40px rgba(0, 0, 0, 0.1)",
          padding: "0 66px",
        }}
      >
        {/* Sections go here */}
      </div>
    </div>
  );
};
```

### 3. Section structure

**Recommended Section Order**:

1. Hero Section (with service overview)
2. Featured Services Grid (expand existing ServicesSection)
3. Service Details Sections (one per service type)
4. Pricing/Packages Section
5. Testimonials (reuse Testimonials component)
6. FAQ Section (new component)
7. Book Session CTA (reuse BookSessionCTA)

### 4. Hero section for Services page

**Pattern**: Adapt HeroV2 or create simpler hero

**Option A - Full Hero**:

```tsx
<HeroV2
  backgroundImage={{
    src: "/img/services-hero.jpg",
    alt: "Healing services overview",
  }}
  overlayContent={{
    heading: "Healing Services",
    subheading: "Discover transformative energy healing tailored to your needs",
    buttons: [
      { text: "Book a Session", variant: "primary", href: "/book" },
      { text: "View Pricing", variant: "secondary", href: "#pricing" },
    ],
  }}
/>
```

**Option B - Simplified Hero** (Recommended):

```tsx
<AnimatedSection animation="fadeIn">
  <div className="text-center pt-[193px] pb-20">
    <h1
      className="text-[63.55px] font-bold text-[#0205B7] mb-8"
      style={{ fontFamily: "Figtree, sans-serif" }}
    >
      Healing Services
    </h1>
    <p
      className="text-[18px] text-[#5E5E5E] max-w-2xl mx-auto"
      style={{ fontFamily: "Figtree, sans-serif" }}
    >
      Discover transformative energy healing tailored to your unique needs
    </p>
  </div>
</AnimatedSection>
```

### 5. Services grid section

**Reuse and expand ServicesSection**:

```tsx
<AnimatedSection animation="fadeInUp" delay={0.1} threshold={0.2}>
  <ServicesSection
    heading="Our Healing Services"
    services={[
      {
        id: "reiki-60",
        icon: <img src="/img/reiki-icon.svg" alt="Reiki" />,
        title: "Reiki Healing Session",
        duration: "60 minutes",
        description: "Deep energy healing to restore balance and reduce stress",
        href: "/services/reiki-60",
      },
      // ... more services
    ]}
  />
</AnimatedSection>
```

**Pattern**: Same component, expanded data

### 6. Service detail sections

**Pattern**: Alternate left/right content with images

**Example Structure**:

```tsx
<AnimatedSection animation="fadeIn" delay={0.1}>
  <section className="py-20 relative">
    {/* Smoke effect (optional) */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      {/* Image with blue bevel */}
      <div className="relative">
        <div
          className="absolute inset-0 bg-[#0205B7] rounded-[20px]"
          style={{ transform: "translate(5px, 5px)", zIndex: 0 }}
        />
        <img
          src="/img/reiki-session.jpg"
          className="relative z-10 rounded-[20px]"
          style={{ boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)" }}
        />
      </div>

      {/* Content */}
      <div>
        <h2
          className="text-[48px] font-bold text-[#333333] mb-6"
          style={{ fontFamily: "Figtree, sans-serif" }}
        >
          Reiki Healing Sessions
        </h2>
        <p
          className="text-[18px] text-[#5E5E5E] mb-6"
          style={{ fontFamily: "Figtree, sans-serif", lineHeight: "28px" }}
        >
          Experience the transformative power of Reiki...
        </p>
        <ul className="mb-8">
          <li className="flex items-start gap-3 mb-3">
            <svg className="w-6 h-6 text-[#0205B7] flex-shrink-0">
              {/* Checkmark icon */}
            </svg>
            <span className="text-[16px] text-[#5E5E5E]">
              Reduces stress and promotes relaxation
            </span>
          </li>
          {/* More benefits */}
        </ul>
        <a
          href="/book?service=reiki"
          className="inline-flex items-center justify-center rounded-full transition-all duration-200 hover:bg-blue-50 hover:scale-105"
          style={{
            fontFamily: "Figtree, sans-serif",
            fontSize: "16px",
            fontWeight: 500,
            minWidth: "180px",
            height: "48px",
            padding: "0 32px",
            backgroundColor: "transparent",
            color: "#0205B7",
            border: "2px solid #0205B7",
          }}
        >
          Book Reiki Session
          <svg className="ml-2 w-5 h-5">{/* Arrow icon */}</svg>
        </a>
      </div>
    </div>
  </section>
</AnimatedSection>
```

**Alternating Pattern**: Swap `grid-cols` order for each service

### 7. Pricing section

**Pattern**: Card grid with blue bevels

**Structure**:

```tsx
<AnimatedSection animation="scaleIn" delay={0.2}>
  <section className="py-20">
    <h2
      className="text-[48px] font-bold text-center mb-12"
      style={{ fontFamily: "Figtree, sans-serif" }}
    >
      Service Pricing
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {/* Pricing Card */}
      <div className="group relative">
        {/* Blue bevel background */}
        <div
          className="absolute inset-0 bg-[#0205B7] rounded-[20px]"
          style={{ transform: "translateY(5px)", zIndex: 0 }}
        />

        {/* White card */}
        <div
          className="relative bg-white rounded-[20px] p-8 z-10"
          style={{ boxShadow: "0px 42px 32.5px -13px rgba(2, 5, 183, 0.25)" }}
        >
          <h3 className="text-[32px] font-bold text-[#333333] mb-4">
            60-Minute Session
          </h3>
          <div className="text-[48px] font-bold text-[#0205B7] mb-2">$120</div>
          <p className="text-[16px] text-[#5E5E5E] mb-6">
            Perfect for first-time clients or maintenance
          </p>
          <ul className="mb-6">
            <li className="flex items-start gap-2 mb-2">
              <svg className="w-5 h-5 text-[#63D5F9]">{/* Checkmark */}</svg>
              <span className="text-[14px]">Full-body energy healing</span>
            </li>
            {/* More features */}
          </ul>
          <a
            href="/book?package=60min"
            className="w-full inline-flex items-center justify-center rounded-full h-[48px] bg-[#0205B7] text-white hover:bg-[#0104A0] transition-colors"
            style={{
              fontFamily: "Figtree, sans-serif",
              fontSize: "16px",
              fontWeight: 500,
            }}
          >
            Book Now
          </a>
        </div>
      </div>

      {/* Repeat for other packages */}
    </div>
  </section>
</AnimatedSection>
```

### 8. Testimonials section

**Reuse existing component**:

```tsx
<AnimatedSection animation="fadeInUp" delay={0.3}>
  <Testimonials
    heading="What Our Clients Say"
    testimonials={
      [
        // Filter testimonials by service type if needed
      ]
    }
  />
</AnimatedSection>
```

**Pattern**: No modification needed, component is fully built

### 9. FAQ section

**New Component Pattern**:

```tsx
<AnimatedSection animation="fadeIn" delay={0.4}>
  <section className="py-20">
    <h2
      className="text-[48px] font-bold text-center mb-12"
      style={{ fontFamily: "Figtree, sans-serif" }}
    >
      Frequently Asked Questions
    </h2>

    <div className="max-w-3xl mx-auto space-y-4">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="bg-white rounded-[20px] p-6 transition-all duration-300 hover:shadow-lg"
          style={{ border: "1px solid #E0E0E0" }}
        >
          <button
            className="w-full flex items-center justify-between text-left"
            onClick={() => toggleFaq(index)}
          >
            <h3
              className="text-[22px] font-semibold text-[#333333]"
              style={{ fontFamily: "Figtree, sans-serif" }}
            >
              {faq.question}
            </h3>
            <svg
              className={`w-6 h-6 text-[#0205B7] transition-transform ${openIndex === index ? "rotate-180" : ""}`}
            >
              {/* Chevron icon */}
            </svg>
          </button>

          {openIndex === index && (
            <div
              className="mt-4 text-[16px] text-[#5E5E5E]"
              style={{ fontFamily: "Figtree, sans-serif", lineHeight: "24px" }}
            >
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  </section>
</AnimatedSection>
```

### 10. Final CTA section

**Reuse BookSessionCTA**:

```tsx
<AnimatedSection animation="fadeIn" delay={0.5}>
  <div className="pb-20">
    <BookSessionCTA />
  </div>
</AnimatedSection>
```

**Pattern**: Identical to Contact and Homepage usage

### 11. Smoke effects

**Strategic Placement**:

```tsx
{
  /* Left smoke behind service details */
}
<div
  className="absolute opacity-20 pointer-events-none"
  style={{
    left: "0",
    top: "100px",
    width: "810px",
    height: "810px",
    backgroundImage: `url('/img/smoke.png')`,
    backgroundSize: "cover",
    transform: "rotate(180deg)",
    zIndex: 1,
  }}
/>;

{
  /* Right smoke behind pricing */
}
<div
  className="absolute opacity-20 pointer-events-none"
  style={{
    right: "0",
    top: "800px",
    width: "810px",
    height: "810px",
    backgroundImage: `url('/img/smoke.png')`,
    backgroundSize: "cover",
    zIndex: 1,
  }}
/>;
```

**Recommendation**: 2-3 smoke effects throughout the page, alternating sides

### 12. Animation delays

**Recommended Sequence**:

```tsx
Hero: delay={0} or no animation (immediate)
Services Grid: delay={0.1}
Service Detail 1: delay={0.1}
Service Detail 2: delay={0.1}
Pricing: delay={0.2}
Testimonials: delay={0.3}
FAQ: delay={0.4}
CTA: delay={0.5}
```

**Pattern**: Keep delays minimal (0.1-0.5s range)

### 13. Accessibility requirements

**Mandatory Additions**:

```tsx
// ARIA labels for interactive elements
<button aria-label="Toggle FAQ answer" aria-expanded={isOpen}>

// Alt text for all images
<img src="/img/service.jpg" alt="Reiki healing session in progress" />

// Keyboard navigation for accordions
onKeyDown={(e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    toggleFaq(index);
  }
}}

// Focus states
:focus {
  outline: 2px solid #0205B7;
  outline-offset: 2px;
}
```

**From Style Guide** (`docs/design/style-guide.md:583-612`)

### 14. Responsive considerations

**Mobile Adjustments**:

```tsx
// Hero heading size
className = "text-4xl sm:text-5xl lg:text-[63.55px]";

// Service details grid
className = "grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12";

// Card padding
className = "p-4 sm:p-6 lg:p-8";

// Button full-width on mobile
className = "w-full sm:w-auto";
```

**Breakpoints** (from style guide):

- Mobile: `< 768px`
- Tablet: `768px - 1024px`
- Desktop: `> 1024px`

### 15. TypeScript interfaces

**Recommended Structure**:

```tsx
// packages/shared-components/src/pages/ServicesPage.tsx

export interface ServiceDetail {
  id: string;
  name: string;
  description: string;
  benefits: string[];
  duration: string;
  price: number;
  image: {
    src: string;
    alt: string;
  };
  href: string;
}

export interface PricingPackage {
  id: string;
  name: string;
  duration: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
  href: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface ServicesPageProps {
  className?: string;
  services?: ServiceDetail[];
  packages?: PricingPackage[];
  faqs?: FAQ[];
}
```

### 16. File structure

**Recommended Organization**:

```
packages/shared-components/src/
├── pages/
│   ├── ServicesPage.tsx          # Main page component
│   └── ServicesPage.test.tsx     # Tests
├── ServiceDetailSection/          # New component
│   ├── ServiceDetailSection.tsx
│   └── ServiceDetailSection.test.tsx
├── PricingSection/                # New component
│   ├── PricingSection.tsx
│   └── PricingSection.test.tsx
├── FAQSection/                    # New component
│   ├── FAQSection.tsx
│   └── FAQSection.test.tsx
└── index.ts                       # Export new components
```

**Pattern**: Follow existing component structure conventions

### 17. Testing strategy

**Required Tests**:

```tsx
describe("ServicesPage", () => {
  it("renders all service sections", () => {});
  it("displays pricing packages", () => {});
  it("toggles FAQ answers on click", () => {});
  it("navigates to booking page with service param", () => {});
  it("animates sections on scroll", () => {});
  it("is keyboard accessible", () => {});
  it("matches Figma design specifications", () => {});
});
```

**Pattern**: Test component rendering, interactions, and accessibility

### 18. Performance optimizations

**Lazy Loading**:

```tsx
import { LazyImage } from "@reiki-goddess/shared-components";

<LazyImage
  src="/img/large-service-photo.jpg"
  alt="Service description"
  className="rounded-[20px]"
/>;
```

**Image Optimization**:

- Use WebP format
- Provide srcset for responsive images
- Lazy load images below fold

### 19. Data management

**Recommended Approach**:

```tsx
// packages/shared-components/src/pages/ServicesPage.tsx

const DEFAULT_SERVICES: ServiceDetail[] = [
  {
    id: "reiki-60",
    name: "Reiki Healing Session (60 min)",
    description: "Experience deep relaxation...",
    // ... full service data
  },
  // More services
];

export const ServicesPage: React.FC<ServicesPageProps> = ({
  services = DEFAULT_SERVICES,
  packages = DEFAULT_PACKAGES,
  faqs = DEFAULT_FAQS,
}) => {
  // Component implementation
};
```

**Pattern**: Provide default data, allow props to override

### 20. Color consistency checklist

**Verify All Elements Use**:

- [ ] Background: `#FFFBF5` (Cream)
- [ ] Primary Blue: `#0205B7` (CTAs, headings, links)
- [ ] Cyan Accents: `#63D5F9` (hover, highlights)
- [ ] Dark Text: `#333333` (headings)
- [ ] Gray Text: `#5E5E5E` (body copy)
- [ ] White: `#FFFFFF` (overlays, cards)

**Font Family**: `Figtree, Helvetica, sans-serif` on ALL text elements

### 21. Component reuse matrix

**Reuse Without Modification**:

- ✅ AnimatedSection
- ✅ BookSessionCTA
- ✅ Testimonials
- ✅ PageTransition

**Reuse with Extended Props**:

- 🔧 ServicesSection (expand services array)
- 🔧 LetsConnect (customize heading/content)

**Create New Components**:

- ➕ ServiceDetailSection
- ➕ PricingSection
- ➕ FAQSection

### 22. Design system compliance

**Mandatory Patterns**:

1. ✅ Use 66px side padding on main container
2. ✅ Wrap all sections in AnimatedSection
3. ✅ Apply blue bevel effect to cards
4. ✅ Use 20px border radius on cards
5. ✅ Use 30px border radius on large sections
6. ✅ Include hover states on all interactive elements
7. ✅ Add decorative corner dots on CTA sections
8. ✅ Apply 35% blue overlay on background images
9. ✅ Use smoke effects for visual interest
10. ✅ Follow responsive grid patterns

### 23. Integration with existing routes

**Update AppLayout Navigation**:

**File**: `packages/shared-components/src/AppLayout/AppLayout.tsx:28-30`

```tsx
{
  label: "Services",
  href: "/services",
  isActive: location.pathname === "/services",
},
```

**Already Configured** - No changes needed

### 24. SEO and metadata

**Recommended Meta Tags**:

```tsx
<Helmet>
  <title>Healing Services | The Reiki Goddess Healing</title>
  <meta
    name="description"
    content="Discover transformative energy healing services including Reiki, sound therapy, aura readings, and distance healing sessions in Roy, WA."
  />
  <meta
    name="keywords"
    content="Reiki, energy healing, sound therapy, aura reading, Roy WA, wellness services"
  />
</Helmet>
```

### 25. Final recommendations summary

**Implementation Priority**:

1. **Phase 1** (Core Structure):
   - Create ServicesPage component with container pattern
   - Add simplified hero section
   - Integrate existing ServicesSection with expanded data
   - Add BookSessionCTA at bottom

2. **Phase 2** (Service Details):
   - Create ServiceDetailSection component
   - Add 3-4 detailed service sections with alternating layouts
   - Implement smoke effects and blue bevels

3. **Phase 3** (Pricing & Social Proof):
   - Create PricingSection component
   - Integrate Testimonials component
   - Add service-specific testimonials filter

4. **Phase 4** (Support Content):
   - Create FAQSection component
   - Add accordion functionality
   - Implement keyboard navigation

5. **Phase 5** (Polish & Testing):
   - Add animations and delays
   - Test responsive behavior
   - Verify accessibility
   - Performance optimization

**Estimated Component Count**:

- **Reused**: 5 components (AnimatedSection, ServicesSection, Testimonials, BookSessionCTA, PageTransition)
- **New**: 3 components (ServiceDetailSection, PricingSection, FAQSection)
- **Total**: 8 components for full Services page

**Code Reuse Percentage**: ~62% (5/8 components fully reusable)

---

## Related documents

- [Style Guide](/docs/design/style-guide.md) - Brand colors, typography, spacing
- [Architecture Guide](/docs/project/ARCHITECTURE.md) - Technical patterns and conventions
- [Testing Strategy](/docs/testing/testing-strategy.md) - Testing approach and requirements
- [Migration Guide](/docs/MIGRATION_GUIDE.md) - Phase 4 completion status

---

**Document Status**: Complete
**Last Updated**: 2025-10-15
**Total Patterns Extracted**: 30
**Source Files Analyzed**: 15
**Production-Ready**: Yes
