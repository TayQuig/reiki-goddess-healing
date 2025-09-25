/**
 * Tests for SecurityConfig
 * Validates security configuration functionality
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  SecurityConfigManager,
  SecurityUtils,
  DEFAULT_GOOGLE_MAPS_CONFIG,
  BASE_CSP_DIRECTIVES,
  type GoogleMapsSecurityConfig,
} from "./SecurityConfig";

describe("SecurityConfigManager", () => {
  let configManager: SecurityConfigManager;

  beforeEach(() => {
    configManager = new SecurityConfigManager("development");
  });

  describe("constructor", () => {
    it("should create config for development environment", () => {
      const config = configManager.getConfig();
      expect(config.environment).toBe("development");
      expect(config.googleMaps.restrictToHttps).toBe(false);
      expect(config.monitoring.logLevel).toBe("MEDIUM");
    });

    it("should create config for production environment", () => {
      const prodManager = new SecurityConfigManager("production");
      const config = prodManager.getConfig();

      expect(config.environment).toBe("production");
      expect(config.googleMaps.restrictToHttps).toBe(true);
      expect(config.monitoring.logLevel).toBe("HIGH");
      expect(config.headers["Strict-Transport-Security"]).toBeDefined();
    });

    it("should default to production environment", () => {
      const defaultManager = new SecurityConfigManager();
      const config = defaultManager.getConfig();

      expect(config.environment).toBe("production");
    });
  });

  describe("getCspString", () => {
    it("should generate valid CSP string", () => {
      const cspString = configManager.getCspString();

      expect(cspString).toContain("default-src 'self'");
      expect(cspString).toContain("script-src 'self' 'unsafe-inline'");
      expect(cspString).toContain("https://maps.googleapis.com");
      expect(cspString).toContain("frame-src");
    });

    it("should include all required directives", () => {
      const cspString = configManager.getCspString();
      const requiredDirectives = [
        "default-src",
        "script-src",
        "style-src",
        "font-src",
        "img-src",
        "connect-src",
        "frame-src",
        "child-src",
        "worker-src",
        "object-src",
      ];

      requiredDirectives.forEach((directive) => {
        expect(cspString).toContain(directive);
      });
    });
  });

  describe("getHeaders", () => {
    it("should return all required security headers", () => {
      const headers = configManager.getHeaders();

      expect(headers["X-Content-Type-Options"]).toBe("nosniff");
      expect(headers["X-Frame-Options"]).toBe("SAMEORIGIN");
      expect(headers["X-XSS-Protection"]).toBe("1; mode=block");
      expect(headers["Referrer-Policy"]).toBe(
        "strict-origin-when-cross-origin"
      );
      expect(headers["Permissions-Policy"]).toContain("geolocation=self");
      expect(headers["Content-Security-Policy"]).toBeDefined();
    });

    it("should include HSTS header for production", () => {
      const prodManager = new SecurityConfigManager("production");
      const headers = prodManager.getHeaders();

      expect(headers["Strict-Transport-Security"]).toBe(
        "max-age=31536000; includeSubDomains"
      );
    });
  });

  describe("updateGoogleMapsConfig", () => {
    it("should update Google Maps configuration", () => {
      const newConfig: Partial<GoogleMapsSecurityConfig> = {
        enableGeolocation: false,
        allowedDomains: ["custom.example.com"],
      };

      configManager.updateGoogleMapsConfig(newConfig);
      const config = configManager.getConfig();

      expect(config.googleMaps.enableGeolocation).toBe(false);
      expect(config.googleMaps.allowedDomains).toEqual(["custom.example.com"]);
    });

    it("should update CSP when Google Maps config changes", () => {
      const originalCsp = configManager.getCspString();

      configManager.updateGoogleMapsConfig({
        allowedScripts: ["https://custom.example.com"],
      });

      const updatedCsp = configManager.getCspString();
      expect(updatedCsp).not.toBe(originalCsp);
      expect(updatedCsp).toContain("https://custom.example.com");
    });

    it("should update permissions policy based on geolocation setting", () => {
      configManager.updateGoogleMapsConfig({ enableGeolocation: false });
      const headers = configManager.getHeaders();

      expect(headers["Permissions-Policy"]).toContain("geolocation=()");
    });
  });

  describe("validateConfiguration", () => {
    it("should validate correct configuration", () => {
      const result = configManager.validateConfiguration();

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should detect missing self in default-src", () => {
      const config = configManager.getConfig();
      config.csp["default-src"] = ["https://example.com"]; // Missing 'self'

      const modifiedManager = new SecurityConfigManager("development");
      (modifiedManager as any).config = config;

      const result = modifiedManager.validateConfiguration();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("default-src must include 'self'");
    });

    it("should detect HTTP domains in production", () => {
      const prodManager = new SecurityConfigManager("production");
      prodManager.updateGoogleMapsConfig({
        allowedDomains: ["http://insecure.example.com"],
      });

      const result = prodManager.validateConfiguration();

      expect(result.isValid).toBe(false);
      expect(
        result.errors.some((error) =>
          error.includes("HTTP domains not allowed")
        )
      ).toBe(true);
    });

    it("should validate monitoring configuration", () => {
      const config = configManager.getConfig();
      config.monitoring.maxIncidents = 0;

      const modifiedManager = new SecurityConfigManager("development");
      (modifiedManager as any).config = config;

      const result = modifiedManager.validateConfiguration();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("maxIncidents must be at least 1");
    });
  });
});

describe("SecurityUtils", () => {
  describe("createCspString", () => {
    it("should create valid CSP string from directives", () => {
      const directives = {
        "default-src": ["'self'"],
        "script-src": ["'self'", "'unsafe-inline'"],
        "img-src": ["'self'", "data:", "https:"],
      };

      const cspString = SecurityUtils.createCspString(directives as any);

      expect(cspString).toBe(
        "default-src 'self'; script-src 'self' 'unsafe-inline'; img-src 'self' data: https:"
      );
    });

    it("should handle empty directives", () => {
      const cspString = SecurityUtils.createCspString({} as any);
      expect(cspString).toBe("");
    });
  });

  describe("isGoogleMapsDomainAllowed", () => {
    const config = DEFAULT_GOOGLE_MAPS_CONFIG;

    it("should allow exact domain matches", () => {
      const result = SecurityUtils.isGoogleMapsDomainAllowed(
        "maps.googleapis.com",
        config
      );
      expect(result).toBe(true);
    });

    it("should allow wildcard subdomain matches", () => {
      const result = SecurityUtils.isGoogleMapsDomainAllowed(
        "api.googleapis.com",
        config
      );
      expect(result).toBe(true);
    });

    it("should reject non-matching domains", () => {
      const result = SecurityUtils.isGoogleMapsDomainAllowed(
        "malicious.example.com",
        config
      );
      expect(result).toBe(false);
    });

    it("should handle wildcard patterns correctly", () => {
      const customConfig = {
        ...config,
        allowedDomains: ["*.example.com", "specific.com"],
      };

      expect(
        SecurityUtils.isGoogleMapsDomainAllowed("sub.example.com", customConfig)
      ).toBe(true);
      expect(
        SecurityUtils.isGoogleMapsDomainAllowed(
          "deep.sub.example.com",
          customConfig
        )
      ).toBe(true);
      expect(
        SecurityUtils.isGoogleMapsDomainAllowed("specific.com", customConfig)
      ).toBe(true);
      expect(
        SecurityUtils.isGoogleMapsDomainAllowed("notexample.com", customConfig)
      ).toBe(false);
    });
  });

  describe("sanitizeDomain", () => {
    it("should remove protocols from domains", () => {
      expect(SecurityUtils.sanitizeDomain("https://example.com")).toBe(
        "example.com"
      );
      expect(SecurityUtils.sanitizeDomain("http://example.com")).toBe(
        "example.com"
      );
    });

    it("should preserve wildcard domains", () => {
      expect(SecurityUtils.sanitizeDomain("*.example.com")).toBe(
        "*.example.com"
      );
    });

    it("should handle domains without protocols", () => {
      expect(SecurityUtils.sanitizeDomain("example.com")).toBe("example.com");
    });

    it("should throw error for invalid domain formats", () => {
      expect(() => SecurityUtils.sanitizeDomain("invalid@domain")).toThrow(
        "Invalid domain format"
      );
      expect(() => SecurityUtils.sanitizeDomain("domain with spaces")).toThrow(
        "Invalid domain format"
      );
    });

    it("should handle subdomains and ports", () => {
      expect(SecurityUtils.sanitizeDomain("sub.example.com")).toBe(
        "sub.example.com"
      );
      expect(SecurityUtils.sanitizeDomain("example-site.com")).toBe(
        "example-site.com"
      );
    });
  });
});

describe("Constants", () => {
  describe("DEFAULT_GOOGLE_MAPS_CONFIG", () => {
    it("should include required Google Maps domains", () => {
      const requiredDomains = [
        "maps.googleapis.com",
        "maps.gstatic.com",
        "*.googleapis.com",
        "*.gstatic.com",
      ];

      requiredDomains.forEach((domain) => {
        expect(DEFAULT_GOOGLE_MAPS_CONFIG.allowedDomains).toContain(domain);
      });
    });

    it("should have sensible defaults", () => {
      expect(DEFAULT_GOOGLE_MAPS_CONFIG.enableGeolocation).toBe(true);
      expect(DEFAULT_GOOGLE_MAPS_CONFIG.restrictToHttps).toBe(true);
      expect(DEFAULT_GOOGLE_MAPS_CONFIG.allowedScripts).toContain(
        "https://maps.googleapis.com"
      );
    });
  });

  describe("BASE_CSP_DIRECTIVES", () => {
    it("should include self in default-src", () => {
      expect(BASE_CSP_DIRECTIVES["default-src"]).toContain("'self'");
    });

    it("should include Google Maps domains in appropriate directives", () => {
      expect(BASE_CSP_DIRECTIVES["script-src"]).toContain(
        "https://maps.googleapis.com"
      );
      expect(BASE_CSP_DIRECTIVES["frame-src"]).toContain(
        "https://*.google.com"
      );
      expect(BASE_CSP_DIRECTIVES["img-src"]).toContain(
        "https://*.googleapis.com"
      );
    });

    it("should have secure default for object-src", () => {
      expect(BASE_CSP_DIRECTIVES["object-src"]).toEqual(["'none'"]);
    });

    it("should allow necessary sources for web fonts", () => {
      expect(BASE_CSP_DIRECTIVES["font-src"]).toContain(
        "https://fonts.gstatic.com"
      );
    });
  });
});
