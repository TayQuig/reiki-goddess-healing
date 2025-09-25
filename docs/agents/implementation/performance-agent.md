# Performance Agent - Implementation

## Agent Type

`performance-agent`

## Core Responsibilities

- Implement code splitting strategies
- Optimize bundle sizes
- Set up lazy loading
- Implement caching mechanisms
- Optimize database queries
- Reduce API response times
- Implement CDN integration
- Set up performance monitoring
- Optimize images and assets
- Implement service workers

## Required Context

- Task ID: [TASK_ID]
- Task Name: [TASK_NAME]
- Description: [TASK_DESCRIPTION]
- Acceptance Criteria: [ACCEPTANCE_CRITERIA]
- Dependencies: [DEPENDENCIES]
- Context Documentation: [CONTEXT_DOCS]
- Performance Targets: [PERFORMANCE_METRICS]
- Current Baselines: [BASELINE_METRICS]

## Implementation Guidelines

### Bundle Optimization

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import compression from "vite-plugin-compression";
import { splitVendorChunkPlugin } from "vite";

export default defineConfig({
  plugins: [
    react(),
    splitVendorChunkPlugin(),
    compression({
      algorithm: "gzip",
      ext: ".gz",
      threshold: 10240,
      deleteOriginFile: false,
    }),
    compression({
      algorithm: "brotliCompress",
      ext: ".br",
      threshold: 10240,
      deleteOriginFile: false,
    }),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    target: "esnext",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ["console.log", "console.info"],
      },
      mangle: {
        safari10: true,
      },
      format: {
        comments: false,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunking strategy
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("react-dom")) {
              return "react-vendor";
            }
            if (id.includes("lodash") || id.includes("date-fns")) {
              return "utils-vendor";
            }
            if (id.includes("@tanstack") || id.includes("axios")) {
              return "data-vendor";
            }
            return "vendor";
          }

          // Application chunking
          if (id.includes("src/components/common")) {
            return "common-components";
          }
          if (id.includes("src/pages")) {
            const match = id.match(/src\/pages\/([^/]+)/);
            if (match) {
              return `page-${match[1]}`;
            }
          }
        },
      },
    },
    chunkSizeWarningLimit: 500,
    reportCompressedSize: true,
    sourcemap: false,
  },
});
```

### Lazy Loading Implementation

```typescript
// routes/AppRoutes.tsx
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { PageLoader } from '@/components/PageLoader';

// Lazy load pages with prefetch
const HomePage = lazy(() =>
  import(/* webpackPrefetch: true */ '@/pages/HomePage')
);

const AboutPage = lazy(() =>
  import(/* webpackPrefetch: true */ '@/pages/AboutPage')
);

const BookingPage = lazy(() =>
  import(/* webpackChunkName: "booking" */ '@/pages/BookingPage')
);

const AdminDashboard = lazy(() =>
  import(
    /* webpackChunkName: "admin" */
    /* webpackPreload: true */
    '@/pages/admin/Dashboard'
  )
);

export const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
      </Routes>
    </Suspense>
  );
};

// Component-level lazy loading
const HeavyComponent = lazy(() =>
  import('@/components/HeavyComponent').then(module => ({
    default: module.HeavyComponent
  }))
);

// Usage with error boundary
export const LazyComponentWrapper = () => {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <Suspense fallback={<ComponentLoader />}>
        <HeavyComponent />
      </Suspense>
    </ErrorBoundary>
  );
};
```

### Image Optimization

```typescript
// components/OptimizedImage.tsx
import { useState, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  lazy?: boolean;
  className?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  lazy = true,
  className
}) => {
  const [isIntersecting, setIsIntersecting] = useState(!lazy);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>('');

  // Generate responsive image sources
  const generateSrcSet = () => {
    const baseUrl = src.replace(/\.\w+$/, '');
    const extension = src.match(/\.\w+$/)?.[0] || '.jpg';

    return {
      srcSet: `
        ${baseUrl}-320w${extension} 320w,
        ${baseUrl}-640w${extension} 640w,
        ${baseUrl}-1280w${extension} 1280w,
        ${baseUrl}-1920w${extension} 1920w
      `,
      sizes: `
        (max-width: 320px) 320px,
        (max-width: 640px) 640px,
        (max-width: 1280px) 1280px,
        1920px
      `
    };
  };

  useEffect(() => {
    if (!lazy) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px'
      }
    );

    const element = document.querySelector(`[data-image-id="${src}"]`);
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [src, lazy]);

  useEffect(() => {
    if (!isIntersecting) return;

    // Load low-quality placeholder first
    const placeholder = `${src}?w=20&blur=10`;
    setCurrentSrc(placeholder);

    // Then load full image
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setCurrentSrc(src);
      setHasLoaded(true);
    };
  }, [isIntersecting, src]);

  const { srcSet, sizes } = generateSrcSet();

  return (
    <picture className={className} data-image-id={src}>
      <source
        type="image/webp"
        srcSet={srcSet.replace(/\.jpg/g, '.webp')}
        sizes={sizes}
      />
      <source
        type="image/jpeg"
        srcSet={srcSet}
        sizes={sizes}
      />
      <img
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        loading={lazy ? 'lazy' : 'eager'}
        decoding="async"
        className={`
          transition-opacity duration-300
          ${hasLoaded ? 'opacity-100' : 'opacity-0'}
        `}
      />
    </picture>
  );
};
```

### API Response Caching

```typescript
// utils/api-cache.ts
export class APICache {
  private cache = new Map<string, CacheEntry>();
  private readonly defaultTTL = 5 * 60 * 1000; // 5 minutes

  async get<T>(
    key: string,
    fetcher: () => Promise<T>,
    options?: CacheOptions
  ): Promise<T> {
    const cached = this.cache.get(key);

    if (cached && !this.isExpired(cached)) {
      return cached.data as T;
    }

    // Implement stale-while-revalidate
    if (cached && options?.staleWhileRevalidate) {
      this.revalidateInBackground(key, fetcher);
      return cached.data as T;
    }

    const data = await fetcher();
    this.set(key, data, options?.ttl);

    return data;
  }

  private set(key: string, data: any, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    });

    // Implement LRU eviction if cache is too large
    if (this.cache.size > 100) {
      const oldestKey = Array.from(this.cache.entries()).sort(
        ([, a], [, b]) => a.timestamp - b.timestamp
      )[0][0];
      this.cache.delete(oldestKey);
    }
  }

  private isExpired(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  private async revalidateInBackground(
    key: string,
    fetcher: () => Promise<any>
  ): Promise<void> {
    try {
      const data = await fetcher();
      this.set(key, data);
    } catch (error) {
      console.error("Background revalidation failed:", error);
    }
  }

  // Cache invalidation patterns
  invalidate(pattern: string | RegExp): void {
    const keys = Array.from(this.cache.keys());

    keys.forEach((key) => {
      if (
        typeof pattern === "string" ? key.includes(pattern) : pattern.test(key)
      ) {
        this.cache.delete(key);
      }
    });
  }
}

// React Query integration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (error.status === 404) return false;
        if (failureCount >= 3) return false;
        return true;
      },
    },
  },
});
```

### Database Query Optimization

```typescript
// repositories/optimized.repository.ts
export class OptimizedRepository {
  // Use database query builder for complex queries
  async getResourcesWithStats(userId: string): Promise<ResourceWithStats[]> {
    const query = `
      WITH resource_stats AS (
        SELECT 
          r.id,
          COUNT(DISTINCT v.id) as view_count,
          COUNT(DISTINCT c.id) as comment_count,
          AVG(rt.rating) as avg_rating
        FROM resources r
        LEFT JOIN views v ON v.resource_id = r.id
        LEFT JOIN comments c ON c.resource_id = r.id
        LEFT JOIN ratings rt ON rt.resource_id = r.id
        WHERE r.user_id = $1
        GROUP BY r.id
      )
      SELECT 
        r.*,
        rs.view_count,
        rs.comment_count,
        rs.avg_rating,
        json_agg(
          json_build_object(
            'id', t.id,
            'name', t.name
          )
        ) FILTER (WHERE t.id IS NOT NULL) as tags
      FROM resources r
      JOIN resource_stats rs ON rs.id = r.id
      LEFT JOIN resource_tags rt ON rt.resource_id = r.id
      LEFT JOIN tags t ON t.id = rt.tag_id
      WHERE r.user_id = $1
      GROUP BY r.id, rs.view_count, rs.comment_count, rs.avg_rating
      ORDER BY r.created_at DESC
      LIMIT 20
    `;

    const result = await this.pool.query(query, [userId]);
    return result.rows;
  }

  // Implement cursor-based pagination for large datasets
  async getPaginatedResources(
    cursor?: string,
    limit: number = 20
  ): Promise<PaginatedResult> {
    const query = cursor
      ? `SELECT * FROM resources 
         WHERE created_at < $1 
         ORDER BY created_at DESC 
         LIMIT $2`
      : `SELECT * FROM resources 
         ORDER BY created_at DESC 
         LIMIT $1`;

    const params = cursor ? [cursor, limit + 1] : [limit + 1];
    const result = await this.pool.query(query, params);

    const hasMore = result.rows.length > limit;
    const items = hasMore ? result.rows.slice(0, -1) : result.rows;
    const nextCursor = hasMore ? items[items.length - 1].created_at : null;

    return {
      items,
      nextCursor,
      hasMore,
    };
  }

  // Batch operations to reduce round trips
  async batchCreate(items: Resource[]): Promise<Resource[]> {
    const values = items
      .map((item, index) => {
        const offset = index * 4;
        return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4})`;
      })
      .join(", ");

    const params = items.flatMap((item) => [
      item.name,
      item.description,
      item.type,
      item.userId,
    ]);

    const query = `
      INSERT INTO resources (name, description, type, user_id)
      VALUES ${values}
      RETURNING *
    `;

    const result = await this.pool.query(query, params);
    return result.rows;
  }
}
```

### Service Worker Implementation

```typescript
// sw.ts
/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope;

const CACHE_NAME = "rgh-v1";
const STATIC_ASSETS = ["/", "/index.html", "/manifest.json", "/offline.html"];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - implement caching strategies
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Network-first for API calls
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Cache-first for static assets
  if (
    request.destination === "image" ||
    request.destination === "font" ||
    request.destination === "style" ||
    request.destination === "script"
  ) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Stale-while-revalidate for HTML
  if (request.mode === "navigate") {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }
});

async function cacheFirst(request: Request): Promise<Response> {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response("Offline", { status: 503 });
  }
}

async function networkFirst(request: Request): Promise<Response> {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    return new Response("Offline", { status: 503 });
  }
}

async function staleWhileRevalidate(request: Request): Promise<Response> {
  const cached = await caches.match(request);

  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      const cache = caches.open(CACHE_NAME);
      cache.then((c) => c.put(request, response.clone()));
    }
    return response;
  });

  return cached || fetchPromise;
}
```

### Performance Monitoring

```typescript
// monitoring/performance.monitor.ts
export class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    fcp: 0,
    lcp: 0,
    fid: 0,
    cls: 0,
    ttfb: 0,
  };

  init(): void {
    this.observeWebVitals();
    this.trackResourceTiming();
    this.monitorLongTasks();
    this.trackMemoryUsage();
  }

  private observeWebVitals(): void {
    // First Contentful Paint
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === "first-contentful-paint") {
          this.metrics.fcp = entry.startTime;
          this.reportMetric("FCP", entry.startTime);
        }
      }
    }).observe({ entryTypes: ["paint"] });

    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.lcp = lastEntry.startTime;
      this.reportMetric("LCP", lastEntry.startTime);
    }).observe({ entryTypes: ["largest-contentful-paint"] });

    // First Input Delay
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.metrics.fid = entry.processingStart - entry.startTime;
        this.reportMetric("FID", this.metrics.fid);
      }
    }).observe({ entryTypes: ["first-input"] });

    // Cumulative Layout Shift
    let clsValue = 0;
    let clsEntries: LayoutShift[] = [];
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as LayoutShift[]) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          clsEntries.push(entry);
        }
      }
      this.metrics.cls = clsValue;
      this.reportMetric("CLS", clsValue);
    }).observe({ entryTypes: ["layout-shift"] });
  }

  private trackResourceTiming(): void {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 100) {
          this.reportSlowResource({
            name: entry.name,
            duration: entry.duration,
            type: entry.initiatorType,
          });
        }
      }
    }).observe({ entryTypes: ["resource"] });
  }

  private monitorLongTasks(): void {
    if ("PerformanceObserver" in window) {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.reportLongTask({
            duration: entry.duration,
            startTime: entry.startTime,
            attribution: entry.attribution,
          });
        }
      }).observe({ entryTypes: ["longtask"] });
    }
  }

  private trackMemoryUsage(): void {
    if ("memory" in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
          this.reportMemoryWarning({
            used: memory.usedJSHeapSize,
            total: memory.totalJSHeapSize,
            limit: memory.jsHeapSizeLimit,
          });
        }
      }, 10000);
    }
  }

  private reportMetric(name: string, value: number): void {
    // Send to analytics
    if (window.gtag) {
      window.gtag("event", name, {
        value: Math.round(value),
        metric_name: name,
        metric_value: value,
      });
    }

    // Send to custom monitoring
    fetch("/api/metrics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, value, timestamp: Date.now() }),
    });
  }
}
```

## Quality Checks

1. **Performance Metrics**

   ```bash
   npm run lighthouse
   npm run bundle-analyze
   ```

2. **Core Web Vitals**
   - LCP < 2.5s
   - FID < 100ms
   - CLS < 0.1

3. **Bundle Size**
   - Initial bundle < 200KB
   - Lazy chunks < 100KB each
   - Total size < 1MB

4. **Network Performance**
   - API response time < 200ms
   - Time to interactive < 3s
   - First byte < 600ms

5. **Runtime Performance**
   - 60fps scrolling
   - No jank in animations
   - Memory usage stable

## Output Format

### Deliverables

1. **Optimization Files**
   - `config/vite.config.ts` - Build optimization
   - `components/performance/*` - Optimized components
   - `utils/cache.ts` - Caching utilities
   - `workers/service-worker.ts` - PWA support
   - `monitoring/performance.ts` - Monitoring setup

2. **Documentation**
   - Performance budget documentation
   - Optimization strategies guide
   - Monitoring dashboard setup
   - Troubleshooting guide

3. **Reports**
   - Bundle analysis report
   - Lighthouse scores
   - Performance metrics baseline
   - Optimization recommendations

4. **Integration Points**
   ```typescript
   interface PerformanceOutputs {
     optimizations: OptimizationConfig[];
     monitoring: MonitoringSetup;
     caching: CacheStrategy[];
     metrics: PerformanceMetrics;
   }
   ```

### Success Metrics

- [ ] All Core Web Vitals in green
- [ ] Bundle size under budget
- [ ] 90+ Lighthouse performance score
- [ ] <3s time to interactive
- [ ] Effective caching strategy
- [ ] Service worker implemented
- [ ] Performance monitoring active
- [ ] No performance regressions

## Common Optimization Patterns

### Render Optimization

```typescript
// Use React.memo with custom comparison
export const ExpensiveComponent = React.memo(
  ({ data, onUpdate }: Props) => {
    // Component implementation
  },
  (prevProps, nextProps) => {
    return (
      prevProps.data.id === nextProps.data.id &&
      prevProps.data.updatedAt === nextProps.data.updatedAt
    );
  }
);

// Virtual scrolling for long lists
import { VirtualList } from '@tanstack/react-virtual';

export const LongList = ({ items }: { items: Item[] }) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 5
  });

  return (
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map(virtualItem => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualItem.start}px)`
            }}
          >
            <ItemComponent item={items[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  );
};
```

### Request Optimization

```typescript
// Debounce search requests
const debouncedSearch = useMemo(
  () =>
    debounce((query: string) => {
      searchAPI(query);
    }, 300),
  []
);

// Batch API requests
class BatchRequestor {
  private queue: Request[] = [];
  private timer: NodeJS.Timeout | null = null;

  add(request: Request): Promise<Response> {
    return new Promise((resolve, reject) => {
      this.queue.push({ ...request, resolve, reject });
      this.scheduleFlush();
    });
  }

  private scheduleFlush(): void {
    if (this.timer) return;

    this.timer = setTimeout(() => {
      this.flush();
    }, 10);
  }

  private async flush(): Promise<void> {
    const batch = this.queue.splice(0);
    this.timer = null;

    try {
      const responses = await this.executeBatch(batch);
      batch.forEach((req, i) => req.resolve(responses[i]));
    } catch (error) {
      batch.forEach((req) => req.reject(error));
    }
  }
}
```

## Dependencies

- Vite 4+
- React 18+
- Workbox for PWA
- Bundle analyzers
- Performance monitoring tools
- Image optimization tools
- Compression plugins
