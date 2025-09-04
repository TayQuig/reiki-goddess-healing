import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { SecureContactForm } from "./SecureContactForm";
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
  FormRateLimit: vi.fn(),
  SecurityMonitor: vi.fn(),
}));

describe("SecureContactForm", () => {
  const mockOnSubmit = vi.fn();
  const mockCheckLimit = vi.fn();
  const mockRecord = vi.fn();
  const mockLog = vi.fn();

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Setup FormRateLimit mock
    (FormRateLimit as any).mockImplementation(() => ({
      checkLimit: mockCheckLimit,
      record: mockRecord,
    }));

    // Setup SecurityMonitor mock
    (SecurityMonitor as any).mockImplementation(() => ({
      log: mockLog,
    }));

    // Setup default validation responses
    (SecurityValidator.validateEmail as any).mockReturnValue({
      isValid: true,
      risks: [],
      sanitizedValue: "test@example.com",
      riskLevel: "NONE",
    });

    (SecurityValidator.validatePhone as any).mockReturnValue({
      isValid: true,
      risks: [],
      sanitizedValue: "1234567890",
      riskLevel: "NONE",
    });

    (SecurityValidator.validateContactFormField as any).mockReturnValue({
      isValid: true,
      risks: [],
      sanitizedValue: "sanitized value",
      riskLevel: "NONE",
    });

    (SecurityValidator.isHighRisk as any).mockReturnValue(false);

    // Default rate limit allows submission
    mockCheckLimit.mockReturnValue({
      allowed: true,
      remainingSubmissions: 2,
      message: "You have 2 submissions remaining this hour.",
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Rendering", () => {
    it("should render all form fields by default", () => {
      render(<SecureContactForm onSubmit={mockOnSubmit} />);

      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /send message/i })
      ).toBeInTheDocument();
    });

    it("should hide phone field when showPhoneField is false", () => {
      render(
        <SecureContactForm onSubmit={mockOnSubmit} showPhoneField={false} />
      );

      expect(screen.queryByLabelText(/phone/i)).not.toBeInTheDocument();
    });

    it("should show required indicator for phone when requirePhone is true", () => {
      render(<SecureContactForm onSubmit={mockOnSubmit} requirePhone={true} />);

      const phoneLabel = screen.getByText(/phone/i);
      const requiredIndicator = phoneLabel.querySelector(".text-red-500");
      expect(requiredIndicator).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      const { container } = render(
        <SecureContactForm onSubmit={mockOnSubmit} className="custom-class" />
      );

      expect(
        container.querySelector(".secure-contact-form.custom-class")
      ).toBeInTheDocument();
    });

    it("should display character count for message field", () => {
      render(<SecureContactForm onSubmit={mockOnSubmit} />);

      expect(
        screen.getByText(/1000 characters remaining/i)
      ).toBeInTheDocument();
    });
  });

  describe("Field Validation", () => {
    it("should validate name field on blur", async () => {
      (SecurityValidator.validateContactFormField as any).mockReturnValueOnce({
        isValid: false,
        risks: [
          {
            level: "HIGH",
            type: "EMPTY_FIELD",
            message: "This field is required",
          },
        ],
        sanitizedValue: "",
        riskLevel: "HIGH",
      });

      render(<SecureContactForm onSubmit={mockOnSubmit} />);

      const nameInput = screen.getByLabelText(/name/i);
      fireEvent.blur(nameInput);

      await waitFor(() => {
        expect(screen.getByText("This field is required")).toBeInTheDocument();
      });
    });

    it("should validate email field with email-specific validation", async () => {
      (SecurityValidator.validateEmail as any).mockReturnValueOnce({
        isValid: false,
        risks: [
          {
            level: "HIGH",
            type: "INVALID_EMAIL",
            message: "Please enter a valid email address.",
          },
        ],
        sanitizedValue: "",
        riskLevel: "HIGH",
      });

      render(<SecureContactForm onSubmit={mockOnSubmit} />);

      const emailInput = screen.getByLabelText(/email/i);
      await userEvent.type(emailInput, "invalid-email");
      fireEvent.blur(emailInput);

      await waitFor(() => {
        expect(
          screen.getByText("Please enter a valid email address.")
        ).toBeInTheDocument();
      });
    });

    it("should validate phone field when required", async () => {
      (SecurityValidator.validatePhone as any).mockReturnValueOnce({
        isValid: false,
        risks: [
          {
            level: "MEDIUM",
            type: "INVALID_PHONE_LENGTH",
            message: "Please enter a valid phone number.",
          },
        ],
        sanitizedValue: "",
        riskLevel: "MEDIUM",
      });

      render(<SecureContactForm onSubmit={mockOnSubmit} requirePhone={true} />);

      const phoneInput = screen.getByLabelText(/phone/i);
      await userEvent.type(phoneInput, "123");
      fireEvent.blur(phoneInput);

      await waitFor(() => {
        expect(
          screen.getByText("Please enter a valid phone number.")
        ).toBeInTheDocument();
      });
    });

    it("should not validate empty phone field when not required", async () => {
      render(
        <SecureContactForm onSubmit={mockOnSubmit} requirePhone={false} />
      );

      const phoneInput = screen.getByLabelText(/phone/i);
      fireEvent.blur(phoneInput);

      await waitFor(() => {
        expect(
          screen.queryByText("Please enter a valid phone number.")
        ).not.toBeInTheDocument();
      });
    });

    it("should validate message field for security risks", async () => {
      (SecurityValidator.validateContactFormField as any).mockReturnValueOnce({
        isValid: false,
        risks: [
          {
            level: "HIGH",
            type: "SQL_INJECTION",
            message: "Invalid characters detected.",
          },
        ],
        sanitizedValue: "",
        riskLevel: "HIGH",
      });

      render(<SecureContactForm onSubmit={mockOnSubmit} />);

      const messageInput = screen.getByLabelText(/message/i);
      await userEvent.type(messageInput, "DROP TABLE users;");
      fireEvent.blur(messageInput);

      await waitFor(() => {
        expect(
          screen.getByText("Invalid characters detected.")
        ).toBeInTheDocument();
      });
    });

    it("should log security incidents for high-risk content", async () => {
      (SecurityValidator.validateContactFormField as any).mockReturnValueOnce({
        isValid: false,
        risks: [
          {
            level: "HIGH",
            type: "XSS_ATTEMPT",
            message: "Invalid formatting detected.",
          },
        ],
        sanitizedValue: "",
        riskLevel: "HIGH",
      });

      render(<SecureContactForm onSubmit={mockOnSubmit} />);

      const messageInput = screen.getByLabelText(/message/i);
      await userEvent.type(messageInput, '<script>alert("xss")</script>');
      fireEvent.blur(messageInput);

      await waitFor(() => {
        expect(mockLog).toHaveBeenCalledWith(
          "XSS_ATTEMPT",
          expect.objectContaining({
            field: "message",
            value: expect.stringContaining("..."),
            message: "Invalid formatting detected.",
          })
        );
      });
    });
  });

  describe("Character Count", () => {
    it("should update character count as user types", async () => {
      render(<SecureContactForm onSubmit={mockOnSubmit} />);

      const messageInput = screen.getByLabelText(/message/i);
      await userEvent.type(messageInput, "Hello world");

      expect(screen.getByText(/989 characters remaining/i)).toBeInTheDocument();
    });
  });

  describe("Rate Limiting", () => {
    it("should check rate limit before submission", async () => {
      render(<SecureContactForm onSubmit={mockOnSubmit} />);

      // Fill form with valid data
      await userEvent.type(screen.getByLabelText(/name/i), "Test User");
      await userEvent.type(screen.getByLabelText(/email/i), "test@example.com");
      await userEvent.type(screen.getByLabelText(/message/i), "Test message");

      // Submit form
      await userEvent.click(
        screen.getByRole("button", { name: /send message/i })
      );

      await waitFor(() => {
        expect(mockCheckLimit).toHaveBeenCalled();
      });
    });

    it("should block submission when rate limit exceeded", async () => {
      mockCheckLimit.mockReturnValueOnce({
        allowed: false,
        timeUntilReset: 45,
        remainingSubmissions: 0,
        message:
          "You've reached the submission limit. Please try again in 45 minutes.",
      });

      render(<SecureContactForm onSubmit={mockOnSubmit} />);

      // Fill form
      await userEvent.type(screen.getByLabelText(/name/i), "Test User");
      await userEvent.type(screen.getByLabelText(/email/i), "test@example.com");
      await userEvent.type(screen.getByLabelText(/message/i), "Test message");

      // Submit form
      await userEvent.click(
        screen.getByRole("button", { name: /send message/i })
      );

      await waitFor(() => {
        expect(
          screen.getByText(/You've reached the submission limit/i)
        ).toBeInTheDocument();
        expect(mockOnSubmit).not.toHaveBeenCalled();
        expect(mockLog).toHaveBeenCalledWith(
          "RATE_LIMIT_EXCEEDED",
          expect.objectContaining({
            remainingTime: 45,
          })
        );
      });
    });

    it("should record submission after successful submit", async () => {
      mockOnSubmit.mockResolvedValueOnce(undefined);

      render(<SecureContactForm onSubmit={mockOnSubmit} />);

      // Fill form
      await userEvent.type(screen.getByLabelText(/name/i), "Test User");
      await userEvent.type(screen.getByLabelText(/email/i), "test@example.com");
      await userEvent.type(screen.getByLabelText(/message/i), "Test message");

      // Submit form
      await userEvent.click(
        screen.getByRole("button", { name: /send message/i })
      );

      await waitFor(() => {
        expect(mockRecord).toHaveBeenCalled();
      });
    });
  });

  describe("High-Risk Content Detection", () => {
    it("should block submission with high-risk content", async () => {
      (SecurityValidator.isHighRisk as any).mockReturnValueOnce(true);

      render(<SecureContactForm onSubmit={mockOnSubmit} />);

      // Fill form
      await userEvent.type(screen.getByLabelText(/name/i), "Test User");
      await userEvent.type(screen.getByLabelText(/email/i), "test@example.com");
      await userEvent.type(screen.getByLabelText(/message/i), "Test message");

      // Submit form
      await userEvent.click(
        screen.getByRole("button", { name: /send message/i })
      );

      await waitFor(() => {
        expect(
          screen.getByText(
            /Your submission contains content that cannot be processed/i
          )
        ).toBeInTheDocument();
        expect(mockOnSubmit).not.toHaveBeenCalled();
        expect(mockLog).toHaveBeenCalledWith(
          "HIGH_RISK_SUBMISSION_BLOCKED",
          expect.objectContaining({
            fields: ["name", "email", "phone", "message"],
          })
        );
      });
    });
  });

  describe("Form Submission", () => {
    it("should submit form with sanitized data", async () => {
      mockOnSubmit.mockResolvedValueOnce(undefined);

      // Mock will be called multiple times during validation and submission
      // Set up the mock to return consistent sanitized values
      (SecurityValidator.validateContactFormField as any).mockImplementation(
        (field: string, value: string) => {
          if (field === "name") {
            return {
              isValid: true,
              risks: [],
              sanitizedValue: "Sanitized Name",
              riskLevel: "NONE",
            };
          } else if (field === "message") {
            return {
              isValid: true,
              risks: [],
              sanitizedValue: "Sanitized Message",
              riskLevel: "NONE",
            };
          }
          return {
            isValid: true,
            risks: [],
            sanitizedValue: value,
            riskLevel: "NONE",
          };
        }
      );

      (SecurityValidator.validateEmail as any).mockImplementation(() => ({
        isValid: true,
        risks: [],
        sanitizedValue: "sanitized@example.com",
        riskLevel: "NONE",
      }));

      render(<SecureContactForm onSubmit={mockOnSubmit} />);

      // Fill form
      await userEvent.type(screen.getByLabelText(/name/i), "Test User");
      await userEvent.type(screen.getByLabelText(/email/i), "test@example.com");
      await userEvent.type(screen.getByLabelText(/message/i), "Test message");

      // Submit form
      await userEvent.click(
        screen.getByRole("button", { name: /send message/i })
      );

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          name: "Sanitized Name",
          email: "sanitized@example.com",
          message: "Sanitized Message",
        });
      });
    });

    it("should include phone in submission when provided", async () => {
      mockOnSubmit.mockResolvedValueOnce(undefined);

      (SecurityValidator.validatePhone as any).mockReturnValueOnce({
        isValid: true,
        risks: [],
        sanitizedValue: "1234567890",
        riskLevel: "NONE",
      });

      render(<SecureContactForm onSubmit={mockOnSubmit} />);

      // Fill form including phone
      await userEvent.type(screen.getByLabelText(/name/i), "Test User");
      await userEvent.type(screen.getByLabelText(/email/i), "test@example.com");
      await userEvent.type(screen.getByLabelText(/phone/i), "(123) 456-7890");
      await userEvent.type(screen.getByLabelText(/message/i), "Test message");

      // Submit form
      await userEvent.click(
        screen.getByRole("button", { name: /send message/i })
      );

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            phone: "1234567890",
          })
        );
      });
    });

    it("should show loading state during submission", async () => {
      mockOnSubmit.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      render(<SecureContactForm onSubmit={mockOnSubmit} />);

      // Fill form
      await userEvent.type(screen.getByLabelText(/name/i), "Test User");
      await userEvent.type(screen.getByLabelText(/email/i), "test@example.com");
      await userEvent.type(screen.getByLabelText(/message/i), "Test message");

      // Submit form
      const submitButton = screen.getByRole("button", {
        name: /send message/i,
      });
      await userEvent.click(submitButton);

      expect(submitButton).toHaveTextContent("Sending...");
      expect(submitButton).toBeDisabled();

      await waitFor(() => {
        expect(submitButton).toHaveTextContent("Send Message");
        expect(submitButton).not.toBeDisabled();
      });
    });

    it("should show success message after successful submission", async () => {
      mockOnSubmit.mockResolvedValueOnce(undefined);

      render(<SecureContactForm onSubmit={mockOnSubmit} />);

      // Fill form
      await userEvent.type(screen.getByLabelText(/name/i), "Test User");
      await userEvent.type(screen.getByLabelText(/email/i), "test@example.com");
      await userEvent.type(screen.getByLabelText(/message/i), "Test message");

      // Submit form
      await userEvent.click(
        screen.getByRole("button", { name: /send message/i })
      );

      await waitFor(() => {
        expect(
          screen.getByText(/Thank you for your message!/i)
        ).toBeInTheDocument();
        expect(
          screen.getByText(/We'll get back to you within 24-48 hours/i)
        ).toBeInTheDocument();
      });
    });

    it("should reset form after successful submission", async () => {
      mockOnSubmit.mockResolvedValueOnce(undefined);

      render(<SecureContactForm onSubmit={mockOnSubmit} />);

      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const messageInput = screen.getByLabelText(/message/i);

      // Fill form
      await userEvent.type(nameInput, "Test User");
      await userEvent.type(emailInput, "test@example.com");
      await userEvent.type(messageInput, "Test message");

      // Submit form
      await userEvent.click(
        screen.getByRole("button", { name: /send message/i })
      );

      await waitFor(() => {
        expect(nameInput).toHaveValue("");
        expect(emailInput).toHaveValue("");
        expect(messageInput).toHaveValue("");
      });
    });

    it("should log successful submission", async () => {
      mockOnSubmit.mockResolvedValueOnce(undefined);

      render(<SecureContactForm onSubmit={mockOnSubmit} />);

      // Fill and submit form
      await userEvent.type(screen.getByLabelText(/name/i), "Test User");
      await userEvent.type(screen.getByLabelText(/email/i), "test@example.com");
      await userEvent.type(screen.getByLabelText(/message/i), "Test message");
      await userEvent.click(
        screen.getByRole("button", { name: /send message/i })
      );

      await waitFor(() => {
        expect(mockLog).toHaveBeenCalledWith(
          "FORM_SUBMISSION_SUCCESS",
          expect.objectContaining({
            timestamp: expect.any(String),
          }),
          "LOW"
        );
      });
    });

    it("should handle submission errors gracefully", async () => {
      mockOnSubmit.mockRejectedValueOnce(new Error("Network error"));

      render(<SecureContactForm onSubmit={mockOnSubmit} />);

      // Fill form
      await userEvent.type(screen.getByLabelText(/name/i), "Test User");
      await userEvent.type(screen.getByLabelText(/email/i), "test@example.com");
      await userEvent.type(screen.getByLabelText(/message/i), "Test message");

      // Submit form
      await userEvent.click(
        screen.getByRole("button", { name: /send message/i })
      );

      await waitFor(() => {
        expect(
          screen.getByText(/An error occurred while submitting your message/i)
        ).toBeInTheDocument();
        expect(mockLog).toHaveBeenCalledWith(
          "FORM_SUBMISSION_ERROR",
          expect.objectContaining({
            error: "Network error",
          }),
          "MEDIUM"
        );
      });
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA attributes for invalid fields", async () => {
      (SecurityValidator.validateContactFormField as any).mockReturnValueOnce({
        isValid: false,
        risks: [
          {
            level: "HIGH",
            type: "EMPTY_FIELD",
            message: "This field is required",
          },
        ],
        sanitizedValue: "",
        riskLevel: "HIGH",
      });

      render(<SecureContactForm onSubmit={mockOnSubmit} />);

      const nameInput = screen.getByLabelText(/name/i);
      fireEvent.blur(nameInput);

      await waitFor(() => {
        expect(nameInput).toHaveAttribute("aria-invalid", "true");
        expect(nameInput).toHaveAttribute("aria-describedby", "name-error");
      });
    });

    it("should have required attributes on mandatory fields", () => {
      render(<SecureContactForm onSubmit={mockOnSubmit} />);

      expect(screen.getByLabelText(/name/i)).toHaveAttribute("required");
      expect(screen.getByLabelText(/email/i)).toHaveAttribute("required");
      expect(screen.getByLabelText(/message/i)).toHaveAttribute("required");
    });

    it("should have noValidate attribute on form", () => {
      const { container } = render(
        <SecureContactForm onSubmit={mockOnSubmit} />
      );

      const form = container.querySelector("form");
      expect(form).toHaveAttribute("novalidate");
    });
  });

  describe("Edge Cases", () => {
    it("should handle validation with empty risks array", async () => {
      (SecurityValidator.validateContactFormField as any).mockReturnValueOnce({
        isValid: false,
        risks: [],
        sanitizedValue: "",
        riskLevel: "NONE",
      });

      render(<SecureContactForm onSubmit={mockOnSubmit} />);

      const nameInput = screen.getByLabelText(/name/i);
      fireEvent.blur(nameInput);

      // Should not crash and should not display an error
      await waitFor(() => {
        expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
      });
    });

    it("should clear errors when user starts typing after validation error", async () => {
      (SecurityValidator.validateContactFormField as any).mockReturnValueOnce({
        isValid: false,
        risks: [
          {
            level: "HIGH",
            type: "EMPTY_FIELD",
            message: "This field is required",
          },
        ],
        sanitizedValue: "",
        riskLevel: "HIGH",
      });

      render(<SecureContactForm onSubmit={mockOnSubmit} />);

      const nameInput = screen.getByLabelText(/name/i);
      fireEvent.blur(nameInput);

      await waitFor(() => {
        expect(screen.getByText("This field is required")).toBeInTheDocument();
      });

      // Reset mock to return valid result
      (SecurityValidator.validateContactFormField as any).mockReturnValue({
        isValid: true,
        risks: [],
        sanitizedValue: "Test",
        riskLevel: "NONE",
      });

      // Type in the field
      await userEvent.type(nameInput, "T");

      await waitFor(() => {
        expect(
          screen.queryByText("This field is required")
        ).not.toBeInTheDocument();
      });
    });
  });
});
