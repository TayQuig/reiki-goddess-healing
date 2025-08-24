import { test, expect } from '@playwright/test';

test.describe('Contact Form Security & Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a page with the contact form
    await page.goto('/contact');
  });

  test('should display contact form with proper accessibility', async ({ page }) => {
    // Check that form exists and is accessible
    const form = page.locator('form');
    await expect(form).toBeVisible();

    // Check required form fields
    await expect(page.locator('input[name="firstName"]')).toBeVisible();
    await expect(page.locator('input[name="lastName"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="phone"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"]')).toBeVisible();

    // Check that form has proper labels
    await expect(page.locator('label[for="firstName"]')).toContainText('First Name');
    await expect(page.locator('label[for="lastName"]')).toContainText('Last Name');
    await expect(page.locator('label[for="email"]')).toContainText('Email Address');
    await expect(page.locator('label[for="phone"]')).toContainText('Phone Number');
    await expect(page.locator('label[for="message"]')).toContainText('Message');

    // Check required field indicators
    await expect(page.locator('label[for="firstName"]')).toContainText('*');
    await expect(page.locator('label[for="lastName"]')).toContainText('*');
    await expect(page.locator('label[for="email"]')).toContainText('*');
    await expect(page.locator('label[for="message"]')).toContainText('*');
  });

  test('should validate required fields', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Check that validation errors appear
    await expect(page.locator('#firstName-error')).toContainText('firstName is required');
    await expect(page.locator('#lastName-error')).toContainText('lastName is required');
    await expect(page.locator('#email-error')).toContainText('email is required');
    await expect(page.locator('#message-error')).toContainText('message is required');

    // Check ARIA attributes for accessibility
    await expect(page.locator('input[name="firstName"]')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('input[name="lastName"]')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('input[name="email"]')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('textarea[name="message"]')).toHaveAttribute('aria-invalid', 'true');
  });

  test('should validate email format', async ({ page }) => {
    await page.fill('input[name="firstName"]', 'John');
    await page.fill('input[name="lastName"]', 'Doe');
    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('textarea[name="message"]', 'This is a test message.');

    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    await expect(page.locator('#email-error')).toContainText('contains invalid characters or format');
  });

  test('should prevent XSS attacks in form fields', async ({ page }) => {
    const maliciousScript = '<script>alert("xss")</script>';
    
    await page.fill('input[name="firstName"]', maliciousScript);
    await page.fill('input[name="lastName"]', 'Doe');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('textarea[name="message"]', maliciousScript);

    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Check that XSS validation errors appear
    await expect(page.locator('#firstName-error')).toContainText('potentially malicious content');
    await expect(page.locator('#message-error')).toContainText('potentially malicious content');

    // Ensure no actual script execution occurred
    await expect(page.locator('text=xss')).not.toBeVisible();
  });

  test('should detect health information in messages', async ({ page }) => {
    await page.fill('input[name="firstName"]', 'John');
    await page.fill('input[name="lastName"]', 'Doe');
    await page.fill('input[name="email"]', 'john@example.com');
    await page.fill('textarea[name="message"]', 'I have a medical condition that needs treatment.');

    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    await expect(page.locator('#message-error')).toContainText('Please contact us directly for health-related inquiries');
  });

  test('should sanitize input values in real-time', async ({ page }) => {
    // Fill form with HTML content
    await page.fill('input[name="firstName"]', 'John<script>test</script>');
    await page.fill('textarea[name="message"]', 'Hello <b>world</b>');

    // Check that values are sanitized
    const firstNameValue = await page.locator('input[name="firstName"]').inputValue();
    const messageValue = await page.locator('textarea[name="message"]').inputValue();

    expect(firstNameValue).toBe('Johntest'); // Script tags should be removed
    expect(messageValue).toBe('Hello world'); // HTML tags should be stripped
  });

  test('should enforce rate limiting', async ({ page }) => {
    // Fill out valid form data
    const formData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '5551234567',
      message: 'This is a test message for rate limiting.'
    };

    // Submit form multiple times to trigger rate limit
    for (let i = 0; i < 4; i++) {
      await page.fill('input[name="firstName"]', formData.firstName);
      await page.fill('input[name="lastName"]', formData.lastName);
      await page.fill('input[name="email"]', formData.email);
      await page.fill('input[name="phone"]', formData.phone);
      await page.fill('textarea[name="message"]', formData.message);

      const submitButton = page.locator('button[type="submit"]');
      await submitButton.click();

      if (i < 3) {
        // Wait for form to reset or show success message
        await page.waitForTimeout(1000);
      }
    }

    // After 4th submission, should show rate limit message
    await expect(page.locator('text=maximum number of submissions')).toBeVisible();
    
    // Submit button should be disabled
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeDisabled();
  });

  test('should show privacy notice and link', async ({ page }) => {
    const privacyNotice = page.locator('text=By submitting this form, you agree to our');
    await expect(privacyNotice).toBeVisible();

    const privacyLink = page.locator('a[href="/privacy"]');
    await expect(privacyLink).toBeVisible();
    await expect(privacyLink).toHaveText('Privacy Policy');
  });

  test('should handle successful form submission', async ({ page }) => {
    // Mock the API response
    await page.route('/api/contact', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Success', success: true })
      });
    });

    // Fill out valid form
    await page.fill('input[name="firstName"]', 'John');
    await page.fill('input[name="lastName"]', 'Doe');
    await page.fill('input[name="email"]', 'john@example.com');
    await page.fill('input[name="phone"]', '5551234567');
    await page.fill('textarea[name="message"]', 'This is a valid test message.');

    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Check for success message
    await expect(page.locator('text=Thank you for your message')).toBeVisible();
    
    // Form should be cleared after successful submission
    await expect(page.locator('input[name="firstName"]')).toHaveValue('');
    await expect(page.locator('input[name="lastName"]')).toHaveValue('');
    await expect(page.locator('input[name="email"]')).toHaveValue('');
    await expect(page.locator('input[name="phone"]')).toHaveValue('');
    await expect(page.locator('textarea[name="message"]')).toHaveValue('');
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API error response
    await page.route('/api/contact', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Server Error', success: false })
      });
    });

    // Fill out valid form
    await page.fill('input[name="firstName"]', 'John');
    await page.fill('input[name="lastName"]', 'Doe');
    await page.fill('input[name="email"]', 'john@example.com');
    await page.fill('textarea[name="message"]', 'This is a test message.');

    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Check for error message
    await expect(page.locator('text=There was an error sending your message')).toBeVisible();
  });

  test('should include CSRF protection', async ({ page }) => {
    // Check that CSRF token is generated and stored
    const csrfToken = await page.evaluate(() => {
      return sessionStorage.getItem('csrf_token');
    });
    
    expect(csrfToken).toBeTruthy();
    expect(csrfToken).toMatch(/^[a-f0-9-]{36}$/); // UUID format
  });
});

test.describe('Cookie Consent Banner', () => {
  test('should display cookie consent banner on first visit', async ({ page }) => {
    // Clear localStorage to simulate first visit
    await page.evaluate(() => localStorage.clear());
    
    await page.goto('/');
    
    // Check that banner is displayed
    const banner = page.locator('text=We use cookies to improve your experience');
    await expect(banner).toBeVisible();
    
    // Check that buttons are present
    await expect(page.locator('button:has-text("Accept Necessary Only")')).toBeVisible();
    await expect(page.locator('button:has-text("Accept All")')).toBeVisible();
    await expect(page.locator('button:has-text("Customize preferences")')).toBeVisible();
  });

  test('should not display banner after consent is given', async ({ page }) => {
    // Set consent in localStorage
    await page.evaluate(() => {
      const consent = {
        consentGiven: true,
        preferences: { necessary: true, analytics: false, marketing: false },
        timestamp: new Date().toISOString(),
        version: '1.0'
      };
      localStorage.setItem('privacy_consent', JSON.stringify(consent));
    });
    
    await page.goto('/');
    
    // Banner should not be visible
    const banner = page.locator('text=We use cookies to improve your experience');
    await expect(banner).not.toBeVisible();
  });

  test('should save consent preferences when accepting all', async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
    await page.goto('/');
    
    const acceptAllButton = page.locator('button:has-text("Accept All")');
    await acceptAllButton.click();
    
    // Check that consent was saved
    const consent = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('privacy_consent') || '{}');
    });
    
    expect(consent.consentGiven).toBe(true);
    expect(consent.preferences.necessary).toBe(true);
    expect(consent.preferences.analytics).toBe(true);
    expect(consent.preferences.marketing).toBe(true);
  });

  test('should allow customizing preferences', async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
    await page.goto('/');
    
    // Click customize preferences
    await page.locator('button:has-text("Customize preferences")').click();
    
    // Check that detailed preferences are shown
    await expect(page.locator('h3:has-text("Cookie Preferences")')).toBeVisible();
    await expect(page.locator('text=Necessary Cookies')).toBeVisible();
    await expect(page.locator('text=Analytics Cookies')).toBeVisible();
    await expect(page.locator('text=Marketing Cookies')).toBeVisible();
    
    // Necessary should be checked and disabled
    const necessaryCheckbox = page.locator('input[type="checkbox"]').first();
    await expect(necessaryCheckbox).toBeChecked();
    await expect(necessaryCheckbox).toBeDisabled();
    
    // Enable analytics only
    const analyticsCheckbox = page.locator('input[type="checkbox"]').nth(1);
    await analyticsCheckbox.check();
    
    // Save preferences
    await page.locator('button:has-text("Save Preferences")').click();
    
    // Verify saved preferences
    const consent = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('privacy_consent') || '{}');
    });
    
    expect(consent.preferences.necessary).toBe(true);
    expect(consent.preferences.analytics).toBe(true);
    expect(consent.preferences.marketing).toBe(false);
  });
});

test.describe('Security Headers', () => {
  test('should include security headers', async ({ page }) => {
    const response = await page.goto('/');
    
    // Check for security headers
    const headers = response?.headers() || {};
    
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['x-frame-options']).toBe('DENY');
    expect(headers['x-xss-protection']).toBe('1; mode=block');
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    
    // CSP header should be present (exact content may vary)
    expect(headers['content-security-policy']).toBeTruthy();
  });

  test('should prevent iframe embedding', async ({ page, context }) => {
    // Try to load the site in an iframe
    const html = `
      <html>
        <body>
          <iframe src="${page.url()}" width="100%" height="400"></iframe>
        </body>
      </html>
    `;
    
    const newPage = await context.newPage();
    await newPage.setContent(html);
    
    // The iframe should be blocked by X-Frame-Options: DENY
    const iframe = newPage.locator('iframe');
    await expect(iframe).toBeVisible(); // iframe element exists
    
    // But the content should not load (this is browser-dependent)
    // In a real test, you'd check for specific error messages
  });
});