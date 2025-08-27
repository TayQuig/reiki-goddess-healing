import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Accessibility Tests", () => {
  const pages = ["/", "/about", "/contact"];

  pages.forEach((pagePath) => {
    test(`should not have accessibility violations on ${pagePath}`, async ({
      page,
    }) => {
      await page.goto(pagePath);

      // Wait for page to fully load
      await page.waitForLoadState("networkidle");

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test("should have proper heading hierarchy", async ({ page }) => {
    await page.goto("/");

    // Check that there's exactly one h1
    const h1Elements = await page.locator("h1").count();
    expect(h1Elements).toBe(1);

    // Check that headings are in proper order (no skipping levels)
    const headings = await page.locator("h1, h2, h3, h4, h5, h6").all();
    const headingLevels = await Promise.all(
      headings.map(async (heading) => {
        const tagName = await heading.evaluate((el) =>
          el.tagName.toLowerCase()
        );
        return parseInt(tagName.charAt(1));
      })
    );

    // Verify no level is skipped (e.g., h1 -> h3 without h2)
    for (let i = 1; i < headingLevels.length; i++) {
      const currentLevel = headingLevels[i];
      const previousLevel = headingLevels[i - 1];
      const levelDifference = currentLevel - previousLevel;

      // Allow same level, one level deeper, or any level shallower
      expect(levelDifference).toBeLessThanOrEqual(1);
    }
  });

  test("should have proper alt text for images", async ({ page }) => {
    await page.goto("/");

    const images = await page.locator("img").all();

    for (const img of images) {
      const alt = await img.getAttribute("alt");
      const role = await img.getAttribute("role");

      // Images should have alt text or be marked as decorative
      expect(alt !== null || role === "presentation").toBeTruthy();

      // If alt text exists, it shouldn't be empty (unless decorative)
      if (alt !== null && role !== "presentation") {
        expect(alt.trim().length).toBeGreaterThan(0);
      }
    }
  });

  test("should have proper form labels and ARIA attributes", async ({
    page,
  }) => {
    await page.goto("/contact");

    const formInputs = await page.locator("input, textarea, select").all();

    for (const input of formInputs) {
      const id = await input.getAttribute("id");
      const ariaLabel = await input.getAttribute("aria-label");
      const ariaLabelledby = await input.getAttribute("aria-labelledby");

      if (id) {
        // Check if there's a corresponding label
        const label = page.locator(`label[for="${id}"]`);
        const labelExists = (await label.count()) > 0;

        // Input should have either a label, aria-label, or aria-labelledby
        expect(labelExists || ariaLabel || ariaLabelledby).toBeTruthy();
      }
    }
  });

  test("should have proper focus indicators", async ({ page }) => {
    await page.goto("/contact");

    // Tab through focusable elements
    const focusableElements = await page
      .locator('button, input, textarea, a, [tabindex]:not([tabindex="-1"])')
      .all();

    for (const element of focusableElements) {
      await element.focus();

      // Check that focused element has visible focus indicator
      const computedStyle = await element.evaluate((el) => {
        const style = window.getComputedStyle(el, ":focus");
        return {
          outline: style.outline,
          outlineWidth: style.outlineWidth,
          boxShadow: style.boxShadow,
          borderColor: style.borderColor,
        };
      });

      // Should have some form of focus indicator (outline, box-shadow, or border change)
      const hasFocusIndicator =
        computedStyle.outline !== "none" ||
        computedStyle.outlineWidth !== "0px" ||
        computedStyle.boxShadow !== "none" ||
        computedStyle.borderColor !== "initial";

      expect(hasFocusIndicator).toBeTruthy();
    }
  });

  test("should have proper color contrast", async ({ page }) => {
    await page.goto("/");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2aa"])
      .include("*")
      .analyze();

    // Check specifically for color contrast violations
    const colorContrastViolations = accessibilityScanResults.violations.filter(
      (violation) => violation.id === "color-contrast"
    );

    expect(colorContrastViolations).toEqual([]);
  });

  test("should be keyboard navigable", async ({ page }) => {
    await page.goto("/");

    // Start from the top of the page
    await page.keyboard.press("Home");

    let previousElement = null;
    const maxTabs = 20; // Prevent infinite loops

    for (let i = 0; i < maxTabs; i++) {
      await page.keyboard.press("Tab");

      const currentElement = await page.evaluate(() =>
        document.activeElement?.tagName?.toLowerCase()
      );

      // Should be able to focus on interactive elements
      if (currentElement) {
        const interactiveElements = [
          "button",
          "input",
          "textarea",
          "select",
          "a",
        ];
        const isInteractive =
          interactiveElements.includes(currentElement) ||
          (await page.evaluate(() =>
            document.activeElement?.hasAttribute("tabindex")
          ));

        expect(isInteractive).toBeTruthy();
      }

      // Check if we've completed a full cycle
      if (currentElement === previousElement && i > 5) {
        break;
      }

      previousElement = currentElement;
    }
  });

  test("should have proper ARIA landmarks", async ({ page }) => {
    await page.goto("/");

    // Check for main landmark
    const mainLandmark = await page.locator('main, [role="main"]').count();
    expect(mainLandmark).toBeGreaterThanOrEqual(1);

    // Check for navigation landmark
    const navLandmark = await page.locator('nav, [role="navigation"]').count();
    expect(navLandmark).toBeGreaterThanOrEqual(1);

    // Check for contentinfo (footer) landmark if page has footer
    const footer = await page.locator('footer, [role="contentinfo"]').count();
    if (footer > 0) {
      expect(footer).toBeGreaterThanOrEqual(1);
    }
  });

  test("should have proper button and link text", async ({ page }) => {
    await page.goto("/");

    // Check buttons have descriptive text
    const buttons = await page.locator("button").all();
    for (const button of buttons) {
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute("aria-label");
      const title = await button.getAttribute("title");

      // Button should have text content, aria-label, or title
      const hasDescription =
        (text && text.trim().length > 0) || ariaLabel || title;
      expect(hasDescription).toBeTruthy();

      // Avoid generic text like "click here"
      if (text) {
        const genericTerms = [
          "click here",
          "here",
          "read more",
          "more",
          "link",
        ];
        const isGeneric = genericTerms.some(
          (term) => text.toLowerCase().trim() === term
        );
        expect(isGeneric).toBeFalsy();
      }
    }

    // Check links have descriptive text
    const links = await page.locator("a").all();
    for (const link of links) {
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute("aria-label");
      const title = await link.getAttribute("title");

      // Link should have text content, aria-label, or title
      const hasDescription =
        (text && text.trim().length > 0) || ariaLabel || title;
      expect(hasDescription).toBeTruthy();
    }
  });

  test("should handle reduced motion preferences", async ({ page }) => {
    // Set prefers-reduced-motion
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    // Check that animations respect reduced motion preference
    const animatedElements = await page
      .locator('[class*="animate"], [class*="transition"]')
      .all();

    for (const element of animatedElements) {
      const computedStyle = await element.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return {
          animationDuration: style.animationDuration,
          transitionDuration: style.transitionDuration,
        };
      });

      // Animations should be disabled or very short when reduced motion is preferred
      if (computedStyle.animationDuration !== "none") {
        expect(parseFloat(computedStyle.animationDuration)).toBeLessThanOrEqual(
          0.1
        );
      }
      if (computedStyle.transitionDuration !== "none") {
        expect(
          parseFloat(computedStyle.transitionDuration)
        ).toBeLessThanOrEqual(0.1);
      }
    }
  });

  test("should have proper error message associations", async ({ page }) => {
    await page.goto("/contact");

    // Submit form to trigger validation errors
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Check that error messages are properly associated
    const errorMessages = await page.locator('[id$="-error"]').all();

    for (const errorMessage of errorMessages) {
      const errorId = await errorMessage.getAttribute("id");
      const fieldId = errorId?.replace("-error", "");

      if (fieldId) {
        const associatedField = page.locator(`#${fieldId}`);
        const ariaDescribedby =
          await associatedField.getAttribute("aria-describedby");

        // Field should reference the error message via aria-describedby
        expect(ariaDescribedby).toContain(errorId);

        // Error message should have role="alert" or be in a container with role="alert"
        const role = await errorMessage.getAttribute("role");
        expect(role).toBe("alert");
      }
    }
  });
});
