import { StickyNote, Users, Palette, Timer, User, MessageSquare, Calendar, Utensils, Coffee, Quote, AlertCircle, MessageCircle } from 'lucide-react';
import './DesktopIcon.css';

const iconMap = {
  'sticky-notes': StickyNote,
  'team-mood': Users,
  'hex-converter': Palette,
  'pomodoro': Timer,
  'forum-desain-publik': MessageSquare,
  'weton': Calendar,
  'rekomendasi-makan-malam': Utensils,
  'rekomendasi-kopi-ciputat': Coffee,
  'kata-kata-hari-ini': Quote,
  'dio-app': AlertCircle,
  'makian-jawa': MessageCircle
};

const iconColors = {
  'sticky-notes': { bg: '#fef08a', fg: '#854d0e' },
  'team-mood': { bg: '#f9a8d4', fg: '#9d174d' },
  'hex-converter': { bg: '#d8b4fe', fg: '#5b21b6' },
  'pomodoro': { bg: '#fca5a5', fg: '#991b1b' },
  'forum-desain-publik': { bg: '#93c5fd', fg: '#1e40af' },
  'weton': { bg: '#fed7aa', fg: '#9a3412' },
  'rekomendasi-makan-malam': { bg: '#fdba74', fg: '#7c2d12' },
  'rekomendasi-kopi-ciputat': { bg: '#a78bfa', fg: '#5b21b6' },
  'kata-kata-hari-ini': { bg: '#fef3c7', fg: '#d97706' },
  'dio-app': { bg: '#fabe24', fg: '#45474a' },
  'makian-jawa': { bg: '#fdba74', fg: '#9a3412' }
};

export function DesktopIcon({ widget, onOpen }) {
  const IconComponent = iconMap[widget.id] || StickyNote;
  const colors = iconColors[widget.id] || { bg: '#e5e7eb', fg: '#374151' };

  return (
    <div
      className="desktop-icon"
      onDoubleClick={() => onOpen(widget.id)}
    >
      <div
        className="desktop-icon-inner"
        style={{
          background: `linear-gradient(160deg, ${colors.bg} 0%, ${colors.bg}dd 100%)`
        }}
      >
        <IconComponent size={36} color={colors.fg} strokeWidth={1.5} />
      </div>
      <span className="icon-label">{widget.name}</span>
    </div>
  );
}
