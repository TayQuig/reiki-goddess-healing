# API Architecture: Resend Email Integration

## Executive Summary

This document outlines the technical architecture for integrating Resend email service with The Reiki Goddess Healing contact form. The integration will enable automated email delivery when users submit the contact form, providing real-time notifications to the business owner.

The recommended approach uses **Vercel Serverless Functions** as the backend layer, leveraging the existing Vite deployment infrastructure. The solution maintains the robust security features already implemented in FigmaContactForm (validation, rate limiting, sanitization) while adding reliable email delivery through Resend's API.

**Key Benefits:**

- **Zero Infrastructure Management**: Serverless architecture eliminates server maintenance
- **Cost-Effective**: Free tier supports 3,000 emails/month (current need: ~600/month)
- **Type-Safe**: Full TypeScript support across the entire stack
- **Secure**: API keys isolated in environment variables, never exposed to client
- **Maintainable**: React Email templates provide component-based email design

## Resend API Overview

### Authentication

Resend uses API key authentication via the `Authorization` header:

```typescript
Authorization: Bearer re_xxxxxxxxx
```

**Best Practices:**

- Store API key in environment variable: `RESEND_API_KEY`
- Use restricted "Sending Access" keys for production (not "Full Access")
- Never commit API keys to version control
- Rotate keys periodically
- Use separate keys for development/staging/production

**Key Types:**

- **Full Access**: Can manage domains, API keys, webhooks, and send emails
- **Sending Access**: Can only send emails (recommended for production)

### Email Sending Endpoint

**Endpoint:** `POST https://api.resend.com/emails`

**Request Schema:**

```typescript
interface ResendEmailRequest {
  from: string; // Required: "Name <email@domain.com>"
  to: string | string[]; // Required: Max 50 recipients
  subject: string; // Required
  html?: string; // HTML content
  text?: string; // Plain text (auto-generated if omitted)
  react?: React.ReactNode; // React Email component (Node.js SDK only)
  replyTo?: string | string[]; // Reply-to addresses
  cc?: string | string[]; // CC recipients
  bcc?: string | string[]; // BCC recipients
  attachments?: Attachment[]; // Max 40MB total after Base64 encoding
  headers?: Record<string, string>; // Custom headers
  tags?: Tag[]; // Custom metadata for filtering
}

interface Attachment {
  filename: string;
  content?: Buffer | string; // Base64 string or Buffer
  path?: string; // URL to remote file
  contentType?: string; // MIME type
}

interface Tag {
  name: string; // Max 256 chars, ASCII only
  value: string; // Max 256 chars, ASCII only
}
```

**Response Schema:**

```typescript
// Success (200)
interface ResendEmailResponse {
  id: string; // Email ID for tracking (e.g., "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794")
}

// Error (4xx/5xx)
interface ResendError {
  statusCode: number;
  name: string; // Error type (e.g., "validation_error")
  message: string; // Human-readable error description
}
```

**Example Request:**

```typescript
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const { data, error } = await resend.emails.send({
  from: "Reiki Goddess Healing <contact@reikigoddesshealingllc.com>",
  to: ["owner@reikigoddesshealingllc.com"],
  subject: "New Contact Form Submission",
  react: ContactEmailTemplate({ firstName: "John", email: "john@example.com" }),
  replyTo: "john@example.com",
  tags: [{ name: "category", value: "contact-form" }],
});
```

### Rate Limits

**API Rate Limits:**

- **Default:** 2 requests per second
- **Can be increased:** Contact support for higher limits
- **Headers provided in every response:**
  - `ratelimit-limit`: Maximum requests per window
  - `ratelimit-remaining`: Remaining requests in current window
  - `ratelimit-reset`: Seconds until limit reset
  - `retry-after`: Seconds to wait before retry (on 429)

**Email Quotas by Plan:**

| Plan  | Monthly Emails | Daily Limit | Cost |
| ----- | -------------- | ----------- | ---- |
| Free  | 3,000          | 100         | $0   |
| Pro   | 50,000         | None        | $20  |
| Scale | 100,000+       | None        | $90+ |

**Handling Rate Limits:**

- Monitor `ratelimit-remaining` header
- Implement exponential backoff on 429 responses
- Queue submissions if approaching limits
- Alert on quota thresholds (80%, 90%, 100%)

### Error Codes

**Common Errors:**

| Status | Error Type               | Description                                    | Action                                      |
| ------ | ------------------------ | ---------------------------------------------- | ------------------------------------------- |
| 400    | `validation_error`       | Invalid field(s) in request                    | Check error message for field details       |
| 401    | `missing_api_key`        | No Authorization header                        | Add `Authorization: Bearer {key}`           |
| 403    | `invalid_api_key`        | API key is invalid                             | Regenerate API key                          |
| 403    | `validation_error`       | Can only send to own email (unverified domain) | Verify domain in Resend dashboard           |
| 422    | `invalid_from_address`   | From field format invalid                      | Use "Name <email@domain.com>" format        |
| 422    | `missing_required_field` | Missing required field                         | Add from/to/subject fields                  |
| 429    | `rate_limit_exceeded`    | Too many requests                              | Implement backoff, check rate limit headers |
| 429    | `daily_quota_exceeded`   | Daily email quota exceeded                     | Upgrade plan or wait 24 hours               |
| 500    | `application_error`      | Internal server error                          | Retry with exponential backoff              |

**Error Handling Pattern:**

```typescript
try {
  const { data, error } = await resend.emails.send(payload);

  if (error) {
    // Resend SDK returns error in response
    logger.error("Resend API error", {
      type: error.name,
      message: error.message,
      statusCode: error.statusCode,
    });

    // Determine user-facing message based on error type
    if (error.name === "rate_limit_exceeded") {
      throw new Error(
        "Service temporarily busy. Please try again in a few moments."
      );
    } else if (error.name === "daily_quota_exceeded") {
      throw new Error(
        "Email service temporarily unavailable. Please try again tomorrow."
      );
    } else {
      throw new Error("Failed to send email. Please try again later.");
    }
  }

  return data;
} catch (err) {
  // Network errors, timeouts, etc.
  logger.error("Email send failed", { error: err });
  throw new Error(
    "Failed to send email. Please check your connection and try again."
  );
}
```

## Backend Architecture

### Recommended Approach: Vercel Serverless Functions

**Rationale:**

1. **Seamless Integration**: Vite apps deploy to Vercel with zero configuration
2. **Generous Free Tier**: 100GB bandwidth, 100,000 invocations/month
3. **Built-in Environment Variables**: Secure API key management
4. **TypeScript Support**: Native TypeScript compilation
5. **Edge Network**: Global CDN for low-latency API responses
6. **Zero Maintenance**: No servers to manage or scale

**Alternative Considerations:**

| Platform             | Pros                                                | Cons                                  | Verdict                         |
| -------------------- | --------------------------------------------------- | ------------------------------------- | ------------------------------- |
| **Vercel Functions** | Easy Vite integration, great DX, generous free tier | Vendor lock-in                        | ✅ **Recommended**              |
| Netlify Functions    | Similar to Vercel, good free tier                   | Less TypeScript support               | ⚠️ Alternative                  |
| AWS Lambda           | Maximum flexibility, cheapest at scale              | Complex setup, steeper learning curve | ❌ Overkill                     |
| Cloudflare Workers   | Fastest edge execution                              | Different runtime (no Node.js)        | ❌ Incompatible with Resend SDK |

### API Endpoint Design

**Endpoint:** `POST /api/contact`

**Project Structure:**

```
apps/main/
├── api/
│   └── contact.ts          # Vercel serverless function
├── src/
│   └── pages/
│       └── Contact.tsx     # Contact page with form
└── package.json

.env.local                   # Local development
.env.production              # Production (Vercel dashboard)
```

**API Route Implementation:**

```typescript
// apps/main/api/contact.ts
import { Resend } from "resend";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ContactEmailTemplate } from "../emails/ContactEmailTemplate";

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Type definitions
interface ContactRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  agreeToTerms: boolean;
}

interface ContactResponse {
  success: boolean;
  emailId?: string;
  error?: string;
}

// CORS configuration
const ALLOWED_ORIGINS = [
  "https://reikigoddesshealingllc.com",
  "https://www.reikigoddesshealingllc.com",
  process.env.NODE_ENV === "development" ? "http://localhost:5173" : "",
].filter(Boolean);

export default async function handler(
  req: VercelRequest,
  res: VercelResponse<ContactResponse>
) {
  // CORS headers
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  try {
    // Parse and validate request body
    const body = req.body as ContactRequest;

    // Basic validation (frontend already validated, this is defense in depth)
    if (!body.firstName || !body.email || !body.message || !body.agreeToTerms) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return res.status(400).json({
        success: false,
        error: "Invalid email address",
      });
    }

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: "Reiki Goddess Healing <contact@reikigoddesshealingllc.com>",
      to: [process.env.CONTACT_EMAIL || "owner@reikigoddesshealingllc.com"],
      replyTo: body.email,
      subject: `New Contact Form Submission from ${body.firstName} ${body.lastName}`,
      react: ContactEmailTemplate({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        message: body.message,
      }),
      tags: [
        { name: "source", value: "contact-form" },
        { name: "environment", value: process.env.NODE_ENV || "production" },
      ],
    });

    if (error) {
      console.error("Resend API error:", error);

      // Return appropriate error to client
      if (error.name === "rate_limit_exceeded") {
        return res.status(429).json({
          success: false,
          error: "Service temporarily busy. Please try again in a moment.",
        });
      }

      return res.status(500).json({
        success: false,
        error: "Failed to send email. Please try again later.",
      });
    }

    // Success response
    return res.status(200).json({
      success: true,
      emailId: data.id,
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return res.status(500).json({
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    });
  }
}
```

**Environment Variables:**

```bash
# .env.local (development)
RESEND_API_KEY=re_xxxxxxxxx
CONTACT_EMAIL=your-email@example.com
NODE_ENV=development

# .env.production (Vercel dashboard)
RESEND_API_KEY=re_xxxxxxxxx  # Production API key
CONTACT_EMAIL=owner@reikigoddesshealingllc.com
NODE_ENV=production
```

### Data Flow

```
┌─────────────────────┐
│ User Fills Form     │
│ (Contact Page)      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────────────────────────┐
│ FigmaContactForm Component                       │
│ • Client-side validation (SecurityValidator)    │
│ • Rate limiting (3 submissions/hour)             │
│ • Input sanitization (XSS/SQL injection)         │
│ • High-risk content detection                    │
└──────────┬──────────────────────────────────────┘
           │
           │ Sanitized Data
           ▼
┌─────────────────────────────────────────────────┐
│ POST /api/contact                                │
│ (Vercel Serverless Function)                     │
│ • CORS validation                                │
│ • Defense-in-depth validation                    │
│ • Business logic                                 │
└──────────┬──────────────────────────────────────┘
           │
           │ Resend Payload
           ▼
┌─────────────────────────────────────────────────┐
│ Resend API                                       │
│ • POST /emails                                   │
│ • Authentication check                           │
│ • Domain verification                            │
│ • Rate limit enforcement                         │
└──────────┬──────────────────────────────────────┘
           │
           │ SMTP Delivery
           ▼
┌─────────────────────────────────────────────────┐
│ Email Delivery                                   │
│ • owner@reikigoddesshealingllc.com              │
│ • Reply-To: user's email                         │
│ • Brand-consistent template                      │
└──────────┬──────────────────────────────────────┘
           │
           │ Webhook (optional)
           ▼
┌─────────────────────────────────────────────────┐
│ Confirmation & Logging                           │
│ • Success message to user                        │
│ • Email ID logged for tracking                   │
│ • Webhook events (delivered/bounced/opened)      │
└─────────────────────────────────────────────────┘
```

## Integration Specifications

### Request Transformation

**FigmaContactFormData → Resend Payload Mapping:**

```typescript
// Type from existing form
interface FigmaContactFormData {
  firstName: string; // Required, validated, sanitized
  lastName: string; // Optional, validated, sanitized
  email: string; // Required, validated (RFC 5322)
  phone: string; // Required, validated (E.164 or local)
  message: string; // Required, validated, sanitized
  agreeToTerms: boolean; // Required, must be true
}

// Transform to Resend payload
function transformToResendPayload(formData: FigmaContactFormData) {
  const fullName = formData.lastName
    ? `${formData.firstName} ${formData.lastName}`
    : formData.firstName;

  return {
    from: "Reiki Goddess Healing <contact@reikigoddesshealingllc.com>",
    to: [process.env.CONTACT_EMAIL!],
    replyTo: formData.email,
    subject: `New Contact Form Submission from ${fullName}`,
    react: ContactEmailTemplate({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
      submittedAt: new Date().toISOString(),
    }),
    tags: [
      { name: "source", value: "contact-form" },
      { name: "environment", value: process.env.NODE_ENV || "production" },
    ],
  };
}
```

### Error Handling

**Error Classification:**

```typescript
enum ErrorType {
  // Client errors (4xx) - User can potentially fix
  VALIDATION_ERROR = "validation_error",
  RATE_LIMIT = "rate_limit",

  // Server errors (5xx) - System issue, retry may work
  API_ERROR = "api_error",
  NETWORK_ERROR = "network_error",
}

interface ErrorResponse {
  success: false;
  error: string; // User-facing message
  code: ErrorType; // Machine-readable code
  retryable: boolean; // Can user retry?
  retryAfter?: number; // Seconds to wait (for rate limits)
}
```

**Error Handling Strategy:**

```typescript
async function handleEmailSend(
  formData: FigmaContactFormData
): Promise<ContactResponse> {
  try {
    const { data, error } = await resend.emails.send(payload);

    if (error) {
      // Map Resend errors to user-friendly messages
      const errorMap: Record<string, ErrorResponse> = {
        rate_limit_exceeded: {
          success: false,
          error: "Too many requests. Please try again in a few moments.",
          code: ErrorType.RATE_LIMIT,
          retryable: true,
          retryAfter: 60,
        },
        daily_quota_exceeded: {
          success: false,
          error:
            "Email service temporarily unavailable. Please try again tomorrow or call us directly.",
          code: ErrorType.RATE_LIMIT,
          retryable: true,
          retryAfter: 86400, // 24 hours
        },
        validation_error: {
          success: false,
          error:
            "Invalid submission. Please check your information and try again.",
          code: ErrorType.VALIDATION_ERROR,
          retryable: true,
        },
        invalid_api_key: {
          success: false,
          error:
            "Email service configuration error. Please contact us directly.",
          code: ErrorType.API_ERROR,
          retryable: false,
        },
      };

      return (
        errorMap[error.name] || {
          success: false,
          error:
            "Failed to send email. Please try again later or contact us directly.",
          code: ErrorType.API_ERROR,
          retryable: true,
        }
      );
    }

    return {
      success: true,
      emailId: data.id,
    };
  } catch (error) {
    // Network errors, timeouts, etc.
    console.error("Email send exception:", error);

    return {
      success: false,
      error: "Network error. Please check your connection and try again.",
      code: ErrorType.NETWORK_ERROR,
      retryable: true,
    };
  }
}
```

**Retry Logic (Client-Side):**

```typescript
async function submitFormWithRetry(
  formData: FigmaContactFormData,
  maxRetries = 3
): Promise<void> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        return; // Success!
      }

      // Don't retry if not retryable
      if (!result.retryable) {
        throw new Error(result.error);
      }

      // Don't retry on last attempt
      if (attempt === maxRetries) {
        throw new Error(result.error);
      }

      // Exponential backoff: 1s, 2s, 4s
      const backoff = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
      await new Promise((resolve) => setTimeout(resolve, backoff));
    } catch (error) {
      lastError = error as Error;

      // Don't retry network errors on last attempt
      if (attempt === maxRetries) {
        throw error;
      }
    }
  }

  throw lastError || new Error("Failed to submit form after multiple attempts");
}
```

### Response Handling

**Success Flow:**

```typescript
// API returns success
{
  success: true,
  emailId: "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794"
}

// Frontend updates UI
- Display success message: "Thank you for your message! We'll get back to you within 24-48 hours."
- Clear form fields
- Reset rate limiter
- Log success event for analytics
- Optional: Track email ID for support tickets
```

**Error Flow:**

```typescript
// API returns error
{
  success: false,
  error: "Service temporarily busy. Please try again in a moment.",
  code: "rate_limit",
  retryable: true,
  retryAfter: 60
}

// Frontend handles error
- Display error message to user
- If retryable, show "Try Again" button
- If not retryable, show alternative contact methods (phone, email link)
- Log error for monitoring
- Don't expose technical details to user
```

## Email Template Architecture

### React Email Approach

React Email allows you to build email templates using React components, which are then compiled to production-ready HTML that works across all email clients.

**Installation:**

```bash
npm install react-email @react-email/components
```

**Template Structure:**

```typescript
// emails/ContactEmailTemplate.tsx
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
  Heading,
} from '@react-email/components';

interface ContactEmailProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  submittedAt?: string;
}

export function ContactEmailTemplate({
  firstName,
  lastName,
  email,
  phone,
  message,
  submittedAt = new Date().toISOString(),
}: ContactEmailProps) {
  const fullName = lastName ? `${firstName} ${lastName}` : firstName;
  const formattedDate = new Date(submittedAt).toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
  });

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Heading style={heading}>New Contact Form Submission</Heading>

          <Text style={timestamp}>
            Received: {formattedDate}
          </Text>

          <Hr style={hr} />

          {/* Contact Details */}
          <Section style={section}>
            <Heading as="h2" style={subheading}>
              Contact Information
            </Heading>

            <Text style={label}>Name:</Text>
            <Text style={value}>{fullName}</Text>

            <Text style={label}>Email:</Text>
            <Text style={value}>{email}</Text>

            <Text style={label}>Phone:</Text>
            <Text style={value}>{phone}</Text>
          </Section>

          <Hr style={hr} />

          {/* Message */}
          <Section style={section}>
            <Heading as="h2" style={subheading}>
              Message
            </Heading>

            <Text style={messageText}>{message}</Text>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Text style={footer}>
            This email was sent from the contact form on reikigoddesshealingllc.com
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Styles using inline CSS (email-safe)
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const heading = {
  fontFamily: 'Figtree, sans-serif',
  fontSize: '32px',
  fontWeight: '700',
  color: '#0205B7', // Brand primary color
  padding: '24px',
  textAlign: 'center' as const,
};

const subheading = {
  fontFamily: 'Figtree, sans-serif',
  fontSize: '24px',
  fontWeight: '600',
  color: '#000000',
  margin: '16px 0',
};

const timestamp = {
  fontSize: '14px',
  color: '#8D8D8D',
  textAlign: 'center' as const,
  margin: '0 0 24px',
};

const section = {
  padding: '0 24px',
};

const label = {
  fontFamily: 'Figtree, sans-serif',
  fontSize: '14px',
  fontWeight: '600',
  color: '#5F5F5F',
  margin: '16px 0 4px',
};

const value = {
  fontFamily: 'Neue Montreal, sans-serif',
  fontSize: '16px',
  color: '#000000',
  margin: '0 0 8px',
};

const messageText = {
  fontFamily: 'Neue Montreal, sans-serif',
  fontSize: '16px',
  color: '#000000',
  lineHeight: '24px',
  whiteSpace: 'pre-wrap' as const,
  margin: '16px 0',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footer = {
  fontSize: '12px',
  color: '#8D8D8D',
  textAlign: 'center' as const,
  padding: '0 24px',
};
```

### Styling Strategy for Emails

**Email Client Constraints:**

- Limited CSS support (no Tailwind, no external stylesheets)
- Inline styles are most reliable
- Table-based layouts for complex designs (React Email handles this)
- Font support varies (use web-safe fonts with fallbacks)

**Brand Consistency:**

- Primary Color: `#0205B7` (brand blue)
- Headings: Figtree font family (with fallback)
- Body Text: Neue Montreal font family (with fallback)
- Spacing: Match form design (24px, 16px units)

**Testing:**

- Preview in React Email dev server: `npm run email:dev`
- Test in major clients: Gmail, Outlook, Apple Mail, Yahoo
- Use [Litmus](https://litmus.com/) or [Email on Acid](https://www.emailonacid.com/) for comprehensive testing

### Template Data Binding

All form data is passed as props to the React component:

```typescript
// Type-safe template props
interface ContactEmailProps {
  firstName: string; // From form
  lastName: string; // From form
  email: string; // From form (also used in Reply-To)
  phone: string; // From form
  message: string; // From form (preserve whitespace/newlines)
  submittedAt?: string; // Server timestamp (ISO 8601)
}

// Usage in API
const emailPayload = {
  // ...
  react: ContactEmailTemplate({
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    phone: formData.phone,
    message: formData.message,
    submittedAt: new Date().toISOString(),
  }),
};
```

## Implementation Recommendations

### Phase 1: Backend Setup (Week 1)

1. **Environment Configuration**
   - [ ] Create Resend account
   - [ ] Verify domain: `reikigoddesshealingllc.com`
   - [ ] Generate API key (Sending Access)
   - [ ] Add API key to Vercel environment variables
   - [ ] Configure SPF, DKIM, DMARC DNS records

2. **API Endpoint Creation**
   - [ ] Create `/api/contact.ts` Vercel function
   - [ ] Implement request validation
   - [ ] Add CORS configuration
   - [ ] Set up error handling
   - [ ] Test with Postman/curl

3. **Development Environment**
   - [ ] Install Resend SDK: `npm install resend`
   - [ ] Configure local `.env.local` with test API key
   - [ ] Set up local API endpoint testing

### Phase 2: Resend Integration (Week 1-2)

1. **Email Template Development**
   - [ ] Install React Email: `npm install react-email @react-email/components`
   - [ ] Create `ContactEmailTemplate.tsx`
   - [ ] Style with brand colors (Figtree, #0205B7)
   - [ ] Add email preview script: `npm run email:dev`
   - [ ] Test template rendering

2. **API Integration**
   - [ ] Integrate Resend SDK in `/api/contact.ts`
   - [ ] Implement payload transformation
   - [ ] Add email sending logic
   - [ ] Configure tags for filtering
   - [ ] Test end-to-end flow

3. **Error Handling**
   - [ ] Map Resend errors to user messages
   - [ ] Implement retry logic
   - [ ] Add server-side logging
   - [ ] Test error scenarios (invalid domain, rate limit, quota)

### Phase 3: Frontend Updates (Week 2)

1. **Form Integration**
   - [ ] Update `FigmaContactForm.tsx` onSubmit handler
   - [ ] Implement API client function
   - [ ] Add retry mechanism with exponential backoff
   - [ ] Update success/error messages

2. **User Experience**
   - [ ] Add loading states during submission
   - [ ] Display email confirmation (optional: show email ID)
   - [ ] Show retry button on retryable errors
   - [ ] Provide fallback contact methods on failures

3. **Analytics & Monitoring**
   - [ ] Log submission attempts
   - [ ] Track email IDs for support
   - [ ] Monitor error rates
   - [ ] Set up alerts for quota thresholds

### Phase 4: Testing & Deployment (Week 2-3)

1. **Testing**
   - [ ] Unit tests for API endpoint
   - [ ] Integration tests for email flow
   - [ ] E2E tests for full submission flow
   - [ ] Test error scenarios
   - [ ] Test rate limiting
   - [ ] Cross-browser testing
   - [ ] Email client testing (Gmail, Outlook, Apple Mail)

2. **Deployment**
   - [ ] Deploy to Vercel staging environment
   - [ ] Verify environment variables
   - [ ] Test production API endpoint
   - [ ] Smoke test form submission
   - [ ] Deploy to production
   - [ ] Monitor logs for issues

3. **Documentation**
   - [ ] Update README with setup instructions
   - [ ] Document environment variables
   - [ ] Create runbook for common issues
   - [ ] Document monitoring/alerting setup

## Security Considerations

### API Key Protection

**Best Practices:**

- ✅ Store in environment variables (`.env.local`, Vercel dashboard)
- ✅ Use "Sending Access" keys for production (restricted permissions)
- ✅ Never commit to version control (add to `.gitignore`)
- ✅ Rotate keys quarterly
- ✅ Use separate keys for dev/staging/production
- ❌ Never expose in client-side code
- ❌ Never log API keys
- ❌ Never include in error messages

**Key Rotation Process:**

1. Generate new API key in Resend dashboard
2. Update environment variable in Vercel
3. Deploy updated configuration
4. Verify new key works
5. Delete old key from Resend

### CORS Configuration

**Allowed Origins:**

```typescript
const ALLOWED_ORIGINS = [
  "https://reikigoddesshealingllc.com",
  "https://www.reikigoddesshealingllc.com",
  process.env.NODE_ENV === "development" ? "http://localhost:5173" : "",
].filter(Boolean);
```

**Headers:**

- `Access-Control-Allow-Origin`: Specific domain (not wildcard)
- `Access-Control-Allow-Methods`: POST, OPTIONS only
- `Access-Control-Allow-Headers`: Content-Type only

### Input Validation (Defense in Depth)

**Frontend (FigmaContactForm):**

- ✅ SecurityValidator for all fields
- ✅ XSS prevention via sanitization
- ✅ SQL injection prevention
- ✅ High-risk content detection
- ✅ Rate limiting (3 submissions/hour)

**Backend (API Endpoint):**

- ✅ Required field validation
- ✅ Email format validation (RFC 5322)
- ✅ Phone format validation
- ✅ Message length limits (max 10,000 chars)
- ✅ agreeToTerms boolean validation

**Why Both?**

- Frontend validation provides immediate feedback
- Backend validation prevents API abuse
- Defense in depth: assume frontend can be bypassed

### Rate Limiting (Client + Server)

**Client-Side (Already Implemented):**

- FormRateLimit: 3 submissions per hour per browser
- Stored in localStorage
- Prevents accidental spam

**Server-Side (Resend):**

- 2 requests/second (default)
- 100 emails/day (free tier)
- 3,000 emails/month (free tier)

**Additional Server-Side Rate Limiting (Optional):**

```typescript
// Add to API endpoint
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per 15 minutes per IP
  message: "Too many submissions from this IP. Please try again later.",
});

// Apply to endpoint
export default limiter(handler);
```

**Monitoring:**

- Track `ratelimit-remaining` header
- Alert when approaching limits (80%, 90%)
- Log rate limit violations

## Cost Analysis

### Free Tier Limits

**Resend Free Plan:**

- **Monthly Quota:** 3,000 emails
- **Daily Quota:** 100 emails
- **Rate Limit:** 2 requests/second
- **Domains:** 1 custom domain
- **Data Retention:** 1 day
- **Support:** Ticket support
- **Cost:** $0

### Expected Usage

**Current Volume Estimate:**

- **Daily Submissions:** 10-20 contact form submissions
- **Monthly Submissions:** 300-600 emails
- **Peak Days:** 30-40 submissions (special promotions)

**Safety Margin:**

- **Current:** 300-600/month (10-20% of quota)
- **2x Growth:** 600-1,200/month (20-40% of quota)
- **5x Growth:** 1,500-3,000/month (50-100% of quota)

**Verdict:** Free tier is sufficient for current needs and 2-5x growth.

### Upgrade Triggers

**Consider upgrading to Pro ($20/month) when:**

- Monthly volume exceeds 2,500 emails (80% of quota)
- Daily volume consistently hits 80+ emails (80% of daily limit)
- Need longer data retention (3 days vs 1 day)
- Need multiple domains
- Need priority support

**Pro Plan Benefits:**

- 50,000 emails/month (16x increase)
- No daily limit
- 10 domains
- 3-day data retention
- Priority support

**ROI Analysis:**

```
Cost per email (Free tier): $0.00
Cost per email (Pro tier):  $0.0004 ($20 / 50,000)

Break-even: Free tier is always better until you exceed 3,000/month

At 5,000 emails/month:
- Pro plan: $20/month = $0.004/email
- Cost of single phone call: ~$5 (if email fails)
- Value: Email automation saves ~10 hours/month @ $50/hour = $500 value
```

**Conclusion:** Even at Pro tier, email automation provides 25x ROI.

### Cost Monitoring

**Metrics to Track:**

- Current month email count
- Daily email count
- Peak day volume
- Quota utilization percentage
- Failed sends (count as quota usage)

**Alerts:**

- 80% monthly quota: "Consider optimizing or upgrading"
- 90% monthly quota: "Upgrade plan or reduce volume"
- 100% quota: "Quota exceeded - upgrades required"
- 80% daily quota: "High volume day - monitor closely"

**Implementation:**

```typescript
// Add to API endpoint
const QUOTA_WARNING_THRESHOLD = 0.8; // 80%
const MONTHLY_QUOTA = 3000;

// After successful send
const monthlyCount = await getMonthlyEmailCount(); // Implement tracking
if (monthlyCount / MONTHLY_QUOTA >= QUOTA_WARNING_THRESHOLD) {
  sendAlert("Email quota at 80% - consider upgrading");
}
```

## Next Steps

### Immediate Actions (Week 1)

1. **Create Resend Account**
   - Sign up at [resend.com](https://resend.com)
   - Verify business email address
   - Explore dashboard and features

2. **Domain Verification**
   - Add `reikigoddesshealingllc.com` in Resend dashboard
   - Configure DNS records (SPF, DKIM, DMARC)
   - Wait for verification (usually 24-48 hours)
   - Test with development emails

3. **Generate API Key**
   - Create "Sending Access" API key
   - Store securely in password manager
   - Add to `.env.local` for development
   - Add to Vercel environment variables

4. **Install Dependencies**

   ```bash
   npm install resend react-email @react-email/components
   npm install -D @types/node
   ```

5. **Create Basic Endpoint**
   - Copy API endpoint code from this document
   - Test with curl/Postman
   - Verify CORS configuration
   - Test error handling

### Medium-Term Tasks (Week 2-3)

1. **Build Email Template**
   - Create `ContactEmailTemplate.tsx`
   - Match brand design (Figtree, #0205B7)
   - Test rendering with sample data
   - Preview in email clients

2. **Integrate with Frontend**
   - Update `FigmaContactForm` onSubmit
   - Add API client function
   - Implement retry logic
   - Test end-to-end flow

3. **Deploy to Production**
   - Deploy Vercel function
   - Verify environment variables
   - Test live submission
   - Monitor logs

4. **Set Up Monitoring**
   - Configure quota alerts
   - Set up error logging
   - Create monitoring dashboard
   - Document runbook

### Long-Term Considerations (Month 2+)

1. **Webhooks (Optional)**
   - Implement webhook endpoint for delivery confirmations
   - Track bounced emails
   - Monitor open/click rates
   - Build analytics dashboard

2. **Email Templates Expansion**
   - Auto-reply to user confirming receipt
   - Newsletter signup confirmation
   - Appointment reminders (future feature)
   - Promotional emails (with opt-in)

3. **Advanced Features**
   - A/B testing email templates
   - Personalized auto-replies
   - CRM integration
   - Analytics and reporting

## Appendix

### Sample API Request/Response

**Request:**

```bash
curl -X POST https://reikigoddesshealingllc.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Sarah",
    "lastName": "Johnson",
    "email": "sarah.j@example.com",
    "phone": "(555) 123-4567",
    "message": "I am interested in booking a Reiki healing session. What availability do you have next week?",
    "agreeToTerms": true
  }'
```

**Success Response (200):**

```json
{
  "success": true,
  "emailId": "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794"
}
```

**Error Response (400):**

```json
{
  "success": false,
  "error": "Invalid email address",
  "code": "validation_error",
  "retryable": true
}
```

**Error Response (429):**

```json
{
  "success": false,
  "error": "Service temporarily busy. Please try again in a moment.",
  "code": "rate_limit",
  "retryable": true,
  "retryAfter": 60
}
```

### Useful Resources

**Official Documentation:**

- [Resend Documentation](https://resend.com/docs)
- [Resend API Reference](https://resend.com/docs/api-reference)
- [React Email Documentation](https://react.email/docs)
- [Vercel Functions Documentation](https://vercel.com/docs/functions)

**Code Examples:**

- [Resend Node.js Example](https://github.com/resend/resend-node-example)
- [Resend Next.js Example](https://github.com/resend/resend-nextjs-app-router-example)
- [Resend Webhook Example](https://github.com/resend/resend-examples/tree/main/with-webhooks)

**Tools:**

- [ngrok](https://ngrok.com/) - Local webhook testing
- [Postman](https://www.postman.com/) - API testing
- [Email on Acid](https://www.emailonacid.com/) - Email client testing
- [Litmus](https://litmus.com/) - Email testing and analytics

**Support:**

- Resend Support: [resend.com/contact](https://resend.com/contact)
- Resend Status Page: [resend-status.com](https://resend-status.com/)
- Community: [GitHub Discussions](https://github.com/resendlabs/resend-node/discussions)

---

**Document Version:** 1.0
**Last Updated:** October 2, 2025
**Author:** API Research Team
**Status:** Ready for Implementation
