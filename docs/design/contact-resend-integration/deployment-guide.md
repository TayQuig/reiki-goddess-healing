# Vercel Deployment Guide: Contact Form Email Integration

**Document Version**: 1.0
**Created**: 2025-10-02
**Status**: Ready for Implementation
**Related**: T009 - Deploy and test in Vercel staging

---

## Overview

This guide provides step-by-step instructions for deploying the contact form email integration to Vercel. The implementation uses Vercel Serverless Functions to handle email submissions via the Resend API.

**Prerequisites**:

- Vercel account
- Resend account with API key
- Domain verification in Resend dashboard
- Repository connected to Vercel

---

## Table of Contents

1. [Resend Account Setup](#resend-account-setup)
2. [Vercel Project Configuration](#vercel-project-configuration)
3. [Environment Variables](#environment-variables)
4. [Deployment Process](#deployment-process)
5. [Testing](#testing)
6. [Monitoring](#monitoring)
7. [Troubleshooting](#troubleshooting)

---

## Resend Account Setup

### Step 1: Create Resend Account

1. Go to [resend.com](https://resend.com)
2. Sign up with business email
3. Verify email address

### Step 2: Verify Domain

**Important**: You must verify your domain before sending emails in production.

1. Navigate to **Domains** in Resend dashboard
2. Click **Add Domain**
3. Enter domain: `reikigoddesshealingllc.com`
4. Add DNS records to your domain registrar:

   **SPF Record**:

   ```
   Type: TXT
   Name: @
   Value: v=spf1 include:resend.com ~all
   ```

   **DKIM Record**:

   ```
   Type: TXT
   Name: resend._domainkey
   Value: [Provided by Resend dashboard]
   ```

   **DMARC Record** (Recommended):

   ```
   Type: TXT
   Name: _dmarc
   Value: v=DMARC1; p=none; rua=mailto:thereikigoddesshealing@gmail.com
   ```

5. Wait for verification (usually 24-48 hours)
6. Verify status in Resend dashboard

### Step 3: Generate API Key

1. Navigate to **API Keys** in Resend dashboard
2. Click **Create API Key**
3. Name: `Production - Contact Form - [Date]`
4. Permission: **Sending Access** (recommended for security)
5. Copy API key immediately (shown only once)
6. Store securely in password manager

**Security Notes**:

- Use "Sending Access" keys (restricted permissions)
- Never commit API keys to version control
- Rotate keys every 90 days
- Use separate keys for dev/staging/production

---

## Vercel Project Configuration

### Step 1: Connect Repository

1. Log in to [vercel.com](https://vercel.com)
2. Click **Add New Project**
3. Import repository: `reiki-goddess-healing`
4. Select framework preset: **Vite**
5. Root directory: `apps/main`
6. Click **Deploy**

### Step 2: Configure Build Settings

**Build Command**:

```bash
npm run build
```

**Output Directory**:

```
dist
```

**Install Command**:

```bash
npm install
```

### Step 3: Configure API Routes

Vercel automatically detects serverless functions in the `/api` directory.

**File Structure**:

```
apps/main/
├── api/
│   └── contact.ts    # Serverless function
├── src/
└── package.json
```

**Vercel Configuration** (create `vercel.json` if needed):

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "functions": {
    "api/**/*.ts": {
      "runtime": "nodejs20.x"
    }
  }
}
```

---

## Environment Variables

### Required Variables

Configure these in Vercel dashboard: **Project Settings → Environment Variables**

#### 1. RESEND_API_KEY

- **Type**: Secret
- **Value**: Your Resend API key (from Step 3 above)
- **Environments**: Production, Preview, Development
- **Example**: `re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

**Security**:

- Mark as "Secret" (encrypted)
- Never expose in client code
- Server-side only (no VITE\_ prefix)

#### 2. CONTACT_EMAIL

- **Type**: Plain Text
- **Value**: Business owner email address
- **Environments**: Production, Preview, Development
- **Example**: `thereikigoddesshealing@gmail.com`

#### 3. RESEND_FROM_EMAIL

- **Type**: Plain Text
- **Value**: Sender email (must be verified domain)
- **Environments**: Production, Preview, Development
- **Example**: `contact@reikigoddesshealingllc.com`

#### 4. NODE_ENV

- **Type**: Plain Text
- **Value**: Environment name
- **Environments**:
  - Production: `production`
  - Preview: `staging`
  - Development: `development`

### Setting Environment Variables in Vercel

1. Go to **Project Settings**
2. Click **Environment Variables**
3. For each variable:
   - Enter **Key** (e.g., `RESEND_API_KEY`)
   - Enter **Value**
   - Select environments (Production, Preview, Development)
   - Click **Save**
4. Re-deploy to apply changes

**Screenshot Guide**:

```
Settings → Environment Variables → Add New

┌────────────────────────────────────────┐
│ Key: RESEND_API_KEY                    │
│ Value: re_xxxxxxxxxxxxx                │
│ ☑ Production                           │
│ ☑ Preview                              │
│ ☑ Development                          │
│ [Save]                                 │
└────────────────────────────────────────┘
```

---

## Deployment Process

### Development Deployment

1. **Local Testing**:

   ```bash
   cd apps/main
   npm run dev
   ```

2. **Test API locally** (requires local .env.local with API key):

   ```bash
   # Start dev server
   npm run dev

   # In another terminal, test API
   curl -X POST http://localhost:5173/api/contact \
     -H "Content-Type: application/json" \
     -d '{
       "firstName": "Test",
       "lastName": "User",
       "email": "test@example.com",
       "phone": "555-1234",
       "message": "Test message",
       "agreeToTerms": true
     }'
   ```

### Staging Deployment

1. **Create Preview Deployment**:

   ```bash
   git checkout feat/contact-resend-integration
   git push origin feat/contact-resend-integration
   ```

2. Vercel automatically creates preview deployment
3. Preview URL: `https://reiki-goddess-healing-[hash].vercel.app`
4. Test API endpoint: `https://[preview-url]/api/contact`

### Production Deployment

1. **Merge to main branch**:

   ```bash
   git checkout main
   git merge feat/contact-resend-integration
   git push origin main
   ```

2. Vercel automatically deploys to production
3. Production URL: `https://reikigoddesshealingllc.com`
4. API endpoint: `https://reikigoddesshealingllc.com/api/contact`

---

## Testing

### Manual Testing Checklist

#### 1. API Endpoint Accessibility

**Test**: API responds to POST requests

```bash
curl -X POST https://[your-domain]/api/contact \
  -H "Content-Type: application/json" \
  -H "Origin: https://[your-domain]" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "555-1234",
    "message": "Test message",
    "agreeToTerms": true
  }'
```

**Expected Response**:

```json
{
  "success": true,
  "emailId": "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794"
}
```

#### 2. CORS Configuration

**Test**: CORS headers correct for allowed origins

```bash
curl -X OPTIONS https://[your-domain]/api/contact \
  -H "Origin: https://reikigoddesshealingllc.com" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

**Expected Headers**:

```
Access-Control-Allow-Origin: https://reikigoddesshealingllc.com
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

#### 3. Validation Tests

**Test**: Server-side validation blocks invalid inputs

```bash
# Test SQL injection prevention
curl -X POST https://[your-domain]/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "phone": "555-1234",
    "message": "SELECT * FROM users",
    "agreeToTerms": true
  }'
```

**Expected Response**:

```json
{
  "success": false,
  "error": "Invalid characters detected. Please use only standard text."
}
```

#### 4. Rate Limiting

**Test**: Rate limiting enforced (3 requests/hour/IP)

```bash
# Submit 4 requests rapidly
for i in {1..4}; do
  curl -X POST https://[your-domain]/api/contact \
    -H "Content-Type: application/json" \
    -d '{
      "firstName": "Test",
      "lastName": "User '$i'",
      "email": "test@example.com",
      "phone": "555-1234",
      "message": "Test message '$i'",
      "agreeToTerms": true
    }'
  echo "\n---\n"
done
```

**Expected**: 4th request returns HTTP 429

```json
{
  "success": false,
  "error": "Too many submissions. Please try again in an hour."
}
```

#### 5. Email Delivery

**Test**: Email arrives in inbox

1. Submit form via UI
2. Check Resend dashboard for delivery status
3. Check business email inbox
4. Verify email content matches submission

**Resend Dashboard**:

- Navigate to **Emails** tab
- Find recent email by ID
- Check status: `delivered`
- View delivery timeline

#### 6. Error Handling

**Test**: Invalid API key returns user-friendly error

```bash
# Temporarily set invalid API key in Vercel
# Then submit form
```

**Expected Response**:

```json
{
  "success": false,
  "error": "Failed to send email. Please try again later or contact us directly."
}
```

**Note**: Error should NOT expose API key or technical details

---

## Monitoring

### Vercel Logs

**Access**:

1. Go to **Deployments** tab
2. Click on latest deployment
3. Click **Functions**
4. Select `api/contact.ts`
5. View logs in real-time

**What to Monitor**:

- Successful email sends
- Validation failures
- Rate limit violations
- API errors

### Resend Dashboard

**Metrics to Track**:

1. **Emails Sent**: Total count per day/month
2. **Delivery Rate**: Percentage delivered successfully
3. **Bounce Rate**: Failed deliveries
4. **Open Rate**: (Optional, for auto-replies)

**Alerts**:

- Set up email alerts for quota thresholds (80%, 90%)
- Monitor daily limit usage (100 emails/day on free tier)

### Error Logging

**Server Logs** (Vercel):

```typescript
// Already implemented in contact.ts
console.log(`Email sent successfully. ID: ${data?.id}, IP: ${clientIP}`);
console.error("Resend API error:", error);
console.log(`Validation failed: ${validation.error}`);
```

**Access Logs**:

```bash
# Via Vercel CLI
vercel logs [deployment-url]
```

---

## Troubleshooting

### Common Issues

#### 1. Email Not Sending

**Symptoms**: API returns success but no email received

**Possible Causes**:

- Domain not verified in Resend
- API key invalid or expired
- Sender email not verified

**Resolution**:

1. Check Resend dashboard → Domains (verify status)
2. Regenerate API key if needed
3. Check spam folder
4. Verify `RESEND_FROM_EMAIL` matches verified domain

#### 2. CORS Errors

**Symptoms**: Browser console shows CORS error

**Possible Causes**:

- Origin not in allowed list
- Incorrect CORS headers

**Resolution**:

1. Check `ALLOWED_ORIGINS` in `contact.ts`
2. Add production domain if missing
3. Verify Origin header in request matches allowed origin

#### 3. Rate Limit False Positives

**Symptoms**: User blocked after 1-2 submissions

**Possible Causes**:

- Shared IP address (corporate network)
- Proxy/VPN changing IP

**Resolution**:

1. Clear rate limit store (restart function)
2. Consider increasing limit for preview environments
3. Implement IP whitelist for testing

#### 4. API Key Not Found

**Symptoms**: Error "Email service not configured"

**Possible Causes**:

- Environment variable not set in Vercel
- Variable name typo

**Resolution**:

1. Verify environment variable exists: `RESEND_API_KEY`
2. Re-deploy after adding variable
3. Check variable is available in correct environment (Production/Preview/Development)

#### 5. Validation Failing Unexpectedly

**Symptoms**: Valid submissions rejected

**Possible Causes**:

- Over-aggressive validation patterns
- Medical terms in wellness context

**Resolution**:

1. Review validation patterns in `contact.ts`
2. Check server logs for specific validation failure
3. Adjust patterns if needed (with caution)

---

## Production Checklist

Before deploying to production, verify:

### Pre-Deployment

- [ ] Resend domain verified (status: Active)
- [ ] API key generated (Sending Access)
- [ ] DNS records configured (SPF, DKIM, DMARC)
- [ ] Environment variables set in Vercel (all 4 required)
- [ ] TypeScript compilation passes (0 errors)
- [ ] All tests passing (unit + integration)

### Deployment

- [ ] Preview deployment tested in staging
- [ ] Email delivery confirmed (test submission)
- [ ] CORS headers verified
- [ ] Rate limiting tested (3 submissions)
- [ ] Validation tests passed (SQL, XSS, medical terms)
- [ ] Error handling tested (invalid key, network errors)

### Post-Deployment

- [ ] Production domain accessible
- [ ] API endpoint responds (200 OK)
- [ ] Test email sent successfully
- [ ] Email received in business inbox
- [ ] Resend dashboard shows delivery
- [ ] No errors in Vercel logs
- [ ] Contact form UI updated (onSubmit handler)

### Monitoring Setup

- [ ] Vercel logs monitored
- [ ] Resend dashboard checked daily
- [ ] Quota alerts configured (80%, 90%)
- [ ] Error alerting enabled
- [ ] Performance metrics tracked (response time)

---

## Key Rotation Process

**Frequency**: Every 90 days or immediately upon suspected compromise

### Steps

1. **Generate New Key**:
   - Log in to Resend dashboard
   - Navigate to **API Keys**
   - Click **Create API Key**
   - Name: `Production - Contact Form - [New Date]`
   - Permission: **Sending Access**
   - Copy key immediately

2. **Update Vercel**:
   - Go to **Project Settings → Environment Variables**
   - Find `RESEND_API_KEY`
   - Click **Edit**
   - Paste new key
   - Click **Save**

3. **Re-deploy**:
   - Vercel automatically re-deploys on environment variable change
   - Monitor deployment logs

4. **Test**:
   - Submit test form
   - Verify email delivery
   - Check Resend logs

5. **Revoke Old Key**:
   - Return to Resend dashboard
   - Find old API key
   - Click **Revoke**
   - Confirm revocation

6. **Document**:
   - Update key rotation log
   - Record date of rotation
   - Note any issues

---

## Support Resources

### Vercel

- **Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Functions Guide**: [vercel.com/docs/functions](https://vercel.com/docs/functions)
- **Support**: [vercel.com/support](https://vercel.com/support)

### Resend

- **Documentation**: [resend.com/docs](https://resend.com/docs)
- **API Reference**: [resend.com/docs/api-reference](https://resend.com/docs/api-reference)
- **Support**: [resend.com/contact](https://resend.com/contact)
- **Status Page**: [resend-status.com](https://resend-status.com)

### Community

- **GitHub Issues**: [Repository issues](https://github.com/your-repo/issues)
- **Resend Discussions**: [GitHub Discussions](https://github.com/resendlabs/resend-node/discussions)

---

## Next Steps

After successful deployment:

1. **Monitor for 24-48 hours**:
   - Check Vercel logs for errors
   - Monitor Resend delivery rates
   - Track quota usage

2. **Optimize if needed**:
   - Adjust rate limits based on usage
   - Update validation patterns if false positives
   - Improve error messages based on user feedback

3. **Plan for scale**:
   - Monitor quota approaching limits
   - Consider upgrading Resend plan if needed
   - Implement Redis for distributed rate limiting

4. **Implement T007** (React Email Template):
   - Replace HTML template with React Email
   - Improve email design with branding
   - Test across email clients

5. **Add monitoring dashboard**:
   - Track submission rates
   - Monitor error rates
   - Alert on anomalies

---

**Document Version**: 1.0
**Last Updated**: October 2, 2025
**Maintained By**: Backend Team
**Review Date**: January 2, 2026
