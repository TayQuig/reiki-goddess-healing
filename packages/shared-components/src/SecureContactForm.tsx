import React, { useState, useCallback } from 'react';
import { SecurityValidator, FormRateLimit, ValidationResult } from '@reiki-goddess/shared-utils';

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

interface FormErrors {
  [key: string]: string[];
}

export const SecureContactForm: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'rate_limited'>('idle');
  const [csrfToken, setCsrfToken] = useState<string>('');
  
  // Generate CSRF token on component mount
  React.useEffect(() => {
    const token = crypto.randomUUID();
    setCsrfToken(token);
    sessionStorage.setItem('csrf_token', token);
  }, []);
  
  const validateField = useCallback((name: string, value: string): ValidationResult => {
    const fieldType = name === 'firstName' || name === 'lastName' ? 'name' : 
                     name === 'email' ? 'email' :
                     name === 'phone' ? 'phone' : 'message';
    
    return SecurityValidator.validateContactFormField(name, value, fieldType);
  }, []);
  
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Real-time validation
    const validation = validateField(name, value);
    
    setFormData(prev => ({
      ...prev,
      [name]: validation.sanitizedValue || value
    }));
    
    // Update errors
    setErrors(prev => ({
      ...prev,
      [name]: validation.errors
    }));
  }, [validateField]);
  
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    let hasErrors = false;
    
    Object.entries(formData).forEach(([key, value]) => {
      const validation = validateField(key, value);
      if (!validation.isValid) {
        newErrors[key] = validation.errors;
        hasErrors = true;
      }
    });
    
    setErrors(newErrors);
    return !hasErrors;
  }, [formData, validateField]);
  
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check rate limiting
    const rateLimitCheck = FormRateLimit.canSubmit();
    if (!rateLimitCheck.allowed) {
      setSubmitStatus('rate_limited');
      return;
    }
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Verify CSRF token
      const storedToken = sessionStorage.getItem('csrf_token');
      if (storedToken !== csrfToken) {
        throw new Error('Security token mismatch');
      }
      
      // In a real application, this would submit to a secure API endpoint
      // For static site, this will integrate with Vercel API routes
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Record successful submission for rate limiting
      FormRateLimit.recordSubmission();
      
      setSubmitStatus('success');
      
      // Clear form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: ''
      });
      
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, csrfToken]);
  
  const getFieldError = (fieldName: string): string | undefined => {
    return errors[fieldName]?.[0];
  };
  
  const hasFieldError = (fieldName: string): boolean => {
    return errors[fieldName]?.length > 0;
  };
  
  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-6" noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* First Name */}
        <div>
          <label 
            htmlFor="firstName" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
            aria-describedby={hasFieldError('firstName') ? 'firstName-error' : undefined}
            aria-invalid={hasFieldError('firstName')}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              hasFieldError('firstName') 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:border-blue-500'
            }`}
          />
          {hasFieldError('firstName') && (
            <p id="firstName-error" className="mt-1 text-sm text-red-600" role="alert">
              {getFieldError('firstName')}
            </p>
          )}
        </div>
        
        {/* Last Name */}
        <div>
          <label 
            htmlFor="lastName" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Last Name *
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
            aria-describedby={hasFieldError('lastName') ? 'lastName-error' : undefined}
            aria-invalid={hasFieldError('lastName')}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              hasFieldError('lastName') 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:border-blue-500'
            }`}
          />
          {hasFieldError('lastName') && (
            <p id="lastName-error" className="mt-1 text-sm text-red-600" role="alert">
              {getFieldError('lastName')}
            </p>
          )}
        </div>
      </div>
      
      {/* Email */}
      <div>
        <label 
          htmlFor="email" 
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          aria-describedby={hasFieldError('email') ? 'email-error' : undefined}
          aria-invalid={hasFieldError('email')}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            hasFieldError('email') 
              ? 'border-red-500 focus:border-red-500' 
              : 'border-gray-300 focus:border-blue-500'
          }`}
        />
        {hasFieldError('email') && (
          <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
            {getFieldError('email')}
          </p>
        )}
      </div>
      
      {/* Phone */}
      <div>
        <label 
          htmlFor="phone" 
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          aria-describedby={hasFieldError('phone') ? 'phone-error' : undefined}
          aria-invalid={hasFieldError('phone')}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            hasFieldError('phone') 
              ? 'border-red-500 focus:border-red-500' 
              : 'border-gray-300 focus:border-blue-500'
          }`}
        />
        {hasFieldError('phone') && (
          <p id="phone-error" className="mt-1 text-sm text-red-600" role="alert">
            {getFieldError('phone')}
          </p>
        )}
      </div>
      
      {/* Message */}
      <div>
        <label 
          htmlFor="message" 
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          required
          rows={5}
          aria-describedby={hasFieldError('message') ? 'message-error' : 'message-help'}
          aria-invalid={hasFieldError('message')}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            hasFieldError('message') 
              ? 'border-red-500 focus:border-red-500' 
              : 'border-gray-300 focus:border-blue-500'
          }`}
        />
        <p id="message-help" className="mt-1 text-sm text-gray-500">
          For specific health concerns, please call us directly to ensure privacy.
        </p>
        {hasFieldError('message') && (
          <p id="message-error" className="mt-1 text-sm text-red-600" role="alert">
            {getFieldError('message')}
          </p>
        )}
      </div>
      
      {/* Submit Status Messages */}
      {submitStatus === 'success' && (
        <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-md" role="alert">
          Thank you for your message! We'll get back to you within 24 hours.
        </div>
      )}
      
      {submitStatus === 'error' && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md" role="alert">
          There was an error sending your message. Please try again or call us directly.
        </div>
      )}
      
      {submitStatus === 'rate_limited' && (
        <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-md" role="alert">
          You've reached the maximum number of submissions. Please wait before trying again.
        </div>
      )}
      
      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || submitStatus === 'rate_limited'}
        className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
          isSubmitting || submitStatus === 'rate_limited'
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
        }`}
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
      
      {/* Privacy Notice */}
      <p className="text-sm text-gray-600 text-center">
        By submitting this form, you agree to our{' '}
        <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>.
        We respect your privacy and will never share your information.
      </p>
    </form>
  );
};