/**
 * Tests for address utilities
 * The Reiki Goddess Healing project
 */

import { describe, it, expect } from "vitest";
import {
  encodeAddress,
  sanitizeAddress,
  parseAddressComponents,
  validateAddress,
  formatAddressComponents,
} from "./addressUtils";

describe("encodeAddress", () => {
  it("encodes basic addresses correctly", () => {
    expect(encodeAddress("123 Main St, Roy, WA")).toBe(
      "123%20Main%20St%2C%20Roy%2C%20WA"
    );
    expect(encodeAddress("456 Oak Avenue")).toBe("456%20Oak%20Avenue");
  });

  it("handles international characters", () => {
    expect(encodeAddress("Café München, Germany")).toBe(
      "Caf%C3%A9%20M%C3%BCnchen%2C%20Germany"
    );
    expect(encodeAddress("東京都")).toBe("%E6%9D%B1%E4%BA%AC%E9%83%BD");
  });

  it("normalizes whitespace", () => {
    expect(encodeAddress("  123   Main   St  ")).toBe("123%20Main%20St");
    expect(encodeAddress("123\t\nMain\r\nSt")).toBe("123%20Main%20St");
  });

  it("handles empty and invalid inputs", () => {
    expect(encodeAddress("")).toBe("");
    expect(encodeAddress("   ")).toBe("");
    expect(encodeAddress(null as any)).toBe("");
    expect(encodeAddress(undefined as any)).toBe("");
    expect(encodeAddress(123 as any)).toBe("");
  });

  it("handles special characters", () => {
    expect(encodeAddress("123 Main St & Oak Ave")).toBe(
      "123%20Main%20St%20%26%20Oak%20Ave"
    );
    expect(encodeAddress("Roy, WA 98580")).toBe("Roy%2C%20WA%2098580");
  });
});

describe("sanitizeAddress", () => {
  it("removes HTML tags", () => {
    expect(sanitizeAddress("123 <script>alert('xss')</script> Main St")).toBe(
      "123 Main St"
    );
    expect(sanitizeAddress("<div>123 Main St</div>")).toBe("123 Main St");
    expect(sanitizeAddress("123 <b>Main</b> St")).toBe("123 Main St");
  });

  it("removes JavaScript protocols", () => {
    expect(sanitizeAddress("javascript:alert('hack')")).toBe("'hack')");
    expect(sanitizeAddress("JAVASCRIPT:malicious()")).toBe("malicious()");
    expect(sanitizeAddress("123 Main St javascript:void(0)")).toBe(
      "123 Main St void(0)"
    );
  });

  it("removes data protocols", () => {
    expect(sanitizeAddress("data:text/html,<script>alert(1)</script>")).toBe(
      "text/html,"
    );
    expect(sanitizeAddress("DATA:image/png;base64,evil")).toBe(
      "image/png;base64,evil"
    );
  });

  it("removes vbscript protocols", () => {
    expect(sanitizeAddress("vbscript:malicious")).toBe("malicious");
    expect(sanitizeAddress("VBSCRIPT:evil()")).toBe("evil()");
  });

  it("removes event handlers", () => {
    expect(sanitizeAddress("123 Main onclick=alert('xss') St")).toBe(
      "123 Main 'xss') St"
    );
    expect(sanitizeAddress("onload=hack() Roy, WA")).toBe("hack() Roy, WA");
  });

  it("removes script and style tags with content", () => {
    expect(sanitizeAddress("Before <script>alert('xss')</script> After")).toBe(
      "Before After"
    );
    expect(
      sanitizeAddress("Before <style>body{display:none}</style> After")
    ).toBe("Before After");
  });

  it("preserves valid addresses", () => {
    expect(sanitizeAddress("123 Main St, Roy, WA 98580")).toBe(
      "123 Main St, Roy, WA 98580"
    );
    expect(sanitizeAddress("456 Oak Avenue & Pine Street")).toBe(
      "456 Oak Avenue & Pine Street"
    );
  });

  it("normalizes whitespace", () => {
    expect(sanitizeAddress("123    Main     St")).toBe("123 Main St");
    expect(sanitizeAddress("  Roy,   WA  ")).toBe("Roy, WA");
  });

  it("handles empty and invalid inputs", () => {
    expect(sanitizeAddress("")).toBe("");
    expect(sanitizeAddress("   ")).toBe("");
    expect(sanitizeAddress(null as any)).toBe("");
    expect(sanitizeAddress(undefined as any)).toBe("");
    expect(sanitizeAddress(123 as any)).toBe("");
  });
});

describe("parseAddressComponents", () => {
  it("parses US addresses correctly", () => {
    const result = parseAddressComponents("123 Main St, Roy, WA 98580, USA");
    expect(result).toEqual({
      streetNumber: "123",
      streetName: "Main St",
      city: "Roy",
      state: "WA",
      postalCode: "98580",
      country: "USA",
      formattedAddress: "123 Main St, Roy, WA 98580, USA",
    });
  });

  it("handles addresses without street numbers", () => {
    const result = parseAddressComponents("Main Street, Roy, WA 98580");
    expect(result).toEqual({
      streetName: "Main Street",
      city: "Roy",
      state: "WA",
      postalCode: "98580",
      formattedAddress: "Main Street, Roy, WA 98580",
    });
  });

  it("handles incomplete addresses", () => {
    const result = parseAddressComponents("123 Main St, Roy");
    expect(result).toEqual({
      streetNumber: "123",
      streetName: "Main St",
      city: "Roy",
      formattedAddress: "123 Main St, Roy",
    });
  });

  it("handles addresses without clear state/zip pattern", () => {
    const result = parseAddressComponents("123 Main St, Roy, Washington");
    expect(result).toEqual({
      streetNumber: "123",
      streetName: "Main St",
      city: "Roy",
      state: "Washington",
      formattedAddress: "123 Main St, Roy, Washington",
    });
  });

  it("handles ZIP+4 codes", () => {
    const result = parseAddressComponents("123 Main St, Roy, WA 98580-1234");
    expect(result).toEqual({
      streetNumber: "123",
      streetName: "Main St",
      city: "Roy",
      state: "WA",
      postalCode: "98580-1234",
      formattedAddress: "123 Main St, Roy, WA 98580-1234",
    });
  });

  it("handles single component addresses", () => {
    const result = parseAddressComponents("Roy, WA");
    expect(result).toEqual({
      streetName: "Roy",
      city: "WA",
      formattedAddress: "Roy, WA",
    });
  });

  it("handles empty and invalid inputs", () => {
    expect(parseAddressComponents("")).toEqual({ formattedAddress: "" });
    expect(parseAddressComponents("   ")).toEqual({
      formattedAddress: "",
      streetName: "",
    });
    expect(parseAddressComponents(null as any)).toEqual({
      formattedAddress: "",
    });
    expect(parseAddressComponents(undefined as any)).toEqual({
      formattedAddress: "",
    });
  });

  it("sanitizes input before parsing", () => {
    const result = parseAddressComponents(
      "123 <script>alert('xss')</script> Main St, Roy, WA"
    );
    expect(result.streetNumber).toBe("123");
    expect(result.streetName).toBe("Main St");
    expect(result.city).toBe("Roy");
    expect(result.state).toBe("WA");
  });
});

describe("validateAddress", () => {
  it("validates good addresses", () => {
    expect(validateAddress("123 Main St, Roy, WA")).toBe(true);
    expect(validateAddress("456 Oak Avenue")).toBe(true);
    expect(validateAddress("Roy, Washington")).toBe(true);
  });

  it("rejects empty or too short addresses", () => {
    expect(validateAddress("")).toBe(false);
    expect(validateAddress("  ")).toBe(false);
    expect(validateAddress("ab")).toBe(false);
    expect(validateAddress("   a   ")).toBe(false);
  });

  it("rejects addresses without alphanumeric characters", () => {
    expect(validateAddress("!@#$%^&*()")).toBe(false);
    expect(validateAddress("---")).toBe(false);
    expect(validateAddress("   !!!   ")).toBe(false);
  });

  it("rejects excessively long addresses", () => {
    const longAddress = "a".repeat(201);
    expect(validateAddress(longAddress)).toBe(false);
  });

  it("accepts addresses at the length limit", () => {
    const limitAddress = "a".repeat(200);
    expect(validateAddress(limitAddress)).toBe(true);
  });

  it("handles invalid input types", () => {
    expect(validateAddress(null as any)).toBe(false);
    expect(validateAddress(undefined as any)).toBe(false);
    expect(validateAddress(123 as any)).toBe(false);
    expect(validateAddress({} as any)).toBe(false);
  });

  it("validates international addresses", () => {
    expect(validateAddress("Tokyo, Japan")).toBe(true);
    expect(validateAddress("Café de Paris")).toBe(true);
  });
});

describe("formatAddressComponents", () => {
  it("formats complete address components", () => {
    const components = {
      streetNumber: "123",
      streetName: "Main St",
      city: "Roy",
      state: "WA",
      postalCode: "98580",
      country: "USA",
      formattedAddress: "original",
    };

    expect(formatAddressComponents(components)).toBe(
      "123 Main St, Roy, WA 98580, USA"
    );
  });

  it("handles missing street number", () => {
    const components = {
      streetName: "Main Street",
      city: "Roy",
      state: "WA",
      formattedAddress: "original",
    };

    expect(formatAddressComponents(components)).toBe("Main Street, Roy, WA");
  });

  it("handles missing postal code", () => {
    const components = {
      streetNumber: "123",
      streetName: "Main St",
      city: "Roy",
      state: "WA",
      formattedAddress: "original",
    };

    expect(formatAddressComponents(components)).toBe("123 Main St, Roy, WA");
  });

  it("handles minimal components", () => {
    const components = {
      city: "Roy",
      formattedAddress: "original",
    };

    expect(formatAddressComponents(components)).toBe("Roy");
  });

  it("handles empty components", () => {
    const components = {
      formattedAddress: "fallback",
    };

    expect(formatAddressComponents(components)).toBe("");
  });

  it("handles null/undefined input", () => {
    expect(formatAddressComponents(null as any)).toBe("");
    expect(formatAddressComponents(undefined as any)).toBe("");
  });

  it("formats with all components including country", () => {
    const components = {
      streetNumber: "456",
      streetName: "Oak Ave",
      city: "Seattle",
      state: "WA",
      postalCode: "98101",
      country: "United States",
      formattedAddress: "original",
    };

    expect(formatAddressComponents(components)).toBe(
      "456 Oak Ave, Seattle, WA 98101, United States"
    );
  });
});
