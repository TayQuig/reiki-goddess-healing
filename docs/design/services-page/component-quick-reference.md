# Services Page Component Quick Reference

> **Quick lookup guide for component props and usage patterns**

---

## Essential Components for Services Page

### 1. ServicesSection ⭐ PRIMARY COMPONENT

```typescript
import { ServicesSection } from '@reiki-goddess/shared-components';

<ServicesSection
  heading="Explore Healing Services"  // Optional
  services={[                         // Optional, has defaults
    {
      id: "reiki",
      icon: <img src="/img/icon.svg" alt="Reiki" />,
      title: "Reiki Healing Sessions",
      duration: "(60/90 min)",       // Optional
      description: "...",             // Optional
      href: "/services/reiki"         // Optional, defaults to "#"
    }
  ]}
  className=""                        // Optional
/>
```

**Default Behavior**: Renders 4 default services if no props provided

**Visual**: Blue bevel cards, gradient hover, responsive 1/2/4 column grid

---

### 2. HeroV2 - Page Hero

```typescript
import { HeroV2 } from '@reiki-goddess/shared-components';

<HeroV2
  backgroundImage={{
    src: "/img/hero-bg.png",
    alt: "Healing session"
  }}
  overlayContent={{
    heading: "Healing Services",
    subheading: "Transformative energy healing...",
    buttons: [
      { text: "Book a Session", variant: "primary", href: "/book" },
      { text: "Learn More", variant: "secondary", href: "/about" }
    ]
  }}
/>
```

**Visual**: 825px height, centered overlay, glass-effect buttons

---

### 3. BookSessionCTA - Bottom CTA

```typescript
import { BookSessionCTA } from '@reiki-goddess/shared-components';

<BookSessionCTA />
```

**Visual**: Blue card with shadow, "Ready to Begin Your Healing Journey?" heading

**No props needed** - fully self-contained!

---

### 4. AnimatedSection - Scroll Animations

```typescript
import { AnimatedSection } from '@reiki-goddess/shared-components';

<AnimatedSection
  animation="fadeInUp"     // or: fadeIn, slideInLeft, slideInRight, scaleIn
  delay={0.2}              // seconds
  threshold={0.1}          // visibility threshold
>
  <YourComponent />
</AnimatedSection>
```

---

### 5. FeaturesBar - Service Benefits

```typescript
import { FeaturesBar } from '@reiki-goddess/shared-components';

<FeaturesBar
  features={[
    {
      icon: <svg>...</svg>,
      title: "Female-Owned",
      description: "Practice"  // Optional
    }
  ]}
/>
```

**Default**: Shows 4 practice features (Female-Owned, By Appointment, All Ages, Trauma-Informed)

---

### 6. Testimonials - Social Proof

```typescript
import { Testimonials } from '@reiki-goddess/shared-components';

<Testimonials
  heading="Real Healing. Real People. Real Stories."
  testimonials={[
    {
      id: "1",
      name: "Jessica M.",
      location: "Tacoma, WA",
      content: "I had no idea how deeply...",
      rating: 5,
      image: { src: "/img/testimonial.jpg", alt: "Jessica" }
    }
  ]}
/>
```

**Visual**: Social card, event flyers, carousel viewer

---

### 7. CommunityEvents - Related Workshops

```typescript
import { CommunityEvents } from '@reiki-goddess/shared-components';

<CommunityEvents
  heading="Upcoming Events &"
  subheading="Community Highlights"
  events={[
    {
      id: "full-moon",
      title: "Full Moon Aerial Sound Bath",
      image: { src: "/img/event.png", alt: "Event" },
      date: "Next Full Moon",
      description: "..."
    }
  ]}
  ctaButton={{
    text: "View Full Calendar",
    href: "/events"
  }}
/>
```

**Visual**: Blue overlay background, white event cards, pagination dots

---

### 8. ResponsiveContainer - Section Wrapper

```typescript
import { ResponsiveContainer } from '@reiki-goddess/shared-components';

<ResponsiveContainer variant="page">  // or: full, content
  <YourContent />
</ResponsiveContainer>
```

**Variants**:

- `full`: Full width with padding
- `page`: max-w-7xl (default)
- `content`: max-w-4xl

---

### 9. LazyImage - Optimized Images

```typescript
import { LazyImage } from '@reiki-goddess/shared-components';

<LazyImage
  src="/img/service-photo.jpg"
  alt="Reiki session"
  className="rounded-lg"
  placeholderColor="#E5E5E5"  // Optional
  onLoad={() => console.log('Loaded')}
  onError={() => console.log('Error')}
/>
```

**Features**: Intersection observer, loading spinner, error state

---

## Complete Services Page Template

```typescript
// apps/main/src/pages/Services.tsx
import {
  ServicesSection,
  BookSessionCTA,
  AnimatedSection,
  ResponsiveContainer,
  HeroV2,
  FeaturesBar,
  Testimonials,
  CommunityEvents,
} from '@reiki-goddess/shared-components';
import PageTransition from '../components/PageTransition';

export default function Services() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-[#FFFBF5]">
        {/* Hero */}
        <HeroV2
          backgroundImage={{
            src: "/img/services-hero.png",
            alt: "Energy healing services"
          }}
          overlayContent={{
            heading: "Healing Services",
            subheading: "Discover transformative energy healing for optimal mental health and wellness.",
            buttons: [
              { text: "Book a Session", variant: "primary", href: "/book" }
            ]
          }}
        />

        {/* Service Benefits */}
        <AnimatedSection animation="fadeInUp" delay={0.1}>
          <FeaturesBar />
        </AnimatedSection>

        {/* Main Services Grid */}
        <AnimatedSection animation="fadeIn" delay={0.2}>
          <ServicesSection />
        </AnimatedSection>

        {/* Testimonials */}
        <AnimatedSection animation="fadeInUp" delay={0.1}>
          <Testimonials />
        </AnimatedSection>

        {/* Related Events */}
        <AnimatedSection animation="scaleIn" delay={0.1}>
          <ResponsiveContainer>
            <CommunityEvents />
          </ResponsiveContainer>
        </AnimatedSection>

        {/* Bottom CTA */}
        <AnimatedSection animation="fadeInUp" delay={0.3}>
          <div className="max-w-[1440px] mx-auto px-[66px] py-[161px]">
            <BookSessionCTA />
          </div>
        </AnimatedSection>
      </div>
    </PageTransition>
  );
}
```

---

## Color Tokens Quick Reference

```typescript
// Use these exact values for consistency

const colors = {
  brandBlue: "#0205B7", // Primary actions, borders
  lightBlue: "#63D5F9", // Accents, highlights
  cream: "#FFFBF5", // Page background
  gold: "#C4A962", // Brand accent
  blackText: "#000000", // Headings
  grayText: "#5E5E5E", // Body text
  white: "#FFFFFF", // Cards, buttons
};
```

---

## Spacing Tokens

```typescript
const spacing = {
  pageMargin: "66px", // Horizontal page margins
  sectionPadding: "80px", // Vertical section padding
  cardGap: "32px", // Grid gap between cards
  borderRadius: "20px", // Large elements
  borderRadiusSmall: "17px", // Small cards
};
```

---

## Typography Tokens

```typescript
const typography = {
  pageHeading: { font: "Figtree", size: "63.55px", weight: 700 },
  sectionHeading: { font: "Figtree", size: "48px", weight: 700 },
  cardTitle: { font: "Figtree", size: "18-22px", weight: 600 },
  bodyText: { font: "Figtree", size: "16-18px", weight: 400 },
  navLink: { font: "Figtree", size: "16px", weight: 500 },
};
```

---

## Animation Variants

```typescript
// Use with AnimatedSection

const animations = {
  fadeInUp: "Elements slide up while fading in",
  fadeIn: "Simple fade in",
  slideInLeft: "Slide from left",
  slideInRight: "Slide from right",
  scaleIn: "Scale up from center",
};

// Recommended delays for staggered animations
const delays = {
  first: 0.1,
  second: 0.2,
  third: 0.3,
  cta: 0.4,
};
```

---

## Responsive Breakpoints

```typescript
// Tailwind breakpoints used across components

const breakpoints = {
  sm: "640px", // Mobile landscape
  md: "768px", // Tablet
  lg: "1024px", // Desktop
  xl: "1280px", // Large desktop
  "2xl": "1440px", // Max content width
};
```

---

## Common Patterns

### Pattern 1: Section with Animation

```typescript
<AnimatedSection animation="fadeInUp" delay={0.2}>
  <SectionComponent />
</AnimatedSection>
```

### Pattern 2: Responsive Container

```typescript
<ResponsiveContainer variant="page">
  <div className="py-20">
    {/* Content */}
  </div>
</ResponsiveContainer>
```

### Pattern 3: Blue Bevel Card Effect

```css
/* Used in ServicesSection, ContactInfoCard */
.card {
  position: relative;
}

.card::before {
  content: "";
  position: absolute;
  inset: 0;
  background-color: #0205b7;
  border-radius: 20px;
  transform: translateY(5-10px);
  z-index: 0;
}
```

### Pattern 4: Hover Transform

```typescript
className = "transition-all duration-300 transform hover:-translate-y-2";
```

---

## Testing Quick Reference

### Basic Component Test

```typescript
import { render, screen } from '@testing-library/react';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('should render', () => {
    render(<ComponentName />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('should accept custom className', () => {
    const { container } = render(<ComponentName className="custom" />);
    expect(container.firstChild).toHaveClass('custom');
  });
});
```

### Hover Test

```typescript
import { fireEvent } from '@testing-library/react';

it('should change on hover', () => {
  render(<Component />);
  const element = screen.getByRole('button');

  fireEvent.mouseEnter(element);
  expect(element).toHaveStyle('background-color: #0205B7');

  fireEvent.mouseLeave(element);
  expect(element).toHaveStyle('background-color: transparent');
});
```

---

## Performance Tips

1. **Use LazyImage** for all images over 100KB
2. **Wrap sections in AnimatedSection** for better perceived performance
3. **Limit initial renders**: Use default props sparingly
4. **Lazy load routes**: Already configured in App.tsx
5. **Optimize images**:
   - Hero images: 1920x1080px, 80% quality
   - Service cards: 400x400px, 90% quality
   - Thumbnails: 200x200px, 85% quality

---

## Accessibility Checklist

- ✅ Use semantic HTML (`<section>`, `<article>`, `<nav>`)
- ✅ Proper heading hierarchy (h1 → h2 → h3)
- ✅ Alt text for all images
- ✅ ARIA labels where needed
- ✅ Keyboard navigation support
- ✅ Focus states on interactive elements
- ✅ Sufficient color contrast (4.5:1 minimum)

---

**Last Updated**: 2025-10-15
**For**: Services Page Implementation
