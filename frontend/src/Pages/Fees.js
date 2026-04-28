import React, { useEffect, useState, useCallback } from 'react';
import API from '../utils/api';
import { useToast } from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';

const FEE_TYPES   = ['Tuition','Exam','Library','Sports','Transport','Other'];
const STATUS_LIST = ['Paid','Pending','Overdue'];

const statusStyle = {
  Paid:    { bg:'#ecfdf5', color:'#059669' },
  Pending: { bg:'#fffbeb', color:'#d97706' },
  Overdue: { bg:'#fef2f2', color:'#dc2626' },
};

const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN');

export default function Fees() {
  const user    = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';
  const toast   = useToast();

  const [fees,      setFees]      = useState([]);
  const [students,  setStudents]  = useState([]);
  const [stats,     setStats]     = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType,   setFilterType]   = useState('All');
  const [search,       setSearch]       = useState('');
  const [deleteModal,  setDeleteModal]  = useState({ open:false, id:null });
  const [editFee,      setEditFee]      = useState(null);

  const [form, setForm] = useState({
    studentId:'', amount:'', feeType:'Tuition', status:'Pending',
    dueDate: new Date().toISOString().split('T')[0], academicYear:'2024-25', remarks:'',
  });

  const fetchAll = useCallback(async () => {
    try {
      // fetch students separately so dropdown always works
      const studentsRes = await API.get('/api/students/all?limit=1000');
      setStudents(studentsRes.data.students || studentsRes.data);
    } catch { console.error('Failed to load students'); }

    try {
      const [fRes, statsRes] = await Promise.all([
        API.get('/api/fees/all'),
        API.get('/api/fees/stats'),
      ]);
      setFees(fRes.data);
      setStats(statsRes.data);
    } catch { toast.error('Failed to load fee data. Make sure backend is running.'); }

    setLoading(false);
  }, [toast]);

  useEffect(() => { document.title = 'Fee Management | SMS'; fetchAll(); }, [fetchAll]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.studentId || !form.amount) return toast.error('Select student and enter amount.');
    setSaving(true);
    try {
      if (editFee) {
        await API.put(`/api/fees/${editFee._id}`, form);
        toast.success('Fee record updated!');
        setEditFee(null);
      } else {
        await API.post('/api/fees/add', form);
        toast.success('Fee record added!');
      }
      setForm({ studentId:'', amount:'', feeType:'Tuition', status:'Pending', dueDate: new Date().toISOString().split('T')[0], academicYear:'2024-25', remarks:'' });
      fetchAll();
    } catch (err) { toast.error(err.response?.data?.error || 'Failed to save.'); }
    finally { setSaving(false); }
  };

  const handleMarkPaid = async (fee) => {
    try {
      await API.put(`/api/fees/${fee._id}`, { status:'Paid', paidDate: new Date() });
      toast.success(`${fee.studentId?.name}'s fee marked as Paid!`);
      fetchAll();
    } catch { toast.error('Failed to update.'); }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/api/fees/${deleteModal.id}`);
      toast.success('Fee record deleted.');
      setDeleteModal({ open:false, id:null });
      fetchAll();
    } catch { toast.error('Failed to delete.'); }
  };

  const handleEdit = (fee) => {
    setEditFee(fee);
    setForm({
      studentId: fee.studentId?._id || '',
      amount: fee.amount,
      feeType: fee.feeType,
      status: fee.status,
      dueDate: fee.dueDate?.split('T')[0] || '',
      academicYear: fee.academicYear,
      remarks: fee.remarks || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filtered = fees.filter(f => {
    const matchStatus = filterStatus === 'All' || f.status === filterStatus;
    const matchType   = filterType   === 'All' || f.feeType === filterType;
    const matchSearch = !search || f.studentId?.name?.toLowerCase().includes(search.toLowerCase()) || f.studentId?.course?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchType && matchSearch;
  });

  if (loading) return <div className="dash-loading"><div className="dash-spinner" /><p>Loading fees...</p></div>;

  return (
    <div className="db-wrapper">
      <ConfirmModal open={deleteModal.open} title="Delete Fee Record"
        message="Are you sure you want to delete this fee record? This cannot be undone."
        confirmText="Yes, Delete" onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ open:false, id:null })} />

      {/* Header */}
      <div className="add-page-header">
        <div>
          <h2>Fee Management</h2>
          <p>Track student fee payments and outstanding dues</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="stat-grid">
        {[
          { label:'Total Fees',    value: fmt(stats?.total    || 0), color:'#6366f1', bg:'#eef2ff', icon:'💰' },
          { label:'Collected',     value: fmt(stats?.paid     || 0), color:'#10b981', bg:'#ecfdf5', icon:'✅' },
          { label:'Pending',       value: fmt(stats?.pending  || 0), color:'#f59e0b', bg:'#fffbeb', icon:'⏳' },
          { label:'Overdue',       value: fmt(stats?.overdue  || 0), color:'#ef4444', bg:'#fef2f2', icon:'⚠️' },
        ].map(({ label, value, color, bg, icon }) => (
          <div key={label} className="stat-card p-20 rounded-16 shadow-sm flex items-center gap-16 border-slate-100"
            style={{ '--card-color': color }}>
            <div className="flex-center rounded-14 font-large" style={{ width:52, height:52, background:bg, flexShrink:0 }}>{icon}</div>
            <div>
              <div className="font-bold text-slate-900" style={{ fontSize:22, color, lineHeight:1 }}>{value}</div>
              <div className="font-normal text-slate-500 mt-4 font-medium">{label}</div>
            </div>
            <div className="stat-card-bar" style={{ background: color }} />
          </div>
        ))}
      </div>


      {/* Add / Edit Form — admin only */}
      {isAdmin && (
        <div className="db-panel">
          <div className="db-panel-hdr">
            <h3>{editFee ? '✏️ Edit Fee Record' : '➕ Add Fee Record'}</h3>
            {editFee && (
              <button onClick={() => { setEditFee(null); setForm({ studentId:'', amount:'', feeType:'Tuition', status:'Pending', dueDate: new Date().toISOString().split('T')[0], academicYear:'2024-25', remarks:'' }); }}
                style={{ padding:'6px 14px', background:'#f1f5f9', border:'none', borderRadius:8, fontSize:13, fontWeight:600, color:'#475569', cursor:'pointer' }}>
                Cancel Edit
              </button>
            )}
          </div>
          <form onSubmit={handleSubmit}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px,1fr))', gap:16, marginBottom:16 }}>
              {/* Student */}
              <div className="add-field" style={{ marginBottom:0 }}>
                <label>Student <span className="add-required">*</span></label>
                <select value={form.studentId} onChange={e => setForm(f => ({ ...f, studentId:e.target.value }))}
                  style={{ padding:'11px 14px', border:'1.5px solid #e2e8f0', borderRadius:10, fontSize:14, fontFamily:'inherit', color:'#1e293b', background:'#fff', width:'100%' }}>
                  <option value="">-- Select Student --</option>
                  {students.map(s => <option key={s._id} value={s._id}>{s.name} — {s.course}</option>)}
                </select>
              </div>
              {/* Amount */}
              <div className="add-field" style={{ marginBottom:0 }}>
                <label>Amount (₹) <span className="add-required">*</span></label>
                <input type="number" min="0" placeholder="e.g. 5000" value={form.amount}
                  onChange={e => setForm(f => ({ ...f, amount:e.target.value }))}
                  style={{ padding:'11px 14px', border:'1.5px solid #e2e8f0', borderRadius:10, fontSize:14, fontFamily:'inherit', color:'#1e293b', width:'100%' }} />
              </div>
              {/* Fee Type */}
              <div className="add-field" style={{ marginBottom:0 }}>
                <label>Fee Type</label>
                <select value={form.feeType} onChange={e => setForm(f => ({ ...f, feeType:e.target.value }))}
                  style={{ padding:'11px 14px', border:'1.5px solid #e2e8f0', borderRadius:10, fontSize:14, fontFamily:'inherit', color:'#1e293b', background:'#fff', width:'100%' }}>
                  {FEE_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              {/* Status */}
              <div className="add-field" style={{ marginBottom:0 }}>
                <label>Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status:e.target.value }))}
                  style={{ padding:'11px 14px', border:'1.5px solid #e2e8f0', borderRadius:10, fontSize:14, fontFamily:'inherit', color:'#1e293b', background:'#fff', width:'100%' }}>
                  {STATUS_LIST.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              {/* Due Date */}
              <div className="add-field" style={{ marginBottom:0 }}>
                <label>Due Date <span className="add-required">*</span></label>
                <input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate:e.target.value }))}
                  style={{ padding:'11px 14px', border:'1.5px solid #e2e8f0', borderRadius:10, fontSize:14, fontFamily:'inherit', color:'#1e293b', width:'100%' }} />
              </div>
              {/* Submit */}
              <div className="add-field" style={{ marginBottom:0, display:'flex', alignItems:'flex-end' }}>
                <button type="submit" className="add-submit-btn" disabled={saving} style={{ width:'100%' }}>
                  {saving ? <><span className="add-spinner" /> Saving…</> : editFee ? '💾 Update' : '➕ Add Fee'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Filters + Table */}
      <div className="db-panel">
        <div className="db-panel-hdr" style={{ flexWrap:'wrap', gap:12 }}>
          <h3>Fee Records <span style={{ fontSize:13, color:'#94a3b8', fontWeight:500 }}>({filtered.length})</span></h3>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
            {/* Search */}
            <input placeholder="🔍 Search student..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ padding:'8px 14px', border:'1.5px solid #e2e8f0', borderRadius:9, fontSize:13, fontFamily:'inherit', color:'#1e293b', outline:'none', width:200 }} />
            {/* Status filter */}
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              style={{ padding:'8px 12px', border:'1.5px solid #e2e8f0', borderRadius:9, fontSize:13, fontFamily:'inherit', color:'#475569', background:'#fff', cursor:'pointer' }}>
              <option value="All">All Status</option>
              {STATUS_LIST.map(s => <option key={s}>{s}</option>)}
            </select>
            {/* Type filter */}
            <select value={filterType} onChange={e => setFilterType(e.target.value)}
              style={{ padding:'8px 12px', border:'1.5px solid #e2e8f0', borderRadius:9, fontSize:13, fontFamily:'inherit', color:'#475569', background:'#fff', cursor:'pointer' }}>
              <option value="All">All Types</option>
              {FEE_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="db-empty">No fee records found. {isAdmin && 'Use the form above to add records.'}</div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th><th>Student</th><th>Course</th><th>Fee Type</th>
                  <th>Amount</th><th>Due Date</th><th>Status</th>
                  {isAdmin && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map((f, i) => (
                  <tr key={f._id}>
                    <td style={{ color:'#94a3b8', fontSize:13 }}>{i + 1}</td>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ width:34, height:34, borderRadius:10, background:'linear-gradient(135deg,#6366f1,#818cf8)', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:14, flexShrink:0 }}>
                          {f.studentId?.name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <div style={{ fontWeight:700, fontSize:14, color:'#0f172a' }}>{f.studentId?.name || '—'}</div>
                          <div style={{ fontSize:12, color:'#64748b' }}>{f.studentId?.email || ''}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="dash-badge">{f.studentId?.course || '—'}</span></td>
                    <td>
                      <span style={{ background:'#f5f3ff', color:'#6366f1', padding:'3px 10px', borderRadius:20, fontSize:12, fontWeight:600 }}>{f.feeType}</span>
                    </td>
                    <td style={{ fontWeight:700, color:'#0f172a', fontSize:15 }}>{fmt(f.amount)}</td>
                    <td style={{ fontSize:13, color:'#64748b' }}>
                      {new Date(f.dueDate).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}
                    </td>
                    <td>
                      <span style={{ background: statusStyle[f.status]?.bg, color: statusStyle[f.status]?.color, padding:'4px 12px', borderRadius:20, fontSize:12, fontWeight:700 }}>
                        {f.status === 'Paid' ? '✓ ' : f.status === 'Overdue' ? '⚠ ' : '⏳ '}{f.status}
                      </span>
                    </td>
                    {isAdmin && (
                      <td>
                        <div style={{ display:'flex', gap:6 }}>
                          {f.status !== 'Paid' && (
                            <button onClick={() => handleMarkPaid(f)}
                              style={{ padding:'5px 12px', background:'#ecfdf5', color:'#059669', border:'none', borderRadius:7, fontSize:12, fontWeight:600, cursor:'pointer' }}>
                              Mark Paid
                            </button>
                          )}
                          <button onClick={() => handleEdit(f)}
                            style={{ padding:'5px 12px', background:'#eef2ff', color:'#6366f1', border:'none', borderRadius:7, fontSize:12, fontWeight:600, cursor:'pointer' }}>
                            Edit
                          </button>
                          <button onClick={() => setDeleteModal({ open:true, id:f._id })}
                            style={{ padding:'5px 12px', background:'#fef2f2', color:'#dc2626', border:'none', borderRadius:7, fontSize:12, fontWeight:600, cursor:'pointer' }}>
                            Delete
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Summary footer */}
        <div style={{ display:'flex', gap:20, marginTop:16, paddingTop:16, borderTop:'1px solid #f1f5f9', flexWrap:'wrap' }}>
          {[
            { label:'Total Records', value: filtered.length, color:'#6366f1' },
            { label:'Paid',    value: filtered.filter(f=>f.status==='Paid').length,    color:'#10b981' },
            { label:'Pending', value: filtered.filter(f=>f.status==='Pending').length, color:'#f59e0b' },
            { label:'Overdue', value: filtered.filter(f=>f.status==='Overdue').length, color:'#ef4444' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ fontSize:13, color:'#64748b' }}>
              {label}: <strong style={{ color }}>{value}</strong>
            </div>
          ))}
          <div style={{ marginLeft:'auto', fontSize:13, color:'#64748b' }}>
            Total Amount: <strong style={{ color:'#0f172a', fontSize:15 }}>{fmt(filtered.reduce((s,f)=>s+f.amount,0))}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
