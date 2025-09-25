# Contact Page Google Maps Location - Feature Overview

## Executive summary

This documentation provides comprehensive research and analysis for integrating Google Maps into the Reiki Goddess Healing Contact Page to display the business location in Roy, Washington. The research reveals that the **Google Maps Embed API** offers the optimal solution for this project, providing unlimited free usage while meeting all functional requirements.

## Business context

### Current state

- The Contact Page currently displays a static map image (598px height)
- Location information is shown as text: "123 Harmony Lane, Roy, WA 98580"
- Users cannot interact with the map or get directions

### Desired outcome

- Interactive map showing the exact business location
- Users can zoom, pan, and explore the area
- Direct integration with Google Maps for directions
- Professional appearance matching the healing center's brand

## Feature scope

### Primary requirements

1. Display an interactive Google Maps view centered on Roy, WA location
2. Show a marker for the Reiki Goddess Healing business
3. Maintain responsive design across all devices
4. Ensure accessibility compliance
5. Minimize implementation complexity and costs

### Technical constraints

- React 18 + TypeScript + Vite 6 tech stack
- Monorepo structure with shared components
- Budget-conscious solution preferred
- Security-first approach required

## Recommended approach

### Phase 1: Google Maps Embed API (Recommended Start)

- **Cost**: FREE - Unlimited usage
- **Implementation**: Simple iframe embed
- **Time to implement**: 2-4 hours
- **Features**: Interactive map, directions, street view
- **Security**: Minimal risk (no API key exposure)

### Phase 2: Google Maps JavaScript API (Future Enhancement)

- **Cost**: $7 per 1,000 loads after 10,000 free monthly
- **Implementation**: React component with full control
- **Time to implement**: 1-2 days
- **Features**: Custom markers, overlays, advanced interactions
- **When to upgrade**: If custom features are needed

## Key research findings

### API comparison

| Feature            | Embed API      | JavaScript API       |
| ------------------ | -------------- | -------------------- |
| Cost               | Free unlimited | $7/1k after 10k free |
| Implementation     | Simple iframe  | React component      |
| Customization      | Limited        | Full control         |
| API Key Required   | No             | Yes                  |
| Bundle Size Impact | None           | ~45KB                |

### Security considerations

1. **Embed API**: No security concerns (no API key)
2. **JavaScript API**: Requires domain restrictions and monitoring
3. **Environment variables**: Use Vite's `VITE_` prefix pattern
4. **CSP configuration**: Required for both approaches

### Performance impact

- **Embed API**: Zero bundle size increase
- **JavaScript API**: 45KB with @vis.gl/react-google-maps
- **Lazy loading**: Recommended for both approaches
- **Graceful degradation**: Falls back to static image

## Implementation roadmap

### Immediate actions (Phase 1)

1. Replace static map image with Google Maps Embed API
2. Configure responsive iframe container
3. Add loading states and error boundaries
4. Test across devices and browsers

### Future enhancements (Phase 2)

1. Evaluate need for custom features
2. Implement JavaScript API if required
3. Add custom markers and styling
4. Integrate with booking system

## Success metrics

- Page load time remains under 3 seconds
- Map loads successfully for 99.9% of users
- Zero security incidents related to API usage
- Positive user feedback on map functionality

## Related documents

- [API Analysis](./api-analysis.md) - Detailed Google Maps API research
- [Component Analysis](./components/contact-page-analysis.md) - Contact Page architecture
- [Integration Points](./integration-points.md) - Implementation patterns
- [Technical Considerations](./technical-considerations.md) - Security and performance
