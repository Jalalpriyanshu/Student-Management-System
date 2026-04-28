import React, { useState } from 'react';
import API from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ name:'', email:'', password:'', confirm:'', role:'admin' });
  const [showPwd,  setShowPwd]  = useState(false);
  const [showCon,  setShowCon]  = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');
  const [loading,  setLoading]  = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!form.name || !form.email || !form.password || !form.confirm) return setError('All fields are required.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError('Enter a valid email address.');
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');
    if (form.password !== form.confirm) return setError('Passwords do not match.');
    setLoading(true);
    try {
      await API.post('/api/auth/register', { name: form.name, email: form.email, password: form.password, role: form.role });
      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
    } finally { setLoading(false); }
  };

  const inputStyle = { width:'100%', padding:'12px 14px 12px 40px', border:'1.5px solid #e2e8f0', borderRadius:10, fontSize:14, fontFamily:'inherit', color:'#1e293b', outline:'none', boxSizing:'border-box', transition:'border-color 0.2s' };

  return (
    <div style={{ display:'flex', minHeight:'100vh', fontFamily:"-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>

      {/* LEFT */}
      <div className="register-left-panel" style={{ flex:1, background:'linear-gradient(145deg,#4f46e5 0%,#6366f1 40%,#7c3aed 100%)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'60px 48px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-80, right:-80, width:300, height:300, borderRadius:'50%', background:'rgba(255,255,255,0.06)' }} />
        <div style={{ position:'absolute', bottom:-100, left:-60, width:350, height:350, borderRadius:'50%', background:'rgba(255,255,255,0.05)' }} />

        <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:48, zIndex:1 }}>
          <div style={{ width:52, height:52, background:'rgba(255,255,255,0.2)', borderRadius:16, display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid rgba(255,255,255,0.3)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize:22, fontWeight:800, color:'white' }}>EduManage</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.7)', marginTop:1 }}>Student Management System</div>
          </div>
        </div>

        <div style={{ zIndex:1, textAlign:'center', maxWidth:320 }}>
          <h2 style={{ fontSize:32, fontWeight:800, color:'white', marginBottom:16, lineHeight:1.2 }}>Join EduManage Today</h2>
          <p style={{ fontSize:15, color:'rgba(255,255,255,0.8)', lineHeight:1.7, marginBottom:40 }}>
            Manage students, track attendance, monitor grades and generate reports — all in one place.
          </p>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {[
              ['📊','Real-time Analytics & Reports'],
              ['🎓','Complete Student Management'],
              ['📅','Attendance & Grade Tracking'],
              ['🪪','ID Card Generation'],
            ].map(([icon, text]) => (
              <div key={text} style={{ display:'flex', alignItems:'center', gap:12, background:'rgba(255,255,255,0.1)', borderRadius:12, padding:'12px 16px', backdropFilter:'blur(4px)' }}>
                <span style={{ fontSize:20 }}>{icon}</span>
                <span style={{ fontSize:13, color:'rgba(255,255,255,0.9)', fontWeight:500 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="register-right-panel" style={{ width:500, background:'#fff', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'48px', overflowY:'auto' }}>
        <div style={{ width:'100%', maxWidth:400 }}>

          <div style={{ marginBottom:28 }}>
            <h2 style={{ fontSize:26, fontWeight:800, color:'#0f172a', margin:0, marginBottom:6 }}>Create Account</h2>
            <p style={{ fontSize:14, color:'#64748b', margin:0 }}>Fill in the details to get started</p>
          </div>

          {/* Role tabs */}
          <div style={{ display:'flex', background:'#f1f5f9', borderRadius:12, padding:4, marginBottom:24, gap:4 }}>
            {['admin','student'].map(role => (
              <button key={role} onClick={() => setForm(f => ({ ...f, role }))} style={{
                flex:1, padding:'10px 0', border:'none', borderRadius:9, cursor:'pointer',
                fontSize:13, fontWeight:700, transition:'all 0.2s',
                background: form.role === role ? '#fff' : 'transparent',
                color: form.role === role ? '#6366f1' : '#64748b',
                boxShadow: form.role === role ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
              }}>
                {role === 'admin' ? '🛡 Admin' : '🎓 Student'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {error   && <div style={{ background:'#fef2f2', color:'#dc2626', padding:'11px 14px', borderRadius:10, fontSize:13, borderLeft:'3px solid #ef4444' }}>{error}</div>}
            {success && <div style={{ background:'#f0fdf4', color:'#16a34a', padding:'11px 14px', borderRadius:10, fontSize:13, borderLeft:'3px solid #22c55e' }}>{success}</div>}

            {[
              { name:'name',    label:'Full Name',    type:'text',     icon:'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', placeholder:'Your full name' },
              { name:'email',   label:'Email Address',type:'email',    icon:'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22,6 12,13 2,6', placeholder:'your@email.com' },
            ].map(({ name, label, type, placeholder }) => (
              <div key={name} style={{ display:'flex', flexDirection:'column', gap:6 }}>
                <label style={{ fontSize:13, fontWeight:600, color:'#374151' }}>{label}</label>
                <input name={name} type={type} value={form[name]} onChange={handleChange}
                  placeholder={placeholder} required style={inputStyle}
                  onFocus={e => e.target.style.borderColor='#6366f1'}
                  onBlur={e => e.target.style.borderColor='#e2e8f0'} />
              </div>
            ))}

            {[
              { name:'password', label:'Password',         show:showPwd, toggle:()=>setShowPwd(!showPwd), placeholder:'Min. 6 characters' },
              { name:'confirm',  label:'Confirm Password', show:showCon, toggle:()=>setShowCon(!showCon), placeholder:'Re-enter password' },
            ].map(({ name, label, show, toggle, placeholder }) => (
              <div key={name} style={{ display:'flex', flexDirection:'column', gap:6 }}>
                <label style={{ fontSize:13, fontWeight:600, color:'#374151' }}>{label}</label>
                <div style={{ position:'relative' }}>
                  <svg style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:'#94a3b8' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input name={name} type={show ? 'text' : 'password'} value={form[name]} onChange={handleChange}
                    placeholder={placeholder} required style={{ ...inputStyle, paddingRight:44 }}
                    onFocus={e => e.target.style.borderColor='#6366f1'}
                    onBlur={e => e.target.style.borderColor='#e2e8f0'} />
                  <button type="button" onClick={toggle} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#94a3b8', display:'flex', alignItems:'center' }}>
                    {show
                      ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
              </div>
            ))}

            <button type="submit" disabled={loading} style={{
              padding:'13px', background: loading ? '#a5b4fc' : 'linear-gradient(135deg,#6366f1,#4f46e5)',
              color:'white', border:'none', borderRadius:10, fontSize:15, fontWeight:700,
              cursor: loading ? 'not-allowed' : 'pointer', marginTop:4,
              boxShadow: loading ? 'none' : '0 4px 14px rgba(99,102,241,0.4)',
              display:'flex', alignItems:'center', justifyContent:'center', gap:8,
            }}>
              {loading ? <><span style={{ width:16, height:16, border:'2px solid rgba(255,255,255,0.4)', borderTopColor:'white', borderRadius:'50%', display:'inline-block', animation:'spin 0.7s linear infinite' }} /> Creating...</> : `Create ${form.role} Account`}
            </button>
          </form>

          <p style={{ textAlign:'center', fontSize:13, color:'#64748b', marginTop:20 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color:'#6366f1', fontWeight:700, textDecoration:'none' }}>Sign in</Link>
          </p>
        </div>
      </div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .register-left-panel { display: none !important; }
          .register-right-panel {
            width: 100% !important;
            padding: 32px 20px !important;
            min-height: 100vh;
          }
        }
      `}</style>
    </div>
  );
}
