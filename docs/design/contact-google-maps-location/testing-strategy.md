# Testing Strategy: Contact Page Google Maps Location

## Test requirements

### Unit tests

#### GoogleMapEmbed component

```typescript
// packages/shared-components/src/GoogleMap/GoogleMapEmbed.test.tsx

describe('GoogleMapEmbed', () => {
  const defaultProps = {
    address: '123 Test Street, Roy, WA 98580',
    height: 598,
    ariaLabel: 'Test location map'
  }

  it('renders iframe with properly encoded address', () => {
    render(<GoogleMapEmbed {...defaultProps} />)
    const iframe = screen.getByTitle(/Google Maps/i)
    expect(iframe).toHaveAttribute('src',
      expect.stringContaining('123+Test+Street%2C+Roy%2C+WA+98580')
    )
  })

  it('applies custom dimensions', () => {
    render(<GoogleMapEmbed {...defaultProps} width={800} height={400} />)
    const iframe = screen.getByTitle(/Google Maps/i)
    expect(iframe).toHaveStyle({ width: '800px', height: '400px' })
  })

  it('supports lazy loading', () => {
    render(<GoogleMapEmbed {...defaultProps} loading="lazy" />)
    const iframe = screen.getByTitle(/Google Maps/i)
    expect(iframe).toHaveAttribute('loading', 'lazy')
  })

  it('provides proper accessibility attributes', () => {
    render(<GoogleMapEmbed {...defaultProps} />)
    const iframe = screen.getByTitle(/Google Maps/i)
    expect(iframe).toHaveAttribute('title', expect.stringContaining('Google Maps'))
    expect(iframe).toHaveAttribute('aria-label', 'Test location map')
  })

  it('falls back to static image on error', async () => {
    const fallbackSrc = '/fallback-map.jpg'
    render(
      <GoogleMapEmbed
        {...defaultProps}
        fallbackImageSrc={fallbackSrc}
      />
    )

    // Simulate iframe load error
    const iframe = screen.getByTitle(/Google Maps/i)
    fireEvent.error(iframe)

    await waitFor(() => {
      expect(screen.getByAltText('Test location map')).toHaveAttribute('src', fallbackSrc)
    })
  })
})
```

#### GoogleMapInteractive component (Phase 2)

```typescript
// packages/shared-components/src/GoogleMap/GoogleMapInteractive.test.tsx

describe('GoogleMapInteractive', () => {
  const mockApiKey = 'test-api-key'
  const defaultProps = {
    center: { lat: 47.0451, lng: -122.4689 },
    zoom: 15,
    height: 598
  }

  beforeEach(() => {
    vi.stubEnv('VITE_GOOGLE_MAPS_API_KEY', mockApiKey)
  })

  it('initializes map with correct center and zoom', async () => {
    const { container } = render(<GoogleMapInteractive {...defaultProps} />)

    await waitFor(() => {
      expect(container.querySelector('.map-container')).toBeInTheDocument()
    })

    // Verify map initialization
    expect(mockGoogleMapsApi.Map).toHaveBeenCalledWith(
      expect.any(Element),
      expect.objectContaining({
        center: defaultProps.center,
        zoom: defaultProps.zoom
      })
    )
  })

  it('handles missing API key gracefully', () => {
    vi.stubEnv('VITE_GOOGLE_MAPS_API_KEY', '')

    render(<GoogleMapInteractive {...defaultProps} />)

    expect(screen.getByText(/Map configuration error/i)).toBeInTheDocument()
  })

  it('renders markers when provided', async () => {
    const markers = [
      { position: { lat: 47.0451, lng: -122.4689 }, title: 'Test Location' }
    ]

    render(<GoogleMapInteractive {...defaultProps} markers={markers} />)

    await waitFor(() => {
      expect(mockGoogleMapsApi.Marker).toHaveBeenCalledWith(
        expect.objectContaining({
          position: markers[0].position,
          title: markers[0].title
        })
      )
    })
  })
})
```

### Integration tests

#### Contact Page map integration

```typescript
// apps/main/src/pages/Contact/Contact.integration.test.tsx

describe('Contact Page Map Integration', () => {
  it('displays map section with correct positioning', () => {
    render(<ContactPage />)

    const mapSection = screen.getByLabelText(/Reiki Goddess Healing location/i)
    expect(mapSection).toBeInTheDocument()

    // Verify it appears after contact cards and before form
    const sections = screen.getAllByTestId(/animated-section/i)
    expect(sections[2]).toContainElement(mapSection)
  })

  it('maintains responsive behavior', () => {
    const { rerender } = render(<ContactPage />)

    // Test mobile viewport
    global.innerWidth = 375
    rerender(<ContactPage />)

    const mapContainer = screen.getByLabelText(/location/i).parentElement
    expect(mapContainer).toHaveClass('w-full')

    // Test desktop viewport
    global.innerWidth = 1440
    rerender(<ContactPage />)
    expect(mapContainer).toHaveClass('max-w-[1200px]')
  })

  it('implements lazy loading for map', async () => {
    const { container } = render(<ContactPage />)

    const mapSection = container.querySelector('[data-testid="map-section"]')
    const mockObserve = vi.fn()

    // Mock IntersectionObserver
    global.IntersectionObserver = vi.fn(() => ({
      observe: mockObserve,
      unobserve: vi.fn(),
      disconnect: vi.fn()
    }))

    expect(mockObserve).toHaveBeenCalledWith(mapSection)
  })
})
```

### Performance tests

```typescript
// apps/main/src/pages/Contact/Contact.performance.test.tsx

describe("Contact Page Performance", () => {
  it("maintains bundle size budget with map component", async () => {
    const stats = await getWebpackStats();
    const contactChunk = stats.chunks.find((c) => c.names.includes("Contact"));

    // Embed API should add minimal overhead
    expect(contactChunk.size).toBeLessThan(150 * 1024); // 150KB limit
  });

  it("loads map within performance budget", async () => {
    const page = await browser.newPage();
    await page.goto("/contact");

    const metrics = await page.evaluate(() => ({
      lcp: performance.getEntriesByType("largest-contentful-paint")[0]
        ?.startTime,
      fid: performance.getEntriesByType("first-input")[0]?.processingStart,
      cls: getCLS(),
    }));

    expect(metrics.lcp).toBeLessThan(2500); // 2.5s LCP
    expect(metrics.cls).toBeLessThan(0.1); // CLS < 0.1
  });

  it("implements effective lazy loading", async () => {
    const page = await browser.newPage();
    const requests = [];

    page.on("request", (req) => {
      if (req.url().includes("maps.googleapis.com")) {
        requests.push(req.url());
      }
    });

    await page.goto("/contact");

    // Map should not load immediately
    expect(requests).toHaveLength(0);

    // Scroll to map section
    await page.evaluate(() => {
      document.querySelector('[data-testid="map-section"]').scrollIntoView();
    });

    // Now map should load
    await page.waitForTimeout(500);
    expect(requests.length).toBeGreaterThan(0);
  });
});
```

### Accessibility tests

```typescript
// packages/shared-components/src/GoogleMap/GoogleMap.a11y.test.tsx

describe('GoogleMap Accessibility', () => {
  it('provides keyboard navigation instructions', () => {
    render(<GoogleMapEmbed address="123 Test St" />)

    const instructions = screen.getByText(/use arrow keys to pan/i)
    expect(instructions).toBeInTheDocument()
  })

  it('announces map loading state to screen readers', async () => {
    render(<GoogleMapInteractive center={{ lat: 0, lng: 0 }} />)

    expect(screen.getByRole('status')).toHaveTextContent(/Loading map/i)

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(/Map loaded/i)
    })
  })

  it('provides text alternative for map information', () => {
    render(
      <GoogleMapEmbed
        address="123 Harmony Lane, Roy, WA 98580"
        businessName="Reiki Goddess Healing"
      />
    )

    const textAlternative = screen.getByText(/Reiki Goddess Healing.*123 Harmony Lane/i)
    expect(textAlternative).toBeInTheDocument()
  })

  it('meets WCAG contrast requirements', () => {
    const { container } = render(<GoogleMapEmbed address="Test" />)

    const elements = container.querySelectorAll('[class*="text-"]')
    elements.forEach(el => {
      const styles = getComputedStyle(el)
      const contrast = getContrastRatio(styles.color, styles.backgroundColor)
      expect(contrast).toBeGreaterThanOrEqual(4.5)
    })
  })
})
```

### Error scenario tests

```typescript
// packages/shared-components/src/GoogleMap/GoogleMap.error.test.tsx

describe('GoogleMap Error Handling', () => {
  it('handles network failures gracefully', async () => {
    // Mock network failure
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

    render(<GoogleMapInteractive center={{ lat: 0, lng: 0 }} />)

    await waitFor(() => {
      expect(screen.getByText(/Unable to load map/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
    })
  })

  it('handles API quota exceeded', async () => {
    // Mock quota exceeded response
    mockGoogleMapsError({ code: 'OVER_QUERY_LIMIT' })

    render(<GoogleMapInteractive center={{ lat: 0, lng: 0 }} />)

    await waitFor(() => {
      expect(screen.getByText(/temporarily unavailable/i)).toBeInTheDocument()
    })
  })

  it('provides helpful error messages', async () => {
    const errors = [
      { code: 'INVALID_REQUEST', message: /configuration issue/i },
      { code: 'REQUEST_DENIED', message: /API key/i },
      { code: 'UNKNOWN_ERROR', message: /try again later/i }
    ]

    for (const { code, message } of errors) {
      mockGoogleMapsError({ code })

      render(<GoogleMapInteractive center={{ lat: 0, lng: 0 }} />)

      await waitFor(() => {
        expect(screen.getByText(message)).toBeInTheDocument()
      })
    }
  })
})
```

## Test execution strategy

### CI/CD pipeline

```yaml
# .github/workflows/test.yml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Unit Tests
        run: npm test -- --coverage

      - name: Integration Tests
        run: npm run test:integration

      - name: Performance Tests
        run: npm run test:performance
        env:
          PERFORMANCE_BUDGET: true

      - name: Accessibility Tests
        run: npm run test:a11y
```

### Test environment setup

```typescript
// test/setup.ts
import { vi } from "vitest";

// Mock Google Maps API
global.google = {
  maps: {
    Map: vi.fn(),
    Marker: vi.fn(),
    InfoWindow: vi.fn(),
    // ... other mocks
  },
};

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
```

## Coverage requirements

### Minimum coverage thresholds

```json
{
  "jest": {
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      },
      "./packages/shared-components/src/GoogleMap": {
        "branches": 90,
        "functions": 90,
        "lines": 90,
        "statements": 90
      }
    }
  }
}
```

## Related documents

- [Overview](./overview.md) - Feature summary
- [Implementation Architecture](./implementation-architecture.md) - Technical design
- [Technical Considerations](./technical-considerations.md) - Security and performance
- [API Analysis](./api-analysis.md) - Google Maps API details
