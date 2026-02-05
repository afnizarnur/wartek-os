import { useState, useCallback, useRef } from 'react';

export function useOS() {
  const [openWindows, setOpenWindows] = useState([]);
  const zIndexRef = useRef(100);

  const openWindow = useCallback((widgetId) => {
    setOpenWindows(prev => {
      const currentZIndex = zIndexRef.current;
      zIndexRef.current += 1;

      // Check if already open
      const existingWindow = prev.find(w => w.id === widgetId);
      if (existingWindow) {
        // Bring to front
        return prev.map(w =>
          w.id === widgetId
            ? { ...w, isFocused: true, zIndex: currentZIndex }
            : { ...w, isFocused: false }
        );
      }

      // New window - unfocus all others
      return prev.map(w => ({ ...w, isFocused: false })).concat({
        id: widgetId,
        isFocused: true,
        zIndex: currentZIndex
      });
    });
  }, []);

  const closeWindow = useCallback((widgetId) => {
    setOpenWindows(prev => prev.filter(w => w.id !== widgetId));
  }, []);

  const focusWindow = useCallback((widgetId) => {
    setOpenWindows(prev => {
      const currentZIndex = zIndexRef.current;
      zIndexRef.current += 1;
      return prev.map(w =>
        w.id === widgetId
          ? { ...w, isFocused: true, zIndex: currentZIndex }
          : { ...w, isFocused: false }
      );
    });
  }, []);

  return {
    openWindows,
    openWindow,
    closeWindow,
    focusWindow
  };
}
