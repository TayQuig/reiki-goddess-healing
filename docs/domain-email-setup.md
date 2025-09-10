# Domain Email Setup for Contact Form

## Using Domain Email with Resend (Recommended)

### Why Resend?

- Built specifically for developers
- Excellent domain email support
- 100 free emails/day
- Great React/Next.js integration
- Simple API

### Setup Steps

#### 1. Sign up for Resend

- Go to https://resend.com
- Create an account

#### 2. Add Your Domain

- Add `thereikigoddesshealing.com` to Resend
- Add the DNS records they provide:
  ```
  TXT  resend._domainkey  p=MIGfMA0GCS...
  TXT  _dmarc            v=DMARC1; p=none;
  TXT  @                 v=spf1 include:sendgrid.net ~all
  ```

#### 3. Install Resend

```bash
npm install resend
```

#### 4. Create API Endpoint (in your app)

```typescript
// api/send-email.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(data: FigmaContactFormData) {
  const { error } = await resend.emails.send({
    from: "Contact Form <noreply@thereikigoddesshealing.com>",
    to: "contact@thereikigoddesshealing.com",
    subject: `New Contact from ${data.firstName} ${data.lastName}`,
    reply_to: data.email,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Message:</strong></p>
      <p>${data.message}</p>
    `,
  });

  if (error) {
    throw error;
  }
}
```

#### 5. Update ContactPage

```typescript
onSubmit={async (data) => {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error('Failed to send');

    // Success handled by form component
  } catch (error) {
    console.error('Failed to send:', error);
    throw error;
  }
}}
```

## Alternative: Direct SMTP with Nodemailer

If you have SMTP credentials from your hosting provider:

```typescript
// Using Nodemailer
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'mail.thereikigoddesshealing.com', // Your SMTP server
  port: 587,
  secure: false,
  auth: {
    user: 'contact@thereikigoddesshealing.com',
    pass: process.env.EMAIL_PASSWORD
  }
});

// Send email
await transporter.sendMail({
  from: '"Contact Form" <noreply@thereikigoddesshealing.com>',
  to: 'contact@thereikigoddesshealing.com',
  replyTo: data.email,
  subject: 'New Contact Form Submission',
  html: // ... email content
});
```

## Email Configuration Best Practices

1. **Use Different Addresses**:
   - `noreply@thereikigoddesshealing.com` - For sending automated emails
   - `contact@thereikigoddesshealing.com` - For receiving submissions
   - `deirdre@thereikigoddesshealing.com` - For personal business email

2. **Set Reply-To Header**:
   - Set reply-to as the user's email so you can respond directly

3. **DNS Records**:
   - SPF: Authorizes who can send from your domain
   - DKIM: Cryptographic signature
   - DMARC: Policy for handling failures

## Which Option to Choose?

- **Resend/SendGrid**: Best for reliability and features
- **Direct SMTP**: Good if you already have email hosting
- **EmailJS**: Still works, but less professional

The domain email gives you more control and professional appearance!
