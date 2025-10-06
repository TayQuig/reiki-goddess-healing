# API Testing Guide: Contact Form Email Integration

**Document Version**: 1.0
**Created**: 2025-10-02
**Purpose**: Testing procedures for backend API implementation

---

## Overview

This document provides comprehensive testing procedures for the contact form API endpoint. Tests cover request validation, CORS configuration, rate limiting, email delivery, and error handling.

**API Endpoint**: `POST /api/contact`

---

## Test Environment Setup

### Prerequisites

- curl or Postman installed
- API endpoint accessible (local or deployed)
- Valid Resend API key configured
- Environment variables set

### Local Testing

```bash
# Start development server
cd apps/main
npm run dev

# API available at:
# http://localhost:5173/api/contact
```

### Staging/Production Testing

```bash
# Staging: Preview deployment URL
# Production: https://reikigoddesshealingllc.com/api/contact
```

---

## Test Cases

### 1. Successful Submission

**Purpose**: Verify API accepts valid requests and sends email

**Request**:

```bash
curl -X POST http://localhost:5173/api/contact \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5173" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "(555) 123-4567",
    "message": "I am interested in booking a Reiki healing session. What availability do you have next week?",
    "agreeToTerms": true
  }'
```

**Expected Response** (200 OK):

```json
{
  "success": true,
  "emailId": "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794"
}
```

**Verification**:

- [ ] Response status: 200
- [ ] Response contains `emailId`
- [ ] Email received in business inbox
- [ ] Email contains all form data
- [ ] Reply-To header set to user's email
- [ ] Resend dashboard shows delivery

---

### 2. CORS Preflight (OPTIONS)

**Purpose**: Verify CORS configuration for browser requests

**Request**:

```bash
curl -X OPTIONS http://localhost:5173/api/contact \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v
```

**Expected Response** (200 OK):

```
< HTTP/1.1 200 OK
< Access-Control-Allow-Origin: http://localhost:5173
< Access-Control-Allow-Methods: POST, OPTIONS
< Access-Control-Allow-Headers: Content-Type
```

**Verification**:

- [ ] Response status: 200
- [ ] CORS headers present
- [ ] Origin matches request

---

### 3. Unauthorized Origin

**Purpose**: Verify CORS blocks unauthorized domains

**Request**:

```bash
curl -X POST http://localhost:5173/api/contact \
  -H "Content-Type: application/json" \
  -H "Origin: https://evil.com" \
  -d '{
    "firstName": "Test",
    "email": "test@example.com",
    "message": "Test",
    "agreeToTerms": true
  }'
```

**Expected Response**:

- No `Access-Control-Allow-Origin` header
- Browser blocks request (CORS error)

**Verification**:

- [ ] No CORS header for unauthorized origin
- [ ] Request blocked in browser

---

### 4. Invalid Method (GET)

**Purpose**: Verify only POST requests accepted

**Request**:

```bash
curl -X GET http://localhost:5173/api/contact \
  -v
```

**Expected Response** (405 Method Not Allowed):

```json
{
  "success": false,
  "error": "Method not allowed"
}
```

**Verification**:

- [ ] Response status: 405
- [ ] Error message clear

---

### 5. Missing Required Fields

**Purpose**: Verify server-side validation of required fields

**Request**:

```bash
curl -X POST http://localhost:5173/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "email": "john@example.com"
  }'
```

**Expected Response** (400 Bad Request):

```json
{
  "success": false,
  "error": "Missing required fields"
}
```

**Verification**:

- [ ] Response status: 400
- [ ] Error message identifies issue

---

### 6. Invalid Email Format

**Purpose**: Verify email validation

**Request**:

```bash
curl -X POST http://localhost:5173/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "invalid-email",
    "phone": "555-1234",
    "message": "Test message",
    "agreeToTerms": true
  }'
```

**Expected Response** (400 Bad Request):

```json
{
  "success": false,
  "error": "Invalid email address"
}
```

**Verification**:

- [ ] Response status: 400
- [ ] Invalid emails rejected

---

### 7. SQL Injection Prevention

**Purpose**: Verify SQL injection patterns blocked

**Request**:

```bash
curl -X POST http://localhost:5173/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "phone": "555-1234",
    "message": "SELECT * FROM users; DROP TABLE users;",
    "agreeToTerms": true
  }'
```

**Expected Response** (400 Bad Request):

```json
{
  "success": false,
  "error": "Invalid characters detected. Please use only standard text."
}
```

**Verification**:

- [ ] Response status: 400
- [ ] SQL patterns blocked
- [ ] User-friendly error message

---

### 8. XSS Prevention

**Purpose**: Verify XSS attack patterns blocked

**Request**:

```bash
curl -X POST http://localhost:5173/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "phone": "555-1234",
    "message": "<script>alert(\"XSS\")</script>",
    "agreeToTerms": true
  }'
```

**Expected Response** (400 Bad Request):

```json
{
  "success": false,
  "error": "Invalid formatting detected. Please use plain text only."
}
```

**Verification**:

- [ ] Response status: 400
- [ ] XSS patterns blocked

---

### 9. Email Injection Prevention

**Purpose**: Verify email header injection blocked

**Request**:

```bash
curl -X POST http://localhost:5173/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com\r\nBcc: attacker@evil.com",
    "phone": "555-1234",
    "message": "Test message",
    "agreeToTerms": true
  }'
```

**Expected Response** (400 Bad Request):

```json
{
  "success": false,
  "error": "Invalid email format detected."
}
```

**Verification**:

- [ ] Response status: 400
- [ ] Email injection blocked

---

### 10. Medical Term Blocking

**Purpose**: Verify medical terms blocked (liability protection)

**Request**:

```bash
curl -X POST http://localhost:5173/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "phone": "555-1234",
    "message": "Can you diagnose my medical condition and prescribe medication?",
    "agreeToTerms": true
  }'
```

**Expected Response** (400 Bad Request):

```json
{
  "success": false,
  "error": "Please avoid medical terminology. We provide wellness services, not medical treatment."
}
```

**Verification**:

- [ ] Response status: 400
- [ ] Medical terms blocked
- [ ] User-friendly, explanatory message

---

### 11. Rate Limiting

**Purpose**: Verify 3 requests/hour/IP limit enforced

**Request**:

```bash
# Submit 4 requests in rapid succession
for i in {1..4}; do
  echo "Request $i:"
  curl -X POST http://localhost:5173/api/contact \
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
  sleep 1
done
```

**Expected Response**:

- Requests 1-3: 200 OK (success)
- Request 4: 429 Too Many Requests

```json
{
  "success": false,
  "error": "Too many submissions. Please try again in an hour."
}
```

**Expected Headers** (on 429):

```
Retry-After: 3600
```

**Verification**:

- [ ] First 3 requests succeed
- [ ] 4th request returns 429
- [ ] Retry-After header present
- [ ] Error message user-friendly

---

### 12. Message Length Validation

**Purpose**: Verify message length limit (10,000 chars)

**Request**:

```bash
# Generate 10,001 character message
MESSAGE=$(printf 'A%.0s' {1..10001})

curl -X POST http://localhost:5173/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "phone": "555-1234",
    "message": "'"$MESSAGE"'",
    "agreeToTerms": true
  }'
```

**Expected Response** (400 Bad Request):

```json
{
  "success": false,
  "error": "Message too long. Please keep under 10,000 characters."
}
```

**Verification**:

- [ ] Response status: 400
- [ ] Long messages rejected

---

### 13. Missing API Key

**Purpose**: Verify graceful handling when API key not configured

**Setup**:

```bash
# Temporarily remove RESEND_API_KEY from environment
unset RESEND_API_KEY
```

**Request**:

```bash
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

**Expected Response** (500 Internal Server Error):

```json
{
  "success": false,
  "error": "Email service not configured. Please contact us directly."
}
```

**Verification**:

- [ ] Response status: 500
- [ ] Error message doesn't expose API key
- [ ] User given alternative contact method

---

### 14. Resend API Error

**Purpose**: Verify handling of Resend API errors

**Setup**:

```bash
# Use invalid API key
export RESEND_API_KEY=re_invalid_key
```

**Request**:

```bash
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

**Expected Response** (500 Internal Server Error):

```json
{
  "success": false,
  "error": "Failed to send email. Please try again later or contact us directly."
}
```

**Verification**:

- [ ] Response status: 500
- [ ] Error message generic (no technical details)
- [ ] Server logs contain actual error
- [ ] API key not exposed

---

## Automated Testing Script

Save as `test-contact-api.sh`:

```bash
#!/bin/bash

API_URL="${1:-http://localhost:5173/api/contact}"
PASSED=0
FAILED=0

echo "Testing Contact Form API: $API_URL"
echo "========================================"

# Test 1: Successful submission
echo "\n[TEST 1] Successful submission"
RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5173" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "555-1234",
    "message": "Test message",
    "agreeToTerms": true
  }')

if echo "$RESPONSE" | grep -q '"success":true'; then
  echo "✅ PASS: Successful submission"
  PASSED=$((PASSED + 1))
else
  echo "❌ FAIL: Successful submission"
  echo "Response: $RESPONSE"
  FAILED=$((FAILED + 1))
fi

# Test 2: Missing required fields
echo "\n[TEST 2] Missing required fields"
RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "email": "john@example.com"
  }')

if echo "$RESPONSE" | grep -q '"success":false'; then
  echo "✅ PASS: Missing fields rejected"
  PASSED=$((PASSED + 1))
else
  echo "❌ FAIL: Missing fields not rejected"
  FAILED=$((FAILED + 1))
fi

# Test 3: Invalid email
echo "\n[TEST 3] Invalid email format"
RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "invalid-email",
    "phone": "555-1234",
    "message": "Test",
    "agreeToTerms": true
  }')

if echo "$RESPONSE" | grep -q '"success":false'; then
  echo "✅ PASS: Invalid email rejected"
  PASSED=$((PASSED + 1))
else
  echo "❌ FAIL: Invalid email not rejected"
  FAILED=$((FAILED + 1))
fi

# Test 4: SQL injection
echo "\n[TEST 4] SQL injection prevention"
RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "phone": "555-1234",
    "message": "SELECT * FROM users",
    "agreeToTerms": true
  }')

if echo "$RESPONSE" | grep -q '"success":false'; then
  echo "✅ PASS: SQL injection blocked"
  PASSED=$((PASSED + 1))
else
  echo "❌ FAIL: SQL injection not blocked"
  FAILED=$((FAILED + 1))
fi

# Test 5: XSS prevention
echo "\n[TEST 5] XSS prevention"
RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "phone": "555-1234",
    "message": "<script>alert(\"XSS\")</script>",
    "agreeToTerms": true
  }')

if echo "$RESPONSE" | grep -q '"success":false'; then
  echo "✅ PASS: XSS blocked"
  PASSED=$((PASSED + 1))
else
  echo "❌ FAIL: XSS not blocked"
  FAILED=$((FAILED + 1))
fi

# Test 6: Medical terms
echo "\n[TEST 6] Medical term blocking"
RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "phone": "555-1234",
    "message": "Can you diagnose my illness?",
    "agreeToTerms": true
  }')

if echo "$RESPONSE" | grep -q '"success":false'; then
  echo "✅ PASS: Medical terms blocked"
  PASSED=$((PASSED + 1))
else
  echo "❌ FAIL: Medical terms not blocked"
  FAILED=$((FAILED + 1))
fi

echo "\n========================================"
echo "Test Results:"
echo "  ✅ Passed: $PASSED"
echo "  ❌ Failed: $FAILED"
echo "  Total: $((PASSED + FAILED))"
echo "========================================"

if [ $FAILED -eq 0 ]; then
  echo "\n🎉 All tests passed!"
  exit 0
else
  echo "\n⚠️  Some tests failed. Review output above."
  exit 1
fi
```

**Usage**:

```bash
# Make executable
chmod +x test-contact-api.sh

# Test local
./test-contact-api.sh http://localhost:5173/api/contact

# Test staging
./test-contact-api.sh https://your-preview.vercel.app/api/contact

# Test production
./test-contact-api.sh https://reikigoddesshealingllc.com/api/contact
```

---

## Performance Testing

### Response Time

**Purpose**: Verify API responds within 3 seconds (p95)

**Request**:

```bash
# Test 10 requests and measure response time
for i in {1..10}; do
  time curl -s -X POST http://localhost:5173/api/contact \
    -H "Content-Type: application/json" \
    -d '{
      "firstName": "Test",
      "lastName": "User",
      "email": "test@example.com",
      "phone": "555-1234",
      "message": "Test message",
      "agreeToTerms": true
    }' > /dev/null
done
```

**Expected**:

- p50 < 1 second
- p95 < 3 seconds
- p99 < 5 seconds

**Verification**:

- [ ] Response times acceptable
- [ ] No timeouts

---

## Email Delivery Verification

### Manual Verification

1. **Submit test form**
2. **Check Resend dashboard**:
   - Navigate to **Emails** tab
   - Find email by timestamp
   - Verify status: `delivered`
   - Check delivery timeline
3. **Check business inbox**:
   - Email received
   - All form data present
   - Formatting correct
   - Reply-To header set
4. **Test reply**:
   - Click "Reply" in email client
   - Verify reply goes to user's email

### Email Content Verification

**Checklist**:

- [ ] Subject line: "New Contact Form Submission from [Name]"
- [ ] From: Reiki Goddess Healing
- [ ] To: Business email
- [ ] Reply-To: User's email
- [ ] Body contains:
  - [ ] Timestamp
  - [ ] Full name
  - [ ] Email address
  - [ ] Phone number
  - [ ] Message (preserves whitespace)
  - [ ] Footer text

---

## Test Summary Template

Use this template to document test results:

```markdown
# Contact API Test Results

**Date**: [Date]
**Environment**: [Local/Staging/Production]
**API URL**: [URL]
**Tester**: [Name]

## Test Results

| Test                  | Status  | Notes         |
| --------------------- | ------- | ------------- |
| Successful submission | ✅ PASS | Email ID: xxx |
| CORS preflight        | ✅ PASS |               |
| Invalid origin        | ✅ PASS |               |
| Invalid method        | ✅ PASS |               |
| Missing fields        | ✅ PASS |               |
| Invalid email         | ✅ PASS |               |
| SQL injection         | ✅ PASS |               |
| XSS prevention        | ✅ PASS |               |
| Email injection       | ✅ PASS |               |
| Medical terms         | ✅ PASS |               |
| Rate limiting         | ✅ PASS |               |
| Message length        | ✅ PASS |               |
| Missing API key       | ✅ PASS |               |
| Resend error          | ✅ PASS |               |

## Performance

- p50: [X]ms
- p95: [X]ms
- p99: [X]ms

## Email Delivery

- ✅ Email received
- ✅ Content correct
- ✅ Reply-To works

## Issues Found

[List any issues or concerns]

## Recommendations

[Any improvements or next steps]
```

---

**Document Version**: 1.0
**Last Updated**: October 2, 2025
**Maintained By**: Backend Team
