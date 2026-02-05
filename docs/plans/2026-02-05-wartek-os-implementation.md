# Wartek OS Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a macOS-inspired Team Web OS where team members build self-contained widgets in their own folders. The OS auto-discovers widgets via manifest files and renders them on a desktop with window management.

**Architecture:** Frontend-only React app using Vite. Widgets are self-contained HTML/CSS/JS bundles loaded in iframes within OS-managed windows. Auto-discovery via Vite's import.meta.glob. localStorage for persistence.

**Tech Stack:** React 18, Vite, CSS Modules (or plain CSS), localStorage, iframes for widget isolation.

---

## Prerequisites

```bash
# Initialize the project
npm create vite@latest wartek-os -- --template react
cd wartek-os
npm install
```

---

## Phase 1: Core OS Shell

### Task 1: Project Setup and Directory Structure

**Files:**
- Create: `/src/core/components/Window.jsx`
- Create: `/src/core/components/Dock.jsx`
- Create: `/src/core/components/DesktopIcon.jsx`
- Create: `/src/core/components/MenuBar.jsx`
- Create: `/src/core/hooks/useOS.js`
- Create: `/src/core/lib/registry.js`
- Create: `/src/core/lib/storage.js`
- Create: `/src/core/styles/globals.css`
- Create: `/src/apps/_templates/index.html`
- Create: `/src/apps/_templates/style.css`
- Create: `/src/apps/_templates/main.js`
- Create: `/src/apps/_templates/manifest.json`

**Step 1: Initialize React + Vite project**

```bash
cd /Users/afnizarnur/Development/wartek-os
npm create vite@latest . -- --template react
npm install
```

**Step 2: Create directory structure**

```bash
mkdir -p src/core/components src/core/hooks src/core/lib src/core/styles
mkdir -p src/apps/_templates
mkdir -p src/assets
```

**Step 3: Create base globals.css**

```css
/* src/core/styles/globals.css */
:root {
  --window-bg: #ffffff;
  --window-border: #e0e0e0;
  --window-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  --dock-bg: rgba(255, 255, 255, 0.8);
  --desktop-bg: url('/assets/wallpaper.jpg') center/cover;
  --system-font: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--system-font);
  overflow: hidden;
  width: 100vw;
  height: 100vh;
}
```

**Step 4: Commit**

```bash
git add -A
git commit -m "chore: initialize React + Vite project with directory structure"
```

---

### Task 2: Window Component (Draggable/Resizable Window Chrome)

**Files:**
- Create: `/src/core/components/Window.jsx`
- Create: `/src/core/components/Window.css`
- Test: `tests/core/components/Window.test.jsx`

**Step 1: Write failing test**

```jsx
// tests/core/components/Window.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Window } from '../../../src/core/components/Window';

describe('Window', () => {
  it('renders title bar with given title', () => {
    render(<Window title="Test App" />);
    expect(screen.getByText('Test App')).toBeInTheDocument();
  });

  it('renders close button', () => {
    render(<Window title="Test App" />);
    expect(screen.getByRole('button', { name: /✕/ })).toBeInTheDocument();
  });

  it('calls onClose when close button clicked', () => {
    const onClose = jest.fn();
    render(<Window title="Test App" onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: /✕/ }));
    expect(onClose).toHaveBeenCalled();
  });
});
```

**Step 2: Run test to verify it fails**

```bash
npm test -- --testPathPattern="Window.test" --watchAll=false
# Expected: FAIL - Window component not found
```

**Step 3: Implement Window component**

```jsx
// src/core/components/Window.jsx
import { useState, useRef, useEffect } from 'react';
import './Window.css';

export function Window({
  title,
  children,
  onClose,
  defaultWidth = 400,
  defaultHeight = 500,
  resizable = true
}) {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [size, setSize] = useState({ width: defaultWidth, height: defaultHeight });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragRef = useRef(null);
  const resizeRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        setPosition(prev => ({
          x: prev.x + e.movementX,
          y: prev.y + e.movementY
        }));
      }
      if (isResizing) {
        setSize(prev => ({
          width: Math.max(200, prev.width + e.movementX),
          height: Math.max(150, prev.height + e.movementY)
        }));
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing]);

  return (
    <div
      className="window"
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex: 1000
      }}
    >
      <div
        className="window-titlebar"
        ref={dragRef}
        onMouseDown={(e) => {
          if (e.target === dragRef.current) {
            setIsDragging(true);
          }
        }}
      >
        <div className="window-controls">
          <button className="close" onClick={onClose}>✕</button>
          <button className="minimize">−</button>
          <button className="maximize">⤢</button>
        </div>
        <span className="window-title">{title}</span>
      </div>
      <div className="window-content">
        {children}
      </div>
      {resizable && (
        <div
          className="window-resize"
          ref={resizeRef}
          onMouseDown={(e) => {
            e.preventDefault();
            setIsResizing(true);
          }}
        />
      )}
    </div>
  );
}
```

```css
/* src/core/components/Window.css */
.window {
  position: absolute;
  background: var(--window-bg);
  border-radius: 10px;
  box-shadow: var(--window-shadow);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.window-titlebar {
  height: 38px;
  background: linear-gradient(180deg, #f0f0f0 0%, #e0e0e0 100%);
  display: flex;
  align-items: center;
  padding: 0 12px;
  cursor: grab;
  user-select: none;
}

.window-titlebar:active {
  cursor: grabbing;
}

.window-controls {
  display: flex;
  gap: 8px;
}

.window-controls button {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
}

.window-controls .close { background: #ff5f57; }
.window-controls .minimize { background: #ffbd2e; }
.window-controls .maximize { background: #28c940; }

.window-title {
  flex: 1;
  text-align: center;
  font-size: 13px;
  font-weight: 500;
  color: #333;
}

.window-content {
  flex: 1;
  overflow: auto;
}

.window-resize {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 16px;
  height: 16px;
  cursor: se-resize;
}
```

**Step 4: Run test to verify it passes**

```bash
npm test -- --testPathPattern="Window.test" --watchAll=false
# Expected: PASS
```

**Step 5: Commit**

```bash
git add src/core/components/Window.jsx src/core/components/Window.css tests/core/components/Window.test.jsx
git commit -m "feat: implement Window component with drag and resize"
```

---

### Task 3: useOS Hook (Window Management)

**Files:**
- Create: `/src/core/hooks/useOS.js`
- Test: `tests/core/hooks/useOS.test.js`

**Step 1: Write failing test**

```javascript
// tests/core/hooks/useOS.test.js
import { renderHook, act } from '@testing-library/react';
import { useOS } from '../../../src/core/hooks/useOS';

describe('useOS', () => {
  it('starts with no open windows', () => {
    const { result } = renderHook(() => useOS());
    expect(result.current.openWindows).toEqual([]);
  });

  it('opens a window', () => {
    const { result } = renderHook(() => useOS());
    act(() => {
      result.current.openWindow('sticky-notes');
    });
    expect(result.current.openWindows).toHaveLength(1);
    expect(result.current.openWindows[0].id).toBe('sticky-notes');
  });

  it('closes a window', () => {
    const { result } = renderHook(() => useOS());
    act(() => {
      result.current.openWindow('sticky-notes');
      result.current.closeWindow('sticky-notes');
    });
    expect(result.current.openWindows).toHaveLength(0);
  });

  it('focuses a window when opened', () => {
    const { result } = renderHook(() => useOS());
    act(() => {
      result.current.openWindow('sticky-notes');
      result.current.openWindow('team-mood');
    });
    const focused = result.current.openWindows.find(w => w.isFocused);
    expect(focused.id).toBe('team-mood');
  });
});
```

**Step 2: Run test to verify it fails**

```bash
npm test -- --testPathPattern="useOS.test" --watchAll=false
# Expected: FAIL - useOS not found
```

**Step 3: Implement useOS hook**

```javascript
// src/core/hooks/useOS.js
import { useState, useCallback } from 'react';

export function useOS() {
  const [openWindows, setOpenWindows] = useState([]);
  const [nextZIndex, setNextZIndex] = useState(100);

  const openWindow = useCallback((widgetId) => {
    setOpenWindows(prev => {
      // Check if already open
      if (prev.find(w => w.id === widgetId)) {
        // Bring to front
        return prev.map(w =>
          w.id === widgetId
            ? { ...w, isFocused: true, zIndex: nextZIndex }
            : { ...w, isFocused: false }
        );
      }
      setNextZIndex(z => z + 1);
      return [
        ...prev,
        {
          id: widgetId,
          isFocused: true,
          zIndex: nextZIndex
        }
      ];
    });
  }, [nextZIndex]);

  const closeWindow = useCallback((widgetId) => {
    setOpenWindows(prev => prev.filter(w => w.id !== widgetId));
  }, []);

  const focusWindow = useCallback((widgetId) => {
    setNextZIndex(z => z + 1);
    setOpenWindows(prev =>
      prev.map(w =>
        w.id === widgetId
          ? { ...w, isFocused: true, zIndex: nextZIndex }
          : { ...w, isFocused: false }
      )
    );
  }, [nextZIndex]);

  return {
    openWindows,
    openWindow,
    closeWindow,
    focusWindow
  };
}
```

**Step 4: Run test to verify it passes**

```bash
npm test -- --testPathPattern="useOS.test" --watchAll=false
# Expected: PASS
```

**Step 5: Commit**

```bash
git add src/core/hooks/useOS.js tests/core/hooks/useOS.test.js
git commit -m "feat: implement useOS hook for window management"
```

---

### Task 4: Registry (Auto-Discovery)

**Files:**
- Create: `/src/core/lib/registry.js`
- Test: `tests/core/lib/registry.test.js`

**Step 1: Write failing test**

```javascript
// tests/core/lib/registry.test.js
import { buildRegistry } from '../../../src/core/lib/registry';

describe('Registry', () => {
  it('discovers widgets from apps directory', () => {
    const registry = buildRegistry();
    expect(registry['sticky-notes']).toBeDefined();
    expect(registry['team-mood']).toBeDefined();
    expect(registry['hex-converter']).toBeDefined();
    expect(registry['pomodoro']).toBeDefined();
  });

  it('includes manifest data for each widget', () => {
    const registry = buildRegistry();
    expect(registry['sticky-notes'].manifest.name).toBe('Sticky Notes');
    expect(registry['sticky-notes'].manifest.author).toBeDefined();
  });

  it('provides path to widget entry point', () => {
    const registry = buildRegistry();
    expect(registry['sticky-notes'].path).toContain('sticky-notes');
  });
});
```

**Step 2: Run test to verify it fails**

```bash
npm test -- --testPathPattern="registry.test" --watchAll=false
# Expected: FAIL - registry not found
```

**Step 3: Create sample manifest files first**

```json
// src/apps/_templates/manifest.json
{
  "id": "template",
  "name": "Widget Template",
  "author": "Your Name",
  "version": "1.0.0",
  "description": "Copy this template to create a new widget",
  "icon": "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%23666' width='100' height='100' rx='10'/><text x='50' y='55' text-anchor='middle' fill='white' font-size='40'>?</text></svg>",
  "width": 400,
  "height": 500,
  "resizable": true,
  "defaultWidth": 400,
  "defaultHeight": 500,
  "tags": ["template"]
}
```

```json
// src/apps/sample-widgets/sticky-notes/manifest.json
{
  "id": "sticky-notes",
  "name": "Sticky Notes",
  "author": "Sarah",
  "version": "1.0.0",
  "description": "Classic yellow sticky notes for the desktop",
  "icon": "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%23ffeb3b' width='100' height='100' rx='10'/><text x='50' y='55' text-anchor='middle' fill='%23333' font-size='40'>📝</text></svg>",
  "width": 400,
  "height": 500,
  "resizable": true,
  "defaultWidth": 400,
  "defaultHeight": 500,
  "tags": ["productivity", "notes"]
}
```

```json
// src/apps/sample-widgets/team-mood/manifest.json
{
  "id": "team-mood",
  "name": "Team Mood",
  "author": "Mira",
  "version": "1.0.0",
  "description": "Emoji voting for team mood",
  "icon": "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%23e91e63' width='100' height='100' rx='10'/><text x='50' y='55' text-anchor='middle' fill='white' font-size='40'>😊</text></svg>",
  "width": 320,
  "height": 400,
  "resizable": false,
  "defaultWidth": 320,
  "defaultHeight": 400,
  "tags": ["social", "team"]
}
```

```json
// src/apps/sample-widgets/hex-converter/manifest.json
{
  "id": "hex-converter",
  "name": "Hex Converter",
  "author": "Jason",
  "version": "1.0.0",
  "description": "Convert between HEX, RGB, and HSL color formats",
  "icon": "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%239c27b0' width='100' height='100' rx='10'/><text x='50' y='55' text-anchor='middle' fill='white' font-size='40'>🎨</text></svg>",
  "width": 380,
  "height": 300,
  "resizable": false,
  "defaultWidth": 380,
  "defaultHeight": 300,
  "tags": ["tools", "design"]
}
```

```json
// src/apps/sample-widgets/pomodoro/manifest.json
{
  "id": "pomodoro",
  "name": "Pomodoro",
  "author": "Alex",
  "version": "1.0.0",
  "description": "25-minute focus timer",
  "icon": "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%23f44336' width='100' height='100' rx='10'/><text x='50' y='55' text-anchor='middle' fill='white' font-size='40'>🍅</text></svg>",
  "width": 300,
  "height": 400,
  "resizable": false,
  "defaultWidth": 300,
  "defaultHeight": 400,
  "tags": ["productivity", "timer"]
}
```

**Step 4: Implement registry**

```javascript
// src/core/lib/registry.js
import.meta.glob('/src/apps/*/manifest.json', { eager: true });

export function buildRegistry() {
  const modules = import.meta.glob('/src/apps/*/manifest.json', { eager: true });

  const registry = {};

  for (const path in modules) {
    const manifest = modules[path].default || modules[path];

    // Extract widget name from path: /src/apps/sticky-notes/manifest.json -> sticky-notes
    const match = path.match(/\/src\/apps\/([^/]+)\//);
    if (!match) continue;

    const widgetId = match[1];

    registry[widgetId] = {
      id: manifest.id || widgetId,
      name: manifest.name,
      author: manifest.author,
      version: manifest.version,
      description: manifest.description,
      icon: manifest.icon,
      path: `/src/apps/${widgetId}`,
      width: manifest.width,
      height: manifest.height,
      resizable: manifest.resizable,
      defaultWidth: manifest.defaultWidth || manifest.width,
      defaultHeight: manifest.defaultHeight || manifest.height,
      tags: manifest.tags || []
    };
  }

  return registry;
}

export function getWidgetPath(widgetId) {
  return `/src/apps/${widgetId}`;
}
```

**Step 5: Run test to verify it passes**

```bash
npm test -- --testPathPattern="registry.test" --watchAll=false
# Expected: PASS (assuming manifests are in place)
```

**Step 6: Commit**

```bash
git add src/core/lib/registry.js tests/core/lib/registry.test.js
git add src/apps/_templates/manifest.json
git add src/apps/sample-widgets/*/manifest.json
git commit -m "feat: implement registry with auto-discovery from manifests"
```

---

## Phase 2: UI Components

### Task 5: Dock Component

**Files:**
- Create: `/src/core/components/Dock.jsx`
- Create: `/src/core/components/Dock.css`
- Test: `tests/core/components/Dock.test.jsx`

**Step 1: Write failing test**

```jsx
// tests/core/components/Dock.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Dock } from '../../../src/core/components/Dock';

const mockWidgets = [
  { id: 'sticky-notes', name: 'Sticky Notes', icon: '📝' },
  { id: 'team-mood', name: 'Team Mood', icon: '😊' }
];

describe('Dock', () => {
  it('renders all widget icons', () => {
    render(<Dock widgets={mockWidgets} onOpen={() => {}} />);
    expect(screen.getByText('📝')).toBeInTheDocument();
    expect(screen.getByText('😊')).toBeInTheDocument();
  });

  it('calls onOpen when icon clicked', () => {
    const onOpen = jest.fn();
    render(<Dock widgets={mockWidgets} onOpen={onOpen} />);
    fireEvent.click(screen.getByText('📝'));
    expect(onOpen).toHaveBeenCalledWith('sticky-notes');
  });
});
```

**Step 2: Run test to verify it fails**

```bash
npm test -- --testPathPattern="Dock.test" --watchAll=false
# Expected: FAIL - Dock not found
```

**Step 3: Implement Dock component**

```jsx
// src/core/components/Dock.jsx
import { useState } from 'react';
import './Dock.css';

export function Dock({ widgets, onOpen, activeWindows = [] }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="dock">
      <div className="dock-container">
        {widgets.map((widget) => {
          const isActive = activeWindows.some(w => w.id === widget.id);
          const isHovered = hovered === widget.id;

          return (
            <div
              key={widget.id}
              className={`dock-item ${isActive ? 'active' : ''}`}
              onClick={() => onOpen(widget.id)}
              onMouseEnter={() => setHovered(widget.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <img src={widget.icon} alt={widget.name} />
              {isActive && <div className="dock-indicator" />}
              <span className="dock-tooltip">{widget.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

```css
/* src/core/components/Dock.css */
.dock {
  position: fixed;
  bottom: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  z-index: 9999;
}

.dock-container {
  display: flex;
  gap: 8px;
  padding: 8px 16px;
  background: var(--dock-bg);
  backdrop-filter: blur(20px);
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

.dock-item {
  position: relative;
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.dock-item:hover {
  transform: translateY(-8px) scale(1.2);
}

.dock-item img {
  width: 48px;
  height: 48px;
  border-radius: 10px;
}

.dock-indicator {
  position: absolute;
  bottom: -4px;
  width: 4px;
  height: 4px;
  background: #333;
  border-radius: 50%;
}

.dock-tooltip {
  position: absolute;
  top: -32px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
}

.dock-item:hover .dock-tooltip {
  opacity: 1;
}
```

**Step 4: Run test to verify it passes**

```bash
npm test -- --testPathPattern="Dock.test" --watchAll=false
# Expected: PASS
```

**Step 5: Commit**

```bash
git add src/core/components/Dock.jsx src/core/components/Dock.css tests/core/components/Dock.test.jsx
git commit -m "feat: implement Dock component with magnification effect"
```

---

### Task 6: DesktopIcon Component

**Files:**
- Create: `/src/core/components/DesktopIcon.jsx`
- Create: `/src/core/components/DesktopIcon.css`
- Test: `tests/core/components/DesktopIcon.test.jsx`

**Step 1: Write failing test**

```jsx
// tests/core/components/DesktopIcon.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { DesktopIcon } from '../../../src/core/components/DesktopIcon';

const mockWidget = {
  id: 'sticky-notes',
  name: 'Sticky Notes',
  icon: 'data:image/svg+xml,<svg></svg>'
};

describe('DesktopIcon', () => {
  it('renders icon and name', () => {
    render(<DesktopIcon widget={mockWidget} onOpen={() => {}} />);
    expect(screen.getByText('Sticky Notes')).toBeInTheDocument();
  });

  it('calls onOpen when clicked', () => {
    const onOpen = jest.fn();
    render(<DesktopIcon widget={mockWidget} onOpen={onOpen} />);
    fireEvent.doubleClick(screen.getByText('Sticky Notes'));
    expect(onOpen).toHaveBeenCalledWith('sticky-notes');
  });
});
```

**Step 2: Run test to verify it fails**

```bash
npm test -- --testPathPattern="DesktopIcon.test" --watchAll=false
# Expected: FAIL - DesktopIcon not found
```

**Step 3: Implement DesktopIcon component**

```jsx
// src/core/components/DesktopIcon.jsx
import './DesktopIcon.css';

export function DesktopIcon({ widget, onOpen }) {
  return (
    <div
      className="desktop-icon"
      onDoubleClick={() => onOpen(widget.id)}
    >
      <img src={widget.icon} alt={widget.name} />
      <span className="icon-label">{widget.name}</span>
    </div>
  );
}
```

```css
/* src/core/components/DesktopIcon.css */
.desktop-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80px;
  padding: 8px;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.2s;
}

.desktop-icon:hover {
  background: rgba(255, 255, 255, 0.2);
}

.desktop-icon img {
  width: 64px;
  height: 64px;
  margin-bottom: 6px;
}

.icon-label {
  font-size: 11px;
  color: white;
  text-align: center;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
  word-wrap: break-word;
  max-width: 80px;
}
```

**Step 4: Run test to verify it passes**

```bash
npm test -- --testPathPattern="DesktopIcon.test" --watchAll=false
# Expected: PASS
```

**Step 5: Commit**

```bash
git add src/core/components/DesktopIcon.jsx src/core/components/DesktopIcon.css tests/core/components/DesktopIcon.test.jsx
git commit -m "feat: implement DesktopIcon component"
```

---

### Task 7: MenuBar Component

**Files:**
- Create: `/src/core/components/MenuBar.jsx`
- Create: `/src/core/components/MenuBar.css`
- Test: `tests/core/components/MenuBar.test.jsx`

**Step 1: Write failing test**

```jsx
// tests/core/components/MenuBar.test.jsx
import { render, screen } from '@testing-library/react';
import { MenuBar } from '../../../src/core/components/MenuBar';

describe('MenuBar', () => {
  it('shows Apple menu', () => {
    render(<MenuBar activeApp="" />);
    expect(screen.getByText('')).toBeInTheDocument();
  });

  it('shows current time', () => {
    render(<MenuBar activeApp="" />);
    // Time is formatted, just check it's present
    const timeRegex = /\d{1,2}:\d{2}/;
    expect(screen.getByText(timeRegex)).toBeInTheDocument();
  });

  it('shows active app name', () => {
    render(<MenuBar activeApp="Sticky Notes" />);
    expect(screen.getByText('Sticky Notes')).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

```bash
npm test -- --testPathPattern="MenuBar.test" --watchAll=false
# Expected: FAIL - MenuBar not found
```

**Step 3: Implement MenuBar component**

```jsx
// src/core/components/MenuBar.jsx
import { useState, useEffect } from 'react';
import './MenuBar.css';

export function MenuBar({ activeApp = '' }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="menu-bar">
      <div className="menu-left">
        <span className="apple-logo"></span>
        <span className="menu-app">{activeApp || 'Finder'}</span>
        <span className="menu-item">File</span>
        <span className="menu-item">Edit</span>
        <span className="menu-item">View</span>
        <span className="menu-item">Window</span>
        <span className="menu-item">Help</span>
      </div>
      <div className="menu-right">
        <span className="menu-icon">🔋</span>
        <span className="menu-icon">📶</span>
        <span>{formatTime(time)}</span>
        <span>{formatDate(time)}</span>
      </div>
    </div>
  );
}
```

```css
/* src/core/components/MenuBar.css */
.menu-bar {
  height: 28px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  font-size: 13px;
  font-weight: 500;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.menu-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.apple-logo {
  font-size: 16px;
  font-weight: 600;
}

.menu-app {
  font-weight: 600;
}

.menu-item {
  cursor: pointer;
}

.menu-item:hover {
  opacity: 0.7;
}

.menu-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.menu-icon {
  font-size: 14px;
}
```

**Step 4: Run test to verify it passes**

```bash
npm test -- --testPathPattern="MenuBar.test" --watchAll=false
# Expected: PASS
```

**Step 5: Commit**

```bash
git add src/core/components/MenuBar.jsx src/core/components/MenuBar.css tests/core/components/MenuBar.test.jsx
git commit -m "feat: implement MenuBar with live clock"
```

---

### Task 8: Main App Assembly

**Files:**
- Modify: `/src/App.jsx`
- Modify: `/src/main.jsx`
- Modify: `/src/index.css`

**Step 1: Update App.jsx**

```jsx
// src/App.jsx
import { useState, useEffect } from 'react';
import { MenuBar } from './core/components/MenuBar';
import { Dock } from './core/components/Dock';
import { DesktopIcon } from './core/components/DesktopIcon';
import { Window } from './core/components/Window';
import { useOS } from './core/hooks/useOS';
import { buildRegistry } from './core/lib/registry';
import './core/styles/globals.css';

function App() {
  const [widgets, setWidgets] = useState([]);
  const { openWindows, openWindow, closeWindow, focusWindow } = useOS();

  useEffect(() => {
    const registry = buildRegistry();
    setWidgets(Object.values(registry));
  }, []);

  const getWidget = (id) => widgets.find(w => w.id === id);

  return (
    <div className="app">
      <MenuBar activeApp={openWindows.find(w => w.isFocused)?.id} />

      <div className="desktop">
        {widgets.map((widget) => (
          <DesktopIcon
            key={widget.id}
            widget={widget}
            onOpen={openWindow}
          />
        ))}
      </div>

      {openWindows.map((win) => {
        const widget = getWidget(win.id);
        if (!widget) return null;

        return (
          <Window
            key={win.id}
            title={widget.name}
            defaultWidth={widget.defaultWidth}
            defaultHeight={widget.defaultHeight}
            resizable={widget.resizable}
            onClose={() => closeWindow(win.id)}
          >
            <iframe
              src={`${widget.path}/index.html`}
              style={{ width: '100%', height: '100%', border: 'none' }}
              title={widget.name}
            />
          </Window>
        );
      })}

      <Dock
        widgets={widgets}
        onOpen={openWindow}
        activeWindows={openWindows}
      />
    </div>
  );
}

export default App;
```

**Step 2: Update index.css**

```css
/* src/index.css */
.app {
  width: 100vw;
  height: 100vh;
  background: var(--desktop-bg);
  position: relative;
  overflow: hidden;
}

.desktop {
  position: absolute;
  top: 28px;
  left: 0;
  right: 0;
  bottom: 80px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-content: flex-start;
  padding: 20px;
  gap: 20px;
  overflow: auto;
}
```

**Step 3: Test the app**

```bash
npm run dev
# Expected: OS renders with MenuBar, Desktop icons, and Dock
```

**Step 4: Commit**

```bash
git add src/App.jsx src/index.css
git commit -m "feat: assemble main App with all OS components"
```

---

## Phase 3: Sample Widgets

### Task 9: Sticky Notes Widget

**Files:**
- Create: `/src/apps/sample-widgets/sticky-notes/index.html`
- Create: `/src/apps/sample-widgets/sticky-notes/style.css`
- Create: `/src/apps/sample-widgets/sticky-notes/main.js`

**Step 1: Create index.html**

```html
<!-- src/apps/sample-widgets/sticky-notes/index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sticky Notes</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="toolbar">
    <button id="addNote">+ Add Note</button>
  </div>
  <div id="notesContainer" class="notes-container"></div>
  <script src="main.js"></script>
</body>
</html>
```

**Step 2: Create style.css**

```css
/* src/apps/sample-widgets/sticky-notes/style.css */
* {
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  background: #f5f5f5;
  padding: 12px;
  margin: 0;
}

.toolbar {
  margin-bottom: 12px;
}

.toolbar button {
  background: #007aff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
}

.toolbar button:hover {
  background: #0056b3;
}

.notes-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.note {
  width: 180px;
  min-height: 180px;
  background: #ffeb3b;
  padding: 12px;
  border-radius: 2px;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.15);
  cursor: move;
  position: relative;
  display: flex;
  flex-direction: column;
}

.note textarea {
  flex: 1;
  background: transparent;
  border: none;
  resize: none;
  font-family: inherit;
  font-size: 14px;
  outline: none;
  width: 100%;
}

.note .delete {
  position: absolute;
  top: 4px;
  right: 4px;
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.5;
  font-size: 16px;
}

.note .delete:hover {
  opacity: 1;
}
```

**Step 3: Create main.js**

```javascript
// src/apps/sample-widgets/sticky-notes/main.js
const STORAGE_KEY = 'wartek.sticky-notes.notes';

function loadNotes() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveNotes(notes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function createNoteElement(noteData) {
  const note = document.createElement('div');
  note.className = 'note';
  note.style.left = noteData.x + 'px';
  note.style.top = noteData.y + 'px';

  note.innerHTML = `
    <button class="delete">✕</button>
    <textarea placeholder="Type here...">${noteData.text || ''}</textarea>
  `;

  const textarea = note.querySelector('textarea');
  const deleteBtn = note.querySelector('.delete');

  textarea.addEventListener('input', () => {
    noteData.text = textarea.value;
    saveNotes(getAllNotes());
  });

  deleteBtn.addEventListener('click', () => {
    note.remove();
    saveNotes(getAllNotes());
  });

  makeDraggable(note);

  return note;
}

function makeDraggable(element) {
  let isDragging = false;
  let startX, startY, initialX, initialY;

  element.addEventListener('mousedown', (e) => {
    if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BUTTON') return;

    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    initialX = element.offsetLeft;
    initialY = element.offsetTop;
    element.style.zIndex = 100;
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    element.style.left = (initialX + dx) + 'px';
    element.style.top = (initialY + dy) + 'px';
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      element.style.zIndex = '';
      saveNotes(getAllNotes());
    }
  });
}

function getAllNotes() {
  const notes = [];
  document.querySelectorAll('.note').forEach(noteEl => {
    notes.push({
      text: noteEl.querySelector('textarea').value,
      x: noteEl.offsetLeft,
      y: noteEl.offsetTop
    });
  });
  return notes;
}

function init() {
  const container = document.getElementById('notesContainer');
  const addBtn = document.getElementById('addNote');

  const notes = loadNotes();
  notes.forEach(noteData => {
    container.appendChild(createNoteElement(noteData));
  });

  addBtn.addEventListener('click', () => {
    const noteData = {
      text: '',
      x: Math.random() * 100,
      y: Math.random() * 100
    };
    container.appendChild(createNoteElement(noteData));
    saveNotes(getAllNotes());
  });
}

init();
```

**Step 4: Test the widget**

```bash
npm run dev
# Click Sticky Notes in Dock, verify it opens
# Add notes, drag them, refresh page - notes persist
```

**Step 5: Commit**

```bash
git add src/apps/sample-widgets/sticky-notes/
git commit -m "feat: implement Sticky Notes widget"
```

---

### Task 10: Team Mood Widget

**Files:**
- Create: `/src/apps/sample-widgets/team-mood/index.html`
- Create: `/src/apps/sample-widgets/team-mood/style.css`
- Create: `/src/apps/sample-widgets/team-mood/main.js`

**Step 1: Create index.html**

```html
<!-- src/apps/sample-widgets/team-mood/index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Team Mood</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="mood-header">
    <h2>How's the team feeling today?</h2>
  </div>
  <div class="emoji-grid">
    <button class="emoji-btn" data-mood="happy" data-emoji="😄">
      <span class="emoji">😄</span>
      <span class="label">Happy</span>
      <span class="count" id="count-happy">0</span>
    </button>
    <button class="emoji-btn" data-mood="okay" data-emoji="😐">
      <span class="emoji">😐</span>
      <span class="label">Okay</span>
      <span class="count" id="count-okay">0</span>
    </button>
    <button class="emoji-btn" data-mood="tired" data-emoji="😴">
      <span class="emoji">😴</span>
      <span class="label">Tired</span>
      <span class="count" id="count-tired">0</span>
    </button>
    <button class="emoji-btn" data-mood="stressed" data-emoji="😰">
      <span class="emoji">😰</span>
      <span class="label">Stressed</span>
      <span class="count" id="count-stressed">0</span>
    </button>
  </div>
  <div class="my-vote" id="myVote">Your vote: None</div>
  <script src="main.js"></script>
</body>
</html>
```

**Step 2: Create style.css**

```css
/* src/apps/sample-widgets/team-mood/style.css */
* {
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  min-height: 100vh;
  margin: 0;
}

.mood-header {
  text-align: center;
  color: white;
  margin-bottom: 24px;
}

.mood-header h2 {
  font-size: 18px;
  font-weight: 500;
}

.emoji-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.emoji-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.emoji-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.emoji-btn.voted {
  background: rgba(255, 255, 255, 0.5);
  border-color: white;
}

.emoji {
  font-size: 40px;
}

.label {
  color: white;
  font-size: 14px;
  font-weight: 500;
}

.count {
  background: rgba(0, 0, 0, 0.2);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
}

.my-vote {
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}
```

**Step 3: Create main.js**

```javascript
// src/apps/sample-widgets/team-mood/main.js
const STORAGE_KEY = 'wartek.team-mood.votes';
const MOODS = ['happy', 'okay', 'tired', 'stressed'];

function getVotes() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return { happy: 0, okay: 0, tired: 0, stressed: 0 };
  }
  return JSON.parse(stored);
}

function saveVotes(votes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(votes));
}

function getMyVote() {
  return localStorage.getItem('wartek.team-mood.myVote') || null;
}

function setMyVote(mood) {
  localStorage.setItem('wartek.team-mood.myVote', mood);
}

function updateDisplay() {
  const votes = getVotes();

  MOODS.forEach(mood => {
    const countEl = document.getElementById(`count-${mood}`);
    if (countEl) {
      countEl.textContent = votes[mood];
    }
  });

  const myVote = getMyVote();
  const voteDisplay = document.getElementById('myVote');
  if (voteDisplay) {
    voteDisplay.textContent = myVote
      ? `Your vote: ${moodToEmoji(myVote)}`
      : 'Your vote: None';
  }

  document.querySelectorAll('.emoji-btn').forEach(btn => {
    btn.classList.remove('voted');
    if (btn.dataset.mood === myVote) {
      btn.classList.add('voted');
    }
  });
}

function moodToEmoji(mood) {
  const map = { happy: '😄', okay: '😐', tired: '😴', stressed: '😰' };
  return map[mood] || '';
}

function init() {
  updateDisplay();

  document.querySelectorAll('.emoji-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const mood = btn.dataset.mood;
      const votes = getVotes();

      const oldVote = getMyVote();
      if (oldVote === mood) {
        // Toggle off
        votes[mood]--;
        setMyVote(null);
      } else {
        // Change vote
        if (oldVote) {
          votes[oldVote]--;
        }
        votes[mood]++;
        setMyVote(mood);
      }

      saveVotes(votes);
      updateDisplay();
    });
  });
}

init();
```

**Step 4: Commit**

```bash
git add src/apps/sample-widgets/team-mood/
git commit -m "feat: implement Team Mood widget"
```

---

### Task 11: Hex Converter Widget

**Files:**
- Create: `/src/apps/sample-widgets/hex-converter/index.html`
- Create: `/src/apps/sample-widgets/hex-converter/style.css`
- Create: `/src/apps/sample-widgets/hex-converter/main.js`

**Step 1: Create index.html**

```html
<!-- src/apps/sample-widgets/hex-converter/index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hex Converter</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="converter">
    <div class="input-group">
      <label>HEX</label>
      <div class="input-row">
        <span class="prefix">#</span>
        <input type="text" id="hexInput" placeholder="ff6b6b" maxlength="6">
      </div>
    </div>

    <div class="color-preview" id="preview"></div>

    <div class="output-group">
      <div class="output-row">
        <label>RGB</label>
        <div class="output-value">
          <span id="rgbValue">rgb(0, 0, 0)</span>
          <button class="copy-btn" data-target="rgbValue">Copy</button>
        </div>
      </div>
      <div class="output-row">
        <label>HSL</label>
        <div class="output-value">
          <span id="hslValue">hsl(0, 0%, 0%)</span>
          <button class="copy-btn" data-target="hslValue">Copy</button>
        </div>
      </div>
    </div>
  </div>
  <script src="main.js"></script>
</body>
</html>
```

**Step 2: Create style.css**

```css
/* src/apps/sample-widgets/hex-converter/style.css */
* {
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  padding: 20px;
  margin: 0;
}

.converter {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input-group label,
.output-row label {
  display: block;
  font-size: 11px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.input-row {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0 12px;
  background: white;
}

.prefix {
  color: #999;
  font-size: 16px;
}

.input-row input {
  flex: 1;
  border: none;
  padding: 12px 8px;
  font-size: 16px;
  font-family: 'SF Mono', Monaco, monospace;
  outline: none;
  text-transform: uppercase;
}

.color-preview {
  height: 60px;
  border-radius: 8px;
  background: #000;
  transition: background 0.2s;
}

.output-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.output-row {
  display: flex;
  flex-direction: column;
}

.output-value {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f5f5f5;
  padding: 12px;
  border-radius: 8px;
  font-family: 'SF Mono', Monaco, monospace;
  font-size: 13px;
}

.copy-btn {
  background: #007aff;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-family: inherit;
}

.copy-btn:hover {
  background: #0056b3;
}

.copy-btn:active {
  transform: scale(0.95);
}
```

**Step 3: Create main.js**

```javascript
// src/apps/sample-widgets/hex-converter/main.js
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

function rgbToString(rgb) {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

function hslToString(hsl) {
  return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
}

function updateConversion() {
  const hexInput = document.getElementById('hexInput');
  const preview = document.getElementById('preview');
  const rgbValue = document.getElementById('rgbValue');
  const hslValue = document.getElementById('hslValue');

  let hex = hexInput.value.replace(/[^a-fA-F0-9]/g, '');

  if (hex.length === 6) {
    const rgb = hexToRgb(hex);
    if (rgb) {
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

      preview.style.background = `#${hex}`;
      rgbValue.textContent = rgbToString(rgb);
      hslValue.textContent = hslToString(hsl);
    }
  } else if (hex.length === 0) {
    preview.style.background = '#000';
    rgbValue.textContent = 'rgb(0, 0, 0)';
    hslValue.textContent = 'hsl(0, 0%, 0%)';
  }
}

function copyToClipboard(targetId) {
  const text = document.getElementById(targetId).textContent;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.querySelector(`[data-target="${targetId}"]`);
    const original = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = original, 1000);
  });
}

function init() {
  const hexInput = document.getElementById('hexInput');
  hexInput.addEventListener('input', updateConversion);

  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      copyToClipboard(btn.dataset.target);
    });
  });
}

init();
```

**Step 4: Commit**

```bash
git add src/apps/sample-widgets/hex-converter/
git commit -m "feat: implement Hex Converter widget"
```

---

### Task 12: Pomodoro Widget

**Files:**
- Create: `/src/apps/sample-widgets/pomodoro/index.html`
- Create: `/src/apps/sample-widgets/pomodoro/style.css`
- Create: `/src/apps/sample-widgets/pomodoro/main.js`

**Step 1: Create index.html**

```html
<!-- src/apps/sample-widgets/pomodoro/index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pomodoro</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="pomodoro">
    <div class="timer-ring">
      <svg class="progress-ring" viewBox="0 0 120 120">
        <circle class="progress-bg" cx="60" cy="60" r="54" />
        <circle class="progress-fill" cx="60" cy="60" r="54" />
      </svg>
      <div class="timer-display">
        <span id="minutes">25</span>:<span id="seconds">00</span>
      </div>
    </div>

    <div class="session-type" id="sessionType">Focus Time</div>

    <div class="controls">
      <button id="startBtn" class="control-btn primary">Start</button>
      <button id="pauseBtn" class="control-btn" disabled>Pause</button>
      <button id="resetBtn" class="control-btn">Reset</button>
    </div>

    <div class="stats">
      <div class="stat">
        <span class="stat-value" id="completedToday">0</span>
        <span class="stat-label">Today</span>
      </div>
      <div class="stat">
        <span class="stat-value" id="totalSessions">0</span>
        <span class="stat-label">Total</span>
      </div>
    </div>
  </div>
  <script src="main.js"></script>
</body>
</html>
```

**Step 2: Create style.css**

```css
/* src/apps/sample-widgets/pomodoro/style.css */
* {
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  background: linear-gradient(180deg, #2c2c2c 0%, #1a1a1a 100%);
  padding: 20px;
  min-height: 100vh;
  margin: 0;
  display: flex;
  justify-content: center;
}

.pomodoro {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.timer-ring {
  position: relative;
  width: 160px;
  height: 160px;
}

.progress-ring {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.progress-bg {
  fill: none;
  stroke: #3a3a3a;
  stroke-width: 8;
}

.progress-fill {
  fill: none;
  stroke: #ff6b6b;
  stroke-width: 8;
  stroke-linecap: round;
  stroke-dasharray: 339.292;
  stroke-dashoffset: 0;
  transition: stroke-dashoffset 1s linear;
}

.progress-fill.break {
  stroke: #4ecdc4;
}

.timer-display {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 36px;
  font-weight: 200;
  color: white;
  font-variant-numeric: tabular-nums;
}

.session-type {
  font-size: 14px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.controls {
  display: flex;
  gap: 12px;
}

.control-btn {
  padding: 10px 24px;
  border: none;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  background: #3a3a3a;
  color: white;
  transition: all 0.2s;
}

.control-btn:hover:not(:disabled) {
  background: #4a4a4a;
}

.control-btn.primary {
  background: #ff6b6b;
}

.control-btn.primary:hover:not(:disabled) {
  background: #ff5252;
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.stats {
  display: flex;
  gap: 32px;
  margin-top: 8px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: white;
}

.stat-label {
  font-size: 11px;
  color: #666;
  text-transform: uppercase;
}
```

**Step 3: Create main.js**

```javascript
// src/apps/sample-widgets/pomodoro/main.js
const WORK_TIME = 25 * 60; // 25 minutes in seconds
const BREAK_TIME = 5 * 60; // 5 minutes in seconds
const CIRCUMFERENCE = 2 * Math.PI * 54; // r=54

let timeLeft = WORK_TIME;
let isRunning = false;
let isWorkSession = true;
let timerInterval = null;

const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const sessionTypeEl = document.getElementById('sessionType');
const progressFill = document.querySelector('.progress-fill');
const completedTodayEl = document.getElementById('completedToday');
const totalSessionsEl = document.getElementById('totalSessions');

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function updateDisplay() {
  const time = formatTime(timeLeft);
  minutesEl.textContent = time.split(':')[0];
  secondsEl.textContent = time.split(':')[1];

  const totalTime = isWorkSession ? WORK_TIME : BREAK_TIME;
  const progress = (totalTime - timeLeft) / totalTime;
  progressFill.style.strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  sessionTypeEl.textContent = isWorkSession ? 'Focus Time' : 'Break Time';
  progressFill.classList.toggle('break', !isWorkSession);
}

function loadStats() {
  const today = new Date().toDateString();
  const stored = JSON.parse(localStorage.getItem('wartek.pomodoro.stats') || '{}');

  const todayKey = 'pomodoro.' + today;
  let todayCount = parseInt(localStorage.getItem(todayKey)) || 0;
  let totalCount = parseInt(localStorage.getItem('wartek.pomodoro.total')) || 0;

  completedTodayEl.textContent = todayCount;
  totalSessionsEl.textContent = totalCount;

  return { todayKey, todayCount, totalCount };
}

function saveStats(todayKey, todayCount, totalCount) {
  localStorage.setItem(todayKey, todayCount);
  localStorage.setItem('wartek.pomodoro.total', totalCount);
  completedTodayEl.textContent = todayCount;
  totalSessionsEl.textContent = totalCount;
}

function startTimer() {
  if (isRunning) return;

  isRunning = true;
  startBtn.disabled = true;
  pauseBtn.disabled = false;

  timerInterval = setInterval(() => {
    timeLeft--;
    updateDisplay();

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      playNotification();

      if (isWorkSession) {
        // Completed a work session
        const stats = loadStats();
        saveStats(stats.todayKey, stats.todayCount + 1, stats.totalCount + 1);
      }

      // Switch session type
      isWorkSession = !isWorkSession;
      timeLeft = isWorkSession ? WORK_TIME : BREAK_TIME;
      isRunning = false;
      updateDisplay();
      startBtn.disabled = false;
      pauseBtn.disabled = true;
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  startBtn.disabled = false;
  pauseBtn.disabled = true;
}

function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  isWorkSession = true;
  timeLeft = WORK_TIME;
  updateDisplay();
  startBtn.disabled = false;
  pauseBtn.disabled = true;
}

function playNotification() {
  // Simple audio notification
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = 880;
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.5);
}

function init() {
  loadStats();
  updateDisplay();

  startBtn.addEventListener('click', startTimer);
  pauseBtn.addEventListener('click', pauseTimer);
  resetBtn.addEventListener('click', resetTimer);
}

init();
```

**Step 4: Commit**

```bash
git add src/apps/sample-widgets/pomodoro/
git commit -m "feat: implement Pomodoro widget"
```

---

## Phase 4: Final Integration

### Task 13: Widget Template

**Files:**
- Create: `/src/apps/_templates/index.html`
- Create: `/src/apps/_templates/style.css`
- Create: `/src/apps/_templates/main.js`
- Modify: `/src/apps/_templates/manifest.json`

**Step 1: Create template files**

```html
<!-- src/apps/_templates/index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Widget</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="widget-content">
    <h1>My Widget</h1>
    <p>Replace this with your widget content!</p>
  </div>
  <script src="main.js"></script>
</body>
</html>
```

```css
/* src/apps/_templates/style.css */
* {
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  padding: 16px;
  margin: 0;
  background: #f5f5f5;
}

.widget-content {
  text-align: center;
  padding: 20px;
}
```

```javascript
// src/apps/_templates/main.js
function init() {
  console.log('My Widget initialized!');
}

init();
```

**Step 2: Update manifest.json template**

```json
{
  "id": "my-widget",
  "name": "My Widget",
  "author": "Your Name",
  "version": "1.0.0",
  "description": "My custom widget for Wartek OS",
  "icon": "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%23666' width='100' height='100' rx='10'/><text x='50' y='55' text-anchor='middle' fill='white' font-size='40'>★</text></svg>",
  "width": 400,
  "height": 400,
  "resizable": true,
  "defaultWidth": 400,
  "defaultHeight": 400,
  "tags": ["custom"]
}
```

**Step 3: Commit**

```bash
git add src/apps/_templates/
git commit -m "feat: add widget template for new contributors"
```

---

### Task 14: README and Documentation

**Files:**
- Create: `/README.md`
- Create: `/CONTRIBUTING.md`

**Step 1: Create README.md**

```markdown
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
```

**Step 2: Create CONTRIBUTING.md**

```markdown
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
```

**Step 3: Commit**

```bash
git add README.md CONTRIBUTING.md
git commit -m "docs: add README and contributing guide"
```

---

### Task 15: Final Testing

**Files:**
- Test: All components and widgets

**Step 1: Run all tests**

```bash
npm test -- --watchAll=false
```

Expected: All tests pass

**Step 2: Test in browser**

```bash
npm run dev
```

Verify:
- [ ] MenuBar shows at top with time
- [ ] Desktop icons display for all 4 widgets
- [ ] Dock shows at bottom with icons
- [ ] Clicking icon opens widget in window
- [ ] Window is draggable
- [ ] Window close button works
- [ ] Each widget functions correctly

**Step 3: Final commit**

```bash
git tag v1.0.0
git commit --allow-empty -m "chore: v1.0.0 - MVP complete"
```

---

## Summary

| Phase | Tasks | Goal |
|-------|-------|------|
| Phase 1 | 1-4 | Core OS shell (Window, useOS, Registry) |
| Phase 2 | 5-8 | UI Components (Dock, DesktopIcon, MenuBar, App) |
| Phase 3 | 9-12 | 4 Sample widgets |
| Phase 4 | 13-15 | Template, docs, testing |

**Total: 15 tasks**

---

Plan complete and saved to `docs/plans/2026-02-05-wartek-os-implementation.md`.

**Two execution options:**

1. **Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

2. **Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

**Which approach?**
