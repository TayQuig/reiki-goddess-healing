# The Reiki Goddess Healing - Brand Style Guide

This comprehensive style guide documents all design patterns, typography, colors, spacing, and component standards extracted from the completed homepage implementation. Use this guide as the definitive reference when building other pages and components.

## 🎨 Brand Colors

### Primary Palette
```css
/* Brand Blue - Primary brand color used for buttons, borders, and key elements */
#0205B7 (rgba(2, 5, 183, 1))

/* Cream Background - Universal background color for entire site */
#FFFBF5

/* White - Card backgrounds, text areas */
#FFFFFF (rgba(255, 255, 255, 1))
```

### Secondary Colors
```css
/* Light Purple - Used in gradients and accents */
rgba(165, 147, 224, 1)

/* Cyan Blue - Secondary brand color, pagination dots, social elements */
rgba(99, 213, 249, 1)

/* Peach - Accent color */
rgba(255, 198, 165, 1)

/* Gold/Tan - Testimonial stars, special accents */
rgba(196, 169, 98, 1)
```

### Text Colors
```css
/* Primary Text - Main headings and body text */
rgba(51, 51, 51, 1)

/* Secondary Text - Supporting text, descriptions */
rgba(94, 94, 94, 1)

/* Light Text - Subtle text elements */
rgba(158, 158, 158, 1)

/* White Text - Text on dark backgrounds */
rgba(255, 255, 255, 1)

/* Brand Text - Links and branded text elements */
rgba(2, 5, 183, 1)
```

### Background Colors
```css
/* Primary Background - Main site background */
#FFFBF5

/* White Background - Cards, forms, overlays */
#FFFFFF

/* Testimonial Background - Special section background */
rgba(169, 148, 72, 0.13)

/* Overlay Colors */
rgba(0, 0, 0, 0.3)  /* Hero image overlay */
rgba(2, 5, 183, 0.44)  /* Community Events overlay */
rgba(2, 5, 183, 0.85)  /* Let's Connect overlay */
```

### Gradients
```css
/* Purple Gradient - Community Events section */
background: linear-gradient(180deg, rgba(165, 147, 224, 0.8) 0%, rgba(165, 147, 224, 0.4) 100%);

/* Hero Gradient - Background overlay */
background: linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.6) 100%);

/* Service Card Hover - Interactive gradient */
background: linear-gradient(135deg, #0205B7 0%, rgba(99, 213, 249, 1) 100%);

/* Fallback Hero Gradient - When hero image fails to load */
background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #3B82F6 100%);
```

## ✨ Typography

### Font Family
```css
/* Primary Font - Used throughout the site */
font-family: 'Figtree, Helvetica, sans-serif';

/* Secondary Fonts - Legacy/alternative options */
font-family: 'Neue_Montreal-Regular, Helvetica, sans-serif';
font-family: 'Neue_Montreal-Medium, Helvetica, sans-serif';
font-family: 'Neue_Montreal-Bold, Helvetica, sans-serif';
```

### Font Sizes & Weights
```css
/* Large Headings - Hero title, main section headings */
font-size: 63.55px;  /* Hero heading */
font-size: 48px;     /* Section headings */
font-weight: 700;    /* Bold headings */

/* Medium Headings - Subsections, card titles */
font-size: 22px;     /* Card headings, special text */
font-size: 20px;     /* Service card titles */
font-weight: 600;    /* Semi-bold */
font-weight: 500;    /* Medium weight */

/* Body Text */
font-size: 18px;     /* Large body text */
font-size: 16px;     /* Standard body text, buttons, navigation */
font-size: 14px;     /* Small text, footer links */
font-weight: 500;    /* Medium body text */
font-weight: 400;    /* Regular body text */
```

### Line Heights & Spacing
```css
line-height: 100%;   /* Tight headings (hero) */
line-height: 1.2;    /* Standard headings */
line-height: 1.6;    /* Body text */
line-height: 24px;   /* Hero subheading */
line-height: 28px;   /* Large body text */

letter-spacing: 0%;  /* Standard spacing */
letter-spacing: 10%; /* Special spaced text ("The Reiki Goddess" label) */
```

## 📏 Layout & Spacing System

### Container Standards
```css
/* Universal Container */
max-width: 1440px;
padding: 0 66px;     /* 66px universal buffer maintained across all sections */
margin: 0 auto;
background: #FFFBF5;
box-shadow: 0 0 40px rgba(0, 0, 0, 0.1);

/* Mobile Container */
padding: 0 24px;     /* Smaller padding on mobile */
```

### Section Spacing
```css
/* Standard Section Padding */
padding: 80px 0;     /* py-20 in Tailwind */

/* Mobile Section Padding */
padding: 48px 0;     /* py-12 in Tailwind */

/* Section Margins */
margin: 40px 0;      /* Between special sections */

/* Element Gaps */
gap: 48px;           /* Standard gap between elements */
gap: 32px;           /* Grid gaps */
gap: 24px;           /* Smaller gaps on mobile */
```

### Hero Section Dimensions
```css
/* Hero Layout - Critical measurements */
height: 825px;       /* Total height (93px nav + 732px image) */
image-height: 732px; /* Hero image height */
image-width: 1308px; /* Hero image width (1440px - 132px padding) */
nav-height: 93px;    /* Navigation bar height */
top: 93px;           /* Image positioned below nav */
left: 66px;          /* Image aligned with universal padding */
right: 66px;         /* Image aligned with universal padding */
border-radius: 20px; /* Hero image corners */
```

### Navigation Specifications
```css
/* Header Navigation */
height: 93px;        /* Navigation bar height */
background: #FFFBF5; /* Cream background */
backdrop-filter: blur(10px);

/* Logo Positioning */
left: 66px;          /* Aligned with content edge */
width: 248px;        /* Logo container width */
height: 92px;        /* Logo container height */

/* Navigation Links */
gap: 84px;           /* Space between nav items */
font-size: 16px;
font-weight: 600;    /* Active state */
font-weight: 500;    /* Default state */
color: rgba(2, 5, 183, 1);
text-decoration: underline; /* Active state */
text-underline-offset: 4px;
```

## 🔘 Border Radius Standards

### Brand-Specific Rounded Corners
```css
/* Images - Standard image corners */
border-radius: 20px;

/* Featured Images - Special images with emphasis */
border-radius: 27px;  /* IMG_4891 in Meet The Goddess */
border-radius: 24px;  /* IMG_3859 in Meet The Goddess */

/* Cards - Component containers */
border-radius: 20px;

/* Large Sections - Section containers */
border-radius: 30px;  /* Community Events, Let's Connect */

/* Buttons - Fully rounded pill shape */
border-radius: 9999px; /* Full pill buttons */
border-radius: 100px;  /* Social profile card */

/* Small Elements */
border-radius: 8px;    /* Small buttons, form elements */
border-radius: 0.25rem; /* Default Tailwind */
```

## 📦 Component Dimensions

### Service Cards
```css
/* Card Container */
height: 280px;
padding: 24px;       /* p-6 */
border-radius: 20px;
background: #FFFFFF;
box-shadow: 0px 42px 32.5px -13px rgba(2, 5, 183, 0.25);

/* Card Hover Shadow */
box-shadow: 0px 42px 40px -10px rgba(2, 5, 183, 0.35);

/* Blue Background Bevel */
background: #0205B7;
border-radius: 20px;
transform: translateY(5px); /* Positioned 5px down */
```

### Buttons
```css
/* Primary Button */
min-width: 180px;
height: 48px;
padding: 0 32px;
border-radius: 9999px; /* Full pill */
font-size: 16px;
font-weight: 500;
background: transparent;
border: 2px solid white;     /* Hero buttons */
border: 2px solid #0205B7;   /* Standard buttons */
color: white;                /* Hero buttons */
color: #0205B7;              /* Standard buttons */

/* Button Hover States */
transform: scale(1.05);
background: rgba(255, 255, 255, 0.1); /* Hero hover */
background: rgba(2, 5, 183, 0.05);    /* Standard hover */
```

### Special Image Positioning (Meet The Goddess)
```css
/* IMG_4891 - Main featured image */
width: 455.9px;
height: 310.61566px;
left: 688px;
top: 50px;
transform: rotate(-4.85deg);
border-radius: 27px;

/* IMG_3859 - Secondary image */
width: 283.49694050307664px;
height: 207.90078167808508px;
left: 1010.153px;
top: calc(50px + 310.61566px - 100px);
transform: rotate(8.13deg);
border-radius: 24px;

/* "The Reiki Goddess" Text */
left: 752px;
top: 370px;
width: 221px;
height: 26px;
transform: rotate(-5.24deg);
font-size: 22px;
letter-spacing: 10%;
color: #0205B7;
```

## 🎭 Shadow Effects

### Standard Shadows
```css
/* Container Shadow - Main page container */
box-shadow: 0 0 40px rgba(0, 0, 0, 0.1);

/* Service Card Shadow - Brand-specific blue shadow */
box-shadow: 0px 42px 32.5px -13px rgba(2, 5, 183, 0.25);

/* Service Card Hover Shadow */
box-shadow: 0px 42px 40px -10px rgba(2, 5, 183, 0.35);

/* Image Shadows - For depth on images */
box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);

/* Button Shadows - Subtle elevation */
box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
```

## 🖼️ Image Treatments

### Standard Image Specifications
```css
/* Hero Background Image */
object-fit: cover;
border-radius: 20px;
width: calc(100% - 132px); /* Account for 66px buffer on each side */
max-width: 1308px;
height: 732px;

/* Service Card Icons */
width: 64px;          /* w-16 h-16 */
height: 64px;
filter: none;
color: rgba(2, 5, 183, 1);

/* Profile Images */
width: 80px;          /* Testimonial profiles */
height: 80px;
border-radius: 50%;   /* Full circle */
border: 3px solid white;

/* Event Flyer Images */
border-radius: 20px;
width: 395px;         /* Fixed width for consistency */
object-fit: cover;

/* Logo Specifications */
height: 60px;         /* Navigation logo height */
object-fit: contain;
```

### Image Hover States
```css
/* Service Card Icon Hover */
filter: brightness(0) invert(1); /* White icons on blue background */

/* Image Container Hover */
transform: translateY(-8px);     /* Lift effect */
transition: transform 0.3s ease;
```

## 🎪 Special Effects & Overlays

### Backdrop Filters
```css
/* Navigation Blur */
backdrop-filter: blur(10px);

/* Button Glass Effect */
backdrop-filter: blur(10px);
```

### Overlay Patterns
```css
/* Hero Image Overlay */
background: rgba(0, 0, 0, 0.3);
position: absolute;
inset: 0;

/* Community Events Blue Overlay */
background: rgba(2, 5, 183, 0.44);
border-radius: 30px;

/* Let's Connect Strong Overlay */
background: rgba(2, 5, 183, 0.85);
border-radius: 30px;
```

### Smoke/Texture Effects
```css
/* Meet The Goddess Smoke Layers */
/* Layer 1 - Base smoke */
opacity: 0.5;
filter: saturate(100%);
mix-blend-mode: normal;

/* Layer 2 - Enhanced color */
opacity: 0.3;
filter: saturate(150%);
mix-blend-mode: multiply;

/* Layer 3 - Maximum enhancement */
opacity: 0.2;
filter: saturate(200%) hue-rotate(-10deg);
mix-blend-mode: overlay;
```

## 🔗 Interactive States

### Hover Effects
```css
/* Button Hover */
hover:scale-105;
hover:bg-opacity-80;
transition: all 0.2s ease;

/* Card Hover */
hover:-translate-y-2;
transition: transform 0.3s ease;

/* Link Hover */
hover:opacity-80;
transition: opacity 0.2s ease;
```

### Focus States
```css
/* Accessible Focus */
focus:outline-none;
focus:ring-2;
focus:ring-blue-500;
focus:ring-offset-2;
```

## 🔶 Footer Component Specifications

### Footer Dimensions & Layout
```css
/* Container Structure */
width: 1440px;          /* Fixed width matching main container */
height: 590px;          /* Fixed height per Figma */
background-color: #FFFFFF;  /* White background */

/* Internal Padding */
padding: 80px 66px;     /* 80px vertical, 66px horizontal (respects universal buffer) */

/* Container Placement */
/* Footer sits within 1440px container without side padding */
/* Wrapped in dedicated container div for proper alignment */
```

### Footer Content Layout
```css
/* Grid Structure */
display: grid;
grid-template-columns: repeat(4, 1fr);  /* 4 equal columns on desktop */
gap: 2rem;                               /* 32px between columns */

/* Column Distribution */
Column 1: Brand (Logo + Tagline)
Column 2: Quick Links
Column 3: Legal Links  
Column 4: Social Media

/* Logo Specifications */
height: 64px;           /* h-16 in Tailwind */
width: auto;            /* Maintains aspect ratio */
object-fit: contain;
```

### Footer Typography
```css
/* Section Headers */
font-family: 'Figtree, Helvetica, sans-serif';
font-size: 16px;
font-weight: 600;
color: #1F2937;         /* text-gray-900 */
margin-bottom: 16px;

/* Links */
font-family: 'Figtree, Helvetica, sans-serif';
font-size: 14px;
color: #4B5563;         /* text-gray-600 */
line-height: 1.5;
hover: color: #8B5CF6;  /* purple-600 on hover */

/* Copyright */
font-family: 'Figtree, Helvetica, sans-serif';
font-size: 14px;        /* text-sm */
color: #6B7280;         /* text-gray-500 */
text-align: center;
```

### Footer Implementation Pattern
```jsx
/* Homepage Structure */
<div className="min-h-screen" style={{ backgroundColor: '#FFFBF5' }}>
  <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 66px' }}>
    {/* Main content with 66px padding */}
  </div>
  
  {/* Footer Container - No side padding */}
  <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
    <Footer />
  </div>
</div>
```

## 📱 Responsive Breakpoints

### Media Query Standards
```css
/* Mobile First Approach */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

### Responsive Adjustments
```css
/* Mobile Modifications */
padding: 0 24px;        /* Reduced container padding */
height: 600px;          /* Reduced hero height */
font-size: 32px;        /* Smaller headings */
gap: 24px;              /* Smaller gaps */

/* Grid Responsive Behavior */
grid-cols-1;            /* Mobile: single column */
md:grid-cols-2;         /* Tablet: two columns */
lg:grid-cols-4;         /* Desktop: four columns */
```

## ⚡ Animation & Transitions

### Standard Timing Functions
```css
/* Default Transitions */
transition: all 0.2s ease;
transition: transform 0.3s ease;
transition: opacity 0.3s ease;
transition: colors 0.2s ease;

/* Custom Durations */
duration-200;           /* Quick interactions */
duration-300;           /* Standard animations */
```

## 📋 Component Usage Patterns

### Button Variants
```html
<!-- Primary Hero Button -->
<button class="bg-transparent border-2 border-white text-white rounded-full px-8 py-3">

<!-- Secondary Brand Button -->
<button class="bg-transparent border-2 border-blue-700 text-blue-700 rounded-full px-8 py-3">

<!-- Social Follow Button -->
<button class="bg-white border-2 border-cyan-400 text-cyan-400 rounded-lg px-5 py-2">
```

### Section Structure Template
```html
<section class="py-20" style="background-color: #FFFBF5;">
  <div class="mx-auto" style="max-width: 1440px; padding: 0 66px;">
    <h2 style="font-size: 48px; font-weight: 700; color: rgba(51, 51, 51, 1);">
      Section Heading
    </h2>
    <!-- Section content -->
  </div>
</section>
```

### Card Component Template
```html
<div class="bg-white rounded-[20px] p-6" style="box-shadow: 0px 42px 32.5px -13px rgba(2, 5, 183, 0.25);">
  <!-- Blue bevel background -->
  <div class="absolute inset-0 bg-[#0205B7] rounded-[20px] transform translate-y-[5px] -z-10"></div>
  <!-- Card content -->
</div>
```

## 🔧 Implementation Guidelines

### CSS Custom Properties
```css
:root {
  --brand-blue: rgba(2, 5, 183, 1);
  --cream-bg: #FFFBF5;
  --text-primary: rgba(51, 51, 51, 1);
  --text-secondary: rgba(94, 94, 94, 1);
  --universal-padding: 66px;
  --border-radius-image: 20px;
  --border-radius-section: 30px;
  --service-card-shadow: 0px 42px 32.5px -13px rgba(2, 5, 183, 0.25);
}
```

### Consistent Spacing Scale
```css
/* Based on 66px universal padding system */
--space-xs: 8px;    /* 0.5rem */
--space-sm: 16px;   /* 1rem */
--space-md: 24px;   /* 1.5rem */
--space-lg: 32px;   /* 2rem */
--space-xl: 48px;   /* 3rem */
--space-2xl: 66px;  /* Universal padding */
--space-3xl: 80px;  /* Section padding */
```

### Z-Index Scale
```css
--z-base: 0;
--z-dropdown: 10;
--z-sticky: 20;
--z-overlay: 30;
--z-modal: 40;
--z-navbar: 50;
--z-tooltip: 60;
```

## 📝 Brand Voice & Content Guidelines

### Tone & Messaging
- **Welcoming & Calming**: Language should feel nurturing and safe
- **Professional & Trustworthy**: Maintain credibility while being approachable
- **Empowering**: Focus on client transformation and healing journey
- **Inclusive**: "Healing for All Ages" - welcome everyone

### Content Length Guidelines
```css
/* Hero Heading */
max-characters: 30;
max-words: 5;

/* Hero Subheading */
max-characters: 120;
max-words: 20;

/* Service Card Titles */
max-characters: 25;
max-words: 4;

/* Testimonial Content */
max-characters: 200;
max-words: 35;
```

---

## 🎯 Quick Reference

### Most Used Values
- **Background**: `#FFFBF5`
- **Brand Color**: `#0205B7`
- **Padding**: `66px`
- **Border Radius**: `20px` (images/cards), `30px` (sections), `9999px` (buttons)
- **Font**: `'Figtree, Helvetica, sans-serif'`
- **Heading Size**: `48px`
- **Body Size**: `16px`
- **Section Padding**: `py-20` (80px)

### Color Combinations That Work
- **Blue on Cream**: `#0205B7` text on `#FFFBF5` background
- **White on Blue**: White text on `rgba(2, 5, 183, 0.85)` overlay
- **Cyan Accents**: `rgba(99, 213, 249, 1)` for highlights and borders
- **Gold Stars**: `rgba(196, 169, 98, 1)` for ratings and special elements

This style guide ensures consistency across all pages and components while maintaining the healing, professional, and welcoming brand identity of The Reiki Goddess Healing.