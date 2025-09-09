# MobileHeader Focus Management Fix

## Issue
The test "should trap focus in menu when open" was failing because focus wasn't being properly managed when the mobile menu opened.

## Root Cause
1. The component didn't have focus management implemented
2. When the menu opened, focus remained on the menu button instead of moving to the first menu item
3. No focus trapping was implemented to keep focus within the menu

## Solution Implemented

### Component Changes (MobileHeader.tsx):
1. **Added focus management hooks**:
   - `useRef` for tracking menu, button, and previous focus
   - `useEffect` to handle focus when menu opens/closes

2. **Implemented immediate focus with `requestAnimationFrame`**:
   ```typescript
   requestAnimationFrame(() => {
     const firstLink = menuRef.current?.querySelector('a[href]');
     if (firstLink) {
       (firstLink as HTMLElement).focus();
     }
   });
   ```
   - No arbitrary delays
   - Proper timing with browser's repaint cycle

3. **Added focus trap logic**:
   - Tab key handling to keep focus within menu
   - Wraps from last to first element
   - Shift+Tab wraps from first to last

4. **Added escape key handling**:
   - Closes menu on Escape press
   - Returns focus to menu button

### Test Changes (MobileHeader.test.tsx):
1. **Used proper test utilities**:
   - `waitFor` instead of arbitrary `setTimeout`
   - Tests actual behavior, not timing

2. **Enhanced focus trap test**:
   - Tests complete tab cycle
   - Verifies focus wrapping behavior

## Results
- All 18 MobileHeader tests now passing
- Focus management works correctly
- No brittle timing dependencies

## Remaining Issues
- React act() warnings still present (to be addressed in Step 2)
- These warnings don't affect functionality, just indicate state updates need wrapping

## Best Practices Applied
1. Fixed the component, not the test
2. Used browser APIs correctly (requestAnimationFrame)
3. Avoided arbitrary delays
4. Implemented complete accessibility features (focus trap, escape handling)
5. Used proper testing utilities