import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SecurityMonitor } from './SecurityMonitor';

describe('SecurityMonitor', () => {
  // Mock sessionStorage
  const sessionStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      }
    };
  })();

  // Mock fetch for reporting
  const fetchMock = vi.fn();

  beforeEach(() => {
    // Clear sessionStorage before each test
    sessionStorageMock.clear();
    Object.defineProperty(window, 'sessionStorage', {
      value: sessionStorageMock,
      writable: true
    });
    
    // Mock global fetch
    global.fetch = fetchMock;
    fetchMock.mockClear();
    
    // Mock console methods
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('log', () => {
    it('should log incidents with correct structure', () => {
      const monitor = new SecurityMonitor();
      
      monitor.log('TEST_INCIDENT', { field: 'email', value: 'test@example.com' });
      
      const incidents = monitor.getIncidents();
      expect(incidents).toHaveLength(1);
      expect(incidents[0]).toMatchObject({
        type: 'TEST_INCIDENT',
        details: { field: 'email', value: 'test@example.com' },
        timestamp: expect.any(String),
        url: expect.any(String),
        userAgent: expect.any(String),
        severity: 'LOW'
      });
    });

    it('should determine severity automatically', () => {
      const monitor = new SecurityMonitor();
      
      // Critical types
      monitor.log('XSS_ATTEMPT', {});
      monitor.log('SQL_INJECTION', {});
      monitor.log('RATE_LIMIT_EXCEEDED', {});
      
      // High severity
      monitor.log('INJECTION_ATTEMPT', {});
      monitor.log('CSRF_ATTEMPT', {});
      
      // Medium severity
      monitor.log('INVALID_INPUT', {});
      monitor.log('SUSPICIOUS_ACTIVITY', {});
      
      // Low severity
      monitor.log('FORM_ERROR', {});
      
      const incidents = monitor.getIncidents();
      expect(incidents[0].severity).toBe('CRITICAL');
      expect(incidents[1].severity).toBe('CRITICAL');
      expect(incidents[2].severity).toBe('CRITICAL');
      expect(incidents[3].severity).toBe('HIGH');
      expect(incidents[4].severity).toBe('CRITICAL');
      expect(incidents[5].severity).toBe('MEDIUM');
      expect(incidents[6].severity).toBe('MEDIUM');
      expect(incidents[7].severity).toBe('LOW');
    });

    it('should respect custom severity', () => {
      const monitor = new SecurityMonitor();
      
      monitor.log('CUSTOM_EVENT', {}, 'HIGH');
      
      const incidents = monitor.getIncidents();
      expect(incidents[0].severity).toBe('HIGH');
    });

    it('should limit stored incidents', () => {
      const monitor = new SecurityMonitor({ maxIncidents: 3 });
      
      // Log more than max
      for (let i = 0; i < 5; i++) {
        monitor.log(`INCIDENT_${i}`, {});
      }
      
      const incidents = monitor.getIncidents();
      expect(incidents).toHaveLength(3);
      expect(incidents[0].type).toBe('INCIDENT_2'); // Oldest should be removed
    });

    it('should log to console when enabled', () => {
      const monitor = new SecurityMonitor({ enableConsoleLogging: true });
      
      monitor.log('TEST_INCIDENT', { test: true });
      
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('[Security Monitor]'),
        expect.any(Object)
      );
    });
  });

  describe('sanitizeDetails', () => {
    it('should redact sensitive fields', () => {
      const monitor = new SecurityMonitor();
      
      monitor.log('TEST', {
        username: 'john',
        password: 'secret123',
        token: 'abc123',
        apiKey: 'xyz789',
        email: 'test@example.com'
      });
      
      const incidents = monitor.getIncidents();
      expect(incidents[0].details).toEqual({
        username: 'john',
        password: '[REDACTED]',
        token: '[REDACTED]',
        apiKey: '[REDACTED]',
        email: 'test@example.com'
      });
    });

    it('should truncate long strings', () => {
      const monitor = new SecurityMonitor();
      const longString = 'a'.repeat(250);
      
      monitor.log('TEST', { message: longString });
      
      const incidents = monitor.getIncidents();
      expect(incidents[0].details.message).toHaveLength(203); // 200 + '...'
      expect(incidents[0].details.message.endsWith('...')).toBe(true);
    });
  });

  describe('reporting', () => {
    it('should report critical incidents when configured', async () => {
      fetchMock.mockResolvedValueOnce({ ok: true });
      
      const monitor = new SecurityMonitor({
        reportingEndpoint: 'https://api.example.com/security',
        reportingThreshold: 'CRITICAL'
      });
      
      monitor.log('XSS_ATTEMPT', { field: 'message' });
      
      // Wait for async reporting
      await new Promise(resolve => setTimeout(resolve, 10));
      
      expect(fetchMock).toHaveBeenCalledWith(
        'https://api.example.com/security',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('XSS_ATTEMPT')
        })
      );
    });

    it('should not report below threshold', async () => {
      const monitor = new SecurityMonitor({
        reportingEndpoint: 'https://api.example.com/security',
        reportingThreshold: 'HIGH'
      });
      
      monitor.log('FORM_ERROR', { field: 'email' }, 'LOW');
      
      await new Promise(resolve => setTimeout(resolve, 10));
      
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('should handle reporting errors gracefully', async () => {
      fetchMock.mockRejectedValueOnce(new Error('Network error'));
      
      const monitor = new SecurityMonitor({
        reportingEndpoint: 'https://api.example.com/security',
        reportingThreshold: 'HIGH',
        enableConsoleLogging: true
      });
      
      monitor.log('SQL_INJECTION', {});
      
      await new Promise(resolve => setTimeout(resolve, 10));
      
      expect(console.error).toHaveBeenCalledWith(
        'Failed to report security incident:',
        expect.any(Error)
      );
    });
  });

  describe('getIncidentsByType', () => {
    it('should filter incidents by type', () => {
      const monitor = new SecurityMonitor();
      
      monitor.log('XSS_ATTEMPT', { attempt: 1 });
      monitor.log('SQL_INJECTION', { attempt: 1 });
      monitor.log('XSS_ATTEMPT', { attempt: 2 });
      
      const xssIncidents = monitor.getIncidentsByType('XSS_ATTEMPT');
      expect(xssIncidents).toHaveLength(2);
      expect(xssIncidents[0].details.attempt).toBe(1);
      expect(xssIncidents[1].details.attempt).toBe(2);
    });
  });

  describe('getIncidentsBySeverity', () => {
    it('should filter incidents by severity', () => {
      const monitor = new SecurityMonitor();
      
      monitor.log('XSS_ATTEMPT', {}); // CRITICAL
      monitor.log('INVALID_INPUT', {}); // MEDIUM
      monitor.log('SQL_INJECTION', {}); // CRITICAL
      
      const criticalIncidents = monitor.getIncidentsBySeverity('CRITICAL');
      expect(criticalIncidents).toHaveLength(2);
      expect(criticalIncidents[0].type).toBe('XSS_ATTEMPT');
      expect(criticalIncidents[1].type).toBe('SQL_INJECTION');
    });
  });

  describe('getSummary', () => {
    it('should provide comprehensive summary', () => {
      const monitor = new SecurityMonitor();
      
      monitor.log('XSS_ATTEMPT', {});
      monitor.log('SQL_INJECTION', {});
      monitor.log('XSS_ATTEMPT', {});
      monitor.log('FORM_ERROR', {}, 'LOW');
      
      const summary = monitor.getSummary();
      
      expect(summary.total).toBe(4);
      expect(summary.byType).toEqual({
        'XSS_ATTEMPT': 2,
        'SQL_INJECTION': 1,
        'FORM_ERROR': 1
      });
      expect(summary.bySeverity).toEqual({
        'LOW': 1,
        'MEDIUM': 0,
        'HIGH': 0,
        'CRITICAL': 3
      });
      expect(summary.timeRange.start).toBeDefined();
      expect(summary.timeRange.end).toBeDefined();
    });

    it('should handle empty incidents', () => {
      const monitor = new SecurityMonitor();
      const summary = monitor.getSummary();
      
      expect(summary.total).toBe(0);
      expect(summary.byType).toEqual({});
      expect(summary.bySeverity).toEqual({
        'LOW': 0,
        'MEDIUM': 0,
        'HIGH': 0,
        'CRITICAL': 0
      });
      expect(summary.timeRange.start).toBeUndefined();
      expect(summary.timeRange.end).toBeUndefined();
    });
  });

  describe('clearIncidents', () => {
    it('should remove all incidents', () => {
      const monitor = new SecurityMonitor();
      
      monitor.log('TEST1', {});
      monitor.log('TEST2', {});
      
      expect(monitor.getIncidents()).toHaveLength(2);
      
      monitor.clearIncidents();
      
      expect(monitor.getIncidents()).toHaveLength(0);
    });
  });

  describe('static methods', () => {
    it('should work with static logIncident method', () => {
      SecurityMonitor.logIncident('STATIC_TEST', { test: true }, 'HIGH');
      
      const monitor = new SecurityMonitor();
      const incidents = monitor.getIncidents();
      
      expect(incidents).toHaveLength(1);
      expect(incidents[0].type).toBe('STATIC_TEST');
      expect(incidents[0].severity).toBe('HIGH');
    });
  });

  describe('error handling', () => {
    it('should handle sessionStorage errors gracefully', () => {
      const monitor = new SecurityMonitor();
      
      // Mock sessionStorage to throw error
      vi.spyOn(sessionStorage, 'getItem').mockImplementation(() => {
        throw new Error('Storage error');
      });
      
      // Should return empty array
      const incidents = monitor.getIncidents();
      expect(incidents).toEqual([]);
      
      // Clear the mock for next test
      vi.restoreAllMocks();
    });

    it('should validate incident structure', () => {
      // Directly set sessionStorage with mixed valid/invalid data
      const mixedData = [
        { invalid: 'data' },
        {
          type: 'TEST_INCIDENT',
          details: { test: true },
          timestamp: new Date().toISOString(),
          url: 'http://test.com',
          userAgent: 'test-agent',
          severity: 'LOW'
        },
        null,
        'string',
        undefined,
        { type: 'MISSING_FIELDS' } // Missing required fields
      ];
      
      sessionStorage.setItem('securityIncidents', JSON.stringify(mixedData));
      
      // Create monitor and test validation
      const monitor = new SecurityMonitor();
      const incidents = monitor.getIncidents();
      
      // Should only return the one valid incident
      expect(incidents.length).toBe(1);
      expect(incidents[0].type).toBe('TEST_INCIDENT');
      expect(incidents[0].details).toEqual({ test: true });
      expect(incidents[0]).toHaveProperty('timestamp');
      expect(incidents[0]).toHaveProperty('url');
      expect(incidents[0]).toHaveProperty('userAgent');
    });
  });
});