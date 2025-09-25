/**
 * Security Configuration for The Reiki Goddess Healing
 * Type-safe configuration interface for security settings
 */

export interface CSPDirectives {
  "default-src": string[];
  "script-src": string[];
  "style-src": string[];
  "font-src": string[];
  "img-src": string[];
  "connect-src": string[];
  "frame-src": string[];
  "child-src": string[];
  "worker-src": string[];
  "object-src": string[];
  "media-src": string[];
  "manifest-src": string[];
  "base-uri": string[];
  "form-action": string[];
}

export interface SecurityHeaders {
  "Content-Security-Policy": string;
  "X-Content-Type-Options": string;
  "X-Frame-Options": string;
  "X-XSS-Protection": string;
  "Referrer-Policy": string;
  "Permissions-Policy": string;
  "Strict-Transport-Security"?: string;
}

export interface GoogleMapsSecurityConfig {
  allowedDomains: string[];
  allowedScripts: string[];
  allowedStyles: string[];
  allowedImages: string[];
  allowedConnections: string[];
  allowedFrames: string[];
  enableGeolocation: boolean;
  restrictToHttps: boolean;
}

export interface SecurityConfig {
  environment: "development" | "staging" | "production";
  csp: CSPDirectives;
  headers: SecurityHeaders;
  googleMaps: GoogleMapsSecurityConfig;
  monitoring: {
    enabled: boolean;
    logLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    reportingEndpoint?: string;
    maxIncidents: number;
  };
  rateLimit: {
    enabled: boolean;
    maxRequests: number;
    timeWindowMs: number;
  };
}

/**
 * Default security configuration for Google Maps integration
 */
export const DEFAULT_GOOGLE_MAPS_CONFIG: GoogleMapsSecurityConfig = {
  allowedDomains: [
    "maps.googleapis.com",
    "maps.gstatic.com",
    "*.googleapis.com",
    "*.gstatic.com",
    "*.google.com",
    "*.googleusercontent.com",
  ],
  allowedScripts: ["https://maps.googleapis.com", "https://maps.gstatic.com"],
  allowedStyles: [
    "https://fonts.googleapis.com",
    "https://maps.googleapis.com",
  ],
  allowedImages: [
    "https://*.googleapis.com",
    "https://*.gstatic.com",
    "https://*.google.com",
    "https://*.googleusercontent.com",
  ],
  allowedConnections: [
    "https://*.googleapis.com",
    "https://*.google.com",
    "https://*.gstatic.com",
  ],
  allowedFrames: ["https://*.google.com"],
  enableGeolocation: true,
  restrictToHttps: true,
};

/**
 * Base CSP configuration that supports Google Maps
 */
export const BASE_CSP_DIRECTIVES: CSPDirectives = {
  "default-src": ["'self'"],
  "script-src": [
    "'self'",
    "'unsafe-inline'",
    ...DEFAULT_GOOGLE_MAPS_CONFIG.allowedScripts,
  ],
  "style-src": [
    "'self'",
    "'unsafe-inline'",
    ...DEFAULT_GOOGLE_MAPS_CONFIG.allowedStyles,
  ],
  "font-src": ["'self'", "https://fonts.gstatic.com"],
  "img-src": [
    "'self'",
    "data:",
    "blob:",
    "https:",
    ...DEFAULT_GOOGLE_MAPS_CONFIG.allowedImages,
  ],
  "connect-src": ["'self'", ...DEFAULT_GOOGLE_MAPS_CONFIG.allowedConnections],
  "frame-src": ["'self'", ...DEFAULT_GOOGLE_MAPS_CONFIG.allowedFrames],
  "child-src": ["'self'", ...DEFAULT_GOOGLE_MAPS_CONFIG.allowedFrames],
  "worker-src": ["'self'", "blob:"],
  "object-src": ["'none'"],
  "media-src": ["'self'"],
  "manifest-src": ["'self'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
};

/**
 * Environment-specific security configurations
 */
export class SecurityConfigManager {
  private config: SecurityConfig;

  constructor(
    environment: "development" | "staging" | "production" = "production"
  ) {
    this.config = this.createConfig(environment);
  }

  getConfig(): SecurityConfig {
    return { ...this.config };
  }

  getCspString(): string {
    return Object.entries(this.config.csp)
      .map(([directive, sources]) => `${directive} ${sources.join(" ")}`)
      .join("; ");
  }

  getHeaders(): SecurityHeaders {
    return {
      ...this.config.headers,
      "Content-Security-Policy": this.getCspString(),
    };
  }

  updateGoogleMapsConfig(config: Partial<GoogleMapsSecurityConfig>): void {
    this.config.googleMaps = { ...this.config.googleMaps, ...config };
    this.updateCspForMaps();
  }

  validateConfiguration(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate CSP directives
    if (!this.config.csp["default-src"].includes("'self'")) {
      errors.push("default-src must include 'self'");
    }

    // Validate Google Maps domains
    if (this.config.googleMaps.restrictToHttps) {
      const httpDomains = this.config.googleMaps.allowedDomains.filter(
        (domain) => domain.startsWith("http:")
      );
      if (httpDomains.length > 0) {
        errors.push(
          `HTTP domains not allowed in production: ${httpDomains.join(", ")}`
        );
      }
    }

    // Validate monitoring config
    if (
      this.config.monitoring.enabled &&
      this.config.monitoring.maxIncidents < 1
    ) {
      errors.push("maxIncidents must be at least 1");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  private createConfig(
    environment: "development" | "staging" | "production"
  ): SecurityConfig {
    const baseConfig: SecurityConfig = {
      environment,
      csp: { ...BASE_CSP_DIRECTIVES },
      headers: {
        "Content-Security-Policy": "",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "SAMEORIGIN",
        "X-XSS-Protection": "1; mode=block",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Permissions-Policy": "camera=(), microphone=(), geolocation=self",
      },
      googleMaps: { ...DEFAULT_GOOGLE_MAPS_CONFIG },
      monitoring: {
        enabled: true,
        logLevel: environment === "production" ? "HIGH" : "MEDIUM",
        maxIncidents: 10,
      },
      rateLimit: {
        enabled: true,
        maxRequests: environment === "development" ? 10 : 5,
        timeWindowMs: 60 * 60 * 1000, // 1 hour
      },
    };

    // Environment-specific adjustments
    if (environment === "development") {
      baseConfig.googleMaps.restrictToHttps = false;
      baseConfig.headers["X-Frame-Options"] = "SAMEORIGIN";

      // Allow localhost for development
      baseConfig.csp["connect-src"].push(
        "http://localhost:*",
        "ws://localhost:*"
      );
    }

    if (environment === "production") {
      baseConfig.headers["Strict-Transport-Security"] =
        "max-age=31536000; includeSubDomains";
      baseConfig.headers["X-Frame-Options"] = "SAMEORIGIN";
      baseConfig.monitoring.reportingEndpoint = "/api/security/incidents";
    }

    return baseConfig;
  }

  private updateCspForMaps(): void {
    const { googleMaps } = this.config;

    // Update CSP with Google Maps config
    this.config.csp["script-src"] = [
      "'self'",
      "'unsafe-inline'",
      ...googleMaps.allowedScripts,
    ];

    this.config.csp["style-src"] = [
      "'self'",
      "'unsafe-inline'",
      ...googleMaps.allowedStyles,
    ];

    this.config.csp["img-src"] = [
      "'self'",
      "data:",
      "blob:",
      "https:",
      ...googleMaps.allowedImages,
    ];

    this.config.csp["connect-src"] = [
      "'self'",
      ...googleMaps.allowedConnections,
    ];

    this.config.csp["frame-src"] = ["'self'", ...googleMaps.allowedFrames];

    this.config.csp["child-src"] = ["'self'", ...googleMaps.allowedFrames];

    // Update permissions policy for geolocation
    if (googleMaps.enableGeolocation) {
      this.config.headers["Permissions-Policy"] =
        "camera=(), microphone=(), geolocation=self";
    } else {
      this.config.headers["Permissions-Policy"] =
        "camera=(), microphone=(), geolocation=()";
    }
  }
}

/**
 * Utility functions for security configuration
 */
export const SecurityUtils = {
  /**
   * Creates a CSP string from directives
   */
  createCspString(directives: CSPDirectives): string {
    return Object.entries(directives)
      .map(([directive, sources]) => `${directive} ${sources.join(" ")}`)
      .join("; ");
  },

  /**
   * Validates if a domain is allowed for Google Maps
   */
  isGoogleMapsDomainAllowed(
    domain: string,
    config: GoogleMapsSecurityConfig
  ): boolean {
    return config.allowedDomains.some((allowed) => {
      if (allowed.startsWith("*.")) {
        const baseDomain = allowed.substring(2);
        return domain === baseDomain || domain.endsWith("." + baseDomain);
      }
      return domain === allowed;
    });
  },

  /**
   * Sanitizes a domain for CSP usage
   */
  sanitizeDomain(domain: string): string {
    // Remove protocol if present
    const withoutProtocol = domain.replace(/^https?:\/\//, "");

    // Validate domain format
    if (!/^[a-zA-Z0-9.-]+$/.test(withoutProtocol.replace(/\*\./g, ""))) {
      throw new Error(`Invalid domain format: ${domain}`);
    }

    return withoutProtocol;
  },
};
