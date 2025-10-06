# Testing strategy: Resend email integration

## Table of contents

1. [Current test coverage](#current-test-coverage)
2. [Test requirements for email integration](#test-requirements-for-email-integration)
3. [Mock strategy](#mock-strategy)
4. [Test scenarios](#test-scenarios)
5. [Testing checklist](#testing-checklist)
6. [Manual testing](#manual-testing)
7. [Coverage goals](#coverage-goals)
8. [CI/CD integration](#cicd-integration)

## Current test coverage

### Existing tests

**FigmaContactForm Component** (`/packages/shared-components/src/FigmaContactForm/FigmaContactForm.test.tsx`):

- Rendering tests: Form fields, placeholders, required indicators, custom className
- Field validation: Required fields, email format, phone number, real-time error clearing
- Form submission: Valid data submission, success messages, terms agreement, submission failures
- Security features: Rate limit display, submit button disabled state
- Styling: Figma-specific styles, responsive layout
- **Coverage**: ~95% (comprehensive component testing)

**SecurityFeatures Tests** (`/packages/shared-components/src/FigmaContactForm/SecurityFeatures.test.tsx`):

- Rate limiting: Check before submission, rate limit exceeded messages, successful submission recording
- Content validation: High-risk content blocking, data sanitization before submission
- Security logging: High-risk validation failures, successful submissions, submission errors
- Wellness-specific validation: Medical terminology rejection
- **Coverage**: ~90% (security-focused testing)

**ContactPage Component** (`/packages/shared-components/src/pages/ContactPage.test.tsx`):

- Rendering: Main heading, subtitle, contact form, contact info cards, map section, CTA section
- Styling: Background, typography, smoke effects, CTA styling
- Layout: Spacing, responsive grids
- Accessibility: Heading hierarchy, aria-labels, accessible links
- **Coverage**: ~85% (presentation-focused testing)

**SecurityValidator** (`/packages/shared-utils/src/security/SecurityValidator.test.ts`):

- Field validation: Empty fields, medical terms, SQL injection, XSS attempts, excessive length, spam patterns
- Input sanitization: HTML tag removal, script removal, dangerous pattern removal
- Email validation: Format validation, injection attempts, disposable email detection
- Phone validation: Format validation, number sanitization
- Risk assessment: High-risk detection, low-risk pass-through
- **Coverage**: ~98% (comprehensive security testing)

**FormRateLimit** (`/packages/shared-utils/src/security/FormRateLimit.test.ts`):

- Submission tracking: Count tracking, limit enforcement, old submission cleanup
- Rate limit checking: Allow/block decisions, appropriate messaging
- Static methods: canSubmit, recordSubmission
- Reset functionality: Clear submission history
- Error handling: localStorage errors, corrupted data
- Custom configuration: Storage keys, max submissions, time windows
- **Coverage**: ~95% (comprehensive rate limit testing)

**E2E Tests** (`/e2e/contact-form.spec.ts`):

- Accessibility: Proper labels, required indicators, ARIA attributes
- Validation: Required fields, email format, XSS prevention, health information detection
- Security: Input sanitization, rate limiting, CSRF protection
- Form submission: Success handling, API errors, form reset
- **Coverage**: Complete user journey testing

### Coverage metrics

| Component/Utility | Coverage   | Test Type        | Mock Approach                        |
| ----------------- | ---------- | ---------------- | ------------------------------------ |
| FigmaContactForm  | ~95%       | Unit/Integration | Vi mocks for security utils          |
| SecurityFeatures  | ~90%       | Unit             | Vi mocks with custom implementations |
| ContactPage       | ~85%       | Unit             | Component mocks                      |
| SecurityValidator | ~98%       | Unit             | No mocks (pure functions)            |
| FormRateLimit     | ~95%       | Unit             | localStorage mock                    |
| E2E Tests         | Full paths | E2E              | Network route mocking                |

### Testing patterns

**Framework**: Vitest + React Testing Library + Playwright

- **Setup file**: `/test-setup.ts` with global mocks (matchMedia, ResizeObserver, IntersectionObserver)
- **Config**: Shared config at `/vitest.config.shared.ts`
- **Environment**: jsdom for React components
- **Coverage**: v8 provider with text, JSON, and HTML reports

**Mock approach**:

- Component mocks: Simple functional components with test IDs
- Security utils: Vi mocks with custom validation logic
- API mocking: Fetch API mocks, network route interception (E2E)
- localStorage: Custom mock implementation

**Assertion style**:

- Jest-DOM matchers (`toBeInTheDocument`, `toHaveClass`, etc.)
- User event simulation via `@testing-library/user-event`
- Async waitFor patterns for state updates
- Network response mocking with Playwright routes

## Test requirements for email integration

### Unit tests

#### API client (`/packages/shared-utils/src/api/contact.ts`)

```typescript
describe("submitContactForm", () => {
  // Happy path
  test("sends POST request to API endpoint with form data", async () => {
    const mockData: FigmaContactFormData = {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "1234567890",
      message: "Test message",
      agreeToTerms: true,
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, message: "Email sent" }),
    });

    const result = await submitContactForm(mockData);

    expect(fetch).toHaveBeenCalledWith("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mockData),
    });
    expect(result.success).toBe(true);
  });

  // Success response
  test("returns success response with message", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        message: "Your message has been sent successfully",
        id: "email_abc123",
      }),
    });

    const result = await submitContactForm(mockValidData);

    expect(result.success).toBe(true);
    expect(result.message).toBe("Your message has been sent successfully");
  });

  // API errors
  test("handles API error responses", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ error: "Server error" }),
    });

    await expect(submitContactForm(mockValidData)).rejects.toThrow(
      "Server error"
    );
  });

  // Network errors
  test("handles network errors", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    await expect(submitContactForm(mockValidData)).rejects.toThrow(
      "Network error. Please check your connection and try again."
    );
  });

  // Rate limit errors
  test("handles rate limit errors with retry-after", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      json: async () => ({
        error: "Rate limit exceeded",
        retryAfter: 3600,
      }),
    });

    await expect(submitContactForm(mockValidData)).rejects.toThrow(
      "Rate limit exceeded. Please try again in 60 minutes."
    );
  });

  // Validation errors
  test("handles validation error responses", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({
        error: "Validation failed",
        errors: { email: "Invalid email format" },
      }),
    });

    await expect(submitContactForm(mockValidData)).rejects.toThrow(
      "Validation failed"
    );
  });

  // Data transformation
  test("correctly transforms and sends form data", async () => {
    const formData: FigmaContactFormData = {
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      phone: "(555) 123-4567",
      message: "Hello world",
      agreeToTerms: true,
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    await submitContactForm(formData);

    const fetchCall = (fetch as jest.Mock).mock.calls[0];
    const sentData = JSON.parse(fetchCall[1].body);

    expect(sentData).toEqual(formData);
  });
});
```

#### ContactPage integration with email API

```typescript
describe('ContactPage with email integration', () => {
  test('calls submitContactForm on form submission', async () => {
    const mockSubmit = vi.fn().mockResolvedValue({ success: true });
    vi.mock('@reiki-goddess/shared-utils', () => ({
      submitContactForm: mockSubmit,
    }));

    render(<ContactPage />);

    // Fill form
    await user.type(screen.getByLabelText(/first name/i), 'John');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/phone/i), '1234567890');
    await user.type(screen.getByLabelText(/message/i), 'Test message');
    await user.click(screen.getByLabelText(/terms/i));

    // Submit
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: '',
        email: 'john@example.com',
        phone: '1234567890',
        message: 'Test message',
        agreeToTerms: true,
      });
    });
  });

  test('shows loading state while submitting', async () => {
    const mockSubmit = vi.fn().mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );

    render(<ContactPage />);

    // Fill and submit
    await fillFormWithValidData();
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    // Check loading state
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('Submitting...');

    // Wait for completion
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  test('shows success message on successful submission', async () => {
    const mockSubmit = vi.fn().mockResolvedValue({
      success: true,
      message: 'Your message has been sent successfully',
    });

    render(<ContactPage />);

    await fillFormWithValidData();
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/thank you for your message/i)).toBeInTheDocument();
    });
  });

  test('shows error message on submission failure', async () => {
    const mockSubmit = vi.fn().mockRejectedValue(
      new Error('Failed to send email')
    );

    render(<ContactPage />);

    await fillFormWithValidData();
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/error occurred/i)).toBeInTheDocument();
    });
  });

  test('maintains form data on submission error', async () => {
    const mockSubmit = vi.fn().mockRejectedValue(new Error('Network error'));

    render(<ContactPage />);

    const formData = {
      firstName: 'John',
      email: 'john@example.com',
      phone: '1234567890',
      message: 'Test message',
    };

    // Fill form
    await user.type(screen.getByLabelText(/first name/i), formData.firstName);
    await user.type(screen.getByLabelText(/email/i), formData.email);
    await user.type(screen.getByLabelText(/phone/i), formData.phone);
    await user.type(screen.getByLabelText(/message/i), formData.message);
    await user.click(screen.getByLabelText(/terms/i));

    // Submit
    await user.click(screen.getByRole('button', { name: /submit/i }));

    // Wait for error
    await waitFor(() => {
      expect(screen.getByText(/error occurred/i)).toBeInTheDocument();
    });

    // Verify form data retained
    expect(screen.getByLabelText(/first name/i)).toHaveValue(formData.firstName);
    expect(screen.getByLabelText(/email/i)).toHaveValue(formData.email);
    expect(screen.getByLabelText(/phone/i)).toHaveValue(formData.phone);
    expect(screen.getByLabelText(/message/i)).toHaveValue(formData.message);
  });

  test('resets form on successful submission', async () => {
    const mockSubmit = vi.fn().mockResolvedValue({ success: true });

    render(<ContactPage />);

    await fillFormWithValidData();
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/first name/i)).toHaveValue('');
      expect(screen.getByLabelText(/email/i)).toHaveValue('');
      expect(screen.getByLabelText(/phone/i)).toHaveValue('');
      expect(screen.getByLabelText(/message/i)).toHaveValue('');
    });
  });
});
```

### Integration tests

#### Email workflow tests

```typescript
describe('Email workflow integration', () => {
  test('complete form submission to email delivery', async () => {
    // Mock API responses
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        message: 'Email sent successfully',
        id: 'email_abc123',
      }),
    });

    render(<ContactPage />);

    // Fill form
    await fillFormWithValidData();

    // Submit
    await user.click(screen.getByRole('button', { name: /submit/i }));

    // Verify API call
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/contact'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });

    // Verify success message
    expect(screen.getByText(/thank you for your message/i)).toBeInTheDocument();
  });

  test('error handling flow with user recovery', async () => {
    let callCount = 0;
    global.fetch = vi.fn().mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return Promise.resolve({
          ok: false,
          status: 500,
          json: async () => ({ error: 'Server error' }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({ success: true }),
      });
    });

    render(<ContactPage />);

    // First attempt - fails
    await fillFormWithValidData();
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/error occurred/i)).toBeInTheDocument();
    });

    // Second attempt - succeeds
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/thank you for your message/i)).toBeInTheDocument();
    });
  });

  test('rate limit enforcement workflow', async () => {
    global.fetch = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 429,
        json: async () => ({
          error: 'Rate limit exceeded',
          retryAfter: 3600,
        }),
      });

    render(<ContactPage />);

    // Submit 3 times successfully
    for (let i = 0; i < 3; i++) {
      await fillFormWithValidData();
      await user.click(screen.getByRole('button', { name: /submit/i }));
      await waitFor(() => {
        expect(screen.getByText(/thank you/i)).toBeInTheDocument();
      });
    }

    // 4th attempt - rate limited
    await fillFormWithValidData();
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/rate limit exceeded/i)).toBeInTheDocument();
    });
  });

  test('success confirmation flow', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        message: 'Your message has been sent successfully',
      }),
    });

    render(<ContactPage />);

    await fillFormWithValidData();
    await user.click(screen.getByRole('button', { name: /submit/i }));

    // Check success state
    await waitFor(() => {
      expect(screen.getByText(/thank you for your message/i)).toBeInTheDocument();
      expect(screen.getByText(/we'll get back to you/i)).toBeInTheDocument();
    });

    // Form should be reset
    expect(screen.getByLabelText(/first name/i)).toHaveValue('');
  });
});
```

### E2E tests (Playwright)

#### Complete user journey

```typescript
// /e2e/email-submission.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Contact Form Email Submission", () => {
  test("user submits contact form and receives confirmation", async ({
    page,
  }) => {
    // Mock successful API response
    await page.route("/api/contact", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          message: "Your message has been sent successfully",
          id: "email_test123",
        }),
      });
    });

    // Navigate to contact page
    await page.goto("/contact");

    // Fill form
    await page.fill('input[name="firstName"]', "John");
    await page.fill('input[name="lastName"]', "Doe");
    await page.fill('input[name="email"]', "john@example.com");
    await page.fill('input[name="phone"]', "5551234567");
    await page.fill(
      'textarea[name="message"]',
      "I am interested in booking a Reiki session."
    );
    await page.check('input[name="agreeToTerms"]');

    // Submit form
    await page.click('button[type="submit"]');

    // Verify success message
    await expect(page.locator("text=Thank you for your message")).toBeVisible();
    await expect(
      page.locator("text=we'll get back to you within 24-48 hours")
    ).toBeVisible();

    // Verify form reset
    await expect(page.locator('input[name="firstName"]')).toHaveValue("");
    await expect(page.locator('input[name="email"]')).toHaveValue("");
  });

  test("handles network errors gracefully", async ({ page }) => {
    // Mock network error
    await page.route("/api/contact", async (route) => {
      await route.abort("failed");
    });

    await page.goto("/contact");

    // Fill and submit
    await page.fill('input[name="firstName"]', "John");
    await page.fill('input[name="email"]', "john@example.com");
    await page.fill('input[name="phone"]', "5551234567");
    await page.fill('textarea[name="message"]', "Test message");
    await page.check('input[name="agreeToTerms"]');
    await page.click('button[type="submit"]');

    // Verify error message
    await expect(page.locator("text=Network error")).toBeVisible();

    // Form data should be retained
    await expect(page.locator('input[name="firstName"]')).toHaveValue("John");
    await expect(page.locator('input[name="email"]')).toHaveValue(
      "john@example.com"
    );
  });

  test("displays server errors with user-friendly messages", async ({
    page,
  }) => {
    // Mock server error
    await page.route("/api/contact", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({
          error: "Failed to send message. Please try again later.",
        }),
      });
    });

    await page.goto("/contact");

    // Fill and submit
    await page.fill('input[name="firstName"]', "John");
    await page.fill('input[name="email"]', "john@example.com");
    await page.fill('input[name="phone"]', "5551234567");
    await page.fill('textarea[name="message"]', "Test message");
    await page.check('input[name="agreeToTerms"]');
    await page.click('button[type="submit"]');

    // Verify error message (no sensitive details)
    await expect(page.locator("text=An error occurred")).toBeVisible();
    expect(await page.textContent("body")).not.toContain("500");
    expect(await page.textContent("body")).not.toContain(
      "Internal Server Error"
    );
  });
});
```

## Mock strategy

### Resend API mocks

```typescript
// Success response
const mockResendSuccess = {
  id: "email_abc123",
  from: "contact@mail.thereikigoddesshealing.com",
  to: "thereikigoddesshealing@gmail.com",
  created_at: "2025-01-01T00:00:00Z",
  subject: "New Contact Form Submission from John Doe",
};

// Error responses
const mockResendErrors = {
  rateLimitExceeded: {
    error: {
      message: "Rate limit exceeded. Maximum 2 requests per second.",
      code: "rate_limit_exceeded",
    },
  },
  invalidApiKey: {
    error: {
      message: "Invalid API key",
      code: "invalid_api_key",
    },
  },
  validationError: {
    error: {
      message: "Validation error: Invalid email address",
      code: "validation_error",
    },
  },
  serverError: {
    error: {
      message: "Internal server error",
      code: "internal_error",
    },
  },
};

// Mock implementation
vi.mock("resend", () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: {
      send: vi.fn().mockResolvedValue({
        data: mockResendSuccess,
        error: null,
      }),
    },
  })),
}));
```

### Backend API mocks

```typescript
// Success responses
const mockBackendSuccess = {
  success: true,
  message: "Your message has been sent successfully",
  id: "email_abc123",
};

// Error responses
const mockBackendErrors = {
  rateLimitExceeded: {
    error: "Rate limit exceeded",
    retryAfter: 3600, // seconds
    message: "Too many submissions. Please try again in 60 minutes.",
  },
  validationFailed: {
    error: "Validation failed",
    errors: {
      email: "Invalid email format",
      message: "Message contains prohibited content",
    },
  },
  serverError: {
    error: "Failed to send message. Please try again later.",
  },
  networkError: {
    error: "Network error. Please check your connection and try again.",
  },
};

// Fetch mock implementation
global.fetch = vi.fn().mockImplementation((url, options) => {
  const body = JSON.parse(options.body || "{}");

  // Simulate different scenarios based on input
  if (body.email === "ratelimit@test.com") {
    return Promise.resolve({
      ok: false,
      status: 429,
      json: async () => mockBackendErrors.rateLimitExceeded,
    });
  }

  if (body.email === "invalid@") {
    return Promise.resolve({
      ok: false,
      status: 400,
      json: async () => mockBackendErrors.validationFailed,
    });
  }

  // Default success
  return Promise.resolve({
    ok: true,
    status: 200,
    json: async () => mockBackendSuccess,
  });
});
```

### Network error mocks

```typescript
// Network failure
vi.spyOn(global, "fetch").mockRejectedValue(new Error("Network error"));

// Timeout simulation
vi.spyOn(global, "fetch").mockImplementation(
  () =>
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), 5000)
    )
);

// Abort simulation
vi.spyOn(global, "fetch").mockRejectedValue(
  new DOMException("The operation was aborted.", "AbortError")
);
```

## Test scenarios

### 1. Happy path

✓ Form filled correctly
✓ Client-side validation passes
✓ Submit button clicked
✓ API called with sanitized data
✓ Email sent via Resend
✓ Success response received
✓ Success message displayed
✓ Form reset to empty state

**Test**:

```typescript
test('complete happy path submission', async () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ success: true, message: 'Email sent successfully' }),
  });

  render(<ContactPage />);

  await user.type(screen.getByLabelText(/first name/i), 'John');
  await user.type(screen.getByLabelText(/email/i), 'john@example.com');
  await user.type(screen.getByLabelText(/phone/i), '1234567890');
  await user.type(screen.getByLabelText(/message/i), 'I want to book a Reiki session');
  await user.click(screen.getByLabelText(/terms/i));
  await user.click(screen.getByRole('button', { name: /submit/i }));

  await waitFor(() => {
    expect(fetch).toHaveBeenCalled();
    expect(screen.getByText(/thank you for your message/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toHaveValue('');
  });
});
```

### 2. Validation errors

✓ Client validation catches errors early
✓ Server validation errors displayed
✓ Field-specific error messages shown
✓ Form submission prevented

**Test**:

```typescript
test('displays validation errors from server', async () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: false,
    status: 400,
    json: async () => ({
      error: 'Validation failed',
      errors: { email: 'Invalid email format' },
    }),
  });

  render(<ContactPage />);

  await fillFormWithValidData();
  await user.click(screen.getByRole('button', { name: /submit/i }));

  await waitFor(() => {
    expect(screen.getByText(/validation failed/i)).toBeInTheDocument();
  });
});
```

### 3. Rate limiting

✓ Client rate limit (3/hour) enforced
✓ Server rate limit response handled
✓ Retry-after messaging displayed
✓ Submit button disabled when limit reached

**Test**:

```typescript
test('handles server-side rate limiting', async () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: false,
    status: 429,
    json: async () => ({
      error: 'Rate limit exceeded',
      retryAfter: 3600,
    }),
  });

  render(<ContactPage />);

  await fillFormWithValidData();
  await user.click(screen.getByRole('button', { name: /submit/i }));

  await waitFor(() => {
    expect(screen.getByText(/rate limit exceeded/i)).toBeInTheDocument();
    expect(screen.getByText(/60 minutes/i)).toBeInTheDocument();
  });
});
```

### 4. API errors

✓ Resend API errors caught
✓ Network failures handled
✓ Timeout scenarios managed
✓ User-friendly error messages
✓ Error recovery possible

**Test**:

```typescript
test('handles API errors with recovery', async () => {
  let callCount = 0;
  global.fetch = vi.fn().mockImplementation(() => {
    callCount++;
    if (callCount === 1) {
      return Promise.reject(new Error('Network error'));
    }
    return Promise.resolve({
      ok: true,
      json: async () => ({ success: true }),
    });
  });

  render(<ContactPage />);

  // First attempt fails
  await fillFormWithValidData();
  await user.click(screen.getByRole('button', { name: /submit/i }));

  await waitFor(() => {
    expect(screen.getByText(/network error/i)).toBeInTheDocument();
  });

  // Retry succeeds
  await user.click(screen.getByRole('button', { name: /submit/i }));

  await waitFor(() => {
    expect(screen.getByText(/thank you/i)).toBeInTheDocument();
  });
});
```

### 5. Loading states

✓ Button disabled during submit
✓ Loading text shown ("Submitting...")
✓ Form fields disabled during submit
✓ Loading state cleared on completion

**Test**:

```typescript
test('displays loading state during submission', async () => {
  global.fetch = vi.fn().mockImplementation(
    () => new Promise(resolve => setTimeout(() => resolve({
      ok: true,
      json: async () => ({ success: true }),
    }), 100))
  );

  render(<ContactPage />);

  await fillFormWithValidData();
  const submitButton = screen.getByRole('button', { name: /submit/i });
  await user.click(submitButton);

  // Check loading state
  expect(submitButton).toBeDisabled();
  expect(submitButton).toHaveTextContent(/submitting/i);

  // Wait for completion
  await waitFor(() => {
    expect(submitButton).not.toBeDisabled();
    expect(submitButton).toHaveTextContent(/submit/i);
  });
});
```

### 6. Error feedback

✓ Generic error messages (no sensitive info)
✓ User-friendly language
✓ Actionable guidance
✓ No stack traces or technical details exposed

**Test**:

```typescript
test('displays user-friendly error messages', async () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: false,
    status: 500,
    json: async () => ({ error: 'Database connection failed' }),
  });

  render(<ContactPage />);

  await fillFormWithValidData();
  await user.click(screen.getByRole('button', { name: /submit/i }));

  await waitFor(() => {
    const errorText = screen.getByText(/error occurred/i).textContent;
    expect(errorText).not.toContain('Database');
    expect(errorText).not.toContain('500');
    expect(errorText).toContain('try again');
  });
});
```

## Testing checklist

### Before implementation

- [ ] Review existing test patterns in codebase
- [ ] Design mock data for all scenarios
- [ ] Plan test file organization
- [ ] Set up test utilities and helpers

### During implementation

- [ ] Write unit tests for API client (`submitContactForm`)
- [ ] Update ContactPage component tests
- [ ] Add integration tests for email workflow
- [ ] Test all error scenarios (network, API, validation)
- [ ] Test loading and disabled states
- [ ] Test success and error feedback messages

### After implementation

- [ ] Run full test suite (`npm test -- --run`)
- [ ] Check coverage report (target: 90%+)
- [ ] Add E2E tests for critical paths
- [ ] Document manual test cases
- [ ] Fix any failing tests
- [ ] Review test quality and completeness

## Manual testing

### Pre-production checklist

**Functionality**:

- [ ] Submit with valid data → Email received in inbox
- [ ] Submit with invalid email → Validation error shown
- [ ] Submit 4 times in an hour → Rate limit message displayed
- [ ] Disconnect network → Error handled gracefully
- [ ] Server returns 500 → User-friendly error shown
- [ ] API returns validation errors → Specific errors displayed

**User Experience**:

- [ ] Loading state shows "Submitting..." text
- [ ] Success message displays confirmation
- [ ] Form resets after successful submission
- [ ] Form data retained after error
- [ ] Error messages are clear and actionable
- [ ] Rate limit message shows retry time

**Email Quality**:

- [ ] Email arrives in correct inbox
- [ ] Subject line is descriptive
- [ ] Sender name shows "The Reiki Goddess"
- [ ] Reply-to address is user's email
- [ ] Email formatting is professional
- [ ] All form data included in email

**Security**:

- [ ] API key not exposed in client
- [ ] No sensitive errors shown to users
- [ ] Rate limiting enforced
- [ ] Input sanitization working
- [ ] CORS properly configured

**Cross-browser/Device**:

- [ ] Test on Chrome, Firefox, Safari
- [ ] Test on mobile devices (iOS/Android)
- [ ] Test on tablet devices
- [ ] Test with slow network (throttling)
- [ ] Test keyboard navigation
- [ ] Test screen reader accessibility

## Coverage goals

### Target metrics

- **Unit tests**: 95%+ coverage
- **Integration tests**: All critical workflows
- **E2E tests**: Complete happy path + major error scenarios
- **Overall code coverage**: 90%+ across all packages

### Package-specific goals

| Package                 | Current  | Target | Priority Tests                    |
| ----------------------- | -------- | ------ | --------------------------------- |
| API Client (contact.ts) | 0% (new) | 95%+   | All functions, all scenarios      |
| ContactPage             | 85%      | 95%+   | Email integration, error handling |
| FigmaContactForm        | 95%      | 98%+   | Email submission workflow         |
| Email Service           | 0% (new) | 90%+   | Template rendering, API calls     |
| Backend API             | 0% (new) | 90%+   | Route handling, validation        |

### Coverage enforcement

- Set minimum threshold in vitest.config: `coverage.thresholds.lines: 90`
- Run coverage check in CI/CD pipeline
- Block PRs with coverage below threshold
- Generate coverage reports for review

## CI/CD integration

### Test execution in pipeline

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm ci
      - run: npm test -- --run --coverage
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

  integration-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:integration

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

### Coverage reporting

- **Tool**: Codecov or Coveralls
- **Reports**: Text, JSON, HTML formats
- **Visualization**: Coverage badges in README
- **Alerts**: Notify on coverage decrease

### E2E tests in staging

- Run E2E tests against staging environment
- Use real API endpoints (with test mode)
- Verify email delivery in test mode
- Smoke tests before production deployment

### Production smoke tests

- Basic form submission test (non-destructive)
- Rate limit check (verify it's active)
- API endpoint health check
- Email service connectivity check

---

## Related documents

- [Resend Integration Plan](/docs/design/resend-integration-plan.md)
- [Architecture Documentation](/docs/project/ARCHITECTURE.md)
- [Testing Strategy](/docs/testing/testing-strategy.md)
- [Security Guidelines](/docs/project/security-guidelines.md)
