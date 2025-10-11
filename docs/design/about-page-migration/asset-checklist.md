# About Page - Asset Checklist

**Task**: T001 - Figma Design Extraction
**Status**: Assets Identified, Ready for Export
**Date**: 2025-10-06

---

## Asset Export Checklist

### Images - Hero Section

- [ ] **fb8b1754eb9a50a6cfaec02f5ef0c9bc-2.png**
  - Dimensions: 808×808px
  - Format: JPG (optimized)
  - Usage: Hero section main image
  - Target location: `/public/img/about-hero.jpg`

- [ ] **powerrangers-6.png**
  - Dimensions: 1308×515px
  - Format: PNG (with transparency)
  - Usage: Hero section decorative overlay
  - Target location: `/public/img/about-hero-overlay.png`

### Images - About Introduction

- [ ] **rectangle-5.png**
  - Dimensions: 400×432px
  - Format: JPG (optimized)
  - Usage: Deirdre portrait in About Introduction
  - Target location: `/public/img/about-portrait.jpg`

### Images - Journey Section

- [ ] **fb8b1754eb9a50a6cfaec02f5ef0c9bc-3.png**
  - Dimensions: 806×808px
  - Format: JPG (optimized)
  - Usage: Journey section main image
  - Target location: `/public/img/about-journey.jpg`

- [ ] **rectangle-6.png**
  - Dimensions: 400×432px
  - Format: JPG (optimized)
  - Usage: Journey section side image
  - Target location: `/public/img/about-healing-space.jpg`

### Images - Contact CTA

- [ ] **2148847564-1.png**
  - Dimensions: 1309×432px
  - Format: JPG (optimized)
  - Usage: Contact CTA background image
  - Target location: `/public/img/about-contact-cta-bg.jpg`

### Images - Gallery

- [ ] **rectangle-7.png**
  - Dimensions: 898×343px
  - Format: JPG (optimized)
  - Usage: Gallery image 1 (large horizontal)
  - Target location: `/public/img/gallery-1.jpg`

- [ ] **rectangle-8.png**
  - Dimensions: 391×343px
  - Format: JPG (optimized)
  - Usage: Gallery image 2
  - Target location: `/public/img/gallery-2.jpg`

- [ ] **rectangle-10.png**
  - Dimensions: 391×343px
  - Format: JPG (optimized)
  - Usage: Gallery image 3
  - Target location: `/public/img/gallery-3.jpg`

- [ ] **rectangle-13.png**
  - Dimensions: 487×343px
  - Format: JPG (optimized)
  - Usage: Gallery image 4
  - Target location: `/public/img/gallery-4.jpg`

- [ ] **rectangle-12.png**
  - Dimensions: 391×343px
  - Format: JPG (optimized)
  - Usage: Gallery image 5
  - Target location: `/public/img/gallery-5.jpg`

### Images - Testimonials

- [ ] **ellipse-5.png**
  - Dimensions: 65×65px (circular)
  - Format: PNG (with transparency)
  - Usage: Testimonial avatar
  - Target location: `/public/img/testimonial-avatar.png`

### Images - Final CTA

- [ ] **frame-33.png**
  - Dimensions: 1095×265px
  - Format: PNG (with transparency)
  - Usage: Final CTA background pattern
  - Target location: `/public/img/about-final-cta-bg.png`

### Icons

- [ ] **vector-1.svg**
  - Dimensions: 10×10px
  - Format: SVG (optimized)
  - Usage: Arrow icon for "Learn More" buttons
  - Target location: `/public/img/icons/arrow-right.svg`

- [ ] **vector-3.svg**
  - Dimensions: 10×10px
  - Format: SVG (optimized)
  - Usage: Arrow icon (white variant)
  - Target location: `/public/img/icons/arrow-right-white.svg`

- [ ] **vector-5.svg**
  - Dimensions: 10×10px
  - Format: SVG (optimized)
  - Usage: Arrow icon (white variant alt)
  - Target location: `/public/img/icons/arrow-right-white-alt.svg`

- [ ] **vector-1-1.svg**
  - Dimensions: 12×19px
  - Format: SVG (optimized)
  - Usage: Carousel navigation (previous)
  - Target location: `/public/img/icons/arrow-left-nav.svg`

- [ ] **vector-1-2.svg**
  - Dimensions: 12×19px
  - Format: SVG (optimized)
  - Usage: Carousel navigation (next)
  - Target location: `/public/img/icons/arrow-right-nav.svg`

- [ ] **star-6.svg**
  - Dimensions: 24×23px
  - Format: SVG (optimized)
  - Usage: Star rating icon
  - Target location: `/public/img/icons/star.svg`

---

## Asset Optimization Guidelines

### JPG Images

```bash
# Optimize with quality 80%
# Target: < 200KB per image
# Generate WebP variants
# Create 2x retina versions
```

**Command**:

```bash
# Using ImageMagick or similar
convert input.jpg -quality 80 -resize "100%" output.jpg
convert input.jpg -quality 80 -resize "100%" output.webp
convert input.jpg -quality 80 -resize "200%" output@2x.jpg
```

### PNG Images

```bash
# Optimize with pngquant
# Preserve transparency
# Generate WebP variants where applicable
```

**Command**:

```bash
pngquant --quality=80-90 --output output.png input.png
convert input.png -quality 80 output.webp
```

### SVG Icons

```bash
# Optimize with SVGO
# Remove unnecessary metadata
# Use currentColor for theme-able icons
```

**Command**:

```bash
svgo input.svg -o output.svg
```

---

## Directory Structure

```
.tmp/figma-assets-about/
├── images/
│   ├── hero/
│   │   ├── about-hero.jpg
│   │   ├── about-hero.webp
│   │   ├── about-hero@2x.jpg
│   │   └── about-hero-overlay.png
│   ├── portraits/
│   │   ├── about-portrait.jpg
│   │   ├── about-portrait.webp
│   │   └── about-portrait@2x.jpg
│   ├── journey/
│   │   ├── about-journey.jpg
│   │   ├── about-journey.webp
│   │   ├── about-journey@2x.jpg
│   │   ├── about-healing-space.jpg
│   │   ├── about-healing-space.webp
│   │   └── about-healing-space@2x.jpg
│   ├── gallery/
│   │   ├── gallery-1.jpg
│   │   ├── gallery-1.webp
│   │   ├── gallery-2.jpg
│   │   ├── gallery-2.webp
│   │   ├── gallery-3.jpg
│   │   ├── gallery-3.webp
│   │   ├── gallery-4.jpg
│   │   ├── gallery-4.webp
│   │   ├── gallery-5.jpg
│   │   └── gallery-5.webp
│   └── testimonials/
│       └── testimonial-avatar.png
├── backgrounds/
│   ├── about-contact-cta-bg.jpg
│   ├── about-contact-cta-bg.webp
│   ├── about-final-cta-bg.png
│   └── about-final-cta-bg.webp
└── icons/
    ├── arrow-right.svg
    ├── arrow-right-white.svg
    ├── arrow-right-white-alt.svg
    ├── arrow-left-nav.svg
    ├── arrow-right-nav.svg
    └── star.svg
```

---

## Migration Steps

### Step 1: Export from Figma/Legacy

```bash
# Assets already exist in legacy implementation at:
# /legacy/About/public/img/

# Copy to temp directory
cp /path/to/legacy/img/*.{png,jpg,svg} .tmp/figma-assets-about/images/
```

### Step 2: Optimize Assets

```bash
# Run optimization script
npm run optimize-images .tmp/figma-assets-about/
```

### Step 3: Move to Public Directory

```bash
# Move optimized assets to public directory
cp -r .tmp/figma-assets-about/images/* /public/img/
cp -r .tmp/figma-assets-about/backgrounds/* /public/img/
cp -r .tmp/figma-assets-about/icons/* /public/img/icons/
```

### Step 4: Verify and Clean Up

```bash
# Verify all assets are in place
ls -lh /public/img/about-*
ls -lh /public/img/gallery-*

# Clean up temp directory
rm -rf .tmp/figma-assets-about/
```

---

## Asset Summary

**Total Assets**: 22

- Images (JPG): 11
- Images (PNG): 4
- Icons (SVG): 6
- Decorative: 1

**Total Size (Estimated)**:

- Original: ~3.5 MB
- Optimized: ~1.2 MB
- Savings: ~65%

**WebP Support**:

- All JPG images have WebP variants
- Reduces total size to ~800 KB with WebP

---

## Completion Checklist

- [ ] All 22 assets exported from Figma/Legacy
- [ ] All images optimized (JPG quality 80%)
- [ ] WebP variants generated for all raster images
- [ ] 2x retina versions created for critical images
- [ ] SVG icons optimized with SVGO
- [ ] Assets moved to `/public/img/` directory
- [ ] Import paths updated in component code
- [ ] Temp directory cleaned up
- [ ] Assets verified in browser (no 404s)

---

**Status**: Asset list complete, ready for export and optimization
**Next Action**: Export assets from Figma or copy from legacy implementation
