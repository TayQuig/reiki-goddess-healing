# Security Requirements: Resend Email Integration

**Document Status**: Draft
**Last Updated**: October 2, 2025
**Owner**: Security Research
**Related Documents**:

- `/docs/design/resend-integration-plan.md`
- `/packages/shared-utils/src/security/`

---

## Executive Summary

This document outlines security requirements for integrating Resend email API into the contact form. The integration must maintain existing client-side security measures while adding robust server-side protections to prevent API key exposure, abuse, and data breaches.

**Critical Security Principle**: API keys must NEVER exist in frontend code or be accessible to clients.

---

## Current Security Infrastructure

### Client-Side Security (Existing)

#### 1. SecurityValidator - Multi-Layer Input Validation

**Location**: `/packages/shared-utils/src/security/SecurityValidator.ts`

**Protection Layers**:

1. **Medical Term Blocking** (Liability Protection)
   - Pattern: `/\b(diagnosis|prescription|medication|cure|treat|medical|doctor|physician|disease|illness|condition)\b/i`
   - Risk Level: HIGH
   - Purpose: Prevent liability by blocking medical advice requests
   - User Message: "Please avoid medical terminology. We provide wellness services, not medical treatment."

2. **SQL Injection Prevention**
   - Pattern: `/(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|CREATE|ALTER|EXEC|EXECUTE)\b|--|\/\*|\*\/|;|'|"|`|xp*|sp*)/i`
   - Risk Level: HIGH
   - Purpose: Block database attack patterns
   - User Message: "Invalid characters detected. Please use only standard text."

3. **XSS Attack Prevention**
   - Pattern: `/<[^>]*>|javascript:|on\w+\s*=|eval\(|expression\(|vbscript:|data:text\/html/i`
   - Risk Level: HIGH
   - Purpose: Prevent cross-site scripting attacks
   - User Message: "Invalid formatting detected. Please use plain text only."

4. **Email Injection Prevention**
   - Pattern: `/(\r|\n|%0a|%0d|bcc:|cc:|to:|from:|subject:|reply-to:|content-type:|mime-version:)/i`
   - Risk Level: HIGH
   - Purpose: Block email header injection attacks
   - User Message: "Invalid email format detected."

5. **Length Validation**
   - Maximum: 1000 characters per field
   - Risk Level: MEDIUM
   - Purpose: Prevent buffer overflow and abuse
   - User Message: "Please keep your message under 1000 characters."

6. **Spam Pattern Detection**
   - Pattern: `/(.)\1{5,}/` (repeated characters)
   - Risk Level: MEDIUM
   - Purpose: Identify potential spam submissions
   - User Message: "Please avoid excessive repetition."

7. **Input Sanitization**
   - Removes: `<>`, `javascript:`, `on*=`, `style=`, `script`
   - Automatically applied to all inputs
   - Maximum length enforced: 1000 characters

**Field-Specific Validation**:

- **Email**: RFC-compliant regex, no consecutive dots, disposable domain detection
- **Phone**: 7-15 digits, optional leading `+`, no letters
- **Name/Message**: All security patterns applied

#### 2. FormRateLimit - Client-Side Rate Limiting

**Location**: `/packages/shared-utils/src/security/FormRateLimit.ts`

**Configuration**:

- **Limit**: 3 submissions per hour per browser
- **Storage**: localStorage (survives page refresh)
- **Time Window**: 60 minutes (3,600,000ms)
- **Storage Key**: `form_submissions`

**Features**:

- Automatic cleanup of expired submissions
- User-friendly feedback messages
- Remaining submission counter
- Time-until-reset calculation

**User Messages**:

- Allowed: "You have X submissions remaining this hour."
- Blocked: "You've reached the submission limit. Please try again in X minutes."

#### 3. SecurityMonitor - Incident Logging

**Location**: `/packages/shared-utils/src/security/SecurityMonitor.ts`

**Severity Levels**: LOW, MEDIUM, HIGH, CRITICAL

**Critical Incident Types**:

- XSS_ATTEMPT
- SQL_INJECTION
- RATE_LIMIT_EXCEEDED
- CSRF_ATTEMPT
- AUTHENTICATION_FAILURE
- CSP_VIOLATION
- MAP_API_ABUSE
- GEOLOCATION_ABUSE

**Storage**:

- Location: sessionStorage
- Key: `securityIncidents`
- Max Incidents: 10 (rolling window)
- Automatic PII sanitization

**Sanitization Rules**:

- Redacts keys containing: password, token, secret, key, auth
- Truncates strings > 200 characters
- No sensitive data in logs

**Reporting**:

- Optional endpoint configuration
- Configurable threshold (default: HIGH)
- Silent failure (doesn't block user)

### Current Protection Coverage

✅ **Implemented**:

- Input validation (medical terms, SQL, XSS, email injection)
- Client-side rate limiting (3/hour)
- Data sanitization (XSS prevention)
- Spam detection (repeated characters)
- Security incident logging
- PII protection in logs

❌ **Not Implemented** (Required for API Integration):

- API key protection (N/A without backend)
- Server-side validation
- Server-side rate limiting
- IP-based tracking
- CORS configuration
- Backend authentication

---

## New Security Requirements for Resend Integration

### 1. API Key Management

**CRITICAL REQUIREMENT**: API keys must NEVER be in frontend code or accessible to clients.

#### Storage Requirements

**Backend Environment Variables**:

```bash
# .env.local (NEVER commit to git)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=contact@mail.thereikigoddesshealing.com
RESEND_TO_EMAIL=contact@thereikigoddesshealing.com
```

**Security Measures**:

1. ✅ Store in `.env.local` (backend only)
2. ✅ Add `.env.local` to `.gitignore`
3. ✅ Never commit API keys to version control
4. ✅ Use environment-specific keys (dev, staging, prod)
5. ✅ Rotate keys every 90 days
6. ✅ Document key rotation process

**Vite Environment Variable Access** (Backend Only):

```typescript
// Server-side only
const apiKey = import.meta.env.RESEND_API_KEY;
const fromEmail = import.meta.env.RESEND_FROM_EMAIL;
```

**Forbidden Practices**:

- ❌ Hardcoding API keys in source code
- ❌ Storing keys in frontend configuration
- ❌ Exposing keys in network requests
- ❌ Logging keys in console or logs
- ❌ Committing `.env.local` to git

#### Key Rotation Process

**Frequency**: Every 90 days or immediately upon suspected compromise

**Steps**:

1. Generate new API key in Resend dashboard
2. Update `.env.local` in all environments
3. Deploy updated configuration
4. Test email functionality
5. Revoke old API key in Resend dashboard
6. Document rotation date

---

### 2. Backend Security Architecture

#### Server-Side Validation

**Requirement**: Re-validate ALL inputs server-side (never trust client)

**Implementation**:

```typescript
// Server-side validator (mirrors client-side logic)
import { SecurityValidator } from '@packages/shared-utils/security/SecurityValidator';

function validateServerSide(formData: ContactFormData): ValidationResult {
  // Re-run ALL client-side validations
  const nameValidation = SecurityValidator.validateContactFormField('name', formData.name);
  const emailValidation = SecurityValidator.validateEmail(formData.email);
  const phoneValidation = SecurityValidator.validatePhone(formData.phone);
  const messageValidation = SecurityValidator.validateContactFormField('message', formData.message);

  // Aggregate results
  const allValidations = [nameValidation, emailValidation, phoneValidation, messageValidation];
  const hasHighRisk = allValidations.some(v => v.riskLevel === 'HIGH');

  if (hasHighRisk) {
    // Log security incident
    SecurityMonitor.logIncident('SERVER_VALIDATION_FAILURE', {
      field: 'contact_form',
      ip: requestIP
    }, 'HIGH');

    return { isValid: false, errors: [...] };
  }

  return { isValid: true, sanitizedData: {...} };
}
```

**Additional Server-Side Checks**:

1. ✅ Content-Type validation (must be application/json)
2. ✅ Request body size limit (< 10KB)
3. ✅ Origin header verification
4. ✅ CSRF token validation (if implementing sessions)

#### Server-Side Rate Limiting

**Requirement**: IP-based rate limiting to prevent abuse

**Configuration**:

- **Limit**: 3 requests per hour per IP address
- **Matches Client**: Same limit as client-side (consistency)
- **Storage**: In-memory or Redis (production)
- **Response**: HTTP 429 (Too Many Requests)

**Implementation Strategy**:

```typescript
// Using express-rate-limit or similar
import rateLimit from "express-rate-limit";

const contactFormLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 requests per hour
  message: {
    error: "Too many contact form submissions. Please try again later.",
    retryAfter: "1 hour",
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,
  // IP extraction (handle proxies)
  keyGenerator: (req) => {
    return (
      req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress
    );
  },
});

// Apply to contact endpoint
app.post("/api/contact", contactFormLimiter, handleContactForm);
```

**Resend API Rate Limits**:

- **Free Tier**: 2 requests/second, 100 emails/day
- **Paid Tier**: Higher limits (check dashboard)
- **Implementation**: Respect Resend's limits to avoid service disruption

**Rate Limit Bypass Prevention**:

- Track by IP address (not just localStorage)
- Handle proxy headers (`X-Forwarded-For`)
- Consider fingerprinting for advanced protection
- Log rate limit violations

#### CORS Configuration

**Requirement**: Restrict API access to authorized domains only

**Production Configuration**:

```typescript
import cors from "cors";

const corsOptions = {
  origin: "https://thereikigoddesshealing.com",
  methods: ["POST"], // Only POST for contact form
  credentials: true,
  optionsSuccessStatus: 200,
  maxAge: 86400, // 24 hours
};

app.use("/api/contact", cors(corsOptions));
```

**Development Configuration**:

```typescript
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:3000"],
  methods: ["POST"],
  credentials: true,
};
```

**Security Checks**:

1. ✅ Validate `Origin` header
2. ✅ Reject requests from unauthorized domains
3. ✅ Log CORS violations
4. ✅ Use HTTPS in production (upgrade HTTP)

---

### 3. Data Protection Requirements

#### In Transit

**TLS/HTTPS Requirements**:

- ✅ HTTPS required for all API requests
- ✅ TLS 1.2+ for Resend API communication
- ✅ Reject non-HTTPS requests in production
- ✅ HSTS header enabled

**Implementation**:

```typescript
// Redirect HTTP to HTTPS in production
if (
  process.env.NODE_ENV === "production" &&
  req.headers["x-forwarded-proto"] !== "https"
) {
  return res.redirect(301, `https://${req.hostname}${req.url}`);
}
```

#### In Storage

**No Data Retention Policy**:

- ✅ Do NOT store form submissions in database
- ✅ Send email immediately and discard data
- ✅ No logs containing PII (names, emails, phone numbers)
- ✅ Security incident logs sanitize PII

**Allowed Logging**:

- ✅ Timestamp of submission
- ✅ IP address (for rate limiting only)
- ✅ Success/failure status
- ✅ Validation errors (no user data)

**Forbidden Logging**:

- ❌ User names
- ❌ Email addresses
- ❌ Phone numbers
- ❌ Message content
- ❌ API keys or tokens

#### In Emails

**Email Content Security**:

1. ✅ Use sanitized data (already processed by SecurityValidator)
2. ✅ No sensitive information in subject lines
3. ✅ Set `Reply-To` header to user's email
4. ✅ Include timestamp in email body

**Email Template** (Sanitized):

```typescript
const emailHtml = `
  <h2>New Contact Form Submission</h2>
  <p><strong>From:</strong> ${sanitizedData.name}</p>
  <p><strong>Email:</strong> ${sanitizedData.email}</p>
  <p><strong>Phone:</strong> ${sanitizedData.phone}</p>
  <p><strong>Message:</strong></p>
  <p>${sanitizedData.message}</p>
  <p><em>Submitted: ${new Date().toISOString()}</em></p>
`;
```

**Email Headers**:

```typescript
{
  from: 'contact@mail.thereikigoddesshealing.com',
  to: 'contact@thereikigoddesshealing.com',
  replyTo: sanitizedData.email, // User's email for easy reply
  subject: 'New Contact Form Submission',
  html: emailHtml
}
```

---

### 4. Vulnerability Assessment

#### Identified Risks & Mitigations

| Risk                  | Severity | Mitigation                           | Status             |
| --------------------- | -------- | ------------------------------------ | ------------------ |
| **API Key Exposure**  | CRITICAL | Environment variables, never in code | ✅ Required        |
| **Email Injection**   | HIGH     | Already blocked by SecurityValidator | ✅ Implemented     |
| **SQL Injection**     | HIGH     | Already blocked by SecurityValidator | ✅ Implemented     |
| **XSS Attacks**       | HIGH     | Already blocked by SecurityValidator | ✅ Implemented     |
| **Rate Limit Bypass** | MEDIUM   | Server-side IP tracking              | ❌ Not Implemented |
| **CSRF Attacks**      | MEDIUM   | CORS policy, origin validation       | ❌ Not Implemented |
| **DoS Attacks**       | MEDIUM   | Rate limiting (client + server)      | 🟡 Partial         |
| **Data Leakage**      | MEDIUM   | No storage, sanitized logs           | ✅ Implemented     |
| **MitM Attacks**      | LOW      | HTTPS/TLS required                   | ✅ Required        |

#### Attack Scenarios & Defenses

**Scenario 1: Attacker tries to expose API key**

- ❌ Attack: Inspect frontend code for API keys
- ✅ Defense: Keys stored server-side only, never sent to client

**Scenario 2: Attacker attempts email injection**

- ❌ Attack: Submit form with `\r\nBcc: attacker@evil.com` in email field
- ✅ Defense: SecurityValidator blocks `\r`, `\n`, `bcc:` patterns (HIGH risk)

**Scenario 3: Attacker bypasses client-side rate limit**

- ❌ Attack: Clear localStorage and submit again
- ✅ Defense: Server-side IP-based rate limiting (3/hour)

**Scenario 4: Attacker attempts XSS via message field**

- ❌ Attack: Submit `<script>alert('XSS')</script>` in message
- ✅ Defense: SecurityValidator blocks `<script>` tags, sanitizes output

**Scenario 5: Attacker sends spam/bulk emails**

- ❌ Attack: Automated script submits 100 forms
- ✅ Defense: Client rate limit (3/hour) + server rate limit (3/hour/IP)

**Scenario 6: Attacker attempts medical advice phishing**

- ❌ Attack: Submit form requesting "diagnosis for my illness"
- ✅ Defense: Medical term blocking (HIGH risk, user-friendly error)

---

### 5. Security Testing Requirements

#### Pre-Deployment Testing

**Required Tests**:

1. ✅ **API Key Protection Test**
   - Verify key not in frontend bundle
   - Check network requests (no key exposure)
   - Inspect browser DevTools (no key visible)

2. ✅ **Input Validation Test**
   - Submit SQL injection patterns → Blocked
   - Submit XSS payloads → Blocked
   - Submit email injection → Blocked
   - Submit medical terms → Blocked with friendly message

3. ✅ **Rate Limiting Test**
   - Submit 3 forms → Success
   - Submit 4th form → HTTP 429 error
   - Wait 1 hour → Submit again → Success

4. ✅ **CORS Test**
   - Request from authorized domain → Success
   - Request from unauthorized domain → Blocked
   - Check CORS headers in response

5. ✅ **Error Handling Test**
   - Resend API error → Graceful failure
   - Network timeout → User-friendly error
   - Invalid API key → Logged, not exposed to user

6. ✅ **Data Sanitization Test**
   - Check logs for PII → None found
   - Verify email contains sanitized data only
   - Confirm no database storage

#### Security Monitoring (Post-Deployment)

**Metrics to Track**:

- Failed validation attempts (HIGH risk events)
- Rate limit violations per hour
- CORS violations
- Resend API errors
- Response times

**Alerting Thresholds**:

- 10+ failed validations/hour → Investigate
- 5+ rate limit violations/hour → Potential attack
- Any CORS violations → Security incident
- Resend API errors → Service issue

**Tools**:

- SecurityMonitor for incident logging
- Server logs for API errors
- Resend dashboard for delivery monitoring

---

### 6. GDPR Compliance

#### Data Minimization

**Principle**: Collect only necessary fields

**Collected Data**:

- ✅ Name (required for personalization)
- ✅ Email (required for response)
- ✅ Phone (optional, user choice)
- ✅ Message (required for inquiry)
- ✅ Terms acceptance (required for consent)

**NOT Collected**:

- ❌ Address (not needed)
- ❌ Date of birth (not needed)
- ❌ Payment information (not applicable)
- ❌ Health information (explicitly blocked)

#### No Data Retention

**Policy**: Send and forget (no database storage)

**Benefits**:

- ✅ Right to erasure: No data to delete
- ✅ Right to access: No data stored
- ✅ Right to rectification: No data to correct
- ✅ Data breach risk: Minimal (transient data only)

**Email Retention**:

- Emails stored in business email account (Gmail, etc.)
- Governed by email provider's retention policy
- User can request deletion via email
- Document in privacy policy

#### Consent & Transparency

**Required Actions**:

1. ✅ **Privacy Policy Link**: Visible on contact form
2. ✅ **Terms Checkbox**: Required before submission
3. ✅ **Clear Purpose**: "We'll use your information to respond to your inquiry"
4. ✅ **Data Usage**: Documented in privacy policy

**Consent Language** (recommended):

```
☑ I agree to the privacy policy and consent to Reiki Goddess Healing
   using my information to respond to my inquiry.
```

#### GDPR Rights Implementation

| Right                            | Implementation                                   |
| -------------------------------- | ------------------------------------------------ |
| **Right to be Informed**         | Privacy policy explains data usage               |
| **Right to Access**              | No data stored; emails in inbox only             |
| **Right to Rectification**       | User can resend form with corrections            |
| **Right to Erasure**             | No database storage; email deletion upon request |
| **Right to Restrict Processing** | Form submission is voluntary                     |
| **Right to Data Portability**    | N/A (no automated processing)                    |
| **Right to Object**              | User can choose not to submit form               |

---

### 7. Best Practices & Principles

#### Defense in Depth

**Multiple Security Layers**:

1. Client-side validation (user experience)
2. Server-side validation (security enforcement)
3. Rate limiting (abuse prevention)
4. CORS policy (unauthorized access prevention)
5. HTTPS/TLS (data in transit protection)
6. Input sanitization (XSS prevention)
7. Security monitoring (incident detection)

#### Principle of Least Privilege

**Access Control**:

- API key has minimal permissions (send email only)
- No database write access (not needed)
- Server has no access to user data beyond request lifecycle

#### Fail Securely

**Error Handling**:

- ✅ Block submission on validation failure
- ✅ Generic error messages (no sensitive info)
- ✅ Log errors server-side (for debugging)
- ✅ Never expose API keys in errors
- ✅ Graceful degradation (service unavailable message)

**Error Messages** (user-facing):

```typescript
// Good (generic, helpful)
"We're experiencing technical difficulties. Please try again later.";

// Bad (exposes sensitive info)
"Resend API error: Invalid API key re_123abc...";
```

#### Security Monitoring & Incident Response

**Logging Strategy**:

```typescript
// Log security incidents (no PII)
SecurityMonitor.logIncident(
  "VALIDATION_FAILURE",
  {
    field: "email",
    pattern: "EMAIL_INJECTION",
    ip: sanitizeIP(req.ip),
    timestamp: new Date().toISOString(),
  },
  "HIGH"
);

// Log API errors (no keys)
logger.error("Resend API error", {
  statusCode: error.statusCode,
  message: error.message,
  timestamp: new Date().toISOString(),
});
```

**Incident Response Plan**:

1. **Detection**: SecurityMonitor logs incident
2. **Assessment**: Review logs for severity
3. **Containment**: Block IP if attack pattern detected
4. **Recovery**: Fix vulnerability, deploy patch
5. **Documentation**: Update security requirements

---

## Implementation Checklist

### Phase 1: Backend Setup (Critical)

- [ ] Create `.env.local` with Resend API key
- [ ] Add `.env.local` to `.gitignore`
- [ ] Verify `.env.local` not committed to git
- [ ] Test environment variable loading
- [ ] Document key rotation process

### Phase 2: Server-Side Security (Critical)

- [ ] Implement server-side validation (mirror client-side)
- [ ] Configure CORS policy (production domain)
- [ ] Set up server-side rate limiting (3/hour/IP)
- [ ] Add HTTPS redirect (production)
- [ ] Test all security measures

### Phase 3: API Integration (Required)

- [ ] Integrate Resend API (server-side only)
- [ ] Implement email sending logic
- [ ] Add error handling (graceful failures)
- [ ] Test email delivery
- [ ] Monitor Resend dashboard

### Phase 4: Testing & Validation (Critical)

- [ ] Test API key not exposed in frontend
- [ ] Test input validation (all patterns)
- [ ] Test rate limiting (client + server)
- [ ] Test CORS policy
- [ ] Test error handling
- [ ] Verify no PII in logs

### Phase 5: Compliance (Required)

- [ ] Add privacy policy link to form
- [ ] Add consent checkbox
- [ ] Document data usage in privacy policy
- [ ] Verify GDPR compliance
- [ ] Test user-facing error messages

### Phase 6: Monitoring (Recommended)

- [ ] Set up SecurityMonitor alerts
- [ ] Monitor Resend API usage
- [ ] Track rate limit violations
- [ ] Review logs weekly
- [ ] Document incidents

---

## Key Rotation Process

**Frequency**: Every 90 days or upon suspected compromise

**Steps**:

1. **Generate New Key**
   - Log in to Resend dashboard
   - Navigate to API Keys section
   - Click "Create API Key"
   - Name: `Production - Contact Form - [Date]`
   - Copy key immediately (shown once)

2. **Update Environment Variables**
   - Update `.env.local` in all environments (dev, staging, prod)
   - Deploy configuration changes
   - Verify deployment success

3. **Test Email Functionality**
   - Submit test contact form
   - Verify email received
   - Check Resend logs for success

4. **Revoke Old Key**
   - Return to Resend dashboard
   - Find old API key
   - Click "Revoke"
   - Confirm revocation

5. **Document Rotation**
   - Update key rotation log
   - Record date of rotation
   - Note any issues encountered

**Emergency Rotation** (suspected compromise):

- Rotate immediately (within 1 hour)
- Review logs for unauthorized usage
- Check Resend dashboard for suspicious activity
- Consider changing email domain if necessary

---

## Monitoring & Alerting

### Security Metrics Dashboard

**Key Metrics**:

1. Form submissions per hour
2. Validation failures per hour (by type)
3. Rate limit violations per hour
4. CORS violations
5. API errors (Resend)
6. Response times (p50, p95, p99)

### Alert Thresholds

| Metric                | Threshold | Severity | Action                          |
| --------------------- | --------- | -------- | ------------------------------- |
| Validation failures   | 10+/hour  | HIGH     | Investigate potential attack    |
| Rate limit violations | 5+/hour   | MEDIUM   | Monitor for abuse pattern       |
| CORS violations       | Any       | HIGH     | Security incident, block origin |
| Resend API errors     | 3+/hour   | MEDIUM   | Check API status, key validity  |
| Response time p95     | >2000ms   | LOW      | Performance investigation       |

### Incident Response

**Process**:

1. **Alert Triggered** → SecurityMonitor logs incident
2. **Review Logs** → Identify attack pattern or root cause
3. **Assess Impact** → Determine severity (LOW/MEDIUM/HIGH/CRITICAL)
4. **Take Action**:
   - CRITICAL: Rotate API key, block IPs, deploy hotfix
   - HIGH: Block IPs, investigate, patch vulnerability
   - MEDIUM: Monitor closely, prepare fix
   - LOW: Document, address in next release
5. **Document** → Update incident log, share learnings
6. **Follow Up** → Verify fix, update security requirements

---

## Conclusion

This security requirements document establishes a comprehensive security framework for integrating Resend email API into the contact form. The multi-layered approach combines existing client-side protections with new server-side security measures to ensure:

1. ✅ **API Key Protection**: Keys never exposed to clients
2. ✅ **Input Validation**: Both client and server-side enforcement
3. ✅ **Rate Limiting**: Dual-layer (client + server) abuse prevention
4. ✅ **Data Protection**: No storage, GDPR compliant
5. ✅ **Monitoring**: Comprehensive incident logging and alerting
6. ✅ **Compliance**: GDPR, privacy, and data protection standards

**Next Steps**:

1. Review this document with development team
2. Prioritize implementation checklist
3. Set up development environment
4. Begin Phase 1 (Backend Setup)
5. Test thoroughly before production deployment

**Document Maintenance**:

- Review quarterly or after security incidents
- Update based on new threats or vulnerabilities
- Align with evolving GDPR requirements
- Incorporate lessons learned from incidents

---

**Document Version**: 1.0
**Approved By**: [Pending Review]
**Next Review Date**: January 2, 2026
