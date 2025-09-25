# Resend Email Integration Implementation Plan

## The Reiki Goddess Healing Contact Form

### Executive Summary

This document outlines a comprehensive plan for integrating Resend.com email service into The Reiki Goddess Healing website's contact form. The integration will enable professional email delivery for contact form submissions using a custom domain (thereikigoddesshealing.com), ensuring reliable communication with potential clients while maintaining security and scalability.

### Current State Analysis

**Technology Stack:**

- Frontend: React 18 + TypeScript + TailwindCSS + Vite 6
- Contact Form: FigmaContactForm component with built-in security features
- Location: `/packages/shared-components/src/FigmaContactForm/FigmaContactForm.tsx`
- Security: Honeypot, rate limiting (3 submissions/hour), input validation
- Architecture: Client-side only (no backend API currently)

### Prerequisites and Setup Requirements

1. **Resend Account Setup**
   - Create a Resend account at https://resend.com
   - Verify email ownership
   - Obtain API key from dashboard

2. **Domain Configuration**
   - Add domain: `thereikigoddesshealing.com`
   - Configure subdomain for sending: `mail.thereikigoddesshealing.com`
   - Set up DNS records (SPF, DKIM) as provided by Resend
   - Consider DMARC for additional trust

3. **Backend Infrastructure**
   - Set up server-side API endpoint (required for security)
   - Options: Vercel Functions, Netlify Functions, or Express.js server
   - Environment variable management for API keys

### Integration Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Contact Form   │────▶│   API Endpoint  │────▶│  Resend API     │
│  (Frontend)     │     │   (Backend)     │     │  (Email Service)│
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Detailed Implementation Steps

#### Phase 1: Backend API Setup

**1.1 Create API Directory Structure**

```
/apps/api/
├── package.json
├── tsconfig.json
├── .env.local
├── src/
│   ├── routes/
│   │   └── contact.ts
│   ├── services/
│   │   └── email.service.ts
│   ├── templates/
│   │   └── contact-form.tsx
│   └── utils/
│       ├── rate-limiter.ts
│       └── validation.ts
```

**1.2 Install Dependencies**

```bash
npm install resend @react-email/components
npm install -D @types/node typescript
```

**1.3 Environment Configuration**
File: `/apps/api/.env.local`

```env
RESEND_API_KEY=re_xxxxxxxxx
RESEND_FROM_EMAIL=contact@mail.thereikigoddesshealing.com
ALLOWED_ORIGIN=https://thereikigoddesshealing.com
```

#### Phase 2: Email Service Implementation

**2.1 Create Email Service**
File: `/apps/api/src/services/email.service.ts`

```typescript
import { Resend } from "resend";
import { ContactFormEmail } from "../templates/contact-form";
import type { FigmaContactFormData } from "@reiki-goddess/shared-components";

const resend = new Resend(process.env.RESEND_API_KEY);

export class EmailService {
  async sendContactFormEmail(data: FigmaContactFormData) {
    try {
      const { data: response, error } = await resend.emails.send({
        from: "The Reiki Goddess <contact@mail.thereikigoddesshealing.com>",
        to: ["thereikigoddesshealing@gmail.com"],
        replyTo: data.email,
        subject: `New Contact Form Submission from ${data.firstName} ${data.lastName}`,
        react: ContactFormEmail(data),
        headers: {
          "X-Entity-Ref-ID": crypto.randomUUID(),
        },
        tags: [
          { name: "form", value: "contact" },
          { name: "source", value: "website" },
        ],
      });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, id: response.id };
    } catch (error) {
      console.error("Email service error:", error);
      throw error;
    }
  }
}
```

**2.2 Create Email Template**
File: `/apps/api/src/templates/contact-form.tsx`

```typescript
import * as React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Section,
  Heading,
  Hr,
  Link,
} from '@react-email/components';

interface ContactFormEmailProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

export const ContactFormEmail: React.FC<ContactFormEmailProps> = ({
  firstName,
  lastName,
  email,
  phone,
  message,
}) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New Contact Form Submission</Heading>
        <Hr style={hr} />

        <Section style={section}>
          <Text style={label}>Name:</Text>
          <Text style={value}>{firstName} {lastName}</Text>
        </Section>

        <Section style={section}>
          <Text style={label}>Email:</Text>
          <Link href={`mailto:${email}`} style={link}>{email}</Link>
        </Section>

        <Section style={section}>
          <Text style={label}>Phone:</Text>
          <Link href={`tel:${phone}`} style={link}>{phone}</Link>
        </Section>

        <Section style={section}>
          <Text style={label}>Message:</Text>
          <Text style={message}>{message}</Text>
        </Section>

        <Hr style={hr} />
        <Text style={footer}>
          This email was sent from the contact form at thereikigoddesshealing.com
        </Text>
      </Container>
    </Body>
  </Html>
);

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: 'Figtree, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '40px',
  margin: '0 0 20px',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const section = {
  margin: '20px 0',
};

const label = {
  color: '#666',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 5px',
};

const value = {
  color: '#333',
  fontSize: '16px',
  margin: '0',
};

const message = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0',
  whiteSpace: 'pre-wrap',
};

const link = {
  color: '#0205B7',
  textDecoration: 'underline',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '32px 0 0',
};

export default ContactFormEmail;
```

#### Phase 3: API Endpoint Implementation

**3.1 Create Contact API Route**
File: `/apps/api/src/routes/contact.ts`

```typescript
import type { Request, Response } from "express";
import { EmailService } from "../services/email.service";
import { validateContactForm } from "../utils/validation";
import { checkRateLimit } from "../utils/rate-limiter";

const emailService = new EmailService();

export async function handleContactFormSubmission(req: Request, res: Response) {
  // CORS check
  const origin = req.headers.origin;
  if (origin !== process.env.ALLOWED_ORIGIN) {
    return res.status(403).json({ error: "Forbidden" });
  }

  // Rate limiting
  const rateLimitCheck = await checkRateLimit(req.ip);
  if (!rateLimitCheck.allowed) {
    return res.status(429).json({
      error: "Too many requests",
      retryAfter: rateLimitCheck.retryAfter,
    });
  }

  // Validation
  const validationResult = validateContactForm(req.body);
  if (!validationResult.valid) {
    return res.status(400).json({
      error: "Validation failed",
      errors: validationResult.errors,
    });
  }

  try {
    // Send email
    const result = await emailService.sendContactFormEmail(req.body);

    // Success response
    res.status(200).json({
      success: true,
      message: "Your message has been sent successfully",
      id: result.id,
    });
  } catch (error) {
    console.error("Contact form error:", error);

    // Check for Resend rate limit
    if (error.message?.includes("rate limit")) {
      return res.status(429).json({
        error: "Email service rate limit exceeded. Please try again later.",
      });
    }

    // Generic error response
    res.status(500).json({
      error: "Failed to send message. Please try again later.",
    });
  }
}
```

**3.2 Create Rate Limiter**
File: `/apps/api/src/utils/rate-limiter.ts`

```typescript
import { LRUCache } from "lru-cache";

const rateLimitCache = new LRUCache<string, number[]>({
  max: 500,
  ttl: 1000 * 60 * 60, // 1 hour
});

export async function checkRateLimit(ip: string): Promise<{
  allowed: boolean;
  retryAfter?: number;
}> {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour
  const maxRequests = 3;

  const requests = rateLimitCache.get(ip) || [];
  const recentRequests = requests.filter((time) => now - time < windowMs);

  if (recentRequests.length >= maxRequests) {
    const oldestRequest = Math.min(...recentRequests);
    const retryAfter = Math.ceil((oldestRequest + windowMs - now) / 1000);

    return { allowed: false, retryAfter };
  }

  recentRequests.push(now);
  rateLimitCache.set(ip, recentRequests);

  return { allowed: true };
}
```

#### Phase 4: Frontend Integration

**4.1 Create API Client**
File: `/packages/shared-utils/src/api/contact.api.ts`

```typescript
import type { FigmaContactFormData } from "@reiki-goddess/shared-components";

const API_ENDPOINT = import.meta.env.VITE_API_URL || "/api/contact";

export interface ContactFormResponse {
  success: boolean;
  message?: string;
  error?: string;
  errors?: Record<string, string>;
  retryAfter?: number;
}

export async function submitContactForm(
  data: FigmaContactFormData
): Promise<ContactFormResponse> {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      // Handle rate limiting
      if (response.status === 429) {
        const retryAfter = result.retryAfter || 3600;
        throw new Error(
          `Rate limit exceeded. Please try again in ${Math.ceil(retryAfter / 60)} minutes.`
        );
      }

      throw new Error(result.error || "Failed to submit form");
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(
      "Network error. Please check your connection and try again."
    );
  }
}
```

**4.2 Update ContactPage Component**
File: `/packages/shared-components/src/pages/ContactPage.tsx`

```typescript
import { submitContactForm } from '@reiki-goddess/shared-utils';

// Update the onSubmit handler
<FigmaContactForm
  onSubmit={async (data) => {
    try {
      const response = await submitContactForm(data);
      // Success is handled by the form component
    } catch (error) {
      // Error is handled by the form component
      throw error;
    }
  }}
  className="contact-page-form"
/>
```

### Security Considerations

1. **API Key Management**
   - Store Resend API key in environment variables
   - Never expose API key in client-side code
   - Use secure key rotation practices

2. **Rate Limiting**
   - Implement server-side rate limiting (3 requests/hour/IP)
   - Handle Resend's API rate limits (2 requests/second)
   - Provide clear user feedback for rate limit errors

3. **Input Validation**
   - Validate and sanitize all inputs on both client and server
   - Implement XSS prevention measures
   - Use existing SecurityValidator from the codebase

4. **CORS Configuration**
   - Restrict API access to your domain only
   - Implement proper CORS headers

5. **Error Handling**
   - Never expose sensitive error details to users
   - Log detailed errors server-side only
   - Provide generic user-friendly error messages

### Testing Strategy

1. **Unit Tests**
   - Email service logic
   - Validation functions
   - Rate limiting logic
   - Email template rendering

2. **Integration Tests**
   - API endpoint responses
   - Error handling scenarios
   - Rate limit enforcement
   - Email delivery confirmation

3. **End-to-End Tests**
   - Complete form submission flow
   - Error state handling
   - Success confirmation
   - Rate limit messaging

4. **Manual Testing Checklist**
   - [ ] Test with valid form data
   - [ ] Test with invalid email formats
   - [ ] Test rate limiting (submit 4+ times in an hour)
   - [ ] Test network error handling
   - [ ] Verify email receipt and formatting
   - [ ] Test reply-to functionality
   - [ ] Verify mobile responsiveness

### Monitoring and Logging

1. **Email Metrics**
   - Track delivery rates via Resend dashboard
   - Monitor bounce rates (must stay under 4%)
   - Watch spam complaint rates (must stay under 0.08%)

2. **Application Monitoring**
   - Log all submission attempts
   - Track API response times
   - Monitor rate limit hits
   - Set up alerts for failures

3. **Error Tracking**
   - Implement error logging service (e.g., Sentry)
   - Track form validation failures
   - Monitor API errors
   - Create dashboards for insights

### Deployment Checklist

1. **Pre-deployment**
   - [ ] Verify domain DNS records are properly configured
   - [ ] Test email delivery in staging environment
   - [ ] Confirm environment variables are set
   - [ ] Review security configurations

2. **Deployment Steps**
   - [ ] Deploy backend API first
   - [ ] Test API endpoint manually
   - [ ] Deploy frontend changes
   - [ ] Verify CORS configuration

3. **Post-deployment**
   - [ ] Send test email through production form
   - [ ] Monitor logs for first hour
   - [ ] Check Resend dashboard for email delivery
   - [ ] Verify rate limiting is working

### Cost Considerations

- **Free Tier**: 100 emails/day, 3,000 emails/month
- **Estimated Usage**: ~10-20 form submissions/day
- **Recommendation**: Start with free tier, monitor usage
- **Upgrade Trigger**: When approaching 80% of limits

### Potential Challenges and Mitigation

1. **Challenge**: DNS propagation delays
   - **Mitigation**: Set up DNS records 24-48 hours before go-live

2. **Challenge**: Rate limit conflicts (form vs API)
   - **Mitigation**: Align frontend and backend rate limits

3. **Challenge**: Spam form submissions
   - **Mitigation**: Consider adding reCAPTCHA if needed

4. **Challenge**: Email deliverability issues
   - **Mitigation**: Follow Resend's best practices, monitor metrics

### Next Steps

1. **Immediate Actions**
   - Create Resend account
   - Set up domain verification
   - Create backend API structure

2. **Development Priority**
   - Implement email service
   - Create API endpoint
   - Update frontend integration
   - Comprehensive testing

3. **Launch Preparation**
   - Security review
   - Performance testing
   - Documentation update
   - Team training

### Conclusion

This implementation plan provides a secure, scalable solution for integrating Resend email service into The Reiki Goddess Healing contact form. The architecture maintains security best practices while providing a professional email experience for both the business owner and website visitors.
