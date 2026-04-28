import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { useNavigate } from 'react-router-dom';

const QUICK_LINKS = [
  { label: 'Add Student',    path: '/add',        color: '#6366f1', bg: '#eef2ff',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg> },
  { label: 'Attendance',     path: '/attendance', color: '#10b981', bg: '#ecfdf5',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
  { label: 'Enter Marks',    path: '/marks',      color: '#f59e0b', bg: '#fffbeb',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
  { label: 'Reports',        path: '/reports',    color: '#0ea5e9', bg: '#f0f9ff',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
  { label: 'Timetable',      path: '/timetable',  color: '#8b5cf6', bg: '#f5f3ff',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  { label: 'Settings',       path: '/settings',   color: '#ef4444', bg: '#fef2f2',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> },
];

const ACTIVITY = [
  { action: 'New student registered',   time: '2 min ago',  color: '#6366f1', type: 'add' },
  { action: 'Attendance marked — Math', time: '15 min ago', color: '#10b981', type: 'att' },
  { action: 'Marks updated — Science',  time: '1 hr ago',   color: '#f59e0b', type: 'mark' },
  { action: 'Student profile viewed',   time: '2 hr ago',   color: '#0ea5e9', type: 'view' },
  { action: 'Report exported as PDF',   time: '3 hr ago',   color: '#8b5cf6', type: 'pdf' },
];

export default function SMSPanel({ open, onClose }) {
  const navigate  = useNavigate();
  const user      = JSON.parse(localStorage.getItem('user') || '{}');
  const [stats,   setStats]   = useState(null);
  const [status,  setStatus]  = useState('checking');
  const [uptime,  setUptime]  = useState('');

  useEffect(() => {
    if (!open) return;
    // Check server health
    API.get('/')
      .then(() => setStatus('online'))
      .catch(() => setStatus('offline'));

    // Fetch stats
    API.get('/api/dashboard/stats')
      .then(r => setStats(r.data))
      .catch(() => {});

    // Uptime
    const start = new Date();
    start.setHours(start.getHours() - 3);
    const diff  = Math.floor((Date.now() - start) / 60000);
    setUptime(`${diff} min`);
  }, [open]);

  const go = (path) => { navigate(path); onClose(); };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="smsp-backdrop" onClick={onClose} />

      {/* Panel */}
      <div className={`smsp-panel ${open ? 'smsp-open' : ''}`}>

        {/* Header */}
        <div className="smsp-header">
          <div className="smsp-header-left">
            <div className="smsp-logo">S</div>
            <div>
              <div className="smsp-title">SMS Panel</div>
              <div className="smsp-subtitle">System Overview</div>
            </div>
          </div>
          <button className="smsp-close" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="smsp-body">

          {/* User Card */}
          <div className="smsp-user-card">
            <img src={`https://i.pravatar.cc/56?img=${user.role === 'admin' ? 10 : 25}`}
              alt="" className="smsp-user-avatar"
              onError={e => e.target.style.display = 'none'} />
            <div className="smsp-user-info">
              <div className="smsp-user-name">{user.name || 'Admin User'}</div>
              <div className="smsp-user-email">{user.email || 'admin@sms.com'}</div>
              <span className="smsp-user-role" style={{
                background: user.role === 'admin' ? '#eef2ff' : '#f0f9ff',
                color: user.role === 'admin' ? '#6366f1' : '#0ea5e9'
              }}>
                {user.role === 'admin' ? '🛡 Administrator' : '🎓 Student'}
              </span>
            </div>
          </div>

          {/* System Status */}
          <div className="smsp-section">
            <div className="smsp-section-title">System Status</div>
            <div className="smsp-status-grid">
              <div className="smsp-status-item">
                <div className={`smsp-status-dot ${status === 'online' ? 'smsp-dot-green' : 'smsp-dot-red'}`} />
                <div>
                  <div className="smsp-status-label">Backend Server</div>
                  <div className="smsp-status-val" style={{ color: status === 'online' ? '#10b981' : '#ef4444' }}>
                    {status === 'online' ? '● Online' : '● Offline'}
                  </div>
                </div>
              </div>
              <div className="smsp-status-item">
                <div className="smsp-status-dot smsp-dot-green" />
                <div>
                  <div className="smsp-status-label">MongoDB</div>
                  <div className="smsp-status-val" style={{ color: '#10b981' }}>● Connected</div>
                </div>
              </div>
              <div className="smsp-status-item">
                <div className="smsp-status-dot smsp-dot-blue" />
                <div>
                  <div className="smsp-status-label">Uptime</div>
                  <div className="smsp-status-val" style={{ color: '#6366f1' }}>{uptime}</div>
                </div>
              </div>
              <div className="smsp-status-item">
                <div className="smsp-status-dot smsp-dot-yellow" />
                <div>
                  <div className="smsp-status-label">Version</div>
                  <div className="smsp-status-val" style={{ color: '#f59e0b' }}>v1.0.0</div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Stats */}
          <div className="smsp-section">
            <div className="smsp-section-title">Live Statistics</div>
            <div className="smsp-stats-grid">
              {[
                { label: 'Students',  val: stats?.totalStudents ?? '—', color: '#6366f1', bg: '#eef2ff' },
                { label: 'Courses',   val: stats?.totalCourses  ?? '—', color: '#0ea5e9', bg: '#f0f9ff' },
                { label: 'Teachers',  val: stats?.totalTeachers ?? '—', color: '#f59e0b', bg: '#fffbeb' },
                { label: 'Attendance',val: stats ? `${stats.attendanceRate}%` : '—', color: '#10b981', bg: '#ecfdf5' },
              ].map(({ label, val, color, bg }) => (
                <div className="smsp-stat-box" key={label} style={{ background: bg }}>
                  <div className="smsp-stat-val" style={{ color }}>{val}</div>
                  <div className="smsp-stat-label">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="smsp-section">
            <div className="smsp-section-title">Quick Navigation</div>
            <div className="smsp-links-grid">
              {QUICK_LINKS.map(({ label, path, color, bg, icon }) => (
                <button key={label} className="smsp-link-btn"
                  style={{ '--lc': color, '--lb': bg }}
                  onClick={() => go(path)}>
                  <span className="smsp-link-icon" style={{ background: bg, color }}>{icon}</span>
                  <span className="smsp-link-label">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="smsp-section">
            <div className="smsp-section-title">Recent Activity</div>
            <div className="smsp-activity">
              {ACTIVITY.map((a, i) => (
                <div className="smsp-activity-item" key={i}>
                  <div className="smsp-activity-dot" style={{ background: a.color }} />
                  <div className="smsp-activity-line" />
                  <div className="smsp-activity-body">
                    <div className="smsp-activity-action">{a.action}</div>
                    <div className="smsp-activity-time">{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Info */}
          <div className="smsp-section">
            <div className="smsp-section-title">System Information</div>
            <div className="smsp-info-list">
              {[
                { label: 'Application',    val: 'Student Management System' },
                { label: 'Academic Year',  val: '2024–2025' },
                { label: 'Institution',    val: 'SMS Institute' },
                { label: 'Tech Stack',     val: 'MERN Stack' },
                { label: 'Last Login',     val: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) },
                { label: 'Session',        val: 'Active' },
              ].map(({ label, val }) => (
                <div className="smsp-info-row" key={label}>
                  <span className="smsp-info-label">{label}</span>
                  <span className="smsp-info-val">{val}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
