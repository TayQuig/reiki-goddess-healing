import { test, expect } from "@playwright/test";

/**
 * E2E Tests for Contact Form Email Submission
 * Tests the complete user journey from form fill to email confirmation
 */

test.describe("Contact Form Email Submission", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to contact page before each test
    await page.goto("/contact");
  });

  test("Happy path: fill form → submit → confirmation", async ({ page }) => {
    // Mock successful API response
    await page.route("/api/contact", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          emailId: "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794",
          message: "Your message has been sent successfully",
        }),
      });
    });

    // Fill all form fields
    await page.fill('input[name="firstName"]', "Sarah");
    await page.fill('input[name="lastName"]', "Johnson");
    await page.fill('input[name="email"]', "sarah.johnson@example.com");
    await page.fill('input[name="phone"]', "(555) 123-4567");
    await page.fill(
      'textarea[name="message"]',
      "I am interested in booking a Reiki session."
    );
    await page.check('input[name="agreeToTerms"]');

    // Submit form
    await page.click('button[type="submit"]');

    // Verify success message displayed
    await expect(page.locator("text=Thank you for your message")).toBeVisible({
      timeout: 5000,
    });
    await expect(
      page.locator("text=we'll get back to you within 24-48 hours")
    ).toBeVisible();

    // Verify form cleared after submission
    await expect(page.locator('input[name="firstName"]')).toHaveValue("");
    await expect(page.locator('input[name="lastName"]')).toHaveValue("");
    await expect(page.locator('input[name="email"]')).toHaveValue("");
    await expect(page.locator('input[name="phone"]')).toHaveValue("");
    await expect(page.locator('textarea[name="message"]')).toHaveValue("");
  });

  test("Network error: show error and retry button", async ({ page }) => {
    // Mock network failure on first attempt
    let attemptCount = 0;
    await page.route("/api/contact", async (route) => {
      attemptCount++;
      if (attemptCount === 1) {
        // First attempt: network error
        await route.abort("failed");
      } else {
        // Second attempt: success
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            emailId: "test-id",
          }),
        });
      }
    });

    // Fill and submit form
    await page.fill('input[name="firstName"]', "John");
    await page.fill('input[name="email"]', "john@example.com");
    await page.fill('input[name="phone"]', "5551234567");
    await page.fill('textarea[name="message"]', "Test message");
    await page.check('input[name="agreeToTerms"]');
    await page.click('button[type="submit"]');

    // Verify error message displayed
    await expect(
      page.locator("text=There was an error sending your message")
    ).toBeVisible({ timeout: 5000 });

    // Form data should be retained
    await expect(page.locator('input[name="firstName"]')).toHaveValue("John");
    await expect(page.locator('input[name="email"]')).toHaveValue(
      "john@example.com"
    );

    // Retry submission
    await page.click('button[type="submit"]');

    // Verify success on retry
    await expect(page.locator("text=Thank you for your message")).toBeVisible({
      timeout: 5000,
    });
  });

  test("Server error: handle 500 gracefully", async ({ page }) => {
    // Mock server error
    await page.route("/api/contact", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({
          success: false,
          error: "Service error. Please try again later.",
        }),
      });
    });

    // Fill and submit form
    await page.fill('input[name="firstName"]', "Jane");
    await page.fill('input[name="email"]', "jane@example.com");
    await page.fill('input[name="phone"]', "5551234567");
    await page.fill('textarea[name="message"]', "Test message");
    await page.check('input[name="agreeToTerms"]');
    await page.click('button[type="submit"]');

    // Verify error message (user-friendly, no technical details)
    await expect(
      page.locator("text=There was an error sending your message")
    ).toBeVisible({ timeout: 5000 });

    // Verify no sensitive error details exposed
    const pageContent = await page.textContent("body");
    expect(pageContent).not.toContain("500");
    expect(pageContent).not.toContain("Internal Server Error");
    expect(pageContent).not.toContain("Service error"); // Technical message not shown to user
  });

  test("Rate limit: enforce 3 submissions per hour", async ({ page }) => {
    // Clear localStorage to start fresh
    await page.evaluate(() => localStorage.clear());

    // Mock successful responses for first 3 submissions
    await page.route("/api/contact", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          emailId: "test-id",
        }),
      });
    });

    const formData = {
      firstName: "Test",
      email: "test@example.com",
      phone: "5551234567",
      message: "Rate limit test message",
    };

    // Submit 3 times successfully
    for (let i = 0; i < 3; i++) {
      await page.fill('input[name="firstName"]', formData.firstName);
      await page.fill('input[name="email"]', formData.email);
      await page.fill('input[name="phone"]', formData.phone);
      await page.fill('textarea[name="message"]', formData.message);
      await page.check('input[name="agreeToTerms"]');
      await page.click('button[type="submit"]');

      // Wait for success message
      await expect(page.locator("text=Thank you for your message")).toBeVisible(
        { timeout: 5000 }
      );

      // Wait a bit between submissions
      await page.waitForTimeout(500);
    }

    // 4th attempt should be blocked by client-side rate limiting
    await page.fill('input[name="firstName"]', formData.firstName);
    await page.fill('input[name="email"]', formData.email);
    await page.fill('input[name="phone"]', formData.phone);
    await page.fill('textarea[name="message"]', formData.message);
    await page.check('input[name="agreeToTerms"]');

    // Submit button should be disabled
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeDisabled();

    // Rate limit message should be visible
    await expect(
      page.locator("text=You have reached the maximum number of submissions")
    ).toBeVisible();
  });

  test("Form validation: client-side security checks", async ({ page }) => {
    // Test SQL injection blocked
    await page.fill('input[name="firstName"]', "John");
    await page.fill('input[name="email"]', "john@example.com");
    await page.fill('input[name="phone"]', "5551234567");
    await page.fill(
      'textarea[name="message"]',
      "SELECT * FROM users; DROP TABLE users;--"
    );
    await page.check('input[name="agreeToTerms"]');
    await page.click('button[type="submit"]');

    // Verify validation error
    await expect(page.locator("#message-error")).toContainText(
      "potentially malicious content"
    );

    // Clear and test XSS blocked
    await page.fill('textarea[name="message"]', "");
    await page.fill(
      'textarea[name="message"]',
      '<script>alert("XSS")</script>'
    );
    await page.click('button[type="submit"]');

    await expect(page.locator("#message-error")).toContainText(
      "potentially malicious content"
    );

    // Clear and test email injection blocked
    await page.fill(
      'input[name="email"]',
      "test@example.com\nBCC:hacker@evil.com"
    );
    await page.click('button[type="submit"]');

    await expect(page.locator("#email-error")).toContainText(
      "contains invalid characters"
    );

    // Clear and test medical terms blocked
    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('textarea[name="message"]', "");
    await page.fill(
      'textarea[name="message"]',
      "I have a medical condition that needs treatment."
    );
    await page.click('button[type="submit"]');

    await expect(page.locator("#message-error")).toContainText(
      "Please contact us directly for health-related inquiries"
    );
  });

  test("Accessibility: keyboard navigation", async ({ page }) => {
    // Test tab navigation through form
    await page.keyboard.press("Tab"); // Focus first name
    await page.keyboard.type("John");

    await page.keyboard.press("Tab"); // Focus last name
    await page.keyboard.type("Doe");

    await page.keyboard.press("Tab"); // Focus email
    await page.keyboard.type("john@example.com");

    await page.keyboard.press("Tab"); // Focus phone
    await page.keyboard.type("5551234567");

    await page.keyboard.press("Tab"); // Focus message
    await page.keyboard.type("Test message via keyboard");

    await page.keyboard.press("Tab"); // Focus terms checkbox
    await page.keyboard.press("Space"); // Check the checkbox

    await page.keyboard.press("Tab"); // Focus submit button

    // Verify all fields filled
    await expect(page.locator('input[name="firstName"]')).toHaveValue("John");
    await expect(page.locator('input[name="email"]')).toHaveValue(
      "john@example.com"
    );
    await expect(page.locator('input[name="agreeToTerms"]')).toBeChecked();
  });

  test("Accessibility: screen reader labels", async ({ page }) => {
    // Verify all form fields have proper labels and ARIA attributes
    const firstNameInput = page.locator('input[name="firstName"]');
    await expect(firstNameInput).toHaveAttribute("aria-required", "true");
    await expect(page.locator('label[for="firstName"]')).toBeVisible();

    const emailInput = page.locator('input[name="email"]');
    await expect(emailInput).toHaveAttribute("aria-required", "true");
    await expect(page.locator('label[for="email"]')).toBeVisible();

    const messageTextarea = page.locator('textarea[name="message"]');
    await expect(messageTextarea).toHaveAttribute("aria-required", "true");
    await expect(page.locator('label[for="message"]')).toBeVisible();

    // Verify submit button has accessible text
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toHaveText(/Send Message/i);
  });

  test("Loading state: disabled during submission", async ({ page }) => {
    // Mock slow API response
    await page.route("/api/contact", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          emailId: "test-id",
        }),
      });
    });

    // Fill and submit form
    await page.fill('input[name="firstName"]', "John");
    await page.fill('input[name="email"]', "john@example.com");
    await page.fill('input[name="phone"]', "5551234567");
    await page.fill('textarea[name="message"]', "Test message");
    await page.check('input[name="agreeToTerms"]');

    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Verify button disabled during submission
    await expect(submitButton).toBeDisabled();

    // Verify loading text
    await expect(submitButton).toHaveText(/Sending/i);

    // Wait for completion
    await expect(page.locator("text=Thank you for your message")).toBeVisible({
      timeout: 5000,
    });

    // Button should be enabled again
    await expect(submitButton).not.toBeDisabled();
    await expect(submitButton).toHaveText(/Send Message/i);
  });
});
