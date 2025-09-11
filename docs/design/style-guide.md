# The Reiki Goddess Healing - Style Guide

## 🎨 Brand Identity

### Mission

To provide transformative energy healing services that restore balance, reduce stress, and promote optimal mental health and wellness through Reiki, sound therapy, and spiritual guidance.

### Brand Personality

- **Healing & Nurturing**: Gentle, caring, supportive
- **Professional & Trustworthy**: Certified, experienced, reliable
- **Spiritual & Grounded**: Connected to energy work while remaining accessible
- **Welcoming & Inclusive**: Open to all seeking wellness and balance

---

## 🎨 Color System

### Primary Colors

#### Brand Blue

- **Hex**: `#0205B7`
- **RGB**: `rgba(2, 5, 183, 1)`
- **Usage**: Primary CTAs, headers, navigation links, brand accents
- **Meaning**: Trust, healing, spiritual connection

#### Cream Background

- **Hex**: `#FFFBF5`
- **RGB**: `rgba(255, 251, 245, 1)`
- **Usage**: Site background, creating warm and welcoming atmosphere
- **Meaning**: Warmth, comfort, healing space

### Secondary Colors

#### Purple

- **Hex**: `#A593E0`
- **RGB**: `rgba(165, 147, 224, 1)`
- **Usage**: Gradient overlays, spiritual elements, event sections
- **Meaning**: Spirituality, transformation, higher consciousness

#### Peach

- **Hex**: `#FFC6A5`
- **RGB**: `rgba(255, 198, 165, 1)`
- **Usage**: Accent elements, warm highlights, community features
- **Meaning**: Warmth, community, gentle energy

#### Cyan

- **Hex**: `#63D5F9`
- **RGB**: `rgba(99, 213, 249, 1)`
- **Usage**: Hover states, gradients, fresh accents
- **Meaning**: Clarity, flow, renewal

#### Gold/Tan (Logo Text)

- **Hex**: `#C4A962`
- **RGB**: `rgba(196, 169, 98, 1)`
- **Usage**: Logo text, premium elements
- **Meaning**: Wisdom, value, divine connection

### Text Colors

#### Dark Text

- **Hex**: `#333333`
- **RGB**: `rgba(51, 51, 51, 1)`
- **Usage**: Primary body text, headings

#### Gray Text

- **Hex**: `#5E5E5E`
- **RGB**: `rgba(94, 94, 94, 1)`
- **Usage**: Secondary text, descriptions

#### White

- **Hex**: `#FFFFFF`
- **RGB**: `rgba(255, 255, 255, 1)`
- **Usage**: Text on dark backgrounds, cards

### Gradient Combinations

#### Purple Gradient (Events)

```css
background: linear-gradient(90deg, #a593e0 0%, #ffc6a5 100%);
```

#### Blue to Cyan (CTAs)

```css
background: linear-gradient(90deg, #0205b7 0%, #63d5f9 100%);
```

#### Dark Overlay

```css
background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.7) 100%);
```

---

## 📐 Typography

### Font Family

**Primary**: Figtree (Google Fonts)

```css
font-family:
  "Figtree",
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  "Roboto",
  sans-serif;
```

### Type Scale

#### Hero Heading

- **Size**: 63.55px
- **Weight**: 700 (Bold)
- **Line Height**: 1.2
- **Color**: White (on overlay)
- **Usage**: Main hero section headline

#### Section Headings (H2)

- **Size**: 48px
- **Weight**: 700 (Bold)
- **Line Height**: 1.3
- **Color**: #333333
- **Usage**: Major section titles

#### Subsection Headings (H3)

- **Size**: 32px
- **Weight**: 600 (Semi-Bold)
- **Line Height**: 1.4
- **Color**: #333333
- **Usage**: Card titles, subsections

#### Feature Headings (H4)

- **Size**: 22px
- **Weight**: 600 (Semi-Bold)
- **Line Height**: 1.4
- **Color**: #333333 or #0205B7
- **Usage**: Feature titles, service names

#### Body Large

- **Size**: 18px
- **Weight**: 400 (Regular)
- **Line Height**: 1.6
- **Color**: #5E5E5E
- **Usage**: Important body text, introductions

#### Body Regular

- **Size**: 16px
- **Weight**: 400 (Regular)
- **Line Height**: 1.6
- **Color**: #5E5E5E
- **Usage**: Standard body text

#### Navigation

- **Size**: 16px
- **Weight**: 500 (Medium)
- **Line Height**: 1.5
- **Color**: #0205B7
- **Usage**: Navigation links

#### Buttons

- **Size**: 16px
- **Weight**: 500 (Medium)
- **Line Height**: 1.5
- **Letter Spacing**: 0.5px
- **Text Transform**: None
- **Usage**: CTA buttons, links

#### Small Text

- **Size**: 14px
- **Weight**: 400 (Regular)
- **Line Height**: 1.5
- **Color**: #5E5E5E
- **Usage**: Captions, helper text

#### Footer Text

- **Size**: 14px
- **Weight**: 400 (Regular)
- **Line Height**: 1.6
- **Color**: #5E5E5E
- **Usage**: Footer content

---

## 📏 Layout & Spacing

### Container

- **Max Width**: 1440px
- **Side Padding**: 66px (universal)
- **Background**: #FFFBF5
- **Box Shadow**: `0 0 40px rgba(0, 0, 0, 0.1)`

### Grid System

- **Columns**: 12 column grid
- **Gutter**: 30px
- **Responsive Breakpoints**:
  - Mobile: < 768px (stack to single column)
  - Tablet: 768px - 1024px (2-3 columns)
  - Desktop: > 1024px (full grid)

### Section Spacing

- **Between Sections**: 80px (py-20)
- **Section Padding**: 80px vertical, 0px horizontal (content uses container padding)
- **Component Gap**: 30px - 50px

### The 66px Rule

Universal buffer/padding from page edges to content:

- Navigation logo starts at 66px from left
- All section content respects 66px side padding
- Maintains consistent visual rhythm

### Component Dimensions

#### Navigation

- **Height**: 93px
- **Logo**: 248px × 92px
- **Logo Position**: 66px from left edge
- **Nav Item Gap**: 84px
- **Logo to First Item**: 191px

#### Hero Section

- **Total Height**: 825px (93px nav + 732px image)
- **Image Width**: 1308px (within 1440px - 132px padding)
- **Image Height**: 732px
- **Overlay Text Position**: 436px from top of image

#### Service Cards

- **Card Dimensions**: Flexible width, min-height 200px
- **Bevel Offset**: 5px down, 5px left/right
- **Border Radius**: 20px
- **Padding**: 30px

#### Images

- **Meet The Goddess Images**:
  - IMG-4891: 455.9px × 310.61px, -4.85° rotation
  - IMG-3859: 283.5px × 207.9px, 8.13° rotation
- **Border Radius**:
  - Featured: 27px
  - Standard: 20px

---

## 🎯 Component Patterns

### Buttons

#### Primary Button (Filled)

```css
background: #0205b7;
color: white;
padding: 12px 32px;
border-radius: 100px;
font-size: 16px;
font-weight: 500;
transition: all 0.3s ease;
```

#### Secondary Button (Outline)

```css
background: transparent;
color: #0205b7;
border: 2px solid #0205b7;
padding: 10px 30px;
border-radius: 100px;
```

#### Ghost Button (Hero)

```css
background: transparent;
color: white;
border: 2px solid white;
padding: 10px 30px;
border-radius: 100px;
```

### Cards

#### Service Card

- White background
- Blue bevel effect (5px offset)
- 20px border radius
- Blue drop shadow on hover
- Gradient overlay on hover

#### Testimonial Card

- White background
- 20px border radius
- Subtle shadow
- Quote icon
- 5 star rating display

#### Event Card

- Semi-transparent white
- 20px border radius
- Inside gradient section

### Border Radius Standards

- **Buttons**: 100px (pill shape)
- **Cards**: 20px
- **Images**: 20px (standard), 27px (featured)
- **Large Sections**: 30px
- **Input Fields**: 8px

### Shadows

#### Card Shadow

```css
box-shadow: 0px 42px 32.5px -13px rgba(2, 5, 183, 0.25);
```

#### Container Shadow

```css
box-shadow: 0 0 40px rgba(0, 0, 0, 0.1);
```

#### Hover Shadow

```css
box-shadow: 0 20px 40px rgba(2, 5, 183, 0.2);
```

#### Soft Shadow

```css
box-shadow: 0 10px 30px rgba(165, 147, 224, 0.2);
```

### Section Shadow (CTA/Feature)

```css
box-shadow: 9px 10px 0px 0px #0205b7;
```

---

## 🖼️ Image Treatments & Overlays

### Section Images with Brand Overlay

For major CTA sections and feature sections with background images:

#### Blue Tint Overlay

```css
/* Apply over background images for brand consistency */
background-color: rgba(2, 5, 183, 0.35); /* #0205B7 with 35% opacity */
position: absolute;
inset: 0;
```

#### Implementation Pattern

```jsx
<div className="relative overflow-hidden rounded-[20px] shadow-[9px_10px_0px_0px_#0205B7]">
  {/* Background Image */}
  <img
    src="/path/to/image.jpg"
    className="absolute inset-0 w-full h-full object-cover"
  />

  {/* Blue Tint Overlay */}
  <div className="absolute inset-0 bg-[#0205B7] opacity-35" />

  {/* Content */}
  <div className="relative z-10">{/* Your content here */}</div>
</div>
```

### Standard Properties for Section Images

- **Border Radius**: 20px for cards, 30px for large sections
- **Shadow**: `shadow-[9px_10px_0px_0px_#0205B7]` (brand blue bottom-right offset)
- **Overlay Opacity**: 35% for optimal image visibility with brand color
- **Object Fit**: `object-cover` to maintain aspect ratio

### Decorative Elements on Images

#### White Corner Dots

For decorative accents on blue overlaid sections:

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
/* (repeat for all four corners) */
```

### Image Background Types

1. **Hero Images**: Full opacity, dark gradient overlay for text readability
2. **Section Backgrounds**: 35% blue overlay for brand consistency
3. **Card Images**: No overlay, natural colors
4. **Decorative Patterns**: SVGs with specific positioning, no overlay needed

---

## ✨ Animations

### Scroll Animations

#### Fade In Up

- Duration: 0.8s
- Easing: ease-out
- Transform: translateY(30px) to translateY(0)

#### Scale In

- Duration: 0.6s
- Easing: ease-out
- Transform: scale(0.9) to scale(1)

#### Slide In (Left/Right)

- Duration: 0.8s
- Easing: ease-out
- Transform: translateX(±50px) to translateX(0)

### Hover Effects

#### Float (Cards)

- Duration: 2s
- Animation: Gentle up/down float
- Distance: 8px

#### Glow Pulse (Spiritual Elements)

- Duration: 2s
- Animation: Pulsing shadow glow
- Colors: Blue to purple gradient

#### Breathe (CTAs)

- Duration: 3s
- Animation: Gentle scale pulsing
- Scale: 1 to 1.05

#### Lift (Service Cards)

- Duration: 0.3s
- Transform: translateY(-8px)
- Enhanced shadow

### Transition Timing

- Fast: 0.2s (micro-interactions)
- Standard: 0.3s (most transitions)
- Smooth: 0.4s - 0.6s (reveals)
- Slow: 0.8s - 1s (major transitions)

### Easing Functions

- **Standard**: `ease`
- **Smooth**: `cubic-bezier(0.4, 0, 0.2, 1)`
- **Out**: `ease-out`
- **In-Out**: `ease-in-out`

---

## 🌓 Special Effects

### Bevel Effect (Service Cards)

Created with duplicate shape method:

1. Primary white card
2. Blue rectangle positioned 5px below
3. Creates 3D lifted appearance

### Smoke Effect (Meet The Goddess)

Triple-layered transparency:

1. Base layer: normal blend
2. Middle layer: multiply blend
3. Top layer: overlay blend

- Rotation: 180°
- Position: Page edge aligned

### Image Bevels

Direction-based colored borders:

- Left tilt: Bevel on left side
- Right tilt: Bevel on right side
- 5px offset in corresponding direction

---

## 📱 Responsive Guidelines

### Mobile First Approach

- Start with mobile layout
- Progressively enhance for larger screens
- Maintain brand consistency across devices

### Breakpoints

```css
/* Mobile */
@media (max-width: 767px) {
  /* Stack elements vertically */
  /* Reduce padding to 20px */
  /* Simplify animations */
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) {
  /* 2-column layouts */
  /* Moderate padding: 40px */
}

/* Desktop */
@media (min-width: 1024px) {
  /* Full layouts */
  /* Full 66px padding */
}
```

### Touch Targets

- Minimum size: 44px × 44px
- Spacing between targets: 8px minimum
- Enhanced hover states for touch

---

## ♿ Accessibility Standards

### Color Contrast

- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum
- Interactive elements: 3:1 minimum

### Focus States

```css
:focus {
  outline: 2px solid #0205b7;
  outline-offset: 2px;
  border-radius: 4px;
}
```

### ARIA Labels

- All images have meaningful alt text
- Interactive elements have descriptive labels
- Form inputs have associated labels
- Landmark regions properly marked

### Keyboard Navigation

- All interactive elements keyboard accessible
- Logical tab order maintained
- Skip links for main content
- Escape key closes modals

---

## 🔧 Implementation Notes

### CSS Architecture

- Use Tailwind utilities where possible
- Custom CSS for complex animations
- Component-scoped styles
- Avoid inline styles except for dynamic values

### Performance

- Lazy load images below fold
- Preload critical fonts
- Minimize animation on low-end devices
- Use CSS transforms over position changes

### Cross-Browser Support

- Test in Chrome, Firefox, Safari, Edge
- Provide fallbacks for newer CSS features
- Ensure smooth scrolling polyfill for older browsers
- Test animations on various devices

---

## 📋 Component Checklist

When implementing new components:

- [ ] Matches Figma design specifications
- [ ] Uses correct color tokens
- [ ] Follows typography scale
- [ ] Respects 66px padding rule
- [ ] Has appropriate border radius
- [ ] Includes hover states
- [ ] Has scroll animation
- [ ] Mobile responsive
- [ ] Keyboard accessible
- [ ] Proper ARIA labels
- [ ] Loading states for async content
- [ ] Error states where applicable

---

## 🎯 Brand Voice Guidelines

### Tone

- Professional yet approachable
- Calming and reassuring
- Empowering and supportive
- Clear and concise

### Messaging Pillars

1. **Healing**: Focus on restoration and balance
2. **Expertise**: Highlight certifications and experience
3. **Community**: Emphasize connection and support
4. **Transformation**: Promise positive change

### CTA Language

- Primary: "Book a Session", "Start Your Healing Journey"
- Secondary: "Learn More", "Discover Our Services"
- Supporting: "Join Our Community", "Get In Touch"

---

_This style guide is a living document and should be updated as the brand evolves._

_Last Updated: 2025-09-11_
