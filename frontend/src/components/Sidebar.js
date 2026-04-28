import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SMSPanel from './SMSPanel';

const icons = {
  dashboard: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  students: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  add: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
    </svg>
  ),
  attendance: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  marks: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  timetable: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  reports: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  ),
  fees: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  idcard: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2"/>
      <circle cx="8" cy="12" r="2"/>
      <line x1="13" y1="10" x2="19" y2="10"/>
      <line x1="13" y1="14" x2="17" y2="14"/>
    </svg>
  ),
  logout: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  settings: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
};

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [panelOpen,  setPanelOpen]  = useState(false);

  // Listen for hamburger toggle from Navbar
  React.useEffect(() => {
    const handler = () => setMobileOpen(o => !o);
    window.addEventListener('toggle-sidebar', handler);
    return () => window.removeEventListener('toggle-sidebar', handler);
  }, []);

  const settingsItem = { path: '/settings', label: 'Settings', icon: icons.settings };

  const navItems = user.role === 'admin' ? [
    { path: '/',           label: 'Dashboard',   icon: icons.dashboard },
    { path: '/students',   label: 'Students',    icon: icons.students  },
    { path: '/add',        label: 'Add Student', icon: icons.add       },
    { path: '/attendance', label: 'Attendance',  icon: icons.attendance},
    { path: '/marks',      label: 'Marks',       icon: icons.marks     },
    { path: '/timetable',  label: 'Timetable',   icon: icons.timetable },
    { path: '/reports',    label: 'Reports',     icon: icons.reports   },
    { path: '/fees',      label: 'Fee Management', icon: icons.fees      },
    { path: '/id-cards',   label: 'ID Cards',    icon: icons.idcard    },
    settingsItem,
  ] : [
    { path: '/',           label: 'Dashboard',   icon: icons.dashboard },
    { path: '/my-profile', label: 'My Profile',  icon: icons.students  },
    { path: '/attendance', label: 'Attendance',  icon: icons.attendance},
    { path: '/marks',      label: 'My Marks',    icon: icons.marks     },
    { path: '/timetable',  label: 'Timetable',   icon: icons.timetable },
    settingsItem,
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  return (
    <>
      {mobileOpen && <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />}

      <SMSPanel open={panelOpen} onClose={() => setPanelOpen(false)} />

      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        {/* Brand */}
        <div className="sidebar-brand" onClick={() => setPanelOpen(true)} style={{ cursor: 'pointer' }} title="Click to open SMS Panel">
          <div className="brand-icon">S</div>
          <div>
            <div className="brand-title">EduManage</div>
            <div className="brand-sub">Student Management</div>
          </div>
        </div>

        {/* User info */}
        <div className="sidebar-user">
          <div className="sidebar-avatar">{user.name ? user.name[0].toUpperCase() : 'A'}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user.name || 'Admin'}</div>
            <div className="sidebar-user-role">{user.role === 'admin' ? '🛡 Admin' : '🎓 Student'}</div>
          </div>
        </div>

        <div className="sidebar-divider" />

        {/* Nav label */}
        <div className="sidebar-nav-label">MAIN MENU</div>

        {/* Nav links */}
        <nav className="sidebar-nav">
          {navItems.map(({ path, label, icon }) => (
            <Link
              key={path}
              to={path}
              className={`sidebar-link ${location.pathname === path ? 'sidebar-link-active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <span className="sidebar-link-icon">{icon}</span>
              <span>{label}</span>
              {location.pathname === path && <span className="sidebar-link-dot" />}
            </Link>
          ))}
        </nav>

        <div className="sidebar-divider" />

        {/* Logout */}
        <button className="sidebar-logout" onClick={handleLogout}>
          <span className="sidebar-link-icon">{icons.logout}</span>
          <span>Logout</span>
        </button>
      </aside>
    </>
  );
}

export default Sidebar;
