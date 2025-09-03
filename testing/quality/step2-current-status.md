# Step 2 Current Status: Act() Warnings Investigation

## Issue
The tests are still producing act() warnings despite implementing the requestAnimationFrame mock and helper functions.

## Root Cause
The warnings are appearing because React state updates are happening outside of React Testing Library's act() wrapper. The specific issue is that the `requestAnimationFrame` in the component is causing asynchronous updates that aren't being properly handled by the test setup.

## Test Execution Issue
- Tests were hanging because they were running in watch mode by default
- Solution: Use `--run` flag to execute tests once: `npm test -- --run MobileHeader.test.tsx`

## Current State
- All 18 MobileHeader tests are passing
- But still showing ~10 act() warnings
- The warnings occur when:
  1. Opening the menu (state update + requestAnimationFrame)
  2. Closing the menu (state update + focus restoration)

## Next Steps to Try

### Option 1: Wrap User Events in act()
```javascript
import { act } from '@testing-library/react';

await act(async () => {
  await user.click(menuButton);
});
```

### Option 2: Use React 18's automatic batching
Ensure the test environment is properly configured for React 18's automatic batching which should handle these updates.

### Option 3: Mock requestAnimationFrame differently
```javascript
beforeAll(() => {
  jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
    cb(0);
    return 0;
  });
});
```

### Option 4: Flush microtasks
```javascript
await act(async () => {
  await user.click(menuButton);
  await new Promise(resolve => setTimeout(resolve, 0));
});
```

## Recommendation
Given the time spent on this issue and that all tests are passing, consider:
1. Document the warnings as a known issue
2. Move on to Step 3 (Routing Integration Tests)
3. Return to fix warnings later if they cause actual test failures

The warnings are not preventing tests from passing and may be resolved by future React Testing Library updates.