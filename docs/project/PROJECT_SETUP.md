# Project Setup Guide

## Prerequisites

- Node.js 18+ and npm 9+
- Git
- VS Code (recommended) or preferred editor

## Initial Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd reiki-goddess-healing
```

### 2. Install Dependencies

```bash
# Install all workspace dependencies
npm install
```

### 3. Verify Setup

```bash
# Run all tests
npm test -- --run

# Start development servers
npm run dev
```

## Technology Stack

### Core Technologies

- **Framework:** React 18 with TypeScript 5
- **Build Tool:** Vite 6 (lightning-fast HMR)
- **Styling:** TailwindCSS 3 with custom design system
- **Package Manager:** npm with workspaces
- **Testing:** Vitest + React Testing Library + Playwright
- **Code Quality:** ESLint + Prettier + Husky
- **Version Control:** Git with conventional commits

### Architecture

- **Monorepo:** npm workspaces for package management
- **TypeScript:** Strict mode with project references
- **Component Library:** Shared packages for reusability
- **Design System:** Centralized tokens and configurations

## Development Commands

### Essential Commands

```bash
# Development
npm run dev              # Start all dev servers (http://localhost:5173)
npm run dev:main         # Start only main app

# Testing
npm test -- --run        # Run all tests once
npm test                 # Run tests in watch mode
npm run test:e2e         # Run Playwright E2E tests
npm run test:coverage    # Generate coverage report

# Building
npm run build           # Build all packages
npm run build:main      # Build only main app

# Code Quality
npm run lint            # Check ESLint rules
npm run lint:fix        # Auto-fix ESLint issues
npm run format          # Format with Prettier
npm run type-check      # TypeScript type checking
```

### Package-Specific Commands

```bash
# Work with specific packages
npm run dev -w @reiki-goddess/shared-components
npm test -w @reiki-goddess/shared-utils
npm run build -w packages/design-system
```

## Project Structure

### Directory Overview

```
reiki-goddess-healing/
├── apps/
│   └── main/                    # Main application
│       ├── src/
│       │   ├── components/      # Page-specific components
│       │   ├── pages/          # Route pages
│       │   ├── App.tsx         # Root component
│       │   └── main.tsx        # Entry point
│       ├── public/             # Static assets
│       └── index.html          # HTML template
│
├── packages/
│   ├── shared-components/       # Reusable UI components
│   │   ├── src/
│   │   │   ├── Button/
│   │   │   ├── Navigation/
│   │   │   └── [component]/
│   │   └── package.json
│   │
│   ├── design-system/          # Design tokens & theme
│   │   ├── src/
│   │   │   ├── colors.ts
│   │   │   ├── typography.ts
│   │   │   └── tailwind.config.ts
│   │   └── package.json
│   │
│   ├── shared-utils/           # Utility functions
│   │   ├── src/
│   │   │   ├── validation.ts
│   │   │   └── formatting.ts
│   │   └── package.json
│   │
│   └── shared-assets/          # Images & static files
│       ├── images/
│       └── package.json
│
├── docs/                       # Documentation
├── e2e/                        # End-to-end tests
├── figma-screenshots/          # Design references
└── legacy/                     # Original code (reference)
```

## Configuration Files

### Root Configuration

```
.
├── package.json               # Workspace configuration
├── tsconfig.json             # TypeScript project references
├── .eslintrc.json            # ESLint rules
├── .prettierrc.json          # Prettier formatting
├── .gitignore               # Git ignore patterns
├── .nvmrc                   # Node version
├── playwright.config.ts      # E2E test config
└── vitest.config.shared.ts   # Shared test config
```

### Package Configuration

Each package includes:

- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript config
- `vite.config.ts` - Build configuration
- `vitest.config.ts` - Test configuration

## Development Workflow

### 1. Start Development

```bash
# From project root
npm run dev

# Main app runs on http://localhost:5173
# Component library on http://localhost:5174
```

### 2. Making Changes

1. **Components:** Add to `packages/shared-components/src/`
2. **Styles:** Update in `packages/design-system/src/`
3. **Pages:** Modify in `apps/main/src/pages/`
4. **Tests:** Write alongside code with `.test.tsx`

### 3. Testing Changes

```bash
# Run tests for your changes
npm test -- --run

# Run specific test file
npm test Button.test

# Check coverage
npm run test:coverage
```

### 4. Code Quality

```bash
# Before committing
npm run lint
npm run type-check
npm run format
```

### 5. Committing Code

```bash
# Stage changes
git add .

# Commit with conventional format
git commit -m "feat(components): add new Button variant"
```

## Working with Packages

### Creating New Components

1. Create directory in `packages/shared-components/src/`
2. Add component file (e.g., `MyComponent.tsx`)
3. Add test file (e.g., `MyComponent.test.tsx`)
4. Export from `packages/shared-components/src/index.ts`
5. Import in apps: `import { MyComponent } from '@reiki-goddess/shared-components'`

### Adding Design Tokens

1. Edit files in `packages/design-system/src/`
2. Update `tailwind.config.ts` if needed
3. Rebuild to see changes

### Using Shared Assets

```typescript
import logoImage from "@reiki-goddess/shared-assets/images/logo.png";
```

## Environment Setup

### VS Code Extensions (Recommended)

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar)
- Vitest Runner

### Browser Extensions

- React Developer Tools
- Axe DevTools (accessibility)

## Troubleshooting

### Common Issues

#### Dependencies not found

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### TypeScript errors

```bash
# Rebuild TypeScript references
npm run build
```

#### Port already in use

```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Build Issues

1. Check Node version matches `.nvmrc`
2. Clear build caches: `rm -rf apps/*/dist packages/*/dist`
3. Rebuild: `npm run build`

## Best Practices

### Code Organization

- Keep components small and focused
- Use TypeScript interfaces for props
- Write tests for all new code
- Follow existing patterns

### Performance

- Lazy load routes
- Optimize images before adding
- Use React.memo for expensive components
- Keep bundle size minimal

### Accessibility

- Use semantic HTML
- Add ARIA labels where needed
- Test with keyboard navigation
- Check color contrast

## Deployment

### Build for Production

```bash
# Build all packages
npm run build

# Output in apps/main/dist/
```

### Environment Variables

Create `.env` files as needed:

```bash
VITE_API_URL=https://api.example.com
VITE_PUBLIC_KEY=your-key-here
```

### Hosting

The build output is static files that can be hosted on:

- Netlify
- Vercel
- AWS S3 + CloudFront
- Any static file server

## Resources

### Internal Documentation

- **CLAUDE.md** - Quick reference guide
- **MIGRATION_GUIDE.md** - Migration details
- **ARCHITECTURE.md** - Technical patterns
- **style-guide.md** - Design system
- **testing-strategy.md** - Testing approach

### External Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [TailwindCSS Docs](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
