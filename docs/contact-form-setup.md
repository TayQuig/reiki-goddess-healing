# Contact Form Setup Guide

## Quick Setup with EmailJS (Recommended)

### 1. Sign up for EmailJS

- Go to https://www.emailjs.com/
- Create a free account (200 emails/month free)

### 2. Set up Email Service

- Add Gmail as your email service
- Connect thereikigoddesshealing@gmail.com

### 3. Create Email Template

- Create a template with these variables:
  - {{firstName}}
  - {{lastName}}
  - {{email}}
  - {{phone}}
  - {{message}}

### 4. Get Your Credentials

- Service ID
- Template ID
- Public Key

### 5. Install EmailJS

```bash
npm install @emailjs/browser
```

### 6. Update ContactPage.tsx

Replace the onSubmit function with:

```typescript
import emailjs from '@emailjs/browser';

// In your component
onSubmit={async (data) => {
  try {
    await emailjs.send(
      'YOUR_SERVICE_ID',
      'YOUR_TEMPLATE_ID',
      {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        message: data.message,
        to_email: 'thereikigoddesshealing@gmail.com'
      },
      'YOUR_PUBLIC_KEY'
    );
    // Success - form component handles the success state
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error; // Form component will handle the error
  }
}}
```

## Environment Variables

Create a `.env` file:

```
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

## Alternative: Netlify Forms (If using Netlify)

Add to your form tag:

```html
data-netlify="true" netlify-honeypot="bot-field"
```

Netlify will automatically handle form submissions.

## Security Notes

- The form already has built-in security features:
  - Rate limiting (3 submissions per hour)
  - Input validation and sanitization
  - XSS protection
  - SQL injection prevention
- EmailJS adds spam protection
- Consider adding reCAPTCHA for additional protection
