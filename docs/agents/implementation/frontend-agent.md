# Frontend Agent - Implementation

## Agent Type

`frontend-agent`

## Core Responsibilities

- Implement React components with TypeScript
- Apply Tailwind CSS styling following design tokens
- Ensure accessibility standards (WCAG 2.1 AA)
- Create responsive layouts matching Figma designs
- Implement component composition patterns
- Add proper error boundaries
- Handle loading and error states
- Integrate with shared components library

## Required Context

- Task ID: [TASK_ID]
- Task Name: [TASK_NAME]
- Description: [TASK_DESCRIPTION]
- Acceptance Criteria: [ACCEPTANCE_CRITERIA]
- Dependencies: [DEPENDENCIES]
- Context Documentation: [CONTEXT_DOCS]
- Figma Design Reference: [FIGMA_URL]

## Implementation Guidelines

### Component Structure

```typescript
// ComponentName.tsx
import React from 'react';
import { ComponentProps } from './types';

export const ComponentName: React.FC<ComponentProps> = ({
  // destructured props
}) => {
  // hooks at the top
  // derived state
  // event handlers
  // render logic
  return (
    // JSX with semantic HTML
  );
};
```

### TypeScript Requirements

- Define all prop interfaces
- Use proper generic types
- Avoid `any` type
- Export types from separate files
- Use discriminated unions for variants

### Styling Patterns

- Use Tailwind utility classes
- Import design tokens from `@reiki-goddess-healing/design-system`
- Follow mobile-first responsive design
- Use CSS variables for dynamic theming
- Implement proper focus states

### State Management

- Prefer local state with useState
- Use Context API for cross-component state
- Implement custom hooks for complex logic
- Follow unidirectional data flow

### Performance Considerations

- Use React.memo for expensive components
- Implement lazy loading for routes
- Optimize re-renders with useMemo/useCallback
- Code split at route boundaries

## Quality Checks

1. **TypeScript Validation**

   ```bash
   npm run type-check
   ```

2. **Linting**

   ```bash
   npm run lint
   ```

3. **Accessibility Audit**
   - All interactive elements have proper ARIA labels
   - Color contrast meets WCAG standards
   - Keyboard navigation works correctly
   - Screen reader tested

4. **Responsive Testing**
   - Mobile (320px - 768px)
   - Tablet (768px - 1024px)
   - Desktop (1024px+)

5. **Cross-browser Testing**
   - Chrome (latest)
   - Firefox (latest)
   - Safari (latest)
   - Edge (latest)

## Output Format

### Deliverables

1. **Component Files**
   - `ComponentName.tsx` - Main component
   - `ComponentName.test.tsx` - Unit tests
   - `ComponentName.stories.tsx` - Storybook stories
   - `types.ts` - TypeScript interfaces
   - `index.ts` - Barrel export

2. **Documentation**
   - Component API documentation
   - Usage examples
   - Props table

3. **Integration Points**
   ```typescript
   interface ComponentOutputs {
     componentPath: string;
     exportName: string;
     propTypes: TypeDefinition[];
     events: EventHandler[];
     dataRequirements: DataQuery[];
   }
   ```

### Success Metrics

- [ ] All acceptance criteria met
- [ ] TypeScript compilation passes
- [ ] No linting errors
- [ ] 100% test coverage
- [ ] Storybook story renders correctly
- [ ] Matches Figma design pixel-perfectly
- [ ] Accessibility audit passes
- [ ] Performance budget met (< 50KB gzipped)

## Common Patterns

### Form Components

```typescript
const [formData, setFormData] = useState<FormData>(initialValues);
const [errors, setErrors] = useState<FormErrors>({});
const [isSubmitting, setIsSubmitting] = useState(false);

const validate = useCallback((data: FormData): FormErrors => {
  // validation logic
}, []);

const handleSubmit = useCallback(
  async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      // error handling
    } finally {
      setIsSubmitting(false);
    }
  },
  [formData, validate, onSubmit]
);
```

### Data Fetching

```typescript
const { data, loading, error } = useQuery<DataType>({
  queryKey: ['resource', id],
  queryFn: () => fetchResource(id),
  staleTime: 5 * 60 * 1000, // 5 minutes
});

if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
if (!data) return <EmptyState />;
```

### Error Boundaries

```typescript
class ErrorBoundary extends React.Component<Props, State> {
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

## Integration with Design System

- Import colors from `theme/tokens.ts`
- Use spacing scale: `space-[0|1|2|3|4|5|6|8|10|12|16|20|24|32]`
- Apply typography classes: `text-[xs|sm|base|lg|xl|2xl|3xl]`
- Utilize component variants from shared library

## Debugging Tips

- Use React DevTools for component inspection
- Enable React Strict Mode in development
- Add data-testid attributes for testing
- Use descriptive component display names
- Implement proper error logging

## Dependencies

- React 18+
- TypeScript 5+
- Tailwind CSS 3+
- @reiki-goddess-healing/shared-components
- @reiki-goddess-healing/design-system
- @reiki-goddess-healing/shared-utils
