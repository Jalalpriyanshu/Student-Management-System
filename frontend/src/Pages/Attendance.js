import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import CircularProgress from '../components/CircularProgress';

const SUBJECTS = ['Mathematics','Science','English','History','Computer','Physics'];
const STATUS   = ['Present','Absent','Late'];
const statusColor = { Present: '#10b981', Absent: '#ef4444', Late: '#f59e0b' };

export default function Attendance() {
  const user    = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';

  const [students,  setStudents]  = useState([]);
  const [records,   setRecords]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [msg,       setMsg]       = useState({ text: '', type: '' });

  const today = new Date().toISOString().split('T')[0];
  const [date,    setDate]    = useState(today);
  const [subject, setSubject] = useState(SUBJECTS[0]);

  // attendance state: { [studentId]: 'Present'|'Absent'|'Late' }
  const [markMap, setMarkMap] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sRes, rRes] = await Promise.all([
          API.get('/students/all?limit=1000'),
          API.get('/api/attendance/all'),
        ]);
        const studs = sRes.data.students || sRes.data;
        setStudents(studs);
        setRecords(rRes.data);

        // default all present
        const def = {};
        studs.forEach(s => { def[s._id] = 'Present'; });
        setMarkMap(def);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  // When date/subject changes, pre-fill existing records
  useEffect(() => {
    const existing = records.filter(r =>
      r.subject === subject &&
      new Date(r.date).toISOString().split('T')[0] === date
    );
    if (existing.length) {
      const map = {};
      existing.forEach(r => { map[r.studentId?._id || r.studentId] = r.status; });
      setMarkMap(prev => ({ ...prev, ...map }));
    }
  }, [date, subject, records]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = students.map(s => ({
        studentId: s._id, subject, date, status: markMap[s._id] || 'Present',
      }));
      await API.post('/api/attendance/mark', { records: payload });
      setMsg({ text: `Attendance saved for ${subject} on ${date}!`, type: 'success' });
      const res = await API.get('/api/attendance/all');
      setRecords(res.data);
    } catch (err) {
      setMsg({ text: err.response?.data?.error || 'Failed to save.', type: 'error' });
    } finally {
      setSaving(false);
      setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    }
  };

  // Summary per subject from all records
  const subjectSummary = SUBJECTS.map(sub => {
    const subRecs = records.filter(r => r.subject === sub);
    const present = subRecs.filter(r => r.status === 'Present').length;
    const total   = subRecs.length;
    return { subject: sub, pct: total ? Math.round((present / total) * 100) : 0, total, present };
  });

  // Today's stats
  const todayRecs  = records.filter(r => new Date(r.date).toISOString().split('T')[0] === today);
  const todayPres  = todayRecs.filter(r => r.status === 'Present').length;
  const todayAbs   = todayRecs.filter(r => r.status === 'Absent').length;

  if (loading) return <div className="dash-loading"><div className="dash-spinner" /><p>Loading…</p></div>;

  return (
    <div className="db-wrapper">
      <div className="add-page-header">
        <div><h2>Attendance</h2><p>{isAdmin ? 'Mark and manage student attendance' : 'Your attendance summary'}</p></div>
      </div>

      {/* Summary cards */}
      <div className="att-summary-cards">
        <div className="att-sum-card" style={{ '--c': '#6366f1' }}>
          <div className="att-sum-val">{students.length}</div>
          <div className="att-sum-label">Total Students</div>
        </div>
        <div className="att-sum-card" style={{ '--c': '#10b981' }}>
          <div className="att-sum-val">{todayPres}</div>
          <div className="att-sum-label">Present Today</div>
        </div>
        <div className="att-sum-card" style={{ '--c': '#ef4444' }}>
          <div className="att-sum-val">{todayAbs}</div>
          <div className="att-sum-label">Absent Today</div>
        </div>
        <div className="att-sum-card" style={{ '--c': '#f59e0b' }}>
          <div className="att-sum-val">{records.length}</div>
          <div className="att-sum-label">Total Records</div>
        </div>
      </div>

      {/* Subject circular summary */}
      <div className="db-panel">
        <div className="db-panel-hdr"><h3>Subject-wise Attendance</h3></div>
        <div className="att-grid-lg">
          {subjectSummary.map((s, i) => (
            <div className="att-card" key={i}>
              <CircularProgress pct={s.pct} size={100} stroke={8} />
              <div className="att-card-subject">{s.subject}</div>
              <div className="att-card-status" style={{ color: s.pct >= 85 ? '#10b981' : s.pct >= 70 ? '#f59e0b' : '#ef4444' }}>
                {s.present}/{s.total} classes
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mark Attendance — admin only */}
      {isAdmin && (
        <div className="db-panel">
          <div className="db-panel-hdr"><h3>Mark Attendance</h3></div>

          {msg.text && (
            <div className={msg.type === 'success' ? 'login-success' : 'login-error'} style={{ marginBottom: 16 }}>
              {msg.text}
            </div>
          )}

          {/* Controls */}
          <div className="att-controls flex-wrap gap-16">
            <div className="add-field mb-0">
              <label>Date</label>
              <input type="date" className="border-slate-200 rounded-10 p-10 font-medium" 
                value={date} max={today} onChange={e => setDate(e.target.value)} />
            </div>
            <div className="add-field mb-0">
              <label>Subject</label>
              <select className="border-slate-200 rounded-10 p-10 font-medium bg-white"
                value={subject} onChange={e => setSubject(e.target.value)}>
                {SUBJECTS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex gap-8" style={{ alignSelf: 'flex-end' }}>
              <button className="perf-tab" onClick={() => { const m = {}; students.forEach(s => m[s._id] = 'Present'); setMarkMap(m); }}>All Present</button>
              <button className="perf-tab" onClick={() => { const m = {}; students.forEach(s => m[s._id] = 'Absent'); setMarkMap(m); }}>All Absent</button>
            </div>
          </div>


          {/* Student list */}
          <div className="att-mark-list">
            {students.map((s, i) => (
              <div className="att-mark-row" key={s._id}>
                <div className="dash-student-name">
                  <img src={`https://i.pravatar.cc/36?img=${(i * 7 + 3) % 70}`} alt={s.name}
                    className="dash-avatar-img" onError={e => e.target.style.display='none'} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{s.course}</div>
                  </div>
                </div>
                <div className="att-status-btns">
                  {STATUS.map(st => (
                    <button key={st}
                      className={`att-status-btn ${markMap[s._id] === st ? 'att-status-active' : ''}`}
                      style={markMap[s._id] === st ? { background: statusColor[st], color: '#fff', borderColor: statusColor[st] } : {}}
                      onClick={() => setMarkMap(prev => ({ ...prev, [s._id]: st }))}>
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button className="add-submit-btn" onClick={handleSave} disabled={saving} style={{ marginTop: 16 }}>
            {saving ? <><span className="add-spinner" /> Saving…</> : '💾 Save Attendance'}
          </button>
        </div>
      )}

      {/* Records Table */}
      <div className="db-panel">
        <div className="db-panel-hdr"><h3>Recent Attendance Records</h3></div>
        {records.length === 0 ? (
          <div className="db-empty">No records yet. {isAdmin && 'Mark attendance above.'}</div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr><th>Student</th><th>Subject</th><th>Date</th><th>Status</th></tr>
              </thead>
              <tbody>
                {records.slice(0, 20).map(r => (
                  <tr key={r._id}>
                    <td><strong>{r.studentId?.name || '—'}</strong></td>
                    <td>{r.subject}</td>
                    <td>{new Date(r.date).toLocaleDateString('en-IN')}</td>
                    <td>
                      <span className="dash-status"
                        style={{ background: statusColor[r.status] + '20', color: statusColor[r.status] }}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
