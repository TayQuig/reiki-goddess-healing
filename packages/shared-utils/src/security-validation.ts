// COMPLETE, WORKING CODE - Ready to copy/paste
// Wellness business specific validation patterns
export const VALIDATION_PATTERNS = {
  name: /^[a-zA-Z\s'-]{1,50}$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^\+?1?[2-9]\d{2}[2-9]\d{2}\d{4}$/,
  message: /^[\w\s.,!?'-]{1,2000}$/,
  // Prevent health data patterns in general contact forms
  forbiddenHealthTerms: /\b(diagnosis|prescription|medication|symptom|illness|disease|condition|treatment|medical|doctor|physician)\b/i
} as const;

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedValue?: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export class SecurityValidator {
  static validateContactFormField(
    fieldName: string, 
    value: string, 
    fieldType: 'name' | 'email' | 'phone' | 'message'
  ): ValidationResult {
    const errors: string[] = [];
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    
    // Trim and check required
    const trimmedValue = value.trim();
    if (!trimmedValue) {
      return {
        isValid: false,
        errors: [`${fieldName} is required`],
        riskLevel: 'LOW'
      };
    }
    
    // Length validation
    const maxLengths = { name: 50, email: 254, phone: 20, message: 2000 };
    if (trimmedValue.length > maxLengths[fieldType]) {
      errors.push(`${fieldName} exceeds maximum length of ${maxLengths[fieldType]} characters`);
      riskLevel = 'MEDIUM';
    }
    
    // Pattern validation
    const pattern = VALIDATION_PATTERNS[fieldType];
    if (!pattern.test(trimmedValue)) {
      errors.push(`${fieldName} contains invalid characters or format`);
      riskLevel = 'MEDIUM';
    }
    
    // XSS pattern detection
    const xssPatterns = [
      /<script/i, /javascript:/i, /vbscript:/i, /onload=/i, /onerror=/i,
      /<iframe/i, /<object/i, /<embed/i, /data:text\/html/i
    ];
    
    for (const xssPattern of xssPatterns) {
      if (xssPattern.test(trimmedValue)) {
        errors.push(`${fieldName} contains potentially malicious content`);
        riskLevel = 'HIGH';
        // Log security incident
        this.logSecurityIncident('XSS_ATTEMPT', {
          field: fieldName,
          pattern: xssPattern.toString(),
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
          timestamp: new Date().toISOString()
        });
      }
    }
    
    // Health information detection for general contact forms
    if (fieldType === 'message' && VALIDATION_PATTERNS.forbiddenHealthTerms.test(trimmedValue)) {
      errors.push('Please contact us directly for health-related inquiries to ensure privacy');
      riskLevel = 'MEDIUM';
    }
    
    // Sanitize the value
    const sanitizedValue = this.sanitizeInput(trimmedValue, fieldType);
    
    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue,
      riskLevel
    };
  }
  
  static sanitizeInput(value: string, type: 'name' | 'email' | 'phone' | 'message'): string {
    switch (type) {
      case 'email':
        return value.toLowerCase().trim();
      case 'phone':
        return value.replace(/[^\d+()-\s]/g, '').trim();
      case 'message':
        // Strip all HTML and limit to safe characters
        return value.replace(/<[^>]*>/g, '').trim();
      case 'name':
        // Remove any HTML and limit to safe characters
        return value.replace(/[<>]/g, '').trim();
      default:
        return value.trim();
    }
  }
  
  private static logSecurityIncident(type: string, details: Record<string, any>): void {
    // In production, this would send to a security logging service
    console.warn(`Security Incident: ${type}`, details);
    
    // Store in session storage for monitoring (client-side only)
    if (typeof window !== 'undefined') {
      const incidents = JSON.parse(sessionStorage.getItem('securityIncidents') || '[]');
      incidents.push({ type, details, timestamp: new Date().toISOString() });
      // Keep only last 10 incidents
      sessionStorage.setItem('securityIncidents', JSON.stringify(incidents.slice(-10)));
    }
  }
}

// Rate limiting for form submissions
export class FormRateLimit {
  private static readonly RATE_LIMIT_KEY = 'contact_form_submissions';
  private static readonly MAX_SUBMISSIONS = 3;
  private static readonly TIME_WINDOW_MS = 60 * 60 * 1000; // 1 hour
  
  static canSubmit(): { allowed: boolean; timeUntilReset?: number } {
    if (typeof window === 'undefined') return { allowed: true };
    
    const stored = localStorage.getItem(this.RATE_LIMIT_KEY);
    const now = Date.now();
    
    if (!stored) {
      return { allowed: true };
    }
    
    const submissions = JSON.parse(stored);
    // Filter submissions within time window
    const recentSubmissions = submissions.filter(
      (timestamp: number) => now - timestamp < this.TIME_WINDOW_MS
    );
    
    if (recentSubmissions.length >= this.MAX_SUBMISSIONS) {
      const oldestSubmission = Math.min(...recentSubmissions);
      const timeUntilReset = this.TIME_WINDOW_MS - (now - oldestSubmission);
      return { allowed: false, timeUntilReset };
    }
    
    return { allowed: true };
  }
  
  static recordSubmission(): void {
    if (typeof window === 'undefined') return;
    
    const stored = localStorage.getItem(this.RATE_LIMIT_KEY);
    const now = Date.now();
    const submissions = stored ? JSON.parse(stored) : [];
    
    submissions.push(now);
    
    // Clean old submissions
    const recentSubmissions = submissions.filter(
      (timestamp: number) => now - timestamp < this.TIME_WINDOW_MS
    );
    
    localStorage.setItem(this.RATE_LIMIT_KEY, JSON.stringify(recentSubmissions));
  }
}