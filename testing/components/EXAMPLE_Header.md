# Header Component - Test Documentation

This file documents test failures for the Header component.
Each failure is preserved for investigation and bug fixing.

**DO NOT REWRITE TESTS TO PASS** - Document bugs instead!

## Test Run: 2025-09-02 10:30:00

### ❌ should render navigation links

**File**: `packages/shared-components/src/Header/Header.test.tsx:45`

**Assertion Error**: Expected element to have text content "Services" but received "Service"

**Expected**:
```
Services
```

**Received**:
```
Service
```

**Status**: 🐛 Bug - Needs Investigation

**Notes**: The navigation link text doesn't match the expected value. This could be:
1. A typo in the component
2. The design has changed but tests weren't updated
3. Missing 's' in the navigation data

---

### ❌ should apply active class to current page

**File**: `packages/shared-components/src/Header/Header.test.tsx:78`

**Assertion Error**: Expected element to have class "border-b-2" but it was not found

**Expected**:
```
border-b-2 border-primary-blue
```

**Received**:
```
(no active classes applied)
```

**Status**: 🐛 Bug - Needs Investigation

**Notes**: Active page indicator not working. Possible causes:
1. React Router integration issue
2. Missing pathname check in component
3. CSS class not being applied conditionally

---

## Test Run: 2025-09-02 14:15:00

### ❌ should toggle mobile menu on hamburger click

**File**: `packages/shared-components/src/Header/MobileHeader.test.tsx:112`

**Assertion Error**: Menu did not open after clicking hamburger button

**Expected**:
```
aria-expanded="true"
```

**Received**:
```
aria-expanded="false"
```

**Status**: 🐛 Bug - Needs Investigation

**Notes**: Mobile menu toggle not functioning. Check:
1. Click handler implementation
2. State management for isOpen
3. Event propagation issues

---