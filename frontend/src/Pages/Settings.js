import React, { useState } from 'react';
import API from '../utils/api';

export default function Settings() {
  const user    = JSON.parse(localStorage.getItem('user') || '{}');
  const [name,  setName]  = useState(user.name  || '');
  const [email, setEmail] = useState(user.email || '');
  const [oldPwd, setOldPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [conPwd, setConPwd] = useState('');
  const [profileMsg, setProfileMsg] = useState({ text: '', type: '' });
  const [pwdMsg,     setPwdMsg]     = useState({ text: '', type: '' });
  const [savingP,    setSavingP]    = useState(false);
  const [savingPwd,  setSavingPwd]  = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!name || !email) return setProfileMsg({ text: 'Name and email are required.', type: 'error' });
    setSavingP(true);
    try {
      // Update localStorage immediately (backend update can be added later)
      const updated = { ...user, name, email };
      localStorage.setItem('user', JSON.stringify(updated));
      setProfileMsg({ text: 'Profile updated successfully!', type: 'success' });
    } catch {
      setProfileMsg({ text: 'Failed to update profile.', type: 'error' });
    } finally {
      setSavingP(false);
      setTimeout(() => setProfileMsg({ text: '', type: '' }), 3000);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!oldPwd || !newPwd || !conPwd) return setPwdMsg({ text: 'All fields are required.', type: 'error' });
    if (newPwd.length < 6) return setPwdMsg({ text: 'New password must be at least 6 characters.', type: 'error' });
    if (newPwd !== conPwd) return setPwdMsg({ text: 'Passwords do not match.', type: 'error' });

    setSavingPwd(true);
    try {
      await API.post('/api/auth/change-password', {
        email: user.email, oldPassword: oldPwd, newPassword: newPwd,
      });
      setPwdMsg({ text: 'Password changed successfully!', type: 'success' });
      setOldPwd(''); setNewPwd(''); setConPwd('');
    } catch (err) {
      setPwdMsg({ text: err.response?.data?.error || 'Failed to change password.', type: 'error' });
    } finally {
      setSavingPwd(false);
      setTimeout(() => setPwdMsg({ text: '', type: '' }), 3000);
    }
  };

  return (
    <div className="db-wrapper">
      <div className="add-page-header">
        <div><h2>Settings</h2><p>Manage your account and preferences</p></div>
      </div>

      <div className="settings-grid">

        {/* Profile Card */}
        <div className="db-panel">
          <div className="db-panel-hdr"><h3>Profile Information</h3></div>

          <div className="settings-avatar-section">
            <div className="settings-avatar">
              <img src={`https://i.pravatar.cc/80?img=${user.role === 'admin' ? 10 : 25}`} alt="avatar" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#0f172a' }}>{user.name}</div>
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 3 }}>{user.email}</div>
              <span className="dash-badge" style={{ marginTop: 6, display: 'inline-block',
                background: user.role === 'admin' ? '#eef2ff' : '#f0f9ff',
                color: user.role === 'admin' ? '#6366f1' : '#0ea5e9' }}>
                {user.role === 'admin' ? '🛡 Admin' : '🎓 Student'}
              </span>
            </div>
          </div>

          {profileMsg.text && (
            <div className={profileMsg.type === 'success' ? 'login-success' : 'login-error'} style={{ marginBottom: 16 }}>
              {profileMsg.text}
            </div>
          )}

          <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="add-field" style={{ marginBottom: 0 }}>
              <label>Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                style={{ padding: '11px 14px', border: '2px solid #e2e8f0', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', width: '100%' }} />
            </div>
            <div className="add-field" style={{ marginBottom: 0 }}>
              <label>Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                style={{ padding: '11px 14px', border: '2px solid #e2e8f0', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', width: '100%' }} />
            </div>
            <div className="add-field" style={{ marginBottom: 0 }}>
              <label>Role</label>
              <input type="text" value={user.role} disabled
                style={{ padding: '11px 14px', border: '2px solid #e2e8f0', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', width: '100%', background: '#f8fafc', color: '#94a3b8' }} />
            </div>
            <button type="submit" className="add-submit-btn" disabled={savingP}>
              {savingP ? <><span className="add-spinner" /> Saving…</> : '💾 Save Profile'}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="db-panel">
          <div className="db-panel-hdr"><h3>Change Password</h3></div>

          {pwdMsg.text && (
            <div className={pwdMsg.type === 'success' ? 'login-success' : 'login-error'} style={{ marginBottom: 16 }}>
              {pwdMsg.text}
            </div>
          )}

          <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { label: 'Current Password', val: oldPwd, set: setOldPwd },
              { label: 'New Password',     val: newPwd, set: setNewPwd },
              { label: 'Confirm New Password', val: conPwd, set: setConPwd },
            ].map(({ label, val, set }) => (
              <div className="add-field" key={label} style={{ marginBottom: 0 }}>
                <label>{label}</label>
                <input type="password" value={val} onChange={e => set(e.target.value)} placeholder="••••••••"
                  style={{ padding: '11px 14px', border: '2px solid #e2e8f0', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', width: '100%' }} />
              </div>
            ))}
            <button type="submit" className="add-submit-btn" disabled={savingPwd}>
              {savingPwd ? <><span className="add-spinner" /> Changing…</> : '🔑 Change Password'}
            </button>
          </form>

          {/* Password rules */}
          <div className="add-info-box" style={{ marginTop: 16 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>Password must be at least 6 characters. Use a mix of letters and numbers for better security.</span>
          </div>
        </div>

      </div>
    </div>
  );
}
