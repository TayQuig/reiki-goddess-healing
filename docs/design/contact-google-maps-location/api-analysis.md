# API Analysis: Contact Page Google Maps Location

## Executive summary

Google Maps API integration offers multiple approaches for displaying location information on the Reiki Goddess Healing Contact Page. The current implementation uses a static image placeholder that should be replaced with an interactive map showing the Roy, Washington location. Based on comprehensive research, the **Google Maps JavaScript API with @react-google-maps/api library** is the recommended solution, providing optimal security, performance, and user experience while remaining cost-effective for a small business website.

## Google Maps API options

### JavaScript API

- **Features and capabilities**: Interactive maps, customizable markers, zoom controls, multiple map types, event handling, info windows
- **Integration approach**: Dynamic loading via script tag or React wrapper libraries
- **Pricing model**: $7.00 per 1,000 map loads after 10,000 free monthly loads
- **Best for**: Interactive user experiences requiring zoom, pan, and location details

### Embed API

- **Features and limitations**: Simple iframe embed, basic interactivity, limited customization options
- **Use cases**: Quick map embedding without complex interactions
- **Implementation simplicity**: Single iframe tag, no JavaScript required
- **Pricing**: **FREE with unlimited usage** - ideal for simple location display
- **Limitations**: Cannot customize appearance beyond basic parameters, limited event handling

### Static Maps API

- **When to use**: When only displaying a fixed map image without interactivity
- **Limitations**: No user interaction, no dynamic updates
- **Cost efficiency**: $2.00 per 1,000 requests after 10,000 free monthly requests
- **Best for**: Email templates, print materials, or minimal page weight requirements

## Authentication and security

### API key management

- **Best practices**:
  - Store API keys in environment variables (`.env.local` for Vite)
  - Never commit API keys to version control
  - Use separate keys for development and production
  - Implement domain restrictions for website usage
- **Security considerations**: API keys exposed in client-side code are visible to users
- **Environment variable usage**: `VITE_GOOGLE_MAPS_API_KEY=your_api_key_here`

### Domain restrictions

- **How to configure**: Google Cloud Console → API Keys → Application Restrictions → Websites
- **Security benefits**: Prevents unauthorized usage from other domains
- **Recommended settings**:
  - Production: `https://yourdomain.com`, `https://www.yourdomain.com`
  - Development: `http://localhost:3000`, `http://localhost:5173`

## React integration patterns

### Popular libraries

#### @react-google-maps/api (Recommended)

- **Pros**: Official Google support, TypeScript support, comprehensive feature set, active maintenance
- **Cons**: Larger bundle size than alternatives
- **Use case**: Production applications requiring full Maps API functionality

#### google-map-react

- **Pros**: Lightweight, simple API, good for basic use cases
- **Cons**: Limited feature set, less active maintenance
- **Use case**: Simple map displays without complex interactions

#### Direct implementation

- **Pros**: Full control, no library dependencies, smallest possible bundle
- **Cons**: More complex setup, manual TypeScript typing, requires more maintenance
- **Use case**: Custom implementations or when bundle size is critical

### Implementation approach

- **Component structure**:
  ```typescript
  <LoadScript googleMapsApiKey={apiKey}>
    <GoogleMap center={center} zoom={zoom}>
      <Marker position={markerPosition} />
      <InfoWindow position={center}>
        <div>Location details</div>
      </InfoWindow>
    </GoogleMap>
  </LoadScript>
  ```
- **State management**: Local component state for map interactions, React Context for global map settings
- **Performance considerations**: Lazy loading, API key caching, marker clustering for multiple locations

## Rate limiting and quotas

### Free tier limits

- **Dynamic Maps**: 10,000 requests per month free
- **Static Maps**: 10,000 requests per month free
- **Embed API**: **Unlimited free usage**
- **Features available**: Full functionality available in free tier

### Pricing structure

- **Dynamic Maps**: $7.00 per 1,000 requests after free tier
- **Static Maps**: $2.00 per 1,000 requests after free tier
- **Budget estimation**: For small business website with <1,000 monthly visitors, likely to stay within free tier

## Security considerations

### API key exposure risks

- **Client-side visibility**: API keys in browser applications are always visible to users
- **Potential misuse**: Unauthorized usage by malicious actors if not properly restricted
- **Data harvesting**: Risk of API quota exhaustion from automated scraping

### Mitigation strategies

- **Domain restrictions**: Limit API key usage to specific domains
- **API restrictions**: Restrict key to only necessary Google Maps APIs
- **Usage monitoring**: Set up billing alerts and monitor usage patterns
- **Separate keys**: Use different API keys for different environments

### Server-side proxy options

- **When to use**: For sensitive applications requiring maximum security
- **Implementation**: Backend API endpoint that proxies Google Maps requests
- **Trade-offs**: Increased complexity, additional server load, potential latency

## Performance optimization

### Lazy loading strategies

- **Component-level**: Load map component only when needed (intersection observer)
- **Script loading**: Defer Google Maps JavaScript loading until component mounts
- **Route-based**: Load maps library only on Contact page

### Bundle size impact

- **@react-google-maps/api**: ~45KB minified + gzipped
- **google-map-react**: ~25KB minified + gzipped
- **Direct implementation**: ~5KB + Google Maps API script

### Caching approaches

- **API responses**: Cache geocoding results for static locations
- **Map tiles**: Browser automatically caches map tiles
- **Script loading**: Use LoadScript component to avoid multiple API loads

## Recommendations

### 1. Recommended approach: Google Maps Embed API (Phase 1)

- **Rationale**:
  - **FREE unlimited usage** - perfect for small business budget
  - Simple implementation requiring minimal development time
  - Sufficient functionality for displaying business location
  - No API key security concerns
  - Zero maintenance overhead

- **Implementation**: Replace static image with iframe embed:

```html
<iframe
  width="100%"
  height="598"
  src="https://www.google.com/maps/embed/v1/place?key=API_KEY&q=Roy,Washington"
  loading="lazy"
  referrerpolicy="no-referrer-when-downgrade"
>
</iframe>
```

### 2. Future upgrade path: JavaScript API with @react-google-maps/api (Phase 2)

- **When to implement**: If advanced interactivity is needed (custom markers, directions, multiple locations)
- **Migration strategy**: Replace iframe with React component when requirements expand

### 3. Security setup recommendations

- **For Embed API**: Create restricted API key limited to Maps Embed API only
- **Domain restrictions**: Configure for production and development domains
- **Monitoring**: Set up Google Cloud Console billing alerts at $10/month threshold

### 4. Cost optimization strategies

- **Start with Embed API**: Take advantage of unlimited free usage
- **Monitor usage**: Set up billing alerts before implementing JavaScript API
- **Optimize requests**: Cache static location data, implement lazy loading

### 5. Implementation timeline estimate

- **Embed API implementation**: 2-4 hours
  - API key creation and restriction: 30 minutes
  - Component replacement: 1 hour
  - Testing and styling: 1-2 hours
  - Documentation: 30 minutes

- **Future JavaScript API upgrade**: 1-2 days
  - Library setup and configuration: 4 hours
  - Component development: 4-6 hours
  - Testing and refinement: 2-4 hours

## Related documents

- [Google Maps Platform Pricing](https://mapsplatform.google.com/pricing/)
- [Maps Embed API Documentation](https://developers.google.com/maps/documentation/embed)
- [Google Maps Platform Security Best Practices](https://developers.google.com/maps/api-security-best-practices)
- [Contact Page Design Implementation](../contact-google-maps-location/implementation-plan.md) _(to be created by implementation team)_
