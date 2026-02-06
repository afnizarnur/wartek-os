import { useState, useEffect } from 'react';
import { MenuBar } from './core/components/MenuBar';
import { Dock } from './core/components/Dock';
import { DesktopIcon } from './core/components/DesktopIcon';
import { Window } from './core/components/Window';
import { useOS } from './core/hooks/useOS';
import { buildRegistry } from './core/lib/registry';
import { PageFeedbackToolbarCSS } from 'agentation';
import './core/styles/globals.css';
import './index.css';

function App() {
  // Lazy initial state - build registry once on mount
  const [widgets] = useState(() => {
    try {
      return Object.values(buildRegistry());
    } catch {
      return [];
    }
  });
  const { openWindows, openWindow, closeWindow } = useOS();

  // Listen for widget HMR updates from iframes
  useEffect(() => {
    const handleWidgetHMR = (event) => {
      if (event.data?.type === 'widget-hmr') {
        // Reload the specific widget iframe
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
          if (iframe.src === event.data.source ||
              iframe.src.startsWith(event.data.source.split('?')[0])) {
            const currentSrc = iframe.src;
            iframe.src = '';
            setTimeout(() => { iframe.src = currentSrc; }, 50);
          }
        });
      }
    };

    window.addEventListener('message', handleWidgetHMR);
    return () => window.removeEventListener('message', handleWidgetHMR);
  }, []);

  // HMR: Accept registry updates when widgets are added/modified
  useEffect(() => {
    if (!import.meta.hot) return;

    import.meta.hot.accept('./core/lib/registry.js', (newModule) => {
      if (newModule && newModule.buildRegistry) {
        // Force full page reload to pick up new widgets
        window.location.reload();
      }
    });

    // Also listen for vite updates
    import.meta.hot.on('vite:update', (data) => {
      const paths = data?.paths;
      if (!paths) return;
      const hasWidgetChange = paths.some(p =>
        p.includes('/src/apps/') || p.includes('/manifest.json')
      );
      if (hasWidgetChange) {
        window.location.reload();
      }
    });
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

        // External URL widgets - embed directly in iframe
        const iframeSrc = widget.url || `${widget.path}/index.html`;

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
              key={`${win.id}-${iframeSrc}`}
              src={iframeSrc}
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

      <PageFeedbackToolbarCSS
        onCopy={(markdown) => console.log('[Agentation] Copied:', markdown)}
        onSubmit={(output, annotations) => console.log('[Agentation] Submit:', output)}
      />
    </div>
  );
}

export default App;
