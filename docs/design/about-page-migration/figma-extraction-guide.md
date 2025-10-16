# Figma MCP Extraction Guide - About Page

**Purpose**: Step-by-step instructions for extracting About Page design specifications using Figma MCP tools
**Prerequisites**: Figma Desktop App with The Reiki Goddess Healing file open
**Target Output**: Complete design specifications for About Page components

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [MCP Tools Available](#mcp-tools-available)
3. [Extraction Workflow](#extraction-workflow)
4. [Frame-by-Frame Instructions](#frame-by-frame-instructions)
5. [Troubleshooting](#troubleshooting)
6. [Expected Outputs](#expected-outputs)

---

## Prerequisites

### Required Setup

1. **Figma Desktop App** installed and running
2. **Figma File** open: The Reiki Goddess Healing design file
3. **About Page** visible in the canvas
4. **MCP Server** connected (check available tools)

### Verify MCP Connection

Run this command to verify Figma MCP tools are available:

```bash
# List available MCP tools
claude list-mcp-tools | grep figma
```

**Expected output**:

```
mcp__figma-dev-mode-mcp-server__get_code
mcp__figma-dev-mode-mcp-server__get_metadata
mcp__figma-dev-mode-mcp-server__get_screenshot
mcp__figma-dev-mode-mcp-server__get_variable_defs
mcp__figma-dev-mode-mcp-server__get_code_connect_map
mcp__figma-dev-mode-mcp-server__create_design_system_rules
```

---

## MCP Tools Available

### Primary Extraction Tools

#### 1. `get_code`

**Purpose**: Extract component code and design specifications
**Best For**: Complete component extraction with styling

**Parameters**:

- `nodeId` (optional): Specific node ID to extract (e.g., "123:456")
- `dirForAssetWrites` (required): Directory for exported assets
- `clientLanguages`: "typescript,javascript"
- `clientFrameworks`: "react"
- `forceCode`: Set to `true` to always return code

**Example**:

```typescript
mcp__figma -
  dev -
  mode -
  mcp -
  server__get_code({
    dirForAssetWrites:
      "/Users/taylorquigley/Documents/Directories/reiki-goddess-healing/.tmp/figma-assets-about/",
    clientLanguages: "typescript,javascript",
    clientFrameworks: "react",
  });
```

#### 2. `get_screenshot`

**Purpose**: Capture visual representation of selected node
**Best For**: Reference images for implementation

**Parameters**:

- `nodeId` (optional): Specific node to screenshot
- `clientLanguages`: "typescript,javascript"
- `clientFrameworks`: "react"

#### 3. `get_metadata`

**Purpose**: Get structural information about nodes
**Best For**: Understanding page structure, getting node IDs

**Parameters**:

- `nodeId` (optional): Specific node to inspect
- `clientLanguages`: "typescript,javascript"
- `clientFrameworks`: "react"

**Note**: This returns XML structure with node IDs, layer types, names, positions

#### 4. `get_variable_defs`

**Purpose**: Extract design variables (colors, typography, spacing)
**Best For**: Design token extraction

**Parameters**:

- `nodeId` (optional): Scope to specific node
- `clientLanguages`: "typescript,javascript"
- `clientFrameworks`: "react"

---

## Extraction Workflow

### Overview

```
1. Open Figma → 2. Navigate to About Page → 3. Select Frame →
4. Run MCP Tool → 5. Save Output → 6. Repeat for all frames
```

### Detailed Steps

#### Step 1: Prepare Asset Directory

```bash
# Create temporary asset directory
mkdir -p /Users/taylorquigley/Documents/Directories/reiki-goddess-healing/.tmp/figma-assets-about/hero
mkdir -p /Users/taylorquigley/Documents/Directories/reiki-goddess-healing/.tmp/figma-assets-about/introduction
mkdir -p /Users/taylorquigley/Documents/Directories/reiki-goddess-healing/.tmp/figma-assets-about/values
mkdir -p /Users/taylorquigley/Documents/Directories/reiki-goddess-healing/.tmp/figma-assets-about/cta
```

#### Step 2: Get Page Structure

**In Figma**: Navigate to About Page, but DON'T select anything

**Run**:

```typescript
// Get overall page structure to find node IDs
mcp__figma -
  dev -
  mode -
  mcp -
  server__get_metadata({
    clientLanguages: "typescript,javascript",
    clientFrameworks: "react",
  });
```

**Expected**: XML structure showing all frames and their node IDs

**Save output** to:

```bash
/Users/taylorquigley/Documents/Directories/reiki-goddess-healing/.tmp/figma-assets-about/page-structure.xml
```

#### Step 3: Extract Design Variables

**Run**:

```typescript
mcp__figma -
  dev -
  mode -
  mcp -
  server__get_variable_defs({
    clientLanguages: "typescript,javascript",
    clientFrameworks: "react",
  });
```

**Expected**: JSON mapping of design variables

```json
{
  "color/primary/blue": "#0205B7",
  "color/background/cream": "#FFFBF5",
  "spacing/section/vertical": "80px"
}
```

**Save output** to:

```bash
/Users/taylorquigley/Documents/Directories/reiki-goddess-healing/.tmp/figma-assets-about/design-variables.json
```

---

## Frame-by-Frame Instructions

### Frame 2: About Hero

**In Figma**:

1. Click on "Frame 2" or "About Hero" in layers panel
2. Ensure entire frame is selected (not child elements)

**Extract Code**:

```typescript
mcp__figma -
  dev -
  mode -
  mcp -
  server__get_code({
    dirForAssetWrites:
      "/Users/taylorquigley/Documents/Directories/reiki-goddess-healing/.tmp/figma-assets-about/hero/",
    clientLanguages: "typescript,javascript",
    clientFrameworks: "react",
    forceCode: true,
  });
```

**Capture Screenshot**:

```typescript
mcp__figma -
  dev -
  mode -
  mcp -
  server__get_screenshot({
    clientLanguages: "typescript,javascript",
    clientFrameworks: "react",
  });
```

**Expected Outputs**:

- React component code for hero
- Background image exported to `hero/` directory
- CSS styling specifications
- Screenshot for reference

**Save to**:

```bash
/Users/taylorquigley/Documents/Directories/reiki-goddess-healing/docs/design/about-page-migration/extracted/AboutHero.tsx
/Users/taylorquigley/Documents/Directories/reiki-goddess-healing/figma-screenshots/about/sections/about-hero.png
```

---

### Frame 3: Introduction Section

**In Figma**:

1. Click on "Frame 3" or "Introduction" in layers panel
2. Ensure entire frame is selected

**Extract Code**:

```typescript
mcp__figma -
  dev -
  mode -
  mcp -
  server__get_code({
    dirForAssetWrites:
      "/Users/taylorquigley/Documents/Directories/reiki-goddess-healing/.tmp/figma-assets-about/introduction/",
    clientLanguages: "typescript,javascript",
    clientFrameworks: "react",
    forceCode: true,
  });
```

**Expected Outputs**:

- Component code
- Profile images
- Decorative elements (smoke, gradients)
- Layout specifications

**Save to**:

```bash
/Users/taylorquigley/Documents/Directories/reiki-goddess-healing/docs/design/about-page-migration/extracted/AboutIntroduction.tsx
```

---

### Frame 4: Values Section

**In Figma**:

1. Click on "Frame 4" or "Values" in layers panel
2. Ensure entire frame is selected

**Extract Code**:

```typescript
mcp__figma -
  dev -
  mode -
  mcp -
  server__get_code({
    dirForAssetWrites:
      "/Users/taylorquigley/Documents/Directories/reiki-goddess-healing/.tmp/figma-assets-about/values/",
    clientLanguages: "typescript,javascript",
    clientFrameworks: "react",
    forceCode: true,
  });
```

**Expected Outputs**:

- Values grid/card layout
- Icons or graphics
- Typography specifications
- Spacing/padding values

**Save to**:

```bash
/Users/taylorquigley/Documents/Directories/reiki-goddess-healing/docs/design/about-page-migration/extracted/ValuesSection.tsx
```

---

### Frame 5: Services Overview

**In Figma**:

1. Click on "Frame 5" or "Services" in layers panel
2. Ensure entire frame is selected

**Note**: This may be similar to homepage ServicesSection - check for differences

**Extract Code**:

```typescript
mcp__figma -
  dev -
  mode -
  mcp -
  server__get_code({
    dirForAssetWrites:
      "/Users/taylorquigley/Documents/Directories/reiki-goddess-healing/.tmp/figma-assets-about/services/",
    clientLanguages: "typescript,javascript",
    clientFrameworks: "react",
    forceCode: true,
  });
```

**Decision Point**:

- If identical to homepage ServicesSection → Reuse existing component
- If different → Extract and create AboutServices component

---

### Frame 6: Contact CTA

**In Figma**:

1. Click on "Frame 6" or "Contact CTA" in layers panel
2. Ensure entire frame is selected

**Extract Code**:

```typescript
mcp__figma -
  dev -
  mode -
  mcp -
  server__get_code({
    dirForAssetWrites:
      "/Users/taylorquigley/Documents/Directories/reiki-goddess-healing/.tmp/figma-assets-about/cta/",
    clientLanguages: "typescript,javascript",
    clientFrameworks: "react",
    forceCode: true,
  });
```

**Expected Outputs**:

- CTA layout
- Button styles
- Background image (if any)
- Copy/text content

**Save to**:

```bash
/Users/taylorquigley/Documents/Directories/reiki-goddess-healing/docs/design/about-page-migration/extracted/AboutCTA.tsx
```

---

### Frame 7: Testimonials

**In Figma**:

1. Click on "Frame 7" or "Testimonials" in layers panel
2. Ensure entire frame is selected

**Note**: Check if this is identical to homepage Testimonials component

**Extract Code** (if different from homepage):

```typescript
mcp__figma -
  dev -
  mode -
  mcp -
  server__get_code({
    dirForAssetWrites:
      "/Users/taylorquigley/Documents/Directories/reiki-goddess-healing/.tmp/figma-assets-about/testimonials/",
    clientLanguages: "typescript,javascript",
    clientFrameworks: "react",
    forceCode: true,
  });
```

**Decision Point**:

- If identical → Reuse existing Testimonials component
- If different → Extract and adapt

---

## Troubleshooting

### Common Errors

#### Error: "Nothing is selected"

**Cause**: No node selected in Figma Desktop App
**Solution**:

1. Open Figma Desktop App
2. Click on a specific frame in the layers panel
3. Re-run the MCP tool

#### Error: "Response exceeds maximum tokens"

**Cause**: Selected node or page is too large
**Solution**:

1. Select a smaller/more specific frame
2. Use `nodeId` parameter to target specific nodes
3. Extract sections individually rather than entire page

**Example**:

```typescript
// Instead of extracting entire page at once
mcp__figma -
  dev -
  mode -
  mcp -
  server__get_metadata({
    nodeId: "123:456", // Specific frame ID
    clientLanguages: "typescript,javascript",
    clientFrameworks: "react",
  });
```

#### Error: "File does not exist"

**Cause**: Asset directory doesn't exist
**Solution**:

```bash
# Create the directory first
mkdir -p /Users/taylorquigley/Documents/Directories/reiki-goddess-healing/.tmp/figma-assets-about/
```

### Getting Node IDs

If you need specific node IDs:

1. **From Figma URL**:

   ```
   https://figma.com/design/:fileKey/:fileName?node-id=1-2
   ```

   Node ID would be `1:2`

2. **From get_metadata**:
   Run get_metadata on parent frame, look for child node IDs in XML output

3. **From Figma Inspect Panel**:
   - Select element
   - Right-click → Copy/Paste → Copy as → Copy link
   - Extract node-id from URL

---

## Expected Outputs

### File Structure After Extraction

```
.tmp/figma-assets-about/
├── hero/
│   ├── background-hero.png
│   └── overlay-gradient.png
├── introduction/
│   ├── profile-main.png
│   ├── profile-secondary.png
│   └── smoke-effect.png
├── values/
│   ├── icon-compassion.svg
│   ├── icon-integrity.svg
│   ├── icon-healing.svg
│   └── icon-growth.svg
├── cta/
│   └── cta-background.png
├── design-variables.json
└── page-structure.xml

docs/design/about-page-migration/extracted/
├── AboutHero.tsx
├── AboutIntroduction.tsx
├── ValuesSection.tsx
├── AboutCTA.tsx
└── design-specs.md

figma-screenshots/about/
├── sections/
│   ├── about-hero.png
│   ├── introduction-section.png
│   ├── values-section.png
│   └── cta-section.png
└── images/
    └── (exported images)
```

### Design Specs Document

After extraction, create a summary document:

**Location**: `/docs/design/about-page-migration/extracted/design-specs.md`

**Contents**:

```markdown
# About Page - Extracted Design Specifications

## Hero Section

- Height: XXXpx
- Background: [image path]
- Heading: [font, size, color]
- Layout: [positioning details]

## Introduction Section

- Layout: [grid/flex details]
- Images: [dimensions, positioning, rotation]
- Typography: [specifications]
- Decorative elements: [smoke, gradients, etc.]

[... continue for all sections ...]
```

---

## Next Steps After Extraction

### 1. Organize Assets

```bash
# Move images to public directory
cp .tmp/figma-assets-about/**/*.png /Users/taylorquigley/Documents/Directories/reiki-goddess-healing/apps/main/public/img/about/

# Move icons to icons directory
cp .tmp/figma-assets-about/**/*.svg /Users/taylorquigley/Documents/Directories/reiki-goddess-healing/apps/main/public/img/icons/
```

### 2. Review Extracted Code

Compare extracted code with homepage patterns:

- Does it follow design system tokens?
- Does it use established layout patterns?
- Are there any new design tokens needed?

### 3. Adapt to Design System

Refactor extracted code to use:

- Existing color tokens from `/packages/design-system/src/colors.ts`
- Typography from `/packages/design-system/src/typography.ts`
- Layout constants from `/packages/design-system/src/layout.ts`

### 4. Create Component Files

Set up proper component structure:

```bash
# Create component directories
mkdir -p /Users/taylorquigley/Documents/Directories/reiki-goddess-healing/packages/shared-components/src/AboutHero
mkdir -p /Users/taylorquigley/Documents/Directories/reiki-goddess-healing/packages/shared-components/src/AboutIntroduction
# ... etc.
```

### 5. Write Tests

For each component, create test file:

```typescript
// AboutHero.test.tsx
import { render, screen } from '@testing-library/react';
import { AboutHero } from './AboutHero';

describe('AboutHero', () => {
  it('renders hero heading', () => {
    render(<AboutHero />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  // ... more tests
});
```

### 6. Update Documentation

Update `/docs/design/about-page-migration/design-implementation.md` with:

- Actual extracted specifications
- Confirmed component structure
- Asset inventory
- Any deviations from expected design

---

## Alternative: Manual Screenshot Method

If MCP tools are unavailable or problematic:

### Manual Process

1. **In Figma**:
   - Select each frame
   - Press `Cmd+Shift+4` (Mac) or use Figma's export
   - Save screenshot

2. **Save to**:

   ```
   /figma-screenshots/about/sections/[frame-name].png
   ```

3. **Manual measurements**:
   - Use Figma's Inspect panel
   - Note down:
     - Dimensions (width, height)
     - Spacing (padding, margins)
     - Typography (font, size, weight, color)
     - Colors (hex/rgba values)
     - Border radius, shadows, etc.

4. **Create manual spec document**:

   ```markdown
   # About Hero - Manual Specifications

   ## Dimensions

   - Width: 1308px
   - Height: 732px
   - Padding: 66px horizontal

   ## Typography

   - Heading: Figtree, 48px, Bold, #333333
   - Subheading: Figtree, 18px, Regular, #5E5E5E

   [... continue ...]
   ```

---

## Checklist

Use this checklist to track extraction progress:

### Pre-Extraction

- [ ] Figma Desktop App installed
- [ ] Figma file open
- [ ] MCP tools verified
- [ ] Asset directories created

### Extraction

- [ ] Page structure extracted (get_metadata)
- [ ] Design variables extracted (get_variable_defs)
- [ ] Frame 2: About Hero
- [ ] Frame 3: Introduction
- [ ] Frame 4: Values
- [ ] Frame 5: Services
- [ ] Frame 6: Contact CTA
- [ ] Frame 7: Testimonials

### Post-Extraction

- [ ] Assets organized in /public/img/
- [ ] Screenshots saved to /figma-screenshots/about/
- [ ] Extracted code reviewed
- [ ] Design specs documented
- [ ] Components adapted to design system
- [ ] Tests written
- [ ] Documentation updated

---

## Questions or Issues?

**If extraction fails**:

1. Check Figma Desktop App is running
2. Verify correct frame is selected
3. Try extracting smaller sections
4. Use manual screenshot method as fallback

**If output is incomplete**:

1. Re-run extraction with `forceCode: true`
2. Extract child nodes individually
3. Use Figma Inspect panel to supplement

**If you need help**:

- Review error messages carefully
- Check MCP server logs
- Consult Figma MCP documentation
- Fall back to manual extraction if needed

---

**Document Version**: 1.0
**Last Updated**: 2025-10-06
**Related**: [Design Implementation Spec](./design-implementation.md)

---

_This guide provides comprehensive instructions for extracting About Page designs using Figma MCP tools. Follow the frame-by-frame workflow for best results. If MCP extraction is unavailable, use the manual screenshot method as a reliable alternative._
