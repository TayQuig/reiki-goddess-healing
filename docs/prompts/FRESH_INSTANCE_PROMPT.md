# Fresh Instance Prompt for Reiki Goddess Healing Monorepo Migration

## Initial Context Request

Please read the `HANDOFF_CONTEXT.md` file in the project root. It contains critical context about a monorepo migration in progress. The Anima-generated designs in the folders (`Home Page/`, `About/`, `Contact/`, `BLog/`) are the approved designs that need to be extracted into the existing monorepo structure.

## ✅ Phase 1 Completed (2025-01-21)

### Critical Issues Resolved

1. **Header Confusion SOLVED**: The true header was found in `/About/src/screens/About/About.tsx` (lines 38-59). Contact's "HeaderSection" is indeed a form input field, not navigation.

2. **Universal Components Extracted**:
   - Header: `/packages/shared-components/src/Navigation/Header.tsx` ✅
   - Footer: `/packages/shared-components/src/Footer/Footer.tsx` ✅
   - Wrapper: `/packages/shared-components/src/AnimaContainer/AnimaContainer.tsx` ✅

3. **Assets Migration Complete**:
   - 63 images migrated to `/packages/shared-assets/images/`
   - Organized by page: contact/, about/, home/, blog/
   - Asset manifest created: `/packages/shared-assets/src/images.ts`

## Key Points to Understand

1. **Contact page has the best modular architecture** - Use its 8-section pattern as the template for refactoring other pages

2. **85% of existing monorepo infrastructure is kept** - Build system, testing, utilities, and package structure are production-ready

3. **All pages now have shared Header/Footer components** ready for consistent wrapping

4. **The header component issue is RESOLVED** - About page header is the universal navigation

## Autonomous System Integration

### Check Learning Loop Status

The project uses an autonomous learning loop system. Check for completed and current tasks:

```bash
# Check latest orchestrator status
cat learning-loop/orchestrator-status-update.md

# Check completed work
ls -la learning-loop/tasks/completed/anima-header-extraction/

# Check remaining tasks
ls -la learning-loop/tasks/current/
```

### Completed Orchestrator Actions

The autonomous orchestrator has successfully:

- ✅ **Found True Header**: Located in About page, not Contact
- ✅ **Extracted Universal Components**: Header, Footer, and AnimaContainer wrapper
- ✅ **Migrated All Assets**: 63 images organized in shared-assets
- ✅ **Resolved Infrastructure Decision**: 85% kept, only visual components replaced

### Agent Task Status

Current agent assignments for Phase 2:

- `@reiki-frontend-strategist` - Extract Contact page sections (ready to start)
- `@infrastructure-strategist` - Update build configs for new asset paths
- `@learning-curator` - Document extraction patterns from Phase 1

## Your Next Actions (Phase 2)

1. **Review Completed Work**:

   ```bash
   cat learning-loop/orchestrator-status-update.md
   cat learning-loop/tasks/completed/anima-header-extraction/completion-report.md
   ```

2. **Extract Page-Specific Components**:
   - Start with Contact page sections (ContactFormSection, EmailInfoSection, etc.)
   - Refactor About page from monolith to modular sections
   - Extract Home page Box component
   - Clarify Blog requirements

3. **Update Component Imports**:
   - Update image paths to use shared-assets
   - Ensure all pages import shared Header/Footer
   - Apply AnimaContainer wrapper to all pages

## Critical Files to Review First

### Phase 1 Completion Reports

1. `/learning-loop/orchestrator-status-update.md` - Current progress and next steps
2. `/learning-loop/tasks/completed/anima-header-extraction/completion-report.md` - What was extracted

### Documentation & Decisions

1. `/HANDOFF_CONTEXT.md` - Complete migration context
2. `/learning-loop/decisions/ADR-001-architecture-standardization.md` - Architecture decisions
3. `/learning-loop/assessments/monorepo-infrastructure-assessment.md` - 85% keep decision

### Extraction Guidelines

1. `/learning-loop/priority-override.md` - Overall extraction priorities
2. `/learning-loop/standards/extraction-guidelines.md` - How to extract properly
3. `/learning-loop-protocol.md` - How the autonomous system works

## Expected Phase 2 Outcomes

You should complete:

- ✅ Phase 1 (DONE): Universal Header/Footer extracted, assets migrated
- 🔄 Phase 2 (CURRENT): Extract all page-specific components
  - Contact sections (5 components)
  - About page refactored to modular sections
  - Home page Box component
  - Blog clarification and extraction
- ⏳ Phase 3 (NEXT): Design system consolidation
- ⏳ Phase 4 (FUTURE): Apps directory creation

## Current State Summary

### What's Complete

- ✅ True header found (About page, not Contact)
- ✅ Universal Header/Footer components extracted
- ✅ All 63 images migrated to shared-assets
- ✅ AnimaContainer wrapper for responsive behavior
- ✅ Infrastructure decision validated (85% kept)

### What's Remaining

- 🔄 Page-specific component extraction (Phase 2)
- ⏳ Design system tokens from Anima
- ⏳ Apps directory structure
- ⏳ Routing implementation
- ⏳ Final testing and validation

## Success Metrics

- Visual fidelity to Anima designs: 100% required
- Infrastructure preservation: 85% achieved ✅
- Component modularity: Following Contact's 8-section pattern
- No design "improvements" or modifications allowed

Begin Phase 2 by extracting Contact page sections, using the completed universal components as the wrapper.
