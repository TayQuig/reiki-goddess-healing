import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FigmaContactForm } from "./FigmaContactForm";

// Mock the security utilities
vi.mock("@reiki-goddess/shared-utils", () => ({
  SecurityValidator: {
    validateEmail: vi.fn((email) => ({
      isValid: email.includes("@"),
      sanitizedValue: email,
      risks: email.includes("@")
        ? []
        : [{ level: "HIGH", type: "INVALID_EMAIL", message: "Invalid email" }],
    })),
    validatePhone: vi.fn((phone) => ({
      isValid: phone.length >= 10,
      sanitizedValue: phone,
      risks:
        phone.length >= 10
          ? []
          : [
              {
                level: "HIGH",
                type: "INVALID_PHONE",
                message: "Invalid phone",
              },
            ],
    })),
    validateContactFormField: vi.fn((field, value) => ({
      isValid: value.length > 0 && !value.includes("script"),
      sanitizedValue: value,
      risks: value.includes("script")
        ? [{ level: "HIGH", type: "XSS", message: "Invalid content" }]
        : [],
    })),
    isHighRisk: vi.fn(() => false),
  },
  FormRateLimit: vi.fn(() => ({
    checkLimit: () => ({ allowed: true }),
    record: vi.fn(),
  })),
  SecurityMonitor: vi.fn(() => ({
    log: vi.fn(),
  })),
}));

describe("FigmaContactForm", () => {
  const mockSubmit = vi.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Rendering", () => {
    it("should render all form fields", () => {
      render(<FigmaContactForm onSubmit={mockSubmit} />);

      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/terms & conditions/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /submit/i })
      ).toBeInTheDocument();
    });

    it("should show required indicators for mandatory fields", () => {
      render(<FigmaContactForm onSubmit={mockSubmit} />);

      const requiredFields = ["First Name", "Email", "Phone Number", "Message"];
      requiredFields.forEach((field) => {
        const label = screen.getByText(field);
        const asterisk = label.parentElement?.querySelector(".text-red-500");
        expect(asterisk).toBeInTheDocument();
        expect(asterisk).toHaveTextContent("*");
      });
    });

    it("should render with correct placeholder text", () => {
      render(<FigmaContactForm onSubmit={mockSubmit} />);

      const enterHerePlaceholders = screen.getAllByPlaceholderText("Enter here");
      expect(enterHerePlaceholders).toHaveLength(4); // firstName, lastName, email, phone
      expect(
        screen.getByPlaceholderText("write your message here")
      ).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      const { container } = render(
        <FigmaContactForm onSubmit={mockSubmit} className="custom-form" />
      );

      const form = container.querySelector("form");
      expect(form).toHaveClass("figma-contact-form", "custom-form");
    });
  });

  describe("Field Validation", () => {
    it("should validate required fields on blur", async () => {
      render(<FigmaContactForm onSubmit={mockSubmit} />);

      const firstNameInput = screen.getByLabelText(/first name/i);
      await user.click(firstNameInput);
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText("First name is required")).toBeInTheDocument();
      });
    });

    it("should validate email format", async () => {
      render(<FigmaContactForm onSubmit={mockSubmit} />);

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, "invalid-email");
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText("Invalid email")).toBeInTheDocument();
      });
    });

    it("should validate phone number", async () => {
      render(<FigmaContactForm onSubmit={mockSubmit} />);

      const phoneInput = screen.getByLabelText(/phone number/i);
      await user.type(phoneInput, "123");
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText("Invalid phone")).toBeInTheDocument();
      });
    });

    it("should clear errors when user starts typing", async () => {
      render(<FigmaContactForm onSubmit={mockSubmit} />);

      const firstNameInput = screen.getByLabelText(/first name/i);

      // Trigger validation error
      await user.click(firstNameInput);
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText("First name is required")).toBeInTheDocument();
      });

      // Start typing
      await user.type(firstNameInput, "J");

      await waitFor(() => {
        expect(
          screen.queryByText("First name is required")
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Form Submission", () => {
    it("should submit form with valid data", async () => {
      render(<FigmaContactForm onSubmit={mockSubmit} />);

      // Fill out form
      await user.type(screen.getByLabelText(/first name/i), "John");
      await user.type(screen.getByLabelText(/last name/i), "Doe");
      await user.type(screen.getByLabelText(/email/i), "john@example.com");
      await user.type(screen.getByLabelText(/phone number/i), "1234567890");
      await user.type(screen.getByLabelText(/message/i), "Test message");
      await user.click(screen.getByLabelText(/terms & conditions/i));

      // Submit
      await user.click(screen.getByRole("button", { name: /submit/i }));

      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith({
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          phone: "1234567890",
          message: "Test message",
          agreeToTerms: true,
        });
      });
    });

    it("should show success message after submission", async () => {
      mockSubmit.mockResolvedValueOnce(undefined);
      render(<FigmaContactForm onSubmit={mockSubmit} />);

      // Fill and submit form
      await user.type(screen.getByLabelText(/first name/i), "John");
      await user.type(screen.getByLabelText(/email/i), "john@example.com");
      await user.type(screen.getByLabelText(/phone number/i), "1234567890");
      await user.type(screen.getByLabelText(/message/i), "Test message");
      await user.click(screen.getByLabelText(/terms & conditions/i));
      await user.click(screen.getByRole("button", { name: /submit/i }));

      await waitFor(() => {
        expect(
          screen.getByText("Thank you for your message!")
        ).toBeInTheDocument();
        expect(
          screen.getByText(/we'll get back to you within 24-48 hours/i)
        ).toBeInTheDocument();
      });
    });

    it("should not submit without agreeing to terms", async () => {
      render(<FigmaContactForm onSubmit={mockSubmit} />);

      // Fill form without checking terms
      await user.type(screen.getByLabelText(/first name/i), "John");
      await user.type(screen.getByLabelText(/email/i), "john@example.com");
      await user.type(screen.getByLabelText(/phone number/i), "1234567890");
      await user.type(screen.getByLabelText(/message/i), "Test message");

      // Submit
      await user.click(screen.getByRole("button", { name: /submit/i }));

      await waitFor(() => {
        expect(
          screen.getByText("You must agree to the Terms & Conditions")
        ).toBeInTheDocument();
        expect(mockSubmit).not.toHaveBeenCalled();
      });
    });

    it("should show error message on submission failure", async () => {
      mockSubmit.mockRejectedValueOnce(new Error("Network error"));
      render(<FigmaContactForm onSubmit={mockSubmit} />);

      // Fill and submit form
      await user.type(screen.getByLabelText(/first name/i), "John");
      await user.type(screen.getByLabelText(/email/i), "john@example.com");
      await user.type(screen.getByLabelText(/phone number/i), "1234567890");
      await user.type(screen.getByLabelText(/message/i), "Test message");
      await user.click(screen.getByLabelText(/terms & conditions/i));
      await user.click(screen.getByRole("button", { name: /submit/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/an error occurred while submitting/i)
        ).toBeInTheDocument();
      });
    });
  });

  describe("Security Features", () => {
    it("should show rate limit message", () => {
      render(<FigmaContactForm onSubmit={mockSubmit} />);

      expect(
        screen.getByText(/form submissions are limited to 3 per hour/i)
      ).toBeInTheDocument();
    });

    it("should disable submit button while submitting", async () => {
      mockSubmit.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );
      render(<FigmaContactForm onSubmit={mockSubmit} />);

      // Fill form
      await user.type(screen.getByLabelText(/first name/i), "John");
      await user.type(screen.getByLabelText(/email/i), "john@example.com");
      await user.type(screen.getByLabelText(/phone number/i), "1234567890");
      await user.type(screen.getByLabelText(/message/i), "Test message");
      await user.click(screen.getByLabelText(/terms & conditions/i));

      const submitButton = screen.getByRole("button", { name: /submit/i });
      await user.click(submitButton);

      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent("Submitting...");

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
        expect(submitButton).toHaveTextContent("Submit");
      });
    });
  });

  describe("Styling", () => {
    it("should apply Figma-specific styles", () => {
      render(<FigmaContactForm onSubmit={mockSubmit} />);

      const firstNameInput = screen.getByLabelText(/first name/i);
      expect(firstNameInput).toHaveClass(
        "px-6",
        "py-6",
        "bg-white",
        "rounded-[12px]",
        "text-[24px]"
      );

      const submitButton = screen.getByRole("button", { name: /submit/i });
      expect(submitButton).toHaveClass(
        "px-[51px]",
        "py-[10px]",
        "rounded-[90px]",
        "border-2"
      );
    });

    it("should use correct fonts", () => {
      render(<FigmaContactForm onSubmit={mockSubmit} />);

      const labels = screen.getAllByText(/\*/);
      labels.forEach((label) => {
        expect(label.parentElement).toHaveStyle({
          fontFamily: "Figtree, sans-serif",
        });
      });

      const inputs = screen.getAllByPlaceholderText("Enter here");
      inputs.forEach((input) => {
        expect(input).toHaveStyle({ fontFamily: "Neue Montreal, sans-serif" });
      });
    });
  });

  describe("Responsive Layout", () => {
    it("should have responsive grid layout for name fields", () => {
      render(<FigmaContactForm onSubmit={mockSubmit} />);

      const firstNameField =
        screen.getByLabelText(/first name/i).parentElement?.parentElement;

      const grid = firstNameField?.parentElement;
      expect(grid).toHaveClass(
        "grid",
        "grid-cols-1",
        "md:grid-cols-2",
        "gap-[38px]"
      );
    });

    it("should have responsive grid layout for email and phone fields", () => {
      render(<FigmaContactForm onSubmit={mockSubmit} />);

      const emailField =
        screen.getByLabelText(/email/i).parentElement?.parentElement;

      const grid = emailField?.parentElement;
      expect(grid).toHaveClass(
        "grid",
        "grid-cols-1",
        "md:grid-cols-2",
        "gap-[38px]"
      );
    });
  });
});
