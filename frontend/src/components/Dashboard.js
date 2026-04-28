import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
} from 'recharts';
import MiniCalendar    from './MiniCalendar';
import CircularProgress from './CircularProgress';
import useCounter from './useCounter';

const API_BASE = '/api/dashboard';
const COLORS = ['#6366f1','#0ea5e9','#10b981','#f59e0b','#ef4444','#8b5cf6'];

/* ── Fee Summary Widget ──────────────────────────────────── */
function FeeSummaryWidget() {
  const [feeStats, setFeeStats] = useState(null);
  useEffect(() => {
    API.get('/api/fees/stats').then(r => setFeeStats(r.data)).catch(() => {});
  }, []);
  if (!feeStats) return <div className="db-empty">Loading...</div>;
  const collected = feeStats.total > 0 ? Math.round((feeStats.paid / feeStats.total) * 100) : 0;
  const fmt = n => '₹' + Number(n).toLocaleString('en-IN');
  return (
    <div className="flex-col gap-14">
      {[
        { label:'Total Fees',  value: fmt(feeStats.total),   color:'#6366f1', bg:'#eef2ff' },
        { label:'Collected',   value: fmt(feeStats.paid),    color:'#10b981', bg:'#ecfdf5' },
        { label:'Pending',     value: fmt(feeStats.pending), color:'#f59e0b', bg:'#fffbeb' },
        { label:'Overdue',     value: fmt(feeStats.overdue), color:'#ef4444', bg:'#fef2f2' },
      ].map(({ label, value, color, bg }) => (
        <div key={label} className="flex-between p-10 rounded-10" style={{ background:bg }}>
          <span className="font-normal text-slate-600 font-medium">{label}</span>
          <span className="font-medium font-extrabold" style={{ color }}>{value}</span>
        </div>
      ))}
      <div className="mt-4">
        <div className="flex-between font-small text-slate-500 mb-4">
          <span>Collection Rate</span><span className="font-bold" style={{ color:'#10b981' }}>{collected}%</span>
        </div>
        <div className="w-full rounded-full bg-slate-100" style={{ height:8, overflow:'hidden' }}>
          <div style={{ width:`${collected}%`, height:'100%', background:'linear-gradient(90deg,#10b981,#34d399)', transition:'width 1s ease' }} />
        </div>
      </div>
    </div>
  );
}


/* ── tiny helpers ────────────────────────────────────────── */
const StatCard = ({ label, value, icon, color, bg, suffix = '', trend }) => {
  const count = useCounter(value);
  return (
    <div className="stat-card" style={{ '--card-color': color }}>
      <div className="stat-card-icon" style={{ background: bg, color }}>{icon}</div>
      <div className="stat-card-body">
        <div className="stat-card-value" style={{ color }}>{count}{suffix}</div>
        <div className="stat-card-label">{label}</div>
        {trend && <div className="stat-card-trend">↑ {trend} this month</div>}
      </div>
      <div className="stat-card-bar" style={{ background: color }} />
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rpt-tooltip">
      <p className="rpt-tooltip-label">{label}</p>
      {payload.map((p, i) => <p key={i} style={{ color: p.fill || p.color }}>{p.name}: <strong>{p.value}</strong></p>)}
    </div>
  );
};

const AnnouncementIcon = ({ type }) => {
  const icons = {
    exam:       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
    internship: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
    leave:      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    event:      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  };
  return icons[type] || icons.event;
};

/* ── main component ──────────────────────────────────────── */
export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [stats,        setStats]        = useState(null);
  const [performers,   setPerformers]   = useState({ byMarks: [], byAttendance: [], byImproved: [] });
  const [attendance,   setAttendance]   = useState([]);
  const [timetable,    setTimetable]    = useState({ day: '', slots: [] });
  const [announcements,setAnnouncements]= useState([]);
  const [examResults,  setExamResults]  = useState([]);
  const [recentStudents,setRecentStudents] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [perfTab,      setPerfTab]      = useState('marks');

  useEffect(() => {
    document.title = 'Dashboard | SMS';
    Promise.all([
      API.get(`${API_BASE}/stats`),
      API.get(`${API_BASE}/top-performers`),
      API.get(`${API_BASE}/attendance`),
      API.get(`${API_BASE}/timetable`),
      API.get(`${API_BASE}/announcements`),
      API.get(`${API_BASE}/exam-results`),
      API.get('/students/all?limit=1000'),
    ]).then(([s, p, a, t, an, ex, st]) => {
      setStats(s.data);
      setPerformers(p.data);
      setAttendance(a.data);
      setTimetable(t.data);
      setAnnouncements(an.data);
      setExamResults(ex.data);
      const students = st.data.students || st.data;
      setRecentStudents(students.slice(0, 5));
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  /* course distribution for donut */
  const courseMap = {};
  recentStudents.forEach(s => { if (s.course) courseMap[s.course] = (courseMap[s.course] || 0) + 1; });
  const courseData = Object.entries(courseMap).map(([name, value]) => ({ name, value }));

  const perfData = perfTab === 'marks' ? performers.byMarks
    : perfTab === 'attendance' ? performers.byAttendance
    : performers.byImproved;

  const perfKey   = perfTab === 'marks' ? 'marks' : perfTab === 'attendance' ? 'attendance' : 'improvement';
  const perfSuffix = perfTab === 'marks' ? ' pts' : '%';

  if (loading) return (
    <div className="dash-loading">
      <div className="dash-spinner" />
      <p>Loading dashboard…</p>
    </div>
  );

  return (
    <div className="db-wrapper">

      {/* ── Welcome Banner ─────────────────────────────────── */}
      <div className="welcome-banner">
        <div className="welcome-text">
          <h2>Welcome back, {user.name || 'Admin'} 👋</h2>
          <p>Here's your institution overview for today.</p>
        </div>
        <div className="welcome-date">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* ── Stat Cards ─────────────────────────────────────── */}
      <div className="stat-grid">
        <StatCard label="Total Students" value={stats?.totalStudents ?? 0} color="#6366f1" bg="#eef2ff" trend="+4"
          icon={<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>} />
        <StatCard label="Total Courses"  value={stats?.totalCourses ?? 0}  color="#0ea5e9" bg="#f0f9ff" trend="+2"
          icon={<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>} />
        <StatCard label="Total Teachers" value={stats?.totalTeachers ?? 0} color="#f59e0b" bg="#fffbeb"
          icon={<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>} />
        <StatCard label="Total Units"    value={stats?.totalUnits ?? 0}    color="#8b5cf6" bg="#f5f3ff"
          icon={<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>} />
        <StatCard label="Total Marks"    value={stats?.totalMarks ?? 0}    color="#10b981" bg="#ecfdf5"
          icon={<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>} />
        <StatCard label="Attendance"     value={stats?.attendanceRate ?? 0} suffix="%" color="#ef4444" bg="#fef2f2"
          icon={<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>} />
      </div>

      {/* ── Row 2: Charts + Calendar ────────────────────────── */}
      <div className="db-row2">

        {/* Donut — course distribution */}
        <div className="db-panel">
          <div className="db-panel-hdr"><h3>Student Distribution</h3><p>By course enrollment</p></div>
          {courseData.length === 0 ? <div className="db-empty">No data</div> : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={courseData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                  outerRadius={85} innerRadius={45} paddingAngle={3}
                  label={({ percent }) => percent > 0.08 ? `${Math.round(percent * 100)}%` : ''}>
                  {courseData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={9} wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Bar — exam results */}
        <div className="db-panel db-panel-wide">
          <div className="db-panel-hdr"><h3>Examination Results</h3><p>Pass vs Fail by subject</p></div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={examResults} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="pass" name="Pass" fill="#10b981" radius={[4,4,0,0]} />
              <Bar dataKey="fail" name="Fail" fill="#ef4444" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Mini Calendar */}
        <div className="db-panel">
          <div className="db-panel-hdr"><h3>Calendar</h3><p>Events &amp; schedule</p></div>
          <MiniCalendar />
        </div>

      </div>

      {/* ── Row 3: Top Performers ───────────────────────────── */}
      <div className="db-panel">
        <div className="db-panel-hdr">
          <h3>Top Performers</h3>
          <div className="perf-tabs">
            {['marks','attendance','improved'].map(t => (
              <button key={t} className={`perf-tab ${perfTab === t ? 'perf-tab-active' : ''}`} onClick={() => setPerfTab(t)}>
                {t === 'marks' ? '🏆 Best Marks' : t === 'attendance' ? '📅 Best Attendance' : '📈 Most Improved'}
              </button>
            ))}
          </div>
        </div>
        <div className="perf-grid">
          {perfData.map((s, i) => (
            <div className="perf-card" key={s._id || i}>
              <div className="perf-rank">#{i + 1}</div>
              <div style={{ width:44, height:44, borderRadius:'50%', background:`linear-gradient(135deg,${COLORS[i]},${COLORS[(i+1)%COLORS.length]})`, color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:16, flexShrink:0 }}>
                {s.name?.[0]?.toUpperCase() || '?'}
              </div>
              <div className="perf-info">
                <div className="perf-name">{s.name}</div>
                <div className="perf-course">{s.course}</div>
              </div>
              <div className="perf-score" style={{ color: COLORS[i] }}>
                {s[perfKey]}{perfSuffix}
              </div>
            </div>
          ))}
          {perfData.length === 0 && <div className="db-empty">No student data available.</div>}
        </div>
      </div>

      {/* ── Row 4: Recent Students + Quick Actions + Right Col */}
      <div className="db-row4">

        {/* Recent Students */}
        <div className="db-panel db-panel-lg">
          <div className="db-panel-hdr">
            <h3>Recent Students</h3>
            <a href="/students" className="db-link">View all →</a>
          </div>
          {recentStudents.length === 0 ? <div className="db-empty">No students found.</div> : (
            <table className="dash-table">
              <thead>
                <tr><th>Student</th><th>Course</th><th>Email</th><th>Status</th></tr>
              </thead>
              <tbody>
                {recentStudents.map((s, i) => (
                  <tr key={s._id}>
                    <td>
                      <div className="dash-student-name">
                        <div style={{ width:32, height:32, borderRadius:8, background:`linear-gradient(135deg,${COLORS[i%COLORS.length]},${COLORS[(i+2)%COLORS.length]})`, color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:13, flexShrink:0 }}>
                          {s.name?.[0]?.toUpperCase()}
                        </div>
                        <span>{s.name}</span>
                      </div>
                    </td>
                    <td><span className="dash-badge">{s.course}</span></td>
                    <td className="dash-email">{s.email}</td>
                    <td><span className="dash-status" style={{ background: s.status==='Inactive'?'#fef2f2':s.status==='Graduated'?'#f0f9ff':'#ecfdf5', color: s.status==='Inactive'?'#dc2626':s.status==='Graduated'?'#0ea5e9':'#059669' }}>{s.status||'Active'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Quick Actions */}
          <div className="quick-actions-section">
            <div className="db-panel-hdr" style={{ marginTop: 24, marginBottom: 14 }}>
              <h3>Quick Actions</h3>
            </div>
            <div className="quick-actions-grid">
              {[
                { label: 'Add Student',     href: '/add',        color: '#6366f1', bg: '#eef2ff',
                  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg> },
                { label: 'Attendance',      href: '/attendance', color: '#10b981', bg: '#ecfdf5',
                  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
                { label: 'Marks',           href: '/marks',      color: '#f59e0b', bg: '#fffbeb',
                  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
                { label: 'Fee Management',  href: '/fees',       color: '#ec4899', bg: '#fce7f3',
                  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
                { label: 'Reports',         href: '/reports',    color: '#0ea5e9', bg: '#f0f9ff',
                  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
                { label: 'ID Cards',        href: '/id-cards',   color: '#8b5cf6', bg: '#f5f3ff',
                  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8" cy="12" r="2"/><line x1="13" y1="10" x2="19" y2="10"/><line x1="13" y1="14" x2="17" y2="14"/></svg> },
              ].map(({ label, href, color, bg, icon }) => (
                <a key={label} href={href} className="quick-action-btn" style={{ '--qa-color': color, '--qa-bg': bg }}>
                  <span className="qa-icon" style={{ background: bg, color }}>{icon}</span>
                  <span className="qa-label">{label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="db-right-col">

          {/* Subject Attendance — real data */}
          <div className="db-panel">
            <div className="db-panel-hdr"><h3>Subject Attendance</h3><p>Overall %</p></div>
            {attendance.length === 0 ? (
              <div className="db-empty">No attendance data yet.</div>
            ) : (
              <div className="att-grid">
                {attendance.map((a, i) => (
                  <div className="att-item" key={i}>
                    <CircularProgress pct={a.pct} size={72} stroke={6} />
                    <div className="att-subject">{a.subject}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Fee Summary — real data */}
          <div className="db-panel">
            <div className="db-panel-hdr"><h3>Fee Overview</h3><a href="/fees" className="db-link">View all →</a></div>
            <FeeSummaryWidget />
          </div>

          {/* Announcements — real data */}
          {announcements.length > 0 && (
            <div className="db-panel">
              <div className="db-panel-hdr"><h3>Announcements</h3></div>
              <div className="ann-list">
                {announcements.map(a => (
                  <div className="ann-item" key={a.id}>
                    <div className="ann-icon" style={{ background: a.color + '20', color: a.color }}>
                      <AnnouncementIcon type={a.type} />
                    </div>
                    <div className="ann-body">
                      <div className="ann-title">{a.title}</div>
                      <div className="ann-text">{a.body}</div>
                      <div className="ann-date">{a.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── Row 5: Timetable ───────────────────────────────── */}
      {timetable.slots?.length > 0 && (
        <div className="db-panel">
          <div className="db-panel-hdr">
            <h3>Today's Timetable</h3>
            <span className="tt-day-badge">{timetable.day}</span>
          </div>
          <div className="tt-grid">
            {timetable.slots.map((slot, i) => (
              <div className="tt-card" key={i} style={{ '--tt-color': COLORS[i % COLORS.length] }}>
                <div className="tt-time">{slot.time}</div>
                <div className="tt-subject">{slot.subject}</div>
                <div className="tt-teacher">
                  <img src={slot.teacher.avatar} alt={slot.teacher.name} className="tt-avatar"
                    onError={e => { e.target.src = `https://i.pravatar.cc/28?img=${i+5}`; }} />
                  <span>{slot.teacher.name}</span>
                </div>
                <div className="tt-room">{slot.room}</div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
