import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const pageMeta = {
  '/'          : { title: 'Dashboard',        sub: 'Welcome back!' },
  '/students'  : { title: 'Students',         sub: 'Manage all students' },
  '/add'       : { title: 'Add Student',      sub: 'Register a new student' },
  '/reports'   : { title: 'Reports',          sub: 'Analytics & insights' },
  '/attendance': { title: 'Attendance',       sub: 'Track daily attendance' },
  '/marks'     : { title: 'Marks & Grades',   sub: 'Academic performance' },
  '/timetable' : { title: 'Timetable',        sub: 'Class schedule' },
  '/settings'  : { title: 'Settings',         sub: 'Account preferences' },
  '/id-cards'  : { title: 'ID Cards',         sub: 'Generate & print ID cards' },
  '/fees'       : { title: 'Fee Management',    sub: 'Track payments & dues' },
  '/my-profile': { title: 'My Profile',       sub: 'Your student profile' },
};

export default function Navbar() {
  const location = useLocation();
  const user     = JSON.parse(localStorage.getItem('user') || '{}');
  const meta     = pageMeta[location.pathname] || { title: 'Student Management', sub: '' };
  const initial  = user.name ? user.name[0].toUpperCase() : 'A';

  const toggleSidebar = () => window.dispatchEvent(new Event('toggle-sidebar'));

  return (
    <div className="navbar">
      {/* Left — hamburger + breadcrumb */}
      <div className="navbar-left">
        {/* Hamburger — only on mobile */}
        <button onClick={toggleSidebar} className="navbar-hamburger">
          <span /><span /><span />
        </button>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <Link to="/" style={{ fontSize: 12, color: '#94a3b8', textDecoration: 'none', fontWeight: 500 }}>Home</Link>
            <span style={{ fontSize: 12, color: '#cbd5e1' }}>/</span>
            <span style={{ fontSize: 12, color: '#6366f1', fontWeight: 600 }}>{meta.title}</span>
          </div>
          <h1 className="navbar-title">{meta.title}</h1>
        </div>
      </div>

      {/* Right */}
      <div className="navbar-right">

        {/* Search */}
        <div className="navbar-search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input placeholder="Search students..." />
        </div>

        {/* Notification bell */}
        <div className="navbar-notif" title="Notifications">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span className="navbar-notif-dot" />
        </div>

        {/* Profile badge */}
        <div className="navbar-admin-badge">
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: user.role === 'admin'
              ? 'linear-gradient(135deg,#6366f1,#818cf8)'
              : 'linear-gradient(135deg,#0ea5e9,#38bdf8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 800, fontSize: 14, flexShrink: 0,
          }}>
            {initial}
          </div>
          <div>
            <div className="navbar-user-name">{user.name || 'Admin'}</div>
            <div className="navbar-user-role">
              {user.role === 'admin' ? 'Administrator' : 'Student'}
            </div>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 2 }}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
