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
