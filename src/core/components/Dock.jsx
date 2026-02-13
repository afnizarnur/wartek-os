import { useState } from 'react';
import { StickyNote, Users, Palette, Timer, User, MessageSquare, AlertCircle, Flame, PiggyBank } from 'lucide-react';
import './Dock.css';

const iconMap = {
  'sticky-notes': StickyNote,
  'team-mood': Users,
  'hex-converter': Palette,
  'pomodoro': Timer,
  'forum-desain-publik': MessageSquare,
  'dio-app': AlertCircle,
  'egg-timer': Flame,
  'savings-jar': PiggyBank
};

const iconColors = {
  'sticky-notes': { bg: '#fcd34d', fg: '#92400e' },
  'team-mood': { bg: '#f472b6', fg: '#9d174d' },
  'hex-converter': { bg: '#c084fc', fg: '#5b21b6' },
  'pomodoro': { bg: '#f87171', gauge: '#ef4444', fg: '#7f1d1d' },
  'forum-desain-publik': { bg: '#60a5fa', fg: '#1e40af' },
  'dio-app': { bg: '#fabe24', fg: '#45474a' },
  'egg-timer': { bg: '#fbbf24', fg: '#92400e' },
  'savings-jar': { bg: '#fbbf24', fg: '#92400e' }
};

export function Dock({ widgets, onOpen, activeWindows = [] }) {
  const [hovered, setHovered] = useState(null);

  const getIcon = (widgetId) => {
    const IconComponent = iconMap[widgetId] || StickyNote;
    const colors = iconColors[widgetId] || { bg: '#e5e7eb', fg: '#374151' };
    return { Icon: IconComponent, colors };
  };

  return (
    <div className="dock">
      <div className="dock-container">
        {widgets.map((widget) => {
          const isActive = activeWindows.some(w => w.id === widget.id);
          const isHovered = hovered === widget.id;
          const { Icon, colors } = getIcon(widget.id);

          return (
            <div
              key={widget.id}
              className={`dock-item ${isActive ? 'active' : ''} ${isHovered ? 'hovered' : ''}`}
              onClick={() => onOpen(widget.id)}
              onMouseEnter={() => setHovered(widget.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <div
                className="dock-icon"
                style={{
                  background: `linear-gradient(135deg, ${colors.bg} 0%, ${colors.guide || colors.bg} 100%)`
                }}
              >
                <Icon size={28} color={colors.fg} strokeWidth={2} />
              </div>
              {isActive && <div className="dock-indicator" />}
              <span className="dock-tooltip">{widget.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
