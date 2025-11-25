# Events Page Integration Specification

**Date**: 2025-11-03
**Version**: 2.0
**Status**: Ready for Implementation

---

## Table of Contents

1. [Integration Priority Assessment](#integration-priority-assessment)
2. [Stripe Payment Integration](#stripe-payment-integration)
3. [Resend Email Integration](#resend-email-integration)
4. [Calendar Export (.ics Files)](#calendar-export-ics-files)
5. [Google Calendar Integration](#google-calendar-integration)
6. [Integration Testing Requirements](#integration-testing-requirements)
7. [Phased Rollout Plan](#phased-rollout-plan)
8. [Environment Variables Reference](#environment-variables-reference)

---

## Integration Priority Assessment

### Integration Priority Matrix

| Integration            | MVP Required? | Complexity | Implementation Timeline | Decision               |
| ---------------------- | ------------- | ---------- | ----------------------- | ---------------------- |
| Resend (confirmations) | ✅ YES        | Low        | Phase 1 (Week 1)        | **Implement Phase 1**  |
| Calendar export (.ics) | ⏭️ DEFER      | Low        | Phase 2 (Week 2)        | **Implement Phase 2**  |
| Stripe (paid events)   | ❓ MAYBE      | High       | Phase 2+ (Week 2-3)     | **Decision needed**    |
| Google Calendar API    | ❌ NO         | Very High  | Phase 3+ (Future)       | **Defer indefinitely** |

### MVP Decision Criteria

**Can users register without it?**

- Resend: NO - Users need confirmation emails
- Calendar export: YES - Manual add-to-calendar acceptable
- Stripe: DEPENDS - Only if paid events planned
- Google Calendar API: YES - .ics export is simpler alternative

**Can we launch with manual workarounds?**

- Resend: NO - Email automation is essential
- Calendar export: YES - Email can include event details
- Stripe: YES - "Email us to pay" for MVP
- Google Calendar API: YES - Users can import .ics files

**Is complexity worth delaying launch?**

- Resend: YES - Low complexity, high value
- Calendar export: YES - Low complexity, good UX
- Stripe: NO - High complexity, only needed if paid events exist
- Google Calendar API: NO - Complex OAuth, .ics is better

### Critical Question: Are Paid Events Planned?

**Current Business Model Assessment:**

Based on codebase analysis, the business currently offers:

- In-person Reiki sessions (paid)
- Remote Reiki sessions (paid)
- Community events (typically free)

**Recommendation**: **Start with free events only for MVP**, add Stripe in Phase 2 if needed.

**Rationale**:

1. Contact form pattern (already using Resend) suggests simple communication model
2. No existing payment infrastructure in codebase
3. Free community events build audience before paid offerings
4. Manual payment collection ("Email us") is acceptable workaround for initial paid events

---

## Stripe Payment Integration

### Scope Decision

**MVP Recommendation**: **DEFER to Phase 2+**

**Why defer**:

- No immediate need identified (free events for MVP)
- High implementation complexity (webhooks, checkout flow, error handling)
- Contact form pattern suggests manual interaction is acceptable
- Can launch faster without payment infrastructure

**When to implement**:

- First paid event is scheduled
- Manual payment collection becomes bottleneck
- Need automated payment confirmation

---

### If Implementing Stripe (Phase 2 or later)

#### Required Setup

1. **Stripe Account**
   - Create account at [stripe.com](https://stripe.com)
   - Complete business verification
   - Enable test mode for development

2. **API Keys**

   ```bash
   # Development (test mode)
   STRIPE_SECRET_KEY=sk_test_...
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

   # Production (live mode)
   STRIPE_SECRET_KEY=sk_live_...
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
   ```

3. **Webhook Endpoint**
   - Configure webhook in Stripe Dashboard
   - Endpoint: `https://thereikigoddesshealing.com/api/stripe-webhook`
   - Events to listen for: `checkout.session.completed`, `payment_intent.succeeded`

#### Implementation Pattern

**Backend Service** (`/packages/shared-utils/src/services/stripeService.ts`):

```typescript
import Stripe from "stripe";

// Initialize Stripe (server-side only!)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

interface CreateCheckoutSessionParams {
  eventId: string;
  eventTitle: string;
  priceInCents: number;
  registrantEmail: string;
  registrantName: string;
  successUrl: string;
  cancelUrl: string;
}

export const stripeService = {
  /**
   * Create Stripe Checkout session for event registration
   */
  createCheckoutSession: async (
    params: CreateCheckoutSessionParams
  ): Promise<{ sessionId: string; url: string }> => {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: params.eventTitle,
              description: `Event registration for ${params.eventTitle}`,
            },
            unit_amount: params.priceInCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      customer_email: params.registrantEmail,
      metadata: {
        eventId: params.eventId,
        registrantName: params.registrantName,
      },
      // Collect customer details
      billing_address_collection: "required",
    });

    return {
      sessionId: session.id,
      url: session.url!,
    };
  },

  /**
   * Verify payment was completed
   */
  verifyPayment: async (
    sessionId: string
  ): Promise<{
    paid: boolean;
    amount: number;
    paymentIntentId?: string;
  }> => {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return {
      paid: session.payment_status === "paid",
      amount: session.amount_total || 0,
      paymentIntentId: session.payment_intent as string | undefined,
    };
  },

  /**
   * Create refund for event cancellation
   */
  createRefund: async (
    paymentIntentId: string,
    amount: number,
    reason: string
  ): Promise<{ refundId: string; status: string }> => {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount,
      reason: "requested_by_customer",
      metadata: {
        cancellationReason: reason,
      },
    });

    return {
      refundId: refund.id,
      status: refund.status,
    };
  },
};
```

**API Endpoint** (`/apps/main/api/create-checkout-session.ts`):

```typescript
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { stripeService } from "@reiki-goddess/shared-utils";

interface CheckoutRequest {
  eventId: string;
  eventTitle: string;
  priceInCents: number;
  registrantEmail: string;
  registrantName: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = req.body as CheckoutRequest;

    // Validation
    if (!body.eventId || !body.eventTitle || !body.registrantEmail) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create Stripe Checkout session
    const { sessionId, url } = await stripeService.createCheckoutSession({
      ...body,
      successUrl: `${process.env.FRONTEND_URL}/events/registration/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.FRONTEND_URL}/events/${body.eventId}`,
    });

    return res.status(200).json({
      success: true,
      sessionId,
      checkoutUrl: url,
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return res.status(500).json({
      error: "Failed to create checkout session",
    });
  }
}
```

**Frontend Integration** (`/apps/main/src/pages/EventDetailPage.tsx`):

```typescript
import { useState } from "react";

const handleRegisterPaidEvent = async () => {
  try {
    setLoading(true);

    // Call backend to create Stripe Checkout session
    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventId: event.id,
        eventTitle: event.title,
        priceInCents: event.pricing.amount,
        registrantEmail: user.email,
        registrantName: `${user.firstName} ${user.lastName}`,
      }),
    });

    const { checkoutUrl } = await response.json();

    // Redirect to Stripe Checkout
    window.location.href = checkoutUrl;
  } catch (error) {
    console.error("Registration error:", error);
    setError("Failed to start registration. Please try again.");
  } finally {
    setLoading(false);
  }
};
```

#### Webhook Handler

**Webhook Endpoint** (`/apps/main/api/stripe-webhook.ts`):

```typescript
import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";
import { emailService } from "@reiki-goddess/shared-utils";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const sig = req.headers["stripe-signature"] as string;
  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return res.status(400).json({ error: "Invalid signature" });
  }

  // Handle event
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      // Extract metadata
      const eventId = session.metadata?.eventId;
      const registrantName = session.metadata?.registrantName;

      // Send confirmation email
      await emailService.sendEventConfirmation({
        to: session.customer_email!,
        eventId: eventId!,
        registrantName: registrantName!,
        paymentAmount: session.amount_total!,
        paymentStatus: "paid",
      });

      break;
    }

    case "payment_intent.succeeded": {
      // Additional payment confirmation logic
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return res.status(200).json({ received: true });
}
```

#### Security Considerations

1. **API Key Protection**
   - ✅ Secret key lives server-side only (no `VITE_` prefix)
   - ✅ Publishable key can be exposed (frontend use)
   - ✅ Rotate keys quarterly
   - ❌ Never log secret keys

2. **Webhook Signature Verification**
   - Always verify `stripe-signature` header
   - Reject requests with invalid signatures
   - Use webhook secret from Stripe Dashboard

3. **PCI Compliance**
   - Use Stripe Checkout (hosted, PCI compliant)
   - Never handle raw card data
   - Never store card details

#### Testing Strategy

**Test Mode Setup**:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local endpoint
stripe listen --forward-to localhost:5173/api/stripe-webhook
```

**Test Cards**:

- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Authentication required: `4000 0025 0000 3155`

**Test Checklist**:

- [ ] Successful payment flow
- [ ] Declined card handling
- [ ] Webhook delivery
- [ ] Email confirmation sent
- [ ] Refund processing
- [ ] Error scenarios

---

## Resend Email Integration

### Required for MVP: ✅ YES

**Why required**:

- Users MUST receive confirmation after registration
- Email is the standard communication channel (proven by Contact form)
- Low complexity, high value
- Existing Resend implementation in Contact form to reference

### Existing Implementation Analysis

**Current State**: ✅ Resend already integrated for Contact form

**Location**: `/apps/main/api/contact.ts`

**Key Findings**:

- Resend SDK already installed and working
- Environment variables configured: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `CONTACT_EMAIL`
- HTML email templates working (inline styles)
- Error handling implemented
- Rate limiting in place

**Action**: **Extend existing pattern** for event confirmations (don't reinvent)

### Email Service Implementation

**Extend Existing Service** (`/packages/shared-utils/src/services/emailService.ts`):

```typescript
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const emailService = {
  /**
   * Send event registration confirmation
   * Pattern: Same as contact form (proven working)
   */
  sendEventConfirmation: async (params: {
    to: string;
    eventTitle: string;
    eventDate: string;
    eventTime: string;
    eventLocation: string;
    registrantName: string;
    registrationId: string;
    isPaid: boolean;
    amount?: number;
  }): Promise<{ success: boolean; emailId?: string }> => {
    try {
      const { data, error } = await resend.emails.send({
        from: `Reiki Goddess Healing <${process.env.RESEND_FROM_EMAIL}>`,
        to: params.to,
        subject: `Registration Confirmed: ${params.eventTitle}`,
        html: createEventConfirmationHTML(params),
        tags: [
          { name: "source", value: "event-registration" },
          { name: "event-type", value: params.isPaid ? "paid" : "free" },
        ],
      });

      if (error) {
        console.error("Resend error:", error);
        return { success: false };
      }

      return { success: true, emailId: data?.id };
    } catch (error) {
      console.error("Email send failed:", error);
      return { success: false };
    }
  },

  /**
   * Send event reminder (24h before)
   * Phase 2 feature
   */
  sendEventReminder: async (params: {
    to: string;
    eventTitle: string;
    eventDate: string;
    eventTime: string;
    eventLocation: string;
  }): Promise<{ success: boolean }> => {
    // Implementation deferred to Phase 2
    return { success: false };
  },

  /**
   * Send cancellation confirmation
   */
  sendCancellationConfirmation: async (params: {
    to: string;
    eventTitle: string;
    registrantName: string;
    refundAmount?: number;
  }): Promise<{ success: boolean }> => {
    try {
      const { data, error } = await resend.emails.send({
        from: `Reiki Goddess Healing <${process.env.RESEND_FROM_EMAIL}>`,
        to: params.to,
        subject: `Registration Cancelled: ${params.eventTitle}`,
        html: createCancellationHTML(params),
        tags: [{ name: "source", value: "event-cancellation" }],
      });

      if (error) {
        return { success: false };
      }

      return { success: true, emailId: data?.id };
    } catch (error) {
      return { success: false };
    }
  },
};
```

### Email Templates

**Pattern**: Follow Contact form template style (proven working)

**Brand Consistency**:

- Colors: `#0205B7` (brand blue), `#FFFBF5` (cream background)
- Font: Figtree for headings, system fonts for body
- Logo: Include brand logo (if available)
- Tone: Professional but warm

#### 1. Registration Confirmation (MVP - Phase 1)

```typescript
function createEventConfirmationHTML(params: {
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  registrantName: string;
  registrationId: string;
  isPaid: boolean;
  amount?: number;
}): string {
  const paymentSection = params.isPaid
    ? `
      <div class="field">
        <div class="label">Payment:</div>
        <div class="value">✅ Paid - $${(params.amount! / 100).toFixed(2)}</div>
      </div>
    `
    : "";

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #FFFBF5;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #0205B7;
            color: white;
            padding: 30px 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .content {
            background-color: #fff;
            padding: 30px;
            border: 1px solid #e0e0e0;
            border-top: none;
            border-radius: 0 0 8px 8px;
          }
          .success-badge {
            background-color: #10b981;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            display: inline-block;
            font-weight: 600;
            font-size: 14px;
            margin-bottom: 20px;
          }
          .field {
            margin-bottom: 20px;
          }
          .label {
            font-weight: 600;
            color: #5F5F5F;
            font-size: 14px;
            margin-bottom: 4px;
          }
          .value {
            color: #000;
            font-size: 16px;
          }
          .event-details {
            background-color: #FFFBF5;
            padding: 20px;
            border-left: 4px solid #0205B7;
            margin: 20px 0;
          }
          .cta-button {
            display: inline-block;
            background-color: #0205B7;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 12px;
            color: #8D8D8D;
            padding: 20px;
          }
          hr {
            border: none;
            border-top: 1px solid #e0e0e0;
            margin: 30px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 32px;">Registration Confirmed!</h1>
          </div>
          <div class="content">
            <div class="success-badge">✓ You're Registered</div>

            <p style="font-size: 18px; margin-bottom: 30px;">
              Hi ${params.registrantName},
            </p>

            <p>
              Thank you for registering! We're excited to have you join us for this event.
            </p>

            <div class="event-details">
              <h2 style="margin-top: 0; font-size: 24px; color: #0205B7;">
                ${params.eventTitle}
              </h2>

              <div class="field">
                <div class="label">📅 Date:</div>
                <div class="value">${params.eventDate}</div>
              </div>

              <div class="field">
                <div class="label">🕐 Time:</div>
                <div class="value">${params.eventTime}</div>
              </div>

              <div class="field">
                <div class="label">📍 Location:</div>
                <div class="value">${params.eventLocation}</div>
              </div>

              ${paymentSection}
            </div>

            <p>
              <strong>Registration ID:</strong> ${params.registrationId}
            </p>

            <hr>

            <h3 style="font-size: 20px;">What to bring:</h3>
            <ul>
              <li>Comfortable clothing</li>
              <li>Open mind and heart</li>
              <li>Any questions you'd like to discuss</li>
            </ul>

            <h3 style="font-size: 20px;">Questions?</h3>
            <p>
              If you have any questions or need to make changes to your registration,
              please reply to this email or contact us directly.
            </p>

            <p>
              <strong>Phone:</strong> (360) 628-7438<br>
              <strong>Email:</strong> thereikigoddesshealing@gmail.com
            </p>

            <div class="footer">
              <p>
                This confirmation was sent to ${params.to}<br>
                The Reiki Goddess Healing<br>
                8916 345th Street Ct. S. Roy, WA 98580
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}
```

#### 2. Event Reminder (Phase 2)

**Subject**: "Reminder: {Event Title} Tomorrow"

**Sent**: 24 hours before event start time

**Content**:

- Event details refresher
- Location/virtual meeting link
- "Add to Calendar" link
- Last-minute instructions

**Implementation**: Deferred to Phase 2 (requires cron job or scheduled function)

#### 3. Cancellation Confirmation (Phase 1)

```typescript
function createCancellationHTML(params: {
  eventTitle: string;
  registrantName: string;
  refundAmount?: number;
}): string {
  const refundSection = params.refundAmount
    ? `
      <div class="refund-notice">
        <p>
          <strong>Refund Processed:</strong> $${(params.refundAmount / 100).toFixed(2)}<br>
          Please allow 5-10 business days for the refund to appear in your account.
        </p>
      </div>
    `
    : "";

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          /* Same base styles as confirmation */
          .refund-notice {
            background-color: #f0fdf4;
            border-left: 4px solid #10b981;
            padding: 15px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header" style="background-color: #8D8D8D;">
            <h1 style="margin: 0; font-size: 32px;">Registration Cancelled</h1>
          </div>
          <div class="content">
            <p style="font-size: 18px;">Hi ${params.registrantName},</p>

            <p>
              Your registration for <strong>${params.eventTitle}</strong> has been cancelled.
            </p>

            ${refundSection}

            <p>
              We're sorry you can't make it this time. We hope to see you at a future event!
            </p>

            <hr>

            <p>
              <strong>Questions?</strong><br>
              Contact us: thereikigoddesshealing@gmail.com or (360) 628-7438
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}
```

### Testing Strategy

**Email Delivery Testing**:

- [ ] Send to real email addresses (Gmail, Outlook, Apple Mail)
- [ ] Check spam folder placement
- [ ] Verify mobile rendering (iOS Mail, Gmail app)
- [ ] Test all template variations (free/paid, with/without refund)

**Brand Compliance**:

- [ ] Colors match brand (#0205B7, #FFFBF5)
- [ ] Figtree font loaded (or fallback acceptable)
- [ ] Logo displays correctly
- [ ] Professional tone maintained

**Error Handling**:

- [ ] API key missing
- [ ] Invalid email address
- [ ] Resend rate limit exceeded
- [ ] Network timeout

### Environment Variables

**Already Configured** (from Contact form):

```bash
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=contact@thereikigoddesshealing.com
CONTACT_EMAIL=thereikigoddesshealing@gmail.com
```

**No Changes Needed** - Reuse existing configuration.

---

## Calendar Export (.ics Files)

### Required for MVP: ⏭️ PHASE 2

**Complexity**: Low
**Impact**: Medium (nice-to-have UX improvement)
**Recommendation**: Implement Phase 2

### Why Phase 2 (Not MVP)?

- Users can manually add events from email
- Low priority compared to email confirmations
- Simple to add after launch
- No external dependencies

### Implementation (Simple)

**Service Function** (`/packages/shared-utils/src/services/calendarService.ts`):

```typescript
/**
 * Generate .ics calendar file content
 * Spec: RFC 5545 (iCalendar)
 */
export function generateICS(event: {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  url?: string;
}): string {
  const formatICSDate = (date: Date): string => {
    // Format: YYYYMMDDTHHMMSSZ (UTC)
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  };

  const escapeICSText = (text: string): string => {
    // Escape special characters per RFC 5545
    return text
      .replace(/\\/g, "\\\\")
      .replace(/;/g, "\\;")
      .replace(/,/g, "\\,")
      .replace(/\n/g, "\\n");
  };

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//The Reiki Goddess Healing//Events//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${event.id}@thereikigoddesshealing.com
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${formatICSDate(event.startDate)}
DTEND:${formatICSDate(event.endDate)}
SUMMARY:${escapeICSText(event.title)}
DESCRIPTION:${escapeICSText(event.description)}
LOCATION:${escapeICSText(event.location)}
${event.url ? `URL:${event.url}` : ""}
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR`;
}
```

**Frontend Component** (Download button):

```tsx
import { generateICS } from "@reiki-goddess/shared-utils";

const EventDetailPage = ({ event }) => {
  const handleAddToCalendar = () => {
    const icsContent = generateICS({
      id: event.id,
      title: event.title,
      description: event.description,
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate),
      location:
        event.location.type === "virtual"
          ? event.location.virtualMeetingUrl!
          : `${event.location.venue!.name}, ${event.location.venue!.address.city}`,
      url: `https://thereikigoddesshealing.com/events/${event.id}`,
    });

    // Create blob and download
    const blob = new Blob([icsContent], {
      type: "text/calendar;charset=utf-8",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${event.slug}.ics`;
    link.click();
  };

  return (
    <button onClick={handleAddToCalendar} className="btn-secondary">
      📅 Add to Calendar
    </button>
  );
};
```

### Testing Strategy

- [ ] Generate .ics file
- [ ] Import to Apple Calendar (macOS, iOS)
- [ ] Import to Google Calendar (web, Android)
- [ ] Import to Outlook (Windows, web)
- [ ] Verify timezone handling
- [ ] Test special characters in event details

**Pros**:

- Simple implementation (no API keys)
- Works with all calendar apps
- No ongoing maintenance

**Cons**:

- User must manually import
- No automatic sync
- No update notifications

---

## Google Calendar Integration

### Required for MVP: ❌ NO

**Complexity**: Very High
**Impact**: Low (redundant with .ics export)
**Recommendation**: **Defer indefinitely** (Phase 3+)

### Why Defer?

**Complexity Issues**:

1. OAuth 2.0 flow required (user authorization)
2. OR Service Account setup (admin calendar only)
3. Token refresh handling
4. Error handling for failed syncs
5. Calendar API quotas and rate limits

**Low ROI**:

- .ics export achieves same goal (manual import)
- Most users prefer manual control over calendar
- High implementation cost vs. marginal benefit

**Alternative**: Calendar export (.ics) is simpler and sufficient

### If Implementing (Phase 3+)

**Two Approaches**:

#### Option A: Service Account (Admin Calendar Only)

**Use Case**: Publish events to business's public calendar

**Pros**:

- No user OAuth required
- Simpler authentication
- Good for public event calendar

**Cons**:

- Can't add to individual user calendars
- Requires service account setup in Google Cloud Console

**Setup**:

```bash
# Environment variables
GOOGLE_SERVICE_ACCOUNT_EMAIL=events@project-id.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_CALENDAR_ID=primary
```

**Implementation**:

```typescript
import { google } from "googleapis";

const auth = new google.auth.JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY,
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

const calendar = google.calendar({ version: "v3", auth });

export const googleCalendarService = {
  createEvent: async (event: Event) => {
    const response = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      requestBody: {
        summary: event.title,
        description: event.description,
        start: { dateTime: event.startDate.toISOString() },
        end: { dateTime: event.endDate.toISOString() },
        location: event.location.venue?.name,
      },
    });

    return response.data.id;
  },
};
```

#### Option B: User OAuth (Add to User's Calendar)

**Use Case**: Each user authorizes adding to their personal calendar

**Pros**:

- Events appear in user's personal calendar
- Better user experience

**Cons**:

- Complex OAuth flow
- Token storage and refresh required
- Each user must authorize
- Higher implementation complexity

**Recommendation**: If needed, use **Option A (Service Account)** for Phase 3

---

## Integration Testing Requirements

### Resend Email Testing (Phase 1)

**Unit Tests**:

- [ ] Email service creates correct payload
- [ ] HTML template renders correctly
- [ ] Error handling works (API key missing, invalid email)

**Integration Tests**:

- [ ] Email sends successfully to real address
- [ ] Correct sender/reply-to addresses
- [ ] Tags applied correctly
- [ ] Delivery confirmed via Resend dashboard

**Manual Testing**:

- [ ] Send confirmation email (free event)
- [ ] Send confirmation email (paid event)
- [ ] Send cancellation email (with refund)
- [ ] Send cancellation email (no refund)
- [ ] Check spam folder placement
- [ ] Verify mobile rendering

### Stripe Testing (Phase 2+)

**Unit Tests**:

- [ ] Checkout session creation
- [ ] Payment verification logic
- [ ] Refund processing

**Integration Tests** (Test Mode):

- [ ] Successful payment flow
- [ ] Declined card handling
- [ ] Webhook signature verification
- [ ] Email sent after payment

**Test Cards**:

- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Auth required: `4000 0025 0000 3155`

### Calendar Export Testing (Phase 2)

**Manual Tests**:

- [ ] .ics file downloads
- [ ] Import to Apple Calendar works
- [ ] Import to Google Calendar works
- [ ] Import to Outlook works
- [ ] Timezone displays correctly
- [ ] Special characters handled

---

## Phased Rollout Plan

### Phase 1: MVP (Week 1) - FREE EVENTS ONLY

**Goal**: Launch with free community events, manual payment collection for paid events

**Integrations**:

- ✅ Resend email confirmations (critical)
- ✅ Basic registration (free events only)
- ⏭️ Defer: Stripe, Calendar export, Google Calendar

**MVP Workaround for Paid Events**: "Contact us to register and pay" button

**Why this works**:

- Contact form already uses Resend (proven working)
- Manual payment acceptable for early paid events
- Faster time to launch
- Can validate event demand before building payment infrastructure

**Success Criteria**:

- [ ] Users can register for free events
- [ ] Confirmation emails sent successfully
- [ ] Registration data stored correctly
- [ ] Admin can view registrations

---

### Phase 2: Enhanced Features (Week 2)

**Goal**: Add paid events and better UX

**Integrations**:

- ✅ Stripe payment integration (if paid events confirmed)
- ✅ Calendar export (.ics files)
- ✅ Enhanced email templates

**Decision Point**: Implement Stripe only if:

- First paid event is scheduled, OR
- Manual payment collection becomes bottleneck

**Success Criteria**:

- [ ] Users can pay for events via Stripe
- [ ] Users can download .ics calendar files
- [ ] Payment confirmations sent automatically
- [ ] Refunds processed correctly

---

### Phase 3: Advanced Features (Week 3+)

**Goal**: Polish and automation

**Integrations**:

- ⏭️ Google Calendar sync (if still needed after .ics export)
- ⏭️ Event reminders (24h before event)
- ⏭️ Waitlist notifications
- ⏭️ Analytics and reporting

**Success Criteria**:

- [ ] Automated reminders sent
- [ ] Waitlist notifications working
- [ ] Analytics dashboard showing registration trends

---

## Environment Variables Reference

### Phase 1: MVP (Required)

```bash
# Resend Email (ALREADY CONFIGURED)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=contact@thereikigoddesshealing.com
CONTACT_EMAIL=thereikigoddesshealing@gmail.com

# Node Environment
NODE_ENV=development  # or production
```

**Notes**:

- No new variables needed for MVP!
- Reuse existing Contact form configuration
- `RESEND_API_KEY` is server-side only (no `VITE_` prefix)

### Phase 2: Stripe Addition (If Needed)

```bash
# Stripe Payments (TEST MODE FIRST)
STRIPE_SECRET_KEY=sk_test_...              # Server-side only
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...    # Frontend-exposed
STRIPE_WEBHOOK_SECRET=whsec_...            # Webhook signature verification

# Production Stripe (when ready)
STRIPE_SECRET_KEY=sk_live_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Security Rules**:

- ✅ `STRIPE_SECRET_KEY` is server-side only (no `VITE_` prefix)
- ✅ `VITE_STRIPE_PUBLISHABLE_KEY` can be exposed (frontend)
- ✅ Never commit actual keys to git
- ✅ Use separate keys for test/production

### Phase 3: Google Calendar (If Needed)

```bash
# Google Calendar (Service Account approach)
GOOGLE_SERVICE_ACCOUNT_EMAIL=events@project-id.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_CALENDAR_ID=primary
```

**Notes**:

- Only needed if Google Calendar API is implemented (unlikely)
- Service Account is simpler than OAuth
- Private key must include literal `\n` characters

---

## Security Checklist

### API Key Protection

- [ ] All secret keys in environment variables (not code)
- [ ] Server-side keys have no `VITE_` prefix
- [ ] `.env.local` in `.gitignore`
- [ ] Keys rotated quarterly
- [ ] Separate keys for dev/staging/production

### Email Security

- [ ] Domain verified in Resend dashboard
- [ ] SPF/DKIM/DMARC records configured
- [ ] Rate limiting in place (reuse Contact form pattern)
- [ ] No sensitive data in email templates

### Payment Security (Phase 2+)

- [ ] Stripe Checkout used (PCI compliant)
- [ ] Webhook signatures verified
- [ ] No card data stored locally
- [ ] Refund policy implemented

---

## Lessons Learned from V1

**What NOT to do** (from Events Page Attempt 1 Postmortem):

❌ **TODO Comments Instead of Implementation**

```typescript
// TODO: Implement Stripe integration
// TODO: Send email via Resend
```

✅ **Working Code or Explicit Deferral**

```typescript
// Phase 2: Stripe deferred (free events only in MVP)
// See: /docs/design/events-page/integration-points.md#stripe-payment-integration
```

❌ **Backend "Done" Without Frontend Planning**

✅ **Integration Points Documented Before Implementation**

- Email templates specified
- API contracts defined
- Frontend integration patterns provided

❌ **All Integrations at Once**

✅ **Phased Rollout**

- Phase 1: Essential (Resend)
- Phase 2: Enhanced (Stripe, .ics)
- Phase 3: Nice-to-have (Google Calendar)

---

## Success Criteria

### Phase 1 (MVP) Success

- ✅ Users receive confirmation emails after registration
- ✅ Email templates are brand-compliant
- ✅ No TODO comments in email service code
- ✅ Free events fully functional
- ✅ Paid events have clear "Contact us" path

### Phase 2 Success

- ✅ Stripe checkout flow works end-to-end
- ✅ Payment confirmations sent automatically
- ✅ .ics files download correctly
- ✅ Refunds processed successfully

### Phase 3 Success

- ✅ Event reminders sent 24h before
- ✅ Waitlist notifications working
- ✅ Analytics tracking registration trends

---

## Related Documentation

- `/docs/archive/events-page-attempt-1-postmortem.md` - What went wrong in V1
- `/plans/events-management-v2/00-approach-decision.md` - V2 implementation strategy
- `/docs/design/resend-integration-plan.md` - Contact form Resend implementation
- `/apps/main/api/contact.ts` - Working Resend example
- `/docs/design/contact-resend-integration/api-architecture.md` - Resend API details

---

**Document Status**: Ready for Implementation
**Next Step**: Begin Phase 1 (Resend email service for events)
**Decision Required**: Are paid events planned for MVP? (Determines Stripe timeline)
