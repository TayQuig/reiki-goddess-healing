/**
 * Contact Form Email Template
 * Professional, brand-consistent email template using React Email
 */

import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
  Heading,
  Font,
} from "@react-email/components";

export interface ContactEmailProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  submittedAt?: string;
}

export function ContactEmailTemplate({
  firstName,
  lastName,
  email,
  phone,
  message,
  submittedAt = new Date().toISOString(),
}: ContactEmailProps) {
  const fullName = lastName ? `${firstName} ${lastName}` : firstName;
  const formattedDate = new Date(submittedAt).toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "short",
  });

  return (
    <Html>
      <Head>
        <Font
          fontFamily="Figtree"
          fallbackFontFamily="Helvetica"
          webFont={{
            url: "https://fonts.googleapis.com/css2?family=Figtree:wght@400;600;700&display=swap",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Heading style={heading}>New Contact Form Submission</Heading>

          <Text style={timestamp}>Received: {formattedDate}</Text>

          <Hr style={hr} />

          {/* Contact Details */}
          <Section style={section}>
            <Heading as="h2" style={subheading}>
              Contact Information
            </Heading>

            <Text style={label}>Name:</Text>
            <Text style={value}>{fullName}</Text>

            <Text style={label}>Email:</Text>
            <Text style={value}>{email}</Text>

            <Text style={label}>Phone:</Text>
            <Text style={value}>{phone}</Text>
          </Section>

          <Hr style={hr} />

          {/* Message */}
          <Section style={section}>
            <Heading as="h2" style={subheading}>
              Message
            </Heading>

            <Text style={messageText}>{message}</Text>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Text style={footer}>
            This email was sent from the contact form on{" "}
            <a
              href="https://thereikigoddesshealing.com"
              style={footerLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              thereikigoddesshealing.com
            </a>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Styles using inline CSS (email-safe)
const main = {
  backgroundColor: "#FFFBF5", // Brand cream background
  fontFamily:
    'Figtree, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
  padding: "20px 0",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "32px",
  maxWidth: "600px",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
};

const heading = {
  fontFamily: "Figtree, sans-serif",
  fontSize: "32px",
  fontWeight: "700",
  color: "#0205B7", // Brand primary blue
  padding: "24px 24px 16px",
  textAlign: "center" as const,
  margin: "0",
  lineHeight: "1.2",
};

const subheading = {
  fontFamily: "Figtree, sans-serif",
  fontSize: "20px",
  fontWeight: "600",
  color: "#1C1B1B", // Brand dark text
  margin: "0 0 16px",
  lineHeight: "1.3",
};

const timestamp = {
  fontSize: "14px",
  color: "#5F5F5F", // Brand medium gray
  textAlign: "center" as const,
  margin: "0 0 24px",
  padding: "0 24px",
};

const section = {
  padding: "0 24px",
};

const label = {
  fontFamily: "Figtree, sans-serif",
  fontSize: "14px",
  fontWeight: "600",
  color: "#5F5F5F", // Brand medium gray
  margin: "16px 0 4px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
};

const value = {
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
  fontSize: "16px",
  color: "#1C1B1B", // Brand dark text
  margin: "0 0 12px",
  lineHeight: "1.5",
};

const messageText = {
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
  fontSize: "16px",
  color: "#1C1B1B", // Brand dark text
  lineHeight: "1.6",
  whiteSpace: "pre-wrap" as const,
  margin: "16px 0",
};

const hr = {
  borderColor: "#E6E6E6",
  margin: "20px 24px",
  borderWidth: "1px",
  borderStyle: "solid",
};

const footer = {
  fontSize: "12px",
  color: "#5F5F5F", // Brand medium gray
  textAlign: "center" as const,
  padding: "0 24px",
  margin: "16px 0 0",
  lineHeight: "1.5",
};

const footerLink = {
  color: "#0205B7", // Brand primary blue
  textDecoration: "none",
};

export default ContactEmailTemplate;
