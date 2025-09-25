# CLAUDE.md - Quick Reference Guide

## 📚 Critical Context Files

| File                              | Purpose                    | Update Frequency |
| --------------------------------- | -------------------------- | ---------------- |
| @docs/project/context_recovery.md | Current state, branch info | Every session    |
| @docs/project/todo_list.md        | Active tasks, progress     | During work      |
| @docs/testing/TESTING_SUMMARY.md  | Test results               | After test runs  |
| @docs/project/ARCHITECTURE.md     | Tech patterns              | When discovered  |
| @style-guide.md                   | Design specs               | Rarely           |

## 🚀 Session Protocol

**Start:** Read @context_recovery.md → Check @todo_list.md → Review relevant docs → Continue from stopping point  
**End:** Update context_recovery.md → Update todo_list.md → Run tests if code changed → Commit work → Document next steps

## 💻 Tech Stack

React 18 + TypeScript + Vite 6 + TailwindCSS + Vitest + npm workspaces

## 📁 Project Structure

```
root/
├── apps/main/          # Main application
├── packages/           # Shared packages (components, design-system, utils, assets)
├── docs/              # Documentation
├── figma-screenshots/ # Design source of truth
└── legacy/            # Original pages (reference only)
```

## 🔧 Core Commands

```bash
npm run dev        # Start all dev servers
npm test -- --run  # Run all tests
npm run build     # Build all packages
npm run lint      # Check linting
npm run type-check # Check TypeScript
```

## 📝 Git Commit Format

```
type(scope): description

- Detail 1
- Detail 2

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Types:** feat, fix, docs, style, refactor, test, chore  
**NEVER commit without user's explicit request**

## 🎨 Design Source

**Primary:** `/figma-screenshots/homepage/` - All design specifications  
**Legacy reference:** `/Home Page/`, `/About/`, `/Contact/`, `/BLog/`

## 🔄 Migration Status

**Current:** Phase 4 Complete ✅ - Unified monorepo with 5 pages  
**Active:** Resend email integration (see @docs/design/resend-integration-plan.md)

## 📋 Document Ownership

| Info Type     | Owner               | When to Update    |
| ------------- | ------------------- | ----------------- |
| Branch/status | context_recovery.md | Session start/end |
| Test results  | TESTING_SUMMARY.md  | After test runs   |
| Active tasks  | todo_list.md        | Task changes      |
| Tech patterns | ARCHITECTURE.md     | New patterns      |
| Design specs  | style-guide.md      | Design changes    |
| Migration     | MIGRATION_GUIDE.md  | Phase changes     |

## ⚡ Quick Links

- **Setup:** See PROJECT_SETUP.md for detailed setup instructions
- **Migration:** See MIGRATION_GUIDE.md for migration details
- **Architecture:** See ARCHITECTURE.md for patterns and conventions
- **Testing:** See testing-strategy.md for testing approach

## 🚨 Critical Rules

1. Update documentation after every session
2. Test before committing
3. Follow TypeScript patterns in ARCHITECTURE.md
4. Match Figma designs exactly
5. Never skip accessibility requirements

## 📁 Temporary File Usage

**Purpose:** Enable complex multi-step operations and reduce context switching

### Allowed Patterns

- `.tmp/test-results-*.json` - Aggregate test results across packages
- `.tmp/migration-*.log` - Track file processing during migrations
- `.tmp/api-cache-*.json` - Cache API responses for testing
- `.tmp/design-tokens-*.json` - Extract design values from Figma
- `.tmp/email-templates-*.html` - Store Resend email templates
- `.tmp/build-metrics-*.json` - Track bundle sizes and performance

### Permissions

```
Edit(//.tmp/**)
Write(//.tmp/**)
Read(//.tmp/**)
```

### Usage Examples

```bash
# Store test results
npm test -- --json > .tmp/test-results-$(date +%Y%m%d-%H%M%S).json

# Cache API responses
curl https://api.example.com/data > .tmp/api-cache-endpoint.json

# Track migration progress
echo "Processed: $filename" >> .tmp/migration-phase4b.log
```

## 📂 Subdirectory CLAUDE.md Files

- **Apps:** @apps/main/CLAUDE.md
- **Packages:**
  - @packages/shared-components/CLAUDE.md
  - @packages/design-system/CLAUDE.md
  - @packages/shared-utils/CLAUDE.md
  - @packages/shared-assets/CLAUDE.md
- **Domains:**
  - @docs/CLAUDE.md
  - @e2e/CLAUDE.md
  - @scripts/CLAUDE.md
