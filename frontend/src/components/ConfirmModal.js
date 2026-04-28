import React from 'react';

export default function ConfirmModal({ open, title, message, onConfirm, onCancel, confirmText = 'Delete', confirmColor = '#ef4444' }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-icon-wrap" style={{ background: confirmColor + '15' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={confirmColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
        </div>
        <h3 className="modal-title">{title || 'Are you sure?'}</h3>
        <p className="modal-message">{message || 'This action cannot be undone.'}</p>
        <div className="modal-actions">
          <button className="modal-cancel-btn" onClick={onCancel}>Cancel</button>
          <button className="modal-confirm-btn" style={{ background: confirmColor }} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
