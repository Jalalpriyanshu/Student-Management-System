import React, { useState } from 'react';
import API from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [selectedRole, setSelectedRole] = useState('admin');
  const [email,        setEmail]        = useState('');
  const [password,     setPassword]     = useState('');
  const [showPwd,      setShowPwd]      = useState(false);
  const [error,        setError]        = useState('');
  const [loading,      setLoading]      = useState(false);
  const navigate = useNavigate();

  const handleRoleSelect = (role) => { setSelectedRole(role); setEmail(''); setPassword(''); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) return setError('Please fill in all fields.');
    setLoading(true);
    try {
      const res = await API.post('/api/auth/login', { email, password });
      if (res.data.user.role !== selectedRole) {
        setError(`This account is not a ${selectedRole} account.`);
        setLoading(false);
        return;
      }
      localStorage.setItem('authToken', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Check your credentials.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>

      {/* ── LEFT PANEL ─────────────────────────────────── */}
      <div style={{
        flex: 1, background: 'linear-gradient(145deg, #4f46e5 0%, #6366f1 40%, #7c3aed 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '60px 48px', position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position:'absolute', top:-80, right:-80, width:300, height:300, borderRadius:'50%', background:'rgba(255,255,255,0.06)' }} />
        <div style={{ position:'absolute', bottom:-100, left:-60, width:350, height:350, borderRadius:'50%', background:'rgba(255,255,255,0.05)' }} />
        <div style={{ position:'absolute', top:'40%', right:-40, width:180, height:180, borderRadius:'50%', background:'rgba(255,255,255,0.04)' }} />

        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:52, zIndex:1 }}>
          <div style={{ width:52, height:52, background:'rgba(255,255,255,0.2)', borderRadius:16, display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.3)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize:22, fontWeight:800, color:'white', letterSpacing:'-0.5px' }}>EduManage</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.7)', marginTop:1 }}>Student Management System</div>
          </div>
        </div>

        {/* Illustration — SVG school scene */}
        <div style={{ zIndex:1, marginBottom:48, width:'100%', maxWidth:340 }}>
          <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width:'100%' }}>
            {/* Building */}
            <rect x="80" y="100" width="240" height="160" rx="4" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
            {/* Roof */}
            <polygon points="60,100 200,30 340,100" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5"/>
            {/* Door */}
            <rect x="170" y="200" width="60" height="60" rx="30" fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
            {/* Windows */}
            {[[100,130],[160,130],[220,130],[280,130],[100,175],[160,175],[220,175],[280,175]].map(([x,y],i)=>(
              <rect key={i} x={x} y={y} width="40" height="30" rx="4" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.35)" strokeWidth="1"/>
            ))}
            {/* Flag */}
            <line x1="200" y1="30" x2="200" y2="0" stroke="rgba(255,255,255,0.5)" strokeWidth="2"/>
            <polygon points="200,0 230,10 200,20" fill="rgba(255,255,255,0.6)"/>
            {/* Students */}
            {[60,340].map((x,i)=>(
              <g key={i}>
                <circle cx={x} cy="230" r="14" fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
                <rect x={x-12} y="244" width="24" height="16" rx="4" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.35)" strokeWidth="1"/>
              </g>
            ))}
            {/* Books */}
            <rect x="20" y="250" width="30" height="8" rx="2" fill="rgba(255,255,255,0.3)"/>
            <rect x="22" y="244" width="26" height="8" rx="2" fill="rgba(255,255,255,0.25)"/>
            <rect x="350" y="250" width="30" height="8" rx="2" fill="rgba(255,255,255,0.3)"/>
            <rect x="352" y="244" width="26" height="8" rx="2" fill="rgba(255,255,255,0.25)"/>
            {/* Ground */}
            <rect x="0" y="258" width="400" height="42" rx="0" fill="rgba(255,255,255,0.08)"/>
            {/* Trees */}
            {[30,370].map((x,i)=>(
              <g key={i}>
                <rect x={x-4} y="230" width="8" height="28" rx="2" fill="rgba(255,255,255,0.2)"/>
                <ellipse cx={x} cy="220" rx="18" ry="22" fill="rgba(255,255,255,0.18)"/>
              </g>
            ))}
          </svg>
        </div>

        {/* Stats row */}
        <div style={{ display:'flex', gap:24, zIndex:1 }}>
          {[['500+','Students'],['20+','Courses'],['98%','Pass Rate']].map(([val,label])=>(
            <div key={label} style={{ textAlign:'center' }}>
              <div style={{ fontSize:22, fontWeight:800, color:'white' }}>{val}</div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.7)', marginTop:2 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL ────────────────────────────────── */}
      <div style={{
        width:480, background:'#fff', display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center', padding:'48px 48px',
        overflowY:'auto',
      }}>
        <div style={{ width:'100%', maxWidth:380 }}>

          {/* Heading */}
          <div style={{ marginBottom:32 }}>
            <h2 style={{ fontSize:28, fontWeight:800, color:'#0f172a', margin:0, marginBottom:6 }}>Welcome back 👋</h2>
            <p style={{ fontSize:14, color:'#64748b', margin:0 }}>Sign in to your account to continue</p>
          </div>

          {/* Role tabs */}
          <div style={{ display:'flex', background:'#f1f5f9', borderRadius:12, padding:4, marginBottom:28, gap:4 }}>
            {['admin','student'].map(role => (
              <button key={role} onClick={() => handleRoleSelect(role)} style={{
                flex:1, padding:'10px 0', border:'none', borderRadius:9, cursor:'pointer',
                fontSize:13, fontWeight:700, transition:'all 0.2s',
                background: selectedRole === role ? '#fff' : 'transparent',
                color: selectedRole === role ? '#6366f1' : '#64748b',
                boxShadow: selectedRole === role ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
              }}>
                {role === 'admin' ? '🛡 Admin' : '🎓 Student'}
              </button>
            ))}
          </div>

          {/* Demo credentials hint */}
          <div style={{ background:'#f8faff', border:'1px solid #e0e7ff', borderRadius:10, padding:'10px 14px', marginBottom:24, display:'flex', alignItems:'center', gap:10 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span style={{ fontSize:12, color:'#6366f1', fontWeight:500 }}>
              Demo: <strong>admin@example.com</strong> / <strong>admin123</strong>
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:18 }}>
            {error && (
              <div style={{ background:'#fef2f2', color:'#dc2626', padding:'12px 14px', borderRadius:10, fontSize:13, borderLeft:'3px solid #ef4444', display:'flex', alignItems:'center', gap:8 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}

            <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
              <label style={{ fontSize:13, fontWeight:600, color:'#374151' }}>Email Address</label>
              <div style={{ position:'relative' }}>
                <svg style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:'#94a3b8' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder={`Enter ${selectedRole} email`} required
                  style={{ width:'100%', padding:'12px 14px 12px 40px', border:'1.5px solid #e2e8f0', borderRadius:10, fontSize:14, fontFamily:'inherit', color:'#1e293b', outline:'none', boxSizing:'border-box', transition:'border-color 0.2s' }}
                  onFocus={e => e.target.style.borderColor='#6366f1'}
                  onBlur={e => e.target.style.borderColor='#e2e8f0'}
                />
              </div>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
              <label style={{ fontSize:13, fontWeight:600, color:'#374151' }}>Password</label>
              <div style={{ position:'relative' }}>
                <svg style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:'#94a3b8' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input type={showPwd ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password" required
                  style={{ width:'100%', padding:'12px 44px 12px 40px', border:'1.5px solid #e2e8f0', borderRadius:10, fontSize:14, fontFamily:'inherit', color:'#1e293b', outline:'none', boxSizing:'border-box', transition:'border-color 0.2s' }}
                  onFocus={e => e.target.style.borderColor='#6366f1'}
                  onBlur={e => e.target.style.borderColor='#e2e8f0'}
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#94a3b8', display:'flex', alignItems:'center' }}>
                  {showPwd
                    ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              padding:'13px', background: loading ? '#a5b4fc' : 'linear-gradient(135deg,#6366f1,#4f46e5)',
              color:'white', border:'none', borderRadius:10, fontSize:15, fontWeight:700,
              cursor: loading ? 'not-allowed' : 'pointer', transition:'all 0.2s',
              display:'flex', alignItems:'center', justifyContent:'center', gap:8,
              boxShadow: loading ? 'none' : '0 4px 14px rgba(99,102,241,0.4)',
            }}>
              {loading ? (
                <><span style={{ width:16, height:16, border:'2px solid rgba(255,255,255,0.4)', borderTopColor:'white', borderRadius:'50%', display:'inline-block', animation:'spin 0.7s linear infinite' }} /> Signing in...</>
              ) : `Sign in as ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}`}
            </button>
          </form>

          <p style={{ textAlign:'center', fontSize:13, color:'#64748b', marginTop:20 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color:'#6366f1', fontWeight:700, textDecoration:'none' }}>Create account</Link>
          </p>

          {/* Footer */}
          <div style={{ marginTop:40, paddingTop:20, borderTop:'1px solid #f1f5f9', display:'flex', justifyContent:'center', gap:20 }}>
            {['Privacy Policy','Terms of Use','Support'].map(t => (
              <span key={t} style={{ fontSize:11, color:'#94a3b8', cursor:'pointer' }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
