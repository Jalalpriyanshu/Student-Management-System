import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const useToast = () => useContext(ToastContext);

const ICONS = {
  success: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  error:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
  warning: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  info:    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
};

const COLORS = {
  success: { bg: '#f0fdf4', border: '#22c55e', icon: '#16a34a', text: '#166534' },
  error:   { bg: '#fef2f2', border: '#ef4444', icon: '#dc2626', text: '#991b1b' },
  warning: { bg: '#fffbeb', border: '#f59e0b', icon: '#d97706', text: '#92400e' },
  info:    { bg: '#eff6ff', border: '#3b82f6', icon: '#2563eb', text: '#1e40af' },
};

function Toast({ id, type = 'info', message, onRemove }) {
  const c = COLORS[type];
  return (
    <div className="toast-item" style={{ background: c.bg, borderLeft: `4px solid ${c.border}` }}>
      <span className="toast-icon" style={{ color: c.icon }}>{ICONS[type]}</span>
      <span className="toast-msg" style={{ color: c.text }}>{message}</span>
      <button className="toast-close" onClick={() => onRemove(id)} style={{ color: c.icon }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  }, []);

  const remove = useCallback((id) => setToasts(prev => prev.filter(t => t.id !== id)), []);

  // Shorthand helpers
  toast.success = (msg, dur) => toast(msg, 'success', dur);
  toast.error   = (msg, dur) => toast(msg, 'error',   dur);
  toast.warning = (msg, dur) => toast(msg, 'warning', dur);
  toast.info    = (msg, dur) => toast(msg, 'info',    dur);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-container">
        {toasts.map(t => <Toast key={t.id} {...t} onRemove={remove} />)}
      </div>
    </ToastContext.Provider>
  );
}
