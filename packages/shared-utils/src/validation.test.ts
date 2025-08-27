import { describe, it, expect } from "vitest";
import {
  isValidEmail,
  isValidPhone,
  isValidUrl,
  validateRequired,
  validateMinLength,
  validateMaxLength,
} from "./validation";

describe("Validation utilities", () => {
  describe("isValidEmail", () => {
    it("validates correct email addresses", () => {
      expect(isValidEmail("test@example.com")).toBe(true);
      expect(isValidEmail("user.name@domain.co.uk")).toBe(true);
    });

    it("rejects invalid email addresses", () => {
      expect(isValidEmail("invalid-email")).toBe(false);
      expect(isValidEmail("@domain.com")).toBe(false);
      expect(isValidEmail("user@")).toBe(false);
    });
  });

  describe("isValidPhone", () => {
    it("validates phone numbers", () => {
      expect(isValidPhone("1234567890")).toBe(true);
      expect(isValidPhone("+1234567890")).toBe(true);
      expect(isValidPhone("123-456-7890")).toBe(true);
    });

    it("rejects invalid phone numbers", () => {
      expect(isValidPhone("abc")).toBe(false);
      expect(isValidPhone("")).toBe(false);
    });
  });

  describe("isValidUrl", () => {
    it("validates URLs", () => {
      expect(isValidUrl("https://example.com")).toBe(true);
      expect(isValidUrl("http://test.org")).toBe(true);
    });

    it("rejects invalid URLs", () => {
      expect(isValidUrl("not-a-url")).toBe(false);
      expect(isValidUrl("")).toBe(false);
    });
  });

  describe("validateRequired", () => {
    it("validates required fields", () => {
      expect(validateRequired("text")).toBe(true);
      expect(validateRequired("")).toBe(false);
      expect(validateRequired("   ")).toBe(false);
    });
  });

  describe("validateMinLength", () => {
    it("validates minimum length", () => {
      expect(validateMinLength("hello", 5)).toBe(true);
      expect(validateMinLength("hi", 5)).toBe(false);
    });
  });

  describe("validateMaxLength", () => {
    it("validates maximum length", () => {
      expect(validateMaxLength("hello", 10)).toBe(true);
      expect(validateMaxLength("very long text", 5)).toBe(false);
    });
  });
});
