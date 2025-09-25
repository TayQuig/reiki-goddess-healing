# Migration Guide - From Legacy to Unified Monorepo

## Overview

This guide documents the migration process from separate React applications to a unified monorepo structure for The Reiki Goddess Healing website.

## Migration Status

**Current Phase:** Phase 4 Complete ✅ - Unified monorepo with 5 fully implemented pages

## Migration Phases

### ✅ Phase 1: Monorepo Foundation (Complete)

- **Goal:** Establish workspace infrastructure
- **Completed:**
  - npm workspace configuration
  - Shared tooling (TypeScript, ESLint, Prettier, Vitest)
  - Basic shared packages structure
  - Testing infrastructure (unit + E2E)
  - Git protocols with conventional commits
  - TypeScript project references

### ✅ Phase 2: Extract Shared Components (Complete)

- **Goal:** Create reusable component library
- **Completed:**
  - @reiki-goddess/shared-components package
  - @reiki-goddess/design-system package
  - @reiki-goddess/shared-utils package
  - @reiki-goddess/shared-assets package
  - Component testing with 100% coverage
  - Design tokens extraction

### ✅ Phase 3: Migrate to Unified App (Complete)

- **Goal:** Single application with all pages
- **Completed:**
  - Created apps/main application
  - Migrated all 5 pages (Home, About, Services, Blog, Contact)
  - Implemented React Router navigation
  - Consolidated styling with design system
  - Full TypeScript coverage
  - Comprehensive test suite

### ✅ Phase 4: Polish & Refinement (Complete)

- **Goal:** Production-ready application
- **Completed:**
  - Fixed all test failures (100% pass rate)
  - Responsive design implementation
  - Accessibility improvements
  - Performance optimizations
  - SEO meta tags
  - Documentation updates

### 🚧 Phase 5: Email Integration (Active)

- **Goal:** Resend.com email service integration
- **Status:** Planning phase
- **Next Steps:** See @docs/design/resend-integration-plan.md

## Legacy Structure (Pre-Migration)

### Original Directory Layout

```
root/
├── About/              # About page
├── Contact/            # Contact page with form
├── Home Page/          # Landing page (wireframe)
├── BLog/              # Blog section
└── Each directory contains:
    ├── src/
    │   ├── index.tsx
    │   └── screens/ComponentName/
    ├── static/img/
    ├── package.json
    ├── vite.config.ts
    └── tailwind.config.js
```

### Legacy Architecture Patterns

- Single page components per directory
- Anima design tool generated code
- Section-based component structure
- Static assets in `/static/img/`
- CSS variables for design tokens
- Absolute positioning layouts

## New Monorepo Structure

### Current Directory Layout

```
root/
├── apps/
│   └── main/           # Unified application
├── packages/
│   ├── shared-components/
│   ├── design-system/
│   ├── shared-utils/
│   └── shared-assets/
├── docs/               # Documentation
├── e2e/                # End-to-end tests
├── figma-screenshots/  # Design source of truth
└── legacy/             # Original pages (reference)
```

### Package Structure

- **@reiki-goddess/shared-components**: Reusable React components
- **@reiki-goddess/design-system**: Colors, typography, Tailwind config
- **@reiki-goddess/shared-utils**: Validation, formatting, constants
- **@reiki-goddess/shared-assets**: Images, icons, static files

## Migration Steps

### Step 1: Analyze Legacy Code

1. Review component structure in legacy directories
2. Identify reusable components
3. Document design patterns and tokens
4. List static assets to migrate

### Step 2: Extract Components

1. Create component in shared-components package
2. Extract styles to design-system
3. Move utilities to shared-utils
4. Copy assets to shared-assets
5. Write comprehensive tests

### Step 3: Update Imports

1. Replace local imports with package imports
2. Update asset references
3. Apply design system tokens
4. Ensure TypeScript types

### Step 4: Test & Verify

1. Run unit tests
2. Check visual appearance
3. Test responsive behavior
4. Verify accessibility

## Current Achievements

### Technical Improvements

- **Type Safety:** 100% TypeScript coverage
- **Testing:** 100% test pass rate
- **Code Quality:** ESLint + Prettier enforcement
- **Performance:** Optimized builds with Vite
- **Developer Experience:** Hot module replacement

### Architecture Benefits

- **Modularity:** Shared packages for reusability
- **Maintainability:** Single source of truth
- **Scalability:** Easy to add new pages/features
- **Consistency:** Unified design system
- **Documentation:** Comprehensive guides

### Design Implementation

- **Figma Accuracy:** Pixel-perfect implementation
- **Responsive:** Mobile-first approach
- **Accessibility:** WCAG compliance
- **Performance:** Optimized images and assets
- **Brand Consistency:** Unified visual language

## Migration Guidelines

### For New Features

1. Always use shared packages
2. Follow established patterns
3. Write tests first (TDD)
4. Update documentation
5. Use conventional commits

### For Legacy Code Updates

1. Check if component exists in shared packages
2. Extract if reusable
3. Apply design system tokens
4. Add proper TypeScript types
5. Include comprehensive tests

### Code Quality Standards

- TypeScript strict mode
- 100% test coverage for new code
- ESLint rules compliance
- Prettier formatting
- Accessibility requirements

## Next Steps

### Immediate Tasks

1. Complete Resend email integration
2. Set up deployment pipeline
3. Configure production environment
4. Implement analytics
5. Add content management

### Future Enhancements

1. Progressive Web App features
2. Internationalization support
3. Advanced SEO optimizations
4. Performance monitoring
5. A/B testing framework

## Resources

### Documentation

- **Setup:** PROJECT_SETUP.md
- **Architecture:** ARCHITECTURE.md
- **Testing:** testing-strategy.md
- **Design:** style-guide.md
- **Context:** context_recovery.md

### Key Files

- **Todo List:** docs/project/todo_list.md
- **Test Results:** docs/testing/TESTING_SUMMARY.md
- **Session Notes:** docs/project/context_recovery.md

### Design References

- **Primary:** /figma-screenshots/homepage/
- **Legacy:** /Home Page/, /About/, /Contact/, /BLog/
