# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install        # Install dependencies
npm run dev        # Start development server (localhost:3000)
npm run build      # Build and statically export to ./out/
npm run lint       # Run ESLint
```

Static export output goes to `./out/`. GitHub Actions (`.github/workflows/deploy.yml`) deploys automatically on push to main/master.

## Architecture

**Next.js 14 App Router static site** — configured with `output: 'export'` for GitHub Pages deployment. All components use `'use client'`.

### Key files

- `app/page.tsx` — The entire portfolio page. All content (experiences, projects, skills) lives here as TypeScript objects, not in separate data files.
- `app/layout.tsx` — Root layout with SEO metadata and OpenGraph tags.
- `components/ResumeExportModal.tsx` — Modal UI letting users select experiences/projects for DOCX export.
- `components/logos.tsx` — SVG logo components for companies and universities.
- `lib/ResumeConverter.ts` — Converts selected portfolio data to DOCX using the `docx` library with STAR-method formatting.

### Bilingual content pattern

All text content in `page.tsx` uses a parallel structure: Chinese keys (e.g., `title`) and English keys (e.g., `titleEn`). A `language` state variable (`'zh' | 'en'`) toggles between them inline — no i18n library is actually used despite `i18next` being installed.

### Styling

Tailwind CSS with a custom extended palette defined in `tailwind.config.js`: `primary` (blue scale 50–950) and a custom `gray` scale. Inter font via Google Fonts.

### Static export constraints

- `next.config.js` sets `images: { unoptimized: true }` — required for static export; don't remove this.
- `trailingSlash: true` is set for GitHub Pages URL compatibility.
- No server-side features (API routes, server components with data fetching) can be used.
