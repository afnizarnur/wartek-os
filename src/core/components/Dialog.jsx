import { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import './Dialog.css';

export function Dialog({
  isOpen = false,
  title = "Pastikan Institusi Anda Sudah Sesuai",
  message = "Saat ini Anda masuk sebagai",
  institutionName = "",
  userRole = "Admin Institusi",
  confirmText = "Selanjutnya",
  cancelText = "Ubah Institusi",
  onConfirm,
  onCancel,
  onClose
}) {
  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  }, [onClose]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape' && onClose) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay" onClick={handleBackdropClick}>
      <div className="dialog">
        <div className="dialog-header">
          <div className="dialog-warning">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#fabe24" />
              <path d="M12 8v4M12 16h.01" stroke="#45474A" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <button className="dialog-close" onClick={onClose} aria-label="Close">
            <X size={20} strokeWidth={2} />
          </button>
        </div>
        <div className="dialog-content">
          <h2 className="dialog-title">{title}</h2>
          <p className="dialog-description">
            {message} <strong>{userRole}</strong> dari institusi <strong>{institutionName}</strong>.
            Jika perlu mengubah institusi, silakan ubah di Beranda.
          </p>
        </div>
        <div className="dialog-buttons">
          <button className="dialog-btn dialog-btn-secondary" onClick={onCancel}>
            {cancelText}
          </button>
          <button className="dialog-btn dialog-btn-primary" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dialog;
