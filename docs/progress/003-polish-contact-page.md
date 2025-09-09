# Task: Polish Contact Page Details to Match Figma

**Status**: 📋 PENDING  
**Priority**: Medium  
**Created**: 2025-09-09  
**Target Completion**: 2025-09-10  

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

## Success Criteria
- [ ] Client confirms visual match to Figma
- [ ] All interactive elements work correctly
- [ ] Maintains accessibility (ARIA labels, keyboard nav)
- [ ] No regression in security features
- [ ] Tests still passing after changes

## Notes for Fresh Instance
- Client prefers collaborative review sessions
- Be prepared to make live adjustments
- Keep Figma screenshots visible during review
- Document any design decisions made during session
- Update style guide if new patterns emerge