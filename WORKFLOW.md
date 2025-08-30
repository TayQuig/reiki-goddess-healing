# Workflow Management Guide

## 🔄 Regular Workflow Checks

Since Claude Code hooks aren't triggering automatically, run this command periodically:

```bash
python3 .claude/hooks/workflow-check.py
```

## 📋 When to Run Workflow Check

Run the workflow check:

- **After completing a major task**
- **Before starting a new feature**
- **Every 30-60 minutes during active development**
- **Before context refresh (at 75% usage)**

## 🎯 Current Workflow Status

### Immediate Actions Required:

1. **Commit current changes** (12 files changed)
2. **Create feature branch** for Phase 4 routing
3. **Update documentation** (testing-strategy.md, CLAUDE.md outdated)

### Suggested Commands:

```bash
# 1. First, commit current work
git add -A
git commit -m "feat(phase-4): implement routing infrastructure with AppLayout

- Added React Router v6 configuration
- Created AppLayout wrapper component
- Added animation configurations
- Updated documentation

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# 2. Create proper feature branch
git checkout -b feat/phase-4-routing

# 3. Run workflow check to confirm
python3 .claude/hooks/workflow-check.py
```

## 🔧 Hook Workaround Strategy

Until automatic hooks are fixed, we'll use this manual workflow:

1. **Run workflow check** regularly
2. **Follow its recommendations** for commits and updates
3. **Update this file** with current status
4. **Use TodoWrite** to track progress

## 📊 Current Project State

- **Branch**: damage-assessment-backup (should be feat/phase-4-routing)
- **Uncommitted**: 12 files
- **Phase**: 4A - Routing Infrastructure (partially implemented)
- **Tests**: 330 passing (Phase 3.5 complete)

## 🚀 Next Steps

1. ✅ Commit current changes
2. ✅ Switch to proper feature branch
3. ⏳ Fix animation timing (increase to 1.0-1.2s)
4. ⏳ Complete Phase 4 routing implementation
5. ⏳ Add route transitions and 404 page

## 💡 Tips for Maintaining Workflow

- Keep this file open as a reference
- Run `python3 .claude/hooks/workflow-check.py` frequently
- Commit every 5-10 file changes
- Update documentation after major milestones
- Create feature branches for new phases

---

_Last Updated: 2025-08-30_
_Run workflow check to see current status_
