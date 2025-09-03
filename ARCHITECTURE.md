# Architecture Patterns & Technical Decisions

This document captures architectural patterns, code conventions, and technical decisions used in The Reiki Goddess Healing project. For visual design patterns, see [style-guide.md](./style-guide.md).

## 📚 Table of Contents

1. [Design System Architecture](#design-system-architecture)
2. [Build & Configuration Patterns](#build--configuration-patterns)
3. [Component Architecture](#component-architecture)
4. [Routing & Navigation](#routing--navigation)
5. [Performance Patterns](#performance-patterns)
6. [Security Architecture](#security-architecture)
7. [Testing Patterns](#testing-patterns)
8. [Development Automation](#development-automation)
9. [Asset Management](#asset-management)
10. [State Management](#state-management)

---

## Design System Architecture

### Dual Design System Pattern (Legacy + Modern)

The codebase maintains backward compatibility with Anima-generated CSS variables while providing modern, typed design tokens:

```typescript
// Modern design system tokens
export const colors = {
  brand: { 
    blue: "rgba(2, 5, 183, 1)",
    purple: "rgba(165, 147, 224, 1)"
  },
  background: { 
    primary: "#FFFBF5",
    white: "#FFFFFF" 
  }
};

// Legacy Anima variable support in tailwind.config.js
extend: {
  colors: {
    "variable-collection-color": "var(--variable-collection-color)",
    "variable-collection-color-duplicate": "var(--variable-collection-color-duplicate)"
  }
}
```

**Why**: Enables gradual migration from legacy code without breaking existing components.

---

## Build & Configuration Patterns

### TypeScript Project References with Composite Pattern

Advanced monorepo build optimization using TypeScript project references:

```json
// Root tsconfig.json
{
  "files": [],
  "references": [
    { "path": "./packages/shared-components" },
    { "path": "./packages/design-system" },
    { "path": "./packages/shared-utils" },
    { "path": "./packages/shared-assets" }
  ],
  "compilerOptions": {
    "composite": true,
    "declarationMap": true,
    "incremental": true
  }
}
```

**Benefits**:
- Incremental builds (only rebuild changed packages)
- Better IDE performance
- Proper dependency management
- Build parallelization

### Shared Vitest Configuration Factory

Centralized test configuration with package-specific customization:

```typescript
// vitest.config.shared.ts
import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export const createVitestConfig = (packagePath: string) => {
  return defineConfig({
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: [resolve(packagePath, 'src/test-setup.ts')]
    },
    resolve: {
      alias: {
        "@reiki-goddess/shared-components": resolve(__dirname, "packages/shared-components/src"),
        "@reiki-goddess/design-system": resolve(__dirname, "packages/design-system/src")
      }
    }
  });
};

// Usage in package
import { createVitestConfig } from '../../vitest.config.shared';
export default createVitestConfig(__dirname);
```

**Why**: Maintains consistency across packages while allowing customization.

---

## Component Architecture

### Component Index Export Categorization

Organized exports with semantic grouping and co-located types:

```typescript
// packages/shared-components/src/index.ts

// Layout components
export { AppLayout } from "./AppLayout";
export type { AppLayoutProps } from "./AppLayout";

// Figma-sourced components
export { Header, ResponsiveHeader } from "./Header";
export type { HeaderProps, NavigationItem } from "./Header";

// Service components
export { ServicesSection } from "./Services";
export type { ServiceCardProps, ServiceData } from "./Services";

// Animation utilities
export { AnimatedSection } from "./AnimatedSection";
export { useIntersectionObserver } from "./useIntersectionObserver";

// Complete page compositions
export { Homepage } from "./Homepage";
export { AboutPage, ServicesPage, EventsPage } from "./pages";
```

**Benefits**:
- Clear organization for consumers
- Co-located type exports
- Semantic grouping aids discovery
- Single import source

### Responsive Header Overlay Pattern

Layout technique for seamless header/content integration:

```typescript
export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-cream">
      {/* Header in fixed container */}
      <div className="relative z-50" style={{ maxWidth: "1440px", margin: "0 auto" }}>
        <Header />
      </div>
      
      {/* Main content with negative margin compensation */}
      <main className="flex-1" style={{ marginTop: "-93px" }}>
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};
```

**Why**: Allows hero images to extend under navigation while maintaining layout integrity.

---

## Routing & Navigation

### Router-Based Active State Management

Navigation active states computed from router location, not manual state:

```typescript
interface NavigationItem {
  label: string;
  href: string;
  isActive?: (pathname: string) => boolean;
}

const navigationItems: NavigationItem[] = [
  { 
    label: "Home", 
    href: "/", 
    isActive: (pathname) => pathname === "/"
  },
  { 
    label: "Blog", 
    href: "/blog", 
    isActive: (pathname) => pathname.startsWith("/blog") // Handles sub-routes
  },
  { 
    label: "Services", 
    href: "/services", 
    isActive: (pathname) => pathname === "/services" || pathname.startsWith("/services/")
  }
];

// Usage in component
const location = useLocation();
const activeItem = navigationItems.find(item => 
  item.isActive ? item.isActive(location.pathname) : item.href === location.pathname
);
```

**Benefits**:
- Single source of truth (router)
- Handles complex routing patterns
- No state synchronization issues

### Page Transition Animation System

Standardized enter/exit animations using framer-motion:

```typescript
const pageVariants = {
  initial: { 
    opacity: 0, 
    y: 20 
  },
  animate: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.6, 
      ease: "easeOut" 
    } 
  },
  exit: { 
    opacity: 0, 
    y: -20, 
    transition: { 
      duration: 0.4, 
      ease: "easeIn" 
    } 
  }
};

// Wrapper component
export const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      {children}
    </motion.div>
  );
};
```

**Timing**: 0.6s enter / 0.4s exit for optimal perceived performance.

---

## Performance Patterns

### Intersection Observer Hook with Cleanup

Performance-optimized scroll animations with automatic cleanup:

```typescript
export const useIntersectionObserver = ({
  threshold = 0.1,
  rootMargin = "0px",
  triggerOnce = true, // Key optimization
}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        
        // Auto-cleanup for one-time animations
        if (triggerOnce && entry.isIntersecting) {
          observer.unobserve(element);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    
    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return { ref: elementRef, isIntersecting };
};
```

**Why**: Prevents memory leaks and reduces ongoing computation for revealed elements.

### Asset Caching Strategy

Differential caching based on asset type volatility:

```javascript
// vercel.json or similar
{
  "headers": [
    {
      "source": "/(.*\\.(js|css|woff|woff2))",
      "headers": [{
        "key": "Cache-Control",
        "value": "public, max-age=31536000, immutable" // 1 year for stable assets
      }]
    },
    {
      "source": "/(.*\\.(jpg|jpeg|png|webp))",
      "headers": [{
        "key": "Cache-Control",
        "value": "public, max-age=86400, must-revalidate" // 24 hours for images
      }]
    },
    {
      "source": "/api/(.*)",
      "headers": [{
        "key": "Cache-Control",
        "value": "no-store, must-revalidate" // No caching for API
      }]
    }
  ]
}
```

**Strategy**: Aggressive caching for code, moderate for content, none for dynamic data.

---

## Security Architecture

### Security-First Form Validation

Multi-layered validation with wellness industry-specific patterns:

```typescript
export class SecurityValidator {
  // Industry-specific forbidden terms
  private static readonly forbiddenHealthTerms = /\b(diagnosis|prescription|medication|cure|treat)\b/i;
  
  // Multi-level risk assessment
  static validateContactFormField(
    fieldName: string, 
    value: string
  ): ValidationResult {
    const risks: Risk[] = [];
    
    // Check for medical terms (liability risk)
    if (this.forbiddenHealthTerms.test(value)) {
      risks.push({
        level: "HIGH",
        type: "MEDICAL_TERMS",
        message: "Please avoid medical terminology"
      });
    }
    
    // Check for SQL injection patterns
    if (/(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION)\b|--|\/\*|\*\/)/i.test(value)) {
      risks.push({
        level: "HIGH",
        type: "SQL_INJECTION",
        message: "Invalid characters detected"
      });
    }
    
    // XSS prevention
    const sanitized = this.sanitizeInput(value);
    
    return {
      isValid: risks.filter(r => r.level === "HIGH").length === 0,
      risks,
      sanitizedValue: sanitized,
      riskLevel: this.calculateOverallRisk(risks)
    };
  }
  
  private static sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .trim();
  }
}
```

**Why**: Protects against liability (medical claims) and security threats.

### Client-Side Rate Limiting

Browser-based rate limiting with user feedback:

```typescript
export class FormRateLimit {
  private static readonly STORAGE_KEY = 'form_submissions';
  private static readonly MAX_SUBMISSIONS = 3;
  private static readonly TIME_WINDOW_MS = 60 * 60 * 1000; // 1 hour
  
  static canSubmit(): { allowed: boolean; timeUntilReset?: number } {
    const now = Date.now();
    const submissions = this.getSubmissions();
    
    // Clean old submissions
    const recentSubmissions = submissions.filter(
      time => now - time < this.TIME_WINDOW_MS
    );
    
    if (recentSubmissions.length >= this.MAX_SUBMISSIONS) {
      const oldestSubmission = Math.min(...recentSubmissions);
      const timeUntilReset = (oldestSubmission + this.TIME_WINDOW_MS) - now;
      
      return { 
        allowed: false, 
        timeUntilReset: Math.ceil(timeUntilReset / 1000 / 60) // minutes
      };
    }
    
    return { allowed: true };
  }
  
  static recordSubmission(): void {
    const submissions = this.getSubmissions();
    submissions.push(Date.now());
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(submissions));
  }
  
  private static getSubmissions(): number[] {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  }
}
```

**Benefits**: Prevents spam while providing clear user feedback.

### Security Incident Logging

Client-side security monitoring for analysis:

```typescript
export class SecurityMonitor {
  private static readonly MAX_INCIDENTS = 10;
  
  static logIncident(type: string, details: Record<string, any>): void {
    const incident = {
      type,
      details,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };
    
    // Use session storage for privacy (cleared on close)
    const incidents = this.getIncidents();
    incidents.push(incident);
    
    // Keep only recent incidents
    const recentIncidents = incidents.slice(-this.MAX_INCIDENTS);
    sessionStorage.setItem('securityIncidents', JSON.stringify(recentIncidents));
    
    // Could also send to monitoring service
    if (this.shouldReport(type)) {
      this.reportToMonitoring(incident);
    }
  }
  
  private static shouldReport(type: string): boolean {
    const criticalTypes = ['XSS_ATTEMPT', 'SQL_INJECTION', 'RATE_LIMIT_EXCEEDED'];
    return criticalTypes.includes(type);
  }
}
```

**Why**: Helps identify attack patterns without compromising user privacy.

### Security Headers Configuration

Production-ready headers for wellness websites:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=(), payment=()" },
        { 
          "key": "Content-Security-Policy", 
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.reikigoddesshealing.com"
        }
      ]
    }
  ]
}
```

**Note**: Restrictive permissions appropriate for wellness sites (no camera/microphone needed).

---

## Testing Patterns

### Test Utility Router Wrapper

Reusable wrapper for testing router-dependent components:

```typescript
// test-utils/RouterWrapper.tsx
import { MemoryRouter, MemoryRouterProps } from 'react-router-dom';

interface RouterWrapperProps {
  children: React.ReactNode;
  initialEntries?: MemoryRouterProps['initialEntries'];
  initialIndex?: number;
}

export const RouterWrapper: React.FC<RouterWrapperProps> = ({
  children,
  initialEntries = ['/'],
  initialIndex = 0,
}) => {
  return (
    <MemoryRouter 
      initialEntries={initialEntries} 
      initialIndex={initialIndex}
    >
      {children}
    </MemoryRouter>
  );
};

// Usage in tests
const { getByText } = render(
  <RouterWrapper initialEntries={['/about']}>
    <Header />
  </RouterWrapper>
);
```

**Benefits**: Consistent router setup across tests with sensible defaults.

### Test Documentation Pattern

Document failures instead of modifying tests (see [testing/README.md](./testing/README.md)):

```typescript
// Never do this:
test('should display correct text', () => {
  // ❌ Changing test to match broken behavior
  expect(screen.getByText('Sevices')).toBeInTheDocument(); 
});

// Do this instead:
test('should display correct text', () => {
  // ✅ Test remains correct, failure gets documented
  expect(screen.getByText('Services')).toBeInTheDocument();
});
// Failure documented in testing/components/Header.md
```

**Principle**: Tests represent requirements. Fix the code, not the test.

---

## Development Automation

### Claude Code Hook System

Event-driven automation for AI-assisted development:

```json
// .claude/settings.json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [{
          "type": "command",
          "command": "$CLAUDE_PROJECT_DIR/.claude/hook.sh PostToolUse Write",
          "timeout": 30
        }]
      },
      {
        "matcher": "Bash",
        "hooks": [{
          "type": "command",
          "command": "$CLAUDE_PROJECT_DIR/.claude/hook.sh PostToolUse Bash"
        }]
      }
    ]
  }
}
```

**Automations**:
- Git commit enforcement at thresholds
- Test failure documentation
- Documentation freshness checks
- Session summaries

### Automated Git Commit Patterns

Smart commit message generation based on file patterns:

```python
# .claude/hooks/git-enforce.py
def generate_commit_message(files):
    patterns = {
        r'\.test\.(ts|tsx)$': 'test',
        r'components/.*\.tsx$': 'feat',
        r'\.md$': 'docs',
        r'config|\.json$': 'chore'
    }
    
    # Determine primary type
    type_counts = defaultdict(int)
    for file in files:
        for pattern, commit_type in patterns.items():
            if re.search(pattern, file):
                type_counts[commit_type] += 1
    
    primary_type = max(type_counts.items(), key=lambda x: x[1])[0]
    return f"{primary_type}({scope}): {description}"
```

---

## Asset Management

### Image Optimization Strategy

Multi-format support with progressive enhancement:

```typescript
// components/LazyImage.tsx
export const LazyImage: React.FC<ImageProps> = ({
  src,
  alt,
  sizes,
  className
}) => {
  const imageUrl = src.startsWith('/') ? src : `/img/${src}`;
  
  return (
    <picture>
      {/* Modern format */}
      <source
        type="image/webp"
        srcSet={`${imageUrl.replace(/\.[^.]+$/, '.webp')}`}
        sizes={sizes}
      />
      
      {/* Fallback */}
      <img
        src={imageUrl}
        alt={alt}
        className={className}
        loading="lazy"
        decoding="async"
      />
    </picture>
  );
};
```

**Strategy**: Serve modern formats to capable browsers, fallback for compatibility.

---

## State Management

### Local State with Context Pattern

Lightweight state management without external dependencies:

```typescript
// contexts/AppContext.tsx
interface AppState {
  user: User | null;
  isLoading: boolean;
  notifications: Notification[];
}

interface AppContextValue extends AppState {
  setUser: (user: User | null) => void;
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    user: null,
    isLoading: false,
    notifications: []
  });
  
  const value = useMemo(() => ({
    ...state,
    setUser: (user) => setState(prev => ({ ...prev, user })),
    addNotification: (notification) => setState(prev => ({ 
      ...prev, 
      notifications: [...prev.notifications, notification] 
    })),
    removeNotification: (id) => setState(prev => ({
      ...prev,
      notifications: prev.notifications.filter(n => n.id !== id)
    }))
  }), [state]);
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook for type safety
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
```

**Why**: Simple, type-safe, and sufficient for current needs without Redux complexity.

---

## Summary

These architectural patterns represent thoughtful decisions that balance:

1. **Developer Experience**: Shared configs, type safety, automation
2. **Performance**: Caching strategies, lazy loading, cleanup patterns
3. **Security**: Multi-layered validation, monitoring, industry-specific concerns
4. **Maintainability**: Clear organization, gradual migration paths
5. **User Experience**: Smooth animations, helpful feedback, accessibility

Each pattern has been battle-tested in production and should be followed for consistency across the codebase.

---

_Last Updated: 2025-09-02_
_This is a living document. Update as new patterns emerge._