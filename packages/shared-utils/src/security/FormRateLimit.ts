/**
 * Client-Side Rate Limiting
 * Browser-based rate limiting with user feedback
 */

export interface RateLimitResult {
  allowed: boolean;
  timeUntilReset?: number; // in minutes
  remainingSubmissions?: number;
  message?: string;
}

export interface RateLimitConfig {
  maxSubmissions?: number;
  timeWindowMs?: number;
  storageKey?: string;
}

export class FormRateLimit {
  private static readonly DEFAULT_STORAGE_KEY = 'form_submissions';
  private static readonly DEFAULT_MAX_SUBMISSIONS = 3;
  private static readonly DEFAULT_TIME_WINDOW_MS = 60 * 60 * 1000; // 1 hour
  
  private readonly storageKey: string;
  private readonly maxSubmissions: number;
  private readonly timeWindowMs: number;
  
  constructor(config: RateLimitConfig = {}) {
    this.storageKey = config.storageKey || FormRateLimit.DEFAULT_STORAGE_KEY;
    this.maxSubmissions = config.maxSubmissions || FormRateLimit.DEFAULT_MAX_SUBMISSIONS;
    this.timeWindowMs = config.timeWindowMs || FormRateLimit.DEFAULT_TIME_WINDOW_MS;
  }
  
  /**
   * Static method for quick checks with default settings
   */
  static canSubmit(): RateLimitResult {
    const instance = new FormRateLimit();
    return instance.checkLimit();
  }
  
  /**
   * Static method to record a submission with default settings
   */
  static recordSubmission(): void {
    const instance = new FormRateLimit();
    instance.record();
  }
  
  /**
   * Checks if a form submission is allowed
   */
  checkLimit(): RateLimitResult {
    const now = Date.now();
    const submissions = this.getSubmissions();
    
    // Clean old submissions
    const recentSubmissions = submissions.filter(
      time => now - time < this.timeWindowMs
    );
    
    // Update storage with cleaned submissions
    if (recentSubmissions.length < submissions.length) {
      this.setSubmissions(recentSubmissions);
    }
    
    const remainingSubmissions = this.maxSubmissions - recentSubmissions.length;
    
    if (recentSubmissions.length >= this.maxSubmissions) {
      const oldestSubmission = Math.min(...recentSubmissions);
      const timeUntilReset = (oldestSubmission + this.timeWindowMs) - now;
      const minutesUntilReset = Math.ceil(timeUntilReset / 1000 / 60);
      
      return { 
        allowed: false, 
        timeUntilReset: minutesUntilReset,
        remainingSubmissions: 0,
        message: `You've reached the submission limit. Please try again in ${minutesUntilReset} minute${minutesUntilReset !== 1 ? 's' : ''}.`
      };
    }
    
    return { 
      allowed: true,
      remainingSubmissions,
      message: remainingSubmissions === 1 
        ? 'You have 1 submission remaining this hour.'
        : `You have ${remainingSubmissions} submissions remaining this hour.`
    };
  }
  
  /**
   * Records a new form submission
   */
  record(): void {
    const submissions = this.getSubmissions();
    submissions.push(Date.now());
    this.setSubmissions(submissions);
  }
  
  /**
   * Clears all submission history (useful for testing or admin override)
   */
  reset(): void {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.warn('Failed to reset rate limit:', error);
    }
  }
  
  /**
   * Gets the submission history from localStorage
   */
  private getSubmissions(): number[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return [];
      
      const parsed = JSON.parse(stored);
      
      // Validate that it's an array of numbers
      if (Array.isArray(parsed) && parsed.every(item => typeof item === 'number')) {
        return parsed;
      }
      
      return [];
    } catch (error) {
      console.warn('Failed to read rate limit data:', error);
      return [];
    }
  }
  
  /**
   * Saves submission history to localStorage
   */
  private setSubmissions(submissions: number[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(submissions));
    } catch (error) {
      console.warn('Failed to save rate limit data:', error);
      // If localStorage is full or unavailable, we'll allow the submission
      // This prevents blocking users due to storage issues
    }
  }
  
  /**
   * Gets information about current rate limit status
   */
  getStatus(): {
    submissions: number;
    maxSubmissions: number;
    timeWindow: string;
    nextReset?: string;
  } {
    const submissions = this.getSubmissions();
    const now = Date.now();
    const recentSubmissions = submissions.filter(
      time => now - time < this.timeWindowMs
    );
    
    let nextReset: string | undefined;
    if (recentSubmissions.length > 0) {
      const oldestSubmission = Math.min(...recentSubmissions);
      const resetTime = new Date(oldestSubmission + this.timeWindowMs);
      nextReset = resetTime.toLocaleTimeString();
    }
    
    return {
      submissions: recentSubmissions.length,
      maxSubmissions: this.maxSubmissions,
      timeWindow: `${this.timeWindowMs / 1000 / 60} minutes`,
      nextReset
    };
  }
}