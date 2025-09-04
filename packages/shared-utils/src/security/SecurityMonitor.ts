/**
 * Security Incident Logging
 * Client-side security monitoring for analysis
 */

export interface SecurityIncident {
  type: string;
  details: Record<string, any>;
  timestamp: string;
  url: string;
  userAgent: string;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface MonitorConfig {
  maxIncidents?: number;
  enableConsoleLogging?: boolean;
  reportingEndpoint?: string;
  reportingThreshold?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export class SecurityMonitor {
  private static readonly DEFAULT_MAX_INCIDENTS = 10;
  private static readonly STORAGE_KEY = 'securityIncidents';
  private static readonly CRITICAL_TYPES = [
    'XSS_ATTEMPT',
    'SQL_INJECTION',
    'RATE_LIMIT_EXCEEDED',
    'CSRF_ATTEMPT',
    'AUTHENTICATION_FAILURE'
  ];
  
  private readonly maxIncidents: number;
  private readonly enableConsoleLogging: boolean;
  private readonly reportingEndpoint?: string;
  private readonly reportingThreshold: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  
  constructor(config: MonitorConfig = {}) {
    this.maxIncidents = config.maxIncidents || SecurityMonitor.DEFAULT_MAX_INCIDENTS;
    this.enableConsoleLogging = config.enableConsoleLogging ?? false;
    this.reportingEndpoint = config.reportingEndpoint;
    this.reportingThreshold = config.reportingThreshold || 'HIGH';
  }
  
  /**
   * Static method for quick incident logging with default settings
   */
  static logIncident(
    type: string, 
    details: Record<string, any>,
    severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  ): void {
    const instance = new SecurityMonitor();
    instance.log(type, details, severity);
  }
  
  /**
   * Logs a security incident
   */
  log(
    type: string, 
    details: Record<string, any>,
    severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  ): void {
    // Determine severity if not provided
    if (!severity) {
      severity = this.determineSeverity(type);
    }
    
    const incident: SecurityIncident = {
      type,
      details: this.sanitizeDetails(details),
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      severity
    };
    
    // Log to console if enabled
    if (this.enableConsoleLogging) {
      console.warn(`[Security Monitor] ${severity} - ${type}`, incident);
    }
    
    // Store incident
    this.storeIncident(incident);
    
    // Report if necessary
    if (this.shouldReport(severity)) {
      this.reportIncident(incident);
    }
  }
  
  /**
   * Gets all stored incidents
   */
  getIncidents(): SecurityIncident[] {
    try {
      const stored = sessionStorage.getItem(SecurityMonitor.STORAGE_KEY);
      if (!stored) return [];
      
      const parsed = JSON.parse(stored);
      
      // Validate the structure
      if (Array.isArray(parsed)) {
        return parsed.filter(this.isValidIncident);
      }
      
      return [];
    } catch (error) {
      console.warn('Failed to read security incidents:', error);
      return [];
    }
  }
  
  /**
   * Gets incidents of a specific type
   */
  getIncidentsByType(type: string): SecurityIncident[] {
    return this.getIncidents().filter(incident => incident.type === type);
  }
  
  /**
   * Gets incidents by severity
   */
  getIncidentsBySeverity(severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'): SecurityIncident[] {
    return this.getIncidents().filter(incident => incident.severity === severity);
  }
  
  /**
   * Clears all incidents (useful for testing or after reporting)
   */
  clearIncidents(): void {
    try {
      sessionStorage.removeItem(SecurityMonitor.STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear security incidents:', error);
    }
  }
  
  /**
   * Gets a summary of incidents for reporting
   */
  getSummary(): {
    total: number;
    byType: Record<string, number>;
    bySeverity: Record<string, number>;
    timeRange: { start?: string; end?: string };
  } {
    const incidents = this.getIncidents();
    
    const byType: Record<string, number> = {};
    const bySeverity: Record<string, number> = {
      LOW: 0,
      MEDIUM: 0,
      HIGH: 0,
      CRITICAL: 0
    };
    
    let earliestTime: string | undefined;
    let latestTime: string | undefined;
    
    incidents.forEach(incident => {
      // Count by type
      byType[incident.type] = (byType[incident.type] || 0) + 1;
      
      // Count by severity
      if (incident.severity) {
        bySeverity[incident.severity]++;
      }
      
      // Track time range
      if (!earliestTime || incident.timestamp < earliestTime) {
        earliestTime = incident.timestamp;
      }
      if (!latestTime || incident.timestamp > latestTime) {
        latestTime = incident.timestamp;
      }
    });
    
    return {
      total: incidents.length,
      byType,
      bySeverity,
      timeRange: {
        start: earliestTime,
        end: latestTime
      }
    };
  }
  
  /**
   * Stores an incident in session storage
   */
  private storeIncident(incident: SecurityIncident): void {
    try {
      const incidents = this.getIncidents();
      incidents.push(incident);
      
      // Keep only recent incidents
      const recentIncidents = incidents.slice(-this.maxIncidents);
      
      sessionStorage.setItem(
        SecurityMonitor.STORAGE_KEY, 
        JSON.stringify(recentIncidents)
      );
    } catch (error) {
      console.warn('Failed to store security incident:', error);
    }
  }
  
  /**
   * Determines if an incident should be reported
   */
  private shouldReport(severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'): boolean {
    const severityLevels = { LOW: 1, MEDIUM: 2, HIGH: 3, CRITICAL: 4 };
    return severityLevels[severity] >= severityLevels[this.reportingThreshold];
  }
  
  /**
   * Reports an incident to the monitoring service
   */
  private async reportIncident(incident: SecurityIncident): Promise<void> {
    if (!this.reportingEndpoint) return;
    
    try {
      await fetch(this.reportingEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          incident,
          summary: this.getSummary()
        })
      });
    } catch (error) {
      // Silently fail - we don't want reporting failures to affect the user
      if (this.enableConsoleLogging) {
        console.error('Failed to report security incident:', error);
      }
    }
  }
  
  /**
   * Determines severity based on incident type
   */
  private determineSeverity(type: string): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    if (SecurityMonitor.CRITICAL_TYPES.includes(type)) {
      return 'CRITICAL';
    }
    
    if (type.includes('ATTEMPT') || type.includes('INJECTION')) {
      return 'HIGH';
    }
    
    if (type.includes('INVALID') || type.includes('SUSPICIOUS')) {
      return 'MEDIUM';
    }
    
    return 'LOW';
  }
  
  /**
   * Sanitizes details to prevent sensitive data leakage
   */
  private sanitizeDetails(details: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};
    const sensitiveKeys = ['password', 'token', 'secret', 'key', 'auth'];
    
    for (const [key, value] of Object.entries(details)) {
      // Don't include sensitive keys
      if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
        sanitized[key] = '[REDACTED]';
        continue;
      }
      
      // Limit string lengths
      if (typeof value === 'string' && value.length > 200) {
        sanitized[key] = value.substring(0, 200) + '...';
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }
  
  /**
   * Validates incident structure
   */
  private isValidIncident(incident: any): incident is SecurityIncident {
    return (
      incident !== null &&
      typeof incident === 'object' &&
      typeof incident.type === 'string' &&
      typeof incident.details === 'object' &&
      incident.details !== null &&
      typeof incident.timestamp === 'string' &&
      typeof incident.url === 'string' &&
      typeof incident.userAgent === 'string'
    );
  }
}