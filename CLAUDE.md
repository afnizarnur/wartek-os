# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Wartek OS is a macOS-inspired web-based operating system where team members build self-contained widget applications. Each widget runs in its own iframe for isolation.

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run test         # Run Vitest tests
```

## Architecture

### Entry Point
`src/main.jsx` → ReactDOM.createRoot → `<App />`

### App Component (src/App.jsx)
- Uses `import.meta.glob` to auto-discover widgets via `/src/apps/*/manifest.json`
- Manages widget registry and window state via `useOS()` hook
- Renders: MenuBar, DesktopIcon, Window, Dock

### Core Components (src/core/components/)
- **Window** - macOS-style window with draggable titlebar, resize handles, close/min/max buttons
- **Dock** - Bottom dock with magnification effect, active indicators
- **MenuBar** - Top bar with Apple logo, active app name, time/date, WiFi/Battery icons
- **DesktopIcon** - Desktop shortcuts that open widgets on double-click

### Widget System

Widgets are discovered automatically via `import.meta.glob('/src/apps/*/manifest.json')` and rendered inside iframes.

**Widget structure:**
```
src/apps/[widget-name]/
├── manifest.json     # Widget metadata (id, name, author, dimensions)
├── index.html        # Widget HTML
├── main.js           # Widget logic (vanilla JS - no React)
└── style.css         # Widget styling
```

**Manifest schema:**
```json
{
  "id": "widget-id",
  "name": "Display Name",
  "author": "Your Name",
  "version": "1.0.0",
  "description": "What it does",
  "icon": "data:image/svg+xml,...",
  "width": 400,
  "height": 500,
  "resizable": true,
  "defaultWidth": 400,
  "defaultHeight": 500,
  "tags": ["category"]
}
```

**Widget template:** `src/apps/_templates/`

### State Management

- `useOS()` hook (src/core/hooks/useOS.js) manages open windows (open, close, focus, z-index)
- Global z-index counter starts at 1000, increments on window focus
- localStorage uses `wartek.` prefix for keys

### Styling

- Pure CSS (no frameworks) in `src/core/styles/globals.css`
- BEM-ish naming convention: `.window-titlebar`, `.dock-container`
- GPU-accelerated dragging via CSS transforms

### Icons

Lucide-react icons are used. Icon-to-widget mapping is hardcoded in Dock and DesktopIcon components:
```javascript
const iconMap = {
  'sticky-notes': StickyNote,
  'team-mood': Users,
  'hex-converter': Palette,
  'pomodoro': Timer
};
```

## Conventions

- React components: PascalCase (`Window.jsx`, `Dock.jsx`)
- Hooks: camelCase with `use` prefix (`useOS.js`)
- Widgets use vanilla JavaScript (no React inside widgets)
- All localStorage keys prefixed with `wartek.`
