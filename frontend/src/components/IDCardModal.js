import React from 'react';

export default function IDCardModal({ open, student, onClose }) {
  if (!open || !student) return null;

  const handlePrint = () => {
    const content = document.getElementById('id-card-print').innerHTML;
    const win = window.open('', '', 'width=400,height=600');
    win.document.write(`
      <html><head><title>Student ID Card</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f1f5f9; }
        @media print { body { background: white; } }
      </style>
      </head><body>${content}</body></html>
    `);
    win.document.close();
    setTimeout(() => { win.print(); win.close(); }, 250);
  };

  const studentId = student._id?.slice(-8).toUpperCase() || 'SMS00000';
  const initials  = student.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'S';

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="idcard-modal" onClick={e => e.stopPropagation()}>
        
        {/* Preview */}
        <div id="id-card-print">
          <div className="idcard">
            {/* Front */}
            <div className="idcard-front">
              <div className="idcard-header">
                <div className="idcard-logo">S</div>
                <div>
                  <div className="idcard-inst">SMS Institute</div>
                  <div className="idcard-sub">Student Management System</div>
                </div>
              </div>

              <div className="idcard-photo-wrap">
                {student.image ? (
                  <img src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/${student.image}`} alt={student.name} className="idcard-photo" />
                ) : (
                  <div className="idcard-photo-placeholder">{initials}</div>
                )}
              </div>

              <div className="idcard-info">
                <div className="idcard-name">{student.name}</div>
                <div className="idcard-course">{student.course}</div>
                <div className="idcard-id">ID: {studentId}</div>
              </div>

              <div className="idcard-details">
                <div className="idcard-row"><span>Email:</span><span>{student.email}</span></div>
                <div className="idcard-row"><span>Phone:</span><span>{student.phone || '—'}</span></div>
                <div className="idcard-row"><span>Age:</span><span>{student.age || '—'}</span></div>
              </div>

              <div className="idcard-footer">
                <div className="idcard-barcode">|||||| |||| ||||| |||| ||||</div>
                <div className="idcard-valid">Valid: 2024–2025</div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="idcard-actions">
          <button className="modal-cancel-btn" onClick={onClose}>Close</button>
          <button className="modal-confirm-btn" style={{ background: '#6366f1' }} onClick={handlePrint}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
            </svg>
            Print ID Card
          </button>
        </div>
      </div>
    </div>
  );
}
