# Context Recovery Document - The Reiki Goddess Healing Website

## 🚨 CRITICAL: Token Usage Monitoring

**CHECK CONTEXT USAGE REGULARLY**

- Monitor token usage throughout the session
- At **80% context window usage**, create a new session
- Save all work and commit changes before switching
- Reference this document in the new session to continue

## Project Overview

**Business**: The Reiki Goddess Healing - Energy healing and wellness services
**Owner**: Deirdre, The Reiki Goddess (Based in Roy, WA)
**Purpose**: Professional wellness website for Reiki healing, sound therapy, and spiritual services

## Current Status: Phase 3.5 - Testing Infrastructure 🚧

**Migration Progress**: Moving from separate React apps to unified monorepo structure
**Active Branch**: `main`
**Last Major Updates**:

- Phase 3 Responsive Design ✅ (2025-08-27)
- Phase 3.5 Testing Infrastructure Implementation (2025-08-28)
- Component Testing Expansion: 228 tests passing (2025-08-28)
- Test coverage increased from 5% → 45% of components
  **Context Usage**: Session in progress

## 🎨 Design Authority

**PRIMARY SOURCE**: `/figma-screenshots/homepage/` - ALL styling decisions must match these Figma designs
**Design System Established**:

```css
/* Brand Colors */
--primary-blue: #0205b7;
--cream-background: #fffbf5;
--purple: rgba(165, 147, 224, 1);
--peach: rgba(255, 198, 165, 1);
--cyan: rgba(99, 213, 249, 1);
--gold-tan: rgba(196, 169, 98, 1);
--text-dark: rgba(51, 51, 51, 1);
--text-gray: rgba(94, 94, 94, 1);

/* Typography */
font-family: "Figtree", sans-serif;
/* Sizes: 63.55px (hero), 48px (h2), 22px (subheadings), 16-18px (body) */

/* Layout */
max-width: 1440px;
padding: 66px; /* Universal edge buffer */
border-radius:
  20px (cards),
  27px (featured images),
  30px (sections);
```

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build**: Vite 6
- **Styling**: TailwindCSS
- **Package Manager**: npm workspaces (monorepo)
- **Testing**: Vitest + React Testing Library + Playwright
- **Font**: Figtree (Google Fonts)

## Project Structure

```
reiki-goddess-healing/
├── apps/                          # Future consolidated apps
├── packages/
│   ├── shared-components/         # Reusable React components
│   │   ├── src/
│   │   │   ├── Header/           # Navigation with logo
│   │   │   ├── Hero/             # HeroV2 with overlay
│   │   │   ├── Services/         # ServicesSection with cards
│   │   │   ├── MeetTheGoddess/   # About preview with images
│   │   │   ├── CommunityEvents/  # Events grid
│   │   │   ├── Testimonials/     # Client testimonials
│   │   │   ├── LetsConnect/      # CTA section
│   │   │   └── Footer/           # Site footer
│   │   └── demo/
│   │       └── public/img/       # Component images
│   ├── design-system/            # Colors, typography, tokens
│   ├── shared-utils/             # Validation, formatting
│   └── shared-assets/            # Static assets
├── figma-screenshots/            # DESIGN SOURCE OF TRUTH
│   └── homepage/
│       ├── images/              # Design assets
│       └── overlays/            # Component specs
├── Legacy Folders/              # Being migrated
│   ├── About/
│   ├── Contact/
│   ├── Home Page/
│   └── BLog/
└── CLAUDE.md                    # AI assistant instructions
```

## Key Design Patterns Implemented

### 1. Navigation Bar

- **Logo**: 248px × 92px, positioned at left: 66px (aligns with content)
- **Spacing**: 191px from logo to first nav item, 84px between items
- **Font**: Figtree 16px, weight 500, blue (#0205B7)

### 2. Hero Section

- **Dimensions**: 1308px × 732px image with 66px side buffers
- **Overlay Text**:
  - Heading: 63.55px, positioned 436px from image top
  - White text on dark overlay
  - Transparent outline buttons with arrows

### 3. Service Cards

- **Bevel Effect**: Blue duplicate rectangle 5px below white card
- **Hover State**: Gradient overlay (#0205B7 to cyan), white icons/text
- **Icons**: SVG format, blue in resting state

### 4. Image Bevels

- **IMG-4891**: 455.9px × 310.61px, -4.85° rotation, bevel -5px left, 5px down
- **IMG-3859**: 283.5px × 207.9px, 8.13° rotation, bevel 5px right, 5px down
- **Border Radius**: 27px (IMG-4891), 24px (IMG-3859)

### 5. Smoke Effect

- **Triple-layered** smoke.png for enhanced visibility
- **Position**: Aligned with page edge (0px left)
- **Rotation**: 180° to position correctly
- **Blend modes**: normal, multiply, overlay for depth

## Current Component States

### ✅ Completed Components

1. **Header** - Navigation with proper spacing
2. **HeroV2** - Background image with text overlay
3. **ServicesSection** - 4 service cards with hover effects
4. **MeetTheGoddess** - Text with positioned images and smoke
5. **CommunityEvents** - Purple gradient section
6. **Testimonials** - Client reviews grid
7. **LetsConnect** - CTA with gradient background

### 🚧 In Progress

- Footer section refinement
- Routing between pages
- Mobile responsiveness

## Development Commands

```bash
# Install dependencies
npm install

# Start development
npm run dev

# Build project
npm run build

# Run tests
npm test

# Type checking
npm run type-check

# Linting
npm run lint
```

## Critical Files to Review

1. `/CLAUDE.md` - Detailed project instructions and conventions
2. `/context_recovery.md` - This document, for session context
3. `/todo_list.md` - Implementation plan, current progress, and session accomplishments
4. `/testing-strategy.md` - Testing gaps and implementation roadmap
5. `/figma-screenshots/homepage/` - Design specifications (source of truth)
6. `/packages/shared-components/src/` - Component implementations
7. `/packages/design-system/src/` - Design tokens

## Common Tasks & Solutions

### Adding New Components

1. Create in `/packages/shared-components/src/ComponentName/`
2. Export from `/packages/shared-components/src/index.ts`
3. Follow existing patterns (TypeScript interfaces, Figma specs)

### Updating Styles

1. Check Figma screenshots first
2. Use exact values (don't approximate)
3. Test hover states and transitions

### Image Management

1. Source images from `/figma-screenshots/homepage/images/`
2. Copy to `/packages/shared-components/demo/public/img/`
3. Reference as `/img/filename.ext` in components

## Token Management Strategy

### Context Window Monitoring

**At Session Start**: Note starting context usage
**Every Major Task**: Check current usage
**At 80% Usage**:

1. Complete current task
2. Commit all changes with descriptive message
3. Create session summary
4. Start fresh session with this document

### Efficient Token Usage

- Use `Grep` and `Glob` instead of reading entire files
- Batch related tool calls together
- Reference line numbers when discussing code
- Avoid re-reading unchanged files

### Session Handoff Checklist

- [ ] All changes committed
- [ ] Current task documented in TODO
- [ ] Any blockers or issues noted
- [ ] Next steps clearly defined
- [ ] This document updated if needed

## Recent Significant Changes (Latest First)

1. **Claude Code Automation System Implemented** (2025-08-28 - Late Afternoon)
   - ✅ Created `.claude/` directory with comprehensive hooks system
   - ✅ Implemented automatic documentation updates (prompts Claude when needed)
   - ✅ Added git protocol enforcement with commit thresholds
   - ✅ Created 9 automation scripts for workflow management
   - ✅ Hooks now enforce: git commits, doc updates, critical file protection
   - ✅ System works automatically without manual intervention

2. **Phase 3.5 Testing Infrastructure COMPLETED** (2025-08-28)
   - ✅ Morning: Fixed all failing Header/MobileHeader tests (36 → 36 passing)
   - ✅ Morning: Created comprehensive HeroV2 tests (31 new tests)
   - ✅ Morning: Created comprehensive ServicesSection tests (33 new tests)
   - ✅ Morning: Fixed TypeScript errors in test files with vitest-env.d.ts
   - ✅ Afternoon: Created MeetTheGoddess tests (41 new tests)
   - ✅ Afternoon: Created CommunityEvents tests (42 new tests)
   - ✅ Afternoon: Created Testimonials tests (45 new tests)
   - ✅ Evening: Created LetsConnect tests (48 new tests)
   - ✅ Evening: Created Footer tests (54 new tests)
   - ✅ **FINAL: 330 tests passing (0 failures) - PHASE COMPLETE**
   - Coverage increased from ~5% to **~80% of all components**
3. **Phase 3.5 Testing Infrastructure** (2025-08-27) - Initial testing setup
   - Testing gap analysis identifying ~5% coverage
   - Testing strategy document with KPIs
   - Initial Header component tests (26/32 passing)
4. **Phase 3 Completed** (2025-08-27) - Full responsive design implementation
   - Comprehensive breakpoint system (xs to 2xl)
   - Mobile header with hamburger menu
   - Responsive hero, services, and all components
   - Mobile-first approach with progressive enhancement
5. **Security Hook Resolved** (2025-08-27) - Fixed false positives in security scanner
6. **Phase 2B Completed** - Homepage refinement with animations and style guide
7. **Scroll animations** implemented with intersection observer
8. **Lazy loading** added for optimized image performance
9. **Hover effects** created matching healing brand personality
10. **Style guide** comprehensive documentation created

## Next Immediate Tasks

**See `/todo_list.md` for detailed implementation plan and progress tracking**

### Current Phase (Phase 3.5 - Testing Infrastructure)

1. ✅ Fix failing Header tests (COMPLETE - all 36 passing)
2. ✅ Implement Hero component tests (COMPLETE - 31 tests)
3. ✅ Implement Services section tests (COMPLETE - 33 tests)
4. ✅ Implement MeetTheGoddess component tests (COMPLETE - 41 tests)
5. ✅ Implement CommunityEvents tests (COMPLETE - 42 tests)
6. ✅ Implement Testimonials component tests (COMPLETE - 45 tests)
7. ✅ Implement LetsConnect component tests (COMPLETE - 48 tests)
8. ✅ Implement Footer component tests (COMPLETE - 54 tests)
9. ⏳ Add integration tests for user flows
10. ⏳ Set up visual regression testing

### Next Phase (Phase 4 - Page Migration & Routing)

1. Set up React Router v6
2. Create layout wrapper component
3. Implement navigation active states
4. Migrate About page with Figma designs
5. Migrate Services page

For detailed task breakdown and progress tracking, refer to:
📋 **[todo_list.md](./todo_list.md)** - Complete development roadmap with all phases

## Claude Code Automation (NEW!)

**Important**: The project now has automated hooks in `.claude/` that:

- **Automatically prompt Claude** to update documentation when needed
- **Enforce git commits** at thresholds (5+ files, 3+ test files)
- **Generate conventional commit messages** based on file patterns
- **Protect critical files** from edits with uncommitted changes
- **Track sessions** and generate summaries

To use: Simply work normally - the hooks activate automatically. They're configured in `.claude/settings.json`.

## Known Issues & Workarounds

- **Smoke visibility**: Use multiple layers with different blend modes
- **Button arrows**: Ensure SVG included in both button states
- **Font rendering**: Figtree must be loaded from Google Fonts
- **Bevel effects**: Use duplicate shape method, not borders

## Contact & Resources

- **Figma Designs**: `/figma-screenshots/` directory
- **Component Demo**: Run `npm run dev` and visit `http://localhost:5173`
- **Git Branch**: `feat/monorepo-migration`

---

_Last Updated_: 2025-08-27
_Remember_: Check token usage regularly and refresh context at 80%!
