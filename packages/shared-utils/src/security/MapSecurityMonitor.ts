/**
 * Map-specific Security Monitor
 * Monitors Google Maps integration for security incidents
 */

import { SecurityMonitor } from "./SecurityMonitor";

export interface MapLoadEvent {
  success: boolean;
  loadTime: number;
  apiKey?: string;
  domain: string;
  errorType?: string;
  errorMessage?: string;
}

export interface MapInteractionEvent {
  type: "click" | "zoom" | "drag" | "geolocation_request";
  timestamp: number;
  coordinates?: { lat: number; lng: number };
  userAgent: string;
}

export interface MapAPIUsageEvent {
  endpoint: string;
  requestCount: number;
  timeWindow: number;
  quotaStatus: "normal" | "warning" | "exceeded";
  estimatedCost?: number;
}

/**
 * Specialized security monitor for Google Maps integration
 */
export class MapSecurityMonitor extends SecurityMonitor {
  private static readonly MAP_INCIDENT_TYPES = {
    API_KEY_EXPOSED: "MAP_API_KEY_EXPOSED",
    CSP_VIOLATION: "MAP_CSP_VIOLATION",
    QUOTA_EXCEEDED: "MAP_QUOTA_EXCEEDED",
    SUSPICIOUS_USAGE: "MAP_SUSPICIOUS_USAGE",
    GEOLOCATION_ABUSE: "MAP_GEOLOCATION_ABUSE",
    DOMAIN_MISMATCH: "MAP_DOMAIN_MISMATCH",
    LOAD_FAILURE: "MAP_LOAD_FAILURE",
    RAPID_REQUESTS: "MAP_RAPID_REQUESTS",
  } as const;

  private interactionBuffer: MapInteractionEvent[] = [];
  private readonly maxInteractionBuffer = 50;
  private readonly rapidRequestThreshold = 10; // requests per minute
  private readonly suspiciousPatternWindow = 5 * 60 * 1000; // 5 minutes

  /**
   * Logs a map loading event
   */
  logMapLoad(event: MapLoadEvent): void {
    if (!event.success) {
      this.log(
        MapSecurityMonitor.MAP_INCIDENT_TYPES.LOAD_FAILURE,
        {
          domain: event.domain,
          errorType: event.errorType,
          errorMessage: event.errorMessage,
          loadTime: event.loadTime,
        },
        "MEDIUM"
      );
    }

    // Check for API key exposure (shouldn't happen with Embed API)
    if (event.apiKey) {
      this.log(
        MapSecurityMonitor.MAP_INCIDENT_TYPES.API_KEY_EXPOSED,
        {
          domain: event.domain,
          apiKeyPrefix: event.apiKey.substring(0, 8) + "...",
        },
        "CRITICAL"
      );
    }

    // Log successful loads for pattern analysis
    if (event.success) {
      this.log(
        "MAP_LOAD_SUCCESS",
        {
          domain: event.domain,
          loadTime: event.loadTime,
        },
        "LOW"
      );
    }
  }

  /**
   * Logs user interactions with the map
   */
  logMapInteraction(event: MapInteractionEvent): void {
    // Add to interaction buffer
    this.interactionBuffer.push(event);

    // Keep buffer size manageable
    if (this.interactionBuffer.length > this.maxInteractionBuffer) {
      this.interactionBuffer = this.interactionBuffer.slice(
        -this.maxInteractionBuffer
      );
    }

    // Check for suspicious patterns
    this.checkSuspiciousPatterns(event);

    // Log geolocation requests
    if (event.type === "geolocation_request") {
      this.log(
        "MAP_GEOLOCATION_REQUEST",
        {
          coordinates: event.coordinates,
          userAgent: event.userAgent,
        },
        "LOW"
      );
    }
  }

  /**
   * Logs API usage statistics
   */
  logAPIUsage(event: MapAPIUsageEvent): void {
    const severity = this.determineAPIUsageSeverity(event);

    this.log(
      MapSecurityMonitor.MAP_INCIDENT_TYPES.SUSPICIOUS_USAGE,
      {
        endpoint: event.endpoint,
        requestCount: event.requestCount,
        timeWindow: event.timeWindow,
        quotaStatus: event.quotaStatus,
        estimatedCost: event.estimatedCost,
      },
      severity
    );

    // Special handling for quota exceeded
    if (event.quotaStatus === "exceeded") {
      this.log(
        MapSecurityMonitor.MAP_INCIDENT_TYPES.QUOTA_EXCEEDED,
        {
          endpoint: event.endpoint,
          requestCount: event.requestCount,
          estimatedCost: event.estimatedCost,
        },
        "CRITICAL"
      );
    }
  }

  /**
   * Logs CSP violations related to maps
   */
  logCSPViolation(
    violatedDirective: string,
    blockedURI: string,
    documentURI: string
  ): void {
    this.log(
      MapSecurityMonitor.MAP_INCIDENT_TYPES.CSP_VIOLATION,
      {
        violatedDirective,
        blockedURI,
        documentURI,
        isMapRelated: this.isMapRelatedViolation(blockedURI),
      },
      "HIGH"
    );
  }

  /**
   * Logs domain mismatch incidents
   */
  logDomainMismatch(expectedDomain: string, actualDomain: string): void {
    this.log(
      MapSecurityMonitor.MAP_INCIDENT_TYPES.DOMAIN_MISMATCH,
      {
        expectedDomain,
        actualDomain,
        referrer: document.referrer,
      },
      "HIGH"
    );
  }

  /**
   * Gets map-specific incident summary
   */
  getMapIncidentSummary(): {
    totalMapIncidents: number;
    loadFailures: number;
    cspViolations: number;
    quotaIssues: number;
    suspiciousActivity: number;
    geolocationRequests: number;
    averageLoadTime: number;
  } {
    const incidents = this.getIncidents();
    const mapIncidents = incidents.filter(
      (incident) =>
        incident.type.startsWith("MAP_") ||
        Object.values(MapSecurityMonitor.MAP_INCIDENT_TYPES).includes(
          incident.type as any
        )
    );

    const loadFailures = mapIncidents.filter(
      (i) => i.type === MapSecurityMonitor.MAP_INCIDENT_TYPES.LOAD_FAILURE
    ).length;
    const cspViolations = mapIncidents.filter(
      (i) => i.type === MapSecurityMonitor.MAP_INCIDENT_TYPES.CSP_VIOLATION
    ).length;
    const quotaIssues = mapIncidents.filter(
      (i) => i.type === MapSecurityMonitor.MAP_INCIDENT_TYPES.QUOTA_EXCEEDED
    ).length;
    const suspiciousActivity = mapIncidents.filter(
      (i) => i.type === MapSecurityMonitor.MAP_INCIDENT_TYPES.SUSPICIOUS_USAGE
    ).length;
    const geolocationRequests = mapIncidents.filter(
      (i) => i.type === "MAP_GEOLOCATION_REQUEST"
    ).length;

    // Calculate average load time from successful loads
    const successfulLoads = incidents.filter(
      (i) => i.type === "MAP_LOAD_SUCCESS"
    );
    const averageLoadTime =
      successfulLoads.length > 0
        ? successfulLoads.reduce(
            (sum, incident) => sum + (incident.details.loadTime || 0),
            0
          ) / successfulLoads.length
        : 0;

    return {
      totalMapIncidents: mapIncidents.length,
      loadFailures,
      cspViolations,
      quotaIssues,
      suspiciousActivity,
      geolocationRequests,
      averageLoadTime: Math.round(averageLoadTime),
    };
  }

  /**
   * Gets recent interaction patterns
   */
  getInteractionPatterns(): {
    totalInteractions: number;
    interactionTypes: Record<string, number>;
    timeDistribution: Record<string, number>;
    suspiciousPatterns: string[];
  } {
    const now = Date.now();
    const recentInteractions = this.interactionBuffer.filter(
      (interaction) =>
        now - interaction.timestamp < this.suspiciousPatternWindow
    );

    const interactionTypes: Record<string, number> = {};
    const timeDistribution: Record<string, number> = {};

    recentInteractions.forEach((interaction) => {
      // Count by type
      interactionTypes[interaction.type] =
        (interactionTypes[interaction.type] || 0) + 1;

      // Count by hour of day
      const hour = new Date(interaction.timestamp).getHours();
      timeDistribution[hour] = (timeDistribution[hour] || 0) + 1;
    });

    const suspiciousPatterns =
      this.identifySuspiciousPatterns(recentInteractions);

    return {
      totalInteractions: recentInteractions.length,
      interactionTypes,
      timeDistribution,
      suspiciousPatterns,
    };
  }

  /**
   * Checks for suspicious interaction patterns
   */
  private checkSuspiciousPatterns(event: MapInteractionEvent): void {
    const now = Date.now();
    const recentWindow = 60 * 1000; // 1 minute

    const recentInteractions = this.interactionBuffer.filter(
      (interaction) => now - interaction.timestamp < recentWindow
    );

    // Check for rapid repeated interactions
    if (recentInteractions.length > this.rapidRequestThreshold) {
      this.log(
        MapSecurityMonitor.MAP_INCIDENT_TYPES.RAPID_REQUESTS,
        {
          interactionCount: recentInteractions.length,
          timeWindow: recentWindow,
          userAgent: event.userAgent,
          lastInteractionType: event.type,
        },
        "HIGH"
      );
    }

    // Check for automated behavior patterns
    const clicksOnly = recentInteractions.filter((i) => i.type === "click");
    if (clicksOnly.length >= 5) {
      const timeDiffs = clicksOnly
        .slice(1)
        .map(
          (interaction, index) =>
            interaction.timestamp - clicksOnly[index].timestamp
        );

      // Check if all time differences are very similar (indicating automation)
      if (timeDiffs.length > 0) {
        const avgDiff =
          timeDiffs.reduce((sum, diff) => sum + diff, 0) / timeDiffs.length;
        const variance =
          timeDiffs.reduce(
            (sum, diff) => sum + Math.pow(diff - avgDiff, 2),
            0
          ) / timeDiffs.length;

        if (variance < 100) {
          // Very low variance suggests automation
          this.log(
            MapSecurityMonitor.MAP_INCIDENT_TYPES.SUSPICIOUS_USAGE,
            {
              patternType: "automated_clicking",
              interactionCount: clicksOnly.length,
              averageInterval: avgDiff,
              variance: variance,
            },
            "HIGH"
          );
        }
      }
    }
  }

  /**
   * Determines severity based on API usage
   */
  private determineAPIUsageSeverity(
    event: MapAPIUsageEvent
  ): "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" {
    if (event.quotaStatus === "exceeded") {
      return "CRITICAL";
    }

    if (event.quotaStatus === "warning" || event.requestCount > 1000) {
      return "HIGH";
    }

    if (event.requestCount > 100) {
      return "MEDIUM";
    }

    return "LOW";
  }

  /**
   * Checks if a CSP violation is map-related
   */
  private isMapRelatedViolation(blockedURI: string): boolean {
    const mapDomains = [
      "maps.googleapis.com",
      "maps.gstatic.com",
      "google.com",
      "googleapis.com",
      "gstatic.com",
    ];

    return mapDomains.some((domain) => blockedURI.includes(domain));
  }

  /**
   * Identifies suspicious patterns in interactions
   */
  private identifySuspiciousPatterns(
    interactions: MapInteractionEvent[]
  ): string[] {
    const patterns: string[] = [];

    // Check for off-hours activity
    const businessHours = interactions.filter((i) => {
      const hour = new Date(i.timestamp).getHours();
      return hour >= 9 && hour <= 17;
    });

    if (businessHours.length < interactions.length * 0.3) {
      patterns.push("high_off_hours_activity");
    }

    // Check for single interaction type dominance
    const typeCount: Record<string, number> = {};
    interactions.forEach((i) => {
      typeCount[i.type] = (typeCount[i.type] || 0) + 1;
    });

    const maxTypeCount = Math.max(...Object.values(typeCount));
    if (maxTypeCount > interactions.length * 0.8) {
      patterns.push("single_interaction_dominance");
    }

    // Check for rapid sequential interactions
    const sortedInteractions = interactions.sort(
      (a, b) => a.timestamp - b.timestamp
    );
    let rapidSequence = 0;

    for (let i = 1; i < sortedInteractions.length; i++) {
      const timeDiff =
        sortedInteractions[i].timestamp - sortedInteractions[i - 1].timestamp;
      if (timeDiff < 100) {
        // Less than 100ms between interactions
        rapidSequence++;
      }
    }

    if (rapidSequence > interactions.length * 0.5) {
      patterns.push("rapid_sequential_interactions");
    }

    return patterns;
  }
}

/**
 * Global instance for easy access
 */
export const mapSecurityMonitor = new MapSecurityMonitor({
  enableConsoleLogging: process.env.NODE_ENV === "development",
  maxIncidents: 25,
  reportingThreshold: "MEDIUM",
});

/**
 * Utility function to set up CSP violation reporting for maps
 */
export function setupMapCSPReporting(): void {
  if (typeof window === "undefined") return;

  // Listen for CSP violations
  document.addEventListener("securitypolicyviolation", (event) => {
    mapSecurityMonitor.logCSPViolation(
      event.violatedDirective,
      event.blockedURI,
      event.documentURI
    );
  });

  // Listen for unhandled errors that might be map-related
  window.addEventListener("error", (event) => {
    if (
      event.message &&
      mapSecurityMonitor["isMapRelatedViolation"](event.filename || "")
    ) {
      mapSecurityMonitor.log(
        "MAP_LOAD_ERROR",
        {
          message: event.message,
          filename: event.filename,
          line: event.lineno,
          column: event.colno,
        },
        "MEDIUM"
      );
    }
  });
}
