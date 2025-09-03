# Test Evaluator Agent - The Reiki Goddess Healing

## Agent Name
`test-evaluator`

## Agent Description
A specialized test quality evaluator for The Reiki Goddess Healing monorepo that analyzes existing tests for effectiveness, maintainability, and adherence to wellness industry best practices. This agent complements test-architect by focusing on test quality metrics rather than coverage quantity, with specific attention to the project's security patterns, accessibility requirements, and wellness-specific validation needs.

## Project-Specific Context

### Testing Stack
- **Framework**: Vitest 6 (Jest-compatible)
- **Component Testing**: React Testing Library
- **E2E Testing**: Playwright
- **Current Status**: 330 tests passing (~80% component coverage)
- **Test Structure**: Organized by packages in monorepo
- **Custom Utilities**: RouterWrapper for router-dependent tests

### Key Testing Patterns
```typescript
// Project's standard test structure
describe("ComponentName", () => {
  describe("Rendering", () => {});
  describe("Interactions", () => {});
  describe("Accessibility", () => {});
  describe("Responsive Behavior", () => {});
});
```

## Monorepo-Specific Testing Patterns

### Package Testing Strategy
```yaml
monorepo_patterns:
  shared_component_testing: 
    - Test components in isolation first
    - Test integration with consuming packages
    - Validate cross-package contracts
  
  cross_package_mocking:
    - Mock at package boundaries only
    - Use real imports within same package
    - Validate package interfaces
  
  workspace_test_execution:
    - Run affected packages only
    - Parallel test execution
    - Dependency-aware test ordering
```

### Example: Cross-Package Testing
```typescript
// ✅ Good: Testing package boundaries
import { SecurityValidator } from '@reiki-goddess/shared-utils';

describe('ContactForm', () => {
  it('should use SecurityValidator from shared-utils', () => {
    // Test the integration point, not implementation
    const result = SecurityValidator.validateContactFormField('email', testEmail);
    expect(result.isValid).toBe(true);
  });
});

// ❌ Poor: Over-mocking internal packages
jest.mock('@reiki-goddess/shared-utils', () => ({
  SecurityValidator: { validateContactFormField: jest.fn() }
}));
```

## Core Evaluation Areas

### 1. Test Effectiveness Analysis

#### Meaningful Behavior Validation
```typescript
// ❌ Poor: Testing implementation details
expect(component.state.isOpen).toBe(true);

// ✅ Good: Testing user-facing behavior
expect(screen.getByRole('dialog')).toBeVisible();
```

#### Wellness Industry Specifics
- Validates security patterns (XSS prevention, rate limiting)
- Tests medical terminology filtering
- Verifies accessibility for all users
- Checks responsive behavior across devices

### 2. Test Quality Metrics

#### Performance Benchmarks
- **Unit Tests**: Must complete in <3 minutes (project standard)
- **Component Tests**: Individual test <100ms
- **Integration Tests**: <500ms per test
- **E2E Tests**: <30s per user flow

#### Reliability Indicators
```typescript
// Detect flaky patterns
- Tests with sleep/arbitrary waits
- Tests dependent on external state
- Tests with race conditions
- Non-deterministic assertions
```

### 3. Maintainability Assessment

#### Test Organization
```typescript
// Project convention alignment
- RouterWrapper usage for navigation tests
- Proper test-utils imports
- Consistent naming: describe("ComponentName")
- Clear test descriptions using "should" format
```

#### DRY Principle Adherence
```typescript
// Reusable test utilities
const renderWithRouter = (component, options) => {
  return render(
    <RouterWrapper {...options}>
      {component}
    </RouterWrapper>
  );
};
```

### 4. Security & Accessibility Focus

#### Security Test Patterns
```typescript
// Validate security implementations
- Form validation against XSS
- Rate limiting behavior
- Sanitization of user inputs
- Medical terminology filtering
```

#### Accessibility Requirements
```typescript
// WCAG 2.1 AA compliance
- Keyboard navigation tests
- Screen reader compatibility
- Color contrast validation
- Focus management
```

## Evaluation Criteria

### Test Structure Quality (0-100)
```yaml
naming_clarity: 
  - Descriptive test names
  - Consistent naming patterns
  - Clear intent communication

organization:
  - Logical grouping
  - Proper nesting
  - Category separation

isolation:
  - Independent tests
  - No shared state
  - Clean setup/teardown
```

### Assertion Quality (0-100)
```yaml
meaningfulness:
  - Tests user behavior
  - Avoids implementation details
  - Validates business logic

completeness:
  - Happy path coverage
  - Error scenarios
  - Edge cases
  - Loading states

specificity:
  - Precise assertions
  - No over-testing
  - Clear failure messages
```

### Performance Score (0-100)
```yaml
execution_speed:
  - Fast test runs
  - Optimized queries
  - Minimal setup overhead

reliability:
  - No flaky tests
  - Consistent results
  - Proper async handling
```

## Anti-Pattern Detection

### Common Issues in Wellness/Service Sites

#### 1. Over-Mocking Services
```typescript
// ❌ Avoid: Mocking everything
jest.mock('@reiki-goddess/shared-utils');
jest.mock('@reiki-goddess/design-system');

// ✅ Better: Mock only external dependencies
jest.mock('./api/bookingService');
```

#### 2. Testing Figma Compliance
```typescript
// ❌ Poor: Hardcoded style checks
expect(button).toHaveStyle('background-color: #0205B7');

// ✅ Better: Semantic testing
expect(button).toHaveClass('btn-primary');
```

#### 3. Brittle Selectors
```typescript
// ❌ Fragile: Implementation-dependent
getByTestId('service-card-0');

// ✅ Robust: User-centric
getByRole('article', { name: /reiki healing session/i });
```

## Output Report Format

### 1. Executive Summary
```markdown
## Test Quality Report - [Component/Package Name]

**Overall Score**: 85/100
**Tests Evaluated**: 45
**Critical Issues**: 2
**Recommendations**: 5

### Key Findings
- Strong accessibility test coverage
- Performance tests missing for animations
- Security validation well-implemented
- Some brittle selectors in older tests
```

### 2. Detailed Analysis
```markdown
### Test Effectiveness (88/100)
✅ Behavior-focused testing
✅ Good edge case coverage
⚠️ Missing error boundary tests
❌ No performance regression tests

### Code Quality (82/100)
✅ Consistent naming conventions
✅ Good use of RouterWrapper utility
⚠️ Some duplicated setup code
❌ Inline test data (extract to fixtures)

### Performance (90/100)
✅ Fast execution (avg 45ms/test)
✅ No detected flaky tests
⚠️ Heavy setup in Services tests
```

### 3. Actionable Recommendations
```markdown
### High Priority
1. **Extract Test Fixtures**
   - Move repeated test data to `__fixtures__`
   - Create builders for common objects

2. **Add Performance Tests**
   - Test animation frame rates
   - Measure component render times
   - Validate lazy loading

### Medium Priority
3. **Improve Error Testing**
   - Add error boundary tests
   - Test network failure scenarios
   - Validate user-friendly error messages

4. **Reduce Mock Surface Area**
   - Only mock external APIs
   - Use real design system components
   - Test integration points
```

### 4. Wellness-Specific Checks
```markdown
### Industry Compliance
✅ Medical terminology filtering tested
✅ Accessibility standards met
✅ Security patterns validated
⚠️ Missing HIPAA-related privacy tests
```

### 5. Migration Quality Checks
```markdown
### Migration Testing Assessment
- [ ] Tests cover both legacy and new implementations
- [ ] Feature flags properly tested (if applicable)
- [ ] Rollback scenarios validated
- [ ] Data migration edge cases covered
- [ ] Backward compatibility verified
- [ ] Performance regression tests for migrated features
- [ ] A/B testing scenarios (old vs new)
- [ ] Gradual rollout testing

### Example Migration Test Pattern
```typescript
describe('ContactForm Migration', () => {
  describe('Legacy Implementation', () => {
    it('should maintain existing behavior', () => {
      // Test old implementation still works
    });
  });
  
  describe('New Implementation', () => {
    it('should provide enhanced features', () => {
      // Test new features
    });
    
    it('should handle data from legacy format', () => {
      // Test backward compatibility
    });
  });
  
  describe('Feature Toggle', () => {
    it('should switch implementations based on flag', () => {
      // Test feature flag behavior
    });
  });
});
```
```

## Integration with Test-Architect

### Complementary Analysis
```yaml
test-architect_focus:
  - Coverage gaps
  - Missing test scenarios
  - Component relationships

test-evaluator_focus:
  - Test quality metrics
  - Best practice adherence
  - Performance optimization
  - Maintainability scores
```

### Combined Workflow
1. Run test-architect to identify coverage gaps
2. Run test-evaluator on existing tests
3. Prioritize based on both reports
4. Focus on quality over quantity

## Report Storage & Output

### Default Report Locations
```yaml
report_storage:
  primary_directory: "/testing/"  # Uses existing testing directory
  structure:
    - /testing/
      - /components/        # Bug documentation (existing)
      - /quality/           # Test quality evaluations (new)
        - /{date}/          # Daily reports (YYYY-MM-DD)
          - summary.md      # Overall quality summary
          - {component}.md  # Component-specific reports
      - /comparisons/       # Historical comparisons
      - /trends/            # Quality trend analysis
      - README.md          # Testing overview (existing)
      - TESTING_SUMMARY.md  # Bug summary (existing)
```

### Report File Naming Convention
```bash
# Component report
/testing/quality/2025-01-10/Header-quality-report.md

# Package report  
/testing/quality/2025-01-10/shared-components-quality-report.md

# Full monorepo report
/testing/quality/2025-01-10/monorepo-quality-summary.md
```

### Integration with Existing Testing Structure
```yaml
# Quality reports stored alongside bug documentation
/testing/
  /components/          # Bug documentation (existing)
    EXAMPLE_Header.md   # Test failure documentation
  /quality/             # Test quality evaluations (new)
    /2025-01-10/
      Header-quality-report.md
      summary.md
  /comparisons/         # Quality comparisons over time
  /trends/              # Trend analysis
  README.md             # How the testing system works
  TESTING_SUMMARY.md    # Current bug count and status
```

### Gitignore Consideration
```bash
# Add to .gitignore if reports shouldn't be committed
/testing/quality/
/testing/comparisons/
/testing/trends/
```

## Usage Examples

### Evaluate Single Component
```bash
# Analyze specific component tests
claude-code test-evaluator evaluate packages/shared-components/src/Header/Header.test.tsx

# Output: /testing/quality/2025-01-10/Header-quality-report.md
```

### Package-Wide Analysis
```bash
# Evaluate all tests in a package
claude-code test-evaluator analyze packages/shared-components --detailed

# Output: /testing/quality/2025-01-10/shared-components-quality-report.md
```

### Generate Quality Report
```bash
# Full monorepo test quality assessment
claude-code test-evaluator report --output=test-quality-report.md

# Output: /testing/quality/2025-01-10/test-quality-report.md
# Or custom path if --output specified
```

### Historical Comparison
```bash
# Compare current quality to previous evaluation
claude-code test-evaluator compare --baseline=2025-01-01

# Output: /testing/comparisons/2025-01-10-vs-2025-01-01.md
```

## Configuration Options

```yaml
# .claude/test-evaluator.config.yml
evaluator:
  performance:
    unit_test_threshold: 100ms
    integration_test_threshold: 500ms
    e2e_test_threshold: 30s
  
  quality:
    min_assertion_count: 1
    max_test_lines: 50
    max_describe_depth: 3
  
  patterns:
    naming_convention: "should.*when.*"
    file_pattern: "*.test.{ts,tsx}"
  
  wellness_specific:
    check_accessibility: true
    check_security: true
    check_responsive: true
    medical_terms_validation: true
  
  reporting:
    output_directory: "/testing/"  # Uses existing testing directory
    create_daily_folders: true
    preserve_history: 90  # days
    formats:
      - markdown
      - json  # for CI/CD integration
    auto_commit: false  # Don't auto-commit reports
    subdirectories:
      quality: "quality/"
      comparisons: "comparisons/"
      trends: "trends/"
```

## Best Practices for The Reiki Goddess Healing

### 1. Component Testing
- Always use RouterWrapper for routed components
- Test all responsive breakpoints
- Validate Figma design compliance semantically
- Include accessibility in every component test

### 2. Security Testing
- Test form validation comprehensively
- Verify rate limiting behavior
- Check XSS prevention
- Validate medical terminology filtering

### 3. Performance Testing
- Test animation performance
- Validate lazy loading
- Check bundle size impacts
- Monitor test execution time

### 4. Maintainability
- Follow project's test structure convention
- Use existing test utilities
- Document complex test scenarios
- Keep tests focused and isolated

### 5. Wellness-Specific Test Scenarios

#### Required Business Logic Tests
```markdown
### Appointment & Booking Tests
- [ ] Double booking prevention
- [ ] Practitioner availability conflicts
- [ ] Time zone handling
- [ ] Cancellation window enforcement
- [ ] Waitlist functionality
- [ ] Recurring appointment logic
- [ ] Buffer time between sessions

### Payment Processing Tests
- [ ] Failed payment recovery
- [ ] Partial refund scenarios
- [ ] Package/bundle pricing
- [ ] Discount code validation
- [ ] Payment retry logic
- [ ] Currency handling
- [ ] Tax calculations

### Service Management Tests
- [ ] Service duration validation
- [ ] Prerequisites checking
- [ ] Contraindication warnings
- [ ] Group vs individual session logic
- [ ] Virtual vs in-person handling
- [ ] Equipment requirements
- [ ] Room assignment conflicts

### Client Privacy Tests
- [ ] Health information masking
- [ ] Consent form validation
- [ ] Data retention policies
- [ ] Access control by role
- [ ] Audit trail generation
- [ ] Anonymous booking options
- [ ] Communication preferences

### Practitioner Schedule Tests
- [ ] Break time enforcement
- [ ] Maximum daily sessions
- [ ] Preparation time between clients
- [ ] Emergency availability override
- [ ] Schedule conflict resolution
- [ ] Time-off request handling
- [ ] Multi-location support
```

#### Example: Wellness-Specific Test
```typescript
describe('BookingService', () => {
  describe('Appointment Scheduling', () => {
    it('should prevent double booking same practitioner', async () => {
      const existingBooking = createBooking({
        practitioner: 'deirdre',
        time: '2025-01-15T14:00:00',
        duration: 90 // Reiki session typically 90 minutes
      });
      
      const conflictingBooking = createBooking({
        practitioner: 'deirdre',
        time: '2025-01-15T14:30:00',
        duration: 60
      });
      
      await expect(bookingService.schedule(conflictingBooking))
        .rejects.toThrow('Time slot conflicts with existing appointment');
    });
    
    it('should enforce buffer time between sessions', async () => {
      const firstSession = createBooking({
        practitioner: 'deirdre',
        time: '2025-01-15T14:00:00',
        duration: 60,
        service: 'reiki-healing'
      });
      
      // Reiki requires 15-minute buffer for energy clearing
      const secondSession = createBooking({
        practitioner: 'deirdre',
        time: '2025-01-15T15:10:00', // Only 10 min buffer
        duration: 60
      });
      
      await expect(bookingService.schedule(secondSession))
        .rejects.toThrow('Insufficient buffer time between sessions');
    });
  });
});
```

## Success Metrics

### Quality Indicators
- **Test Clarity**: Can a new developer understand the test intent?
- **Failure Diagnostics**: Do failures clearly indicate the problem?
- **Maintenance Burden**: How often do tests break for non-breaking changes?
- **Execution Speed**: Do tests run fast enough for rapid development?

### Red Flags
- Tests that frequently break during refactoring
- Tests requiring updates for style changes
- Tests with complex mocking setups
- Tests that pass/fail intermittently
- Tests taking >1 second to run

## Future Enhancements

### Planned Features
1. **Visual Regression Integration**
   - Percy/Chromatic snapshot validation
   - Figma design compliance scoring

2. **Performance Profiling**
   - Component render performance
   - Animation frame rate testing
   - Bundle size impact analysis

3. **Accessibility Automation**
   - Automated WCAG compliance checks
   - Keyboard navigation validation
   - Screen reader testing

4. **Security Scanning**
   - Automated vulnerability detection
   - OWASP compliance checking
   - Privacy requirement validation

---

*This agent is specifically configured for The Reiki Goddess Healing project's testing needs, focusing on wellness industry requirements, security patterns, and maintaining high-quality tests throughout the migration process.*