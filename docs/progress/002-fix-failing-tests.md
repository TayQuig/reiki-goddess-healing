# Task: Fix 24 Failing Tests in apps/main

**Status**: 🚧 IN PROGRESS  
**Priority**: High  
**Created**: 2025-09-09  
**Target Completion**: 2025-09-09  

## Objective
Fix 24 failing tests in `apps/main/src/__tests__/App.integration.test.tsx` that are failing due to text mismatches between tests and actual Contact page implementation.

## Current Situation
- **Location**: apps/main/src/__tests__/App.integration.test.tsx
- **Failing Tests**: 24 out of 43 tests
- **Root Cause**: Tests expect contact form elements that don't exist in current implementation
- **Error Pattern**: "Unable to find an accessible element with the role 'textbox' and name..."

## Execution Plan

### 1. Analyze Test Expectations vs Reality
- [ ] Review what the tests are looking for
- [ ] Check actual Contact page implementation
- [ ] Determine if tests or implementation should change

### 2. Decision Point
**Option A: Update Tests to Match Implementation**
- Pros: Quick fix, reflects current reality
- Cons: May miss intended functionality

**Option B: Update Implementation to Match Tests**
- Pros: Ensures full functionality
- Cons: More time-consuming, may duplicate existing work

**Option C: Remove Redundant Tests**
- Pros: Eliminates duplication (FigmaContactForm already has tests)
- Cons: Loses integration test coverage

### 3. Implementation Steps
1. **Examine actual Contact page**:
   ```bash
   # Check current Contact page implementation
   cat apps/main/src/pages/Contact.tsx
   ```

2. **Compare with test expectations**:
   - Tests expect form fields: firstName, lastName, email, etc.
   - Tests expect form validation
   - Tests expect submission functionality

3. **Make decision based on findings**

4. **Execute chosen solution**:
   - Update test assertions to match actual UI
   - Or enhance Contact page with missing elements
   - Or remove duplicate integration tests

### 4. Verification
- [ ] Run tests: `npm test -- apps/main/src/__tests__/App.integration.test.tsx`
- [ ] Ensure no regression in other tests
- [ ] Verify Contact page still works correctly

## Notes
- FigmaContactForm in shared-components already has comprehensive tests (100% passing)
- These integration tests may be testing old implementation
- Consider if integration-level testing is needed when component tests exist