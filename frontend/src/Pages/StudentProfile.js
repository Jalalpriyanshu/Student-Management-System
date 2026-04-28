import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import { useParams, useNavigate } from 'react-router-dom';
import CircularProgress from '../components/CircularProgress';

const SUBJECTS = ['Mathematics','Science','English','History','Computer','Physics'];
const MARKS    = [88, 92, 75, 80, 95, 78];
const ATT      = [92, 88, 95, 78, 90, 85];

export default function StudentProfile() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const loggedUser = JSON.parse(localStorage.getItem('user') || '{}');

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  // If student role, always show their own profile
  const profileId = loggedUser.role === 'student' ? null : id;

  useEffect(() => {
    const url = profileId
      ? `/api/students/${profileId}`
      : `/api/students/all?limit=1000`;

    API.get(url).then(res => {
      if (profileId) {
        setStudent(res.data);
      } else {
        // student viewing own profile — match by email
        const all = res.data.students || res.data;
        const found = all.find(s => s.email === loggedUser.email) || all[0];
        setStudent(found);
      }
    }).catch(() => setStudent(null))
      .finally(() => setLoading(false));
  }, [profileId, loggedUser.email]);

  if (loading) return <div className="dash-loading"><div className="dash-spinner" /><p>Loading profile…</p></div>;
  if (!student) return <div className="dash-loading"><p>Student not found.</p></div>;

  const avgMarks = Math.round(MARKS.reduce((a, b) => a + b, 0) / MARKS.length);
  const avgAtt   = Math.round(ATT.reduce((a, b) => a + b, 0) / ATT.length);
  const grade    = avgMarks >= 90 ? 'A+' : avgMarks >= 80 ? 'A' : avgMarks >= 70 ? 'B+' : avgMarks >= 60 ? 'B' : 'C';

  return (
    <div className="db-wrapper">

      {/* Back button — admin only */}
      {loggedUser.role === 'admin' && (
        <button className="add-back-btn" onClick={() => navigate('/students')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back to Students
        </button>
      )}

      {/* Profile Header */}
      <div className="profile-header-card">
        <div className="profile-cover" />
        <div className="profile-info">
          <div className="profile-avatar-wrap">
            {student.image
            ? <img src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/${student.image}`} alt={student.name} className="profile-avatar" />
              : <div className="profile-avatar-placeholder">{student.name?.[0]?.toUpperCase()}</div>
            }
          </div>
          <div className="profile-meta">
            <h2>{student.name}</h2>
            <p>{student.course} &nbsp;·&nbsp; Age {student.age || '—'}</p>
            <p className="profile-email">{student.email}</p>
          </div>
          <div className="profile-badges">
            <div className="profile-badge" style={{ background: '#eef2ff', color: '#6366f1' }}>
              <strong>{avgMarks}%</strong><span>Avg Marks</span>
            </div>
            <div className="profile-badge" style={{ background: '#ecfdf5', color: '#10b981' }}>
              <strong>{avgAtt}%</strong><span>Attendance</span>
            </div>
            <div className="profile-badge" style={{ background: '#fffbeb', color: '#f59e0b' }}>
              <strong>{grade}</strong><span>Grade</span>
            </div>
          </div>
        </div>
      </div>

      {/* Details + Marks + Attendance */}
      <div className="profile-grid">

        {/* Personal Info */}
        <div className="db-panel">
          <div className="db-panel-hdr"><h3>Personal Information</h3></div>
          <div className="profile-detail-list">
            {[
              { label: 'Full Name',    value: student.name },
              { label: 'Email',        value: student.email },
              { label: 'Phone',        value: student.phone || '—' },
              { label: 'Course',       value: student.course },
              { label: 'Age',          value: student.age || '—' },
              { label: 'Student ID',   value: student._id?.slice(-8).toUpperCase() },
              { label: 'Joined',       value: student.createdAt ? new Date(student.createdAt).toLocaleDateString('en-IN') : '—' },
              { label: 'Status',       value: 'Active' },
            ].map(({ label, value }) => (
              <div className="profile-detail-row" key={label}>
                <span className="profile-detail-label">{label}</span>
                <span className="profile-detail-value">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Marks */}
        <div className="db-panel">
          <div className="db-panel-hdr"><h3>Subject Marks</h3></div>
          <div className="profile-marks-list">
            {SUBJECTS.map((sub, i) => (
              <div className="profile-mark-row" key={sub}>
                <span className="profile-mark-subject">{sub}</span>
                <div className="profile-mark-bar-wrap">
                  <div className="profile-mark-bar"
                    style={{ width: `${MARKS[i]}%`, background: MARKS[i] >= 80 ? '#10b981' : MARKS[i] >= 60 ? '#f59e0b' : '#ef4444' }} />
                </div>
                <span className="profile-mark-val">{MARKS[i]}%</span>
              </div>
            ))}
          </div>
          <div className="profile-avg-row">
            <span>Overall Average</span>
            <strong style={{ color: '#6366f1', fontSize: '18px' }}>{avgMarks}% — {grade}</strong>
          </div>
        </div>

        {/* Attendance */}
        <div className="db-panel">
          <div className="db-panel-hdr"><h3>Attendance Summary</h3></div>
          <div className="profile-att-grid">
            {SUBJECTS.map((sub, i) => (
              <div className="profile-att-item" key={sub}>
                <CircularProgress pct={ATT[i]} size={72} stroke={6} />
                <div className="att-subject">{sub}</div>
              </div>
            ))}
          </div>
          <div className="profile-avg-row">
            <span>Overall Attendance</span>
            <strong style={{ color: '#10b981', fontSize: '18px' }}>{avgAtt}%</strong>
          </div>
        </div>

      </div>
    </div>
  );
}
