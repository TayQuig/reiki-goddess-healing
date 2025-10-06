# Workflow Integration: Contact Form to Email

## Overview

This document provides a comprehensive analysis of the current contact form implementation and defines how email integration will work end-to-end using Resend.

**Current Status**: Form has complete client-side validation and security. The `onSubmit` handler (ContactPage.tsx, line 76-80) currently uses `console.log` as a placeholder.

**Integration Goal**: Replace the console.log with a production-ready API call to send emails via Resend.

---

## Current Implementation Analysis

### Form Component Architecture

**Location**: `/packages/shared-components/src/FigmaContactForm/FigmaContactForm.tsx`

**Component Props**:

```typescript
export interface FigmaContactFormProps {
  onSubmit: (data: FigmaContactFormData) => Promise<void>;
  className?: string;
}
```

**Data Structure**:

```typescript
export interface FigmaContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  agreeToTerms: boolean;
}
```

**State Management**:

- `formData` (useState) - Stores all form field values
- `errors` (useState) - Field-level and general error messages
- `isSubmitting` (useState) - Loading state during submission
- `submitSuccess` (useState) - Success state for user feedback
- `rateLimit` (useRef) - FormRateLimit instance for rate limiting
- `monitor` (useRef) - SecurityMonitor instance for incident logging
- `formRef` (useRef) - Form DOM reference for reset

**Key Functions**:

1. `validateField(name, value)` - Single field validation with security checks
2. `handleChange(e)` - Updates form data and clears errors on input
3. `handleBlur(e)` - Validates field when user leaves it
4. `validateForm()` - Validates entire form before submission
5. `handleSubmit(e)` - Main submission handler (lines 193-307)

### Security Features

The form has **enterprise-grade security** already implemented:

#### 1. SecurityValidator

**Location**: `/packages/shared-utils/src/security/SecurityValidator.ts`

**Features**:

- **SQL Injection Protection**: Detects and blocks SQL patterns (SELECT, INSERT, DROP, etc.)
- **XSS Prevention**: Blocks script tags, JavaScript protocols, event handlers
- **Email Injection Protection**: Prevents header injection attacks (bcc:, cc:, etc.)
- **Medical Liability Protection**: Blocks medical terminology to avoid liability
- **Input Sanitization**: Removes dangerous characters from all inputs
- **Length Limits**: Enforces 1000 character maximum
- **Spam Detection**: Identifies repeated characters pattern

**Validation Methods**:

- `validateContactFormField(fieldName, value)` - General field validation
- `validateEmail(email)` - Email-specific validation with disposable domain checks
- `validatePhone(phone)` - Phone validation with ITU-T standards (7-15 digits)
- `isHighRisk(formData)` - Checks if entire submission contains high-risk content

**Risk Assessment**:

```typescript
interface ValidationResult {
  isValid: boolean;
  risks: Risk[];
  sanitizedValue: string;
  riskLevel: "HIGH" | "MEDIUM" | "LOW" | "NONE";
}
```

#### 2. FormRateLimit

**Location**: `/packages/shared-utils/src/security/FormRateLimit.ts`

**Configuration**:

- **Max Submissions**: 3 per hour
- **Storage**: Browser localStorage
- **Auto-cleanup**: Removes old submissions outside time window

**Methods**:

- `checkLimit()` - Returns allowed status and remaining submissions
- `record()` - Records a successful submission
- `reset()` - Clears submission history (admin/testing)
- `getStatus()` - Returns current rate limit status

**User Feedback**:

```typescript
interface RateLimitResult {
  allowed: boolean;
  timeUntilReset?: number; // in minutes
  remainingSubmissions?: number;
  message?: string;
}
```

#### 3. SecurityMonitor

**Location**: `/packages/shared-utils/src/security/SecurityMonitor.ts`

**Purpose**: Client-side security incident logging for analysis

**Severity Levels**: LOW, MEDIUM, HIGH, CRITICAL

**Logged Incidents**:

- Rate limit exceeded
- High-risk content blocked
- Form submission success
- Form submission errors
- XSS attempts
- SQL injection attempts

**Storage**: sessionStorage (max 10 incidents)

**Optional Reporting**: Can POST to external endpoint if configured

### Submission Flow (Current)

```
1. User fills form
   ↓
2. Field-level validation on blur (lines 157-170)
   - validateField() checks security risks
   - Displays inline error if invalid
   ↓
3. User clicks Submit button
   ↓
4. handleSubmit() triggered (line 193)
   ↓
5. Clear previous success state (line 198)
   ↓
6. Rate limit check (lines 200-210)
   - checkLimit() returns allowed status
   - If blocked: Show error with time until reset
   - If allowed: Continue
   ↓
7. Form validation (lines 212-215)
   - validateForm() checks all fields
   - If invalid: Return early with errors shown
   ↓
8. High-risk content check (lines 217-235)
   - isHighRisk() scans all fields
   - If high-risk: Block submission, log incident
   ↓
9. Set loading state (line 237)
   ↓
10. Data sanitization (lines 241-258)
    - SecurityValidator sanitizes each field
    - Creates sanitizedData object
    ↓
11. Record submission in rate limiter (line 261)
    ↓
12. Call onSubmit(sanitizedData) (line 264) ⭐ INTEGRATION POINT
    ↓
13a. SUCCESS PATH (lines 267-287):
     - setSubmitSuccess(true)
     - Clear form data
     - Reset form DOM
     - Log success to SecurityMonitor
    ↓
13b. ERROR PATH (lines 288-303):
     - Log error to SecurityMonitor
     - Show general error message
     ↓
14. Clear loading state (line 303)
```

---

## Integration Points

### Primary Integration Point

**Location**: `/packages/shared-components/src/pages/ContactPage.tsx`

**Current Code** (lines 76-80):

```typescript
<FigmaContactForm
  onSubmit={async (data) => {
    console.log("Contact form submitted:", data);
    // TODO: Implement actual form submission
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }}
  className="contact-page-form"
/>
```

**Required Change**: Replace the onSubmit handler with API call to backend

### Data Flow at Integration Point

**Input** (from FigmaContactForm):

```typescript
{
  firstName: string; // Already sanitized
  lastName: string; // Already sanitized
  email: string; // Already sanitized and validated
  phone: string; // Already sanitized and validated
  message: string; // Already sanitized
  agreeToTerms: boolean; // Always true at this point
}
```

**Expected Output**:

- Success: Promise resolves (no return value needed)
- Error: Promise rejects with error message

**Security Guarantees at Integration Point**:

1. All fields have passed validation
2. All fields have been sanitized
3. No high-risk content present
4. Rate limit has been checked
5. Email format is valid
6. Phone format is valid (7-15 digits, ITU-T standard)
7. No SQL injection patterns
8. No XSS patterns
9. No email injection patterns
10. No medical terminology

---

## Proposed Workflow

### End-to-End Flow with Resend Integration

```
USER INTERACTION
├── 1. User fills form fields
│   └── Real-time field validation on blur
├── 2. User clicks "Submit" button
│   └── Button shows "Submitting..." state
│
CLIENT-SIDE VALIDATION (FigmaContactForm.tsx)
├── 3. Rate limit check
│   ├── Check: 3 submissions/hour max
│   ├── If blocked: Show error "Try again in X minutes"
│   └── If allowed: Continue
├── 4. Form validation
│   ├── Check: All required fields filled
│   ├── Check: Email format valid
│   ├── Check: Phone format valid
│   └── If invalid: Show field errors, stop
├── 5. High-risk content scan
│   ├── Check: SQL injection patterns
│   ├── Check: XSS patterns
│   ├── Check: Medical terminology
│   └── If high-risk: Block, log incident
├── 6. Data sanitization
│   ├── Remove dangerous characters
│   ├── Trim whitespace
│   └── Limit length to 1000 chars
│
API CALL (ContactPage.tsx onSubmit)
├── 7. Call submitContactForm(sanitizedData)
│   ├── POST to /api/contact
│   ├── Headers: Content-Type: application/json
│   ├── Body: Sanitized form data
│   └── Timeout: 30 seconds
│
BACKEND PROCESSING (To be implemented)
├── 8. API receives request
│   ├── Validate request structure
│   ├── Server-side rate limiting (backup)
│   └── Server-side validation (backup)
├── 9. Call Resend API
│   ├── Endpoint: POST https://api.resend.com/emails
│   ├── Headers: Authorization: Bearer <api_key>
│   ├── Body: Email template with form data
│   └── Timeout: 10 seconds
├── 10. Resend processes email
│   ├── Validates sender domain
│   ├── Sends email to recipient
│   └── Returns success/error response
│
BACKEND RESPONSE
├── 11a. SUCCESS PATH
│   ├── Return 200 OK
│   └── Return { success: true, messageId: "..." }
├── 11b. ERROR PATH
│   ├── Return appropriate status code
│   │   ├── 400: Invalid request
│   │   ├── 429: Rate limit exceeded
│   │   ├── 500: Server error
│   │   └── 503: Service unavailable
│   └── Return { success: false, error: "message" }
│
CLIENT-SIDE RESPONSE HANDLING (FigmaContactForm.tsx)
├── 12a. SUCCESS HANDLING
│   ├── Show success message
│   │   └── "Thank you! We'll respond within 24-48 hours"
│   ├── Clear form fields
│   ├── Reset form state
│   ├── Log success to SecurityMonitor
│   └── Record submission in rate limiter
├── 12b. ERROR HANDLING
│   ├── Show user-friendly error
│   │   ├── Network error: "Connection failed. Please check your internet"
│   │   ├── Rate limit: "Too many submissions. Try again in X minutes"
│   │   ├── Validation error: "Please check your information"
│   │   └── Server error: "An error occurred. Please try again later"
│   ├── Log error to SecurityMonitor
│   └── Keep form data (don't clear on error)
│
USER FEEDBACK
└── 13. User sees result
    ├── Success: Green banner with confirmation
    └── Error: Red banner with helpful message
```

### State Management Throughout Flow

| Step               | isSubmitting | submitSuccess | errors               | formData   |
| ------------------ | ------------ | ------------- | -------------------- | ---------- |
| Initial            | false        | false         | {}                   | User input |
| Submit clicked     | true         | false         | {}                   | User input |
| Validation fails   | false        | false         | { field: "error" }   | User input |
| API call in flight | true         | false         | {}                   | Sanitized  |
| API success        | false        | true          | {}                   | Cleared    |
| API error          | false        | false         | { general: "error" } | Preserved  |

### Error Branches

```
VALIDATION ERRORS (Client-side, before API call)
├── Empty required field
├── Invalid email format
├── Invalid phone format
├── Missing terms agreement
├── High-risk content detected
└── Rate limit exceeded

API CALL ERRORS (Network/Transport)
├── Network timeout (30s)
├── Network disconnected
├── DNS resolution failure
└── CORS issues

SERVER ERRORS (Backend)
├── 400 Bad Request
│   └── Invalid data structure
├── 401 Unauthorized
│   └── Missing/invalid API key
├── 429 Too Many Requests
│   └── Server-side rate limit
├── 500 Internal Server Error
│   └── Unexpected backend error
└── 503 Service Unavailable
    └── Backend or Resend down

RESEND ERRORS (Email service)
├── Invalid sender domain
├── Rate limit exceeded
├── Bounced email address
├── API key invalid/expired
└── Service temporarily unavailable
```

---

## Component Modifications

### 1. ContactPage.tsx

**File**: `/packages/shared-components/src/pages/ContactPage.tsx`

**Current Implementation** (lines 75-82):

```typescript
<FigmaContactForm
  onSubmit={async (data) => {
    console.log("Contact form submitted:", data);
    // TODO: Implement actual form submission
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }}
  className="contact-page-form"
/>
```

**Proposed Implementation**:

```typescript
import { submitContactForm } from "@reiki-goddess/shared-utils";

<FigmaContactForm
  onSubmit={async (data) => {
    try {
      const response = await submitContactForm(data);
      // Success - FigmaContactForm handles the success state
      // No action needed here, form will show success message
    } catch (error) {
      // Error - FigmaContactForm will catch and display
      // Re-throw to let form component handle error display
      throw error;
    }
  }}
  className="contact-page-form"
/>
```

**Rationale**:

- Keep the onSubmit handler thin
- FigmaContactForm already has all success/error handling
- Just need to call API and let errors propagate

### 2. New API Client Function

**Location**: `/packages/shared-utils/src/api/contact.ts` (new file)

**Implementation**:

```typescript
import type { FigmaContactFormData } from "@reiki-goddess/shared-components";

export interface ContactFormResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface ContactFormError extends Error {
  status?: number;
  code?: string;
}

/**
 * Submits contact form data to the backend API
 * @throws {ContactFormError} If submission fails
 */
export async function submitContactForm(
  data: FigmaContactFormData
): Promise<ContactFormResponse> {
  const API_ENDPOINT =
    import.meta.env.VITE_CONTACT_API_ENDPOINT || "/api/contact";
  const TIMEOUT_MS = 30000; // 30 seconds

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        message: data.message,
        agreeToTerms: data.agreeToTerms,
        // Include timestamp for backend logging
        timestamp: new Date().toISOString(),
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Parse response
    const result = await response.json();

    // Handle non-OK responses
    if (!response.ok) {
      const error = new Error(
        result.error || getErrorMessageForStatus(response.status)
      ) as ContactFormError;
      error.status = response.status;
      error.code = result.code;
      throw error;
    }

    return result;
  } catch (error) {
    clearTimeout(timeoutId);

    // Handle different error types
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        const timeoutError = new Error(
          "Request timed out. Please check your internet connection and try again."
        ) as ContactFormError;
        timeoutError.code = "TIMEOUT";
        throw timeoutError;
      }

      if (error.message.includes("fetch")) {
        const networkError = new Error(
          "Network error. Please check your internet connection."
        ) as ContactFormError;
        networkError.code = "NETWORK_ERROR";
        throw networkError;
      }
    }

    throw error;
  }
}

/**
 * Maps HTTP status codes to user-friendly error messages
 */
function getErrorMessageForStatus(status: number): string {
  switch (status) {
    case 400:
      return "Invalid form data. Please check your information and try again.";
    case 429:
      return "Too many submissions. Please try again later.";
    case 500:
      return "Server error. Please try again later.";
    case 503:
      return "Service temporarily unavailable. Please try again later.";
    default:
      return "An error occurred while submitting your message. Please try again later.";
  }
}
```

**Features**:

- 30-second timeout with AbortController
- Type-safe with TypeScript
- User-friendly error messages
- Status code handling
- Network error detection
- Environment variable for API endpoint

### 3. Export from shared-utils

**File**: `/packages/shared-utils/src/index.ts`

**Add Export**:

```typescript
// API clients
export { submitContactForm } from "./api/contact";
export type { ContactFormResponse, ContactFormError } from "./api/contact";
```

### 4. Environment Variables

**File**: `/apps/main/.env.local` (new file, gitignored)

```bash
# Contact Form API Endpoint
VITE_CONTACT_API_ENDPOINT=https://your-backend.com/api/contact

# For local development
# VITE_CONTACT_API_ENDPOINT=http://localhost:3000/api/contact
```

**File**: `/apps/main/.env.example` (committed to git)

```bash
# Contact Form API Endpoint
VITE_CONTACT_API_ENDPOINT=https://your-backend.com/api/contact
```

---

## Error Handling Strategy

### Error Types and User Messages

| Error Type              | Detection         | User Message                                                  | Action                             |
| ----------------------- | ----------------- | ------------------------------------------------------------- | ---------------------------------- |
| **Empty field**         | Client validation | "This field is required"                                      | Show inline error, keep form data  |
| **Invalid email**       | Client validation | "Please enter a valid email address"                          | Show inline error, keep form data  |
| **Invalid phone**       | Client validation | "Phone number is too short/long"                              | Show inline error, keep form data  |
| **High-risk content**   | SecurityValidator | "Your submission contains content that cannot be processed"   | Show general error, keep form data |
| **Rate limit (client)** | FormRateLimit     | "You've reached the submission limit. Try again in X minutes" | Show general error, keep form data |
| **Network timeout**     | Fetch API         | "Request timed out. Please check your internet connection"    | Show general error, keep form data |
| **Network offline**     | Fetch API         | "Network error. Please check your internet connection"        | Show general error, keep form data |
| **400 Bad Request**     | Server response   | "Invalid form data. Please check your information"            | Show general error, keep form data |
| **429 Rate Limit**      | Server response   | "Too many submissions. Please try again later"                | Show general error, keep form data |
| **500 Server Error**    | Server response   | "Server error. Please try again later"                        | Show general error, keep form data |
| **503 Unavailable**     | Server response   | "Service temporarily unavailable. Please try again later"     | Show general error, keep form data |
| **Unknown error**       | Catch-all         | "An error occurred. Please try again later"                   | Show general error, keep form data |

### Error Display Locations

**Inline Errors** (Field-level):

```tsx
{
  errors.firstName && (
    <p id="firstName-error" className="mt-2 text-sm text-red-600">
      {errors.firstName}
    </p>
  );
}
```

**General Errors** (Form-level):

```tsx
{
  errors.general && (
    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
      <p className="text-red-800 text-sm">{errors.general}</p>
    </div>
  );
}
```

### Error Recovery Strategies

1. **Validation Errors**: User can immediately fix and resubmit
2. **Network Errors**: User can retry when connection restored
3. **Rate Limit Errors**: User must wait until reset time
4. **Server Errors**: User can retry, or contact alternative methods
5. **Unknown Errors**: User can retry or contact support

---

## User Feedback Mechanisms

### Loading State

**Visual Indicator**:

```tsx
<button
  type="submit"
  disabled={isSubmitting}
  className={`... ${
    isSubmitting
      ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
      : "bg-transparent border-[#0205B7] text-[#0205B7] hover:bg-[#0205B7] hover:text-white"
  }`}
>
  {isSubmitting ? "Submitting..." : "Submit"}
</button>
```

**Timeline**:

- Button clicked → "Submitting..." appears immediately
- All interactions disabled during submission
- Typical duration: 1-3 seconds
- Maximum duration: 30 seconds (timeout)

### Success State

**Visual Indicator** (lines 317-326):

```tsx
{
  submitSuccess && (
    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
      <p className="text-green-800 font-medium">Thank you for your message!</p>
      <p className="text-green-700 text-sm mt-1">
        We'll get back to you within 24-48 hours.
      </p>
    </div>
  );
}
```

**Actions on Success**:

1. Show green success banner
2. Clear all form fields
3. Reset form state
4. Form remains on page (user can submit another if needed)
5. Success message persists until page refresh or new submission

### Error State

**Visual Indicator** (lines 329-333):

```tsx
{
  errors.general && (
    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
      <p className="text-red-800 text-sm">{errors.general}</p>
    </div>
  );
}
```

**Actions on Error**:

1. Show red error banner
2. Keep form data (allow user to fix and retry)
3. Enable submit button for retry
4. Log error to SecurityMonitor for debugging

### Rate Limit Feedback

**Static Info** (lines 559-561):

```tsx
<p className="mt-8 text-xs text-gray-500 text-center">
  For security, form submissions are limited to 3 per hour.
</p>
```

**Dynamic Error** (when limit reached):

```
"You've reached the submission limit. Please try again in 45 minutes."
```

---

## Testing Requirements

### Unit Tests

**File**: `/packages/shared-utils/src/api/contact.test.ts`

Test cases:

- ✅ Successful submission returns messageId
- ✅ Network timeout throws TIMEOUT error
- ✅ Network offline throws NETWORK_ERROR
- ✅ 400 response throws with appropriate message
- ✅ 429 response throws with rate limit message
- ✅ 500 response throws with server error message
- ✅ Malformed JSON response throws parse error
- ✅ API endpoint uses environment variable
- ✅ Request includes all form fields
- ✅ Request includes timestamp

### Integration Tests

**File**: `/packages/shared-components/src/pages/ContactPage.test.tsx`

Test cases:

- ✅ Form submission calls submitContactForm
- ✅ Success shows success message
- ✅ Success clears form fields
- ✅ Error shows error message
- ✅ Error preserves form data
- ✅ Loading state disables submit button
- ✅ Rate limit error shows appropriate message

### E2E Tests

**File**: `/e2e/tests/contact-form.spec.ts`

Test scenarios:

- ✅ Happy path: Fill form → Submit → See success
- ✅ Validation: Submit empty → See errors → Fill → Submit → Success
- ✅ Network error: Disconnect → Submit → See error → Reconnect → Submit → Success
- ✅ Rate limit: Submit 3 times → 4th blocked → Wait → Submit → Success
- ✅ Server error: Mock 500 → Submit → See error → Retry → Success

### Manual Testing Checklist

- [ ] Submit valid form data → Email received
- [ ] Submit with invalid email → Validation error shown
- [ ] Submit with invalid phone → Validation error shown
- [ ] Submit without terms agreement → Error shown
- [ ] Submit 4 times in 1 hour → 4th submission blocked
- [ ] Disconnect internet → Submit → Network error shown
- [ ] Kill backend → Submit → Server error shown
- [ ] Submit with XSS attempt → Blocked by validation
- [ ] Submit with SQL injection → Blocked by validation
- [ ] Submit with medical terms → Warning or blocked

---

## Implementation Checklist

### Phase 1: API Client (Frontend Only)

- [ ] Create `/packages/shared-utils/src/api/contact.ts`
- [ ] Implement `submitContactForm()` function
- [ ] Add TypeScript interfaces (ContactFormResponse, ContactFormError)
- [ ] Add error handling (timeout, network, status codes)
- [ ] Export from `/packages/shared-utils/src/index.ts`
- [ ] Write unit tests for API client
- [ ] Add environment variable support

### Phase 2: Integration (Frontend Only)

- [ ] Update ContactPage.tsx onSubmit handler
- [ ] Import submitContactForm from shared-utils
- [ ] Test error propagation to FigmaContactForm
- [ ] Create `.env.example` file
- [ ] Update `.gitignore` to exclude `.env.local`
- [ ] Write integration tests

### Phase 3: Backend Implementation (Future)

- [ ] Create backend API endpoint `/api/contact`
- [ ] Add server-side validation
- [ ] Add server-side rate limiting
- [ ] Integrate Resend API
- [ ] Create email template
- [ ] Add logging and monitoring
- [ ] Deploy backend
- [ ] Update VITE_CONTACT_API_ENDPOINT

### Phase 4: Testing & Launch

- [ ] Run all unit tests
- [ ] Run all integration tests
- [ ] Run E2E tests
- [ ] Perform manual testing
- [ ] Test rate limiting (3/hour)
- [ ] Test error scenarios
- [ ] Monitor first 100 submissions
- [ ] Collect user feedback

---

## Backend Requirements (Reference)

### API Endpoint Specification

**Endpoint**: `POST /api/contact`

**Request Headers**:

```
Content-Type: application/json
```

**Request Body**:

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+12345678901",
  "message": "I would like to book a session...",
  "agreeToTerms": true,
  "timestamp": "2025-01-15T10:30:00Z"
}
```

**Success Response** (200 OK):

```json
{
  "success": true,
  "messageId": "abc123-def456-ghi789"
}
```

**Error Response** (4xx/5xx):

```json
{
  "success": false,
  "error": "Rate limit exceeded. Please try again later.",
  "code": "RATE_LIMIT_EXCEEDED"
}
```

### Server-Side Validation (Backup)

Even though client validates, server MUST validate:

- All required fields present
- Email format valid
- Phone format valid (7-15 digits)
- Message length < 1000 characters
- agreeToTerms is true

### Server-Side Rate Limiting

- IP-based rate limiting: 3 requests per hour per IP
- Email-based rate limiting: 3 requests per hour per email
- Return 429 status code when exceeded

### Resend Integration

**API Call**:

```typescript
const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: "contact@reikigodesshealing.com",
  to: "thereikigoddesshealing@gmail.com",
  replyTo: formData.email,
  subject: `New Contact Form Submission from ${formData.firstName} ${formData.lastName}`,
  html: renderEmailTemplate(formData),
});
```

**Email Template** (suggested):

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }
      .header {
        background: #0205b7;
        color: white;
        padding: 20px;
      }
      .content {
        padding: 20px;
        background: #f9f9f9;
      }
      .field {
        margin-bottom: 15px;
      }
      .label {
        font-weight: bold;
        color: #333;
      }
      .value {
        color: #666;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>New Contact Form Submission</h1>
      </div>
      <div class="content">
        <div class="field">
          <div class="label">Name:</div>
          <div class="value">{{firstName}} {{lastName}}</div>
        </div>
        <div class="field">
          <div class="label">Email:</div>
          <div class="value">{{email}}</div>
        </div>
        <div class="field">
          <div class="label">Phone:</div>
          <div class="value">{{phone}}</div>
        </div>
        <div class="field">
          <div class="label">Message:</div>
          <div class="value">{{message}}</div>
        </div>
        <div class="field">
          <div class="label">Submitted:</div>
          <div class="value">{{timestamp}}</div>
        </div>
      </div>
    </div>
  </body>
</html>
```

### Logging & Monitoring

Backend should log:

- All successful submissions (email, timestamp)
- All failed submissions (error type, timestamp)
- Rate limit violations (IP, timestamp)
- Resend API errors (error details)

---

## Security Considerations

### Client-Side Security (Already Implemented)

✅ **Input Validation**: All fields validated before submission
✅ **Input Sanitization**: Dangerous characters removed
✅ **XSS Prevention**: Script tags and event handlers blocked
✅ **SQL Injection Prevention**: SQL patterns blocked
✅ **Email Injection Prevention**: Header injection blocked
✅ **Rate Limiting**: 3 submissions per hour (client-side)
✅ **Spam Detection**: Repeated characters detected
✅ **Medical Liability**: Medical terms blocked
✅ **Incident Logging**: SecurityMonitor tracks all issues

### Server-Side Security (To Implement)

⚠️ **Never Trust Client**: Re-validate everything on server
⚠️ **Rate Limiting**: IP-based and email-based limits
⚠️ **API Key Security**: Keep Resend API key in environment variables
⚠️ **CORS**: Restrict to allowed origins only
⚠️ **Input Sanitization**: Re-sanitize on server
⚠️ **Logging**: Log all submissions for audit trail
⚠️ **Email Validation**: Verify email deliverability
⚠️ **DDoS Protection**: Use rate limiting and CAPTCHA if needed

### Data Privacy

- **No PII Storage**: Don't store form data in database (unless required)
- **Email Only**: Send directly to recipient via Resend
- **HTTPS Only**: All communication over secure connection
- **No Tracking**: Don't track users beyond security needs
- **Compliance**: Ensure GDPR/CCPA compliance if applicable

---

## Performance Considerations

### Frontend Performance

- **Form Validation**: Runs on blur, not on every keystroke (already implemented)
- **API Timeout**: 30 seconds maximum to prevent hanging
- **Error Recovery**: Fast failure with immediate user feedback
- **Bundle Size**: API client is small (~2KB minified)

### Backend Performance

- **Response Time**: Should be < 3 seconds for 95th percentile
- **Resend Timeout**: 10 seconds maximum for email API call
- **Async Processing**: Don't wait for email delivery confirmation
- **Caching**: No caching needed (form submissions are unique)

### Expected Load

- **Traffic**: Low volume (wellness business)
- **Rate Limit**: 3 submissions/hour/user = max ~72 per day per user
- **Realistic**: Expect 5-20 submissions per day
- **Scaling**: Current setup can handle 1000+ submissions/day

---

## Monitoring & Analytics

### Success Metrics

- **Submission Success Rate**: Target > 95%
- **Response Time**: Target < 3 seconds
- **Email Delivery Rate**: Target > 99% (Resend SLA)
- **Error Rate**: Target < 5%

### Tracking Points

1. **Client-Side** (SecurityMonitor):
   - Submission attempts
   - Validation failures
   - High-risk blocks
   - Rate limit hits
   - API errors

2. **Server-Side** (Backend logs):
   - Successful submissions
   - Failed submissions
   - Rate limit violations
   - Resend API errors
   - Response times

### Alerting

Set up alerts for:

- Error rate > 10% over 1 hour
- Response time > 5 seconds for 3 consecutive requests
- Resend API errors
- Rate limit violations spike (potential attack)

---

## Rollback Plan

If integration causes issues:

1. **Immediate Rollback**:

   ```typescript
   // Revert ContactPage.tsx to console.log
   onSubmit={async (data) => {
     console.log("Contact form submitted:", data);
     await new Promise((resolve) => setTimeout(resolve, 2000));
   }}
   ```

2. **Alternative Contact Methods**:
   - Email link: `mailto:thereikigoddesshealing@gmail.com`
   - Phone link: `tel:03000000000` (update with real number)
   - Contact info cards already on page

3. **User Communication**:
   - Add banner: "Contact form temporarily unavailable. Please email us directly."
   - Disable form but keep contact info visible

---

## Future Enhancements

### Phase 2 Features

- [ ] Email confirmation to user (auto-reply)
- [ ] CAPTCHA integration (if spam becomes issue)
- [ ] Form analytics (conversion tracking)
- [ ] A/B testing for form copy
- [ ] Multi-language support
- [ ] Accessibility improvements (WCAG AAA)

### Phase 3 Features

- [ ] CRM integration (store contacts)
- [ ] Auto-response with service information
- [ ] Appointment scheduling integration
- [ ] File upload for medical documents
- [ ] SMS notifications to business owner
- [ ] Chat widget integration

---

## Related Documentation

- **Security Implementation**: `/docs/testing/components/SecurityValidator.md`
- **Rate Limiting**: `/docs/testing/components/FormRateLimit.md`
- **Security Monitoring**: `/docs/testing/components/SecurityMonitor.md`
- **Resend Integration Plan**: `/docs/design/resend-integration-plan.md`
- **Contact Page Design**: `/figma-screenshots/Contact/`
- **Google Maps Integration**: `/docs/design/contact-google-maps-location/`

---

## Conclusion

The contact form has **enterprise-grade security** already implemented on the client-side. The integration point is clean and well-defined. The primary task is to:

1. Create the API client function (`submitContactForm`)
2. Update the ContactPage onSubmit handler
3. Implement the backend API endpoint
4. Test end-to-end

The form is **production-ready** from a security and UX perspective. The only missing piece is the actual email delivery integration, which is straightforward using Resend.

**Estimated Implementation Time**:

- Frontend (Phases 1-2): 4-6 hours
- Backend (Phase 3): 6-8 hours
- Testing (Phase 4): 4-6 hours
- **Total**: 14-20 hours

**Risk Level**: Low (well-isolated, can easily rollback)

**User Impact**: High (enables contact form functionality)
