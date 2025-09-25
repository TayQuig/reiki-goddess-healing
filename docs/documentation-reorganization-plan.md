# Documentation Reorganization Plan

## Current State Analysis

- **CLAUDE.md**: 511 lines (needs reduction to ≤100 lines)
- **Redundancy**: Multiple instances of similar instructions
- **Mixed Content**: Quick-reference items mixed with detailed explanations
- **Navigation**: Difficult to find essential information quickly

## Reorganization Strategy

### 1. CLAUDE.md (≤100 lines) - Quick Reference Guide

**Purpose:** Answer "What do I need to know RIGHT NOW to start working?"

#### Content to Include:

```markdown
# CLAUDE.md - Quick Reference Guide

## 📚 Critical Context Files

| File                        | Purpose                    | Update Frequency |
| --------------------------- | -------------------------- | ---------------- |
| @context_recovery.md        | Current state, branch info | Every session    |
| @todo_list.md               | Active tasks, progress     | During work      |
| @testing/TESTING_SUMMARY.md | Test results               | After test runs  |
| @ARCHITECTURE.md            | Tech patterns              | When discovered  |
| @style-guide.md             | Design specs               | Rarely           |

## 🚀 Session Protocol

**Start:** Read @context_recovery.md → Check @todo_list.md → Review relevant docs
**End:** Update context_recovery.md → Update todo_list.md → Commit work

## 💻 Tech Stack

React 18 + TypeScript + Vite 6 + TailwindCSS + Vitest + npm workspaces

## 📁 Project Structure
```

root/
├── apps/main/ # Main application
├── packages/ # Shared packages
├── docs/ # Documentation
├── figma-screenshots/ # Design source
└── legacy/ # Original pages

````

## 🔧 Core Commands
```bash
npm run dev        # Start all dev servers
npm test -- --run  # Run all tests
npm run build     # Build all packages
npm run lint      # Check linting
npm run type-check # Check TypeScript
````

## 📝 Git Commit Template

```
type(scope): description

- Detail 1
- Detail 2

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

## 🎨 Design Source

Primary: `/figma-screenshots/homepage/`
Legacy reference: `/Home Page/`, `/About/`, `/Contact/`, `/BLog/`

## 🔄 Migration Status

Phase 4 Complete ✅ - Unified monorepo with 5 pages
Next: Resend email integration (see @resend-integration-plan.md)

## 📋 Document Ownership

| Info Type     | Owner               | Frequency       |
| ------------- | ------------------- | --------------- |
| Branch/status | context_recovery.md | Every session   |
| Test results  | TESTING_SUMMARY.md  | After tests     |
| Tasks         | todo_list.md        | During work     |
| Architecture  | ARCHITECTURE.md     | When discovered |
| Design        | style-guide.md      | Rarely          |

```

### 2. MIGRATION_GUIDE.md (New File)
**Content to Move:**
- Detailed migration status (lines 117-133)
- Original structure (lines 125-130)
- New monorepo structure (lines 131-139)
- Legacy structure details (lines 244-263)
- Migration phases (lines 326-421)
- Migration guidelines (lines 365-374)
- Current state & next steps (lines 375-421)

### 3. PROJECT_SETUP.md (New File)
**Content to Move:**
- Technology stack details (lines 140-149)
- Development commands (lines 150-192)
- Configuration files (lines 305-323)
- Development workflow (lines 344-364)
- Working with codebase (lines 324-374)

### 4. Updates to Existing Files

#### ARCHITECTURE.md (Add):
- Component architecture (lines 194-310)
- TypeScript configuration details
- Package naming conventions (lines 136-139)
- Code organization principles

#### testing-strategy.md (Add):
- Testing protocol from CLAUDE.md (lines 76-89)
- Development commands for testing (lines 93-101)
- Test documentation pattern

#### style-guide.md (Already comprehensive)
- No additions needed, already contains full design system

### 5. Content to Remove (Redundant/Verbose)
- Long explanations of protocols
- Repeated instructions
- Verbose examples
- Philosophical explanations
- Duplicate command listings

## Implementation Checklist

1. [ ] Create optimized CLAUDE.md (≤100 lines)
2. [ ] Create MIGRATION_GUIDE.md with:
   - [ ] Migration history and phases
   - [ ] Legacy structure documentation
   - [ ] Step-by-step migration instructions
   - [ ] Current status and achievements
3. [ ] Create PROJECT_SETUP.md with:
   - [ ] Development environment setup
   - [ ] Configuration files explanation
   - [ ] Development workflow
   - [ ] Build system details
4. [ ] Update ARCHITECTURE.md with:
   - [ ] Component patterns from CLAUDE.md
   - [ ] TypeScript configuration
   - [ ] Code organization
5. [ ] Update testing-strategy.md with:
   - [ ] Testing protocols from CLAUDE.md
   - [ ] Test-specific commands
6. [ ] Remove old CLAUDE.md from docs/ directory

## Success Metrics
- **CLAUDE.md**: ≤100 lines with only essential quick-reference info
- **No Redundancy**: Each instruction appears only once across all docs
- **Clear Separation**: Quick reference vs detailed documentation
- **Easy Navigation**: Find any information within seconds
- **Actionable**: Every item in CLAUDE.md is immediately actionable

## Content Migration Map

| From CLAUDE.md Lines | To Document | Section |
|---------------------|-------------|---------|
| 5-30 | CLAUDE.md (optimized) | Critical Context Files |
| 31-75 | CLAUDE.md (optimized) | Protocols (condensed) |
| 76-89 | testing-strategy.md | Testing Protocol |
| 90-116 | CLAUDE.md (optimized) | Commands & Design Source |
| 117-139 | MIGRATION_GUIDE.md | Project Overview |
| 140-192 | PROJECT_SETUP.md | Tech Stack & Commands |
| 193-264 | MIGRATION_GUIDE.md | Architecture Evolution |
| 265-304 | ARCHITECTURE.md | Component Patterns |
| 305-323 | PROJECT_SETUP.md | Configuration |
| 324-374 | PROJECT_SETUP.md | Development Workflow |
| 375-421 | MIGRATION_GUIDE.md | Current State |
| 422-466 | style-guide.md | (already there) |
| 467-503 | CLAUDE.md (optimized) | Doc Maintenance |
| 504-511 | Remove | (notes/metadata) |
```
