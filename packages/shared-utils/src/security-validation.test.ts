import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SecurityValidator, FormRateLimit, VALIDATION_PATTERNS } from './security-validation';

describe('SecurityValidator', () => {
  describe('validateContactFormField', () => {
    it('should validate required fields', () => {
      const result = SecurityValidator.validateContactFormField('firstName', '', 'name');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('firstName is required');
      expect(result.riskLevel).toBe('LOW');
    });

    it('should validate name fields with valid input', () => {
      const result = SecurityValidator.validateContactFormField('firstName', 'John', 'name');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.sanitizedValue).toBe('John');
      expect(result.riskLevel).toBe('LOW');
    });

    it('should reject names that are too long', () => {
      const longName = 'A'.repeat(51);
      const result = SecurityValidator.validateContactFormField('firstName', longName, 'name');
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('exceeds maximum length');
      expect(result.riskLevel).toBe('MEDIUM');
    });

    it('should validate email format', () => {
      const validEmail = 'test@example.com';
      const result = SecurityValidator.validateContactFormField('email', validEmail, 'email');
      expect(result.isValid).toBe(true);
      expect(result.sanitizedValue).toBe('test@example.com');
      
      const invalidEmail = 'invalid-email';
      const result2 = SecurityValidator.validateContactFormField('email', invalidEmail, 'email');
      expect(result2.isValid).toBe(false);
      expect(result2.errors[0]).toContain('invalid characters or format');
    });

    it('should detect XSS patterns in input', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const maliciousInput = '<script>alert("xss")</script>';
      const result = SecurityValidator.validateContactFormField('message', maliciousInput, 'message');
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('potentially malicious content'))).toBe(true);
      expect(result.riskLevel).toBe('HIGH');
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Security Incident: XSS_ATTEMPT'),
        expect.any(Object)
      );
      
      consoleSpy.mockRestore();
    });

    it('should detect health information in messages', () => {
      const healthMessage = 'I need help with my medical condition and prescription medication';
      const result = SecurityValidator.validateContactFormField('message', healthMessage, 'message');
      
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('Please contact us directly for health-related inquiries');
      expect(result.riskLevel).toBe('MEDIUM');
    });

    it('should sanitize phone numbers', () => {
      const phoneWithExtraChars = '(555) 123-4567 ext. 123';
      const result = SecurityValidator.validateContactFormField('phone', phoneWithExtraChars, 'phone');
      
      expect(result.sanitizedValue).toBe('(555) 123-4567  123');
      // Should remove 'ext.' but keep numbers and basic formatting
    });

    it('should sanitize HTML from messages', () => {
      const messageWithHtml = 'Hello <b>world</b> <script>alert("test")</script>';
      const result = SecurityValidator.validateContactFormField('message', messageWithHtml, 'message');
      
      expect(result.sanitizedValue).toBe('Hello world alert("test")');
      // HTML tags should be stripped
    });
  });

  describe('sanitizeInput', () => {
    it('should sanitize email to lowercase', () => {
      const result = SecurityValidator.sanitizeInput('TEST@EXAMPLE.COM', 'email');
      expect(result).toBe('test@example.com');
    });

    it('should remove HTML from names', () => {
      const result = SecurityValidator.sanitizeInput('John<script>alert(1)</script>Doe', 'name');
      expect(result).toBe('Johnscriptalert(1)/scriptDoe');
    });

    it('should sanitize phone numbers', () => {
      const result = SecurityValidator.sanitizeInput('555-123-4567!@#', 'phone');
      expect(result).toBe('555-123-4567');
    });

    it('should strip HTML tags from messages', () => {
      const result = SecurityValidator.sanitizeInput('<p>Hello <strong>world</strong></p>', 'message');
      expect(result).toBe('Hello world');
    });
  });
});

describe('FormRateLimit', () => {
  beforeEach(() => {
    // Mock localStorage for testing
    const mockStorage: Record<string, string> = {};
    
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn((key: string) => mockStorage[key] || null),
        setItem: vi.fn((key: string, value: string) => { mockStorage[key] = value; }),
        removeItem: vi.fn((key: string) => { delete mockStorage[key]; }),
        clear: vi.fn(() => { Object.keys(mockStorage).forEach(key => delete mockStorage[key]); })
      },
      writable: true
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should allow submission when no previous submissions', () => {
    const result = FormRateLimit.canSubmit();
    expect(result.allowed).toBe(true);
    expect(result.timeUntilReset).toBeUndefined();
  });

  it('should record submission timestamp', () => {
    FormRateLimit.recordSubmission();
    const stored = localStorage.getItem('contact_form_submissions');
    expect(stored).toBeTruthy();
    
    const submissions = JSON.parse(stored!);
    expect(Array.isArray(submissions)).toBe(true);
    expect(submissions).toHaveLength(1);
    expect(typeof submissions[0]).toBe('number');
  });

  it('should allow submissions under rate limit', () => {
    // Record 2 submissions (under the limit of 3)
    FormRateLimit.recordSubmission();
    FormRateLimit.recordSubmission();
    
    const result = FormRateLimit.canSubmit();
    expect(result.allowed).toBe(true);
  });

  it('should block submissions over rate limit', () => {
    // Record 3 submissions (at the limit)
    FormRateLimit.recordSubmission();
    FormRateLimit.recordSubmission();
    FormRateLimit.recordSubmission();
    
    const result = FormRateLimit.canSubmit();
    expect(result.allowed).toBe(false);
    expect(result.timeUntilReset).toBeGreaterThan(0);
  });

  it('should clean old submissions outside time window', () => {
    const oldTimestamp = Date.now() - (2 * 60 * 60 * 1000); // 2 hours ago
    const submissions = [oldTimestamp];
    localStorage.setItem('contact_form_submissions', JSON.stringify(submissions));
    
    const result = FormRateLimit.canSubmit();
    expect(result.allowed).toBe(true);
    
    // After recording a new submission, old one should be cleaned
    FormRateLimit.recordSubmission();
    const stored = localStorage.getItem('contact_form_submissions');
    const newSubmissions = JSON.parse(stored!);
    expect(newSubmissions).toHaveLength(1);
    expect(newSubmissions[0]).toBeGreaterThan(oldTimestamp);
  });
});

describe('VALIDATION_PATTERNS', () => {
  it('should have correct name pattern', () => {
    expect(VALIDATION_PATTERNS.name.test('John Doe')).toBe(true);
    expect(VALIDATION_PATTERNS.name.test("O'Brien")).toBe(true);
    expect(VALIDATION_PATTERNS.name.test('Jean-Claude')).toBe(true);
    expect(VALIDATION_PATTERNS.name.test('John123')).toBe(false);
    expect(VALIDATION_PATTERNS.name.test('<script>')).toBe(false);
  });

  it('should have correct email pattern', () => {
    expect(VALIDATION_PATTERNS.email.test('test@example.com')).toBe(true);
    expect(VALIDATION_PATTERNS.email.test('user+tag@domain.co.uk')).toBe(true);
    expect(VALIDATION_PATTERNS.email.test('invalid-email')).toBe(false);
    expect(VALIDATION_PATTERNS.email.test('@domain.com')).toBe(false);
  });

  it('should have correct phone pattern', () => {
    expect(VALIDATION_PATTERNS.phone.test('2552234567')).toBe(true);
    expect(VALIDATION_PATTERNS.phone.test('+12552234567')).toBe(true);
    expect(VALIDATION_PATTERNS.phone.test('12552234567')).toBe(true);
    expect(VALIDATION_PATTERNS.phone.test('1234567890')).toBe(false); // Invalid area code
    expect(VALIDATION_PATTERNS.phone.test('123456789')).toBe(false); // Too short
  });

  it('should detect forbidden health terms', () => {
    expect(VALIDATION_PATTERNS.forbiddenHealthTerms.test('I have a medical condition')).toBe(true);
    expect(VALIDATION_PATTERNS.forbiddenHealthTerms.test('Need help with prescription')).toBe(true);
    expect(VALIDATION_PATTERNS.forbiddenHealthTerms.test('My doctor said')).toBe(true);
    expect(VALIDATION_PATTERNS.forbiddenHealthTerms.test('I feel stressed and need relaxation')).toBe(false);
    expect(VALIDATION_PATTERNS.forbiddenHealthTerms.test('Looking for wellness services')).toBe(false);
  });
});