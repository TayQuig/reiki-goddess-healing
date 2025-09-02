# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 📚 Critical Context Files

**These files provide essential context and should be referenced regularly:**

- @context_recovery.md - Current progress, session history, and handoff information
- @todo_list.md - Task tracking, phase progress, and session accomplishments  
- @testing-strategy.md - Testing coverage metrics and implementation roadmap
- @testing/TESTING_SUMMARY.md - Current test failures and bug documentation
- @testing/CONTEXT_REFRESH_SUMMARY.md - Priority bugs and testing status (if exists)

## 🚨 CRITICAL PROTOCOLS - ALWAYS FOLLOW

### Context Management & Documentation

**CHECK CONTEXT USAGE:** Monitor throughout session - aim to refresh at 75-80%

**MANDATORY: When approaching 75-80% context usage:**

1. Update `/context_recovery.md` with current progress and status
2. Update `/todo_list.md` with session accomplishments
3. Update `/testing-strategy.md` if testing work was done
4. Run test summary generator if test failures exist
5. Commit all work with descriptive conventional commit messages
6. Prepare for context refresh by documenting next steps

**Starting a New Session:**
1. Read @context_recovery.md first to understand current state
2. Check @todo_list.md for next immediate tasks
3. Review @testing-strategy.md if doing testing work
4. Check @testing/TESTING_SUMMARY.md for current test failures
5. Review @testing/CONTEXT_REFRESH_SUMMARY.md if it exists
6. Continue from documented stopping point

### Git Commit Protocol

**ALWAYS follow these git practices:**

```bash
# 1. Check status and diff before committing
git status
git diff --cached

# 2. Use conventional commits with this format:
git commit -m "type(scope): description

- Detail 1
- Detail 2

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

**Commit types:** feat, fix, docs, style, refactor, test, chore
**NEVER commit without user's explicit request**

### Testing Protocol

**When adding new components:**

1. Create comprehensive test files covering:
   - Rendering tests
   - Interaction tests
   - Accessibility tests
   - Responsive behavior tests
   - Edge cases
2. Ensure TypeScript types are correct (check vitest-env.d.ts)
3. Run tests and verify 100% pass rate before committing
4. Update testing-strategy.md with new coverage metrics

### Development Commands to Remember

```bash
# Always run these before committing:
npm test -- --run         # Run all tests
npm run type-check        # Check TypeScript
npm run lint             # Check linting

# Development commands:
npm run dev              # Start all dev servers
npm run build           # Build all packages
```

## ⚠️ CRITICAL: Design Source of Truth

**FIGMA SCREENSHOTS ARE THE PRIMARY DESIGN REFERENCE:**

- `/figma-screenshots/homepage/` - Contains all homepage design specifications
- Components, overlays, sections, and images from Figma
- All styling decisions must match these designs exactly

**LEGACY ANIMA-GENERATED FOLDERS (Reference Only):**

- `/Home Page/` - Original landing page structure
- `/About/` - Original about page structure
- `/Contact/` - Original contact page structure
- `/BLog/` - Original blog structure

## Project Overview

This repository is currently undergoing migration from separate React applications to a unified monorepo structure. The project represents "The Reiki Goddess Healing" business website.

**Migration Status: Phase 3.5 In Progress - Testing Infrastructure (100 tests passing)**

### Original Structure

- **About/** - About page with business information and founder details
- **Contact/** - Contact page with form and contact information
- **Home Page/** - Landing page (appears to be a design wireframe)
- **BLog/** - Blog section (duplicate structure of About)

### New Monorepo Structure (In Progress)

- **apps/** - Individual application packages
- **packages/** - Shared packages and libraries
  - `@reiki-goddess/shared-components` - Reusable React components
  - `@reiki-goddess/design-system` - Design tokens, colors, typography
  - `@reiki-goddess/shared-utils` - Utility functions and validation
  - `@reiki-goddess/shared-assets` - Static assets and media

## Technology Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 6
- **Styling**: TailwindCSS with custom design system
- **Package Manager**: npm with workspaces
- **Testing**: Vitest + React Testing Library + Playwright
- **Code Quality**: ESLint + Prettier + Conventional Commits
- **Design**: Generated from Anima design tool (legacy)

## Development Commands

### Root Level (Monorepo)

```bash
# Install all dependencies
npm install

# Run development for all apps
npm run dev

# Build all packages and apps
npm run build

# Run all tests
npm run test

# Run E2E tests
npm run test:e2e

# Lint all code
npm run lint

# Format all code
npm run format

# Type check all packages
npm run type-check
```

### Legacy Page Directories (About/, Contact/, Home Page/, BLog/)

```bash
# Install dependencies (in each directory)
npm install

# Start development server (runs on http://localhost:5173/)
npm run dev

# Build for production
npm run build
```

## Project Architecture

### Current Monorepo Structure

```
root/
├── apps/                     # Individual applications (future)
├── packages/                 # Shared packages
│   ├── shared-components/    # React components
│   │   ├── src/
│   │   │   ├── Button.tsx
│   │   │   ├── Navigation.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── *.test.tsx
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── vitest.config.ts
│   ├── design-system/        # Design tokens
│   │   ├── src/
│   │   │   ├── colors.ts
│   │   │   ├── typography.ts
│   │   │   └── tailwind.config.ts
│   │   └── package.json
│   ├── shared-utils/         # Utilities
│   │   ├── src/
│   │   │   ├── validation.ts
│   │   │   ├── formatting.ts
│   │   │   ├── constants.ts
│   │   │   └── *.test.ts
│   │   └── package.json
│   └── shared-assets/        # Static assets
├── e2e/                      # End-to-end tests
├── Legacy Directories/       # Original structure (to be migrated)
│   ├── About/
│   ├── Contact/
│   ├── Home Page/
│   └── BLog/
├── Configuration Files/
│   ├── package.json          # Root workspace config
│   ├── tsconfig.json         # TypeScript project references
│   ├── .eslintrc.json        # Linting rules
│   ├── .prettierrc.json      # Code formatting
│   ├── playwright.config.ts  # E2E testing
│   ├── vite.config.shared.ts # Shared Vite config
│   └── vitest.config.shared.ts # Shared test config
└── Git Protocol Files/
    ├── .gitignore
    ├── .commitlintrc.json
    └── .github/pull_request_template.md
```

### Legacy Structure (Pre-Migration)

Each original page follows this structure:

```
PageName/
├── src/
│   ├── index.tsx              # Entry point
│   └── screens/
│       └── ComponentName/
│           ├── ComponentName.tsx
│           ├── index.ts
│           └── sections/      # (Contact page only)
├── static/img/               # Static assets
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tailwind.css             # TailwindCSS entry
└── tsconfig files
```

### Component Architecture

**Shared Components (New Monorepo)**

- **Homepage Components**: Header, HeroV2, FeaturesBar, MeetTheGoddess, ServicesSection, CommunityEvents, Testimonials, LetsConnect, Footer
- **Design System**:
  - Colors: Brand palette with primary blue (#0205B7), cream background (#FFFBF5)
  - Layout: 1440px max width, 66px universal padding, precise component dimensions
  - Typography: Figtree font family with defined scales
- **Utility Functions**: Validation, formatting, and constants
- **Testing**: Each component has corresponding test files
- **Type Safety**: Full TypeScript coverage with strict configuration

**Legacy Architecture**

- **Single Page Components**: Each directory contains one main screen component
- **Section-based Design**: Contact page uses modular sections (HeaderSection, ContactFormSection, etc.)
- **Static Assets**: Images stored in `/static/img/` directory
- **CSS Variables**: Uses Tailwind with custom CSS variables for design system colors

### Key Conventions

**New Monorepo Standards**

- Components use TypeScript with proper interface definitions
- Shared packages follow `@reiki-goddess/package-name` naming convention
- All packages have TypeScript project references configured
- Testing with Vitest and React Testing Library
- Conventional commits for consistent git history
- ESLint + Prettier for code quality

**Legacy Conventions**

- Components use TypeScript with JSX.Element return types
- Styling uses TailwindCSS utility classes
- Custom colors defined as `variable-collection-color-*` variables
- Images referenced from `/img/` path (served from static directory)
- Responsive design with absolute positioning for layout

## Configuration Files

### Vite Configuration

- Uses React plugin and Anima screen graph plugin (development only)
- PostCSS with TailwindCSS processing
- Static files served from `./static` directory
- Base path set to `./` for relative builds

### TailwindCSS

- Extended color palette using CSS variables
- Content scanning from `./src/**/*.{html,js,ts,jsx,tsx}`
- Includes `tailwindcss-animate` plugin

### TypeScript

- Uses project references with separate app and node configurations
- Strict TypeScript configuration for development

## Working with this Codebase

### Current Migration Status

**✅ Phase 1 Complete: Monorepo Foundation**

- Workspace configuration with npm workspaces
- Shared tooling setup (TypeScript, ESLint, Prettier, Vitest)
- Basic shared packages with initial components
- Testing infrastructure with unit and E2E tests
- Git protocols with conventional commits
- TypeScript project references for build optimization

**🚧 Next Phases (Planned)**

- Phase 2: Extract and consolidate shared assets
- Phase 3: Migrate individual applications to apps/ directory
- Phase 4: Implement unified routing and integration

### Development Workflow

**For New Monorepo Development:**

1. Work from the root directory
2. Use `npm install` to install all dependencies
3. Use `npm run dev` to start all development servers
4. Create components in `packages/shared-components/src/`
5. Add utilities to `packages/shared-utils/src/`
6. Update design tokens in `packages/design-system/src/`
7. Write tests alongside your code
8. Use conventional commit format: `type(scope): description`

**For Legacy Page Development:**

1. Navigate to the specific page directory you want to work on
2. Run `npm install` if dependencies aren't installed
3. Use `npm run dev` to start development server
4. Make changes to components in `src/screens/`
5. Build with `npm run build` when ready for production

### Migration Guidelines

**When working on existing pages:**

1. Extract reusable components to `packages/shared-components`
2. Move design tokens to `packages/design-system`
3. Add utility functions to `packages/shared-utils`
4. Update imports to use shared packages
5. Add proper TypeScript interfaces
6. Include tests for new functionality

## Current State & Next Steps

**✅ Phase 1 Complete: Monorepo Foundation**

- Monorepo workspace setup
- Shared component library foundation
- Design system package structure
- Testing infrastructure
- Code quality tools (ESLint, Prettier)
- Git workflow with conventional commits
- TypeScript project references

**✅ Phase 2A Progress: Homepage Perfection**

- **Completed Homepage Sections:**
  - Header/Navigation with cream background (#FFFBF5)
  - Hero with precise dimensions (1308px × 732px, 66px buffers)
  - Services section with white cards and blue shadows
  - Community Events with purple gradient and rounded corners
  - Meet The Goddess with positioned images (IMG_4891: 455.9px × 310.61566px)
  - Testimonials with refined styling
  - Let's Connect CTA with gradient background
  - Universal rounded corners (20px images/cards, 30px sections, pill buttons)
  - Consistent 66px padding throughout

- **Design System Extracted:**
  - Colors: Brand blue (#0205B7), cream (#FFFBF5), purple gradient
  - Layout: 1440px container, 66px padding, 825px hero height
  - Typography: Figtree font, defined size scales
  - Shadows: Service cards with blue drop shadow
  - Border radius: Standardized for brand consistency

**🚧 Phase 2B Next: Style Guide & Remaining Pages**

- Complete Footer section
- Create comprehensive style guide document
- Update CLAUDE.md with detailed component patterns
- Build remaining pages using established patterns
- Implement routing between pages

**⏳ Future Phases:**

- Phase 3: Migrate individual applications to apps/ directory
- Phase 4: Implement unified routing and integration
- Phase 5: Set up deployment pipeline
- Phase 6: Performance optimization

## Established Design Patterns (Use for All Pages)

### Universal Brand Standards

- **Background Color**: #FFFBF5 (warm cream) for entire site
- **Container**: 1440px max width with 66px padding on all sides
- **Rounded Corners**:
  - Buttons: Full/pill shape
  - Images: 20px (standard), 27px for featured images
  - Cards: 20px
  - Sections: 30px for large gradient sections
- **66px Rule**: Universal buffer between content and page edges

### Color Palette

- **Primary Blue**: #0205B7 (rgba(2, 5, 183, 1))
- **Purple**: rgba(165, 147, 224, 1)
- **Peach**: rgba(255, 198, 165, 1)
- **Cyan**: rgba(99, 213, 249, 1)
- **Gold/Tan**: rgba(196, 169, 98, 1) for logo text
- **Text Dark**: rgba(51, 51, 51, 1)
- **Text Gray**: rgba(94, 94, 94, 1)

### Typography

- **Font Family**: Figtree, Helvetica, sans-serif
- **Headings**: 48-64px, font-weight: 700
- **Body**: 16-18px, font-weight: 400
- **Buttons**: 16px, font-weight: 500

### Component Patterns

- **Hero**: 825px total height (93px nav + 732px image), 1308px image width
- **Buttons**:
  - Primary: Solid blue background, white text
  - Secondary: Transparent with blue border and text
- **Service Cards**: White background, blue bottom border, blue drop shadow
- **Sections**: py-20 vertical padding (80px)

### Shadows

- **Service Cards**: 0px 42px 32.5px -13px rgba(2, 5, 183, 0.25)
- **Container**: 0 0 40px rgba(0, 0, 0, 0.1)

## Critical Documentation Files to Maintain

**ALWAYS keep these files up-to-date:**

1. **`/context_recovery.md`** - Session context and progress tracking
   - Update when starting/ending sessions
   - Document major accomplishments
   - Track context usage percentage
   - Note blockers or important decisions

2. **`/todo_list.md`** - Implementation plan and task tracking
   - Update session accomplishments section
   - Mark completed tasks
   - Add new tasks discovered during work
   - Track testing coverage percentages

3. **`/testing-strategy.md`** - Testing coverage and strategy
   - Update coverage percentages after adding tests
   - Document testing patterns discovered
   - Track KPIs and metrics

4. **`/testing/TESTING_SUMMARY.md`** - Current test failures and bugs
   - Automatically updated when tests run
   - Documents failures instead of fixing tests
   - Tracks bugs per component
   - Use for bug fixing sessions

5. **`/CLAUDE.md`** (this file) - Project instructions
   - Update migration status
   - Add new patterns or conventions discovered
   - Document important decisions

## Notes

- Original design-to-code generated project from Anima (legacy)
- Figma screenshots in `/figma-screenshots/homepage/` are the source of truth
- Contact page has the most complex structure with modular sections
- Home Page appears to be a wireframe/design preview rather than functional page
- BLog appears to be a duplicate of About page structure
- Migration follows systematic approach with comprehensive testing at each phase
