# Figma Screenshots Directory

## 📁 Directory Structure

```
figma-screenshots/
├── homepage/
│   ├── components/     # Individual UI components (buttons, cards, etc.)
│   ├── sections/       # Page sections (hero, services, testimonials)
│   └── overlays/       # Overlay elements (modals, tooltips, floating text)
├── about/
│   ├── components/
│   ├── sections/
│   └── overlays/
├── services/
│   ├── components/
│   ├── sections/
│   └── overlays/
├── contact/
│   ├── components/
│   ├── sections/
│   └── overlays/
└── blog/
    ├── components/
    ├── sections/
    └── overlays/
```

## 🎯 Naming Convention

Use descriptive names with frame numbers:

- `frame-9-overlay-text.png`
- `hero-section-complete.png`
- `navigation-header.png`
- `services-grid.png`

## 📝 Usage Instructions

1. **Take Screenshot in Figma:**
   - Select the frame/component
   - Press Cmd+Shift+4 (Mac) or use Figma's export
   - Save to appropriate folder

2. **Drop in Folder:**
   - Navigate to the correct page folder
   - Choose components/sections/overlays
   - Use descriptive filename

3. **Notify Claude:**
   - Say "I've added [filename] to [folder]"
   - Claude will read and extract the design

## 🔄 Workflow

1. Select in Figma → 2. Screenshot → 3. Save to folder → 4. Claude extracts → 5. Component created

## 📍 Current Status

### Homepage

- [x] Frame 1: Header - ✅ Extracted to `packages/shared-components/src/Header/`
- [x] Frame 2: Hero - ✅ Extracted to `packages/shared-components/src/Hero/`
- [ ] Frame 9: Hero Overlay Text - 🎯 Awaiting screenshot
- [ ] Frame 3: Services/Features
- [ ] Frame 4: About Preview
- [ ] Frame 5: Testimonials
- [ ] Frame 6: Footer

### About Page

- [ ] Frame 1: Header
- [ ] Frame 2: Hero
- [ ] Frame 3: Introduction
- [ ] Frame 4: Values
- [ ] Frame 5: Services
- [ ] Frame 6: Contact CTA
- [ ] Frame 7: Testimonials
- [ ] Frame 8: Footer

### Services Page

- [ ] All frames pending

### Contact Page

- [ ] All frames pending

### Blog Page

- [ ] All frames pending

## 💡 Tips

- Include Figma's spacing guides in screenshots when relevant
- Capture hover states separately if needed
- Include the Inspect panel for complex components
- Group related screenshots with similar names
