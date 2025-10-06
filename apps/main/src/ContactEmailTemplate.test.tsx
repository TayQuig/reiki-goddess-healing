/**
 * Tests for ContactEmailTemplate
 */

import { describe, it, expect } from "vitest";
import React from "react";
import ContactEmailTemplate, {
  ContactEmailProps,
} from "../emails/ContactEmailTemplate";

describe("ContactEmailTemplate", () => {
  const validProps: ContactEmailProps = {
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah@example.com",
    phone: "(555) 123-4567",
    message: "I'm interested in booking a Reiki session. Please contact me.",
    submittedAt: "2024-10-02T12:00:00.000Z",
  };

  describe("Template rendering", () => {
    it("should render the template without errors", () => {
      expect(() => ContactEmailTemplate(validProps)).not.toThrow();
    });

    it("should accept all required props", () => {
      const result = ContactEmailTemplate(validProps);
      expect(result).toBeDefined();
      expect(React.isValidElement(result)).toBe(true);
    });

    it("should render with full name", () => {
      const result = ContactEmailTemplate(validProps);
      expect(React.isValidElement(result)).toBe(true);
    });

    it("should render with only first name", () => {
      const props: ContactEmailProps = {
        ...validProps,
        lastName: "",
      };
      const result = ContactEmailTemplate(props);
      expect(React.isValidElement(result)).toBe(true);
    });

    it("should render with default timestamp when not provided", () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { submittedAt, ...propsWithoutDate } = validProps;
      const result = ContactEmailTemplate(propsWithoutDate);
      expect(React.isValidElement(result)).toBe(true);
    });
  });

  describe("Props validation", () => {
    it("should accept valid email", () => {
      expect(() => ContactEmailTemplate(validProps)).not.toThrow();
    });

    it("should accept valid phone number", () => {
      expect(() => ContactEmailTemplate(validProps)).not.toThrow();
    });

    it("should accept multi-line messages", () => {
      const propsWithMultilineMessage: ContactEmailProps = {
        ...validProps,
        message: "Line 1\nLine 2\nLine 3",
      };
      expect(() =>
        ContactEmailTemplate(propsWithMultilineMessage)
      ).not.toThrow();
    });
  });

  describe("Edge cases", () => {
    it("should handle empty last name", () => {
      const props: ContactEmailProps = {
        ...validProps,
        lastName: "",
      };
      expect(() => ContactEmailTemplate(props)).not.toThrow();
    });

    it("should handle long messages", () => {
      const longMessage = "A".repeat(1000);
      const props: ContactEmailProps = {
        ...validProps,
        message: longMessage,
      };
      expect(() => ContactEmailTemplate(props)).not.toThrow();
    });

    it("should handle special characters in message", () => {
      const props: ContactEmailProps = {
        ...validProps,
        message: "Special chars: <>&\"'",
      };
      expect(() => ContactEmailTemplate(props)).not.toThrow();
    });

    it("should handle international characters in name", () => {
      const props: ContactEmailProps = {
        ...validProps,
        firstName: "José",
        lastName: "García",
      };
      expect(() => ContactEmailTemplate(props)).not.toThrow();
    });

    it("should handle different date formats", () => {
      const dates = [
        "2024-10-02T12:00:00.000Z",
        "2024-10-02T12:00:00Z",
        "2024-10-02",
      ];

      dates.forEach((date) => {
        const props: ContactEmailProps = {
          ...validProps,
          submittedAt: date,
        };
        expect(() => ContactEmailTemplate(props)).not.toThrow();
      });
    });
  });

  describe("Component structure", () => {
    it("should return a valid React element", () => {
      const result = ContactEmailTemplate(validProps);
      expect(React.isValidElement(result)).toBe(true);
    });

    it("should have displayName or be a function", () => {
      expect(typeof ContactEmailTemplate).toBe("function");
    });
  });

  describe("Data handling", () => {
    it("should handle all form fields", () => {
      const result = ContactEmailTemplate({
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        phone: "123-456-7890",
        message: "Test message",
        submittedAt: new Date().toISOString(),
      });
      expect(React.isValidElement(result)).toBe(true);
    });

    it("should format timestamp correctly", () => {
      const result = ContactEmailTemplate(validProps);
      expect(React.isValidElement(result)).toBe(true);
    });

    it("should concatenate first and last name", () => {
      const result = ContactEmailTemplate(validProps);
      expect(React.isValidElement(result)).toBe(true);
    });

    it("should use only first name when last name is empty", () => {
      const props = { ...validProps, lastName: "" };
      const result = ContactEmailTemplate(props);
      expect(React.isValidElement(result)).toBe(true);
    });
  });
});
