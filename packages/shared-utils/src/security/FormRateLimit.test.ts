import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { FormRateLimit } from "./FormRateLimit";

describe("FormRateLimit", () => {
  // Mock localStorage
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    };
  })();

  beforeEach(() => {
    // Clear localStorage before each test
    localStorageMock.clear();
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
      writable: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("checkLimit", () => {
    it("should allow submissions when under limit", () => {
      const rateLimit = new FormRateLimit({ maxSubmissions: 3 });
      const result = rateLimit.checkLimit();

      expect(result.allowed).toBe(true);
      expect(result.remainingSubmissions).toBe(3);
    });

    it("should track submissions correctly", () => {
      const rateLimit = new FormRateLimit({ maxSubmissions: 3 });

      // First submission
      rateLimit.record();
      let result = rateLimit.checkLimit();
      expect(result.allowed).toBe(true);
      expect(result.remainingSubmissions).toBe(2);

      // Second submission
      rateLimit.record();
      result = rateLimit.checkLimit();
      expect(result.allowed).toBe(true);
      expect(result.remainingSubmissions).toBe(1);

      // Third submission
      rateLimit.record();
      result = rateLimit.checkLimit();
      expect(result.allowed).toBe(false);
      expect(result.remainingSubmissions).toBe(0);
    });

    it("should block when limit is reached", () => {
      const rateLimit = new FormRateLimit({ maxSubmissions: 2 });

      // Record two submissions
      rateLimit.record();
      rateLimit.record();

      const result = rateLimit.checkLimit();
      expect(result.allowed).toBe(false);
      expect(result.timeUntilReset).toBeGreaterThan(0);
      expect(result.message).toContain("reached the submission limit");
    });

    it("should clean old submissions", () => {
      const rateLimit = new FormRateLimit({
        maxSubmissions: 2,
        timeWindowMs: 100, // 100ms window for testing
      });

      // Record a submission
      rateLimit.record();

      // Wait for window to expire
      const now = Date.now();
      vi.spyOn(Date, "now").mockReturnValue(now + 200);

      // Check should show submissions allowed again
      const result = rateLimit.checkLimit();
      expect(result.allowed).toBe(true);
      expect(result.remainingSubmissions).toBe(2);
    });

    it("should provide appropriate messages", () => {
      const rateLimit = new FormRateLimit({ maxSubmissions: 3 });

      // Check initial message
      let result = rateLimit.checkLimit();
      expect(result.message).toBe(
        "You have 3 submissions remaining this hour."
      );

      // After one submission
      rateLimit.record();
      result = rateLimit.checkLimit();
      expect(result.message).toBe(
        "You have 2 submissions remaining this hour."
      );

      // One submission left
      rateLimit.record();
      result = rateLimit.checkLimit();
      expect(result.message).toBe("You have 1 submission remaining this hour.");
    });
  });

  describe("static methods", () => {
    it("should work with static canSubmit method", () => {
      const result = FormRateLimit.canSubmit();
      expect(result.allowed).toBe(true);
      expect(result.remainingSubmissions).toBe(3); // default
    });

    it("should work with static recordSubmission method", () => {
      FormRateLimit.recordSubmission();
      const result = FormRateLimit.canSubmit();
      expect(result.remainingSubmissions).toBe(2);
    });
  });

  describe("reset", () => {
    it("should clear all submission history", () => {
      const rateLimit = new FormRateLimit();

      // Record some submissions
      rateLimit.record();
      rateLimit.record();

      // Reset
      rateLimit.reset();

      // Check that limit is back to max
      const result = rateLimit.checkLimit();
      expect(result.allowed).toBe(true);
      expect(result.remainingSubmissions).toBe(3);
    });
  });

  describe("getStatus", () => {
    it("should provide current status information", () => {
      const rateLimit = new FormRateLimit({
        maxSubmissions: 5,
        timeWindowMs: 3600000, // 1 hour
      });

      // Record a submission
      rateLimit.record();

      const status = rateLimit.getStatus();
      expect(status.submissions).toBe(1);
      expect(status.maxSubmissions).toBe(5);
      expect(status.timeWindow).toBe("60 minutes");
      expect(status.nextReset).toBeDefined();
    });
  });

  describe("error handling", () => {
    it("should handle localStorage errors gracefully", () => {
      const rateLimit = new FormRateLimit();

      // Mock localStorage to throw error
      vi.spyOn(localStorage, "getItem").mockImplementation(() => {
        throw new Error("Storage error");
      });

      // Should still work despite error
      const result = rateLimit.checkLimit();
      expect(result.allowed).toBe(true);

      // Restore the mock
      vi.restoreAllMocks();
    });

    it("should handle corrupted data gracefully", () => {
      // Clear any previous mocks
      vi.clearAllMocks();

      // Store invalid JSON
      localStorage.setItem("form_submissions", "invalid json");

      const rateLimit = new FormRateLimit();
      const result = rateLimit.checkLimit();

      // Should treat as empty and allow
      expect(result.allowed).toBe(true);
      expect(result.remainingSubmissions).toBe(3);
    });
  });

  describe("custom configuration", () => {
    beforeEach(() => {
      // Ensure mocks are cleared and localStorage is working
      vi.restoreAllMocks();
      localStorageMock.clear();
    });

    it("should respect custom storage key", () => {
      // Clear any previous mocks
      vi.clearAllMocks();

      const rateLimit1 = new FormRateLimit({ storageKey: "form1" });
      const rateLimit2 = new FormRateLimit({ storageKey: "form2" });

      // Record on first form
      rateLimit1.record();
      rateLimit1.record();

      // Second form should still have full limit
      const result = rateLimit2.checkLimit();
      expect(result.remainingSubmissions).toBe(3);
    });

    it("should respect custom max submissions", () => {
      const rateLimit = new FormRateLimit({ maxSubmissions: 5 });
      const result = rateLimit.checkLimit();
      expect(result.remainingSubmissions).toBe(5);
    });

    it("should respect custom time window", () => {
      const rateLimit = new FormRateLimit({
        timeWindowMs: 1000, // 1 second
        maxSubmissions: 1,
      });

      // Check initial state
      let result = rateLimit.checkLimit();
      expect(result.allowed).toBe(true);
      expect(result.remainingSubmissions).toBe(1);

      // Record a submission
      rateLimit.record();

      // Should be blocked after recording
      result = rateLimit.checkLimit();
      expect(result.allowed).toBe(false);

      // Wait for window to expire
      const now = Date.now();
      vi.spyOn(Date, "now").mockReturnValue(now + 1100);

      // Should be allowed again
      result = rateLimit.checkLimit();
      expect(result.allowed).toBe(true);
    });
  });
});
