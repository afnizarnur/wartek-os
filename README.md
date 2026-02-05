# Wartek OS

A macOS-inspired Team Web OS where team members build self-contained widgets.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Adding Your Widget

1. Copy the template folder:
   ```bash
   cp -r src/apps/_templates src/apps/[your-name]/[widget-name]
   ```

2. Update `manifest.json` with your widget info

3. Build your widget in `index.html`, `style.css`, and `main.js`

4. Refresh the page - your icon appears automatically!

## Available Widgets

- **Sticky Notes** - Classic yellow sticky notes (Sarah)
- **Team Mood** - Emoji voting for team mood (Mira)
- **Hex Converter** - Color format converter (Jason)
- **Pomodoro** - Focus timer (Alex)

## Tech Stack

- React 18
- Vite
- CSS (no frameworks)
- localStorage for persistence

## License

MIT
