# Favicon Generation Guide for Adam Bikes

## Source File
Use `public/icon.svg` as the source for generating all favicon sizes.

## Required Favicon Files to Generate

### Standard Favicons
- `favicon.ico` (16x16, 32x32, 48x48 combined)
- `favicon-16x16.png`
- `favicon-32x32.png`
- `favicon-96x96.png`

### Apple Touch Icons (for iPhone, iPad home screen)
- `apple-icon-57x57.png`
- `apple-icon-60x60.png`
- `apple-icon-72x72.png`
- `apple-icon-76x76.png`
- `apple-icon-114x114.png`
- `apple-icon-120x120.png`
- `apple-icon-144x144.png`
- `apple-icon-152x152.png`
- `apple-icon-180x180.png` ✅ (already exists)

### Android/Chrome Icons
- `android-icon-36x36.png`
- `android-icon-48x48.png`
- `android-icon-72x72.png`
- `android-icon-96x96.png`
- `android-icon-144x144.png`
- `android-icon-192x192.png` ✅ (already exists)
- `android-icon-512x512.png`

### Microsoft Tile Icons
- `ms-icon-70x70.png`
- `ms-icon-144x144.png`
- `ms-icon-150x150.png`
- `ms-icon-310x310.png`

## Generation Tools

### Online Tools (Recommended)
1. **RealFaviconGenerator** (https://realfavicongenerator.net/)
   - Upload your SVG logo
   - Automatically generates all sizes
   - Provides optimized code

2. **Favicon.io** (https://favicon.io/)
   - Simple drag-and-drop
   - Generates common sizes

### Manual Generation
Use image editing software like:
- Photoshop
- GIMP
- Figma
- Sketch

## After Generation
1. Replace the placeholder files in the `public/` directory
2. The configuration in `app/layout.tsx` and `public/manifest.json` is already set up
3. Test on different devices and browsers

## Testing Checklist
- [ ] Desktop browsers (Chrome, Firefox, Safari, Edge)
- [ ] iPhone Safari (add to home screen)
- [ ] Android Chrome (add to home screen)
- [ ] Windows taskbar pinning
- [ ] Browser tabs show the icon

## Current Status
✅ Configuration files ready
✅ Manifest.json configured
✅ Layout.tsx updated
⏳ Need to generate actual image files 