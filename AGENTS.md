# AGENTS.md - OpenCode Agent Guidelines

## 🏥 Project Overview

**Business**: The Reiki Goddess Healing - Energy healing and wellness services
**Tech Stack**: React 18 + TypeScript + Vite + TailwindCSS (Monorepo)
**Current Phase**: Phase 4B - Page Migration & Content
**Active Branch**: feat/resend-email-integration

## 📚 Critical Context Files

**IMPORTANT**: Read these files on a need-to-know basis for specific tasks:

### Dynamic State (Check for Current Status)

- @docs/project/context_recovery.md - Current working state and session handoffs
- @docs/project/todo_list.md - Active tasks and implementation plan
- @docs/testing/TESTING_SUMMARY.md - Latest test results (528 tests, 91.9% passing)

### Project Knowledge (Reference as Needed)

- @docs/project/ARCHITECTURE.md - Technical patterns and architectural decisions
- @style-guide.md - Visual design patterns and brand guidelines
- @docs/testing/testing-strategy.md - Testing philosophy and coverage goals
- @docs/security-guidelines.md - Security implementation patterns

## 🛠️ Build/Lint/Test Commands

```bash
# Development
npm run dev          # Start all dev servers
npm run build        # Build all packages
npm run preview      # Preview production build

# Testing
npm run test         # Run all tests in watch mode
npm run test -- --run # Run tests once
npm run test -- [path/to/test.spec.ts]  # Run single test file
npm run test:e2e     # Run Playwright E2E tests

# Code Quality
npm run lint         # Check linting
npm run lint:fix     # Auto-fix linting issues
npm run type-check   # TypeScript type checking
npm run format       # Format code with Prettier

# Security
npm run security-scan # Run security checks
```

## 💻 Code Style Guidelines

### TypeScript Standards

- **Strict Mode**: Always enabled, avoid `any`
- **Interfaces**: Use for component props and data structures
- **Type Imports**: Use `import type` for type-only imports
- **File Extensions**: `.tsx` for React components, `.ts` for utilities

### React Patterns

- **Components**: Functional components with TypeScript interfaces
- **Hooks**: Custom hooks start with `use` prefix
- **Props**: Destructure in function parameters
- **Children**: Use `React.ReactNode` type

### Import Organization

```typescript
// 1. External dependencies
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// 2. Internal packages (workspace)
import { Button, Header } from "@reiki-goddess/shared-components";
import { colors } from "@reiki-goddess/design-system";

// 3. Relative imports
import { validateEmail } from "../utils";
import type { ContactFormData } from "../types";
```

### Naming Conventions

- **Components**: PascalCase (e.g., `ContactForm`, `ServiceCard`)
- **Functions/Variables**: camelCase (e.g., `handleSubmit`, `isLoading`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RETRIES`, `API_BASE_URL`)
- **Types/Interfaces**: PascalCase with descriptive names
- **Files**: Match component name or use kebab-case for utils

### Formatting Rules

- **Indentation**: 2 spaces
- **Quotes**: Double quotes for JSX, single for JS
- **Semicolons**: Required
- **Line Length**: 80-100 characters preferred
- **Trailing Commas**: Yes for multiline

## 🏗️ Architecture Patterns

### Component Architecture

- **Shared Components**: Reusable UI in `@reiki-goddess/shared-components`
- **Page Components**: Full pages in `apps/main/src/pages/`
- **Layout Pattern**: AppLayout wrapper provides consistent header/footer
- **Animation**: Page transitions with framer-motion (0.6s enter/0.4s exit)

### State Management

- **Local State**: useState for component state
- **Router State**: useLocation for active navigation
- **Form State**: Controlled components with validation
- **No Redux**: Keep it simple until needed

### Security Patterns

- **Form Validation**: Multi-layer with SecurityValidator
- **Rate Limiting**: Client-side with FormRateLimit (3/hour)
- **XSS Prevention**: Input sanitization
- **Medical Terms**: Block diagnosis/prescription language (liability)

### Performance Patterns

- **Lazy Loading**: LazyImage component for images
- **Code Splitting**: Route-based with React.lazy
- **Memoization**: Use React.memo for expensive components
- **Intersection Observer**: For scroll animations

## 🎨 Design System

### Brand Colors

```css
--primary-blue: #0205b7;
--cream-background: #fffbf5;
--purple: rgba(165, 147, 224, 1);
--text-dark: #333333;
--text-gray: #5e5e5e;
```

### Typography

- **Font**: Figtree (Google Fonts)
- **Hero**: 63.55px
- **Headings**: 48px (H2), 32px (H3)
- **Body**: 16-18px
- **Navigation**: 16px, weight 500

### Layout Rules

- **Container**: 1440px max width
- **Universal Padding**: 66px (desktop), 20px (mobile)
- **Border Radius**: 20px (cards), 30px (sections), pill (buttons)
- **Shadows**: Blue drop shadows for depth

### Component Patterns

- **Service Cards**: White with blue bevel effect (5px offset)
- **Buttons**: Primary (filled), Secondary (outline), Ghost (transparent)
- **Images**: 20-27px border radius with hover effects
- **Sections**: 80px vertical padding

## 🔒 Security Guidelines

### Form Security

1. Always use SecurityValidator for user input
2. Implement rate limiting on all forms
3. Sanitize inputs to prevent XSS
4. Block medical terminology (liability protection)
5. Log security incidents with SecurityMonitor

### Wellness Industry Specific

- No medical claims or diagnosis language
- Avoid terms: cure, treat, prescription, medication
- Focus on: wellness, balance, energy, healing journey
- Include disclaimers where appropriate

## 🧪 Testing Approach

### Test Coverage Goals

- Components: 80%+ coverage
- Critical paths: 100% coverage
- Security features: 100% coverage
- Utilities: 90%+ coverage

### Testing Patterns

```typescript
// Use RouterWrapper for components with routing
render(
  <RouterWrapper>
    <Header />
  </RouterWrapper>
);

// Mock security components
jest.mock('@reiki-goddess/shared-utils', () => ({
  SecurityValidator: { validateContactFormField: jest.fn() },
  FormRateLimit: { canSubmit: jest.fn(() => ({ allowed: true })) }
}));

// Test user interactions
await userEvent.click(button);
await waitFor(() => expect(element).toBeVisible());
```

### Act() Warnings

- Expected in test environment
- Usually from async state updates
- Safe to ignore if functionality works
- Document in testing files if persistent

## 🚀 Development Workflow

### Starting New Features

1. Check @docs/project/todo_list.md for current phase
2. Read @docs/project/context_recovery.md for context
3. Create feature branch: `feat/description`
4. Reference design in `/figma-screenshots/`

### Before Committing

1. Run `npm run type-check` - Must pass
2. Run `npm run lint` - Fix any issues
3. Run `npm test -- --run` - Ensure tests pass
4. Write descriptive commit message

### Commit Convention

```bash
type(scope): description

- Detail 1
- Detail 2

# Types: feat, fix, docs, style, refactor, test, chore
```

### Documentation Updates

- Update context_recovery.md for major changes
- Mark todos complete in todo_list.md
- Add new patterns to ARCHITECTURE.md
- Document security issues in security-guidelines.md

## 🎯 Current Focus Areas

### Phase 4B - Services Page Migration (Next)

1. Extend existing ServicesSection component
2. Add service detail views with routing
3. Implement booking CTAs with security validation
4. Create service filtering/categories
5. Add comprehensive tests

### Known Issues

- 24 failing tests in apps/main (duplicate FigmaContactForm)
- Act() warnings in tests (non-blocking)
- Hook system not auto-triggering (run manually)

## 📁 Project Structure

```
reiki-goddess-healing/
├── apps/
│   └── main/                # Main application
├── packages/
│   ├── shared-components/   # Reusable React components
│   ├── design-system/       # Colors, typography, tokens
│   ├── shared-utils/        # Validation, security, formatting
│   └── shared-assets/       # Static assets
├── figma-screenshots/       # Design source of truth
├── docs/                    # Project documentation
│   ├── project/            # Architecture, workflow docs
│   ├── testing/            # Test strategies and summaries
│   └── progress/           # Migration progress tracking
└── AGENTS.md               # This file
```

## 🔗 External Documentation

When you need detailed information, read these files:

### Architecture & Patterns

- Read @docs/project/ARCHITECTURE.md for:
  - Component patterns
  - Security implementation
  - Performance optimizations
  - Testing strategies

### Visual Design

- Read @style-guide.md for:
  - Color palette and usage
  - Typography scales
  - Spacing and layout rules
  - Animation timings

### Testing

- Read @docs/testing/testing-strategy.md for:
  - Coverage goals by component type
  - Testing priorities
  - Known issues and workarounds

### Current State

- Read @docs/project/context_recovery.md for:
  - Current branch and phase
  - Recent accomplishments
  - Active work items
  - Session handoff notes

### Specialized Agents

- Read @docs/agents/architecture/agent-system-prompts.md for:
  - Available specialized research agents
  - When to use each agent
  - Agent capabilities and constraints
- Read @docs/agents/code-finder-agent.md for:
  - Code search and pattern analysis
  - Component dependency mapping
  - Legacy code identification

## ⚡ Quick Reference

### Figma Design Authority

- `/figma-screenshots/` contains all design specs
- Match these designs exactly
- Don't approximate values

### Common Gotchas

- Smoke effect needs triple layers for visibility
- Service cards use duplicate shape for bevel, not borders
- Images need specific border radius (20px standard, 27px featured)
- Always check for existing components before creating new ones

### Performance Tips

- Use intersection observer for animations
- Lazy load images below fold
- Minimize bundle with dynamic imports
- Cache static assets aggressively

---

**Remember**: This is a wellness website. Keep language positive, avoid medical claims, and focus on healing journeys rather than cures.

_Last Updated: 2025-09-12_
