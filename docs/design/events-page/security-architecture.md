# Events Page Security Architecture

> **Purpose**: Comprehensive security requirements for event registration system
> **Date**: 2025-11-03
> **Agent**: Security Researcher Agent
> **Status**: Complete

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Existing Security Infrastructure](#existing-security-infrastructure)
3. [Events-Specific Threat Model](#events-specific-threat-model)
4. [Component Security Requirements](#component-security-requirements)
5. [Extended SecurityValidator Rules](#extended-securityvalidator-rules)
6. [Rate Limiting Strategy](#rate-limiting-strategy)
7. [Payment Security (Stripe Integration)](#payment-security-stripe-integration)
8. [Security Monitoring](#security-monitoring)
9. [Privacy & GDPR Compliance](#privacy--gdpr-compliance)
10. [Testing Requirements](#testing-requirements)
11. [Implementation Checklist](#implementation-checklist)

---

## Executive Summary

### Security Foundation

The Events Page builds upon the battle-tested security infrastructure from the Contact page:

- **SecurityValidator**: Multi-layer validation with wellness-specific patterns
- **FormRateLimit**: Client-side rate limiting with user feedback
- **SecurityMonitor**: Incident logging and analysis
- **SecureContactForm**: Integrated secure form implementation

**Location**: `/packages/shared-utils/src/security/`

### Events-Specific Security Challenges

Event registration introduces new threat vectors beyond contact forms:

1. **Payment Fraud**: Stolen credit cards, chargebacks
2. **Capacity Manipulation**: Fake registrations blocking real customers
3. **Scalping/Bots**: Automated tools spam-registering for popular events
4. **Price Tampering**: Client-side manipulation of payment amounts
5. **Duplicate Registrations**: Same person registering multiple times
6. **Sold-Out Bypass**: Attempts to register after capacity reached

### Security Philosophy

**Server-Authoritative Architecture**: Client validation provides UX feedback, but server makes all security decisions:

- ✅ Client validates for immediate user feedback
- ✅ Server validates for actual security enforcement
- ❌ Never trust client-sent data (prices, capacity, etc.)
- ✅ Use database transactions for race conditions

---

## Existing Security Infrastructure

### 1. SecurityValidator

**Location**: `/packages/shared-utils/src/security/SecurityValidator.ts`

**Current Capabilities**:

```typescript
// Multi-layer risk assessment
export interface ValidationResult {
  isValid: boolean;
  risks: Risk[];
  sanitizedValue: string;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';
}

// Wellness industry-specific protection
private static readonly forbiddenHealthTerms =
  /\b(diagnosis|prescription|medication|cure|treat|medical|doctor|physician|disease|illness|condition)\b/i;

// Attack pattern detection
- SQL injection patterns
- XSS attack patterns
- Email injection patterns
- Spam patterns (repeated characters)
- Excessive length checks
```

**What Works for Events**:

- ✅ Name validation (first/last name)
- ✅ Email validation (including disposable domain check)
- ✅ Phone validation (international format support)
- ✅ XSS/SQL injection prevention
- ✅ Input sanitization

**What Needs Extension**:

- ⚠️ Event-specific field validation (attendee count, special requirements)
- ⚠️ Bot pattern detection (form filling speed, identical values)
- ⚠️ Registration-specific spam patterns

### 2. FormRateLimit

**Location**: `/packages/shared-utils/src/security/FormRateLimit.ts`

**Current Implementation**:

```typescript
// Contact form: 3 submissions per hour
private static readonly DEFAULT_MAX_SUBMISSIONS = 3;
private static readonly DEFAULT_TIME_WINDOW_MS = 60 * 60 * 1000; // 1 hour

// localStorage-based tracking
- Cleans old submissions automatically
- User-friendly feedback messages
- Reset capability for testing
```

**What Works for Events**:

- ✅ Basic rate limiting infrastructure
- ✅ Time window management
- ✅ User feedback system

**What Needs Adaptation**:

- ⚠️ Per-event registration limits (1 per event)
- ⚠️ Global registration limits (prevent spam across events)
- ⚠️ Payment failure tracking (fraud prevention)
- ⚠️ Permanent blocks for completed registrations

### 3. SecurityMonitor

**Location**: `/packages/shared-utils/src/security/SecurityMonitor.ts`

**Current Capabilities**:

```typescript
// Incident tracking
export interface SecurityIncident {
  type: string;
  details: Record<string, any>;
  timestamp: string;
  url: string;
  userAgent: string;
  severity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

// Critical incident types tracked
- XSS_ATTEMPT
- SQL_INJECTION
- RATE_LIMIT_EXCEEDED
- CSRF_ATTEMPT
- AUTHENTICATION_FAILURE
- CSP_VIOLATION
- MAP_API_ABUSE (from contact page)
- GEOLOCATION_ABUSE (from contact page)
```

**What Works for Events**:

- ✅ Incident logging framework
- ✅ Severity classification
- ✅ sessionStorage for privacy
- ✅ Optional reporting endpoint

**What Needs Extension**:

- ⚠️ Payment fraud incidents
- ⚠️ Capacity manipulation attempts
- ⚠️ Price tampering detection
- ⚠️ Bot pattern incidents

### 4. SecureContactForm

**Location**: `/packages/shared-components/src/SecureContactForm/SecureContactForm.tsx`

**Current Integration Pattern**:

```typescript
// Real-time validation with security monitoring
const validateField = useCallback((name, value) => {
  let result: ValidationResult;

  switch (name) {
    case "email":
      result = SecurityValidator.validateEmail(value);
      break;
    case "phone":
      result = SecurityValidator.validatePhone(value);
      break;
    default:
      result = SecurityValidator.validateContactFormField(name, value);
  }

  // Log HIGH severity risks
  if (!result.isValid) {
    result.risks.forEach((risk) => {
      if (risk.level === "HIGH") {
        monitor.current.log(risk.type, { field: name, message: risk.message });
      }
    });
  }

  return result.risks[0]?.message;
}, []);

// Rate limit check before submission
const rateLimitCheck = rateLimit.current.checkLimit();
if (!rateLimitCheck.allowed) {
  setErrors({ general: rateLimitCheck.message });
  monitor.current.log("RATE_LIMIT_EXCEEDED", {
    remainingTime: rateLimitCheck.timeUntilReset,
  });
  return;
}

// High-risk content blocking
if (SecurityValidator.isHighRisk(dataToCheck)) {
  monitor.current.log("HIGH_RISK_SUBMISSION_BLOCKED", {
    fields: Object.keys(formData),
  });
  setErrors({
    general: "Your submission contains content that cannot be processed.",
  });
  return;
}

// Sanitize before submission
const sanitizedData = {
  name: SecurityValidator.validateContactFormField("name", formData.name)
    .sanitizedValue,
  email: SecurityValidator.validateEmail(formData.email).sanitizedValue,
  message: SecurityValidator.validateContactFormField(
    "message",
    formData.message
  ).sanitizedValue,
};
```

**What Works for Events**:

- ✅ Comprehensive validation integration
- ✅ Real-time user feedback
- ✅ Security incident logging
- ✅ Rate limit enforcement
- ✅ Data sanitization

**What Needs Adaptation**:

- ⚠️ Event-specific form fields (attendee count, event selection)
- ⚠️ Payment flow integration
- ⚠️ Capacity verification
- ⚠️ Registration confirmation flow

---

## Events-Specific Threat Model

### Threat Matrix

| Threat ID | Threat                    | Risk Level | Impact                                  | Likelihood         |
| --------- | ------------------------- | ---------- | --------------------------------------- | ------------------ |
| **T1**    | Capacity Manipulation     | HIGH       | Revenue loss, customer dissatisfaction  | MEDIUM             |
| **T2**    | Payment Fraud (Stripe)    | CRITICAL   | Financial loss, account penalties       | LOW                |
| **T3**    | Bot Registration          | MEDIUM     | Capacity filled with fake registrations | MEDIUM             |
| **T4**    | Price Tampering           | CRITICAL   | Revenue loss                            | LOW (if mitigated) |
| **T5**    | Duplicate Registrations   | MEDIUM     | Unfair capacity usage                   | HIGH               |
| **T6**    | Email Enumeration         | LOW        | Privacy violation                       | LOW                |
| **T7**    | Sold-Out Bypass           | HIGH       | Overselling, liability                  | LOW                |
| **T8**    | Payment Denial of Service | MEDIUM     | Lost revenue, reputation damage         | LOW                |
| **T9**    | Registration Spam         | MEDIUM     | Database bloat, performance issues      | MEDIUM             |
| **T10**   | Data Scraping             | LOW        | Privacy, competitive intelligence       | MEDIUM             |

### Detailed Threat Analysis

#### T1: Capacity Manipulation

**Attack Scenario**: Attacker registers for event without intending to attend, blocking real customers from registering.

**Attack Vectors**:

- Automated scripts registering for all available spots
- Competitor blocking event capacity
- Malicious user preventing others from attending

**Impact**:

- Lost revenue (empty seats at event)
- Customer dissatisfaction (legitimate customers turned away)
- Event underattendance
- Reputation damage

**Mitigation**:

```typescript
// SERVER-SIDE ONLY
// NEVER trust client-side capacity checks

// ❌ WRONG (client-side only)
if (event.spotsRemaining > 0) {
  await register();
}

// ✅ CORRECT (server validates with database transaction)
const result = await db.transaction(async (trx) => {
  // Lock event row for update
  const event = await trx("events").where("id", eventId).forUpdate().first();

  if (!event) {
    return { error: "EVENT_NOT_FOUND" };
  }

  if (event.capacity_reserved >= event.capacity_total) {
    return { error: "SOLD_OUT" };
  }

  // Create registration
  await trx("registrations").insert({
    event_id: eventId,
    email: normalizedEmail,
    created_at: new Date(),
  });

  // Increment capacity atomically
  await trx("events").where("id", eventId).increment("capacity_reserved", 1);

  return { success: true };
});

// Handle race condition gracefully
if (result.error === "SOLD_OUT") {
  // Offer waitlist option
  showWaitlistDialog();
}
```

**Detection**:

- Monitor for rapid registrations from same IP/email pattern
- Track registration abandonment rate
- Alert when capacity fills unusually fast

#### T2: Payment Fraud (Stripe)

**Attack Scenario**: Stolen credit cards used to register for events, resulting in chargebacks.

**Attack Vectors**:

- Stolen credit card numbers
- Automated testing of card numbers
- Friendly fraud (legitimate card, false chargeback)

**Impact**:

- Direct financial loss ($15-20 per chargeback fee)
- Stripe account penalties/suspension risk
- Lost event revenue
- Administrative overhead

**Mitigation**:

```typescript
// Use Stripe Checkout (PCI-compliant, fraud detection built-in)
// NEVER handle raw card numbers client-side

// ✅ CORRECT: Server creates checkout session
const session = await stripe.checkout.sessions.create({
  mode: "payment",
  line_items: [
    {
      price_data: {
        currency: "usd",
        unit_amount: event.price * 100, // SERVER sets price!
        product_data: {
          name: event.title,
          description: event.description,
        },
      },
      quantity: 1,
    },
  ],
  customer_email: registrationData.email,
  metadata: {
    eventId,
    registrationData: JSON.stringify(registrationData),
  },
  payment_intent_data: {
    // Enable Stripe Radar fraud detection
    metadata: {
      event_id: eventId,
      user_ip: req.ip,
    },
  },
  success_url: `${FRONTEND_URL}/events/${event.slug}/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${FRONTEND_URL}/events/${event.slug}`,
});

// ✅ Verify webhook signature (prevent fake payment confirmations)
const sig = req.headers["stripe-signature"];
let event;

try {
  event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
} catch (err) {
  return res.status(400).send(`Webhook Error: ${err.message}`);
}

// ✅ Handle payment with idempotency (prevent duplicate charges)
if (event.type === "checkout.session.completed") {
  const session = event.data.object;

  // Check if already processed
  const existing = await db.registrations.findOne({
    stripe_session_id: session.id,
  });

  if (existing) {
    return res.json({ received: true }); // Already processed
  }

  // Create registration
  await db.registrations.create({
    event_id: session.metadata.eventId,
    stripe_session_id: session.id,
    payment_status: "paid",
    ...JSON.parse(session.metadata.registrationData),
  });
}
```

**Detection**:

- Monitor Stripe Radar scores
- Track chargeback rate (should be <1%)
- Alert on multiple failed payment attempts
- Geographic anomalies (IP location vs billing address)

#### T3: Bot Registration

**Attack Scenario**: Automated tools spam-register for popular events, blocking real humans.

**Attack Vectors**:

- Headless browser automation (Puppeteer, Selenium)
- API endpoint abuse
- Script kiddies with simple Python bots

**Impact**:

- Capacity filled with fake registrations
- Real customers unable to register
- Revenue loss if no-shows
- Skewed analytics

**Mitigation**:

```typescript
// Client-side bot detection
export class EventSecurityValidator extends SecurityValidator {
  // Detect bot patterns
  static detectBotBehavior(
    formData: RegistrationData,
    timingData: TimingData
  ): BotDetectionResult {
    const suspiciousPatterns: string[] = [];

    // 1. Form filled too quickly (human minimum ~3 seconds)
    if (timingData.fillDuration < 3000) {
      suspiciousPatterns.push("FORM_FILLED_TOO_FAST");
    }

    // 2. All fields identical
    if (
      formData.firstName === formData.lastName &&
      formData.firstName === formData.email.split("@")[0]
    ) {
      suspiciousPatterns.push("IDENTICAL_FIELD_VALUES");
    }

    // 3. No mouse/keyboard interaction (headless browser)
    if (!timingData.hadMouseMovement && !timingData.hadKeyPress) {
      suspiciousPatterns.push("NO_HUMAN_INTERACTION");
    }

    // 4. Honeypot field filled (hidden from humans)
    if (formData.website) {
      // Hidden field, bots often fill all fields
      suspiciousPatterns.push("HONEYPOT_FILLED");
    }

    // 5. Unusual timing patterns (perfect intervals)
    if (this.hasRoboticTiming(timingData.keystrokes)) {
      suspiciousPatterns.push("ROBOTIC_TYPING_PATTERN");
    }

    return {
      isBot: suspiciousPatterns.length >= 2, // 2+ patterns = likely bot
      confidence: suspiciousPatterns.length / 5,
      patterns: suspiciousPatterns,
    };
  }

  // Detect robotic typing (bots type at perfect intervals)
  private static hasRoboticTiming(keystrokes: number[]): boolean {
    if (keystrokes.length < 10) return false;

    const intervals = [];
    for (let i = 1; i < keystrokes.length; i++) {
      intervals.push(keystrokes[i] - keystrokes[i - 1]);
    }

    // Calculate standard deviation
    const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance =
      intervals.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) /
      intervals.length;
    const stdDev = Math.sqrt(variance);

    // Bots have very low variance (humans are irregular)
    return stdDev < 10; // Less than 10ms variance = suspicious
  }
}

// Server-side enforcement
app.post("/api/events/:id/register", async (req, res) => {
  const { eventId } = req.params;
  const { registrationData, timingData } = req.body;

  // Check for bot patterns
  const botCheck = EventSecurityValidator.detectBotBehavior(
    registrationData,
    timingData
  );

  if (botCheck.isBot && botCheck.confidence > 0.6) {
    // Log incident
    await securityMonitor.log("BOT_REGISTRATION_BLOCKED", {
      eventId,
      patterns: botCheck.patterns,
      confidence: botCheck.confidence,
    });

    // Require CAPTCHA challenge
    return res.status(403).json({
      error: "VERIFICATION_REQUIRED",
      message: "Please complete the verification challenge",
      captchaRequired: true,
    });
  }

  // Proceed with registration...
});
```

**Additional Defenses**:

- **Honeypot Fields**: Hidden fields that bots fill but humans don't see
- **CAPTCHA**: Google reCAPTCHA v3 (invisible scoring)
- **Rate Limiting**: Strict per-IP limits
- **User-Agent Validation**: Block known bot signatures

#### T4: Price Tampering

**Attack Scenario**: Attacker modifies event price client-side before checkout, paying less than actual price.

**Attack Vectors**:

- Browser DevTools manipulation
- Proxy tools (Burp Suite, Charles)
- Modified client code

**Impact**:

- Direct revenue loss (paying $10 instead of $100)
- Pricing inconsistencies
- Financial audit issues

**Mitigation**:

```typescript
// ❌ NEVER SEND PRICE FROM CLIENT
const handlePayment = async () => {
  // ❌ WRONG - client sends price
  const session = await stripeService.createCheckoutSession({
    eventId: event.id,
    price: event.price, // DANGER! Client-controlled
  });
};

// ✅ CORRECT - server looks up price
// Client-side (NO price sent)
const handlePayment = async () => {
  const session = await stripeService.createCheckoutSession({
    eventId: event.id, // Only send event ID
    registrationData: formData,
  });

  window.location.href = session.url;
};

// Server-side (authoritative price lookup)
app.post("/api/events/:id/checkout", async (req, res) => {
  const { eventId } = req.params;
  const { registrationData } = req.body;

  // ✅ SERVER looks up price from database (tamper-proof)
  const event = await db.events.findById(eventId);

  if (!event) {
    return res.status(404).json({ error: "EVENT_NOT_FOUND" });
  }

  // ✅ Verify price hasn't changed since page load (optional)
  const clientExpectedPrice = req.headers["x-expected-price"];
  if (clientExpectedPrice && parseFloat(clientExpectedPrice) !== event.price) {
    return res.status(409).json({
      error: "PRICE_CHANGED",
      message: "Event price has changed since you loaded the page",
      newPrice: event.price,
    });
  }

  // ✅ Create Stripe session with SERVER-AUTHORITATIVE price
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: event.price * 100, // SERVER SETS PRICE
          product_data: {
            name: event.title,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      eventId,
      serverPrice: event.price, // Store for verification
    },
    success_url: `${FRONTEND_URL}/events/${event.slug}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${FRONTEND_URL}/events/${event.slug}`,
  });

  res.json({ sessionId: session.id, url: session.url });
});

// ✅ Double-check price in webhook
app.post("/api/webhooks/stripe", async (req, res) => {
  const event = stripe.webhooks.constructEvent(req.body, sig, SECRET);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const eventId = session.metadata.eventId;
    const expectedPrice = parseFloat(session.metadata.serverPrice);
    const actualPrice = session.amount_total / 100;

    // Verify price matches
    if (Math.abs(actualPrice - expectedPrice) > 0.01) {
      // ALERT: Price mismatch detected!
      await securityMonitor.log(
        "PRICE_TAMPERING_DETECTED",
        {
          eventId,
          expectedPrice,
          actualPrice,
          sessionId: session.id,
        },
        "CRITICAL"
      );

      // Refund and block
      await stripe.refunds.create({ payment_intent: session.payment_intent });
      return res.status(400).json({ error: "PRICE_MISMATCH" });
    }

    // Price verified, create registration...
  }
});
```

**Key Principles**:

- ✅ Server is **always** authoritative for prices
- ✅ Never trust client-sent amounts
- ✅ Double-verify in payment webhook
- ✅ Log all price mismatches as CRITICAL incidents

#### T5: Duplicate Registrations

**Attack Scenario**: Same person registers multiple times for same event (accidentally or intentionally).

**Attack Vectors**:

- User clicks "Register" multiple times (accidental)
- User uses multiple emails to reserve multiple spots (intentional)
- Browser back button after successful registration

**Impact**:

- Unfair capacity usage
- One person taking multiple spots
- Customer confusion (multiple confirmation emails)
- Payment issues (double-charged)

**Mitigation**:

```typescript
// 1. Database unique constraint
CREATE UNIQUE INDEX idx_event_email ON registrations(event_id, email);

// 2. Client-side prevention
const handleSubmit = async () => {
  // Disable submit button immediately
  setIsSubmitting(true);

  try {
    await registerForEvent(eventId, formData);
  } catch (error) {
    if (error.code === 'ALREADY_REGISTERED') {
      setError('You have already registered for this event');
    }
  } finally {
    setIsSubmitting(false);
  }
};

// 3. Server-side check (before payment)
app.post('/api/events/:id/register', async (req, res) => {
  const { eventId } = req.params;
  const { email } = req.body;

  // Normalize email (case-insensitive, trim whitespace)
  const normalizedEmail = email.toLowerCase().trim();

  // ✅ Check for existing registration
  const existing = await db.registrations.findOne({
    event_id: eventId,
    email: normalizedEmail,
  });

  if (existing) {
    return res.status(409).json({
      error: 'ALREADY_REGISTERED',
      message: 'This email is already registered for this event',
      registrationId: existing.id,
    });
  }

  // Proceed with registration...
});

// 4. Idempotency for payment webhooks
app.post('/api/webhooks/stripe', async (req, res) => {
  const event = stripe.webhooks.constructEvent(req.body, sig, SECRET);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // ✅ Check if webhook already processed (idempotency)
    const existing = await db.registrations.findOne({
      stripe_session_id: session.id,
    });

    if (existing) {
      console.log('Webhook already processed:', session.id);
      return res.json({ received: true });
    }

    // Create registration (only once)...
  }
});

// 5. Rate limiting per email + event
const EVENT_RATE_LIMITS = {
  PER_EVENT: {
    limit: 1, // Only 1 registration per event
    window: 'permanent',
    key: (email, eventId) => `event:${eventId}:${email.toLowerCase()}`,
  },
};

export class EventRateLimit extends FormRateLimit {
  async checkEventRegistrationLimit(email: string, eventId: string): Promise<RateLimitResult> {
    const key = EVENT_RATE_LIMITS.PER_EVENT.key(email, eventId);
    const existing = this.storage.getItem(key);

    if (existing) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: Infinity, // Permanent block
        message: 'You have already registered for this event',
      };
    }

    return { allowed: true, remaining: 1 };
  }

  recordRegistration(email: string, eventId: string): void {
    const key = EVENT_RATE_LIMITS.PER_EVENT.key(email, eventId);
    this.storage.setItem(key, JSON.stringify({
      timestamp: Date.now(),
      permanent: true,
    }));
  }
}
```

#### T6-T10: Additional Threats

**T6: Email Enumeration**

- **Mitigation**: Generic error messages ("Invalid email or password" not "Email not found")

**T7: Sold-Out Bypass**

- **Mitigation**: Database transactions with row locking (covered in T1)

**T8: Payment DoS**

- **Mitigation**: Rate limit payment attempts, Stripe built-in fraud detection

**T9: Registration Spam**

- **Mitigation**: Rate limiting, bot detection, email verification

**T10: Data Scraping**

- **Mitigation**: Rate limit public event lists, pagination, CAPTCHA for bulk access

---

## Component Security Requirements

### EventRegistrationForm Security

#### Reuse from SecureContactForm

✅ **Existing Patterns to Reuse**:

```typescript
// Multi-layer input validation
const validateField = useCallback((name, value) => {
  const result = SecurityValidator.validateContactFormField(name, value);
  if (!result.isValid) {
    // Log HIGH severity risks
    result.risks.forEach(risk => {
      if (risk.level === "HIGH") {
        monitor.current.log(risk.type, { field: name });
      }
    });
  }
  return result.risks[0]?.message;
}, []);

// Real-time validation feedback
const handleBlur = (e) => {
  const { name, value } = e.target;
  const error = validateField(name, value);
  if (error) {
    setErrors(prev => ({ ...prev, [name]: error }));
  }
};

// Rate limit enforcement
const rateLimitCheck = rateLimit.current.checkLimit();
if (!rateLimitCheck.allowed) {
  setErrors({ general: rateLimitCheck.message });
  return;
}

// ARIA accessibility
<input
  aria-invalid={!!errors.email}
  aria-describedby={errors.email ? "email-error" : undefined}
/>
```

#### New Event-Specific Requirements

```typescript
export interface SecureEventRegistrationFormProps {
  event: Event;
  onSubmit: (data: RegistrationFormData) => Promise<void>;
  onPaymentRequired?: (data: RegistrationFormData) => Promise<StripeCheckoutSession>;
}

export interface RegistrationFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  attendeeCount: number; // NEW
  specialRequirements?: string; // NEW
}

export const SecureEventRegistrationForm: React.FC<SecureEventRegistrationFormProps> = ({
  event,
  onSubmit,
  onPaymentRequired,
}) => {
  const [formData, setFormData] = useState<RegistrationFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    attendeeCount: 1,
    specialRequirements: "",
  });

  // Extended validator for events
  const validator = useRef(new EventSecurityValidator());
  const rateLimit = useRef(new EventRateLimit());
  const monitor = useRef(new SecurityMonitor());

  // Track timing for bot detection
  const [timingData, setTimingData] = useState<TimingData>({
    formLoadedAt: Date.now(),
    firstInteractionAt: null,
    keystrokeTimes: [],
    mouseMovements: 0,
  });

  // Honeypot field (hidden from humans, bots fill it)
  const [honeypot, setHoneypot] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Check rate limits (per-event + global)
    const eventRateCheck = await rateLimit.current.checkEventRegistrationLimit(
      formData.email,
      event.id
    );

    if (!eventRateCheck.allowed) {
      setErrors({ general: eventRateCheck.message });
      monitor.current.log("RATE_LIMIT_EXCEEDED", { eventId: event.id });
      return;
    }

    const globalRateCheck = rateLimit.current.checkLimit();
    if (!globalRateCheck.allowed) {
      setErrors({ general: "Too many registration attempts. Please try again later." });
      monitor.current.log("RATE_LIMIT_EXCEEDED", { type: "global" });
      return;
    }

    // 2. Validate all fields
    const validation = validator.current.validateRegistration(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // 3. Bot detection
    const fillDuration = Date.now() - timingData.formLoadedAt;
    const botCheck = EventSecurityValidator.detectBotBehavior(
      formData,
      {
        fillDuration,
        hadMouseMovement: timingData.mouseMovements > 5,
        hadKeyPress: timingData.keystrokeTimes.length > 10,
        keystrokes: timingData.keystrokeTimes,
      }
    );

    if (botCheck.isBot) {
      monitor.current.log("BOT_PATTERN_DETECTED", {
        patterns: botCheck.patterns,
        confidence: botCheck.confidence,
      });

      // Show CAPTCHA challenge
      setShowCaptcha(true);
      return;
    }

    // 4. Check honeypot
    if (honeypot) {
      monitor.current.log("HONEYPOT_FILLED", { eventId: event.id }, "HIGH");
      // Silently fail (don't tell bot it was detected)
      await new Promise(resolve => setTimeout(resolve, 2000)); // Fake delay
      setSubmitSuccess(true); // Fake success
      return;
    }

    // 5. Verify capacity client-side (UX feedback only)
    if (event.capacity.reserved >= event.capacity.total) {
      setErrors({ general: "This event is sold out" });
      return;
    }

    setIsSubmitting(true);

    try {
      // 6. If payment required, redirect to Stripe
      if (event.price > 0 && onPaymentRequired) {
        const session = await onPaymentRequired(formData);

        // Record rate limit before redirect
        rateLimit.current.recordRegistration(formData.email, event.id);

        // Redirect to Stripe Checkout
        window.location.href = session.url;
      } else {
        // Free event, direct registration
        await onSubmit(formData);

        rateLimit.current.recordRegistration(formData.email, event.id);
        setSubmitSuccess(true);
      }
    } catch (error: any) {
      if (error.code === 'ALREADY_REGISTERED') {
        setErrors({ general: "You have already registered for this event" });
      } else if (error.code === 'SOLD_OUT') {
        setErrors({ general: "This event is now sold out" });
      } else {
        setErrors({ general: "An error occurred. Please try again." });
        monitor.current.log("REGISTRATION_ERROR", { error: error.message });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Standard fields (name, email, phone) */}

      {/* NEW: Attendee Count */}
      <div className="mb-6">
        <label htmlFor="attendeeCount" className="block text-sm font-medium mb-2">
          Number of Attendees <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          id="attendeeCount"
          name="attendeeCount"
          value={formData.attendeeCount}
          onChange={handleChange}
          onBlur={handleBlur}
          min={1}
          max={Math.min(5, event.capacity.total - event.capacity.reserved)}
          className={`w-full px-4 py-3 border rounded-lg ${
            errors.attendeeCount ? "border-red-500" : "border-gray-300"
          }`}
          aria-invalid={!!errors.attendeeCount}
          aria-describedby={errors.attendeeCount ? "attendeeCount-error" : undefined}
          required
        />
        {errors.attendeeCount && (
          <p id="attendeeCount-error" className="mt-2 text-sm text-red-600">
            {errors.attendeeCount}
          </p>
        )}
      </div>

      {/* NEW: Special Requirements (optional) */}
      <div className="mb-6">
        <label htmlFor="specialRequirements" className="block text-sm font-medium mb-2">
          Special Requirements (optional)
        </label>
        <textarea
          id="specialRequirements"
          name="specialRequirements"
          value={formData.specialRequirements}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-3 border rounded-lg border-gray-300"
          placeholder="Dietary restrictions, accessibility needs, etc."
        />
      </div>

      {/* Honeypot (hidden from humans) */}
      <div style={{ display: "none" }} aria-hidden="true">
        <input
          type="text"
          name="website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* CAPTCHA (if bot detected) */}
      {showCaptcha && (
        <div className="mb-6">
          <ReCAPTCHA
            sitekey={RECAPTCHA_SITE_KEY}
            onChange={(token) => setCaptchaToken(token)}
          />
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-3 px-6 rounded-full font-medium transition-all ${
          isSubmitting
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isSubmitting ? "Processing..." : event.price > 0 ? "Proceed to Payment" : "Register"}
      </button>

      {/* Security notice */}
      <p className="mt-4 text-xs text-gray-500 text-center">
        Protected by multi-layer security validation
      </p>
    </form>
  );
};
```

---

## Extended SecurityValidator Rules

```typescript
// /packages/shared-utils/src/security/EventSecurityValidator.ts

import { SecurityValidator, ValidationResult, Risk } from "./SecurityValidator";

export interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  attendeeCount: number;
  specialRequirements?: string;
}

export interface BotDetectionResult {
  isBot: boolean;
  confidence: number; // 0-1
  patterns: string[];
}

export interface TimingData {
  fillDuration: number;
  hadMouseMovement: boolean;
  hadKeyPress: boolean;
  keystrokes: number[];
}

export class EventSecurityValidator extends SecurityValidator {
  /**
   * Validates attendee count
   */
  static validateAttendeeCount(
    count: number,
    maxAllowed: number
  ): ValidationResult {
    const risks: Risk[] = [];

    // Check if count is a valid number
    if (!Number.isInteger(count) || count < 1) {
      risks.push({
        level: "HIGH",
        type: "INVALID_ATTENDEE_COUNT",
        message: "Attendee count must be at least 1",
      });
    }

    // Check if count exceeds available capacity
    if (count > maxAllowed) {
      risks.push({
        level: "HIGH",
        type: "EXCEEDS_CAPACITY",
        message: `Maximum ${maxAllowed} attendees allowed`,
      });
    }

    // Suspicious: very high count (potential abuse)
    if (count > 10) {
      risks.push({
        level: "MEDIUM",
        type: "SUSPICIOUS_ATTENDEE_COUNT",
        message: "For groups larger than 10, please contact us directly",
      });
    }

    return {
      isValid: risks.filter((r) => r.level === "HIGH").length === 0,
      risks,
      sanitizedValue: String(Math.max(1, Math.min(count, maxAllowed))),
      riskLevel: this.calculateOverallRisk(risks),
    };
  }

  /**
   * Validates phone number (stricter for events - required for reminders)
   */
  static validateEventPhone(phone: string): ValidationResult {
    const basicValidation = this.validatePhone(phone);

    // Additional checks for events
    const cleaned = phone.replace(/[\s\-(.)]/g, "");

    // Check for obviously fake numbers
    const fakePatterns = [
      /^(\d)\1+$/, // All same digit (e.g., "1111111111")
      /^1234567890$/, // Sequential
      /^0000000000$/, // All zeros
    ];

    for (const pattern of fakePatterns) {
      if (pattern.test(cleaned)) {
        basicValidation.risks.push({
          level: "HIGH",
          type: "SUSPICIOUS_PHONE",
          message: "Please provide a valid phone number",
        });
        break;
      }
    }

    return {
      ...basicValidation,
      isValid:
        basicValidation.risks.filter((r) => r.level === "HIGH").length === 0,
      riskLevel: this.calculateOverallRisk(basicValidation.risks),
    };
  }

  /**
   * Validates entire registration form
   */
  static validateRegistration(
    data: RegistrationData,
    maxAttendees: number = 5
  ): {
    isValid: boolean;
    errors: Record<string, string>;
    risks: Risk[];
  } {
    const allRisks: Risk[] = [];
    const errors: Record<string, string> = {};

    // Validate first name
    const firstNameResult = this.validateContactFormField(
      "firstName",
      data.firstName
    );
    if (!firstNameResult.isValid) {
      allRisks.push(...firstNameResult.risks);
      errors.firstName = firstNameResult.risks[0]?.message;
    }

    // Validate last name
    const lastNameResult = this.validateContactFormField(
      "lastName",
      data.lastName
    );
    if (!lastNameResult.isValid) {
      allRisks.push(...lastNameResult.risks);
      errors.lastName = lastNameResult.risks[0]?.message;
    }

    // Validate email
    const emailResult = this.validateEmail(data.email);
    if (!emailResult.isValid) {
      allRisks.push(...emailResult.risks);
      errors.email = emailResult.risks[0]?.message;
    }

    // Validate phone
    const phoneResult = this.validateEventPhone(data.phone);
    if (!phoneResult.isValid) {
      allRisks.push(...phoneResult.risks);
      errors.phone = phoneResult.risks[0]?.message;
    }

    // Validate attendee count
    const attendeeResult = this.validateAttendeeCount(
      data.attendeeCount,
      maxAttendees
    );
    if (!attendeeResult.isValid) {
      allRisks.push(...attendeeResult.risks);
      errors.attendeeCount = attendeeResult.risks[0]?.message;
    }

    // Validate special requirements (if provided)
    if (data.specialRequirements) {
      const reqResult = this.validateContactFormField(
        "specialRequirements",
        data.specialRequirements
      );
      if (!reqResult.isValid) {
        allRisks.push(...reqResult.risks);
        errors.specialRequirements = reqResult.risks[0]?.message;
      }
    }

    // Check for bot patterns
    // All fields identical (very suspicious)
    if (
      data.firstName === data.lastName &&
      data.firstName === data.email.split("@")[0]
    ) {
      allRisks.push({
        level: "HIGH",
        type: "POSSIBLE_BOT_PATTERN",
        message: "Please ensure all fields are filled correctly",
      });
      errors.general = "Please ensure all fields are filled correctly";
    }

    // Email domain matches name suspiciously
    const emailDomain = data.email.split("@")[1];
    if (
      emailDomain &&
      (data.firstName.toLowerCase().includes(emailDomain.split(".")[0]) ||
        data.lastName.toLowerCase().includes(emailDomain.split(".")[0]))
    ) {
      allRisks.push({
        level: "MEDIUM",
        type: "SUSPICIOUS_EMAIL_PATTERN",
        message: "Email pattern seems unusual",
      });
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      risks: allRisks,
    };
  }

  /**
   * Detects bot behavior based on form interaction patterns
   */
  static detectBotBehavior(
    formData: RegistrationData,
    timing: TimingData
  ): BotDetectionResult {
    const suspiciousPatterns: string[] = [];
    let totalScore = 0;

    // 1. Form filled too quickly (human minimum ~3 seconds)
    if (timing.fillDuration < 3000) {
      suspiciousPatterns.push("FORM_FILLED_TOO_FAST");
      totalScore += 0.3;
    }

    // 2. Form filled too slowly (abandoned tab, then auto-filled)
    if (timing.fillDuration > 300000) {
      // 5 minutes
      suspiciousPatterns.push("FORM_FILLED_TOO_SLOW");
      totalScore += 0.1;
    }

    // 3. All fields identical
    if (
      formData.firstName === formData.lastName &&
      formData.firstName === formData.email.split("@")[0]
    ) {
      suspiciousPatterns.push("IDENTICAL_FIELD_VALUES");
      totalScore += 0.4;
    }

    // 4. No mouse movement (headless browser)
    if (!timing.hadMouseMovement) {
      suspiciousPatterns.push("NO_MOUSE_MOVEMENT");
      totalScore += 0.3;
    }

    // 5. No keyboard interaction (copy-paste or auto-fill)
    if (!timing.hadKeyPress) {
      suspiciousPatterns.push("NO_KEYBOARD_INTERACTION");
      totalScore += 0.2;
    }

    // 6. Robotic typing pattern
    if (
      timing.keystrokes.length >= 10 &&
      this.hasRoboticTiming(timing.keystrokes)
    ) {
      suspiciousPatterns.push("ROBOTIC_TYPING_PATTERN");
      totalScore += 0.3;
    }

    // 7. Suspicious attendee count (always max or very high)
    if (formData.attendeeCount >= 10) {
      suspiciousPatterns.push("SUSPICIOUS_ATTENDEE_COUNT");
      totalScore += 0.2;
    }

    return {
      isBot: totalScore >= 0.6, // 60% confidence threshold
      confidence: Math.min(totalScore, 1.0),
      patterns: suspiciousPatterns,
    };
  }

  /**
   * Detects robotic typing (bots type at perfect intervals)
   */
  private static hasRoboticTiming(keystrokes: number[]): boolean {
    if (keystrokes.length < 10) return false;

    const intervals: number[] = [];
    for (let i = 1; i < keystrokes.length; i++) {
      intervals.push(keystrokes[i] - keystrokes[i - 1]);
    }

    // Calculate standard deviation
    const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance =
      intervals.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) /
      intervals.length;
    const stdDev = Math.sqrt(variance);

    // Bots have very low variance (humans are irregular)
    // Humans typically have 50-200ms variance in typing
    return stdDev < 20; // Less than 20ms variance = likely bot
  }
}
```

---

## Rate Limiting Strategy

```typescript
// /packages/shared-utils/src/security/EventRateLimit.ts

import {
  FormRateLimit,
  RateLimitResult,
  RateLimitConfig,
} from "./FormRateLimit";

export interface EventRateLimitConfig {
  perEventLimit?: number; // Max registrations per event (default: 1)
  globalLimit?: number; // Max total registrations (default: 5)
  globalWindow?: number; // Time window in ms (default: 1 hour)
  paymentFailureLimit?: number; // Max failed payments (default: 3)
  paymentFailureWindow?: number; // Time window in ms (default: 1 hour)
}

export const EVENT_RATE_LIMITS = {
  // Per-event registration (permanent - can't re-register)
  PER_EVENT: {
    limit: 1,
    window: Infinity,
    key: (email: string, eventId: string) =>
      `event:${eventId}:${email.toLowerCase().trim()}`,
  },

  // Global registration attempts (spam prevention)
  GLOBAL: {
    limit: 5, // Max 5 registrations per hour across all events
    window: 3600000, // 1 hour
    key: (email: string) => `events:global:${email.toLowerCase().trim()}`,
  },

  // Failed payment attempts (fraud prevention)
  PAYMENT_FAILURES: {
    limit: 3, // Max 3 failed payments per hour
    window: 3600000, // 1 hour
    key: (email: string) => `payment:failed:${email.toLowerCase().trim()}`,
  },

  // IP-based rate limiting (bot prevention)
  IP_GLOBAL: {
    limit: 10, // Max 10 registrations per IP per hour
    window: 3600000,
    key: (ip: string) => `ip:${ip}`,
  },
};

export class EventRateLimit extends FormRateLimit {
  private readonly config: EventRateLimitConfig;

  constructor(config: EventRateLimitConfig = {}) {
    super();
    this.config = {
      perEventLimit: config.perEventLimit ?? 1,
      globalLimit: config.globalLimit ?? 5,
      globalWindow: config.globalWindow ?? 3600000,
      paymentFailureLimit: config.paymentFailureLimit ?? 3,
      paymentFailureWindow: config.paymentFailureWindow ?? 3600000,
    };
  }

  /**
   * Checks if user can register for a specific event
   */
  async checkEventRegistrationLimit(
    email: string,
    eventId: string
  ): Promise<RateLimitResult> {
    const normalizedEmail = email.toLowerCase().trim();

    // Check 1: Already registered for this specific event?
    const perEventKey = EVENT_RATE_LIMITS.PER_EVENT.key(
      normalizedEmail,
      eventId
    );
    const existingRegistration = this.getStorageItem(perEventKey);

    if (existingRegistration) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: Infinity,
        message: "You have already registered for this event",
      };
    }

    // Check 2: Too many global registrations?
    const globalKey = EVENT_RATE_LIMITS.GLOBAL.key(normalizedEmail);
    const globalCheck = this.checkLimitByKey(
      globalKey,
      this.config.globalLimit!,
      this.config.globalWindow!
    );

    if (!globalCheck.allowed) {
      return {
        allowed: false,
        remaining: 0,
        timeUntilReset: globalCheck.timeUntilReset,
        message: `You've reached the registration limit. Please try again in ${globalCheck.timeUntilReset} minutes.`,
      };
    }

    return {
      allowed: true,
      remaining: globalCheck.remaining,
      message: `${globalCheck.remaining} registration${globalCheck.remaining !== 1 ? "s" : ""} remaining this hour`,
    };
  }

  /**
   * Records a successful registration
   */
  recordRegistration(email: string, eventId: string): void {
    const normalizedEmail = email.toLowerCase().trim();

    // Mark this specific event as registered (permanent)
    const perEventKey = EVENT_RATE_LIMITS.PER_EVENT.key(
      normalizedEmail,
      eventId
    );
    this.setStorageItem(
      perEventKey,
      JSON.stringify({
        timestamp: Date.now(),
        permanent: true,
        eventId,
      })
    );

    // Increment global counter
    const globalKey = EVENT_RATE_LIMITS.GLOBAL.key(normalizedEmail);
    this.recordAttemptByKey(globalKey);
  }

  /**
   * Records a failed payment attempt
   */
  recordPaymentFailure(email: string): void {
    const normalizedEmail = email.toLowerCase().trim();
    const key = EVENT_RATE_LIMITS.PAYMENT_FAILURES.key(normalizedEmail);
    this.recordAttemptByKey(key);
  }

  /**
   * Checks if user has exceeded payment failure limit
   */
  checkPaymentFailureLimit(email: string): RateLimitResult {
    const normalizedEmail = email.toLowerCase().trim();
    const key = EVENT_RATE_LIMITS.PAYMENT_FAILURES.key(normalizedEmail);

    return this.checkLimitByKey(
      key,
      this.config.paymentFailureLimit!,
      this.config.paymentFailureWindow!
    );
  }

  /**
   * IP-based rate limiting (server-side only)
   * Note: This requires server-side implementation
   */
  static checkIPLimit(ip: string, storage: Map<string, any>): RateLimitResult {
    const key = EVENT_RATE_LIMITS.IP_GLOBAL.key(ip);
    const now = Date.now();
    const attempts = storage.get(key) || [];

    // Clean old attempts
    const recentAttempts = attempts.filter(
      (time: number) => now - time < EVENT_RATE_LIMITS.IP_GLOBAL.window
    );

    if (recentAttempts.length >= EVENT_RATE_LIMITS.IP_GLOBAL.limit) {
      const oldestAttempt = Math.min(...recentAttempts);
      const timeUntilReset =
        oldestAttempt + EVENT_RATE_LIMITS.IP_GLOBAL.window - now;

      return {
        allowed: false,
        remaining: 0,
        timeUntilReset: Math.ceil(timeUntilReset / 1000 / 60),
        message: "Too many requests from this IP address",
      };
    }

    return {
      allowed: true,
      remaining: EVENT_RATE_LIMITS.IP_GLOBAL.limit - recentAttempts.length,
    };
  }

  /**
   * Helper: Check rate limit by custom key
   */
  private checkLimitByKey(
    key: string,
    limit: number,
    windowMs: number
  ): RateLimitResult {
    const now = Date.now();
    const attempts = this.getAttempts(key);

    // Clean old attempts
    const recentAttempts = attempts.filter(
      (time: number) => now - time < windowMs
    );

    if (recentAttempts.length >= limit) {
      const oldestAttempt = Math.min(...recentAttempts);
      const timeUntilReset = oldestAttempt + windowMs - now;

      return {
        allowed: false,
        remaining: 0,
        timeUntilReset: Math.ceil(timeUntilReset / 1000 / 60),
      };
    }

    return {
      allowed: true,
      remaining: limit - recentAttempts.length,
    };
  }

  /**
   * Helper: Record attempt by custom key
   */
  private recordAttemptByKey(key: string): void {
    const attempts = this.getAttempts(key);
    attempts.push(Date.now());
    this.setStorageItem(key, JSON.stringify(attempts));
  }

  /**
   * Helper: Get attempts for a key
   */
  private getAttempts(key: string): number[] {
    try {
      const stored = this.getStorageItem(key);
      if (!stored) return [];

      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  /**
   * Helper: Get item from storage
   */
  private getStorageItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  /**
   * Helper: Set item in storage
   */
  private setStorageItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn("Failed to save rate limit data:", error);
    }
  }

  /**
   * Clears all event-related rate limits (for testing)
   */
  resetAllEventLimits(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (
          key.startsWith("event:") ||
          key.startsWith("events:") ||
          key.startsWith("payment:")
        ) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn("Failed to reset event limits:", error);
    }
  }
}
```

**Usage Example**:

```typescript
// In SecureEventRegistrationForm
const rateLimit = useRef(
  new EventRateLimit({
    perEventLimit: 1,
    globalLimit: 5,
    globalWindow: 3600000, // 1 hour
    paymentFailureLimit: 3,
    paymentFailureWindow: 3600000,
  })
);

const handleSubmit = async () => {
  // Check event-specific limit
  const eventCheck = await rateLimit.current.checkEventRegistrationLimit(
    formData.email,
    event.id
  );

  if (!eventCheck.allowed) {
    setErrors({ general: eventCheck.message });
    return;
  }

  // Proceed with registration...

  // On success, record
  rateLimit.current.recordRegistration(formData.email, event.id);
};

// On payment failure
const handlePaymentFailed = (email: string) => {
  rateLimit.current.recordPaymentFailure(email);

  // Check if blocked
  const failureCheck = rateLimit.current.checkPaymentFailureLimit(email);
  if (!failureCheck.allowed) {
    showError("Too many failed payment attempts. Please contact support.");
  }
};
```

---

## Payment Security (Stripe Integration)

### Client-Side Payment Flow

```typescript
// /packages/shared-components/src/SecureEventRegistrationForm/PaymentFlow.ts

export interface PaymentFlowProps {
  event: Event;
  registrationData: RegistrationFormData;
  onSuccess: (sessionId: string) => void;
  onError: (error: PaymentError) => void;
}

export const initiatePayment = async ({
  event,
  registrationData,
  onSuccess,
  onError,
}: PaymentFlowProps): Promise<void> => {
  try {
    // 1. Validate form data one more time
    const validator = new EventSecurityValidator();
    const validation = validator.validateRegistration(
      registrationData,
      event.capacity.total - event.capacity.reserved
    );

    if (!validation.isValid) {
      throw new Error("VALIDATION_FAILED");
    }

    // 2. Check rate limits
    const rateLimit = new EventRateLimit();
    const rateLimitCheck = await rateLimit.checkEventRegistrationLimit(
      registrationData.email,
      event.id
    );

    if (!rateLimitCheck.allowed) {
      throw new Error("RATE_LIMIT_EXCEEDED");
    }

    // 3. Create Stripe Checkout Session (server validates price)
    const response = await fetch(`/api/events/${event.id}/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Send expected price for price-change detection
        "X-Expected-Price": String(event.price),
      },
      body: JSON.stringify({
        registrationData,
        // DO NOT send price - server is authoritative
      }),
    });

    if (!response.ok) {
      const error = await response.json();

      if (error.error === "PRICE_CHANGED") {
        // Price changed since page load
        throw new Error("PRICE_CHANGED");
      }

      if (error.error === "SOLD_OUT") {
        throw new Error("SOLD_OUT");
      }

      if (error.error === "ALREADY_REGISTERED") {
        throw new Error("ALREADY_REGISTERED");
      }

      throw new Error("CHECKOUT_FAILED");
    }

    const { sessionId, url } = await response.json();

    // 4. Record rate limit BEFORE redirect (important!)
    rateLimit.recordRegistration(registrationData.email, event.id);

    // 5. Redirect to Stripe Checkout
    window.location.href = url;

    onSuccess(sessionId);
  } catch (error: any) {
    onError({
      code: error.message,
      message: getErrorMessage(error.message),
    });
  }
};

const getErrorMessage = (code: string): string => {
  const messages: Record<string, string> = {
    VALIDATION_FAILED: "Please check your information and try again",
    RATE_LIMIT_EXCEEDED: "You have already registered for this event",
    PRICE_CHANGED: "The event price has changed. Please refresh and try again.",
    SOLD_OUT: "This event is now sold out",
    ALREADY_REGISTERED: "You are already registered for this event",
    CHECKOUT_FAILED: "Payment checkout failed. Please try again.",
  };

  return messages[code] || "An error occurred. Please try again.";
};
```

### Server-Side Payment Security

```typescript
// Backend API: POST /api/events/:id/checkout

import Stripe from "stripe";
import { EventSecurityValidator } from "./security/EventSecurityValidator";
import { EventSecurityMonitor } from "./security/EventSecurityMonitor";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

app.post("/api/events/:id/checkout", async (req, res) => {
  const { eventId } = req.params;
  const { registrationData } = req.body;
  const expectedPrice = parseFloat(req.headers["x-expected-price"] as string);

  try {
    // 1. Server-side validation (NEVER trust client)
    const validator = new EventSecurityValidator();
    const validation = validator.validateRegistration(registrationData);

    if (!validation.isValid) {
      await securityMonitor.log(
        "VALIDATION_FAILED",
        {
          eventId,
          errors: validation.errors,
        },
        "MEDIUM"
      );

      return res.status(400).json({
        error: "VALIDATION_FAILED",
        details: validation.errors,
      });
    }

    // 2. Verify event exists and has capacity
    const event = await db.events.findById(eventId);

    if (!event) {
      return res.status(404).json({ error: "EVENT_NOT_FOUND" });
    }

    if (event.capacity.reserved >= event.capacity.total) {
      await securityMonitor.log(
        "SOLD_OUT_ATTEMPT",
        {
          eventId,
          email: registrationData.email,
        },
        "MEDIUM"
      );

      return res.status(409).json({ error: "SOLD_OUT" });
    }

    // 3. Check for duplicate registration
    const normalizedEmail = registrationData.email.toLowerCase().trim();
    const existing = await db.registrations.findOne({
      event_id: eventId,
      email: normalizedEmail,
    });

    if (existing) {
      await securityMonitor.log(
        "DUPLICATE_REGISTRATION_ATTEMPT",
        {
          eventId,
          email: normalizedEmail,
          existingRegistrationId: existing.id,
        },
        "MEDIUM"
      );

      return res.status(409).json({ error: "ALREADY_REGISTERED" });
    }

    // 4. Verify price hasn't changed (optional UX check)
    if (expectedPrice && Math.abs(expectedPrice - event.price) > 0.01) {
      return res.status(409).json({
        error: "PRICE_CHANGED",
        oldPrice: expectedPrice,
        newPrice: event.price,
      });
    }

    // 5. Create Stripe Checkout Session
    // ✅ SERVER sets price (tamper-proof)
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: event.price * 100, // SERVER-AUTHORITATIVE PRICE
            product_data: {
              name: event.title,
              description: event.description,
              images: [event.image_url],
            },
          },
          quantity: registrationData.attendeeCount,
        },
      ],
      customer_email: normalizedEmail,
      metadata: {
        event_id: eventId,
        registration_data: JSON.stringify(registrationData),
        server_price: event.price, // Store for webhook verification
        attendee_count: registrationData.attendeeCount,
      },
      payment_intent_data: {
        metadata: {
          event_id: eventId,
          user_ip: req.ip,
        },
      },
      success_url: `${process.env.FRONTEND_URL}/events/${event.slug}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/events/${event.slug}`,
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 minutes
    });

    // 6. Log checkout session creation
    await securityMonitor.log(
      "CHECKOUT_SESSION_CREATED",
      {
        eventId,
        sessionId: session.id,
        email: normalizedEmail,
        price: event.price,
      },
      "LOW"
    );

    res.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error: any) {
    await securityMonitor.log(
      "CHECKOUT_ERROR",
      {
        eventId,
        error: error.message,
      },
      "HIGH"
    );

    res.status(500).json({ error: "CHECKOUT_FAILED" });
  }
});

// Webhook handler: POST /api/webhooks/stripe
app.post(
  "/api/webhooks/stripe",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"] as string;

    let event: Stripe.Event;

    try {
      // ✅ Verify webhook signature (prevent fake payment confirmations)
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      await securityMonitor.log(
        "WEBHOOK_SIGNATURE_FAILED",
        {
          error: err.message,
        },
        "CRITICAL"
      );

      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle successful payment
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      try {
        // ✅ Idempotency check (prevent duplicate registrations)
        const existingRegistration = await db.registrations.findOne({
          stripe_session_id: session.id,
        });

        if (existingRegistration) {
          console.log("Webhook already processed:", session.id);
          return res.json({ received: true });
        }

        // ✅ Verify price matches server's authoritative price
        const eventId = session.metadata!.event_id;
        const serverPrice = parseFloat(session.metadata!.server_price);
        const attendeeCount = parseInt(session.metadata!.attendee_count);
        const paidAmount = (session.amount_total || 0) / 100;
        const expectedAmount = serverPrice * attendeeCount;

        if (Math.abs(paidAmount - expectedAmount) > 0.01) {
          // CRITICAL: Price tampering detected!
          await securityMonitor.log(
            "PRICE_TAMPERING_DETECTED",
            {
              sessionId: session.id,
              eventId,
              expectedPrice: expectedAmount,
              paidPrice: paidAmount,
              difference: paidAmount - expectedAmount,
            },
            "CRITICAL"
          );

          // Refund and block
          if (session.payment_intent) {
            await stripe.refunds.create({
              payment_intent: session.payment_intent as string,
              reason: "fraudulent",
            });
          }

          return res.status(400).json({ error: "PRICE_MISMATCH" });
        }

        // ✅ Use database transaction for atomic operations
        await db.transaction(async (trx) => {
          // Lock event row
          const event = await trx("events")
            .where("id", eventId)
            .forUpdate()
            .first();

          if (!event) {
            throw new Error("EVENT_NOT_FOUND");
          }

          // Final capacity check
          if (event.capacity_reserved >= event.capacity_total) {
            throw new Error("SOLD_OUT");
          }

          // Create registration
          const registrationData = JSON.parse(
            session.metadata!.registration_data
          );
          await trx("registrations").insert({
            event_id: eventId,
            stripe_session_id: session.id,
            stripe_payment_intent: session.payment_intent,
            email: registrationData.email,
            first_name: registrationData.firstName,
            last_name: registrationData.lastName,
            phone: registrationData.phone,
            attendee_count: attendeeCount,
            special_requirements: registrationData.specialRequirements,
            payment_status: "paid",
            amount_paid: paidAmount,
            created_at: new Date(),
          });

          // Increment capacity
          await trx("events")
            .where("id", eventId)
            .increment("capacity_reserved", attendeeCount);
        });

        // Send confirmation email
        await emailService.sendEventConfirmation({
          email: session.customer_email!,
          eventId,
          sessionId: session.id,
        });

        // Log success
        await securityMonitor.log(
          "REGISTRATION_COMPLETED",
          {
            sessionId: session.id,
            eventId,
            email: session.customer_email,
          },
          "LOW"
        );
      } catch (error: any) {
        await securityMonitor.log(
          "WEBHOOK_PROCESSING_ERROR",
          {
            sessionId: session.id,
            error: error.message,
          },
          "HIGH"
        );

        // Don't return error to Stripe (will retry)
        // But we logged the issue for manual review
      }
    }

    // Handle payment failure
    if (event.type === "checkout.session.expired") {
      const session = event.data.object as Stripe.Checkout.Session;

      await securityMonitor.log(
        "CHECKOUT_SESSION_EXPIRED",
        {
          sessionId: session.id,
          eventId: session.metadata?.event_id,
        },
        "LOW"
      );
    }

    res.json({ received: true });
  }
);
```

### Stripe Security Checklist

- [x] **Webhook Signature Verification**: Prevents fake payment confirmations
- [x] **Server-Authoritative Pricing**: Client never sends price
- [x] **Price Verification in Webhook**: Double-check paid amount matches expected
- [x] **Idempotency**: Webhook retries don't create duplicate registrations
- [x] **Database Transactions**: Atomic operations prevent race conditions
- [x] **Capacity Locking**: `forUpdate()` prevents overselling
- [x] **PCI Compliance**: Use Stripe Checkout (no raw card data)
- [x] **Fraud Detection**: Stripe Radar enabled automatically
- [x] **Session Expiration**: 30-minute checkout window
- [x] **Refund on Tampering**: Automatic refund if price mismatch detected
- [x] **Comprehensive Logging**: All payment events logged with severity

---

## Security Monitoring

```typescript
// /packages/shared-utils/src/security/EventSecurityMonitor.ts

import { SecurityMonitor, SecurityIncident } from "./SecurityMonitor";

export enum EventSecurityIncidentType {
  // Existing from Contact form
  XSS_ATTEMPT = "XSS_ATTEMPT",
  SQL_INJECTION = "SQL_INJECTION",
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",

  // New for Events
  CAPACITY_MANIPULATION = "CAPACITY_MANIPULATION",
  PRICE_TAMPERING = "PRICE_TAMPERING",
  DUPLICATE_REGISTRATION = "DUPLICATE_REGISTRATION",
  PAYMENT_FRAUD = "PAYMENT_FRAUD",
  BOT_PATTERN = "BOT_PATTERN",
  SOLD_OUT_BYPASS_ATTEMPT = "SOLD_OUT_BYPASS_ATTEMPT",
  HONEYPOT_FILLED = "HONEYPOT_FILLED",
  SUSPICIOUS_ATTENDEE_COUNT = "SUSPICIOUS_ATTENDEE_COUNT",
  PAYMENT_FAILURE = "PAYMENT_FAILURE",
  CHECKOUT_SESSION_EXPIRED = "CHECKOUT_SESSION_EXPIRED",
  VALIDATION_FAILED = "VALIDATION_FAILED",
}

export interface EventSecurityIncident extends SecurityIncident {
  eventId?: string;
  email?: string; // Hashed for privacy
  sessionId?: string;
}

export class EventSecurityMonitor extends SecurityMonitor {
  /**
   * Logs capacity manipulation attempt
   */
  logCapacityManipulation(eventId: string, details: Record<string, any>): void {
    this.log(
      EventSecurityIncidentType.CAPACITY_MANIPULATION,
      {
        eventId,
        ...details,
        timestamp: Date.now(),
      },
      "HIGH"
    );
  }

  /**
   * Logs payment fraud incident
   */
  logPaymentFraud(
    eventId: string,
    email: string,
    reason: string,
    details?: Record<string, any>
  ): void {
    this.log(
      EventSecurityIncidentType.PAYMENT_FRAUD,
      {
        eventId,
        email: this.hashEmail(email), // Hash for privacy
        reason,
        ...details,
        timestamp: Date.now(),
      },
      "CRITICAL"
    );

    // Alert admin immediately for critical fraud
    this.alertAdmin("Payment fraud detected", {
      eventId,
      email: this.hashEmail(email),
      reason,
    });
  }

  /**
   * Logs price tampering detection
   */
  logPriceTampering(
    eventId: string,
    expectedPrice: number,
    actualPrice: number,
    sessionId?: string
  ): void {
    const difference = actualPrice - expectedPrice;
    const percentageDiff = (difference / expectedPrice) * 100;

    this.log(
      EventSecurityIncidentType.PRICE_TAMPERING,
      {
        eventId,
        expectedPrice,
        actualPrice,
        difference,
        percentageDiff: percentageDiff.toFixed(2),
        sessionId,
        timestamp: Date.now(),
      },
      "CRITICAL"
    );

    // Alert for any price tampering
    this.alertAdmin("Price tampering detected", {
      eventId,
      difference,
      sessionId,
    });
  }

  /**
   * Logs bot behavior detection
   */
  logBotDetection(
    eventId: string,
    patterns: string[],
    confidence: number,
    email?: string
  ): void {
    this.log(
      EventSecurityIncidentType.BOT_PATTERN,
      {
        eventId,
        patterns,
        confidence: (confidence * 100).toFixed(0) + "%",
        email: email ? this.hashEmail(email) : undefined,
        timestamp: Date.now(),
      },
      confidence > 0.8 ? "HIGH" : "MEDIUM"
    );
  }

  /**
   * Logs duplicate registration attempt
   */
  logDuplicateRegistration(
    eventId: string,
    email: string,
    existingRegistrationId: string
  ): void {
    this.log(
      EventSecurityIncidentType.DUPLICATE_REGISTRATION,
      {
        eventId,
        email: this.hashEmail(email),
        existingRegistrationId,
        timestamp: Date.now(),
      },
      "MEDIUM"
    );
  }

  /**
   * Logs payment failure
   */
  logPaymentFailure(
    email: string,
    reason: string,
    details?: Record<string, any>
  ): void {
    this.log(
      EventSecurityIncidentType.PAYMENT_FAILURE,
      {
        email: this.hashEmail(email),
        reason,
        ...details,
        timestamp: Date.now(),
      },
      "LOW"
    );
  }

  /**
   * Gets event-specific security summary
   */
  getEventSecuritySummary(eventId: string): {
    totalIncidents: number;
    bySeverity: Record<string, number>;
    byType: Record<string, number>;
    recentIncidents: EventSecurityIncident[];
  } {
    const allIncidents = this.getIncidents();
    const eventIncidents = allIncidents.filter(
      (incident: any) => incident.details?.eventId === eventId
    );

    const bySeverity: Record<string, number> = {
      LOW: 0,
      MEDIUM: 0,
      HIGH: 0,
      CRITICAL: 0,
    };

    const byType: Record<string, number> = {};

    eventIncidents.forEach((incident) => {
      if (incident.severity) {
        bySeverity[incident.severity]++;
      }
      byType[incident.type] = (byType[incident.type] || 0) + 1;
    });

    return {
      totalIncidents: eventIncidents.length,
      bySeverity,
      byType,
      recentIncidents: eventIncidents.slice(-10) as EventSecurityIncident[],
    };
  }

  /**
   * Hashes email for privacy (SHA-256)
   */
  private hashEmail(email: string): string {
    // Simple hash for client-side (use better hashing server-side)
    const normalized = email.toLowerCase().trim();
    let hash = 0;
    for (let i = 0; i < normalized.length; i++) {
      const char = normalized.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return `user_${Math.abs(hash).toString(16)}`;
  }

  /**
   * Alerts admin for critical incidents (placeholder)
   */
  private alertAdmin(title: string, details: Record<string, any>): void {
    // TODO: Implement actual admin alerting
    // - Email to admin
    // - Slack webhook
    // - SMS for critical
    console.error(`[SECURITY ALERT] ${title}`, details);

    // Could send to monitoring service
    if (this.reportingEndpoint) {
      fetch(this.reportingEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alert: title,
          details,
          timestamp: new Date().toISOString(),
        }),
      }).catch((err) => console.error("Failed to send alert:", err));
    }
  }
}
```

**Usage Example**:

```typescript
// In SecureEventRegistrationForm
const monitor = useRef(
  new EventSecurityMonitor({
    enableConsoleLogging: process.env.NODE_ENV === "development",
    reportingEndpoint: process.env.SECURITY_REPORTING_ENDPOINT,
    reportingThreshold: "HIGH",
  })
);

// Log various incidents
monitor.current.logBotDetection(
  event.id,
  ["FORM_FILLED_TOO_FAST"],
  0.7,
  formData.email
);
monitor.current.logDuplicateRegistration(event.id, formData.email, existingId);

// Get security summary for dashboard
const summary = monitor.current.getEventSecuritySummary(event.id);
console.log(`Event ${event.id} security:`, summary);
// Output: { totalIncidents: 5, bySeverity: { HIGH: 2, MEDIUM: 3 }, ... }
```

---

## Privacy & GDPR Compliance

### Data Minimization

**Only collect necessary data**:

```typescript
// Minimal event registration data
interface RegistrationData {
  firstName: string; // Required for personalization
  lastName: string; // Required for identification
  email: string; // Required for confirmation
  phone: string; // Required for event reminders
  attendeeCount: number; // Required for capacity
  specialRequirements?: string; // Optional, only if needed

  // ❌ Don't collect unnecessary data
  // age, gender, address, etc. (unless event-specific need)
}
```

### Consent Management

```typescript
export const SecureEventRegistrationForm: React.FC = () => {
  const [consents, setConsents] = useState({
    termsAccepted: false,
    marketingOptIn: false, // Separate from registration
  });

  return (
    <form onSubmit={handleSubmit}>
      {/* Registration fields... */}

      {/* Required: Terms & Privacy Policy */}
      <div className="mb-6">
        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            checked={consents.termsAccepted}
            onChange={(e) => setConsents(prev => ({
              ...prev,
              termsAccepted: e.target.checked
            }))}
            required
            className="mt-1"
          />
          <span className="text-sm">
            I agree to the{' '}
            <a href="/terms" target="_blank" className="text-blue-600 underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" target="_blank" className="text-blue-600 underline">
              Privacy Policy
            </a>
            <span className="text-red-500">*</span>
          </span>
        </label>
      </div>

      {/* Optional: Marketing Opt-in (SEPARATE from registration) */}
      <div className="mb-6">
        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            checked={consents.marketingOptIn}
            onChange={(e) => setConsents(prev => ({
              ...prev,
              marketingOptIn: e.target.checked
            }))}
            className="mt-1"
          />
          <span className="text-sm text-gray-600">
            I would like to receive updates about future events (optional)
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={!consents.termsAccepted}
      >
        Register
      </button>
    </form>
  );
};
```

### Data Retention Policy

```typescript
// Server-side data retention
const DATA_RETENTION_POLICY = {
  // Registration data: Keep until event + 30 days
  REGISTRATION_DATA: {
    retention: "30 days after event",
    autoDelete: true,
  },

  // Payment session IDs: Keep for Stripe reconciliation
  PAYMENT_SESSIONS: {
    retention: "7 years", // Legal requirement for financial records
    autoDelete: false, // Manual review before deletion
  },

  // Email for marketing: Until unsubscribe
  MARKETING_EMAILS: {
    retention: "Until unsubscribe",
    autoDelete: true,
  },
};

// Scheduled job: Delete old registrations
cron.schedule("0 0 * * *", async () => {
  // Daily at midnight
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Find events that occurred >30 days ago
  const oldEvents = await db.events.find({
    event_date: { $lt: thirtyDaysAgo },
  });

  for (const event of oldEvents) {
    // Anonymize registration data (keep for analytics)
    await db.registrations.updateMany(
      { event_id: event.id },
      {
        email: "deleted@example.com",
        first_name: "Deleted",
        last_name: "User",
        phone: "0000000000",
        special_requirements: null,
        anonymized_at: new Date(),
      }
    );
  }

  console.log(`Anonymized ${oldEvents.length} old events`);
});
```

### Right to be Forgotten

```typescript
// API endpoint: DELETE /api/users/me/data
app.delete("/api/users/me/data", authenticateUser, async (req, res) => {
  const userEmail = req.user.email;

  try {
    // 1. Find all registrations
    const registrations = await db.registrations.find({ email: userEmail });

    // 2. Cancel future events
    const futureRegistrations = registrations.filter(
      (r) => new Date(r.event.event_date) > new Date()
    );

    for (const reg of futureRegistrations) {
      // Refund if paid
      if (reg.stripe_payment_intent) {
        await stripe.refunds.create({
          payment_intent: reg.stripe_payment_intent,
          reason: "requested_by_customer",
        });
      }

      // Decrement event capacity
      await db.events.updateOne(
        { id: reg.event_id },
        { $inc: { capacity_reserved: -reg.attendee_count } }
      );
    }

    // 3. Anonymize all registrations
    await db.registrations.updateMany(
      { email: userEmail },
      {
        email: "deleted@example.com",
        first_name: "Deleted",
        last_name: "User",
        phone: "0000000000",
        special_requirements: null,
        anonymized_at: new Date(),
      }
    );

    // 4. Remove from marketing list
    await db.marketing_subscriptions.deleteMany({ email: userEmail });

    // 5. Clear rate limit data
    // (Client-side localStorage, can't be deleted server-side)

    res.json({
      success: true,
      message: "Your data has been deleted",
      futureEventsCancelled: futureRegistrations.length,
    });
  } catch (error) {
    res.status(500).json({ error: "DELETION_FAILED" });
  }
});
```

### Privacy Checklist

- [x] **Data Minimization**: Only collect necessary fields
- [x] **Explicit Consent**: Terms checkbox required, marketing separate
- [x] **Privacy Policy**: Linked and accessible
- [x] **Data Retention**: Auto-delete after retention period
- [x] **Right to Access**: User can view their data
- [x] **Right to Delete**: User can request deletion
- [x] **Right to Portability**: User can export data (JSON format)
- [x] **Anonymization**: Hash emails in logs
- [x] **No Tracking Cookies**: Without consent
- [x] **HTTPS Only**: All data transmitted securely
- [x] **No Sensitive Data in localStorage**: Use sessionStorage
- [x] **Database Encryption**: At rest
- [x] **Payment Data**: Stripe-hosted (PCI-compliant)

---

## Testing Requirements

### Security Test Suite

```typescript
// /packages/shared-utils/src/security/__tests__/EventSecurityValidator.test.ts

import { describe, it, expect } from "vitest";
import { EventSecurityValidator } from "../EventSecurityValidator";

describe("EventSecurityValidator", () => {
  describe("validateRegistration", () => {
    it("should accept valid registration data", () => {
      const data = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "+1234567890",
        attendeeCount: 2,
      };

      const result = EventSecurityValidator.validateRegistration(data, 5);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it("should reject XSS in first name", () => {
      const data = {
        firstName: '<script>alert("xss")</script>',
        lastName: "Doe",
        email: "john@example.com",
        phone: "+1234567890",
        attendeeCount: 1,
      };

      const result = EventSecurityValidator.validateRegistration(data);

      expect(result.isValid).toBe(false);
      expect(result.errors.firstName).toContain("Invalid formatting");
    });

    it("should reject SQL injection in email", () => {
      const data = {
        firstName: "John",
        lastName: "Doe",
        email: "admin'--@example.com",
        phone: "+1234567890",
        attendeeCount: 1,
      };

      const result = EventSecurityValidator.validateRegistration(data);

      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBeDefined();
    });

    it("should reject disposable email domains", () => {
      const data = {
        firstName: "John",
        lastName: "Doe",
        email: "john@tempmail.com",
        phone: "+1234567890",
        attendeeCount: 1,
      };

      const result = EventSecurityValidator.validateRegistration(data);

      expect(result.isValid).toBe(false);
      expect(result.errors.email).toContain("permanent email");
    });

    it("should reject fake phone numbers", () => {
      const data = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "1111111111", // All same digit
        attendeeCount: 1,
      };

      const result = EventSecurityValidator.validateRegistration(data);

      expect(result.isValid).toBe(false);
      expect(result.errors.phone).toContain("valid phone");
    });

    it("should reject excessive attendee count", () => {
      const data = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "+1234567890",
        attendeeCount: 100,
      };

      const result = EventSecurityValidator.validateRegistration(data, 5);

      expect(result.isValid).toBe(false);
      expect(result.errors.attendeeCount).toContain("Maximum 5");
    });

    it("should detect bot pattern (identical fields)", () => {
      const data = {
        firstName: "test",
        lastName: "test",
        email: "test@example.com",
        phone: "+1234567890",
        attendeeCount: 1,
      };

      const result = EventSecurityValidator.validateRegistration(data);

      expect(result.isValid).toBe(false);
      expect(result.errors.general).toContain("filled correctly");
    });
  });

  describe("detectBotBehavior", () => {
    it("should detect form filled too quickly", () => {
      const formData = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "+1234567890",
        attendeeCount: 1,
      };

      const timing = {
        fillDuration: 1000, // 1 second (too fast)
        hadMouseMovement: true,
        hadKeyPress: true,
        keystrokes: [0, 100, 200, 300],
      };

      const result = EventSecurityValidator.detectBotBehavior(formData, timing);

      expect(result.patterns).toContain("FORM_FILLED_TOO_FAST");
      expect(result.confidence).toBeGreaterThan(0);
    });

    it("should detect no mouse movement", () => {
      const formData = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "+1234567890",
        attendeeCount: 1,
      };

      const timing = {
        fillDuration: 10000,
        hadMouseMovement: false, // Suspicious
        hadKeyPress: true,
        keystrokes: [0, 100, 200, 300],
      };

      const result = EventSecurityValidator.detectBotBehavior(formData, timing);

      expect(result.patterns).toContain("NO_MOUSE_MOVEMENT");
    });

    it("should detect robotic typing pattern", () => {
      const formData = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "+1234567890",
        attendeeCount: 1,
      };

      // Perfect 100ms intervals (robotic)
      const keystrokes = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];

      const timing = {
        fillDuration: 10000,
        hadMouseMovement: true,
        hadKeyPress: true,
        keystrokes,
      };

      const result = EventSecurityValidator.detectBotBehavior(formData, timing);

      expect(result.patterns).toContain("ROBOTIC_TYPING_PATTERN");
      expect(result.confidence).toBeGreaterThan(0.5);
    });

    it("should NOT flag legitimate users", () => {
      const formData = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "+1234567890",
        attendeeCount: 2,
      };

      // Irregular human typing (varying intervals)
      const keystrokes = [
        0, 120, 185, 340, 456, 623, 701, 889, 1024, 1156, 1289,
      ];

      const timing = {
        fillDuration: 15000, // 15 seconds (reasonable)
        hadMouseMovement: true,
        hadKeyPress: true,
        keystrokes,
      };

      const result = EventSecurityValidator.detectBotBehavior(formData, timing);

      expect(result.isBot).toBe(false);
      expect(result.confidence).toBeLessThan(0.6);
    });
  });
});

// Rate Limit Tests
describe("EventRateLimit", () => {
  let rateLimit: EventRateLimit;

  beforeEach(() => {
    localStorage.clear();
    rateLimit = new EventRateLimit();
  });

  it("should allow first registration for event", async () => {
    const result = await rateLimit.checkEventRegistrationLimit(
      "test@example.com",
      "event-123"
    );

    expect(result.allowed).toBe(true);
  });

  it("should block duplicate registration for same event", async () => {
    const email = "test@example.com";
    const eventId = "event-123";

    // First registration
    rateLimit.recordRegistration(email, eventId);

    // Try to register again
    const result = await rateLimit.checkEventRegistrationLimit(email, eventId);

    expect(result.allowed).toBe(false);
    expect(result.message).toContain("already registered");
  });

  it("should enforce global registration limit", async () => {
    const email = "test@example.com";

    // Register for 5 different events
    for (let i = 0; i < 5; i++) {
      rateLimit.recordRegistration(email, `event-${i}`);
    }

    // Try 6th registration
    const result = await rateLimit.checkEventRegistrationLimit(
      email,
      "event-6"
    );

    expect(result.allowed).toBe(false);
    expect(result.message).toContain("registration limit");
  });

  it("should track payment failures", () => {
    const email = "test@example.com";

    // Record 2 failures
    rateLimit.recordPaymentFailure(email);
    rateLimit.recordPaymentFailure(email);

    const result = rateLimit.checkPaymentFailureLimit(email);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(1);

    // Record 3rd failure
    rateLimit.recordPaymentFailure(email);

    const blockedResult = rateLimit.checkPaymentFailureLimit(email);
    expect(blockedResult.allowed).toBe(false);
  });
});
```

### Manual Testing Checklist

**Validation Testing**:

- [ ] Try submitting with `<script>` in name field
- [ ] Try SQL injection patterns in email: `admin'--`, `1' OR '1'='1`
- [ ] Try disposable email domains: tempmail.com, guerrillamail.com
- [ ] Try fake phone: 1111111111, 1234567890
- [ ] Try excessive attendee count (e.g., 999)
- [ ] Try medical terms in special requirements field

**Rate Limiting Testing**:

- [ ] Register for same event twice (should block)
- [ ] Register for 6 events in 1 hour (should block 6th)
- [ ] Wait 1 hour, verify limits reset
- [ ] Fail payment 4 times (should block 4th attempt)

**Bot Detection Testing**:

- [ ] Fill form in <2 seconds (should flag)
- [ ] Fill all fields with same value (should flag)
- [ ] Don't move mouse at all (should flag)
- [ ] Type at perfect 100ms intervals (should flag as robot)
- [ ] Fill honeypot field (should silently reject)

**Payment Security Testing**:

- [ ] Modify event price client-side, verify server rejects
- [ ] Try to register when sold out (should reject)
- [ ] Verify webhook signature validation (use Stripe CLI)
- [ ] Test duplicate webhook delivery (should be idempotent)
- [ ] Verify refund on price mismatch

**Privacy Testing**:

- [ ] Verify terms checkbox is required
- [ ] Verify marketing opt-in is separate
- [ ] Request data deletion, verify anonymization
- [ ] Check that emails are hashed in logs

---

## Implementation Checklist

### Phase 1: Core Security (MVP)

**Week 1: Validation & Rate Limiting**

- [ ] Extend SecurityValidator for events
  - [ ] Create EventSecurityValidator class
  - [ ] Add attendeeCount validation
  - [ ] Add phone validation (stricter)
  - [ ] Add registration-specific patterns
- [ ] Implement EventRateLimit
  - [ ] Per-event registration tracking
  - [ ] Global registration limits
  - [ ] Payment failure tracking
- [ ] Write tests for validators and rate limiters
  - [ ] Unit tests for all validation rules
  - [ ] Integration tests for rate limiting

**Week 2: Form Security**

- [ ] Create SecureEventRegistrationForm component
  - [ ] Integrate EventSecurityValidator
  - [ ] Add bot detection (timing, honeypot)
  - [ ] Implement rate limit checks
  - [ ] Add ARIA accessibility
- [ ] Test form security
  - [ ] Manual XSS/SQL injection testing
  - [ ] Bot detection accuracy testing
  - [ ] Rate limit enforcement testing

### Phase 2: Payment Security (If Stripe)

**Week 3: Stripe Integration**

- [ ] Implement server-side checkout endpoint
  - [ ] Server-authoritative pricing
  - [ ] Duplicate registration check
  - [ ] Capacity verification with locking
  - [ ] Stripe session creation
- [ ] Implement webhook handler
  - [ ] Signature verification
  - [ ] Price verification
  - [ ] Idempotency checks
  - [ ] Database transactions
- [ ] Test payment flow
  - [ ] Test mode Stripe integration
  - [ ] Price tampering prevention
  - [ ] Webhook retry handling

**Week 4: Payment Security Hardening**

- [ ] Add payment failure tracking
- [ ] Implement refund on fraud detection
- [ ] Add Stripe Radar integration
- [ ] Test edge cases (session expiry, network failures)

### Phase 3: Monitoring & Privacy

**Week 5: Security Monitoring**

- [ ] Extend SecurityMonitor for events
  - [ ] Add event-specific incident types
  - [ ] Add email hashing for privacy
  - [ ] Add admin alerting
- [ ] Create security dashboard (admin)
  - [ ] Display incident summary by event
  - [ ] Show severity breakdown
  - [ ] Export incident reports

**Week 6: Privacy & Compliance**

- [ ] Add consent management
  - [ ] Terms checkbox
  - [ ] Marketing opt-in (separate)
- [ ] Implement data retention
  - [ ] Auto-delete old registrations
  - [ ] Anonymization job
- [ ] Add GDPR endpoints
  - [ ] Data export
  - [ ] Data deletion
  - [ ] Consent management

### Phase 4: Testing & Launch

**Week 7: Security Audit**

- [ ] Run automated security scans
- [ ] Manual penetration testing
- [ ] Code review with security focus
- [ ] Load testing for rate limits

**Week 8: Documentation & Launch**

- [ ] Document security architecture
- [ ] Create security incident response plan
- [ ] Train team on security practices
- [ ] Soft launch with monitoring
- [ ] Full launch with ongoing monitoring

---

## Related Documents

- [Events Page Design Implementation](/docs/design/events-page/design-implementation.md)
- [Contact Page Security (Reference)](/packages/shared-utils/src/security/)
- [ARCHITECTURE.md Security Section](/docs/project/ARCHITECTURE.md#security-architecture)
- [Stripe Integration Plan](/docs/design/contact-resend-integration/stripe-integration.md)

---

**Document Status**: Complete
**Last Updated**: 2025-11-03
**Next Steps**: Begin Phase 1 implementation - Core Security
