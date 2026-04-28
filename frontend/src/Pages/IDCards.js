import React, { useEffect, useState, useRef } from 'react';
import API, { getImageUrl } from '../utils/api';
import IDCardModal from '../components/IDCardModal';

export default function IDCards() {
  const [students,   setStudents]   = useState([]);
  const [filtered,   setFiltered]   = useState([]);
  const [search,     setSearch]     = useState('');
  const [loading,    setLoading]    = useState(true);
  const [selected,   setSelected]   = useState(null);   // student for modal
  const printRef = useRef();

  useEffect(() => {
    document.title = 'ID Cards | SMS';
    API.get('/api/students/all?limit=1000')
      .then(res => {
        const data = res.data.students || res.data;
        setStudents(data);
        setFiltered(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      q ? students.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.course.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q)
      ) : students
    );
  }, [search, students]);

  const handlePrintAll = () => {
    const content = printRef.current.innerHTML;
    const win = window.open('', '', 'width=900,height=700');
    win.document.write(`
      <html><head><title>All ID Cards</title>
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family: Arial, sans-serif; background:#f1f5f9; padding:20px; }
        .print-grid { display:grid; grid-template-columns: repeat(2, 1fr); gap:20px; }
        .idcard-front {
          background: linear-gradient(135deg,#6366f1 0%,#0ea5e9 100%);
          border-radius:16px; padding:20px;
          box-shadow:0 12px 32px rgba(99,102,241,0.3);
          position:relative; overflow:hidden; page-break-inside:avoid;
        }
        .idcard-header { display:flex; align-items:center; gap:10px; margin-bottom:16px; }
        .idcard-logo { width:36px;height:36px;background:rgba(255,255,255,0.25);border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:18px;color:white; }
        .idcard-inst { font-size:14px;font-weight:800;color:white; }
        .idcard-sub  { font-size:10px;color:rgba(255,255,255,0.8);margin-top:1px; }
        .idcard-photo-wrap { width:80px;height:80px;margin:0 auto 12px;border-radius:50%;border:3px solid rgba(255,255,255,0.3);overflow:hidden;background:rgba(255,255,255,0.15); }
        .idcard-photo { width:100%;height:100%;object-fit:cover; }
        .idcard-photo-placeholder { width:100%;height:100%;background:rgba(255,255,255,0.25);display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:900;color:white; }
        .idcard-info { text-align:center;margin-bottom:12px; }
        .idcard-name   { font-size:16px;font-weight:800;color:white;margin-bottom:3px; }
        .idcard-course { font-size:12px;color:rgba(255,255,255,0.9);margin-bottom:4px; }
        .idcard-id     { font-size:10px;font-weight:700;color:rgba(255,255,255,0.7);letter-spacing:1px; }
        .idcard-details { background:rgba(255,255,255,0.15);border-radius:10px;padding:10px 12px;margin-bottom:12px; }
        .idcard-row { display:flex;justify-content:space-between;font-size:10px;color:rgba(255,255,255,0.9);padding:3px 0; }
        .idcard-row span:first-child { font-weight:600; }
        .idcard-footer { text-align:center; }
        .idcard-barcode { font-family:'Courier New',monospace;font-size:14px;color:rgba(255,255,255,0.6);letter-spacing:2px;margin-bottom:4px; }
        .idcard-valid   { font-size:10px;color:rgba(255,255,255,0.7);font-weight:600; }
        @media print { body { background:white; } }
      </style>
      </head><body><div class="print-grid">${content}</div></body></html>
    `);
    win.document.close();
    setTimeout(() => { win.print(); win.close(); }, 300);
  };

  if (loading) return (
    <div className="dash-loading"><div className="dash-spinner" /><p>Loading students…</p></div>
  );

  return (
    <div className="db-wrapper">

      {/* Header */}
      <div className="add-page-header">
        <div>
          <h2>Generate ID Cards</h2>
          <p>Click any student to preview and print their ID card</p>
        </div>
        <button className="add-submit-btn" onClick={handlePrintAll}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
          </svg>
          Print All ({filtered.length})
        </button>
      </div>

      {/* Search */}
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search by name, course or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Stats bar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 4 }}>
        {[
          { label: 'Total Students', value: students.length, color: '#6366f1', bg: '#eef2ff' },
          { label: 'Showing',        value: filtered.length, color: '#10b981', bg: '#ecfdf5' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} style={{ background: bg, color, padding: '10px 20px', borderRadius: 12, fontWeight: 700, fontSize: 14 }}>
            {value} <span style={{ fontWeight: 500, opacity: 0.8 }}>{label}</span>
          </div>
        ))}
      </div>

      {/* ID Card Grid */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#c7d2fe" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8" cy="12" r="2"/>
              <line x1="13" y1="10" x2="19" y2="10"/><line x1="13" y1="14" x2="17" y2="14"/>
            </svg>
          </div>
          <h3 className="empty-state-title">No students found</h3>
          <p className="empty-state-text">Try a different search term.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {filtered.map((student, i) => {
            const initials = student.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'S';
            const studentId = student._id?.slice(-8).toUpperCase();
            return (
              <div key={student._id}
                onClick={() => setSelected(student)}
                style={{ cursor: 'pointer', transition: 'transform 0.2s', borderRadius: 16 }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {/* Mini ID Card Preview */}
                <div style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #0ea5e9 100%)',
                  borderRadius: 16, padding: 20,
                  boxShadow: '0 8px 24px rgba(99,102,241,0.25)',
                  position: 'relative', overflow: 'hidden',
                }}>
                  {/* Decorative circle */}
                  <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />

                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <div style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.2)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16, color: 'white' }}>S</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: 'white' }}>SMS Institute</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.75)' }}>Student ID Card</div>
                    </div>
                  </div>

                  {/* Photo */}
                  <div style={{ width: 72, height: 72, margin: '0 auto 12px', borderRadius: '50%', border: '3px solid rgba(255,255,255,0.3)', overflow: 'hidden', background: 'rgba(255,255,255,0.15)' }}>
                    {student.image
                      ? <img src={getImageUrl(student.image)} alt={student.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 900, color: 'white' }}>{initials}</div>
                    }
                  </div>

                  {/* Info */}
                  <div style={{ textAlign: 'center', marginBottom: 12 }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: 'white', marginBottom: 3 }}>{student.name}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', marginBottom: 4 }}>{student.course}</div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.65)', letterSpacing: 1 }}>ID: {studentId}</div>
                  </div>

                  {/* Details */}
                  <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '10px 12px', backdropFilter: 'blur(8px)' }}>
                    {[
                      { label: 'Email', value: student.email },
                      { label: 'Phone', value: student.phone || '—' },
                      { label: 'Status', value: student.status || 'Active' },
                    ].map(({ label, value }) => (
                      <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,0.9)', padding: '3px 0' }}>
                        <span style={{ fontWeight: 600 }}>{label}:</span>
                        <span style={{ maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Click hint */}
                  <div style={{ textAlign: 'center', marginTop: 12, fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>
                    🖨 Click to Print
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Hidden print-all container */}
      <div style={{ display: 'none' }}>
        <div ref={printRef}>
          {filtered.map((student) => {
            const initials = student.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'S';
            const studentId = student._id?.slice(-8).toUpperCase();
            return (
              <div key={student._id} className="idcard-front">
                <div className="idcard-header">
                  <div className="idcard-logo">S</div>
                  <div>
                    <div className="idcard-inst">SMS Institute</div>
                    <div className="idcard-sub">Student Management System</div>
                  </div>
                </div>
                <div className="idcard-photo-wrap">
                  {student.image
                    ? <img src={getImageUrl(student.image)} alt={student.name} className="idcard-photo" />
                    : <div className="idcard-photo-placeholder">{initials}</div>
                  }
                </div>
                <div className="idcard-info">
                  <div className="idcard-name">{student.name}</div>
                  <div className="idcard-course">{student.course}</div>
                  <div className="idcard-id">{studentId}</div>
                </div>
                <div className="idcard-details">
                  <div className="idcard-row"><span>Email:</span><span>{student.email}</span></div>
                  <div className="idcard-row"><span>Phone:</span><span>{student.phone || '—'}</span></div>
                  <div className="idcard-row"><span>Age:</span><span>{student.age || '—'}</span></div>
                  <div className="idcard-row"><span>Status:</span><span>{student.status || 'Active'}</span></div>
                </div>
                <div className="idcard-footer">
                  <div className="idcard-barcode">|||||| |||| ||||| |||| ||||</div>
                  <div className="idcard-valid">Valid: 2024–2025</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ID Card Modal */}
      <IDCardModal
        open={!!selected}
        student={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
