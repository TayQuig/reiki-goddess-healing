# CLAUDE.md Optimization Guide

## Overview

This guide documents the optimal setup for CLAUDE.md files throughout the Reiki Goddess Healing monorepo. CLAUDE.md files provide context-aware instructions for Claude AI at different levels of the codebase, following a hierarchical structure where more specific memories build upon general ones.

## Execution Instructions

### For Fresh Instance

1. Read this guide completely
2. Check existing CLAUDE.md at root
3. Create missing CLAUDE.md files using provided templates
4. Test by running `/memory` command in different directories

### For Parallel Execution with Subagents

**Prerequisites** (Complete First):

1. Read root `/CLAUDE.md` to understand current structure
2. Create `/docs/templates/` directory with template files

**Parallel Tasks** (Can be done simultaneously by different agents):

**Group 1 - Package CLAUDE.md Files** (4 agents, no dependencies):

- Agent 1: Create `/packages/shared-components/CLAUDE.md`
- Agent 2: Create `/packages/design-system/CLAUDE.md`
- Agent 3: Create `/packages/shared-utils/CLAUDE.md`
- Agent 4: Create `/packages/shared-assets/CLAUDE.md`

**Group 2 - Domain CLAUDE.md Files** (3 agents, no dependencies):

- Agent 5: Create `/e2e/CLAUDE.md`
- Agent 6: Create `/scripts/CLAUDE.md`
- Agent 7: Create `/docs/CLAUDE.md`

**Sequential Tasks** (Complete after parallel tasks):

1. Create `/apps/main/CLAUDE.md` (may reference package files)
2. Update root `/CLAUDE.md` with links to new subdirectory files

## Memory Hierarchy

Claude loads memory files in this order (higher priority first):

1. **Enterprise policy** (system-wide)
2. **Project memory** (`./CLAUDE.md` - recursively up from cwd)
3. **User memory** (`~/.claude/CLAUDE.md`)
4. **Project memory (local)** (`./CLAUDE.local.md` - deprecated, use imports instead)

## Recommended Structure

### Root CLAUDE.md

Location: `/CLAUDE.md`

**Purpose**: Project-wide conventions, architecture overview, common commands
**Content**:

- Quick reference guide with critical context files
- Session protocols (start/end procedures)
- Tech stack overview
- Core commands (dev, test, build, lint)
- Git commit format
- Critical rules and standards
- Links to subdirectory CLAUDE.md files

### Package-Level CLAUDE.md Files

#### shared-components

Location: `/packages/shared-components/CLAUDE.md`

```markdown
# Shared Components Package

## Component Patterns

- Use functional components with TypeScript
- Export from index.ts
- Place tests alongside components

## Commands

- Build: npm run build
- Test: npm test
- Type check: npm run type-check

## Conventions

- Component files: PascalCase.tsx
- Test files: ComponentName.test.tsx
- Stories: ComponentName.stories.tsx
```

#### design-system

Location: `/packages/design-system/CLAUDE.md`

```markdown
# Design System Package

## Token Usage

- Import tokens from theme/tokens.ts
- Use CSS variables for dynamic theming
- Follow Tailwind utility patterns

## Theme Integration

- See @theme/README.md for patterns
- Use theme provider for context

## Tailwind Config

- Extended colors in tailwind.config.js
- Custom utilities in utilities/
```

#### shared-utils

Location: `/packages/shared-utils/CLAUDE.md`

```markdown
# Shared Utils Package

## Utility Patterns

- Pure functions only
- Comprehensive type definitions
- Export all from index.ts

## Common Helpers

- formatDate(): Date formatting
- validateEmail(): Email validation
- debounce(): Function debouncing

## Testing

- 100% coverage expected
- Test edge cases
```

#### shared-assets

Location: `/packages/shared-assets/CLAUDE.md`

```markdown
# Shared Assets Package

## Asset Organization

images/
├── icons/ # SVG icons only
├── photos/ # JPG/PNG photos
└── logos/ # Brand assets

## Requirements

- Optimize images before committing
- Use descriptive filenames
- SVGs for icons, JPG/PNG for photos
```

### App-Level CLAUDE.md

Location: `/apps/main/CLAUDE.md`

```markdown
# Main Application

## Page Patterns

- Pages in src/pages/
- Use PageTransition wrapper
- Match Figma designs exactly

## Routing

- React Router v6 patterns
- Lazy load pages
- Use route constants

## State Management

- React Context for global state
- Local state preferred
- Custom hooks in hooks/

## API Integration

- Use fetch with error handling
- Types in types/api.ts
- Mock data in mocks/
```

### Domain-Specific CLAUDE.md Files

#### Documentation

Location: `/docs/CLAUDE.md`

```markdown
# Documentation

## Standards

- Use sentence case for headings
- Include TOC for long docs
- Link related documents

## Organization

- Feature docs in subdirectories
- Progress tracking in progress/
- Architecture docs in project/

## Updates

- Update context_recovery.md each session
- Keep todo_list.md current
- Version important changes
```

#### E2E Tests

Location: `/e2e/CLAUDE.md`

```markdown
# E2E Tests

## Playwright Patterns

- Use page object model
- Data-testid for selectors
- Parallel execution enabled

## Test Structure

- Setup in beforeEach
- Descriptive test names
- Clean up in afterEach

## Commands

- Run: npm run test:e2e
- Debug: npm run test:e2e:debug
```

#### Scripts

Location: `/scripts/CLAUDE.md`

```markdown
# Scripts

## Python Scripts

- Python 3.8+ required
- Use type hints
- Document with docstrings

## Node Scripts

- ESM modules (.mjs)
- Use commander for CLIs
- Handle errors gracefully

## Common Scripts

- fix_imports.py: Fix import paths
- monitor.py: Monitor changes
- validate_system.py: System checks
```

## Best Practices

### 1. Keep It Focused

Each CLAUDE.md should only contain information relevant to its directory. Avoid duplicating information available in parent directories.

### 2. Use Imports

Leverage the import syntax to avoid duplication:

```markdown
# See @../../README.md for setup instructions

# Follow patterns in @../shared-components/CLAUDE.md
```

### 3. Include Specific Commands

Always include commands specific to the directory:

```markdown
## Commands

- Dev: npm run dev
- Test: npm test -- ComponentName
- Build: npm run build
```

### 4. Document Local Conventions

If a directory has unique patterns that differ from the project standard, document them clearly:

```markdown
## Local Conventions

- We use class components here for legacy reasons
- State management uses Redux (not Context)
```

### 5. Structure with Headings

Organize content with clear markdown headings:

```markdown
# Package Name

## Overview

Brief description

## Commands

Frequently used commands

## Patterns

Code patterns and conventions

## Important Files

Key files to be aware of
```

## Import Patterns

### Avoiding Duplication

Instead of copying shared information, use imports:

```markdown
# Component Guidelines

See @/docs/coding-standards.md for general patterns

## Package-Specific Patterns

[Only document what's unique to this package]
```

### Import Syntax

- Relative paths: `@../parent/file.md`
- Absolute paths: `@/docs/standards.md`
- Home directory: `@~/.claude/personal.md`

### Import Limitations

- Maximum recursion depth: 5 levels
- Imports not evaluated in code blocks
- Circular imports are prevented

## Templates

### Package Template

```markdown
# [Package Name]

## Overview

[Brief description of package purpose]

## Commands

- Build: npm run build
- Test: npm test
- Lint: npm run lint

## Structure
```

src/
├── components/ # [if applicable]
├── utils/ # [if applicable]
├── types/ # [if applicable]
└── index.ts # Main export

```

## Patterns
[Package-specific patterns]

## Dependencies
[Key dependencies to be aware of]

## Common Tasks
[Frequent operations in this package]
```

### Feature Template

```markdown
# [Feature Name]

## Overview

[What this feature does]

## Key Files

- `main.ts`: [Purpose]
- `types.ts`: [Purpose]
- `utils.ts`: [Purpose]

## Patterns

[Feature-specific patterns]

## Testing

[How to test this feature]

## Common Issues

[Known gotchas or issues]
```

## Maintenance

### Review Schedule

- **Weekly**: Update active feature CLAUDE.md files
- **Monthly**: Review package-level files
- **Quarterly**: Audit entire hierarchy for accuracy

### Update Triggers

Update CLAUDE.md files when:

- Adding new patterns or conventions
- Changing build/test commands
- Restructuring directories
- Discovering common pain points
- Onboarding new team members

## Benefits

1. **Context-Aware Assistance**: Claude has relevant information for the specific area being worked on
2. **Reduced Repetition**: Common patterns documented once and imported
3. **Faster Onboarding**: New developers can understand directory-specific conventions quickly
4. **Consistent Development**: Team follows documented patterns
5. **Efficient AI Assistance**: Claude doesn't need to search for context repeatedly

## Getting Started

1. Start with the root CLAUDE.md (already exists)
2. Add CLAUDE.md files to packages as you work on them
3. Use the templates provided
4. Import shared patterns to avoid duplication
5. Keep files updated as patterns evolve

Remember: The goal is to make Claude more effective by providing the right context at the right time, not to create exhaustive documentation. Keep it practical and focused.
