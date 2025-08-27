# Reiki Goddess Healing - Monorepo Migration Handoff Prompt

## Context for Fresh Instance

You are taking over a monorepo migration project for The Reiki Goddess Healing website. The project has successfully completed Phases 1-3, extracting and fixing 14 components from Anima-generated designs. Your task is to create the main application that uses these components.

## Current State

### ✅ What's Already Done:

1. **14 Components Extracted & Fixed** - All TypeScript errors resolved, clean build
2. **Composed Pages Ready** - AboutComposed, ContactComposed, HomeComposed in `packages/shared-components`
3. **Assets Migrated** - 63 images in `packages/shared-assets`, all imports working
4. **AnimaContainer Applied** - Responsive wrapper maintaining 1440px Anima design

### 📁 Project Structure:

```
/reiki-goddess-healing/
├── packages/
│   ├── shared-components/   # ✅ 14 extracted components
│   ├── shared-assets/       # ✅ 63 images organized
│   ├── design-system/       # ⚠️ Needs Anima CSS variables
│   └── shared-utils/        # ✅ Utilities ready
├── About/                   # Original Anima source (DO NOT MODIFY)
├── Contact/                 # Original Anima source (DO NOT MODIFY)
├── Home Page/              # Original Anima source (DO NOT MODIFY)
├── BLog/                   # Original Anima source (DO NOT MODIFY)
└── apps/                   # 📌 YOUR WORK STARTS HERE
```

## Your Primary Task

Create a **SINGLE** main application (not multiple apps) with routing between pages.

### Step 1: Create Main App Structure

```bash
# Create the main app directory
mkdir -p apps/main/src/pages

# The app should have this structure:
apps/main/
├── package.json         # Dependencies: react, react-router-dom, vite, etc.
├── vite.config.ts      # Import from shared packages
├── index.html          # Entry HTML
├── src/
│   ├── main.tsx        # ReactDOM.render entry
│   ├── App.tsx         # Router configuration
│   └── pages/
│       ├── Home.tsx    # Imports HomeComposed
│       ├── About.tsx   # Imports AboutComposed
│       ├── Contact.tsx # Imports ContactComposed
│       └── Blog.tsx    # TBD - analyze first
```

### Step 2: Set Up Routing

```typescript
// apps/main/src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  AboutComposed,
  ContactComposed,
  HomeComposed
} from '@reiki-goddess/shared-components';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeComposed />} />
        <Route path="/about" element={<AboutComposed />} />
        <Route path="/contact" element={<ContactComposed />} />
        {/* Blog route TBD after analysis */}
      </Routes>
    </BrowserRouter>
  );
}
```

### Step 3: Configure Vite

- Use shared Vite config from root
- Ensure aliases for @reiki-goddess/\* packages
- Configure for development and production builds

### Step 4: Visual Fidelity Testing

1. Run `npm run dev` in apps/main
2. Compare each route against original Anima designs:
   - `/About/` - Check all 8 sections render correctly
   - `/Contact/` - Verify form fields and layout
   - `/Home Page/` - Confirm wireframe displays
3. Test responsive behavior with AnimaContainer
4. Verify all 63 images load correctly

## Secondary Tasks

### Analyze Blog Page

```bash
# Compare Blog vs About structure
diff -r BLog/src About/src

# If different, extract unique components
# If same, document as duplicate
```

### Extract Design System

Look for CSS variables in Anima folders:

- `variable-collection-color-*` patterns
- Typography scales
- Update `packages/design-system/src/colors.ts`

## Important Guidelines

### DO:

- ✅ Create ONE main app with routing
- ✅ Use the composed components from shared-components
- ✅ Test against original Anima designs
- ✅ Preserve exact Anima styling (don't "improve")

### DON'T:

- ❌ Create separate apps for each page
- ❌ Modify the original Anima folders
- ❌ Change the extracted component styling
- ❌ Skip visual fidelity testing

## Quick Start Commands

```bash
# 1. Verify clean build
cd packages/shared-components && npm run build

# 2. Check composed components exist
ls packages/shared-components/src/*/*Composed.tsx

# 3. Review what's been done
cat handoff_context.md
cat phase3-integration-summary.md

# 4. Start creating the main app
mkdir -p apps/main/src/pages
cd apps/main
npm init -y
npm install react react-dom react-router-dom
npm install -D vite @vitejs/plugin-react typescript
```

## Success Criteria

Your work is complete when:

1. ✅ Main app runs with `npm run dev` from apps/main
2. ✅ All routes (/, /about, /contact) display correctly
3. ✅ Visual comparison matches Anima designs 100%
4. ✅ Blog page analyzed and documented/implemented
5. ✅ Clean build with no TypeScript errors
6. ✅ All 63 images loading correctly

## Files to Review First

1. `handoff_context.md` - Full project history and decisions
2. `packages/shared-components/src/index.ts` - Available components
3. `packages/shared-components/src/About/AboutComposed.tsx` - Example composed page
4. `CLAUDE.md` - Project-specific instructions

## Questions to Answer

Before starting, confirm:

1. Do you understand this is ONE app with multiple routes, not multiple apps?
2. Have you located the composed components in shared-components?
3. Do you see the original Anima folders that should not be modified?
4. Are you clear on the visual fidelity testing requirement?

Begin by creating the apps/main directory and setting up the basic React application with routing.
