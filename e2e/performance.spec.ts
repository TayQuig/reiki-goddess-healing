import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('should meet Core Web Vitals thresholds', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Get Core Web Vitals metrics
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        const vitals = {
          LCP: 0,
          FID: 0,
          CLS: 0,
          FCP: 0,
          TTFB: 0
        };
        
        // Largest Contentful Paint
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          vitals.LCP = lastEntry.startTime;
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        
        // First Input Delay (if interaction occurs)
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            vitals.FID = entry.processingStart - entry.startTime;
          });
        }).observe({ entryTypes: ['first-input'] });
        
        // Cumulative Layout Shift
        let cumulativeLayoutShift = 0;
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (!entry.hadRecentInput) {
              cumulativeLayoutShift += entry.value;
            }
          });
          vitals.CLS = cumulativeLayoutShift;
        }).observe({ entryTypes: ['layout-shift'] });
        
        // First Contentful Paint
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.name === 'first-contentful-paint') {
              vitals.FCP = entry.startTime;
            }
          });
        }).observe({ entryTypes: ['paint'] });
        
        // Time to First Byte
        const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        vitals.TTFB = navigationEntry.responseStart - navigationEntry.requestStart;
        
        // Wait a bit for metrics to be captured
        setTimeout(() => resolve(vitals), 3000);
      });
    });
    
    // Assert Core Web Vitals thresholds
    // LCP should be less than 2.5 seconds (2500ms)
    expect(metrics.LCP).toBeLessThan(2500);
    
    // CLS should be less than 0.1
    expect(metrics.CLS).toBeLessThan(0.1);
    
    // FCP should be less than 1.8 seconds (1800ms)
    expect(metrics.FCP).toBeLessThan(1800);
    
    // TTFB should be less than 800ms
    expect(metrics.TTFB).toBeLessThan(800);
  });

  test('should load images efficiently', async ({ page }) => {
    await page.goto('/');
    
    // Get all images
    const images = await page.locator('img').all();
    
    for (const img of images) {
      // Check if image has proper attributes
      const src = await img.getAttribute('src');
      const alt = await img.getAttribute('alt');
      const loading = await img.getAttribute('loading');
      const width = await img.getAttribute('width');
      const height = await img.getAttribute('height');
      
      // Images should have src
      expect(src).toBeTruthy();
      
      // Images should have alt text (or be decorative)
      expect(alt !== null).toBeTruthy();
      
      // Non-critical images should have lazy loading
      const isAboveFold = await img.evaluate((el) => {
        const rect = el.getBoundingClientRect();
        return rect.top < window.innerHeight;
      });
      
      if (!isAboveFold) {
        expect(loading).toBe('lazy');
      }
      
      // Images should have explicit dimensions to prevent layout shift
      expect(width || height).toBeTruthy();
    }
  });

  test('should minimize JavaScript bundle size', async ({ page }) => {
    // Track network requests
    const jsRequests: { url: string; size: number }[] = [];
    
    page.on('response', async (response) => {
      const url = response.url();
      const contentType = response.headers()['content-type'];
      
      if (contentType?.includes('javascript')) {
        try {
          const buffer = await response.body();
          jsRequests.push({
            url: url,
            size: buffer.length
          });
        } catch (error) {
          // Some responses might not have body (e.g., from cache)
        }
      }
    });
    
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Calculate total JavaScript size
    const totalJsSize = jsRequests.reduce((sum, req) => sum + req.size, 0);
    const totalJsSizeKB = Math.round(totalJsSize / 1024);
    
    // Total JS should be under 500KB for good performance
    expect(totalJsSizeKB).toBeLessThan(500);
    
    // Check for code splitting - should have multiple smaller chunks rather than one large bundle
    const largeJsFiles = jsRequests.filter(req => req.size > 200 * 1024); // 200KB
    expect(largeJsFiles.length).toBeLessThanOrEqual(1); // At most one large file (main bundle)
  });

  test('should minimize CSS bundle size', async ({ page }) => {
    const cssRequests: { url: string; size: number }[] = [];
    
    page.on('response', async (response) => {
      const url = response.url();
      const contentType = response.headers()['content-type'];
      
      if (contentType?.includes('css')) {
        try {
          const buffer = await response.body();
          cssRequests.push({
            url: url,
            size: buffer.length
          });
        } catch (error) {
          // Some responses might not have body
        }
      }
    });
    
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Calculate total CSS size
    const totalCssSize = cssRequests.reduce((sum, req) => sum + req.size, 0);
    const totalCssSizeKB = Math.round(totalCssSize / 1024);
    
    // Total CSS should be under 100KB
    expect(totalCssSizeKB).toBeLessThan(100);
  });

  test('should load without render-blocking resources', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Check for render-blocking resources
    const renderBlockingResources = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
      const scripts = Array.from(document.querySelectorAll('script[src]'));
      
      const blockingLinks = links.filter(link => 
        !link.hasAttribute('media') || 
        link.getAttribute('media') === 'all' ||
        link.getAttribute('media') === 'screen'
      );
      
      const blockingScripts = scripts.filter(script => 
        !script.hasAttribute('async') && 
        !script.hasAttribute('defer')
      );
      
      return {
        blockingCSS: blockingLinks.length,
        blockingJS: blockingScripts.length
      };
    });
    
    // Should minimize render-blocking CSS
    expect(renderBlockingResources.blockingCSS).toBeLessThanOrEqual(2);
    
    // Should minimize render-blocking JavaScript
    expect(renderBlockingResources.blockingJS).toBeLessThanOrEqual(1);
  });

  test('should have efficient caching headers', async ({ page }) => {
    const responses: { url: string; headers: Record<string, string> }[] = [];
    
    page.on('response', (response) => {
      responses.push({
        url: response.url(),
        headers: response.headers()
      });
    });
    
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Check static assets have proper caching
    const staticAssets = responses.filter(resp => 
      resp.url.match(/\.(js|css|png|jpg|jpeg|gif|webp|svg|woff|woff2|ttf|eot)$/i)
    );
    
    staticAssets.forEach(asset => {
      const cacheControl = asset.headers['cache-control'];
      
      // Static assets should have long cache times
      expect(cacheControl).toBeTruthy();
      
      // Should have max-age for immutable assets
      if (asset.url.includes('/static/') || asset.url.match(/\.[a-f0-9]{8,}\./)) {
        expect(cacheControl).toContain('max-age');
        
        // Parse max-age value
        const maxAgeMatch = cacheControl.match(/max-age=(\d+)/);
        if (maxAgeMatch) {
          const maxAge = parseInt(maxAgeMatch[1]);
          expect(maxAge).toBeGreaterThan(86400); // At least 1 day
        }
      }
    });
  });

  test('should preload critical resources', async ({ page }) => {
    await page.goto('/');
    
    // Check for preload hints
    const preloadLinks = await page.locator('link[rel="preload"]').all();
    
    // Should preload critical resources
    expect(preloadLinks.length).toBeGreaterThan(0);
    
    for (const link of preloadLinks) {
      const as = await link.getAttribute('as');
      const href = await link.getAttribute('href');
      
      // Preload should specify resource type
      expect(as).toBeTruthy();
      expect(href).toBeTruthy();
      
      // Common critical resources to preload
      const criticalTypes = ['font', 'style', 'script', 'image'];
      expect(criticalTypes).toContain(as);
    }
  });

  test('should minimize DOM complexity', async ({ page }) => {
    await page.goto('/');
    
    const domStats = await page.evaluate(() => {
      const allElements = document.querySelectorAll('*');
      const nestedElements = Array.from(allElements).filter(el => {
        let depth = 0;
        let parent = el.parentElement;
        while (parent) {
          depth++;
          parent = parent.parentElement;
        }
        return depth > 15; // More than 15 levels deep
      });
      
      return {
        totalElements: allElements.length,
        deeplyNested: nestedElements.length,
        maxDepth: Math.max(...Array.from(allElements).map(el => {
          let depth = 0;
          let parent = el.parentElement;
          while (parent) {
            depth++;
            parent = parent.parentElement;
          }
          return depth;
        }))
      };
    });
    
    // Total DOM elements should be reasonable
    expect(domStats.totalElements).toBeLessThan(2000);
    
    // Minimize deeply nested elements
    expect(domStats.deeplyNested).toBeLessThan(50);
    
    // Maximum depth should be reasonable
    expect(domStats.maxDepth).toBeLessThan(25);
  });

  test('should have fast Time to Interactive', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Simulate user interaction to measure responsiveness
    const button = page.locator('button').first();
    
    if (await button.count() > 0) {
      const interactionStart = Date.now();
      await button.click();
      const interactionEnd = Date.now();
      
      const interactionDelay = interactionEnd - interactionStart;
      
      // Interaction should be responsive (under 100ms)
      expect(interactionDelay).toBeLessThan(100);
    }
    
    const totalLoadTime = Date.now() - startTime;
    
    // Page should be interactive within 5 seconds
    expect(totalLoadTime).toBeLessThan(5000);
  });
});

test.describe('Performance Monitoring', () => {
  test('should track performance metrics', async ({ page }) => {
    // Mock performance monitoring endpoint
    const perfMetrics: any[] = [];
    
    await page.route('/api/performance', async route => {
      const postData = JSON.parse(route.request().postDataJSON() || '{}');
      perfMetrics.push(postData);
      await route.fulfill({ status: 200, body: 'OK' });
    });
    
    // Add performance monitoring script
    await page.addInitScript(() => {
      // Simulate web-vitals library
      (window as any).webVitals = {
        onCLS: (metric: any) => {
          fetch('/api/performance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'CLS', value: metric.value })
          });
        },
        onFID: (metric: any) => {
          fetch('/api/performance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'FID', value: metric.value })
          });
        },
        onLCP: (metric: any) => {
          fetch('/api/performance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'LCP', value: metric.value })
          });
        }
      };
    });
    
    await page.goto('/');
    await page.waitForTimeout(3000); // Wait for metrics to be collected
    
    // Verify metrics are being collected
    expect(perfMetrics.length).toBeGreaterThan(0);
    
    // Verify metric structure
    perfMetrics.forEach(metric => {
      expect(metric).toHaveProperty('name');
      expect(metric).toHaveProperty('value');
      expect(['CLS', 'FID', 'LCP']).toContain(metric.name);
    });
  });
});