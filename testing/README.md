# Testing Documentation System

This directory contains automated test failure documentation for The Reiki Goddess Healing project.

## Purpose

Instead of rewriting tests to make them pass, this system documents all test failures as bugs that need to be investigated and fixed in the actual code.

## Directory Structure

```
testing/
├── README.md                    # This file
├── TESTING_SUMMARY.md          # Overview of all documented bugs
├── CONTEXT_REFRESH_SUMMARY.md  # Generated for context refreshes
└── components/                 # Component-specific test documentation
    ├── Header.md              # Test failures for Header component
    ├── Footer.md              # Test failures for Footer component
    └── ...                    # One file per component with failures
```

## Automated Workflow

1. **Test Execution**: When you run tests (`npm test`, `vitest`), failures are automatically captured
2. **Documentation**: Each failure is documented in the appropriate component file
3. **Summary Generation**: Testing summaries are updated automatically
4. **Context Refresh**: When starting a new session, review the summary files

## Key Principles

### ❌ DO NOT:
- Rewrite tests to make them pass
- Delete failing tests
- Skip or disable tests without documentation
- Assume tests are wrong

### ✅ DO:
- Document why tests are failing
- Investigate the actual bugs in the code
- Fix the bugs, not the tests
- Track patterns in failures
- Use test failures to understand requirements

## Using the Documentation

### For Bug Fixing Sessions

1. Start by reading `TESTING_SUMMARY.md` for an overview
2. Check `CONTEXT_REFRESH_SUMMARY.md` for priority bugs
3. Open specific component files for detailed failure information
4. Fix bugs in the code (not the tests)
5. Re-run tests to verify fixes

### For Context Refresh

When starting a new Claude session:

1. Mention "test status" or "testing summary" to trigger summary generation
2. Review the generated `CONTEXT_REFRESH_SUMMARY.md`
3. Continue fixing bugs based on priority

## Example Entry

```markdown
### ❌ should render navigation links

**File**: `packages/shared-components/src/Header/Header.test.tsx:45`

**Assertion Error**: Expected element to have text content "Services" but received "Service"

**Expected**:
\```
Services
\```

**Received**:
\```
Service
\```

**Status**: 🐛 Bug - Needs Investigation

**Notes**: The navigation link text doesn't match the expected value.
```

## Integration with Claude Code

This system is integrated with Claude Code hooks:

- Automatically captures test failures
- Generates summaries on request
- Helps maintain context across sessions
- Prevents test modification (encourages bug fixes)

---

Remember: **Tests represent requirements**. If a test fails, the code has a bug, not the test.