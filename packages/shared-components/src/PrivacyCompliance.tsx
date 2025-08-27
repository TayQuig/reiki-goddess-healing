import React, { useState, useEffect } from "react";

interface ConsentPreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

interface PrivacySettings {
  consentGiven: boolean;
  preferences: ConsentPreferences;
  timestamp: string;
  version: string;
}

export const CookieConsentBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const existingConsent = localStorage.getItem("privacy_consent");
    if (!existingConsent) {
      setShowBanner(true);
    }
  }, []);

  const saveConsent = (acceptAll: boolean = false) => {
    const finalPreferences = acceptAll
      ? {
          necessary: true,
          analytics: true,
          marketing: true,
        }
      : preferences;

    const privacySettings: PrivacySettings = {
      consentGiven: true,
      preferences: finalPreferences,
      timestamp: new Date().toISOString(),
      version: "1.0",
    };

    localStorage.setItem("privacy_consent", JSON.stringify(privacySettings));

    // Initialize or disable tracking based on preferences
    if (finalPreferences.analytics) {
      initializeAnalytics();
    }

    if (finalPreferences.marketing) {
      initializeMarketing();
    }

    setShowBanner(false);
  };

  const initializeAnalytics = () => {
    // Initialize Google Analytics or other analytics
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("consent", "update", {
        analytics_storage: "granted",
      });
    }
  };

  const initializeMarketing = () => {
    // Initialize marketing pixels, etc.
    if (typeof window !== "undefined") {
      // Marketing tracking initialization
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-lg z-50">
      <div className="max-w-7xl mx-auto p-4">
        {!showDetails ? (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm text-gray-700">
                We use cookies to improve your experience and provide
                personalized content. By continuing to browse, you agree to our
                use of necessary cookies.
                <button
                  onClick={() => setShowDetails(true)}
                  className="ml-1 text-blue-600 hover:underline font-medium"
                >
                  Customize preferences
                </button>
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => saveConsent(false)}
                className="px-4 py-2 text-sm bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
              >
                Accept Necessary Only
              </button>
              <button
                onClick={() => saveConsent(true)}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Accept All
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Cookie Preferences</h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close cookie preferences"
              >
                ×
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">
                    Necessary Cookies
                  </h4>
                  <p className="text-sm text-gray-600">
                    Required for website functionality and security.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={true}
                  disabled={true}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">
                    Analytics Cookies
                  </h4>
                  <p className="text-sm text-gray-600">
                    Help us understand how visitors use our website.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) =>
                    setPreferences((prev) => ({
                      ...prev,
                      analytics: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">
                    Marketing Cookies
                  </h4>
                  <p className="text-sm text-gray-600">
                    Used to deliver personalized advertisements.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={(e) =>
                    setPreferences((prev) => ({
                      ...prev,
                      marketing: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => saveConsent(false)}
                className="px-4 py-2 text-sm bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
              >
                Save Preferences
              </button>
              <button
                onClick={() => saveConsent(true)}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Accept All
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Default Privacy Compliance component that wraps CookieConsentBanner
export const PrivacyCompliance: React.FC = () => {
  return <CookieConsentBanner />;
};

// Privacy management utility
export class PrivacyManager {
  static getConsentStatus(): PrivacySettings | null {
    if (typeof window === "undefined") return null;

    const stored = localStorage.getItem("privacy_consent");
    return stored ? JSON.parse(stored) : null;
  }

  static hasConsent(type: keyof ConsentPreferences): boolean {
    const consent = this.getConsentStatus();
    return consent?.preferences[type] || false;
  }

  static revokeConsent(): void {
    if (typeof window === "undefined") return;

    localStorage.removeItem("privacy_consent");

    // Disable tracking
    if ((window as any).gtag) {
      (window as any).gtag("consent", "update", {
        analytics_storage: "denied",
        ad_storage: "denied",
      });
    }

    // Clear tracking cookies
    this.clearTrackingCookies();
  }

  private static clearTrackingCookies(): void {
    const trackingCookies = ["_ga", "_gid", "_gat", "_fbp", "_fbc"];
    trackingCookies.forEach((cookie) => {
      document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
  }

  static isConsentExpired(): boolean {
    const consent = this.getConsentStatus();
    if (!consent) return true;

    const consentDate = new Date(consent.timestamp);
    const now = new Date();
    const daysDiff =
      (now.getTime() - consentDate.getTime()) / (1000 * 3600 * 24);

    // Consent expires after 365 days
    return daysDiff > 365;
  }
}

// Data deletion request component
export const DataDeletionRequest: React.FC = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      // In production, this would submit to a data deletion API
      const response = await fetch("/api/data-deletion-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, timestamp: new Date().toISOString() }),
      });

      if (response.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-4">Request Data Deletion</h3>

      {status === "success" ? (
        <div className="p-4 bg-green-100 text-green-800 rounded">
          Your data deletion request has been submitted. We'll process it within
          30 days.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="deletion-email"
              className="block text-sm font-medium mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="deletion-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {status === "error" && (
            <div className="p-3 bg-red-100 text-red-800 rounded text-sm">
              There was an error processing your request. Please try again.
            </div>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {status === "submitting" ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      )}
    </div>
  );
};
