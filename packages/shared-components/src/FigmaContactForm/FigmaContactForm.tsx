import React, { useState, useCallback, useRef } from "react";
import {
  SecurityValidator,
  FormRateLimit,
  SecurityMonitor,
  type ValidationResult,
} from "@reiki-goddess/shared-utils";

export interface FigmaContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  agreeToTerms: boolean;
}

export interface FigmaContactFormProps {
  onSubmit: (data: FigmaContactFormData) => Promise<void>;
  className?: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  message?: string;
  agreeToTerms?: string;
  general?: string;
}

/**
 * FigmaContactForm - Contact form matching exact Figma design specifications
 * with integrated security features and split name fields
 */
export const FigmaContactForm: React.FC<FigmaContactFormProps> = ({
  onSubmit,
  className = "",
}) => {
  const [formData, setFormData] = useState<FigmaContactFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Initialize rate limiter and monitor
  const rateLimit = useRef(new FormRateLimit());
  const monitor = useRef(new SecurityMonitor({ enableConsoleLogging: false }));

  /**
   * Validates a single field
   */
  const validateField = useCallback(
    (
      name: keyof FigmaContactFormData,
      value: string | boolean
    ): string | undefined => {
      if (name === "agreeToTerms") {
        return value ? undefined : "You must agree to the Terms & Conditions";
      }

      let result: ValidationResult;

      switch (name) {
        case "email":
          result = SecurityValidator.validateEmail(value as string);
          break;
        case "phone":
          result = SecurityValidator.validatePhone(value as string);
          if (!result.isValid && !(value as string)) {
            return "Phone number is required";
          }
          break;
        case "firstName":
          if (!value) {
            return "First name is required";
          }
          result = SecurityValidator.validateContactFormField(
            "name",
            value as string
          );
          break;
        case "lastName":
          if (!value) {
            return undefined; // Last name is optional
          }
          result = SecurityValidator.validateContactFormField(
            "name",
            value as string
          );
          break;
        default:
          result = SecurityValidator.validateContactFormField(
            name,
            value as string
          );
      }

      if (!result.isValid && result.risks.length > 0) {
        // Log security incidents
        result.risks.forEach((risk) => {
          if (risk.level === "HIGH") {
            monitor.current.log(risk.type, {
              field: name,
              value: (value as string).substring(0, 50) + "...",
              message: risk.message,
            });
          }
        });

        // Return the first high-level risk message, or the first message
        const highRisk = result.risks.find((r) => r.level === "HIGH");
        return highRisk?.message || result.risks[0]?.message;
      }

      return undefined;
    },
    []
  );

  /**
   * Handles field changes
   */
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;
      const checked = (e.target as HTMLInputElement).checked;

      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));

      // Clear error when user starts typing
      if (errors[name as keyof FormErrors]) {
        setErrors((prev) => ({
          ...prev,
          [name]: undefined,
        }));
      }
    },
    [errors]
  );

  /**
   * Handles field blur for validation
   */
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      const error = validateField(name as keyof FigmaContactFormData, value);

      if (error) {
        setErrors((prev) => ({
          ...prev,
          [name]: error,
        }));
      }
    },
    [validateField]
  );

  /**
   * Validates entire form
   */
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    // Validate each field
    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key as keyof FigmaContactFormData, value);
      if (error) {
        newErrors[key as keyof FormErrors] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateField]);

  /**
   * Handles form submission
   */
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Clear any previous success state
      setSubmitSuccess(false);

      // Check rate limit
      const rateLimitCheck = rateLimit.current.checkLimit();
      if (!rateLimitCheck.allowed) {
        setErrors({
          general: rateLimitCheck.message,
        });
        monitor.current.log("RATE_LIMIT_EXCEEDED", {
          remainingTime: rateLimitCheck.timeUntilReset,
        });
        return;
      }

      // Validate form
      if (!validateForm()) {
        return;
      }

      // Check for high-risk content
      const dataToCheck: Record<string, string> = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
      };

      if (SecurityValidator.isHighRisk(dataToCheck)) {
        monitor.current.log("HIGH_RISK_SUBMISSION_BLOCKED", {
          fields: Object.keys(formData),
        });
        setErrors({
          general:
            "Your submission contains content that cannot be processed. Please review and try again.",
        });
        return;
      }

      setIsSubmitting(true);
      setErrors({});

      try {
        // Sanitize data before submission
        const sanitizedData: FigmaContactFormData = {
          firstName: SecurityValidator.validateContactFormField(
            "name",
            formData.firstName
          ).sanitizedValue,
          lastName: SecurityValidator.validateContactFormField(
            "name",
            formData.lastName
          ).sanitizedValue,
          email: SecurityValidator.validateEmail(formData.email).sanitizedValue,
          phone: SecurityValidator.validatePhone(formData.phone).sanitizedValue,
          message: SecurityValidator.validateContactFormField(
            "message",
            formData.message
          ).sanitizedValue,
          agreeToTerms: formData.agreeToTerms,
        };

        // Record the submission
        rateLimit.current.record();

        // Submit the form
        await onSubmit(sanitizedData);

        // Success!
        setSubmitSuccess(true);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          message: "",
          agreeToTerms: false,
        });

        // Reset form
        formRef.current?.reset();

        // Log successful submission
        monitor.current.log(
          "FORM_SUBMISSION_SUCCESS",
          {
            timestamp: new Date().toISOString(),
          },
          "LOW"
        );
      } catch (error) {
        // Log error
        monitor.current.log(
          "FORM_SUBMISSION_ERROR",
          {
            error: error instanceof Error ? error.message : "Unknown error",
          },
          "MEDIUM"
        );

        setErrors({
          general:
            "An error occurred while submitting your message. Please try again later.",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, validateForm, onSubmit]
  );

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className={`figma-contact-form ${className}`}
      noValidate
    >
      {/* Success Message */}
      {submitSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium">
            Thank you for your message!
          </p>
          <p className="text-green-700 text-sm mt-1">
            We&apos;ll get back to you within 24-48 hours.
          </p>
        </div>
      )}

      {/* General Error */}
      {errors.general && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{errors.general}</p>
        </div>
      )}

      {/* Name Fields Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[38px] mb-[30px]">
        {/* First Name Field */}
        <div className="flex flex-col gap-4">
          <label
            htmlFor="firstName"
            className="text-[24px] font-bold text-black"
            style={{ fontFamily: "Figtree, sans-serif" }}
          >
            First Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter here"
              className={`w-full px-6 py-6 bg-white border rounded-[12px] text-[24px] placeholder-[#8D8D8D] ${
                errors.firstName ? "border-red-500" : "border-black/[0.19]"
              }`}
              style={{ fontFamily: "Neue Montreal, sans-serif" }}
              aria-invalid={!!errors.firstName}
              aria-describedby={
                errors.firstName ? "firstName-error" : undefined
              }
              required
            />
            {errors.firstName && (
              <p id="firstName-error" className="mt-2 text-sm text-red-600">
                {errors.firstName}
              </p>
            )}
          </div>
        </div>

        {/* Last Name Field */}
        <div className="flex flex-col gap-4">
          <label
            htmlFor="lastName"
            className="text-[24px] font-bold text-black"
            style={{ fontFamily: "Figtree, sans-serif" }}
          >
            Last Name
          </label>
          <div className="relative">
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter here"
              className={`w-full px-6 py-6 bg-white border rounded-[12px] text-[24px] placeholder-[#8D8D8D] ${
                errors.lastName ? "border-red-500" : "border-black/[0.19]"
              }`}
              style={{ fontFamily: "Neue Montreal, sans-serif" }}
              aria-invalid={!!errors.lastName}
              aria-describedby={errors.lastName ? "lastName-error" : undefined}
            />
            {errors.lastName && (
              <p id="lastName-error" className="mt-2 text-sm text-red-600">
                {errors.lastName}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Email and Phone Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[38px] mb-[62px]">
        {/* Email Field */}
        <div className="flex flex-col gap-4">
          <label
            htmlFor="email"
            className="text-[24px] font-bold text-black"
            style={{ fontFamily: "Figtree, sans-serif" }}
          >
            Email <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter here"
              className={`w-full px-6 py-6 bg-white border rounded-[12px] text-[24px] placeholder-[#8D8D8D] ${
                errors.email ? "border-red-500" : "border-black/[0.19]"
              }`}
              style={{ fontFamily: "Neue Montreal, sans-serif" }}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              required
            />
            {errors.email && (
              <p id="email-error" className="mt-2 text-sm text-red-600">
                {errors.email}
              </p>
            )}
          </div>
        </div>

        {/* Phone Field */}
        <div className="flex flex-col gap-4">
          <label
            htmlFor="phone"
            className="text-[24px] font-bold text-black"
            style={{ fontFamily: "Figtree, sans-serif" }}
          >
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter here"
              className={`w-full px-6 py-6 bg-white border rounded-[12px] text-[24px] placeholder-[#8D8D8D] ${
                errors.phone ? "border-red-500" : "border-black/[0.19]"
              }`}
              style={{ fontFamily: "Neue Montreal, sans-serif" }}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              required
            />
            {errors.phone && (
              <p id="phone-error" className="mt-2 text-sm text-red-600">
                {errors.phone}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Message Field */}
      <div className="flex flex-col gap-4 mb-[32px]">
        <label
          htmlFor="message"
          className="text-[24px] font-bold text-black"
          style={{ fontFamily: "Figtree, sans-serif" }}
        >
          Message <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            onBlur={handleBlur}
            rows={4}
            placeholder="write your message here"
            className={`w-full px-6 py-6 bg-white border rounded-[12px] text-[24px] placeholder-[#8D8D8D] resize-none ${
              errors.message ? "border-red-500" : "border-black/[0.19]"
            }`}
            style={{ fontFamily: "Neue Montreal, sans-serif" }}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : undefined}
            required
          />
          {errors.message && (
            <p id="message-error" className="mt-2 text-sm text-red-600">
              {errors.message}
            </p>
          )}
        </div>
      </div>

      {/* Terms Checkbox */}
      <div className="flex items-center gap-4 mb-[76px]">
        <input
          type="checkbox"
          id="agreeToTerms"
          name="agreeToTerms"
          checked={formData.agreeToTerms}
          onChange={handleChange}
          className="w-6 h-6 border-2 border-blue rounded"
          aria-invalid={!!errors.agreeToTerms}
          aria-describedby={errors.agreeToTerms ? "terms-error" : undefined}
        />
        <label
          htmlFor="agreeToTerms"
          className="text-[16px] font-medium text-[#5F5F5F] cursor-pointer"
          style={{ fontFamily: "Figtree, sans-serif" }}
        >
          I have read and agree to the Terms & Conditions
        </label>
      </div>
      {errors.agreeToTerms && (
        <p
          id="terms-error"
          className="mt-2 text-sm text-red-600 -mt-[60px] mb-[40px]"
        >
          {errors.agreeToTerms}
        </p>
      )}

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-[51px] py-[10px] rounded-[90px] border-2 font-medium transition-all duration-300 ${
            isSubmitting
              ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
              : "bg-transparent border-blue text-blue hover:bg-blue hover:text-white"
          }`}
          style={{ fontFamily: "Figtree, sans-serif" }}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>

      {/* Rate Limit Info */}
      <p className="mt-8 text-xs text-gray-500 text-center">
        For security, form submissions are limited to 3 per hour.
      </p>
    </form>
  );
};
