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
