# 🌟 The Reiki Goddess Healing - Website Monorepo

A modern, responsive website for The Reiki Goddess Healing business, built with React, TypeScript, and a component-driven architecture.

## 🏗️ Project Structure

```
reiki-goddess-healing/
├── 📦 packages/                 # Shared packages (npm workspace)
│   ├── shared-components/       # React UI components
│   ├── shared-assets/          # Images and static assets
│   ├── design-system/          # Design tokens and theme
│   └── shared-utils/           # Utility functions
│
├── 🚀 apps/                    # Application packages
│   └── main/                   # Main website application
│
├── 📸 figma-screenshots/       # Design reference screenshots
│   ├── homepage/               # Homepage designs
│   ├── about/                  # About page designs
│   ├── services/               # Services page designs
│   ├── contact/                # Contact page designs
│   └── blog/                   # Blog page designs
│
├── 📚 docs/                    # Documentation
│   ├── migration/              # Migration guides and history
│   ├── prompts/                # AI prompts and templates
│   ├── learning-system/        # Learning system docs
│   ├── deployment/             # Deployment guides
│   └── architecture/           # Architecture decisions
│
├── 🧪 e2e/                     # End-to-end tests (Playwright)
├── 🔧 scripts/                 # Build and automation scripts
├── 🎨 public/                  # Public assets
│
├── 📄 Config Files
│   ├── package.json            # Root workspace config
│   ├── tsconfig.json           # TypeScript config
│   ├── vite.config.shared.ts   # Shared Vite config
│   ├── vitest.config.shared.ts # Shared test config
│   └── playwright.config.ts    # E2E test config
│
└── 📁 Legacy Reference         # Original Anima exports (reference only)
    ├── About/                  # Original About page
    ├── Contact/                # Original Contact page
    ├── Home Page/              # Original Homepage
    └── BLog/                   # Original Blog page
```

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build all packages
npm run build

# Run tests
npm run test

# Run E2E tests
npm run test:e2e
```

## 📦 Package Structure

### `@reiki-goddess/shared-components`
Reusable React components extracted from Figma designs:
- Header/Navigation
- Hero sections
- Service cards
- Contact forms
- Footer

### `@reiki-goddess/shared-assets`
Static assets and images:
- Optimized images
- Icons and logos
- Asset manifest

### `@reiki-goddess/design-system`
Design tokens and theme:
- Color palette
- Typography scales
- Spacing system
- Component styles

### `@reiki-goddess/shared-utils`
Utility functions:
- Form validation
- Data formatting
- Security helpers
- Constants

## 🎨 Design Workflow

1. **Select in Figma** - Choose component/section
2. **Screenshot** - Save to `figma-screenshots/`
3. **Extract** - Convert to React component
4. **Test** - Verify visual fidelity
5. **Integrate** - Add to page composition

## 🛠️ Development Commands

```bash
# Component development
npm run dev -w @reiki-goddess/shared-components

# Run specific app
npm run dev -w @reiki-goddess/main

# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format

# Clean build artifacts
npm run clean
```

## 📝 Documentation

- **[CLAUDE.md](./CLAUDE.md)** - AI assistant instructions
- **[Migration Guide](./docs/migration/)** - Project migration history
- **[Architecture](./docs/architecture/)** - Technical decisions
- **[Component Guide](./packages/shared-components/README.md)** - Component documentation

## 🔄 Current Status

- ✅ Monorepo structure established
- ✅ Build tooling configured
- ✅ Component extraction workflow proven
- 🚧 Extracting components from Figma
- ⏳ Building page compositions
- ⏳ Deployment setup

## 🤝 Contributing

1. Work from Figma designs as source of truth
2. Follow TypeScript strict mode
3. Write tests for new components
4. Use conventional commits
5. Keep components pure and reusable

## 📄 License

Private - The Reiki Goddess Healing © 2024