# Reiki Goddess Healing - Main Application

## Overview

This is the main application for The Reiki Goddess Healing website, built as part of the monorepo migration project. It uses the composed components extracted from the Anima-generated designs during Phases 1-3 of the migration.

## Structure

```
apps/main/
├── src/
│   ├── pages/           # Page components that use composed components
│   │   ├── Home.tsx      # Home page route
│   │   ├── About.tsx     # About page route
│   │   ├── Contact.tsx   # Contact page route
│   │   └── Blog.tsx      # Blog page route (temporary)
│   ├── App.tsx           # Router configuration
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles with CSS variables
├── index.html            # HTML entry point
├── package.json          # Dependencies and scripts
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
├── tailwind.config.js    # TailwindCSS configuration
└── postcss.config.js     # PostCSS configuration
```

## Routes

- `/` - Home page displaying the wireframe design
- `/about` - About page with business information and testimonials
- `/contact` - Contact page with form and contact details
- `/blog` - Blog page (currently shows About page as placeholder)

## Development

### Start Development Server

```bash
npm run dev
```

The application will be available at http://localhost:5173

### Build for Production

```bash
npm run build
```

### Type Checking

```bash
npm run type-check
```

## Components Used

This application uses the following composed components from `@reiki-goddess/shared-components`:

- `HomeComposed` - Complete home page layout
- `AboutComposed` - Complete about page with 8 sections
- `ContactComposed` - Complete contact page with form

## Styling

- Uses TailwindCSS with custom CSS variables from Anima designs
- Maintains exact visual fidelity with original designs
- Responsive wrapper using AnimaContainer for 1440px design

## CSS Variables

The application uses the following Anima design system colors:

- `--variable-collection-color`: Primary blue
- `--variable-collection-color-2`: Purple accent
- `--variable-collection-color-3`: Peach accent
- `--variable-collection-color-4`: Cyan accent
- `--variable-collection-color-6`: White
- Plus additional shades and variations

## Assets

All images are served from `@reiki-goddess/shared-assets` package:
- 63 total images organized by page (about, contact, home, blog)
- Properly organized in the shared-assets package

## Notes

- Blog page currently uses AboutComposed as BLog folder was found to be duplicate
- All components maintain exact Anima styling - no modifications
- TypeScript strict mode enabled
- Full monorepo integration with workspace dependencies