import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import { useParams, useNavigate } from 'react-router-dom';

const COURSES = ['Computer Science', 'Business Administration', 'Electrical Engineering',
  'Mechanical Engineering', 'Data Science', 'Graphic Design', 'Medicine', 'Law', 'Other'];

function UpdateStudent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState({ name: '', email: '', phone: '', course: '', age: '' });
  const [image, setImage]           = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError]       = useState('');

  useEffect(() => {
    document.title = 'Update Student | SMS';
    API.get(`/api/students/${id}`)
      .then(res => {
        setStudent(res.data);
        if (res.data.image) setCurrentImage(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/${res.data.image}`);
      })
      .catch(() => { setError('Student not found.'); })
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => setStudent({ ...student, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!student.name || !student.email || !student.phone || !student.course)
      return setError('Please fill all required fields.');

    setUpdating(true);
    setError('');
    try {
      const formData = new FormData();
      ['name', 'email', 'phone', 'course', 'age'].forEach(k => formData.append(k, student[k] || ''));
      if (image) formData.append('image', image);
      await API.put(`/api/students/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate('/students');
    } catch (err) {
      setError(err.response?.data?.error || 'Error updating student.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="students-skeleton">
      {[...Array(4)].map((_, i) => (
        <div className="skeleton-row" key={i}>
          <div className="skeleton-circle" />
          <div className="skeleton-lines">
            <div className="skeleton-line" style={{ width: '40%' }} />
            <div className="skeleton-line" style={{ width: '60%' }} />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <div className="add-page-header">
        <div>
          <h2>Update Student</h2>
          <p>Edit the student's details below</p>
        </div>
        <button className="add-back-btn" onClick={() => navigate('/students')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back to Students
        </button>
      </div>

      <div className="add-form-layout">
        {/* Photo */}
        <div className="add-photo-panel">
          <div className="add-photo-card">
            <h3 className="add-section-title">Profile Photo</h3>
            <p className="add-section-sub">JPG, PNG or GIF · Max 5MB</p>
            <label htmlFor="image" className="add-photo-label">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="add-photo-preview" />
              ) : currentImage ? (
                <img src={currentImage} alt={student.name} className="add-photo-preview" />
              ) : (
                <div className="add-photo-placeholder">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <span>Click to change photo</span>
                </div>
              )}
            </label>
            <input id="image" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
            {(imagePreview || currentImage) && (
              <button type="button" className="add-remove-photo" onClick={() => { setImage(null); setImagePreview(null); setCurrentImage(null); }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
                Remove Photo
              </button>
            )}
          </div>
        </div>

        {/* Fields */}
        <div className="add-fields-panel">
          <form onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="add-submit-error">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            <h3 className="add-section-title" style={{ marginBottom: 20 }}>Student Information</h3>

            <div className="add-row">
              <div className="add-field">
                <label>Full Name <span className="add-required">*</span></label>
                <div className="add-input-wrap">
                  <svg className="add-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                  <input name="name" type="text" placeholder="Full name" value={student.name} onChange={handleChange} />
                </div>
              </div>
              <div className="add-field">
                <label>Email Address <span className="add-required">*</span></label>
                <div className="add-input-wrap">
                  <svg className="add-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <input name="email" type="email" placeholder="Email address" value={student.email} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="add-row">
              <div className="add-field">
                <label>Phone Number <span className="add-required">*</span></label>
                <div className="add-input-wrap">
                  <svg className="add-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  <input name="phone" type="tel" placeholder="Phone number" value={student.phone} onChange={handleChange} />
                </div>
              </div>
              <div className="add-field">
                <label>Age <span className="add-optional">(optional)</span></label>
                <div className="add-input-wrap">
                  <svg className="add-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <input name="age" type="number" placeholder="Age" min="5" max="100" value={student.age || ''} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="add-field">
              <label>Course <span className="add-required">*</span></label>
              <div className="add-input-wrap">
                <svg className="add-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
                <select name="course" value={student.course} onChange={handleChange}>
                  <option value="">Select a course…</option>
                  {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="add-actions">
              <button type="submit" className="add-submit-btn" disabled={updating}>
                {updating ? <><span className="add-spinner" /> Updating…</> : <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
                  </svg>
                  Update Student
                </>}
              </button>
              <button type="button" className="add-cancel-btn" onClick={() => navigate('/students')}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateStudent;
