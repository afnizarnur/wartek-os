import './DesktopIcon.css';

export function DesktopIcon({ widget, onOpen }) {
  return (
    <div
      className="desktop-icon"
      onDoubleClick={() => onOpen(widget.id)}
    >
      <img src={widget.icon} alt={widget.name} />
      <span className="icon-label">{widget.name}</span>
    </div>
  );
}
