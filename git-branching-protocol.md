# Git Branching Protocol - The Reiki Goddess Healing

## Branch Naming Conventions

### Main Branches

- `main` - Production-ready code, always stable
- `develop` - Integration branch for features (optional, for larger teams)

### Feature Branches

**Format**: `feat/phase-X-description` or `feat/feature-name`
**Examples**:

- `feat/phase-4-routing`
- `feat/contact-form-validation`
- `feat/booking-system`

### Fix Branches

**Format**: `fix/issue-description`
**Examples**:

- `fix/animation-timing`
- `fix/mobile-menu-overflow`

### Refactor Branches

**Format**: `refactor/component-name`
**Examples**:

- `refactor/header-component`
- `refactor/test-structure`

### Documentation Branches

**Format**: `docs/documentation-topic`
**Examples**:

- `docs/api-documentation`
- `docs/testing-guide`

## When to Create Feature Branches

### CREATE a new feature branch when:

1. **Starting a new phase** (Phase 4, Phase 5, etc.)
2. **Adding major functionality** that will take multiple commits
3. **Working on experimental features** that might not be merged
4. **Multiple people working** on different features simultaneously
5. **Changes span multiple days** of work
6. **Breaking changes** that need review before merging

### WORK directly on main when:

1. **Hotfixes** that need immediate deployment
2. **Documentation updates** that don't affect code
3. **Small bug fixes** (< 50 lines changed)
4. **Configuration updates** that are low risk

## Branch Workflow

### 1. Creating a Feature Branch

```bash
# Always branch from main
git checkout main
git pull origin main
git checkout -b feat/phase-4-routing
```

### 2. Working on Feature Branch

```bash
# Regular commits with conventional format
git add .
git commit -m "feat(routing): add React Router v6 setup"

# Push to remote
git push -u origin feat/phase-4-routing
```

### 3. Keeping Branch Updated

```bash
# Regularly sync with main
git checkout main
git pull origin main
git checkout feat/phase-4-routing
git merge main  # or rebase if preferred
```

### 4. Merging Back to Main

```bash
# Ensure all tests pass
npm test
npm run type-check
npm run lint

# Create pull request or merge directly
git checkout main
git merge feat/phase-4-routing
git push origin main

# Delete feature branch
git branch -d feat/phase-4-routing
git push origin --delete feat/phase-4-routing
```

## Commit Message Format

### Conventional Commits

```
type(scope): description

- Optional body with details
- Bullet points for multiple changes

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code change that neither fixes nor adds feature
- `test`: Adding missing tests
- `chore`: Maintain tasks, dependencies update

## Phase-Based Branching Strategy

For this project's phase-based approach:

### Current Recommendation

Since we're starting **Phase 4 (Routing)**, we should:

1. Create `feat/phase-4-routing` branch
2. Complete all Phase 4 tasks on this branch
3. Merge to main when phase is complete
4. Tag the completion: `git tag phase-4-complete`

### Branch Lifecycle per Phase

```
main
  |
  ├── feat/phase-4-routing (current)
  |     ├── All routing tasks
  |     ├── Layout wrapper
  |     └── Navigation states
  |
  ├── feat/phase-5-backend (future)
  |     ├── Contact form API
  |     ├── Booking system
  |     └── Newsletter integration
  |
  └── feat/phase-6-deployment (future)
        ├── CI/CD setup
        ├── Environment config
        └── Production optimization
```

## Git Hooks Integration

### Automated Branch Creation Trigger

When these conditions are met, Claude should suggest creating a feature branch:

1. Starting work on a new phase
2. More than 10 files will be modified
3. Adding new packages or major dependencies
4. Implementing breaking changes

### Hook Configuration

Add to `.claude/settings.json`:

```json
{
  "branch_triggers": {
    "new_phase": true,
    "file_threshold": 10,
    "breaking_changes": true
  }
}
```

## Recovery from Current State

### Current Situation

- On branch: `damage-assessment-backup`
- Uncommitted changes for routing setup
- Should be on a proper feature branch

### Recommended Actions

1. Stash or commit current changes
2. Create proper feature branch: `feat/phase-4-routing`
3. Apply changes to new branch
4. Continue Phase 4 development

## Quick Reference Commands

```bash
# Check current branch
git branch --show-current

# List all branches
git branch -a

# Create and switch to new branch
git checkout -b feat/branch-name

# Delete local branch
git branch -d branch-name

# Delete remote branch
git push origin --delete branch-name

# Rename current branch
git branch -m new-name

# Check branch tracking
git branch -vv

# Set upstream branch
git branch --set-upstream-to=origin/main
```

---

_Last Updated: 2025-08-30_
_This protocol ensures organized development and clear project history_
