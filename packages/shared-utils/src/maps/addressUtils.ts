/**
 * Address utilities for map operations
 * The Reiki Goddess Healing project
 */

import type { AddressComponents } from "./types";

/**
 * URL-encode addresses for Google Maps while preserving readability
 * Handles special characters and international addresses
 *
 * @param address - Raw address string to encode
 * @returns URL-encoded address suitable for Google Maps APIs
 *
 * @example
 * ```typescript
 * encodeAddress("123 Main St, Roy, WA 98580") // "123%20Main%20St%2C%20Roy%2C%20WA%2098580"
 * encodeAddress("Café München, Germany") // "Caf%C3%A9%20M%C3%BCnchen%2C%20Germany"
 * ```
 */
export const encodeAddress = (address: string): string => {
  if (!address || typeof address !== "string") {
    return "";
  }

  // Trim whitespace and normalize spaces
  const normalized = address.trim().replace(/\s+/g, " ");

  // Use encodeURIComponent for proper URL encoding
  // This handles international characters, special symbols, and spaces correctly
  return encodeURIComponent(normalized);
};

/**
 * Sanitize address input to remove dangerous characters and prevent injection
 * Removes HTML, JavaScript, and other potentially malicious content
 *
 * @param address - Address string to sanitize
 * @returns Sanitized address safe for use in URLs and display
 *
 * @example
 * ```typescript
 * sanitizeAddress("123 Main St<script>alert('xss')</script>") // "123 Main St"
 * sanitizeAddress("javascript:alert('hack')") // "alert('hack')"
 * sanitizeAddress("Roy, WA & Seattle") // "Roy, WA & Seattle"
 * ```
 */
export const sanitizeAddress = (address: string): string => {
  if (!address || typeof address !== "string") {
    return "";
  }

  let sanitized = address;

  // Remove script tags and their content first (before other HTML processing)
  sanitized = sanitized.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ""
  );

  // Remove style tags and their content
  sanitized = sanitized.replace(
    /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi,
    ""
  );

  // Remove all HTML tags
  sanitized = sanitized.replace(/<[^>]*>/g, "");

  // Remove JavaScript protocol
  sanitized = sanitized.replace(/javascript:/gi, "");

  // Remove data protocol
  sanitized = sanitized.replace(/data:/gi, "");

  // Remove vbscript protocol
  sanitized = sanitized.replace(/vbscript:/gi, "");

  // Remove on* event handlers
  sanitized = sanitized.replace(/on\w+\s*=/gi, "");

  // Remove common JavaScript functions and keywords that could be dangerous
  sanitized = sanitized.replace(/alert\s*\(/gi, "");
  sanitized = sanitized.replace(/eval\s*\(/gi, "");
  sanitized = sanitized.replace(/script/gi, "");

  // Normalize whitespace
  sanitized = sanitized.replace(/\s+/g, " ").trim();

  return sanitized;
};

/**
 * Parse address string into structured components
 * Attempts to extract street, city, state, postal code, and country
 *
 * @param address - Full address string to parse
 * @returns Structured address components
 *
 * @example
 * ```typescript
 * parseAddressComponents("123 Main St, Roy, WA 98580, USA")
 * // Returns: {
 * //   streetNumber: "123",
 * //   streetName: "Main St",
 * //   city: "Roy",
 * //   state: "WA",
 * //   postalCode: "98580",
 * //   country: "USA",
 * //   formattedAddress: "123 Main St, Roy, WA 98580, USA"
 * // }
 * ```
 */
export const parseAddressComponents = (address: string): AddressComponents => {
  if (!address || typeof address !== "string") {
    return { formattedAddress: "" };
  }

  const sanitized = sanitizeAddress(address);
  const parts = sanitized.split(",").map((part) => part.trim());

  const result: AddressComponents = {
    formattedAddress: sanitized,
  };

  if (parts.length === 0) {
    return result;
  }

  // Try to parse based on common US address formats
  if (parts.length >= 1) {
    // First part typically contains street number and name
    const streetPart = parts[0];
    const streetMatch = streetPart.match(/^(\d+)\s+(.+)$/);

    if (streetMatch) {
      result.streetNumber = streetMatch[1];
      result.streetName = streetMatch[2];
    } else {
      // If no number found, treat entire part as street name
      result.streetName = streetPart;
    }
  }

  if (parts.length >= 2) {
    // Second part is typically city
    result.city = parts[1];
  }

  if (parts.length >= 3) {
    // Third part typically contains state and zip
    const stateZipPart = parts[2];
    const stateZipMatch = stateZipPart.match(
      /^([A-Z]{2})\s+(\d{5}(?:-\d{4})?)$/
    );

    if (stateZipMatch) {
      result.state = stateZipMatch[1];
      result.postalCode = stateZipMatch[2];
    } else {
      // If no clear state/zip pattern, treat as state
      result.state = stateZipPart;
    }
  }

  if (parts.length >= 4) {
    // Fourth part is typically country
    result.country = parts[3];
  }

  return result;
};

/**
 * Validate address format and completeness
 * Checks for minimum required components and reasonable length
 *
 * @param address - Address string to validate
 * @returns True if address appears valid
 *
 * @example
 * ```typescript
 * validateAddress("123 Main St, Roy, WA") // true
 * validateAddress("") // false
 * validateAddress("a") // false
 * ```
 */
export const validateAddress = (address: string): boolean => {
  if (!address || typeof address !== "string") {
    return false;
  }

  const sanitized = sanitizeAddress(address);

  // Must have minimum length
  if (sanitized.length < 3) {
    return false;
  }

  // Must have at least one alphanumeric character
  if (!/[a-zA-Z0-9]/.test(sanitized)) {
    return false;
  }

  // Should not be excessively long (reasonable limit)
  if (sanitized.length > 200) {
    return false;
  }

  return true;
};

/**
 * Format address components back into a standardized string
 * Useful for displaying parsed addresses consistently
 *
 * @param components - Address components object
 * @returns Formatted address string
 *
 * @example
 * ```typescript
 * const components = {
 *   streetNumber: "123",
 *   streetName: "Main St",
 *   city: "Roy",
 *   state: "WA",
 *   postalCode: "98580"
 * };
 * formatAddressComponents(components) // "123 Main St, Roy, WA 98580"
 * ```
 */
export const formatAddressComponents = (
  components: AddressComponents
): string => {
  if (!components) {
    return "";
  }

  const parts: string[] = [];

  // Build street address
  if (components.streetNumber && components.streetName) {
    parts.push(`${components.streetNumber} ${components.streetName}`);
  } else if (components.streetName) {
    parts.push(components.streetName);
  }

  // Add city
  if (components.city) {
    parts.push(components.city);
  }

  // Build state and postal code
  if (components.state && components.postalCode) {
    parts.push(`${components.state} ${components.postalCode}`);
  } else if (components.state) {
    parts.push(components.state);
  }

  // Add country
  if (components.country) {
    parts.push(components.country);
  }

  return parts.join(", ");
};
