import { describe, it, expect } from 'vitest';
import { SecurityValidator } from './SecurityValidator';

describe('SecurityValidator', () => {
  describe('validateContactFormField', () => {
    it('should validate empty fields', () => {
      const result = SecurityValidator.validateContactFormField('name', '');
      expect(result.isValid).toBe(false);
      expect(result.risks[0].type).toBe('EMPTY_FIELD');
    });

    it('should detect medical terms', () => {
      const medicalTerms = [
        'I need a diagnosis',
        'Can you prescribe medication?',
        'cure my disease',
        'treat my illness',
        'I have a medical condition'
      ];

      medicalTerms.forEach(term => {
        const result = SecurityValidator.validateContactFormField('message', term);
        expect(result.isValid).toBe(false);
        expect(result.risks.some(r => r.type === 'MEDICAL_TERMS')).toBe(true);
        expect(result.riskLevel).toBe('HIGH');
      });
    });

    it('should detect SQL injection attempts', () => {
      const sqlInjections = [
        "'; DROP TABLE users; --",
        "1' OR '1'='1",
        'SELECT * FROM users',
        'INSERT INTO table',
        'UPDATE users SET',
        'DELETE FROM records',
        'UNION SELECT * FROM'
      ];

      sqlInjections.forEach(injection => {
        const result = SecurityValidator.validateContactFormField('message', injection);
        expect(result.isValid).toBe(false);
        expect(result.risks.some(r => r.type === 'SQL_INJECTION')).toBe(true);
        expect(result.riskLevel).toBe('HIGH');
      });
    });

    it('should detect XSS attempts', () => {
      const xssAttempts = [
        '<script>alert("XSS")</script>',
        '<img src=x onerror=alert(1)>',
        'javascript:alert(document.cookie)',
        '<div onmouseover="alert(1)">',
        'eval(atob("YWxlcnQoMSk="))',
        '<iframe src="javascript:alert(1)">'
      ];

      xssAttempts.forEach(xss => {
        const result = SecurityValidator.validateContactFormField('message', xss);
        expect(result.isValid).toBe(false);
        expect(result.risks.some(r => r.type === 'XSS_ATTEMPT')).toBe(true);
        expect(result.riskLevel).toBe('HIGH');
      });
    });

    it('should detect excessive length', () => {
      const longText = 'a'.repeat(1001);
      const result = SecurityValidator.validateContactFormField('message', longText);
      expect(result.risks.some(r => r.type === 'EXCESSIVE_LENGTH')).toBe(true);
    });

    it('should detect spam patterns', () => {
      const spamPatterns = [
        'aaaaaaaaa',
        '!!!!!!!!',
        '$$$$$$$$',
        '.........'
      ];

      spamPatterns.forEach(spam => {
        const result = SecurityValidator.validateContactFormField('message', spam);
        expect(result.risks.some(r => r.type === 'SPAM_PATTERN')).toBe(true);
      });
    });

    it('should properly sanitize input', () => {
      const input = '<script>alert("test")</script>Hello javascript:void(0) onclick=test()';
      const result = SecurityValidator.validateContactFormField('message', input);
      expect(result.sanitizedValue).not.toContain('<');
      expect(result.sanitizedValue).not.toContain('>');
      expect(result.sanitizedValue).not.toContain('javascript:');
      expect(result.sanitizedValue).not.toContain('onclick=');
    });

    it('should allow valid wellness-related content', () => {
      const validMessages = [
        'I would like to book a Reiki session',
        'Can you help me with stress relief?',
        'I am interested in sound therapy',
        'What are your hours for energy healing?',
        'I want to improve my wellness and balance'
      ];

      validMessages.forEach(message => {
        const result = SecurityValidator.validateContactFormField('message', message);
        expect(result.isValid).toBe(true);
        expect(result.riskLevel).toBe('NONE');
      });
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email formats', () => {
      const validEmails = [
        'user@example.com',
        'test.user@domain.co.uk',
        'name+tag@gmail.com',
        'user123@test-domain.com'
      ];

      validEmails.forEach(email => {
        const result = SecurityValidator.validateEmail(email);
        expect(result.isValid).toBe(true);
      });
    });

    it('should reject invalid email formats', () => {
      const invalidEmails = [
        'notanemail',
        '@example.com',
        'user@',
        'user@.com',
        'user..name@example.com',
        'user@domain'
      ];

      invalidEmails.forEach(email => {
        const result = SecurityValidator.validateEmail(email);
        expect(result.isValid).toBe(false);
      });
      
      // Empty email is a special case - it gets caught as EMPTY_FIELD first
      const emptyResult = SecurityValidator.validateEmail('');
      expect(emptyResult.isValid).toBe(false);
      expect(emptyResult.risks[0].type).toBe('EMPTY_FIELD');
    });

    it('should detect email injection attempts', () => {
      const injections = [
        'test@example.com\r\nBCC: attacker@evil.com',
        'test@example.com%0aBCC:attacker@evil.com',
        'test@example.com\nSubject: Spam'
      ];

      injections.forEach(injection => {
        const result = SecurityValidator.validateEmail(injection);
        expect(result.isValid).toBe(false);
        expect(result.risks.some(r => r.type === 'EMAIL_INJECTION')).toBe(true);
      });
    });

    it('should warn about disposable emails', () => {
      const disposableEmails = [
        'user@tempmail.com',
        'test@guerrillamail.com',
        'name@10minutemail.com'
      ];

      disposableEmails.forEach(email => {
        const result = SecurityValidator.validateEmail(email);
        expect(result.risks.some(r => r.type === 'DISPOSABLE_EMAIL')).toBe(true);
      });
    });
  });

  describe('validatePhone', () => {
    it('should validate correct phone formats', () => {
      const validPhones = [
        '1234567890',
        '+11234567890',
        '123-456-7890',
        '(123) 456-7890',
        '+1 (123) 456-7890',
        '123.456.7890'
      ];

      validPhones.forEach(phone => {
        const result = SecurityValidator.validatePhone(phone);
        expect(result.isValid).toBe(true);
      });
    });

    it('should reject invalid phone formats', () => {
      const invalidPhones = [
        '123',
        '12345678901234567', // too long
        'abc-def-ghij',
        '123-45a-7890'
      ];

      invalidPhones.forEach(phone => {
        const result = SecurityValidator.validatePhone(phone);
        expect(result.isValid).toBe(false);
      });
      
      // Empty phone is a special case - it gets caught as EMPTY_FIELD first
      const emptyResult = SecurityValidator.validatePhone('');
      expect(emptyResult.isValid).toBe(false);
      expect(emptyResult.risks[0].type).toBe('EMPTY_FIELD');
    });

    it('should sanitize phone numbers', () => {
      const result = SecurityValidator.validatePhone('(123) 456-7890');
      expect(result.sanitizedValue).toBe('1234567890');
    });
  });

  describe('isHighRisk', () => {
    it('should identify high-risk form submissions', () => {
      const highRiskData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Can you cure my disease?'
      };

      expect(SecurityValidator.isHighRisk(highRiskData)).toBe(true);
    });

    it('should pass low-risk form submissions', () => {
      const lowRiskData = {
        name: 'Jane Smith',
        email: 'jane@example.com',
        message: 'I would like to book a Reiki session for stress relief.'
      };

      expect(SecurityValidator.isHighRisk(lowRiskData)).toBe(false);
    });
  });
});