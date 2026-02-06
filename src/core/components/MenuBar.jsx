import { useState, useEffect } from 'react';
import { Battery, Wifi, SlidersHorizontal } from 'lucide-react';
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
        <svg className="apple-logo" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
        <span className="menu-app">{activeApp || 'Finder'}</span>
        <span className="menu-item">File</span>
        <span className="menu-item">Edit</span>
        <span className="menu-item">View</span>
        <span className="menu-item">Window</span>
        <span className="menu-item">Help</span>
      </div>
      <div className="menu-right">
        <div className="menu-icon-wrapper">
          <Wifi size={14} strokeWidth={2.5} />
        </div>
        <div className="menu-icon-wrapper">
          <Battery size={16} strokeWidth={2.5} />
        </div>
        <div className="menu-icon-wrapper">
          <SlidersHorizontal size={14} strokeWidth={2.5} />
        </div>
        <span className="menu-time">{formatTime(time)}</span>
        <span className="menu-date">{formatDate(time)}</span>
      </div>
    </div>
  );
}
