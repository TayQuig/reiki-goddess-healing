# FormRateLimit Test Failures

**Component**: FormRateLimit
**Location**: `packages/shared-utils/src/security/FormRateLimit.ts`
**Test File**: `packages/shared-utils/src/security/FormRateLimit.test.ts`

## Test Failures

### ❌ should respect custom time window

**File**: `packages/shared-utils/src/security/FormRateLimit.test.ts:236`

**Assertion Error**: Expected rate limit to block submission after recording but it was allowed

**Test Case**:

```typescript
// Create rate limit with 1 submission per 100ms window
const rateLimit = new FormRateLimit({
  maxSubmissions: 1,
  timeWindowMs: 100,
});

// Record one submission
rateLimit.record();

// Should be blocked after recording
result = rateLimit.checkLimit();
expect(result.allowed).toBe(false); // This is failing - allowed is true
```

**Status**: 🐛 Bug - Needs Investigation

**Notes**:

- The custom time window configuration may not be working correctly
- The rate limit is allowing submissions when it should be blocking
- Could be a timing issue with the test or a bug in the time window logic

## Summary

- **Total Failures**: 1
- **Component**: FormRateLimit
- **Type**: Configuration Logic
- **Priority**: Medium (rate limiting still works with defaults)
- **Impact**: Custom time windows may not be enforced correctly, but default 1-hour window works
