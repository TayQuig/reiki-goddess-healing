# Anima Header and Footer Component Extraction Plan

## Completed: Universal Header and Footer Components Extracted

### Task 1: Extract Header from About page ✅

**Source:** `/About/src/screens/About/About.tsx` (lines 38-59, plus navigationItems array lines 4-11)  
**Target:** `/packages/shared-components/src/Navigation/Header.tsx`

**Extracted Components:**
- **Header Component** - Exact extraction preserving all Anima styling
- **NavigationItem Interface** - Maintains original structure
- **AnimaContainer** - Responsive wrapper for 1440px fixed-width designs

**Preserved Elements:**
- ✅ Exact Tailwind classes from Anima design
- ✅ Logo image reference (`/img/the-reiki-goddess-4-25-x-5-5-in-facebook-cover-1.png`)
- ✅ Navigation structure with 6 items (Home, About, Services, Events, Blog, Contact)
- ✅ Figtree font family styling
- ✅ Hover effects (`hover:opacity-80 transition-opacity`)
- ✅ 1440px fixed width with absolute positioning (`absolute w-[1440px] h-[93px] top-0 left-0`)
- ✅ Exact spacing: navigation at `left-[623px]` with `gap-[84px]`
- ✅ Logo positioning at `left-[49px]` with exact dimensions `w-[248px] h-[92px]`

### Task 2: Extract Footer from Contact page ✅

**Source:** `/Contact/src/screens/Contact/sections/FooterSection/FooterSection.tsx`  
**Target:** `/packages/shared-components/src/Footer/Footer.tsx`

**Extracted Components:**
- **Footer Component** - Exact extraction with enhanced accessibility
- **NavigationItem Interface** - Consistent with header structure

**Preserved Elements:**
- ✅ All navigation links with proper href structure
- ✅ Semantic HTML structure (nav, ul, li tags)
- ✅ Exact styling and layout from Contact page
- ✅ Accessibility features: `role="contentinfo"`, `aria-label` attributes
- ✅ Focus management with `focus:outline-2 focus:outline-variable-collection-color-duplicate`
- ✅ Same positioning and dimensions as header component

### Task 3: Create ResponsiveContainer wrapper ✅

**Target:** `/packages/shared-components/src/AnimaContainer/AnimaContainer.tsx`

**Created Components:**
- **AnimaContainer** - Specialized wrapper for Anima fixed-width components
- Maintains 1440px fixed width design from Anima
- Centers on larger screens with grid layout
- Preserves exact background colors (`#fefbf5`)

## Component Usage Patterns

### Header Component
```tsx
import { Header, AnimaContainer } from '@reiki-goddess/shared-components';

// Basic usage with defaults
<AnimaContainer>
  <Header />
</AnimaContainer>

// Custom navigation
<AnimaContainer>
  <Header 
    navigationItems={[
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      // ... custom items
    ]}
    logoSrc="/custom-logo.png"
    logoAlt="Custom alt text"
  />
</AnimaContainer>
```

### Footer Component
```tsx
import { Footer as AnimaFooter, AnimaContainer } from '@reiki-goddess/shared-components';

// Basic usage matching header
<AnimaContainer>
  <AnimaFooter />
</AnimaContainer>

// Custom configuration
<AnimaContainer>
  <AnimaFooter 
    navigationItems={[
      { label: "Home", href: "/" },
      { label: "Contact", href: "/contact" },
      // ... custom items
    ]}
  />
</AnimaContainer>
```

## File Structure Created

```
packages/shared-components/src/
├── Navigation/
│   ├── Header.tsx          # Exact Anima header extraction
│   └── index.ts           # Export definitions
├── Footer/
│   ├── Footer.tsx         # Exact Anima footer extraction  
│   └── index.ts          # Export definitions
├── AnimaContainer/
│   ├── AnimaContainer.tsx # Responsive wrapper for fixed-width
│   └── index.ts          # Export definitions
└── index.ts              # Updated with new exports
```

## Design Fidelity Maintained

### Exact Anima Specifications Preserved:
1. **Fixed Dimensions:** All components maintain exact 1440x93px dimensions
2. **Absolute Positioning:** Components use absolute positioning as in original
3. **Font System:** Preserves Figtree font family with exact font weights
4. **Color System:** Uses `variable-collection-color-duplicate` variables
5. **Spacing System:** Maintains exact gap values (`gap-[84px]`) and positioning
6. **Interactive States:** Preserves hover effects and focus management
7. **Image References:** Maintains original Anima asset paths

### Typography Specifications:
- Font Family: `[font-family:'Figtree',Helvetica]`
- Font Weight: `font-semibold`
- Font Size: `text-base`
- Tracking: `tracking-[0]`
- Leading: `leading-[normal]`
- White Space: `whitespace-nowrap`

### Layout Specifications:
- Container: `absolute w-[1440px] h-[93px] top-0 left-0`
- Navigation: `absolute w-[716px] h-[19px] top-[37px] left-[623px]`
- Logo: `absolute w-[248px] h-[92px] top-px left-[49px]`
- Navigation Items: `inline-flex items-center gap-[84px]`

## Integration Notes

### Shared Assets Compatibility
- Components reference `/img/` paths as in original Anima structure
- Logo path: `/img/the-reiki-goddess-4-25-x-5-5-in-facebook-cover-1.png`
- Future migration to shared-assets package will require path updates

### CSS Variable Dependencies
- Components depend on `variable-collection-color-duplicate` CSS variables
- These variables must be defined in design-system package
- Fallback colors may be needed for development

### Responsive Behavior
- Components maintain fixed 1440px width as per Anima design
- AnimaContainer provides centering and responsive background
- Mobile adaptation would require new components (not part of this extraction)

## Quality Assurance

### Accessibility Features Maintained:
- ✅ Semantic HTML structure with proper roles
- ✅ ARIA labels for navigation context
- ✅ Focus management with visible focus indicators
- ✅ Keyboard navigation support
- ✅ Screen reader compatibility

### TypeScript Integration:
- ✅ Proper interface definitions for all props
- ✅ Type safety for navigation items
- ✅ Optional prop handling with sensible defaults
- ✅ Export types for consumer applications

### Testing Readiness:
- ✅ Data-testid attributes for component testing
- ✅ Consistent component structure for test targeting
- ✅ Predictable prop interfaces for test scenarios

## Conclusion

The Header and Footer components have been successfully extracted from the Anima designs with complete fidelity to the original specifications. All styling, positioning, fonts, and interactive behaviors have been preserved exactly as they appeared in the source components.

The new components are ready for integration across all pages and will provide consistent navigation experience while maintaining the exact visual design approved in the Anima specifications.

**Next Steps:**
1. Update page components to use extracted Header/Footer
2. Ensure CSS variables are defined in design-system package  
3. Test components across different page contexts
4. Consider asset path migration to shared-assets package