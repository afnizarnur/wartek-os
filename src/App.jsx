import { useState, useEffect } from 'react';
import { MenuBar } from './core/components/MenuBar';
import { Dock } from './core/components/Dock';
import { DesktopIcon } from './core/components/DesktopIcon';
import { Window } from './core/components/Window';
import { useOS } from './core/hooks/useOS';
import { buildRegistry } from './core/lib/registry';
import './core/styles/globals.css';
import './index.css';

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
