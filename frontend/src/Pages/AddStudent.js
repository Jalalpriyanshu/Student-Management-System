import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { useNavigate } from 'react-router-dom';

const COURSES = ['Computer Science', 'Business Administration', 'Electrical Engineering',
  'Mechanical Engineering', 'Data Science', 'Graphic Design', 'Medicine', 'Law', 'Other'];

const initialState = { name: '', email: '', phone: '', course: '', age: '' };

const AddStudent = () => {
  const [student, setStudent]       = useState(initialState);
  const [image, setImage]           = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors]         = useState({});
  const [loading, setLoading]       = useState(false);
  const [success, setSuccess]       = useState(false);
  const navigate = useNavigate();

  useEffect(() => { document.title = 'Add Student | SMS'; }, []);

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setErrors({ ...errors, image: 'Image must be under 5MB.' }); return; }
    setImage(file);
    setErrors({ ...errors, image: '' });
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const e = {};
    if (!student.name.trim())                                    e.name   = 'Full name is required.';
    if (!student.email.trim())                                   e.email  = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student.email)) e.email  = 'Enter a valid email.';
    if (!student.phone.trim())                                   e.phone  = 'Phone number is required.';
    else if (!/^\d{7,15}$/.test(student.phone.replace(/[\s\-+()]/g, ''))) e.phone = 'Enter a valid phone number.';
    if (!student.course)                                         e.course = 'Please select a course.';
    if (student.age && (student.age < 5 || student.age > 100))  e.age    = 'Enter a valid age (5–100).';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(student).forEach(([k, v]) => formData.append(k, v));
      if (image) formData.append('image', image);

      await API.post('/students/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccess(true);
      setTimeout(() => navigate('/students'), 1800);
    } catch (err) {
      setErrors({ submit: err.response?.data?.error || 'Failed to add student. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => { setImage(null); setImagePreview(null); };

  if (success) {
    return (
      <div className="add-success-screen">
        <div className="add-success-card">
          <div className="add-success-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h2>Student Added!</h2>
          <p>The student has been successfully registered. Redirecting to students list…</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="add-page-header">
        <div>
          <h2>Add New Student</h2>
          <p>Fill in the details below to register a new student</p>
        </div>
        <button className="add-back-btn" onClick={() => navigate('/students')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back to Students
        </button>
      </div>

      <div className="add-form-layout">

        {/* Left — Photo Upload */}
        <div className="add-photo-panel">
          <div className="add-photo-card">
            <h3 className="add-section-title">Profile Photo</h3>
            <p className="add-section-sub">JPG, PNG or GIF · Max 5MB</p>

            <label htmlFor="image" className="add-photo-label">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="add-photo-preview" />
              ) : (
                <div className="add-photo-placeholder">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <span>Click to upload photo</span>
                </div>
              )}
            </label>
            <input id="image" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />

            {errors.image && <p className="add-field-error">{errors.image}</p>}

            {imagePreview && (
              <button type="button" className="add-remove-photo" onClick={removeImage}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
                Remove Photo
              </button>
            )}

            {/* Info box */}
            <div className="add-info-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>A clear photo helps identify students easily in the system.</span>
            </div>
          </div>
        </div>

        {/* Right — Form Fields */}
        <div className="add-fields-panel">
          <form onSubmit={handleSubmit} noValidate>

            {errors.submit && (
              <div className="add-submit-error">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {errors.submit}
              </div>
            )}

            <h3 className="add-section-title" style={{ marginBottom: '20px' }}>Student Information</h3>

            {/* Name + Email */}
            <div className="add-row">
              <div className="add-field">
                <label htmlFor="name">
                  Full Name <span className="add-required">*</span>
                </label>
                <div className={`add-input-wrap ${errors.name ? 'add-input-error' : ''}`}>
                  <svg className="add-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                  <input id="name" name="name" type="text" placeholder="e.g. Priyanshu Singh"
                    value={student.name} onChange={handleChange} />
                </div>
                {errors.name && <p className="add-field-error">{errors.name}</p>}
              </div>

              <div className="add-field">
                <label htmlFor="email">
                  Email Address <span className="add-required">*</span>
                </label>
                <div className={`add-input-wrap ${errors.email ? 'add-input-error' : ''}`}>
                  <svg className="add-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <input id="email" name="email" type="email" placeholder="e.g. student@email.com"
                    value={student.email} onChange={handleChange} />
                </div>
                {errors.email && <p className="add-field-error">{errors.email}</p>}
              </div>
            </div>

            {/* Phone + Age */}
            <div className="add-row">
              <div className="add-field">
                <label htmlFor="phone">
                  Phone Number <span className="add-required">*</span>
                </label>
                <div className={`add-input-wrap ${errors.phone ? 'add-input-error' : ''}`}>
                  <svg className="add-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  <input id="phone" name="phone" type="tel" placeholder="e.g. 9876543210"
                    value={student.phone} onChange={handleChange} />
                </div>
                {errors.phone && <p className="add-field-error">{errors.phone}</p>}
              </div>

              <div className="add-field">
                <label htmlFor="age">Age <span className="add-optional">(optional)</span></label>
                <div className={`add-input-wrap ${errors.age ? 'add-input-error' : ''}`}>
                  <svg className="add-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <input id="age" name="age" type="number" placeholder="e.g. 20" min="5" max="100"
                    value={student.age} onChange={handleChange} />
                </div>
                {errors.age && <p className="add-field-error">{errors.age}</p>}
              </div>
            </div>

            {/* Course */}
            <div className="add-field">
              <label htmlFor="course">
                Course <span className="add-required">*</span>
              </label>
              <div className={`add-input-wrap ${errors.course ? 'add-input-error' : ''}`}>
                <svg className="add-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
                <select id="course" name="course" value={student.course} onChange={handleChange}>
                  <option value="">Select a course…</option>
                  {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {errors.course && <p className="add-field-error">{errors.course}</p>}
            </div>

            {/* Actions */}
            <div className="add-actions">
              <button type="submit" className="add-submit-btn" disabled={loading}>
                {loading ? (
                  <>
                    <span className="add-spinner" />
                    Adding Student…
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Add Student
                  </>
                )}
              </button>
              <button type="button" className="add-cancel-btn" onClick={() => navigate('/students')}>
                Cancel
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStudent;
