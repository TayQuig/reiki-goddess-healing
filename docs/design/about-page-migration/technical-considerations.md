# About Page Migration - Technical Considerations

**Document Purpose**: Comprehensive pattern analysis from Contact Page and other successful migrations to guide About Page implementation.

**Last Updated**: 2025-10-06
**Primary Reference**: Contact Page Migration (docs/testing/migrations/ContactPageMigration.md)
**Architecture Reference**: docs/project/ARCHITECTURE.md

---

## Table of Contents

1. [Successfully Applied Patterns from Contact Page](#successfully-applied-patterns-from-contact-page)
2. [Page Structure Patterns](#page-structure-patterns)
3. [Component Composition Patterns](#component-composition-patterns)
4. [Security Patterns (If Forms Needed)](#security-patterns-if-forms-needed)
5. [Animation & Performance Patterns](#animation--performance-patterns)
6. [Testing Patterns](#testing-patterns)
7. [Accessibility Patterns](#accessibility-patterns)
8. [Identified Reusable Components](#identified-reusable-components)
9. [Recommendations for About Page](#recommendations-for-about-page)
10. [Migration Checklist](#migration-checklist)

---

## Successfully Applied Patterns from Contact Page

### Pattern 1: PageTransition Integration

**Location**: `/apps/main/src/pages/Contact.tsx:1-12`

**Implementation**:

```typescript
import { ContactPage } from "@reiki-goddess/shared-components";
import PageTransition from "../components/PageTransition";

function Contact() {
  return (
    <PageTransition>
      <ContactPage />
    </PageTransition>
  );
}

export default Contact;
```

**PageTransition Details**: `/apps/main/src/components/PageTransition.tsx:1-46`

```typescript
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.4, ease: "easeIn" },
  },
};
```

**Application to About Page**:

- Wrap AboutPage component with PageTransition in `/apps/main/src/pages/About.tsx`
- Use identical pattern for consistency
- 0.6s enter animation, 0.4s exit animation

---

### Pattern 2: AppLayout Integration with Header Overlay

**Location**: `/packages/shared-components/src/AppLayout/AppLayout.tsx:48-70`

**Implementation**:

```typescript
<div className="min-h-screen flex flex-col" style={{ backgroundColor: "#FFFBF5" }}>
  {/* Header with active navigation states - positioned absolutely to overlay content */}
  <div className="relative z-50" style={{ maxWidth: "1440px", margin: "0 auto" }}>
    <Header
      logo={{ src: "/img/Nav Bar Clickable Logo.png", alt: "The Reiki Goddess Healing" }}
      navigationItems={navigationItems}
    />
  </div>

  {/* Main content area - negative margin compensates for header */}
  <main className="flex-1" style={{ marginTop: "-93px" }}>
    <Outlet />
  </main>

  <Footer />
</div>
```

**Key Pattern**: Header Overlay with Negative Margin

- Header positioned with `z-50` for overlay
- Main content uses `marginTop: "-93px"` to allow hero content under header
- This creates seamless header/hero integration

**Application to About Page**:

- About Page already integrated into AppLayout via React Router (see `/apps/main/src/App.tsx:17-24`)
- Hero section should extend under the header
- Maintain 1440px max-width container

---

### Pattern 3: Component Organization & File Structure

**Contact Page Structure**: `/packages/shared-components/src/pages/ContactPage.tsx`

```
ContactPage.tsx (page composition)
├── Uses AnimatedSection wrapper
├── Uses ContactInfoCard (reusable component)
├── Uses FigmaContactForm (form-specific component)
├── Uses BookSessionCTA (reusable CTA)
├── Uses GoogleMapEmbed (reusable utility)
└── Imports from shared-components package
```

**Recommended About Page Structure**:

```
/packages/shared-components/src/
├── pages/
│   └── AboutPage.tsx           # Main composition
├── About/
│   ├── AboutHero/              # Hero section
│   ├── BiographySection/       # Deirdre's story
│   ├── Certifications/         # Credentials display
│   └── Philosophy/             # Healing approach
└── Testimonials/               # Reuse existing component
```

---

### Pattern 4: AnimatedSection for Scroll Animations

**Location**: `/packages/shared-components/src/pages/ContactPage.tsx:55-70, 73-84, 87-155`

**Implementation Pattern**:

```typescript
import { AnimatedSection } from "../AnimatedSection";

// Hero Section with no delay
<AnimatedSection>
  <div className="text-center pt-[193px] pb-20">
    <h1 className="text-[63.55px] font-bold text-black mb-[92px]">
      Get in Touch
    </h1>
  </div>
</AnimatedSection>

// Form Section with 0.1s delay
<AnimatedSection delay={0.1}>
  <div className="max-w-[1440px] mx-auto px-[66px]">
    <FigmaContactForm onSubmit={...} />
  </div>
</AnimatedSection>

// Contact Cards with 0.2s delay
<AnimatedSection delay={0.2}>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {/* Cards */}
  </div>
</AnimatedSection>
```

**AnimatedSection Component**: `/packages/shared-components/src/AnimatedSection/AnimatedSection.tsx:1-42`

```typescript
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
      ref={ref}
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

**Intersection Observer Hook**: `/packages/shared-components/src/hooks/useIntersectionObserver.tsx:1-55`

```typescript
export const useIntersectionObserver = ({
  threshold = 0.1,
  rootMargin = "0px",
  triggerOnce = true,
}: UseIntersectionObserverProps = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (triggerOnce && element) {
              observer.unobserve(element); // Auto-cleanup for performance
            }
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.unobserve(element);
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isVisible };
};
```

**Application to About Page**:

- Stagger section animations with 0.1s increments
- Use `fadeInUp` animation (default)
- Threshold of 0.1 (10% visible triggers animation)
- `triggerOnce: true` for performance (no re-animation on scroll)

---

### Pattern 5: Smoke/Decorative Effects

**Location**: `/packages/shared-components/src/pages/ContactPage.tsx:26-53, 89-124`

**Implementation**:

```typescript
{/* Smoke effect layers - positioned absolutely */}
{[...Array(10)].map((_, index) => (
  <div
    key={`left-smoke-${index}`}
    className="absolute opacity-10 pointer-events-none"
    style={{
      width: "992px",
      height: "722px",
      left: "-246px",
      top: "-100px",
      backgroundImage: `url('/img/smoke.png')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      zIndex: 1,
    }}
  />
))}
```

**Key Principles**:

- `pointer-events-none` to avoid blocking interactions
- Low opacity (0.1-0.2) for subtle effect
- Layering for vibrancy (10 layers at 10% opacity = 100% effective)
- Negative positioning for edge bleed
- `z-index: 1` below content but above background

**Application to About Page**:

- Consider smoke effects around hero
- Potential use behind biography section
- Maintain same layering approach for consistency

---

## Page Structure Patterns

### Standard Page Container Pattern

**From Contact Page**: `/packages/shared-components/src/pages/ContactPage.tsx:14-25`

```typescript
<div className="min-h-screen bg-[#FFFBF5] overflow-hidden relative">
  {/* Main Content - Elevated Container */}
  <div
    className="relative mx-auto overflow-hidden"
    style={{
      maxWidth: "1440px",
      margin: "0 auto",
      backgroundColor: "#FFFBF5",
      boxShadow: "0 0 40px rgba(0, 0, 0, 0.1)",
    }}
  >
    {/* Page sections here */}
  </div>
</div>
```

**Key Elements**:

- `min-h-screen` ensures full viewport height
- `bg-[#FFFBF5]` cream background (brand color)
- `maxWidth: 1440px` container constraint
- `overflow-hidden` contains decorative elements
- `boxShadow` adds subtle depth

---

### Hero Section Pattern

**From Contact Page**: `/packages/shared-components/src/pages/ContactPage.tsx:55-70`

```typescript
<AnimatedSection>
  <div className="text-center pt-[193px] pb-20">
    <h1
      className="text-[63.55px] font-bold text-black mb-[92px]"
      style={{ fontFamily: "Figtree, sans-serif" }}
    >
      Get in Touch
    </h1>
    <p
      className="text-[16px] font-medium text-[#1C1B1B]"
      style={{ fontFamily: "Figtree, sans-serif" }}
    >
      Have questions or want to book a session? We're here to help.
    </p>
  </div>
</AnimatedSection>
```

**Typography Pattern**:

- Heading: `63.55px`, `font-bold`, `Figtree`
- Subtitle: `16px`, `font-medium`, `Figtree`
- Top padding: `193px` (accounts for header overlay)
- Bottom margin on heading: `92px`

**Application to About Page**:

- Hero: "About The Reiki Goddess" or "Meet Deirdre"
- Subtitle describing healing journey/philosophy
- Consider hero image background (as seen in legacy About)

---

### Section Spacing Pattern

**Universal Padding**: `66px` horizontal (from style guide)

**Examples from Contact Page**:

```typescript
// Form section
<div className="max-w-[1440px] mx-auto px-[66px]">
  <div className="max-w-[1241px] mx-auto">
    <FigmaContactForm />
  </div>
</div>

// Contact cards section
<div className="max-w-[1440px] mx-auto px-[66px] mt-[200px] mb-20">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {/* Cards */}
  </div>
</div>

// CTA section
<div className="max-w-[1440px] mx-auto px-[66px] py-[161px]">
  <BookSessionCTA />
</div>
```

**Spacing Guidelines**:

- Horizontal padding: `66px` (desktop standard)
- Top margin between sections: `200px` for major sections
- Vertical padding for CTA sections: `161px`
- Grid gaps: `8` (32px) for card layouts

---

## Component Composition Patterns

### Reusable Card Component Pattern

**ContactInfoCard**: `/packages/shared-components/src/ContactInfoCard/ContactInfoCard.tsx:1-93`

**Interface**:

```typescript
export interface ContactInfoCardProps {
  icon: string;
  title: string;
  content: string;
  ctaText: string;
  ctaLink: string;
  className?: string;
}
```

**Implementation Highlights**:

```typescript
<div className="relative group">
  {/* Blue background rectangle - shifted down 10px for bevel effect */}
  <div
    className="absolute inset-0"
    style={{
      backgroundColor: "#0205B7",
      borderRadius: "17px",
      transform: "translateY(10px)",
      zIndex: 0,
    }}
  />

  {/* Card content - white background, elevated */}
  <div
    className="relative bg-white rounded-[17px] h-[156px] transition-transform duration-300 group-hover:-translate-y-1"
    style={{
      boxShadow: "0px 42px 32.5px -13px rgba(0, 0, 0, 0.16)",
      zIndex: 1,
    }}
  >
    {/* Title */}
    <h3 className="absolute left-[25px] top-[26px] text-[18px] font-bold text-black">
      {title}
    </h3>

    {/* Icon and content - centered */}
    <div className="absolute flex items-center gap-3 top-[65px]"
         style={{ left: "50%", transform: "translateX(-50%)" }}>
      <img src={icon} alt="" className="w-6 h-6" />
      <p className="text-[16px] text-black whitespace-nowrap">{content}</p>
    </div>

    {/* CTA Link with arrow */}
    <a href={ctaLink} className="absolute left-[25px] top-[113px] flex items-center gap-2.5 hover:gap-3 transition-all">
      <span>{ctaText}</span>
      <img src="/images/gridicons_arrow-up.svg" className="w-5 h-5 rotate-45" />
    </a>
  </div>
</div>
```

**Key Features**:

- **Bevel Effect**: Background shifted 10px for 3D appearance
- **Hover Animation**: Card lifts on hover (`-translate-y-1`)
- **Absolute Positioning**: All internal elements positioned precisely
- **Brand Colors**: Blue (#0205B7) background, white card
- **Accessibility**: External links open in new tab with `rel="noopener noreferrer"`

**Adaptation for About Page**:

- Could be used for credentials/certifications display
- Adapt for team member cards
- Maintain bevel effect for brand consistency

---

### Form Component Pattern (FigmaContactForm)

**Location**: `/packages/shared-components/src/FigmaContactForm/FigmaContactForm.tsx:1-565`

**Key Structural Patterns**:

1. **Split Name Fields**:

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 gap-[38px] mb-[30px]">
  {/* First Name */}
  <div className="flex flex-col gap-4">
    <label htmlFor="firstName" className="text-[24px] font-bold text-black">
      First Name <span className="text-red-500">*</span>
    </label>
    <input
      type="text"
      id="firstName"
      name="firstName"
      className="w-full px-6 py-6 bg-white border rounded-[12px] text-[24px]"
      aria-invalid={!!errors.firstName}
      aria-describedby={errors.firstName ? "firstName-error" : undefined}
    />
  </div>
  {/* Last Name - optional */}
</div>
```

2. **Validation on Blur**:

```typescript
const handleBlur = useCallback(
  (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const error = validateField(name as keyof FigmaContactFormData, value);
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  },
  [validateField]
);
```

3. **Error Display Pattern**:

```typescript
{errors.firstName && (
  <p id="firstName-error" className="mt-2 text-sm text-red-600">
    {errors.firstName}
  </p>
)}
```

4. **Success/Error Feedback**:

```typescript
{submitSuccess && (
  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
    <p className="text-green-800 font-medium">Thank you for your message!</p>
  </div>
)}

{errors.general && (
  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
    <p className="text-red-800 text-sm">{errors.general}</p>
  </div>
)}
```

**Application to About Page**:

- About Page may not need forms
- If adding newsletter signup or inquiry form, use this pattern
- Maintain identical styling for consistency

---

## Security Patterns (If Forms Needed)

### Multi-Layered Security Validation

**Location**: `/packages/shared-utils/src/security/SecurityValidator.ts:1-100+`

**Pattern Overview**:

```typescript
export class SecurityValidator {
  // Industry-specific forbidden terms (liability protection)
  private static readonly forbiddenHealthTerms =
    /\b(diagnosis|prescription|medication|cure|treat|medical|doctor|physician|disease|illness|condition)\b/i;

  // SQL injection patterns
  private static readonly sqlInjectionPattern =
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|CREATE|ALTER|EXEC|EXECUTE)\b|--|\/\*|\*\/|;|'|"|`|xp_|sp_)/i;

  // XSS attack patterns
  private static readonly xssPattern =
    /<[^>]*>|javascript:|on\w+\s*=|eval\(|expression\(|vbscript:|data:text\/html/i;

  static validateContactFormField(
    fieldName: string,
    value: string
  ): ValidationResult {
    const risks: Risk[] = [];

    // Check for medical terms (HIGH risk - liability)
    if (this.forbiddenHealthTerms.test(value)) {
      risks.push({
        level: "HIGH",
        type: "MEDICAL_TERMS",
        message:
          "Please avoid medical terminology. We provide wellness services, not medical treatment.",
      });
    }

    // SQL injection detection
    if (this.sqlInjectionPattern.test(value)) {
      risks.push({
        level: "HIGH",
        type: "SQL_INJECTION",
        message: "Invalid characters detected. Please use only standard text.",
      });
    }

    // XSS prevention
    if (this.xssPattern.test(value)) {
      risks.push({
        level: "HIGH",
        type: "XSS_ATTEMPT",
        message: "Invalid formatting detected. Please use plain text only.",
      });
    }

    const sanitized = this.sanitizeInput(value);

    return {
      isValid: risks.filter((r) => r.level === "HIGH").length === 0,
      risks,
      sanitizedValue: sanitized,
      riskLevel: this.calculateOverallRisk(risks),
    };
  }
}
```

**Integration in Form**: `/packages/shared-components/src/FigmaContactForm/FigmaContactForm.tsx:62-128`

```typescript
const validateField = useCallback(
  (
    name: keyof FigmaContactFormData,
    value: string | boolean
  ): string | undefined => {
    let result: ValidationResult;

    switch (name) {
      case "email":
        result = SecurityValidator.validateEmail(value as string);
        break;
      case "phone":
        result = SecurityValidator.validatePhone(value as string);
        break;
      case "firstName":
        if (!value) return "First name is required";
        result = SecurityValidator.validateContactFormField(
          "name",
          value as string
        );
        break;
      case "message":
        result = SecurityValidator.validateContactFormField(
          name,
          value as string
        );
        break;
    }

    if (!result.isValid && result.risks.length > 0) {
      // Log security incidents
      result.risks.forEach((risk: Risk) => {
        if (risk.level === "HIGH") {
          monitor.current.log(risk.type, {
            field: name,
            value: (value as string).substring(0, 50) + "...",
            message: risk.message,
          });
        }
      });

      const highRisk = result.risks.find((r) => r.level === "HIGH");
      return highRisk?.message || result.risks[0]?.message;
    }

    return undefined;
  },
  []
);
```

**Application to About Page**:

- Only needed if About Page includes forms (newsletter, contact, etc.)
- If no forms: Skip security patterns
- If forms exist: Import and use identical SecurityValidator patterns
- Maintain wellness-specific medical term blocking

---

### Rate Limiting Pattern

**Location**: Form submission in FigmaContactForm

```typescript
// Check rate limit before submission
const rateLimitCheck = rateLimit.current.checkLimit();
if (!rateLimitCheck.allowed) {
  setErrors({
    general: rateLimitCheck.message,
  });
  monitor.current.log("RATE_LIMIT_EXCEEDED", {
    remainingTime: rateLimitCheck.timeUntilReset,
  });
  return;
}

// After successful submission
rateLimit.current.record();
```

**FormRateLimit Pattern**: From ARCHITECTURE.md

```typescript
export class FormRateLimit {
  private static readonly MAX_SUBMISSIONS = 3;
  private static readonly TIME_WINDOW_MS = 60 * 60 * 1000; // 1 hour

  static canSubmit(): { allowed: boolean; timeUntilReset?: number } {
    const now = Date.now();
    const submissions = this.getSubmissions();
    const recentSubmissions = submissions.filter(
      (time) => now - time < this.TIME_WINDOW_MS
    );

    if (recentSubmissions.length >= this.MAX_SUBMISSIONS) {
      const oldestSubmission = Math.min(...recentSubmissions);
      const timeUntilReset = oldestSubmission + this.TIME_WINDOW_MS - now;
      return {
        allowed: false,
        timeUntilReset: Math.ceil(timeUntilReset / 1000 / 60), // minutes
      };
    }

    return { allowed: true };
  }
}
```

**Application to About Page**:

- Only implement if forms are present
- 3 submissions per hour limit
- User-friendly feedback with countdown

---

## Animation & Performance Patterns

### Intersection Observer Performance Pattern

**Hook Implementation**: `/packages/shared-components/src/hooks/useIntersectionObserver.tsx:13-54`

```typescript
export const useIntersectionObserver = ({
  threshold = 0.1,
  rootMargin = "0px",
  triggerOnce = true, // KEY: Performance optimization
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
              observer.unobserve(element); // Auto-cleanup after first trigger
            }
          } else if (!triggerOnce) {
            setIsVisible(false);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    // Cleanup on unmount
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isVisible };
};
```

**Performance Benefits**:

- `triggerOnce: true` - Stops observing after first intersection
- Automatic cleanup prevents memory leaks
- Threshold 0.1 means animation starts when 10% visible
- No re-renders after initial animation

**Application to About Page**:

- Use for all AnimatedSection components
- Stagger delays: Hero (0s), Bio (0.1s), Certifications (0.2s), etc.
- Keep `triggerOnce: true` for optimal performance

---

### CSS Animation Classes Pattern

**From AnimatedSection Component**:

```typescript
<div
  ref={ref}
  className={`${className} ${isVisible ? `animate-${animation}` : "opacity-0"}`}
  style={{
    animationDelay: `${delay}s`,
    animationFillMode: "both",
  }}
>
  {children}
</div>
```

**Available Animations**:

- `fadeInUp` (default)
- `fadeIn`
- `slideInLeft`
- `slideInRight`
- `scaleIn`

**CSS Implementation** (in Tailwind config):

```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**Application to About Page**:

- Hero: `fadeInUp` with 0s delay
- Biography: `fadeInUp` or `slideInLeft` with 0.1s delay
- Certifications: `scaleIn` with 0.2s delay
- Philosophy: `fadeInUp` with 0.3s delay

---

## Testing Patterns

### Component Test Structure

**From ContactPage.test.tsx**: `/packages/shared-components/src/pages/ContactPage.test.tsx:1-256`

**Test Organization**:

```typescript
describe("ContactPage", () => {
  describe("Rendering", () => {
    it("should render main heading and subtitle", () => {
      render(<ContactPage />);
      expect(screen.getByText("Get in Touch")).toBeInTheDocument();
    });

    it("should render contact form", () => {
      render(<ContactPage />);
      expect(screen.getByTestId("figma-contact-form")).toBeInTheDocument();
    });
  });

  describe("Styling", () => {
    it("should have cream background", () => {
      const { container } = render(<ContactPage />);
      const pageWrapper = container.firstChild;
      expect(pageWrapper).toHaveClass("min-h-screen", "bg-[#FFFBF5]");
    });

    it("should apply correct typography to heading", () => {
      render(<ContactPage />);
      const heading = screen.getByText("Get in Touch");
      expect(heading).toHaveClass("text-[63.55px]", "font-bold", "text-black");
      expect(heading).toHaveStyle({ fontFamily: "Figtree, sans-serif" });
    });
  });

  describe("Layout", () => {
    it("should apply correct spacing", () => {
      const { container } = render(<ContactPage />);
      const containers = container.querySelectorAll(".px-\\[66px\\]");
      expect(containers.length).toBeGreaterThan(0);
    });
  });

  describe("Accessibility", () => {
    it("should have proper heading hierarchy", () => {
      render(<ContactPage />);
      const h1 = screen.getByRole("heading", { level: 1 });
      expect(h1).toHaveTextContent("Get in Touch");
    });
  });
});
```

**Test Categories** (40+ tests for Contact Page):

1. **Rendering**: All elements present
2. **Styling**: Figma-accurate classes and inline styles
3. **Layout**: Spacing, grid, responsive breakpoints
4. **Accessibility**: ARIA attributes, heading hierarchy
5. **Functionality**: Form validation, security (if applicable)

---

### Mock Component Pattern

**From ContactPage.test.tsx**:

```typescript
// Mock child components to isolate page logic
vi.mock("../AnimatedSection", () => ({
  AnimatedSection: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock("../ContactInfoCard", () => ({
  ContactInfoCard: ({ title, content }: { title: string; content: string }) => (
    <div data-testid="contact-info-card">
      <h3>{title}</h3>
      <p>{content}</p>
    </div>
  ),
}));

vi.mock("../FigmaContactForm", () => ({
  FigmaContactForm: () => (
    <form data-testid="figma-contact-form">Contact Form</form>
  ),
}));
```

**Benefits**:

- Isolates page-level logic
- Faster test execution
- Focuses on composition, not child component internals
- Uses `data-testid` for reliable selection

**Application to About Page**:

- Mock AboutHero, BiographySection, Certifications, etc.
- Test page composition and props passing
- Separate tests for individual components

---

### Test Coverage Goals

**From Contact Page Migration** (docs/testing/migrations/ContactPageMigration.md):

- **Total Tests**: 40+ for Contact Page
- **Coverage Areas**:
  - Rendering: 10+ tests
  - Styling: 10+ tests
  - Layout: 5+ tests
  - Accessibility: 5+ tests
  - Security: 10+ tests (if forms)

**Target for About Page**:

- Minimum 30 tests (no security needed if no forms)
- 40+ tests if forms are included
- 100% component coverage
- Full TypeScript compilation

---

## Accessibility Patterns

### ARIA Attributes Pattern

**From FigmaContactForm**:

```typescript
<input
  type="text"
  id="firstName"
  name="firstName"
  aria-invalid={!!errors.firstName}
  aria-describedby={errors.firstName ? "firstName-error" : undefined}
  required
/>
{errors.firstName && (
  <p id="firstName-error" className="mt-2 text-sm text-red-600">
    {errors.firstName}
  </p>
)}
```

**Pattern Elements**:

- `aria-invalid`: Indicates validation state
- `aria-describedby`: Links error message to input
- `id` on error message matches `aria-describedby` value
- `required` attribute for HTML5 validation

---

### Heading Hierarchy Pattern

**From ContactPage**:

```typescript
// Page has proper h1 → h2 → h3 structure
<h1>Get in Touch</h1>           {/* Main page heading */}
<h2>Ready to Begin Your Healing Journey?</h2>  {/* CTA section heading */}
<h3>Our Location</h3>            {/* Card titles */}
```

**Test Verification**:

```typescript
it("should have proper heading hierarchy", () => {
  render(<ContactPage />);
  const h1 = screen.getByRole("heading", { level: 1 });
  expect(h1).toHaveTextContent("Get in Touch");
  const h2 = screen.getByRole("heading", { level: 2 });
  expect(h2).toHaveTextContent("Ready to Begin Your Healing Journey?");
});
```

**Application to About Page**:

- h1: "About The Reiki Goddess" or "Meet Deirdre"
- h2: Section headings (Biography, Philosophy, etc.)
- h3: Subsection headings (Certifications, individual credentials)

---

### Keyboard Navigation Pattern

**From Contact Page Links**:

```typescript
<a
  href={ctaLink}
  target={ctaLink.startsWith("http") ? "_blank" : undefined}
  rel={ctaLink.startsWith("http") ? "noopener noreferrer" : undefined}
  className="flex items-center gap-2.5 hover:gap-3 transition-all"
>
  <span>{ctaText}</span>
  <img src="/images/gridicons_arrow-up.svg" alt="Arrow" className="w-5 h-5 rotate-45" />
</a>
```

**Accessibility Features**:

- Proper `href` for keyboard access
- `target="_blank"` only for external links
- `rel="noopener noreferrer"` for security
- Visual hover feedback
- Alt text on decorative images (can be empty for icons)

---

## Identified Reusable Components

### 1. AnimatedSection

**Location**: `/packages/shared-components/src/AnimatedSection/AnimatedSection.tsx`
**Usage**: Wrap any section for scroll-triggered animations
**Props**:

- `animation`: 'fadeInUp' | 'fadeIn' | 'slideInLeft' | 'slideInRight' | 'scaleIn'
- `delay`: number (seconds)
- `threshold`: number (0-1, default 0.1)

---

### 2. ContactInfoCard (Adaptable for About)

**Location**: `/packages/shared-components/src/ContactInfoCard/ContactInfoCard.tsx`
**Potential Adaptations**:

- **Certification Cards**: Display credentials with icon, title, issuing body, link
- **Philosophy Cards**: Key healing principles with icons
- **Stats/Metrics**: Years of experience, clients served, etc.

**Pattern to Extract**:

```typescript
// Generic InfoCard component
export interface InfoCardProps {
  icon: string;
  title: string;
  content: string;
  ctaText?: string;
  ctaLink?: string;
  variant?: "blue" | "purple" | "green"; // Extend color options
}
```

---

### 3. BookSessionCTA

**Location**: Used in ContactPage
**Usage**: Call-to-action section for booking
**Reusable For**: About Page ending CTA, "Ready to work with Deirdre?"

---

### 4. Testimonials

**Location**: `/packages/shared-components/src/Testimonials/`
**Usage**: Can be reused in About Page to showcase client experiences
**Application**: Add testimonials section after biography/credentials

---

### 5. PageTransition

**Location**: `/apps/main/src/components/PageTransition.tsx`
**Usage**: Wrap every page for consistent enter/exit animations
**Standard Pattern**: Already applied to Home, Contact, Services, Blog

---

### 6. AppLayout (Already Integrated)

**Location**: `/packages/shared-components/src/AppLayout/AppLayout.tsx`
**Usage**: Automatic via React Router's `<Outlet />`
**Pattern**: Header overlay with -93px margin compensation

---

## Recommendations for About Page

### Must Use Patterns

#### 1. PageTransition Wrapper

**Why**: Consistent with all other pages
**Implementation**:

```typescript
// /apps/main/src/pages/About.tsx
import { AboutPage } from "@reiki-goddess/shared-components";
import PageTransition from "../components/PageTransition";

function About() {
  return (
    <PageTransition>
      <AboutPage />
    </PageTransition>
  );
}

export default About;
```

---

#### 2. Standard Page Container

**Why**: Brand consistency, 1440px max-width
**Implementation**:

```typescript
// /packages/shared-components/src/pages/AboutPage.tsx
export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FFFBF5] overflow-hidden relative">
      <div
        className="relative mx-auto overflow-hidden"
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          backgroundColor: "#FFFBF5",
          boxShadow: "0 0 40px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Page content */}
      </div>
    </div>
  );
};
```

---

#### 3. AnimatedSection for All Sections

**Why**: Smooth scroll experience, performance optimized
**Implementation**:

```typescript
<AnimatedSection>
  <AboutHero />
</AnimatedSection>

<AnimatedSection delay={0.1}>
  <BiographySection />
</AnimatedSection>

<AnimatedSection delay={0.2}>
  <Certifications />
</AnimatedSection>

<AnimatedSection delay={0.3}>
  <Philosophy />
</AnimatedSection>

<AnimatedSection delay={0.4}>
  <Testimonials />
</AnimatedSection>

<AnimatedSection delay={0.5}>
  <BookSessionCTA />
</AnimatedSection>
```

---

#### 4. 66px Horizontal Padding

**Why**: Universal spacing standard from style guide
**Implementation**:

```typescript
<div className="max-w-[1440px] mx-auto px-[66px]">
  {/* Section content */}
</div>
```

---

#### 5. Figtree Typography

**Why**: Brand font consistency
**Implementation**:

```typescript
<h1
  className="text-[63.55px] font-bold text-black"
  style={{ fontFamily: "Figtree, sans-serif" }}
>
  About The Reiki Goddess
</h1>

<p
  className="text-[16px] font-medium text-[#1C1B1B]"
  style={{ fontFamily: "Figtree, sans-serif" }}
>
  Subtitle text
</p>
```

---

### Optional Patterns

#### 1. Smoke/Decorative Effects

**When**: If visual design requires ambient effects
**Implementation**: Use Contact Page layering pattern (10 layers at 10% opacity)

---

#### 2. Info Cards with Bevel Effect

**When**: Displaying certifications, credentials, or stats
**Implementation**: Adapt ContactInfoCard or create CertificationCard variant

---

#### 3. Security Validation

**When**: Only if forms are added (newsletter signup, inquiry form)
**Implementation**: Use FigmaContactForm pattern with SecurityValidator

---

### Avoid Patterns

#### 1. Custom Form Patterns

**Why**: FigmaContactForm already exists for any form needs
**Instead**: Reuse or extend FigmaContactForm, don't reinvent

---

#### 2. Inline Animation Logic

**Why**: AnimatedSection hook already handles animations
**Instead**: Use AnimatedSection wrapper

---

#### 3. Manual Active State Management

**Why**: AppLayout already handles navigation state via router
**Instead**: Navigation automatically highlights "About" when on /about route

---

### New Patterns Needed for About Page

#### 1. Biography Layout with Floating Image

**Need**: Text wrapping around Deirdre's portrait
**Suggested Implementation**:

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 gap-12">
  <div className="relative">
    <img
      src="/images/deirdre-portrait.jpg"
      alt="Deirdre - The Reiki Goddess"
      className="rounded-[20px] shadow-lg"
    />
  </div>
  <div className="flex flex-col justify-center">
    <h2 className="text-[48px] font-bold mb-6">My Healing Journey</h2>
    <p className="text-[18px] leading-relaxed">
      Biography content...
    </p>
  </div>
</div>
```

---

#### 2. Certification Grid

**Need**: Display multiple credentials in organized layout
**Suggested Implementation**:

```typescript
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  {certifications.map((cert) => (
    <CertificationCard
      key={cert.id}
      title={cert.title}
      issuer={cert.issuer}
      year={cert.year}
      icon={cert.icon}
    />
  ))}
</div>
```

---

#### 3. Philosophy/Values Cards

**Need**: Present healing philosophy in digestible blocks
**Suggested Implementation**:

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 gap-12">
  <PhilosophyCard
    title="Holistic Approach"
    description="Healing the mind, body, and spirit..."
    icon="/images/holistic-icon.svg"
  />
  <PhilosophyCard
    title="Client-Centered Care"
    description="Every journey is unique..."
    icon="/images/client-icon.svg"
  />
</div>
```

---

## Migration Checklist

### Pre-Migration

- [x] Review Contact Page migration documentation
- [x] Study ARCHITECTURE.md patterns
- [x] Examine existing About Page legacy code
- [x] Identify Figma screenshots for About Page
- [ ] Inventory needed components (Hero, Bio, Certs, Philosophy)
- [ ] Determine if forms are needed (impacts security requirements)

---

### Component Creation

- [ ] Create AboutPage.tsx in `/packages/shared-components/src/pages/`
- [ ] Create AboutHero component
- [ ] Create BiographySection component
- [ ] Create Certifications component (if needed)
- [ ] Create Philosophy component (if needed)
- [ ] Reuse Testimonials component
- [ ] Reuse BookSessionCTA component

---

### Page Implementation

- [ ] Apply PageTransition wrapper in `/apps/main/src/pages/About.tsx`
- [ ] Use standard page container (1440px max-width, cream background)
- [ ] Wrap sections with AnimatedSection (stagger delays 0.1s)
- [ ] Apply 66px horizontal padding to all sections
- [ ] Use Figtree typography throughout
- [ ] Ensure hero extends under header (AppLayout already handles this)

---

### Styling

- [ ] Match Figma design specifications (if available)
- [ ] Apply brand colors (#FFFBF5 cream, #0205B7 blue, #A593E0 purple)
- [ ] Use consistent border radius (12px inputs, 17-20px cards)
- [ ] Add smoke effects if design requires (10 layers at 10% opacity)
- [ ] Implement hover states (translate-y animations)
- [ ] Ensure responsive breakpoints (md:grid-cols-2, md:grid-cols-3)

---

### Testing

- [ ] Create AboutPage.test.tsx
- [ ] Write rendering tests (all sections present)
- [ ] Write styling tests (Figma-accurate classes)
- [ ] Write layout tests (spacing, grid, responsive)
- [ ] Write accessibility tests (heading hierarchy, ARIA)
- [ ] Mock child components (AboutHero, BiographySection, etc.)
- [ ] Target 30-40+ tests for comprehensive coverage
- [ ] Verify TypeScript compilation (0 errors)

---

### Accessibility

- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] ARIA attributes on interactive elements
- [ ] Alt text on all images (descriptive, not decorative)
- [ ] Keyboard navigation support (focusable links/buttons)
- [ ] Color contrast compliance (WCAG 2.1 AA)
- [ ] Focus indicators visible
- [ ] Screen reader tested (if possible)

---

### Performance

- [ ] Intersection Observer with triggerOnce: true
- [ ] Lazy loading for images
- [ ] Auto-cleanup on animations (no memory leaks)
- [ ] Optimize image sizes
- [ ] Code splitting (if components are large)

---

### Documentation

- [ ] Create AboutPageMigration.md in `/docs/testing/migrations/`
- [ ] Document any issues encountered
- [ ] Document new patterns/components created
- [ ] Update ARCHITECTURE.md if new patterns emerge
- [ ] Add test results to TESTING_SUMMARY.md

---

### Integration

- [ ] Verify routing in `/apps/main/src/App.tsx` (already exists)
- [ ] Ensure AppLayout navigation highlights "About" correctly
- [ ] Test page transitions (from/to other pages)
- [ ] Verify header overlay works (hero under header)
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Mobile responsive testing (320px, 768px, 1024px, 1440px)

---

### Final Verification

- [ ] All tests passing (npm test)
- [ ] TypeScript compiling (npm run type-check)
- [ ] Linting passing (npm run lint)
- [ ] Build successful (npm run build)
- [ ] Dev server running without errors (npm run dev)
- [ ] Visual comparison with Figma (if designs exist)
- [ ] Client approval/feedback session scheduled

---

## Technical Challenges from Contact Page

### Challenge 1: First Name Validation Logic

**Issue**: Validation logic was checking `!value` after calling SecurityValidator, causing empty values to bypass early checks.

**Solution Applied**:

```typescript
case 'firstName':
  if (!value) {
    return 'First name is required';
  }
  result = SecurityValidator.validateContactFormField('name', value as string);
  break;
```

**Lesson**: Always check for empty values BEFORE passing to validators.

---

### Challenge 2: Test String Escaping

**Issue**: Unescaped apostrophe in test string caused parsing error.

**Solution**:

```typescript
// Before: expect(screen.getByText('We're here to help.')).toBeInTheDocument();
// After:  expect(screen.getByText('We\'re here to help.')).toBeInTheDocument();
```

**Lesson**: Escape apostrophes in test strings or use template literals.

---

### Challenge 3: Act() Warnings

**Issue**: Multiple act() warnings in tests due to asynchronous state updates.

**Status**: Documented as non-critical. Tests pass correctly; warnings don't affect functionality.

**Lesson**: act() warnings are common with complex forms. Focus on test coverage, not warning elimination.

---

### Challenge 4: Security Component Test Failures

**Issue**: Initial security tests failed due to overly strict validation.

**Resolution**:

- Email regex updated to support '+' character
- Phone validation made less restrictive
- Added details field validation to SecurityMonitor

**Lesson**: Wellness industry has specific validation needs; adjust patterns accordingly.

---

### Challenge 5: TypeScript Import/Export Issues

**Issue**: Multiple TypeScript errors after creating new components.

**Resolution**:

- Fixed imports/exports in shared-components index
- Added proper type exports for all new components
- Ensured all props interfaces were exported

**Lesson**: Maintain clean index.ts exports; co-locate types with components.

---

## Key Takeaways for About Page

### 1. Consistency is Critical

- Use identical patterns from Contact Page
- Maintain 66px padding, Figtree typography, cream background
- Follow established component structure

### 2. Leverage Existing Components

- AnimatedSection for animations
- PageTransition for page transitions
- Testimonials, BookSessionCTA for common sections
- ContactInfoCard pattern for any card-based layouts

### 3. Testing is Non-Negotiable

- 30-40+ tests minimum
- Document failures, don't modify tests to pass
- Mock child components for isolation
- Test accessibility thoroughly

### 4. Performance Matters

- Use triggerOnce: true for animations
- Implement lazy loading
- Clean up observers and event listeners

### 5. Accessibility is Built-In

- Proper heading hierarchy from the start
- ARIA attributes on all interactive elements
- Keyboard navigation support
- Screen reader friendly

---

## Related Documentation

- [Contact Page Migration Issues & Solutions](/Users/taylorquigley/Documents/Directories/reiki-goddess-healing/docs/testing/migrations/ContactPageMigration.md)
- [Architecture Patterns](/Users/taylorquigley/Documents/Directories/reiki-goddess-healing/docs/project/ARCHITECTURE.md)
- [About Page Migration Plan](/Users/taylorquigley/Documents/Directories/reiki-goddess-healing/docs/progress/005-about-page-migration.md)
- [Style Guide](/Users/taylorquigley/Documents/Directories/reiki-goddess-healing/docs/design/style-guide.md)

---

**Last Updated**: 2025-10-06
**Next Steps**: Begin component creation following checklist above
**Estimated Implementation Time**: 2-4 hours (based on Contact Page: 2 hours)

---

_This document serves as the definitive technical reference for About Page migration. Update as new patterns emerge or challenges are encountered._
