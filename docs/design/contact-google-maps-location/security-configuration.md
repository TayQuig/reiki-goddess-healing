# Security Configuration for Google Maps Integration

## Overview

This document describes the security configuration implemented for Google Maps integration on The Reiki Goddess Healing contact page. The configuration provides comprehensive security measures while enabling the necessary functionality for map embedding.

## Security Components

### 1. Content Security Policy (CSP) Headers

The CSP configuration in `vercel.json` has been updated to allow Google Maps domains while maintaining security:

```json
{
  "key": "Content-Security-Policy",
  "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://maps.googleapis.com https://maps.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://maps.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https: https://*.googleapis.com https://*.gstatic.com https://*.google.com https://*.googleusercontent.com; connect-src 'self' https://*.googleapis.com https://*.google.com https://*.gstatic.com; frame-src 'self' https://*.google.com; child-src 'self' https://*.google.com; worker-src 'self' blob:"
}
```

**Key Changes:**

- **X-Frame-Options**: Changed from `DENY` to `SAMEORIGIN` to allow map iframes
- **Permissions-Policy**: Updated to `geolocation=self` to enable location features
- **Script Sources**: Added `https://maps.googleapis.com` and `https://maps.gstatic.com`
- **Style Sources**: Added `https://maps.googleapis.com` and `https://fonts.googleapis.com`
- **Image Sources**: Added Google domains for map tiles and markers
- **Frame Sources**: Added `https://*.google.com` for map embeds

### 2. Security Configuration Classes

#### SecurityConfigManager

Located in `packages/shared-utils/src/security/SecurityConfig.ts`, provides:

- **Type-safe configuration** with TypeScript interfaces
- **Environment-specific settings** (development, staging, production)
- **Google Maps domain allowlisting**
- **CSP directive generation**
- **Configuration validation**

```typescript
// Usage example
const configManager = new SecurityConfigManager("production");
const headers = configManager.getHeaders();
const cspString = configManager.getCspString();

// Validation
const { isValid, errors } = configManager.validateConfiguration();
```

#### Security Headers Included

- **Content-Security-Policy**: Generated dynamically based on configuration
- **X-Content-Type-Options**: `nosniff`
- **X-Frame-Options**: `SAMEORIGIN`
- **X-XSS-Protection**: `1; mode=block`
- **Referrer-Policy**: `strict-origin-when-cross-origin`
- **Permissions-Policy**: `camera=(), microphone=(), geolocation=self`
- **Strict-Transport-Security**: `max-age=31536000; includeSubDomains` (production only)

### 3. Map-Specific Security Monitoring

#### MapSecurityMonitor

Specialized monitoring for Google Maps integration:

```typescript
import {
  mapSecurityMonitor,
  setupMapCSPReporting,
} from "@reiki-goddess/shared-utils";

// Set up automatic CSP violation reporting
setupMapCSPReporting();

// Log map loading events
mapSecurityMonitor.logMapLoad({
  success: true,
  loadTime: 1500,
  domain: "reikigoddesshealing.com",
});

// Monitor user interactions
mapSecurityMonitor.logMapInteraction({
  type: "click",
  timestamp: Date.now(),
  userAgent: navigator.userAgent,
});
```

**Monitored Events:**

- Map loading success/failure
- API key exposure (should not occur with Embed API)
- CSP violations
- Suspicious interaction patterns
- Quota usage and limits
- Domain mismatch incidents

### 4. Allowed Google Maps Domains

**Core Domains:**

- `maps.googleapis.com` - Maps JavaScript API
- `maps.gstatic.com` - Map tiles and static resources
- `*.googleapis.com` - Google API services
- `*.gstatic.com` - Google static content
- `*.google.com` - Google services
- `*.googleusercontent.com` - User-generated content

**Security Note:** These domains are necessary for full Google Maps functionality and are considered trusted by Google's security model.

## Phase 2 Readiness

### API Key Management

For Phase 2 implementation (interactive maps with JavaScript API):

```typescript
// Environment configuration
const securityConfig = new SecurityConfigManager("production");

// Update for API key restrictions
securityConfig.updateGoogleMapsConfig({
  restrictToHttps: true,
  allowedDomains: ["reikigoddesshealing.com", "www.reikigoddesshealing.com"],
});
```

### Domain Restrictions Setup

1. **Google Cloud Console Configuration:**
   - Navigate to APIs & Services → Credentials
   - Select your API key
   - Under "Application restrictions" → "HTTP referrers (web sites)"
   - Add: `https://reikigoddesshealing.com/*`
   - Add: `https://www.reikigoddesshealing.com/*`

2. **API Service Restrictions:**
   - Enable only: Maps JavaScript API, Maps Embed API
   - Disable unnecessary services to minimize attack surface

3. **Usage Quotas:**
   - Set monthly limits appropriate for expected traffic
   - Configure billing alerts at 80% and 95% of budget
   - Monitor usage patterns for anomalies

## Security Best Practices

### 1. Regular Security Reviews

- **Quarterly API key rotation**
- **Monthly CSP violation report review**
- **Weekly monitoring of usage patterns**
- **Immediate investigation of security incidents**

### 2. Monitoring Alerts

Configure alerts for:

- CSP violations related to map domains
- Unusual traffic patterns (>200% of baseline)
- API quota approaching limits
- Failed map loads indicating potential issues

### 3. Incident Response

**High Priority Incidents:**

- API key exposure
- Quota exceeded
- CSP violations from unknown domains

**Response Actions:**

1. Immediate API key rotation
2. Domain restriction verification
3. Traffic pattern analysis
4. User communication if service disruption occurs

## Testing Configuration

### Validation Tests

Run security configuration tests:

```bash
npm test -- --run SecurityConfig
npm test -- --run MapSecurityMonitor
```

### Manual Verification

1. **CSP Headers:** Use browser dev tools → Network tab → Response Headers
2. **Map Loading:** Verify no console errors related to CSP
3. **Geolocation:** Test location permission request (if applicable)
4. **Domain Restrictions:** Test from different domains (should fail)

## Integration Points

### Main Application

```typescript
// apps/main/src/main.tsx
import { setupMapCSPReporting } from "@reiki-goddess/shared-utils";

// Initialize security monitoring
setupMapCSPReporting();
```

### Google Map Component

```typescript
// When implementing Phase 2
import {
  mapSecurityMonitor,
  SecurityConfigManager,
} from "@reiki-goddess/shared-utils";

const GoogleMapComponent = () => {
  const configManager = new SecurityConfigManager();

  useEffect(() => {
    // Log map loading attempt
    const startTime = performance.now();

    // Map initialization code here

    mapSecurityMonitor.logMapLoad({
      success: true,
      loadTime: performance.now() - startTime,
      domain: window.location.hostname,
    });
  }, []);

  // Component implementation
};
```

## Compliance Considerations

### GDPR Compliance

- **Data Collection Notice:** Google Maps automatically collects IP addresses and browser information
- **Privacy Policy Update:** Must disclose Google Maps integration and data sharing
- **Cookie Consent:** May require consent banners for EU users
- **User Rights:** Support deletion/modification requests where applicable

### Accessibility

- **Keyboard Navigation:** Ensure map controls are keyboard accessible
- **Screen Reader Support:** Provide alternative text descriptions
- **Fallback Content:** Static image or text directions when maps fail

## Security Metrics

Track these security metrics:

- **CSP Violation Rate:** < 0.1% of page loads
- **Map Load Success Rate:** > 99.9%
- **Security Incident Response Time:** < 15 minutes for critical issues
- **API Key Rotation Frequency:** Quarterly (production)

## Related Documents

- [Technical Considerations](./technical-considerations.md) - Comprehensive security analysis
- [Integration Points](./integration-points.md) - Implementation details
- [Architecture Documentation](/docs/project/ARCHITECTURE.md#security-architecture) - Overall security patterns

---

**Document Status:** ✅ Complete  
**Last Updated:** 2025-09-25  
**Next Review:** 2025-12-25  
**Maintained By:** Security Agent (T005)
