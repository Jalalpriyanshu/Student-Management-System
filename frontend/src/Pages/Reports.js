import React, { useEffect, useState, useCallback } from 'react';
import API from '../utils/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
  Area, AreaChart,
} from 'recharts';

/* ── colour palette ─────────────────────────────────────── */
const COLORS = ['#6366f1','#0ea5e9','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#14b8a6'];

/* ── helpers ─────────────────────────────────────────────── */
const avg = (arr) => arr.length ? Math.round(arr.reduce((s, v) => s + v, 0) / arr.length) : 0;

const buildAgeGroups = (students) => {
  const groups = { '< 18': 0, '18–21': 0, '22–25': 0, '26–30': 0, '30+': 0 };
  students.forEach(({ age }) => {
    if (!age) return;
    if (age < 18)       groups['< 18']++;
    else if (age <= 21) groups['18–21']++;
    else if (age <= 25) groups['22–25']++;
    else if (age <= 30) groups['26–30']++;
    else                groups['30+']++;
  });
  return Object.entries(groups).map(([name, value]) => ({ name, value }));
};

const buildMonthlyTrend = (students) => {
  const map = {};
  students.forEach(({ createdAt }) => {
    if (!createdAt) return;
    const d = new Date(createdAt);
    const key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
    map[key] = (map[key] || 0) + 1;
  });
  // keep last 8 months
  return Object.entries(map).slice(-8).map(([month, count]) => ({ month, count }));
};

/* ── custom tooltip ──────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rpt-tooltip">
      <p className="rpt-tooltip-label">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || p.fill }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

/* ── stat card ───────────────────────────────────────────── */
const StatCard = ({ label, value, icon, color, bg, suffix = '' }) => (
  <div className="rpt-stat-card" style={{ '--c': color, '--bg': bg }}>
    <div className="rpt-stat-icon" style={{ background: bg, color }}>{icon}</div>
    <div>
      <div className="rpt-stat-value">{value}{suffix}</div>
      <div className="rpt-stat-label">{label}</div>
    </div>
    <div className="rpt-stat-bar" style={{ background: color }} />
  </div>
);

/* ── SVG icons ───────────────────────────────────────────── */
const Icon = {
  students: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  courses:  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  age:      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  trend:    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  refresh:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
};

/* ── main component ──────────────────────────────────────── */
export default function Reports() {
  const [students, setStudents] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  const fetchAll = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await API.get('/api/students/all?limit=1000');
      setStudents(res.data.students || res.data);
    } catch {
      setError('Failed to load student data. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = 'Reports | SMS';
    fetchAll();
  }, [fetchAll]);

  /* ── derived data ──────────────────────────────────────── */
  const courseMap = {};
  students.forEach(({ course }) => { if (course) courseMap[course] = (courseMap[course] || 0) + 1; });
  const courseData  = Object.entries(courseMap).map(([name, value]) => ({ name, value }));
  const ageGroups   = buildAgeGroups(students);
  const monthlyData = buildMonthlyTrend(students);
  const ages        = students.map(s => s.age).filter(Boolean);
  const uniqueCourses = Object.keys(courseMap).length;

  /* ── loading / error states ────────────────────────────── */
  if (loading) return (
    <div className="rpt-center">
      <div className="rpt-spinner-lg" />
      <p>Loading analytics…</p>
    </div>
  );

  if (error) return (
    <div className="rpt-center">
      <div className="rpt-error-box">
        <p>{error}</p>
        <button className="rpt-retry-btn" onClick={fetchAll}>Retry</button>
      </div>
    </div>
  );

  /* ── render ────────────────────────────────────────────── */
  return (
    <div className="rpt-wrapper">

      {/* Header */}
      <div className="rpt-header">
        <div>
          <h2>Analytics &amp; Reports</h2>
          <p>Live insights from your student database</p>
        </div>
        <button className="rpt-refresh-btn" onClick={fetchAll}>
          {Icon.refresh} Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="rpt-stat-grid">
        <StatCard label="Total Students"  value={students.length} icon={Icon.students} color="#6366f1" bg="#eef2ff" />
        <StatCard label="Total Courses"   value={uniqueCourses}   icon={Icon.courses}  color="#0ea5e9" bg="#f0f9ff" />
        <StatCard label="Average Age"     value={avg(ages) || '—'} icon={Icon.age}     color="#f59e0b" bg="#fffbeb" />
        <StatCard label="Enrolled (mo.)"  value={monthlyData.at(-1)?.count ?? 0} icon={Icon.trend} color="#10b981" bg="#ecfdf5" />
      </div>

      {/* Charts grid */}
      <div className="rpt-charts-grid">

        {/* Bar — students per course */}
        <div className="rpt-chart-card rpt-span-2">
          <div className="rpt-chart-header">
            <div>
              <h3>Students per Course</h3>
              <p>Enrollment distribution across all courses</p>
            </div>
          </div>
          {courseData.length === 0 ? <div className="rpt-no-data">No course data available.</div> : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={courseData} margin={{ top: 10, right: 10, left: -10, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} angle={-35} textAnchor="end" interval={0} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Students" radius={[6, 6, 0, 0]}>
                  {courseData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie — course share */}
        <div className="rpt-chart-card">
          <div className="rpt-chart-header">
            <div>
              <h3>Course Share</h3>
              <p>Proportional breakdown by course</p>
            </div>
          </div>
          {courseData.length === 0 ? <div className="rpt-no-data">No data.</div> : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={courseData} dataKey="value" nameKey="name" cx="50%" cy="45%"
                  outerRadius={90} innerRadius={45} paddingAngle={3} label={({ name, percent }) =>
                    percent > 0.05 ? `${Math.round(percent * 100)}%` : ''}>
                  {courseData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Bar — age distribution */}
        <div className="rpt-chart-card">
          <div className="rpt-chart-header">
            <div>
              <h3>Age Distribution</h3>
              <p>Students grouped by age range</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={ageGroups} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="Students" radius={[6, 6, 0, 0]}>
                {ageGroups.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Area — monthly enrollment trend */}
        <div className="rpt-chart-card rpt-span-2">
          <div className="rpt-chart-header">
            <div>
              <h3>Monthly Enrollment Trend</h3>
              <p>Number of students registered per month</p>
            </div>
          </div>
          {monthlyData.length === 0 ? <div className="rpt-no-data">Not enough data to show trend.</div> : (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="count" name="Enrollments"
                  stroke="#6366f1" strokeWidth={2.5} fill="url(#areaGrad)" dot={{ r: 4, fill: '#6366f1' }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Course summary table */}
        <div className="rpt-chart-card">
          <div className="rpt-chart-header">
            <div><h3>Course Summary</h3><p>Enrollment count per course</p></div>
          </div>
          {courseData.length === 0 ? <div className="rpt-no-data">No data.</div> : (
            <div className="rpt-table-wrap">
              <table className="rpt-table">
                <thead>
                  <tr><th>#</th><th>Course</th><th>Students</th><th>Share</th></tr>
                </thead>
                <tbody>
                  {courseData.sort((a, b) => b.value - a.value).map((row, i) => (
                    <tr key={i}>
                      <td><span className="rpt-dot" style={{ background: COLORS[i % COLORS.length] }} /></td>
                      <td>{row.name}</td>
                      <td><strong>{row.value}</strong></td>
                      <td>
                        <div className="rpt-mini-bar-wrap">
                          <div className="rpt-mini-bar"
                            style={{ width: `${Math.round((row.value / students.length) * 100)}%`,
                              background: COLORS[i % COLORS.length] }} />
                          <span>{Math.round((row.value / students.length) * 100)}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
