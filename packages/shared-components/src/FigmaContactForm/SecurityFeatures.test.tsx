import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FigmaContactForm } from "./FigmaContactForm";
import {
  SecurityValidator,
  FormRateLimit,
  SecurityMonitor,
} from "@reiki-goddess/shared-utils";

// Mock the security utilities
vi.mock("@reiki-goddess/shared-utils", () => ({
  SecurityValidator: {
    validateEmail: vi.fn(),
    validatePhone: vi.fn(),
    validateContactFormField: vi.fn(),
    isHighRisk: vi.fn(),
  },
  FormRateLimit: vi.fn().mockImplementation(() => ({
    checkLimit: vi.fn(),
    record: vi.fn(),
  })),
  SecurityMonitor: vi.fn().mockImplementation(() => ({
    log: vi.fn(),
  })),
}));

describe("FigmaContactForm Security Features", () => {
  const mockSubmit = vi.fn();
  const user = userEvent.setup();
  let mockRateLimit: any;
  let mockMonitor: any;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    // Setup default mock behaviors
    mockRateLimit = {
      checkLimit: vi.fn(() => ({ allowed: true })),
      record: vi.fn(),
    };

    mockMonitor = {
      log: vi.fn(),
    };

    (FormRateLimit as any).mockImplementation(() => mockRateLimit);
    (SecurityMonitor as any).mockImplementation(() => mockMonitor);

    // Setup validation mocks
    (SecurityValidator.validateEmail as any).mockImplementation(
      (email: string) => ({
        isValid: email.includes("@"),
        sanitizedValue: email,
        risks: [],
      })
    );

    (SecurityValidator.validatePhone as any).mockImplementation(
      (phone: string) => ({
        isValid: phone.length >= 10,
        sanitizedValue: phone,
        risks: [],
      })
    );

    (SecurityValidator.validateContactFormField as any).mockImplementation(
      (field: string, value: string) => ({
        isValid: value.length > 0,
        sanitizedValue: value,
        risks: [],
      })
    );

    (SecurityValidator.isHighRisk as any).mockReturnValue(false);
  });

  describe("Rate Limiting", () => {
    it("should check rate limit before submission", async () => {
      render(<FigmaContactForm onSubmit={mockSubmit} />);

      // Fill form
      await user.type(screen.getByLabelText(/first name/i), "John");
      await user.type(screen.getByLabelText(/email/i), "john@example.com");
      await user.type(screen.getByLabelText(/phone number/i), "1234567890");
      await user.type(screen.getByLabelText(/message/i), "Test message");
      await user.click(screen.getByLabelText(/terms & conditions/i));

      // Submit
      await user.click(screen.getByRole("button", { name: /submit/i }));

      await waitFor(() => {
        expect(mockRateLimit.checkLimit).toHaveBeenCalled();
      });
    });

    it("should show error when rate limit exceeded", async () => {
      mockRateLimit.checkLimit.mockReturnValue({
        allowed: false,
        message: "Too many submissions. Please try again in 45 minutes.",
        timeUntilReset: 45,
      });

      render(<FigmaContactForm onSubmit={mockSubmit} />);

      // Fill and submit
      await user.type(screen.getByLabelText(/first name/i), "John");
      await user.type(screen.getByLabelText(/email/i), "john@example.com");
      await user.type(screen.getByLabelText(/phone number/i), "1234567890");
      await user.type(screen.getByLabelText(/message/i), "Test message");
      await user.click(screen.getByLabelText(/terms & conditions/i));
      await user.click(screen.getByRole("button", { name: /submit/i }));

      await waitFor(() => {
        expect(
          screen.getByText(
            "Too many submissions. Please try again in 45 minutes."
          )
        ).toBeInTheDocument();
        expect(mockSubmit).not.toHaveBeenCalled();
        expect(mockMonitor.log).toHaveBeenCalledWith("RATE_LIMIT_EXCEEDED", {
          remainingTime: 45,
        });
      });
    });

    it("should record submission when successful", async () => {
      render(<FigmaContactForm onSubmit={mockSubmit} />);

      // Fill and submit
      await user.type(screen.getByLabelText(/first name/i), "John");
      await user.type(screen.getByLabelText(/email/i), "john@example.com");
      await user.type(screen.getByLabelText(/phone number/i), "1234567890");
      await user.type(screen.getByLabelText(/message/i), "Test message");
      await user.click(screen.getByLabelText(/terms & conditions/i));
      await user.click(screen.getByRole("button", { name: /submit/i }));

      await waitFor(() => {
        expect(mockRateLimit.record).toHaveBeenCalled();
      });
    });
  });

  describe("Content Validation", () => {
    it("should block high-risk content", async () => {
      (SecurityValidator.isHighRisk as any).mockReturnValue(true);

      render(<FigmaContactForm onSubmit={mockSubmit} />);

      // Fill with high-risk content
      await user.type(screen.getByLabelText(/first name/i), "John");
      await user.type(screen.getByLabelText(/email/i), "john@example.com");
      await user.type(screen.getByLabelText(/phone number/i), "1234567890");
      await user.type(
        screen.getByLabelText(/message/i),
        "Some high risk content"
      );
      await user.click(screen.getByLabelText(/terms & conditions/i));
      await user.click(screen.getByRole("button", { name: /submit/i }));

      await waitFor(() => {
        expect(
          screen.getByText(
            /Your submission contains content that cannot be processed/i
          )
        ).toBeInTheDocument();
        expect(mockSubmit).not.toHaveBeenCalled();
        expect(mockMonitor.log).toHaveBeenCalledWith(
          "HIGH_RISK_SUBMISSION_BLOCKED",
          { fields: expect.any(Array) }
        );
      });
    });

    it("should sanitize data before submission", async () => {
      const sanitizedEmail = "sanitized@example.com";
      const sanitizedPhone = "1234567890";
      const sanitizedName = "SanitizedJohn";
      const sanitizedMessage = "Sanitized message";

      (SecurityValidator.validateEmail as any).mockReturnValue({
        isValid: true,
        sanitizedValue: sanitizedEmail,
        risks: [],
      });

      (SecurityValidator.validatePhone as any).mockReturnValue({
        isValid: true,
        sanitizedValue: sanitizedPhone,
        risks: [],
      });

      (SecurityValidator.validateContactFormField as any).mockImplementation(
        (field: string, _value: string) => ({
          isValid: true,
          sanitizedValue:
            field === "message" ? sanitizedMessage : sanitizedName,
          risks: [],
        })
      );

      render(<FigmaContactForm onSubmit={mockSubmit} />);

      // Fill and submit
      await user.type(screen.getByLabelText(/first name/i), "John<script>");
      await user.type(screen.getByLabelText(/email/i), "john@example.com");
      await user.type(screen.getByLabelText(/phone number/i), "1234567890");
      await user.type(
        screen.getByLabelText(/message/i),
        "Message with <script>"
      );
      await user.click(screen.getByLabelText(/terms & conditions/i));
      await user.click(screen.getByRole("button", { name: /submit/i }));

      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith({
          firstName: sanitizedName,
          lastName: sanitizedName,
          email: sanitizedEmail,
          phone: sanitizedPhone,
          message: sanitizedMessage,
          agreeToTerms: true,
        });
      });
    });
  });

  describe("Security Logging", () => {
    it("should log high-risk validation failures", async () => {
      (SecurityValidator.validateEmail as any).mockReturnValue({
        isValid: false,
        sanitizedValue: "",
        risks: [
          {
            level: "HIGH",
            type: "XSS_ATTEMPT",
            message: "Potential XSS detected",
          },
        ],
      });

      render(<FigmaContactForm onSubmit={mockSubmit} />);

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, "test@example<script>");
      await user.tab();

      await waitFor(() => {
        expect(mockMonitor.log).toHaveBeenCalledWith(
          "XSS_ATTEMPT",
          expect.objectContaining({
            field: "email",
            value: expect.any(String),
            message: "Potential XSS detected",
          })
        );
      });
    });

    it("should log successful submissions", async () => {
      mockSubmit.mockResolvedValueOnce(undefined);

      render(<FigmaContactForm onSubmit={mockSubmit} />);

      // Fill and submit
      await user.type(screen.getByLabelText(/first name/i), "John");
      await user.type(screen.getByLabelText(/email/i), "john@example.com");
      await user.type(screen.getByLabelText(/phone number/i), "1234567890");
      await user.type(screen.getByLabelText(/message/i), "Test message");
      await user.click(screen.getByLabelText(/terms & conditions/i));
      await user.click(screen.getByRole("button", { name: /submit/i }));

      await waitFor(() => {
        expect(mockMonitor.log).toHaveBeenCalledWith(
          "FORM_SUBMISSION_SUCCESS",
          expect.objectContaining({ timestamp: expect.any(String) }),
          "LOW"
        );
      });
    });

    it("should log submission errors", async () => {
      mockSubmit.mockRejectedValueOnce(new Error("Network error"));

      render(<FigmaContactForm onSubmit={mockSubmit} />);

      // Fill and submit
      await user.type(screen.getByLabelText(/first name/i), "John");
      await user.type(screen.getByLabelText(/email/i), "john@example.com");
      await user.type(screen.getByLabelText(/phone number/i), "1234567890");
      await user.type(screen.getByLabelText(/message/i), "Test message");
      await user.click(screen.getByLabelText(/terms & conditions/i));
      await user.click(screen.getByRole("button", { name: /submit/i }));

      await waitFor(() => {
        expect(mockMonitor.log).toHaveBeenCalledWith(
          "FORM_SUBMISSION_ERROR",
          expect.objectContaining({ error: "Network error" }),
          "MEDIUM"
        );
      });
    });
  });

  describe("Wellness-Specific Validation", () => {
    it("should reject medical terminology", async () => {
      (SecurityValidator.validateContactFormField as any).mockImplementation(
        (_field: string, value: string) => {
          if (
            value.toLowerCase().includes("cure") ||
            value.toLowerCase().includes("diagnosis")
          ) {
            return {
              isValid: false,
              sanitizedValue: value,
              risks: [
                {
                  level: "HIGH",
                  type: "MEDICAL_TERMS",
                  message: "Please avoid medical terminology",
                },
              ],
            };
          }
          return { isValid: true, sanitizedValue: value, risks: [] };
        }
      );

      render(<FigmaContactForm onSubmit={mockSubmit} />);

      const messageInput = screen.getByLabelText(/message/i);
      await user.type(messageInput, "Can you cure my illness?");
      await user.tab();

      await waitFor(() => {
        expect(
          screen.getByText("Please avoid medical terminology")
        ).toBeInTheDocument();
      });
    });
  });
});
