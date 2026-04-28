import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { exportStudentsPDF } from '../utils/exportPDF';
import { useToast } from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';
import IDCardModal  from '../components/IDCardModal';

function Students() {
  const [students,     setStudents]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [searchQuery,  setSearchQuery]  = useState('');
  const [currentPage,  setCurrentPage]  = useState(1);
  const [totalPages,   setTotalPages]   = useState(1);
  const [totalStudents,setTotalStudents]= useState(0);
  const [courseFilter, setCourseFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [courses,      setCourses]      = useState([]);

  // Modal states
  const [deleteModal,  setDeleteModal]  = useState({ open: false, id: null, name: '' });
  const [idCardModal,  setIdCardModal]  = useState({ open: false, student: null });

  const navigate = useNavigate();
  const toast    = useToast();
  const itemsPerPage = 5;

  useEffect(() => { document.title = 'Students | SMS'; }, []);

  useEffect(() => {
    if (searchQuery.trim()) searchStudents();
    else fetchStudents(currentPage);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchQuery]);

  const fetchStudents = async (page = 1) => {
    try {
      setLoading(true);
      const res = await API.get(`/students/all?page=${page}&limit=${itemsPerPage}`);
      setStudents(res.data.students || []);
      setTotalPages(res.data.pages || 1);
      setTotalStudents(res.data.total || 0);
      // collect unique courses
      const all = res.data.students || [];
      setCourses([...new Set(all.map(s => s.course).filter(Boolean))]);
    } catch {
      setStudents([]);
    } finally { setLoading(false); }
  };

  const searchStudents = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/students/search/query?q=${searchQuery}`);
      setStudents(res.data);
      setTotalPages(1);
      setTotalStudents(res.data.length);
    } catch {
      setStudents([]);
    } finally { setLoading(false); }
  };

  const confirmDelete = (id, name) => setDeleteModal({ open: true, id, name });

  const handleDelete = async () => {
    try {
      await API.delete(`/students/${deleteModal.id}`);
      toast.success(`${deleteModal.name} deleted successfully.`);
      setDeleteModal({ open: false, id: null, name: '' });
      if (searchQuery.trim()) searchStudents();
      else fetchStudents(currentPage);
    } catch {
      toast.error('Failed to delete student.');
    }
  };

  const handleExport = async () => {
    try {
      const res = await API.get('/students/all?limit=1000');
      exportStudentsPDF(res.data.students || res.data);
      toast.success('PDF exported successfully!');
    } catch {
      toast.warning('Export failed. Make sure backend is running.');
    }
  };

  return (
    <div>
      {/* Confirm Delete Modal */}
      <ConfirmModal
        open={deleteModal.open}
        title="Delete Student"
        message={`Are you sure you want to delete "${deleteModal.name}"? This action cannot be undone.`}
        confirmText="Yes, Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ open: false, id: null, name: '' })}
      />

      {/* ID Card Modal */}
      <IDCardModal
        open={idCardModal.open}
        student={idCardModal.student}
        onClose={() => setIdCardModal({ open: false, student: null })}
      />

      {/* Header */}
      <div className="page-header">
        <div>
          <h2>Students List</h2>
          <p>Manage all students in the system ({totalStudents} students)</p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="add-back-btn" onClick={() => navigate('/add')}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Student
          </button>
          <button className="add-back-btn" onClick={handleExport}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export PDF
          </button>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="search-container">
        <input type="text" className="search-input"
          placeholder="🔍 Search by name or course..."
          value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }} />
        <select value={courseFilter} onChange={e => setCourseFilter(e.target.value)}>
          <option value="All">All Courses</option>
          {courses.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="All">All Status</option>
          <option>Active</option><option>Inactive</option><option>Graduated</option>
        </select>
      </div>


      {/* Loading */}
      {loading ? (
        <div className="students-skeleton">
          {[...Array(5)].map((_, i) => (
            <div className="skeleton-row" key={i}>
              <div className="skeleton-circle" />
              <div className="skeleton-lines">
                <div className="skeleton-line" style={{ width: '40%' }} />
                <div className="skeleton-line" style={{ width: '60%' }} />
              </div>
            </div>
          ))}
        </div>
      ) : students.length === 0 ? (
        /* Empty State */
        <div className="empty-state">
          <div className="empty-state-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#c7d2fe" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <h3 className="empty-state-title">
            {searchQuery ? `No results for "${searchQuery}"` : 'No Students Yet'}
          </h3>
          <p className="empty-state-text">
            {searchQuery ? 'Try a different search term.' : 'Get started by adding your first student to the system.'}
          </p>
          {!searchQuery && (
            <button className="add-submit-btn" onClick={() => navigate('/add')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add First Student
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Photo</th><th>Name</th><th>Email</th>
                  <th>Phone</th><th>Course</th><th>Age</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students
                  .filter(s => courseFilter === 'All' || s.course === courseFilter)
                  .filter(s => statusFilter === 'All' || (s.status || 'Active') === statusFilter)
                  .map((student) => (
                  <tr key={student._id}>
                    <td className="photo-cell">
                      {student.image ? (
                        <img src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/${student.image}`} alt="" className="student-photo" />
                      ) : (
                        <div className="photo-placeholder">{student.name.charAt(0).toUpperCase()}</div>
                      )}
                    </td>
                    <td style={{ fontWeight: 600 }}>{student.name}</td>
                    <td style={{ color: '#64748b', fontSize: 13 }}>{student.email}</td>
                    <td>{student.phone}</td>
                    <td><span className="dash-badge">{student.course}</span></td>
                    <td>{student.age || '—'}</td>
                    <td>
                      <span className="dash-status" style={{
                        background: student.status === 'Inactive' ? '#fef2f2' : student.status === 'Graduated' ? '#f0f9ff' : '#ecfdf5',
                        color: student.status === 'Inactive' ? '#dc2626' : student.status === 'Graduated' ? '#0ea5e9' : '#059669'
                      }}>{student.status || 'Active'}</span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button className="action-btn action-btn-edit"
                          onClick={() => navigate(`/profile/${student._id}`)}>View</button>
                        <button className="action-btn action-btn-edit"
                          onClick={() => navigate(`/update/${student._id}`)}>Edit</button>
                        <button className="action-btn"
                          style={{ background: '#f5f3ff', color: '#6366f1' }}
                          onClick={() => setIdCardModal({ open: true, student })}>ID Card</button>
                        <button className="action-btn action-btn-delete"
                          onClick={() => confirmDelete(student._id, student.name)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!searchQuery.trim() && totalPages > 1 && (
            <div className="pagination">
              <button className="pagination-btn" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>← Prev</button>
              <div style={{ display: 'flex', gap: 6 }}>
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i}
                    className={`pagination-btn ${currentPage === i + 1 ? '' : 'pagination-btn-ghost'}`}
                    onClick={() => setCurrentPage(i + 1)}
                    style={currentPage !== i + 1 ? { background: '#f1f5f9', color: '#475569' } : {}}>
                    {i + 1}
                  </button>
                ))}
              </div>
              <button className="pagination-btn" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Students;
