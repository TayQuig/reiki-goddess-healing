/**
 * API client for contact form submissions
 * Handles communication with the Vercel serverless function
 */

export interface FigmaContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  agreeToTerms: boolean;
}

export interface ContactFormResponse {
  success: boolean;
  emailId?: string;
  error?: string;
}

export class ContactFormError extends Error {
  status?: number;
  code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = "ContactFormError";
    this.status = status;
    this.code = code;
  }
}

/**
 * Get the contact API endpoint from environment variables
 */
function getApiEndpoint(): string {
  // In Vite, environment variables are accessed via import.meta.env
  // Use type assertion through 'unknown' to handle TypeScript limitations
  const endpoint =
    typeof import.meta !== "undefined" &&
    (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_CONTACT_API_ENDPOINT
      ? (import.meta as unknown as { env: Record<string, string> }).env.VITE_CONTACT_API_ENDPOINT
      : "/api/contact";

  return endpoint;
}

/**
 * Map HTTP status codes to user-friendly error messages
 */
function getErrorMessage(status: number): string {
  const errorMessages: Record<number, string> = {
    400: "Invalid submission. Please check your information.",
    429: "Too many submissions. Please try again later.",
    500: "Service error. Please try again later.",
    503: "Service temporarily unavailable. Please try again later.",
  };

  return errorMessages[status] || "An unexpected error occurred. Please try again.";
}

/**
 * Submits contact form data to the backend API
 *
 * @param data - The sanitized and validated contact form data
 * @returns Promise that resolves on success or rejects with ContactFormError
 * @throws {ContactFormError} On network errors, timeouts, or API errors
 *
 * @example
 * try {
 *   const response = await submitContactForm(formData);
 *   console.log('Email sent:', response.emailId);
 * } catch (error) {
 *   if (error instanceof ContactFormError) {
 *     console.error('Submission failed:', error.message);
 *   }
 * }
 */
export async function submitContactForm(
  data: FigmaContactFormData
): Promise<ContactFormResponse> {
  // Create AbortController for 30-second timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const endpoint = getApiEndpoint();

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Parse JSON response
    let result: ContactFormResponse;
    try {
      result = await response.json();
    } catch (jsonError) {
      throw new ContactFormError(
        "Invalid response from server. Please try again.",
        response.status,
        "invalid_json"
      );
    }

    // Handle HTTP errors
    if (!response.ok) {
      const message = result.error || getErrorMessage(response.status);
      throw new ContactFormError(message, response.status, "http_error");
    }

    // Validate success response
    if (!result.success) {
      throw new ContactFormError(
        result.error || "Submission failed. Please try again.",
        response.status,
        "api_error"
      );
    }

    return result;
  } catch (error) {
    clearTimeout(timeoutId);

    // Handle abort/timeout
    if (error instanceof Error && error.name === "AbortError") {
      throw new ContactFormError(
        "Request timed out. Please check your connection.",
        undefined,
        "timeout"
      );
    }

    // Handle network errors
    if (error instanceof TypeError && error.message.includes("fetch")) {
      // Check if offline
      if (typeof navigator !== "undefined" && !navigator.onLine) {
        throw new ContactFormError(
          "No internet connection. Please check your connection.",
          undefined,
          "network_offline"
        );
      }

      throw new ContactFormError(
        "Network error. Please check your connection and try again.",
        undefined,
        "network_error"
      );
    }

    // Re-throw ContactFormError as-is
    if (error instanceof ContactFormError) {
      throw error;
    }

    // Wrap unknown errors
    throw new ContactFormError(
      "An unexpected error occurred. Please try again.",
      undefined,
      "unknown_error"
    );
  }
}
