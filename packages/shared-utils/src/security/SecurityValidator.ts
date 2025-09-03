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
    
    // Additional email-specific validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!emailRegex.test(email)) {
      basicValidation.risks.push({
        level: 'HIGH',
        type: 'INVALID_EMAIL',
        message: 'Please enter a valid email address.'
      });
    }
    
    // Check for disposable email domains
    const disposableDomains = ['tempmail', 'throwaway', 'guerrilla', '10minute', 'mailinator'];
    const domain = email.split('@')[1]?.toLowerCase() || '';
    
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
      riskLevel: this.calculateOverallRisk(basicValidation.risks)
    };
  }
  
  /**
   * Validates phone numbers with security checks
   */
  static validatePhone(phone: string): ValidationResult {
    const basicValidation = this.validateContactFormField('phone', phone);
    
    // Remove common formatting characters for validation
    const cleaned = phone.replace(/[\s\-\(\)\.]/g, '');
    
    // Check if it's a valid phone number length
    if (cleaned.length < 10 || cleaned.length > 15) {
      basicValidation.risks.push({
        level: 'MEDIUM',
        type: 'INVALID_PHONE_LENGTH',
        message: 'Please enter a valid phone number.'
      });
    }
    
    // Check if it contains only numbers and valid prefixes
    if (!/^\+?\d+$/.test(cleaned)) {
      basicValidation.risks.push({
        level: 'HIGH',
        type: 'INVALID_PHONE_FORMAT',
        message: 'Phone number should contain only numbers.'
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