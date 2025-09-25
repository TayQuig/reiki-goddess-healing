# Task: Polish Contact Page Details to Match Figma

**Status**: 🔄 IN PROGRESS (90% Complete)
**Priority**: Medium  
**Created**: 2025-09-09  
**Last Updated**: 2025-09-10

## Objective

Collaborate with the client to ensure the Contact page implementation perfectly matches the Figma design specifications through careful visual comparison and iterative refinement.

## Context for Fresh Instance

### Project Overview

- **Business**: The Reiki Goddess Healing - Energy healing and wellness services
- **Owner**: Deirdre, The Reiki Goddess (Based in Roy, WA)
- **Tech Stack**: React 18, TypeScript, TailwindCSS, Vite 6
- **Design System**: Figma-first approach with screenshots as source of truth

### Key Design Principles

- **Primary Blue**: #0205B7
- **Cream Background**: #FFFBF5
- **66px Rule**: Universal padding from page edges
- **Font**: Figtree (Google Fonts)
- **Border Radius**: 20px cards, 27px featured images, pill buttons

### Contact Page Components

1. **ContactPage** - Main page wrapper
2. **FigmaContactForm** - Form with split name fields, email, phone, message, terms checkbox
3. **ContactInfoCard** - Blue bevel effect cards (Location, Phone, Email)
4. **Decorative Elements** - Smoke effects, map section

## Collaboration Process

### 1. Setup for Review Session

- [ ] Ensure dev server running: `npm run dev`
- [ ] Open Contact page in browser
- [ ] Have Figma screenshots ready: `/figma-screenshots/contact/`
- [ ] Enable browser DevTools for live adjustments

### 2. Visual Comparison Checklist

#### Hero Section

- [ ] "Get in Touch" title - size, weight, color
- [ ] Subtitle text - spacing and styling
- [ ] Background color matches cream (#FFFBF5)
- [ ] Section padding (should be 66px)

#### Contact Form

- [ ] Field layout (firstName/lastName on same row)
- [ ] Input styling - border color, radius, height
- [ ] Placeholder text color and style
- [ ] Error message styling and positioning
- [ ] Terms checkbox alignment and text
- [ ] Submit button - color, size, hover state

#### Contact Info Cards

- [ ] Blue bevel effect (9px offset, #0205B7)
- [ ] Card spacing and grid layout
- [ ] Icon size and color
- [ ] Typography hierarchy
- [ ] Hover animations

#### Decorative Elements

- [ ] Smoke effect positioning
- [ ] Opacity and blend modes
- [ ] Map section placement
- [ ] Overall visual balance

### 3. Iteration Process

1. **Client identifies discrepancy**
2. **Developer locates relevant code**:
   - Component: `/packages/shared-components/src/pages/ContactPage.tsx`
   - Form: `/packages/shared-components/src/Contact/FigmaContactForm/`
   - Cards: `/packages/shared-components/src/Contact/ContactInfoCard/`
3. **Make adjustment** (use precise Figma values)
4. **Live reload** to verify change
5. **Client confirms** or requests further adjustment

### 4. Common Adjustments Needed

- Spacing tweaks (margins, padding)
- Color accuracy (use exact hex/rgba values)
- Typography details (line-height, letter-spacing)
- Shadow effects (blur, spread, color)
- Border radius consistency
- Hover state transitions

## Technical Notes

### File Locations

```
packages/shared-components/src/
├── pages/ContactPage.tsx           # Main page component
├── Contact/
│   ├── FigmaContactForm/          # Form implementation
│   │   ├── FigmaContactForm.tsx
│   │   └── index.ts
│   └── ContactInfoCard/           # Info card component
│       ├── ContactInfoCard.tsx
│       └── index.ts
```

### Quick Commands

```bash
# Run dev server
npm run dev

# Run specific component tests
npm test -- FigmaContactForm

# Type check
npm run type-check
```

### Style Utilities

- TailwindCSS classes for quick adjustments
- Custom CSS in component files for precise control
- Design tokens in `/packages/design-system/src/`

## Completed Work (2025-09-10)

### Visual Elements Polished

1. **Smoke Effects Behind Contact Cards**
   - Added 10 layers of smoke on left and right for vibrancy
   - Left smoke: positioned at `-246px` from left edge
   - Right smoke: positioned at `-304px` from right edge with 180° rotation
   - Both positioned to appear behind contact cards

2. **Elevated Body Effect**
   - Applied same elevated container pattern from homepage
   - Background: light gray (`bg-gray-50`)
   - Main container: cream (`#FFFBF5`) with box shadow
   - Creates consistent visual hierarchy across pages

3. **Contact Info Cards**
   - Implemented blue shadow effect using duplicate shape technique
   - Blue shape positioned 10px below white card
   - Updated icons to use correct SVGs from figma-screenshots:
     - Location: `mdi_location.svg`
     - Phone: `ic_baseline-phone.svg`
     - Email: `ic_baseline-email.svg`
     - Arrow: `gridicons_arrow-up.svg`
   - Fixed text spacing to match Figma specifications

4. **Form Styling**
   - Submit button: brand blue (`#0205B7`) border and text
   - Fixed checkbox functionality with proper styling
   - Maintained all security features

## Next Steps

### 1. Contact Form Data Collection Setup

**Status**: Plan completed, pending implementation
**Decision Made**: Use Resend with domain email

A comprehensive implementation plan has been created and is available at:

- `/docs/design/resend-implementation-plan.md` - Complete Resend integration guide

The plan includes:

- Backend API architecture with security best practices
- Email service implementation with React Email templates
- Domain configuration for professional email delivery
- Rate limiting and error handling
- Testing strategy and deployment checklist

**Next Steps for Implementation**:

1. Create Resend account and verify domain
2. Set up backend infrastructure (Vercel/Netlify Functions)
3. Implement according to the plan in `/docs/design/resend-implementation-plan.md`
4. Test thoroughly before deployment

### 2. Google Maps Integration

**Status**: Not started

- [ ] Design google-maps-integration-planner agent
- [ ] Implement Google Maps integration plan
- [ ] Test Google Maps functionality

### 3. Final Visual Review

- [ ] Review smoke effect alignment with map
- [ ] Verify all hover states match Figma
- [ ] Confirm mobile responsiveness
- [ ] Test form validation styling

### 4. Integration Tasks

- [ ] Implement chosen email service
- [ ] Add environment variables for API keys
- [ ] Update ContactPage onSubmit handler
- [ ] Test form submissions end-to-end

## Success Criteria

- [x] Contact cards match Figma design
- [x] Smoke effects properly positioned
- [x] Form elements styled correctly
- [x] All interactive elements work correctly
- [x] Maintains accessibility (ARIA labels, keyboard nav)
- [x] No regression in security features
- [ ] Contact form sends emails to business owner
- [ ] Tests updated for new functionality

## Notes for Next Session

- Created `resend-integration-planner` agent for researching implementation
- Client has domain email option which improves professional appearance
- Form already has comprehensive security features built-in
- Consider adding Google reCAPTCHA for additional spam protection
