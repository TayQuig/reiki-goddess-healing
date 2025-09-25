# Shared Components Package

## Overview

Reusable React components for the Reiki Goddess Healing application.

## Patterns

- Functional components with TypeScript
- Export all components from `index.ts`
- Tests alongside components in same directory

## Commands

```bash
npm run build      # Build the package
npm test          # Run component tests
npm run type-check # TypeScript validation
```

## Conventions

- **Components**: `ComponentName.tsx` (PascalCase)
- **Tests**: `ComponentName.test.tsx`
- **Stories**: `ComponentName.stories.tsx`
- **Exports**: All components exported from `src/index.ts`

## Structure

```
src/
├── ComponentName/
│   ├── ComponentName.tsx
│   ├── ComponentName.test.tsx
│   ├── ComponentName.stories.tsx
│   └── index.ts
└── index.ts
```
