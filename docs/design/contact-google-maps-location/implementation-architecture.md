# Implementation Architecture: Contact Page Google Maps Location

## Technical approach

### Architecture overview

```
┌─────────────────────────────────────────────┐
│           Contact Page Component             │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │        AnimatedSection              │   │
│  │  ┌─────────────────────────────┐   │   │
│  │  │   GoogleMapComponent        │   │   │
│  │  │  ┌─────────────────────┐   │   │   │
│  │  │  │  Maps Embed/JS API  │   │   │   │
│  │  │  └─────────────────────┘   │   │   │
│  │  └─────────────────────────────┘   │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

### Component hierarchy

```
apps/main/src/pages/Contact/
├── ContactPage.tsx (main page)
└── components/
    └── GoogleMapComponent.tsx (new)

packages/shared-components/src/
└── GoogleMap/
    ├── GoogleMapEmbed.tsx (Phase 1)
    ├── GoogleMapInteractive.tsx (Phase 2)
    ├── GoogleMap.test.tsx
    └── index.ts
```

## Phase 1: Embed API implementation

### Component structure

```typescript
// packages/shared-components/src/GoogleMap/GoogleMapEmbed.tsx
interface GoogleMapEmbedProps {
  address: string;
  width?: string | number;
  height?: string | number;
  zoom?: number;
  className?: string;
  loading?: "lazy" | "eager";
  fallbackImageSrc?: string;
  ariaLabel?: string;
}

export const GoogleMapEmbed: React.FC<GoogleMapEmbedProps> = ({
  address,
  width = "100%",
  height = 598,
  zoom = 15,
  className = "",
  loading = "lazy",
  fallbackImageSrc,
  ariaLabel = "Google Maps location",
}) => {
  // Implementation details
};
```

### Integration pattern

```typescript
// In ContactPage.tsx (replace lines 157-167)
<AnimatedSection
  animation="fade-up"
  delay={0.3}
  className="w-full flex justify-center"
>
  <GoogleMapEmbed
    address="123 Harmony Lane, Roy, WA 98580"
    height={598}
    className="w-full max-w-[1200px] rounded-lg shadow-lg"
    fallbackImageSrc="/placeholder-map.jpg"
    ariaLabel="Reiki Goddess Healing location in Roy, Washington"
  />
</AnimatedSection>
```

### Error handling

```typescript
const [mapError, setMapError] = useState(false)

if (mapError) {
  return (
    <div className="w-full h-[598px] bg-gray-100 rounded-lg flex items-center justify-center">
      <img
        src={fallbackImageSrc}
        alt={ariaLabel}
        className="w-full h-full object-cover rounded-lg"
      />
    </div>
  )
}
```

## Phase 2: JavaScript API implementation

### Component structure

```typescript
// packages/shared-components/src/GoogleMap/GoogleMapInteractive.tsx
interface GoogleMapInteractiveProps {
  center: { lat: number; lng: number };
  zoom?: number;
  markers?: MarkerProps[];
  height?: string | number;
  className?: string;
  onMarkerClick?: (marker: MarkerProps) => void;
}

export const GoogleMapInteractive: React.FC<GoogleMapInteractiveProps> = ({
  center,
  zoom = 15,
  markers = [],
  height = 598,
  className = "",
  onMarkerClick,
}) => {
  // Uses @vis.gl/react-google-maps
};
```

### Environment configuration

```typescript
// apps/main/.env.example
VITE_GOOGLE_MAPS_API_KEY = your - restricted - api - key - here;
VITE_GOOGLE_MAPS_MAP_ID = optional - styled - map - id;

// apps/main/src/config/maps.ts
export const mapsConfig = {
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  mapId: import.meta.env.VITE_GOOGLE_MAPS_MAP_ID,
  defaultCenter: { lat: 47.0451, lng: -122.4689 }, // Roy, WA
  defaultZoom: 15,
};
```

## State management

### Loading states

```typescript
type MapLoadingState = "idle" | "loading" | "loaded" | "error";

const useMapLoader = () => {
  const [loadingState, setLoadingState] = useState<MapLoadingState>("idle");

  useEffect(() => {
    // Intersection Observer for lazy loading
  }, []);

  return { loadingState, retry };
};
```

### Error boundaries

```typescript
class MapErrorBoundary extends ErrorBoundary {
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return <StaticMapFallback />
    }
    return this.props.children
  }
}
```

## Performance optimization

### Lazy loading strategy

```typescript
const GoogleMapLazy = lazy(() =>
  import("../GoogleMap").then((module) => ({
    default: module.GoogleMapInteractive,
  }))
);

// In component
const [shouldLoad, setShouldLoad] = useState(false);

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setShouldLoad(true);
      }
    },
    { threshold: 0.1 }
  );

  if (mapRef.current) {
    observer.observe(mapRef.current);
  }
}, []);
```

### Bundle optimization

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "google-maps": ["@vis.gl/react-google-maps"],
        },
      },
    },
  },
});
```

## Testing strategy

### Unit tests

```typescript
// GoogleMapEmbed.test.tsx
describe('GoogleMapEmbed', () => {
  it('renders iframe with correct src', () => {
    render(<GoogleMapEmbed address="123 Test St" />)
    const iframe = screen.getByTitle('Google Maps')
    expect(iframe).toHaveAttribute('src', expect.stringContaining('123+Test+St'))
  })

  it('handles loading states correctly', () => {
    // Test loading placeholder
  })

  it('falls back to static image on error', () => {
    // Test error boundary
  })
})
```

### Integration tests

```typescript
// Contact.integration.test.tsx
describe("Contact Page Map Integration", () => {
  it("loads map when scrolled into view", async () => {
    // Test lazy loading
  });

  it("maintains performance budget", async () => {
    // Test bundle size and load time
  });
});
```

## Migration plan

### Step 1: Create shared component

1. Implement GoogleMapEmbed in packages/shared-components
2. Add comprehensive tests
3. Build and verify package

### Step 2: Integrate into Contact Page

1. Import GoogleMapEmbed component
2. Replace static image section
3. Add loading and error states
4. Test responsive behavior

### Step 3: Deploy and monitor

1. Deploy to staging environment
2. Monitor performance metrics
3. Gather user feedback
4. Plan Phase 2 if needed

## Related documents

- [Overview](./overview.md) - Executive summary
- [API Analysis](./api-analysis.md) - Google Maps API details
- [Component Analysis](./components/contact-page-analysis.md) - Current architecture
- [Technical Considerations](./technical-considerations.md) - Security and performance
