import React from 'react';
import { Header } from './Header';
import { ResponsiveHeader } from './ResponsiveHeader';

/**
 * Test page for validating the Figma-extracted Header component
 * This demonstrates the proof-of-concept workflow
 */

// Default navigation items
const defaultNavItems = [
  { label: 'Home', href: '/', isActive: true },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' }
];

// Example usage
export const Default = () => (
  <div style={{ position: 'relative', height: '200px', background: '#f5f5f5' }}>
    <Header navigationItems={defaultNavItems} />
  </div>
);

export const Responsive = () => (
  <div style={{ background: '#f5f5f5', minHeight: '200px' }}>
    <ResponsiveHeader navigationItems={defaultNavItems} />
  </div>
);

export const CustomLogo = () => (
  <div style={{ position: 'relative', height: '200px', background: '#f5f5f5' }}>
    <Header 
      logo={{
        src: '/img/custom-logo.png',
        alt: 'Custom Logo'
      }}
      navigationItems={defaultNavItems} 
    />
  </div>
);

// Documentation
export const ProofOfConcept = () => (
  <div style={{ padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
    <h1>Figma-to-Code Proof of Concept</h1>
    
    <h2>✅ Workflow Validated</h2>
    <ol>
      <li>Selected Frame #1 in Figma (Homepage Header/Navigation)</li>
      <li>Extracted component structure and styling properties</li>
      <li>Created type-safe React component with proper props</li>
      <li>Maintained exact Figma design dimensions and styling</li>
      <li>Added responsive wrapper for production use</li>
    </ol>
    
    <h2>📊 Component Properties Extracted</h2>
    <ul>
      <li><strong>Dimensions:</strong> 716px × 93px</li>
      <li><strong>Typography:</strong> Figtree, 16px, semibold</li>
      <li><strong>Colors:</strong> CSS variables from design system</li>
      <li><strong>Layout:</strong> Flexbox with 84px gaps</li>
      <li><strong>Logo:</strong> 248px × 92px with 2.7:1 aspect ratio</li>
    </ul>
    
    <h2>🎯 Next Steps</h2>
    <ul>
      <li>Extract design tokens (colors, typography) from Figma</li>
      <li>Apply this workflow to remaining components</li>
      <li>Build complete page compositions</li>
    </ul>
    
    <hr style={{ margin: '40px 0' }} />
    
    <h3>Component Demo:</h3>
    <div style={{ position: 'relative', height: '200px', background: '#f5f5f5', marginTop: '20px' }}>
      <Header navigationItems={defaultNavItems} />
    </div>
  </div>
);