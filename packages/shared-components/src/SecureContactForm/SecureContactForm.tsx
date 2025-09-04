import React, { useState, useCallback, useRef } from 'react';
import { 
  SecurityValidator, 
  FormRateLimit, 
  SecurityMonitor,
  type ValidationResult 
} from '@reiki-goddess/shared-utils';

export interface SecureContactFormProps {
  onSubmit: (data: ContactFormData) => Promise<void>;
  className?: string;
  showPhoneField?: boolean;
  requirePhone?: boolean;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  general?: string;
}

export const SecureContactForm: React.FC<SecureContactFormProps> = ({
  onSubmit,
  className = '',
  showPhoneField = true,
  requirePhone = false
}) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  
  // Initialize rate limiter and monitor
  const rateLimit = useRef(new FormRateLimit());
  const monitor = useRef(new SecurityMonitor({ enableConsoleLogging: false }));
  
  /**
   * Validates a single field
   */
  const validateField = useCallback((name: keyof ContactFormData, value: string): string | undefined => {
    let result: ValidationResult;
    
    switch (name) {
      case 'email':
        result = SecurityValidator.validateEmail(value);
        break;
      case 'phone':
        if (requirePhone || value) {
          result = SecurityValidator.validatePhone(value);
        } else {
          return undefined; // Phone is optional and empty
        }
        break;
      default:
        result = SecurityValidator.validateContactFormField(name, value);
    }
    
    if (!result.isValid) {
      // Log security incidents
      result.risks.forEach(risk => {
        if (risk.level === 'HIGH') {
          monitor.current.log(risk.type, {
            field: name,
            value: value.substring(0, 50) + '...',
            message: risk.message
          });
        }
      });
      
      // Return the first high-level risk message, or the first message
      const highRisk = result.risks.find(r => r.level === 'HIGH');
      return highRisk?.message || result.risks[0]?.message;
    }
    
    return undefined;
  }, [requirePhone]);
  
  /**
   * Handles field changes with real-time validation
   */
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
    
    // Validate on blur or if there was an error
    if (errors[name as keyof FormErrors]) {
      const error = validateField(name as keyof ContactFormData, value);
      if (error) {
        setErrors(prev => ({
          ...prev,
          [name]: error
        }));
      }
    }
  }, [errors, validateField]);
  
  /**
   * Handles field blur for validation
   */
  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const error = validateField(name as keyof ContactFormData, value);
    
    if (error) {
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  }, [validateField]);
  
  /**
   * Validates entire form
   */
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    
    // Validate each field
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'phone' && !showPhoneField) return;
      
      const error = validateField(key as keyof ContactFormData, value);
      if (error) {
        newErrors[key as keyof FormErrors] = error;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, showPhoneField, validateField]);
  
  /**
   * Handles form submission with security checks
   */
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear any previous success state
    setSubmitSuccess(false);
    
    // Check rate limit
    const rateLimitCheck = rateLimit.current.checkLimit();
    if (!rateLimitCheck.allowed) {
      setErrors({
        general: rateLimitCheck.message
      });
      monitor.current.log('RATE_LIMIT_EXCEEDED', {
        remainingTime: rateLimitCheck.timeUntilReset
      });
      return;
    }
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Check for high-risk content
    const dataToCheck: Record<string, string> = {
      name: formData.name,
      email: formData.email,
      message: formData.message
    };
    if (formData.phone) {
      dataToCheck.phone = formData.phone;
    }
    
    if (SecurityValidator.isHighRisk(dataToCheck)) {
      monitor.current.log('HIGH_RISK_SUBMISSION_BLOCKED', {
        fields: Object.keys(formData)
      });
      setErrors({
        general: 'Your submission contains content that cannot be processed. Please review and try again.'
      });
      return;
    }
    
    setIsSubmitting(true);
    setErrors({});
    
    try {
      // Sanitize data before submission
      const sanitizedData: ContactFormData = {
        name: SecurityValidator.validateContactFormField('name', formData.name).sanitizedValue,
        email: SecurityValidator.validateEmail(formData.email).sanitizedValue,
        message: SecurityValidator.validateContactFormField('message', formData.message).sanitizedValue
      };
      
      if (showPhoneField && formData.phone) {
        sanitizedData.phone = SecurityValidator.validatePhone(formData.phone).sanitizedValue;
      }
      
      // Record the submission
      rateLimit.current.record();
      
      // Submit the form
      await onSubmit(sanitizedData);
      
      // Success!
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
      
      // Reset form
      formRef.current?.reset();
      
      // Log successful submission
      monitor.current.log('FORM_SUBMISSION_SUCCESS', {
        timestamp: new Date().toISOString()
      }, 'LOW');
      
    } catch (error) {
      // Log error
      monitor.current.log('FORM_SUBMISSION_ERROR', {
        error: error instanceof Error ? error.message : 'Unknown error'
      }, 'MEDIUM');
      
      setErrors({
        general: 'An error occurred while submitting your message. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, showPhoneField, validateForm, onSubmit]);
  
  return (
    <form 
      ref={formRef}
      onSubmit={handleSubmit} 
      className={`secure-contact-form ${className}`}
      noValidate
    >
      {/* Success Message */}
      {submitSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium">Thank you for your message!</p>
          <p className="text-green-700 text-sm mt-1">
            We&apos;ll get back to you within 24-48 hours.
          </p>
        </div>
      )}
      
      {/* General Error */}
      {errors.general && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{errors.general}</p>
        </div>
      )}
      
      {/* Name Field */}
      <div className="mb-6">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
          required
        />
        {errors.name && (
          <p id="name-error" className="mt-2 text-sm text-red-600">
            {errors.name}
          </p>
        )}
      </div>
      
      {/* Email Field */}
      <div className="mb-6">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          required
        />
        {errors.email && (
          <p id="email-error" className="mt-2 text-sm text-red-600">
            {errors.email}
          </p>
        )}
      </div>
      
      {/* Phone Field (Optional) */}
      {showPhoneField && (
        <div className="mb-6">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone {requirePhone && <span className="text-red-500">*</span>}
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
            required={requirePhone}
          />
          {errors.phone && (
            <p id="phone-error" className="mt-2 text-sm text-red-600">
              {errors.phone}
            </p>
          )}
        </div>
      )}
      
      {/* Message Field */}
      <div className="mb-6">
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          onBlur={handleBlur}
          rows={5}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
            errors.message ? 'border-red-500' : 'border-gray-300'
          }`}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
          required
        />
        {errors.message && (
          <p id="message-error" className="mt-2 text-sm text-red-600">
            {errors.message}
          </p>
        )}
        <p className="mt-2 text-sm text-gray-500">
          {1000 - formData.message.length} characters remaining
        </p>
      </div>
      
      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-3 px-6 rounded-full font-medium transition-all duration-300 ${
          isSubmitting
            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
        }`}
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
      
      {/* Rate Limit Info */}
      <p className="mt-4 text-xs text-gray-500 text-center">
        For security, form submissions are limited to 3 per hour.
      </p>
    </form>
  );
};