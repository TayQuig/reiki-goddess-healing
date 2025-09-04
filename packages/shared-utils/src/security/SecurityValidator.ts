/**
 * Security-First Form Validation
 * Multi-layered validation with wellness industry-specific patterns
 */

export interface Risk {
  level: 'HIGH' | 'MEDIUM' | 'LOW';
  type: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  risks: Risk[];
  sanitizedValue: string;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';
}

export class SecurityValidator {
  // Industry-specific forbidden terms to avoid liability
  private static readonly forbiddenHealthTerms = /\b(diagnosis|prescription|medication|cure|treat|medical|doctor|physician|disease|illness|condition)\b/i;
  
  // Common SQL injection patterns
  private static readonly sqlInjectionPattern = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|CREATE|ALTER|EXEC|EXECUTE)\b|--|\/\*|\*\/|;|'|"|`|xp_|sp_)/i;
  
  // XSS attack patterns
  private static readonly xssPattern = /<[^>]*>|javascript:|on\w+\s*=|eval\(|expression\(|vbscript:|data:text\/html/i;
  
  // Email injection patterns
  private static readonly emailInjectionPattern = /(\r|\n|%0a|%0d|bcc:|cc:|to:|from:|subject:|reply-to:|content-type:|mime-version:)/i;
  
  /**
   * Validates a contact form field with multi-level risk assessment
   */
  static validateContactFormField(
    fieldName: string, 
    value: string
  ): ValidationResult {
    const risks: Risk[] = [];
    
    // Check for empty values first
    if (!value || value.trim().length === 0) {
      return {
        isValid: false,
        risks: [{
          level: 'MEDIUM',
          type: 'EMPTY_FIELD',
          message: 'This field is required'
        }],
        sanitizedValue: '',
        riskLevel: 'MEDIUM'
      };
    }
    
    // Check for medical terms (liability risk)
    if (this.forbiddenHealthTerms.test(value)) {
      risks.push({
        level: 'HIGH',
        type: 'MEDICAL_TERMS',
        message: 'Please avoid medical terminology. We provide wellness services, not medical treatment.'
      });
    }
    
    // Check for SQL injection patterns
    if (this.sqlInjectionPattern.test(value)) {
      risks.push({
        level: 'HIGH',
        type: 'SQL_INJECTION',
        message: 'Invalid characters detected. Please use only standard text.'
      });
    }
    
    // Check for XSS patterns
    if (this.xssPattern.test(value)) {
      risks.push({
        level: 'HIGH',
        type: 'XSS_ATTEMPT',
        message: 'Invalid formatting detected. Please use plain text only.'
      });
    }
    
    // Field-specific validation
    if (fieldName.toLowerCase().includes('email')) {
      if (this.emailInjectionPattern.test(value)) {
        risks.push({
          level: 'HIGH',
          type: 'EMAIL_INJECTION',
          message: 'Invalid email format detected.'
        });
      }
    }
    
    // Check for excessive length (potential buffer overflow)
    if (value.length > 1000) {
      risks.push({
        level: 'MEDIUM',
        type: 'EXCESSIVE_LENGTH',
        message: 'Please keep your message under 1000 characters.'
      });
    }
    
    // Check for repeated characters (spam indicator)
    if (/(.)\1{5,}/.test(value)) {
      risks.push({
        level: 'MEDIUM',
        type: 'SPAM_PATTERN',
        message: 'Please avoid excessive repetition.'
      });
    }
    
    // Sanitize the input
    const sanitized = this.sanitizeInput(value);
    
    return {
      isValid: risks.filter(r => r.level === 'HIGH').length === 0,
      risks,
      sanitizedValue: sanitized,
      riskLevel: this.calculateOverallRisk(risks)
    };
  }
  
  /**
   * Validates email addresses with additional security checks
   */
  static validateEmail(email: string): ValidationResult {
    const basicValidation = this.validateContactFormField('email', email);
    
    // Trim whitespace
    const trimmedEmail = email.trim();
    
    // More strict email regex that handles edge cases
    // This regex ensures:
    // - Has content before @
    // - Has @ symbol
    // - Has content after @
    // - Has at least one dot after @
    // - No consecutive dots
    // - Valid characters only (including +)
    const emailRegex = /^[a-zA-Z0-9]+([._+-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.-]?[a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/;
    
    if (!emailRegex.test(trimmedEmail)) {
      basicValidation.risks.push({
        level: 'HIGH',
        type: 'INVALID_EMAIL',
        message: 'Please enter a valid email address.'
      });
    }
    
    // Additional checks for edge cases
    if (trimmedEmail.includes('..')) {
      basicValidation.risks.push({
        level: 'HIGH',
        type: 'INVALID_EMAIL',
        message: 'Email cannot contain consecutive dots.'
      });
    }
    
    // Check for invalid formats like "test@" or "@example.com"
    if (!trimmedEmail.includes('@') || 
        trimmedEmail.startsWith('@') || 
        trimmedEmail.endsWith('@') ||
        trimmedEmail.split('@').length !== 2) {
      basicValidation.risks.push({
        level: 'HIGH',
        type: 'INVALID_EMAIL',
        message: 'Please enter a valid email address.'
      });
    }
    
    // Check for disposable email domains
    const disposableDomains = ['tempmail', 'throwaway', 'guerrilla', '10minute', 'mailinator'];
    const domain = trimmedEmail.split('@')[1]?.toLowerCase() || '';
    
    if (disposableDomains.some(d => domain.includes(d))) {
      basicValidation.risks.push({
        level: 'MEDIUM',
        type: 'DISPOSABLE_EMAIL',
        message: 'Please use a permanent email address.'
      });
    }
    
    // Recalculate isValid based on all risks
    const isValid = basicValidation.risks.filter(r => r.level === 'HIGH').length === 0;
    
    return {
      ...basicValidation,
      isValid,
      sanitizedValue: trimmedEmail,
      riskLevel: this.calculateOverallRisk(basicValidation.risks)
    };
  }
  
  /**
   * Validates phone numbers with security checks
   */
  static validatePhone(phone: string): ValidationResult {
    const basicValidation = this.validateContactFormField('phone', phone);
    
    // Remove whitespace and common separators for validation
    const cleaned = phone.replace(/[\s\-(.)]/g, '');
    
    // Check for minimum length (at least 7 digits for most valid phone numbers)
    if (cleaned.length < 7) {
      basicValidation.risks.push({
        level: 'HIGH',
        type: 'INVALID_PHONE_LENGTH',
        message: 'Phone number is too short.'
      });
    }
    
    // Check for maximum length (no more than 15 digits per ITU-T recommendation)
    if (cleaned.length > 15) {
      basicValidation.risks.push({
        level: 'HIGH',
        type: 'INVALID_PHONE_LENGTH',
        message: 'Phone number is too long.'
      });
    }
    
    // Phone regex that allows:
    // - Optional + at the start
    // - Only digits after that
    // - No letters or special characters
    const phoneRegex = /^\+?[0-9]+$/;
    
    if (!phoneRegex.test(cleaned)) {
      basicValidation.risks.push({
        level: 'HIGH',
        type: 'INVALID_PHONE_FORMAT',
        message: 'Phone number can only contain digits and an optional leading +.'
      });
    }
    
    // Check for multiple + signs
    const plusCount = (cleaned.match(/\+/g) || []).length;
    if (plusCount > 1) {
      basicValidation.risks.push({
        level: 'HIGH',
        type: 'INVALID_PHONE_FORMAT',
        message: 'Phone number can only have one + sign at the beginning.'
      });
    }
    
    // Check that + is only at the beginning if present
    if (cleaned.includes('+') && !cleaned.startsWith('+')) {
      basicValidation.risks.push({
        level: 'HIGH',
        type: 'INVALID_PHONE_FORMAT',
        message: 'Phone number can only have + at the beginning.'
      });
    }
    
    // Recalculate isValid based on all risks
    const isValid = basicValidation.risks.filter(r => r.level === 'HIGH').length === 0;
    
    return {
      ...basicValidation,
      isValid,
      sanitizedValue: cleaned,
      riskLevel: this.calculateOverallRisk(basicValidation.risks)
    };
  }
  
  /**
   * Sanitizes input to prevent XSS and other attacks
   */
  private static sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .replace(/style\s*=/gi, '') // Remove style attributes
      .replace(/script/gi, '') // Remove script tags
      .trim()
      .slice(0, 1000); // Limit length
  }
  
  /**
   * Calculates the overall risk level from all risks
   */
  private static calculateOverallRisk(risks: Risk[]): 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE' {
    if (risks.length === 0) return 'NONE';
    
    const hasHigh = risks.some(r => r.level === 'HIGH');
    const hasMedium = risks.some(r => r.level === 'MEDIUM');
    
    if (hasHigh) return 'HIGH';
    if (hasMedium) return 'MEDIUM';
    return 'LOW';
  }
  
  /**
   * Checks if a form submission contains any high-risk content
   */
  static isHighRisk(formData: Record<string, string>): boolean {
    for (const [field, value] of Object.entries(formData)) {
      const result = this.validateContactFormField(field, value);
      if (result.riskLevel === 'HIGH') {
        return true;
      }
    }
    return false;
  }
}