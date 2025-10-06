# Contact Form Email Integration - Deployment Checklist

**Feature**: Contact form with Resend email integration
**Status**: 97% Complete - Ready for Deployment
**Estimated Time**: 1-2 days (mostly DNS verification wait time)
**Active Work**: ~2 hours

---

## Pre-Deployment Verification

### ✅ Code Implementation (Complete)

- [x] Backend API endpoint created (`apps/main/api/contact.ts`)
- [x] Frontend API client created (`packages/shared-utils/src/api/contact.ts`)
- [x] ContactPage integrated with API client
- [x] React Email template created (`apps/main/emails/ContactEmailTemplate.tsx`)
- [x] Environment variables documented
- [x] TypeScript compilation: 0 errors
- [x] All tests passing (37/37)
- [x] Test coverage: 95%+ overall
- [x] Manual testing: 97% pass rate (27/28)

### ✅ Documentation (Complete)

- [x] Deployment guide created
- [x] API testing guide created
- [x] Testing documentation updated
- [x] Implementation summary documented
- [x] Manual testing results documented

---

## Phase 1: Resend Account Setup

**Estimated Time**: 15 minutes active + 24-48 hours DNS propagation

### Step 1.1: Create Resend Account

- [ ] Navigate to [resend.com](https://resend.com)
- [ ] Click "Sign Up" or "Get Started"
- [ ] Create account with business email: `thereikigoddesshealing@gmail.com`
- [ ] Verify email address (check inbox for verification link)
- [ ] Complete account setup

**Success Criteria**: ✅ Account created and email verified

---

### Step 1.2: Add and Verify Domain

**Domain to Verify**: `thereikigoddesshealing.com`

#### Add Domain in Resend Dashboard

- [ ] Log in to Resend dashboard
- [ ] Navigate to "Domains" section
- [ ] Click "Add Domain"
- [ ] Enter domain: `thereikigoddesshealing.com`
- [ ] Click "Add Domain"

#### Configure DNS Records

Resend will provide you with DNS records to add. You'll need to add these to your domain registrar (GoDaddy, Namecheap, etc.):

**Expected DNS Records** (exact values will be shown in Resend dashboard):

1. **SPF Record**
   - [ ] Type: `TXT`
   - [ ] Name: `@` (or leave blank, depending on registrar)
   - [ ] Value: `v=spf1 include:resend.com ~all`
   - [ ] TTL: `3600` (or default)

2. **DKIM Record** (for email authentication)
   - [ ] Type: `TXT`
   - [ ] Name: `resend._domainkey` (exact value from Resend dashboard)
   - [ ] Value: Long string starting with `v=DKIM1...` (copy from Resend dashboard)
   - [ ] TTL: `3600` (or default)

3. **DMARC Record** (optional but recommended)
   - [ ] Type: `TXT`
   - [ ] Name: `_dmarc`
   - [ ] Value: `v=DMARC1; p=none; rua=mailto:thereikigoddesshealing@gmail.com`
   - [ ] TTL: `3600` (or default)

#### How to Add DNS Records (Common Registrars)

**GoDaddy**:

1. Log in to GoDaddy account
2. Go to "My Products" → "DNS"
3. Scroll to "Records" section
4. Click "Add" for each record
5. Select type (TXT), enter name and value
6. Save changes

**Namecheap**:

1. Log in to Namecheap
2. Go to "Domain List" → Click "Manage"
3. Select "Advanced DNS" tab
4. Click "Add New Record"
5. Select type (TXT), enter host and value
6. Save changes

**Cloudflare**:

1. Log in to Cloudflare
2. Select your domain
3. Go to "DNS" → "Records"
4. Click "Add record"
5. Select type (TXT), enter name and value
6. Save

#### Verify Domain in Resend

- [ ] Wait 15-30 minutes for DNS propagation (can take up to 48 hours)
- [ ] Return to Resend dashboard → "Domains"
- [ ] Click "Verify" button next to your domain
- [ ] Confirm status shows "Verified" ✅

**Troubleshooting DNS**:

```bash
# Check if DNS records are propagated
dig TXT thereikigoddesshealing.com
dig TXT resend._domainkey.thereikigoddesshealing.com
dig TXT _dmarc.thereikigoddesshealing.com

# Or use online tool: https://mxtoolbox.com/SuperTool.aspx
```

**Success Criteria**: ✅ Domain shows "Verified" status in Resend dashboard

---

### Step 1.3: Generate API Key

- [ ] In Resend dashboard, navigate to "API Keys" section
- [ ] Click "Create API Key"
- [ ] Name the key: `Production - Contact Form - Oct 2025`
- [ ] Select permission: **"Sending Access"** (NOT "Full Access" for security)
- [ ] Click "Create"
- [ ] **IMPORTANT**: Copy the API key immediately (shown only once)
- [ ] Store securely in password manager (1Password, LastPass, etc.)

**API Key Format**: `re_xxxxxxxxxxxxxxxxxxxxxxxxxx`

**Success Criteria**: ✅ API key copied and stored securely

---

### Step 1.4: Configure "From" Email Address

Resend requires a verified "from" address:

**Option A: Use Domain Email** (Recommended)

- From address: `contact@thereikigoddesshealing.com`
- [ ] Set up email forwarding in your domain registrar to forward to `thereikigoddesshealing@gmail.com`
- [ ] Test by sending an email to `contact@thereikigoddesshealing.com`
- [ ] Verify it arrives in Gmail inbox

**Option B: Use Resend Subdomain** (Quick Setup)

- From address: `contact@resend.dev` (Resend provides this)
- Reply-to will still be user's email
- Less professional but works immediately

**Recommended**: Option A for brand consistency

**Success Criteria**: ✅ From email address configured and tested

---

## Phase 2: Vercel Configuration

**Estimated Time**: 30 minutes

### Step 2.1: Add Environment Variables

- [ ] Log in to [Vercel Dashboard](https://vercel.com)
- [ ] Select your project: `reiki-goddess-healing` (or create if not exists)
- [ ] Go to "Settings" → "Environment Variables"

**Add the following variables**:

1. **RESEND_API_KEY** (Server-side only)
   - [ ] Name: `RESEND_API_KEY`
   - [ ] Value: `re_xxxxxxxxxxxxxxxxxxxxxxxxxx` (from Step 1.3)
   - [ ] Environment: Production, Preview, Development (select all)
   - [ ] **IMPORTANT**: Mark as "Secret" (encrypted storage)
   - [ ] Click "Save"

2. **CONTACT_EMAIL** (Where form submissions are sent)
   - [ ] Name: `CONTACT_EMAIL`
   - [ ] Value: `thereikigoddesshealing@gmail.com`
   - [ ] Environment: Production, Preview, Development
   - [ ] Click "Save"

3. **RESEND_FROM_EMAIL** (Sender email address)
   - [ ] Name: `RESEND_FROM_EMAIL`
   - [ ] Value: `contact@thereikigoddesshealing.com` (or `contact@resend.dev`)
   - [ ] Environment: Production, Preview, Development
   - [ ] Click "Save"

4. **NODE_ENV** (Environment identifier)
   - [ ] Name: `NODE_ENV`
   - [ ] Value: `production`
   - [ ] Environment: Production only
   - [ ] Click "Save"

5. **VITE_CONTACT_API_ENDPOINT** (Client-side - frontend needs this)
   - [ ] Name: `VITE_CONTACT_API_ENDPOINT`
   - [ ] Value: `/api/contact`
   - [ ] Environment: Production, Preview, Development
   - [ ] Click "Save"

**Environment Variables Summary**:

```bash
# Server-side (Secret)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx

# Server-side (Non-secret)
CONTACT_EMAIL=thereikigoddesshealing@gmail.com
RESEND_FROM_EMAIL=contact@thereikigoddesshealing.com
NODE_ENV=production

# Client-side (Public - has VITE_ prefix)
VITE_CONTACT_API_ENDPOINT=/api/contact
```

**Success Criteria**: ✅ All 5 environment variables configured in Vercel

---

### Step 2.2: Verify Project Settings

- [ ] In Vercel dashboard, go to "Settings" → "General"
- [ ] Verify **Framework Preset**: Vite
- [ ] Verify **Build Command**: `npm run build`
- [ ] Verify **Output Directory**: `dist`
- [ ] Verify **Install Command**: `npm install`
- [ ] Verify **Root Directory**: `apps/main` (or `.` if monorepo setup)

**Success Criteria**: ✅ Project settings correct

---

### Step 2.3: Configure Serverless Functions

- [ ] In Vercel dashboard, go to "Settings" → "Functions"
- [ ] Verify **Node.js Version**: 20.x (or latest LTS)
- [ ] Verify **Function Region**: Auto (or closest to your users)
- [ ] Verify **Function Timeout**: 10 seconds (default is fine)

**Success Criteria**: ✅ Functions settings verified

---

## Phase 3: Deployment to Staging

**Estimated Time**: 30 minutes

### Step 3.1: Deploy to Preview Environment

- [ ] In your terminal, navigate to project root:

  ```bash
  cd /Users/taylorquigley/Documents/Directories/reiki-goddess-healing
  ```

- [ ] Verify you're on the correct branch:

  ```bash
  git branch
  # Should show: * feat/contact-resend-integration
  ```

- [ ] Commit any uncommitted changes:

  ```bash
  git status
  git add .
  git commit -m "chore: prepare contact form for deployment"
  ```

- [ ] Push to remote repository:

  ```bash
  git push origin feat/contact-resend-integration
  ```

- [ ] Deploy to Vercel preview:

  ```bash
  npx vercel
  ```

- [ ] Follow prompts:
  - Set up and deploy? Yes
  - Which scope? (Select your account)
  - Link to existing project? Yes
  - Project name? reiki-goddess-healing
  - Override settings? No

**Expected Output**:

```
🔍  Inspect: https://vercel.com/your-account/reiki-goddess-healing/xxxxx
✅  Preview: https://reiki-goddess-healing-xxxx.vercel.app
```

- [ ] Copy the preview URL from output

**Success Criteria**: ✅ Preview deployment successful, URL copied

---

### Step 3.2: Test API Endpoint in Staging

**Test with curl**:

- [ ] Open terminal and run test submission:

```bash
curl -X POST https://reiki-goddess-healing-xxxx.vercel.app/api/contact \
  -H "Content-Type: application/json" \
  -H "Origin: https://reiki-goddess-healing-xxxx.vercel.app" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "phone": "(555) 123-4567",
    "message": "This is a test submission from deployment checklist.",
    "agreeToTerms": true
  }'
```

**Expected Response** (Success):

```json
{
  "success": true,
  "emailId": "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794"
}
```

**If you get an error**:

- Check Vercel function logs: Dashboard → Project → Functions → Logs
- Verify environment variables are set correctly
- Check Resend API key is valid
- Verify domain is verified in Resend

- [ ] Verify response shows `"success": true`
- [ ] Verify `emailId` is returned

**Success Criteria**: ✅ API responds with success and email ID

---

### Step 3.3: Verify Email Delivery

- [ ] Check inbox: `thereikigoddesshealing@gmail.com`
- [ ] Look for email with subject: "New Contact Form Submission from Test User"
- [ ] Verify email contains:
  - Sender name: Test User
  - Email: test@example.com
  - Phone: (555) 123-4567
  - Message: "This is a test submission from deployment checklist."
  - Timestamp
  - Website link in footer

**If email doesn't arrive within 1 minute**:

- [ ] Check Resend dashboard → "Logs" for delivery status
- [ ] Check Gmail spam folder
- [ ] Verify CONTACT_EMAIL environment variable is correct
- [ ] Check Resend domain verification status

**Success Criteria**: ✅ Email received in Gmail inbox with correct content

---

### Step 3.4: Test Email Template Rendering

- [ ] Open received email in Gmail
- [ ] Verify brand colors visible (#0205B7 blue)
- [ ] Verify Figtree font for headings (or fallback)
- [ ] Verify all form data displayed correctly
- [ ] Verify timestamp formatted properly
- [ ] Verify footer link works

**Optional - Test in multiple email clients**:

- [ ] Forward email to personal Outlook account (if you have one)
- [ ] Forward email to personal Apple Mail account (if you have one)
- [ ] Verify rendering in each client

**Success Criteria**: ✅ Email renders correctly in Gmail (minimum)

---

### Step 3.5: Test Full User Journey in Staging

- [ ] Open preview URL in browser: `https://reiki-goddess-healing-xxxx.vercel.app`
- [ ] Navigate to Contact page
- [ ] Fill out contact form with test data:
  - First Name: Jane
  - Last Name: Doe
  - Email: your-personal-email@example.com
  - Phone: (555) 987-6543
  - Message: Testing contact form from staging environment
  - [ ] Check "I agree to the privacy policy"
- [ ] Click "Send Message"
- [ ] Verify loading state appears
- [ ] Verify success message appears: "Thank you! Your message has been sent..."
- [ ] Verify form is cleared
- [ ] Check Gmail inbox for email

**Success Criteria**: ✅ Full form submission works, email received

---

### Step 3.6: Test Error Scenarios

**Test 1: Invalid Email**

- [ ] Submit form with invalid email: `invalid-email`
- [ ] Verify error message: "Please enter a valid email address"
- [ ] Verify form data is NOT cleared

**Test 2: Missing Required Field**

- [ ] Leave "First Name" blank
- [ ] Try to submit
- [ ] Verify error message: "Please fill out all required fields"

**Test 3: SQL Injection Prevention**

- [ ] Enter in message field: `SELECT * FROM users; DROP TABLE users;--`
- [ ] Submit form
- [ ] Verify error message about invalid characters
- [ ] Verify email NOT sent

**Test 4: Rate Limiting**

- [ ] Submit form 3 times successfully
- [ ] Try to submit 4th time
- [ ] Verify rate limit message: "You've reached the submission limit..."
- [ ] Verify retry time shown

**Success Criteria**: ✅ All error scenarios handled correctly

---

### Step 3.7: Test Cross-Browser Compatibility

**Chrome** (Primary):

- [ ] Open staging URL in Chrome
- [ ] Submit form successfully
- [ ] Verify all functionality works

**Firefox**:

- [ ] Open staging URL in Firefox
- [ ] Submit form successfully
- [ ] Verify all functionality works

**Safari** (if on Mac):

- [ ] Open staging URL in Safari
- [ ] Submit form successfully
- [ ] Verify all functionality works

**Mobile** (Responsive):

- [ ] Open Chrome DevTools → Toggle device toolbar (Cmd+Shift+M)
- [ ] Test iPhone 12 Pro viewport (390x844)
- [ ] Test iPad viewport (768x1024)
- [ ] Verify form is usable on mobile
- [ ] Submit successfully

**Success Criteria**: ✅ Works in all tested browsers and viewports

---

## Phase 4: Production Deployment

**Estimated Time**: 15 minutes

### Step 4.1: Create Production Deployment

**Option A: Deploy from Branch**

- [ ] Merge feature branch to main:

  ```bash
  git checkout main
  git pull origin main
  git merge feat/contact-resend-integration
  git push origin main
  ```

- [ ] Vercel will automatically deploy from main branch
- [ ] Wait for deployment to complete (~2-5 minutes)
- [ ] Check Vercel dashboard for deployment status

**Option B: Manual Production Deployment**

- [ ] From feature branch, run:

  ```bash
  npx vercel --prod
  ```

- [ ] Follow prompts
- [ ] Wait for deployment to complete

**Success Criteria**: ✅ Production deployment successful

---

### Step 4.2: Verify Production URL

- [ ] Get production URL from Vercel dashboard
  - Should be: `https://thereikigoddesshealing.com` or `https://www.thereikigoddesshealing.com`

- [ ] Open production URL in browser
- [ ] Navigate to Contact page
- [ ] Verify page loads correctly

**Success Criteria**: ✅ Production site accessible

---

### Step 4.3: Test Production API Endpoint

- [ ] Test with curl:

```bash
curl -X POST https://thereikigoddesshealing.com/api/contact \
  -H "Content-Type: application/json" \
  -H "Origin: https://thereikigoddesshealing.com" \
  -d '{
    "firstName": "Production",
    "lastName": "Test",
    "email": "test@example.com",
    "phone": "(555) 123-4567",
    "message": "Production deployment test.",
    "agreeToTerms": true
  }'
```

- [ ] Verify success response
- [ ] Check Gmail for email delivery

**Success Criteria**: ✅ Production API works, email received

---

### Step 4.4: Final Production Smoke Test

- [ ] Submit form from production website with real contact info
- [ ] Verify email received
- [ ] Reply to email to test Reply-To functionality
- [ ] Verify reply goes to submitter's email

**Success Criteria**: ✅ Full production workflow works end-to-end

---

## Phase 5: Monitoring and Alerts Setup

**Estimated Time**: 30 minutes

### Step 5.1: Configure Vercel Alerts

- [ ] In Vercel dashboard → "Settings" → "Notifications"
- [ ] Enable "Deployment Failed" notifications
- [ ] Enable "Function Errors" notifications
- [ ] Add email: `thereikigoddesshealing@gmail.com`
- [ ] Save settings

**Success Criteria**: ✅ Alerts configured

---

### Step 5.2: Set Up Resend Monitoring

- [ ] In Resend dashboard → "Settings" → "Webhooks" (optional)
- [ ] Monitor email delivery in Resend → "Logs"
- [ ] Set up quota alerts:
  - [ ] Navigate to "Settings" → "Notifications"
  - [ ] Enable alert at 80% of monthly quota (2,400 emails)
  - [ ] Enable alert at 90% of monthly quota (2,700 emails)
  - [ ] Add email: `thereikigoddesshealing@gmail.com`

**Success Criteria**: ✅ Resend monitoring configured

---

### Step 5.3: Create Monitoring Dashboard

Create a simple Google Sheet to track metrics:

**Columns**:

- Date
- Total Submissions
- Successful Emails
- Failed Emails
- Rate Limit Hits
- Error Rate %

**Manual check weekly** (or set up automated tracking later)

- [ ] Create Google Sheet: "Contact Form Metrics"
- [ ] Share with `thereikigoddesshealing@gmail.com`
- [ ] Add to bookmarks

**Success Criteria**: ✅ Metrics tracking setup

---

## Phase 6: Documentation and Handoff

**Estimated Time**: 15 minutes

### Step 6.1: Update Production Checklist

- [ ] Mark all checklist items as complete
- [ ] Document any issues encountered
- [ ] Document any deviations from plan
- [ ] Add production URL
- [ ] Add Resend dashboard link
- [ ] Add Vercel dashboard link

**Success Criteria**: ✅ Checklist fully documented

---

### Step 6.2: Create Runbook for Common Issues

Create quick reference document:

**File**: `docs/design/contact-resend-integration/RUNBOOK.md`

Contents:

- How to check if email was sent (Resend logs)
- How to check function errors (Vercel logs)
- How to rotate API keys
- How to handle rate limit complaints
- Emergency contact methods (phone, email link)

- [ ] Create runbook document
- [ ] Test each procedure
- [ ] Share with team

**Success Criteria**: ✅ Runbook created and tested

---

### Step 6.3: Schedule Key Rotation

Set calendar reminders:

- [ ] Rotate Resend API key in 90 days (Jan 1, 2026)
- [ ] Review DNS records in 6 months (Apr 1, 2026)
- [ ] Review email quotas monthly
- [ ] Check security logs quarterly

**Success Criteria**: ✅ Reminders scheduled

---

## Troubleshooting Guide

### Issue: "Invalid API key" error

**Symptoms**: API returns 403 error
**Solution**:

1. Check environment variable `RESEND_API_KEY` in Vercel
2. Verify API key in Resend dashboard hasn't been revoked
3. Regenerate API key if needed
4. Update environment variable in Vercel
5. Redeploy

---

### Issue: Email not received

**Symptoms**: Form submits successfully but no email arrives
**Solution**:

1. Check Resend dashboard → "Logs" for delivery status
2. Check Gmail spam folder
3. Verify `CONTACT_EMAIL` environment variable
4. Check domain verification in Resend dashboard
5. Test with different email address

---

### Issue: "Domain not verified" error

**Symptoms**: Emails bounce or fail to send
**Solution**:

1. Check Resend dashboard → "Domains" for verification status
2. Verify DNS records using `dig` command or mxtoolbox.com
3. Wait up to 48 hours for DNS propagation
4. Re-verify domain in Resend dashboard

---

### Issue: Rate limit exceeded

**Symptoms**: User gets "Too many submissions" error
**Possible Causes**:

1. Legitimate user hit 3/hour limit
2. User cleared localStorage and retried
3. Automated bot/spam attack

**Solution**:

1. Check if legitimate user: Allow them to email directly
2. If spam: Review SecurityValidator logs
3. Consider lowering client-side limit if too many false positives
4. Monitor for patterns of abuse

---

### Issue: CORS error in browser console

**Symptoms**: "Access-Control-Allow-Origin" error in browser
**Solution**:

1. Verify API endpoint returns correct CORS headers
2. Check allowed origins in `apps/main/api/contact.ts`
3. Add production domain if missing
4. Redeploy after changes

---

## Success Criteria - Final Checklist

### Pre-Deployment ✅

- [x] All code implemented
- [x] All tests passing
- [x] Documentation complete

### Resend Setup ✅

- [ ] Account created
- [ ] Domain verified (SPF, DKIM, DMARC)
- [ ] API key generated and stored securely
- [ ] From email configured

### Vercel Configuration ✅

- [ ] Environment variables set (5 total)
- [ ] Project settings verified
- [ ] Serverless function configured

### Staging Deployment ✅

- [ ] Preview deployed successfully
- [ ] API endpoint tested with curl
- [ ] Email delivery verified
- [ ] Email template renders correctly
- [ ] Full user journey tested
- [ ] Error scenarios tested
- [ ] Cross-browser tested

### Production Deployment ✅

- [ ] Production deployed successfully
- [ ] Production URL verified
- [ ] Production API tested
- [ ] Final smoke test completed

### Post-Deployment ✅

- [ ] Vercel alerts configured
- [ ] Resend monitoring setup
- [ ] Metrics tracking created
- [ ] Runbook documented
- [ ] Key rotation scheduled

---

## Estimated Timeline

| Phase                      | Duration           | Type          |
| -------------------------- | ------------------ | ------------- |
| Phase 1: Resend Setup      | 15 min + 24-48 hrs | Active + Wait |
| Phase 2: Vercel Config     | 30 min             | Active        |
| Phase 3: Staging Deploy    | 30 min             | Active        |
| Phase 4: Production Deploy | 15 min             | Active        |
| Phase 5: Monitoring Setup  | 30 min             | Active        |
| Phase 6: Documentation     | 15 min             | Active        |
| **Total Active Time**      | **2 hours 15 min** |               |
| **Total Calendar Time**    | **1-2 days**       | (DNS wait)    |

---

## Emergency Rollback Plan

If something goes wrong in production:

### Quick Rollback (< 5 minutes)

1. In Vercel dashboard, go to "Deployments"
2. Find previous working deployment
3. Click "..." → "Promote to Production"
4. Confirm promotion

### Alternative: Disable Email Sending

1. Set environment variable `RESEND_API_KEY` to empty string
2. Redeploy
3. Form will show error but site stays up
4. Users can still see phone/email contact info

### Communication Plan

If email system is down:

- Update website with banner: "Contact form temporarily unavailable. Please call or email directly."
- Provide phone number: (visible on Contact page)
- Provide email link: thereikigoddesshealing@gmail.com

---

## Contact Information

### Support Resources

**Vercel Support**:

- Dashboard: https://vercel.com/dashboard
- Documentation: https://vercel.com/docs
- Support: https://vercel.com/support

**Resend Support**:

- Dashboard: https://resend.com/dashboard
- Documentation: https://resend.com/docs
- Support: https://resend.com/contact
- Status Page: https://resend-status.com

**Domain Registrar**:

- (Add your registrar details here)
- Support URL:
- Support Email:
- Support Phone:

---

## Notes and Observations

**Use this section to document**:

- Any issues encountered during deployment
- Workarounds applied
- Configuration changes made
- Performance observations
- User feedback

---

**Deployment Checklist Version**: 1.0
**Created**: 2025-10-02
**Last Updated**: 2025-10-02
**Next Review**: After first production deployment

**Status**: ⏳ READY TO EXECUTE
