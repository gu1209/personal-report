# PDF Export Guide

This portfolio supports exporting your resume as PDF.

## How to Use

1. Click the export button on the portfolio page
2. Select the experiences and projects to include
3. Adjust font sizes if needed
4. Click export to download

## Adding Your Photo and Logo

Place your profile photo at `public/images/profile.jpg` and your university/company
logo in the `public/logos/` directory.

To embed images in PDF export, run:

```bash
node scripts/convertImageToBase64.js public/images/profile.jpg
```

Then copy the output into `lib/exportResumePDF.tsx`:

```typescript
basic: {
  photoUrl: 'data:image/jpeg;base64,...',
  logoUrl:  'data:image/svg+xml;base64,...',
}
```

## Fonts

Chinese fonts are loaded from `public/fonts/`. If PDF Chinese text appears as boxes,
ensure the font files exist:
- `public/fonts/NotoSansSC-Regular.ttf`
- `public/fonts/SourceHanSansSC-Regular.otf`
