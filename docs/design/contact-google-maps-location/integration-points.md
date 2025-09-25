# Integration Analysis: Contact Page Google Maps Location

## Integration architecture

### System overview

The Contact Page currently displays a static map image (`/img/d6624918517b685d6082f92a43dde9ebf88b0832.png`) at the bottom of the page. To enhance user interaction and provide dynamic mapping capabilities, we will replace this static image with an interactive Google Maps component.

**Current Implementation:** Static image placeholder  
**Target Implementation:** Interactive Google Maps component with location markers  
**Framework Context:** React 18 + TypeScript + Vite 6 + TailwindCSS

### External integrations

#### Google Maps JavaScript API

Based on research of current industry standards and library comparisons, here are the recommended integration options:

**Library Options (Ranked by Recommendation):**

1. **@vis.gl/react-google-maps** (RECOMMENDED)
   - **Pros:** Official Google-recommended library, actively maintained, modern React patterns, TypeScript support, lightweight
   - **Cons:** Still in alpha, smaller community
   - **Best For:** New projects with modern React patterns (our use case)

2. **@react-google-maps/api**
   - **Pros:** Most popular (535K weekly downloads), comprehensive features, stable
   - **Cons:** Heavier bundle size, more complex API
   - **Best For:** Feature-rich applications requiring complex mapping

3. **google-map-react**
   - **Pros:** Simple API, good for basic use cases (current most popular for basic needs)
   - **Cons:** Limited features, missing polylines/polygons/directions
   - **Best For:** Simple location display (matches our current need)

**Authentication Flow:**

- Google Cloud Console project with Maps JavaScript API enabled
- API key with domain restrictions for security
- Client-side authentication via bootstrapURLKeys parameter

**Error Handling Patterns:**

- API quota exceeded
- Invalid API key
- Network connectivity issues
- Map loading failures

### Implementation patterns

#### React integration

**Component Structure (Recommended):**

```
packages/shared-components/src/GoogleMap/
├── GoogleMap.tsx           # Main map container
├── LocationMarker.tsx      # Business location marker
├── GoogleMapProvider.tsx   # Context for map state
├── GoogleMap.test.tsx     # Component tests
└── index.ts               # Exports
```

**State Management:**

- Local component state for map center, zoom level
- Context API for sharing map instance across child components
- Error boundary for graceful failure handling

**Event Handling:**

- Map click events for user interaction
- Marker click events for location details
- Camera change events for zoom/pan updates

#### Environment configuration

**Vite Environment Variables:**

```bash
# .env.local (not committed)
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here

# .env.example (committed)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

**Vite-Specific Patterns:**

- Use `import.meta.env.VITE_GOOGLE_MAPS_API_KEY` for accessing environment variables
- Only variables prefixed with `VITE_` are exposed to client
- Runtime validation to ensure API key exists

**Security Best Practices:**

- Domain restrictions in Google Cloud Console
- HTTP referrer restrictions
- API key rotation strategy
- Environment-specific keys (dev/staging/prod)

**Multi-environment Setup:**

```typescript
const getMapConfig = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    throw new Error("Google Maps API key not configured");
  }

  return {
    apiKey,
    libraries: ["places", "geometry"],
    region: "US",
    language: "en",
  };
};
```

### Performance considerations

**Bundle Size Impact:**

- @vis.gl/react-google-maps: ~45KB gzipped
- @react-google-maps/api: ~180KB gzipped
- google-map-react: ~35KB gzipped

**Lazy Loading Strategies:**

1. **Component-Level Lazy Loading:**

   ```typescript
   const GoogleMap = React.lazy(() => import("./GoogleMap"));
   ```

2. **API Lazy Loading:**
   - Load Google Maps API only when map component is rendered
   - Use Intersection Observer to load when component enters viewport

3. **Code Splitting:**
   - Separate chunk for maps functionality
   - Dynamic imports for advanced features

**Caching Approaches:**

- Browser caching for map tiles (handled by Google)
- Service worker caching for offline scenarios
- Component memoization for stable props

### Error handling strategies

**Network Failures:**

```typescript
const MapErrorBoundary: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="map-error-fallback">
        <img
          src="/img/d6624918517b685d6082f92a43dde9ebf88b0832.png"
          alt="Location Map - Roy, Washington"
          className="w-full h-[598px] object-cover"
        />
        <p>Interactive map temporarily unavailable. Showing static location.</p>
      </div>
    );
  }

  return <>{children}</>;
};
```

**API Limit Exceeded:**

- Graceful degradation to static map
- User-friendly error messages
- Retry mechanism with exponential backoff

**Invalid API Key:**

- Development mode warnings
- Fallback to static content
- Error logging for debugging

### Accessibility integration

**Keyboard Navigation:**

- Tab navigation through map controls
- Arrow key map panning
- Enter/Space for marker interaction

**Screen Reader Support:**

- ARIA labels for map container and controls
- Alt text for location information
- Semantic HTML for marker content

**Fallback Content:**

```typescript
<div role="application" aria-label="Interactive map showing business location">
  <GoogleMapComponent />
  <div className="sr-only">
    Our business is located in Roy, Washington.
    Use the contact information above to get directions.
  </div>
</div>
```

### Monitoring requirements

**API Usage Tracking:**

- Google Cloud Console monitoring dashboard
- Daily/monthly quota alerts
- Cost monitoring and budgeting

**Performance Metrics:**

- Map load time measurement
- User interaction tracking
- Error rate monitoring

**Error Logging:**

```typescript
const logMapError = (error: Error, context: string) => {
  console.error(`Map Error [${context}]:`, error);

  // In production, send to monitoring service
  if (import.meta.env.PROD) {
    // analytics.track('map_error', { error: error.message, context });
  }
};
```

### Recommendations

#### 1. Library choice: @vis.gl/react-google-maps

**Reasoning:**

- Officially supported by Google
- Modern React patterns with hooks
- TypeScript native support
- Smaller bundle size than alternatives
- Aligns with project's modern tech stack (React 18 + TypeScript + Vite)

**Implementation Priority:** HIGH - Start with basic map display, add markers incrementally

#### 2. Implementation approach: Step-by-step migration

**Phase 1: Basic Map (Week 1)**

```typescript
// Replace static image with basic interactive map
<GoogleMap
  defaultCenter={{lat: 47.1587, lng: -122.5543}} // Roy, WA coordinates
  defaultZoom={13}
  mapId="reiki-goddess-healing-map"
/>
```

**Phase 2: Location Marker (Week 1)**

```typescript
// Add business location marker
<AdvancedMarker position={{lat: 47.1587, lng: -122.5543}}>
  <LocationPin businessName="The Reiki Goddess Healing" />
</AdvancedMarker>
```

**Phase 3: Enhanced UX (Week 2)**

- Error boundaries and fallbacks
- Loading states
- Mobile optimization

#### 3. Performance optimization: Key strategies

**Lazy Loading Implementation:**

```typescript
// Lazy load map component
const GoogleMapSection = React.lazy(() =>
  import('./GoogleMapSection').then(module => ({
    default: module.GoogleMapSection
  }))
);

// Use Intersection Observer
const MapContainer = () => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShouldLoad(true);
        observer.disconnect();
      }
    });

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="w-full h-[598px]">
      {shouldLoad ? (
        <Suspense fallback={<MapSkeleton />}>
          <GoogleMapSection />
        </Suspense>
      ) : (
        <MapSkeleton />
      )}
    </div>
  );
};
```

#### 4. Error handling: Comprehensive approach

**Multi-Layer Error Handling:**

1. **Component Level:** Error boundaries for React errors
2. **Network Level:** Retry logic with exponential backoff
3. **API Level:** Quota monitoring and graceful degradation
4. **User Level:** Clear messaging and static fallbacks

**Fallback Strategy:**

- Primary: Interactive Google Map
- Fallback 1: Static map image (current implementation)
- Fallback 2: Address text with "Get Directions" link

### Implementation Checklist

**Prerequisites:**

- [ ] Google Cloud Project with billing enabled
- [ ] Maps JavaScript API enabled
- [ ] API key created with domain restrictions
- [ ] Environment variables configured

**Development Tasks:**

- [ ] Install @vis.gl/react-google-maps package
- [ ] Create GoogleMap component with TypeScript interfaces
- [ ] Implement error boundary and fallback logic
- [ ] Add loading states and skeleton UI
- [ ] Create comprehensive test suite
- [ ] Implement accessibility features
- [ ] Add performance monitoring

**Testing Requirements:**

- [ ] Unit tests for map component
- [ ] Integration tests for error scenarios
- [ ] Accessibility testing (keyboard navigation, screen readers)
- [ ] Performance testing (bundle size, load time)
- [ ] Cross-browser testing

**Deployment Considerations:**

- [ ] Environment-specific API keys
- [ ] Domain restrictions configured
- [ ] Performance monitoring enabled
- [ ] Error tracking implemented

---

**Estimated Development Time:** 1-2 weeks
**Estimated Bundle Size Impact:** +45KB gzipped
**Estimated Performance Impact:** Minimal (lazy loading implemented)
**Risk Level:** Low (fallback to existing static image)
