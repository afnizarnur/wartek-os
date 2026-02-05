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
        <span className="apple-logo"></span>
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
