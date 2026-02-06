import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Minus, Square, Maximize2 } from 'lucide-react';
import './Window.css';

let globalZIndex = 1000;

export function Window({
  title,
  children,
  onClose,
  onMinimize,
  onMaximize,
  defaultWidth = 400,
  defaultHeight = 500,
  resizable = true
}) {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [size, setSize] = useState({ width: defaultWidth, height: defaultHeight });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [zIndex, setZIndex] = useState(++globalZIndex);
  const [isMaximized, setIsMaximized] = useState(false);
  const [preMaximizeState, setPreMaximizeState] = useState(null);
  const windowRef = useRef(null);
  const resizeRef = useRef(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  const bringToFront = useCallback(() => {
    setZIndex(++globalZIndex);
  }, []);

  const handleDragStart = useCallback((clientX, clientY) => {
    if (windowRef.current) {
      const rect = windowRef.current.getBoundingClientRect();
      dragOffset.current = { x: clientX - rect.left, y: clientY - rect.top };
    }
    setIsDragging(true);
  }, []);

  const handleResizeStart = useCallback((clientX, clientY) => {
    setIsResizing(true);
  }, []);

  useEffect(() => {
    let currentX = position.x;
    let currentY = position.y;

    const handleMouseMove = (e) => {
      if (isDragging && windowRef.current) {
        currentX = e.clientX - dragOffset.current.x;
        currentY = e.clientY - dragOffset.current.y;
        // Use transform - GPU accelerated, no layout
        windowRef.current.style.transform = `translate(${currentX - position.x}px, ${currentY - position.y}px)`;
        windowRef.current.style.transition = 'none';
      }
      if (isResizing) {
        setSize(prev => ({
          width: Math.max(200, e.clientX - position.x),
          height: Math.max(150, e.clientY - position.y)
        }));
      }
    };

    const handleMouseUp = () => {
      if (isDragging && windowRef.current) {
        // Apply final position: remove transform, set actual left/top
        windowRef.current.style.transform = '';
        setPosition({ x: currentX, y: currentY });
      }
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
  }, [isDragging, isResizing, position.x, position.y]);

  const toggleMaximize = (e) => {
    e.stopPropagation();
    if (isMaximized && preMaximizeState) {
      setPosition(preMaximizeState.position);
      setSize(preMaximizeState.size);
    } else {
      setPreMaximizeState({ position, size });
      setPosition({ x: 0, y: 32 });
      setSize({ width: window.innerWidth, height: window.innerHeight - 32 });
    }
    setIsMaximized(!isMaximized);
    if (onMaximize) onMaximize(!isMaximized);
  };

  const handleMinimize = (e) => {
    e.stopPropagation();
    if (onMinimize) onMinimize();
  };

  const IconComponent = isMaximized ? Square : Maximize2;

  return (
    <div
      ref={windowRef}
      className={`window ${isMaximized ? 'maximized' : ''}`}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex
      }}
      onMouseDown={bringToFront}
    >
      <div
        className="window-titlebar"
        onMouseDown={(e) => {
          handleDragStart(e.clientX, e.clientY);
        }}
      >
        <div className="window-controls">
          <button
            className="window-btn close"
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            aria-label="Close"
          >
            <X size={12} strokeWidth={3} />
          </button>
          <button
            className="window-btn minimize"
            onClick={handleMinimize}
            aria-label="Minimize"
          >
            <Minus size={12} strokeWidth={3} />
          </button>
          <button
            className="window-btn maximize"
            onClick={toggleMaximize}
            aria-label="Maximize"
          >
            <IconComponent size={10} strokeWidth={2.5} />
          </button>
        </div>
        <span className="window-title">{title}</span>
      </div>
      <div className="window-content">
        {children}
      </div>
      {resizable && !isMaximized && (
        <div
          className="window-resize"
          ref={resizeRef}
          onMouseDown={(e) => {
            e.preventDefault();
            handleResizeStart(e.clientX, e.clientY);
          }}
        />
      )}
    </div>
  );
}
