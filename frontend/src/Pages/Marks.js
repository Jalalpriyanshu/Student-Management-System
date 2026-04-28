import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS   = ['#6366f1','#0ea5e9','#10b981','#f59e0b','#ef4444','#8b5cf6'];
const SUBJECTS = ['Mathematics','Science','English','History','Computer','Physics'];
const EXAM_TYPES = ['Mid-Term','Final','Unit Test','Assignment'];

const gradeOf = (m) => m >= 90 ? 'A+' : m >= 80 ? 'A' : m >= 70 ? 'B+' : m >= 60 ? 'B' : m >= 50 ? 'C' : 'F';
const gradeColor = (g) => ({ 'A+':'#10b981','A':'#6366f1','B+':'#0ea5e9','B':'#f59e0b','C':'#94a3b8','F':'#ef4444' }[g] || '#64748b');

export default function Marks() {
  const user     = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin  = user.role === 'admin';

  const [students,  setStudents]  = useState([]);
  const [allMarks,  setAllMarks]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [msg,       setMsg]       = useState({ text: '', type: '' });
  const [search,    setSearch]    = useState('');
  const [examFilter,setExamFilter]= useState('Final');

  const [form, setForm] = useState({
    studentId: '', subject: SUBJECTS[0], marks: '', examType: 'Final', academicYear: '2024-25',
  });

  useEffect(() => {
    Promise.all([
      API.get('/students/all?limit=1000'),
      API.get('/api/marks/all'),
    ]).then(([s, m]) => {
      setStudents(s.data.students || s.data);
      setAllMarks(m.data);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.studentId || !form.marks) return setMsg({ text: 'Select student and enter marks.', type: 'error' });
    setSaving(true);
    try {
      await API.post('/api/marks/add', { ...form, marks: Number(form.marks) });
      setMsg({ text: 'Marks saved successfully!', type: 'success' });
      setForm(f => ({ ...f, studentId: '', marks: '' }));
      const res = await API.get('/api/marks/all');
      setAllMarks(res.data);
    } catch (err) {
      setMsg({ text: err.response?.data?.error || 'Failed to save.', type: 'error' });
    } finally {
      setSaving(false);
      setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this marks record?')) return;
    await API.delete(`/api/marks/${id}`);
    setAllMarks(prev => prev.filter(m => m._id !== id));
  };

  // Chart: avg per subject for selected exam type
  const chartData = SUBJECTS.map((sub, i) => {
    const filtered = allMarks.filter(m => m.subject === sub && m.examType === examFilter);
    const avg = filtered.length ? Math.round(filtered.reduce((s, m) => s + m.marks, 0) / filtered.length) : 0;
    return { subject: sub.slice(0, 4), avg, color: COLORS[i] };
  });

  const filtered = allMarks.filter(m =>
    (!search || m.studentId?.name?.toLowerCase().includes(search.toLowerCase())) &&
    m.examType === examFilter
  );

  if (loading) return <div className="dash-loading"><div className="dash-spinner" /><p>Loading…</p></div>;

  return (
    <div className="db-wrapper">
      <div className="add-page-header">
        <div><h2>Marks &amp; Grades</h2><p>{isAdmin ? 'Enter and manage student marks' : 'Your academic performance'}</p></div>
        <div style={{ display: 'flex', gap: 8 }}>
          {EXAM_TYPES.map(t => (
            <button key={t}
              className={`perf-tab ${examFilter === t ? 'perf-tab-active' : ''}`}
              onClick={() => setExamFilter(t)}>{t}</button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="db-panel">
        <div className="db-panel-hdr"><h3>Class Average — {examFilter}</h3></div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="subject" tick={{ fontSize: 12, fill: '#64748b' }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#64748b' }} />
            <Tooltip formatter={v => [`${v}%`, 'Average']} />
            <Bar dataKey="avg" radius={[6,6,0,0]}>
              {chartData.map((d, i) => <Cell key={i} fill={d.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Entry Form — admin only */}
      {isAdmin && (
        <div className="db-panel">
          <div className="db-panel-hdr"><h3>Enter Marks</h3></div>

          {msg.text && (
            <div className={msg.type === 'success' ? 'login-success' : 'login-error'} style={{ marginBottom: 16 }}>
              {msg.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="stat-grid mb-20">
              <div className="add-field mb-0">
                <label>Select Student <span className="add-required">*</span></label>
                <select className="border-slate-200 rounded-10 p-10 font-medium bg-white w-full"
                  value={form.studentId} onChange={e => setForm(f => ({ ...f, studentId: e.target.value }))}>
                  <option value="">-- Select Student --</option>
                  {students.map(s => <option key={s._id} value={s._id}>{s.name} — {s.course}</option>)}
                </select>
              </div>
              <div className="add-field mb-0">
                <label>Subject <span className="add-required">*</span></label>
                <select className="border-slate-200 rounded-10 p-10 font-medium bg-white w-full"
                  value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}>
                  {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="add-field mb-0">
                <label>Exam Type</label>
                <select className="border-slate-200 rounded-10 p-10 font-medium bg-white w-full"
                  value={form.examType} onChange={e => setForm(f => ({ ...f, examType: e.target.value }))}>
                  {EXAM_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="add-field mb-0">
                <label>Marks (out of 100) <span className="add-required">*</span></label>
                <input type="number" className="border-slate-200 rounded-10 p-10 font-medium w-full" 
                  min="0" max="100" placeholder="e.g. 85"
                  value={form.marks} onChange={e => setForm(f => ({ ...f, marks: e.target.value }))} />
              </div>
              <div className="add-field mb-0">
                <label>Academic Year</label>
                <input type="text" className="border-slate-200 rounded-10 p-10 font-medium w-full"
                  placeholder="2024-25" value={form.academicYear} 
                  onChange={e => setForm(f => ({ ...f, academicYear: e.target.value }))} />
              </div>
              <div className="add-field mb-0 flex items-end">
                <button type="submit" className="add-submit-btn w-full h-full" disabled={saving}>
                  {saving ? <><span className="add-spinner" /> Saving…</> : '💾 Save Marks'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}


      {/* Marks Table — full width */}
      <div className="db-panel">
        <div className="db-panel-hdr">
          <h3>Marks Records — {examFilter}</h3>
          <input className="search-input" style={{ maxWidth: 240 }} placeholder="Search student…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {filtered.length === 0 ? (
          <div className="db-empty">No marks records found. {isAdmin && 'Use the form above to add marks.'}</div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th><th>Student</th><th>Course</th><th>Subject</th>
                  <th>Marks</th><th>Grade</th>{isAdmin && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map((m, i) => {
                  const g = gradeOf(m.marks);
                  return (
                    <tr key={m._id}>
                      <td style={{ color: '#94a3b8', fontSize: 13 }}>{i + 1}</td>
                      <td><strong>{m.studentId?.name || '—'}</strong></td>
                      <td><span className="dash-badge">{m.studentId?.course || '—'}</span></td>
                      <td>{m.subject}</td>
                      <td style={{ minWidth: 160 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ flex: 1, height: 6, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
                            <div style={{ width: `${m.marks}%`, height: '100%', background: gradeColor(g), borderRadius: 99 }} />
                          </div>
                          <span style={{ fontWeight: 700, minWidth: 40 }}>{m.marks}%</span>
                        </div>
                      </td>
                      <td>
                        <span className="dash-badge" style={{ background: gradeColor(g) + '20', color: gradeColor(g) }}>{g}</span>
                      </td>
                      {isAdmin && (
                        <td>
                          <button className="action-btn action-btn-delete" onClick={() => handleDelete(m._id)}>Delete</button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
