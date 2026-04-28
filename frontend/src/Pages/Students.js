import React, { useEffect, useState } from 'react';
import API, { getImageUrl } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { exportStudentsPDF } from '../utils/exportPDF';
import { useToast } from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';
import IDCardModal  from '../components/IDCardModal';

function Students() {
  const [students,     setStudents]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [searchTerm,   setSearchTerm]   = useState('');
  const [page,         setPage]         = useState(1);
  const [totalPages,   setTotalPages]   = useState(1);
  const [totalStudents,setTotalStudents]= useState(0);

  const [deleteId,    setDeleteId]    = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showIDCard,  setShowIDCard]  = useState(false);
  const [selStudent,  setSelStudent]  = useState(null);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/api/students/all?page=${page}&limit=5`);
      setStudents(res.data.students);
      setTotalPages(res.data.pages);
      setTotalStudents(res.data.total);
    } catch (err) {
      showToast('Error connecting to server', 'error');
    } finally { setLoading(false); }
  };

  useEffect(() => { if (!searchTerm) fetchStudents(); }, [page, searchTerm]);

  const handleSearch = async (e) => {
    const q = e.target.value;
    setSearchTerm(q);
    if (!q) return;
    try {
      const res = await API.get(`/api/students/search/query?q=${q}`);
      setStudents(res.data);
    } catch (err) { console.error(err); }
  };

  const confirmDelete = (id) => { setDeleteId(id); setShowConfirm(true); };

  const handleDelete = async () => {
    try {
      await API.delete(`/api/students/${deleteId}`);
      showToast('Student deleted!', 'success');
      fetchStudents();
    } catch (err) { showToast('Delete failed', 'error'); }
    finally { setShowConfirm(false); }
  };

  const openID = (s) => { setSelStudent(s); setShowIDCard(true); };

  return (
    <div className="students-container animate-fade-in">
      <div className="page-header">
        <div>
          <h2 className="page-title">Students Registry</h2>
          <p className="page-subtitle">Manage all {totalStudents} enrolled students</p>
        </div>
        <div style={{ display:'flex', gap:12 }}>
           <button onClick={() => exportStudentsPDF(students)} className="btn btn-outline" style={{ display:'flex', alignItems:'center', gap:8 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export PDF
          </button>
          <button onClick={() => navigate('/add')} className="btn btn-primary" style={{ display:'flex', alignItems:'center', gap:8 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Student
          </button>
        </div>
      </div>

      <div className="card search-card">
        <div className="search-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Search by name, course or email..." value={searchTerm} onChange={handleSearch} />
        </div>
      </div>

      <div className="card table-card">
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Profile</th>
                <th>Course</th>
                <th>Age</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? students.map(s => (
                <tr key={s._id}>
                  <td>
                    <div className="student-info-cell">
                      <div className="student-table-img">
                        <img src={getImageUrl(s.image)} alt="" />
                      </div>
                      <div>
                        <div className="student-name-text">{s.name}</div>
                        <div className="student-email-text">{s.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="course-badge">{s.course}</span></td>
                  <td>{s.age} yrs</td>
                  <td>{s.phone}</td>
                  <td>
                    <div className="action-btns">
                      <button className="act-btn view" onClick={() => openID(s)} title="ID Card">
                         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="7" y1="16" x2="13" y2="16"/></svg>
                      </button>
                      <button className="act-btn edit" onClick={() => navigate(`/update/${s._id}`)} title="Edit">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                      <button className="act-btn delete" onClick={() => confirmDelete(s._id)} title="Delete">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="5" className="empty-row">{loading ? 'Loading...' : 'No records found'}</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {!searchTerm && totalPages > 1 && (
          <div className="pagination-area">
            <span className="page-info">Page {page} of {totalPages}</span>
            <div className="pag-buttons">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="pag-btn">Prev</button>
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="pag-btn">Next</button>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal show={showConfirm} onConfirm={handleDelete} onCancel={() => setShowConfirm(false)} title="Delete Student?" message="This will permanently remove the student record." />
      <IDCardModal open={showIDCard} student={selStudent} onClose={() => setShowIDCard(false)} />
    </div>
  );
}

export default Students;
