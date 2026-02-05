# Contributing to Wartek OS

## Welcome!

This is a beginner-friendly project where you can learn web development by building fun widgets for your team's OS.

## Your First Widget

### Step 1: Copy the Template

```bash
cp -r src/apps/_templates src/apps/yourname/your-widget
```

### Step 2: Edit the Manifest

Update `manifest.json`:
```json
{
  "id": "your-widget",
  "name": "Your Widget",
  "author": "Your Name",
  "description": "What your widget does",
  "icon": "data:image/svg+xml,..."
}
```

### Step 3: Build Your Widget

- `index.html` - Your widget's structure
- `style.css` - Styling
- `main.js` - Interactivity

### Step 4: See It Live

Refresh the page. Your icon appears on the desktop!

## Guidelines

- Widgets are isolated (they can't break the OS)
- Use localStorage for saving data
- Have fun and experiment!

## Questions?

Open an issue or ask in team chat.
