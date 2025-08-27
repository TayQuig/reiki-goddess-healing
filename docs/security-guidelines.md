# Security Guidelines - The Reiki Goddess Healing

## HTTPS Enforcement

### All API Calls Must Use HTTPS

**Why**: HTTPS encrypts data in transit, protecting customer information and authentication credentials.

### Implementation Guidelines

#### 1. Frontend API Calls

```typescript
// ✅ CORRECT
const API_BASE = "https://api.reikigoddesshealing.com";

// ❌ NEVER DO THIS
const API_BASE = "http://api.reikigoddesshealing.com";
```

#### 2. Environment Variables

```env
# .env.production
API_URL=https://api.reikigoddesshealing.com
PAYMENT_GATEWAY=https://secure.payment-provider.com
```

#### 3. Form Actions

```tsx
// Contact forms must submit to HTTPS endpoints
<form action="https://api.reikigoddesshealing.com/contact" method="POST">
```

#### 4. Image and Asset Loading

```tsx
// CDN assets should use HTTPS
<img src="https://cdn.reikigoddesshealing.com/images/hero.jpg" />
```

### Security Headers

Add these headers to your server configuration:

```javascript
// Express.js example
app.use((req, res, next) => {
  // Force HTTPS
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );

  // Prevent clickjacking
  res.setHeader("X-Frame-Options", "SAMEORIGIN");

  // XSS Protection
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // Content Security Policy
  res.setHeader("Content-Security-Policy", "default-src 'self' https:;");

  next();
});
```

### Redirect HTTP to HTTPS

#### Netlify Configuration

```toml
# netlify.toml
[[redirects]]
  from = "http://reikigoddesshealing.com/*"
  to = "https://reikigoddesshealing.com/:splat"
  status = 301
  force = true
```

#### Vercel Configuration

```json
// vercel.json
{
  "redirects": [
    {
      "source": "/(.*)",
      "destination": "https://reikigoddesshealing.com/$1",
      "permanent": true
    }
  ]
}
```

## Data Protection

### Customer Information

- **Never log** customer PII (names, emails, phone numbers)
- **Always validate** input on both client and server
- **Sanitize** all user inputs before storage
- **Encrypt** sensitive data at rest

### Payment Information

- **Never store** credit card numbers
- **Use tokenization** via payment providers (Stripe, Square)
- **PCI compliance** is handled by payment provider

### Health Information

- **Minimize collection** of health data
- **Separate storage** from general contact forms
- **Explicit consent** required before collection
- **HIPAA considerations** for health-related data

## Pre-commit Security Checks

The following checks run automatically before each commit:

1. **Secret Scanning**: Blocks commits with API keys, passwords, tokens
2. **Lint & Format**: Ensures code quality and consistency
3. **Type Checking**: Catches TypeScript errors
4. **Dependency Audit**: Warns about vulnerable packages

### Manual Security Commands

```bash
# Check for vulnerabilities
npm run security:check

# Fix vulnerabilities (use with caution)
npm run security:fix

# Full security audit
npm audit

# Update dependencies safely
npm update --save
```

## Incident Response

If sensitive data is accidentally committed:

1. **Immediately** revoke/rotate the exposed credential
2. **Remove from history** using `git filter-branch` or BFG Repo-Cleaner
3. **Force push** the cleaned history
4. **Notify team** of the incident
5. **Update** this document with lessons learned

## Regular Security Tasks

### Weekly

- [ ] Run `npm audit` and review findings
- [ ] Check for dependency updates

### Monthly

- [ ] Review access logs for suspicious activity
- [ ] Update dependencies with security patches
- [ ] Test backup and recovery procedures

### Quarterly

- [ ] Security training/awareness review
- [ ] Update security documentation
- [ ] Review and rotate API keys

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [React Security Best Practices](https://react.dev/learn/security)
- [npm Security Best Practices](https://docs.npmjs.com/packages-and-modules/securing-your-code)

---

_Last Updated_: 2025-08-24
_Next Review_: 2025-09-24
